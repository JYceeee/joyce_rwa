# 智能合约部署配置说明

## 环境变量配置

在 `my-contract` 目录下创建 `.env` 文件，包含以下配置：

```bash
# Sepolia测试网配置
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here

# Etherscan API Key (可选，用于验证合约)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## 获取配置信息

### 1. Sepolia RPC URL
- 访问 [Infura](https://infura.io/) 或 [Alchemy](https://www.alchemy.com/)
- 创建新项目，选择 Ethereum Sepolia 网络
- 复制 HTTPS URL

### 2. 私钥
- 使用 MetaMask 或其他钱包导出私钥
- 确保该地址有足够的 Sepolia ETH 用于部署

### 3. Etherscan API Key (可选)
- 访问 [Etherscan](https://etherscan.io/apis)
- 注册账户并创建 API Key

## 部署命令

```bash
# 部署到 Sepolia 测试网
npm run deploy:sepolia

# 通过 API 部署
npm run deploy:api
```

## 注意事项

1. 确保私钥对应的地址有足够的 Sepolia ETH
2. 私钥不要提交到版本控制系统
3. 测试网部署需要等待区块确认
4. 部署成功后合约地址会输出到控制台
