<template>
  <div class="contract-test">
    <h1>智能合约连接测试</h1>
    
    <!-- 连接状态 -->
    <div class="test-section">
      <h2>🔗 连接状态</h2>
      <div class="status-grid">
        <div class="status-item" :class="{ success: walletConnected, error: !walletConnected }">
          <span class="status-label">钱包连接:</span>
          <span class="status-value">{{ walletConnected ? '已连接' : '未连接' }}</span>
        </div>
        <div class="status-item" :class="{ success: networkCorrect, error: !networkCorrect }">
          <span class="status-label">网络状态:</span>
          <span class="status-value">{{ networkInfo.name || '未知' }} ({{ networkInfo.chainId || 'N/A' }})</span>
        </div>
        <div class="status-item" :class="{ success: userAddress, error: !userAddress }">
          <span class="status-label">用户地址:</span>
          <span class="status-value">{{ userAddress ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : '未获取' }}</span>
        </div>
      </div>
    </div>

    <!-- 合约配置 -->
    <div class="test-section">
      <h2>⚙️ 合约配置</h2>
      <div class="config-grid">
        <div class="config-item">
          <label>KYC注册表:</label>
          <input v-model="config.KYC_REGISTRY_ADDRESS" placeholder="0x..." />
        </div>
        <div class="config-item">
          <label>Loan发行者:</label>
          <input v-model="config.LOAN_ISSUER_ADDRESS" placeholder="0x..." />
        </div>
        <div class="config-item">
          <label>本金代币:</label>
          <input v-model="config.PRINCIPAL_TOKEN_ADDRESS" placeholder="0x..." />
        </div>
        <div class="config-item">
          <label>利息代币:</label>
          <input v-model="config.INTEREST_TOKEN_ADDRESS" placeholder="0x..." />
        </div>
        <div class="config-item">
          <label>交易合约:</label>
          <input v-model="config.TRADE_CONTRACT_ADDRESS" placeholder="0x..." />
        </div>
        <div class="config-item">
          <label>目标网络ID:</label>
          <select v-model="config.NETWORK.chainId">
            <option value="1">Ethereum Mainnet (1)</option>
            <option value="5">Goerli Testnet (5)</option>
            <option value="11155111">Sepolia Testnet (11155111)</option>
            <option value="137">Polygon Mainnet (137)</option>
            <option value="80001">Polygon Mumbai (80001)</option>
          </select>
        </div>
      </div>
      <button @click="updateConfig" class="btn primary">更新配置</button>
    </div>

    <!-- 基础测试 -->
    <div class="test-section">
      <h2>🧪 基础连接测试</h2>
      <div class="test-buttons">
        <button @click="testWalletConnection" :disabled="loading" class="btn primary">
          {{ loading ? '测试中...' : '测试钱包连接' }}
        </button>
        <button @click="testNetworkConnection" :disabled="loading" class="btn secondary">
          测试网络连接
        </button>
        <button @click="testContractInitialization" :disabled="loading" class="btn secondary">
          测试合约初始化
        </button>
      </div>
    </div>

    <!-- 合约功能测试 -->
    <div class="test-section">
      <h2>📋 合约功能测试</h2>
      <div class="function-tests">
        <div class="test-group">
          <h3>只读函数测试</h3>
          <div class="test-buttons">
            <button @click="testGetTokenPrice" :disabled="loading" class="btn secondary">
              获取代币价格
            </button>
            <button @click="testGetUserBalance" :disabled="loading" class="btn secondary">
              获取用户余额
            </button>
            <button @click="testGetTradeHistory" :disabled="loading" class="btn secondary">
              获取交易历史
            </button>
            <button @click="testGetKycLevel" :disabled="loading" class="btn secondary">
              检查KYC等级
            </button>
          </div>
        </div>
        
        <div class="test-group">
          <h3>写入函数测试 (需要Gas费)</h3>
          <div class="test-inputs">
            <input v-model="testAmount" type="number" placeholder="测试数量" min="1" />
            <select v-model="testTradeType">
              <option value="buy">购买</option>
              <option value="sell">出售</option>
            </select>
          </div>
          <div class="test-buttons">
            <button @click="testExecuteTrade" :disabled="loading || !testAmount" class="btn warning">
              执行测试交易
            </button>
            <button @click="testKycApplication" :disabled="loading" class="btn secondary">
              测试KYC申请
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 网络切换 -->
    <div class="test-section">
      <h2>🌐 网络管理</h2>
      <div class="network-management">
        <button @click="switchToMainnet" :disabled="loading" class="btn primary">
          切换到主网
        </button>
        <button @click="switchToSepolia" :disabled="loading" class="btn secondary">
          切换到Sepolia测试网
        </button>
        <button @click="addCustomNetwork" :disabled="loading" class="btn secondary">
          添加自定义网络
        </button>
      </div>
    </div>

    <!-- 测试结果 -->
    <div class="test-section">
      <h2>📊 测试结果</h2>
      <div class="results">
        <div v-if="results.length === 0" class="no-results">暂无测试结果</div>
        <div v-for="(result, index) in results" :key="index" class="result-item" :class="result.type">
          <div class="result-header">
            <span class="result-title">{{ result.title }}</span>
            <span class="result-time">{{ formatTime(result.timestamp) }}</span>
          </div>
          <div class="result-content">
            <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
      <button @click="clearResults" class="btn secondary">清除结果</button>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-section">
      <h2>❌ 错误信息</h2>
      <div class="error-content">{{ error }}</div>
      <button @click="error = ''" class="btn secondary">清除错误</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { contractService } from '@/service/contractService.js'
import CONTRACT_CONFIG from '@/config/contractConfig.js'

// 响应式数据
const loading = ref(false)
const error = ref('')
const results = ref([])

// 连接状态
const walletConnected = ref(false)
const networkCorrect = ref(false)
const networkInfo = reactive({ name: '', chainId: null })
const userAddress = ref('')

// 配置
const config = reactive({
  KYC_REGISTRY_ADDRESS: CONTRACT_CONFIG.KYC_REGISTRY_ADDRESS,
  LOAN_ISSUER_ADDRESS: CONTRACT_CONFIG.LOAN_ISSUER_ADDRESS,
  PRINCIPAL_TOKEN_ADDRESS: CONTRACT_CONFIG.PRINCIPAL_TOKEN_ADDRESS,
  INTEREST_TOKEN_ADDRESS: CONTRACT_CONFIG.INTEREST_TOKEN_ADDRESS,
  TRADE_CONTRACT_ADDRESS: CONTRACT_CONFIG.TRADE_CONTRACT_ADDRESS,
  NETWORK: { ...CONTRACT_CONFIG.NETWORK }
})

// 测试参数
const testAmount = ref(1)
const testTradeType = ref('buy')

// 添加测试结果
const addResult = (title, data, type = 'info') => {
  results.value.unshift({
    title,
    data,
    type,
    timestamp: Date.now()
  })
  if (results.value.length > 20) {
    results.value = results.value.slice(0, 20)
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

// 测试钱包连接
const testWalletConnection = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask未安装')
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    walletConnected.value = accounts.length > 0
    userAddress.value = accounts[0] || ''
    
    if (accounts.length > 0) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      addResult('钱包连接测试', {
        connected: true,
        address: accounts[0],
        accountCount: accounts.length
      }, 'success')
    } else {
      throw new Error('未连接钱包账户')
    }
  } catch (err) {
    error.value = err.message
    addResult('钱包连接测试', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 测试网络连接
const testNetworkConnection = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    const expectedChainId = '0x' + config.NETWORK.chainId.toString(16)
    
    networkInfo.chainId = parseInt(chainId, 16)
    networkCorrect.value = chainId === expectedChainId
    
    // 获取网络名称
    const networkNames = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai'
    }
    networkInfo.name = networkNames[chainId] || `Chain ${networkInfo.chainId}`
    
    addResult('网络连接测试', {
      currentChainId: networkInfo.chainId,
      expectedChainId: config.NETWORK.chainId,
      networkName: networkInfo.name,
      isCorrect: networkCorrect.value
    }, networkCorrect.value ? 'success' : 'warning')
  } catch (err) {
    error.value = err.message
    addResult('网络连接测试', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 测试合约初始化
const testContractInitialization = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await contractService.initialize()
    addResult('合约初始化测试', {
      success: result,
      config: config
    }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('合约初始化测试', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 测试获取代币价格
const testGetTokenPrice = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const price = await contractService.getTokenPrice()
    addResult('获取代币价格', { price }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('获取代币价格', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 测试获取用户余额
const testGetUserBalance = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const balance = await contractService.getUserTokenBalance()
    addResult('获取用户余额', { balance }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('获取用户余额', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 测试获取交易历史
const testGetTradeHistory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const history = await contractService.getTradeHistory(5)
    addResult('获取交易历史', { history, count: history.length }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('获取交易历史', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 测试获取KYC等级
const testGetKycLevel = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const kycLevel = await contractService.getKycLevel()
    const isBlocked = await contractService.isBlocked()
    const canTrade = await contractService.canTrade()
    
    addResult('KYC检查', {
      kycLevel: Number(kycLevel),
      isBlocked,
      canTrade
    }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('KYC检查', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 测试执行交易
const testExecuteTrade = async () => {
  loading.value = true
  error.value = ''
  
  try {
    let result
    if (testTradeType.value === 'buy') {
      result = await contractService.buyTokens(testAmount.value)
    } else {
      result = await contractService.sellTokens(testAmount.value)
    }
    
    addResult(`测试${testTradeType.value === 'buy' ? '购买' : '出售'}交易`, result, result.success ? 'success' : 'error')
  } catch (err) {
    error.value = err.message
    addResult('交易测试', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 测试KYC申请
const testKycApplication = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const kycData = {
      firstName: 'Test',
      lastName: 'User',
      dob: '1990-01-01',
      country: 'AU',
      docType: 'passport'
    }
    
    const result = await contractService.applyForKYC(kycData)
    addResult('KYC申请测试', result, result.success ? 'success' : 'error')
  } catch (err) {
    error.value = err.message
    addResult('KYC申请测试', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 网络切换
const switchToMainnet = async () => {
  loading.value = true
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    })
    config.NETWORK.chainId = 1
    config.NETWORK.name = 'Ethereum Mainnet'
    addResult('网络切换', { target: 'Ethereum Mainnet', chainId: 1 }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('网络切换', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

const switchToSepolia = async () => {
  loading.value = true
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    })
    config.NETWORK.chainId = 11155111
    config.NETWORK.name = 'Sepolia Testnet'
    addResult('网络切换', { target: 'Sepolia Testnet', chainId: 11155111 }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('网络切换', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 更新配置
const updateConfig = () => {
  Object.assign(CONTRACT_CONFIG, config)
  addResult('配置更新', config, 'success')
}

// 清除结果
const clearResults = () => {
  results.value = []
}

// 组件挂载时自动检查连接状态
onMounted(async () => {
  await testWalletConnection()
  await testNetworkConnection()
})
</script>

<style scoped>
.contract-test {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #0f172a;
  color: #ffffff;
  min-height: 100vh;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
}

.test-section h2 {
  margin: 0 0 20px 0;
  color: #f1f5f9;
}

.status-grid, .config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.status-item, .config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #334155;
  border-radius: 8px;
  border: 1px solid #475569;
}

.status-item.success {
  border-color: #10b981;
  background: #064e3b;
}

.status-item.error {
  border-color: #ef4444;
  background: #7f1d1d;
}

.config-item label {
  font-weight: 600;
  margin-right: 10px;
}

.config-item input, .config-item select {
  flex: 1;
  padding: 8px;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #1e293b;
  color: #ffffff;
}

.test-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.primary {
  background: #3b82f6;
  color: white;
}

.btn.secondary {
  background: #6b7280;
  color: white;
}

.btn.warning {
  background: #f59e0b;
  color: white;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.function-tests {
  display: grid;
  gap: 20px;
}

.test-group {
  padding: 15px;
  background: #334155;
  border-radius: 8px;
}

.test-group h3 {
  margin: 0 0 15px 0;
  color: #e2e8f0;
}

.test-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.test-inputs input, .test-inputs select {
  padding: 8px;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #1e293b;
  color: #ffffff;
}

.network-management {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.results {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.no-results {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 20px;
}

.result-item {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid;
}

.result-item.success {
  background: #064e3b;
  border-color: #10b981;
}

.result-item.error {
  background: #7f1d1d;
  border-color: #ef4444;
}

.result-item.info {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.result-item.warning {
  background: #78350f;
  border-color: #f59e0b;
}

.result-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.result-title {
  font-weight: 600;
  color: #f1f5f9;
}

.result-time {
  color: #94a3b8;
  font-size: 12px;
}

.result-content pre {
  background: #0f172a;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  color: #e2e8f0;
}

.error-section {
  margin: 30px 0;
  padding: 20px;
  background: #7f1d1d;
  border-radius: 12px;
  border: 1px solid #ef4444;
}

.error-content {
  background: #0f172a;
  padding: 15px;
  border-radius: 8px;
  color: #fca5a5;
  font-family: monospace;
  white-space: pre-wrap;
  margin-bottom: 15px;
}
</style>
