<template>
  <div class="trade-page">
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
          <div class="metric-item">
            <span class="metric-label">Current Price</span>
            <span class="metric-value">{{ projectData.metrics.currentElaraPrice }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Property Value</span>
            <span class="metric-value">{{ projectData.metrics.collateralPropertyValue }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Rental Income</span>
            <span class="metric-value">{{ projectData.metrics.rentalIncome }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Target Yield</span>
            <span class="metric-value">{{ projectData.metrics.targetLoanYield }}</span>
          </div>
        </div>
      </div>

      <!-- 交易表单 -->
      <div class="trade-form-card">
        <h2 class="form-title">Trade {{ projectCode }}</h2>
        
        <!-- 交易类型选择 -->
        <div class="form-section">
          <h3 class="section-title">Trade Type</h3>
          <div class="trade-type-buttons">
            <button 
              class="trade-type-btn" 
              :class="{ active: tradeType === 'buy' }"
              @click="tradeType = 'buy'"
            >
              <span class="btn-icon">📈</span>
              <span class="btn-text">Buy</span>
            </button>
            <button 
              class="trade-type-btn" 
              :class="{ active: tradeType === 'sell' }"
              @click="tradeType = 'sell'"
            >
              <span class="btn-icon">📉</span>
              <span class="btn-text">Sell</span>
            </button>
          </div>
        </div>

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
            />
            <span class="amount-unit">tokens</span>
          </div>
          <div class="amount-info">
            <span class="info-text">
              Current Price: {{ projectData.metrics.currentElaraPrice }} per token
            </span>
          </div>
        </div>

        <!-- 价格设置 -->
        <div class="form-section">
          <h3 class="section-title">Price Settings</h3>
          <div class="price-options">
            <label class="price-option">
              <input type="radio" v-model="priceType" value="market" />
              <span>Market Price</span>
            </label>
            <label class="price-option">
              <input type="radio" v-model="priceType" value="limit" />
              <span>Limit Price</span>
            </label>
          </div>
          
          <div v-if="priceType === 'limit'" class="limit-price-input">
            <input 
              type="number" 
              v-model="limitPrice" 
              class="price-input"
              placeholder="Enter limit price"
              step="0.01"
            />
            <span class="price-unit">AUD</span>
          </div>
        </div>

        <!-- 交易总结 -->
        <div class="trade-summary">
          <h3 class="section-title">Trade Summary</h3>
          <div class="summary-item">
            <span class="summary-label">Action:</span>
            <span class="summary-value">{{ tradeType === 'buy' ? 'Buying' : 'Selling' }} {{ tradeAmount }} tokens</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Price:</span>
            <span class="summary-value">{{ priceType === 'market' ? 'Market Price' : `A$ ${limitPrice}` }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total:</span>
            <span class="summary-value">A$ {{ calculateTotal() }}</span>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button class="btn secondary" @click="cancelTrade">Cancel</button>
          <button class="btn primary" @click="submitTrade" :disabled="!canSubmit">
            {{ tradeType === 'buy' ? 'Buy Tokens' : 'Sell Tokens' }}
          </button>
        </div>
      </div>

      <!-- 交易历史 -->
      <div class="trade-history-card">
        <h2 class="card-title">Recent Trades</h2>
        <div class="trade-list">
          <div v-for="trade in recentTrades" :key="trade.id" class="trade-item">
            <div class="trade-info">
              <span class="trade-type" :class="trade.type">{{ trade.type.toUpperCase() }}</span>
              <span class="trade-amount">{{ trade.amount }} tokens</span>
            </div>
            <div class="trade-details">
              <span class="trade-price">A$ {{ trade.price }}</span>
              <span class="trade-time">{{ formatTime(trade.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      priceType: 'market',
      limitPrice: '',
      recentTrades: [
        { id: 1, type: 'buy', amount: 100, price: '1.02', timestamp: Date.now() - 3600000 },
        { id: 2, type: 'sell', amount: 50, price: '1.01', timestamp: Date.now() - 7200000 },
        { id: 3, type: 'buy', amount: 200, price: '1.00', timestamp: Date.now() - 10800000 }
      ]
    }
  },
  computed: {
    projectCode() {
      return this.code || this.$route.params.code || 'TYMU'
    },
    projectData() {
      // 模拟项目数据，实际应该从API获取
      const projects = {
        'TYMU': {
          code: 'TYMU',
          name: 'TYMU Property Loan',
          image: '/pics/TYMU.png',
          subtitle: 'Prime Residential Mortgage Backed Loan',
          type: 'residential',
          region: 'Suburban',
          risk: 'low',
          targetYield: 6.5,
          metrics: {
            currentElaraPrice: 'A$1.00',
            collateralPropertyValue: 'A$1,250,000',
            rentalIncome: 'A$4,500 / month',
            targetLoanYield: '6.5% p.a.'
          }
        },
        'SQNB': {
          code: 'SQNB',
          name: 'SQNB Property Loan',
          image: '/pics/SQNB.png',
          subtitle: 'Commercial Mortgage Loan',
          type: 'commercial',
          region: 'CBD',
          risk: 'medium',
          targetYield: 7.2,
          metrics: {
            currentElaraPrice: 'A$1.02',
            collateralPropertyValue: 'A$2,400,000',
            rentalIncome: 'A$12,800 / month',
            targetLoanYield: '7.2% p.a.'
          }
        },
        'LZYT': {
          code: 'LZYT',
          name: 'LZYT Property Loan',
          image: '/pics/LZYT.png',
          subtitle: 'Suburban Residential Loan',
          type: 'residential',
          region: 'Suburban',
          risk: 'medium',
          targetYield: 6.9,
          metrics: {
            currentElaraPrice: 'A$0.98',
            collateralPropertyValue: 'A$980,000',
            rentalIncome: 'A$3,600 / month',
            targetLoanYield: '6.9% p.a.'
          }
        },
        'YYD': {
          code: 'YYD',
          name: 'YYD Property Loan',
          image: '/pics/YYD.png',
          subtitle: 'CBD Apartment Mortgage',
          type: 'residential',
          region: 'CBD',
          risk: 'low',
          targetYield: 6.1,
          metrics: {
            currentElaraPrice: 'A$1.05',
            collateralPropertyValue: 'A$1,650,000',
            rentalIncome: 'A$5,700 / month',
            targetLoanYield: '6.1% p.a.'
          }
        }
      }
      return projects[this.projectCode] || projects['TYMU']
    },
    canSubmit() {
      return this.tradeAmount && this.tradeAmount > 0 && 
             (this.priceType === 'market' || (this.priceType === 'limit' && this.limitPrice && this.limitPrice > 0))
    }
  },
  methods: {
    calculateTotal() {
      if (!this.tradeAmount) return '0.00'
      const amount = parseFloat(this.tradeAmount)
      const price = this.priceType === 'market' ? 1.00 : parseFloat(this.limitPrice || 0)
      return (amount * price).toFixed(2)
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString()
    },
    cancelTrade() {
      this.$router.back()
    },
    submitTrade() {
      if (!this.canSubmit) return
      
      const tradeData = {
        projectCode: this.projectCode,
        tradeType: this.tradeType,
        amount: this.tradeAmount,
        priceType: this.priceType,
        price: this.priceType === 'market' ? 1.00 : this.limitPrice,
        total: this.calculateTotal()
      }
      
      // 这里应该调用实际的交易API
      console.log('Trade data:', tradeData)
      
      // 模拟交易成功
      alert(`Trade ${this.tradeType === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`)
      
      // 添加到交易历史
      this.recentTrades.unshift({
        id: Date.now(),
        type: this.tradeType,
        amount: parseInt(this.tradeAmount),
        price: this.priceType === 'market' ? '1.00' : this.limitPrice,
        timestamp: Date.now()
      })
      
      // 重置表单
      this.tradeAmount = ''
      this.limitPrice = ''
      this.priceType = 'market'
    }
  },
  mounted() {
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #141426;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
}

.metric-label {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

/* 交易表单 */
.trade-form-card {
  grid-area: trade-form;
  background: var(--dark-panel);
  border: 1px solid var(--dark-border);
  border-radius: 16px;
  padding: 30px;
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

.trade-type-btn:hover {
  border-color: var(--primary);
  background: #2a2a4a;
}

.trade-type-btn.active {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
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
  background: var(--dark-bg);
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
  background: var(--dark-border);
  color: var(--dark-text);
  border: 1px solid var(--dark-border);
}

.btn.secondary:hover {
  background: var(--dark-muted);
}

.btn.primary {
  background: var(--primary);
  color: white;
  border: 1px solid var(--primary);
}

.btn.primary:hover {
  background: var(--primary-ink);
  border-color: var(--primary-ink);
}

.btn.primary:disabled {
  background: var(--dark-border);
  border-color: var(--dark-border);
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

.trade-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trade-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #141426;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.trade-item:hover {
  background: #1d1d36;
  border-color: var(--primary);
}

.trade-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trade-type {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.trade-type.buy {
  background: #dcfce7;
  color: #16a34a;
}

.trade-type.sell {
  background: #fee2e2;
  color: #dc2626;
}

.trade-amount {
  font-weight: 500;
  color: #ffffff;
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
    grid-template-columns: repeat(2, 1fr);
  }
  
  .trade-type-buttons {
    flex-direction: column;
  }
}
</style>
