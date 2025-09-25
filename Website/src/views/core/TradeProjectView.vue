<template>
  <div class="trade-page">
    <!-- 余额不足弹窗 -->
    <div v-if="showInsufficientBalanceModal" class="modal-overlay" @click="closeInsufficientBalanceModal">
      <div class="modal-content error-modal" @click.stop>
        <div class="modal-header">
          <div class="error-icon">⚠️</div>
          <h2 class="modal-title">Insufficient Balance</h2>
        </div>
        <div class="modal-body">
          <div class="error-message">
            <p>Your token balance is insufficient to complete this transaction of  {{ projectCode }} .</p>
            <p><strong>Current Balance:</strong> {{ userTokenBalance }} {{ projectCode }} tokens</p>
            <p><strong>Required Amount:</strong> {{ tradeAmount }} {{ projectCode }} tokens</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn primary" @click="closeInsufficientBalanceModal">确定</button>
        </div>
      </div>
    </div>

    <!-- 加载中弹窗 -->
    <div v-if="showLoadingModal" class="modal-overlay">
      <div class="modal-content loading-modal" @click.stop>
        <div class="modal-header">
          <div class="loading-icon">
            <div class="spinner"></div>
          </div>
          <h2 class="modal-title">Processing...</h2>
        </div>
        <div class="modal-body">
          <div class="loading-message">
            <p>We are processing your transaction request, please wait...</p>
            <p class="loading-status">{{ loadingStatus }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易成功弹窗 -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content success-modal" @click.stop>
        <div class="modal-header">
          <div class="success-icon">✅</div>
          <h2 class="modal-title">Transaction Successful!</h2>
        </div>
        <div class="modal-body">
          <div class="success-details">
            <div class="detail-item">
              <span class="detail-label">Trade Type:</span>
              <span class="detail-value">{{ successData.tradeType === 'buy' ? '买入' : '卖出' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Trade Amount:</span>
              <span class="detail-value">{{ successData.amount }} 代币</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Trade Price:</span>
              <span class="detail-value">A${{ successData.price }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Trade Total:</span>
              <span class="detail-value">A${{ successData.total }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Trade Hash:</span>
              <span class="detail-value hash-value" @click="copyHash">{{ formatHash(successData.transactionHash) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Block Number:</span>
              <span class="detail-value">{{ successData.blockNumber }}</span>
            </div>
          </div>
          <div class="success-message">
            <p>🎉 Congratulations! Your transaction has been successfully completed and recorded on the blockchain.</p>
            <p>You can view the transaction record in the "Recent Trades" on the right.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeSuccessModal">关闭</button>
          <button class="btn primary" @click="viewOnEtherscan">在Etherscan查看</button>
        </div>
      </div>
    </div>

    <!-- 顶部面包屑导航 -->
    <header class="topbar container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <button class="crumb-back" @click="$router.back()" aria-label="Back">
          <svg viewBox="0 0 24 24" class="i">
            <path d="M10 19a1 1 0 0 1-.7-.3l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 1 1 1.4 1.4L4.41 11H21a1 1 0 1 1 0 2H4.41l6.3 6.3A1 1 0 0 1 10 19z"/>
          </svg>
        </button>
        <span class="sep">/</span>
        <span class="crumb">Projects</span>
        <span class="sep">/</span>
        <span class="crumb-current">Trade {{ projectCode }}</span>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <div class="container main-content">
      <!-- 项目信息卡片 -->
      <div class="project-info-card">
        <div class="project-header">
          <img :src="projectData.image" :alt="projectCode" class="project-image" />
          <div class="project-details">
            <h1 class="project-title">{{ projectData.code }} - {{ projectData.name }}</h1>
            <p class="project-subtitle">{{ projectData.subtitle }}</p>
            <div class="project-meta">
              <span class="meta-item">Type: {{ projectData.type }}</span>
              <span class="meta-item">Region: {{ projectData.region }}</span>
              <span class="meta-item">Risk: {{ projectData.risk }}</span>
            </div>
          </div>
        </div>
        
        <!-- 项目指标 -->
        <div class="project-metrics">
          <!-- <div class="metric-item">
            <span class="metric-label">Current Price</span>
            <span class="metric-value">{{ projectData.metrics.currentElaraPrice }}</span>
          </div> -->
          <div class="metric-item">
            <span class="metric-label">Property Value</span>
            <span class="metric-value">{{ projectData.metrics.collateralPropertyValue }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Loan Amount</span>
            <span class="metric-value">{{ projectData.loanAmount || 'TBA' }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Target Yield</span>
            <span class="metric-value">{{ projectData.metrics.targetLoanYield }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">LTV</span>
            <span class="metric-value">{{ projectData.ltv || 'TBA' }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Loan Term</span>
            <span class="metric-value">{{ projectData.loanTerm || 'TBA' }}</span>
          </div>
        </div>
      </div>

      <!-- 交易表单 -->
      <div class="trade-form-card">
        <h2 class="form-title">Trade {{ projectCode }}</h2>
        


        <!-- 交易数量 -->
        <div class="form-section">
          <h3 class="section-title">Amount</h3>
          <div class="amount-input-group">
            <input 
              type="number" 
              v-model="tradeAmount" 
              class="amount-input"
              placeholder="Enter amount"
              min="1"
              step="1"
              @input="clearError"
            />
            <span class="amount-unit">tokens</span>
          </div>
          <div class="amount-info">
            <!-- <span class="info-text">
              Current Price: {{ projectData.metrics.currentElaraPrice }} per token
            </span> -->
          </div>
        </div>

        <!-- 交易类型选择 -->
        <div class="form-section">
          <!-- <h3 class="section-title">Trade Type</h3> -->
          <div class="trade-type-buttons">
            <button 
              class="trade-type-btn" 
              :class="{ active: tradeType === 'buy' }"
              @click="selectTradeType('buy')"
              :disabled="loading"
            >
              <!-- <span class="btn-icon">📈</span> -->
              <span class="btn-text">Buy</span>
            </button>

            <button 
              class="trade-type-btn" 
              :class="{ active: tradeType === 'sell' }"
              @click="selectTradeType('sell')"
              :disabled="loading"
            >
              <!-- <span class="btn-icon">📉</span> -->
              <span class="btn-text">Sell</span>
            </button>
          </div>
        </div>

        <!-- 提交按钮 -->
        <!-- <div class="form-actions">
          <button class="btn secondary" @click="cancelTrade" :disabled="loading">Cancel</button>
          <button class="btn primary" @click="submitTrade" :disabled="!canSubmit">
            <span v-if="loading">Processing...</span>
            <span v-else>{{ tradeType === 'buy' ? 'Buy Tokens' : 'Sell Tokens' }}</span>
          </button>
        </div> -->
          
        <!-- 错误信息显示 -->
        <div v-if="formattedError" class="error-message">
          <div class="error-icon">⚠️</div>
          <div class="error-text">{{ formattedError }}</div>
        </div>
        </div>

      <!-- 交易历史 -->
      <div class="trade-history-card">
        <div class="card-header">
          <h2 class="card-title">Recent Trades</h2>
        </div>
        <div v-if="loading" class="loading-message">Loading trades...</div>
        <div v-else-if="projectTrades.length === 0" class="no-trades">No trades found for this project</div>
        <div v-else class="trade-list">
          <div v-for="trade in projectTrades" :key="trade.id" class="trade-item">
            <div class="trade-header">
              <span class="trade-type" :class="trade.type">{{ getTradeTypeDisplay(trade.type) }}</span>
              <span class="trade-time">{{ formatTime(trade.timestamp) }}</span>
          </div>
            <div class="trade-info">
              <div class="trade-project-section">
                <span class="label">Project:</span>
                <span class="value">{{ trade.project_code }} - {{ trade.project_name }}</span>
          </div>
              <div class="trade-amount-section">
                <span class="label">Token Amount:</span>
                <span class="value"> {{ trade.amount }} tokens</span>
              </div>
              <!-- Etherscan详情 -->
              <div v-if="trade.etherscan" class="trade-etherscan-section">
                <div class="etherscan-info">
                  <span class="label">Transaction Hash:</span>
                  <span class="value hash-value" @click="copyHash(trade.etherscan.hash)">{{ formatHash(trade.etherscan.hash) }}</span>
                </div>
                <div class="etherscan-info">
                  <span class="label">Status:</span>
                  <span class="value" :class="{ 'status-success': trade.etherscan.status === '0x1', 'status-failed': trade.etherscan.status === '0x0' }">
                    {{ trade.etherscan.status === '0x1' ? 'Success' : trade.etherscan.status === '0x0' ? 'Failed' : 'Pending' }}
                  </span>
                </div>
                <div class="etherscan-info">
                  <span class="label">Block:</span>
                  <span class="value">{{ trade.etherscan.blockNumber ? parseInt(trade.etherscan.blockNumber, 16).toLocaleString() : 'N/A' }}</span>
                </div>
                <div class="etherscan-info">
                  <span class="label">Timestamp:</span>
                  <span class="value">{{ formatEtherscanTime(trade.etherscan.timestamp) }}</span>
                </div>
                <div class="etherscan-info">
                  <span class="label">From:</span>
                  <span class="value">{{ formatAddress(trade.etherscan.from) }}</span>
                </div>
                <div class="etherscan-info">
                  <span class="label">To:</span>
                  <span class="value">{{ formatAddress(trade.etherscan.to) }}</span>
                </div>
                <div class="etherscan-info">
                  <span class="label">Value:</span>
                  <span class="value">{{ formatEtherValue(trade.etherscan.value) }} ETH</span>
                </div>
                <div class="etherscan-info">
                  <span class="label">Transaction Fee:</span>
                  <span class="value">{{ trade.etherscan.transactionFee ? trade.etherscan.transactionFee.toFixed(6) : 'N/A' }} ETH</span>
                </div>
                <div class="etherscan-info">
                  <span class="label">Gas Price:</span>
                  <span class="value">{{ trade.etherscan.gasPrice ? parseInt(trade.etherscan.gasPrice, 16).toLocaleString() : 'N/A' }} Gwei</span>
                </div>
              </div>
            </div>
            <!-- Etherscan链接 -->
            <div class="trade-footer" v-if="trade.etherscan && trade.etherscan.hash">
              <a :href="`https://sepolia.etherscan.io/tx/${trade.etherscan.hash}`" 
                 target="_blank" 
                 class="tx-link">
                🔗 View on Sepolia Etherscan
              </a>
            </div>
          </div>
          </div>
          </div>
        </div>


  </div>
</template>

<script>
import { products, productUtils } from '@/data/ProductDetailsInfo.js'
import { contractService } from '@/service/contractService.js'
import { getKycStatus, isKycVerified, getKycLevel, setKycLevel, KYC_STATUS, KYC_LEVELS } from '@/service/kycService.js'
import { useAuth } from '@/composables/useAuth.js'
import { useWallet } from '@/composables/useWallet.js'
import { isLoggedIn } from '@/utils/auth.js'

export default {
  name: 'TradeProjectView',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tradeType: 'buy',
      tradeAmount: '',
      recentTrades: [],
      successfulTrades: [],
      projectTrades: [],
      loading: false,
      error: null,
      errorType: null, // 错误类型
      showSuccessModal: false,
      showInsufficientBalanceModal: false,
      showLoadingModal: false,
      loadingStatus: '',
      userTokenBalance: 0,
      successData: {
        tradeType: '',
        amount: 0,
        transactionHash: '',
        blockNumber: 0
      },
      // 合约测试相关
      contractInitialized: false,
      contractLoading: false,
      contractStatus: null,
      testResults: [],
      userAddress: '',
      tokenPrice: '',
      userTokenBalance: '',
      tradeHistory: [],
      testAmount: '',
      // 错误消息映射
      errorMessages: {
        'insufficient_balance': 'You have insufficient funds',
        'input_required': 'Please enter the amount',
        'login_required': 'Please login to your account',
        'wallet_connection_required': 'Please connect your wallet',
        'address_retrieval_failed': 'Unable to retrieve wallet address',
        'kyc_verification_required': 'Please complete KYC verification',
        'whitelist_required': 'Your wallet is not whitelisted',
        'transaction_failed': 'Transaction failed',
        'network_error': 'Network error occurred',
        'unknown_error': 'An unknown error occurred'
      }
    }
  },
  computed: {
    projectCode() {
      return this.code || this.$route.params.code || 'TYMU'
    },
    projectData() {
      // 从ProductDetailsInfo获取项目数据
      const product = productUtils.getProductByCode(this.projectCode)
      
      if (product) {
        console.log('📊 TradeProjectView: 从ProductDetailsInfo获取项目数据:', product)
        
        // 构建符合模板需求的数据结构，完整映射ProductDetailsInfo.js中的所有字段
        return {
          // 基本信息
          code: product.code,
          name: product.name,
          image: product.image,
          subtitle: product.subtitle,
          type: product.type,
          region: product.region,
          risk: product.risk,
          targetYield: product.targetYield,
          status: product.status,
          summary: product.summary,
          
          // 投资信息
          totalOffering: product.totalOffering,
          subscribed: product.subscribed,
          totalSubscriptionTokens: product.totalSubscriptionTokens,
          subscribedTokens: product.subscribedTokens,
          
          // 计算指标
          metrics: {
            currentElaraPrice: this.calculateTokenPrice(product),
            collateralPropertyValue: product.valuation || 'TBA',
            rentalIncome: this.calculateRentalIncome(product),
            targetLoanYield: `${product.targetYield}% p.a.`
          },
          
          // Key Facts 关键信息
          loanAmount: product.loanAmount,
          annualInterestRate: product.annualInterestRate,
          loanTerm: product.loanTerm,
          ltv: product.ltv,
          drawdownDate: product.drawdownDate,
          earlyRepayment: product.earlyRepayment,
          repaymentArrangement: product.repaymentArrangement,
          
          // Parties 相关主体
          issuer: product.issuer,
          pwShareholders: product.pwShareholders,
          lender: product.lender,
          borrower: product.borrower,
          guarantor: product.guarantor,
          
          // Disbursement & Interest 放款和利息
          disbursementMethod: product.disbursementMethod,
          interest: product.interest,
          earlyRepaymentDetails: product.earlyRepaymentDetails,
          maturityDate: product.maturityDate,
          
          // Collateral 抵押品
          propertyAddress: product.propertyAddress,
          valuation: product.valuation,
          securityRank: product.securityRank,
          lvr: product.lvr,
          
          // Default & Remedies 违约和补救措施
          defaultInterestRate: product.defaultInterestRate,
          defaultTriggers: product.defaultTriggers,
          defaultProcess: product.defaultProcess,
          
          // On-Chain & Documents 链上和文档
          issuerToken: product.issuerToken,
          loanToken: product.loanToken,
          valuationReport: product.valuationReport,
          mortgageDeed: product.mortgageDeed
        }
      }
      
      // 如果找不到对应产品，返回默认数据
      // return {
      //   code: this.projectCode,
      //   name: `${this.projectCode} Property Loan`,
      //   image: '/pics/TYMU.png',
      //   subtitle: 'Property Investment Opportunity',
      //   type: 'residential',
      //   region: 'Unknown',
      //   risk: 'medium',
      //   targetYield: 6.0,
      //   status: 'active',
      //   metrics: {
      //     currentElaraPrice: 'A$1.00',
      //     collateralPropertyValue: 'TBA',
      //     rentalIncome: 'TBA',
      //     targetLoanYield: '6.0% p.a.'
      //   }
      // }
    },
    canSubmit() {
      return this.tradeAmount && this.tradeAmount > 0 && !this.loading
    },
    
    // 格式化的错误消息
    formattedError() {
      if (!this.error) return null
      
      // 如果有错误类型，使用映射的消息
      if (this.errorType && this.errorMessages[this.errorType]) {
        return this.errorMessages[this.errorType]
      }
      
      // 否则返回原始错误消息
      return this.error
    }
  },
  methods: {
    calculateTokenPrice(product) {
      // 基于目标收益率计算代币价格
      const basePrice = 1.00
      const yieldMultiplier = (product.targetYield || 6.0) / 6.0
      const adjustedPrice = basePrice * yieldMultiplier
      return `A$${adjustedPrice.toFixed(2)}`
    },
    
    calculateRentalIncome(product) {
      // 基于房产价值和收益率估算租金收入
      if (!product.valuation) return 'TBA'
      
      const valuationStr = product.valuation.replace(/[A$,]/g, '')
      const valuation = parseFloat(valuationStr)
      const monthlyYield = (product.targetYield || 6.0) / 12 / 100
      const estimatedRental = valuation * monthlyYield
      
      return `A$${estimatedRental.toLocaleString('en-AU', { maximumFractionDigits: 0 })} / month`
    },
    
    calculateTotal() {
      if (!this.tradeAmount) return '0.00'
      const amount = parseFloat(this.tradeAmount)
      // const price = 1.00 // 固定价格，从项目数据获取
      return (amount * price).toFixed(2)
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString()
    },

    // 从Etherscan API获取交易详情
    async fetchTransactionDetails(txHash) {
      try {
        console.log('🔍 正在从Etherscan获取交易详情:', txHash)
        
        // Etherscan Sepolia API (使用免费API，无需API Key)
        const apiUrl = `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`
        
        const response = await fetch(apiUrl)
        const data = await response.json()
        
        if (data.result) {
          console.log('✅ 成功获取交易详情:', data.result)
          
          // 获取交易收据
          const receiptUrl = `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}`
          const receiptResponse = await fetch(receiptUrl)
          const receiptData = await receiptResponse.json()
          
          return {
            success: true,
            transaction: data.result,
            receipt: receiptData.result,
            // 提取关键信息
            from: data.result.from,
            to: data.result.to,
            value: data.result.value,
            gasUsed: receiptData.result ? receiptData.result.gasUsed : null,
            gasPrice: data.result.gasPrice,
            blockNumber: data.result.blockNumber,
            blockHash: data.result.blockHash,
            status: receiptData.result ? receiptData.result.status : null
          }
        } else {
          console.warn('⚠️ 交易详情获取失败:', data.message)
          return {
            success: false,
            error: data.message || 'Failed to fetch transaction details'
          }
        }
      } catch (error) {
        console.error('❌ 获取交易详情时发生错误:', error)
        return {
          success: false,
          error: error.message
        }
      }
    },

    // 抓取用户在该项目中的所有交易记录
    async fetchProjectTrades() {
      try {
        this.loading = true
        console.log(`🔍 开始抓取用户${this.projectCode}项目的所有交易记录...`)
        
        // 获取用户地址
        const userAddress = await this.getUserAddress()
        if (!userAddress) {
          console.error('❌ 无法获取用户地址')
          return
        }
        
        // 使用Etherscan API获取交易记录
        const apiKey = 'YourEtherscanApiKey' // 需要替换为实际的API密钥
        const baseUrl = 'https://api-sepolia.etherscan.io/api'
        
        const response = await fetch(`${baseUrl}?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${apiKey}`)
        const data = await response.json()
        
        if (data.status === '1' && data.result && data.result.length > 0) {
          console.log(`✅ 找到 ${data.result.length} 条交易记录`)
          
          // 处理所有交易（包括成功和失败的）
          this.projectTrades = []
          for (const tx of data.result) {
            const tradeData = {
              id: `project_tx_${tx.hash}`,
              type: tx.isError === '0' ? 'successful_trade' : 'failed_trade',
              amount: 'N/A', // Etherscan API不提供token数量
              project_code: this.projectCode,
              project_name: this.projectData.name,
              timestamp: parseInt(tx.timeStamp) * 1000,
              transactionHash: tx.hash,
              etherscan: {
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                gasUsed: tx.gasUsed,
                gasPrice: tx.gasPrice,
                blockNumber: tx.blockNumber,
                status: tx.isError === '0' ? '0x1' : '0x0',
                transactionFee: (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / Math.pow(10, 18),
                timestamp: parseInt(tx.timeStamp) * 1000
              }
            }
            
            this.projectTrades.push(tradeData)
          }
          
          console.log(`✅ ${this.projectCode}项目交易记录抓取完成，共${this.projectTrades.length}条`)
        } else {
          console.log('📋 没有找到交易记录')
          this.projectTrades = []
        }
        
      } catch (error) {
        console.error('❌ 抓取项目交易失败:', error)
        this.projectTrades = []
      } finally {
        this.loading = false
      }
    },

    // 更新交易记录并获取Etherscan详情
    async updateTradeWithEtherscanDetails(tradeData) {
      try {
        console.log('🔄 更新交易记录并获取Etherscan详情...')
        
        // 获取Etherscan交易详情
        const etherscanData = await this.fetchTransactionDetails(tradeData.transactionHash)
        
        if (etherscanData.success) {
          // 合并Etherscan数据到交易记录
          const updatedTrade = {
            ...tradeData,
            // Etherscan数据
            etherscan: {
              from: etherscanData.from,
              to: etherscanData.to,
              value: etherscanData.value,
              gasUsed: etherscanData.gasUsed,
              gasPrice: etherscanData.gasPrice,
              blockNumber: etherscanData.blockNumber,
              blockHash: etherscanData.blockHash,
              status: etherscanData.status,
              // Etherscan链接
              etherscanUrl: `https://sepolia.etherscan.io/tx/${tradeData.transactionHash}`
            }
          }
          
          console.log('✅ 交易记录已更新Etherscan详情:', updatedTrade)
          return updatedTrade
        } else {
          console.warn('⚠️ 无法获取Etherscan详情，使用原始交易数据:', etherscanData.error)
          return tradeData
        }
      } catch (error) {
        console.error('❌ 更新交易记录时发生错误:', error)
        return tradeData
      }
    },
    cancelTrade() {
      this.$router.back()
    },

    // 选择交易类型并执行完整流程
    async selectTradeType(type) {
      // 设置交易类型
      this.tradeType = type
      
      // 如果没有输入金额，提示用户输入
      if (!this.tradeAmount || this.tradeAmount <= 0) {
        this.errorType = 'input_required'
        this.error = `请先输入${type === 'buy' ? '购买' : '出售'}数量`
        this.addTestResult('error', 'Input Required', `请先输入${type === 'buy' ? '购买' : '出售'}数量`)
        return
      }

      console.log(`🚀 开始${type}交易流程...`)
      this.addTestResult('info', `🚀 开始${type}交易流程...`, `正在处理${type}交易，数量: ${this.tradeAmount} tokens`)
      
      try {
        this.loading = true
        this.error = null

        // 1. 合约初始化
        this.loadingStatus = '正在初始化智能合约...'
        this.showLoadingModal = true
        this.addTestResult('info', '🚀 Initializing Contract', '正在初始化智能合约...')
        
        await this.initializeContract()
        console.log('✅ 合约初始化完成')
        this.addTestResult('success', 'Contract Initialized', '智能合约初始化完成')

        // 2. 验证用户是否已登录
        if (!isLoggedIn()) {
          this.showLoadingModal = false
          this.loading = false
          this.errorType = 'login_required'
          this.error = '请先登录账户'
          this.addTestResult('error', 'Authentication Required', '请先登录账户')
          return
        }
        
        // 3. 验证钱包是否已连接
        if (!this.isWalletConnected()) {
          this.showLoadingModal = false
          this.loading = false
          this.errorType = 'wallet_connection_required'
          this.error = '请先连接钱包'
          this.addTestResult('error', 'Wallet Connection Required', '请先连接钱包')
          return
        }
        
        // 4. 获取钱包地址
        this.loadingStatus = '正在获取钱包地址...'
        this.addTestResult('info', '👤 Getting User Address', '正在获取钱包地址...')
        const userAddress = await this.getUserAddress()
        if (!userAddress) {
          this.showLoadingModal = false
          this.loading = false
          this.errorType = 'address_retrieval_failed'
          this.error = '无法获取钱包地址，请检查钱包连接'
          this.addTestResult('error', 'Address Retrieval Failed', '无法获取钱包地址，请检查钱包连接')
          return
        }
        console.log('✅ 钱包地址获取完成:', userAddress)
        this.addTestResult('success', 'User Address Retrieved', `地址: ${userAddress}`)
        
        // 5. 验证并设置KYC状态（简化：通过KYC验证直接设置为Level 2）
        const kycStatus = getKycStatus()
        const kycLevel = getKycLevel()
        
        if (kycStatus !== KYC_STATUS.VERIFIED) {
          this.showLoadingModal = false
          this.loading = false
          this.errorType = 'kyc_verification_required'
          this.error = '请先完成KYC身份验证'
          this.addTestResult('error', 'KYC Verification Required', '请先完成KYC身份验证')
          return
        }
        
        // 简化：KYC验证成功时，自动设置为Level 2
        if (kycLevel < KYC_LEVELS.LEVEL_2) {
          console.log(`🔧 KYC验证成功，自动设置级别为 ${KYC_LEVELS.LEVEL_2}`)
          setKycLevel(KYC_LEVELS.LEVEL_2)
          this.addTestResult('info', 'KYC Level Set', `KYC级别已设置为${KYC_LEVELS.LEVEL_2}`)
        }

        // 6. 获取钱包代币余额
        this.loadingStatus = `正在获取${this.projectCode}代币余额...`
        this.addTestResult('info', '💰 Getting Token Balance', `正在获取${this.projectCode}代币余额...`)
        const balance = await contractService.getUserTokenBalance(userAddress, this.projectCode)
        this.userTokenBalance = parseInt(balance) || 0
        console.log(`✅ ${this.projectCode}代币余额获取完成:`, this.userTokenBalance)
        this.addTestResult('success', 'Token Balance Retrieved', `${this.projectCode}余额: ${this.userTokenBalance} tokens`)

        // 7. 比较余额与认购金额（仅对buy操作）
        if (type === 'buy') {
          console.log(`💰 ${this.projectCode}余额检查: ${this.userTokenBalance} vs ${this.tradeAmount}`)
          this.addTestResult('info', '💰 Checking Balance', `检查${this.projectCode}余额: ${this.userTokenBalance} vs ${this.tradeAmount}`)
          if (this.userTokenBalance < parseInt(this.tradeAmount)) {
            this.showLoadingModal = false
            this.loading = false
            this.showInsufficientBalanceModal = true
            this.addTestResult('error', 'Insufficient Balance', `${this.projectCode}余额不足: 当前${this.userTokenBalance}，需要${this.tradeAmount}`)
            return
          }
          console.log('✅ 余额充足，可以继续交易')
          this.addTestResult('success', 'Balance Check Passed', `${this.projectCode}余额充足: ${this.userTokenBalance} >= ${this.tradeAmount}`)
        }

        // 9. 签订智能合约
        this.loadingStatus = `正在与智能合约签订${type === 'buy' ? '购买' : '出售'}协议...`
        this.addTestResult('info', `📝 Executing ${type.toUpperCase()} Transaction`, `正在与智能合约签订${type === 'buy' ? '购买' : '出售'}协议...`)
        
        let result
        if (type === 'buy') {
          result = await contractService.buyTokens(parseInt(this.tradeAmount))
        } else {
          result = await contractService.sellTokens(parseInt(this.tradeAmount))
        }

        if (result.success) {
          console.log(`✅ ${type}交易成功:`, result)
          
          // 关闭加载弹窗
          this.showLoadingModal = false
          
          // 准备交易数据
      const tradeData = {
        projectCode: this.projectCode,
            tradeType: type,
            amount: parseInt(this.tradeAmount),
            price: result.tokenPrice || 1.00,
            total: result.totalCost || parseFloat(this.calculateTotal()),
            userAddress: userAddress,
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber,
            timestamp: Date.now()
          }
          
          // 创建基础交易记录
          const baseTradeData = {
            id: Date.now(),
            type: type, // 交易类型 (buy/sell)
            amount: this.tradeAmount, // 用户输入的token amount
            project_code: this.projectCode, // 项目代码
            project_name: this.projectData.name, // 项目名称
            timestamp: Date.now(), // 当前时间戳
            transactionHash: result.transactionHash
          }

          // 获取Etherscan详情并更新交易记录
          const updatedTradeData = await this.updateTradeWithEtherscanDetails(baseTradeData)
          
          // 更新本地交易历史
          this.recentTrades.unshift(updatedTradeData)
          
          // 通知WalletView更新活动记录
          this.notifyWalletActivity(updatedTradeData)
          
          // 显示成功弹窗
          this.showSuccessModal = true
          this.successData = {
            tradeType: type,
            amount: this.tradeAmount, // 使用用户输入的token amount
            price: tradeData.price,
            total: tradeData.total,
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber
          }
          
          // 添加成功测试结果
          this.addTestResult('success', `${type.toUpperCase()} Transaction Successful`, `交易成功完成`, {
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber,
            amount: tradeData.amount,
            price: result.tokenPrice,
            totalCost: result.totalCost,
            userAddress: userAddress
    })
    
    // 重置表单
    this.tradeAmount = ''
        } else {
          // 关闭加载弹窗
          this.showLoadingModal = false
          console.error(`❌ ${type}交易失败:`, result.error)
          this.errorType = 'transaction_failed'
          this.error = result.error || `${type}交易失败`
          this.addTestResult('error', `${type.toUpperCase()} Transaction Failed`, result.error || `${type}交易失败`)
        }
        
      } catch (error) {
        // 关闭加载弹窗
        this.showLoadingModal = false
        console.error('❌ 交易流程失败:', error)
        this.errorType = 'network_error'
        this.error = error.message
        this.addTestResult('error', 'Transaction Error', error.message)
      } finally {
        this.loading = false
      }
    },
    async submitTrade() {
      if (!this.canSubmit) return
      
      this.loading = true
      this.error = null
      
      try {
        // 添加测试结果 - 开始交易
        this.addTestResult('info', `🚀 开始${this.tradeType}交易...`, `正在处理${this.tradeType}交易，数量: ${this.tradeAmount} tokens`)
        
        // 1. 合约初始化
        this.addTestResult('info', '🚀 Initializing Contract', '正在初始化智能合约...')
        await this.initializeContract()
        this.addTestResult('success', 'Contract Initialized', '智能合约初始化完成')
        
        // 2. 验证用户是否已登录
        if (!isLoggedIn()) {
          this.addTestResult('error', 'Authentication Required', '请先登录账户')
          this.loading = false
          return
        }
        
        // 3. 验证钱包是否已连接
        if (!this.isWalletConnected()) {
          this.addTestResult('error', 'Wallet Connection Required', '请先连接钱包')
          this.loading = false
          return
        }
        
        // 4. 获取用户钱包地址
        const userAddress = await this.getUserAddress()
        if (!userAddress) {
          this.addTestResult('error', 'Address Retrieval Failed', '无法获取钱包地址，请检查钱包连接')
          this.loading = false
          return
        }
        
        this.addTestResult('success', 'User Address Retrieved', `地址: ${userAddress}`)
        
        // 5. 验证并设置KYC状态（简化：通过KYC验证直接设置为Level 2）
        const kycStatus = getKycStatus()
        const kycLevel = getKycLevel()
        
        if (kycStatus !== KYC_STATUS.VERIFIED) {
          this.addTestResult('error', 'KYC Verification Required', '请先完成KYC身份验证')
          this.loading = false
          return
        }
        
        // 简化：KYC验证成功时，自动设置为Level 2
        if (kycLevel < KYC_LEVELS.LEVEL_2) {
          console.log(`🔧 KYC验证成功，自动设置级别为 ${KYC_LEVELS.LEVEL_2}`)
          setKycLevel(KYC_LEVELS.LEVEL_2)
          this.addTestResult('info', 'KYC Level Set', `KYC级别已设置为${KYC_LEVELS.LEVEL_2}`)
        }
        
        // 6. 验证是否在白名单中
        this.loadingStatus = '正在检查白名单状态...'
        this.addTestResult('info', '🔍 Checking Whitelist Status', '正在检查白名单状态...')
        const isWhitelisted = await this.checkWhitelistStatus(userAddress)
        if (!isWhitelisted) {
          this.showLoadingModal = false
          this.loading = false
          this.errorType = 'whitelist_required'
          this.error = '您的钱包地址尚未加入白名单，请先完成白名单申请'
          this.addTestResult('error', 'Whitelist Required', '您的钱包地址尚未加入白名单，请先完成白名单申请')
          return
        }
        this.addTestResult('success', 'Whitelist Check Passed', '白名单验证通过')

        // 8. 如果是Buy操作，检查代币余额
        if (this.tradeType === 'buy') {
          this.loadingStatus = '正在获取用户代币余额...'
          this.showLoadingModal = true
          this.addTestResult('info', '💰 Checking Token Balance', '正在获取用户代币余额...')
          
          // 获取用户代币余额
          const balance = await contractService.getUserTokenBalance(userAddress, this.projectCode)
          this.userTokenBalance = parseInt(balance) || 0
          
          console.log(`💰 用户${this.projectCode}代币余额: ${this.userTokenBalance}, 认购数量: ${this.tradeAmount}`)
          
          // 检查余额是否足够
          if (this.userTokenBalance < parseInt(this.tradeAmount)) {
            this.showLoadingModal = false
            this.loading = false
            this.showInsufficientBalanceModal = true
            this.addTestResult('error', 'Insufficient Balance', `${this.projectCode}余额不足: 当前${this.userTokenBalance}，需要${this.tradeAmount}`)
            return
          }
          
          // 余额足够，继续交易
          this.loadingStatus = '余额充足，正在处理交易...'
          this.addTestResult('success', 'Balance Check Passed', `${this.projectCode}余额充足: ${this.userTokenBalance} >= ${this.tradeAmount}`)
        }
      
        console.log(`🚀 开始${this.tradeType}交易...`)
        
        // 8. 执行交易 - 整合Test Buy/Test Sell的逻辑
        let result
        if (this.tradeType === 'buy') {
          this.loadingStatus = '正在与智能合约签订购买协议...'
          this.addTestResult('info', '📈 Executing Buy Transaction', `正在购买 ${this.tradeAmount} tokens`)
          result = await contractService.buyTokens(parseInt(this.tradeAmount))
        } else {
          this.loadingStatus = '正在与智能合约签订出售协议...'
          this.addTestResult('info', '📉 Executing Sell Transaction', `正在出售 ${this.tradeAmount} tokens`)
          result = await contractService.sellTokens(parseInt(this.tradeAmount))
        }
        
        if (result.success) {
          console.log(`✅ ${this.tradeType}交易成功:`, result)
          
          // 关闭加载弹窗
          this.showLoadingModal = false
          
          // 添加成功测试结果 - 来自Test Buy/Sell的逻辑
          this.addTestResult('success', `${this.tradeType.toUpperCase()} Transaction Successful`, `Tx Hash: ${result.transactionHash}`, {
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber,
            amount: this.tradeAmount,
            price: result.tokenPrice,
            totalCost: result.totalCost
          })
          
          
          // 创建基础交易记录
          const baseTradeData = {
            id: Date.now(),
            type: this.tradeType, // 交易类型 (buy/sell)
            amount: this.tradeAmount, // 用户输入的token amount
            project_code: this.projectCode, // 项目代码
            project_name: this.projectData.name, // 项目名称
            timestamp: Date.now(), // 当前时间戳
            transactionHash: result.transactionHash
          }

          // 获取Etherscan详情并更新交易记录
          const updatedTradeData = await this.updateTradeWithEtherscanDetails(baseTradeData)
          
          // 更新本地交易历史
          this.recentTrades.unshift(updatedTradeData)
          
          // 通知WalletView更新活动记录
          this.notifyWalletActivity(updatedTradeData)
          
          // 显示成功弹窗
          this.showSuccessModal = true
          this.successData = {
            tradeType: this.tradeType,
            amount: this.tradeAmount, // 使用用户输入的token amount
            price: result.tokenPrice || 1.00,
            total: result.totalCost || parseFloat(this.calculateTotal()),
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber
          }
          
          // 重置表单
          this.tradeAmount = ''
        } else {
          // 关闭加载弹窗
          this.showLoadingModal = false
          console.error(`❌ ${this.tradeType}交易失败:`, result.error)
          this.errorType = 'transaction_failed'
          this.error = result.error || `${this.tradeType}交易失败`
          this.addTestResult('error', `${this.tradeType.toUpperCase()} Transaction Failed`, result.error)
        }
        
      } catch (error) {
        // 关闭加载弹窗
        this.showLoadingModal = false
        console.error('❌ 交易失败:', error)
        this.errorType = 'network_error'
        this.error = error.message
        this.addTestResult('error', 'Transaction Error', error.message)
        this.$emit('notify', `Trade failed: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    
    
    
    // 获取用户地址（用于交易验证）
    async getUserAddress() {
      try {
        console.log('🔍 TradeProjectView: 正在获取用户钱包地址...')
        
        // 1. 优先从localStorage获取WalletView绑定的钱包地址
        const savedAccounts = localStorage.getItem('walletBoundAccounts')
        if (savedAccounts) {
          try {
            const boundAddresses = JSON.parse(savedAccounts)
            if (boundAddresses && boundAddresses.length > 0) {
              // 使用第一个绑定的钱包地址（或者可以根据需要选择特定的地址）
              const selectedAddress = boundAddresses[0]
              console.log('✅ TradeProjectView: 从WalletView获取绑定地址:', selectedAddress)
              return selectedAddress
            }
          } catch (parseError) {
            console.warn('⚠️ TradeProjectView: 解析walletBoundAccounts失败:', parseError)
          }
        }
        
        // 2. 如果localStorage中没有绑定地址，尝试从useWallet获取
        const { fullAddress, connected } = useWallet()
        if (connected.value && fullAddress.value) {
          console.log('⚠️ TradeProjectView: 使用useWallet地址作为备用:', fullAddress.value)
          return fullAddress.value
        }
        
        // 3. 最后的备用方案：直接从ethereum获取
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts && accounts.length > 0) {
            console.log('⚠️ TradeProjectView: 使用ethereum地址作为最后备用:', accounts[0])
            return accounts[0]
          }
        }
        
        console.error('❌ TradeProjectView: 无法从任何来源获取用户地址')
        return null
        
      } catch (error) {
        console.error('❌ TradeProjectView: 获取用户地址失败:', error)
        return null
      }
    },
    
    // 关闭成功弹窗
    closeSuccessModal() {
      this.showSuccessModal = false
      this.successData = {
        tradeType: '',
        amount: 0,
        price: 0,
        total: 0,
        transactionHash: '',
        blockNumber: 0
      }
    },

    // 关闭余额不足弹窗
    closeInsufficientBalanceModal() {
      this.showInsufficientBalanceModal = false
    },
    
    // 清除错误消息
    clearError() {
      this.error = null
      this.errorType = null
    },
    
    // 格式化哈希地址
    formatHash(hash) {
      if (!hash) return ''
      return `${hash.slice(0, 6)}...${hash.slice(-4)}`
    },
    
    // 复制哈希到剪贴板
    async copyHash() {
      try {
        await navigator.clipboard.writeText(this.successData.transactionHash)
        this.$emit('notify', '交易哈希已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
        this.$emit('notify', '复制失败，请手动复制')
      }
    },
    
    // 在Etherscan查看交易
    viewOnEtherscan() {
      const chainId = this.getCurrentChainId()
      let baseUrl = 'https://etherscan.io'
      
      // 根据网络选择正确的区块浏览器
      if (chainId === 11155111) {
        baseUrl = 'https://sepolia.etherscan.io'
      } else if (chainId === 5) {
        baseUrl = 'https://goerli.etherscan.io'
      } else if (chainId === 137) {
        baseUrl = 'https://polygonscan.com'
      } else if (chainId === 80001) {
        baseUrl = 'https://mumbai.polygonscan.com'
      }
      
      const url = `${baseUrl}/tx/${this.successData.transactionHash}`
      window.open(url, '_blank')
    },
    
    // 获取当前链ID
    getCurrentChainId() {
      // 这里可以从合约配置中获取
      return 11155111 // Sepolia测试网
    },

    // ========== 合约测试方法 ==========
    
    // 初始化合约
    async initializeContract() {
      try {
        this.contractLoading = true
        this.addTestResult('info', '🚀 Initializing contract service...', 'Starting contract initialization')
        
        await contractService.initialize()
        this.contractInitialized = true
        
        this.contractStatus = {
          type: 'success',
          icon: '✅',
          message: 'Contract service initialized successfully!'
        }
        
        this.addTestResult('success', 'Contract Initialized', 'Contract service is ready', {
          initialized: true,
          timestamp: Date.now()
        })
        
      } catch (error) {
        this.contractStatus = {
          type: 'error',
          icon: '❌',
          message: `Initialization failed: ${error.message}`
        }
        
        this.addTestResult('error', 'Contract Initialization Failed', error.message)
        console.error('Contract initialization failed:', error)
      } finally {
        this.contractLoading = false
      }
    },

    // 获取用户地址（测试用）
    async testGetUserAddress() {
      try {
        this.contractLoading = true
        this.addTestResult('info', '👤 Fetching user address...', 'Getting connected wallet address')
        
        // 1. 优先从localStorage获取WalletView绑定的钱包地址
        const savedAccounts = localStorage.getItem('walletBoundAccounts')
        if (savedAccounts) {
          try {
            const boundAddresses = JSON.parse(savedAccounts)
            if (boundAddresses && boundAddresses.length > 0) {
              this.userAddress = boundAddresses[0]
              this.addTestResult('success', 'User Address from WalletView', `Address: ${this.userAddress}`, {
                address: this.userAddress,
                shortAddress: this.formatAddress(this.userAddress),
                source: 'WalletView Bound Accounts',
                boundAccountsCount: boundAddresses.length
              })
              return
            }
          } catch (parseError) {
            this.addTestResult('warning', 'Parse walletBoundAccounts failed', parseError.message)
          }
        }
        
        // 2. 如果localStorage中没有绑定地址，尝试从useWallet获取
        const { fullAddress, connected } = useWallet()
        if (connected.value && fullAddress.value) {
          this.userAddress = fullAddress.value
          this.addTestResult('warning', 'Address from useWallet (No bound accounts)', `Address: ${this.userAddress}`, {
            address: this.userAddress,
            shortAddress: this.formatAddress(this.userAddress),
            source: 'useWallet composable'
          })
          return
        }
        
        // 3. 最后的备用方案：直接从ethereum获取
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts && accounts.length > 0) {
            this.userAddress = accounts[0]
            this.addTestResult('warning', 'Address from ethereum (Fallback)', `Address: ${this.userAddress}`, {
              address: this.userAddress,
              shortAddress: this.formatAddress(this.userAddress),
              source: 'ethereum.accounts'
            })
            return
          }
        }
        
        this.addTestResult('error', 'No Wallet Address Found', 'Please connect your wallet in WalletView first', {
          localStorageEmpty: !savedAccounts,
          useWalletConnected: connected.value,
          useWalletAddress: fullAddress.value,
          ethereumAvailable: typeof window.ethereum !== 'undefined'
        })
        
      } catch (error) {
        this.addTestResult('error', 'Failed to Get User Address', error.message)
        console.error('Failed to get user address:', error)
      } finally {
        this.contractLoading = false
      }
    },

    // 获取代币价格
    async getTokenPrice() {
      try {
        this.contractLoading = true
        this.addTestResult('info', '💰 Fetching token price...', 'Getting current token price')
        
        this.tokenPrice = await contractService.getTokenPrice()
        
        this.addTestResult('success', 'Token Price Retrieved', `Price: ${this.tokenPrice} ETH`, {
          price: this.tokenPrice,
          currency: 'ETH'
        })
        
      } catch (error) {
        this.addTestResult('error', 'Failed to Get Token Price', error.message)
        console.error('Failed to get token price:', error)
      } finally {
        this.contractLoading = false
      }
    },

    // 获取用户代币余额
    async getUserTokenBalance() {
      try {
        this.contractLoading = true
        this.addTestResult('info', '💳 Fetching user token balance...', `Getting ${this.projectCode} token balance`)
        
        this.userTokenBalance = await contractService.getUserTokenBalance(null, this.projectCode)
        
        this.addTestResult('success', 'User Token Balance Retrieved', `${this.projectCode} Balance: ${this.userTokenBalance}`, {
          balance: this.userTokenBalance,
          address: this.userAddress,
          tokenSymbol: this.projectCode
        })
        
      } catch (error) {
        this.addTestResult('error', 'Failed to Get User Token Balance', error.message)
        console.error('Failed to get user token balance:', error)
      } finally {
        this.contractLoading = false
      }
    },

    // 获取交易历史
    async getTradeHistory() {
      try {
        this.contractLoading = true
        this.addTestResult('info', ' Fetching trade history...', 'Getting recent trade records')
        
        this.tradeHistory = await contractService.getTradeHistory()
        
        this.addTestResult('success', 'Trade History Retrieved', `Found ${this.tradeHistory.length} trade records`, {
          trades: this.tradeHistory,
          count: this.tradeHistory.length
        })
        
      } catch (error) {
        this.addTestResult('error', 'Failed to Get Trade History', error.message)
        console.error('Failed to get trade history:', error)
      } finally {
        this.contractLoading = false
      }
    },

    // 测试买入交易
    async testBuyTransaction() {
      try {
        this.contractLoading = true
        this.addTestResult('info', '📈 Testing buy transaction...', `Testing buy of ${this.testAmount} tokens`)
        
        // 验证权限
        if (!isLoggedIn()) {
          this.addTestResult('error', 'Authentication Required', '请先登录账户')
          return
        }
        
        if (!this.isWalletConnected()) {
          this.addTestResult('error', 'Wallet Connection Required', '请先连接钱包')
          return
        }
        
        const userAddress = await this.getUserAddress()
        if (!userAddress) {
          this.addTestResult('error', 'Address Retrieval Failed', '无法获取钱包地址，请检查钱包连接')
          return
        }
        
        const kycStatus = getKycStatus()
        const kycLevel = getKycLevel()
        
        if (kycStatus !== KYC_STATUS.VERIFIED) {
          this.addTestResult('error', 'KYC Verification Required', '请先完成KYC身份验证')
          return
        }
        
        // KYC验证成功时，如果级别不足，自动设置为Level 2
        if (kycLevel < KYC_LEVELS.LEVEL_2) {
          console.log(`🔧 KYC验证成功，自动升级级别从 ${kycLevel} 到 ${KYC_LEVELS.LEVEL_2}`)
          setKycLevel(KYC_LEVELS.LEVEL_2)
          this.addTestResult('info', 'KYC Level Updated', `KYC级别已自动从${kycLevel}升级到${KYC_LEVELS.LEVEL_2}`)
        }
        
        // const isWhitelisted = await this.checkWhitelistStatus(userAddress)
        // if (!isWhitelisted) {
        //   this.addTestResult('error', 'Whitelist Required', '您的钱包地址尚未加入白名单')
        //   return
        // }
        
        const result = await contractService.buyTokens(this.testAmount)
        
        if (result.success) {
          this.addTestResult('success', 'Buy Transaction Successful', `Tx Hash: ${result.transactionHash}`, {
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber,
            amount: this.testAmount,
            price: result.tokenPrice,
            totalCost: result.totalCost
          })
          
          
          // 创建基础交易记录
          const baseTradeData = {
            id: Date.now(),
            type: 'buy',
            amount: this.testAmount, // 使用testAmount
            project_code: this.projectCode,
            project_name: this.projectData.name,
            timestamp: Date.now(),
            transactionHash: result.transactionHash
          }

          // 获取Etherscan详情并更新交易记录
          const updatedTradeData = await this.updateTradeWithEtherscanDetails(baseTradeData)
          
          // 更新本地交易历史
          this.recentTrades.unshift(updatedTradeData)
          
          // 通知WalletView更新活动记录
          this.notifyWalletActivity(updatedTradeData)
        } else {
          this.addTestResult('error', 'Buy Transaction Failed', result.error)
        }
        
      } catch (error) {
        this.addTestResult('error', 'Buy Transaction Error', error.message)
        console.error('Buy transaction failed:', error)
      } finally {
        this.contractLoading = false
      }
    },

    // 测试卖出交易
    async testSellTransaction() {
      try {
        this.contractLoading = true
        this.addTestResult('info', '📉 Testing sell transaction...', `Testing sell of ${this.testAmount} tokens`)
        
        // 验证权限
        if (!isLoggedIn()) {
          this.addTestResult('error', 'Authentication Required', '请先登录账户')
          return
        }
        
        if (!this.isWalletConnected()) {
          this.addTestResult('error', 'Wallet Connection Required', '请先连接钱包')
          return
        }
        
        const userAddress = await this.getUserAddress()
        if (!userAddress) {
          this.addTestResult('error', 'Address Retrieval Failed', '无法获取钱包地址，请检查钱包连接')
          return
        }
        
        const kycStatus = getKycStatus()
        const kycLevel = getKycLevel()
        
        if (kycStatus !== KYC_STATUS.VERIFIED) {
          this.addTestResult('error', 'KYC Verification Required', '请先完成KYC身份验证')
          return
        }
        
        // KYC验证成功时，如果级别不足，自动设置为Level 2
        if (kycLevel < KYC_LEVELS.LEVEL_2) {
          console.log(`🔧 KYC验证成功，自动升级级别从 ${kycLevel} 到 ${KYC_LEVELS.LEVEL_2}`)
          setKycLevel(KYC_LEVELS.LEVEL_2)
          this.addTestResult('info', 'KYC Level Updated', `KYC级别已自动从${kycLevel}升级到${KYC_LEVELS.LEVEL_2}`)
        }
        
        const isWhitelisted = await this.checkWhitelistStatus(userAddress)
        if (!isWhitelisted) {
          this.addTestResult('error', 'Whitelist Required', '您的钱包地址尚未加入白名单')
          return
        }
        
        const result = await contractService.sellTokens(this.testAmount)
        
        if (result.success) {
          this.addTestResult('success', 'Sell Transaction Successful', `Tx Hash: ${result.transactionHash}`, {
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber,
            amount: this.testAmount,
            price: result.tokenPrice,
            totalCost: result.totalCost
          })
          
          
          // 创建基础交易记录
          const baseTradeData = {
            id: Date.now(),
            type: 'sell',
            amount: this.testAmount, // 使用testAmount
            project_code: this.projectCode,
            project_name: this.projectData.name,
            timestamp: Date.now(),
            transactionHash: result.transactionHash
          }

          // 获取Etherscan详情并更新交易记录
          const updatedTradeData = await this.updateTradeWithEtherscanDetails(baseTradeData)
          
          // 更新本地交易历史
          this.recentTrades.unshift(updatedTradeData)
          
          // 通知WalletView更新活动记录
          this.notifyWalletActivity(updatedTradeData)
        } else {
          this.addTestResult('error', 'Sell Transaction Failed', result.error)
        }
        
      } catch (error) {
        this.addTestResult('error', 'Sell Transaction Error', error.message)
        console.error('Sell transaction failed:', error)
      } finally {
        this.contractLoading = false
      }
    },


    // 添加测试结果
    addTestResult(type, title, message, data = null) {
      const result = {
        type,
        title,
        message,
        data,
        timestamp: Date.now(),
        icon: this.getResultIcon(type)
      }
      
      this.testResults.unshift(result)
      
      // 限制结果数量
      if (this.testResults.length > 20) {
        this.testResults = this.testResults.slice(0, 20)
      }
    },

    // 获取结果图标
    getResultIcon(type) {
      const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
      }
      return icons[type] || '📝'
    },

    // 清除测试结果
    clearResults() {
      this.testResults = []
    },

    // 运行所有测试
    async runAllTests() {
      if (!this.contractInitialized) {
        await this.initializeContract()
      }
      
      if (this.contractInitialized) {
        await this.testGetUserAddress()
        await this.getTokenPrice()
        await this.getUserTokenBalance()
        await this.getTradeHistory()
        await this.testBuyTransaction(
          this.tradeAmount=3
        )
        await this.testSellTransaction(
          this.tradeAmount=3
        )
      }
    },

    // 格式化地址
    formatAddress(address) {
      if (!address) return ''
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    },

    // 格式化ETH值
    formatEtherValue(hexValue) {
      if (!hexValue) return '0'
      try {
        const wei = BigInt(hexValue)
        const eth = Number(wei) / Math.pow(10, 18)
        return eth.toFixed(6)
      } catch (error) {
        console.error('Error formatting ETH value:', error)
        return '0'
      }
    },

    // 格式化哈希值
    formatHash(hash) {
      if (!hash) return 'N/A'
      return `${hash.slice(0, 10)}...${hash.slice(-8)}`
    },

    // 格式化Etherscan时间戳
    formatEtherscanTime(timestamp) {
      if (!timestamp) return 'N/A'
      return new Date(timestamp).toLocaleString()
    },

    // 复制哈希值
    copyHash(hash) {
      if (!hash) return
      navigator.clipboard.writeText(hash).then(() => {
        console.log('✅ 哈希值已复制到剪贴板')
      }).catch(err => {
        console.error('❌ 复制失败:', err)
      })
    },

    // 获取交易类型显示文本
    getTradeTypeDisplay(type) {
      const typeMap = {
        'successful_trade': 'SUCCESS',
        'failed_trade': 'FAILED',
        'buy': 'BUY',
        'sell': 'SELL'
      }
      return typeMap[type] || type.toUpperCase()
    },

    // 通知WalletView更新活动记录
    notifyWalletActivity(activityData) {
      try {
        console.log('📢 通知WalletView更新活动记录:', activityData)
        
        // 通过localStorage存储活动记录，WalletView会监听这个变化
        const currentActivity = JSON.parse(localStorage.getItem('walletActivity') || '[]')
        currentActivity.unshift(activityData)
        
        // 限制最多保存50条记录
        if (currentActivity.length > 50) {
          currentActivity.splice(50)
        }
        
        localStorage.setItem('walletActivity', JSON.stringify(currentActivity))
        
        // 触发自定义事件，通知WalletView刷新
        window.dispatchEvent(new CustomEvent('walletActivityUpdated', {
          detail: activityData
        }))
        
        console.log('✅ WalletView活动记录更新通知已发送')
        
      } catch (error) {
        console.error('❌ 通知WalletView更新活动记录失败:', error)
      }
    },
    
    // 检查白名单状态（简化逻辑）
    async checkWhitelistStatus(address) {
      try {
        console.log('🔍 检查白名单状态:', address)
        
        // 简化：优先检查KYC状态
        const kycLevel = getKycLevel()
        const kycStatus = getKycStatus()
        
        if (kycStatus === KYC_STATUS.VERIFIED && kycLevel >= KYC_LEVELS.LEVEL_2) {
          console.log('✅ KYC Level 2用户，自动通过白名单检查')
          return true
        }
        
        // 使用contractService检查白名单状态
        const statusData = await contractService.getWhitelistStatus(address)
        console.log('✅ 白名单状态检查结果:', statusData)
        
        // 只有approved状态才允许交易
        return statusData.status === 'approved'
      } catch (error) {
        console.error('❌ 检查白名单状态失败:', error)
        return false
      }
    },

    // 检查钱包连接状态
    isWalletConnected() {
      try {
        const { connected, fullAddress } = useWallet()
        const isConnected = connected.value && fullAddress.value
        console.log('TradeProjectView: 钱包连接状态检查:', {
          connected: connected.value,
          hasAddress: !!fullAddress.value,
          address: fullAddress.value,
          isConnected
        })
        return isConnected
      } catch (error) {
        console.error('检查钱包连接状态失败:', error)
        return false
      }
    },
    
    // 添加演示交易记录
    addDemoTrades() {
      // 如果recentTrades为空，添加一些演示数据
      if (this.recentTrades.length === 0) {
        const demoTime = Date.now()
        this.recentTrades = [
          {
            id: demoTime - 3600000, // 1小时前
            type: 'buy', // 交易类型
            amount: 100, // 用户输入的token amount
            project_code: this.projectCode || 'TYMU', // 项目代码
            project_name: this.projectData?.name || 'St Ives NSW Residential Project', // 项目名称
            timestamp: demoTime - 3600000, // 当前时间戳
            transactionHash: '0xabc123def4567890...'
          },
          {
            id: demoTime - 1800000, // 30分钟前
            type: 'sell', // 交易类型
            amount: 50, // 用户输入的token amount
            project_code: this.projectCode || 'TYMU', // 项目代码
            project_name: this.projectData?.name || 'St Ives NSW Residential Project', // 项目名称
            timestamp: demoTime - 1800000, // 当前时间戳
            transactionHash: '0xdef456abc1237890...'
          }
        ]
        console.log('📊 添加了演示交易记录:', this.recentTrades.length, '条')
      }
    }
  },
  async mounted() {
    // 初始化useWallet
    try {
      const { connected, fullAddress } = useWallet()
      console.log('TradeProjectView: Wallet connection status:', connected.value)
      console.log('TradeProjectView: Wallet address:', fullAddress.value)
    } catch (error) {
      console.error('TradeProjectView: Failed to initialize wallet:', error)
    }

    // 可以从sessionStorage获取项目信息
    try {
      const storedProject = sessionStorage.getItem('lastProduct')
      if (storedProject) {
        const project = JSON.parse(storedProject)
        console.log('Loaded project from session:', project)
      }
    } catch (e) {
      console.log('No project data in session storage')
    }
    
    // 添加演示交易记录（如果没有真实数据）
    this.addDemoTrades()
    
    // 自动抓取用户在该项目中的所有交易记录
    this.fetchProjectTrades()
  }
}
</script>

<style scoped>
/* —— 采用PortfolioView的深色主题 —— */
:root { 
  --bg:#f6f7fb; 
  --panel:#fff; 
  --text:#0b1020; 
  --muted:#6b7280; 
  --muted-2:#9aa3b2; 
  --border:#e6e8ef; 
  --shadow:0 6px 20px rgba(15,23,42,.06); 
  --primary:#3b82f6; 
  --primary-ink:#1e40af; 
  --danger:#ef4444; 
  --dark-bg:#141426;
  --dark-panel:#1f2937;
  --dark-border:#374151;
  --dark-text:#ffffff;
  --dark-muted:#9ca3af;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.trade-page {
  background: var(--dark-bg);
  min-height: 100vh;
  color: var(--dark-text);
}

/* 顶部导航 */
.topbar {
  background: var(--dark-bg);
  border-bottom: 1px solid var(--dark-border);
  padding: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dark-muted);
}

.crumb-back {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--dark-muted);
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.crumb-back:hover {
  background: var(--dark-panel);
  color: var(--dark-text);
}

.crumb {
  color: var(--dark-muted);
}

.crumb-current {
  color: var(--dark-text);
  font-weight: 600;
}

.sep {
  color: var(--dark-border);
}

.i {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* 主要内容 */
.main-content {
  padding: 30px 0;
  display: grid;
  gap: 30px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 
    "project-info project-info"
    "trade-form trade-history";
}

/* 项目信息卡片 */
.project-info-card {
  grid-area: project-info;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--shadow);
}

.project-header {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.project-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.project-details {
  flex: 1;
}

.project-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 8px 0;
}

.project-subtitle {
  color: var(--dark-muted);
  margin: 0 0 12px 0;
}

.project-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  background: var(--dark-bg);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: var(--dark-muted);
  text-transform: capitalize;
  border: 1px solid var(--dark-border);
}

.project-metrics {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #141426;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #2a2a4a;
  min-width: 0; /* 允许flex item收缩 */
}

.metric-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.3px;
  line-height: 1.2;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  word-break: break-word; /* 处理长文本换行 */
}

/* 交易表单 */
.trade-form-card {
  grid-area: trade-form;
  background: var(--dark-panel);
  border: 1px solid var(--dark-border);
  border-radius: 16px;
  padding: 0px;
  box-shadow: var(--shadow);
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 30px 0;
}

.form-section {
  margin-bottom: 30px;
  background: #1d1d36;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
}

.trade-type-buttons {
  display: flex;
  gap: 12px;
}

.trade-type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border: 2px solid #2a2a4a;
  border-radius: 12px;
  background: #1d1d36;
  cursor: pointer;
  transition: all 0.2s;
  color: #ffffff;
}

.trade-type-btn:hover:not(:disabled) {
  border-color: var(--primary);
  background: #2a2a4a;
}

.trade-type-btn.active {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

.trade-type-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.trade-type-btn:disabled:hover {
  border-color: #2a2a4a;
  background: #1d1d36;
  transform: none;
}

.btn-icon {
  font-size: 24px;
}

.btn-text {
  font-weight: 600;
  color: inherit;
}

.amount-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.amount-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  font-size: 16px;
  background: #374151;
  color: var(--dark-text);
}

.amount-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.amount-unit {
  color: #94a3b8;
  font-weight: 500;
}

.amount-info {
  margin-top: 8px;
}

.info-text {
  font-size: 14px;
  color: #94a3b8;
}

.price-options {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.price-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #ffffff;
}

.price-option input[type="radio"] {
  margin: 0;
  accent-color: var(--primary);
}

.limit-price-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  font-size: 16px;
  background: var(--dark-bg);
  color: var(--dark-text);
}

.price-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.price-unit {
  color: #94a3b8;
  font-weight: 500;
}

.trade-summary {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-item:last-child {
  margin-bottom: 0;
  font-weight: 600;
  border-top: 1px solid var(--dark-border);
  padding-top: 8px;
}

.summary-label {
  color: #94a3b8;
}

.summary-value {
  color: #ffffff;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn.secondary {
  background: #1d1d36;
  color: #ffffff;
  border: 1px solid #2a2a4a;
}

.btn.secondary:hover {
  background: #2a2a4a;
}

.btn.primary {
  background: #f59e0b;
  color: white;
  border: 1px solid #f59e0b;
}

.btn.primary:hover {
  background: #d97706;
  border-color: #d97706;
}

.btn.primary:disabled {
  background: #6b7280;
  border-color: #6b7280;
  cursor: not-allowed;
  opacity: 0.5;
}

/* 交易历史 */
.trade-history-card {
  grid-area: trade-history;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--shadow);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
}

.card-header {
  margin-bottom: 20px;
}

.hash-value {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  color: #3b82f6;
  text-decoration: underline;
}

.hash-value:hover {
  color: #2563eb;
}

.status-success {
  color: #10b981;
  font-weight: 600;
}

.status-failed {
  color: #ef4444;
  font-weight: 600;
}

.trade-type.successful_trade {
  background: #10b981;
  color: white;
}

.trade-type.failed_trade {
  background: #ef4444;
  color: white;
}

.trade-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trade-item {
  padding: 16px;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #141426;
  transition: all 0.2s ease;
}

.trade-item:hover {
  background: #1d1d36;
  border-color: var(--primary);
}

.trade-item:last-child {
  margin-bottom: 0;
}

.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.trade-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.trade-type {
  font-weight: 600;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 6px;
  text-transform: uppercase;
}

.trade-type.buy {
  background: #10b981;
  color: white;
}

.trade-type.sell {
  background: #ef4444;
  color: white;
}

.trade-time {
  font-size: 12px;
  color: #9ca3af;
}

.trade-amount-section,
.trade-price-section,
.trade-total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #e5e7eb;
  font-weight: 600;
}

.trade-total-section .value {
  color: #10b981;
  font-size: 16px;
}

.trade-footer {
  display: flex;
  justify-content: flex-end;
}

.tx-link {
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.1);
  transition: all 0.2s ease;
}

.tx-link:hover {
  background: rgba(59, 130, 246, 0.2);
  text-decoration: none;
}

.trade-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.trade-price {
  font-weight: 600;
  color: #ffffff;
}

.trade-time {
  font-size: 12px;
  color: #94a3b8;
}

/* 错误信息样式 */
.error-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.error-text {
  flex: 1;
}

/* 加载和空状态样式 */
.loading-message, .no-trades {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
  font-style: italic;
}

/* 交易链接样式 */
.tx-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.tx-link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "project-info"
      "trade-form"
      "trade-history";
  }
  
  .project-header {
    flex-direction: column;
    text-align: center;
  }
  
  .project-metrics {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .metric-item {
    padding: 8px;
  }
  
  .metric-label {
    font-size: 9px;
  }
  
  .metric-value {
    font-size: 12px;
  }
  
  .trade-type-buttons {
    flex-direction: column;
  }
}

/* 小屏幕设备 */
@media (max-width: 480px) {
  .project-metrics {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .metric-item {
    padding: 6px;
  }
  
  .metric-label {
    font-size: 8px;
  }
  
  .metric-value {
    font-size: 11px;
  }
}

/* ========== 合约测试面板样式 ========== */
.contract-test-panel {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  width: 50%;
  padding: 30px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(94, 103, 124, 0.04);
  max-height: 800px;
  overflow-y: auto;
}

.test-status {
  margin-bottom: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
}

.status-indicator.success {
  background: #064e3b;
  color: #10b981;
  border: 1px solid #10b981;
}

.status-indicator.error {
  background: #7f1d1d;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.status-indicator.info {
  background: #1e3a8a;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.status-icon {
  font-size: 16px;
}

.status-text {
  font-size: 14px;
}

/* 测试区域布局 */
.test-area {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.test-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  flex-shrink: 0;
}

.test-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  background: #141426;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.test-btn:hover:not(:disabled) {
  border-color: #4f46e5;
  background: #1e1e3a;
  transform: translateX(4px);
}

.test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.test-btn.active {
  border-color: #10b981;
  background: #064e3b;
  color: #10b981;
}

.btn-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.btn-text {
  flex: 1;
}

.test-results {
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  background: #141426;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  padding: 16px;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: #94a3b8;
  font-size: 14px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #2a2a4a;
  border-top: 2px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid;
  font-size: 13px;
}

.result-item.success {
  background: #064e3b;
  border-color: #10b981;
  color: #d1fae5;
}

.result-item.error {
  background: #7f1d1d;
  border-color: #ef4444;
  color: #fecaca;
}

.result-item.info {
  background: #1e3a8a;
  border-color: #3b82f6;
  color: #dbeafe;
}

.result-item.warning {
  background: #78350f;
  border-color: #f59e0b;
  color: #fef3c7;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.result-icon {
  font-size: 14px;
}

.result-title {
  font-weight: 600;
  flex: 1;
}

.result-time {
  font-size: 11px;
  opacity: 0.7;
}

.result-data {
  margin: 8px 0;
}

.result-data pre {
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.result-message {
  margin-top: 4px;
  opacity: 0.9;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  color: #94a3b8;
  text-align: center;
}

.no-results-icon {
  font-size: 32px;
  opacity: 0.5;
}

.no-results-text {
  font-size: 14px;
  font-style: italic;
}

.quick-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #2a2a4a;
  border-radius: 6px;
  background: #141426;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
}

.action-btn:hover {
  border-color: #4f46e5;
  background: #1e1e3a;
}

.action-btn.secondary {
  border-color: #6b7280;
  color: #9ca3af;
}

.action-btn.secondary:hover {
  border-color: #9ca3af;
  background: #374151;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .contract-test-panel {
    margin-top: 20px;
  }
  
  .test-area {
    flex-direction: column;
    gap: 16px;
  }
  
  .test-buttons {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .test-area {
    flex-direction: column;
    gap: 12px;
  }
  
  .test-buttons {
    gap: 6px;
  }
  
  .test-btn {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .btn-icon {
    font-size: 16px;
  }
  
  .test-results {
    max-height: 300px;
    padding: 12px;
  }
  
  .result-item {
    padding: 10px;
    font-size: 12px;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .action-btn {
    padding: 10px;
    font-size: 13px;
  }
}

/* 余额不足弹窗样式 */
.error-modal {
  border-left: 4px solid #ef4444;
}

.error-icon {
  font-size: 24px;
  color: #ef4444;
}

.error-message {
  text-align: center;
}

.error-message p {
  margin: 8px 0;
  color: #64748b;
}

.error-message strong {
  color: #1e293b;
  font-weight: 600;
}

/* 加载中弹窗样式 */
.loading-modal {
  border-left: 4px solid #3b82f6;
}

.loading-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.loading-icon .spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  text-align: center;
}

.loading-message p {
  margin: 8px 0;
  color: #64748b;
}

.loading-status {
  font-weight: 600;
  color: #3b82f6;
  font-style: italic;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
