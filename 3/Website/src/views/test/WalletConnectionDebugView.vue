<template>
  <div class="wallet-connection-debug">
    <h1>🔍 Wallet Connection Debug</h1>
    <p>调试Connect MetaMask按钮功能和钱包连接状态</p>
    
    <!-- 状态显示 -->
    <div class="debug-section">
      <h2>📊 当前状态</h2>
      <div class="status-grid">
        <div class="status-item">
          <label>connected:</label>
          <span :class="connected ? 'success' : 'error'">{{ connected }}</span>
        </div>
        <div class="status-item">
          <label>address:</label>
          <span class="value">{{ address || 'null' }}</span>
        </div>
        <div class="status-item">
          <label>fullAddress:</label>
          <span class="value">{{ fullAddress || 'null' }}</span>
        </div>
        <div class="status-item">
          <label>selectedAccount:</label>
          <span class="value">{{ selectedAccount || 'null' }}</span>
        </div>
        <div class="status-item">
          <label>accounts:</label>
          <span class="value">{{ JSON.stringify(accounts) }}</span>
        </div>
        <div class="status-item">
          <label>chainId:</label>
          <span class="value">{{ chainId || 'null' }}</span>
        </div>
        <div class="status-item">
          <label>networkLabel:</label>
          <span class="value">{{ networkLabel || 'null' }}</span>
        </div>
        <div class="status-item">
          <label>error:</label>
          <span class="error">{{ error || 'null' }}</span>
        </div>
        <div class="status-item">
          <label>warning:</label>
          <span class="warning">{{ warning || 'null' }}</span>
        </div>
      </div>
    </div>

    <!-- 环境检查 -->
    <div class="debug-section">
      <h2>🌐 环境检查</h2>
      <div class="status-grid">
        <div class="status-item">
          <label>window.ethereum:</label>
          <span :class="windowEthereum ? 'success' : 'error'">{{ windowEthereum ? '存在' : '不存在' }}</span>
        </div>
        <div class="status-item">
          <label>isMetaMask:</label>
          <span :class="isMetaMask ? 'success' : 'error'">{{ isMetaMask ? '是' : '否' }}</span>
        </div>
        <div class="status-item">
          <label>当前URL:</label>
          <span class="value">{{ currentUrl }}</span>
        </div>
      </div>
    </div>

    <!-- 按钮测试 -->
    <div class="debug-section">
      <h2>🔘 按钮测试</h2>
      <div class="button-grid">
        <button @click="testConnect" class="test-btn primary">测试 Connect</button>
        <button @click="testDisconnect" class="test-btn secondary">测试 Disconnect</button>
        <button @click="refreshStatus" class="test-btn info">刷新状态</button>
        <button @click="clearLogs" class="test-btn warning">清空日志</button>
      </div>
    </div>

    <!-- 显示逻辑测试 -->
    <div class="debug-section">
      <h2>🎭 显示逻辑测试</h2>
      <div class="logic-tests">
        <div class="logic-item">
          <label>应该显示Connect按钮:</label>
          <span :class="shouldShowConnectButton ? 'success' : 'error'">
            {{ shouldShowConnectButton ? '是' : '否' }}
          </span>
        </div>
        <div class="logic-item">
          <label>应该显示连接状态:</label>
          <span :class="shouldShowConnectedStatus ? 'success' : 'error'">
            {{ shouldShowConnectedStatus ? '是' : '否' }}
          </span>
        </div>
        <div class="logic-item">
          <label>应该显示钱包地址:</label>
          <span :class="shouldShowWalletAddress ? 'success' : 'error'">
            {{ shouldShowWalletAddress ? '是' : '否' }}
          </span>
        </div>
        <div class="logic-item">
          <label>应该显示Wallet Management:</label>
          <span :class="shouldShowWalletManagement ? 'success' : 'error'">
            {{ shouldShowWalletManagement ? '是' : '否' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 操作日志 -->
    <div class="debug-section">
      <h2>📝 操作日志</h2>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
        <div v-if="logs.length === 0" class="no-logs">暂无日志</div>
      </div>
    </div>

    <!-- 模拟Connect按钮 -->
    <div class="debug-section">
      <h2>🎯 模拟Connect按钮</h2>
      <div class="mock-button-container">
        <button 
          v-if="!connected || !selectedAccount" 
          class="mock-connect-btn"
          @click="mockConnectClick"
          @mousedown="mockMousedown"
        >
          Connect MetaMask
        </button>
        <div v-else class="mock-connected-state">
          <span class="mock-address">{{ selectedAccount }}</span>
          <button class="mock-copy-btn" @click="mockCopy">Copy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useWallet } from '@/composables/useWallet'

// 使用钱包组合式函数
const {
  connected,
  address,
  fullAddress,
  chainId,
  networkLabel,
  error,
  warning,
  connect,
  disconnect
} = useWallet()

// 本地状态
const selectedAccount = ref('')
const accounts = ref([])
const logs = ref([])

// 环境检查
const windowEthereum = ref(false)
const isMetaMask = ref(false)
const currentUrl = ref('')

// 计算属性
const shouldShowConnectButton = computed(() => {
  return !connected.value || !selectedAccount.value
})

const shouldShowConnectedStatus = computed(() => {
  return connected.value && selectedAccount.value
})

const shouldShowWalletAddress = computed(() => {
  return !!selectedAccount.value
})

const shouldShowWalletManagement = computed(() => {
  return connected.value
})

// 监听状态变化
watch(fullAddress, (newAddr) => {
  addLog('info', `fullAddress changed: ${newAddr || 'null'}`)
  if (newAddr && !accounts.value.includes(newAddr)) {
    accounts.value.push(newAddr)
    selectedAccount.value = newAddr
    addLog('success', `Added new account: ${newAddr}`)
  }
})

watch(connected, (isConnected) => {
  addLog('info', `connected changed: ${isConnected}`)
  if (!isConnected) {
    selectedAccount.value = ''
    accounts.value = []
    addLog('warning', 'Wallet disconnected, cleared accounts')
  }
})

watch(selectedAccount, (newAccount) => {
  addLog('info', `selectedAccount changed: ${newAccount || 'null'}`)
})

// 初始化
onMounted(() => {
  addLog('info', 'Component mounted')
  
  // 环境检查
  windowEthereum.value = !!window.ethereum
  isMetaMask.value = window.ethereum?.isMetaMask || false
  currentUrl.value = window.location.href
  
  // 检查初始状态
  addLog('info', `Initial state - connected: ${connected.value}, fullAddress: ${fullAddress.value}`)
  
  if (connected.value && fullAddress.value) {
    selectedAccount.value = fullAddress.value
    if (!accounts.value.includes(fullAddress.value)) {
      accounts.value.push(fullAddress.value)
    }
    addLog('success', 'Wallet already connected, initialized state')
  } else {
    addLog('info', 'Wallet not connected, showing connect button')
  }
})

// 测试函数
async function testConnect() {
  addLog('info', 'Testing connect function...')
  try {
    await connect()
    addLog('success', 'Connect function completed successfully')
  } catch (error) {
    addLog('error', `Connect function failed: ${error.message}`)
  }
}

async function testDisconnect() {
  addLog('info', 'Testing disconnect function...')
  try {
    disconnect()
    addLog('success', 'Disconnect function completed')
  } catch (error) {
    addLog('error', `Disconnect function failed: ${error.message}`)
  }
}

function refreshStatus() {
  addLog('info', 'Refreshing status...')
  // 重新检查环境
  windowEthereum.value = !!window.ethereum
  isMetaMask.value = window.ethereum?.isMetaMask || false
  addLog('info', 'Status refreshed')
}

function clearLogs() {
  logs.value = []
  addLog('info', 'Logs cleared')
}

function mockConnectClick() {
  addLog('info', 'Mock Connect button clicked')
  testConnect()
}

function mockMousedown() {
  addLog('info', 'Mock Connect button mousedown')
}

function mockCopy() {
  if (selectedAccount.value) {
    navigator.clipboard.writeText(selectedAccount.value)
    addLog('success', 'Address copied to clipboard')
  }
}

function addLog(type, message) {
  logs.value.unshift({
    type,
    message,
    time: new Date().toLocaleTimeString()
  })
  
  // 限制日志数量
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}
</script>

<style scoped>
.wallet-connection-debug {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #1a1a2e;
  color: #e0e0e0;
  border-radius: 8px;
}

.wallet-connection-debug h1 {
  color: #f59e0b;
  text-align: center;
  margin-bottom: 10px;
}

.debug-section {
  background: #16213e;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
  margin-bottom: 25px;
}

.debug-section h2 {
  color: #f59e0b;
  margin-bottom: 15px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #0f3460;
  border-radius: 6px;
  border: 1px solid #2a2a4a;
}

.status-item label {
  font-weight: 600;
  color: #94a3b8;
}

.status-item span.value {
  color: #ffffff;
  font-family: monospace;
  word-break: break-all;
}

.status-item span.success {
  color: #10b981;
  font-weight: bold;
}

.status-item span.error {
  color: #ef4444;
  font-weight: bold;
}

.status-item span.warning {
  color: #f59e0b;
  font-weight: bold;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.test-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.test-btn.primary {
  background: #3b82f6;
  color: white;
}

.test-btn.secondary {
  background: #475569;
  color: white;
}

.test-btn.info {
  background: #06b6d4;
  color: white;
}

.test-btn.warning {
  background: #f59e0b;
  color: white;
}

.test-btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.logic-tests {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.logic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #0f3460;
  border-radius: 6px;
  border: 1px solid #2a2a4a;
}

.logic-item label {
  font-weight: 600;
  color: #94a3b8;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #0f3460;
  border-radius: 6px;
  padding: 15px;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #2a2a4a;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #94a3b8;
  font-size: 12px;
  min-width: 80px;
}

.log-message {
  flex: 1;
  font-size: 14px;
}

.log-item.success .log-message {
  color: #10b981;
}

.log-item.error .log-message {
  color: #ef4444;
}

.log-item.warning .log-message {
  color: #f59e0b;
}

.log-item.info .log-message {
  color: #3b82f6;
}

.no-logs {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 20px;
}

.mock-button-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.mock-connect-btn {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.mock-connect-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.mock-connected-state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border-radius: 8px;
}

.mock-address {
  font-family: monospace;
  font-size: 14px;
}

.mock-copy-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.mock-copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .button-grid {
    grid-template-columns: 1fr;
  }
}
</style>
