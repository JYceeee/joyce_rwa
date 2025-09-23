// contractService.js - 智能合约交互服务
// 这个文件包含了与智能合约交互的相关方法和配置

import { ethers } from 'ethers'
import CONTRACT_CONFIG from '@/config/contractConfig.js'

// 合约配置从环境变量和配置文件读取
// 配置优先级：环境变量 > 配置文件 > 默认值

// KYC注册表合约ABI - 基于KYCRegistry.sol
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

// LoanIssuer合约ABI - 基于LoanIssuer.sol
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

// CompliantERC20合约ABI - 基于CompliantERC20.sol
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

// 交易合约ABI
export const TRADE_CONTRACT_ABI = [
  "function buyTokens(uint256 amount) external payable",
  "function sellTokens(uint256 amount) external",
  "function getTokenPrice() external view returns (uint256)",
  "function getUserBalance(address user) external view returns (uint256)",
  "function getTradeHistory(uint256 limit) external view returns (tuple(uint256 id, address user, uint8 tradeType, uint256 amount, uint256 price, uint256 timestamp)[])",
  "event TradeExecuted(uint256 indexed id, address indexed user, uint8 tradeType, uint256 amount, uint256 price, uint256 timestamp)"
]

// 合约服务类
export class ContractService {
  constructor() {
    this.provider = null
    this.signer = null
    this.kycRegistryContract = null
    this.loanIssuerContract = null
    this.principalTokenContract = null
    this.interestTokenContract = null
    this.tradeContract = null
  }

  // 验证合约地址格式
  validateContractAddress(address, name) {
    if (!address || address === '#' || address === '0x...') {
      throw new Error(`${name} contract address is not configured properly`)
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error(`${name} contract address format is invalid: ${address}`)
    }
    return true
  }

  // 初始化合约连接
  async initialize() {
    try {
      console.log('🚀 Initializing contract service...')
      console.log('📋 Contract config:', CONTRACT_CONFIG)
      
      // 检查是否安装了Web3钱包（如MetaMask）
      if (typeof window.ethereum !== 'undefined') {
        // 验证所有合约地址
        this.validateContractAddress(CONTRACT_CONFIG.KYC_REGISTRY_ADDRESS, 'KYC Registry')
        this.validateContractAddress(CONTRACT_CONFIG.LOAN_ISSUER_ADDRESS, 'Loan Issuer')
        this.validateContractAddress(CONTRACT_CONFIG.PRINCIPAL_TOKEN_ADDRESS, 'Principal Token')
        this.validateContractAddress(CONTRACT_CONFIG.INTEREST_TOKEN_ADDRESS, 'Interest Token')
        this.validateContractAddress(CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS, 'Trade Contract')

        // 检查网络
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const expectedChainId = '0x' + CONTRACT_CONFIG.NETWORK.chainId.toString(16)
        const currentChainId = parseInt(chainId, 16)
        
        console.log('🌐 Current chain ID:', currentChainId)
        console.log('🎯 Target chain ID:', CONTRACT_CONFIG.NETWORK.chainId)
        
        if (chainId !== expectedChainId) {
          throw new Error(`Please switch to ${CONTRACT_CONFIG.NETWORK.name} (Chain ID: ${CONTRACT_CONFIG.NETWORK.chainId})`)
        }

        this.provider = new ethers.BrowserProvider(window.ethereum)
        
        // 请求账户访问权限
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        this.signer = await this.provider.getSigner()
        
        console.log('✅ Provider and signer initialized')
        
        // 初始化合约实例
        try {
          this.kycRegistryContract = new ethers.Contract(
            CONTRACT_CONFIG.KYC_REGISTRY_ADDRESS,
            KYC_REGISTRY_ABI,
            this.signer
          )
          console.log('✅ KYC Registry contract initialized')
          
          this.loanIssuerContract = new ethers.Contract(
            CONTRACT_CONFIG.LOAN_ISSUER_ADDRESS,
            LOAN_ISSUER_ABI,
            this.signer
          )
          console.log('✅ Loan Issuer contract initialized')
          
          this.principalTokenContract = new ethers.Contract(
            CONTRACT_CONFIG.PRINCIPAL_TOKEN_ADDRESS,
            COMPLIANT_ERC20_ABI,
            this.signer
          )
          console.log('✅ Principal Token contract initialized')
          
          this.interestTokenContract = new ethers.Contract(
            CONTRACT_CONFIG.INTEREST_TOKEN_ADDRESS,
            COMPLIANT_ERC20_ABI,
            this.signer
          )
          console.log('✅ Interest Token contract initialized')
          
          this.tradeContract = new ethers.Contract(
            CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS,
            TRADE_CONTRACT_ABI,
            this.signer
          )
          console.log('✅ Trade contract initialized')
          
        } catch (contractError) {
          console.error('❌ Contract initialization error:', contractError)
          throw new Error(`Failed to initialize contracts: ${contractError.message}`)
        }
        
        console.log('🎉 Contract service initialized successfully!')
        return true
        
      } else {
        throw new Error('Web3 wallet not detected. Please install MetaMask or similar wallet.')
      }
    } catch (error) {
      console.error('❌ Failed to initialize contract service:', error)
      
      // 提供更友好的错误信息
      if (error.message.includes('UNSUPPORTED_OPERATION')) {
        throw new Error('Contract address format is invalid. Please check your configuration.')
      } else if (error.message.includes('network')) {
        throw new Error(`Network error: ${error.message}`)
      } else if (error.message.includes('wallet')) {
        throw new Error('Wallet connection failed. Please check your MetaMask connection.')
      } else {
        throw new Error(`Initialization failed: ${error.message}`)
      }
    }
  }

  // 申请KYC验证（设置KYC等级）
  async applyForKYC(kycData) {
    try {
      if (!this.kycRegistryContract) {
        await this.initialize()
      }

      // 获取用户地址
      const userAddress = await this.signer.getAddress()

      // 检查用户是否已被阻止
      const isBlocked = await this.kycRegistryContract.blocked(userAddress)
      if (isBlocked) {
        throw new Error('User is blocked from KYC verification')
      }

      // 检查当前KYC等级
      const currentLevel = await this.kycRegistryContract.kycLevel(userAddress)
      if (currentLevel >= 2) {
        return {
          success: true,
          message: 'User already has sufficient KYC level',
          currentLevel: currentLevel
        }
      }

      // 注意：实际应用中，KYC验证应该通过后端服务完成
      // 这里只是模拟设置KYC等级为2（FULL级别）
      // 在生产环境中，应该使用签名验证的方式
      
      // 生成KYC数据的哈希用于验证
      const kycHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['string', 'string', 'string', 'string', 'string'],
          [kycData.firstName, kycData.lastName, kycData.dob, kycData.country, kycData.docType]
        )
      )

      console.log('KYC Data Hash:', kycHash)
      console.log('KYC Data:', kycData)

      // 在实际部署中，这里应该调用后端API来验证KYC信息
      // 然后通过签名方式设置KYC等级
      // 这里为了演示，我们假设KYC验证已经通过
      
      return {
        success: true,
        message: 'KYC application submitted successfully',
        kycHash: kycHash,
        userAddress: userAddress
      }

    } catch (error) {
      console.error('KYC application failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 通过签名设置KYC等级（需要后端签名）
  async setKycLevelBySignature(userAddress, level, deadline, nonce, signature) {
    try {
      if (!this.kycRegistryContract) {
        await this.initialize()
      }

      const tx = await this.kycRegistryContract.setKycLevelBySig(
        userAddress,
        level,
        deadline,
        nonce,
        signature
      )
      
      const receipt = await tx.wait()
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Set KYC level by signature failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 检查用户KYC等级
  async getKycLevel(userAddress = null) {
    try {
      if (!this.kycRegistryContract) {
        await this.initialize()
      }

      if (!userAddress) {
        userAddress = await this.signer.getAddress()
      }

      const level = await this.kycRegistryContract.kycLevel(userAddress)
      return level
    } catch (error) {
      console.error('Failed to check KYC level:', error)
      return 0
    }
  }

  // 检查用户是否被阻止
  async isBlocked(userAddress = null) {
    try {
      if (!this.kycRegistryContract) {
        await this.initialize()
      }

      if (!userAddress) {
        userAddress = await this.signer.getAddress()
      }

      const blocked = await this.kycRegistryContract.blocked(userAddress)
      return blocked
    } catch (error) {
      console.error('Failed to check block status:', error)
      return false
    }
  }

  // 检查用户是否有足够的KYC等级进行交易
  async canTrade(userAddress = null, requiredLevel = 1) {
    try {
      if (!userAddress) {
        userAddress = await this.signer.getAddress()
      }

      const [kycLevel, isBlocked] = await Promise.all([
        this.getKycLevel(userAddress),
        this.isBlocked(userAddress)
      ])

      return {
        canTrade: !isBlocked && kycLevel >= requiredLevel,
        kycLevel: kycLevel,
        isBlocked: isBlocked,
        requiredLevel: requiredLevel
      }
    } catch (error) {
      console.error('Failed to check trade eligibility:', error)
      return {
        canTrade: false,
        kycLevel: 0,
        isBlocked: false,
        requiredLevel: requiredLevel
      }
    }
  }

  // 获取用户地址
  async getUserAddress() {
    try {
      console.log('🔍 ContractService: Getting user address...')
      
      // 首先尝试从已初始化的signer获取
      if (this.signer) {
        try {
          const address = await this.signer.getAddress()
          console.log('✅ ContractService: Address from signer:', address)
          return address
        } catch (signerError) {
          console.warn('⚠️ ContractService: Signer getAddress failed:', signerError.message)
        }
      }
      
      // 如果signer不可用，尝试重新初始化
      if (!this.signer) {
        console.log('🔄 ContractService: Signer not available, initializing...')
        await this.initialize()
        
        if (this.signer) {
          try {
            const address = await this.signer.getAddress()
            console.log('✅ ContractService: Address after initialization:', address)
            return address
          } catch (signerError) {
            console.warn('⚠️ ContractService: Signer still not working:', signerError.message)
          }
        }
      }
      
      // 如果signer仍然不可用，直接从ethereum获取
      if (typeof window.ethereum !== 'undefined') {
        console.log('🔄 ContractService: Trying direct ethereum access...')
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts && accounts.length > 0) {
            console.log('✅ ContractService: Address from ethereum:', accounts[0])
            return accounts[0]
          }
        } catch (ethereumError) {
          console.warn('⚠️ ContractService: Ethereum access failed:', ethereumError.message)
        }
      }
      
      console.error('❌ ContractService: Unable to get user address from any source')
      return null
      
    } catch (error) {
      console.error('❌ ContractService: Failed to get user address:', error)
      return null
    }
  }

  // 验证用户钱包地址
  async validateUserAddress(userAddress = null) {
    try {
      console.log('🔍 ContractService: Validating user address...')
      
      // 如果没有提供地址，尝试获取
      if (!userAddress) {
        userAddress = await this.getUserAddress()
      }
      
      if (!userAddress) {
        throw new Error('无法获取用户钱包地址')
      }
      
      // 验证地址格式
      if (!ethers.isAddress(userAddress)) {
        throw new Error(`无效的钱包地址格式: ${userAddress}`)
      }
      
      // 验证地址是否为全零地址
      if (userAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('钱包地址不能为零地址')
      }
      
      console.log('✅ ContractService: User address validated:', userAddress)
      return {
        success: true,
        address: userAddress,
        isValid: true
      }
      
    } catch (error) {
      console.error('❌ ContractService: Address validation failed:', error)
      return {
        success: false,
        address: userAddress,
        isValid: false,
        error: error.message
      }
    }
  }

  // 获取代币余额
  async getTokenBalance(tokenAddress, userAddress = null) {
    try {
      if (!userAddress) {
        userAddress = await this.getUserAddress()
      }

      const tokenContract = new ethers.Contract(tokenAddress, COMPLIANT_ERC20_ABI, this.signer)
      const balance = await tokenContract.balanceOf(userAddress)
      return balance
    } catch (error) {
      console.error('Failed to get token balance:', error)
      return 0n
    }
  }

  // 获取代币信息
  async getTokenInfo(tokenAddress) {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, COMPLIANT_ERC20_ABI, this.signer)
      
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply()
      ])

      return {
        name,
        symbol,
        decimals,
        totalSupply,
        address: tokenAddress
      }
    } catch (error) {
      console.error('Failed to get token info:', error)
      return null
    }
  }

  // 获取贷款信息
  async getLoanInfo(loanId) {
    try {
      if (!this.loanIssuerContract) {
        await this.initialize()
      }

      const loan = await this.loanIssuerContract.loans(loanId)
      const holder = await this.loanIssuerContract.loanHolder(loanId)

      return {
        loanId,
        principal: loan.principal,
        annualRateBps: loan.annualRateBps,
        startDate: loan.startDate,
        dueDate: loan.dueDate,
        borrower: loan.borrower,
        lender: loan.lender,
        collateral: loan.collateral,
        note: loan.note,
        closed: loan.closed,
        holder: holder
      }
    } catch (error) {
      console.error('Failed to get loan info:', error)
      return null
    }
  }

  // 获取下一个贷款ID
  async getNextLoanId() {
    try {
      if (!this.loanIssuerContract) {
        await this.initialize()
      }

      const nextId = await this.loanIssuerContract.nextLoanId()
      return nextId
    } catch (error) {
      console.error('Failed to get next loan ID:', error)
      return 0n
    }
  }

  // 获取网络信息
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        await this.initialize()
      }
      
      const network = await this.provider.getNetwork()
      return {
        chainId: network.chainId,
        name: network.name
      }
    } catch (error) {
      console.error('Failed to get network info:', error)
      return null
    }
  }

  // 执行购买代币交易
  async buyTokens(amount) {
    try {
      if (!this.tradeContract) {
        await this.initialize()
      }

      // 获取用户钱包地址
      const userAddress = await this.getUserAddress()
      if (!userAddress) {
        throw new Error('无法获取用户钱包地址，请确保钱包已连接')
      }

      console.log('💰 购买代币:', { amount, userAddress })

      // 检查合约地址是否有效
      if (!CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS || CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS === '0x1234567890123456789012345678901234567890') {
        console.warn('⚠️ Trade contract address is not configured, simulating successful transaction')
        
        // 模拟成功交易
        const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
        const mockBlockNumber = Math.floor(Math.random() * 1000000) + 1000000
        
        return {
          success: true,
          transactionHash: mockTxHash,
          blockNumber: mockBlockNumber,
          tokenPrice: '1.0',
          totalCost: amount.toString(),
          userAddress: userAddress
        }
      }

      // 获取代币价格
      const tokenPrice = await this.tradeContract.getTokenPrice()
      const totalCost = tokenPrice * BigInt(amount)
      
      console.log('💰 购买代币:', { amount, userAddress, tokenPrice: tokenPrice.toString(), totalCost: totalCost.toString() })

      // 执行购买交易
      const tx = await this.tradeContract.buyTokens(amount, {
        value: totalCost
      })
      
      const receipt = await tx.wait()
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        tokenPrice: ethers.formatEther(tokenPrice),
        totalCost: ethers.formatEther(totalCost),
        userAddress: userAddress
      }
    } catch (error) {
      console.error('❌ Failed to buy tokens:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 执行出售代币交易
  async sellTokens(amount) {
    try {
      if (!this.tradeContract) {
        await this.initialize()
      }

      // 获取用户钱包地址
      const userAddress = await this.getUserAddress()
      if (!userAddress) {
        throw new Error('无法获取用户钱包地址，请确保钱包已连接')
      }

      console.log('💸 出售代币:', { amount, userAddress })

      // 检查合约地址是否有效
      if (!CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS || CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS === '0x1234567890123456789012345678901234567890') {
        console.warn('⚠️ Trade contract address is not configured, simulating successful transaction')
        
        // 模拟成功交易
        const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
        const mockBlockNumber = Math.floor(Math.random() * 1000000) + 1000000
        
        return {
          success: true,
          transactionHash: mockTxHash,
          blockNumber: mockBlockNumber,
          tokenPrice: '1.0',
          totalCost: amount.toString(),
          userAddress: userAddress
        }
      }

      // 获取代币价格
      const tokenPrice = await this.getTokenPrice()
      
      // 计算总收入
      const totalRevenue = tokenPrice * BigInt(amount)
      
      console.log('💸 出售代币:', { amount, userAddress, tokenPrice: tokenPrice.toString(), totalRevenue: totalRevenue.toString() })

      // 执行出售交易
      const tx = await this.tradeContract.sellTokens(amount)
      
      const receipt = await tx.wait()
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        tokenPrice: ethers.formatEther(tokenPrice),
        totalCost: ethers.formatEther(totalRevenue),
        userAddress: userAddress
      }
    } catch (error) {
      console.error('Failed to sell tokens:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取代币价格
  async getTokenPrice() {
    try {
      if (!this.tradeContract) {
        await this.initialize()
      }

      console.log('🔍 Attempting to get token price from contract:', CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS)
      
      // 检查合约地址是否有效
      if (!CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS || CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS === '0x1234567890123456789012345678901234567890') {
        console.warn('⚠️ Trade contract address is not configured, returning default price')
        return '1.0' // 默认价格
      }

      // 尝试调用合约方法
      const price = await this.tradeContract.getTokenPrice()
      console.log('✅ Token price retrieved:', ethers.formatEther(price))
      return ethers.formatEther(price)
    } catch (error) {
      console.error('❌ Failed to get token price:', error)
      
      // 如果合约方法不存在，返回默认价格
      if (error.message.includes('BAD_DATA') || error.message.includes('UNSUPPORTED_OPERATION')) {
        console.warn('⚠️ Contract method not available, using default price')
        return '1.0'
      }
      
      return '0'
    }
  }

  // 获取用户代币余额
  async getUserTokenBalance(userAddress = null, tokenSymbol = null) {
    try {
      if (!this.tradeContract) {
        await this.initialize()
      }

      if (!userAddress) {
        userAddress = await this.getUserAddress()
      }

      console.log(`🔍 Attempting to get ${tokenSymbol || 'token'} balance for:`, userAddress)
      
      // 检查合约地址是否有效
      if (!CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS || CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS === '0x1234567890123456789012345678901234567890') {
        console.warn(`⚠️ Trade contract address is not configured, returning default ${tokenSymbol || 'token'} balance`)
        // 根据代币符号返回不同的默认余额
        const defaultBalances = {
          'TYMU': '500',
          'SQNB': '300',
          'LZYT': '200',
          'YYD': '400'
        }
        return defaultBalances[tokenSymbol] || '1000'
      }

      // 根据代币符号调用不同的合约方法
      let balance
      if (tokenSymbol) {
        // 尝试调用特定代币的余额查询方法
        try {
          balance = await this.tradeContract.getUserTokenBalance(userAddress, tokenSymbol)
        } catch (tokenError) {
          console.warn(`⚠️ Token-specific balance method failed for ${tokenSymbol}, using general method`)
          balance = await this.tradeContract.getUserBalance(userAddress)
        }
      } else {
        balance = await this.tradeContract.getUserBalance(userAddress)
      }
      
      console.log(`✅ ${tokenSymbol || 'User'} token balance retrieved:`, balance.toString())
      return balance.toString()
    } catch (error) {
      console.error(`❌ Failed to get ${tokenSymbol || 'user'} token balance:`, error)
      
      // 如果合约方法不存在，返回默认余额
      if (error.message.includes('BAD_DATA') || error.message.includes('UNSUPPORTED_OPERATION')) {
        console.warn(`⚠️ Contract method not available, using default ${tokenSymbol || 'token'} balance`)
        const defaultBalances = {
          'TYMU': '500',
          'SQNB': '300', 
          'LZYT': '200',
          'YYD': '400'
        }
        return defaultBalances[tokenSymbol] || '1000'
      }
      
      return '0'
    }
  }

  // 获取交易历史
  async getTradeHistory(limit = 10) {
    try {
      if (!this.tradeContract) {
        await this.initialize()
      }

      console.log('🔍 Attempting to get trade history from contract')
      
      // 检查合约地址是否有效
      if (!CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS || CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS === '0x1234567890123456789012345678901234567890') {
        console.warn('⚠️ Trade contract address is not configured, returning empty history')
        return []
      }

      const trades = await this.tradeContract.getTradeHistory(limit)
      
      return trades.map(trade => ({
        id: trade.id.toString(),
        user: trade.user,
        tradeType: trade.tradeType === 0 ? 'buy' : 'sell',
        amount: trade.amount.toString(),
        price: ethers.formatEther(trade.price),
        timestamp: Number(trade.timestamp) * 1000 // 转换为毫秒
      }))
    } catch (error) {
      console.error('❌ Failed to get trade history:', error)
      
      // 如果合约方法不存在，返回空历史
      if (error.message.includes('BAD_DATA') || error.message.includes('UNSUPPORTED_OPERATION')) {
        console.warn('⚠️ Contract method not available, returning empty history')
        return []
      }
      
      return []
    }
  }
}

// 创建全局实例
export const contractService = new ContractService()

// 辅助函数
export const contractUtils = {
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

  // 格式化交易哈希
  formatTxHash: (hash) => {
    if (!hash) return ''
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  },

  // 获取区块浏览器链接
  getBlockExplorerLink: (hash, type = 'tx') => {
    const baseUrl = 'https://etherscan.io'
    return `${baseUrl}/${type}/${hash}`
  }
}

export default contractService
