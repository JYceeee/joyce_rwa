// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IKYCForGuard {
    function checkPrincipal(address from, address to) external view;
    function checkInterest(address from, address to)  external view;
    function checkRedeem(address user)                external view;
}

contract ComplianceGuard {
    address public owner;
    address public kyc; // new
    bool public transfersPaused;

    mapping(address=>bool) public black;
    mapping(address=>bool) public freezeInP;  // principal inbound freeze
    mapping(address=>bool) public freezeOutP; // principal outbound freeze
    mapping(address=>bool) public freezeInI;  // interest inbound freeze
    mapping(address=>bool) public freezeOutI; // interest outbound freeze

    event OwnerChanged(address indexed prev,address indexed next);
    event KYCChanged(address indexed prev,address indexed next);
    event Paused(bool on);
    event BlackSet(address indexed a,bool v);

    modifier onlyOwner(){ require(msg.sender==owner,"onlyOwner"); _; }
    constructor(){ owner=msg.sender; emit OwnerChanged(address(0),msg.sender); }

    function transferOwnership(address n) external onlyOwner { require(n!=address(0),"bad"); emit OwnerChanged(owner,n); owner=n; }
    function setKYC(address a) external onlyOwner { emit KYCChanged(kyc,a); kyc=a; }
    function pause(bool on) external onlyOwner { transfersPaused=on; emit Paused(on); }
    function setBlack(address a,bool v) external onlyOwner { black[a]=v; emit BlackSet(a,v); }
    function setFreezeP(address a,bool inF,bool outF) external onlyOwner { freezeInP[a]=inF; freezeOutP[a]=outF; }
    function setFreezeI(address a,bool inF,bool outF) external onlyOwner { freezeInI[a]=inF; freezeOutI[a]=outF; }

    // ===== precheck common =====
    function _preCommon(address from,address to) internal view {
        require(!transfersPaused,"paused");
        require(!black[from] && !black[to], "black");
    }
    function _prePrincipal(address from,address to) internal view {
        if (from!=address(0)) require(!freezeOutP[from],"p/out");
        if (to!=address(0))   require(!freezeInP[to],"p/in");
    }
    function _preInterest(address from,address to) internal view {
        if (from!=address(0)) require(!freezeOutI[from],"i/out");
        if (to!=address(0))   require(!freezeInI[to],"i/in");
    }
    // ===== public checks for tokens / EX =====
    function checkPrincipal(address from,address to) external view {
        _preCommon(from,to); _prePrincipal(from,to);
        require(kyc!=address(0),"kyc/not-set");
        IKYCForGuard(kyc).checkPrincipal(from,to);
    }
    function checkInterest(address from,address to) external view {
        _preCommon(from,to); _preInterest(from,to);
        require(kyc!=address(0),"kyc/not-set");
        IKYCForGuard(kyc).checkInterest(from,to);
    }
    function checkRedeem(address user) external view {
        require(!transfersPaused,"paused");
        require(!black[user],"black");
        require(kyc!=address(0),"kyc/not-set");
        IKYCForGuard(kyc).checkRedeem(user);
    }
}
