<template>
  <div class="container">
<div class="project-container">
    <!-- 项目头部 -->
    <header class="doc-header">
      <h1 class="headline">
        <template v-if="isDetailView && currentProduct">
          {{ currentProduct.name }} - {{ currentProduct.code }}
        </template>
        <template v-else>
          Active Property Loans
        </template>
      </h1>
      <p class="subline">
        <template v-if="isDetailView && currentProduct">
          {{ currentProduct.subtitle }}
        </template>
        <!-- <template v-else>
          First-lien mortgages · LTV control · Monthly interest
        </template> -->
      </p>
    </header>

    <!-- 筛选栏 -->
    <div v-if="!isDetailView" class="filters" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0 6px;">
      <input v-model="filters.q" class="input" placeholder="Search code/name/subtitle" style="max-width:240px;height:38px" />
      <select v-model="filters.type" class="input" style="max-width:160px;height:38px">
        <option value="">All Types</option>
        <option value="Single House">Single House</option>
        <option value="Commercial Building">Commercial Building</option>
        <option value="Unit Development">Unit Development</option>
        <option value="Residential Land">Residential Land</option>
        <option value="Mixed Use">Mixed Use</option>
        <option value="Retail">Retail</option>
        <option value="Office">Office</option>
        <option value="Industrial">Industrial</option>
        <option value="Student Accommodation">Student Accommodation</option>
      </select>
      <!-- <select v-model="filters.status" class="input" style="max-width:160px;height:38px">
        <option value="">All Status</option>
        <option value="INCOMING">Incoming</option>
        <option value="ACTIVE">Active</option>
        <option value="PERFORMING">Performing</option>
        <option value="COMPLETED">Completed</option>
        <option value="COMPLETE">Completed</option>
        <option value="DEFAULT">Default</option>
      </select> -->
      <div class="yield-range-filter">
        <label class="yield-range-label">EST. YIELD (IRR) Range:</label>
        <div class="yield-range-container">
          <div class="yield-range-slider">
            <input 
              type="range" 
              v-model.number="filters.minYield" 
              :min="0" 
              :max="filters.maxYield - 0.5" 
              :step="0.5"
              @input="onFilterChange"
              class="yield-slider yield-slider-min"
            />
            <input 
              type="range" 
              v-model.number="filters.maxYield" 
              :min="filters.minYield + 0.5" 
              :max="20" 
              :step="0.5"
              @input="onFilterChange"
              class="yield-slider yield-slider-max"
            />
          </div>
          <div class="yield-range-display">
            {{ filters.minYield }}% - {{ filters.maxYield }}%
          </div>
        </div>
      </div>
      <button class="btn" @click="resetFilters">Reset</button>
    </div>
    
    <!-- 筛选结果统计和刷新控制 -->
    <div v-if="!isDetailView" class="filter-stats" style="margin: 8px 0; color: var(--muted); font-size: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
      <div>
        Showing {{ filteredProducts.length }} of {{ products.length }} projects
        <span v-if="hasActiveFilters" style="margin-left: 12px;">
          <button @click="resetFilters" style="background: none; border: none; color: #3b82f6; text-decoration: underline; cursor: pointer;">
            Clear filters
          </button>
        </span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span v-if="lastRefreshTime" style="font-size: 12px; color: #6b7280;">
          Last Updated: {{ formatTime(lastRefreshTime) }}
        </span>
        <button @click="refreshProducts" :disabled="loading" class="refresh-btn" style="background: #374151; border: 1px solid #4b5563; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s ease;" :style="{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }">
          {{ loading ? 'Refreshing...' : 'Refresh Data' }}
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading product data...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <h3>Load Failed</h3>
        <!-- <p>{{ error }}</p> -->
        <button @click="loadProducts" class="btn retry-btn">Retry</button>
      </div>
    </div>

    <!-- 单个产品详情视图 -->
    <section v-else-if="isDetailView && currentProduct" class="doc-list">
      <article class="doc-card" aria-labelledby="'title-' + currentProduct.code">
        <!-- 主要内容区域 -->
        <div class="main-content">
          <div class="left-content">
            <!-- 项目标题信息 -->
            <section class="title-section">
              <div class="title-header">
                <h2 :id="'title-' + currentProduct.code">
                  <span class="doc-code">{{ currentProduct.code }}</span>
                  <span class="doc-name">{{ currentProduct.name }}</span>
                </h2>
                <div class="status-badge" :class="'status-' + currentProduct.status">
                  {{ getStatusText(currentProduct.status) }}
                </div>
              </div>
              <p class="doc-subtitle">{{ currentProduct.subtitle }}</p>
              
              <div class="project-basic-info">
                <div class="info-item">
                  <span class="info-label">Type:</span>
                  <span class="info-value">{{ currentProduct.type }}</span>
                </div>
              </div>
            </section>
            <hr class="sep" />
          </div>
        </div> 

        <!-- 按钮与进度条-->
        <div class="progress-actions-row">
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getProgressPercentage(currentProduct) + '%' }"></div>
              <div class="progress-empty" :style="{ width: (100 - getProgressPercentage(currentProduct)) + '%' }"></div>
            </div>
            <span class="progress-text">{{ getProgressPercentage(currentProduct) }}%</span>
          </div>
          <div class="doc-actions">
            <!-- ACTIVE状态: Buy and Detail -->
            <template v-if="currentProduct.status === 'ACTIVE'">
              <a href="#" class="btn small orange" @click.prevent="openTrade(currentProduct.code)">Buy</a>
              <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">Detail</a>
            </template>
            
            <!-- INCOMING状态: Preview and Join Waitlist -->
            <template v-else-if="currentProduct.status === 'INCOMING'">
              <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">Preview</a>
              <a href="#" class="btn small" @click.prevent="joinWaitlist(currentProduct.code)">Join Waitlist</a>
            </template>
            
            <!-- PERFORMING状态: View Details -->
            <template v-else-if="currentProduct.status === 'PERFORMING'">
              <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">View Details</a>
            </template>
            
            <!-- COMPLETED状态: View Details -->
            <template v-else-if="currentProduct.status === 'COMPLETED'">
              <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">View Details</a>
            </template>
            
            <!-- COMPLETE状态: View Details -->
            <template v-else-if="currentProduct.status === 'COMPLETE'">
              <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">View Details</a>
            </template>
            
            <!-- DEFAULT状态: View Details -->
            <template v-else-if="currentProduct.status === 'DEFAULT'">
              <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">View Details</a>
            </template>
            
            <!-- 默认状态: Learn More -->
            <template v-else>
              <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">Learn More</a>
            </template>
          </div>
        </div>
      </article>
    </section>

    <!-- 产品列表视图 -->
    <section v-else class="doc-list">
      <article
        v-for="p in filteredProducts"
        :key="p.code"
        class="pf-project-card"
        aria-labelledby="'title-' + p.code"
      >
         <!-- 项目头部 -->
         <div class="pf-project-header">
           <img :src="p.image" class="pf-project-image" :alt="p.code" />
           <div class="pf-project-info">
             <h4 :id="'title-' + p.code">{{ p.code }} • {{ p.name }}</h4>
             <p>{{ p.subtitle }}</p>
           </div>
           <div class="status-badge" :class="'status-' + p.status">
             {{ getStatusText(p.status) }}
           </div>
         </div>

         <!-- 项目指标 -->
         <div class="pf-project-metrics">
           <div class="pf-project-metric">
             <span class="pf-metric-label">LOAN SIZE</span>
             <span class="pf-metric-value">{{ p.loanAmount}}</span>
           </div>
           <div class="pf-project-metric">
             <span class="pf-metric-label">EST. YIELD (IRR)</span>
             <span class="pf-metric-value" style="color: #16a34a;">{{ p.metrics.targetLoanYield }}</span>
           </div>
           <div class="pf-project-metric">
             <span class="pf-metric-label">TERM</span>
             <span class="pf-metric-value">{{ p.loanTerm }}</span>
           </div>
         </div>

         <!-- 投资进度信息 -->
         <div class="pf-investment-progress">
           <div class="pf-progress-metrics">
             <div class="pf-progress-metric">
               <span class="pf-progress-label">SUBSCRIBED</span>
               <span class="pf-progress-value">{{ formatNumber(p.subscribed || 0) }}</span>
             </div>
             <div class="pf-progress-metric">
               <span class="pf-progress-label">TOTAL OFFERING</span>
               <span class="pf-progress-value">{{ formatNumber(p.totalOffering || 0) }}</span>
             </div>
           </div>
           <!-- 进度条 -->
           <div class="pf-progress-bar-container">
             <div class="pf-progress-bar">
               <div class="pf-progress-fill" :style="{ width: getSubscriptionProgress(p) + '%' }"></div>
             </div>
             <div class="pf-progress-text">{{ getSubscriptionProgress(p) }}% Subscribed</div>
           </div>
         </div>
         <!-- 操作按钮 -->
         <div class="pf-project-actions">
           <!-- ACTIVE状态: Buy and Detail -->
           <template v-if="p.status === 'ACTIVE'">
             <button class="pf-project-btn pf-project-btn-secondary" @click="openTrade(p.code)">BUY</button>
             <button class="pf-project-btn" @click="openDetail(p.code)">DETAILS</button>
           </template>
           
           <!-- INCOMING状态: Preview and Join Waitlist -->
           <template v-else-if="p.status === 'INCOMING'">
             <button class="pf-project-btn" @click="openDetail(p.code)">DETAILS</button>
             <button class="pf-project-btn" @click="joinWaitlist(p.code)">ADD TO WATCHLIST</button>
           </template>
           
           <!-- PERFORMING状态: View Details -->
           <template v-else-if="p.status === 'PERFORMING'">
             <button class="pf-project-btn" @click="openDetail(p.code)">DETAILS</button>
           </template>
           
           <!-- COMPLETED状态: View Details -->
           <template v-else-if="p.status === 'COMPLETED'">
             <button class="pf-project-btn" @click="openDetail(p.code)">DETAILS</button>
           </template>
           
           <!-- COMPLETE状态: View Details -->
           <template v-else-if="p.status === 'COMPLETE'">
             <button class="pf-project-btn" @click="openDetail(p.code)">DETAILS</button>
           </template>
           
           <!-- DEFAULT状态: View Details -->
           <template v-else-if="p.status === 'DEFAULT'">
             <button class="pf-project-btn" @click="openDetail(p.code)">DETAILS</button>
           </template>
           
           <!-- 默认状态: Learn More -->
           <template v-else>
             <button class="pf-project-btn" @click="openDetail(p.code)">DETAILS</button>
           </template>
         </div>
      </article>
    </section>
    </div>
  </div>
</template>

<script>
import { productAPI } from '@/service/api'
import { useDatabaseSync } from '@/service/dataSyncService.js'

export default { 
  name: 'ListedProjectsView',
  props: {
    code: {
      type: String,
      default: null
    }
  },
  data(){
    return {
      filters: { q: '', type: '', status: '', minYield: 0, maxYield: 20 },
      products: [],
      currentProduct: null, // 当前选中的产品详情
      loading: true,
      error: null,
      refreshInterval: null,
      lastRefreshTime: null,
      isDetailView: false // 是否为详情视图
    }
  },
  async mounted() {
    // 检查是否为详情视图
    this.isDetailView = !!this.code
    if (this.isDetailView) {
      await this.loadSingleProduct()
    } else {
      await this.loadProducts()
    }
    this.setupDatabaseSync()
  },
  beforeUnmount() {
    this.cleanupDatabaseSync()
  },
  watch: {
    // 监听路由变化
    '$route'(to, from) {
      console.log('🔄 ListedProjectsView: 路由变化', { to: to.params, from: from.params })
      // 当路由参数变化时，重新加载数据
      if (to.params.code !== from.params.code) {
        this.isDetailView = !!to.params.code
        if (this.isDetailView) {
          this.loadSingleProduct()
        } else {
          this.loadProducts()
        }
      }
    },
    
    // 监听props变化（当使用props: true时，路由参数会自动作为props传递）
    code: {
      handler(newCode, oldCode) {
        console.log('🔄 ListedProjectsView: Props代码变化', { newCode, oldCode })
        this.isDetailView = !!newCode
        if (this.isDetailView) {
          this.loadSingleProduct()
        } else {
          this.loadProducts()
        }
      },
      immediate: true
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
      }, 30000) // 30秒
    },
    
    // 停止自动刷新（保留作为备用）
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
        console.log('⏹️ 停止自动刷新')
      }
    },

    formatCurrency(value) {
      if (!value) return null
      const num = parseFloat(value)
      if (isNaN(num)) return value
      return `AUD$${num.toLocaleString()}`
    },

    resetFilters(){ this.filters = { q: '', type: '', risk: '', status: '', minYield: 0, maxYield: 20 } },
    
    // 监听筛选器变化
    onFilterChange() {
      console.log('筛选器变化:', this.filters)
      // 强制重新计算筛选结果
      this.$forceUpdate()
    },

    openDetail(code){
      const product = this.products.find(x => x.code === code)
      try { sessionStorage.setItem('lastProduct', JSON.stringify(product)) } catch(e) {}
      this.$router.push({ name: 'detail', params: { code: code } })
    },

    openTrade(code){
      // 在列表视图中从products数组查找，在详情视图中使用currentProduct
      const product = this.isDetailView ? this.currentProduct : this.products.find(x => x.code === code)
      try { sessionStorage.setItem('lastProduct', JSON.stringify(product)) } catch(e) {}
      this.$router.push({ 
        name: 'tradeProject', 
        params: { code },
        query: { type: 'buy' }
      })
    },
    getProgressPercentage(product) {
      if (!product) return 0
      
      // 使用原始数值进行计算
      const total = product.totalOfferingRaw || 0
      const subscribed = product.subscribedRaw || 0
      
      if (total === 0) return 0
      
      const percentage = (subscribed / total) * 100
      return Math.min(Math.round(percentage), 100)
    },
    getStatusText(status) {
      const statusMap = {
        'INCOMING': 'Incoming',
        'ACTIVE': 'Active',
        'PERFORMING': 'Performing',
        'DEFAULT': 'Default',
        'COMPLETED': 'Completed',
      }
      return statusMap[status] || 'Unknown'
    },
    joinWaitlist(code) {
      this.addToWatchlist(code)
    },
    registerInterest(code) {
      this.addToWatchlist(code)
    },
    
    // 添加到 watchlist
    addToWatchlist(code) {
      try {
        // 获取现有的 watchlist
        let watchlist = []
        const savedWatchlist = localStorage.getItem('projectWatchlist')
        if (savedWatchlist) {
          watchlist = JSON.parse(savedWatchlist)
        }
        
        // 检查是否已经在 watchlist 中
        if (watchlist.includes(code)) {
          alert('This Project is already in your watchlist!')
          return
        }
        
        // 添加到 watchlist
        watchlist.push(code)
        localStorage.setItem('projectWatchlist', JSON.stringify(watchlist))
        
        const product = this.products.find(x => x.code === code)
        alert(`Added ${product.name} to your watchlist!`)
        console.log('Added to watchlist:', code)
      } catch (error) {
        console.error('❌ Projects: Failed to add to watchlist:', error)
        alert('Failed to add to watchlist, please try again')
      }
    },
    
    // 格式化时间显示
    formatTime(date) {
      if (!date) return ''
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes} minutes ago`
      
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours} hours ago`
      
      const days = Math.floor(hours / 24)
      return `${days} days ago`
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
    
    // 计算代币价格
    calculateTokenPrice(product) {
      // 基于目标收益率计算代币价格
      const basePrice = 1.00
      const yieldMultiplier = (product.targetYield || 6.0) / 6.0
      const adjustedPrice = basePrice * yieldMultiplier
      return `AUD$${adjustedPrice.toFixed(2)}`
    },
    
    // 计算租金收入
    calculateRentalIncome(product) {
      // 基于房产价值和收益率估算租金收入
      if (!product.valuation) return 'TBA'
      
      const valuationStr = product.valuation.replace(/[AUD$,]/g, '')
      const valuation = parseFloat(valuationStr)
      const monthlyYield = (product.targetYield || 6.0) / 12 / 100
      const estimatedRental = valuation * monthlyYield
      
      return `AUD$${estimatedRental.toLocaleString('en-AU', { maximumFractionDigits: 0 })} / month`
    },

    // 计算认购进度
    getSubscriptionProgress(product) {
      if (!product) {
        return 0
      }
      
      // 使用原始数值进行计算
      const total = product.totalOfferingRaw || 0
      const subscribed = product.subscribedRaw || 0
      
      if (total === 0) return 0
      
      const progress = (subscribed / total) * 100
      return Math.round(progress * 100) / 100 // 保留两位小数
    },

    // 格式化数字
    formatNumber(value) {
      if (!value) return '0'
      const num = parseFloat(value)
      if (isNaN(num)) return value
      return num.toLocaleString()
    }
  },
  computed: {
    filteredProducts(){
      const q = this.filters.q.trim().toLowerCase()
      return this.products.filter(p => {
        // 只显示状态为ACTIVE的项目
        if (p.status !== 'ACTIVE') {
          return false
        }
        
        // 搜索匹配：代码、名称、副标题
        const matchQ = !q || 
          p.code.toLowerCase().includes(q) || 
          (p.name || '').toLowerCase().includes(q) ||
          (p.subtitle || '').toLowerCase().includes(q)
        
        // 类型匹配
        const matchType = !this.filters.type || p.property_type === this.filters.type
        
        // 状态匹配（由于已经过滤了ACTIVE，这里可以简化）
        const matchStatus = !this.filters.status || p.status === this.filters.status
        
        // EST. YIELD (IRR) 区间匹配
        const targetYield = parseFloat(p.targetYield) || 0
        const matchYield = targetYield >= this.filters.minYield && targetYield <= this.filters.maxYield
        
        return matchQ && matchType && matchStatus && matchYield
      }).sort((a, b) => {
        // 按project code升序排列
        return a.code.localeCompare(b.code)
      })
    },
    
    // 检查是否有激活的筛选条件
    hasActiveFilters() {
      return this.filters.q.trim() !== '' || 
             this.filters.type !== '' || 
             this.filters.status !== '' || 
             this.filters.minYield > 0 || 
             this.filters.maxYield < 20
    },

    projectData() {
      // 从ProductDetailsInfo获取项目数据（保留作为备用）
      const product = this.project
      
      if (product) {
        console.log('TradeProjectView: Retrieve project data from database:', product)
        
        // 构建符合模板需求的数据结构，完整映射ProductDetailsInfo.js中的所有字段
        return {
          // 基本信息
          code: product.code,
          name: product.name,
          image: product.image || this.getProductImage(product.code),
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
      }
    }
  } 
}
</script>

<style scoped>
:root{
  --orange:#f59e0b;
  --ink:#e5e7eb;
  --paper:#0e0f1b;
  --rule:#2a2c3f;
  --muted:#9ca3af;
}

.container {
  background: 
        radial-gradient(circle at 20% 80%, rgba(51, 204, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(0, 153, 204, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(25, 25, 112, 0.1) 0%, transparent 50%);
  min-height: 100vh;
  padding: 20px 130px;
  margin: 0;
  width: 100vw;
  max-width: none;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.project-container{
  min-height: 100vh;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: none;
}

.doc-header{
  border-bottom: 1px solid var(--rule);
  padding-bottom: 10px;
  margin-bottom: 16px;
}
.headline {
  color: #ffffff !important;
  margin: 0 0 6px 0;
}
.subline{
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.filters {
  background: transparent;
  padding: 16px 0;
  border: none;
  margin-bottom: 20px;
}
.filters .input {
  background: #141426;
  border: 1px solid #374151;
  color: #ffffff;
}
.filters .input::placeholder { color: #9ca3af; }
.filters .btn {
  background: #374151;
  border: 1px solid #4b5563;
  color: #ffffff;
}
.filters .btn:hover { background: #4b5563; }

/* 收益率区间滑块样式 */
.yield-range-filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.yield-range-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.yield-range-container {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 25px;
}

.yield-range-display {
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  white-space: nowrap;
  padding: 0;
}

.yield-range-slider {
  position: relative;
  height: 20px;
  background: #374151;
  border-radius: 10px;
  padding: 0 10px;
  flex: 1;
  max-width: 200px;
}

.yield-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: transparent;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.yield-slider::-webkit-slider-track {
  width: 100%;
  height: 4px;
  background: #4b5563;
  border-radius: 2px;
  border: none;
}

.yield-slider::-moz-range-track {
  width: 100%;
  height: 4px;
  background: #4b5563;
  border-radius: 2px;
  border: none;
}

.yield-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.yield-slider::-webkit-slider-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.yield-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.yield-slider::-moz-range-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.yield-slider-min::-webkit-slider-thumb {
  background: #242524;
}

.yield-slider-min::-webkit-slider-thumb:hover {
  background: #242524;
}

.yield-slider-min::-moz-range-thumb {
  background: #242524;
}

.yield-slider-min::-moz-range-thumb:hover {
  background: #242524;
}

.yield-slider-max::-webkit-slider-thumb {
  background: #09740f;
}

.yield-slider-max::-webkit-slider-thumb:hover {
  background: #09740f;
}

.yield-slider-max::-moz-range-thumb {
  background: #09740f;
}

.yield-slider-max::-moz-range-thumb:hover {
  background: #09740f;
}

.refresh-btn:hover:not(:disabled) { 
  background: #4b5563 !important; 
  border-color: #6b7280 !important; 
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--muted);
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

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.error-message {
  text-align: center;
  color: var(--muted);
}

.error-message h3 {
  color: #ef4444;
  margin-bottom: 8px;
}

.retry-btn {
  background: #ef4444;
  border: 1px solid #ef4444;
  color: #ffffff;
  margin-top: 12px;
}

.retry-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.doc-list{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

/* 新的项目卡片样式 */
.pf-project-card{
  width:100%;
  padding:16px;
  border-radius:12px;
  background:#141426;
  border:1px solid var(--border);
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
}

.pf-project-header{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.pf-project-image{width:40px;height:40px;border-radius:8px;}
.pf-project-info{flex:1;}
.pf-project-info h4{margin:0 0 4px 0;font-size:16px;font-weight:700;color:#ffffff;}
.pf-project-info p{margin:0;font-size:12px;color:#9ca3af;}

.pf-project-metrics{margin-bottom:16px;}
.pf-project-metric{display:flex;justify-content:space-between;align-items:center;padding:4px 0;}
.pf-metric-label{font-size:12px;color:#9ca3af;}
.pf-metric-value{font-size:14px;font-weight:600;color:#ffffff;}
.pf-metric-value.risk-low{color:#16a34a;}
.pf-metric-value.risk-medium{color:#d97706;}
.pf-metric-value.risk-high{color:#dc2626;}

/* 投资进度信息样式 */
.pf-investment-progress{
  margin-bottom:16px;
  padding:16px;
  background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:12px;
}

.pf-progress-metrics{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:12px;
  margin-bottom:16px;
  align-items:stretch;
  text-align:justify;
}

.pf-progress-metric{
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:stretch;
  text-align:justify;
  margin-left:30px;
}

.pf-progress-label{
  font-size:10px;
  color:#9ca3af;
  text-transform:uppercase;
  letter-spacing:0.5px;
  margin-bottom:4px;
  margin-left:15px;
}

.pf-progress-value{
  font-size:14px;
  font-weight:700;
  color:#ffffff;
}

.pf-progress-bar-container{
  margin-top:12px;
}

.pf-progress-bar{
  width:100%;
  height:6px;
  background:rgba(255,255,255,0.1);
  border-radius:3px;
  overflow:hidden;
  margin-bottom:8px;
}

.pf-progress-fill{
  height:100%;
  background:linear-gradient(90deg,#10b981,#059669);
  border-radius:3px;
  transition:width 0.5s ease;
}

.pf-progress-text{
  text-align:center;
  font-size:12px;
  font-weight:600;
  color:#10b981;
}

.pf-project-actions{display:flex;gap:8px;flex-wrap:wrap;}
.pf-project-btn{padding:8px 16px;border-radius:8px;border:1px solid #374151;background:#1f2937;color:#ffffff;cursor:pointer;font-size:14px;font-weight:600;transition:all 0.2s ease;}
.pf-project-btn:hover{background:#d97706;}
.pf-project-btn-secondary{background:var(--primary);color:#fff;border-color:var(--primary);}
.pf-project-btn-secondary:hover{background:var(--primary-ink);}
.pf-project-btn-interest{background:#dc2626;color:#fff;border-color:#dc2626;}
.pf-project-btn-interest:hover{background:#b91c1c;}

/* 保留原有的doc-card样式作为备用 */
.doc-card{
  background: #141426;
  border: 1px solid var(--rule);
  border-radius: 14px;
  padding: 18px;
  color: var(--ink);
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
}

/* 项目基本信息样式 */
.project-basic-info{
  display: flex;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.info-item{
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-label{
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value{
  font-size: 14px;
  color: #828386;
  font-weight: 600;
}

.info-value.risk-low{
  color: #059669;
}

.info-value.risk-medium{
  color: #d97706;
}

.info-value.risk-high{
  color: #dc2626;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: start;
}

.left-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.title-section h2 {
  margin: 0;
  font-size: 20px;
  color: #fff;
  letter-spacing: .2px;
  flex: 1;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.status-ACTIVE {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-INCOMING {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-PERFORMING {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-COMPLETED {
  background: rgba(107, 128, 107, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.status-COMPLETE {
  background: rgba(107, 128, 107, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.status-DEFAULT {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.doc-code {
  display: inline-block;
  padding: 2px 8px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  margin-right: 8px;
  font-size: 13px;
  color: var(--muted);
}

.doc-name { 
  font-weight: 700;
}

.doc-subtitle {
  margin: 6px 0 0 0;
  color: var(--muted);
  font-size: 14px;
}

.summary-section {
  margin: 6px 0 2px;
}


.doc-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--rule);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sep{
  border: none;
  border-top: 1px dashed var(--rule);
  margin: 14px 0;
}

.doc-section{ margin: 6px 0 2px; }
.doc-h3{
  margin: 0 0 8px 0;
  color: #eaeaf0;
  font-size: 14px;
  letter-spacing: .2px;
  text-transform: uppercase;
}
.doc-text{
  margin: 0;
  color: var(--ink);
  line-height: 1.6;
}

.investment-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 8px;
}

.investment-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.investment-label {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.investment-value {
  font-size: 14px;
  color: #fff;
  font-weight: 600;
}


.progress-actions-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--rule);
}

.progress-actions-row .progress-container {
  flex: 1;
  margin-top: 0;
}

.progress-actions-row .doc-actions {
  display: flex;
  gap: 12px;
  margin: 0;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: transparent;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  display: flex;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  transition: width 0.3s ease;
}

.progress-empty {
  height: 100%;
  background: #374151;
  transition: width 0.3s ease;
}

.progress-text {
  color: #10b981;
  font-weight: 600;
  font-size: 13px;
  min-width: 35px;
  text-align: right;
}

.doc-actions{
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.btn.small {
  color: #ffffff !important;
  background: #1f2937;
  border: 1px solid #374151;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn.small:hover { background: #374151; border-color: #4b5563; }
.btn.small.orange { color:#fff !important; background:#f97316; border-color:#f97316; }
.btn.small.orange:hover { background:#ea580c; border-color:#ea580c; }

@media (max-width: 1200px){
  .doc-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 980px){
  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .doc-cover {
    width: 200px;
    height: 140px;
  }
}


@media (max-width: 768px){
  .doc-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;
  }
  
  .pf-project-card {
    padding: 16px;
    width: 100%;
  }
  
  .pf-project-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .pf-project-image {
    width: 80px;
    height: 80px;
    margin: 0 auto;
  }
  
  .pf-project-metrics {
    gap: 12px;
    margin: 16px 0;
  }
  
  .pf-progress-metrics {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .pf-investment-progress {
    padding: 12px;
  }
  
  .investment-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  
  .progress-actions-row {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .progress-actions-row .progress-container {
    order: 1;
  }
  
  .progress-actions-row .doc-actions {
    order: 2;
    justify-content: center;
  }
}

@media (max-width: 640px){
  .doc-list {
    grid-template-columns: 1fr;
    padding: 12px;
    gap: 12px;
  }
  
  .pf-project-card {
    padding: 12px;
  }
  
  .pf-project-metrics {
    gap: 8px;
  }
  
  .pf-project-metric {
    padding: 8px;
  }
  
  .pf-progress-metrics {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .pf-investment-progress {
    padding: 10px;
  }
  
  .pf-progress-label {
    font-size: 9px;
  }
  
  .pf-progress-value {
    font-size: 12px;
  }
  
  .pf-project-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .pf-project-btn {
    width: 100%;
    text-align: center;
  }
  
  .investment-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .investment-label {
    font-size: 11px;
  }
  
  .investment-value {
    font-size: 13px;
  }
  
  .main-content {
    gap: 12px;
  }
  
  .doc-cover {
    width: 100%;
    height: 120px;
  }
  
  .yield-range-filter {
    min-width: 150px;
  }
  
  .yield-range-display {
    font-size: 12px;
    padding: 0;
  }
  
  .yield-slider::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
  }
  
  .yield-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
  }
  
  .title-section h2 {
    font-size: 18px;
  }
  
  .doc-subtitle {
    font-size: 13px;
  }
}
</style>
