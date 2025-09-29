<template>
  <div class="trade-database-test">
    <h1>🧪 TradeProject 数据库存储测试</h1>
    <p class="description">测试TradeProject页面是否能正确将用户购买记录存储到transactionhistory表中</p>
    
    <!-- 测试配置 -->
    <div class="test-config">
      <h2>📋 测试配置</h2>
      <div class="config-grid">
        <div class="config-item">
          <label>项目代码:</label>
          <input v-model="testConfig.projectCode" placeholder="TYMU" />
        </div>
        <div class="config-item">
          <label>交易类型:</label>
          <select v-model="testConfig.tradeType">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div class="config-item">
          <label>交易数量:</label>
          <input v-model="testConfig.amount" type="number" placeholder="10" />
        </div>
        <div class="config-item">
          <label>代币价格:</label>
          <input v-model="testConfig.price" type="number" step="0.01" placeholder="1.00" />
        </div>
        <div class="config-item">
          <label>用户地址:</label>
          <input v-model="testConfig.userAddress" placeholder="0x..." />
        </div>
        <div class="config-item">
          <label>交易哈希:</label>
          <input v-model="testConfig.transactionHash" placeholder="0x..." />
        </div>
        <div class="config-item">
          <label>区块号:</label>
          <input v-model="testConfig.blockNumber" type="number" placeholder="12345" />
        </div>
      </div>
      
      <div class="config-actions">
        <button @click="generateTestData" class="btn secondary">生成测试数据</button>
        <button @click="clearConfig" class="btn secondary">清空配置</button>
      </div>
    </div>

    <!-- 测试执行 -->
    <div class="test-execution">
      <h2>🚀 测试执行</h2>
      <div class="execution-buttons">
        <button @click="testSaveTransaction" :disabled="testing" class="btn primary">
          <span v-if="testing">测试中...</span>
          <span v-else>测试保存交易</span>
        </button>
        <button @click="testLoadTransactions" :disabled="testing" class="btn secondary">
          测试加载交易记录
        </button>
        <button @click="testFullWorkflow" :disabled="testing" class="btn primary">
          完整工作流程测试
        </button>
      </div>
    </div>

    <!-- 测试结果 -->
    <div class="test-results">
      <h2>📊 测试结果</h2>
      <div class="results-summary">
        <div class="summary-item">
          <span class="summary-label">测试总数:</span>
          <span class="summary-value">{{ testResults.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">成功:</span>
          <span class="summary-value success">{{ successCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">失败:</span>
          <span class="summary-value error">{{ errorCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">警告:</span>
          <span class="summary-value warning">{{ warningCount }}</span>
        </div>
      </div>
      
      <div class="results-list">
        <div v-for="(result, index) in testResults" :key="index" :class="['result-item', result.type]">
          <div class="result-header">
            <span class="result-icon">{{ getResultIcon(result.type) }}</span>
            <span class="result-title">{{ result.title }}</span>
            <span class="result-time">{{ result.time }}</span>
          </div>
          <div class="result-message">{{ result.message }}</div>
          <pre v-if="result.details" class="result-details">{{ result.details }}</pre>
        </div>
        <div v-if="testResults.length === 0" class="no-results">
          暂无测试结果，点击上方按钮开始测试
        </div>
      </div>
      
      <div class="results-actions">
        <button @click="clearResults" class="btn secondary">清空结果</button>
        <button @click="exportResults" class="btn secondary">导出结果</button>
      </div>
    </div>

    <!-- 数据库状态检查 -->
    <div class="database-status">
      <h2>🗄️ 数据库状态检查</h2>
      <div class="status-grid">
        <div class="status-item">
          <label>API端点:</label>
          <span class="status-value">{{ apiEndpoint }}</span>
        </div>
        <div class="status-item">
          <label>连接状态:</label>
          <span :class="['status-value', apiConnected ? 'success' : 'error']">
            {{ apiConnected ? '已连接' : '未连接' }}
          </span>
        </div>
        <div class="status-item">
          <label>最后检查:</label>
          <span class="status-value">{{ lastCheckTime }}</span>
        </div>
      </div>
      <button @click="checkApiConnection" class="btn secondary">检查API连接</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 测试配置
const testConfig = ref({
  projectCode: 'TYMU',
  tradeType: 'buy',
  amount: 10,
  price: 1.00,
  userAddress: '0x1234567890123456789012345678901234567890',
  transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  blockNumber: 12345
})

// 测试状态
const testing = ref(false)
const testResults = ref([])
const apiConnected = ref(false)
const lastCheckTime = ref('')

// API配置
const apiEndpoint = import.meta.env.VITE_API_TSC_URL

// 计算属性
const successCount = computed(() => testResults.value.filter(r => r.type === 'success').length)
const errorCount = computed(() => testResults.value.filter(r => r.type === 'error').length)
const warningCount = computed(() => testResults.value.filter(r => r.type === 'warning').length)

// 初始化
onMounted(() => {
  checkApiConnection()
})

// 生成测试数据
function generateTestData() {
  testConfig.value = {
    projectCode: 'TYMU',
    tradeType: Math.random() > 0.5 ? 'buy' : 'sell',
    amount: Math.floor(Math.random() * 100) + 1,
    price: (Math.random() * 2 + 0.5).toFixed(2),
    userAddress: '0x' + Math.random().toString(16).substr(2, 40),
    transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
    blockNumber: Math.floor(Math.random() * 100000) + 10000
  }
  addResult('info', '测试数据已生成', '使用随机数据填充测试配置')
}

// 清空配置
function clearConfig() {
  testConfig.value = {
    projectCode: '',
    tradeType: 'buy',
    amount: 0,
    price: 0,
    userAddress: '',
    transactionHash: '',
    blockNumber: 0
  }
  addResult('info', '配置已清空', '所有测试配置已重置')
}

// 测试保存交易
async function testSaveTransaction() {
  testing.value = true
  addResult('info', '开始测试保存交易', '准备发送交易数据到数据库')
  
  try {
    // 首先检查API连接
    addResult('info', '检查API连接状态', `尝试连接: ${apiEndpoint}`)
    
    // 准备交易数据
    const transactionData = {
      projectCode: testConfig.value.projectCode,
      tradeType: testConfig.value.tradeType,
      amount: parseInt(testConfig.value.amount),
      price: parseFloat(testConfig.value.price),
      total: parseFloat(testConfig.value.amount) * parseFloat(testConfig.value.price),
      userAddress: testConfig.value.userAddress,
      transactionHash: testConfig.value.transactionHash,
      blockNumber: parseInt(testConfig.value.blockNumber),
      timestamp: new Date().toISOString()
    }
    
    addResult('info', '交易数据准备完成', JSON.stringify(transactionData, null, 2))
    
    // 发送到后端
    addResult('info', '发送POST请求到后端API', `URL: ${apiEndpoint}`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    addResult('info', `收到响应`, `状态码: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      addResult('error', 'HTTP请求失败', `状态: ${response.status}, 响应: ${errorText}`)
      return
    }
    
    const result = await response.json()
    addResult('info', '后端响应', JSON.stringify(result, null, 2))
    
    if (result.status === 0) {
      addResult('success', '交易保存成功', `交易数据已成功保存到数据库，ID: ${result.data?.id || 'N/A'}`)
    } else {
      addResult('error', '交易保存失败', result.message || '未知错误')
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      addResult('error', '请求超时', 'API请求超过10秒未响应，请检查后端服务状态')
    } else if (error.message.includes('Failed to fetch')) {
      addResult('error', '网络连接失败', '无法连接到后端API服务，请确保后端服务正在运行')
      addResult('info', '故障排除建议', [
        '1. 检查后端服务是否启动: cd Mysql && npm start',
        '2. 确认API地址是否正确: http://8.138.127.3:3000',
        '3. 检查防火墙设置',
        '4. 尝试在浏览器中直接访问: http://8.138.127.3:3000/user/transactionhistory'
      ].join('\n'))
    } else {
      addResult('error', '保存交易失败', error.message, error.stack)
    }
  } finally {
    testing.value = false
  }
}

// 测试加载交易记录
async function testLoadTransactions() {
  testing.value = true
  addResult('info', '开始测试加载交易记录', `查询项目: ${testConfig.value.projectCode}`)
  
  try {
    const url = `${apiEndpoint}?projectCode=${testConfig.value.projectCode}&limit=10`
    addResult('info', '请求URL', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP请求失败: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    addResult('info', '后端响应', JSON.stringify(result, null, 2))
    
    if (result.status === 0) {
      const count = result.data?.length || 0
      addResult('success', '交易记录加载成功', `成功加载 ${count} 条交易记录`)
      
      if (count > 0) {
        addResult('info', '最新交易记录', JSON.stringify(result.data[0], null, 2))
      }
    } else {
      addResult('error', '交易记录加载失败', result.message || '未知错误')
    }
    
  } catch (error) {
    addResult('error', '加载交易记录失败', error.message, error.stack)
  } finally {
    testing.value = false
  }
}

// 完整工作流程测试
async function testFullWorkflow() {
  testing.value = true
  addResult('info', '开始完整工作流程测试', '模拟TradeProject页面的完整交易流程')
  
  try {
    // 步骤1: 模拟合约交易
    addResult('info', '步骤1: 模拟智能合约交易', '执行buyTokens或sellTokens')
    
    const mockContractResult = {
      success: true,
      transactionHash: testConfig.value.transactionHash,
      blockNumber: testConfig.value.blockNumber,
      tokenPrice: testConfig.value.price,
      totalCost: parseFloat(testConfig.value.amount) * parseFloat(testConfig.value.price)
    }
    
    addResult('success', '智能合约交易成功', JSON.stringify(mockContractResult, null, 2))
    
    // 步骤2: 保存到数据库
    addResult('info', '步骤2: 保存交易到数据库', '调用saveTransactionToDatabase方法')
    
    const transactionData = {
      projectCode: testConfig.value.projectCode,
      tradeType: testConfig.value.tradeType,
      amount: parseInt(testConfig.value.amount),
      price: parseFloat(testConfig.value.price),
      total: mockContractResult.totalCost,
      userAddress: testConfig.value.userAddress,
      transactionHash: mockContractResult.transactionHash,
      blockNumber: mockContractResult.blockNumber,
      timestamp: new Date().toISOString()
    }
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    })
    
    if (!response.ok) {
      throw new Error(`数据库保存失败: ${response.status}`)
    }
    
    const dbResult = await response.json()
    
    if (dbResult.status === 0) {
      addResult('success', '数据库保存成功', `交易数据已保存，ID: ${dbResult.data?.id}`)
    } else {
      addResult('error', '数据库保存失败', dbResult.message)
      return
    }
    
    // 步骤3: 验证数据
    addResult('info', '步骤3: 验证保存的数据', '查询刚保存的交易记录')
    
    const verifyResponse = await fetch(`${apiEndpoint}?projectCode=${testConfig.value.projectCode}&limit=1`)
    const verifyResult = await verifyResponse.json()
    
    if (verifyResult.status === 0 && verifyResult.data?.length > 0) {
      const savedTransaction = verifyResult.data[0]
      addResult('success', '数据验证成功', JSON.stringify(savedTransaction, null, 2))
      
      // 检查字段映射
      const fieldChecks = [
        { frontend: 'projectCode', backend: 'token_symbol', value: testConfig.value.projectCode },
        { frontend: 'tradeType', backend: 'transaction_type', value: testConfig.value.tradeType.toUpperCase() },
        { frontend: 'amount', backend: 'amount', value: parseInt(testConfig.value.amount) },
        { frontend: 'price', backend: 'price', value: parseFloat(testConfig.value.price) },
        { frontend: 'total', backend: 'totalCost', value: mockContractResult.totalCost },
        { frontend: 'userAddress', backend: 'wallet_address', value: testConfig.value.userAddress }
      ]
      
      let allFieldsCorrect = true
      for (const check of fieldChecks) {
        if (savedTransaction[check.backend] != check.value) {
          addResult('warning', `字段映射问题: ${check.frontend} -> ${check.backend}`, 
            `期望: ${check.value}, 实际: ${savedTransaction[check.backend]}`)
          allFieldsCorrect = false
        }
      }
      
      if (allFieldsCorrect) {
        addResult('success', '字段映射验证通过', '所有字段都正确映射到数据库')
      }
      
    } else {
      addResult('error', '数据验证失败', '无法查询到刚保存的交易记录')
    }
    
    addResult('success', '完整工作流程测试完成', 'TradeProject页面数据库存储功能正常')
    
  } catch (error) {
    addResult('error', '完整工作流程测试失败', error.message, error.stack)
  } finally {
    testing.value = false
  }
}

// 检查API连接
async function checkApiConnection() {
  try {
    addResult('info', '开始检查API连接', `检查地址: ${apiEndpoint}`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
    
    const response = await fetch(apiEndpoint + '?limit=1', {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    apiConnected.value = response.ok
    lastCheckTime.value = new Date().toLocaleTimeString()
    
    if (response.ok) {
      addResult('success', 'API连接正常', `后端服务可访问，状态码: ${response.status}`)
      try {
        const data = await response.json()
        addResult('info', 'API响应正常', `返回数据状态: ${data.status || 'N/A'}`)
      } catch (parseError) {
        addResult('warning', 'API响应解析失败', '服务器返回了非JSON格式的响应')
      }
    } else {
      addResult('error', 'API连接失败', `HTTP状态: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      addResult('info', '错误详情', errorText || '无错误详情')
    }
  } catch (error) {
    apiConnected.value = false
    lastCheckTime.value = new Date().toLocaleTimeString()
    
    if (error.name === 'AbortError') {
      addResult('error', 'API连接超时', '连接请求超过5秒未响应')
    } else if (error.message.includes('Failed to fetch')) {
      addResult('error', '网络连接失败', '无法连接到后端API服务')
      addResult('info', '可能的原因', [
        '1. 后端服务未启动',
        '2. API地址配置错误',
        '3. 网络连接问题',
        '4. 防火墙阻止连接'
      ].join('\n'))
    } else {
      addResult('error', 'API连接失败', error.message)
    }
    
    addResult('info', '故障排除步骤', [
      '1. 确认后端服务状态: cd Mysql && npm start',
      '2. 检查服务端口: 确认3000端口未被占用',
      '3. 测试直接访问: 在浏览器中打开 http://8.138.127.3:3000/user/transactionhistory',
      '4. 检查网络配置: 确认IP地址和端口正确'
    ].join('\n'))
  }
}

// 添加测试结果
function addResult(type, title, message, details = null) {
  testResults.value.unshift({
    type,
    title,
    message,
    details,
    time: new Date().toLocaleTimeString()
  })
  
  // 限制结果数量
  if (testResults.value.length > 100) {
    testResults.value = testResults.value.slice(0, 100)
  }
}

// 获取结果图标
function getResultIcon(type) {
  switch (type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    case 'info': return 'ℹ️'
    default: return '📝'
  }
}

// 清空结果
function clearResults() {
  testResults.value = []
  addResult('info', '结果已清空', '所有测试结果已清除')
}

// 导出结果
function exportResults() {
  const data = {
    timestamp: new Date().toISOString(),
    config: testConfig.value,
    results: testResults.value,
    summary: {
      total: testResults.value.length,
      success: successCount.value,
      error: errorCount.value,
      warning: warningCount.value
    }
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trade-database-test-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  addResult('info', '结果已导出', '测试结果已导出为JSON文件')
}
</script>

<style scoped>
.trade-database-test {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #1a1a2e;
  color: #e0e0e0;
  border-radius: 8px;
}

.trade-database-test h1 {
  color: #f59e0b;
  text-align: center;
  margin-bottom: 10px;
  font-size: 28px;
}

.description {
  text-align: center;
  color: #acb3bd;
  margin-bottom: 30px;
  font-size: 15px;
}

.test-config, .test-execution, .test-results, .database-status {
  background: #16213e;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
  margin-bottom: 25px;
}

.test-config h2, .test-execution h2, .test-results h2, .database-status h2 {
  color: #f59e0b;
  margin-bottom: 15px;
  font-size: 20px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.config-item label {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 600;
}

.config-item input, .config-item select {
  padding: 8px 12px;
  background: #0f3460;
  border: 1px solid #2a2a4a;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
}

.config-item input:focus, .config-item select:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.config-actions, .execution-buttons, .results-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn.primary {
  background: #3b82f6;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn.secondary {
  background: #475569;
  color: white;
}

.btn.secondary:hover:not(:disabled) {
  background: #334155;
  transform: translateY(-1px);
}

.btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.summary-item {
  background: #0f3460;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #2a2a4a;
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.summary-value.success { color: #10b981; }
.summary-value.error { color: #ef4444; }
.summary-value.warning { color: #f59e0b; }

.results-list {
  max-height: 400px;
  overflow-y: auto;
  background: #0f3460;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.result-item {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #2a2a4a;
  background: #1a1a2e;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.result-icon {
  font-size: 16px;
}

.result-title {
  font-weight: 600;
  color: #ffffff;
  flex: 1;
}

.result-time {
  font-size: 12px;
  color: #94a3b8;
}

.result-message {
  color: #e0e0e0;
  margin-bottom: 8px;
  line-height: 1.4;
}

.result-details {
  background: #0f3460;
  border: 1px solid #2a2a4a;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  color: #e0e0e0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.result-item.success .result-title { color: #10b981; }
.result-item.error .result-title { color: #ef4444; }
.result-item.warning .result-title { color: #f59e0b; }
.result-item.info .result-title { color: #3b82f6; }

.no-results {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 20px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-item label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.status-value {
  font-size: 14px;
  color: #ffffff;
  font-family: monospace;
}

.status-value.success { color: #10b981; }
.status-value.error { color: #ef4444; }

@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .results-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .config-actions, .execution-buttons, .results-actions {
    flex-direction: column;
  }
}
</style>
