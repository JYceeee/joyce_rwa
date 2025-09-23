<template>
  <div class="container pf-page">
    <!-- 没有绑定钱包时的提示页 -->
    <!-- <div v-if="!hasBoundWallets" class="pf-no-wallet-page">
      <div class="pf-no-wallet-container">
        <div class="pf-no-wallet-hero">
          <div class="pf-no-wallet-icon">
            <svg viewBox="0 0 24 24" class="pf-wallet-icon">
              <path fill="#F6851B" d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-2V5H5v14h14v-1h2z"/>
              <path fill="#F6851B" d="M15 9l-3 3 3 3 3-3-3-3zm-6 0L6 12l3 3 3-3-3-3z"/>
            </svg>
          </div>
          <h1 class="pf-no-wallet-title">No Wallets Connected</h1>
          <p class="pf-no-wallet-description">
            You need to connect and bind your wallet to view your portfolio and manage your assets.
          </p>
        </div>

        <div class="pf-no-wallet-features">
          <div class="pf-feature-card">
            <div class="pf-feature-icon">💼</div>
            <h3>Portfolio Overview</h3>
            <p>Track all your assets across multiple wallets in one unified view</p>
          </div>
          <div class="pf-feature-card">
            <div class="pf-feature-icon">📊</div>
            <h3>Transaction History</h3>
            <p>View detailed transaction records and trading history</p>
          </div>
          <div class="pf-feature-card">
            <div class="pf-feature-icon">📈</div>
            <h3>Performance Analytics</h3>
            <p>Analyze your investment performance with comprehensive charts</p>
          </div>
        </div>

        <div class="pf-no-wallet-actions">
          <button class="pf-btn pf-btn-primary" @click="goToWallet">
            <svg viewBox="0 0 24 24" class="pf-btn-icon">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Go to Wallet Page
          </button>
          <button class="pf-btn pf-btn-secondary" @click="refreshBoundWallets">
            <svg viewBox="0 0 24 24" class="pf-btn-icon">
              <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Refresh Wallet Status
          </button>
        </div>

        <div class="pf-no-wallet-help">
          <h4>How to Connect Your Wallet:</h4>
          <ol>
            <li>Go to the <strong>Wallet</strong> page using the navigation menu</li>
            <li>Click <strong>"Connect MetaMask"</strong> to connect your wallet</li>
            <li>Approve the connection in your MetaMask extension</li>
            <li>Your wallet will be automatically added to your portfolio</li>
          </ol>
        </div>
      </div>
    </div> -->

    <!-- 有绑定钱包时显示Portfolio页面 -->
    <div class="pf-main-content">
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
                        <div class="pf-bar-buy" :style="{ height: getBarHeight(item.buy, maxTransactions) + '%' }"></div>
                        <div class="pf-bar-sell" :style="{ height: getBarHeight(item.sell, maxTransactions) + '%' }"></div>
                      </div>
                      <div class="pf-bar-label">{{ item.date }}</div>
                      <div class="pf-bar-tooltip">
                        <div class="pf-tooltip-buy">Buy: {{ item.buy }}</div>
                        <div class="pf-tooltip-sell">Sell: {{ item.sell }}</div>
                        <div class="pf-tooltip-total">Total: {{ item.buy + item.sell }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="pf-chart-legend">
                    <div class="pf-legend-item">
                      <div class="pf-legend-color pf-buy-color"></div>
                      <span>Buy Transactions</span>
                    </div>
                    <div class="pf-legend-item">
                      <div class="pf-legend-color pf-sell-color"></div>
                      <span>Sell Transactions</span>
                    </div>
                  </div>
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
    </div> <!-- 结束 pf-main-content -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useWallet } from '/src/composables/useWallet'
import { useRouter } from 'vue-router'

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

// 账户数据 - 从localStorage加载绑定的钱包账户
const accounts = ref([])

// 从localStorage加载绑定的钱包账户
function loadBoundAccounts() {
  try {
    const savedAccounts = localStorage.getItem('walletBoundAccounts')
    if (savedAccounts) {
      const boundAddresses = JSON.parse(savedAccounts)
      accounts.value = boundAddresses.map((address, index) => ({
        address: address,
        name: `Wallet ${index + 1}`,
        balance: 0 // 初始余额，后续会更新
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
  let filtered = []
  
  if (selectedAccount.value) {
    filtered = accountTransactions.value[selectedAccount.value] || []
  } else {
    // 如果没有选中账户，返回默认的演示交易数据
    filtered = [
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
  return Math.max(...transactionChartData.value.map(item => item.buy + item.sell))
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
    groupedData.set(dateKey, { date: formatDateLabel(date), buy: 0, sell: 0 })
  }
  
  // 统计交易数据
  allTransactions.value.forEach(tx => {
    const txDate = new Date(tx.timestamp)
    const dateKey = txDate.toISOString().split('T')[0]
    
    if (groupedData.has(dateKey)) {
      const dayData = groupedData.get(dateKey)
      if (tx.type === 'buy') {
        dayData.buy++
      } else if (tx.type === 'sell') {
        dayData.sell++
      }
    }
  })
  
  // 转换为数组并排序
  transactionChartData.value = Array.from(groupedData.values()).sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })
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
})

onUnmounted(() => {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval)
  }
})

// 监听时间范围变化，更新交易图表数据
watch(chartTimeframe, () => {
  refreshTransactionData()
})

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
