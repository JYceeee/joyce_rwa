// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library SafeTransferLib {
    function safeTransfer(address token, address to, uint256 amount) internal {
        (bool ok, bytes memory data) = token.call(abi.encodeWithSelector(bytes4(0xa9059cbb), to, amount));
        require(ok && (data.length==0 || abi.decode(data,(bool))), "transfer-fail");
    }
    function safeTransferFrom(address token, address from, address to, uint256 amount) internal {
        (bool ok, bytes memory data) = token.call(abi.encodeWithSelector(bytes4(0x23b872dd), from, to, amount));
        require(ok && (data.length==0 || abi.decode(data,(bool))), "transferFrom-fail");
    }
}

abstract contract Ownable {
    address public owner;
    event OwnerChanged(address indexed prev,address indexed next);
    modifier onlyOwner(){ require(msg.sender==owner,"onlyOwner"); _; }
    constructor(){ owner=msg.sender; emit OwnerChanged(address(0),msg.sender); }
    function transferOwnership(address n) external onlyOwner { require(n!=address(0),"bad"); emit OwnerChanged(owner,n); owner=n; }
}

abstract contract ReentrancyGuard { uint256 private _s=1; modifier nonReentrant(){ require(_s==1,"reent"); _s=2; _; _s=1; } }

interface IGuard {
    function checkPrincipal(address from,address to) external view;
    function checkInterest(address from,address to) external view;
}

interface IRegistry { function register(address a) external; }

contract ERC20Hooked is Ownable {
    string public name; string public symbol; uint8 public immutable decimals;
    uint256 public totalSupply;
    mapping(address=>uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;

    // hooks
    address public guard;      // ComplianceGuard
    address public registry;   // HolderRegistry
    bool public hookPrincipal; // true for LP; false for LI (we choose which check to use)

    event GuardSet(address indexed g);
    event RegistrySet(address indexed r);
    event Transfer(address indexed from,address indexed to,uint256 amount);
    event Approval(address indexed o,address indexed s,uint256 amount);

    constructor(string memory n,string memory s,uint8 d,bool isPrincipal) {
        name=n; symbol=s; decimals=d; hookPrincipal=isPrincipal;
    }

    function setGuard(address g) external onlyOwner { guard=g; emit GuardSet(g); }
    function setRegistry(address r) external onlyOwner { registry=r; emit RegistrySet(r); }

    function _beforeTransfer(address from,address to,uint256) internal view {
        if (guard!=address(0) && to!=address(0)) {
            if (hookPrincipal) { IGuard(guard).checkPrincipal(from,to); }
            else { IGuard(guard).checkInterest(from,to); }
        }
    }
    function _afterTransfer(address, address to, uint256) internal {
        if (registry!=address(0) && to!=address(0)) {
            IRegistry(registry).register(to);
        }
    }

    function approve(address s,uint256 a) external returns(bool){ allowance[msg.sender][s]=a; emit Approval(msg.sender,s,a); return true; }
    function transfer(address to,uint256 a) external returns(bool){ _transfer(msg.sender,to,a); return true; }
    function transferFrom(address f,address t,uint256 a) external returns(bool){
        uint256 al=allowance[f][msg.sender]; require(al>=a,"allow"); if (al!=type(uint256).max) allowance[f][msg.sender]=al-a;
        _transfer(f,t,a); return true;
    }
    function _transfer(address f,address t,uint256 a) internal {
        require(t!=address(0),"zero");
        _beforeTransfer(f,t,a);
        uint256 fb=balanceOf[f]; require(fb>=a,"bal");
        unchecked{ balanceOf[f]=fb-a; balanceOf[t]+=a; }
        emit Transfer(f,t,a);
        _afterTransfer(f,t,a);
    }
    function _mint(address to,uint256 a) internal {
        require(to!=address(0),"zero");
        _beforeTransfer(address(0),to,a);
        totalSupply+=a; balanceOf[to]+=a; emit Transfer(address(0),to,a);
        _afterTransfer(address(0),to,a);
    }
    function _burn(address from,uint256 a) internal {
        _beforeTransfer(from,address(0),a);
        uint256 fb=balanceOf[from]; require(fb>=a,"bal");
        unchecked{ balanceOf[from]=fb-a; totalSupply-=a; }
        emit Transfer(from,address(0),a);
        // no registry on burn
    }
}
