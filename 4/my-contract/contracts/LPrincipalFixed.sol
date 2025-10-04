// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./ERC20Base.sol";

contract LPrincipalFixed is ERC20Hooked {
    constructor(string memory n,string memory s,uint256 initialSupply6)
        ERC20Hooked(n,s,6,true) // principal=true
    {
        if (initialSupply6>0) { _mint(msg.sender, initialSupply6); } // 预铸到部署者，随后转到 EX
    }
    // 管理铸造开关（若你要彻底固定，可移除此函数并仅依赖构造预铸）
    bool public mintLocked;
    function lockMint() external onlyOwner { mintLocked=true; }
    function mint(address to,uint256 amount6) external onlyOwner { require(!mintLocked,"locked"); _mint(to,amount6); }
    function burnFrom(address from,uint256 amount6) external {
        require(msg.sender==owner || allowance[from][msg.sender]>=amount6, "auth");
        if (msg.sender!=owner) allowance[from][msg.sender]-=amount6;
        _burn(from,amount6);
    }
}
