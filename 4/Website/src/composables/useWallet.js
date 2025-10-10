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
    { address: '0xA41b4F0417d588a08F914Ca17b07c99783D5c3FC', label: 'PWL-P' }, // 本金代币 (LPrincipalFixed)
    { address: '0x9d3175E3F8c055389e070e058f717D450bB89206', label: 'PWL-I' }, // 利息代币 (LInterest)
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
const bigAudDisplay = computed(() => `AUD${(nativeToAudDisplay.value || '0')} AUD`)

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
   // 只为MetaMask附加事件监听
   if (window.ethereum && window.ethereum.on) {
     window.ethereum.on('accountsChanged', handleAccountsChanged)
     window.ethereum.on('chainChanged', handleChainChanged)
   }
  
  if (provider && !blockListenerAttached) {
    blockHandler = async () => { try { await refreshNative() } catch {} }
    provider.on('block', blockHandler)
    blockListenerAttached = true
  }
}

function detachEventListeners() {
  // 从MetaMask中移除事件监听
  if (window.ethereum && window.ethereum.removeListener) {
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

// ===== Mobile Wallet Connection =====
async function connectMobileWallet() {
  console.log('📱 Attempting mobile wallet connection')
  
  // 检测用户设备类型
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  if (!isMobile) {
    warning.value = 'Please install MetaMask extension or use a mobile device to connect with wallet apps.'
      return 
    }
    
  // 生成深链接URLs
  const walletApps = [
    {
      name: 'MetaMask',
      url: `https://metamask.app.link/dapp/${window.location.hostname}`,
      icon: '🦊'
    },
    {
      name: 'Trust Wallet',
      url: `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(window.location.href)}`,
      icon: '🔒'
    },
    {
      name: 'Coinbase Wallet',
      url: `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`,
      icon: '🔵'
    },
    {
      name: 'Rainbow',
      url: `https://rnbwapp.com/wc?uri=${encodeURIComponent(window.location.href)}`,
      icon: '🌈'
    }
  ]
  
  // 显示钱包选择弹窗
  showWalletSelectionModal(walletApps)
}

function showWalletSelectionModal(wallets) {
  // 检测当前主题
  const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light'
  
  // 创建模态框
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `
  
  const modalContent = document.createElement('div')
  const backgroundColor = isLightTheme ? '#ffffff' : '#1a1a2e'
  const borderColor = isLightTheme ? '#e5e7eb' : '#2a2a4a'
  const textColor = isLightTheme ? '#1f2937' : '#ffffff'
  
  modalContent.style.cssText = `
    background: ${backgroundColor};
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid ${borderColor};
    color: ${textColor};
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, ${isLightTheme ? '0.25' : '0.5'});
  `
  
  // 获取当前语言
  const currentLang = localStorage.getItem('language') || 'zh'
  const isChinese = currentLang === 'zh'
  
  const title = document.createElement('h2')
  title.textContent = isChinese ? '连接钱包' : 'Connect Wallet'
  title.style.cssText = `
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  `
  
  const description = document.createElement('p')
  description.textContent = isChinese ? '选择您喜欢的钱包应用进行连接:' : 'Choose your preferred wallet app to connect:'
  const descriptionColor = isLightTheme ? '#6b7280' : '#94a3b8'
  description.style.cssText = `
    margin: 0 0 24px 0;
    color: ${descriptionColor};
    text-align: center;
    font-size: 14px;
  `
  
  const walletList = document.createElement('div')
  walletList.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  `
  
  wallets.forEach(wallet => {
    const walletItem = document.createElement('button')
    const walletBgColor = isLightTheme ? '#f9fafb' : '#2a2a4a'
    const walletBorderColor = isLightTheme ? '#d1d5db' : '#374151'
    const walletTextColor = isLightTheme ? '#1f2937' : '#ffffff'
    
    walletItem.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: ${walletBgColor};
      border: 1px solid ${walletBorderColor};
      border-radius: 12px;
      color: ${walletTextColor};
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      text-align: left;
    `
    
    walletItem.innerHTML = `
      <span style="font-size: 24px;">${wallet.icon}</span>
      <span>${wallet.name}</span>
    `
    
    walletItem.addEventListener('mouseenter', () => {
      const hoverBgColor = isLightTheme ? '#f3f4f6' : '#374151'
      const hoverBorderColor = isLightTheme ? '#9ca3af' : '#4b5563'
      walletItem.style.background = hoverBgColor
      walletItem.style.borderColor = hoverBorderColor
    })
    
    walletItem.addEventListener('mouseleave', () => {
      walletItem.style.background = walletBgColor
      walletItem.style.borderColor = walletBorderColor
    })
    
    walletItem.addEventListener('click', () => {
      console.log(`🔗 Opening ${wallet.name}:`, wallet.url)
      window.location.href = wallet.url
      modal.remove()
    })
    
    walletList.appendChild(walletItem)
  })
  
  const cancelButton = document.createElement('button')
  cancelButton.textContent = isChinese ? '取消' : 'Cancel'
  const cancelBorderColor = isLightTheme ? '#d1d5db' : '#6b7280'
  const cancelTextColor = isLightTheme ? '#6b7280' : '#6b7280'
  
  cancelButton.style.cssText = `
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 1px solid ${cancelBorderColor};
    border-radius: 8px;
    color: ${cancelTextColor};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  `
  
  cancelButton.addEventListener('mouseenter', () => {
    const hoverBgColor = isLightTheme ? '#f9fafb' : '#374151'
    const hoverBorderColor = isLightTheme ? '#9ca3af' : '#9ca3af'
    const hoverTextColor = isLightTheme ? '#374151' : '#ffffff'
    cancelButton.style.background = hoverBgColor
    cancelButton.style.borderColor = hoverBorderColor
    cancelButton.style.color = hoverTextColor
  })
  
  cancelButton.addEventListener('mouseleave', () => {
    cancelButton.style.background = 'transparent'
    cancelButton.style.borderColor = cancelBorderColor
    cancelButton.style.color = cancelTextColor
  })
  
  cancelButton.addEventListener('click', () => {
    modal.remove()
  })
  
  // 点击背景关闭模态框
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
  
  modalContent.appendChild(title)
  modalContent.appendChild(description)
  modalContent.appendChild(walletList)
  modalContent.appendChild(cancelButton)
  modal.appendChild(modalContent)
  
  document.body.appendChild(modal)
}

async function connectWithProvider(walletProvider, walletId) {
  console.log(`🔗 Creating provider for ${walletId}...`)
  console.log('🔍 Wallet provider details:', {
    walletId,
    walletName: walletProvider?.walletName || walletId,
    provider: walletProvider,
    isMetaMask: walletProvider?.isMetaMask,
    isOkxWallet: walletProvider?.isOkxWallet,
    isBinance: walletProvider?.isBinance,
    isPhantom: walletProvider?.isPhantom,
    isConnected: walletProvider?.isConnected,
    selectedAddress: walletProvider?.selectedAddress
  })
  
  try {
    // 创建provider
    provider = new ethers.BrowserProvider(walletProvider, 'any')
    
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
    
    const walletName = walletProvider?.walletName || walletId
    console.log(`✅ ${walletName} connected successfully:`, accounts[0])
    
    // 存储连接的钱包信息
    localStorage.setItem('connectedWallet', walletId)
    localStorage.setItem('walletAddress', accounts[0])
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('walletConnected', { 
      detail: { 
        address: accounts[0], 
        chainId: chainId.value,
        walletId: walletId,
        provider: walletProvider
      } 
    }))
    
  } catch (connectionError) {
    console.error(`❌ ${walletId} connection failed:`, connectionError)
    
    // 根据不同的错误类型提供更具体的错误消息
    if (connectionError.code === 4001) {
      error.value = 'User rejected the connection request.'
    } else if (connectionError.code === -32002) {
      error.value = 'Connection request already pending. Please check your wallet.'
    } else if (connectionError.message.includes('User denied') || connectionError.message.includes('User rejected')) {
      error.value = 'Connection was denied. Please approve the connection in your wallet.'
    } else if (connectionError.message.includes('Already processing')) {
      error.value = 'Wallet is already processing a request. Please wait and try again.'
    } else if (connectionError.message.includes('wallet is not installed')) {
      error.value = 'Wallet extension is not installed or not detected.'
    } else {
      error.value = normalizeErr(connectionError)
    }
    
    throw connectionError
  }
}

// ===== Public actions =====
async function connect() {
  console.log('🔄 useWallet connect() called')
  error.value = ''; warning.value = ''
  
  try {
    // 检查是否有MetaMask
    if (!window.ethereum) {
      // 检测是否为移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        console.log('❌ No MetaMask detected on mobile, trying mobile wallet connection')
        await connectMobileWallet()
        return
      } else {
        warning.value = 'MetaMask is not installed. Please install MetaMask extension.'
        window.open('https://metamask.io/download/', '_blank')
        return
      }
    }
    
    console.log('✅ MetaMask detected, connecting...')
    
    // 直接使用MetaMask连接
    await connectWithProvider(window.ethereum, 'metamask')
    
  } catch (e) { 
    if (e.message === 'User cancelled wallet selection') {
      console.log('ℹ️ User cancelled wallet selection')
      return
    }
    
    console.error('❌ Wallet connection failed:', e)
    
    // 提供更具体的错误消息
    if (e.code === 4001) {
      error.value = 'User rejected the connection request.'
    } else if (e.code === -32002) {
      error.value = 'Connection request already pending. Please check your wallet.'
    } else if (e.message.includes('User denied')) {
      error.value = 'Connection was denied. Please approve the connection in your wallet.'
    } else if (e.message.includes('Already processing')) {
      error.value = 'Wallet is already processing a request. Please wait and try again.'
    } else {
      error.value = normalizeErr(e)
    }
  }
}
async function disconnect() {
  const wasConnected = connected.value
  const oldAddress = address.value
  
  try {
    // 尝试从MetaMask断开连接
    if (window.ethereum && window.ethereum.disconnect) {
      console.log('🔌 Attempting to disconnect from MetaMask...')
      await window.ethereum.disconnect()
    }
    
    // 清除本地存储的钱包信息
    localStorage.removeItem('walletConnected')
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('primaryWallet')
    
    // 清除当前连接的钱包地址（从linkedWallets中移除）
    const linkedWallets = JSON.parse(localStorage.getItem('linkedWallets') || '[]')
    const updatedWallets = linkedWallets.filter(wallet => wallet !== oldAddress)
    localStorage.setItem('linkedWallets', JSON.stringify(updatedWallets))
    
  } catch (error) {
    console.warn('MetaMask disconnect failed, continuing with local disconnect:', error)
  }
  
  // 本地状态清理
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
// 获取钱包内的代币列表（MetaMask）
async function getWalletTokens() {
  console.log('🔍 Getting tokens from MetaMask wallet')
  
  try {
    // MetaMask不直接提供获取代币列表的API
    // 我们使用自定义代币列表，这些是用户手动添加的代币
    const custom = getCustomTokens(chainId.value)
    console.log('MetaMask custom tokens:', custom)
    
    return custom
  } catch (error) {
    console.error('Failed to get wallet tokens:', error)
    return []
  }
}

async function refreshTokens() {
  loadingTokens.value = true
  tokens.splice(0)
  try {
    // 获取当前钱包的代币列表
    const walletTokens = await getWalletTokens()
    console.log(`📋 Wallet tokens:`, walletTokens)
    
    // 处理钱包内的代币
    for (const item of walletTokens) {
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
          safeString(() => c.symbol(), item.symbol || item.label || 'TKN'),
          safeString(() => c.name(), item.name || item.label || 'Token'),
        ])
        
        const display = formatUnitsSafe(raw, decimals)
        tokens.push({
          address: item.address,
          symbol: symbol || item.symbol || item.label || 'TKN',
          name: name || item.name || item.label || 'Token',
          decimals,
          displayBalance: display,
          source: item.source || 'Custom'
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
    
    console.log(`✅ Loaded ${tokens.length} tokens from connected wallet`)
    
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
  
  // 检查是否为移动设备且没有钱包扩展
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // 只检查MetaMask
  if (!window.ethereum) { 
    if (isMobile) {
      warning.value = 'MetaMask not detected. Use MetaMask mobile app to connect.'
    } else {
      warning.value = 'MetaMask not detected. Please install MetaMask extension.'
    }
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
          
          // 设置connectedWallet为metamask
          localStorage.setItem('connectedWallet', 'metamask')
          
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
