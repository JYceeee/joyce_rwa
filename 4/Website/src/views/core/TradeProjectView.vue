<template>
  <div class="trade-page">
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

    <!-- 合约地址弹窗 -->
    <div v-if="contractAddressModal.show" class="modal-overlay" @click="closeContractAddressModal"> 
      <div class="modal-content contract-address-modal" @click.stop>
        <div class="contract-address-container">
          <div class="contract-address-header">
            <h2 class="contract-address-title">Contract Addresses</h2>
            <button class="close-btn" @click="closeContractAddressModal">×</button>
          </div>
          
          <div class="contract-address-content">
            <p class="contract-address-description">The following contract addresses will be used for this transaction:</p>
            
            <div class="contract-address-grid">
              <div class="contract-address-item">
                <div class="contract-address-label">Principal Token Address:</div>
                <div class="contract-address-value" @click="copyToClipboard(contractAddressModal.principalTokenAddress)">
                  {{ formatAddress(contractAddressModal.principalTokenAddress) }}
                  <!-- <span class="copy-icon">📋</span> -->
                </div>
              </div>
              
              <div class="contract-address-item">
                <div class="contract-address-label">Interest Token Address:</div>
                <div class="contract-address-value" @click="copyToClipboard(contractAddressModal.interestTokenAddress)">
                  {{ formatAddress(contractAddressModal.interestTokenAddress) }}
                  <!-- <span class="copy-icon">📋</span> -->
                </div>
              </div>
              
              <div class="contract-address-item">
                <div class="contract-address-label">KYC Registry Address:</div>
                <div class="contract-address-value" @click="copyToClipboard(contractAddressModal.kycRegistryAddress)">
                  {{ formatAddress(contractAddressModal.kycRegistryAddress) }}
                  <span class="copy-icon">📋</span>
                </div>
              </div>
              
              <div class="contract-address-item">
                <div class="contract-address-label">Loan Issuer Address:</div>
                <div class="contract-address-value" @click="copyToClipboard(contractAddressModal.loanIssuerAddress)">
                  {{ formatAddress(contractAddressModal.loanIssuerAddress) }}
                  <span class="copy-icon">📋</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="contract-address-actions">
            <button class="btn secondary" @click="closeContractAddressModal">Close</button>
            <button class="btn primary" @click="proceedWithTransaction">Proceed with Transaction</button>
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
              
              <div class="detail-card">
                <div class="detail-header">
                  <span class="detail-label">Contract Addresses</span>
                </div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-key">Principal Token:</span>
                    <span class="detail-value hash-value" @click="copyContractAddress(successData.principalTokenAddress)">{{ formatAddress(successData.principalTokenAddress) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-key">Interest Token:</span>
                    <span class="detail-value hash-value" @click="copyContractAddress(successData.interestTokenAddress)">{{ formatAddress(successData.interestTokenAddress) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="success-actions">
            <button class="btn secondary" @click="closeSuccessModal">Close</button>
            <!-- <button class="btn primary" @click="viewPortfolio">View Portfolio</button> -->
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
      
      <!-- 主要内容布局 -->
      <div v-else-if="projectData" class="main-layout">
        <!-- 左侧：项目信息卡片 -->
        <div class="project-info-card">
        <div class="project-header">
          <img :src="projectData.image" :alt="projectCode" class="project-image" />
          <div class="project-details">
            <h1 class="project-title"> {{ projectData.code }} •  {{ projectData.name }} </h1>
            <p class="project-subtitle">{{ projectData.subtitle }}</p>
            <div class="project-meta">
              <span class="meta-item">{{ projectData.type }}</span>
              <span class="meta-item">{{ projectData.region }}</span>
              <span class="meta-item">{{ projectData.loanProduct || 'Loan Product' }}</span>
            </div>
          </div>
        </div>
        
          <!-- 项目指标 -->
          <div class="project-metrics-container">
            <!-- 认购信息 -->
            <div class="metrics-section">
              <h3 class="metrics-section-title">SUBSCRIPTION INFORMATION</h3>
              <div class="project-metrics">
                <div class="metric-item">
                  <span class="metric-label">SUBSCRIPTION PROGRESS</span>
                  <span class="metric-value" style="color: #3b82f6;">{{ projectData.subscriptionProgress || '0%' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">TOTAL OFFERING</span>
                  <span class="metric-value">{{ projectData.totalOffering || 'AUD0' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">SUBSCRIBED</span>
                  <span class="metric-value">{{ projectData.subscribed || 'AUD0' }}</span>
                </div>
              </div>
            </div>

            <!-- 贷款信息 -->
            <div class="metrics-section">
              <h3 class="metrics-section-title">LOAN INFORMATION</h3>
              <div class="project-metrics">
                <div class="metric-item">
                  <span class="metric-label">LOAN SIZE</span>
                  <span class="metric-value">{{ projectData.loanAmount || 'AUD0' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">EST. YIELD (IRR)</span>
                  <span class="metric-value" style="color: #16a34a;">{{ projectData.metrics?.targetLoanYield || 'N/A' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">TERM</span>
                  <span class="metric-value">{{ projectData.loanTerm || '12 months' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">LTV</span>
                  <span class="metric-value">{{ projectData.metrics?.loanToValue || 'N/A' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">DEFAULT RATE</span>
                  <span class="metric-value">{{ projectData.metrics?.defaultRate || 'N/A' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">LENDER</span>
                  <span class="metric-value">{{ projectData.lender || 'N/A' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">BORROWER</span>
                  <span class="metric-value">{{ projectData.borrower || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- 抵押物信息 -->
            <div class="metrics-section">
              <h3 class="metrics-section-title">COLLATERAL INFORMATION</h3>
              <div class="project-metrics">
                <div class="metric-item">
                  <span class="metric-label">PROPERTY VALUE</span>
                  <span class="metric-value">{{ projectData.metrics?.collateralPropertyValue || 'N/A' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Address of Asset</span>
                  <span class="metric-value">{{ getAssetAddress() }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">MORTGAGE TYPE</span>
                  <span class="metric-value">{{ getMortgageType() }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">DEAL MAKER/SPONSOR</span>
                  <span class="metric-value">{{ projectData.dealMaker || 'N/A' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">VALUER</span>
                  <span class="metric-value">{{ projectData.valuer || 'N/A' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">LAWYER</span>
                  <span class="metric-value">{{ projectData.lawyer || 'N/A' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">TRUSTEE</span>
                  <span class="metric-value">{{ projectData.trustee || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：交易表单 (仅当项目状态为ACTIVE且为BUY入口时显示) -->
        <div v-if="projectData.status === 'ACTIVE' && isBuyEntry" class="trade-form-card">
          <!-- 合约地址信息 (仅BUY入口显示) -->
          <div class="contract-addresses-section">
            <h3 class="contract-addresses-title">SMART CONTRACT ADDRESSES</h3>
            <div class="contract-addresses-grid">
              <div class="contract-address-item">
                <div class="contract-address-label">
                  PRINCIPAL TOKEN ADDRESS
                </div>
                <div class="contract-address-value" @click="copyToClipboard(getPrincipalTokenAddress())">
                  {{ formatAddress(getPrincipalTokenAddress()) }}
                </div>
              </div>
              
              <div class="contract-address-item">
                <div class="contract-address-label">
                  <!-- <span class="contract-icon">📈</span> -->
                  INTEREST TOKEN ADDRESS
                </div>
                <div class="contract-address-value" @click="copyToClipboard(getInterestTokenAddress())">
                  {{ formatAddress(getInterestTokenAddress()) }}
                  <!-- <span class="copy-icon">📋</span> -->
                </div>
              </div>
            </div>
           </div>
           
           <!-- 分割线 -->
           <hr class="section-divider" />
 
           <div class="form-header">
            <h2 class="form-title">SUBSCRIBE {{ projectData?.code }}</h2>
            <!-- 钱包状态 -->
            <div class="wallet-status-inline">
              <!-- <div class="wallet-status-item">
                <span class="status-label">WALLET:</span>
                <span :class="['status-value', connected ? 'connected' : 'disconnected']">
                  {{ connected ? 'Connected' : 'Disconnected' }}
                </span>
              </div> -->
              <div class="wallet-status-item" v-if="connected">
                <span class="status-label">WALLETADDRESS:</span>
                <span class="status-value">{{ shortAddress }}</span>
              </div>
              <div class="wallet-status-item" v-if="connected">
                <span class="status-label">NETWORK:</span>
                <span class="status-value">{{ networkLabel }}</span>
              </div>
            </div>
          </div>

        <!-- 交易表单 -->
        <div class="trade-form">
          <!-- 交易类型显示（不可选择） -->
          <!-- <div class="form-group">
            <label class="form-label">交易类型</label>
            <div class="trade-type-display">
              <div :class="['trade-type-indicator', tradeType]">
                {{ tradeType === 'buy' ? '认购代币' : '赎回利息' }}
          </div>
        </div>
          </div> -->

          <div class="form-group">
            <label class="form-label">数量 (Tokens)</label>
            <input 
              v-model="tradeAmount"
              type="number" 
              class="form-input"
              placeholder="输入交易数量"
              min="0"
              step="0.01"
            />
        </div>

          <!-- 交易摘要 -->
          <div v-if="tradeAmount && parseFloat(tradeAmount) > 0" class="subscription-summary">
            <div class="summary-header">
              <h3 class="summary-title">{{ tradeType === 'buy' ? '认购摘要' : '赎回摘要' }}</h3>
              <div class="summary-badge" :class="tradeType">
                {{ tradeType === 'buy' ? '认购' : '赎回利息' }}
          </div>
        </div>

            <div class="summary-content">
              <div class="summary-row">
                <span class="summary-label">项目代码:</span>
                <span class="summary-value">{{ projectData?.code || 'N/A' }}</span>
      </div>

              <div class="summary-row">
                <span class="summary-label">交易类型:</span>
                <span class="summary-value">{{ tradeType === 'buy' ? '认购代币' : '赎回利息' }}</span>
        </div> 

              <div class="summary-row">
                <span class="summary-label">代币数量:</span>
                <span class="summary-value">{{ formatNumber(tradeAmount) }} Tokens</span>
      </div>

              <div class="summary-row">
                <span class="summary-label">年化收益率:</span>
                <span class="summary-value">{{ projectData?.interestRate || 'N/A' }}%</span>
      </div>

              <div class="summary-row">
                <span class="summary-label">预期收益:</span>
                <span class="summary-value">{{ calculateExpectedReturn() }}</span>
      </div>
          
              <div class="summary-row">
                <span class="summary-label">贷款期限:</span>
                <span class="summary-value">{{ projectData?.loanTerm || 'N/A' }}</span>
        </div>
        </div>

            <div class="summary-footer">
              <div class="risk-warning">
                <div class="warning-icon">⚠️</div>
                <div class="warning-text">
                  <p>投资有风险，请仔细阅读项目详情并评估风险承受能力。</p>
        </div>
          </div>
          </div>
              </div>

         <!-- 认购按钮 -->
        <div class="form-actions">
            <button 
            class="btn primary trade-btn"
            @click="executeOneClickTrade"
            :disabled="!isFormValid || loading"
            >
            <span class="btn-text">
                {{ loading ? 'Processing...' : (tradeType === 'buy' ? '确认认购' : '确认赎回') }}
                  </span>
            </button>
                </div>
          
                </div>
                </div>
        </div>
        
        <!-- DETAILS入口：项目最新动态 -->
        <div v-else-if="projectData.status === 'INCOMING'" class="project-news-card">
          <div class="news-header">
            <h2 class="news-title">PROJECT UPDATES</h2>
          </div>
          <div class="news-content">
            <div class="news-list">
              <div class="news-item">
                <div class="news-date">2024-10-04</div>
                <div class="news-text">项目正式启动，开始接受投资申请</div>
              </div>
              <div class="news-item">
                <div class="news-date">2024-10-03</div>
                <div class="news-text">完成项目尽职调查，风险评估报告已发布</div>
              </div>
              <div class="news-item">
                <div class="news-date">2024-10-02</div>
                <div class="news-text">项目抵押物评估完成，估值确认</div>
              </div>
              <div class="news-item">
                <div class="news-date">2024-10-01</div>
                <div class="news-text">项目上线，详细信息已更新</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 非ACTIVE状态提示 (仅BUY入口显示) -->
        <div v-else class="project-status-card">
          <div class="status-header">
            <h2 class="status-title">PROJECT STATUS</h2>
          </div>
          <div class="status-content">
            <div class="status-info">
              <div class="status-badge" :class="getStatusClass(projectData.status)">
                {{ getStatusText(projectData.status) }}
              </div>
              <p class="status-description">
                {{ getStatusDescription(projectData.status) }}
              </p>
            </div>
            <div class="status-actions">
              <button class="btn secondary" @click="openDetail(projectData.code)">VIEW DETAILS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { projectAPI, transactionAPI, userAPI } from '@/service/api'
import { useWallet } from '@/composables/useWallet'
import { ethers } from 'ethers'
import { CONTRACT_CONFIG } from '@/config/contractConfig'

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
      loading: false,
      error: null,
      showSuccessModal: false,
      showLoadingModal: false,
      loadingStatus: '',
      successData: {
        tradeType: '',
        amount: 0,
        transactionHash: '',
        blockNumber: 0
      },
      // 项目数据
      projectData: null,
      projectLoading: true,
      projectError: null,
      // 合约地址弹窗
      contractAddressModal: {
        show: false,
        principalTokenAddress: '',
        interestTokenAddress: '',
        kycRegistryAddress: '',
        loanIssuerAddress: ''
      },
      // 网络配置
      networkConfig: {
        sepolia: { chainId: '0xaa36a7', name: 'Sepolia Test Network' },
        mainnet: { chainId: '0x1', name: 'Ethereum Mainnet' }
      },
      // 从合约配置获取LoanIssuer地址
      loanIssuerAddress: CONTRACT_CONFIG.LOAN_ISSUER_ADDRESS,
      // 部署的合约地址
      deployedContracts: {
        principalTokenAddress: '',
        interestTokenAddress: '',
        kycRegistryAddress: '',
        loanIssuerAddress: ''
      }
    }
  },
  computed: {
    projectCode() {
      const code = this.code || this.$route.params.code || this.$route.query.code
      console.log('🔍 TradeProjectView: 获取项目代码:', code)
      return code || 'RWA001'
    },
    
    // 检测是否为BUY入口
    isBuyEntry() {
      // 检查路由参数或查询参数中的type
      const type = this.$route.query.type
      console.log('🔍 TradeProjectView: 检测入口类型:', type)
      return type === 'buy'
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
    
    // 是否可以执行交易
    canExecuteTrade() {
      return this.connected && this.tradeAmount && parseFloat(this.tradeAmount) > 0 && !this.loading
    },
    
    // 表单是否有效
    isFormValid() {
      return this.connected && 
             this.tradeAmount && 
             parseFloat(this.tradeAmount) > 0 && 
             this.projectData &&
             this.projectCode
    }
  },
  async mounted() {
    console.log('🚀 TradeProjectView: 组件挂载，开始初始化...')
    
    // 根据query参数初始化交易类型
    this.initializeTradeType()
    
    await this.loadProjectData()
    console.log('✅ TradeProjectView: 组件初始化完成')
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
  methods: {
    // 获取本金代币合约地址
    getPrincipalTokenAddress() {
      // 根据项目代码返回对应的本金代币地址
      const projectContracts = {
        'RWA001': '0xA41b4F0417d588a08F914Ca17b07c99783D5c3FC',
        // 可以添加更多项目的合约地址
        // 'RWA002': '0x...',
        // 'RWA003': '0x...',
      }
      
      return projectContracts[this.projectCode] || CONTRACT_CONFIG.PRINCIPAL_TOKEN_ADDRESS
    },
    
    // 获取利息代币合约地址
    getInterestTokenAddress() {
      // 根据项目代码返回对应的利息代币地址
      const projectContracts = {
        'RWA001': '0x9d3175E3F8c055389e070e058f717D450bB89206',
        // 可以添加更多项目的合约地址
        // 'RWA002': '0x...',
        // 'RWA003': '0x...',
      }
      
      return projectContracts[this.projectCode] || CONTRACT_CONFIG.INTEREST_TOKEN_ADDRESS
    },
    
    // 获取资产地址 (城市/邮编格式)
    getAssetAddress() {
      if (this.projectData?.city && this.projectData?.postcode) {
        return `${this.projectData.city}/${this.projectData.postcode}`
      }
      if (this.projectData?.address) {
        return this.projectData.address
      }
      return 'N/A'
    },
    
    // 获取抵押权类型
    getMortgageType() {
      if (this.projectData?.mortgageType) {
        return this.projectData.mortgageType
      }
      // 根据项目代码返回默认抵押权类型
      const mortgageTypes = {
        // 可以添加更多项目的抵押权类型
      }
      
      return mortgageTypes[this.projectCode] || '第一抵押权人'
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      const statusClasses = {
        'INCOMING': 'status-incoming',
        'PERFORMING': 'status-performing',
        'COMPLETED': 'status-completed',
        'COMPLETE': 'status-complete',
        'DEFAULT': 'status-default',
        'CANCELLED': 'status-cancelled'
      }
      return statusClasses[status] || 'status-unknown'
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusTexts = {
        'INCOMING': 'COMING SOON',
        'PERFORMING': 'IN PROGRESS',
        'COMPLETED': 'COMPLETED',
        'COMPLETE': 'COMPLETED',
        'DEFAULT': 'DEFAULT',
        'CANCELLED': 'CANCELLED'
      }
      return statusTexts[status] || 'UNKNOWN'
    },
    
    // 获取状态描述
    getStatusDescription(status) {
      const descriptions = {
        'INCOMING': 'This project is coming soon. Trading is not yet available.',
        'PERFORMING': 'This project is currently in progress. Trading is not available.',
        'COMPLETED': 'This project has been completed. Trading is no longer available.',
        'COMPLETE': 'This project has been completed. Trading is no longer available.',
        'DEFAULT': 'This project is in default. Trading is not available.',
        'CANCELLED': 'This project has been cancelled. Trading is not available.'
      }
      return descriptions[status] || 'This project is not available for trading.'
    },
    
    // 打开详情页面
    openDetail(code) {
      this.$router.push(`/projects/${code}`)
    },
    
    // 初始化交易类型
    initializeTradeType() {
      const queryType = this.$route.query.type
      const isInterest = this.$route.query.interest === 'true'
      
      console.log('🔍 TradeProjectView: 初始化交易类型', { queryType, isInterest })
      
      if (queryType === 'sell' || isInterest) {
        this.tradeType = 'sell'
        console.log('📉 TradeProjectView: 设置为赎回利息模式')
        } else {
        this.tradeType = 'buy'
        console.log('📈 TradeProjectView: 设置为认购代币模式')
      }
    },

    async loadProjectData() {
      try {
        this.projectLoading = true
        this.projectError = null
        console.log('🔄 TradeProjectView: 从数据库加载项目数据...', this.projectCode)
        
        // 直接从API获取项目数据
        const response = await projectAPI.getProjectByCode(this.projectCode)
        
        if (response.status === 0) {
          const rawData = response.data
          console.log('✅ TradeProjectView: 从数据库获取项目数据:', rawData)
          
          // 映射数据库字段到前端期望的字段名
          this.projectData = {
            // 基本信息
            id: rawData.id,
            code: rawData.project_code || rawData.code,
            name: rawData.project_name || rawData.name,
            subtitle: rawData.project_summary || rawData.subtitle,
            type: rawData.property_type || rawData.type,
            status: rawData.loan_status || rawData.status,
            image: rawData.image || this.getProductImage(rawData.project_code || rawData.code),
            
            // 认购信息
            totalOffering: rawData.total_offering_token ? `AUD${rawData.total_offering_token.toLocaleString()}` : 'AUD0',
            subscribed: rawData.subscribe_token ? `AUD${rawData.subscribe_token.toLocaleString()}` : 'AUD0',
            subscriptionProgress: this.calculateSubscriptionProgress(rawData),
            
            // 贷款信息
            loanAmount: rawData.loan_amount ? `AUD${rawData.loan_amount.toLocaleString()}` : 'AUD0',
            loanTerm: rawData.loan_term_months ? `${rawData.loan_term_months} months` : '12 months',
            interestRate: rawData.interest_rate || rawData.target_yield || '6.0',
            
            // 物业信息
            propertyType: rawData.property_type,
            propertyLocation: rawData.property_location,
            propertyValue: rawData.property_value ? `AUD${rawData.property_value.toLocaleString()}` : 'TBA',
            
            // 新增字段
            city: rawData.city,
            postcode: rawData.postcode,
            address: rawData.address,
            lender: rawData.lender,
            borrower: rawData.borrower,
            mortgageType: rawData.mortgage_type || rawData.mortgageType,
            dealMaker: rawData.deal_maker || rawData.dealMaker,
            valuer: rawData.valuer,
            lawyer: rawData.lawyer,
            trustee: rawData.trustee,
            
            // 计算指标
            metrics: {
              targetLoanYield: `${rawData.interest_rate || rawData.target_yield || '6.0'}% p.a.`,
              collateralPropertyValue: rawData.property_value ? `AUD${rawData.property_value.toLocaleString()}` : 'TBA',
              loanToValue: rawData.lvr ? `${rawData.lvr}%` : 'N/A',
              defaultRate: rawData.default_rate ? `${rawData.default_rate}%` : 'N/A'
            },
            
            // 原始数值用于计算
            totalOfferingRaw: rawData.total_offering_token || 0,
            subscribedRaw: rawData.subscribe_token || 0,
            loanAmountRaw: rawData.loan_amount || 0,
            propertyValueRaw: rawData.property_value || 0,
            
            // 数据库原始字段（保留用于兼容性）
            interest_rate: rawData.interest_rate,
            loan_term_months: rawData.loan_term_months,
            lvr: rawData.lvr,
            default_rate: rawData.default_rate
          }
          
          console.log('✅ TradeProjectView: 项目数据映射完成:', this.projectData)
        } else {
          this.projectError = response.message || '获取项目数据失败'
          console.error('❌ TradeProjectView: API返回错误:', response)
        }
      } catch (error) {
        this.projectError = '网络错误，无法获取项目数据'
        console.error('❌ TradeProjectView: 获取项目数据失败:', error)
      } finally {
        this.projectLoading = false
      }
    },
    
    // 计算认购进度
    calculateSubscriptionProgress(rawData) {
      const total = rawData.total_offering_token || 0
      const subscribed = rawData.subscribe_token || 0
      if (total === 0) return '0%'
      return `${((subscribed / total) * 100).toFixed(2)}%`
    },
    
    // 获取产品图片
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
    
    // 计算总金额
    calculateTotalAmount() {
      if (!this.tradeAmount || !this.projectData) return '0.00'
      const amount = parseFloat(this.tradeAmount)
      if (isNaN(amount)) return '0.00'
      
      // 这里可以根据实际需求计算价格
    //   const pricePerToken = 1.00 // 假设每个代币1澳元
      const total = amount 
      return total.toFixed(2)
    },
    
    // 格式化数字显示
    formatNumber(value) {
      if (!value) return '0'
      const num = parseFloat(value)
      if (isNaN(num)) return '0'
      return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    
    // 获取代币价格
    getTokenPrice() {
      // 这里可以根据实际需求获取代币价格
      return 'AUD1.00'
    },
    
    // 计算预期收益
    calculateExpectedReturn() {
      if (!this.tradeAmount || !this.projectData?.interestRate) return 'AUD0.00'
      
      const amount = parseFloat(this.tradeAmount)
      const interestRate = parseFloat(this.projectData.interestRate)
      
      if (isNaN(amount) || isNaN(interestRate)) return 'AUD0.00'
      
      // 计算年化收益
      const annualReturn = amount * (interestRate / 100)
      
      // 根据贷款期限计算实际收益
      const loanTermMonths = this.extractLoanTermMonths()
      const actualReturn = annualReturn * (loanTermMonths / 12)
      
      return `AUD${actualReturn.toFixed(2)}`
    },
    
    // 提取贷款期限（月数）
    extractLoanTermMonths() {
      if (!this.projectData?.loanTerm) return 12
      
      const termStr = this.projectData.loanTerm.toString()
      const match = termStr.match(/(\d+)/)
      return match ? parseInt(match[1]) : 12
    },
    
    // 一键交易流程
    async executeOneClickTrade() {
      if (!this.isFormValid) {
        console.warn('⚠️ TradeProjectView: 表单验证失败，无法执行交易')
        return
      }
      
      try {
        this.loading = true
        this.showLoadingModal = true
        this.loadingStatus = '开始一键交易流程...'
        
        console.log('🚀 TradeProjectView: 开始一键交易流程', {
          projectCode: this.projectCode,
          tradeType: this.tradeType,
          amount: this.tradeAmount,
          userAddress: this.address
        })
        
        // 步骤1: 准备交易数据
        this.loadingStatus = '准备交易数据...'
        const tradeData = {
          projectCode: this.projectCode,
          tradeType: this.tradeType,
          amount: parseFloat(this.tradeAmount),
          userAddress: this.address
        }
        
        // 步骤2: 执行MetaMask交易
        this.loadingStatus = '执行MetaMask交易...'
        const metamaskResult = await this.executeMetaMaskTransaction()
        
        // 步骤3: 获取现有合约地址
        this.loadingStatus = '获取合约地址...'
        const contractAddresses = await this.getExistingContractAddresses()
        
        // 步骤4: 提取交易信息
        this.loadingStatus = '提取交易信息...'
        const transactionInfo = this.extractTransactionInfo(metamaskResult, contractAddresses)
        
        // 步骤5: 保存到数据库
        this.loadingStatus = '保存交易记录...'
        await this.saveTransactionToDatabase(transactionInfo)
        
        // 步骤6: 显示成功结果
        this.loadingStatus = '交易完成!'
        this.showSuccessModal = true
        this.successData = {
          tradeType: this.tradeType,
          amount: this.tradeAmount,
          transactionHash: metamaskResult.transactionHash,
          blockNumber: metamaskResult.blockNumber,
          principalTokenAddress: contractAddresses.principalTokenAddress,
          interestTokenAddress: contractAddresses.interestTokenAddress
        }
        
        console.log('✅ TradeProjectView: 一键交易流程完成')
        
      } catch (error) {
        console.error('❌ TradeProjectView: 一键交易失败:', error)
        this.error = error.message || '交易失败，请重试'
        alert(`交易失败: ${this.error}`)
      } finally {
        this.loading = false
        this.showLoadingModal = false
      }
    },
    
    // MetaMask交易执行
    async executeMetaMaskTransaction() {
      try {
        console.log('💳 TradeProjectView: 开始执行MetaMask交易')
        
        const { address, connected } = useWallet()
        
        if (!connected.value) {
          throw new Error('钱包未连接，请先连接MetaMask')
        }
        
        if (!window.ethereum) {
          throw new Error('MetaMask未安装，请安装MetaMask扩展')
        }
        
        // 网络检查 - 确保连接到Sepolia测试网
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const sepoliaChainId = '0xaa36a7'
        
        if (chainId !== sepoliaChainId) {
          this.loadingStatus = '切换到Sepolia测试网...'
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: sepoliaChainId }],
            })
          } catch (switchError) {
            // 如果网络不存在，添加Sepolia网络
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: sepoliaChainId,
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SepoliaETH',
                  decimals: 18
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            })
          }
        }
        
        // 验证LoanIssuer地址
        console.log('🔍 验证LoanIssuer地址:', this.loanIssuerAddress)
        if (!this.loanIssuerAddress || !this.isValidEthereumAddress(this.loanIssuerAddress)) {
          console.error('❌ LoanIssuer地址无效:', this.loanIssuerAddress)
          throw new Error(`无效的LoanIssuer地址: ${this.loanIssuerAddress}`)
        }
        console.log('✅ LoanIssuer地址验证通过:', this.loanIssuerAddress)
        
        // 交易构建 - 构建ETH转账交易参数
        const amountInETH = parseFloat(this.tradeAmount) // 假设1 Token = 1 ETH for testing
        const amountInWei = ethers.parseEther(amountInETH.toString())
        
        console.log('📊 交易详情:', {
          from: address.value,
          to: this.loanIssuerAddress,
          amount: amountInETH,
          amountInWei: amountInWei.toString()
        })
        
        // 交易参数
        const transactionParams = {
          from: address.value,
          to: this.loanIssuerAddress,
          value: '0x' + amountInWei.toString(16),
          gas: '0x5208', // 21000 gas limit for simple transfer
        }
        
        console.log('🚀 发送交易到MetaMask...')
        
        // 交易发送 - 通过MetaMask发送交易
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParams],
        })
        
        console.log('✅ MetaMask交易已发送，交易哈希:', txHash)
        
        // 交易确认 - 等待交易上链
        this.loadingStatus = '等待交易确认...'
        console.log('⏳ 等待交易确认...')
        const receipt = await this.waitForTransactionConfirmation(txHash)
        
        console.log('✅ MetaMask交易已确认:', receipt)
        
        return {
          transactionHash: txHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          status: receipt.status
        }
        
      } catch (error) {
        console.error('❌ MetaMask交易失败:', error)
        throw new Error(`MetaMask交易失败: ${error.message}`)
      }
    },
    
    // 等待交易确认
    async waitForTransactionConfirmation(txHash, maxAttempts = 30) {
      if (!window.ethereum) {
        throw new Error('MetaMask未安装')
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      
      for (let i = 0; i < maxAttempts; i++) {
        try {
          const receipt = await provider.getTransactionReceipt(txHash)
          if (receipt && receipt.blockNumber) {
            return receipt
          }
        } catch (error) {
          console.warn(`等待交易确认 ${i + 1}/${maxAttempts}:`, error.message)
        }
        
        // 等待5秒后重试
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      
      throw new Error('交易确认超时')
    },
    
    // 获取现有合约地址
    async getExistingContractAddresses() {
      try {
        console.log('🔍 TradeProjectView: 获取现有合约地址')
        
        // 从合约配置中获取地址
        const contractAddresses = {
          principalTokenAddress: CONTRACT_CONFIG.PRINCIPAL_TOKEN_ADDRESS,
          interestTokenAddress: CONTRACT_CONFIG.INTEREST_TOKEN_ADDRESS,
          kycRegistryAddress: CONTRACT_CONFIG.KYC_REGISTRY_ADDRESS,
          loanIssuerAddress: CONTRACT_CONFIG.LOAN_ISSUER_ADDRESS,
          complianceGuardAddress: CONTRACT_CONFIG.COMPLIANCE_GUARD_ADDRESS,
          holderRegistryAddress: CONTRACT_CONFIG.HOLDER_REGISTRY_ADDRESS
        }
        
        console.log('✅ TradeProjectView: 获取到合约地址:', contractAddresses)
        
        // 保存到组件状态
        this.deployedContracts = contractAddresses
        
        return contractAddresses
        
      } catch (error) {
        console.error('❌ TradeProjectView: 获取合约地址失败:', error)
        throw new Error('获取合约地址失败: ' + error.message)
      }
    },
    
    // 提取交易信息
    extractTransactionInfo(metamaskResult, contractAddresses) {
      console.log('🔍 TradeProjectView: 提取交易信息:', { metamaskResult, contractAddresses })
      
      return {
        user_wallet_address: this.address,
        project_code: this.projectCode,
        purchase_amount: parseFloat(this.tradeAmount),
        trade_type: this.tradeType,
        transaction_hash: metamaskResult.transactionHash,
        block_number: metamaskResult.blockNumber,
        trade_timestamp: new Date().toISOString(),
        // 合约信息
        principal_token_address: contractAddresses.principalTokenAddress,
        interest_token_address: contractAddresses.interestTokenAddress,
        kyc_registry_address: contractAddresses.kycRegistryAddress,
        loan_issuer_address: contractAddresses.loanIssuerAddress
      }
    },
    
    // 保存交易信息到数据库
    async saveTransactionToDatabase(transactionInfo) {
      try {
        console.log('💾 TradeProjectView: 保存交易信息到数据库:', transactionInfo)
        
        // 获取用户ID
        let userId = null
        try {
          const userResponse = await userAPI.getUserInfoFromServer()
          if (userResponse.status === 0 && userResponse.data) {
            userId = userResponse.data.user_id
            console.log('✅ TradeProjectView: 获取到用户ID:', userId)
          } else {
            console.warn('⚠️ TradeProjectView: 无法获取用户ID，将使用null')
          }
        } catch (error) {
          console.warn('⚠️ TradeProjectView: 获取用户ID失败:', error.message)
        }
        
        // 准备发送给后端的数据格式
        const transactionData = {
          projectCode: transactionInfo.project_code,
          tradeType: transactionInfo.trade_type,
          amount: transactionInfo.purchase_amount,
          price: 1.0, // 假设每个代币1澳元
          total: transactionInfo.purchase_amount * 1.0,
          userAddress: transactionInfo.user_wallet_address,
          transactionHash: transactionInfo.transaction_hash,
          blockNumber: transactionInfo.block_number,
          userId: userId,
          // 合约信息字段
          principalTokenAddress: transactionInfo.principal_token_address,
          interestTokenAddress: transactionInfo.interest_token_address,
          kycRegistryAddress: transactionInfo.kyc_registry_address,
          loanIssuerAddress: transactionInfo.loan_issuer_address
        }
        
        console.log('📤 TradeProjectView: 发送交易数据:', transactionData)
        
        // 调用后端API保存交易历史
        const response = await transactionAPI.saveTransactionHistory(transactionData)
        
        if (response.status === 0) {
          console.log('✅ TradeProjectView: 交易信息保存成功:', response.data)
        } else {
          throw new Error(response.message || '保存交易信息失败')
        }
        
      } catch (error) {
        console.error('❌ TradeProjectView: 保存交易信息失败:', error)
        throw new Error('保存交易信息失败: ' + error.message)
      }
    },
    
    // 复制到剪贴板
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        alert('地址已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('地址已复制到剪贴板')
      }
    },
    
    // 格式化地址显示
    formatAddress(address) {
      if (!address) return 'N/A'
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    },
    
    // 智能合约部署方法已移除
    
    // MetaMask交易方法已移除
    
    // 交易确认方法已移除
    
    // 交易信息提取方法已移除
    
    // 数据库保存方法已移除
    
    // 执行交易方法已移除
    
    // 关闭成功弹窗
    closeSuccessModal() {
      this.showSuccessModal = false
    },
    
    // 查看投资组合
    viewPortfolio() {
      this.$router.push('/portfolio')
    },
    
    // 复制哈希值
    copyHash() {
      navigator.clipboard.writeText(this.successData.transactionHash)
      alert('交易哈希已复制到剪贴板')
    },

    // 复制合约地址
    copyContractAddress(address) {
      navigator.clipboard.writeText(address)
      alert('合约地址已复制到剪贴板')
    },

    // 格式化哈希值
    formatHash(hash) {
      if (!hash) return ''
      return `${hash.substr(0, 6)}...${hash.substr(-4)}`
    },

    // 格式化地址显示
    formatAddress(address) {
      if (!address) return 'N/A'
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    },
    
    // 验证以太坊地址格式
    isValidEthereumAddress(address) {
      if (!address) return false
      // 检查地址格式：0x开头，42个字符，包含0-9a-fA-F
      return /^0x[0-9a-fA-F]{40}$/.test(address)
    }
  }
}
</script>

<style scoped>
.trade-page {
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(51, 204, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 153, 204, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(25, 25, 112, 0.1) 0%, transparent 50%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 顶部导航 */
.topbar {
  padding: 20px 0;
  border-bottom: 1px solid #374151;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 14px;
}

.crumb-back {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.crumb-back:hover {
  background: rgba(59, 130, 246, 0.1);
}

.crumb-back .i {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.sep {
  color: #6b7280;
}

.crumb-current {
  color: #ffffff;
  font-weight: 600;
}

/* 主要内容 */
.main-content {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 主布局 - 左右分栏 */
.main-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  align-items: start;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #374151;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #9ca3af;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-container h2 {
  color: #ef4444;
  margin-bottom: 8px;
}

/* 项目信息卡片 */
.project-info-card {
  background: #141426;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
}

.project-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.project-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.project-details {
  flex: 1;
}

.project-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.project-subtitle {
  color: #9ca3af;
  margin: 0 0 12px 0;
  font-size: 14px;
}

.project-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* 项目指标容器 */
.project-metrics-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 指标分组 */
.metrics-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.metrics-section-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.3);
}

/* 项目指标 */
.project-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.metric-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

/* 合约地址区域 */
.contract-addresses-section {
  margin-top: -24px;
  padding-top: 0px;
}

.contract-addresses-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contract-addresses-title::before {
  content: "🔗";
  font-size: 20px;
}

.contract-addresses-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.contract-address-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.contract-address-item:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.4);
}

.contract-address-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
}

.contract-icon {
  font-size: 16px;
}

.contract-address-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #e5e7eb;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  word-break: break-all;
}

.contract-address-value:hover {
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
}

.copy-icon {
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.contract-address-value:hover .copy-icon {
  opacity: 1;
}

/* 分割线样式 */
.section-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 24px 0;
  width: 100%;
}

/* 交易表单 */
.trade-form-card {
  background: #141426;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
}

/* 项目状态卡片 */
.project-status-card {
  background: #141426;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
}

.status-header {
  margin-bottom: 20px;
}

.status-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-info {
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.status-incoming {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
}

.status-performing {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
}

.status-completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
}

.status-complete {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
}

.status-default {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
}

.status-cancelled {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: #ffffff;
}

.status-unknown {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: #ffffff;
}

.status-description {
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0;
}

.status-actions {
  display: flex;
  justify-content: center;
}

/* 项目最新动态卡片 */
.project-news-card {
  background: #141426;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
}

.news-header {
  margin-bottom: 20px;
}

.news-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.news-title::before {
  content: "📰";
  font-size: 18px;
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.news-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.news-date {
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.news-text {
  font-size: 14px;
  color: #e5e7eb;
  line-height: 1.5;
  margin: 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

/* 钱包状态 */
.wallet-status-inline {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.wallet-status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
}

.status-value.connected {
  color: #10b981;
}

.status-value.disconnected {
  color: #ef4444;
}

/* 表单样式 */
.trade-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 认购摘要样式 */
.subscription-summary {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #374151;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #374151;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.summary-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-badge.buy {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
}

.summary-badge.sell {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.summary-label {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

.summary-value {
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  text-align: right;
}

.summary-value.amount {
  color: #10b981;
  font-size: 16px;
  font-weight: 700;
}

.summary-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #374151;
}

.risk-warning {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  padding: 12px;
}

.warning-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.warning-text p {
  margin: 0;
  font-size: 13px;
  color: #fbbf24;
  line-height: 1.4;
}

.form-group {
  display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

/* 交易类型选择器 */
.trade-type-selector {
  display: flex;
  gap: 8px;
}

.trade-type-btn {
  flex: 1;
  padding: 12px 16px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trade-type-btn:hover {
  background: #374151;
}

.trade-type-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.trade-type-btn.active:hover {
  background: #2563eb;
}

/* 交易类型显示 */
.trade-type-display {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.trade-type-indicator {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 120px;
}

.trade-type-indicator.buy {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.trade-type-indicator.sell {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* 输入框 */
.form-input {
  padding: 12px 16px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-input::placeholder {
  color: #6b7280;
}

/* 金额显示 */
.amount-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
}

.amount-value {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
}

.amount-currency {
  font-size: 14px;
  color: #9ca3af;
}

/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: #3b82f6;
  color: #ffffff;
}

.btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn.primary:disabled {
  background: #374151;
  color: #6b7280;
  cursor: not-allowed;
}

.btn.secondary {
  background: #374151;
  color: #ffffff;
  border: 1px solid #4b5563;
}

.btn.secondary:hover {
  background: #4b5563;
}

.trade-btn {
  width: 100%;
  padding: 16px;
    font-size: 16px;
  }
  
/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* 合约地址弹窗样式 */
.contract-address-modal {
  background: #1f2937;
  border-radius: 16px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}

.contract-address-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contract-address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #374151;
}

.contract-address-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #ffffff;
  background: #374151;
}

.contract-address-content {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.contract-address-description {
  color: #d1d5db;
  font-size: 14px;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.contract-address-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contract-address-item {
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 16px;
}

.contract-address-label {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.contract-address-value {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #ffffff;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contract-address-value:hover {
  background: #374151;
  border-color: #6b7280;
}

.copy-icon {
  font-size: 12px;
  opacity: 0.7;
}

.contract-address-actions {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #374151;
  justify-content: flex-end;
}

.modal-content {
  background: #141426;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

/* 加载弹窗 */
.loading-modal .loading-container {
  flex-direction: row;
  gap: 20px;
  padding: 0;
}

.loading-icon .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #374151;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-title {
  color: #ffffff;
  margin: 0 0 8px 0;
  font-size: 20px;
}

.loading-description {
  color: #9ca3af;
  margin: 0 0 16px 0;
}

.loading-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  font-size: 14px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 成功弹窗 */
.success-container {
  text-align: center;
}

.success-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.checkmark {
  width: 60px;
  height: 60px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.checkmark-stem {
  width: 3px;
  height: 20px;
  background: #ffffff;
  transform: rotate(45deg);
  position: absolute;
  top: 20px;
  left: 30px;
}

.checkmark-kick {
  width: 3px;
  height: 12px;
  background: #ffffff;
  transform: rotate(-45deg);
  position: absolute;
  top: 26px;
  left: 24px;
}

.success-title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.success-description {
  color: #9ca3af;
  margin: 0 0 24px 0;
}

.success-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
}

.detail-header {
  margin-bottom: 12px;
}

.detail-label {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-key {
  font-size: 12px;
  color: #9ca3af;
}

.detail-value {
  font-size: 12px;
  color: #ffffff;
  font-weight: 600;
}

.hash-value {
  cursor: pointer;
  color: #3b82f6;
}

.hash-value:hover {
  text-decoration: underline;
}

.success-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 移除通知样式已删除 */

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  
  .main-content {
    padding: 20px 0;
    gap: 20px;
  }
  
  .main-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .project-header {
    flex-direction: column;
  text-align: center;
}

  .project-metrics-container {
    gap: 16px;
  }
  
  .metrics-section {
    padding: 16px;
  }
  
  .metrics-section-title {
    font-size: 16px;
  }
  
  .project-metrics {
    grid-template-columns: 1fr;
  }
  
  .contract-addresses-grid {
    grid-template-columns: 1fr;
  }
  
  .contract-address-value {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .form-header {
  flex-direction: column;
    align-items: stretch;
  }
  
  .wallet-status-inline {
  justify-content: center;
  }
  
  .success-actions {
  flex-direction: column;
  }
}
</style>


