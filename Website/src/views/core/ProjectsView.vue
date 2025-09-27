<template>
  <div class="container">
    <header class="doc-header">
      <h1 class="headline">Property Loans</h1>
      <p class="subline">First-lien mortgages · LTV control · Monthly interest</p>
    </header>

    <!-- 筛选栏 -->
    <div class="filters" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0 6px;">
      <input v-model="filters.q" class="input" placeholder="Search code/name/subtitle" style="max-width:240px;height:38px" />
      <select v-model="filters.type" class="input" style="max-width:160px;height:38px">
        <option value="">All Types</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
      </select>
      <select v-model="filters.status" class="input" style="max-width:160px;height:38px">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="upcoming">Upcoming</option>
        <option value="research">Research</option>
        <option value="planning">Planning</option>
        <option value="completed">Completed</option>
      </select>
      <select v-model="filters.region" class="input" style="max-width:160px;height:38px">
        <option value="">All Regions</option>
        <option value="St Ives NSW">St Ives NSW</option>
        <option value="CBD">CBD</option>
        <option value="Suburban">Suburban</option>
        <option value="Sydney">Sydney</option>
      </select>
      <select v-model="filters.risk" class="input" style="max-width:160px;height:38px">
        <option value="">All Risk</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select v-model.number="filters.minYield" class="input" style="max-width:180px;height:38px">
        <option :value="0">Min Yield: Any</option>
        <option :value="5">≥ 5%</option>
        <option :value="6">≥ 6%</option>
        <option :value="7">≥ 7%</option>
        <option :value="8">≥ 8%</option>
        <option :value="9">≥ 9%</option>
        <option :value="10">≥ 10%</option>
      </select>
      <button class="btn" @click="resetFilters">Reset</button>
    </div>
    
    <!-- 筛选结果统计和刷新控制 -->
    <div class="filter-stats" style="margin: 8px 0; color: var(--muted); font-size: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
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
          最后更新: {{ formatTime(lastRefreshTime) }}
        </span>
        <button @click="refreshProducts" :disabled="loading" class="refresh-btn" style="background: #374151; border: 1px solid #4b5563; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s ease;" :style="{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }">
          {{ loading ? '刷新中...' : '刷新数据' }}
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载产品数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="loadProducts" class="btn retry-btn">重试</button>
      </div>
    </div>

    <!-- 文档式列表 -->
    <section v-else class="doc-list">
      <article
        v-for="p in filteredProducts"
        :key="p.code"
        class="doc-card"
        aria-labelledby="'title-' + p.code"
      >
         <!-- 主要内容区域 -->
         <div class="main-content">
           <!-- 左侧内容 -->
           <div class="left-content">
             <!-- 项目标题信息 -->
             <section class="title-section">
               <div class="title-header">
                 <h2 :id="'title-' + p.code">
                   <span class="doc-code">{{ p.code }}</span>
                   <span class="doc-name">{{ p.name }}</span>
                 </h2>
                 <div class="status-badge" :class="'status-' + p.status">
                   {{ getStatusText(p.status) }}
                 </div>
               </div>
               <p class="doc-subtitle">{{ p.subtitle }}</p>
               
               <!-- 项目基本信息 -->
               <div class="project-basic-info">
                 <div class="info-item">
                   <span class="info-label">Type:</span>
                   <span class="info-value">{{ p.type }}</span>
                 </div>
                 <div class="info-item">
                   <span class="info-label">Region:</span>
                   <span class="info-value">{{ p.region }}</span>
                 </div>
                 <div class="info-item">
                   <span class="info-label">Risk:</span>
                   <span class="info-value risk-{{ p.risk }}">{{ p.risk }}</span>
                 </div>
               </div>
             </section>

             <hr class="sep" />

             <!-- 摘要 -->
             <section class="summary-section">
               <h3 class="doc-h3">Summary</h3>
               <p class="doc-text">
                 {{ p.summary || 'Mortgage-backed loan project with controlled LTV and monthly coupon schedule. Suitable for investors seeking income with real-asset collateral.' }}
               </p>
             </section>
           </div>

           <!-- 右侧图片 -->
           <div class="right-content">
             <img :src="p.image" class="doc-cover" :alt="p.code" />
           </div>
         </div>

         <!-- 投资信息 -->
         <section class="doc-section">
           <h3 class="doc-h3">Investment Details</h3>
           <div class="investment-grid">
             <div class="investment-item">
               <div class="investment-label">Collateral Value</div>
               <div class="investment-value">A${{ formatNumber(p.valuation) || 'TBA' }}</div>
             </div>
             <div class="investment-item">
               <div class="investment-label">Loan Amount</div>
               <div class="investment-value">A${{ formatNumber(p.loanAmount) || 'TBA' }}</div>
             </div>
             <div class="investment-item">
               <div class="investment-label">Total Offering</div>
               <div class="investment-value">A${{ formatNumber(p.totalOffering) || 'TBA' }}</div>
             </div>
             <div class="investment-item">
               <div class="investment-label">Subscribed</div>
               <div class="investment-value">A${{ formatNumber(p.subscribed) || 'TBA' }}</div>
             </div>
             <div class="investment-item">
               <div class="investment-label">Loan Coupon</div>
               <div class="investment-value">{{ p.annualInterestRate || (p.targetYield ? p.targetYield.toFixed(1) + '% p.a.' : 'TBA') }}</div>
             </div>
             <div class="investment-item">
               <div class="investment-label">LTV</div>
               <div class="investment-value">{{ p.ltv || 'TBA' }}%</div>
             </div>
             <div class="investment-item">
               <div class="investment-label">Loan Term</div>
               <div class="investment-value">{{ p.loanTerm || 'TBA' }} months</div>
             </div>
             <div class="investment-item">
               <div class="investment-label">Target Yield</div>
               <div class="investment-value">{{ p.targetYield || 'TBA' }}%</div>
             </div>
           </div>
           
           <!-- 按钮与进度条在同一行 -->
           <div class="progress-actions-row">
             <div class="progress-container">
               <div class="progress-bar">
                 <div class="progress-fill" :style="{ width: getProgressPercentage(p) + '%' }"></div>
                 <div class="progress-empty" :style="{ width: (100 - getProgressPercentage(p)) + '%' }"></div>
               </div>
               <span class="progress-text">{{ getProgressPercentage(p) }}%</span>
             </div>
             <div class="doc-actions">
               <!-- Active状态: Trade and Detail -->
               <template v-if="p.status === 'active'">
                 <a href="#" class="btn small orange" @click.prevent="openTrade(p.code)">Trade</a>
                 <a href="#" class="btn small" @click.prevent="openDetail(p.code)">Detail</a>
               </template>
               
               <!-- Upcoming状态: Preview and Join Waitlist -->
               <template v-else-if="p.status === 'upcoming'">
                 <a href="#" class="btn small" @click.prevent="openDetail(p.code)">Preview</a>
                 <a href="#" class="btn small orange" @click.prevent="joinWaitlist(p.code)">Join Waitlist</a>
               </template>
               
               <!-- Research状态: Preview and Register -->
               <template v-else-if="p.status === 'research'">
                 <a href="#" class="btn small" @click.prevent="openDetail(p.code)">Preview</a>
                 <a href="#" class="btn small orange" @click.prevent="registerInterest(p.code)">Register</a>
               </template>
               
               <!-- Planning状态: Preview and Register -->
               <template v-else-if="p.status === 'planning'">
                 <a href="#" class="btn small" @click.prevent="openDetail(p.code)">Preview</a>
                 <a href="#" class="btn small orange" @click.prevent="registerInterest(p.code)">Register</a>
               </template>
               
               <!-- Completed状态: 只显示Detail -->
               <template v-else-if="p.status === 'completed'">
                 <a href="#" class="btn small" @click.prevent="openDetail(p.code)">Detail</a>
               </template>
             </div>
           </div>
         </section>
      </article>
    </section>
  </div>
</template>

<script>
import { productAPI } from '@/service/api'
import { useDatabaseSync } from '@/service/databaseSyncService'

export default { 
  name: 'ProjectsView',
  data(){
    return {
      filters: { q: '', type: '', region: '', risk: '', status: '', minYield: 0 },
      products: [],
      loading: true,
      error: null,
      refreshInterval: null,
      lastRefreshTime: null
    }
  },
  async mounted() {
    await this.loadProducts()
    this.setupDatabaseSync()
  },
  beforeUnmount() {
    this.cleanupDatabaseSync()
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.error = null
        console.log('🔄 从数据库加载产品数据...')
        
        const response = await productAPI.getAllProducts()
        
        if (response.status === 0) {
          // 映射数据库字段到前端期望的字段名
          this.products = (response.data || []).map(product => ({
            ...product,
            totalOffering: product.total_token,
            subscribed: product.current_subscribed_token,
            targetYield: product.target_yield,
            ltv: product.LTV,
            annualInterestRate: product.annual_interest_rate,
            loanAmount: product.loan_amount,
            valuation: product.valuation,
            image: product.image || this.getProductImage(product.code)
          }))
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
      await this.loadProducts()
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
      return `A$${num.toLocaleString()}`
    },
    resetFilters(){ this.filters = { q: '', type: '', region: '', risk: '', status: '', minYield: 0 } },
    openDetail(code){
      const product = this.products.find(x => x.code === code)
      try { sessionStorage.setItem('lastProduct', JSON.stringify(product)) } catch(e) {}
      const projectId = product.project_id || code
      this.$router.push({ name: 'detail', params: { id: projectId } })
    },
    openTrade(code){
      const product = this.products.find(x => x.code === code)
      try { sessionStorage.setItem('lastProduct', JSON.stringify(product)) } catch(e) {}
      this.$router.push({ name: 'tradeProject', params: { code } })
    },
    getProgressPercentage(product) {
      if (!product.totalOffering || !product.subscribed) return 0
      
      // 提取数字部分（移除货币符号和逗号）
      const totalStr = product.totalOffering.toString().replace(/[A$,]/g, '')
      const subscribedStr = product.subscribed.toString().replace(/[A$,]/g, '')
      
      const total = parseFloat(totalStr)
      const subscribed = parseFloat(subscribedStr)
      
      if (total === 0) return 0
      
      const percentage = (subscribed / total) * 100
      return Math.min(Math.round(percentage), 100)
    },
    getStatusText(status) {
      const statusMap = {
        'active': 'Active',
        'upcoming': 'Upcoming',
        'research': 'Research',
        'planning': 'Planning',
        'completed': 'Completed'
      }
      return statusMap[status] || 'Unknown'
    },
    joinWaitlist(code) {
      const product = this.products.find(x => x.code === code)
      alert(`已加入 ${product.name} 的等待列表！`)
      console.log('Join waitlist for:', code)
    },
    registerInterest(code) {
      const product = this.products.find(x => x.code === code)
      alert(`已注册对 ${product.name} 的投资兴趣！`)
      console.log('Register interest for:', code)
    },
    
    // 格式化时间显示
    formatTime(date) {
      if (!date) return ''
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours}小时前`
      
      const days = Math.floor(hours / 24)
      return `${days}天前`
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
        // 搜索匹配：代码、名称、副标题
        const matchQ = !q || 
          p.code.toLowerCase().includes(q) || 
          (p.name || '').toLowerCase().includes(q) ||
          (p.subtitle || '').toLowerCase().includes(q)
        
        // 类型匹配
        const matchType = !this.filters.type || p.type === this.filters.type
        
        // 地区匹配
        const matchRegion = !this.filters.region || p.region === this.filters.region
        
        // 风险等级匹配
        const matchRisk = !this.filters.risk || p.risk === this.filters.risk
        
        // 状态匹配
        const matchStatus = !this.filters.status || p.status === this.filters.status
        
        // 最小收益率匹配
        const matchYield = !this.filters.minYield || (p.targetYield || 0) >= this.filters.minYield
        
        return matchQ && matchType && matchRegion && matchRisk && matchStatus && matchYield
      }).sort((a, b) => {
        // 按project code升序排列
        return a.code.localeCompare(b.code)
      })
    },
    
    // 检查是否有激活的筛选条件
    hasActiveFilters() {
      return this.filters.q.trim() !== '' || 
             this.filters.type !== '' || 
             this.filters.region !== '' || 
             this.filters.risk !== '' || 
             this.filters.status !== '' || 
             this.filters.minYield > 0
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
  background: #0a0a1a;
  min-height: 100vh;
  padding: 20px;
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
  margin-bottom: 8px;
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
  grid-template-columns: 1fr;
  gap: 18px;
}

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
  grid-template-columns: 1fr 260px;
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

.status-active {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-upcoming {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-research {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-planning {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.status-completed {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
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

.right-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
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

@media (max-width: 980px){
  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .right-content {
    justify-content: flex-start;
  }
  
  .doc-cover {
    width: 200px;
    height: 140px;
  }
}

@media (max-width: 768px){
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
  
  .title-section h2 {
    font-size: 18px;
  }
  
  .doc-subtitle {
    font-size: 13px;
  }
}
</style>
