// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./ERC20Base.sol";

contract LInterest is ERC20Hooked {
    address public manager; // AccrualModule
    event ManagerSet(address indexed m);

    constructor(string memory n,string memory s)
        ERC20Hooked(n,s,18,false) {} // principal=false

    function setManager(address m) external onlyOwner { manager=m; emit ManagerSet(m); }

    function mintByManager(address to,uint256 amount) external {
        require(msg.sender==manager,"not-manager"); _mint(to,amount);
    }
    function burnByManager(address from,uint256 amount) external {
        require(msg.sender==manager,"not-manager"); _burn(from,amount);
    }
}
