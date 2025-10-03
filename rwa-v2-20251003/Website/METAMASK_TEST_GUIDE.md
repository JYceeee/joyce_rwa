# MetaMask交易测试指南

## 功能概述

用户点击确认认购按钮时，系统会：
1. 部署智能合约到Sepolia测试网
2. 获取Loan Issuer地址
3. 通过MetaMask发送ETH到Loan Issuer地址
4. 等待交易确认
5. 保存所有交易信息到数据库

## 测试步骤

### 1. 环境准备

#### 安装MetaMask
- 从 [MetaMask官网](https://metamask.io/) 安装浏览器扩展
- 创建新钱包或导入现有钱包

#### 配置Sepolia测试网
- 在MetaMask中添加Sepolia测试网：
  - 网络名称: Sepolia Test Network
  - RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
  - 链ID: 11155111
  - 货币符号: SepoliaETH
  - 区块浏览器: https://sepolia.etherscan.io

#### 获取测试ETH
- 访问 [Sepolia Faucet](https://sepoliafaucet.com/)
- 输入你的钱包地址获取测试ETH
- 确保账户有足够的ETH用于部署合约和交易

### 2. 配置环境变量

在 `my-contract` 目录下创建 `.env` 文件：

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 3. 启动应用

```bash
# 启动后端
cd Mysql
npm start

# 启动前端
cd Website
npm run dev
```

### 4. 测试流程

#### 步骤1: 连接钱包
1. 打开应用
2. 点击"连接钱包"按钮
3. 在MetaMask中确认连接
4. 确保连接到Sepolia测试网

#### 步骤2: 选择项目
1. 浏览到交易页面
2. 选择一个RWA项目
3. 输入认购数量（例如：1）

#### 步骤3: 确认认购
1. 点击"确认认购"按钮
2. 观察加载状态：
   - "准备交易..."
   - "部署智能合约..."
   - "执行MetaMask交易..."
   - "提取交易信息..."
   - "保存交易记录..."
   - "交易完成!"

#### 步骤4: MetaMask交易
1. 系统会自动弹出MetaMask交易窗口
2. 检查交易详情：
   - 接收地址：Loan Issuer地址
   - 金额：认购数量对应的ETH
   - Gas费用：自动计算
3. 点击"确认"发送交易

#### 步骤5: 等待确认
1. 系统会等待交易确认（最多2.5分钟）
2. 确认后显示成功信息
3. 包含交易哈希、区块号等信息

### 5. 验证结果

#### 检查数据库
查看 `transaction` 表，确认记录包含：
- `transaction_hash`: MetaMask交易哈希
- `block_number`: 交易确认的区块号
- `loan_issuer_wallet_address`: Loan Issuer地址
- `trade_contract_abi`: 合约地址
- 其他合约信息

#### 检查区块链
1. 在 [Sepolia Etherscan](https://sepolia.etherscan.io/) 查看交易
2. 确认交易状态为"Success"
3. 验证接收地址为Loan Issuer地址

### 6. 故障排除

#### 常见问题

**1. 钱包未连接**
- 确保MetaMask已安装并解锁
- 检查是否已授权网站访问钱包

**2. 网络错误**
- 确保连接到Sepolia测试网
- 检查RPC URL配置是否正确

**3. 余额不足**
- 确保账户有足够的Sepolia ETH
- 从水龙头获取更多测试ETH

**4. 交易失败**
- 检查Gas费用设置
- 确保接收地址有效
- 检查网络拥堵情况

**5. 合约部署失败**
- 检查环境变量配置
- 确保私钥有足够余额
- 检查网络连接

#### 调试信息

查看浏览器控制台获取详细日志：
- 合约部署过程
- MetaMask交易详情
- 错误信息和堆栈跟踪

### 7. 测试用例

#### 正常流程测试
- [ ] 连接MetaMask
- [ ] 选择项目并输入数量
- [ ] 确认认购
- [ ] 合约部署成功
- [ ] MetaMask交易成功
- [ ] 数据保存到数据库

#### 错误处理测试
- [ ] 钱包未连接
- [ ] 网络不匹配
- [ ] 余额不足
- [ ] 用户拒绝交易
- [ ] 合约部署失败

#### 边界条件测试
- [ ] 最小认购数量
- [ ] 最大认购数量
- [ ] 网络切换
- [ ] 交易超时

### 8. 性能测试

- 合约部署时间：通常30-60秒
- MetaMask交易确认：通常10-30秒
- 总流程时间：通常1-2分钟

### 9. 安全注意事项

- 仅在测试网使用
- 不要使用主网私钥
- 定期清理测试数据
- 保护私钥安全

## 成功标准

测试成功的标准：
1. 合约成功部署到Sepolia测试网
2. MetaMask交易成功发送并确认
3. 交易信息正确保存到数据库
4. 用户界面显示成功状态
5. 所有错误情况都有适当的错误处理
