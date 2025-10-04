<!-- <template>
  <div class="test-contract-container">
    <div class="test-header">
      <h1>智能合约测试页面</h1>
      <p>测试 RWA 合约部署和交互功能</p>
    </div>

    <!-- 连接状态 
    <div class="connection-status">
      <div class="status-item">
        <span class="status-label">钱包状态:</span>
        <span :class="['status-value', connected ? 'connected' : 'disconnected']">
          {{ connected ? '已连接' : '未连接' }}
        </span>
      </div>
      <div class="status-item" v-if="connected">
        <span class="status-label">地址:</span>
        <span class="status-value">{{ shortAddress }}</span>
      </div>
      <div class="status-item" v-if="connected">
        <span class="status-label">网络:</span>
        <span class="status-value">{{ networkLabel }}</span>
      </div>
      <div class="status-item" v-if="connected">
        <span class="status-label">链ID:</span>
        <span class="status-value">{{ getCurrentChainId() }}</span>
      </div>
    </div>

    操作按钮 
    <div class="action-buttons">
      <button 
        v-if="!connected" 
        @click="connectWallet" 
        class="btn primary"
        :disabled="loading"
      >
        连接钱包
      </button>
      <button 
        v-if="connected" 
        @click="disconnectWallet" 
        class="btn secondary"
        :disabled="loading"
      >
        断开连接
      </button>
    </div>

    项目认购区域 
    <div class="test-section">
      <h2>项目认购测试</h2>
      <div class="section-content">
        <div class="subscription-form">
          <div class="form-group">
            <label for="subscriptionAmount">认购金额 (LPT)</label>
            <div class="input-wrapper">
              <input 
                id="subscriptionAmount"
                v-model.number="subscriptionAmount" 
                type="number" 
                step="0.01"
                min="0"
                placeholder="请输入认购金额"
                class="amount-input"
                :disabled="loading"
              />
              <span class="currency-symbol">LPT</span>
            </div>
            <div class="input-hint">
              最小认购金额: {{ contractTerms.minSubscription || 100 }} LPT，最大认购金额: {{ contractTerms.maxSubscription || 10000 }} LPT
            </div>
          </div>
          
          <div class="form-group">
            <label>年化利率</label>
            <div class="display-value">
              <span class="value-text">{{ contractTerms.annualRate }}%</span>
              <span class="value-description">合约设定利率</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>贷款期限</label>
            <div class="display-value">
              <span class="value-text">{{ contractTerms.loanTerm }} 天</span>
              <span class="value-description">合约设定期限</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="projectCode">项目代号</label>
            <select 
              id="projectCode"
              v-model="selectedProjectCode" 
              class="select-input"
              :disabled="loading"
            >
              <option value="">请选择项目代号</option>
              <option 
                v-for="project in availableProjects" 
                :key="project.code" 
                :value="project.code"
              >
                {{ project.code }} - {{ project.name }}
              </option>
            </select>
            <div class="input-hint">
              选择要认购的RWA项目
            </div>
          </div>
          
          <div class="subscription-summary" v-if="subscriptionAmount > 0 && selectedProjectCode">
            <h3>认购摘要</h3>
            <div class="summary-item">
              <span class="summary-label">项目代号:</span>
              <span class="summary-value">{{ selectedProjectCode }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">项目名称:</span>
              <span class="summary-value">{{ getSelectedProjectName() }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">认购金额:</span>
              <span class="summary-value">{{ formatNumber(subscriptionAmount) }} LPT</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">年化利率:</span>
              <span class="summary-value">{{ contractTerms.annualRate }}%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">贷款期限:</span>
              <span class="summary-value">{{ contractTerms.loanTerm }} 天</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">预计利息:</span>
              <span class="summary-value">{{ calculateInterest() }} LIT</span>
            </div>
          </div>
        </div>
        
        <div class="deploy-controls">
          <div class="removed-notice">
            <p>合约部署功能已被移除</p>
          </div>
        </div>
        
        <div v-if="deploymentStatus" class="deployment-status">
          <h3>部署状态</h3>
          <div class="status-log">
            <div 
              v-for="(log, index) in deploymentLogs" 
              :key="index"
              :class="['log-item', log.type]"
            >
              <span class="log-time">{{ log.time }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>

        <div v-if="deployedContracts.length > 0" class="deployed-contracts">
          <h3>已部署合约</h3>
          <div class="contract-list">
            <div 
              v-for="contract in deployedContracts" 
              :key="contract.name"
              class="contract-item"
            >
              <div class="contract-name">{{ contract.name }}</div>
              <div class="contract-address">{{ contract.address }}</div>
              <button 
                @click="copyAddress(contract.address)"
                class="btn small"
              >
                复制地址
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    合约交互区域 
    <div class="test-section">
      <h2>合约交互测试</h2>
      <div class="section-content">
        <div class="interaction-controls">
          <div class="input-group">
            <label>合约地址配置:</label>
            <div class="address-inputs">
              <div class="input-item">
                <label>LPT 地址:</label>
                <input 
                  v-model="contractAddresses.lpt" 
                  type="text" 
                  placeholder="0x..."
                  class="address-input"
                />
              </div>
              <div class="input-item">
                <label>LIT 地址:</label>
                <input 
                  v-model="contractAddresses.lit" 
                  type="text" 
                  placeholder="0x..."
                  class="address-input"
                />
              </div>
              <div class="input-item">
                <label>LoanIssuer 地址:</label>
                <input 
                  v-model="contractAddresses.issuer" 
                  type="text" 
                  placeholder="0x..."
                  class="address-input"
                />
              </div>
            </div>
          </div>

          <div class="test-actions">
            <button 
              @click="testContractInteraction" 
              class="btn primary"
              :disabled="!connected || loading || !allAddressesSet"
            >
              {{ loading ? '测试中...' : '执行交互测试' }}
            </button>
            <button 
              @click="loadBalances" 
              class="btn secondary"
              :disabled="!connected || loading || !allAddressesSet"
            >
              查询余额
            </button>
          </div>
        </div>

        <div v-if="interactionStatus" class="interaction-status">
          <h3>交互状态</h3>
          <div class="status-log">
            <div 
              v-for="(log, index) in interactionLogs" 
              :key="index"
              :class="['log-item', log.type]"
            >
              <span class="log-time">{{ log.time }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>

        <div v-if="balanceInfo" class="balance-info">
          <h3>余额信息</h3>
          <div class="balance-list">
            <div class="balance-item">
              <span class="balance-label">LPT 余额:</span>
              <span class="balance-value">{{ balanceInfo.lpt }} LPT</span>
            </div>
            <div class="balance-item">
              <span class="balance-label">LIT 余额:</span>
              <span class="balance-value">{{ balanceInfo.lit }} LIT</span>
            </div>
            <div class="balance-item">
              <span class="balance-label">ETH 余额:</span>
              <span class="balance-value">{{ balanceInfo.eth }} ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>

     错误显示 
    <div v-if="error" class="error-message">
      <h3>错误信息</h3>
      <p>{{ error }}</p>
    </div>

    成功消息 
    <div v-if="successMessage" class="success-message">
      <h3>操作成功</h3>
      <p>{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useWallet } from '@/composables/useWallet'
import { ethers } from 'ethers'
import contractTestService from '@/services/contractTestService'

// 使用钱包功能
const {
  connected, address, shortAddress, networkLabel, chainId,
  connect, disconnect
} = useWallet()

// 响应式数据
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

// 认购表单数据
const subscriptionAmount = ref(0)
const selectedProjectCode = ref('')
const availableProjects = ref([])

// 合约条款（从服务加载）
const contractTerms = ref({
  annualRate: 5.5,  // 年化利率
  loanTerm: 365,    // 贷款期限
  minSubscription: 100,    // 最小认购金额
  maxSubscription: 10000   // 最大认购金额
})

// 部署相关
const deploymentStatus = ref(false)
const deploymentLogs = ref([])
const deployedContracts = ref([])

// 交互相关
const contractAddresses = ref({
  lpt: '',
  lit: '',
  issuer: ''
})
const interactionStatus = ref(false)
const interactionLogs = ref([])
const balanceInfo = ref(null)

// 计算属性
const allAddressesSet = computed(() => {
  return contractAddresses.value.lpt && 
         contractAddresses.value.lit && 
         contractAddresses.value.issuer
})

const isFormValid = computed(() => {
  return subscriptionAmount.value >= contractTerms.value.minSubscription && 
         subscriptionAmount.value <= contractTerms.value.maxSubscription &&
         selectedProjectCode.value !== ''
})

// 方法
const connectWallet = async () => {
  try {
    loading.value = true
    error.value = ''
    await connect()
    successMessage.value = '钱包连接成功'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (err) {
    error.value = `连接失败: ${err.message}`
  } finally {
    loading.value = false
  }
}

const disconnectWallet = async () => {
  try {
    loading.value = true
    error.value = ''
    disconnect()
    successMessage.value = '钱包已断开'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (err) {
    error.value = `断开失败: ${err.message}`
  } finally {
    loading.value = false
  }
}

const addLog = (logs, message, type = 'info') => {
  logs.push({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
}

// 格式化数字显示
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

// 计算预计利息
const calculateInterest = () => {
  if (!subscriptionAmount.value) return '0.00'
  const interest = (subscriptionAmount.value * contractTerms.value.annualRate / 100 * contractTerms.value.loanTerm / 365)
  return formatNumber(interest)
}

// 获取选中项目的名称
const getSelectedProjectName = () => {
  const project = availableProjects.value.find(p => p.code === selectedProjectCode.value)
  return project ? project.name : ''
}

// 获取当前链ID
const getCurrentChainId = () => {
  if (chainId.value) {
    return chainId.value
  }
  
  // 如果钱包未连接，返回默认的测试网链ID
  // Sepolia 测试网: 11155111
  // 本地开发网络: 31337
  return 11155111 // 默认使用 Sepolia 测试网
}

// 合约部署功能已移除

// 加载可用项目列表
const loadAvailableProjects = async () => {
  try {
    const result = await contractTestService.getAvailableProjects()
    if (result.success) {
      availableProjects.value = result.projects
    }
  } catch (error) {
    console.error('加载项目列表失败:', error)
    // 使用默认项目列表
    availableProjects.value = [
      { code: 'RWA001', name: '悉尼住宅项目' },
      { code: 'RWA002', name: '墨尔本商业地产' },
      { code: 'RWA003', name: '布里斯班物流仓储' },
      { code: 'RWA004', name: '珀斯写字楼项目' },
      { code: 'RWA005', name: '阿德莱德工业地产' }
    ]
  }
}

const testContractInteraction = async () => {
  try {
    loading.value = true
    error.value = ''
    interactionStatus.value = true
    interactionLogs.value = []
    
    addLog(interactionLogs.value, '开始合约交互测试...', 'info')
    
    // 验证合约地址
    const validation = await contractTestService.validateContractAddresses(contractAddresses.value)
    if (!validation.success) {
      throw new Error(validation.message)
    }
    
    addLog(interactionLogs.value, '验证合约地址...', 'info')
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 调用合约测试服务
    const result = await contractTestService.testContractInteraction(contractAddresses.value, address.value)
    
    addLog(interactionLogs.value, '查询初始余额...', 'info')
    addLog(interactionLogs.value, `LPT: ${result.results.initialBalances.lpt}`, 'info')
    addLog(interactionLogs.value, `LIT: ${result.results.initialBalances.lit}`, 'info')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addLog(interactionLogs.value, '创建贷款...', 'info')
    addLog(interactionLogs.value, `贷款ID: ${result.results.loanCreated.loanId}`, 'info')
    addLog(interactionLogs.value, `本金: ${result.results.loanCreated.principalAmount} LPT`, 'info')
    addLog(interactionLogs.value, `利率: ${result.results.loanCreated.annualRate}`, 'info')
    await new Promise(resolve => setTimeout(resolve, 800))
    
    addLog(interactionLogs.value, '铸造利息币...', 'info')
    addLog(interactionLogs.value, `铸造数量: ${result.results.interestMinted.amount} LIT`, 'info')
    await new Promise(resolve => setTimeout(resolve, 800))
    
    addLog(interactionLogs.value, '用户赎回...', 'info')
    addLog(interactionLogs.value, `赎回 LPT: ${result.results.redemption.lptAmount}`, 'info')
    addLog(interactionLogs.value, `赎回 LIT: ${result.results.redemption.litAmount}`, 'info')
    await new Promise(resolve => setTimeout(resolve, 800))
    
    addLog(interactionLogs.value, '结清贷款...', 'info')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addLog(interactionLogs.value, '查询最终余额...', 'info')
    addLog(interactionLogs.value, `LPT: ${result.results.finalBalances.lpt}`, 'info')
    addLog(interactionLogs.value, `LIT: ${result.results.finalBalances.lit}`, 'info')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 显示交易哈希
    result.transactions.forEach(tx => {
      addLog(interactionLogs.value, `${tx.type}: ${tx.hash}`, 'info')
    })
    
    addLog(interactionLogs.value, '交互测试完成!', 'success')
    successMessage.value = '合约交互测试成功'
    setTimeout(() => { successMessage.value = '' }, 5000)
    
  } catch (err) {
    error.value = `交互测试失败: ${err.message}`
    addLog(interactionLogs.value, `测试失败: ${err.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const loadBalances = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // 调用合约测试服务查询余额
    const result = await contractTestService.getBalances(contractAddresses.value, address.value)
    
    balanceInfo.value = {
      lpt: result.balances.lpt,
      lit: result.balances.lit,
      eth: result.balances.eth
    }
    
    successMessage.value = '余额查询成功'
    setTimeout(() => { successMessage.value = '' }, 3000)
    
  } catch (err) {
    error.value = `余额查询失败: ${err.message}`
  } finally {
    loading.value = false
  }
}

const copyAddress = async (address) => {
  try {
    await navigator.clipboard.writeText(address)
    successMessage.value = '地址已复制到剪贴板'
    setTimeout(() => { successMessage.value = '' }, 2000)
  } catch (err) {
    error.value = '复制失败'
  }
}

// 组件挂载时加载已保存的合约地址、合约条款和项目列表
onMounted(async () => {
  const saved = localStorage.getItem('testContractAddresses')
  if (saved) {
    contractAddresses.value = JSON.parse(saved)
  }
  
  // 加载合约条款和项目列表
  await Promise.all([
    loadContractTerms(),
    loadAvailableProjects()
  ])
})

// 加载合约条款
const loadContractTerms = async () => {
  try {
    const result = await contractTestService.getContractTerms()
    if (result.success) {
      contractTerms.value = {
        annualRate: result.terms.annualRate,
        loanTerm: result.terms.loanTerm,
        minSubscription: result.terms.minSubscription,
        maxSubscription: result.terms.maxSubscription
      }
    }
  } catch (error) {
    console.error('加载合约条款失败:', error)
    // 使用默认值
    contractTerms.value = {
      annualRate: 5.5,
      loanTerm: 365
    }
  }
}

// 监听地址变化并保存
watch(contractAddresses, (newVal) => {
  localStorage.setItem('testContractAddresses', JSON.stringify(newVal))
}, { deep: true })
</script>

<style scoped>
.test-contract-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #0f172a;
  min-height: 100vh;
  color: #ffffff;
}

.test-header {
  text-align: center;
  margin-bottom: 30px;
}

.test-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.test-header p {
  color: #94a3b8;
  font-size: 1.1rem;
}

.connection-status {
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.status-value {
  font-weight: 600;
  font-size: 1rem;
}

.status-value.connected {
  color: #10b981;
}

.status-value.disconnected {
  color: #ef4444;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.primary {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #ea580c, #dc2626);
  transform: translateY(-2px);
}

.btn.secondary {
  background: #374151;
  color: white;
  border: 1px solid #4b5563;
}

.btn.secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn.small {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.test-section {
  background: #1e293b;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
}

.test-section h2 {
  color: #f97316;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.deploy-controls, .test-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group label {
  color: #e2e8f0;
  font-weight: 600;
}

.address-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.input-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-item label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.address-input {
  padding: 10px 15px;
  border: 1px solid #4b5563;
  border-radius: 8px;
  background: #0f172a;
  color: #ffffff;
  font-size: 0.9rem;
}

.address-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.deployment-status, .interaction-status {
  background: #0f172a;
  border-radius: 8px;
  padding: 20px;
}

.deployment-status h3, .interaction-status h3 {
  color: #e2e8f0;
  margin-bottom: 15px;
}

.status-log {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  display: flex;
  gap: 15px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.log-item.info {
  background: #1e40af20;
  border-left: 3px solid #3b82f6;
}

.log-item.success {
  background: #10b98120;
  border-left: 3px solid #10b981;
}

.log-item.error {
  background: #ef444420;
  border-left: 3px solid #ef4444;
}

.log-time {
  color: #94a3b8;
  font-size: 0.8rem;
  min-width: 80px;
}

.log-message {
  color: #e2e8f0;
  flex: 1;
}

.deployed-contracts, .balance-info {
  background: #0f172a;
  border-radius: 8px;
  padding: 20px;
}

.deployed-contracts h3, .balance-info h3 {
  color: #e2e8f0;
  margin-bottom: 15px;
}

.contract-list, .balance-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contract-item, .balance-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: #1e293b;
  border-radius: 8px;
  gap: 15px;
}

.contract-name, .balance-label {
  font-weight: 600;
  color: #e2e8f0;
}

.contract-address, .balance-value {
  color: #94a3b8;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  flex: 1;
  text-align: center;
}

.error-message, .success-message {
  background: #1e293b;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.error-message {
  border-left: 4px solid #ef4444;
}

.error-message h3 {
  color: #ef4444;
  margin-bottom: 10px;
}

.success-message {
  border-left: 4px solid #10b981;
}

.success-message h3 {
  color: #10b981;
  margin-bottom: 10px;
}

.error-message p, .success-message p {
  color: #e2e8f0;
  margin: 0;
}

/* 认购表单样式 */
.subscription-form {
  background: #0f172a;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #e2e8f0;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input, .text-input, .select-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #374151;
  border-radius: 8px;
  background: #1e293b;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.amount-input:focus, .text-input:focus, .select-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.currency-symbol {
  position: absolute;
  right: 15px;
  color: #94a3b8;
  font-weight: 600;
  pointer-events: none;
}

.input-hint {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-top: 5px;
}

.display-value {
  background: #1e293b;
  border: 2px solid #374151;
  border-radius: 8px;
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.value-text {
  color: #f97316;
  font-weight: 700;
  font-size: 1.1rem;
}

.value-description {
  color: #94a3b8;
  font-size: 0.8rem;
}

/* 项目选择样式 */
.select-input {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select-input option {
  background: #1e293b;
  color: #e2e8f0;
  padding: 8px 12px;
}

.select-input:focus {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23f97316' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
}

.subscription-summary {
  background: #1e293b;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  border-left: 4px solid #f97316;
}

.subscription-summary h3 {
  color: #f97316;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #374151;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.summary-value {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.9rem;
}

.buy-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 15px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

.buy-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.buy-btn:disabled {
  background: #6b7280;
  box-shadow: none;
  transform: none;
}

.button-hint {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 8px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-contract-container {
    padding: 15px;
  }
  
  .connection-status {
    flex-direction: column;
    gap: 15px;
  }
  
  .address-inputs {
    grid-template-columns: 1fr;
  }
  
  .contract-item, .balance-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .contract-address, .balance-value {
    text-align: left;
  }
  
  .subscription-form {
    padding: 20px;
  }
  
  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .summary-value {
    text-align: left;
  }
}

/* 移除通知样式 */
.removed-notice {
  text-align: center;
  padding: 20px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  margin: 20px 0;
}

.removed-notice p {
  color: #f87171;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
</style> -->
