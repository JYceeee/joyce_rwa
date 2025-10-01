# 合约部署验证测试页面

## 概述

合约部署验证测试页面是一个专门用于验证智能合约在Sepolia Testnet和Ethereum主网部署状态的工具。该页面可以抓取和验证本币合约地址和利币合约地址。

## 功能特性

### 🌐 网络支持
- **Sepolia Testnet** (Chain ID: 11155111)
- **Ethereum Mainnet** (Chain ID: 1)
- 一键网络切换功能

### 📋 合约验证
- KYC注册表合约验证
- Loan发行者合约验证
- 本金代币 (LPRI) 合约验证
- 利息代币 (LINT) 合约验证
- 交易合约验证
- 合规守卫合约验证

### 🔍 合约信息抓取
- **本金代币信息**：
  - 合约地址
  - 代币名称和符号
  - 总供应量和小数位数
  - KYC注册表地址
  - 所需KYC等级
  - 暂停状态

- **利息代币信息**：
  - 合约地址
  - 代币名称和符号
  - 总供应量和小数位数
  - KYC注册表地址
  - 所需KYC等级
  - 暂停状态

- **Loan发行者信息**：
  - 合约地址
  - KYC注册表地址
  - 本金代币地址
  - 利息代币地址
  - 下一个贷款ID

## 访问方式

### 通过Header导航
1. 点击Header中的"More ▾"下拉菜单
2. 选择"🔍 合约部署验证"
3. 页面将跳转到测试页面

### 直接URL访问
```
/test/contract-deployment-verification
```

## 使用步骤

### 1. 选择网络
- 点击"Sepolia Testnet"或"Ethereum Mainnet"按钮选择要测试的网络
- 系统会自动显示当前网络状态

### 2. 配置合约地址
- 在"合约地址配置"部分输入或修改合约地址
- 每个合约地址都有独立的"验证"按钮

### 3. 验证合约
- 点击单个合约的"验证"按钮进行单独验证
- 或点击"验证所有合约"进行批量验证

### 4. 抓取合约信息
- 点击"抓取所有合约信息"获取完整的合约信息
- 或分别点击"抓取代币信息"和"抓取Loan发行者信息"

### 5. 网络切换测试
- 使用"切换到Sepolia"或"切换到主网"按钮测试网络切换功能

## 技术实现

### 前端组件
- `ContractDeploymentVerificationView.vue` - 主测试页面组件
- 响应式设计，支持桌面端和移动端

### 后端服务
- `contractAddressService.js` - 合约地址抓取和验证服务
- 基于ethers.js的Web3交互
- 支持批量验证和错误处理

### 路由配置
- 路由路径：`/test/contract-deployment-verification`
- 懒加载组件，优化性能

## 合约ABI支持

### LoanIssuer合约
```javascript
- registry() - 获取KYC注册表地址
- principalToken() - 获取本金代币地址
- interestToken() - 获取利息代币地址
- nextLoanId() - 获取下一个贷款ID
```

### CompliantERC20合约
```javascript
- name() - 获取代币名称
- symbol() - 获取代币符号
- decimals() - 获取小数位数
- totalSupply() - 获取总供应量
- registry() - 获取KYC注册表地址
- requiredKycLevel() - 获取所需KYC等级
- paused() - 获取暂停状态
```

### KYC注册表合约
```javascript
- kycSigner() - 获取KYC签名者地址
- DOMAIN_SEPARATOR() - 获取域名分隔符
```

## 错误处理

### 常见错误类型
1. **合约地址未配置** - 提示配置正确的合约地址
2. **合约不存在** - 检查合约是否已部署
3. **网络不匹配** - 提示切换到正确的网络
4. **Web3钱包未连接** - 提示连接MetaMask等钱包

### 错误恢复
- 自动重试机制
- 友好的错误提示
- 详细的错误日志

## 配置说明

### 环境变量配置
```javascript
// Sepolia Testnet
VITE_KYC_REGISTRY_ADDRESS=0x...
VITE_LOAN_ISSUER_ADDRESS=0x...
VITE_PRINCIPAL_TOKEN_ADDRESS=0x...
VITE_INTEREST_TOKEN_ADDRESS=0x...

// Ethereum Mainnet
VITE_KYC_REGISTRY_ADDRESS_PROD=0x...
VITE_LOAN_ISSUER_ADDRESS_PROD=0x...
VITE_PRINCIPAL_TOKEN_ADDRESS_PROD=0x...
VITE_INTEREST_TOKEN_ADDRESS_PROD=0x...
```

### 本地存储
- 合约配置可以保存到本地存储
- 支持配置的导入和导出

## 安全注意事项

1. **测试网络使用** - 建议先在Sepolia测试网进行测试
2. **合约地址验证** - 确保使用正确的合约地址
3. **网络切换确认** - 切换网络前确认当前操作状态
4. **私钥安全** - 测试过程中不要泄露私钥信息

## 故障排除

### 常见问题
1. **MetaMask未安装** - 安装MetaMask浏览器扩展
2. **网络连接失败** - 检查网络连接和RPC配置
3. **合约调用失败** - 验证合约地址和ABI
4. **余额不足** - 确保测试账户有足够的ETH用于Gas费

### 调试信息
- 打开浏览器开发者工具查看详细日志
- 检查网络请求和响应
- 验证合约交易状态

## 更新日志

### v1.0.0 (2024-12-19)
- 初始版本发布
- 支持Sepolia和主网合约验证
- 实现合约地址抓取功能
- 添加网络切换功能
- 响应式设计支持

## 贡献指南

如果您发现bug或有改进建议，请：
1. 检查现有issue
2. 创建新的issue描述问题
3. 提供详细的复现步骤
4. 包含相关的错误日志

## 许可证

本项目遵循MIT许可证。

