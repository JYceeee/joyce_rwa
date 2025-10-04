// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract KYCManager {
    struct Profile {
        uint8 tier;
        uint64 expireAt;
        bool blocked;
    }
    struct Req {
        bool active;
        uint8 pMin; // principal min tier
        uint8 iMin; // interest min tier
        uint8 rMin; // redeem min tier
    }

    address public owner;
    mapping(address => bool) public operator;

    mapping(address => Profile) public profile;        // user -> profile
    Req public globalReq;                              // default requirement
    mapping(address => Req) public reqOfContract;      // target contract -> req

    event OwnerChanged(address indexed prev, address indexed next);
    event OperatorSet(address indexed op, bool allowed);
    event TierSet(address indexed user, uint8 tier, uint64 expireAt);
    event Blocked(address indexed user, bool blocked);
    event GlobalReqSet(uint8 p,uint8 i,uint8 r);
    event ContractReqSet(address indexed target, bool active, uint8 p,uint8 i,uint8 r);

    modifier onlyOwner() { require(msg.sender==owner, "onlyOwner"); _; }
    modifier onlyAdmin() { require(msg.sender==owner || operator[msg.sender], "not-admin"); _; }

    constructor() {
        owner = msg.sender;
        emit OwnerChanged(address(0), msg.sender);
        // default: require tier >= 1
        globalReq = Req({active:true, pMin:1, iMin:1, rMin:1});
        emit GlobalReqSet(1,1,1);
    }

    // --- admin ops ---
    function transferOwnership(address n) external onlyOwner {
        require(n!=address(0),"bad");
        emit OwnerChanged(owner,n);
        owner = n;
    }
    function setOperator(address op, bool allowed) external onlyOwner {
        operator[op]=allowed; emit OperatorSet(op,allowed);
    }

    // --- user admin ---
    function setTier(address u, uint8 t, uint64 expireAt) public onlyAdmin {
        profile[u] = Profile({tier:t, expireAt:expireAt, blocked:profile[u].blocked});
        emit TierSet(u,t,expireAt);
    }
    function batchSetTier(address[] calldata us, uint8[] calldata ts, uint64[] calldata exps) external onlyAdmin {
        require(us.length==ts.length && ts.length==exps.length, "len");
        for (uint i=0;i<us.length;i++) setTier(us[i], ts[i], exps[i]);
    }
    function setBlocked(address u, bool b) external onlyAdmin { profile[u].blocked=b; emit Blocked(u,b); }

    // --- requirements ---
    function setGlobalRequire(uint8 p,uint8 i,uint8 r) external onlyOwner {
        globalReq = Req({active:true, pMin:p, iMin:i, rMin:r});
        emit GlobalReqSet(p,i,r);
    }
    function setContractRequire(address target, uint8 p,uint8 i,uint8 r, bool active) external onlyOwner {
        reqOfContract[target] = Req({active:active, pMin:p, iMin:i, rMin:r});
        emit ContractReqSet(target,active,p,i,r);
    }

    // --- views ---
    function _check(address user, uint8 needTier) internal view {
        Profile memory p = profile[user];
        require(!p.blocked, "KycBlocked");
        require(p.tier >= needTier, "KycInsufficient");
        if (p.expireAt!=0) require(uint64(block.timestamp) <= p.expireAt, "KycExpired");
    }
    function _need(address target, uint8 kind /*1=P 2=I 3=R*/) internal view returns(uint8){
        Req memory r = reqOfContract[target];
        if (r.active) {
            if (kind==1) return r.pMin;
            if (kind==2) return r.iMin;
            return r.rMin;
        } else {
            if (kind==1) return globalReq.pMin;
            if (kind==2) return globalReq.iMin;
            return globalReq.rMin;
        }
    }

    // --- called by ComplianceGuard ---
    function checkPrincipal(address from, address to) external view {
        // from/to 皆需合规（可根据你原策略调优）
        uint8 need = _need(tx.origin, 1); // 这里按 tx.origin 代表“业务目标合约”也可改为 msg.sender 方案
        _check(to, need);
        // 可选：_check(from, need);
    }
    function checkInterest(address from, address to) external view {
        uint8 need = _need(tx.origin, 2);
        _check(to, need);
    }
    function checkRedeem(address user) external view {
        uint8 need = _need(tx.origin, 3);
        _check(user, need);
    }
}
