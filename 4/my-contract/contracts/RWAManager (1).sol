// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISetGuard { function setGuard(address g) external; }
interface ISetRegistry { function setRegistry(address r) external; }
interface ILISetMgr { function setManager(address m) external; }
interface IAccrualWire { function wire(address lp,address li,address reg) external; }
interface IRegAllow { function setAllowed(address c,bool v) external; }

contract RWAManager {
    address public owner;
    event OwnerChanged(address indexed prev,address indexed next);

    modifier onlyOwner(){ require(msg.sender==owner,"onlyOwner"); _; }
    constructor(){ owner=msg.sender; emit OwnerChanged(address(0),msg.sender); }
    function transferOwnership(address n) external onlyOwner { require(n!=address(0),"bad"); emit OwnerChanged(owner,n); owner=n; }

    function wire(
        address guard,
        address registry,
        address lp,
        address li,
        address accrual,
        address ex
    ) external onlyOwner {
        // token -> guard & registry
        ISetGuard(lp).setGuard(guard); ISetRegistry(lp).setRegistry(registry);
        ISetGuard(li).setGuard(guard); ISetRegistry(li).setRegistry(registry);
        // interest manager
        ILISetMgr(li).setManager(accrual);
        // accrual wire
        IAccrualWire(accrual).wire(lp, li, registry);
        // registry allow callers
        IRegAllow(registry).setAllowed(lp, true);
        IRegAllow(registry).setAllowed(li, true);
        IRegAllow(registry).setAllowed(accrual, true);
        IRegAllow(registry).setAllowed(ex, true);
    }
}
