// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/* =========================
   ExchangeModule.sol
   - 申购/赎回：支持两种门槛模式
     1) CalendarDays（默认）：自然日 T+N（N=1 为次日，N=2 为“隔一天”）
     2) Period：按计息期号 T+1（与 AccrualModule 的 mode 对齐）
   - 合规 + SafeERC20 + 禁救 USDT + 重入保护
   ========================= */

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IAccrualMin {
    function lastAccruedPeriodView() external view returns (uint32);
    function interestComplete() external view returns (bool);
}

interface IPrincipalE {
    function mint(address to, uint256 amount6) external;
    function burnFrom(address from, uint256 amount6) external;
}

interface IComplianceGuardE {
    function canReceivePrincipal(address a) external view returns (bool);
    function canRedeem(address a) external view returns (bool);
}

contract ExchangeModule is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdt;
    IPrincipalE public principal;
    IComplianceGuardE public guard;
    IAccrualMin public accrual;

    uint16 public buyFeeBps;        // 申购费
    uint16 public redeemFeeBps;     // 赎回费
    address public feeRecipient;
    bool    public requireInterestDone;

    // 赎回门槛模式
    enum RedeemGate { Period, CalendarDays }
    RedeemGate public redeemGate = RedeemGate.CalendarDays; // 默认：按自然日
    uint32 public redeemDelayDays = 1;  // T+N 的 N（1=次日，2=隔一天）
    int32  public tzOffsetSeconds = 0;  // 可选：自然日计算的时区偏移（默认 UTC=0；AEST 可设 +36000）

    struct Pending {
        uint256 amount6;
        uint32  availableAfterDay;     // CalendarDays 模式使用
        uint32  availableAfterPeriod;  // Period 模式使用（与计息期号一致）
    }
    mapping(address => Pending) public pendings;

    event DepositUSDT(address indexed user, uint256 amount6, uint256 fee6, uint256 net6);
    event ApplyRedeem(address indexed user, uint256 amount6, uint32 gateValue);
    event ProcessRedeem(address indexed user, uint256 gross6, uint256 fee6, uint256 pay6);

    constructor(address usdt_, address owner_) Ownable(owner_) {
        require(usdt_ != address(0), "usdt=0");
        usdt = IERC20(usdt_);
    }

    /* ---------- 布线 ---------- */
    function wire(
        address principal_,
        address guard_,
        address accrual_,
        address feeRecipient_
    ) external onlyOwner {
        principal = IPrincipalE(principal_);
        guard = IComplianceGuardE(guard_);
        accrual = IAccrualMin(accrual_);
        feeRecipient = feeRecipient_;
    }

    /* ---------- 参数 ---------- */
    function setFees(uint16 buyBps, uint16 redeemBps) external onlyOwner {
        require(buyBps <= 2000 && redeemBps <= 2000, "fee too high");
        buyFeeBps = buyBps;
        redeemFeeBps = redeemBps;
    }

    function setRequireInterestDone(bool v) external onlyOwner { requireInterestDone = v; }

    function setRedeemGate(RedeemGate g) external onlyOwner { redeemGate = g; }

    function setRedeemDelayDays(uint32 d) external onlyOwner {
        require(d >= 1 && d <= 7, "bad d");
        redeemDelayDays = d;
    }

    function setTzOffsetSeconds(int32 s) external onlyOwner {
        // 允许 [-14h, +14h]，覆盖全球时区
        require(s >= -50400 && s <= 50400, "bad tz");
        tzOffsetSeconds = s;
    }

    /* ---------- 自然日索引（含可选时区偏移） ---------- */
    function _dayIndex(uint256 ts) internal view returns (uint32) {
        int256 adj = int256(ts) + int256(tzOffsetSeconds);
        if (adj < 0) adj = 0;
        return uint32(uint256(adj) / 1 days);
    }

    /* ---------- 申购 ---------- */
    function depositUSDT(uint256 amount6) external nonReentrant {
        require(amount6 > 0, "amount=0");
        require(guard.canReceivePrincipal(msg.sender), "kyc");

        usdt.safeTransferFrom(msg.sender, address(this), amount6);
        uint256 fee6 = (amount6 * buyFeeBps) / 10_000;
        uint256 net6 = amount6 - fee6;
        if (fee6 > 0) usdt.safeTransfer(feeRecipient, fee6);

        principal.mint(msg.sender, net6);
        emit DepositUSDT(msg.sender, amount6, fee6, net6);
    }

    /* ---------- 赎回申请（T+N or T+1） ---------- */
    function applyRedeem(uint256 amount6) external nonReentrant {
        require(amount6 > 0, "amount=0");
        if (requireInterestDone) {
            require(accrual.interestComplete(), "not finished");
        }
        // 赎回前合规复核
        require(guard.canReceivePrincipal(msg.sender) && guard.canRedeem(msg.sender), "kyc/redeem blocked");

        principal.burnFrom(msg.sender, amount6);

        Pending storage p = pendings[msg.sender];
        uint32 gate;
        if (redeemGate == RedeemGate.CalendarDays) {
            // 自然日 T+N
            gate = _dayIndex(block.timestamp) + redeemDelayDays;
            if (p.availableAfterDay == 0 || p.availableAfterDay < gate) p.availableAfterDay = gate;
        } else {
            // 计息期号 T+1
            gate = accrual.lastAccruedPeriodView() + 1;
            if (p.availableAfterPeriod == 0 || p.availableAfterPeriod < gate) p.availableAfterPeriod = gate;
        }

        p.amount6 += amount6;
        emit ApplyRedeem(msg.sender, amount6, gate);
    }

    /* ---------- 赎回处理 ---------- */
    function processRedeem(address user) external onlyOwner nonReentrant {
        Pending storage p = pendings[user];
        uint256 amount6 = p.amount6;
        require(amount6 > 0, "none");

        if (redeemGate == RedeemGate.CalendarDays) {
            uint32 today = _dayIndex(block.timestamp);
            require(today >= p.availableAfterDay, "T+N days");
        } else {
            require(accrual.lastAccruedPeriodView() >= p.availableAfterPeriod, "T+1 period");
        }

        p.amount6 = 0;
        p.availableAfterDay = 0;
        p.availableAfterPeriod = 0;

        uint256 fee6 = (amount6 * redeemFeeBps) / 10_000;
        uint256 pay6 = amount6 - fee6;
        if (fee6 > 0) usdt.safeTransfer(feeRecipient, fee6);
        usdt.safeTransfer(user, pay6);

        emit ProcessRedeem(user, amount6, fee6, pay6);
    }

    /* ---------- 资产救援（禁止 USDT） ---------- */
    function rescueToken(address token, address to, uint256 amount) external onlyOwner {
        require(token != address(usdt), "cannot rescue USDT");
        IERC20(token).safeTransfer(to, amount);
    }
}
