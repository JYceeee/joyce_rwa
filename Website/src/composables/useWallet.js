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
    { address: '#', label: 'PWL-I' },
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
const bigAudDisplay = computed(() => `A$${(nativeToAudDisplay.value || '0')} AUD`)

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
  if (!accs || accs.length === 0) disconnect()
  else { address.value = accs[0]; await refreshAll() }
}
async function handleChainChanged() { await refreshAll() }

async function fetchAudPriceSafely() {
  try {
    const id = (nativeSymbol.value === 'MATIC') ? 'matic-network' : 'ethereum'
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=aud`)
    const json = await res.json()
    audPrice.value = json?.[id]?.aud || null
  } catch { audPrice.value = null }
}

// ===== Public actions =====
async function connect() {
  error.value = ''; warning.value = ''
  try {
    if (!window.ethereum) { warning.value = 'MetaMask not detected.'; return }
    provider = new ethers.BrowserProvider(window.ethereum, 'any')
    const accounts = await provider.send('eth_requestAccounts', [])
    signer = await provider.getSigner()
    address.value = accounts[0]
    connected.value = true
    await refreshNetwork()
    await refreshNative()
    await refreshTokens()
    attachEventListeners()
  } catch (e) { error.value = normalizeErr(e) }
}
function disconnect() {
  connected.value = false
  address.value = ''
  chainId.value = null
  networkLabel.value = ''
  nativeSymbol.value = 'ETH'
  nativeBalance.value = 0n
  audPrice.value = null
  tokens.splice(0)
  detachEventListeners()
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
      const c = new ethers.Contract(item.address, ERC20_ABI, provider)
      const [raw, decimals, symbol, name] = await Promise.all([
        c.balanceOf(address.value),
        c.decimals(),
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
    }
  } catch (e) { error.value = normalizeErr(e) }
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
function addCustomToken(addr, label){
  try {
    if (!ethers.isAddress(addr)) { warning.value = 'Invalid token address.'; return false }
    const list = getCustomTokens(chainId.value)
    if (list.find(x => x.address.toLowerCase() === addr.toLowerCase())) return true
    list.push({ address: addr, label: label || 'Token', addedAt: Date.now(), source: 'ImportFromUs' })
    setCustomTokens(chainId.value, list)
    return true
  } catch { return false }
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
  if (!window.ethereum) { warning.value = 'MetaMask not detected.'; return }
  provider = new ethers.BrowserProvider(window.ethereum, 'any')
  provider.send('eth_accounts', []).then(async (accs) => {
    if (accs && accs.length > 0) {
      signer = await provider.getSigner()
      address.value = accs[0]
      connected.value = true
      await refreshAll()
      attachEventListeners()
    }
  })
}

export function useWallet() {
  onMounted(() => { initIfNeeded() })
  onBeforeUnmount(() => { /* keep listeners; profile & wallet share them */ })
  return {
    // state
    connected, address, fullAddress, shortAddress,
    chainId, networkLabel, nativeSymbol,
    nativeBalanceDisplay, nativeToAudDisplay, bigAudDisplay,
    tokens, warning, error, loadingTokens, activeTab,
    // actions
    connect, disconnect, refreshTokens, copyAddress,
    addCustomToken, removeCustomToken,
  }
}
