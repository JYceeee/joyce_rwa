<template>
  <div class="container pf-page">
   

    <!-- 有绑定钱包时显示Portfolio页面 -->
    <div class="pf-main-content">
      <!-- 顶部操作按钮行 -->
      <!-- <div class="pf-topbar"> -->
        <!-- <div class="pf-actions">
          <button v-for="a in actions" :key="a.text" class="pf-pill" @click="handleAction(a.text)">
            <span class="pf-pill-ico">{{ a.icon }}</span>
            <span>{{ a.text }}</span>
          </button>
        </div> -->
        <!-- <button class="pf-add" @click="refreshPortfolio">
          <span class="pf-add-ico">🔄</span>
          Refresh -->
        <!-- </button> -->
      <!-- </div> -->

    <div class="pf-body">
      <!-- 侧栏：Accounts -->
      <aside class="pf-sidebar">
        <div class="pf-side-head">
          <h2>Bound Wallets</h2>
          <div class="pf-side-tools">
            <span class="gear" @click="showSettings = !showSettings">⚙️</span>
            <span class="plus" @click="addAccount" title="Add wallets in Wallet page">＋</span>
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

        <!-- 资产分布饼图 -->
        <div class="pf-sidebar-pie-section">
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
      </aside>

      <!-- 主区域 -->
      <main class="pf-main">
        <!-- 投资概览 -->
        <div class="pf-hero">
          <div class="pf-balance">
             A${{ nativeBalanceDisplay }}
          </div>
          <!-- <div class="pf-change" :class="{ positive: totalGain >= 0, negative: totalGain < 0 }">
            {{ totalGain >= 0 ? '+' : '' }}A${{ totalGain.toFixed(2) }} ({{ roi >= 0 ? '+' : '' }}{{ roi.toFixed(2) }}%)
          </div> -->
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
            
            <!-- 交易记录柱状图 -->
            <div class="pf-transaction-chart">
              <div class="pf-chart-header">
                <h4>Transaction History</h4>
                <div class="pf-chart-controls">
                  <select v-model="chartTimeframe" class="pf-select">
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 3 Months</option>
                    <option value="1y">Last Year</option>
                  </select>
                  <button @click="refreshTransactionData" class="pf-refresh-btn">🔄</button>
                </div>
              </div>
              
              <!-- 累计统计摘要 -->
              <div v-if="transactionChartData.length > 0" class="pf-chart-summary">
                <div class="pf-summary-item">
                  <span class="pf-summary-label">Total Buy Value:</span>
                  <span class="pf-summary-value pf-buy-color">A${{ getTotalBuyValue().toFixed(2) }}</span>
                </div>
                <div class="pf-summary-item">
                  <span class="pf-summary-label">Total Sell Value:</span>
                  <span class="pf-summary-value pf-sell-color">A${{ getTotalSellValue().toFixed(2) }}</span>
                </div>
                <div class="pf-summary-item">
                  <span class="pf-summary-label">Net Value:</span>
                  <span class="pf-summary-value" :class="getNetValue() >= 0 ? 'pf-positive' : 'pf-negative'">
                    {{ getNetValue() >= 0 ? '+' : '' }}A${{ getNetValue().toFixed(2) }}
                  </span>
                </div>
              </div>
              
              <div class="pf-bar-chart-container">
                <div v-if="loadingTransactions" class="pf-chart-loading">
                  <div class="pf-spinner"></div>
                  <span>Loading transaction data...</span>
                </div>
                <div v-else-if="transactionChartData.length === 0" class="pf-chart-empty">
                  <div class="pf-empty-icon">📊</div>
                  <p>No transaction data available</p>
                </div>
                <div v-else class="pf-bar-chart">
                  <div 
                    class="pf-chart-bars"
                    :style="{ '--bar-count': transactionChartData.length }"
                  >
                    <div 
                      v-for="(item, index) in transactionChartData" 
                      :key="index"
                      class="pf-bar-item"
                    >
                      <div class="pf-bar-container">
                        <div class="pf-bar-buy" :style="{ height: getBarHeight(item.buyValue, maxTransactions) + '%' }"></div>
                        <div class="pf-bar-sell" :style="{ height: getBarHeight(item.sellValue, maxTransactions) + '%' }"></div>
                      </div>
                      <div class="pf-bar-label">{{ item.date }}</div>
                      <div class="pf-bar-tooltip">
                        <div class="pf-tooltip-buy">Buy: {{ item.buy }} (A${{ item.buyValue.toFixed(2) }})</div>
                        <div class="pf-tooltip-sell">Sell: {{ item.sell }} (A${{ item.sellValue.toFixed(2) }})</div>
                        <div class="pf-tooltip-total">Total: {{ item.buy + item.sell }} (A${{ (item.buyValue + item.sellValue).toFixed(2) }})</div>
                      </div>
                    </div>
                  </div>
                  <div class="pf-chart-legend">
                    <div class="pf-legend-item">
                      <div class="pf-legend-color pf-buy-color"></div>
                      <span>Buy Value (A$)</span>
                    </div>
                    <div class="pf-legend-item">
                      <div class="pf-legend-color pf-sell-color"></div>
                      <span>Sell Value (A$)</span>
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
                    <div class="pf-chart-bar-fill" :style="{ height: getPriceBarHeight(holding.change) + '%' }"></div>
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
            <!-- <div class="pf-analysis-card">
              <h4>Trading Insights</h4>
              <div class="pf-insights">
                <div v-for="insight in tradingInsights" :key="insight.id" class="pf-insight-item">
                  <div class="pf-insight-icon">{{ insight.icon }}</div>
                  <div class="pf-insight-text">{{ insight.text }}</div>
                </div>
              </div>
            </div> -->
          </div>
        </div>

        <!-- 交易历史 -->
        <div v-if="activeTab==='Transactions'" class="pf-transactions">
          <div class="pf-transactions-header">
            <h3>Recent Transactions</h3>
            <div class="pf-transactions-actions">
              <button class="pf-filter-btn" @click="showFilters = !showFilters">
                Filter
              </button>
              <button class="pf-refresh-btn" @click="refreshTransactions" :disabled="loadingTransactions">
                <span v-if="loadingTransactions">🔄</span>
                <span v-else>Refresh</span>
              </button>
            </div>
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
            <div v-if="filteredTransactions.length === 0" class="pf-no-transactions">
              <div class="pf-empty-icon">📊</div>
              <p>No transaction data available</p>
              <p class="pf-empty-hint">Complete some trades in the Trade page to see your transaction history</p>
            </div>
            <div v-else>
              <div v-for="transaction in filteredTransactions" :key="transaction.id" class="pf-transaction-item">
                <div class="pf-transaction-icon" :class="transaction.type">
                  {{ transaction.type === 'buy' ? '📈' : '📉' }}
                </div>
                <div class="pf-transaction-details">
                  <div class="pf-transaction-title">
                    {{ transaction.type.toUpperCase() }} {{ transaction.amount }} {{ transaction.projectCode }}
                  </div>
                  <div class="pf-transaction-subtitle">
                    {{ transaction.projectName }}
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
    </div> <!-- 结束 pf-main-content -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useWallet } from '/src/composables/useWallet'
import { useRouter } from 'vue-router'
import { productAPI } from '@/service/api'
import { useDatabaseSync } from '@/service/databaseSyncService'

const router = useRouter()
const { fullAddress, shortAddress, connected, nativeBalanceDisplay, nativeSymbol } = useWallet()

// 检查是否有绑定的钱包 - 移除限制，允许页面完全展示
const hasBoundWallets = computed(() => {
  return true // 总是返回true，移除钱包绑定限制
})

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

// 交易图表相关数据
const chartTimeframe = ref('30d')
const loadingTransactions = ref(false)
const transactionChartData = ref([])

// 状态管理
const showSettings = ref(false)
const showFilters = ref(false)
const filterType = ref('')
const filterProject = ref('')
const accGroupOpen = ref(true)
const selectedAccount = ref('')

// 数据库同步相关
let unsubscribeProducts = null

// 账户数据 - 从localStorage加载绑定的钱包账户
const accounts = ref([])

// 从数据库加载项目数据
async function loadProjects() {
  try {
    projectsLoading.value = true
    projectsError.value = null
    console.log('🔄 PortfolioView: 从数据库加载项目数据...')
    
    const response = await productAPI.getAllProducts()
    
    if (response.status === 0) {
      projects.value = response.data || []
      console.log('✅ PortfolioView: 项目数据加载成功，共', projects.value.length, '个项目')
    } else {
      projectsError.value = response.message || '获取项目数据失败'
      console.error('❌ PortfolioView: API返回错误:', response)
    }
  } catch (error) {
    projectsError.value = '网络错误，无法获取项目数据'
    console.error('❌ PortfolioView: 加载项目数据失败:', error)
  } finally {
    projectsLoading.value = false
  }
}

// 从localStorage加载绑定的钱包账户，与WalletView保持一致
function loadBoundAccounts() {
  try {
    const savedAccounts = localStorage.getItem('walletBoundAccounts')
    if (savedAccounts) {
      const boundAddresses = JSON.parse(savedAccounts)
      accounts.value = boundAddresses.map((address, index) => ({
        address: address,
        name: `Wallet ${index + 1}`,
        balance: 0 // 初始余额，后续会从useWallet更新
      }))
      console.log('📂 Portfolio loaded bound accounts:', accounts.value)
    } else {
      // 如果没有绑定的账户，使用当前连接的钱包
      if (fullAddress.value) {
        accounts.value = [{
          address: fullAddress.value,
          name: 'Main Account',
          balance: 0
        }]
        console.log('📂 Portfolio using current connected wallet:', fullAddress.value)
      } else {
        // 如果也没有连接的钱包，提供默认的演示账户
        accounts.value = [{
          address: '0x1234567890123456789012345678901234567890',
          name: 'Demo Account',
          balance: 1.5
        }]
        console.log('📂 Portfolio using demo account for display')
      }
    }
    
    // 更新余额信息
    updateAccountBalances()
    
    // 初始化交易数据
    initializeTransactionData()
    
  } catch (error) {
    console.error('❌ Failed to load bound accounts:', error)
    // 即使出错也提供默认演示账户
    accounts.value = [{
      address: '0x1234567890123456789012345678901234567890',
      name: 'Demo Account',
      balance: 1.5
    }]
    // 初始化交易数据
    initializeTransactionData()
  }
}

// 更新账户余额，从useWallet获取真实的余额数据
function updateAccountBalances() {
  accounts.value.forEach(account => {
    // 如果当前账户是连接的钱包，使用useWallet的余额
    if (account.address === fullAddress.value && connected.value) {
      // 从useWallet获取余额
      const balanceInEther = nativeBalanceDisplay.value
      account.balance = parseFloat(balanceInEther) || 0
      console.log(`💰 Updated balance for ${account.address}: ${account.balance} ${nativeSymbol.value}`)
    } else {
      // 对于其他账户，保持现有余额或使用默认值
      if (account.balance === 0) {
        account.balance = Math.random() * 2 // 随机演示余额
      }
    }
  })
}

// 初始化交易数据
function initializeTransactionData() {
  if (accounts.value.length === 0) return
  
  // 为每个账户初始化交易数据
  const newAccountTransactions = {}
  
  accounts.value.forEach((account, index) => {
    if (index === 0) {
      // 第一个账户的交易数据
      newAccountTransactions[account.address] = [
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
      ]
    } else if (index === 1) {
      // 第二个账户的交易数据
      newAccountTransactions[account.address] = [
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
      ]
    } else {
      // 其他账户的交易数据
      newAccountTransactions[account.address] = [
        {
          id: 5,
          type: 'buy',
          projectCode: 'TYMU',
          amount: 200,
          price: 0.99,
          timestamp: Date.now() - 18000000,
        }
      ]
    }
  })
  
  accountTransactions.value = newAccountTransactions
  console.log('📊 Portfolio initialized transaction data:', accountTransactions.value)
}

// 交易数据（按账户分组）- 初始化为空，在loadBoundAccounts后填充
const accountTransactions = ref({})


// 项目数据 - 从数据库获取
const projects = ref([])
const projectsLoading = ref(true)
const projectsError = ref(null)

// 计算属性
const filteredTransactions = computed(() => {
  // 从WalletView获取交易活动数据
  const walletActivity = getWalletActivityData()
  
  // 筛选出transaction activity（buy/sell类型）
  let filtered = walletActivity.filter(activity => 
    activity.type === 'buy' || activity.type === 'sell'
  )
  
  // 如果没有交易数据，返回空数组
  if (filtered.length === 0) {
    console.log('📊 PortfolioView: 没有找到交易活动数据')
    return []
  }
  
  // 转换数据格式以匹配模板需求
  filtered = filtered.map(activity => ({
    id: activity.id || Date.now() + Math.random(),
    type: activity.type,
    projectCode: activity.project_code || activity.projectCode,
    projectName: activity.project_name || 'Unknown Project',
    amount: activity.amount || 0,
    price: activity.price || 1.00,
    timestamp: activity.timestamp || Date.now(),
    userAddress: activity.user_address || selectedAccount.value
  }))
  
  // 应用筛选器
  if (filterType.value) {
    filtered = filtered.filter(t => t.type === filterType.value)
  }
  
  if (filterProject.value) {
    filtered = filtered.filter(t => t.projectCode === filterProject.value)
  }
  
  // 按时间倒序排列
  return filtered.sort((a, b) => b.timestamp - a.timestamp)
})

// 获取指定账户的最近交易记录
const getRecentTransactions = (accountAddress) => {
  if (!accountAddress || !accountTransactions.value[accountAddress]) {
    // 如果没有选中账户，返回默认的演示交易数据
    return [
      {
        id: Date.now() - 3600000,
        type: 'buy',
        amount: 100,
        projectCode: 'TYMU',
        project_code: 'TYMU',
        project_name: 'St Ives NSW Residential Project',
        price: 1.00,
        timestamp: Date.now() - 3600000
      },
      {
        id: Date.now() - 1800000,
        type: 'sell',
        amount: 50,
        projectCode: 'SQNB',
        project_code: 'SQNB',
        project_name: 'SQNB Property Loan',
        price: 1.02,
        timestamp: Date.now() - 1800000
      }
    ]
  }
  
  // 返回最近的交易记录，按时间倒序排列
  return accountTransactions.value[accountAddress]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5) // 只显示最近5条记录
}

// 从WalletView获取wallet activity数据
const getWalletActivityData = () => {
  try {
    const walletActivity = JSON.parse(localStorage.getItem('walletActivity') || '[]')
    console.log('📊 PortfolioView: 获取到WalletView活动数据:', walletActivity.length, '条记录')
    return walletActivity
  } catch (error) {
    console.error('❌ PortfolioView: 获取wallet activity数据失败:', error)
    return []
  }
}

// 获取指定账户的持仓 - 基于WalletView的transaction activity数据
const getAccountHoldings = (accountAddress) => {
  if (!accountAddress) return []
  
  // 从WalletView获取wallet activity数据
  const walletActivity = getWalletActivityData()
  
  // 筛选出该账户的transaction activity（buy/sell类型）
  const transactionActivities = walletActivity.filter(activity => 
    activity.type === 'buy' || activity.type === 'sell'
  )
  
  console.log('📊 PortfolioView: 账户', accountAddress, '的交易活动:', transactionActivities.length, '条')
  
  const holdingMap = new Map()
  
  // 计算每个项目的持仓
  transactionActivities.forEach(tx => {
    const key = tx.project_code || tx.projectCode
    if (!holdingMap.has(key)) {
      holdingMap.set(key, { code: key, amount: 0, totalCost: 0, totalInvestment: 0 })
    }
    
    const holding = holdingMap.get(key)
    // 获取项目当前价格 - 从数据库获取的项目数据
    const project = projects.value.find(p => p.code === key)
    const currentPrice = project ? (project.currentPrice || 1.00) : 1.00
    
    if (tx.type === 'buy') {
      holding.amount += tx.amount
      holding.totalCost += tx.amount * currentPrice // 使用当前价格计算成本
      holding.totalInvestment += tx.amount * (tx.price || currentPrice) // 使用交易时的价格计算投资
    } else {
      holding.amount -= tx.amount
      holding.totalCost -= tx.amount * currentPrice // 使用当前价格计算成本
      holding.totalInvestment -= tx.amount * (tx.price || currentPrice) // 使用交易时的价格计算投资
    }
  })
  
  // 添加当前价格和变化
  return Array.from(holdingMap.values())
    .filter(h => h.amount > 0)
    .map(holding => {
      const project = projects.value.find(p => p.code === holding.code)
      const currentPrice = project ? (project.currentPrice || 1.00) : 1.00
      const currentValue = holding.amount * currentPrice
      const change = holding.totalInvestment > 0 ? ((currentValue - holding.totalInvestment) / holding.totalInvestment) * 100 : 0
      
      return {
        ...holding,
        currentPrice,
        change
      }
    })
}

// 获取指定账户的总投资 - 基于transaction activity的投资总额
const getAccountTotalInvestment = (accountAddress) => {
  const holdings = getAccountHoldings(accountAddress)
  const totalInvestment = holdings.reduce((sum, holding) => sum + (holding.totalInvestment || 0), 0)
  console.log('💰 PortfolioView: 账户', accountAddress, '总投资:', totalInvestment)
  return totalInvestment
}

// 获取指定账户的当前价值 - 基于transaction activity的当前价值
const getAccountCurrentValue = (accountAddress) => {
  const holdings = getAccountHoldings(accountAddress)
  const currentValue = holdings.reduce((sum, holding) => sum + (holding.amount * holding.currentPrice), 0)
  console.log('📈 PortfolioView: 账户', accountAddress, '当前价值:', currentValue)
  return currentValue
}

// 获取指定账户的总收益 - 基于transaction activity的收益计算
const getAccountTotalGain = (accountAddress) => {
  const currentValue = getAccountCurrentValue(accountAddress)
  const totalInvestment = getAccountTotalInvestment(accountAddress)
  const totalGain = currentValue - totalInvestment
  console.log('📊 PortfolioView: 账户', accountAddress, '总收益:', totalGain, '(当前价值:', currentValue, '- 总投资:', totalInvestment, ')')
  return totalGain
}

// 获取指定账户的ROI - 基于transaction activity的ROI计算
const getAccountROI = (accountAddress) => {
  const totalInvestment = getAccountTotalInvestment(accountAddress)
  const totalGain = getAccountTotalGain(accountAddress)
  const roi = totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0
  console.log('📈 PortfolioView: 账户', accountAddress, 'ROI:', roi.toFixed(2) + '%', '(总收益:', totalGain, '/ 总投资:', totalInvestment, ')')
  return roi
}

// 为了兼容性，保留原有的计算属性（基于当前选中账户或默认数据）
const holdings = computed(() => {
  if (selectedAccount.value) {
    return getAccountHoldings(selectedAccount.value)
  }
  // 如果没有选中账户，返回默认的演示数据
  return [
    { code: 'TYMU', amount: 100, totalCost: 100, currentPrice: 1.00, change: 2.5 },
    { code: 'SQNB', amount: 50, totalCost: 51, currentPrice: 1.02, change: -1.2 },
    { code: 'LZYT', amount: 25, totalCost: 24.5, currentPrice: 0.98, change: 0.8 },
    { code: 'YYD', amount: 75, totalCost: 78.75, currentPrice: 1.05, change: 3.1 }
  ]
})
const totalInvestment = computed(() => {
  if (selectedAccount.value) {
    return getAccountTotalInvestment(selectedAccount.value)
  }
  return 254.25 // 默认总投资
})
const currentValue = computed(() => {
  if (selectedAccount.value) {
    return getAccountCurrentValue(selectedAccount.value)
  }
  return 267.75 // 默认当前价值
})
const totalGain = computed(() => {
  if (selectedAccount.value) {
    return getAccountTotalGain(selectedAccount.value)
  }
  return 13.5 // 默认总收益
})
const roi = computed(() => {
  if (selectedAccount.value) {
    return getAccountROI(selectedAccount.value)
  }
  return 5.31 // 默认ROI
})

// 获取当前账户下购买的项目
const accountProjects = computed(() => {
  if (!selectedAccount.value) {
    // 如果没有选中账户，返回所有项目作为演示
    return projects.value
  }
  
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

// 交易图表相关计算属性
const allTransactions = computed(() => {
  // 获取所有账户的交易记录
  const allTxs = []
  Object.values(accountTransactions.value).forEach(accountTxs => {
    allTxs.push(...accountTxs)
  })
  
  // 如果没有交易数据，返回默认的演示数据
  if (allTxs.length === 0) {
    return [
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
      },
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
    ]
  }
  
  return allTxs
})

const maxTransactions = computed(() => {
  if (transactionChartData.value.length === 0) return 1
  // 基于累计价值计算最大值
  return Math.max(...transactionChartData.value.map(item => item.buyValue + item.sellValue))
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
  // 在Portfolio中不能添加新账户，只能显示在Wallet中绑定的账户
  alert('请在Wallet页面绑定新的钱包账户。Portfolio只显示已绑定的钱包。')
}

// 跳转到Wallet页面
const goToWallet = () => {
  router.push('/wallet')
}

// 刷新绑定钱包状态
const refreshBoundWallets = () => {
  console.log('🔄 Refreshing bound wallets...')
  loadBoundAccounts()
  
  if (accounts.value.length > 0) {
    console.log('✅ Found bound wallets:', accounts.value.length)
    // 如果有绑定的钱包，选择第一个
    if (accounts.value.length > 0) {
      selectedAccount.value = accounts.value[0].address
    }
    // 更新余额信息
    updateAccountBalances()
  } else {
    console.log('ℹ️ No bound wallets found')
  }
}

const formatAddress = (address) => {
  if (!address) return '—'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const getAccountBalance = (accountAddress) => {
  const account = accounts.value.find(acc => acc.address === accountAddress)
  if (!account) return '0.0000'
  
  // 如果当前账户是连接的钱包，使用useWallet的实时余额
  if (accountAddress === fullAddress.value && connected.value) {
    const balanceInEther = nativeBalanceDisplay.value
    return parseFloat(balanceInEther).toFixed(4)
  }
  
  // 对于其他账户，返回存储的余额
  return account.balance.toFixed(4)
}

const refreshPortfolio = async () => {
  // 从数据库重新加载项目数据
  await loadProjects()
  
  // 模拟价格更新（如果需要的话）
  // projects.value.forEach(project => {
  //   const change = (Math.random() - 0.5) * 0.1 // ±5% change
  //   project.currentPrice *= (1 + change)
  //   project.change = change * 100
  // })
}

// 刷新交易数据
const refreshTransactions = async () => {
  loadingTransactions.value = true
  try {
    console.log('🔄 PortfolioView: 刷新交易数据...')
    
    // 从WalletView重新获取交易数据
    const walletActivity = getWalletActivityData()
    const transactionActivities = walletActivity.filter(activity => 
      activity.type === 'buy' || activity.type === 'sell'
    )
    
    console.log('📊 PortfolioView: 获取到', transactionActivities.length, '条交易记录')
    
    // 触发响应式更新
    // Vue的响应式系统会自动更新filteredTransactions计算属性
    
  } catch (error) {
    console.error('❌ PortfolioView: 刷新交易数据失败:', error)
  } finally {
    loadingTransactions.value = false
  }
}

// 交易图表相关方法
const refreshTransactionData = async () => {
  loadingTransactions.value = true
  try {
    await generateTransactionChartData()
  } catch (error) {
    console.error('Failed to refresh transaction data:', error)
  } finally {
    loadingTransactions.value = false
  }
}

const generateTransactionChartData = async () => {
  // 从WalletView获取交易活动数据
  const walletActivity = getWalletActivityData()
  const transactionActivities = walletActivity.filter(activity => 
    activity.type === 'buy' || activity.type === 'sell'
  )
  
  console.log('📊 PortfolioView: 生成交易图表数据，共', transactionActivities.length, '条交易记录')
  
  // 获取时间范围
  const days = getDaysFromTimeframe(chartTimeframe.value)
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000))
  
  // 按日期分组交易数据
  const groupedData = new Map()
  
  // 初始化所有日期
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000))
    const dateKey = date.toISOString().split('T')[0]
    groupedData.set(dateKey, { 
      date: formatDateLabel(date), 
      buy: 0, 
      sell: 0,
      buyAmount: 0,  // 买入数量累计
      sellAmount: 0, // 卖出数量累计
      buyValue: 0,   // 买入价值累计
      sellValue: 0   // 卖出价值累计
    })
  }
  
  // 统计交易数据
  transactionActivities.forEach(tx => {
    const txDate = new Date(tx.timestamp)
    const dateKey = txDate.toISOString().split('T')[0]
    
    if (groupedData.has(dateKey)) {
      const dayData = groupedData.get(dateKey)
      const amount = parseFloat(tx.amount) || 0
      const price = parseFloat(tx.price) || 1.00
      const value = amount * price
      
      if (tx.type === 'buy') {
        dayData.buy++
        dayData.buyAmount += amount
        dayData.buyValue += value
      } else if (tx.type === 'sell') {
        dayData.sell++
        dayData.sellAmount += amount
        dayData.sellValue += value
      }
    }
  })
  
  // 转换为数组并排序
  transactionChartData.value = Array.from(groupedData.values()).sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })
  
  console.log('📊 PortfolioView: 交易图表数据生成完成，共', transactionChartData.value.length, '个数据点')
}

const getDaysFromTimeframe = (timeframe) => {
  switch (timeframe) {
    case '7d': return 7
    case '30d': return 30
    case '90d': return 90
    case '1y': return 365
    default: return 30
  }
}

const formatDateLabel = (date) => {
  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getBarHeight = (value, max) => {
  if (max === 0) return 0
  return Math.max((value / max) * 100, value > 0 ? 5 : 0) // 最小高度5%用于显示
}

// 计算总买入价值
const getTotalBuyValue = () => {
  return transactionChartData.value.reduce((sum, item) => sum + item.buyValue, 0)
}

// 计算总卖出价值
const getTotalSellValue = () => {
  return transactionChartData.value.reduce((sum, item) => sum + item.sellValue, 0)
}

// 计算净价值
const getNetValue = () => {
  return getTotalBuyValue() - getTotalSellValue()
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

const getPriceBarHeight = (change) => {
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


const goToTrade = (code) => {
  router.push({ name: 'tradeProject', params: { code } })
}

const goToDetail = (code) => {
  router.push({ name: 'detail', params: { code } })
}

// 生命周期
let priceUpdateInterval

onMounted(async () => {
  // 先加载项目数据
  await loadProjects()
  
  // 设置数据库同步
  setupDatabaseSync()
  
  // 加载绑定的钱包账户
  loadBoundAccounts()
  
  // 初始化选中账户
  if (accounts.value.length > 0) {
    selectedAccount.value = accounts.value[0].address
  }
  
  // 初始化交易图表数据
  refreshTransactionData()
  
  // 每30秒更新一次价格
  priceUpdateInterval = setInterval(refreshPortfolio, 30000)
  
  // 监听WalletView的wallet activity变化
  window.addEventListener('walletActivityUpdated', handleWalletActivityUpdate)
  
  // 测试数据关联 - 检查是否能正确读取WalletView的transaction activity
  const walletActivity = getWalletActivityData()
  const transactionActivities = walletActivity.filter(activity => 
    activity.type === 'buy' || activity.type === 'sell'
  )
  
  console.log('🚀 PortfolioView初始化: 检测到WalletView交易活动数据:', transactionActivities.length, '条')
  if (transactionActivities.length > 0) {
    console.log('📊 PortfolioView: 交易活动详情:', transactionActivities)
    console.log('💰 PortfolioView: 计算的总投资:', getAccountTotalInvestment(selectedAccount.value))
    console.log('📈 PortfolioView: 计算的当前价值:', getAccountCurrentValue(selectedAccount.value))
    console.log('📊 PortfolioView: 计算的总收益:', getAccountTotalGain(selectedAccount.value))
    console.log('📈 PortfolioView: 计算的ROI:', getAccountROI(selectedAccount.value))
  }
})

// 设置数据库同步
const setupDatabaseSync = () => {
  const { subscribeProducts, getLastRefreshTime } = useDatabaseSync()
  
  // 订阅产品数据更新
  unsubscribeProducts = subscribeProducts((products) => {
    console.log('📡 PortfolioView: 收到产品数据更新，共', products.length, '个项目')
    projects.value = products
  })
  
  // 设置最后刷新时间
  const lastRefresh = getLastRefreshTime()
  if (lastRefresh) {
    console.log('🕐 PortfolioView: 最后刷新时间:', lastRefresh)
  }
}

// 清理数据库同步
const cleanupDatabaseSync = () => {
  if (unsubscribeProducts) {
    unsubscribeProducts()
  }
}

// 处理WalletView的wallet activity更新
const handleWalletActivityUpdate = (event) => {
  console.log('🔄 PortfolioView: 检测到WalletView交易活动更新:', event.detail)
  
  // 强制重新计算所有相关数据
  // Vue的响应式系统会自动更新依赖这些数据的计算属性
  
  // 测试数据关联是否正确工作
  const walletActivity = getWalletActivityData()
  const transactionActivities = walletActivity.filter(activity => 
    activity.type === 'buy' || activity.type === 'sell'
  )
  
  console.log('📊 PortfolioView: 当前交易活动数据:', transactionActivities.length, '条')
  console.log('💰 PortfolioView: 计算的总投资:', getAccountTotalInvestment(selectedAccount.value))
  console.log('📈 PortfolioView: 计算的当前价值:', getAccountCurrentValue(selectedAccount.value))
  console.log('📊 PortfolioView: 计算的总收益:', getAccountTotalGain(selectedAccount.value))
  console.log('📈 PortfolioView: 计算的ROI:', getAccountROI(selectedAccount.value))
}

onUnmounted(() => {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval)
  }
  
  // 清理数据库同步
  cleanupDatabaseSync()
  
  // 移除事件监听器
  window.removeEventListener('walletActivityUpdated', handleWalletActivityUpdate)
})

// 监听时间范围变化，更新交易图表数据
watch(chartTimeframe, () => {
  refreshTransactionData()
})

// 监听useWallet状态变化，实时更新余额
watch([fullAddress, nativeBalanceDisplay, connected], () => {
  console.log('🔄 Wallet state changed, updating balances...')
  updateAccountBalances()
}, { deep: true })

// 监听localStorage中绑定账户的变化
window.addEventListener('storage', (e) => {
  if (e.key === 'walletBoundAccounts') {
    console.log('🔄 Detected wallet bound accounts change, reloading...')
    loadBoundAccounts()
    // 如果当前选中的账户被移除，选择第一个可用账户
    if (accounts.value.length > 0 && !accounts.value.find(acc => acc.address === selectedAccount.value)) {
      selectedAccount.value = accounts.value[0].address
    }
  }
})
</script>

<style scoped>
/* —— 这里保持你原来的样式 —— */
:root { --bg:#f6f7fb; --panel:#fff; --text:#0b1020; --muted:#6b7280; --muted-2:#9aa3b2; --border:#e6e8ef; --shadow:0 6px 20px rgba(15,23,42,.06); --primary:#3b82f6; --primary-ink:#1e40af; --danger:#ef4444; }

/* No Wallet Page Styles */
.pf-no-wallet-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--bg) 0%, #e0e7ff 100%);
}

.pf-no-wallet-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.pf-no-wallet-hero {
  margin-bottom: 40px;
}

.pf-no-wallet-icon {
  margin-bottom: 24px;
}

.pf-wallet-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: block;
}

.pf-no-wallet-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pf-no-wallet-description {
  font-size: 1.2rem;
  color: var(--muted);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.pf-no-wallet-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin: 40px 0;
}

.pf-feature-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pf-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(15,23,42,.15);
}

.pf-feature-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.pf-feature-card h3 {
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.pf-feature-card p {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.pf-no-wallet-actions {
  margin: 40px 0;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.pf-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.pf-btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.pf-btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.pf-btn-secondary {
  background: var(--panel);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.pf-btn-secondary:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(15,23,42,.1);
}

.pf-btn-icon {
  width: 20px;
  height: 20px;
}

.pf-no-wallet-help {
  margin-top: 40px;
  padding: 24px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.pf-no-wallet-help h4 {
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.pf-no-wallet-help ol {
  list-style: none;
  padding: 0;
  counter-reset: step-counter;
}

.pf-no-wallet-help li {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 12px;
  padding-left: 32px;
  position: relative;
  counter-increment: step-counter;
}

.pf-no-wallet-help li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.pf-no-wallet-help strong {
  color: var(--text);
  font-weight: 600;
}

/* Responsive styles */
@media (max-width: 768px) {
  .pf-no-wallet-page {
    padding: 16px;
  }
  
  .pf-no-wallet-title {
    font-size: 2rem;
  }
  
  .pf-no-wallet-description {
    font-size: 1.1rem;
  }
  
  .pf-no-wallet-features {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .pf-feature-card {
    padding: 20px;
  }
  
  .pf-no-wallet-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .pf-btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .pf-no-wallet-title {
    font-size: 1.8rem;
  }
  
  .pf-no-wallet-description {
    font-size: 1rem;
  }
  
  .pf-no-wallet-help {
    padding: 20px;
  }
}
.pf-page{background:var(--bg);min-height:100vh;color:var(--text);}
.pf-topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;position:sticky;top:0;z-index:10;background:var(--bg);}
.pf-actions{display:flex;gap:12px;flex-wrap:wrap;}
.pf-pill{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:14px;background:var(--panel);border:1px solid var(--border);box-shadow:var(--shadow);font-weight:600;cursor:pointer;color:#ffffff;}
.pf-pill-ico{width:22px;height:22px;display:grid;place-items:center;border-radius:999px;background:#f1f5ff;}
.pf-pill:hover{transform:translateY(-1px)}
.pf-add{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:14px;background:var(--panel);border:1px solid var(--border);box-shadow:var(--shadow);font-weight:600;cursor:pointer;color:#ffffff;}
.pf-add-ico{font-size:18px;line-height:1}
.pf-body{display:grid;grid-template-columns:280px 1fr;gap:16px;padding:0 20px 24px;margin-top: 30px;;}
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

/* 最近交易记录样式 - 与TradeProjectView保持一致 */
.pf-holdings{margin-top:16px;}
.no-trades{text-align:center;color:#9ca3af;font-size:14px;padding:20px 0;}
.pf-trade-item{padding:12px;border-radius:8px;background:#1f2937;border:1px solid #374151;margin-bottom:8px;}
.pf-trade-item:last-child{margin-bottom:0;}
.pf-trade-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.pf-trade-type{padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;}
.pf-trade-type.buy{background:#dcfce7;color:#16a34a;}
.pf-trade-type.sell{background:#fee2e2;color:#dc2626;}
.pf-trade-time{font-size:11px;color:#9ca3af;}
.pf-trade-info{display:flex;flex-direction:column;gap:4px;}
.pf-trade-project-section,.pf-trade-amount-section{display:flex;justify-content:space-between;align-items:center;}
.pf-label{font-size:12px;color:#9ca3af;font-weight:500;}
.pf-value{font-size:12px;color:#ffffff;font-weight:600;}

/* 交易历史样式 */
.pf-transactions-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.pf-transactions-header h3{margin:0;font-size:18px;font-weight:700;color:#ffffff;}
.pf-transactions-actions{display:flex;gap:8px;align-items:center;}
.pf-filter-btn{padding:6px 12px;border:1px solid #374151;border-radius:8px;background:#1f2937;color:#ffffff;cursor:pointer;font-size:14px;}
.pf-filter-btn:hover{background:#374151;}
.pf-refresh-btn{padding:6px 12px;border:1px solid #374151;border-radius:8px;background:#1f2937;color:#ffffff;cursor:pointer;font-size:14px;transition:all 0.2s ease;}
.pf-refresh-btn:hover:not(:disabled){background:#374151;}
.pf-refresh-btn:disabled{opacity:0.6;cursor:not-allowed;}

.pf-filters{display:flex;gap:12px;margin-bottom:16px;padding:12px;background:#1f2937;border-radius:10px;}
.pf-filter-select{padding:6px 10px;border:1px solid #374151;border-radius:6px;background:#141426;color:#ffffff;font-size:14px;}

.pf-transaction-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;background:#141426;border:1px solid #374151;margin-bottom:8px;}
.pf-transaction-icon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;}
.pf-transaction-icon.buy{background:#dcfce7;color:#16a34a;}
.pf-transaction-icon.sell{background:#fee2e2;color:#dc2626;}
.pf-transaction-details{flex:1;}
.pf-transaction-title{font-weight:600;color:#ffffff;margin-bottom:2px;}
.pf-transaction-subtitle{font-size:12px;color:#9ca3af;margin-bottom:4px;}
.pf-transaction-time{font-size:12px;color:#9ca3af;}
.pf-transaction-value{text-align:right;}
.pf-transaction-price{font-weight:600;color:#ffffff;}
.pf-transaction-total{font-size:12px;color:#9ca3af;margin-top:2px;}

/* 空状态样式 */
.pf-no-transactions{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center;}
.pf-empty-icon{font-size:48px;margin-bottom:16px;opacity:0.5;}
.pf-no-transactions p{margin:8px 0;color:#9ca3af;}
.pf-empty-hint{font-size:14px;color:#6b7280;}

/* 资产总结图表样式 */
.pf-asset-summary{margin-bottom:24px;padding:20px;border-radius:16px;background:#141426;border:1px solid var(--border);max-width: 820px;}
.pf-summary-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.pf-summary-header h3{margin:0;font-size:20px;font-weight:700;color:#ffffff;}
.pf-summary-stats{display:flex;gap:24px;}
.pf-summary-stat{text-align:center;}
.pf-stat-number{display:block;font-size:18px;font-weight:700;color:#ffffff;margin-bottom:4px;}
.pf-stat-number.positive{color:#16a34a;}
.pf-stat-number.negative{color:#dc2626;}
.pf-stat-label{font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;}

/* 交易图表样式 */
.pf-transaction-chart{
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 16px;
  background: #141426;
  border: 1px solid var(--border);
}

/* 图表摘要样式 */
.pf-chart-summary{
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 16px;
  background: #1f2937;
  border-radius: 12px;
  border: 1px solid #374151;
}

.pf-summary-item{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.pf-summary-label{
  font-size: 12px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pf-summary-value{
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.pf-summary-value.pf-buy-color{
  color: #10b981;
}

.pf-summary-value.pf-sell-color{
  color: #ef4444;
}

.pf-summary-value.pf-positive{
  color: #10b981;
}

.pf-summary-value.pf-negative{
  color: #ef4444;
}

.pf-chart-controls{
  display: flex;
  align-items: center;
  gap: 12px;
}

.pf-select{
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #374151;
  background: #1f2937;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.pf-refresh-btn{
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #374151;
  background: #1f2937;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
}

.pf-refresh-btn:hover{
  background: #374151;
  color: #ffffff;
}

.pf-bar-chart-container{
  margin-top: 16px;
}

.pf-chart-loading{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #9ca3af;
}

.pf-spinner{
  width: 20px;
  height: 20px;
  border: 2px solid #374151;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pf-chart-empty{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #9ca3af;
}

.pf-empty-icon{
  font-size: 32px;
  opacity: 0.5;
}

.pf-bar-chart{
  position: relative;
}

.pf-chart-bars{
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 200px;
  padding: 0 16px;
  border-bottom: 1px solid #374151;
  border-left: 1px solid #374151;
  min-width: 100%;
  overflow-x: auto;
}

.pf-bar-item{
  flex: 0 0 auto;
  min-width: 32px;
  max-width: 120px;
  width: calc(100% / var(--bar-count, 7));
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: width 0.3s ease;
}

/* 根据数据点数量调整柱状图宽度 */
.pf-chart-bars[style*="--bar-count: 7"] .pf-bar-item {
  width: calc(100% / 7);
  min-width: 40px;
}

.pf-chart-bars[style*="--bar-count: 30"] .pf-bar-item {
  width: calc(100% / 30);
  min-width: 20px;
}

.pf-chart-bars[style*="--bar-count: 90"] .pf-bar-item {
  width: calc(100% / 90);
  min-width: 12px;
}

.pf-chart-bars[style*="--bar-count: 365"] .pf-bar-item {
  width: calc(100% / 365);
  min-width: 8px;
}

.pf-bar-container{
  position: relative;
  width: 100%;
  height: 160px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.pf-bar-buy{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  background: #10b981;
  border-radius: 4px 4px 0 0;
  transition: all 0.2s ease;
  min-height: 2px;
}

.pf-bar-sell{
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  background: #ef4444;
  border-radius: 4px 4px 0 0;
  transition: all 0.2s ease;
  min-height: 2px;
}

.pf-bar-item:hover .pf-bar-buy{
  background: #059669;
}

.pf-bar-item:hover .pf-bar-sell{
  background: #dc2626;
}

.pf-bar-label{
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}

.pf-bar-tooltip{
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: #ffffff;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
}

.pf-bar-item:hover .pf-bar-tooltip{
  opacity: 1;
}

.pf-tooltip-buy{
  color: #10b981;
  margin-bottom: 2px;
}

.pf-tooltip-sell{
  color: #ef4444;
  margin-bottom: 2px;
}

.pf-tooltip-total{
  color: #ffffff;
  font-weight: 600;
  border-top: 1px solid #374151;
  padding-top: 4px;
  margin-top: 4px;
}

.pf-chart-legend{
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.pf-legend-item{
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ffffff;
}

.pf-legend-color{
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.pf-buy-color{
  background: #10b981;
}

.pf-sell-color{
  background: #ef4444;
}

/* 响应式设计 - 移动设备 */
@media (max-width: 768px) {
  .pf-chart-bars {
    gap: 4px;
    padding: 0 8px;
  }
  
  .pf-bar-item {
    min-width: 24px;
    max-width: 60px;
  }
  
  .pf-chart-bars[style*="--bar-count: 7"] .pf-bar-item {
    min-width: 32px;
  }
  
  .pf-chart-bars[style*="--bar-count: 30"] .pf-bar-item {
    min-width: 16px;
  }
  
  .pf-chart-bars[style*="--bar-count: 90"] .pf-bar-item {
    min-width: 10px;
  }
  
  .pf-chart-bars[style*="--bar-count: 365"] .pf-bar-item {
    min-width: 6px;
  }
  
  .pf-bar-label {
    font-size: 10px;
  }
}

/* 小屏幕设备 */
@media (max-width: 480px) {
  .pf-chart-bars {
    gap: 2px;
    padding: 0 4px;
  }
  
  .pf-bar-item {
    min-width: 20px;
    max-width: 40px;
  }
  
  .pf-chart-bars[style*="--bar-count: 7"] .pf-bar-item {
    min-width: 28px;
  }
  
  .pf-chart-bars[style*="--bar-count: 30"] .pf-bar-item {
    min-width: 12px;
  }
  
  .pf-chart-bars[style*="--bar-count: 90"] .pf-bar-item {
    min-width: 8px;
  }
  
  .pf-chart-bars[style*="--bar-count: 365"] .pf-bar-item {
    min-width: 4px;
  }
}

/* 图表行布局 */
.pf-charts-row{display:flex;gap:24px;align-items:flex-start;justify-content:center;}
.pf-price-chart{flex:1;min-width:0;}
.pf-pie-chart-section{flex:0 0 400px;min-width:400px;max-width:500px;}

/* 侧栏饼图样式 */
.pf-sidebar-pie-section{margin-bottom:24px;padding:16px;border-radius:12px;background:#141426;border:1px solid #292e36;}
.pf-sidebar-pie-section .pf-chart-header{margin-bottom:16px;}
.pf-sidebar-pie-section .pf-chart-header h4{margin:0;font-size:16px;font-weight:700;color:#ffffff;}
.pf-sidebar-pie-section .pf-pie-chart-container{display:flex;flex-direction:column;align-items:center;gap:16px;}
.pf-sidebar-pie-section .pf-pie-chart{position:relative;width:160px;height:160px;}
.pf-sidebar-pie-section .pf-pie-svg{width:100%;height:100%;}
.pf-sidebar-pie-section .pf-chart-legend{width:100%;}
.pf-sidebar-pie-section .pf-legend-item{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.pf-sidebar-pie-section .pf-legend-item:last-child{margin-bottom:0;}
.pf-sidebar-pie-section .pf-legend-color{width:12px;height:12px;border-radius:2px;}
.pf-sidebar-pie-section .pf-legend-info{flex:1;}
.pf-sidebar-pie-section .pf-legend-code{font-weight:600;color:#ffffff;font-size:12px;margin-bottom:2px;}
.pf-sidebar-pie-section .pf-legend-value{font-size:11px;color:#ffffff;margin-bottom:1px;}
.pf-sidebar-pie-section .pf-legend-percentage{font-size:10px;color:#9ca3af;}

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
