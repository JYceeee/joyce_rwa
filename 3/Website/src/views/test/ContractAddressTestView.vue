<template>
  <div class="container">
    <div class="test-page">
      <h1>智能合约地址验证测试</h1>
      <p>测试智能合约服务获取和验证用户钱包地址的功能</p>
      
      <!-- 钱包连接状态 -->
      <div class="test-section">
        <h2>钱包连接状态</h2>
        <div class="status-grid">
          <div class="status-item">
            <label>useWallet连接状态:</label>
            <span :class="walletConnected ? 'success' : 'error'">
              {{ walletConnected ? '已连接' : '未连接' }}
            </span>
          </div>
          <div class="status-item">
            <label>useWallet地址:</label>
            <span class="address">{{ walletAddress || '无' }}</span>
          </div>
          <div class="status-item">
            <label>ContractService状态:</label>
            <span :class="contractServiceReady ? 'success' : 'error'">
              {{ contractServiceReady ? '已初始化' : '未初始化' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 地址获取测试 -->
      <div class="test-section">
        <h2>地址获取测试</h2>
        <div class="test-buttons">
          <button @click="testGetUserAddress" :disabled="loading" class="test-btn">
            {{ loading ? '测试中...' : '测试获取用户地址' }}
          </button>
          <button @click="testValidateAddress" :disabled="loading" class="test-btn">
            测试地址验证
          </button>
          <button @click="testMultipleMethods" :disabled="loading" class="test-btn">
            测试多种获取方式
          </button>
          <button @click="testTradingMethods" :disabled="loading" class="test-btn">
            测试交易方法地址获取
          </button>
          <button @click="clearResults" class="test-btn secondary">
            清除结果
          </button>
        </div>
      </div>

      <!-- 测试结果 -->
      <div class="test-section">
        <h2>测试结果</h2>
        <div class="results-container">
          <div v-if="results.length === 0" class="no-results">
            暂无测试结果，点击上方按钮开始测试
          </div>
          <div v-for="(result, index) in results" :key="index" class="result-item">
            <div class="result-header">
              <span class="result-icon">{{ getResultIcon(result.type) }}</span>
              <span class="result-title">{{ result.title }}</span>
              <span class="result-time">{{ formatTime(result.timestamp) }}</span>
            </div>
            <div class="result-content">
              <div class="result-message">{{ result.message }}</div>
              <div v-if="result.data" class="result-data">
                <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 实时地址监控 -->
      <div class="test-section">
        <h2>实时地址监控</h2>
        <div class="monitor-grid">
          <div class="monitor-item">
            <label>ContractService地址:</label>
            <span class="address">{{ currentContractAddress || '无' }}</span>
          </div>
          <div class="monitor-item">
            <label>useWallet地址:</label>
            <span class="address">{{ currentWalletAddress || '无' }}</span>
          </div>
          <div class="monitor-item">
            <label>地址一致性:</label>
            <span :class="addressesMatch ? 'success' : 'warning'">
              {{ addressesMatch ? '一致' : '不一致' }}
            </span>
          </div>
        </div>
        <button @click="refreshMonitoring" class="test-btn small">
          刷新监控
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { contractService } from '@/service/contractService.js'
import { useWallet } from '@/composables/useWallet.js'

export default {
  name: 'ContractAddressTestView',
  setup() {
    const { connected, fullAddress } = useWallet()
    return { connected, fullAddress }
  },
  data() {
    return {
      loading: false,
      results: [],
      contractServiceReady: false,
      currentContractAddress: null,
      currentWalletAddress: null,
      monitoringInterval: null
    }
  },
  computed: {
    walletConnected() {
      return this.connected.value && this.fullAddress.value
    },
    walletAddress() {
      return this.fullAddress.value
    },
    addressesMatch() {
      return this.currentContractAddress && this.currentWalletAddress && 
             this.currentContractAddress.toLowerCase() === this.currentWalletAddress.toLowerCase()
    }
  },
  async mounted() {
    await this.initializeContractService()
    this.startMonitoring()
  },
  beforeUnmount() {
    this.stopMonitoring()
  },
  methods: {
    async initializeContractService() {
      try {
        await contractService.initialize()
        this.contractServiceReady = true
        this.addResult('success', 'ContractService初始化成功', '智能合约服务已成功初始化')
      } catch (error) {
        this.addResult('error', 'ContractService初始化失败', error.message)
      }
    },

    async testGetUserAddress() {
      this.loading = true
      try {
        this.addResult('info', '开始测试获取用户地址', '正在调用contractService.getUserAddress()')
        
        const address = await contractService.getUserAddress()
        
        if (address) {
          this.addResult('success', '地址获取成功', `获取到地址: ${address}`, {
            address: address,
            shortAddress: this.formatAddress(address),
            method: 'contractService.getUserAddress()'
          })
          this.currentContractAddress = address
        } else {
          this.addResult('error', '地址获取失败', 'contractService.getUserAddress()返回null')
        }
      } catch (error) {
        this.addResult('error', '地址获取异常', error.message)
      } finally {
        this.loading = false
      }
    },

    async testValidateAddress() {
      this.loading = true
      try {
        this.addResult('info', '开始测试地址验证', '正在调用contractService.validateUserAddress()')
        
        const validationResult = await contractService.validateUserAddress()
        
        this.addResult(validationResult.success ? 'success' : 'error', 
                      validationResult.success ? '地址验证成功' : '地址验证失败',
                      validationResult.success ? `验证通过: ${validationResult.address}` : validationResult.error,
                      validationResult)
        
        if (validationResult.success) {
          this.currentContractAddress = validationResult.address
        }
      } catch (error) {
        this.addResult('error', '地址验证异常', error.message)
      } finally {
        this.loading = false
      }
    },

    async testMultipleMethods() {
      this.loading = true
      try {
        this.addResult('info', '开始多方法测试', '测试不同的地址获取方式')
        
        // 方法1: contractService.getUserAddress()
        const method1Result = await contractService.getUserAddress()
        this.addResult(method1Result ? 'success' : 'error', 
                      '方法1: contractService.getUserAddress()',
                      method1Result ? `成功: ${method1Result}` : '失败',
                      { address: method1Result })
        
        // 方法2: contractService.validateUserAddress()
        const method2Result = await contractService.validateUserAddress()
        this.addResult(method2Result.success ? 'success' : 'error',
                      '方法2: contractService.validateUserAddress()',
                      method2Result.success ? `成功: ${method2Result.address}` : `失败: ${method2Result.error}`,
                      method2Result)
        
        // 方法3: useWallet
        const method3Result = this.walletAddress
        this.addResult(method3Result ? 'success' : 'error',
                      '方法3: useWallet.fullAddress',
                      method3Result ? `成功: ${method3Result}` : '失败',
                      { address: method3Result, connected: this.walletConnected })
        
        // 方法4: 直接ethereum调用
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          const method4Result = accounts && accounts.length > 0 ? accounts[0] : null
          this.addResult(method4Result ? 'success' : 'error',
                        '方法4: window.ethereum.eth_accounts',
                        method4Result ? `成功: ${method4Result}` : '失败',
                        { address: method4Result, accounts: accounts })
        } catch (ethereumError) {
          this.addResult('error', '方法4: window.ethereum.eth_accounts', ethereumError.message)
        }
        
      } catch (error) {
        this.addResult('error', '多方法测试异常', error.message)
      } finally {
        this.loading = false
      }
    },

    async testTradingMethods() {
      this.loading = true
      try {
        this.addResult('info', '开始交易方法测试', '测试智能合约交易方法中的地址获取')
        
        // 测试buyTokens方法
        this.addResult('info', '测试buyTokens方法', '测试购买代币方法中的地址获取')
        try {
          const buyResult = await contractService.buyTokens(1)
          this.addResult(buyResult.success ? 'success' : 'error',
                        'buyTokens方法测试',
                        buyResult.success ? `成功获取地址: ${buyResult.userAddress}` : `失败: ${buyResult.error}`,
                        buyResult)
        } catch (buyError) {
          this.addResult('error', 'buyTokens方法异常', buyError.message)
        }
        
        // 测试sellTokens方法
        this.addResult('info', '测试sellTokens方法', '测试出售代币方法中的地址获取')
        try {
          const sellResult = await contractService.sellTokens(1)
          this.addResult(sellResult.success ? 'success' : 'error',
                        'sellTokens方法测试',
                        sellResult.success ? `成功获取地址: ${sellResult.userAddress}` : `失败: ${sellResult.error}`,
                        sellResult)
        } catch (sellError) {
          this.addResult('error', 'sellTokens方法异常', sellError.message)
        }
        
        // 测试getUserTokenBalance方法
        this.addResult('info', '测试getUserTokenBalance方法', '测试获取用户代币余额方法中的地址获取')
        try {
          const balanceResult = await contractService.getUserTokenBalance()
          this.addResult('success', 'getUserTokenBalance方法测试', `成功获取余额: ${balanceResult}`, {
            balance: balanceResult,
            method: 'getUserTokenBalance'
          })
        } catch (balanceError) {
          this.addResult('error', 'getUserTokenBalance方法异常', balanceError.message)
        }
        
      } catch (error) {
        this.addResult('error', '交易方法测试异常', error.message)
      } finally {
        this.loading = false
      }
    },

    refreshMonitoring() {
      this.currentWalletAddress = this.walletAddress
      this.addResult('info', '监控数据刷新', '实时监控数据已更新')
    },

    startMonitoring() {
      this.monitoringInterval = setInterval(() => {
        this.currentWalletAddress = this.walletAddress
      }, 2000)
    },

    stopMonitoring() {
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval)
        this.monitoringInterval = null
      }
    },

    addResult(type, title, message, data = null) {
      this.results.unshift({
        type,
        title,
        message,
        data,
        timestamp: Date.now()
      })
      
      // 限制结果数量
      if (this.results.length > 20) {
        this.results = this.results.slice(0, 20)
      }
    },

    clearResults() {
      this.results = []
    },

    getResultIcon(type) {
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      }
      return icons[type] || '📝'
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString()
    },

    formatAddress(address) {
      if (!address) return ''
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
  }
}
</script>

<style scoped>
.test-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.test-section h2 {
  color: #ffffff;
  margin-bottom: 16px;
  font-size: 18px;
}

.status-grid, .monitor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.status-item, .monitor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #2a2a4a;
  border-radius: 8px;
}

.status-item label, .monitor-item label {
  color: #94a3b8;
  font-size: 14px;
}

.status-item span, .monitor-item span {
  font-weight: 500;
}

.success {
  color: #10b981;
}

.error {
  color: #ef4444;
}

.warning {
  color: #f59e0b;
}

.address {
  color: #60a5fa;
  font-family: monospace;
  font-size: 12px;
}

.test-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.test-btn {
  padding: 12px 20px;
  background: #f59e0b;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.test-btn:hover:not(:disabled) {
  background: #d97706;
}

.test-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.test-btn.secondary {
  background: #6b7280;
}

.test-btn.secondary:hover:not(:disabled) {
  background: #4b5563;
}

.test-btn.small {
  padding: 8px 16px;
  font-size: 14px;
}

.results-container {
  max-height: 500px;
  overflow-y: auto;
}

.result-item {
  background: #2a2a4a;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #374151;
  border-bottom: 1px solid #4b5563;
}

.result-icon {
  font-size: 16px;
}

.result-title {
  color: #ffffff;
  font-weight: 500;
  flex: 1;
}

.result-time {
  color: #94a3b8;
  font-size: 12px;
}

.result-content {
  padding: 16px;
}

.result-message {
  color: #e5e7eb;
  margin-bottom: 12px;
}

.result-data {
  background: #1f2937;
  border-radius: 6px;
  padding: 12px;
}

.result-data pre {
  color: #d1d5db;
  font-size: 12px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.no-results {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
  font-style: italic;
}

@media (max-width: 768px) {
  .test-buttons {
    flex-direction: column;
  }
  
  .status-grid, .monitor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
