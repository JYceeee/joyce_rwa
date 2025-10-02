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
        <div class="project-metrics">
          <div class="metric-item">
            <span class="metric-label">LOAN SIZE</span>
            <span class="metric-value">{{ projectData.loanAmount || 'AUD$0' }}</span>
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
            <span class="metric-label">PROPERTY VALUE</span>
            <span class="metric-value">{{ projectData.metrics?.collateralPropertyValue || 'N/A' }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">LTV</span>
            <span class="metric-value">{{ projectData.metrics?.loanToValue || 'N/A' }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">SUBSCRIPTION PROGRESS</span>
            <span class="metric-value" style="color: #3b82f6;">{{ projectData.subscriptionProgress || '0%' }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">TOTAL OFFERING</span>
            <span class="metric-value">{{ projectData.totalOffering || 'AUD$0' }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">SUBSCRIBED</span>
            <span class="metric-value">{{ projectData.subscribed || 'AUD$0' }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">DEFAULT RATE</span>
            <span class="metric-value">{{ projectData.metrics?.defaultRate || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- 认购表单 -->
      <div class="trade-form-card">
        <div class="form-header">
          <h2 class="form-title">认购 {{ projectData?.code }}</h2>
          <!-- 钱包状态 -->
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
          </div>
        </div>

        <!-- 交易表单 -->
        <div class="trade-form">
          <div class="form-group">
            <label class="form-label">交易类型</label>
            <div class="trade-type-selector">
              <button 
                :class="['trade-type-btn', { active: tradeType === 'buy' }]"
                @click="tradeType = 'buy'"
              >
                Buy
              </button>
              <button 
                :class="['trade-type-btn', { active: tradeType === 'sell' }]"
                @click="tradeType = 'sell'"
              >
                Sell
              </button>
            </div>
          </div>

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

          <div class="form-group">
            <label class="form-label">总金额</label>
            <div class="amount-display">
              <span class="amount-value">{{ calculateTotalAmount() }}</span>
              <span class="amount-currency">AUD</span>
            </div>
          </div>

          <div class="form-actions">
            <button 
              class="btn primary trade-btn"
              @click="executeTrade"
              :disabled="!canExecuteTrade"
            >
              {{ tradeType === 'buy' ? 'Buy Tokens' : 'Sell Tokens' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productAPI } from '@/service/api'
import { useWallet } from '@/composables/useWallet'

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
      projectError: null
    }
  },
  computed: {
    projectCode() {
      const code = this.code || this.$route.params.code || this.$route.query.code
      console.log('🔍 TradeProjectView: 获取项目代码:', code)
      return code || 'RWA001'
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
    }
  },
  async mounted() {
    console.log('🚀 TradeProjectView: 组件挂载，开始初始化...')
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
    async loadProjectData() {
      try {
        this.projectLoading = true
        this.projectError = null
        console.log('🔄 TradeProjectView: 从数据库加载项目数据...', this.projectCode)
        
        // 直接从API获取项目数据
        const response = await productAPI.getProductByCode(this.projectCode)
        
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
            totalOffering: rawData.total_offering_token ? `AUD$${rawData.total_offering_token.toLocaleString()}` : 'AUD$0',
            subscribed: rawData.subscribe_token ? `AUD$${rawData.subscribe_token.toLocaleString()}` : 'AUD$0',
            subscriptionProgress: this.calculateSubscriptionProgress(rawData),
            
            // 贷款信息
            loanAmount: rawData.loan_amount ? `AUD$${rawData.loan_amount.toLocaleString()}` : 'AUD$0',
            loanTerm: rawData.loan_term_months ? `${rawData.loan_term_months} months` : '12 months',
            interestRate: rawData.interest_rate || rawData.target_yield || '6.0',
            
            // 物业信息
            propertyType: rawData.property_type,
            propertyLocation: rawData.property_location,
            propertyValue: rawData.property_value ? `AUD$${rawData.property_value.toLocaleString()}` : 'TBA',
            
            // 计算指标
            metrics: {
              targetLoanYield: `${rawData.interest_rate || rawData.target_yield || '6.0'}% p.a.`,
              collateralPropertyValue: rawData.property_value ? `AUD$${rawData.property_value.toLocaleString()}` : 'TBA',
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
      const pricePerToken = 1.00 // 假设每个代币1澳元
      const total = amount * pricePerToken
      return total.toFixed(2)
    },
    
    // 执行交易
    async executeTrade() {
      if (!this.canExecuteTrade) return
      
      try {
        this.loading = true
        this.showLoadingModal = true
        this.loadingStatus = 'Preparing transaction...'
        
        // 模拟交易处理
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 模拟成功交易
        this.successData = {
          tradeType: this.tradeType,
          amount: this.tradeAmount,
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: Math.floor(Math.random() * 1000000) + 1000000
        }
        
        this.showLoadingModal = false
        this.showSuccessModal = true
        
        console.log('✅ TradeProjectView: 交易执行成功:', this.successData)
      } catch (error) {
        this.showLoadingModal = false
        this.error = '交易执行失败'
        console.error('❌ TradeProjectView: 交易执行失败:', error)
      } finally {
        this.loading = false
      }
    },
    
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
      // 可以添加提示
    },
    
    // 格式化哈希值
    formatHash(hash) {
      if (!hash) return ''
      return `${hash.substr(0, 6)}...${hash.substr(-4)}`
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

/* 交易表单 */
.trade-form-card {
  background: #141426;
  border: 1px solid #374151;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  
  .main-content {
    padding: 20px 0;
    gap: 20px;
  }
  
  .project-header {
    flex-direction: column;
    text-align: center;
  }
  
  .project-metrics {
    grid-template-columns: 1fr;
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
