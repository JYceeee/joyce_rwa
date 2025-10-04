<template>
  <div class="container">
    <div class="project-container">
      <!-- 项目头部 -->
      <header class="doc-header">
        <h1 class="headline">
          <template v-if="currentProduct">
            {{ currentProduct.name }} - {{ currentProduct.code }}
          </template>
          <template v-else>
            Project Details
          </template>
        </h1>
        <p class="subline">
          <template v-if="currentProduct">
            {{ currentProduct.subtitle }}
          </template>
        </p>
      </header>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <div class="error-message">
          <h3>Load Failed</h3>
          <p>{{ error }}</p>
          <button @click="loadProjectData" class="btn retry-btn">Retry</button>
        </div>
      </div>

      <!-- 项目详情内容 -->
      <div v-else-if="currentProduct" class="detail-content">
        <!-- 项目基本信息卡片 -->
        <section class="info-card">
          <div class="card-header">
            <h2>Project Information</h2>
            <div class="status-badge" :class="'status-' + currentProduct.status">
              {{ getStatusText(currentProduct.status) }}
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Project Code</div>
              <div class="info-value">{{ currentProduct.project_code }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Project Name</div>
              <div class="info-value">{{ currentProduct.project_name }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Type</div>
              <div class="info-value">{{ currentProduct.type || currentProduct.property_type }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Subtitle</div>
              <div class="info-value">{{ currentProduct.subtitle || 'N/A' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Risk Level</div>
              <div class="info-value">{{ currentProduct.risk || 'N/A' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Target Yield</div>
              <div class="info-value">{{ currentProduct.targetYield || currentProduct.target_yield || 'N/A' }}% p.a.</div>
            </div>
          </div>
        </section>

        <!-- 投资信息卡片 -->
        <section class="info-card">
          <div class="card-header">
            <h2>Investment Information</h2>
            <div class="investment-actions">
              <button class="btn primary" @click="handleInvest" v-if="currentProduct.status === 'ACTIVE'">
                <span class="btn-icon">💰</span>
                Invest Now
              </button>
              <button class="btn secondary" @click="handleDetail">
                <span class="btn-icon">📊</span>
                View Details
              </button>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Total Offering</div>
              <div class="info-value">AUD${{ formatNumber(currentProduct.totalOffering || currentProduct.total_token) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Subscribed</div>
              <div class="info-value">AUD${{ formatNumber(currentProduct.subscribed || currentProduct.current_subscribed_token) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Total Subscription Tokens</div>
              <div class="info-value">{{ formatNumber(currentProduct.totalSubscriptionTokens || currentProduct.total_token) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Subscribed Tokens</div>
              <div class="info-value">{{ formatNumber(currentProduct.subscribedTokens || currentProduct.current_subscribed_token) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Subscription Progress</div>
              <div class="info-value">{{ getSubscriptionProgress() }}%</div>
            </div>
            <div class="info-item">
              <div class="info-label">Available for Investment</div>
              <div class="info-value">AUD${{ formatNumber(getAvailableAmount()) }}</div>
            </div>
          </div>

          <!-- 进度条 -->
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getSubscriptionProgress() + '%' }"></div>
            </div>
            <div class="progress-text">{{ getSubscriptionProgress() }}% Subscribed</div>
          </div>
        </section>

        <!-- 贷款信息卡片 -->
        <section class="info-card">
          <div class="card-header">
            <h2>Loan Information</h2>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Loan Amount</div>
              <div class="info-value">AUD${{ formatNumber(currentProduct.loanAmount || currentProduct.loan_amount) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">LTV (Loan-to-Value)</div>
              <div class="info-value">{{ currentProduct.ltv || currentProduct.LTV || 'N/A' }}%</div>
            </div>
            <div class="info-item">
              <div class="info-label">Annual Interest Rate</div>
              <div class="info-value">{{ currentProduct.annualInterestRate || currentProduct.annual_interest_rate || 'N/A' }}%</div>
            </div>
            <div class="info-item">
              <div class="info-label">Loan Term</div>
              <div class="info-value">{{ currentProduct.loan_term_months || 'N/A' }} months</div>
            </div>
            <div class="info-item">
              <div class="info-label">Valuation</div>
              <div class="info-value">AUD${{ formatNumber(currentProduct.valuation) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Property Address</div>
              <div class="info-value">{{ currentProduct.address || currentProduct.property_address || 'N/A' }}</div>
            </div>
          </div>
        </section>

        <!-- 项目详情卡片 -->
        <section class="info-card">
          <div class="card-header">
            <h2>Project Details</h2>
          </div>
          
          <div class="info-grid">
            <div class="info-item full-width">
              <div class="info-label">Summary</div>
              <div class="info-value">{{ currentProduct.summary || 'No summary available' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Created Date</div>
              <div class="info-value">{{ formatDate(currentProduct.created_at || currentProduct.createdAt) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Updated Date</div>
              <div class="info-value">{{ formatDate(currentProduct.updated_at || currentProduct.updatedAt) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Last Refresh</div>
              <div class="info-value">{{ formatTime(lastRefreshTime) }}</div>
            </div>
          </div>
        </section>

        <!-- 数据库原始数据卡片 -->
        <section class="info-card">
          <div class="card-header">
            <h2>Raw Database Data</h2>
            <button class="btn secondary" @click="toggleRawData">
              {{ showRawData ? 'Hide' : 'Show' }} Raw Data
            </button>
          </div>
          
          <div v-if="showRawData" class="raw-data-container">
            <pre class="raw-data">{{ JSON.stringify(currentProduct, null, 2) }}</pre>
          </div>
        </section>
      </div>

      <!-- 没有找到项目 -->
      <div v-else class="no-project">
        <div class="no-project-content">
          <h3>Project Not Found</h3>
          <p>The requested project could not be found.</p>
          <button class="btn primary" @click="$router.push('/listedprojects')">
            Back to Projects
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productAPI } from '@/service/api'
import { useDatabaseSync } from '@/service/dataSyncService.js'

export default {
  name: 'DetailPage',
  props: {
    code: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currentProduct: null,
      loading: true,
      error: null,
      refreshInterval: null,
      lastRefreshTime: null,
      showRawData: false,
      unsubscribeProducts: null,
      unsubscribeNewProjects: null
    }
  },
  async mounted() {
    await this.loadProjectData()
    this.setupDatabaseSync()
    this.startAutoRefresh()
  },
  beforeUnmount() {
    this.stopAutoRefresh()
    this.cleanupDatabaseSync()
  },
  watch: {
    // 监听路由参数变化
    '$route'(to, from) {
      console.log('🔄 DetailPage: 路由变化', { to: to.params, from: from.params })
      if (to.params.code !== from.params.code) {
        this.loadProjectData()
      }
    },
    
    // 监听props变化
    code: {
      handler(newCode, oldCode) {
        console.log('🔄 DetailPage: Props代码变化', { newCode, oldCode })
        if (newCode) {
          this.loadProjectData()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 加载项目数据
    async loadProjectData() {
      try {
        this.loading = true
        this.error = null
        
        // 从路由参数获取项目代码
        const projectCode = this.code || this.$route.params.code || this.$route.query.code
        
        if (!projectCode) {
          this.error = 'No project code provided'
          return
        }

        console.log('🔄 DetailPage: Loading project data for code:', projectCode)
        
        // 尝试通过不同的方式获取项目数据
        let response = null
        
        // 通过代码获取项目数据
        if (projectCode && typeof projectCode === 'string' && projectCode.length > 0) {
          try {
            response = await productAPI.getProductByCode(projectCode)
            console.log('📡 DetailPage: API response via code:', response)
          } catch (error) {
            console.error('❌ DetailPage: Failed to get project by code:', error)
            this.error = 'Failed to load project data'
            return
          }
        }
        
        if (response && response.status === 0) {
          // 映射数据库字段到前端期望的字段名
          const rawData = response.data
          this.currentProduct = {
            ...rawData,
            // 基本字段映射
            totalOffering: rawData.total_token || rawData.totalOffering,
            subscribed: rawData.current_subscribed_token || rawData.subscribed,
            targetYield: rawData.target_yield || rawData.targetYield,
            ltv: rawData.LTV || rawData.ltv,
            annualInterestRate: rawData.annual_interest_rate || rawData.annualInterestRate,
            loanAmount: rawData.loan_amount || rawData.loanAmount,
            valuation: rawData.valuation,
            loanTerm: rawData.loan_term || rawData.loanTerm,
            address: rawData.property_address || rawData.address,
            type: rawData.property_type || rawData.type,
            
            // 保持原始数据用于显示
            ...rawData
          }
          
          this.lastRefreshTime = new Date()
          console.log('✅ DetailPage: Project data loaded successfully:', this.currentProduct)
        } else {
          this.error = response?.message || 'Failed to load project data'
          console.error('❌ DetailPage: API returned error:', response)
        }
      } catch (error) {
        this.error = 'Network error, unable to load project data'
        console.error('❌ DetailPage: Failed to load project data:', error)
      } finally {
        this.loading = false
      }
    },

    // 设置数据库同步
    setupDatabaseSync() {
      const { subscribeProducts, subscribeNewProjects } = useDatabaseSync()
      
      // 订阅产品列表更新
      this.unsubscribeProducts = subscribeProducts((products) => {
        console.log('📡 DetailPage: Received product data update, total:', products.length)
        
        // 查找当前项目是否有更新
        const currentId = this.id || this.$route.params.id
        if (currentId) {
          const updatedProduct = products.find(p => 
            p.id === currentId || p.code === currentId
          )
          
          if (updatedProduct) {
            console.log('🔄 DetailPage: Found updated product data, refreshing...')
            this.currentProduct = {
              ...updatedProduct,
              totalOffering: updatedProduct.total_token || updatedProduct.totalOffering,
              subscribed: updatedProduct.current_subscribed_token || updatedProduct.subscribed,
              targetYield: updatedProduct.target_yield || updatedProduct.targetYield,
              ltv: updatedProduct.LTV || updatedProduct.ltv,
              annualInterestRate: updatedProduct.annual_interest_rate || updatedProduct.annualInterestRate,
              loanAmount: updatedProduct.loan_amount || updatedProduct.loanAmount,
              valuation: updatedProduct.valuation,
              loanTerm: updatedProduct.loan_term || updatedProduct.loanTerm,
              address: updatedProduct.property_address || updatedProduct.address,
              type: updatedProduct.property_type || updatedProduct.type,
              ...updatedProduct
            }
            this.lastRefreshTime = new Date()
          }
        }
      })
      
      // 订阅新项目通知
      this.unsubscribeNewProjects = subscribeNewProjects((newProjects) => {
        console.log('🆕 DetailPage: New projects detected:', newProjects.length)
        // 可以在这里添加新项目通知逻辑
      })
    },

    // 清理数据库同步
    cleanupDatabaseSync() {
      if (this.unsubscribeProducts) {
        this.unsubscribeProducts()
        this.unsubscribeProducts = null
      }
      
      if (this.unsubscribeNewProjects) {
        this.unsubscribeNewProjects()
        this.unsubscribeNewProjects = null
      }
    },

    // 开始自动刷新
    startAutoRefresh() {
      // 每30秒刷新一次数据
      this.refreshInterval = setInterval(() => {
        this.loadProjectData()
      }, 30000)
    },

    // 停止自动刷新
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    },

    // 处理投资按钮点击
    handleInvest() {
      if (this.currentProduct) {
        console.log('💰 DetailPage: Invest button clicked for project:', this.currentProduct.code)
        // 这里可以添加投资逻辑或跳转到投资页面
        this.$router.push(`/trade/${this.currentProduct.code}`)
      }
    },

    // 处理详情按钮点击
    handleDetail() {
      if (this.currentProduct) {
        console.log('📊 DetailPage: Detail button clicked for project:', this.currentProduct.code)
        // 这里可以添加详情逻辑
      }
    },

    // 切换原始数据显示
    toggleRawData() {
      this.showRawData = !this.showRawData
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'INCOMING': 'Incoming',
        'ACTIVE': 'Active',
        'PERFORMING': 'Performing',
        'COMPLETED': 'Completed',
        'COMPLETE': 'Completed',
        'DEFAULT': 'Default'
      }
      return statusMap[status] || status
    },

    // 计算认购进度
    getSubscriptionProgress() {
      if (!this.currentProduct) return 0
      
      const total = parseFloat(this.currentProduct.totalOffering || this.currentProduct.total_token || 0)
      const subscribed = parseFloat(this.currentProduct.subscribed || this.currentProduct.current_subscribed_token || 0)
      
      if (total === 0) return 0
      
      const progress = (subscribed / total) * 100
      return Math.min(Math.round(progress * 100) / 100, 100)
    },

    // 计算可投资金额
    getAvailableAmount() {
      if (!this.currentProduct) return 0
      
      const total = parseFloat(this.currentProduct.totalOffering || this.currentProduct.total_token || 0)
      const subscribed = parseFloat(this.currentProduct.subscribed || this.currentProduct.current_subscribed_token || 0)
      
      return Math.max(0, total - subscribed)
    },

    // 格式化数字
    formatNumber(value) {
      if (!value) return '0'
      const num = parseFloat(value)
      if (isNaN(num)) return value
      return num.toLocaleString()
    },

    // 格式化时间
    formatTime(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleString()
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 20px;
}

.project-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 项目头部 */
.doc-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
}

.headline {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subline {
  font-size: 1.2rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 加载和错误状态 */
.loading-container,
.error-container,
.no-project {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message,
.no-project-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
}

.error-message h3,
.no-project-content h3 {
  color: #ef4444;
  margin-bottom: 16px;
  font-size: 1.5rem;
}

.error-message p,
.no-project-content p {
  color: #94a3b8;
  margin-bottom: 24px;
  line-height: 1.6;
}

/* 详情内容 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 信息卡片 */
.info-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.investment-actions {
  display: flex;
  gap: 12px;
}

/* 状态徽章 */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-INCOMING {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.status-ACTIVE {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-PERFORMING {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-COMPLETED,
.status-COMPLETE {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.status-DEFAULT {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  word-break: break-word;
  line-height: 1.4;
}

/* 进度条 */
.progress-section {
  margin-top: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #10b981;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn.primary {
  background: #667eea;
  color: #ffffff;
  border: 1px solid #667eea;
}

.btn.primary:hover {
  background: #5a67d8;
  border-color: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn.retry-btn {
  background: #ef4444;
  color: #ffffff;
  border: 1px solid #ef4444;
}

.btn.retry-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.btn-icon {
  font-size: 1rem;
}

/* 原始数据容器 */
.raw-data-container {
  margin-top: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow-x: auto;
}

.raw-data {
  color: #10b981;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 16px 30px;
  }
  
  /* 手机端页边距 */
  .main-content,
  .page-container {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
  
  .headline {
    font-size: 2rem;
  }
  
  .info-card {
    padding: 24px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .investment-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .headline {
    font-size: 1.5rem;
  }
  
  /* 小屏手机端页边距 */
  .container {
    padding: 12px 30px;
  }
  
  .main-content,
  .page-container {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
  
  .info-card {
    padding: 20px;
  }
  
  .btn {
    padding: 10px 16px;
    font-size: 0.8rem;
  }
  
  .investment-actions {
    flex-direction: column;
  }
}
</style>