# 一键部署&交易ETH功能说明

## 功能概述

本功能实现了在用户点击"确认认购"按钮后，触发"一键部署&交易ETH"弹窗，自动完成以下流程：

1. **网络检查** - 连接MetaMask，检查网络和余额
2. **合约部署** - 部署Principal Token、Interest Token等合约
3. **合约初始化** - 配置合约参数和权限
4. **资金转账** - 向Loan Issuer转账ETH
5. **数据库记录** - 保存交易信息到数据库

## 技术架构

### 前端组件

#### OneClickDeployModal.vue
- 一键部署弹窗主组件
- 包含5个步骤的流程控制
- 实时显示部署进度和状态

#### 主要功能：
- 网络检查和切换（Sepolia测试网）
- 余额验证
- 合约部署（使用ethers.js v6）
- 合约初始化
- ETH转账
- 进度显示和错误处理

### 后端API

#### contractRouter.js
- 提供合约ABI和bytecode的API接口
- 支持单个合约和批量合约信息获取
- 合约部署信息验证

#### API端点：
- `GET /contract` - 获取所有可用合约列表
- `GET /contract/:contractName` - 获取特定合约信息
- `GET /contract/:contractName/deployment` - 获取合约部署信息

### 前端服务

#### contractService.js
- 合约相关的API调用服务
- 合约信息验证
- 批量获取合约信息

## 使用流程

### 1. 用户操作
1. 在交易页面输入认购数量
2. 点击"确认认购"按钮
3. 系统显示"一键部署&交易ETH"弹窗

### 2. 自动执行流程

#### 步骤1：网络检查
- 检查MetaMask连接状态
- 验证当前网络是否为Sepolia测试网
- 如不是，自动切换到Sepolia网络
- 检查钱包余额是否足够

#### 步骤2：合约部署
部署以下合约：
- **Principal Token** (ERC20Hooked) - 本金代币
- **Interest Token** (ERC20Hooked) - 利息代币  
- **ComplianceGuard** - 合规检查合约
- **KYCManager** - KYC管理合约
- **HolderRegistry** - 持有者注册合约
- **RWAManager** - RWA管理合约

#### 步骤3：合约初始化
- 注册Token地址到管理合约
- 配置合规检查模块
- 设置额度限制
- 配置铸造权限
- 设置暂停策略

#### 步骤4：资金转账
- 向Loan Issuer地址转账指定数量的ETH
- 等待交易确认

#### 步骤5：完成
- 显示部署的合约地址
- 显示交易哈希
- 保存交易信息到数据库

## 技术实现细节

### 合约部署
```javascript
// 从后端获取合约信息
const contractInfo = await contractService.getContractDeploymentInfo(contractType)

// 创建合约工厂
const contractFactory = new ethers.ContractFactory(
  contractInfo.abi, 
  contractInfo.bytecode, 
  signer
)

// 部署合约
const contract = await contractFactory.deploy(...constructorArgs)
await contract.deploymentTransaction().wait()
```

### 网络切换
```javascript
// 切换到Sepolia测试网
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xaa36a7' }]
})

// 如果网络不存在，添加网络
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [sepoliaNetworkConfig]
})
```

### ETH转账
```javascript
// 构建转账交易
const transactionParams = {
  from: walletAddress,
  to: loanIssuerAddress,
  value: ethers.parseEther(amount.toString()),
  gas: '0x5208'
}

// 发送交易
const txHash = await window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [transactionParams]
})
```

## 配置说明

### 环境变量
```bash
# 后端API地址
VITE_API_BASE_URL=http://localhost:3000

# 合约地址配置
VITE_LOAN_ISSUER_ADDRESS=0x13159e6417D98528C220b12Ec4950D5A343E5eAA
```

### 合约配置
合约地址在 `src/config/contractConfig.js` 中配置：
```javascript
export const CONTRACT_CONFIG = {
  LOAN_ISSUER_ADDRESS: '0x13159e6417D98528C220b12Ec4950D5A343E5eAA',
  // 其他合约地址...
}
```

## 错误处理

### 网络错误
- MetaMask未安装
- 网络连接失败
- 网络切换失败

### 合约部署错误
- 合约ABI/bytecode获取失败
- 部署交易失败
- Gas费用不足

### 余额错误
- 钱包余额不足
- ETH余额检查失败

### 初始化错误
- 合约方法调用失败
- 权限设置失败

## 安全考虑

1. **合约验证** - 部署前验证合约ABI和bytecode
2. **余额检查** - 确保用户有足够ETH进行交易
3. **交易确认** - 等待所有交易上链确认
4. **错误回滚** - 失败时清理已部署的合约

## 测试说明

### 测试环境
- 使用Sepolia测试网
- 需要测试网ETH
- MetaMask钱包连接

### 测试步骤
1. 确保后端服务运行在3000端口
2. 确保合约artifacts文件存在
3. 连接MetaMask到Sepolia测试网
4. 执行一键部署流程
5. 检查合约部署和交易结果

## 故障排除

### 常见问题

1. **合约部署失败**
   - 检查artifacts文件是否存在
   - 验证合约ABI和bytecode
   - 确保Gas费用充足

2. **网络切换失败**
   - 检查MetaMask连接
   - 手动添加Sepolia网络
   - 验证网络配置

3. **余额不足**
   - 检查ETH余额
   - 确保余额大于交易金额
   - 考虑Gas费用

4. **后端API错误**
   - 检查后端服务状态
   - 验证API端点
   - 查看服务器日志

## 扩展功能

### 未来改进
1. 支持更多网络（主网、Polygon等）
2. 批量合约部署优化
3. 部署进度实时更新
4. 合约升级功能
5. 多签名钱包支持

### 监控和日志
1. 部署成功率统计
2. 错误类型分析
3. Gas费用优化
4. 用户体验改进

## 联系信息

如有问题或建议，请联系开发团队。
