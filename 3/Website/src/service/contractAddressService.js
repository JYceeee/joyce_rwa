// contractAddressService.js - 合约地址抓取和验证服务
// 专门用于从智能合约中抓取本币合约地址和利币合约地址

import { ethers } from 'ethers'

// LoanIssuer合约ABI - 用于抓取代币地址
export const LOAN_ISSUER_ABI = [
  "function registry() external view returns (address)",
  "function principalToken() external view returns (address)",
  "function interestToken() external view returns (address)",
  "function nextLoanId() external view returns (uint256)",
  "function loans(uint256 loanId) external view returns (uint256 principal, uint256 annualRateBps, uint64 startDate, uint64 dueDate, string memory borrower, string memory lender, string memory collateral, string memory note, bool closed)",
  "function loanHolder(uint256 loanId) external view returns (address)",
  "function wireControllers() external",
  "function createLoan((address holder, uint256 principalAmount, uint256 annualRateBps, uint64 startDate, uint64 dueDate, string memory borrower, string memory lender, string memory collateral, string memory note) calldata p) external returns (uint256 loanId)",
  "function mintInterest(uint256 loanId, address to, uint256 amount) external",
  "function redeem(uint256 loanId, uint256 principalAmt, uint256 interestAmt) external",
  "function closeLoan(uint256 loanId) external",
  "event CreateLoan(uint256 indexed loanId, address indexed holder, uint256 principal, uint256 rateBps)",
  "event MintInterest(uint256 indexed loanId, address indexed to, uint256 amount)",
  "event Redeem(uint256 indexed loanId, address indexed from, uint256 principalBurn, uint256 interestBurn)",
  "event CloseLoan(uint256 indexed loanId)"
]

// CompliantERC20合约ABI - 用于抓取代币信息
export const COMPLIANT_ERC20_ABI = [
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function decimals() external pure returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function registry() external view returns (address)",
  "function requiredKycLevel() external view returns (uint8)",
  "function paused() external view returns (bool)",
  "function setRequiredKycLevel(uint8 level) external",
  "function setPaused(bool p) external",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event RequiredKycLevel(uint8 oldLevel, uint8 newLevel)",
  "event Paused(bool status)"
]

// KYC注册表合约ABI
export const KYC_REGISTRY_ABI = [
  "function kycLevel(address user) external view returns (uint8)",
  "function blocked(address user) external view returns (bool)",
  "function setKycLevel(address user, uint8 level) external",
  "function setBlocked(address user, bool isBlocked) external",
  "function setKycLevelBySig(address user, uint8 level, uint256 deadline, bytes32 nonce, bytes calldata signature) external",
  "function setSigner(address signer) external",
  "function kycSigner() external view returns (address)",
  "function DOMAIN_SEPARATOR() external view returns (bytes32)",
  "function usedNonce(bytes32 nonce) external view returns (bool)",
  "event SetLevel(address indexed user, uint8 level, address indexed setter)",
  "event Block(address indexed user, bool blocked, address indexed setter)",
  "event SetSigner(address indexed signer)"
]

// 合约地址抓取服务类
export class ContractAddressService {
  constructor() {
    this.provider = null
  }

  // 初始化服务
  async initialize() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Web3钱包未检测到，请安装MetaMask或类似钱包')
      }
      
      this.provider = new ethers.BrowserProvider(window.ethereum)
      console.log('✅ ContractAddressService initialized')
      return true
    } catch (error) {
      console.error('❌ Failed to initialize ContractAddressService:', error)
      throw error
    }
  }

  // 验证合约地址是否存在
  async verifyContractExists(address) {
    try {
      if (!this.provider) {
        await this.initialize()
      }

      if (!ethers.isAddress(address)) {
        throw new Error(`无效的合约地址格式: ${address}`)
      }

      const code = await this.provider.getCode(address)
      
      return {
        exists: code !== '0x',
        codeLength: code.length,
        address: address
      }
    } catch (error) {
      console.error('❌ Failed to verify contract:', error)
      return {
        exists: false,
        error: error.message,
        address: address
      }
    }
  }

  // 从LoanIssuer合约抓取代币地址
  async fetchTokenAddressesFromLoanIssuer(loanIssuerAddress) {
    try {
      if (!this.provider) {
        await this.initialize()
      }

      console.log('🔍 Fetching token addresses from LoanIssuer:', loanIssuerAddress)

      // 首先验证LoanIssuer合约是否存在
      const verification = await this.verifyContractExists(loanIssuerAddress)
      if (!verification.exists) {
        throw new Error(`LoanIssuer合约不存在: ${loanIssuerAddress}`)
      }

      const loanIssuerContract = new ethers.Contract(loanIssuerAddress, LOAN_ISSUER_ABI, this.provider)
      
      const [registry, principalToken, interestToken, nextLoanId] = await Promise.all([
        loanIssuerContract.registry().catch(() => '0x0000000000000000000000000000000000000000'),
        loanIssuerContract.principalToken().catch(() => '0x0000000000000000000000000000000000000000'),
        loanIssuerContract.interestToken().catch(() => '0x0000000000000000000000000000000000000000'),
        loanIssuerContract.nextLoanId().catch(() => 0)
      ])

      const result = {
        loanIssuer: {
          address: loanIssuerAddress,
          registry,
          principalToken,
          interestToken,
          nextLoanId: nextLoanId.toString()
        },
        tokenAddresses: {
          principalToken,
          interestToken
        }
      }

      console.log('✅ Token addresses fetched:', result)
      return result

    } catch (error) {
      console.error('❌ Failed to fetch token addresses:', error)
      throw error
    }
  }

  // 抓取代币详细信息
  async fetchTokenDetails(tokenAddress) {
    try {
      if (!this.provider) {
        await this.initialize()
      }

      console.log('🔍 Fetching token details:', tokenAddress)

      // 验证代币合约是否存在
      const verification = await this.verifyContractExists(tokenAddress)
      if (!verification.exists) {
        throw new Error(`代币合约不存在: ${tokenAddress}`)
      }

      const tokenContract = new ethers.Contract(tokenAddress, COMPLIANT_ERC20_ABI, this.provider)
      
      const [name, symbol, decimals, totalSupply, registry, requiredKycLevel, paused] = await Promise.all([
        tokenContract.name().catch(() => '未知'),
        tokenContract.symbol().catch(() => '未知'),
        tokenContract.decimals().catch(() => 18),
        tokenContract.totalSupply().catch(() => 0),
        tokenContract.registry().catch(() => '0x0000000000000000000000000000000000000000'),
        tokenContract.requiredKycLevel().catch(() => 0),
        tokenContract.paused().catch(() => false)
      ])

      const result = {
        address: tokenAddress,
        name,
        symbol,
        decimals: decimals.toString(),
        totalSupply: ethers.formatEther(totalSupply),
        registry,
        requiredKycLevel: requiredKycLevel.toString(),
        paused
      }

      console.log('✅ Token details fetched:', result)
      return result

    } catch (error) {
      console.error('❌ Failed to fetch token details:', error)
      throw error
    }
  }

  // 抓取KYC注册表信息
  async fetchKycRegistryDetails(registryAddress) {
    try {
      if (!this.provider) {
        await this.initialize()
      }

      console.log('🔍 Fetching KYC registry details:', registryAddress)

      // 验证KYC注册表合约是否存在
      const verification = await this.verifyContractExists(registryAddress)
      if (!verification.exists) {
        throw new Error(`KYC注册表合约不存在: ${registryAddress}`)
      }

      const registryContract = new ethers.Contract(registryAddress, KYC_REGISTRY_ABI, this.provider)
      
      const [kycSigner, domainSeparator] = await Promise.all([
        registryContract.kycSigner().catch(() => '0x0000000000000000000000000000000000000000'),
        registryContract.DOMAIN_SEPARATOR().catch(() => '0x0000000000000000000000000000000000000000000000000000000000000000')
      ])

      const result = {
        address: registryAddress,
        kycSigner,
        domainSeparator
      }

      console.log('✅ KYC registry details fetched:', result)
      return result

    } catch (error) {
      console.error('❌ Failed to fetch KYC registry details:', error)
      throw error
    }
  }

  // 批量验证合约地址
  async batchVerifyContracts(addresses) {
    try {
      if (!this.provider) {
        await this.initialize()
      }

      console.log('🔍 Batch verifying contracts:', addresses)

      const results = {}
      
      for (const [name, address] of Object.entries(addresses)) {
        if (address && address !== '0x1234567890123456789012345678901234567890') {
          results[name] = await this.verifyContractExists(address)
        } else {
          results[name] = {
            exists: false,
            error: '地址未配置或为默认地址',
            address: address
          }
        }
      }

      console.log('✅ Batch verification completed:', results)
      return results

    } catch (error) {
      console.error('❌ Failed to batch verify contracts:', error)
      throw error
    }
  }

  // 获取网络信息
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        await this.initialize()
      }

      const network = await this.provider.getNetwork()
      const chainId = await this.provider.send('eth_chainId', [])
      
      return {
        chainId: parseInt(chainId, 16),
        name: network.name,
        ensAddress: network.ensAddress
      }

    } catch (error) {
      console.error('❌ Failed to get network info:', error)
      throw error
    }
  }

  // 切换网络
  async switchNetwork(targetChainId) {
    try {
      const chainIdHex = '0x' + targetChainId.toString(16)
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })

      console.log('✅ Network switched to:', targetChainId)
      return true

    } catch (error) {
      console.error('❌ Failed to switch network:', error)
      throw error
    }
  }

  // 综合抓取所有合约信息
  async fetchAllContractInfo(contractConfig) {
    try {
      if (!this.provider) {
        await this.initialize()
      }

      console.log('🔍 Fetching all contract information:', contractConfig)

      const results = {
        network: await this.getNetworkInfo(),
        verification: {},
        tokenAddresses: {},
        tokenDetails: {},
        kycRegistry: {}
      }

      // 1. 验证所有合约地址
      results.verification = await this.batchVerifyContracts(contractConfig)

      // 2. 从LoanIssuer抓取代币地址
      if (results.verification.LOAN_ISSUER_ADDRESS?.exists) {
        try {
          const tokenAddresses = await this.fetchTokenAddressesFromLoanIssuer(contractConfig.LOAN_ISSUER_ADDRESS)
          results.tokenAddresses = tokenAddresses.tokenAddresses
          results.loanIssuer = tokenAddresses.loanIssuer
        } catch (error) {
          console.warn('⚠️ Failed to fetch token addresses from LoanIssuer:', error.message)
        }
      }

      // 3. 抓取代币详细信息
      if (results.tokenAddresses.principalToken && results.verification.PRINCIPAL_TOKEN_ADDRESS?.exists) {
        try {
          results.tokenDetails.principalToken = await this.fetchTokenDetails(results.tokenAddresses.principalToken)
        } catch (error) {
          console.warn('⚠️ Failed to fetch principal token details:', error.message)
        }
      }

      if (results.tokenAddresses.interestToken && results.verification.INTEREST_TOKEN_ADDRESS?.exists) {
        try {
          results.tokenDetails.interestToken = await this.fetchTokenDetails(results.tokenAddresses.interestToken)
        } catch (error) {
          console.warn('⚠️ Failed to fetch interest token details:', error.message)
        }
      }

      // 4. 抓取KYC注册表信息
      if (results.verification.KYC_REGISTRY_ADDRESS?.exists) {
        try {
          results.kycRegistry = await this.fetchKycRegistryDetails(contractConfig.KYC_REGISTRY_ADDRESS)
        } catch (error) {
          console.warn('⚠️ Failed to fetch KYC registry details:', error.message)
        }
      }

      console.log('✅ All contract information fetched:', results)
      return results

    } catch (error) {
      console.error('❌ Failed to fetch all contract info:', error)
      throw error
    }
  }

  // 比较两个网络的合约配置
  async compareNetworkConfigs(sepoliaConfig, mainnetConfig) {
    try {
      console.log('🔍 Comparing network configurations')

      const comparison = {
        sepolia: await this.fetchAllContractInfo(sepoliaConfig),
        mainnet: await this.fetchAllContractInfo(mainnetConfig),
        differences: {}
      }

      // 比较合约地址
      const addressFields = ['KYC_REGISTRY_ADDRESS', 'LOAN_ISSUER_ADDRESS', 'PRINCIPAL_TOKEN_ADDRESS', 'INTEREST_TOKEN_ADDRESS', 'TRADE_CONTRACT_ADDRESS', 'COMPLIANCE_GUARD_ADDRESS']
      
      comparison.differences.addresses = {}
      for (const field of addressFields) {
        if (sepoliaConfig[field] !== mainnetConfig[field]) {
          comparison.differences.addresses[field] = {
            sepolia: sepoliaConfig[field],
            mainnet: mainnetConfig[field]
          }
        }
      }

      // 比较代币信息
      comparison.differences.tokens = {}
      if (comparison.sepolia.tokenDetails.principalToken && comparison.mainnet.tokenDetails.principalToken) {
        const sepPrincipal = comparison.sepolia.tokenDetails.principalToken
        const mainPrincipal = comparison.mainnet.tokenDetails.principalToken
        
        if (sepPrincipal.symbol !== mainPrincipal.symbol || sepPrincipal.name !== mainPrincipal.name) {
          comparison.differences.tokens.principalToken = {
            sepolia: { symbol: sepPrincipal.symbol, name: sepPrincipal.name },
            mainnet: { symbol: mainPrincipal.symbol, name: mainPrincipal.name }
          }
        }
      }

      console.log('✅ Network comparison completed:', comparison)
      return comparison

    } catch (error) {
      console.error('❌ Failed to compare network configs:', error)
      throw error
    }
  }
}

// 创建全局实例
export const contractAddressService = new ContractAddressService()

// 辅助函数
export const contractAddressUtils = {
  // 格式化地址
  formatAddress: (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },

  // 检查地址是否有效
  isValidAddress: (address) => {
    try {
      return ethers.isAddress(address)
    } catch {
      return false
    }
  },

  // 获取区块浏览器链接
  getBlockExplorerLink: (address, type = 'address', network = 'sepolia') => {
    const baseUrls = {
      sepolia: 'https://sepolia.etherscan.io',
      mainnet: 'https://etherscan.io'
    }
    const baseUrl = baseUrls[network] || baseUrls.sepolia
    return `${baseUrl}/${type}/${address}`
  },

  // 生成合约验证报告
  generateVerificationReport: (verificationResults) => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        verified: 0,
        failed: 0,
        unconfigured: 0
      },
      details: {}
    }

    for (const [name, result] of Object.entries(verificationResults)) {
      report.summary.total++
      
      if (result.exists) {
        report.summary.verified++
        report.details[name] = { status: 'verified', address: result.address }
      } else if (result.error && result.error.includes('未配置')) {
        report.summary.unconfigured++
        report.details[name] = { status: 'unconfigured', error: result.error }
      } else {
        report.summary.failed++
        report.details[name] = { status: 'failed', error: result.error }
      }
    }

    return report
  }
}

export default contractAddressService

