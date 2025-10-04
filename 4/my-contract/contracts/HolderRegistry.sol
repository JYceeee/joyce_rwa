// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HolderRegistry {
    address public owner;
    mapping(address=>bool) public allowedCaller;
    mapping(address=>bool) public known;
    address[] public holders;

    event OwnerChanged(address indexed prev,address indexed next);
    event AllowedSet(address indexed c,bool v);
    event Registered(address indexed a);

    modifier onlyOwner(){ require(msg.sender==owner,"onlyOwner"); _; }
    modifier onlyAllowed(){ require(allowedCaller[msg.sender],"not-allowed"); _; }

    constructor(){ owner=msg.sender; emit OwnerChanged(address(0),msg.sender); }

    function transferOwnership(address n) external onlyOwner { require(n!=address(0),"bad"); emit OwnerChanged(owner,n); owner=n; }
    function setAllowed(address c,bool v) external onlyOwner { allowedCaller[c]=v; emit AllowedSet(c,v); }

    function register(address a) external onlyAllowed {
        if (!known[a]) { known[a]=true; holders.push(a); emit Registered(a); }
    }
    function holderCount() external view returns(uint256){ return holders.length; }
}
