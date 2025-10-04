// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// 你的基座文件叫什么就引什么（二选一，只留一个）：
// import "./ERC20Base.sol";
import "./ERC20Base.sol"; // 如果你的工作区里是 Base.sol，请用这一行；否则用上面那行。

/* ──────────────────────────────────────────────────────────────────────────────
 *  本地“别名接口”，避免与基座里可能存在的 IGuard/IGuardRedeem 重名
 * ──────────────────────────────────────────────────────────────────────────────*/
interface IGuardLike {
    /// @dev 对“接收本金”的账户做合规检查（KYC/制裁/冻结等）。from/to 语义：检查用户接收本金时可传 (from=address(0), to=user)
    function checkPrincipal(address from, address to) external view;
}

interface IGuardRedeemLike {
    /// @dev 对“赎回”的账户做合规检查（KYC/制裁/冻结等）
    function checkRedeem(address user) external view;
}

/**
 * @title ExchangeModule
 * @notice USDT <-> LP 的申购/赎回中枢（LP 不增发，EX 仅从库存发放/回收）：
 *  - depositUSDT：用户 USDT -> EX；EX 从库存发 LP 给用户（扣申购费）；
 *  - applyRedeem：用户 LP -> EX；登记 T+N（默认 T+1），到期 owner 兑付 USDT（扣赎回费）；
 *  - 合规：guard（背后接 KYC 中枢）在入口检查；
 *  - 安全：禁止救援 USDT。
 *
 * 约定：USDT 与 LP 皆 6 位小数。
 */
contract ExchangeModule is Ownable, ReentrancyGuard {
    using SafeTransferLib for address;

    /*──────────────────── 状态 ────────────────────*/

    /// @notice USDT（6 位小数，不可变）
    address public immutable usdt;

    /// @notice LPrincipal（6 位小数，ERC20 兼容）
    address public principal;

    /// @notice 合规卫士（KYC/制裁/冻结等由其统一管理）
    address public guard;

    /// @notice 申购&赎回费率（万分比），以及费用接收人
    uint16 public buyFeeBps;       // 申购费：USDT -> LP
    uint16 public redeemFeeBps;    // 赎回费：LP   -> USDT
    address public feeRecipient;   // 费用接收地址

    /// @notice 赎回冷却（T+N，按日历天计）
    uint32 public redeemDelayDays = 1; // 默认 T+1

    /// @notice 用户赎回登记
    struct Pending {
        uint128 amount6;           // 待兑付 USDT “6位”金额
        uint32  availableAfterDay; // 可领取日（dayIndex）
    }
    mapping(address => Pending) public pendings;

    /*──────────────────── 事件 ────────────────────*/

    event SetAddrs(address usdt, address lp, address guard, address feeTo);
    event SetFees(uint16 buyBps, uint16 redeemBps);
    event SetRedeemDelay(uint32 daysDelay);

    event Deposit(address indexed user, uint256 usdt6, uint256 lp6, uint256 fee6);
    event ApplyRedeem(address indexed user, uint256 lp6, uint32 availableDay);
    event ProcessRedeem(address indexed user, uint256 usdt6, uint256 fee6);

    /*──────────────────── 构造 ────────────────────*/

    constructor(address usdt_) {
        require(usdt_ != address(0), "usdt=0");
        usdt = usdt_;
        feeRecipient = msg.sender;
    }

    /*──────────────────── 管理配置 ────────────────────*/

    /// @notice 绑定 LP / 合规卫士 / 费用接收地址
    function setAddrs(address lp, address guard_, address feeTo) external onlyOwner {
        require(lp != address(0) && guard_ != address(0) && feeTo != address(0), "zero-addr");
        principal = lp;
        guard = guard_;
        feeRecipient = feeTo;
        emit SetAddrs(usdt, lp, guard_, feeTo);
    }

    /// @notice 设置申购/赎回费率（上限 10000=100%）
    function setFees(uint16 buyBps, uint16 redeemBps) external onlyOwner {
        require(buyBps <= 10_000 && redeemBps <= 10_000, "bps>100%");
        buyFeeBps = buyBps;
        redeemFeeBps = redeemBps;
        emit SetFees(buyBps, redeemBps);
    }

    /// @notice 设置赎回等待天数（可设为 0=当日可提，不建议）
    function setRedeemDelayDays(uint32 d) external onlyOwner {
        redeemDelayDays = d;
        emit SetRedeemDelay(d);
    }

    /*──────────────────── 业务流程 ────────────────────*/

    /**
     * @dev 申购：用户 USDT -> LP
     * 用户需先对 EX 做 USDT 的 approve。EX 收到 USDT 后按费率扣费，再从“自身 LP 库存”发 LP 给用户。
     */
    function depositUSDT(uint256 amount6) external nonReentrant {
        require(amount6 > 0, "amount=0");
        require(guard != address(0) && principal != address(0), "not-wired");

        // 合规：对“接收本金”的用户进行检查（KYC/制裁/冻结等）
        IGuardLike(guard).checkPrincipal(address(0), msg.sender);

        // 收 USDT
        usdt.safeTransferFrom(msg.sender, address(this), amount6);

        // 计算并分发手续费
        uint256 fee = buyFeeBps == 0 ? 0 : (amount6 * buyFeeBps) / 10_000;
        if (fee > 0 && feeRecipient != address(0)) {
            usdt.safeTransfer(feeRecipient, fee);
        }

        // 净额 -> 从 EX 库存发 LP 给用户
        uint256 net = amount6 - fee;

        // 确认库存足够（无需 IERC20 类型，使用最小只读调用）
        require(_lpBalance() >= net, "lp/insufficient");

        // 发 LP 给用户
        principal.safeTransfer(msg.sender, net);

        emit Deposit(msg.sender, amount6, net, fee);
    }

    /**
     * @dev 申请赎回：用户 LP -> USDT
     * 用户需先对 EX 做 LP 的 approve。LP 打回 EX 后，登记 T+N，到期由 owner 兑付 USDT。
     */
    function applyRedeem(uint256 amount6) external nonReentrant {
        require(amount6 > 0, "amount=0");
        require(guard != address(0) && principal != address(0), "not-wired");

        // 合规：赎回资格检查（KYC/制裁/冻结等）
        IGuardRedeemLike(guard).checkRedeem(msg.sender);

        // 收 LP（使用 SafeTransferLib，不依赖 IERC20）
        principal.safeTransferFrom(msg.sender, address(this), amount6);

        // 登记赎回
        uint32 unlockDay = _dayNow() + redeemDelayDays;
        Pending storage p = pendings[msg.sender];
        p.amount6 += uint128(amount6);
        p.availableAfterDay = unlockDay;

        emit ApplyRedeem(msg.sender, amount6, unlockDay);
    }

    /**
     * @dev 到期兑付：仅 owner 调用。兑付“待释放 USDT”给用户（扣除赎回费），LP 留在 EX（按运营策略另行处理）。
     */
    function processRedeem(address user) external onlyOwner nonReentrant {
        Pending storage p = pendings[user];
        require(p.amount6 > 0, "no-pending");
        require(_dayNow() >= p.availableAfterDay, "not-ready");

        uint256 amt = p.amount6;
        p.amount6 = 0; // 清零防重入

        uint256 fee = redeemFeeBps == 0 ? 0 : (amt * redeemFeeBps) / 10_000;

        // 兑付 USDT
        usdt.safeTransfer(user, amt - fee);
        if (fee > 0 && feeRecipient != address(0)) {
            usdt.safeTransfer(feeRecipient, fee);
        }

        emit ProcessRedeem(user, amt - fee, fee);
    }

    /*──────────────────── 安全运维 ────────────────────*/

    /**
     * @dev 禁止救援 USDT，避免绕过赎回流程；仅允许救援其它误转代币。
     */
    function rescueToken(address token, address to, uint256 amount) external onlyOwner {
        require(token != usdt, "no-usdt");
        token.safeTransfer(to, amount);
    }

    /*──────────────────── 内部工具 ────────────────────*/

    function _dayNow() internal view returns (uint32) {
        return uint32(block.timestamp / 1 days);
    }

    /// @dev 读取 EX 持有的 LP 余额（最小只读调用，避免引入 IERC20 类型）
    function _lpBalance() internal view returns (uint256 bal) {
        (bool ok, bytes memory data) = principal.staticcall(
            abi.encodeWithSelector(bytes4(keccak256("balanceOf(address)")), address(this))
        );
        require(ok && data.length >= 32, "lp/balanceOf-call");
        assembly {
            bal := mload(add(data, 0x20))
        }
    }
}
