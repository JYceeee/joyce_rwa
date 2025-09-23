<template>
  <!-- 设置主账号弹窗 -->
  <!-- <div v-if="showPrimaryModal" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h2 style="margin-bottom:8px;color:#ffffff;">Set Primary Wallet</h2>
        <p style="color:#ffffff;">Select the wallet account you want to set as primary:</p>
        <div style="margin:16px 0;">
          <select v-model="primaryCandidate" style="width:100%;height:38px;font-size:15px;border-radius:8px;background:#1d1d36;color:#ffffff;border:1px solid #2a2a4a;padding:0 8px;">
            <option v-for="acc in accounts" :key="acc" :value="acc" style="background:#1d1d36;color:#ffffff;">{{ acc }}</option>
          </select>
        </div>
        <div style="text-align:right;">
          <button class="mm-btn mm-outline" @click="showPrimaryModal=false">Cancel</button>
          <button class="mm-btn mm-outline" style="margin-left:8px;" @click="setPrimaryWallet">Confirm</button>
        </div>
      </div>
    </div>
  </div> -->
  <!-- 解绑账号弹窗 -->
  <div v-if="showDisconnectModal" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h2 style="margin-bottom:8px;color:#ffffff;">Disconnect Wallet</h2>
        <p style="color:#ffffff;">Select the wallet account you want to disconnect:</p>
        <div style="margin:16px 0;">
          <span style="display:block;font-size:15px;padding:8px 0;color:#ffffff;background:#2a2a4a;border-radius:8px;">{{ selectedAccount }}</span>
        </div>
        <div style="text-align:right;">
          <button class="mm-btn mm-outline" @click="showDisconnectModal=false">Cancel</button>
          <button class="mm-btn mm-outline" style="margin-left:8px;" @click="disconnectAccount">Confirm</button>
        </div>
      </div>
    </div>
  </div>
  <!-- 解绑成功弹窗 -->
  <div v-if="showDisconnectSuccess" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h2 style="margin-bottom:8px;color:#ffffff;">Wallet Disconnected</h2>
        <p style="color:#ffffff;">{{ disconnectSuccessMsg }}</p>
        <div style="text-align:right;">
          <button class="mm-btn mm-outline" @click="showDisconnectSuccess=false">Confirm</button>
        </div>
      </div>
    </div>
  </div>

  <!--Primary Section-->
<div class="mm-page">
  <!-- Account Section -->
  <section class="mm-account-section">
    <header class="mm-topbar">
      <div class="mm-account">
        <div class="mm-avatar"></div>
        <div class="mm-account-meta">
          <div class="mm-account-title">Account</div>
          <div class="mm-account-line">
            <template v-if="selectedAccount">
              <span class="mm-addr" :title="selectedAccount">{{ selectedAccount }}</span>
              <button v-if="connected" class="mm-btn mm-outline mm-copy" @click="onCopy">Copy</button>
            </template>
            <template v-else>
              <span class="mm-addr" style="color:#b45309;">please connect your wallet in wallet management</span>
            </template>
          </div>
          <div v-if="connected && selectedAccount" class="mm-status" style="margin-top:6px;">
            <span class="mm-dot"></span>
            <span class="mm-status-text">Connected</span>
          </div>
          <button v-else class="mm-btn mm-outline" style="margin-top:6px;" @click="connect">Connect MetaMask</button>
        </div>
      </div>
    </header>
  </section>

  <!-- Wallet Management Section -->
  <section v-if="connected" class="mm-wallet-management-section">
    <div class="mm-wallet-management">
      <div class="field">
        <label class="mm-net-left">Wallet Management</label>
        <div class="input with-icon" style="display:flex;align-items:center;gap:8px;">
          <span class="icon" style="width:28px;height:28px;border-radius:10px;background:#fff;display:grid;place-items:center;box-shadow:0 2px 6px rgba(15,23,42,.06), inset 0 0 0 1px #e2e8f0;">
            <svg viewBox="0 0 24 24" class="i" style="width:18px;height:18px;fill:currentColor;color:#0f172a;">
              <path d="M3 7a3 3 0 0 1 3-3h12a1 1 0 1 1 0 2H6a1 1 0 0 0-1 1v1h13a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7Zm18 6h-4a2 2 0 1 0 0 4h4v-4Z"/>
            </svg>
          </span>
          <select v-model="walletAction" style="border:0;outline:none;width:180px;height:38px;background:#1d1d36;color:#ffffff;border-radius:8px;padding:0 8px;">
            <option value="" disabled style="background:#1d1d36;color:#94a3b8;">Choose…</option>
            <!-- <option value="link" style="background:#1d1d36;color:#ffffff;">Link new wallet</option> -->
            <!-- <option value="set-primary" style="background:#1d1d36;color:#ffffff;">Set primary wallet</option> -->
            <option value="disconnect" style="background:#1d1d36;color:#ffffff;">Disconnect my wallet</option>
          </select>
          <template v-if="walletAction==='set-primary'||walletAction==='disconnect'">
            <select v-model="selectedAccount" style="border:1px solid #2a2a4a;outline:none;width:180px;height:38px;background:#1d1d36;color:#ffffff;font-size:15px;border-radius:8px;padding:0 8px;">
              <option v-for="acc in accounts" :key="acc" :value="acc" style="background:#1d1d36;color:#ffffff;">{{ acc }}</option>
            </select>
            <button class="mm-btn mm-outline" style="margin-left:8px;" @click="onWalletConfirm">Confirm</button>
          </template>
          <template v-if="walletAction==='link'">
            <input v-model="manualWalletInput" class="mm-input" placeholder="Paste new wallet address" style="width:180px;margin-left:8px;background:#1d1d36;color:#ffffff;border-color:#2a2a4a;" />
            <button class="mm-btn mm-outline" style="margin-left:8px;" @click="onManualWalletConfirm">Confirm</button>
          </template>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Dashboard Section -->
  <section v-if="connected && selectedAccount" class="mm-dashboard-section">
    <!-- 资产标题区 -->
    <div class="mm-hero">
      <div class="mm-balance">{{ bigAudDisplay }}</div>
      <div class="mm-subline">
        <!-- <span>+A$0 (+0.00%)</span> 需要修改为投资累计余额的动态数据 -->
        <a href="#" @click.prevent="$router.push('/portfolio')" class="mm-link">Portfolio ↗</a>
      </div>
    </div>
    <!-- 操作按钮：一行五个 -->
    <!-- <div class="mm-actions">
      <button class="mm-action" @click="$router.push('/buy-sell')">
        <span class="mm-action-icon">⇄</span>
        <span class="mm-action-text">Buy & Sell</span>
      </button>
      <button class="mm-action" @click="$router.push('/swap')">
        <span class="mm-action-icon">⟲</span>
        <span class="mm-action-text">Swap</span>
      </button>
      <button class="mm-action" @click="$router.push('/bridge')">
        <span class="mm-action-icon">⛓</span>
        <span class="mm-action-text">Bridge</span>
      </button>
      <button class="mm-action" @click="$router.push('/send')">
        <span class="mm-action-icon">↑</span>
        <span class="mm-action-text">Send</span>
      </button>
      <button class="mm-action" @click="$router.push('/receive')">
        <span class="mm-action-icon">↓</span>
        <span class="mm-action-text">Receive</span>
      </button>
    </div> -->
    <!-- 自定义代币输入 -->
    <div class="mm-custom">
      <span class="mm-net-left">Insert your contract address here:</span>
      <form class="mm-custom-form" @submit.prevent="addToken">
        <input v-model="customAddress" class="mm-input" placeholder="Paste ERC20 contract address" />
        <input v-model="customLabel" class="mm-input" placeholder="Label (optional)" />
        <button class="mm-btn mm-outline" type="submit" :disabled="!customAddress">Add Token</button>
        <button class="mm-btn mm-outline" type="button" @click="refreshTokens">Refresh</button>
      </form>
    </div>
    <!-- 信息条：网络 / 原生余额 -->
    <div class="mm-info">
      <div class="mm-card">
        <div class="mm-card-label">Current Network</div>
        <div class="mm-card-title">{{ networkLabel }}</div>
        <div class="mm-card-sub">Chain ID: {{ chainId }}</div>
      </div>
      <div class="mm-card">
        <div class="mm-card-label">Native Balance</div>
        <div class="mm-card-title">{{ nativeBalanceDisplay }} {{ nativeSymbol }}</div>
        <div class="mm-card-sub">≈ {{ nativeToAudDisplay || 0 }} AUD</div>
      </div>
    </div>
    <!-- Tabs -->
    <nav class="mm-tabs">
      <button
        class="mm-tab"
        :class="{ 'is-active': activeTab==='tokens' }"
        @click="activeTab='tokens'"
      >Tokens</button>
      <!-- <button
        class="mm-tab"
        :class="{ 'is-active': activeTab==='nfts' }"
        @click="activeTab='nfts'"
      >NFTs</button> -->
      <button
        class="mm-tab"
        :class="{ 'is-active': activeTab==='activity' }"
        @click="activeTab='activity'"
      >Activity</button>
    </nav>
    <!-- 网络栏 -->
    <div class="mm-networkbar">
      <div class="mm-net-left">
        {{ networkLabel }}
      </div>
      <div class="mm-net-right" style="position:relative;">
        <button class="mm-btn mm-outline" @click="toggleSortMenu" style="height:28px;padding:2px 10px;">Sort</button>
        <div v-if="sortOpen" class="mm-sort-menu">
          <button class="mm-sort-item" :class="{active: sortOrder==='desc'}" @click="setSort('desc')">descending by balance</button>
          <button class="mm-sort-item" :class="{active: sortOrder==='asc'}" @click="setSort('asc')">ascending by balance</button>
        </div>
      </div>
    </div>
    <!-- Tokens 列表 -->
      <div v-if="activeTab==='tokens'" class="mm-tokenlist" style="background:#1d1d36;">
      <div class="mm-token">
        <div class="mm-token-left">
          <div class="mm-token-icon mm-eth"></div>
          <div>
            <div class="mm-token-title">
              SepoliaETH 
              <!-- <span class="mm-dim"></span> -->
            </div>
            <!-- <div class="mm-rise">+2.48%</div> -->
          </div>
        </div>
        <div class="mm-token-right">
          <div class="mm-token-sub">{{ nativeBalanceDisplay }} {{ nativeSymbol }}</div>
          <div class="mm-token-amount">A${{ nativeToAudDisplay || 0 }}</div>
        </div>
      </div>
      <div v-for="t in sortedTokens" :key="t.address" class="mm-token" @click="$router.push({ name: 'tokenDetail', params: { address: t.address } })">
        <div class="mm-token-left">
          <div class="mm-token-icon">{{ (t.symbol || 'T').slice(0,1) }}</div>
          <div>
          <div class="mm-token-sub">{{ t.symbol }}</div>
            <div class="mm-token-title">{{ t.symbol || 'Token' }}</div>
            <div class="mm-token-sub">{{ t.name }}</div>
          </div>
        </div>
        <div class="mm-token-right">
          <div class="mm-token-sub">{{ t.symbol }}</div>
          <div class="mm-token-amount">{{ t.displayBalance }}</div>
        </div>
      </div>
      <div class="mm-token-footer">
      </div>
    </div>
  </section>

  <!-- Activity 页签 -->
  <div v-if="activeTab==='activity'" class="mm-activity-section">
    <div class="mm-activity-header">
      <h3>Wallet Activity Log</h3>
      <div class="mm-activity-actions">
        <button class="mm-btn mm-outline" @click="logCurrentWalletStatus" :disabled="!connected">
          📝 Log Status
        </button>
        <button class="mm-btn mm-outline" @click="refreshActivity" :disabled="loadingActivity">
          <span v-if="loadingActivity">🔄</span>
          <span v-else>Refresh</span>
        </button>
      </div>
    </div>
    
    <div v-if="loadingActivity" class="mm-loading">
      <div class="mm-spinner"></div>
      <span>Loading activity...</span>
    </div>
    
    <div v-else-if="walletActivity.length === 0" class="mm-no-activity">
      <div class="mm-no-activity-icon">📋</div>
      <p>No transaction activity found</p>
      <p class="mm-no-activity-sub">Your recent transactions will appear here</p>
    </div>
    
    <div v-else class="mm-activity-list">
      <div v-for="activity in walletActivity" :key="activity.id" class="mm-activity-item">
        <div class="mm-activity-header-item">
          <div class="mm-activity-type" :class="activity.type">
            <span class="mm-activity-icon">
              {{ getActivityIcon(activity.type) }}
            </span>
            <span class="mm-activity-title">{{ getActivityTitle(activity.type) }}</span>
          </div>
          <div class="mm-activity-time">{{ formatTime(activity.timestamp) }}</div>
        </div>
        
        <div class="mm-activity-details">
          <!-- 交易类型活动 -->
          <div v-if="activity.type === 'buy' || activity.type === 'sell'" class="mm-activity-project">
            <span class="mm-activity-label">Project:</span>
            <span class="mm-activity-value">{{ activity.project_code }} - {{ activity.project_name }}</span>
          </div>
          <div v-if="activity.type === 'buy' || activity.type === 'sell'" class="mm-activity-amount">
            <span class="mm-activity-label">Amount:</span>
            <span class="mm-activity-value">{{ activity.amount }} tokens</span>
          </div>
          
          <!-- 钱包连接/断开活动 -->
          <div v-if="activity.type === 'wallet_connect' || activity.type === 'wallet_disconnect'" class="mm-activity-wallet">
            <span class="mm-activity-label">Wallet Address:</span>
            <span class="mm-activity-value">{{ formatAddress(activity.wallet_address) }}</span>
          </div>
          
          <!-- 网络变化活动 -->
          <div v-if="activity.type === 'network_change'" class="mm-activity-network">
            <span class="mm-activity-label">Network:</span>
            <span class="mm-activity-value">{{ activity.network_name }}</span>
          </div>
          <div v-if="activity.type === 'network_change'" class="mm-activity-network-id">
            <span class="mm-activity-label">Chain ID:</span>
            <span class="mm-activity-value">{{ activity.network_id }}</span>
          </div>
          
          <!-- MetaMask连接活动 -->
          <div v-if="activity.type === 'metamask_connect' || activity.type === 'metamask_disconnect'" class="mm-activity-metamask">
            <span class="mm-activity-label">Extension:</span>
            <span class="mm-activity-value">MetaMask</span>
          </div>
          <div v-if="activity.type === 'metamask_connect' && activity.chain_id" class="mm-activity-chain">
            <span class="mm-activity-label">Chain ID:</span>
            <span class="mm-activity-value">{{ activity.chain_id }}</span>
          </div>
          <div v-if="activity.type === 'metamask_disconnect' && activity.error" class="mm-activity-error">
            <span class="mm-activity-label">Error:</span>
            <span class="mm-activity-value">{{ activity.error }}</span>
          </div>
          
          <!-- 状态检查活动 -->
          <div v-if="activity.type === 'wallet_status_check' || activity.type === 'wallet_focus_check'" class="mm-activity-status">
            <span class="mm-activity-label">Status:</span>
            <span class="mm-activity-value">Checked</span>
          </div>
          <div v-if="activity.type === 'wallet_status_check' || activity.type === 'wallet_focus_check'" class="mm-activity-wallet">
            <span class="mm-activity-label">Wallet:</span>
            <span class="mm-activity-value">{{ formatAddress(activity.wallet_address) }}</span>
          </div>
          
          <!-- 消息活动 -->
          <div v-if="activity.type === 'metamask_message'" class="mm-activity-message">
            <span class="mm-activity-label">Message Type:</span>
            <span class="mm-activity-value">{{ activity.message_type }}</span>
          </div>
          
          <!-- 通用消息显示 -->
          <div v-if="activity.message" class="mm-activity-message-text">
            <span class="mm-activity-label">Message:</span>
            <span class="mm-activity-value">{{ activity.message }}</span>
          </div>
          
          <!-- Etherscan详情 -->
          <div v-if="activity.etherscan" class="mm-activity-etherscan">
            <div class="mm-activity-etherscan-info">
              <span class="mm-activity-label">From:</span>
              <span class="mm-activity-value">{{ formatAddress(activity.etherscan.from) }}</span>
            </div>
            <div class="mm-activity-etherscan-info">
              <span class="mm-activity-label">To:</span>
              <span class="mm-activity-value">{{ formatAddress(activity.etherscan.to) }}</span>
            </div>
            <div class="mm-activity-etherscan-info">
              <span class="mm-activity-label">Value:</span>
              <span class="mm-activity-value">{{ formatEtherValue(activity.etherscan.value) }} ETH</span>
            </div>
            <div class="mm-activity-etherscan-info">
              <span class="mm-activity-label">Gas:</span>
              <span class="mm-activity-value">{{ activity.etherscan.gasUsed ? parseInt(activity.etherscan.gasUsed, 16).toLocaleString() : 'N/A' }}</span>
            </div>
            <div class="mm-activity-etherscan-info">
              <span class="mm-activity-label">Block:</span>
              <span class="mm-activity-value">{{ activity.etherscan.blockNumber ? parseInt(activity.etherscan.blockNumber, 16).toLocaleString() : 'N/A' }}</span>
            </div>
            <div class="mm-activity-etherscan-info">
              <span class="mm-activity-label">Status:</span>
              <span class="mm-activity-value" :class="{ 'mm-status-success': activity.etherscan.status === '0x1', 'mm-status-failed': activity.etherscan.status === '0x0' }">
                {{ activity.etherscan.status === '0x1' ? 'Success' : activity.etherscan.status === '0x0' ? 'Failed' : 'Pending' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Etherscan链接 -->
        <div v-if="activity.etherscan && activity.etherscan.etherscanUrl" class="mm-activity-footer">
          <a :href="activity.etherscan.etherscanUrl" 
             target="_blank" 
             class="mm-etherscan-link">
            🔗 View on Etherscan
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- 提示/错误 -->
  <p v-if="warning" class="mm-warn">{{ warning }}</p>
  <p v-if="error" class="mm-error">{{ error }}</p>
</div>
<transition name="fade">
  <div v-if="copied" class="mm-toast">Copied</div>
</transition>
</template>

<script setup>
// 弹窗状态
const showPrimaryModal = ref(false)
const showDisconnectModal = ref(false)
const showDisconnectSuccess = ref(false)
const primaryCandidate = ref('')
const disconnectCandidate = ref('')
const disconnectSuccessMsg = ref('')

import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'
import { ethers } from 'ethers'
import { useWallet } from '/src/composables/useWallet'

const {
connected, address, fullAddress,
chainId, networkLabel, nativeSymbol,
nativeBalanceDisplay, nativeToAudDisplay, bigAudDisplay,
tokens, warning, error, loadingTokens,
activeTab, connect, disconnect, refreshTokens, copyAddress,
addCustomToken
} = useWallet()

// Wallet Management 相关
import { watch } from 'vue'
// 动态账户列表，初始为当前 fullAddress
const accounts = ref([fullAddress.value])
const selectedAccount = ref(fullAddress.value)
const walletAction = ref('')

// Activity 相关
const walletActivity = ref([])
const loadingActivity = ref(false)

// 监听 fullAddress 变化，自动添加到 accounts 列表（避免重复）
watch(fullAddress, (newAddr) => {
if (newAddr && !accounts.value.includes(newAddr)) {
  accounts.value.push(newAddr)
  selectedAccount.value = newAddr
}
})

function onWalletConfirm() {
if (walletAction.value === 'set-primary') {
  primaryCandidate.value = selectedAccount.value
  showPrimaryModal.value = true
  return
}
if (walletAction.value === 'disconnect') {
  disconnectCandidate.value = selectedAccount.value
  showDisconnectModal.value = true
  return
}
if (walletAction.value === 'link') {
  // 绑定新钱包逻辑
  if (!window.ethereum) {
    warning.value = 'MetaMask not detected.'
    return
  }
  window.ethereum.request({ method: 'eth_requestAccounts' })
    .then((accs) => {
      if (accs && accs.length > 0) {
        const newAddr = accs[0]
        if (!accounts.value.includes(newAddr)) {
          accounts.value.push(newAddr)
          selectedAccount.value = newAddr
          address.value = newAddr
          warning.value = `New wallet ${newAddr} linked and selected.`
        } else {
          selectedAccount.value = newAddr
          address.value = newAddr
          warning.value = `Wallet ${newAddr} already linked. Switched to it.`
        }
      }
    })
    .catch((err) => {
      warning.value = normalizeErr(err)
    })
  return
}
// 切换账户演示
if (selectedAccount.value) {
  address.value = selectedAccount.value
  warning.value = `Dashboard now shows info for ${selectedAccount.value}`
}
}

function setPrimaryWallet() {
if (primaryCandidate.value) {
  // 设置主账号（这里只是演示，实际可存储到后端或本地）
  selectedAccount.value = primaryCandidate.value
  address.value = primaryCandidate.value
  showPrimaryModal.value = false
  warning.value = `Primary wallet set to ${primaryCandidate.value}`
}
}

function disconnectAccount() {
if (disconnectCandidate.value) {
  // 解绑账号（演示：从 accounts 列表移除）
  const idx = accounts.value.indexOf(disconnectCandidate.value)
  if (idx !== -1) {
    accounts.value.splice(idx, 1)
    // 如果解绑的是当前选中账号，则清空并提示
    if (selectedAccount.value === disconnectCandidate.value) {
      selectedAccount.value = ''
      address.value = ''
      warning.value = ''
    }
    showDisconnectModal.value = false
    disconnectSuccessMsg.value = `Wallet ${disconnectCandidate.value} disconnected.`
    showDisconnectSuccess.value = true
  }
}
}
const TOKENS_BY_CHAIN = {
1: [
  { address: '0xYOUR_PWLP_MAINNET', label: 'PWL-P' }, // ← 填主网 PWL-P 地址
  { address: '0xYOUR_PWLI_MAINNET', label: 'PWL-I' }, // ← 填主网 PWL-I 地址
],
11155111: [
  { address: '0xYOUR_PWLP_SEPOLIA', label: 'PWL-P' },
  { address: '0xYOUR_PWLI_SEPOLIA', label: 'PWL-I' },
],
}

const ERC20_ABI = [
'function balanceOf(address) view returns (uint256)',
'function decimals() view returns (uint8)',
'function symbol() view returns (string)',
'function name() view returns (string)',
]

let provider = null
let signer = null
let blockListenerAttached = false
let blockHandler = null

// toast: 复制成功提示
const copied = ref(false)
function onCopy(){
try { copyAddress() } finally {
  copied.value = true
  setTimeout(() => { copied.value = false }, 3000)
}
}

async function refreshAll() {
if (!connected.value) return
await refreshNetwork()
await refreshNative()
await refreshTokens()
}
async function refreshNetwork() {
const net = await provider.getNetwork()
chainId.value = Number(net.chainId)
networkLabel.value = net.name && net.name !== 'unknown' ? cap(net.name) : `Chain ${chainId.value}`
nativeSymbol.value =
  chainId.value === 1 ? 'ETH' :
  chainId.value === 137 ? 'MATIC' :
  chainId.value === 42161 ? 'ETH' :
  chainId.value === 10 ? 'ETH' : 'ETH'
fetchAudPriceSafely()
}
async function refreshNative() { nativeBalance.value = await provider.getBalance(address.value) }

function attachEventListeners() {
if (!window.ethereum) return
window.ethereum.on('accountsChanged', handleAccountsChanged)
window.ethereum.on('chainChanged', handleChainChanged)
if (provider && !blockListenerAttached) {
  blockHandler = async () => { try { await refreshNative() } catch {} }
  provider.on('block', blockHandler)
  blockListenerAttached = true
}
}

function detachEventListeners() {
if (window.ethereum) {
  window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
  window.ethereum.removeListener('chainChanged', handleChainChanged)
}
if (provider && blockListenerAttached && blockHandler) {
  provider.removeListener('block', blockHandler)
  blockListenerAttached = false
  blockHandler = null
}
}

async function handleAccountsChanged(accs) {
if (!accs || accs.length === 0) disconnect();
else {
  address.value = accs[0];
  selectedAccount.value = accs[0];
  refreshAll();
  // 自动切换到token tab并刷新
  activeTab.value = 'tokens';
}
}

async function handleChainChanged() { await refreshAll() }

function formatUnitsSafe(raw, decimals) { 
try { 
  return Number(ethers.formatUnits(raw, decimals)).toLocaleString(undefined, { maximumFractionDigits: 6 }) 
} catch { return '0' } }

function safeString(fn, fb) { return fn().catch(() => fb) }

function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s }

function normalizeErr(e) {
const msg = (e && (e.reason || e.message)) ? (e.reason || e.message) : String(e)
if (msg.toLowerCase().includes('user rejected')) return 'User rejected the request.'
return msg
}

async function fetchAudPriceSafely() {
try {
  const id = (nativeSymbol.value === 'MATIC') ? 'matic-network' : 'ethereum'
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=aud`)
  const json = await res.json()
  audPrice.value = json?.[id]?.aud || null
} catch { audPrice.value = null }
}

onMounted(async () => {
if (!window.ethereum) { warning.value = 'MetaMask not detected.'; return }
provider = new ethers.BrowserProvider(window.ethereum, 'any')
const accs = await provider.send('eth_accounts', [])
if (accs && accs.length > 0) {
  signer = await provider.getSigner()
  address.value = accs[0]
  connected.value = true
  await refreshAll()
  attachEventListeners()
}

// 加载钱包活动记录
await loadWalletActivity()

// 监听来自TradeProjectView的活动更新通知
window.addEventListener('walletActivityUpdated', handleWalletActivityUpdate)

// 设置MetaMask活动监听器
setupMetaMaskActivityListeners()

// 设置页面可见性和窗口焦点监听器
setupPageVisibilityListener()
setupWindowFocusListener()
})

onBeforeUnmount(() => { 
  detachEventListeners()
  window.removeEventListener('walletActivityUpdated', handleWalletActivityUpdate)
})

// 自定义代币输入
const customAddress = ref('')
const customLabel = ref('')
function addToken(){
const ok = addCustomToken(customAddress.value.trim(), customLabel.value.trim())
if (ok) {
  customAddress.value = ''
  customLabel.value = ''
  refreshTokens()
}
}

// 排序（余额 asc/desc）
const sortOpen = ref(false)
const sortOrder = ref('desc')
function toggleSortMenu(){ sortOpen.value = !sortOpen.value }
function setSort(order){ sortOrder.value = order; sortOpen.value = false }
function parseBalance(val){
if (val == null) return 0
if (typeof val === 'number') return val
const num = parseFloat(String(val).replace(/,/g, ''))
return isNaN(num) ? 0 : num
}
const sortedTokens = computed(() => {
const list = Array.from(tokens)
const desc = (a,b) => parseBalance(b.displayBalance) - parseBalance(a.displayBalance)
const asc  = (a,b) => parseBalance(a.displayBalance) - parseBalance(b.displayBalance)
return list.sort(sortOrder.value === 'desc' ? desc : asc)
})

const manualWalletInput = ref('')
function onManualWalletConfirm() {
const addr = manualWalletInput.value.trim()
if (addr && !accounts.value.includes(addr)) {
  accounts.value.push(addr)
  selectedAccount.value = addr
  address.value = addr
  manualWalletInput.value = ''
  warning.value = `New wallet ${addr} added and selected.`
}
}

// Activity 相关方法
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString()
}

function formatAddress(address) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatEtherValue(hexValue) {
  if (!hexValue) return '0'
  try {
    const wei = BigInt(hexValue)
    const eth = Number(wei) / Math.pow(10, 18)
    return eth.toFixed(6)
  } catch (error) {
    console.error('Error formatting ETH value:', error)
    return '0'
  }
}

// 获取活动图标
function getActivityIcon(type) {
  const icons = {
    'buy': '📈',
    'sell': '📉',
    'wallet_connect': '🔗',
    'wallet_disconnect': '❌',
    'network_change': '🌐',
    'metamask_connect': '🦊',
    'metamask_disconnect': '🦊❌',
    'wallet_status_check': '👁️',
    'wallet_focus_check': '🎯',
    'metamask_message': '💬'
  }
  return icons[type] || '📋'
}

// 获取活动标题
function getActivityTitle(type) {
  const titles = {
    'buy': 'BUY TOKEN',
    'sell': 'SELL TOKEN',
    'wallet_connect': 'WALLET CONNECTED',
    'wallet_disconnect': 'WALLET DISCONNECTED',
    'network_change': 'NETWORK CHANGED',
    'metamask_connect': 'METAMASK CONNECTED',
    'metamask_disconnect': 'METAMASK DISCONNECTED',
    'wallet_status_check': 'STATUS CHECKED',
    'wallet_focus_check': 'FOCUS CHECKED',
    'metamask_message': 'METAMASK MESSAGE'
  }
  return titles[type] || type.toUpperCase()
}

// 从Etherscan API获取交易详情
async function fetchTransactionDetails(txHash) {
  try {
    console.log('🔍 正在从Etherscan获取交易详情:', txHash)
    
    // Etherscan Sepolia API
    const apiUrl = `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    if (data.result) {
      console.log('✅ 成功获取交易详情:', data.result)
      
      // 获取交易收据
      const receiptUrl = `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}`
      const receiptResponse = await fetch(receiptUrl)
      const receiptData = await receiptResponse.json()
      
      return {
        success: true,
        transaction: data.result,
        receipt: receiptData.result,
        from: data.result.from,
        to: data.result.to,
        value: data.result.value,
        gasUsed: receiptData.result ? receiptData.result.gasUsed : null,
        gasPrice: data.result.gasPrice,
        blockNumber: data.result.blockNumber,
        blockHash: data.result.blockHash,
        status: receiptData.result ? receiptData.result.status : null
      }
    } else {
      console.warn('⚠️ 交易详情获取失败:', data.message)
      return {
        success: false,
        error: data.message || 'Failed to fetch transaction details'
      }
    }
  } catch (error) {
    console.error('❌ 获取交易详情时发生错误:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 加载钱包活动记录
async function loadWalletActivity() {
  try {
    loadingActivity.value = true
    console.log('🔄 正在加载钱包活动记录...')
    
    // 从localStorage获取交易记录
    const savedActivity = localStorage.getItem('walletActivity')
    if (savedActivity) {
      const activityData = JSON.parse(savedActivity)
      console.log('📂 从localStorage加载活动记录:', activityData.length, '条')
      
      // 为每条记录获取Etherscan详情
      const updatedActivity = []
      for (const activity of activityData) {
        if (activity.transactionHash && activity.type !== 'wallet_connect' && activity.type !== 'wallet_disconnect') {
          const etherscanData = await fetchTransactionDetails(activity.transactionHash)
          if (etherscanData.success) {
            activity.etherscan = {
              from: etherscanData.from,
              to: etherscanData.to,
              value: etherscanData.value,
              gasUsed: etherscanData.gasUsed,
              gasPrice: etherscanData.gasPrice,
              blockNumber: etherscanData.blockNumber,
              blockHash: etherscanData.blockHash,
              status: etherscanData.status,
              etherscanUrl: `https://sepolia.etherscan.io/tx/${activity.transactionHash}`
            }
          }
        }
        updatedActivity.push(activity)
      }
      
      walletActivity.value = updatedActivity
    } else {
      // 如果没有保存的活动记录，创建一些演示数据
      walletActivity.value = [
        {
          id: Date.now() - 3600000,
          type: 'buy',
          amount: 100,
          project_code: 'TYMU',
          project_name: 'St Ives NSW Residential Project',
          timestamp: Date.now() - 3600000,
          transactionHash: '0xabc123def45678901234567890123456789012345678901234567890123456789012'
        },
        {
          id: Date.now() - 1800000,
          type: 'sell',
          amount: 50,
          project_code: 'SQNB',
          project_name: 'SQNB Property Loan',
          timestamp: Date.now() - 1800000,
          transactionHash: '0xdef456abc12378901234567890123456789012345678901234567890123456789012'
        },
        {
          id: Date.now() - 900000,
          type: 'wallet_connect',
          message: 'Wallet connected to MetaMask',
          wallet_address: fullAddress.value,
          timestamp: Date.now() - 900000
        }
      ]
      
      // 为演示数据获取Etherscan详情
      for (const activity of walletActivity.value) {
        if (activity.transactionHash) {
          const etherscanData = await fetchTransactionDetails(activity.transactionHash)
          if (etherscanData.success) {
            activity.etherscan = {
              from: etherscanData.from,
              to: etherscanData.to,
              value: etherscanData.value,
              gasUsed: etherscanData.gasUsed,
              gasPrice: etherscanData.gasPrice,
              blockNumber: etherscanData.blockNumber,
              blockHash: etherscanData.blockHash,
              status: etherscanData.status,
              etherscanUrl: `https://sepolia.etherscan.io/tx/${activity.transactionHash}`
            }
          }
        }
      }
    }
    
    console.log('✅ 钱包活动记录加载完成:', walletActivity.value.length, '条')
    
  } catch (error) {
    console.error('❌ 加载钱包活动记录失败:', error)
    warning.value = 'Failed to load wallet activity'
  } finally {
    loadingActivity.value = false
  }
}

// 刷新活动记录
async function refreshActivity() {
  await loadWalletActivity()
}

// 手动记录当前钱包状态
function logCurrentWalletStatus() {
  if (connected.value && fullAddress.value) {
    logWalletActivity({
      type: 'wallet_status_check',
      message: 'Current wallet status logged',
      wallet_address: fullAddress.value,
      chain_id: chainId.value,
      network_name: networkLabel.value,
      timestamp: Date.now()
    })
  }
}

// 添加新的活动记录
function addWalletActivity(activityData) {
  console.log('➕ 添加新的钱包活动记录:', activityData)
  
  // 添加Etherscan详情
  if (activityData.transactionHash) {
    fetchTransactionDetails(activityData.transactionHash).then(etherscanData => {
      if (etherscanData.success) {
        activityData.etherscan = {
          from: etherscanData.from,
          to: etherscanData.to,
          value: etherscanData.value,
          gasUsed: etherscanData.gasUsed,
          gasPrice: etherscanData.gasPrice,
          blockNumber: etherscanData.blockNumber,
          blockHash: etherscanData.blockHash,
          status: etherscanData.status,
          etherscanUrl: `https://sepolia.etherscan.io/tx/${activityData.transactionHash}`
        }
      }
      
      // 添加到活动列表
      walletActivity.value.unshift(activityData)
      
      // 保存到localStorage
      localStorage.setItem('walletActivity', JSON.stringify(walletActivity.value))
    })
  } else {
    // 没有交易哈希，直接添加
    walletActivity.value.unshift(activityData)
    localStorage.setItem('walletActivity', JSON.stringify(walletActivity.value))
  }
}

// 处理来自TradeProjectView的活动更新通知
function handleWalletActivityUpdate(event) {
  console.log('📨 收到WalletView活动更新通知:', event.detail)
  
  // 重新加载活动记录
  loadWalletActivity()
}

// MetaMask活动监听器
function setupMetaMaskActivityListeners() {
  console.log('🎧 设置MetaMask活动监听器...')
  
  // 监听账户变化
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('📱 账户变化检测到:', accounts)
      
      if (accounts.length > 0) {
        // 账户连接
        logWalletActivity({
          type: 'wallet_connect',
          message: 'Wallet account connected',
          wallet_address: accounts[0],
          timestamp: Date.now()
        })
      } else {
        // 账户断开
        logWalletActivity({
          type: 'wallet_disconnect',
          message: 'Wallet account disconnected',
          wallet_address: fullAddress.value,
          timestamp: Date.now()
        })
      }
    })
    
    // 监听网络变化
    window.ethereum.on('chainChanged', (chainId) => {
      console.log('🌐 网络变化检测到:', chainId)
      
      const networkName = getNetworkName(chainId)
      logWalletActivity({
        type: 'network_change',
        message: `Network changed to ${networkName}`,
        network_id: chainId,
        network_name: networkName,
        timestamp: Date.now()
      })
    })
    
    // 监听连接状态
    window.ethereum.on('connect', (connectInfo) => {
      console.log('🔗 MetaMask连接检测到:', connectInfo)
      
      logWalletActivity({
        type: 'metamask_connect',
        message: 'MetaMask extension connected',
        chain_id: connectInfo.chainId,
        timestamp: Date.now()
      })
    })
    
    // 监听断开连接
    window.ethereum.on('disconnect', (error) => {
      console.log('❌ MetaMask断开连接:', error)
      
      logWalletActivity({
        type: 'metamask_disconnect',
        message: 'MetaMask extension disconnected',
        error: error.message || 'Unknown error',
        timestamp: Date.now()
      })
    })
    
    // 监听消息
    window.ethereum.on('message', (message) => {
      console.log('💬 MetaMask消息:', message)
      
      logWalletActivity({
        type: 'metamask_message',
        message: 'MetaMask message received',
        message_type: message.type,
        data: message.data,
        timestamp: Date.now()
      })
    })
  }
}

// 获取网络名称
function getNetworkName(chainId) {
  const networks = {
    '0x1': 'Ethereum Mainnet',
    '0x3': 'Ropsten Testnet',
    '0x4': 'Rinkeby Testnet',
    '0x5': 'Goerli Testnet',
    '0xaa36a7': 'Sepolia Testnet',
    '0x89': 'Polygon Mainnet',
    '0x13881': 'Polygon Mumbai',
    '0x38': 'BSC Mainnet',
    '0x61': 'BSC Testnet'
  }
  
  return networks[chainId] || `Unknown Network (${chainId})`
}

// 记录钱包活动
function logWalletActivity(activityData) {
  try {
    console.log('📝 记录钱包活动:', activityData)
    
    // 添加到活动列表
    walletActivity.value.unshift(activityData)
    
    // 保存到localStorage
    const currentActivity = JSON.parse(localStorage.getItem('walletActivity') || '[]')
    currentActivity.unshift(activityData)
    
    // 限制最多保存100条记录
    if (currentActivity.length > 100) {
      currentActivity.splice(100)
    }
    
    localStorage.setItem('walletActivity', JSON.stringify(currentActivity))
    
    console.log('✅ 钱包活动记录已保存')
    
  } catch (error) {
    console.error('❌ 记录钱包活动失败:', error)
  }
}

// 监听页面可见性变化
function setupPageVisibilityListener() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log('👁️ 页面重新可见，刷新钱包状态')
      
      // 检查钱包连接状态
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
          if (accounts.length > 0 && accounts[0] !== fullAddress.value) {
            logWalletActivity({
              type: 'wallet_status_check',
              message: 'Wallet status checked on page visibility',
              wallet_address: accounts[0],
              timestamp: Date.now()
            })
          }
        }).catch(error => {
          console.error('检查钱包状态失败:', error)
        })
      }
    }
  })
}

// 监听窗口焦点变化
function setupWindowFocusListener() {
  window.addEventListener('focus', () => {
    console.log('🎯 窗口获得焦点，检查钱包状态')
    
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          logWalletActivity({
            type: 'wallet_focus_check',
            message: 'Wallet status checked on window focus',
            wallet_address: accounts[0],
            timestamp: Date.now()
          })
        }
      }).catch(error => {
        console.error('检查钱包状态失败:', error)
      })
    }
  })
}
</script>

<style scoped>
/* 弹窗样式复用 ProfileView */
.modal-mask {
position: fixed;
z-index: 9999;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background: rgba(0,0,0,0.3);
display: flex;
align-items: center;
justify-content: center;
}
.modal-wrapper {
width: 100%;
max-width: 420px;
}
.modal-container {
background: #1d1d36;
border: 1px solid #2f2f3a;
border-radius: 12px;
box-shadow: 0 2px 16px rgba(0,0,0,0.3);
padding: 28px 24px 18px;
font-size: 15px;
color: #ffffff;
}
/* Wallet Management Section */
.mm-wallet-management {
margin-bottom: 12px;
margin-top: 12px;
border: 1px solid #34383d;
border-radius: 16px;
background: #0f172a;
padding: 18px 20px 12px 20px;
display: flex;
align-items: center;
box-shadow: 0 2px 8px rgba(94, 103, 124, 0.04);
}
.mm-wallet-management .field {
width: 100%;
}
.mm-wallet-management .label {
font-size: 14px;
font-weight: 600;
color: var(--text);
margin-bottom: 8px;
display: block;
}
.mm-wallet-management .input.with-icon {
display: flex;
align-items: center;
gap: 8px;
padding: 0;
background: #3d3d5d;
border-color: #0f172a
}
.mm-wallet-management .icon {
width: 28px;
height: 28px;
border-radius: 10px;
background: #f3f4f6;
display: grid;
place-items: center;
box-shadow: 0 2px 6px rgba(15,23,42,.06), inset 0 0 0 1px #e2e8f0;
}
.mm-wallet-management select {
border: 0;
outline: none;
width: 100%;
height: 38px;
background: transparent;
color:#0f172a;
font-size: 15px;
padding-left: 2px;
}
/* ========== MetaMask-like Design ========== */
.mm-page{
--bg:#0A0A19;
--text:#0f172a;           /* slate-900 */
--muted:#6b7280;          /* gray-500 */
--dim:#94a3b8;            /* slate-400 */
--blue:#4f46e5;           /* indigo-600 */
--blue-ink:#4338ca;
--border:#e5e7eb;
--rise:#16a34a;
--orange:#f59e0b;
font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
color:var(--text);
max-width: 960px;
margin: 0 auto;
padding: 24px;
background: var(--bg);
}

/* 顶部条 */
.mm-topbar{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}
.mm-account{display:flex;align-items:center;gap:12px;}
.mm-avatar{width:32px;height:32px;border-radius:50%;background: radial-gradient(100% 100% at 30% 20%, #cfe3ff 0%, #b9c8ff 40%, #9db4ff 100%);}
.mm-account-title{
font-weight:600;
color:#FFFFFF;
}

.mm-account-line{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted);}
.mm-addr{max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.mm-link{color:var(--blue);text-decoration:none;cursor:pointer;} /**change the style of this button**/
.mm-link:hover{color:var(--blue-ink);text-decoration:underline;}
.mm-status{display:flex;align-items:center;gap:10px;}
.mm-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;}
.mm-status-text{font-size:14px;color:#acb3bd;}

/* 按钮 */
.mm-btn{border:1px solid var(--border);background:#6b7280;border-radius:999px;padding:6px 12px;cursor:pointer;font-size:14px;color:#FFFFFF;}
.mm-btn:hover{opacity:.9;}
.mm-outline{border-color:var(--border)}

/* 英雄区 */
.mm-hero{margin-top:8px;}
.mm-balance{font-size:48px;font-weight:800;letter-spacing:-.02em;color:#FFFFFF;}
.mm-subline{margin-top:6px;display:flex;align-items:center;gap:12px;color:#cbd5e1;font-size:14px;}

/* 操作按钮：一行 */
.mm-actions{display:flex;gap:16px;margin-top:12px;}
.mm-action{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px 0;border:none;border-radius:16px;background:#141426;cursor:pointer;color:#FFFFFF;}
.mm-action-icon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--blue);color:#fff;font-weight:700;}
.mm-action-text{font-size:14px}

/* 信息条 */
.mm-info{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px;}
.mm-card{border:1px solid #2a2a4a;border-radius:16px;padding:16px;background:#1c1c36;}
.mm-card-label{font-size:12px;color:#64748b;margin-bottom:6px;}
.mm-card-title{font-weight:600;color:#FFFFFF;}
.mm-card-sub{font-size:12px;color:#64748b;margin-top:4px;}

/* Tabs */
.mm-tabs{display:flex;gap:28px;border-bottom:1px solid var(--border);margin-top:8px;}
.mm-tab{appearance:none;border:none;background:none;padding:14px 0;cursor:pointer;color:#95a0af;font-weight:600;position:relative;}
.mm-tab.is-active{color:#6b7280}
.mm-tab.is-active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:var(--text);border-radius:3px 3px 0 0;}

/* Activity 页签样式 */
.mm-activity-section {
  background: #1d1d36;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.mm-activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.mm-activity-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.mm-activity-header h3 {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.mm-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #9ca3af;
}

.mm-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #374151;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mm-no-activity {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}

.mm-no-activity-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.mm-no-activity-sub {
  font-size: 14px;
  margin-top: 8px;
}

.mm-activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mm-activity-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.2s ease;
}

.mm-activity-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.mm-activity-header-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mm-activity-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mm-activity-icon {
  font-size: 16px;
}

.mm-activity-title {
  font-weight: 600;
  font-size: 14px;
}

.mm-activity-type.buy .mm-activity-title {
  color: #16a34a;
}

.mm-activity-type.sell .mm-activity-title {
  color: #dc2626;
}

.mm-activity-type.wallet_connect .mm-activity-title {
  color: #16a34a;
}

.mm-activity-type.wallet_disconnect .mm-activity-title {
  color: #dc2626;
}

.mm-activity-type.network_change .mm-activity-title {
  color: #3b82f6;
}

.mm-activity-type.metamask_connect .mm-activity-title {
  color: #16a34a;
}

.mm-activity-type.metamask_disconnect .mm-activity-title {
  color: #dc2626;
}

.mm-activity-type.wallet_status_check .mm-activity-title,
.mm-activity-type.wallet_focus_check .mm-activity-title {
  color: #6b7280;
}

.mm-activity-type.metamask_message .mm-activity-title {
  color: #8b5cf6;
}

.mm-activity-time {
  color: #9ca3af;
  font-size: 12px;
}

.mm-activity-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mm-activity-project,
.mm-activity-amount,
.mm-activity-wallet,
.mm-activity-network,
.mm-activity-network-id,
.mm-activity-metamask,
.mm-activity-chain,
.mm-activity-error,
.mm-activity-status,
.mm-activity-message,
.mm-activity-message-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mm-activity-label {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
}

.mm-activity-value {
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.mm-activity-etherscan {
  margin-top: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.mm-activity-etherscan-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 11px;
}

.mm-activity-etherscan-info:last-child {
  margin-bottom: 0;
}

.mm-status-success {
  color: #16a34a !important;
}

.mm-status-failed {
  color: #dc2626 !important;
}

.mm-activity-footer {
  margin-top: 12px;
  text-align: right;
}

.mm-etherscan-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.mm-etherscan-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

/* 网络栏 */
.mm-networkbar{display:flex;align-items:center;justify-content:space-between;margin-top:16px;}
.mm-net-left{font-weight:600;color:#FFFFFF}
.mm-icon{color:#475569}

/* Sort menu */
.mm-sort-menu{position:absolute;right:0;top:36px;background:#fff;border:1px solid var(--border);border-radius:10px;box-shadow:var(--shadow);padding:6px;z-index:20;min-width:150px}
.mm-sort-item{display:block;width:100%;text-align:left;background:#fff;border:1px solid transparent;border-radius:8px;padding:6px 10px;cursor:pointer;color:#334155}
.mm-sort-item:hover{background:#f8fafc}
.mm-sort-item.active{border-color:#cbd5e1;background:#f1f5f9}

/* Token 列表 */
.mm-tokenlist{margin-top:8px;border:1px solid #2a2a4a;border-radius:16px;overflow:hidden;background:#1d1d36;}
.mm-token{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #2a2a4a;color:#ffffff;}
.mm-token:last-child{border-bottom:none;}
.mm-token-left{display:flex;align-items:center;gap:12px;}
.mm-token-icon{width:36px;height:36px;border-radius:50%;background:#2a2a4a;display:flex;align-items:center;justify-content:center;font-weight:700;color:#FFFFFF;}
.mm-eth{background: radial-gradient(100% 100% at 30% 20%, #cfe3ff 0%, #b9c8ff 40%, #9db4ff 100%);}
.mm-token-title{font-weight:600;color:#ffffff;}
.mm-dim{color:#94a3b8;}
.mm-rise{color:#10b981;font-size:12px;margin-top:2px;}
.mm-token-right{text-align:right;}
.mm-token-amount{font-size:12px;color:#94a3b8;margin-top:2px;}
.mm-token-sub{font-weight:600;color:#ffffff;}
.mm-token-footer{display:flex;align-items:center;justify-content:space-between;padding:10px 2px;color:#94a3b8;font-size:12px;}
.mm-tip{color:#94a3b8}

/* 提示 */
.mm-warn{color:#b45309;font-size:13px;margin-top:8px;}
.mm-error{color:#dc2626;font-size:13px;margin-top:8px;}

/* 复制成功 Toast */
.mm-toast{position:fixed;left:50%;top:64px;transform:translateX(-50%);background:rgba(15,23,42,.92);color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 6px 18px rgba(2,6,23,.25);z-index:50;font-size:14px}

/* 自定义代币输入样式 */
.mm-custom{
margin-top:12px;
border: 1px solid #2a2a4a;
border-radius: 16px;
padding: 18px 20px 12px 20px;
background: #1d1d36;
}
.mm-custom-form{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.mm-note{color:var(--muted);font-size:13px}
.mm-input{height:36px;border:1px solid #2a2a4a;border-radius:10px;padding:0 10px;outline:none;background:#1d1d36;color:#ffffff;}
.mm-input::placeholder{color:#94a3b8;}

@media (max-width: 900px){
.mm-actions{flex-wrap:wrap;}
.mm-action{flex: 0 0 calc(20% - 16px);}
}
</style>