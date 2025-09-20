<template>
  <div class="container pf-page">
    <!-- 顶部操作按钮行 -->
    <div class="pf-topbar">
      <div class="pf-actions">
        <button v-for="a in actions" :key="a.text" class="pf-pill" @click="handleAction(a.text)">
          <span class="pf-pill-ico">{{ a.icon }}</span>
          <span>{{ a.text }}</span>
        </button>
      </div>
      <button class="pf-add" @click="refreshPortfolio">
        <span class="pf-add-ico">🔄</span>
        Refresh
      </button>
    </div>

    <div class="pf-body">
      <!-- 侧栏：Accounts -->
      <aside class="pf-sidebar">
        <div class="pf-side-head">
          <h2>Accounts</h2>
          <div class="pf-side-tools">
            <span class="gear" @click="showSettings = !showSettings">⚙️</span>
            <span class="plus" @click="addAccount">＋</span>
          </div>
        </div>

        <!-- 账户组 -->
        <div class="pf-acc-group">
          <button class="pf-acc-title" @click="accGroupOpen = !accGroupOpen">
            <span>Decentralized</span>
            <span class="caret" :class="{open: accGroupOpen}">▾</span>
          </button>

          <div v-show="accGroupOpen" class="pf-acc-list">
            <div 
              v-for="account in accounts" 
              :key="account.address" 
              class="pf-acc-item"
              :class="{ active: selectedAccount === account.address }"
              @click="selectAccount(account.address)"
            >
              <div class="pf-avatar"></div>
              <div class="pf-acc-info">
                <div class="pf-acc-name">{{ account.name || 'Account' }}</div>
                <div class="pf-addr" :title="account.address">
                  {{ formatAddress(account.address) }}
                </div>
                <div class="pf-acc-balance">
                  {{ getAccountBalance(account.address) }} {{ nativeSymbol }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前选中账户的投资概览 -->
        <div v-if="selectedAccount" class="pf-account-overview">
          <h3>Account Overview</h3>
          
          <!-- 投资统计卡片 -->
          <div class="pf-stats">
            <div class="pf-stat-card">
              <div class="pf-stat-label">Total Investment</div>
              <div class="pf-stat-value">A${{ getAccountTotalInvestment(selectedAccount).toFixed(2) }}</div>
            </div>
            <div class="pf-stat-card">
              <div class="pf-stat-label">Current Value</div>
              <div class="pf-stat-value" :class="{ positive: getAccountTotalGain(selectedAccount) >= 0, negative: getAccountTotalGain(selectedAccount) < 0 }">
                A${{ getAccountCurrentValue(selectedAccount).toFixed(2) }}
              </div>
            </div>
            <div class="pf-stat-card">
              <div class="pf-stat-label">Total Gain/Loss</div>
              <div class="pf-stat-value" :class="{ positive: getAccountTotalGain(selectedAccount) >= 0, negative: getAccountTotalGain(selectedAccount) < 0 }">
                {{ getAccountTotalGain(selectedAccount) >= 0 ? '+' : '' }}A${{ getAccountTotalGain(selectedAccount).toFixed(2) }}
              </div>
            </div>
            <div class="pf-stat-card">
              <div class="pf-stat-label">ROI</div>
              <div class="pf-stat-value" :class="{ positive: getAccountROI(selectedAccount) >= 0, negative: getAccountROI(selectedAccount) < 0 }">
                {{ getAccountROI(selectedAccount) >= 0 ? '+' : '' }}{{ getAccountROI(selectedAccount).toFixed(2) }}%
              </div>
            </div>
          </div>

          <!-- 项目持仓 -->
          <div class="pf-holdings">
            <h4>Holdings</h4>
            <div v-for="holding in getAccountHoldings(selectedAccount)" :key="holding.code" class="pf-holding-item">
              <div class="pf-holding-info">
                <div class="pf-holding-code">{{ holding.code }}</div>
                <div class="pf-holding-amount">{{ holding.amount }} tokens</div>
              </div>
              <div class="pf-holding-value">
                <div class="pf-holding-price">A${{ holding.currentPrice }}</div>
                <div class="pf-holding-change" :class="{ positive: holding.change >= 0, negative: holding.change < 0 }">
                  {{ holding.change >= 0 ? '+' : '' }}{{ holding.change.toFixed(2) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主区域 -->
      <main class="pf-main">
        <!-- 投资概览 -->
        <div class="pf-hero">
          <div class="pf-balance">
             A${{ currentValue.toFixed(2) }}
            <!-- <button class="pf-eye" title="toggle visibility">👁️</button> -->
          </div>
          <div class="pf-change" :class="{ positive: totalGain >= 0, negative: totalGain < 0 }">
            {{ totalGain >= 0 ? '+' : '' }}A${{ totalGain.toFixed(2) }} ({{ roi >= 0 ? '+' : '' }}{{ roi.toFixed(2) }}%)
          </div>
        </div>

        <!-- Tabs -->
        <nav class="pf-tabs">
          <button
            v-for="t in tabs"
            :key="t"
            class="pf-tab"
            :class="{active: activeTab===t}"
            @click="activeTab=t"
          >{{ t }}</button>
        </nav>

        <!-- 项目分析 -->
        <div v-if="activeTab==='Analysis'" class="pf-analysis">
          <!-- 资产总结图表 -->
          <div class="pf-asset-summary">
            <div class="pf-summary-header">
              <h3>Asset Summary</h3>
              <div class="pf-summary-stats">
                <div class="pf-summary-stat">
                  <span class="pf-stat-number">{{ holdings.length }}</span>
                  <span class="pf-stat-label">Assets</span>
                </div>
                <div class="pf-summary-stat">
                  <span class="pf-stat-number" :class="{ positive: totalGain >= 0, negative: totalGain < 0 }">
                    {{ totalGain >= 0 ? '+' : '' }}{{ roi.toFixed(1) }}%
                  </span>
                  <span class="pf-stat-label">Total Return</span>
                </div>
                <div class="pf-summary-stat">
                  <span class="pf-stat-number">A${{ currentValue.toFixed(0) }}</span>
                  <span class="pf-stat-label">Total Value</span>
                </div>
              </div>
            </div>
            
            <!-- 图表容器 - 折线图在左侧，饼图在右侧 -->
            <div class="pf-charts-row">
              <!-- 价格变化折线图 -->
              <div class="pf-price-chart">
                <div class="pf-chart-header">
                  <h4>Price Trends</h4>
                  <div class="pf-timeframe-selector">
                    <button 
                      v-for="timeframe in timeframes" 
                      :key="timeframe.value"
                      class="pf-timeframe-btn"
                      :class="{ active: selectedTimeframe === timeframe.value }"
                      @click="selectedTimeframe = timeframe.value"
                    >
                      {{ timeframe.label }}
          </button>
                  </div>
                </div>
                
                <div class="pf-line-chart-container">
                  <svg viewBox="0 0 400 200" class="pf-line-chart-svg">
                    <!-- 网格线 -->
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" stroke-width="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    <!-- Y轴标签 -->
                    <g class="pf-y-axis">
                      <text v-for="(label, index) in yAxisLabels" :key="index" 
                            x="15" :y="30 + index * 40" 
                            class="pf-axis-label">{{ label }}</text>
                    </g>
                    
                    <!-- X轴标签 -->
                    <g class="pf-x-axis">
                      <text v-for="(label, index) in xAxisLabels" :key="index" 
                            :x="60 + index * 70" y="190" 
                            class="pf-axis-label">{{ label }}</text>
                    </g>
                    
                    <!-- 价格折线 -->
                    <g v-for="(holding, holdingIndex) in holdings" :key="holding.code" class="pf-price-line">
                      <polyline
                        :points="getPriceLinePoints(holding, holdingIndex)"
                        :stroke="getPieColor(holdingIndex)"
                        stroke-width="2"
                        fill="none"
                        :opacity="0.8"
                      />
                      <circle
                        v-for="(point, pointIndex) in getPriceLinePointsArray(holding)"
                        :key="pointIndex"
                        :cx="point.x"
                        :cy="point.y"
                        :r="3"
                        :fill="getPieColor(holdingIndex)"
                        class="pf-data-point"
                      />
                    </g>
                  </svg>
                </div>
                
                <!-- 图例 -->
                <div class="pf-chart-legend-inline">
                  <div v-for="(holding, index) in holdings" :key="holding.code" class="pf-legend-inline-item">
                    <div class="pf-legend-inline-color" :style="{ backgroundColor: getPieColor(index) }"></div>
                    <span class="pf-legend-inline-code">{{ holding.code }}</span>
                    <span class="pf-legend-inline-price">A${{ holding.currentPrice.toFixed(2) }}</span>
                    <span class="pf-legend-inline-change" :class="{ positive: holding.change >= 0, negative: holding.change < 0 }">
                      {{ holding.change >= 0 ? '+' : '' }}{{ holding.change.toFixed(2) }}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- 资产分布饼图 -->
              <div class="pf-pie-chart-section">
                <div class="pf-chart-header">
                  <h4>Asset Distribution</h4>
                </div>
                
                <div class="pf-pie-chart-container">
                  <div class="pf-pie-chart">
                    <svg viewBox="0 0 200 200" class="pf-pie-svg">
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#e5e7eb"
                        stroke-width="20"
                      />
                      <circle
                        v-for="(holding, index) in holdings"
                        :key="holding.code"
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        :stroke="getPieColor(index)"
                        stroke-width="20"
                        :stroke-dasharray="getPieDashArray(holding)"
                        :stroke-dashoffset="getPieDashOffset(index)"
                        transform="rotate(-90 100 100)"
                      />
                    </svg>
                    <div class="pf-pie-center">
                      <div class="pf-pie-total">A${{ currentValue.toFixed(0) }}</div>
                      <div class="pf-pie-label">Total Value</div>
                    </div>
                  </div>
                  
                  <!-- 图例 -->
                  <div class="pf-chart-legend">
                    <div v-for="(holding, index) in holdings" :key="holding.code" class="pf-legend-item">
                      <div class="pf-legend-color" :style="{ backgroundColor: getPieColor(index) }"></div>
                      <div class="pf-legend-info">
                        <div class="pf-legend-code">{{ holding.code }}</div>
                        <div class="pf-legend-value">A${{ (holding.amount * holding.currentPrice).toFixed(0) }}</div>
                        <div class="pf-legend-percentage">{{ getAssetPercentage(holding).toFixed(1) }}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pf-analysis-grid">
            <!-- 收益分布图 -->
            <div class="pf-analysis-card">
              <h4>Return Distribution</h4>
              <div class="pf-chart-placeholder">
                <div class="pf-chart-bars">
                  <div v-for="holding in holdings" :key="holding.code" class="pf-chart-bar">
                    <div class="pf-chart-bar-fill" :style="{ height: getBarHeight(holding.change) + '%' }"></div>
                    <div class="pf-chart-bar-label">{{ holding.code }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 风险评估 -->
            <div class="pf-analysis-card">
              <h4>Risk Assessment</h4>
              <div class="pf-risk-metrics">
                <div class="pf-risk-item">
                  <span class="pf-risk-label">Portfolio Risk</span>
                  <span class="pf-risk-value">{{ portfolioRisk }}</span>
                </div>
                <div class="pf-risk-item">
                  <span class="pf-risk-label">Diversification</span>
                  <span class="pf-risk-value">{{ diversification }}%</span>
                </div>
              </div>
            </div>

            <!-- 交易建议 -->
            <div class="pf-analysis-card">
              <h4>Trading Insights</h4>
              <div class="pf-insights">
                <div v-for="insight in tradingInsights" :key="insight.id" class="pf-insight-item">
                  <div class="pf-insight-icon">{{ insight.icon }}</div>
                  <div class="pf-insight-text">{{ insight.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 交易历史 -->
        <div v-if="activeTab==='Transactions'" class="pf-transactions">
          <div class="pf-transactions-header">
            <h3>Recent Transactions</h3>
            <button class="pf-filter-btn" @click="showFilters = !showFilters">
              Filter
            </button>
          </div>
          
          <div v-if="showFilters" class="pf-filters">
            <select v-model="filterType" class="pf-filter-select">
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <select v-model="filterProject" class="pf-filter-select">
              <option value="">All Projects</option>
              <option v-for="project in projects" :key="project.code" :value="project.code">
                {{ project.code }}
              </option>
            </select>
          </div>

          <div class="pf-transactions-list">
            <div v-for="transaction in filteredTransactions" :key="transaction.id" class="pf-transaction-item">
              <div class="pf-transaction-icon" :class="transaction.type">
                {{ transaction.type === 'buy' ? '📈' : '📉' }}
              </div>
              <div class="pf-transaction-details">
                <div class="pf-transaction-title">
                  {{ transaction.type.toUpperCase() }} {{ transaction.amount }} {{ transaction.projectCode }}
                </div>
                <div class="pf-transaction-time">{{ formatTime(transaction.timestamp) }}</div>
              </div>
              <div class="pf-transaction-value">
                <div class="pf-transaction-price">A${{ transaction.price.toFixed(2) }}</div>
                <div class="pf-transaction-total">A${{ (transaction.amount * transaction.price).toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目详情 -->
        <div v-if="activeTab==='Projects'" class="pf-projects">
          <div class="pf-projects-grid">
            <div v-for="project in accountProjects" :key="project.code" class="pf-project-card">
              <div class="pf-project-header">
                <img :src="project.image" :alt="project.code" class="pf-project-image" />
                <div class="pf-project-info">
                  <h4>{{ project.code }}</h4>
                  <p>{{ project.subtitle }}</p>
                </div>
              </div>
              <div class="pf-project-metrics">
                <div class="pf-project-metric">
                  <span class="pf-metric-label">Current Price</span>
                  <span class="pf-metric-value">A${{ project.currentPrice }}</span>
                </div>
                <div class="pf-project-metric">
                  <span class="pf-metric-label">Target Yield</span>
                  <span class="pf-metric-value">{{ project.targetYield }}%</span>
                </div>
                <div class="pf-project-metric">
                  <span class="pf-metric-label">Risk Level</span>
                  <span class="pf-metric-value" :class="'risk-' + project.risk">{{ project.risk }}</span>
                </div>
              </div>
              <div class="pf-project-actions">
                <button class="pf-project-btn" @click="goToTrade(project.code)">Trade</button>
                <button class="pf-project-btn pf-project-btn-secondary" @click="goToDetail(project.code)">Details</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWallet } from '/src/composables/useWallet'
import { useRouter } from 'vue-router'

const router = useRouter()
const { fullAddress, shortAddress, connected, nativeBalanceDisplay, nativeSymbol } = useWallet()

// 基础数据
const actions = [
  { text: 'Trade', icon: '📈' },
  { text: 'Swap', icon: '🔄' },
  { text: 'Bridge', icon: '🌉' },
  { text: 'Send', icon: '📤' },
  { text: 'Stake', icon: '🔒' },
]
const tabs = ['Analysis', 'Transactions', 'Projects']
const activeTab = ref('Analysis')

// 时间范围选择器
const timeframes = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' }
]
const selectedTimeframe = ref('1d')

// 状态管理
const showSettings = ref(false)
const showFilters = ref(false)
const filterType = ref('')
const filterProject = ref('')
const accGroupOpen = ref(true)
const selectedAccount = ref('')

// 账户数据
const accounts = ref([
  {
    address: fullAddress.value || '0x1234...5678',
    name: 'Main Account',
    balance: 2.5 //替换
  },
  {
    address: '0xabcd...efgh',
    name: 'Trading Account',
    balance: 1.2
  },
  {
    address: '0x9876...5432',
    name: 'Savings Account',
    balance: 5.8
  }
])

// 交易数据（按账户分组）
const accountTransactions = ref({
  [accounts.value[0].address]: [
    {
      id: 1,
      type: 'buy',
      projectCode: 'TYMU',
      amount: 100,
      price: 1.00,
      timestamp: Date.now() - 3600000,
    },
    {
      id: 2,
      type: 'buy',
      projectCode: 'SQNB',
      amount: 50,
      price: 1.02,
      timestamp: Date.now() - 7200000,
    }
  ],
  [accounts.value[1].address]: [
    {
      id: 3,
      type: 'sell',
      projectCode: 'LZYT',
      amount: 25,
      price: 0.98,
      timestamp: Date.now() - 10800000,
    },
    {
      id: 4,
      type: 'buy',
      projectCode: 'YYD',
      amount: 75,
      price: 1.05,
      timestamp: Date.now() - 14400000,
    }
  ],
  [accounts.value[2].address]: [
    {
      id: 5,
      type: 'buy',
      projectCode: 'TYMU',
      amount: 200,
      price: 0.99,
      timestamp: Date.now() - 18000000,
    }
  ]
})


// 项目数据
const projects = ref([
  {
    code: 'TYMU',
    name: 'TYMU Property Loan',
    image: '/pics/TYMU.png',
    subtitle: 'Prime Residential Mortgage Backed Loan',
    type: 'residential',
    region: 'Suburban',
    risk: 'low',
    targetYield: 6.5,
    currentPrice: 1.00,
    change: 2.5
  },
  {
    code: 'SQNB',
    name: 'SQNB Property Loan',
    image: '/pics/SQNB.png',
    subtitle: 'Commercial Mortgage Loan',
    type: 'commercial',
    region: 'CBD',
    risk: 'medium',
    targetYield: 7.2,
    currentPrice: 1.02,
    change: -1.2
  },
  {
    code: 'LZYT',
    name: 'LZYT Property Loan',
    image: '/pics/LZYT.png',
    subtitle: 'Suburban Residential Loan',
    type: 'residential',
    region: 'Suburban',
    risk: 'medium',
    targetYield: 6.9,
    currentPrice: 0.98,
    change: 0.8
  },
  {
    code: 'YYD',
    name: 'YYD Property Loan',
    image: '/pics/YYD.png',
    subtitle: 'CBD Apartment Mortgage',
    type: 'residential',
    region: 'CBD',
    risk: 'low',
    targetYield: 6.1,
    currentPrice: 1.05,
    change: 3.1
  }
])

// 计算属性
const filteredTransactions = computed(() => {
  if (!selectedAccount.value) return []
  
  let filtered = accountTransactions.value[selectedAccount.value] || []
  
  if (filterType.value) {
    filtered = filtered.filter(t => t.type === filterType.value)
  }
  
  if (filterProject.value) {
    filtered = filtered.filter(t => t.projectCode === filterProject.value)
  }
  
  return filtered.sort((a, b) => b.timestamp - a.timestamp)
})

// 获取指定账户的持仓
const getAccountHoldings = (accountAddress) => {
  if (!accountAddress || !accountTransactions.value[accountAddress]) return []
  
  const holdingMap = new Map()
  
  // 计算每个项目的持仓
  accountTransactions.value[accountAddress].forEach(tx => {
    const key = tx.projectCode
    if (!holdingMap.has(key)) {
      holdingMap.set(key, { code: key, amount: 0, totalCost: 0 })
    }
    
    const holding = holdingMap.get(key)
    if (tx.type === 'buy') {
      holding.amount += tx.amount
      holding.totalCost += tx.amount * tx.price
    } else {
      holding.amount -= tx.amount
      holding.totalCost -= tx.amount * tx.price
    }
  })
  
  // 添加当前价格和变化
  return Array.from(holdingMap.values())
    .filter(h => h.amount > 0)
    .map(holding => {
      const project = projects.value.find(p => p.code === holding.code)
      const currentPrice = project ? project.currentPrice : 1.00
      const currentValue = holding.amount * currentPrice
      const change = holding.totalCost > 0 ? ((currentValue - holding.totalCost) / holding.totalCost) * 100 : 0
      
      return {
        ...holding,
        currentPrice,
        change
      }
    })
}

// 获取指定账户的总投资
const getAccountTotalInvestment = (accountAddress) => {
  const holdings = getAccountHoldings(accountAddress)
  return holdings.reduce((sum, holding) => sum + holding.totalCost, 0)
}

// 获取指定账户的当前价值
const getAccountCurrentValue = (accountAddress) => {
  const holdings = getAccountHoldings(accountAddress)
  return holdings.reduce((sum, holding) => sum + (holding.amount * holding.currentPrice), 0)
}

// 获取指定账户的总收益
const getAccountTotalGain = (accountAddress) => {
  const currentValue = getAccountCurrentValue(accountAddress)
  const totalInvestment = getAccountTotalInvestment(accountAddress)
  return currentValue - totalInvestment
}

// 获取指定账户的ROI
const getAccountROI = (accountAddress) => {
  const totalInvestment = getAccountTotalInvestment(accountAddress)
  const totalGain = getAccountTotalGain(accountAddress)
  return totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0
}

// 为了兼容性，保留原有的计算属性（基于当前选中账户）
const holdings = computed(() => getAccountHoldings(selectedAccount.value))
const totalInvestment = computed(() => getAccountTotalInvestment(selectedAccount.value))
const currentValue = computed(() => getAccountCurrentValue(selectedAccount.value))
const totalGain = computed(() => getAccountTotalGain(selectedAccount.value))
const roi = computed(() => getAccountROI(selectedAccount.value))

// 获取当前账户下购买的项目
const accountProjects = computed(() => {
  if (!selectedAccount.value) return []
  
  const accountHoldings = getAccountHoldings(selectedAccount.value)
  const projectCodes = accountHoldings.map(holding => holding.code)
  
  return projects.value.filter(project => projectCodes.includes(project.code))
})

const portfolioRisk = computed(() => {
  const riskScores = { low: 1, medium: 2, high: 3 }
  const weightedRisk = holdings.value.reduce((sum, holding) => {
    const project = projects.value.find(p => p.code === holding.code)
    const riskScore = project ? riskScores[project.risk] || 2 : 2
    return sum + (riskScore * holding.amount * holding.currentPrice)
  }, 0)
  
  const totalValue = currentValue.value
  if (totalValue === 0) return 'Low'
  
  const avgRisk = weightedRisk / totalValue
  if (avgRisk <= 1.5) return 'Low'
  if (avgRisk <= 2.5) return 'Medium'
  return 'High'
})

const diversification = computed(() => {
  const holdingCount = holdings.value.length
  const maxDiversification = projects.value.length
  return maxDiversification > 0 ? Math.min((holdingCount / maxDiversification) * 100, 100) : 0
})

const tradingInsights = computed(() => {
  const insights = []
  
  if (totalGain.value > 0) {
    insights.push({
      id: 1,
      icon: '📈',
      text: `Portfolio is up ${roi.value.toFixed(1)}%. Consider taking some profits.`
    })
  } else {
    insights.push({
      id: 1,
      icon: '📉',
      text: `Portfolio is down ${Math.abs(roi.value).toFixed(1)}%. Consider dollar-cost averaging.`
    })
  }
  
  if (diversification.value < 50) {
    insights.push({
      id: 2,
      icon: '⚠️',
      text: 'Low diversification. Consider spreading risk across more projects.'
    })
  }
  
  const bestPerformer = holdings.value.reduce((best, current) => 
    current.change > best.change ? current : best, holdings.value[0] || { change: 0, code: '' })
  
  if (bestPerformer.change > 5) {
    insights.push({
      id: 3,
      icon: '🎯',
      text: `${bestPerformer.code} is performing well (+${bestPerformer.change.toFixed(1)}%). Consider increasing allocation.`
    })
  }
  
  return insights
})

// 方法
const handleAction = (action) => {
  switch (action) {
    case 'Buy':
    case 'Sell':
      router.push('/projects')
      break
    case 'Swap':
      router.push('/swap')
      break
    case 'Bridge':
      router.push('/bridge')
      break
    case 'Send':
      router.push('/send')
      break
    case 'Stake':
      router.push('/wallet')
      break
  }
}

// 账户管理方法
const selectAccount = (accountAddress) => {
  selectedAccount.value = accountAddress
}

const addAccount = () => {
  const newAddress = prompt('Enter wallet address:')
  if (newAddress && !accounts.value.find(acc => acc.address === newAddress)) {
    accounts.value.push({
      address: newAddress,
      name: `Account ${accounts.value.length + 1}`,
      balance: 0
    })
    accountTransactions.value[newAddress] = []
  }
}

const formatAddress = (address) => {
  if (!address) return '—'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const getAccountBalance = (accountAddress) => {
  const account = accounts.value.find(acc => acc.address === accountAddress)
  return account ? account.balance.toFixed(4) : '0.0000'
}

const refreshPortfolio = () => {
  // 模拟价格更新
  projects.value.forEach(project => {
    const change = (Math.random() - 0.5) * 0.1 // ±5% change
    project.currentPrice *= (1 + change)
    project.change = change * 100
  })
}

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

const getBarHeight = (change) => {
  const maxChange = Math.max(...holdings.value.map(h => Math.abs(h.change)), 1)
  return Math.min(Math.abs(change) / maxChange * 100, 100)
}

// 饼图相关方法
const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

const getPieColor = (index) => {
  return pieColors[index % pieColors.length]
}

const getAssetPercentage = (holding) => {
  if (currentValue.value === 0) return 0
  return (holding.amount * holding.currentPrice / currentValue.value) * 100
}

const getPieDashArray = (holding) => {
  const percentage = getAssetPercentage(holding)
  const circumference = 2 * Math.PI * 80 // r = 80
  const dashLength = (percentage / 100) * circumference
  return `${dashLength} ${circumference}`
}

const getPieDashOffset = (index) => {
  let offset = 0
  for (let i = 0; i < index; i++) {
    const holding = holdings.value[i]
    const percentage = getAssetPercentage(holding)
    const circumference = 2 * Math.PI * 80
    offset -= (percentage / 100) * circumference
  }
  return offset
}

// 折线图相关方法
const generatePriceHistory = (holding, timeframe) => {
  const points = 6
  const history = []
  const basePrice = holding.currentPrice
  const volatility = 0.1 // 10% 波动率
  
  for (let i = 0; i < points; i++) {
    const randomChange = (Math.random() - 0.5) * volatility
    const price = basePrice * (1 + randomChange)
    history.push({
      time: i,
      price: Math.max(price, basePrice * 0.8) // 最低不低于当前价格的80%
    })
  }
  
  // 确保最后一个点是当前价格
  history[points - 1] = {
    time: points - 1,
    price: basePrice
  }
  
  return history
}

const getPriceHistory = (holding) => {
  return generatePriceHistory(holding, selectedTimeframe.value)
}

const getPriceLinePoints = (holding, holdingIndex) => {
  const history = getPriceHistory(holding)
  const points = history.map((point, index) => {
    const x = 60 + (index * 70) // 每点间隔70px，适配400px宽度
    const y = 30 + (140 - ((point.price - getMinPrice()) / (getMaxPrice() - getMinPrice())) * 140) // 适配200px高度
    return `${x},${y}`
  })
  return points.join(' ')
}

const getPriceLinePointsArray = (holding) => {
  const history = getPriceHistory(holding)
  return history.map((point, index) => {
    const x = 60 + (index * 70)
    const y = 30 + (140 - ((point.price - getMinPrice()) / (getMaxPrice() - getMinPrice())) * 140)
    return { x, y }
  })
}

const getMinPrice = () => {
  let min = Infinity
  holdings.value.forEach(holding => {
    const history = getPriceHistory(holding)
    history.forEach(point => {
      if (point.price < min) min = point.price
    })
  })
  return min
}

const getMaxPrice = () => {
  let max = -Infinity
  holdings.value.forEach(holding => {
    const history = getPriceHistory(holding)
    history.forEach(point => {
      if (point.price > max) max = point.price
    })
  })
  return max
}

const yAxisLabels = computed(() => {
  const min = getMinPrice()
  const max = getMaxPrice()
  const range = max - min
  const labels = []
  
  for (let i = 0; i <= 4; i++) {
    const value = min + (range * i / 4)
    labels.push(`A$${value.toFixed(2)}`)
  }
  
  return labels
})

const xAxisLabels = computed(() => {
  const labels = []
  const points = 6
  const timeframe = selectedTimeframe.value
  
  for (let i = 0; i < points; i++) {
    if (timeframe === '1h') {
      labels.push(`${i * 10}m`)
    } else if (timeframe === '4h') {
      labels.push(`${i * 40}m`)
    } else if (timeframe === '1d') {
      labels.push(`${i * 4}h`)
    } else if (timeframe === '7d') {
      labels.push(`Day ${i + 1}`)
    } else if (timeframe === '30d') {
      labels.push(`Week ${i + 1}`)
    }
  }
  
  return labels
})

const goToTrade = (code) => {
  router.push({ name: 'tradeProject', params: { code } })
}

const goToDetail = (code) => {
  router.push({ name: 'detail', params: { code } })
}

// 生命周期
let priceUpdateInterval

onMounted(() => {
  // 初始化选中账户
  if (accounts.value.length > 0) {
    selectedAccount.value = accounts.value[0].address
  }
  
  // 每30秒更新一次价格
  priceUpdateInterval = setInterval(refreshPortfolio, 30000)
})

onUnmounted(() => {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval)
  }
})
</script>

<style scoped>
/* —— 这里保持你原来的样式 —— */
:root { --bg:#f6f7fb; --panel:#fff; --text:#0b1020; --muted:#6b7280; --muted-2:#9aa3b2; --border:#e6e8ef; --shadow:0 6px 20px rgba(15,23,42,.06); --primary:#3b82f6; --primary-ink:#1e40af; --danger:#ef4444; }
.pf-page{background:var(--bg);min-height:100vh;color:var(--text);}
.pf-topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;position:sticky;top:0;z-index:10;background:var(--bg);}
.pf-actions{display:flex;gap:12px;flex-wrap:wrap;}
.pf-pill{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:14px;background:var(--panel);border:1px solid var(--border);box-shadow:var(--shadow);font-weight:600;cursor:pointer;color:#ffffff;}
.pf-pill-ico{width:22px;height:22px;display:grid;place-items:center;border-radius:999px;background:#f1f5ff;}
.pf-pill:hover{transform:translateY(-1px)}
.pf-add{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:14px;background:var(--panel);border:1px solid var(--border);box-shadow:var(--shadow);font-weight:600;cursor:pointer;color:#ffffff;}
.pf-add-ico{font-size:18px;line-height:1}
.pf-body{display:grid;grid-template-columns:280px 1fr;gap:16px;padding:0 20px 24px;}
.pf-sidebar{background:#141426;border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow);padding:16px;}
.pf-side-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.pf-side-head h2{font-size:20px;font-weight:800;color:#ffffff;}
.pf-side-tools{display:flex;gap:10px;color:#9ca3af}
.pf-acc-group{margin-top:8px;}
.pf-acc-title{width:100%;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;padding:10px 8px;border-radius:10px;cursor:pointer;font-weight:600;color:#ffffff;}
.caret{transition:.2s transform ease}
.caret.open{transform:rotate(180deg)}
.pf-acc-item{display:flex;align-items:center;gap:10px;margin-top:8px;padding:8px;border-radius:10px;background:#1f2937}
.pf-avatar{width:28px;height:28px;border-radius:50%;background:radial-gradient(100% 100% at 25% 25%,#ffd79a 0%,#ff9e6e 40%,#ff7b7b 100%);box-shadow: inset 0 0 0 2px #374151;}
.pf-addr{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;color:#9ca3af}
.pf-main{background:var(--panel);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow);padding:16px 18px;}
.pf-hero{padding:8px 4px 12px;border-bottom:1px solid var(--border)}
.pf-balance{font-size:56px;font-weight:900;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;}
.pf-eye{border:none;background:transparent;cursor:pointer;font-size:20px}
.pf-change{color:var(--danger);font-weight:600;margin-top:4px}
.pf-tabs{display:flex;gap:32px;margin-top:8px;}
.pf-tab{appearance:none;background:none;border:none;cursor:pointer;padding:14px 0;font-weight:700;color:var(--muted);position:relative;}
.pf-tab.active{color:var(--primary)}
.pf-tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:var(--primary);border-radius:3px;}
.pf-toolbar{display:flex;gap:14px;align-items:center;padding:16px 0;}
.pf-chip{display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid var(--border);background:#fff;border-radius:999px;box-shadow:var(--shadow);font-weight:600;cursor:pointer;}
.pf-chip-ghost{background:#0f172a;color:#ffffff;border-color:#0f172a}
.pf-chip-text{white-space:nowrap}
.pf-chain-badges{display:flex;align-items:center;margin-left:-4px}
.pf-badge{width:24px;height:24px;border-radius:999px;display:grid;place-items:center;background:#eef2ff;margin-left:-6px;border:2px solid #fff;font-size:12px}
.pf-badge.eth{background:#dbeafe}
.pf-badge.op{background:#ffe4e6}
.pf-badge.arb{background:#dcfce7}
.pf-badge.more{background:#e2e8f0}
.pf-chip-caret{color:var(--muted-2)}
.pf-empty{display:grid;place-items:center;padding:48px 0 56px;text-align:center;gap:16px}
.pf-empty-ico{font-size:40px}
.pf-empty-title{font-weight:800;font-size:20px}
.pf-cta{padding:12px 18px;border-radius:12px;background:#111827;color:#ffffff;border:1px solid #111827;box-shadow:var(--shadow);cursor:pointer}
.pf-cta:hover{opacity:.9}
.pf-placeholder{padding:18px}
.pf-card{border:1px solid var(--border);border-radius:12px;padding:16px;background:#fff;color:var(--muted)}

/* 账户管理样式 */
.pf-acc-list{margin-top:8px;}
.pf-acc-item{display:flex;align-items:center;gap:12px;margin-bottom:8px;padding:12px;border-radius:12px;cursor:pointer;transition:all 0.2s ease;border:1px solid transparent;}
.pf-acc-item:hover{background:#374151;border-color:#4b5563;}
.pf-acc-item.active{background:#1e40af;border-color:#3b82f6;}
.pf-acc-info{flex:1;}
.pf-acc-name{font-weight:600;color:#ffffff;margin-bottom:2px;}
.pf-acc-balance{font-size:12px;color:#9ca3af;margin-top:2px;}
.pf-avatar{width:32px;height:32px;border-radius:50%;background:radial-gradient(100% 100% at 25% 25%,#ffd79a 0%,#ff9e6e 40%,#ff7b7b 100%);box-shadow: inset 0 0 0 2px #374151;}

/* 账户概览样式 */
.pf-account-overview{margin-top:20px;padding-top:20px;border-top:1px solid #374151;}
.pf-account-overview h3{margin-bottom:12px;font-size:16px;font-weight:700;color:#ffffff;}
.pf-account-overview h4{margin-bottom:8px;font-size:14px;font-weight:600;color:#ffffff;}

/* 统计卡片样式 */
.pf-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;}
.pf-stat-card{padding:12px;border-radius:10px;background:#1f2937;border:1px solid #374151;}
.pf-stat-label{font-size:11px;color:#9ca3af;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;}
.pf-stat-value{font-size:14px;font-weight:700;color:#ffffff;}
.pf-stat-value.positive{color:#16a34a;}
.pf-stat-value.negative{color:#dc2626;}

/* 持仓样式 */
.pf-holdings{margin-top:16px;}
.pf-holding-item{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #374151;}
.pf-holding-item:last-child{border-bottom:none;}
.pf-holding-info{flex:1;}
.pf-holding-code{font-weight:600;color:#ffffff;font-size:14px;}
.pf-holding-amount{font-size:12px;color:#9ca3af;margin-top:2px;}
.pf-holding-value{text-align:right;}
.pf-holding-price{font-weight:600;color:#ffffff;font-size:14px;}
.pf-holding-change{font-size:12px;margin-top:2px;}
.pf-holding-change.positive{color:#16a34a;}
.pf-holding-change.negative{color:#dc2626;}

/* 交易历史样式 */
.pf-transactions-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.pf-transactions-header h3{margin:0;font-size:18px;font-weight:700;color:#ffffff;}
.pf-filter-btn{padding:6px 12px;border:1px solid #374151;border-radius:8px;background:#1f2937;color:#ffffff;cursor:pointer;font-size:14px;}
.pf-filter-btn:hover{background:#374151;}

.pf-filters{display:flex;gap:12px;margin-bottom:16px;padding:12px;background:#1f2937;border-radius:10px;}
.pf-filter-select{padding:6px 10px;border:1px solid #374151;border-radius:6px;background:#141426;color:#ffffff;font-size:14px;}

.pf-transaction-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;background:#141426;border:1px solid #374151;margin-bottom:8px;}
.pf-transaction-icon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;}
.pf-transaction-icon.buy{background:#dcfce7;color:#16a34a;}
.pf-transaction-icon.sell{background:#fee2e2;color:#dc2626;}
.pf-transaction-details{flex:1;}
.pf-transaction-title{font-weight:600;color:#ffffff;margin-bottom:2px;}
.pf-transaction-time{font-size:12px;color:#9ca3af;}
.pf-transaction-value{text-align:right;}
.pf-transaction-price{font-weight:600;color:#ffffff;}
.pf-transaction-total{font-size:12px;color:#9ca3af;margin-top:2px;}

/* 资产总结图表样式 */
.pf-asset-summary{margin-bottom:24px;padding:20px;border-radius:16px;background:#141426;border:1px solid var(--border);}
.pf-summary-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.pf-summary-header h3{margin:0;font-size:20px;font-weight:700;color:#ffffff;}
.pf-summary-stats{display:flex;gap:24px;}
.pf-summary-stat{text-align:center;}
.pf-stat-number{display:block;font-size:18px;font-weight:700;color:#ffffff;margin-bottom:4px;}
.pf-stat-number.positive{color:#16a34a;}
.pf-stat-number.negative{color:#dc2626;}
.pf-stat-label{font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;}

/* 图表行布局 */
.pf-charts-row{display:flex;gap:24px;align-items:flex-start;}
.pf-price-chart{flex:1;min-width:0;}
.pf-pie-chart-section{flex:0 0 320px;min-width:320px;}

.pf-chart-container{display:flex;align-items:center;gap:32px;}
.pf-pie-chart{position:relative;width:200px;height:200px;}
.pf-pie-svg{width:100%;height:100%;}
.pf-pie-center{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);text-align:center;}
.pf-pie-total{font-size:20px;font-weight:700;color:#ffffff;margin-bottom:4px;}
.pf-pie-label{font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;}

.pf-chart-legend{flex:1;}
.pf-legend-item{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.pf-legend-color{width:16px;height:16px;border-radius:4px;}
.pf-legend-info{flex:1;}
.pf-legend-code{font-weight:600;color:#ffffff;margin-bottom:2px;}
.pf-legend-value{font-size:14px;color:#ffffff;margin-bottom:2px;}
.pf-legend-percentage{font-size:12px;color:#9ca3af;}

/* 价格变化折线图样式 */
.pf-price-chart{padding:16px;border-radius:12px;background:#141426;border:1px solid var(--border);}
.pf-chart-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.pf-chart-header h4{margin:0;font-size:16px;font-weight:700;color:#ffffff;}
.pf-timeframe-selector{display:flex;gap:6px;}
.pf-timeframe-btn{padding:4px 8px;border-radius:4px;border:1px solid #374151;background:#1f2937;color:#9ca3af;font-size:11px;font-weight:500;cursor:pointer;transition:all 0.2s;}
.pf-timeframe-btn:hover{background:#374151;border-color:#4b5563;}
.pf-timeframe-btn.active{background:#3b82f6;border-color:#3b82f6;color:#fff;}

.pf-line-chart-container{width:100%;height:200px;margin-bottom:12px;}
.pf-line-chart-svg{width:100%;height:100%;}
.pf-y-axis{font-size:12px;color:#9ca3af;}
.pf-x-axis{font-size:12px;color:#9ca3af;}
.pf-axis-label{font-size:11px;fill:#9ca3af;text-anchor:middle;}
.pf-price-line{transition:opacity 0.3s ease;}
.pf-data-point{cursor:pointer;transition:r 0.2s ease;}
.pf-data-point:hover{r:6;}

.pf-chart-legend-inline{display:flex;flex-wrap:wrap;gap:16px;padding:16px;background:#1f2937;border-radius:8px;}
.pf-legend-inline-item{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:6px;background:#374151;border:1px solid #4b5563;}
.pf-legend-inline-color{width:12px;height:12px;border-radius:2px;}
.pf-legend-inline-code{font-weight:600;color:#ffffff;font-size:12px;}
.pf-legend-inline-price{color:#9ca3af;font-size:12px;margin-left:4px;}
.pf-legend-inline-change{font-size:12px;font-weight:500;margin-left:8px;}
.pf-legend-inline-change.positive{color:#16a34a;}
.pf-legend-inline-change.negative{color:#dc2626;}

/* 分析页面样式 */
.pf-analysis-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:16px;}
.pf-analysis-card{padding:16px;border-radius:12px;background:#141426;border:1px solid var(--border);}
.pf-analysis-card h4{margin:0 0 12px 0;font-size:16px;font-weight:700;color:#ffffff;}

.pf-chart-placeholder{height:200px;display:flex;align-items:end;justify-content:center;gap:20px;padding:20px 0;}
.pf-chart-bars{display:flex;align-items:end;gap:16px;height:100%;}
.pf-chart-bar{display:flex;flex-direction:column;align-items:center;gap:8px;}
.pf-chart-bar-fill{width:24px;background:var(--primary);border-radius:4px 4px 0 0;min-height:4px;transition:height 0.3s ease;}
.pf-chart-bar-label{font-size:12px;color:#9ca3af;}

.pf-risk-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #374151;}
.pf-risk-item:last-child{border-bottom:none;}
.pf-risk-label{font-size:14px;color:#ffffff;}
.pf-risk-value{font-weight:600;color:#ffffff;}

.pf-insight-item{display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:#1f2937;margin-bottom:8px;}
.pf-insight-icon{font-size:16px;}
.pf-insight-text{font-size:14px;color:#ffffff;}

/* 项目卡片样式 */
.pf-projects-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;}
.pf-project-card{padding:16px;border-radius:12px;background:#141426;border:1px solid var(--border);}
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

.pf-project-actions{display:flex;gap:8px;}
.pf-project-btn{padding:8px 16px;border-radius:8px;border:1px solid #374151;background:#1f2937;color:#ffffff;cursor:pointer;font-size:14px;font-weight:600;transition:all 0.2s ease;}
.pf-project-btn:hover{background:#374151;}
.pf-project-btn-secondary{background:var(--primary);color:#fff;border-color:var(--primary);}
.pf-project-btn-secondary:hover{background:var(--primary-ink);}

@media (max-width:1024px){.pf-body{grid-template-columns:1fr}.pf-sidebar{order:2}.pf-main{order:1}}
</style>
