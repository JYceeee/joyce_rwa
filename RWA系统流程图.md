# RWA优化版本V11系统流程图

## 系统架构图

```mermaid
graph TB
    subgraph "用户层"
        U[用户]
    end
    
    subgraph "管理层"
        RM[RWAManager<br/>系统管理中心]
    end
    
    subgraph "核心模块"
        CG[ComplianceGuard<br/>合规卫士]
        HR[HolderRegistry<br/>持有者名册]
        AM[AccrualModule<br/>计息模块]
        EM[ExchangeModule<br/>交易模块]
    end
    
    subgraph "代币层"
        LP[LPrincipal<br/>本金代币]
        LI[LInterest<br/>利息代币]
        USDT[USDT代币]
    end
    
    subgraph "代理层"
        TP[TransparentProxy<br/>透明代理]
    end
    
    U --> RM
    RM --> CG
    RM --> HR
    RM --> AM
    RM --> EM
    
    CG --> LP
    CG --> LI
    HR --> LP
    HR --> LI
    AM --> LI
    EM --> LP
    EM --> USDT
    
    TP --> RM
```

## 用户申购流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant EM as ExchangeModule
    participant CG as ComplianceGuard
    participant LP as LPrincipal
    participant HR as HolderRegistry
    participant USDT as USDT合约
    
    U->>EM: depositUSDT(amount)
    EM->>CG: canReceivePrincipal(user)
    CG-->>EM: 合规检查结果
    EM->>USDT: transferFrom(user, contract, amount)
    USDT-->>EM: 转账成功
    EM->>LP: mint(user, netAmount)
    LP->>CG: checkPrincipal(from, to)
    LP->>HR: register(user)
    EM-->>U: 申购成功
```

## 计息流程

```mermaid
sequenceDiagram
    participant Admin as 管理员
    participant AM as AccrualModule
    participant CG as ComplianceGuard
    participant HR as HolderRegistry
    participant LP as LPrincipal
    participant LI as LInterest
    
    Admin->>AM: accrueForDay(dayNo, onTime)
    AM->>HR: holderCount()
    HR-->>AM: 持有者数量
    
    loop 遍历所有持有者
        AM->>HR: holderAt(index)
        HR-->>AM: 持有者地址
        AM->>LP: balanceOf(holder)
        LP-->>AM: 本金余额
        AM->>CG: canReceiveInterest(holder)
        CG-->>AM: 合规检查结果
        
        alt 合规通过
            AM->>LI: mint(holder, interestAmount)
            LI-->>AM: 铸造成功
        else 不合规
            AM->>AM: 累积待发放利息
        end
    end
    
    AM-->>Admin: 计息完成
```

## 用户赎回流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant EM as ExchangeModule
    participant CG as ComplianceGuard
    participant LP as LPrincipal
    participant AM as AccrualModule
    
    U->>EM: applyRedeem(amount)
    EM->>CG: canReceivePrincipal(user)
    CG-->>EM: 合规检查通过
    EM->>CG: canRedeem(user)
    CG-->>EM: 赎回权限检查通过
    EM->>LP: burnFrom(user, amount)
    LP-->>EM: 销毁成功
    
    alt CalendarDays模式
        EM->>EM: 计算T+N天
    else Period模式
        EM->>AM: lastAccruedPeriodView()
        AM-->>EM: 当前期号
        EM->>EM: 计算T+1期号
    end
    
    EM-->>U: 赎回申请成功，等待处理
    
    Note over U,AM: 等待T+N天或T+1期号
    
    U->>EM: processRedeem(user)
    EM->>EM: 检查赎回条件
    EM->>USDT: transfer(user, netAmount)
    USDT-->>U: 赎回完成
```

## 合规检查流程

```mermaid
flowchart TD
    A[用户操作] --> B{合规检查}
    B --> C{白名单检查}
    C -->|未在白名单| D[拒绝操作]
    C -->|在白名单| E{KYC等级检查}
    E -->|等级不足| D
    E -->|等级足够| F{冻结状态检查}
    F -->|被冻结| D
    F -->|未冻结| G{时间锁检查}
    G -->|未到期| D
    G -->|已到期| H{制裁检查}
    H -->|被制裁| D
    H -->|未制裁| I{KYC过期检查}
    I -->|已过期| D
    I -->|未过期| J[允许操作]
    
    style D fill:#ffcccc
    style J fill:#ccffcc
```

## 系统初始化流程

```mermaid
sequenceDiagram
    participant Admin as 管理员
    participant RM as RWAManager
    participant CG as ComplianceGuard
    participant HR as HolderRegistry
    participant AM as AccrualModule
    participant EM as ExchangeModule
    participant LP as LPrincipal
    participant LI as LInterest
    
    Admin->>RM: 部署RWAManager
    Admin->>CG: 部署ComplianceGuard
    Admin->>HR: 部署HolderRegistry
    Admin->>AM: 部署AccrualModule
    Admin->>EM: 部署ExchangeModule
    Admin->>LP: 部署LPrincipal
    Admin->>LI: 部署LInterest
    
    Admin->>RM: setAddresses(guard, registry, principal, interest, accrual, exchange)
    Admin->>RM: wireRegistryAndManagers([principal, interest, exchange, accrual], exchange, accrual)
    
    RM->>HR: setAllowed(principal, true)
    RM->>HR: setAllowed(interest, true)
    RM->>HR: setAllowed(exchange, true)
    RM->>HR: setAllowed(accrual, true)
    
    RM->>LP: setManager(exchange)
    RM->>LI: setManager(accrual)
    
    Admin->>CG: 配置合规参数
    Admin->>AM: 配置计息参数
    Admin->>EM: 配置交易参数
    
    Note over Admin,LI: 系统初始化完成
```

## 模块间交互关系

```mermaid
graph LR
    subgraph "数据流"
        A[用户操作] --> B[合规检查]
        B --> C[代币操作]
        C --> D[名册更新]
        D --> E[计息计算]
    end
    
    subgraph "控制流"
        F[RWAManager] --> G[模块配置]
        G --> H[权限管理]
        H --> I[参数设置]
    end
    
    subgraph "安全流"
        J[合规检查] --> K[权限验证]
        K --> L[状态检查]
        L --> M[操作执行]
    end
```

## 关键特性说明

### 1. 模块化架构
- 每个模块职责单一，功能独立
- 通过接口进行模块间通信
- 支持模块独立升级和替换

### 2. 安全机制
- 多重权限验证
- 重入攻击防护
- 合规检查集成
- 资金安全保护

### 3. 可扩展性
- 代理模式支持合约升级
- 参数化配置支持业务调整
- 模块化设计支持功能扩展

### 4. 监管合规
- 完整的KYC/AML流程
- 多级权限控制
- 实时合规检查
- 审计友好的事件记录

这个流程图展示了RWA优化版本V11的完整系统架构和业务流程，包括用户操作、系统管理、合规检查、代币操作等各个环节的交互关系。
