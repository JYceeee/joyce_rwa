// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// 合规接口（与原套件一致，精简）
interface IComplianceGuard {
    function checkPrincipal(address from, address to) external view;
}
interface IHolderRegistry {
    function register(address to) external;
}

contract LPrincipalFixed is ERC20, Ownable {
    IComplianceGuard public guard;
    IHolderRegistry public registry;

    uint8 private constant _DECIMALS = 6;

    event GuardSet(address indexed guard);
    event RegistrySet(address indexed registry);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply6, // 例如 1_000_000 * 1e6
        address supplyReceiver, // 初始库存接收方（可先给 owner，部署后再转到 Exchange）
        address owner_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        require(supplyReceiver != address(0), "supplyReceiver=0");
        _mint(supplyReceiver, initialSupply6);
    }

    function decimals() public pure override returns (uint8) { return _DECIMALS; }

    // 设置合规与名册
    function setGuard(address g) external onlyOwner {
        guard = IComplianceGuard(g);
        emit GuardSet(g);
    }

    function setRegistry(address r) external onlyOwner {
        registry = IHolderRegistry(r);
        emit RegistrySet(r);
    }

    // OZ v5：_update 钩子（合规在前、登记在后）
    function _update(address from, address to, uint256 value) internal override {
        if (to != address(0) && address(guard) != address(0)) {
            guard.checkPrincipal(from, to);
        }
        super._update(from, to, value);
        if (to != address(0) && address(registry) != address(0)) {
            // 自动入册（失败不中断）
            try registry.register(to) {} catch {}
        }
    }

    // ❌ 不提供 mint/burn 接口；总量就是初始铸造量
}
