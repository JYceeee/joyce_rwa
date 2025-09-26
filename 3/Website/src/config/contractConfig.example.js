// 智能合约配置示例文件
// 复制此文件为 contractConfig.js 并填入实际的合约地址

export const CONTRACT_CONFIG = {
  // KYC注册表合约地址 - 部署后填入
  KYC_REGISTRY_ADDRESS: '0x1234567890123456789012345678901234567890',
  
  // Loan发行者合约地址 - 部署后填入
  LOAN_ISSUER_ADDRESS: '0x1234567890123456789012345678901234567890',
  
  // 本金代币合约地址 - 部署后填入
  PRINCIPAL_TOKEN_ADDRESS: '0x1234567890123456789012345678901234567890',
  
  // 利息代币合约地址 - 部署后填入
  INTEREST_TOKEN_ADDRESS: '0x1234567890123456789012345678901234567890',
  
  // 交易合约地址 - 部署后填入
  TRADE_CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
  
  // 网络配置
  NETWORK: {
    chainId: 11155111, // Sepolia测试网，生产环境改为1(主网)
    name: 'Sepolia Testnet'
  }
}

// 测试网配置示例
export const SEPOLIA_CONFIG = {
  KYC_REGISTRY_ADDRESS: '0x...', // Sepolia上的KYC合约地址
  LOAN_ISSUER_ADDRESS: '0x...', // Sepolia上的Loan合约地址
  PRINCIPAL_TOKEN_ADDRESS: '0x...', // Sepolia上的本金代币地址
  INTEREST_TOKEN_ADDRESS: '0x...', // Sepolia上的利息代币地址
  TRADE_CONTRACT_ADDRESS: '0x...', // Sepolia上的交易合约地址
  NETWORK: {
    chainId: 11155111,
    name: 'Sepolia Testnet'
  }
}

// 主网配置示例
export const MAINNET_CONFIG = {
  KYC_REGISTRY_ADDRESS: '0x...', // 主网上的KYC合约地址
  LOAN_ISSUER_ADDRESS: '0x...', // 主网上的Loan合约地址
  PRINCIPAL_TOKEN_ADDRESS: '0x...', // 主网上的本金代币地址
  INTEREST_TOKEN_ADDRESS: '0x...', // 主网上的利息代币地址
  TRADE_CONTRACT_ADDRESS: '0x...', // 主网上的交易合约地址
  NETWORK: {
    chainId: 1,
    name: 'Ethereum Mainnet'
  }
}

// 常用测试网信息
export const TEST_NETWORKS = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://sepolia.etherscan.io'
  },
  goerli: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://goerli.etherscan.io'
  },
  mumbai: {
    chainId: 80001,
    name: 'Polygon Mumbai',
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://mumbai.polygonscan.com'
  }
}

// 部署脚本示例 (Hardhat)
/*
// 部署到Sepolia测试网
npx hardhat run scripts/deploy.js --network sepolia

// 部署到主网
npx hardhat run scripts/deploy.js --network mainnet
*/

// 合约验证示例
/*
// 验证合约
npx hardhat verify --network sepolia CONTRACT_ADDRESS "constructor_param1" "constructor_param2"
*/