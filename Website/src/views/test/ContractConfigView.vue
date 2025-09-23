<template>
  <div class="contract-config">
    <h1>智能合约地址配置</h1>
    
    <!-- 当前配置显示 -->
    <div class="config-section">
      <h2>📋 当前配置</h2>
      <div class="config-display">
        <div class="config-item">
          <label>环境:</label>
          <span class="env-badge" :class="currentEnv">{{ currentEnv }}</span>
        </div>
        <div class="config-item">
          <label>网络:</label>
          <span>{{ currentConfig.NETWORK.name }} ({{ currentConfig.NETWORK.chainId }})</span>
        </div>
        <div class="config-item">
          <label>KYC默认状态:</label>
          <span class="kyc-badge" :class="kycStatusClass">{{ kycStatusText }}</span>
        </div>
        <div class="config-item">
          <label>KYC默认级别:</label>
          <span>Level {{ currentConfig.KYC?.DEFAULT_LEVEL || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- 环境变量配置 -->
    <div class="config-section">
      <h2>🔧 环境变量配置</h2>
      <div class="env-config-display">
        <div class="env-config-item">
          <label>VITE_KYC_DEFAULT_SUCCESS:</label>
          <span>{{ envConfig.KYC_DEFAULT_SUCCESS || '未设置' }}</span>
        </div>
        <div class="env-config-item">
          <label>VITE_KYC_DEFAULT_LEVEL:</label>
          <span>{{ envConfig.KYC_DEFAULT_LEVEL || '未设置' }}</span>
        </div>
        <div class="env-config-item">
          <label>VITE_NETWORK_CHAIN_ID:</label>
          <span>{{ envConfig.NETWORK_CHAIN_ID || '未设置' }}</span>
        </div>
        <div class="env-config-item">
          <label>VITE_KYC_REGISTRY_ADDRESS:</label>
          <span>{{ envConfig.KYC_REGISTRY_ADDRESS || '未设置' }}</span>
        </div>
        <div class="env-config-item">
          <label>VITE_TRADE_CONTRACT_ADDRESS:</label>
          <span>{{ envConfig.TRADE_CONTRACT_ADDRESS || '未设置' }}</span>
        </div>
      </div>
      <div class="env-note">
        <p>💡 提示：环境变量配置优先于界面配置。请创建 .env 文件来设置这些变量。</p>
      </div>
    </div>

    <!-- 配置表单 -->
    <div class="config-section">
      <h2>⚙️ 更新合约地址</h2>
      
      <form @submit.prevent="updateConfig" class="config-form">
        <!-- 环境选择 -->
        <div class="form-group">
          <label>目标环境:</label>
          <select v-model="selectedEnv" @change="loadConfig">
            <option value="dev">开发环境 (Sepolia测试网)</option>
            <option value="prod">生产环境 (Ethereum主网)</option>
          </select>
        </div>

        <!-- 合约地址输入 -->
        <div class="form-group">
          <label>KYC注册表合约地址:</label>
          <input 
            v-model="config.KYC_REGISTRY_ADDRESS" 
            type="text" 
            placeholder="0x..."
            pattern="^0x[a-fA-F0-9]{40}$"
            title="请输入有效的以太坊地址"
          />
          <small>用于KYC验证和用户权限管理</small>
        </div>

        <div class="form-group">
          <label>Loan发行者合约地址:</label>
          <input 
            v-model="config.LOAN_ISSUER_ADDRESS" 
            type="text" 
            placeholder="0x..."
            pattern="^0x[a-fA-F0-9]{40}$"
            title="请输入有效的以太坊地址"
          />
          <small>用于贷款发行和管理</small>
        </div>

        <div class="form-group">
          <label>本金代币合约地址:</label>
          <input 
            v-model="config.PRINCIPAL_TOKEN_ADDRESS" 
            type="text" 
            placeholder="0x..."
            pattern="^0x[a-fA-F0-9]{40}$"
            title="请输入有效的以太坊地址"
          />
          <small>代表本金资产的ERC20代币</small>
        </div>

        <div class="form-group">
          <label>利息代币合约地址:</label>
          <input 
            v-model="config.INTEREST_TOKEN_ADDRESS" 
            type="text" 
            placeholder="0x..."
            pattern="^0x[a-fA-F0-9]{40}$"
            title="请输入有效的以太坊地址"
          />
          <small>代表利息收益的ERC20代币</small>
        </div>

        <div class="form-group">
          <label>交易合约地址:</label>
          <input 
            v-model="config.TRADE_CONTRACT_ADDRESS" 
            type="text" 
            placeholder="0x..."
            pattern="^0x[a-fA-F0-9]{40}$"
            title="请输入有效的以太坊地址"
          />
          <small>用于代币买卖交易</small>
        </div>

        <!-- 网络配置 -->
        <div class="form-group">
          <label>网络ID:</label>
          <select v-model="config.NETWORK.chainId">
            <option :value="11155111">Sepolia测试网 (11155111)</option>
            <option :value="1">Ethereum主网 (1)</option>
            <option :value="5">Goerli测试网 (5)</option>
            <option :value="137">Polygon主网 (137)</option>
            <option :value="80001">Polygon Mumbai (80001)</option>
          </select>
        </div>

        <div class="form-group">
          <label>网络名称:</label>
          <input 
            v-model="config.NETWORK.name" 
            type="text" 
            placeholder="网络名称"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button type="button" @click="resetConfig" class="btn secondary">重置</button>
          <button type="button" @click="validateConfig" class="btn warning">验证</button>
          <button type="submit" :disabled="!isConfigValid" class="btn primary">保存配置</button>
        </div>
      </form>
    </div>

    <!-- 验证结果 -->
    <div v-if="validationResults.length > 0" class="config-section">
      <h2>🔍 验证结果</h2>
      <div class="validation-results">
        <div v-for="(result, index) in validationResults" :key="index" 
             class="validation-item" :class="result.status">
          <span class="validation-icon">{{ result.status === 'success' ? '✅' : '❌' }}</span>
          <span class="validation-message">{{ result.message }}</span>
        </div>
      </div>
    </div>

    <!-- 配置历史 -->
    <div class="config-section">
      <h2>📚 配置历史</h2>
      <div class="history-list">
        <div v-for="(record, index) in configHistory" :key="index" class="history-item">
          <div class="history-header">
            <span class="history-env">{{ record.env }}</span>
            <span class="history-time">{{ formatTime(record.timestamp) }}</span>
          </div>
          <div class="history-summary">
            <span v-for="(address, key) in record.addresses" :key="key" class="history-address">
              {{ key }}: {{ address.slice(0, 6) }}...{{ address.slice(-4) }}
            </span>
          </div>
        </div>
        <div v-if="configHistory.length === 0" class="no-history">
          暂无配置历史
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="config-section">
      <h2>🚀 快速操作</h2>
      <div class="quick-actions">
        <button @click="loadFromClipboard" class="btn secondary">从剪贴板导入</button>
        <button @click="exportToClipboard" class="btn secondary">导出到剪贴板</button>
        <button @click="clearHistory" class="btn secondary">清除历史</button>
        <button @click="testConnection" class="btn warning">测试连接</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import CONTRACT_CONFIG, { DEV_CONFIG, PROD_CONFIG } from '@/config/contractConfig'

// 响应式数据
const selectedEnv = ref('dev')
const config = reactive({
  KYC_REGISTRY_ADDRESS: '',
  LOAN_ISSUER_ADDRESS: '',
  PRINCIPAL_TOKEN_ADDRESS: '',
  INTEREST_TOKEN_ADDRESS: '',
  TRADE_CONTRACT_ADDRESS: '',
  NETWORK: {
    chainId: 11155111,
    name: 'Sepolia Testnet'
  }
})

const validationResults = ref([])
const configHistory = ref([])

// 当前配置
const currentConfig = ref(CONTRACT_CONFIG)
const currentEnv = computed(() => selectedEnv.value === 'dev' ? '开发环境' : '生产环境')

// 环境变量配置
const envConfig = reactive({
  KYC_DEFAULT_SUCCESS: import.meta.env.VITE_KYC_DEFAULT_SUCCESS,
  KYC_DEFAULT_LEVEL: import.meta.env.VITE_KYC_DEFAULT_LEVEL,
  NETWORK_CHAIN_ID: import.meta.env.VITE_NETWORK_CHAIN_ID,
  KYC_REGISTRY_ADDRESS: import.meta.env.VITE_KYC_REGISTRY_ADDRESS,
  TRADE_CONTRACT_ADDRESS: import.meta.env.VITE_TRADE_CONTRACT_ADDRESS
})

// KYC状态显示
const kycStatusText = computed(() => {
  return CONTRACT_CONFIG.KYC?.DEFAULT_SUCCESS ? '已验证' : '未验证'
})

const kycStatusClass = computed(() => {
  return CONTRACT_CONFIG.KYC?.DEFAULT_SUCCESS ? 'success' : 'warning'
})

// 验证配置是否有效
const isConfigValid = computed(() => {
  const requiredFields = [
    'KYC_REGISTRY_ADDRESS',
    'LOAN_ISSUER_ADDRESS', 
    'PRINCIPAL_TOKEN_ADDRESS',
    'INTEREST_TOKEN_ADDRESS',
    'TRADE_CONTRACT_ADDRESS'
  ]
  
  return requiredFields.every(field => {
    const address = config[field]
    return address && address.startsWith('0x') && address.length === 42
  })
})

// 加载配置
const loadConfig = () => {
  const savedConfig = localStorage.getItem(`contractConfig_${selectedEnv.value}`)
  if (savedConfig) {
    Object.assign(config, JSON.parse(savedConfig))
  } else {
    // 默认配置
    if (selectedEnv.value === 'dev') {
      Object.assign(config, {
        KYC_REGISTRY_ADDRESS: '',
        LOAN_ISSUER_ADDRESS: '',
        PRINCIPAL_TOKEN_ADDRESS: '',
        INTEREST_TOKEN_ADDRESS: '',
        TRADE_CONTRACT_ADDRESS: '',
        NETWORK: {
          chainId: 11155111,
          name: 'Sepolia Testnet'
        }
      })
    } else {
      Object.assign(config, {
        KYC_REGISTRY_ADDRESS: '',
        LOAN_ISSUER_ADDRESS: '',
        PRINCIPAL_TOKEN_ADDRESS: '',
        INTEREST_TOKEN_ADDRESS: '',
        TRADE_CONTRACT_ADDRESS: '',
        NETWORK: {
          chainId: 1,
          name: 'Ethereum Mainnet'
        }
      })
    }
  }
}

// 保存配置
const updateConfig = () => {
  if (!isConfigValid.value) {
    alert('请填写所有必需的合约地址')
    return
  }

  // 保存到localStorage
  localStorage.setItem(`contractConfig_${selectedEnv.value}`, JSON.stringify(config))
  
  // 添加到历史记录
  configHistory.value.unshift({
    env: selectedEnv.value,
    timestamp: Date.now(),
    addresses: { ...config }
  })
  
  // 限制历史记录数量
  if (configHistory.value.length > 10) {
    configHistory.value = configHistory.value.slice(0, 10)
  }
  
  // 保存历史记录
  localStorage.setItem('configHistory', JSON.stringify(configHistory.value))
  
  alert('配置已保存！')
}

// 重置配置
const resetConfig = () => {
  if (confirm('确定要重置当前配置吗？')) {
    loadConfig()
  }
}

// 验证配置
const validateConfig = () => {
  validationResults.value = []
  
  const requiredFields = [
    { key: 'KYC_REGISTRY_ADDRESS', name: 'KYC注册表合约' },
    { key: 'LOAN_ISSUER_ADDRESS', name: 'Loan发行者合约' },
    { key: 'PRINCIPAL_TOKEN_ADDRESS', name: '本金代币合约' },
    { key: 'INTEREST_TOKEN_ADDRESS', name: '利息代币合约' },
    { key: 'TRADE_CONTRACT_ADDRESS', name: '交易合约' }
  ]
  
  requiredFields.forEach(field => {
    const address = config[field.key]
    if (!address) {
      validationResults.value.push({
        status: 'error',
        message: `${field.name}地址不能为空`
      })
    } else if (!address.startsWith('0x') || address.length !== 42) {
      validationResults.value.push({
        status: 'error',
        message: `${field.name}地址格式无效`
      })
    } else {
      validationResults.value.push({
        status: 'success',
        message: `${field.name}地址格式正确`
      })
    }
  })
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

// 从剪贴板导入
const loadFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    const parsed = JSON.parse(text)
    Object.assign(config, parsed)
    alert('配置已从剪贴板导入')
  } catch (error) {
    alert('剪贴板内容格式错误')
  }
}

// 导出到剪贴板
const exportToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    alert('配置已复制到剪贴板')
  } catch (error) {
    alert('复制失败')
  }
}

// 清除历史
const clearHistory = () => {
  if (confirm('确定要清除所有配置历史吗？')) {
    configHistory.value = []
    localStorage.removeItem('configHistory')
    alert('历史记录已清除')
  }
}

// 测试连接
const testConnection = () => {
  // 这里可以添加实际的合约连接测试逻辑
  alert('连接测试功能待实现')
}

// 组件挂载时加载配置
onMounted(() => {
  loadConfig()
  
  // 加载历史记录
  const savedHistory = localStorage.getItem('configHistory')
  if (savedHistory) {
    configHistory.value = JSON.parse(savedHistory)
  }
})
</script>

<style scoped>
.contract-config {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #0f172a;
  color: #ffffff;
  min-height: 100vh;
}

.config-section {
  margin: 30px 0;
  padding: 20px;
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
}

.config-section h2 {
  margin: 0 0 20px 0;
  color: #f1f5f9;
}

.config-display {
  display: grid;
  gap: 15px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #334155;
  border-radius: 8px;
}

.env-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.env-badge.dev {
  background: #059669;
  color: white;
}

.env-badge.prod {
  background: #dc2626;
  color: white;
}

.kyc-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.kyc-badge.success {
  background: #059669;
  color: white;
}

.kyc-badge.warning {
  background: #d97706;
  color: white;
}

.env-config-display {
  display: grid;
  gap: 15px;
  margin-bottom: 20px;
}

.env-config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #334155;
  border-radius: 8px;
  border: 1px solid #475569;
}

.env-config-item label {
  font-weight: 600;
  color: #e2e8f0;
  font-family: monospace;
  font-size: 12px;
}

.env-config-item span {
  color: #cbd5e1;
  font-size: 12px;
  font-family: monospace;
  background: #1e293b;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #475569;
}

.env-note {
  background: #78350f;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
}

.env-note p {
  color: #fef3c7;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.config-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #e2e8f0;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #475569;
  border-radius: 8px;
  background: #1e293b;
  color: #ffffff;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group small {
  color: #94a3b8;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

.validation-results {
  display: grid;
  gap: 10px;
}

.validation-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
}

.validation-item.success {
  background: #064e3b;
  color: #10b981;
}

.validation-item.error {
  background: #7f1d1d;
  color: #ef4444;
}

.validation-icon {
  font-size: 16px;
}

.history-list {
  display: grid;
  gap: 15px;
}

.history-item {
  padding: 15px;
  background: #334155;
  border-radius: 8px;
  border: 1px solid #475569;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.history-env {
  font-weight: 600;
  color: #e2e8f0;
}

.history-time {
  color: #94a3b8;
  font-size: 12px;
}

.history-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-address {
  background: #1e293b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #cbd5e1;
}

.no-history {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 20px;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
