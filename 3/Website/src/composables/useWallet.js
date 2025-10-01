// src/composables/useWallet.js
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { ethers } from 'ethers'

// ===== Shared (singleton) reactive state =====
const connected = ref(false)
const address = ref('')
const chainId = ref(null)
const networkLabel = ref('')
const nativeSymbol = ref('ETH')
const nativeBalance = ref(0n)
const audPrice = ref(null)
const priceChange24h = ref(null)
const tokens = reactive([])
const warning = ref('')
const error = ref('')
const loadingTokens = ref(false)
const activeTab = ref('tokens')

// keep provider/listeners singleton too
let provider = null
let signer = null
let blockListenerAttached = false
let blockHandler = null
let initialized = false

// ===== Your token config & ABI =====
const TOKENS_BY_CHAIN = {
  1: [
    { address: '0x7b21325dcB87A8167A7eFF504ec876C0F520dc17', label: 'PWL-P' },
    { address: '#', label: 'PWL-P' }, //需要替换为实际的PWL-P地址
    { address: '#', label: 'PWL-I' }, //需要替换为实际的PWL-I地址
  ],
  11155111: [
    { address: '0xYOUR_PWLP_SEPOLIA', label: 'PWL-P' }, //需要替换为实际的PWL-P地址
    { address: '0xYOUR_PWLI_SEPOLIA', label: 'PWL-I' }, //需要替换为实际的PWL-I地址
  ],
}
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
]

// ===== Computeds =====
const fullAddress = computed(() => address.value || '')
const shortAddress = computed(() => {
  const a = address.value
  return a ? `${a.slice(0,6)}...${a.slice(-4)}` : ''
})
const nativeBalanceDisplay = computed(() => {
  try { return provider ? ethers.formatEther(nativeBalance.value) : '0' } catch { return '0' }
})
const nativeToAudDisplay = computed(() => {
  if (!audPrice.value) return '0'
  const eth = Number(ethers.formatEther(nativeBalance.value))
  const aud = eth * audPrice.value
  return aud.toLocaleString(undefined, { maximumFractionDigits: 2 })
})
const bigAudDisplay = computed(() => `AUD$${(nativeToAudDisplay.value || '0')} AUD`)

// ===== Helpers =====
function formatUnitsSafe(raw, decimals) {
  try { return Number(ethers.formatUnits(raw, decimals)).toLocaleString(undefined, { maximumFractionDigits: 6 }) } catch { return '0' }
}
function safeString(fn, fb) { return fn().catch(() => fb) }
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s }
function normalizeErr(e) {
  const msg = (e && (e.reason || e.message)) ? (e.reason || e.message) : String(e)
  if (msg.toLowerCase().includes('user rejected')) return 'User rejected the request.'
  return msg
}

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
  console.log('🔄 Accounts changed:', accs)
  if (!accs || accs.length === 0) {
    disconnect()
  } else {
    const oldAddress = address.value
    address.value = accs[0]
    
    // 如果地址发生变化，触发地址变化事件
    if (oldAddress && oldAddress !== accs[0]) {
      console.log('🔄 Wallet address changed from', oldAddress, 'to', accs[0])
      window.dispatchEvent(new CustomEvent('walletAddressChanged', { 
        detail: { oldAddress, newAddress: accs[0] } 
      }))
    }
    
    await refreshAll()
  }
}
async function handleChainChanged() { await refreshAll() }

async function fetchAudPriceSafely() {
  try {
    const id = (nativeSymbol.value === 'MATIC') ? 'matic-network' : 'ethereum'
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=aud&include_24hr_change=true`)
    const json = await res.json()
    audPrice.value = json?.[id]?.aud || null
    priceChange24h.value = json?.[id]?.aud_24h_change || null
  } catch { 
    audPrice.value = null
    priceChange24h.value = null
  }
}

// ===== Public actions =====
async function connect() {
  console.log('🔄 useWallet connect() called')
  error.value = ''; warning.value = ''
  try {
    if (!window.ethereum) { 
      console.log('❌ MetaMask not detected')
      warning.value = 'MetaMask not detected. Please install MetaMask extension.'; 
      return 
    }
    
    console.log('🔗 Creating provider...')
    provider = new ethers.BrowserProvider(window.ethereum, 'any')
    
    console.log('📝 Requesting accounts...')
    const accounts = await provider.send('eth_requestAccounts', [])
    console.log('📋 Received accounts:', accounts)
    
    if (!accounts || accounts.length === 0) {
      console.log('❌ No accounts found')
      error.value = 'No accounts found. Please unlock your wallet or create a new account.'
      return
    }
    
    console.log('🔐 Getting signer...')
    signer = await provider.getSigner()
    address.value = accounts[0]
    connected.value = true
    
    console.log('🔄 Refreshing wallet data...')
    await refreshNetwork()
    await refreshNative()
    await refreshTokens()
    attachEventListeners()
    
    console.log('✅ Wallet connected successfully:', accounts[0])
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('walletConnected', { 
      detail: { address: accounts[0], chainId: chainId.value } 
    }))
  } catch (e) { 
    console.error('❌ Wallet connection failed:', e)
    
    // 提供更具体的错误消息
    if (e.code === 4001) {
      error.value = 'User rejected the connection request.'
    } else if (e.code === -32002) {
      error.value = 'Connection request already pending. Please check your MetaMask.'
    } else if (e.message.includes('User denied')) {
      error.value = 'Connection was denied. Please approve the connection in MetaMask.'
    } else if (e.message.includes('Already processing')) {
      error.value = 'MetaMask is already processing a request. Please wait and try again.'
    } else {
      error.value = normalizeErr(e)
    }
  }
}
function disconnect() {
  const wasConnected = connected.value
  const oldAddress = address.value
  
  connected.value = false
  address.value = ''
  chainId.value = null
  networkLabel.value = ''
  nativeSymbol.value = 'ETH'
  nativeBalance.value = 0n
  audPrice.value = null
  priceChange24h.value = null
  tokens.splice(0)
  detachEventListeners()
  
  // 如果之前是连接状态，触发断开连接事件
  if (wasConnected) {
    console.log('🔌 Wallet disconnected, triggering event...')
    window.dispatchEvent(new CustomEvent('walletDisconnected', { 
      detail: { address: oldAddress } 
    }))
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
async function refreshTokens() {
  loadingTokens.value = true
  tokens.splice(0)
  try {
    const builtIn = TOKENS_BY_CHAIN[chainId.value] || []
    const custom = getCustomTokens(chainId.value)
    const list = [...builtIn, ...custom]
    
    for (const item of list) {
      if (!ethers.isAddress(item.address)) continue
      
      try {
        const c = new ethers.Contract(item.address, ERC20_ABI, provider)
        
        // 先检查合约是否存在（通过调用一个简单的方法）
        let contractExists = false
        try {
          await c.symbol()
          contractExists = true
        } catch (e) {
          console.warn(`合约 ${item.address} 不存在或不是ERC20代币:`, e.message)
          continue
        }
        
        if (!contractExists) continue
        
        const [raw, decimals, symbol, name] = await Promise.all([
          c.balanceOf(address.value).catch(e => {
            console.warn(`查询 ${item.address} 余额失败:`, e.message)
            return 0n
          }),
          c.decimals().catch(e => {
            console.warn(`获取 ${item.address} 小数位失败:`, e.message)
            return 18
          }),
          safeString(() => c.symbol(), item.label || 'TKN'),
          safeString(() => c.name(), item.label || 'Token'),
        ])
        
        const display = formatUnitsSafe(raw, decimals)
        tokens.push({
          address: item.address,
          symbol: symbol || item.label || 'TKN',
          name: name || item.label || 'Token',
          decimals,
          displayBalance: display
        })
        
      } catch (e) {
        console.warn(`处理代币 ${item.address} 时出错:`, e.message)
        // 如果是自定义代币且调用失败，从列表中移除
        if (item.source === 'ImportFromUs') {
          console.log(`移除无效的自定义代币: ${item.address}`)
          removeCustomToken(item.address)
        }
        continue
      }
    }
  } catch (e) { 
    error.value = normalizeErr(e) 
  }
  finally { loadingTokens.value = false }
}
function copyAddress() { if (address.value) navigator.clipboard.writeText(address.value) }

// ===== Custom tokens (persisted per chain in sessionStorage) =====
function customKey(cid){ return `customTokens:${cid || ''}` }
function getCustomTokens(cid){
  try {
    const raw = sessionStorage.getItem(customKey(cid))
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.filter(x => x && x.address) : []
  } catch { return [] }
}
function setCustomTokens(cid, list){
  try { sessionStorage.setItem(customKey(cid), JSON.stringify(list || [])) } catch {}
}
async function addCustomToken(addr, label){
  try {
    if (!ethers.isAddress(addr)) { 
      warning.value = 'Invalid token address format.'; 
      return false 
    }
    
    const list = getCustomTokens(chainId.value)
    if (list.find(x => x.address.toLowerCase() === addr.toLowerCase())) {
      warning.value = 'Token already exists in your list.'
      return true
    }
    
    // 验证合约是否存在且是ERC20代币
    if (provider) {
      try {
        const c = new ethers.Contract(addr, ERC20_ABI, provider)
        
        // 尝试调用多个ERC20方法来验证合约
        const [symbol, name, decimals] = await Promise.all([
          c.symbol().catch(() => 'UNKNOWN'),
          c.name().catch(() => 'Unknown Token'),
          c.decimals().catch(() => 18)
        ])
        
        console.log(`✅ 合约 ${addr} 验证成功:`, { symbol, name, decimals })
        
        // 如果是已知的RWA代币，提供更好的标签
        let tokenLabel = label || symbol || 'Token'
        if (symbol === 'LPT' || symbol === 'LIT') {
          tokenLabel = `${symbol} (RWA ${symbol === 'LPT' ? '本金币' : '利息币'})`
        }
        
        list.push({ 
          address: addr, 
          label: tokenLabel, 
          addedAt: Date.now(), 
          source: 'ImportFromUs',
          symbol: symbol,
          name: name,
          decimals: decimals
        })
        
      } catch (e) {
        console.error(`❌ 合约 ${addr} 验证失败:`, e.message)
        if (e.code === 'BAD_DATA' || e.message.includes('could not decode result data')) {
          warning.value = 'Contract address is invalid or not an ERC20 token.'
        } else if (e.code === 'CALL_EXCEPTION') {
          warning.value = 'Contract call failed. Please check the address and network.'
        } else {
          warning.value = `Contract validation failed: ${e.message}`
        }
        return false
      }
    } else {
      // 如果没有provider，仍然添加但标记为未验证
      list.push({ 
        address: addr, 
        label: label || 'Token', 
        addedAt: Date.now(), 
        source: 'ImportFromUs',
        unverified: true
      })
    }
    
    setCustomTokens(chainId.value, list)
    warning.value = '' // 清除警告
    return true
  } catch (e) { 
    warning.value = `Failed to add token: ${e.message}`
    return false 
  }
}
function removeCustomToken(addr){
  try {
    const list = getCustomTokens(chainId.value).filter(x => x.address.toLowerCase() !== (addr || '').toLowerCase())
    setCustomTokens(chainId.value, list)
  } catch {}
}

// ===== One-time auto-init when app loads =====
function initIfNeeded() {
  if (initialized) return
  initialized = true
  if (!window.ethereum) { 
    warning.value = 'MetaMask not detected.'; 
    return 
  }
  
  try {
    provider = new ethers.BrowserProvider(window.ethereum, 'any')
    provider.send('eth_accounts', []).then(async (accs) => {
      if (accs && accs.length > 0) {
        try {
          signer = await provider.getSigner()
          address.value = accs[0]
          connected.value = true
          await refreshAll()
          attachEventListeners()
        } catch (err) {
          console.error('Failed to initialize wallet:', err)
          error.value = normalizeErr(err)
        }
      }
    }).catch(err => {
      console.error('Failed to get accounts:', err)
      error.value = normalizeErr(err)
    })
  } catch (err) {
    console.error('Failed to create provider:', err)
    error.value = normalizeErr(err)
  }
}

export function useWallet() {
  // 立即尝试初始化，而不是等待onMounted
  initIfNeeded()
  
  onMounted(() => { 
    // 如果还没有初始化，再次尝试
    if (!initialized) {
      initIfNeeded()
    }
  })
  onBeforeUnmount(() => { /* keep listeners; profile & wallet share them */ })
  return {
    // state
    connected, address, fullAddress, shortAddress,
    chainId, networkLabel, nativeSymbol,
    nativeBalanceDisplay, nativeToAudDisplay, bigAudDisplay,
    tokens, warning, error, loadingTokens, activeTab,
    audPrice, priceChange24h,
    // actions
    connect, disconnect, refreshTokens, copyAddress,
    addCustomToken, removeCustomToken,
  }
}
