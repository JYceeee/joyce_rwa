// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/* =========================================================
 *                   External Dependencies
 *    (Top-level interfaces — do NOT put them inside contract)
 * =======================================================*/

interface IPrincipalView {
    function totalSupply() external view returns (uint256);
    function balanceOf(address) external view returns (uint256);
    // decimals assumed 6
}

interface IInterest {
    function mintByManager(address to, uint256 amount) external;
}

interface IRegistryView {
    function holderCount() external view returns (uint256);
    function holders(uint256) external view returns (address);
}

interface IGuard {
    // 合规：在向 to 铸息前做检查；不通过应 revert
    function checkInterest(address from, address to) external view;
}

/* =========================================================
 *                     AccrualModule (Monthly)
 *  - Locks mode to Month at first accrue
 *  - Distributes interest monthly by principal balances
 *  - Two annual rates: normal (annualBps) / late (lateAnnualBps)
 *  - Optional Guard gating before mint
 *  - Iterates holders via HolderRegistry
 *  - monthIndex = year*12 + month (e.g., 2025*12 + 10 = 24310)
 * =======================================================*/
contract AccrualModule {
    /* ---------------- Ownership / Admin ---------------- */
    address public owner;
    mapping(address => bool) public operator;

    event OwnerChanged(address indexed prev, address indexed next);
    event OperatorSet(address indexed op, bool allowed);

    modifier onlyOwner() {
        require(msg.sender == owner, "onlyOwner");
        _;
    }
    modifier onlyAdmin() {
        require(msg.sender == owner || operator[msg.sender], "not-admin");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnerChanged(address(0), msg.sender);
        // sensible defaults
        annualBps = 990;      // 9.90%
        lateAnnualBps = 1800; // 18.00%
    }

    function transferOwnership(address n) external onlyOwner {
        require(n != address(0), "bad-owner");
        emit OwnerChanged(owner, n);
        owner = n;
    }

    function setOperator(address op, bool allowed) external onlyOwner {
        operator[op] = allowed;
        emit OperatorSet(op, allowed);
    }

    /* ---------------- Reentrancy Guard (local) ---------------- */
    uint256 private _entered;
    modifier nonReentrant() {
        require(_entered == 0, "reentrant");
        _entered = 1;
        _;
        _entered = 0;
    }

    /* -------------- External Wiring / Addresses -------------- */
    address public principal; // LPrincipalFixed (6 decimals)
    address public interest;  // LInterest (18 decimals)
    address public registry;  // HolderRegistry
    address public guard;     // ComplianceGuard (optional)

    event Wired(address lp, address li, address reg);
    event GuardSet(address guard);

    function wire(address lp, address li, address reg) external onlyOwner {
        require(lp != address(0) && li != address(0) && reg != address(0), "zero");
        principal = lp;
        interest  = li;
        registry  = reg;
        emit Wired(lp, li, reg);
    }

    function setGuard(address g) external onlyOwner {
        guard = g;
        emit GuardSet(g);
    }

    /* ------------------ Modes / Period / Rates ----------------- */
    enum Mode { None, Hour, Day, Month }
    Mode   public mode;                // 首次计息锁定为 Month
    uint32 public lastAccruedPeriod;   // Month: year*12 + month
    int32  public tzOffsetSeconds;     // 仅用于报表标注（不参与链上月份计算）

    // 年化：990 = 9.90%，1800 = 18.00%
    uint16 public annualBps;
    uint16 public lateAnnualBps;

// ---- Events ----
event ModeLocked(Mode mode);
event Accrued(uint32 periodIndex, uint256 totalInterestMinted);
event RatesChanged(uint16 annualBps, uint16 lateAnnualBps);
event TZOffsetSet(int32 tzOffset); // ← 形参名不要用 seconds

function setRates(uint16 _annualBps, uint16 _lateAnnualBps) external onlyOwner {
    annualBps = _annualBps;
    lateAnnualBps = _lateAnnualBps;
    emit RatesChanged(_annualBps, _lateAnnualBps);
}

function setTzOffsetSeconds(int32 s) external onlyOwner {
    tzOffsetSeconds = s;
    emit TZOffsetSet(s); // 与事件签名类型匹配即可
}


    /* -------------------- Late flags (per holder) -------------------- */
    mapping(address => bool) public isLate;
    event LateSet(address indexed user, bool late);

    function setLate(address user, bool late_) external onlyAdmin {
        isLate[user] = late_;
        emit LateSet(user, late_);
    }

    function batchSetLate(address[] calldata users, bool[] calldata lateVals) external onlyAdmin {
        require(users.length == lateVals.length, "len");
        for (uint256 i = 0; i < users.length; i++) {
            isLate[users[i]] = lateVals[i];
            emit LateSet(users[i], lateVals[i]);
        }
    }

    /* ---------------------- Accrual (Monthly) ---------------------- */

    /**
     * @notice Accrue interest for a specific month.
     *         `monthIndex` = year*12 + month (e.g., 2025*12 + 10 = 24310).
     *         首次调用会把 mode 锁为 Month；同月重复调用会被拒绝。
     */
    function accrueForMonth(uint32 monthIndex) external onlyOwner nonReentrant {
        // 锁定模式
        if (mode == Mode.None) {
            mode = Mode.Month;
            emit ModeLocked(mode);
        } else {
            require(mode == Mode.Month, "mode locked to Month");
        }
        require(monthIndex > lastAccruedPeriod, "already accrued");

        // 月度 bps
        uint16 normalBps = uint16(uint256(annualBps) / 12);
        uint16 lateBps   = uint16(uint256(lateAnnualBps) / 12);

        // 总供应为 0 则推进 period 即可
        uint256 ts = IPrincipalView(principal).totalSupply();
        if (ts == 0) {
            lastAccruedPeriod = monthIndex;
            emit Accrued(monthIndex, 0);
            return;
        }

        // 遍历登记持有人
        uint256 n = IRegistryView(registry).holderCount();
        uint256 totalMint;

        for (uint256 i = 0; i < n; i++) {
            address h = IRegistryView(registry).holders(i);
            if (h == address(0)) continue;

            uint256 bal6 = IPrincipalView(principal).balanceOf(h);
            if (bal6 == 0) continue;

            // 可选合规：不通过则跳过（不让整笔失败）
            if (guard != address(0)) {
                try IGuard(guard).checkInterest(address(0), h) { /* ok */ }
                catch { continue; }
            }

            // 按是否逾期选择当月 bps
            uint16 bps = isLate[h] ? lateBps : normalBps;

            // 6位本金 -> 18位利息： mint18 = bal6 * 1e12 * bps / 10000
            uint256 mint18 = (bal6 * 1e12 * bps) / 10000;
            if (mint18 > 0) {
                IInterest(interest).mintByManager(h, mint18);
                totalMint += mint18;
            }
        }

        lastAccruedPeriod = monthIndex;
        emit Accrued(monthIndex, totalMint);
    }

    /* ------- 明确禁用非月度接口，防误操作（保留编译占位） ------- */
    function accrueForDay(uint32 /*dayIndex*/) external pure {
        revert("mode locked to Month");
    }
    function accrueForHour(uint32 /*hourIndex*/) external pure {
        revert("mode locked to Month");
    }
}