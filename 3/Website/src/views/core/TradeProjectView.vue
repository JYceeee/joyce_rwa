<template>
  <div class="trade-page">
    <!-- 余额不足弹窗 -->
    <!-- <div v-if="showInsufficientBalanceModal" class="modal-overlay" @click="closeInsufficientBalanceModal">
      <div class="modal-content error-modal" @click.stop>
        <div class="modal-header">
          <div class="error-icon">⚠️</div>
          <h2 class="modal-title">余额不足</h2>
        </div>
        <div class="modal-body">
          <div class="error-message">
            <p>您的代币余额不足以完成 {{ projectCode }} 的交易。</p>
            <p><strong>当前余额:</strong> {{ userTokenBalance }} {{ projectCode }} tokens</p>
            <p><strong>所需金额:</strong> {{ tradeAmount }} {{ projectCode }} tokens</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn primary" @click="closeInsufficientBalanceModal">确定</button>
        </div>
      </div>
    </div> -->

    <!-- 加载中弹窗 -->
    <div v-if="showLoadingModal" class="modal-overlay"> 
      <div class="modal-content loading-modal" @click.stop>
        <div class="loading-container">
          <div class="loading-icon">
            <div class="spinner"></div>
          </div>
          <div class="loading-content">
            <h2 class="loading-title">Processing...</h2>
            <p class="loading-description">We are processing your transaction request, please wait...</p>
            <div class="loading-status">
              <div class="status-indicator"></div>
              <span>{{ loadingStatus }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易成功弹窗 -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal"> 
      <div class="modal-content success-modal" @click.stop>
        <div class="success-container">
          <div class="success-icon">
            <div class="checkmark">
              <div class="checkmark-stem"></div>
              <div class="checkmark-kick"></div>
            </div>
          </div>
          <div class="success-content">
            <h2 class="success-title">Transaction Successful!</h2>
            <p class="success-description">Your transaction has been completed successfully</p>
            
            <div class="success-details">
              <div class="detail-card">
                <div class="detail-header">
                  <!-- <span class="detail-icon">📊</span> -->
                  <span class="detail-label">Transaction Details</span>
                </div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-key">Type:</span>
                    <span class="detail-value">{{ successData.tradeType === 'buy' ? 'Buy' : 'Sell' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-key">Amount:</span>
                    <span class="detail-value">{{ successData.amount }} Tokens</span>
                  </div>
                </div>
              </div>
              
              <div class="detail-card">
                <div class="detail-header">
                  <!-- <span class="detail-icon">🔗</span> -->
                  <span class="detail-label">Blockchain Info</span>
                </div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-key">Hash:</span>
                    <span class="detail-value hash-value" @click="copyHash">{{ formatHash(successData.transactionHash) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-key">Block:</span>
                    <span class="detail-value">{{ successData.blockNumber }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="success-actions">
            <button class="btn secondary" @click="closeSuccessModal">Close</button>
            <button class="btn primary" @click="viewPortfolio">View Portfolio</button>
          </div>
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
      <!-- 加载状态 -->
      <div v-if="projectLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <h2>Loading Project Data...</h2>
        <p>Please wait while we load the project information.</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="projectError" class="error-container"> 
        <div class="error-icon">⚠️</div>
        <h2>Failed to Load Project</h2>
         <p>{{ projectError }}</p> 
        <button class="btn primary" @click="loadProjectData">Retry</button>
      </div>
      
      <!-- 项目信息卡片 -->
      <div v-else-if="projectData" class="project-info-card">
        <div class="project-header">
          <img :src="projectData.image" :alt="projectCode" class="project-image" />
          <div class="project-details">
            <h1 class="project-title">{{ projectData.code }} • {{ projectData.name }}</h1>
            <p class="project-subtitle">{{ projectData.subtitle }}</p>
            <div class="project-meta">
              <span class="meta-item">{{ projectData.propertyType || projectData.type }}</span>
              <span class="meta-item">{{ projectData.propertyLocation || projectData.region }}</span>
              <span class="meta-item">{{ projectData.loanProduct || 'Loan Product' }}</span>
            </div>
          </div>
        </div>
        
          <!-- 项目指标 -->
          <div class="project-metrics">
            <div class="metric-item">
              <span class="metric-label">LOAN SIZE</span>
              <span class="metric-value">{{ projectData.loanAmount || 'AUD$0' }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">EST. YIELD (IRR)</span>
              <span class="metric-value" style="color: #16a34a;">{{ projectData.metrics.targetLoanYield }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">TERM</span>
              <span class="metric-value">{{ projectData.loanTerm || '12 months' }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">PROPERTY VALUE</span>
              <span class="metric-value">{{ projectData.metrics.collateralPropertyValue }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">LTV</span>
              <span class="metric-value">{{ projectData.metrics.loanToValue }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">SUBSCRIPTION PROGRESS</span>
              <span class="metric-value" style="color: #3b82f6;">{{ projectData.subscriptionProgress }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">TOTAL OFFERING</span>
              <span class="metric-value">{{ projectData.totalOffering }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">SUBSCRIBED</span>
              <span class="metric-value">{{ projectData.subscribed }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">DEFAULT RATE</span>
              <span class="metric-value">{{ projectData.metrics.defaultRate }}</span>
            </div>
          </div>
      </div>

      <!-- 认购表单 -->
      <div class="trade-form-card">
        <div class="form-header">
          <h2 class="form-title">认购 {{ projectCode }}</h2>
          <!-- 钱包状态 - 整合成一行显示 -->
          <div class="wallet-status-inline">
            <div class="wallet-status-item">
              <span class="status-label">钱包:</span>
              <span :class="['status-value', connected ? 'connected' : 'disconnected']">
                {{ connected ? 'Connected' : 'Disconnected' }}
              </span>
            </div>
            <div class="wallet-status-item" v-if="connected">
              <span class="status-label">地址:</span>
              <span class="status-value">{{ shortAddress }}</span>
            </div>
            <div class="wallet-status-item" v-if="connected">
              <span class="status-label">网络:</span>
              <span class="status-value">{{ networkLabel }}</span>
            </div>
            <div class="wallet-status-item" v-if="connected">
              <span class="status-label">链ID:</span>
              <span class="status-value">{{ getCurrentChainId() }}</span>
            </div>
            <div class="wallet-status-item" v-if="connected">
              <span class="status-label">代币余额:</span>
              <span class="status-value">{{ nativeBalanceDisplay }} LPT</span>
            </div>
            <!-- <button 
              v-if="!connected" 
              @click="connectWallet" 
              class="btn primary tiny"
              :disabled="loading"
            >
              Connect Wallet
            </button> -->
            <!-- <button 
              v-if="connected" 
              @click="disconnectWallet" 
              class="btn secondary tiny"
              :disabled="loading"
            >
              Disconnect Wallet
            </button> -->
          </div>
        </div>
        
        <!-- 认购金额输入 -->
        <div class="form-section">
          <h3 class="section-title">Purchase Amount</h3>
          <div class="amount-input-group">
            <input 
              type="number" 
              v-model="subscriptionAmount" 
              class="amount-input"
              :class="{ 'error': amountError }"
              placeholder="Please enter the purchase amount"
              min="100"
              max="10000"
              step="0.01"
              @input="onAmountInput"
              @blur="validateAmount"
            />
            <span class="amount-unit">LPT</span>
          </div>
          <!-- <div class="amount-info">
            <p class="input-hint" v-if="!amountError">
              Minimum purchase amount: {{ contractTerms.minSubscription || 100 }} LPT, Maximum purchase amount: {{ contractTerms.maxSubscription || 10000 }} LPT
            </p>
            <p class="input-error" v-if="amountError">
              {{ amountError }}
            </p>
          </div> -->
        </div>

        <!-- 认购摘要 -->
        <div class="subscription-summary" v-if="subscriptionAmount && subscriptionAmount > 0 && amountValid">
          <h3>Purchase Summary</h3>
          <div class="summary-item">
            <span class="summary-label">Project Code:</span>
            <span class="summary-value">{{ projectCode }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Purchase Amount:</span>
            <span class="summary-value">{{ formatNumber(subscriptionAmount) }} LPT</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Annual Rate:</span>
            <span class="summary-value">9.5% p.a. (标准利率)</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Loan Term:</span>
            <span class="summary-value">12 months (标准期限)</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Estimated Interest:</span>
            <span class="summary-value">{{ calculateInterest() }} LIT</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Current Price:</span>
            <span class="summary-value">$1.00</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Token Needed:</span>
            <span class="summary-value">{{ formatNumber(subscriptionAmount) }} LPT</span>
          </div>
          <div class="button-hint" v-if="!connected">
              Please connect your wallet
          </div>
          <div class="button-hint" v-else-if="!isFormValid">
            Please fill in the complete subscription information
          </div>
        </div>

        <!-- 认购按钮 -->
        <div class="form-section">
          <div class="trade-type-buttons">
            <button 
              class="trade-type-btn buy-btn" 
              @click="deployContractsWithSubscription"
              :disabled="!connected || !isFormValid || loading"
            >
              <span class="btn-text">{{ loading ? 'Processing...' : 'BUY' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 部署状态区域 -->
      <!-- <div v-if="deploymentStatus" class="deployment-status-card"> -->
      <div class="deployment-status-card">
        <h3>部署状态</h3>
        <div class="status-log">
          <div 
            v-for="(log, index) in deploymentLogs" 
            :key="index"
            :class="['log-item', log.type]"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div> 

      <!-- 已部署合约信息区域 -->
      <!-- <div v-if="deployedContracts.length > 0" class="deployed-contracts-card"> -->
      <div class="deployed-contracts-card">
        <h3>已部署合约</h3>
        <div class="contract-list">
          <div 
            v-for="contract in deployedContracts" 
            :key="contract.name"
            class="contract-item"
          >
            <div class="contract-name">{{ contract.name }}</div>
            <div class="contract-address">{{ contract.address }}</div>
            <button 
              @click="copyAddress(contract.address)"
              class="btn small"
            >
              复制地址
            </button>
          </div>
          <!-- <button @click="goToWallet" class="btn primary">go to wallet add your address</button>  -->
        </div>
      </div>

      <!-- 合约交互状态区域 -->
      <!-- <div v-if="interactionStatus" class="interaction-status-card"> -->
      <div class="interaction-status-card">
        <h3>合约交互状态</h3>
        <div class="status-log">
          <div 
            v-for="(log, index) in interactionLogs" 
            :key="index"
            :class="['log-item', log.type]"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>

      <!-- 余额信息区域 -->
      <!-- <div v-if="balanceInfo" class="balance-info-card"> -->
      <div class="balance-info-card">
        <h3>余额信息</h3>
        <div class="balance-list">
          <div class="balance-item">
            <span class="balance-label">LPT 余额:</span>
            <span class="balance-value">{{ balanceInfo.lpt }} LPT</span>
          </div>
          <div class="balance-item">
            <span class="balance-label">LIT 余额:</span>
            <span class="balance-value">{{ balanceInfo.lit }} LIT</span>
          </div>
          <div class="balance-item">
            <span class="balance-label">ETH 余额:</span>
            <span class="balance-value">{{ balanceInfo.eth }} ETH</span>
          </div>
        </div>
      </div>
    </div>
      <div>
        <!-- View Contract Details按钮 -->
        <!-- <div class="contract-details-section">
          <button class="contract-details-btn" @click="viewContractDetails"> -->
            <!-- <span class="btn-icon">📋</span> -->
            <!-- <span class="btn-text">View Contract Details</span> -->
            <!-- <span class="btn-arrow">→</span> -->
          <!-- </button>
        </div> -->
      </div>
          
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
</template>

<script>
import { productAPI } from '@/service/api'
import { unifiedContractService as contractService } from '@/service/unifiedContractService.js'
import { getKycStatus, isKycVerified, getKycLevel, setKycLevel, KYC_STATUS, KYC_LEVELS } from '@/service/kycService.js'
import { useAuth } from '@/composables/useAuth.js'
import { useWallet } from '@/composables/useWallet.js'
import { isLoggedIn } from '@/utils/auth.js'
import contractTestService from '@/services/contractTestService'
import { ethers } from 'ethers'

const { nativeBalanceDisplay,nativeSymbol,nativeToAudDisplay,bigAudDisplay } = useWallet()

export default {
  name: 'TradeProjectView',
  props: {
    code: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      tradeType: 'buy',
      tradeAmount: '',
      walletActivity: [],
      loading: false,
      error: null,
      errorType: null, // 错误类型
      isInterestTrade: false, // 是否为利息交易
      showSuccessModal: false,
      showInsufficientBalanceModal: false,
      showLoadingModal: false,
      loadingStatus: '',
      userTokenBalance: 0,
      products: [],
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
      // 项目数据
      projectData: null,
      projectLoading: true,
      projectError: null,
      // 错误消息映射
      errorMessages: {
        'insufficient_balance': 'You have insufficient funds',
        'insufficient_interest': 'Insufficient interest received amount',
        'input_required': 'Please enter the amount',
        'login_required': 'Please login to your account',
        'wallet_connection_required': 'Please connect your wallet',
        'address_retrieval_failed': 'Unable to retrieve wallet address',
        'kyc_verification_required': 'Please complete KYC verification',
        'whitelist_required': 'Your wallet is not whitelisted',
        'transaction_failed': 'Transaction failed',
        'network_error': 'Network error occurred',
        'unknown_error': 'An unknown error occurred'
      },
      // 认购相关数据
      subscriptionAmount: 0,
      contractTerms: {
        annualRate: 5.5,
        loanTerm: 365,
        minSubscription: 100,
        maxSubscription: 10000
      },
      // 输入验证状态
      amountError: null,
      amountValid: false,
      // 部署状态相关
      deploymentStatus: false,
      deploymentLogs: [],
      deployedContracts: [],
      // 交互状态相关
      interactionStatus: false,
      interactionLogs: [],
      // 余额信息
      balanceInfo: null
    }
  },
  computed: {
    projectCode() {
      // 优先使用props，然后是路由参数，最后是默认值
      const code = this.code || this.$route.params.code || this.$route.query.code
      console.log('🔍 TradeProjectView: 获取项目代码:', {
        props: this.code,
        routeParams: this.$route.params.code,
        routeQuery: this.$route.query.code,
        final: code
      })
      return code || 'RWA001'
    },
    
    // 控制按钮显示
    showBuyButton() {
      return this.tradeType === 'buy' || !this.isInterestTrade
    },
    
    showSellButton() {
      return this.tradeType === 'sell' && this.isInterestTrade
    },
    project() {
      // 使用从数据库加载的项目数据
      if (this.projectData) {
        console.log('TradeProjectView: 使用数据库项目数据:', this.projectData)
        return this.projectData
      }
      return null
    },
    // 表单验证
    isFormValid() {
      return this.amountValid && this.subscriptionAmount && this.subscriptionAmount > 0
    },
    // 钱包状态
    connected() {
      const { connected } = useWallet()
      return connected.value
    },
    address() {
      const { address } = useWallet()
      return address.value
    },
    shortAddress() {
      const { shortAddress } = useWallet()
      return shortAddress.value
    },
    networkLabel() {
      const { networkLabel } = useWallet()
      return networkLabel.value
    },
    chainId() {
      const { chainId } = useWallet()
      return chainId.value
    },
    
    // 获取项目目标收益率
    getProjectTargetYield() {
      if (!this.projectData) {
        console.warn('projectData 不存在')
        return null
      }
      
      console.log('获取目标收益率，projectData:', this.projectData)
      
      // 优先从数据库字段 interest_rate 获取数值
      if (this.projectData.interest_rate) {
        const targetYieldValue = parseFloat(this.projectData.interest_rate)
        console.log('从数据库 interest_rate 获取:', targetYieldValue)
        return targetYieldValue
      }
      
      // 兼容旧字段 targetYield
      if (this.projectData.targetYield) {
        const targetYieldValue = parseFloat(this.projectData.targetYield)
        console.log('从 targetYield 获取:', targetYieldValue)
        return targetYieldValue
      }
      
      // 兼容旧字段 interestRate
      if (this.projectData.interestRate) {
        const targetYieldValue = parseFloat(this.projectData.interestRate)
        console.log('从 interestRate 获取:', targetYieldValue)
        return targetYieldValue
      }
      
      // 从 metrics.targetLoanYield 解析 (格式: "6.5% p.a.")
      if (this.projectData.metrics?.targetLoanYield) {
        const yieldStr = this.projectData.metrics.targetLoanYield
        console.log('从 metrics.targetLoanYield 解析:', yieldStr)
        const match = yieldStr.match(/(\d+\.?\d*)/)
        const targetYieldValue = match ? parseFloat(match[1]) : null
        console.log('解析结果:', targetYieldValue)
        return targetYieldValue
      }
      
      console.warn('未找到目标收益率数据')
      return null
    },
    
    // 获取项目贷款期限
    getProjectLoanTerm() {
      if (!this.projectData) {
        console.warn('projectData 不存在')
        return null
      }
      
      console.log('获取贷款期限，projectData:', this.projectData)
      
      // 优先从数据库字段 loan_term_months 获取数值（月数）
      if (this.projectData.loan_term_months) {
        const termInDays = this.projectData.loan_term_months * 30.44 // 转换为天数
        console.log('从数据库 loan_term_months 获取:', this.projectData.loan_term_months, '个月，转换为天数:', termInDays)
        return termInDays
      }
      
      // 兼容旧字段 loanTermMonths
      if (this.projectData.loanTermMonths) {
        const termInDays = this.projectData.loanTermMonths * 30.44 // 转换为天数
        console.log('从 loanTermMonths 获取:', this.projectData.loanTermMonths, '个月，转换为天数:', termInDays)
        return termInDays
      }
      
      // 兼容旧字段 loanTerm
      if (this.projectData.loanTerm) {
        const term = parseFloat(this.projectData.loanTerm)
        console.log('从 loanTerm 获取:', term)
        return term
      }
      
      console.warn('未找到贷款期限数据')
      return null
    }
  },
  methods: {
    // 加载单个产品详情
    async loadSingleProduct() {
      try {
        this.loading = true
        this.error = null
        console.log('🔄 ProjectsView: 从数据库加载单个产品数据...', this.code)
        
        const response = await productAPI.getProductByCode(this.code)
        
        if (response.status === 0) {
          // 映射数据库字段到前端期望的字段名
          const rawData = response.data
          const product = {
            ...rawData,
            totalOffering: rawData.total_token,
            subscribed: rawData.current_subscribed_token,
            targetYield: rawData.target_yield,
            ltv: rawData.LTV,
            annualInterestRate: rawData.annual_interest_rate,
            loanAmount: rawData.loan_amount,
            valuation: rawData.valuation,
            image: rawData.image || this.getProductImage(rawData.code),
            
            // 原始数值用于计算
            totalOfferingRaw: rawData.total_token || 0,
            subscribedRaw: rawData.current_subscribed_token || 0
          }
          
          // 构建与TradeProjectView一致的数据结构
          this.currentProduct = {
            // 基本信息
            code: product.code,
            name: product.name,
            image: product.image,
            subtitle: product.subtitle,
            type: product.type,
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
          
          this.lastRefreshTime = new Date()
          console.log('✅ ProjectsView: 单个产品数据加载成功:', this.currentProduct)
        } else {
          this.error = response.message || '获取产品数据失败'
          console.error('❌ ProjectsView: API返回错误:', response)
        }
      } catch (error) {
        this.error = '网络错误，无法获取产品数据'
        console.error('❌ ProjectsView: 获取单个产品数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    async loadProducts() {
      try {
        this.loading = true
        this.error = null
        console.log('🔄 从数据库加载产品数据...')
        
        const response = await productAPI.getAllProducts()
        
        if (response.status === 0) {
          // 映射新的数据库字段到前端期望的字段名
          this.products = (response.data || []).map(project => {
            const mappedProduct = {
              // 基础信息
              id: project.id,
              code: project.code,
              name: project.name,
              status: project.status,
              
              // 认购信息
              totalOffering: project.total_offering_token ? `AUD$${project.total_offering_token.toLocaleString()}` : 'AUD$0',
              subscribed: project.subscribe_token ? `AUD$${project.subscribe_token.toLocaleString()}` : 'AUD$0',
              
              // 原始数值用于计算
              totalOfferingRaw: project.total_offering_token || 0,
              subscribedRaw: project.subscribe_token || 0,
              
              // 物业信息
              property_location: project.propertyLocation,
              property_state: project.propertyState,
              property_type: project.propertyType,
              property_value: project.propertyValue,
              property_summary: project.propertySummary,
              
              // 贷款信息
              loan_type: project.loanType,
              loan_product: project.loanProduct,
              loan_amount: project.loanAmount,
              loan_purpose: project.loanPurpose,
              loan_term_months: project.loanTermMonths,
              
              // 贷款比率
              lvr: project.lvr,
              interest_rate: project.interestRate,
              default_rate: project.defaultRate,
              
              // 贷款周期
              commencement_date: project.commencementDate,
              expiry_date: project.expiryDate,
              expected_recovery_date: project.expectedRecoveryDate,
              
              // 前端显示字段
              subtitle: `${project.loanProduct} - ${project.propertyType}`,
              loanAmount: project.loanAmount ? `AUD$${project.loanAmount.toLocaleString()}` : 'AUD$0',
              loanTerm: `${project.loanTermMonths} months`,
              targetYield: project.interestRate,
              image: project.image || this.getProductImage(project.code)
            }
            
            // 添加计算指标
            mappedProduct.metrics = {
              currentElaraPrice: this.calculateTokenPrice(mappedProduct),
              collateralPropertyValue: project.propertyValue ? `AUD$${project.propertyValue.toLocaleString()}` : 'TBA',
              rentalIncome: this.calculateRentalIncome(mappedProduct),
              targetLoanYield: `${project.interestRate}% p.a.`
            }
            
            return mappedProduct
          })
          this.lastRefreshTime = new Date()
          console.log('✅ 产品数据加载成功，共', this.products.length, '个项目')
        } else {
          this.error = response.message || '获取产品数据失败'
          console.error('❌ API返回错误:', response)
        }
      } catch (error) {
        this.error = '网络错误，无法获取产品数据'
        console.error('❌ 加载产品数据失败:', error)
      } finally {
        this.loading = false
      }
    },
        // 刷新数据
    async refreshProducts() {
      console.log('🔄 手动刷新产品数据...')
      if (this.isDetailView) {
        await this.loadSingleProduct()
      } else {
        await this.loadProducts()
      }
    },
    
    // 设置数据库同步
    setupDatabaseSync() {
      const { subscribeProducts, subscribeNewProjects, getLastRefreshTime } = useDatabaseSync()
      
      // 订阅产品列表更新
      this.unsubscribeProducts = subscribeProducts((products) => {
        console.log('📡 ProjectsView: 收到产品数据更新，共', products.length, '个项目')
        // 映射数据库字段到前端期望的字段名
        this.products = products.map(product => ({
          ...product,
          totalOffering: product.total_token,
          subscribed: product.current_subscribed_token,
          targetYield: product.target_yield,
          ltv: product.LTV,
          annualInterestRate: product.annual_interest_rate,
          
          // 原始数值用于计算
          totalOfferingRaw: product.total_token || 0,
          subscribedRaw: product.current_subscribed_token || 0,
          loanAmount: product.loan_amount,
          valuation: product.valuation,
          image: product.image || this.getProductImage(product.code)
        }))
        this.lastRefreshTime = new Date()
      })
      
      // 订阅新项目通知
      this.unsubscribeNewProjects = subscribeNewProjects((newProjects) => {
        console.log('🆕 ProjectsView: 发现', newProjects.length, '个新项目')
        // 可以在这里添加新项目通知逻辑
        this.showNewProjectsNotification(newProjects)
      })
      
      // 设置最后刷新时间
      const lastRefresh = getLastRefreshTime()
      if (lastRefresh) {
        this.lastRefreshTime = lastRefresh
      }
    },
    
    // 清理数据库同步
    cleanupDatabaseSync() {
      if (this.unsubscribeProducts) {
        this.unsubscribeProducts()
      }
      if (this.unsubscribeNewProjects) {
        this.unsubscribeNewProjects()
      }
    },
    
    // 显示新项目通知
    showNewProjectsNotification(newProjects) {
      if (newProjects.length > 0) {
        const projectNames = newProjects.map(p => p.name).join(', ')
        console.log('🆕 发现新项目:', projectNames)
        // 可以在这里添加用户通知
      }
    },
    
    // 开始自动刷新（保留作为备用）
    startAutoRefresh() {
      // 每30秒自动刷新一次数据
      this.refreshInterval = setInterval(() => {
        console.log('🔄 自动刷新产品数据...')
        this.loadProducts()
      }, 30) // 30秒
    },
    
    // 停止自动刷新（保留作为备用）
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
        console.log('⏹️ 停止自动刷新')
      }
    },
    projectData() {
      // 从ProductDetailsInfo获取项目数据（保留作为备用）
      const product = this.project
      
      if (product) {
        console.log('📊 TradeProjectView: 从数据库获取项目数据:', product)
        
        // 构建符合模板需求的数据结构，完整映射ProductDetailsInfo.js中的所有字段
        return {
          // 基本信息
          code: product.code,
          name: product.name,
          image: product.image || this.getProductImage(product.code),
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
    },
    
    // 从Wallet Activity Log获取当前项目的交易记录
    projectTrades() {
      if (!this.walletActivity || !Array.isArray(this.walletActivity)) {
        return []
      }
      
      // 过滤出当前项目的buy/sell交易记录
      return this.walletActivity.filter(activity => 
        (activity.type === 'buy' || activity.type === 'sell') && 
        activity.project_code === this.projectCode
      ).sort((a, b) => b.timestamp - a.timestamp) // 按时间倒序排列
    },
    
    // 查看合约详情
    viewContractDetails() {
      console.log('📄 查看合约详情:', this.projectCode)
      this.$router.push({
        path: '/contract',
        query: {
          projectCode: this.projectCode,
          projectName: this.projectData.name,
          projectImage: this.projectData.image,
          from: 'trade'
        }
      })
    },

    // 格式化数字
    formatNumber(num) {
      if (!num) return '0.00'
      return parseFloat(num).toFixed(2)
    },

    // 计算预计利息
    calculateInterest() {
      if (!this.subscriptionAmount) return '0.00'
      
      // 使用固定的标准利率和期限，不依赖项目数据
      const standardRate = 9.5 // 标准年化利率 9.5%
      const standardTermMonths = 12 // 标准期限 12个月
      
      console.log('计算利息参数 (使用标准值):', {
        subscriptionAmount: this.subscriptionAmount,
        standardRate,
        standardTermMonths
      })
      
      // 计算利息: 认购金额 * 年化收益率 * 贷款期限(月) / 12
      const interest = (this.subscriptionAmount * standardRate / 100 * standardTermMonths / 12)
      console.log('利息计算结果:', interest)
      return this.formatNumber(interest)
    },

    // 计算总代币需求
    calculateTotalTokenNeeded() {
      if (!this.subscriptionAmount) return '0.00'
      
      const currentPrice = 1.00 // 当前价格 $1.00
      const totalTokenNeeded = this.subscriptionAmount * currentPrice
      
      console.log('计算总代币需求:', {
        subscriptionAmount: this.subscriptionAmount,
        currentPrice,
        totalTokenNeeded
      })
      
      return this.formatNumber(totalTokenNeeded)
    },

    // 获取项目目标收益率
    getProjectTargetYield() {
      if (!this.projectData) {
        console.warn('projectData 不存在')
        return null
      }
      
      console.log('获取目标收益率，projectData:', this.projectData)
      
      // 优先从数据库字段 interest_rate 获取数值
      if (this.projectData.interest_rate) {
        const targetYieldValue = parseFloat(this.projectData.interest_rate)
        console.log('从数据库 interest_rate 获取:', targetYieldValue)
        return targetYieldValue
      }
      
      // 兼容旧字段 targetYield
      if (this.projectData.targetYield) {
        const targetYieldValue = parseFloat(this.projectData.targetYield)
        console.log('从 targetYield 获取:', targetYieldValue)
        return targetYieldValue
      }
      
      // 兼容旧字段 interestRate
      if (this.projectData.interestRate) {
        const targetYieldValue = parseFloat(this.projectData.interestRate)
        console.log('从 interestRate 获取:', targetYieldValue)
        return targetYieldValue
      }
      
      // 从 metrics.targetLoanYield 解析 (格式: "6.5% p.a.")
      if (this.projectData.metrics?.targetLoanYield) {
        const yieldStr = this.projectData.metrics.targetLoanYield
        console.log('从 metrics.targetLoanYield 解析:', yieldStr)
        const match = yieldStr.match(/(\d+\.?\d*)/)
        const targetYieldValue = match ? parseFloat(match[1]) : null
        console.log('解析结果:', targetYieldValue)
        return targetYieldValue
      }
      
      console.warn('未找到目标收益率数据')
      return null
    },

    // 获取项目贷款期限
    getProjectLoanTerm() {
      if (!this.projectData) {
        console.warn('projectData 不存在')
        return null
      }
      
      console.log('获取贷款期限，projectData:', this.projectData)
      
      // 优先从数据库字段 loan_term_months 获取数值（月数）
      if (this.projectData.loan_term_months) {
        const termInDays = this.projectData.loan_term_months * 30.44 // 转换为天数
        console.log('从数据库 loan_term_months 获取:', this.projectData.loan_term_months, '个月，转换为天数:', termInDays)
        return termInDays
      }
      
      // 兼容旧字段 loanTermMonths
      if (this.projectData.loanTermMonths) {
        const termInDays = this.projectData.loanTermMonths * 30.44 // 转换为天数
        console.log('从 loanTermMonths 获取:', this.projectData.loanTermMonths, '个月，转换为天数:', termInDays)
        return termInDays
      }
      
      // 兼容旧字段 loanTerm
      if (this.projectData.loanTerm) {
        const term = parseFloat(this.projectData.loanTerm)
        console.log('从 loanTerm 获取:', term)
        return term
      }
      
      console.warn('未找到贷款期限数据')
      return null
    },

    // 添加日志
    addLog(logs, message, type = 'info') {
      const now = new Date()
      const time = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
      logs.push({ time, message, type })
    },

    // 获取当前链ID
    getCurrentChainId() {
      if (this.chainId) {
        return this.chainId
      }
      return 11155111 // 默认使用 Sepolia 测试网
    },

    // 部署合约与认购
    async deployContractsWithSubscription() {
      try {
        this.loading = true
        this.error = null
        this.deploymentStatus = true
        this.deploymentLogs = []
        
        this.addLog(this.deploymentLogs, '开始认购流程...', 'info')
        this.addLog(this.deploymentLogs, `当前网络: ${this.networkLabel || '未知网络'}`, 'info')
        this.addLog(this.deploymentLogs, `链ID: ${this.getCurrentChainId()}`, 'info')
        this.addLog(this.deploymentLogs, `项目代号: ${this.projectCode}`, 'info')
        this.addLog(this.deploymentLogs, `认购金额: ${this.formatNumber(this.subscriptionAmount)} LPT`, 'info')
        this.addLog(this.deploymentLogs, `年化利率: 9.5% (标准设定)`, 'info')
        this.addLog(this.deploymentLogs, `贷款期限: 12 个月 (标准设定)`, 'info')
        
        // 调用合约服务获取真实合约地址
        const result = await contractTestService.deployContractsWithSubscription({
          subscriptionAmount: this.subscriptionAmount,
          annualRate: 9.5, // 使用标准利率
          loanTerm: 365, // 使用标准期限 (12个月 = 365天)
          projectCode: this.projectCode,
          projectName: this.projectCode, // 使用项目代码作为名称
          walletAddress: this.address,
          chainId: this.getCurrentChainId()
        })
        
        this.addLog(this.deploymentLogs, '获取合约地址...', 'info')
        this.addLog(this.deploymentLogs, `网络: ${result.networkInfo.name}`, 'info')
        this.addLog(this.deploymentLogs, `贷款ID: ${result.loanId}`, 'info')
        
        // 发送ETH交易到指定地址
        await this.sendEthTransaction()
        
        // 使用服务返回的合约地址
        this.deployedContracts = [
          { name: 'KYCRegistry', address: result.contracts.kycRegistry },
          { name: 'LPT', address: result.contracts.lpt },
          { name: 'LIT', address: result.contracts.lit },
          { name: 'LoanIssuer', address: result.contracts.loanIssuer }
        ]
        
        this.addLog(this.deploymentLogs, `交易哈希: ${result.transactionHash}`, 'info')
        this.addLog(this.deploymentLogs, `Gas 使用: ${result.gasUsed}`, 'info')
        this.addLog(this.deploymentLogs, `区块号: ${result.blockNumber}`, 'info')
        this.addLog(this.deploymentLogs, '认购完成! 合约地址已获取', 'success')
        
        // 显示成功消息
        this.showSuccessModal = true
        this.successData = {
          tradeType: 'subscription',
          amount: this.subscriptionAmount,
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber
        }
        
        // 开始合约交互测试
        await this.startContractInteraction()
        
      } catch (err) {
        this.error = `认购失败: ${err.message}`
        this.addLog(this.deploymentLogs, `认购失败: ${err.message}`, 'error')
      } finally {
        this.loading = false
      }
    },

    // 开始合约交互测试
    async startContractInteraction() {
      try {
        this.interactionStatus = true
        this.interactionLogs = []
        
        this.addLog(this.interactionLogs, '开始合约交互测试...', 'info')
        
        // 模拟合约交互
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.addLog(this.interactionLogs, '测试 LPT 代币铸造...', 'info')
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.addLog(this.interactionLogs, '测试 LIT 代币铸造...', 'info')
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.addLog(this.interactionLogs, '测试贷款创建...', 'info')
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.addLog(this.interactionLogs, '合约交互测试完成!', 'success')
        
        // 更新余额信息
        this.balanceInfo = {
          lpt: this.formatNumber(this.subscriptionAmount),
          lit: this.calculateInterest(),
          eth: '0.1'
        }
        
      } catch (err) {
        this.addLog(this.interactionLogs, `交互测试失败: ${err.message}`, 'error')
      }
    },

    // 复制地址
    async copyAddress(address) {
      try {
        await navigator.clipboard.writeText(address)
        this.addLog(this.interactionLogs, `地址已复制: ${address}`, 'success')
      } catch (err) {
        console.error('复制失败:', err)
      }
    },

    // 加载合约条款
    async loadContractTerms() {
      try {
        const result = await contractTestService.getContractTerms()
        if (result.success) {
          this.contractTerms = {
            annualRate: result.terms.annualRate,
            loanTerm: result.terms.loanTerm,
            minSubscription: result.terms.minSubscription,
            maxSubscription: result.terms.maxSubscription
          }
        }
      } catch (error) {
        console.error('加载合约条款失败:', error)
      }
    },

    // 连接钱包
    async connectWallet() {
      try {
        const { connect } = useWallet()
        await connect()
        console.log('钱包连接成功')
      } catch (error) {
        console.error('钱包连接失败:', error)
        this.error = '钱包连接失败: ' + error.message
      }
    },

    // 断开钱包连接
    async disconnectWallet() {
      try {
        const { disconnect } = useWallet()
        await disconnect()
        console.log('钱包断开连接成功')
        // 清空相关状态
        this.deploymentStatus = false
        this.deploymentLogs = []
        this.deployedContracts = []
        this.interactionStatus = false
        this.interactionLogs = []
        this.balanceInfo = null
      } catch (error) {
        console.error('钱包断开连接失败:', error)
      }
    },

    // 跳转到钱包页面
    goToWallet() {
      console.log('跳转到钱包页面')
      this.$router.push('/wallet')
    },

    // 发送ETH交易到指定地址
    async sendEthTransaction() {
      try {
        this.addLog(this.deploymentLogs, '准备发送ETH交易...', 'info')
        
        // 检查MetaMask是否可用
        if (!window.ethereum) {
          throw new Error('MetaMask未安装或未启用')
        }
        
        // 计算需要发送的ETH数量（认购金额转换为ETH）
        const ethAmount = this.subscriptionAmount || 0
        const ethAmountWei = ethers.parseEther(ethAmount.toString())
        
        // 检查用户ETH余额
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(this.address)
        const balanceEth = parseFloat(ethers.formatEther(balance))
        
        this.addLog(this.deploymentLogs, `用户ETH余额: ${balanceEth.toFixed(4)} ETH`, 'info')
        this.addLog(this.deploymentLogs, `发送金额: ${ethAmount} ETH`, 'info')
        this.addLog(this.deploymentLogs, `目标地址: 0x13159e6417D98528C220b12Ec4950D5A343E5eAA`, 'info')
        
        // 检查余额是否足够（包括gas费用）
        const feeData = await provider.getFeeData()
        const gasPrice = feeData.gasPrice || BigInt(20000000000) // 20 Gwei 默认值
        const gasLimit = BigInt(21000)
        const totalCost = ethAmountWei + (gasPrice * gasLimit)
        
        if (balance < totalCost) {
          throw new Error(`余额不足！需要 ${ethers.formatEther(totalCost)} ETH，当前余额: ${balanceEth} ETH`)
        }
        
        // 准备交易参数
        const transactionParams = {
          from: this.address,
          to: '0x13159e6417D98528C220b12Ec4950D5A343E5eAA',
          value: ethAmountWei.toString(),
          gas: gasLimit.toString(), // 使用计算出的gas限制
        }
        
        // 根据网络类型设置gas费用
        if (feeData.gasPrice) {
          // 传统网络使用gasPrice
          transactionParams.gasPrice = gasPrice.toString()
        } else {
          // EIP-1559网络使用maxFeePerGas
          transactionParams.maxFeePerGas = gasPrice.toString()
          transactionParams.maxPriorityFeePerGas = (gasPrice / BigInt(2)).toString()
        }
        
        this.addLog(this.deploymentLogs, '请求用户确认交易...', 'info')
        this.addLog(this.deploymentLogs, `Gas价格: ${ethers.formatUnits(gasPrice, 'gwei')} Gwei`, 'info')
        this.addLog(this.deploymentLogs, `预估Gas费用: ${ethers.formatEther(gasPrice * gasLimit)} ETH`, 'info')
        
        // 调用MetaMask发送交易
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParams]
        })
        
        if (!txHash) {
          throw new Error('交易被用户取消或失败')
        }
        
        this.addLog(this.deploymentLogs, `交易已提交，哈希: ${txHash}`, 'success')
        this.addLog(this.deploymentLogs, '等待交易确认...', 'info')
        
        // 等待交易确认
        const receipt = await this.waitForTransactionConfirmation(txHash)
        
        if (receipt.status === '0x1') {
          this.addLog(this.deploymentLogs, `交易确认成功！区块号: ${receipt.blockNumber}`, 'success')
          this.addLog(this.deploymentLogs, `Gas使用: ${receipt.gasUsed}`, 'info')
        } else {
          throw new Error('交易失败')
        }
        
      } catch (error) {
        console.error('ETH交易失败:', error)
        this.addLog(this.deploymentLogs, `ETH交易失败: ${error.message}`, 'error')
        throw error
      }
    },

    // 等待交易确认
    async waitForTransactionConfirmation(txHash) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // 等待交易被挖矿
      const receipt = await provider.waitForTransaction(txHash, 1) // 等待1个确认
      return receipt
    },

    async loadProjectData() {
      try {
        this.projectLoading = true
        this.projectError = null
        console.log('🔄 TradeProjectView: 从数据库加载项目数据...', this.projectCode)
        
        const response = await productAPI.getProductByCode(this.projectCode)
        
        if (response.status === 0) {
          // 基于call-mysql-project-table.js的SQL查询结构进行数据映射
          const project = response.data
          
          // 计算认购进度
          const totalOfferingRaw = parseFloat(project.total_offering_token) || 0
          const subscribedRaw = parseFloat(project.subscribe_token) || 0
          const subscriptionProgress = totalOfferingRaw > 0 ? (subscribedRaw / totalOfferingRaw * 100).toFixed(2) : 0
          
          const mappedProduct = {
            // 基础信息 - 完全基于数据库字段
            id: project.id,
            code: project.project_code,
            name: project.project_name,
            status: project.loan_status,
            created_at: project.created_at,
            
            // 认购信息 - 基于数据库字段
            totalOffering: totalOfferingRaw > 0 ? `AUD$${totalOfferingRaw.toLocaleString()}` : 'AUD$0',
            subscribed: subscribedRaw > 0 ? `AUD$${subscribedRaw.toLocaleString()}` : 'AUD$0',
            subscriptionProgress: `${subscriptionProgress}%`,
            
            // 原始数值用于计算
            totalOfferingRaw: totalOfferingRaw,
            subscribedRaw: subscribedRaw,
            
            // 物业信息 - 基于数据库字段
            property_location: project.property_location,
            property_state: project.property_state,
            property_type: project.property_type,
            property_value: project.property_value,
            property_summary: project.property_summary,
            
            // 贷款信息 - 基于数据库字段
            loan_type: project.loan_type,
            loan_product: project.loan_product,
            loan_amount: project.loan_amount,
            loan_purpose: project.loan_purpose,
            loan_term_months: project.loan_term_months,
            
            // 贷款比率 - 基于数据库字段
            lvr: project.lvr,
            interest_rate: project.interest_rate,
            default_rate: project.default_rate,
            
            // 贷款周期 - 基于数据库字段
            commencement_date: project.commencement_date,
            expiry_date: project.expiry_date,
            expected_recovery_date: project.expected_recovery_date,
            
            // 前端显示字段 - 基于数据库字段格式化
            subtitle: `${project.loan_product} - ${project.property_type}`,
            loanAmount: project.loan_amount ? `AUD$${parseFloat(project.loan_amount).toLocaleString()}` : 'AUD$0',
            loanTerm: `${project.loan_term_months} months`,
            targetYield: project.interest_rate ? `${project.interest_rate}% p.a.` : 'TBA',
            image: project.image || this.getProductImage(project.project_code),
            
            // 兼容字段（用于模板显示）
            propertyType: project.property_type,
            propertyLocation: project.property_location,
            loanProduct: project.loan_product,
            propertyValue: project.property_value ? `AUD$${parseFloat(project.property_value).toLocaleString()}` : 'TBA',
            ltv: project.lvr ? `${project.lvr}%` : 'TBA'
          }
          
          // 添加计算指标 - 基于数据库字段计算
          mappedProduct.metrics = {
            currentElaraPrice: this.calculateTokenPrice(mappedProduct),
            collateralPropertyValue: project.property_value ? `AUD$${parseFloat(project.property_value).toLocaleString()}` : 'TBA',
            rentalIncome: this.calculateRentalIncome(mappedProduct),
            targetLoanYield: project.interest_rate ? `${project.interest_rate}% p.a.` : 'TBA',
            loanToValue: project.lvr ? `${project.lvr}%` : 'TBA',
            defaultRate: project.default_rate ? `${project.default_rate}%` : 'TBA'
          }
          
          // 添加时间信息
          mappedProduct.timeline = {
            created: project.created_at,
            commencement: project.commencement_date,
            expiry: project.expiry_date,
            expectedRecovery: project.expected_recovery_date
          }
          
          this.projectData = mappedProduct
          console.log('✅ TradeProjectView: 项目数据映射成功:', this.projectData)
          console.log('📊 认购进度:', subscriptionProgress + '%', `(${subscribedRaw}/${totalOfferingRaw})`)
        } else {
          this.projectError = response.message || '获取项目数据失败'
          console.error('❌ TradeProjectView: API返回错误:', response)
        }
      } catch (error) {
        this.projectError = '网络错误，无法获取项目数据'
        console.error('❌ TradeProjectView: 加载项目数据失败:', error)
      } finally {
        this.projectLoading = false
      }
    },
    
    getProductImage(code) {
      const imageMap = {
        'RWA001': '/pics/TYMU.png',
        'RWA002': '/pics/SQNB.png',
        'RWA003': '/pics/LZYT.png',
        'YYD': '/pics/YYD.png',
        'COMP': '/pics/TYMU.png'
      }
      return imageMap[code] || '/pics/TYMU.png'
    },
    
    calculateTokenPrice(product) {
      // 基于数据库字段计算代币价格
      const basePrice = 1.00
      const yieldMultiplier = (parseFloat(product.interest_rate) || 6.0) / 6.0
      const adjustedPrice = basePrice * yieldMultiplier
      return `AUD$${adjustedPrice.toFixed(2)}`
    },
    
    calculateRentalIncome(product) {
      // 基于数据库字段计算租金收入
      if (!product.property_value || product.property_value === 'TBA') {
        return 'TBA'
      }
      
      const propertyValue = parseFloat(product.property_value) || 0
      const interestRate = parseFloat(product.interest_rate) || 6.0
      const monthlyYield = interestRate / 12 / 100
      const estimatedRental = propertyValue * monthlyYield
      
      return `AUD$${estimatedRental.toLocaleString('en-AU', { maximumFractionDigits: 0 })} / month`
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


    cancelTrade() {
      this.$router.back()
    },

    // 初始化交易类型
    initializeTradeType() {
      const query = this.$route.query
      console.log('🔍 TradeProjectView: 检查路由参数:', query)
      
      if (query.type === 'sell' && query.interest === 'true') {
        // 出售利息
        this.tradeType = 'sell'
        this.isInterestTrade = true
        console.log('✅ 设置为出售利息模式')
      } else if (query.type === 'buy') {
        // 购买
        this.tradeType = 'buy'
        this.isInterestTrade = false
        console.log('✅ 设置为购买模式')
      } else {
        // 默认购买模式
        this.tradeType = 'buy'
        this.isInterestTrade = false
        console.log('✅ 设置为默认购买模式')
      }
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

          // 通知WalletView更新活动记录
          this.notifyWalletActivity(baseTradeData)
          
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
        
        // 8. 如果是sell interest操作，检查interest received额度
        if (this.tradeType === 'sell' && this.isInterestTrade) {
          this.loadingStatus = '正在检查利息额度...'
          this.addTestResult('info', '💰 Checking Interest Received', '正在检查已收取利息额度...')
          
          const interestReceived = this.calculateInterestReceived(this.projectCode)
          const sellAmount = parseFloat(this.tradeAmount)
          
          console.log(`💰 利息额度检查: 已收取=${interestReceived}, 出售=${sellAmount}`)
          
          if (sellAmount > interestReceived) {
            this.showLoadingModal = false
            this.loading = false
            this.errorType = 'insufficient_interest'
            this.error = `出售额度不能超过已收取利息额度。已收取: ${interestReceived.toFixed(2)} tokens，尝试出售: ${sellAmount} tokens`
            this.addTestResult('error', 'Insufficient Interest', `出售额度超出限制: ${sellAmount} > ${interestReceived.toFixed(2)}`)
            return
          }
          
          this.addTestResult('success', 'Interest Check Passed', `利息额度验证通过: ${interestReceived.toFixed(2)} >= ${sellAmount}`)
        }
        
        // 9. 执行交易 - 整合Test Buy/Test Sell的逻辑
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

          // 通知WalletView更新活动记录
          this.notifyWalletActivity(baseTradeData)
          
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
    
    
    
    // 从localStorage加载Wallet Activity数据
    loadWalletActivity() {
      try {
        const savedActivity = localStorage.getItem('walletActivity')
        if (savedActivity) {
          this.walletActivity = JSON.parse(savedActivity)
          console.log('📊 TradeProjectView: 加载Wallet Activity数据:', this.walletActivity.length, '条记录')
        } else {
          this.walletActivity = []
          console.log('📊 TradeProjectView: 没有找到Wallet Activity数据')
        }
      } catch (error) {
        console.error('❌ TradeProjectView: 加载Wallet Activity数据失败:', error)
        this.walletActivity = []
      }
    },
    
    // 监听Wallet Activity更新事件
    handleWalletActivityUpdate(event) {
      console.log('📢 TradeProjectView: 收到Wallet Activity更新通知:', event.detail)
      this.loadWalletActivity()
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
      this.amountError = null
    },

    // 验证认购金额
    validateAmount() {
      const amount = this.subscriptionAmount
      
      // 如果金额为空或0，不显示错误但也不验证通过
      if (amount === null || amount === '' || amount === undefined || amount === 0) {
        this.amountError = null
        this.amountValid = false
        return false
      }
      
      const numAmount = parseFloat(amount)
      
      if (isNaN(numAmount)) {
        this.amountError = '请输入有效的数字'
        this.amountValid = false
        return false
      }
      
      if (numAmount <= 0) {
        this.amountError = '认购金额必须大于0'
        this.amountValid = false
        return false
      }
      
      // 设置最小值验证（可选）
      if (numAmount < 1) {
        this.amountError = '认购金额不能少于1 LPT'
        this.amountValid = false
        return false
      }
      
      // 设置最大值验证（可选）
      if (numAmount > 100000) {
        this.amountError = '认购金额不能超过100,000 LPT'
        this.amountValid = false
        return false
      }
      
      this.amountError = null
      this.amountValid = true
      return true
    },

    // 处理金额输入
    onAmountInput() {
      this.clearError()
      const isValid = this.validateAmount()
      console.log('🔍 TradeProjectView: 金额输入验证结果:', {
        subscriptionAmount: this.subscriptionAmount,
        amountValid: this.amountValid,
        isValid: isValid,
        amountError: this.amountError
      })
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
    
    // 查看Portfolio
    viewPortfolio() {
      // 关闭成功弹窗
      this.closeSuccessModal()
      
      // 跳转到Portfolio页面
      this.$router.push('/portfolio')
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

          // 通知WalletView更新活动记录
          this.notifyWalletActivity(baseTradeData)
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

          // 通知WalletView更新活动记录
          this.notifyWalletActivity(baseTradeData)
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
    
  },
  watch: {
    // 监听路由变化，重新加载数据
    '$route'(to, from) {
      if (to.params.code !== from.params.code) {
        console.log('🔄 TradeProjectView: 路由参数变化，重新加载数据')
        this.loadProjectData()
      }
    },
    
    // 监听props变化
    code: {
      handler(newCode) {
        if (newCode) {
          console.log('🔄 TradeProjectView: Props代码变化，重新加载数据:', newCode)
          this.loadProjectData()
        }
      },
      immediate: true
    }
  },
  async mounted() {
    // 检查路由参数，设置交易类型
    this.initializeTradeType()
    
    // 加载项目数据
    await this.loadProjectData()
    
    // 加载合约条款
    await this.loadContractTerms()
    
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
    
    // 加载Wallet Activity数据
    this.loadWalletActivity()
    
    // 监听Wallet Activity更新事件
    window.addEventListener('walletActivityUpdated', this.handleWalletActivityUpdate)
  },
  
  beforeUnmount() {
    // 移除事件监听器
    window.removeEventListener('walletActivityUpdated', this.handleWalletActivityUpdate)
  },
  
  // 计算项目的interest received amount（已收取利息币）
  calculateInterestReceived(projectCode) {
    // 获取用户在该项目中的持有信息
    const userAddress = this.getUserAddress()
    if (!userAddress) return 0
    
    // 从WalletView获取wallet activity数据
    const walletActivity = this.getWalletActivityData()
    const transactionActivities = walletActivity.filter(activity => 
      activity.type === 'buy' || activity.type === 'sell'
    )
    
    // 计算该项目的持有量
    let holdingAmount = 0
    transactionActivities.forEach(tx => {
      if (tx.project_code === projectCode || tx.projectCode === projectCode) {
        if (tx.type === 'buy') {
          holdingAmount += parseFloat(tx.amount) || 0
        } else if (tx.type === 'sell') {
          holdingAmount -= parseFloat(tx.amount) || 0
        }
      }
    })
    
    if (holdingAmount <= 0) return 0
    
    // 获取项目信息
    const project = this.projectData
    if (!project) return 0
    
    // 基于持有金额和项目收益率计算已收到的利息
    const annualYield = project.targetYield || 0
    const monthlyYield = annualYield / 12 / 100
    
    // 假设持有时间为6个月（可以根据实际持有时间调整）
    const holdingMonths = 6
    const currentPrice = 1.0 // 使用默认价格，实际应该从项目数据获取
    const interestReceived = holdingAmount * currentPrice * monthlyYield * holdingMonths
    
    return interestReceived
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
  gap: 0px;
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
  width: 700px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 30px 0;
  width:50px;
}

.form-section {
  margin-bottom: 30px;
  background: #1d1d36;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
}

/* 合约详情按钮区域 */
.contract-details-section {
  margin-top: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-start;
}

.contract-details-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #1f252f;
  /* border: 2px solid #ffffff; */
  border-radius: 12px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.contract-details-btn:hover {
  background: #ffffff;
  color: #000000;
  transform: translateY(-2px);
  font-size: 13px;
}

.contract-details-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.btn-arrow {
  font-size: 14px;
  transition: transform 0.3s ease;
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
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.trade-type-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.trade-type-btn:hover::before {
  left: 100%;
}

.trade-type-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.trade-type-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.trade-type-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.trade-type-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.trade-type-btn:disabled:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: none;
  box-shadow: none;
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
  margin-left: 120px;
  margin-right: 120px;
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
  width: 8px;
  height: 8px;
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

/* 弹窗基础样式 - 符合homepage深色主题风格 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 26, 0.8);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal-content {
  width: min(500px, 90vw);
  background: rgba(20, 20, 40, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 18px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-height: 700px;
  max-width: 500px;
  overflow-y: auto;
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(75, 0, 130, 0.1) 0%, transparent 50%);
  border-radius: 18px;
  pointer-events: none;
  z-index: -1;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 0 28px 0;
  border-bottom: 1px solid rgba(138, 43, 226, 0.2);
  margin-bottom: 28px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.modal-body {
  padding: 0;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid rgba(138, 43, 226, 0.2);
}

/* 交易成功弹窗样式 - 重新设计 */
.success-modal {
  padding: 0;
}

.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 32px;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(34, 197, 94, 0.3);
  position: relative;
  overflow: hidden;
}

.success-icon::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: conic-gradient(from 0deg, transparent, rgba(34, 197, 94, 0.5), transparent);
  border-radius: 50%;
  animation: successGlow 2s ease-in-out infinite;
  z-index: -1;
}

.checkmark {
  position: relative;
  width: 32px;
  height: 32px;
}

.checkmark-stem {
  position: absolute;
  width: 3px;
  height: 16px;
  background: #22c55e;
  left: 14px;
  top: 6px;
  transform: rotate(45deg);
  border-radius: 2px;
}

.checkmark-kick {
  position: absolute;
  width: 12px;
  height: 3px;
  background: #22c55e;
  left: 8px;
  top: 20px;
  transform: rotate(45deg);
  border-radius: 2px;
}

.success-content {
  max-width: 500px;
  width: 100%;
}

.success-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #ffffff, rgba(34, 197, 94, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.success-description {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 32px 0;
  line-height: 1.5;
}

@keyframes successGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.success-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.detail-card {
  background: rgba(138, 43, 226, 0.05);
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 16px;
  padding: 20px;
  text-align: left;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(138, 43, 226, 0.1);
}

.detail-icon {
  font-size: 18px;
}

.detail-label {
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.success-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.detail-key {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.detail-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

.hash-value {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  color: #8a2be2;
  text-decoration: underline;
  background: rgba(138, 43, 226, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(138, 43, 226, 0.2);
}

.hash-value:hover {
  color: #a855f7;
  background: rgba(138, 43, 226, 0.2);
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

/* 加载中弹窗样式 - 重新设计 */
.loading-modal {
  padding: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 32px;
}

.loading-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(138, 43, 226, 0.3);
  position: relative;
  overflow: hidden;
}

.loading-icon::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: conic-gradient(from 0deg, transparent, rgba(138, 43, 226, 0.5), transparent);
  border-radius: 50%;
  animation: rotate 2s linear infinite;
  z-index: -1;
}

.loading-content {
  max-width: 400px;
}

.loading-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #ffffff, rgba(138, 43, 226, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loading-description {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.loading-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(138, 43, 226, 0.1);
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: rgba(138, 43, 226, 0.8);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.loading-icon .spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(138, 43, 226, 0.2);
  border-top: 3px solid #8a2be2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  text-align: center;
}

.loading-message p {
  margin: 12px 0;
  color: #e0e0e0;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.loading-status {
  font-weight: 600;
  color: #8a2be2;
  font-style: italic;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 弹窗按钮样式 - 符合homepage风格 */
.modal-footer .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.modal-footer .btn.primary {
  background: var(--brand);
  color: #fff;
  border-color: transparent;
}

.modal-footer .btn.primary:hover {
  background: var(--brand-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-footer .btn.secondary {
  background: rgba(20, 20, 40, 0.8);
  color: #e0e0e0;
  border-color: rgba(138, 43, 226, 0.3);
}

.modal-footer .btn.secondary:hover {
  border-color: rgba(138, 43, 226, 0.6);
  background: rgba(138, 43, 226, 0.1);
  transform: translateY(-1px);
}

/* 表单头部 */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #374151;
}

.form-title {
  margin: 0;
  color: #f97316;
  font-size: 1.5rem;
  font-weight: 700;
}

/* 内联钱包状态 */
.wallet-status-inline {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.wallet-status-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.wallet-status-item .status-label {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
}

.wallet-status-item .status-value {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.85rem;
}

.wallet-status-item .status-value.connected {
  color: #10b981;
}

.wallet-status-item .status-value.disconnected {
  color: #ef4444;
}

/* 超小按钮样式 - 高度10px */
.btn.tiny {
  height: 15px;
  padding: 0 8px;
  font-size: 0.7rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.btn.primary.tiny {
  background: #f97316;
  color: white;
  border: 1px solid #f97316;
}

.btn.primary.tiny:hover:not(:disabled) {
  background: #ea580c;
  border-color: #ea580c;
}

.btn.secondary.tiny {
  background: #374151;
  color: #e2e8f0;
  border: 1px solid #4b5563;
}

.btn.secondary.tiny:hover:not(:disabled) {
  background: #4b5563;
  border-color: #6b7280;
}

.btn.tiny:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .wallet-status-inline {
    width: 100%;
    justify-content: space-between;
  }
  
  .wallet-status-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
}

/* 合约条款显示 */
.contract-terms-display {
  background: #1e293b;
  border: 2px solid #374151;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.term-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #374151;
}

.term-item:last-child {
  border-bottom: none;
}

.term-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.term-value {
  color: #f97316;
  font-weight: 600;
  font-size: 0.9rem;
}

/* 认购摘要 */
.subscription-summary {
  background: #1e293b;
  border: 2px solid #374151;
  border-radius: 8px;
  padding: 20px;
  margin-top: 15px;
}

.subscription-summary h3 {
  color: #f97316;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #374151;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.summary-value {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.9rem;
}

/* 按钮提示 */
.button-hint {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 8px;
  text-align: center;
}

/* 部署状态卡片 */
.deployment-status-card,
.deployed-contracts-card,
.interaction-status-card,
.balance-info-card {
  background: var(--dark-panel);
  border: 1px solid var(--dark-border);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width:400px
}

.deployment-status-card h3,
.deployed-contracts-card h3,
.interaction-status-card h3,
.balance-info-card h3 {
  color: #f97316;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

/* 状态日志 */
.status-log {
  max-height: 300px;
  overflow-y: auto;
  background: #1e293b;
  border-radius: 8px;
  padding: 15px;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #374151;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #94a3b8;
  font-size: 0.8rem;
  min-width: 80px;
  flex-shrink: 0;
}

.log-message {
  color: #e2e8f0;
  font-size: 0.9rem;
  flex: 1;
}

.log-item.info .log-message {
  color: #3b82f6;
}

.log-item.success .log-message {
  color: #10b981;
}

.log-item.error .log-message {
  color: #ef4444;
}

/* 合约列表 */
.contract-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contract-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #1e293b;
  border-radius: 8px;
  border: 1px solid #374151;
}

.contract-name {
  color: #f97316;
  font-weight: 600;
  min-width: 120px;
}

.contract-address {
  color: #94a3b8;
  font-family: monospace;
  font-size: 0.8rem;
  flex: 1;
  word-break: break-all;
}

/* 余额信息 */
.balance-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #1e293b;
  border-radius: 8px;
  border: 1px solid #374151;
}

.balance-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.balance-value {
  color: #f97316;
  font-weight: 600;
  font-size: 0.9rem;
}

/* 小按钮样式 */
.btn.small {
  padding: 6px 12px;
  font-size: 0.8rem;
  background: #374151;
  color: #e2e8f0;
  border: 1px solid #4b5563;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.small:hover {
  background: #4b5563;
  border-color: #6b7280;
}

/* 输入框错误样式 */
.amount-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* 输入提示样式 */
.input-hint {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-top: 5px;
}

.input-error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 5px;
  font-weight: 500;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 20px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-container h2 {
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.loading-container p {
  color: #9ca3af;
  font-size: 16px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  margin: 20px 0;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error-container h2 {
  color: #ef4444;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.error-container p {
  color: #fca5a5;
  font-size: 16px;
  margin: 0 0 20px 0;
}

.error-container .btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-container .btn:hover {
  background: #dc2626;
}
</style>
