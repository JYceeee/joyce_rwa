// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/* ========= 外部接口（与项目其余合约保持一致的最小集） ========= */
interface IComplianceGuard {
    // 利息代币收/转的合规检查；应在 Guard 内处理白名单、冻结、过期、制裁等逻辑
    function checkInterest(address from, address to) external view;
}

interface IHolderRegistry {
    // 自动入册：只增不删，用于计息遍历
    function register(address to) external;
}

/* ========= 利息代币（18位，小数），OZ v5 =========
 * - 仅 manager 可 mint/burn（通常设置为 AccrualModule）
 * - 转账钩子：_update（v5）里先合规检查，再自动入册
 */
contract LInterest is ERC20, Ownable {
    IComplianceGuard public guard;
    IHolderRegistry public registry;
    address public manager;

    uint8 private constant _DECIMALS = 18;

    event GuardSet(address indexed guard);
    event RegistrySet(address indexed registry);
    event ManagerSet(address indexed manager);

    constructor(
        string memory name_,
        string memory symbol_,
        address owner_
    ) ERC20(name_, symbol_) Ownable(owner_) {}

    /* ---------- 基础参数 ---------- */

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    /* ---------- 管理员配置 ---------- */

    function setGuard(address g) external onlyOwner {
        guard = IComplianceGuard(g);
        emit GuardSet(g);
    }

    function setRegistry(address r) external onlyOwner {
        registry = IHolderRegistry(r);
        emit RegistrySet(r);
    }

    function setManager(address m) external onlyOwner {
        manager = m;
        emit ManagerSet(m);
    }

    modifier onlyManager() {
        require(msg.sender == manager, "!manager");
        _;
    }

    /* ---------- 铸/销（仅 manager） ---------- */

    /// @notice 由计息模块按应计铸造利息
    function mint(address to, uint256 amount18) external onlyManager {
        _mint(to, amount18);
    }

    /// @notice 如需回滚或更正，可由计息模块销毁
    function burnFrom(address from, uint256 amount18) external onlyManager {
        _burn(from, amount18);
    }

    /* ---------- 转账钩子（OZ v5） ----------
     * v5 使用 _update 替代 _beforeTokenTransfer / _afterTokenTransfer。
     * 这里在 super._update 前做合规检查，在后做自动入册。
     * - 铸币：from=address(0)，to=接收者（会走检查和入册）
     * - 转账：from!=0 && to!=0（会走检查和入册）
     * - 销毁：to=address(0)（跳过检查与入册）
     */
    function _update(address from, address to, uint256 value) internal override {
        // 合规检查：仅在不是销毁时检查“接收方是否可接收利息代币”
        if (to != address(0) && address(guard) != address(0)) {
            guard.checkInterest(from, to);
        }

        // 先更新余额/总量
        super._update(from, to, value);

        // 自动入册：仅在不是销毁时登记，失败不影响主流程
        if (to != address(0) && address(registry) != address(0)) {
            try registry.register(to) {} catch {}
        }
    }
}
