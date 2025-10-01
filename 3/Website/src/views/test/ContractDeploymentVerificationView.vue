<template>
  <div class="contract-deployment-verification">
    <h1>🔍 合约部署验证测试</h1>
    <p class="description">验证合约在Sepolia Testnet和Ethereum主网的部署状态，抓取本币合约地址和利币合约地址</p>
    
    <!-- 网络选择 -->
    <div class="test-section">
      <h2>🌐 网络选择</h2>
      <div class="network-selector">
        <button 
          @click="selectNetwork('sepolia')" 
          :class="{ active: selectedNetwork === 'sepolia' }"
          class="network-btn sepolia"
        >
          Sepolia Testnet
        </button>
        <button 
          @click="selectNetwork('mainnet')" 
          :class="{ active: selectedNetwork === 'mainnet' }"
          class="network-btn mainnet"
        >
          Ethereum Mainnet
        </button>
      </div>
      <div class="current-network">
        <span class="network-label">当前网络:</span>
        <span class="network-value">{{ currentNetworkName }}</span>
        <span class="network-chain-id">(Chain ID: {{ currentChainId }})</span>
      </div>
    </div>

    <!-- 合约地址配置 -->
    <div class="test-section">
      <h2>⚙️ 合约地址配置</h2>
      <div class="config-grid">
        <div class="config-item">
          <label>KYC注册表:</label>
          <input v-model="contractConfigs[selectedNetwork].KYC_REGISTRY_ADDRESS" placeholder="0x..." />
          <button @click="verifyContract('kycRegistry')" :disabled="loading" class="verify-btn">验证</button>
        </div>
        <div class="config-item">
          <label>Loan发行者:</label>
          <input v-model="contractConfigs[selectedNetwork].LOAN_ISSUER_ADDRESS" placeholder="0x..." />
          <button @click="verifyContract('loanIssuer')" :disabled="loading" class="verify-btn">验证</button>
        </div>
        <div class="config-item">
          <label>本金代币 (LPRI):</label>
          <input v-model="contractConfigs[selectedNetwork].PRINCIPAL_TOKEN_ADDRESS" placeholder="0x..." />
          <button @click="verifyContract('principalToken')" :disabled="loading" class="verify-btn">验证</button>
        </div>
        <div class="config-item">
          <label>利息代币 (LINT):</label>
          <input v-model="contractConfigs[selectedNetwork].INTEREST_TOKEN_ADDRESS" placeholder="0x..." />
          <button @click="verifyContract('interestToken')" :disabled="loading" class="verify-btn">验证</button>
        </div>
        <div class="config-item">
          <label>交易合约:</label>
          <input v-model="contractConfigs[selectedNetwork].TRADE_CONTRACT_ADDRESS" placeholder="0x..." />
          <button @click="verifyContract('tradeContract')" :disabled="loading" class="verify-btn">验证</button>
        </div>
        <div class="config-item">
          <label>合规守卫:</label>
          <input v-model="contractConfigs[selectedNetwork].COMPLIANCE_GUARD_ADDRESS" placeholder="0x..." />
          <button @click="verifyContract('complianceGuard')" :disabled="loading" class="verify-btn">验证</button>
        </div>
      </div>
      <div class="config-actions">
        <button @click="verifyAllContracts" :disabled="loading" class="btn primary">
          {{ loading ? '验证中...' : '验证所有合约' }}
        </button>
        <button @click="saveConfigurations" :disabled="loading" class="btn secondary">
          保存配置
        </button>
        <button @click="loadConfigurations" :disabled="loading" class="btn secondary">
          加载配置
        </button>
      </div>
    </div>

    <!-- 合约信息抓取 -->
    <div class="test-section">
      <h2>📋 合约信息抓取</h2>
      <div class="contract-info-grid">
        <div class="contract-info-card">
          <h3>本金代币 (LPRI)</h3>
          <div class="info-item">
            <label>合约地址:</label>
            <span class="address">{{ contractInfo.principalToken?.address || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>代币名称:</label>
            <span>{{ contractInfo.principalToken?.name || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>代币符号:</label>
            <span>{{ contractInfo.principalToken?.symbol || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>总供应量:</label>
            <span>{{ contractInfo.principalToken?.totalSupply || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>小数位数:</label>
            <span>{{ contractInfo.principalToken?.decimals || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>KYC注册表:</label>
            <span class="address">{{ contractInfo.principalToken?.registry || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>所需KYC等级:</label>
            <span>{{ contractInfo.principalToken?.requiredKycLevel || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>是否暂停:</label>
            <span :class="{ paused: contractInfo.principalToken?.paused }">
              {{ contractInfo.principalToken?.paused !== undefined ? (contractInfo.principalToken.paused ? '是' : '否') : '未获取' }}
            </span>
          </div>
        </div>

        <div class="contract-info-card">
          <h3>利息代币 (LINT)</h3>
          <div class="info-item">
            <label>合约地址:</label>
            <span class="address">{{ contractInfo.interestToken?.address || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>代币名称:</label>
            <span>{{ contractInfo.interestToken?.name || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>代币符号:</label>
            <span>{{ contractInfo.interestToken?.symbol || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>总供应量:</label>
            <span>{{ contractInfo.interestToken?.totalSupply || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>小数位数:</label>
            <span>{{ contractInfo.interestToken?.decimals || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>KYC注册表:</label>
            <span class="address">{{ contractInfo.interestToken?.registry || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>所需KYC等级:</label>
            <span>{{ contractInfo.interestToken?.requiredKycLevel || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>是否暂停:</label>
            <span :class="{ paused: contractInfo.interestToken?.paused }">
              {{ contractInfo.interestToken?.paused !== undefined ? (contractInfo.interestToken.paused ? '是' : '否') : '未获取' }}
            </span>
          </div>
        </div>

        <div class="contract-info-card">
          <h3>Loan发行者</h3>
          <div class="info-item">
            <label>合约地址:</label>
            <span class="address">{{ contractInfo.loanIssuer?.address || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>KYC注册表:</label>
            <span class="address">{{ contractInfo.loanIssuer?.registry || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>本金代币地址:</label>
            <span class="address">{{ contractInfo.loanIssuer?.principalToken || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>利息代币地址:</label>
            <span class="address">{{ contractInfo.loanIssuer?.interestToken || '未获取' }}</span>
          </div>
          <div class="info-item">
            <label>下一个贷款ID:</label>
            <span>{{ contractInfo.loanIssuer?.nextLoanId || '未获取' }}</span>
          </div>
        </div>
      </div>
      
      <div class="fetch-actions">
        <button @click="fetchAllContractInfo" :disabled="loading" class="btn primary">
          {{ loading ? '抓取中...' : '抓取所有合约信息' }}
        </button>
        <button @click="fetchTokenInfo" :disabled="loading" class="btn secondary">
          抓取代币信息
        </button>
        <button @click="fetchLoanIssuerInfo" :disabled="loading" class="btn secondary">
          抓取Loan发行者信息
        </button>
      </div>
    </div>

    <!-- 网络切换测试 -->
    <div class="test-section">
      <h2>🔄 网络切换测试</h2>
      <div class="network-switch-grid">
        <div class="network-card">
          <h3>Sepolia Testnet</h3>
          <div class="network-info">
            <div class="info-item">
              <label>Chain ID:</label>
              <span>11155111</span>
            </div>
            <div class="info-item">
              <label>RPC URL:</label>
              <span>https://sepolia.infura.io/v3/...</span>
            </div>
            <div class="info-item">
              <label>区块浏览器:</label>
              <span>https://sepolia.etherscan.io</span>
            </div>
          </div>
          <button @click="switchToSepolia" :disabled="loading" class="btn secondary">
            切换到Sepolia
          </button>
        </div>

        <div class="network-card">
          <h3>Ethereum Mainnet</h3>
          <div class="network-info">
            <div class="info-item">
              <label>Chain ID:</label>
              <span>1</span>
            </div>
            <div class="info-item">
              <label>RPC URL:</label>
              <span>https://mainnet.infura.io/v3/...</span>
            </div>
            <div class="info-item">
              <label>区块浏览器:</label>
              <span>https://etherscan.io</span>
            </div>
          </div>
          <button @click="switchToMainnet" :disabled="loading" class="btn primary">
            切换到主网
          </button>
        </div>
      </div>
    </div>

    <!-- 验证结果 -->
    <div class="test-section">
      <h2>📊 验证结果</h2>
      <div class="verification-results">
        <div v-if="verificationResults.length === 0" class="no-results">
          暂无验证结果，请点击上方按钮开始验证
        </div>
        <div v-for="(result, index) in verificationResults" :key="index" class="result-item" :class="result.type">
          <div class="result-header">
            <span class="result-title">{{ result.title }}</span>
            <span class="result-network">{{ result.network }}</span>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { unifiedContractService as contractService } from '@/service/unifiedContractService.js'
import { unifiedContractService as contractAddressService, contractUtils as contractAddressUtils } from '@/service/unifiedContractService.js'
import { ethers } from 'ethers'

// 响应式数据
const loading = ref(false)
const error = ref('')
const verificationResults = ref([])
const selectedNetwork = ref('sepolia')
const contractInfo = reactive({
  principalToken: {},
  interestToken: {},
  loanIssuer: {}
})

// 合约配置
const contractConfigs = reactive({
  sepolia: {
    KYC_REGISTRY_ADDRESS: '0x4533f47BE0ce8b80F7bbdF02939f81F4A15b7A45',
    LOAN_ISSUER_ADDRESS: '0x13159e6417D98528C220b12Ec4950D5A343E5eAA',
    PRINCIPAL_TOKEN_ADDRESS: '0x45b1eCb3D9af651244eC656ed15B86404924c354',
    INTEREST_TOKEN_ADDRESS: '0xE6aeE4a898c6d99033ee5380Df407C5DD470fb17',
    TRADE_CONTRACT_ADDRESS: '0x13159e6417D98528C220b12Ec4950D5A343E5eAA',
    COMPLIANCE_GUARD_ADDRESS: '0x1234567890123456789012345678901234567890'
  },
  mainnet: {
    KYC_REGISTRY_ADDRESS: '0x4533f47BE0ce8b80F7bbdF02939f81F4A15b7A45',
    LOAN_ISSUER_ADDRESS: '0x1234567890123456789012345678901234567890',
    PRINCIPAL_TOKEN_ADDRESS: '0x45b1eCb3D9af651244eC656ed15B86404924c354',
    INTEREST_TOKEN_ADDRESS: '0xE6aeE4a898c6d99033ee5380Df407C5DD470fb17',
    TRADE_CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
    COMPLIANCE_GUARD_ADDRESS: '0x1234567890123456789012345678901234567890'
  }
})

// 当前网络信息
const currentChainId = ref(null)
const currentNetworkName = computed(() => {
  switch (currentChainId.value) {
    case 1: return 'Ethereum Mainnet'
    case 11155111: return 'Sepolia Testnet'
    default: return '未知网络'
  }
})

// 添加验证结果
const addResult = (title, data, type = 'info', network = null) => {
  verificationResults.value.unshift({
    title,
    data,
    type,
    network: network || selectedNetwork.value,
    timestamp: Date.now()
  })
  if (verificationResults.value.length > 50) {
    verificationResults.value = verificationResults.value.slice(0, 50)
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

// 选择网络
const selectNetwork = (network) => {
  selectedNetwork.value = network
  addResult('网络选择', { network }, 'info')
}

// 验证单个合约
const verifyContract = async (contractType) => {
  loading.value = true
  error.value = ''
  
  try {
    const config = contractConfigs[selectedNetwork.value]
    let address
    let contractName
    
    switch (contractType) {
      case 'kycRegistry':
        address = config.KYC_REGISTRY_ADDRESS
        contractName = 'KYC注册表'
        break
      case 'loanIssuer':
        address = config.LOAN_ISSUER_ADDRESS
        contractName = 'Loan发行者'
        break
      case 'principalToken':
        address = config.PRINCIPAL_TOKEN_ADDRESS
        contractName = '本金代币'
        break
      case 'interestToken':
        address = config.INTEREST_TOKEN_ADDRESS
        contractName = '利息代币'
        break
      case 'tradeContract':
        address = config.TRADE_CONTRACT_ADDRESS
        contractName = '交易合约'
        break
      case 'complianceGuard':
        address = config.COMPLIANCE_GUARD_ADDRESS
        contractName = '合规守卫'
        break
    }
    
    if (!address || address === '0x1234567890123456789012345678901234567890') {
      throw new Error(`${contractName}合约地址未配置或为默认地址`)
    }
    
    // 使用新的合约地址服务进行验证
    const verification = await contractAddressService.verifyContractExists(address)
    
    if (!verification.exists) {
      throw new Error(`${contractName}合约不存在或未部署: ${verification.error || '未知错误'}`)
    }
    
    addResult(`验证${contractName}`, {
      contractType,
      address,
      network: selectedNetwork.value,
      codeLength: verification.codeLength,
      deployed: true,
      blockExplorerLink: contractAddressUtils.getBlockExplorerLink(address, 'address', selectedNetwork.value)
    }, 'success')
    
  } catch (err) {
    error.value = err.message
    addResult(`验证${contractType}`, { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 验证所有合约
const verifyAllContracts = async () => {
  loading.value = true
  error.value = ''
  
  const contracts = ['kycRegistry', 'loanIssuer', 'principalToken', 'interestToken', 'tradeContract', 'complianceGuard']
  
  for (const contract of contracts) {
    await verifyContract(contract)
    // 添加小延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  loading.value = false
}

// 抓取合约信息
const fetchTokenInfo = async (tokenType = 'both') => {
  loading.value = true
  error.value = ''
  
  try {
    const config = contractConfigs[selectedNetwork.value]
    const provider = new ethers.BrowserProvider(window.ethereum)
    
    // ERC20代币ABI
    const ERC20_ABI = [
      "function name() external view returns (string memory)",
      "function symbol() external view returns (string memory)",
      "function decimals() external pure returns (uint8)",
      "function totalSupply() external view returns (uint256)",
      "function registry() external view returns (address)",
      "function requiredKycLevel() external view returns (uint8)",
      "function paused() external view returns (bool)"
    ]
    
    // 抓取本金代币信息
    if (tokenType === 'both' || tokenType === 'principal') {
      try {
        const principalContract = new ethers.Contract(config.PRINCIPAL_TOKEN_ADDRESS, ERC20_ABI, provider)
        
        const [name, symbol, decimals, totalSupply, registry, requiredKycLevel, paused] = await Promise.all([
          principalContract.name().catch(() => '未知'),
          principalContract.symbol().catch(() => '未知'),
          principalContract.decimals().catch(() => 18),
          principalContract.totalSupply().catch(() => 0),
          principalContract.registry().catch(() => '0x0000000000000000000000000000000000000000'),
          principalContract.requiredKycLevel().catch(() => 0),
          principalContract.paused().catch(() => false)
        ])
        
        contractInfo.principalToken = {
          address: config.PRINCIPAL_TOKEN_ADDRESS,
          name,
          symbol,
          decimals: decimals.toString(),
          totalSupply: ethers.formatEther(totalSupply),
          registry,
          requiredKycLevel: requiredKycLevel.toString(),
          paused
        }
        
        addResult('抓取本金代币信息', contractInfo.principalToken, 'success')
      } catch (err) {
        addResult('抓取本金代币信息', { error: err.message }, 'error')
      }
    }
    
    // 抓取利息代币信息
    if (tokenType === 'both' || tokenType === 'interest') {
      try {
        const interestContract = new ethers.Contract(config.INTEREST_TOKEN_ADDRESS, ERC20_ABI, provider)
        
        const [name, symbol, decimals, totalSupply, registry, requiredKycLevel, paused] = await Promise.all([
          interestContract.name().catch(() => '未知'),
          interestContract.symbol().catch(() => '未知'),
          interestContract.decimals().catch(() => 18),
          interestContract.totalSupply().catch(() => 0),
          interestContract.registry().catch(() => '0x0000000000000000000000000000000000000000'),
          interestContract.requiredKycLevel().catch(() => 0),
          interestContract.paused().catch(() => false)
        ])
        
        contractInfo.interestToken = {
          address: config.INTEREST_TOKEN_ADDRESS,
          name,
          symbol,
          decimals: decimals.toString(),
          totalSupply: ethers.formatEther(totalSupply),
          registry,
          requiredKycLevel: requiredKycLevel.toString(),
          paused
        }
        
        addResult('抓取利息代币信息', contractInfo.interestToken, 'success')
      } catch (err) {
        addResult('抓取利息代币信息', { error: err.message }, 'error')
      }
    }
    
  } catch (err) {
    error.value = err.message
    addResult('抓取代币信息', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 抓取Loan发行者信息
const fetchLoanIssuerInfo = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const config = contractConfigs[selectedNetwork.value]
    const provider = new ethers.BrowserProvider(window.ethereum)
    
    // LoanIssuer合约ABI
    const LOAN_ISSUER_ABI = [
      "function registry() external view returns (address)",
      "function principalToken() external view returns (address)",
      "function interestToken() external view returns (address)",
      "function nextLoanId() external view returns (uint256)"
    ]
    
    const loanIssuerContract = new ethers.Contract(config.LOAN_ISSUER_ADDRESS, LOAN_ISSUER_ABI, provider)
    
    const [registry, principalToken, interestToken, nextLoanId] = await Promise.all([
      loanIssuerContract.registry().catch(() => '0x0000000000000000000000000000000000000000'),
      loanIssuerContract.principalToken().catch(() => '0x0000000000000000000000000000000000000000'),
      loanIssuerContract.interestToken().catch(() => '0x0000000000000000000000000000000000000000'),
      loanIssuerContract.nextLoanId().catch(() => 0)
    ])
    
    contractInfo.loanIssuer = {
      address: config.LOAN_ISSUER_ADDRESS,
      registry,
      principalToken,
      interestToken,
      nextLoanId: nextLoanId.toString()
    }
    
    addResult('抓取Loan发行者信息', contractInfo.loanIssuer, 'success')
    
  } catch (err) {
    error.value = err.message
    addResult('抓取Loan发行者信息', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 抓取所有合约信息
const fetchAllContractInfo = async () => {
  await fetchTokenInfo('both')
  await fetchLoanIssuerInfo()
}

// 网络切换
const switchToSepolia = async () => {
  loading.value = true
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    })
    
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    currentChainId.value = parseInt(chainId, 16)
    selectedNetwork.value = 'sepolia'
    
    addResult('网络切换', { target: 'Sepolia Testnet', chainId: currentChainId.value }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('网络切换', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

const switchToMainnet = async () => {
  loading.value = true
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    })
    
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    currentChainId.value = parseInt(chainId, 16)
    selectedNetwork.value = 'mainnet'
    
    addResult('网络切换', { target: 'Ethereum Mainnet', chainId: currentChainId.value }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('网络切换', { error: err.message }, 'error')
  } finally {
    loading.value = false
  }
}

// 保存配置
const saveConfigurations = () => {
  try {
    localStorage.setItem('contractConfigs', JSON.stringify(contractConfigs))
    addResult('保存配置', { message: '配置已保存到本地存储' }, 'success')
  } catch (err) {
    error.value = err.message
    addResult('保存配置', { error: err.message }, 'error')
  }
}

// 加载配置
const loadConfigurations = () => {
  try {
    const saved = localStorage.getItem('contractConfigs')
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.assign(contractConfigs, parsed)
      addResult('加载配置', { message: '配置已从本地存储加载' }, 'success')
    } else {
      addResult('加载配置', { message: '未找到保存的配置' }, 'warning')
    }
  } catch (err) {
    error.value = err.message
    addResult('加载配置', { error: err.message }, 'error')
  }
}

// 清除结果
const clearResults = () => {
  verificationResults.value = []
}

// 组件挂载时获取当前网络信息
onMounted(async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      currentChainId.value = parseInt(chainId, 16)
      
      // 根据当前网络设置默认选择
      if (currentChainId.value === 11155111) {
        selectedNetwork.value = 'sepolia'
      } else if (currentChainId.value === 1) {
        selectedNetwork.value = 'mainnet'
      }
      
      addResult('初始化', { 
        chainId: currentChainId.value, 
        selectedNetwork: selectedNetwork.value 
      }, 'info')
    }
  } catch (err) {
    console.error('获取网络信息失败:', err)
  }
})
</script>

<style scoped>
.contract-deployment-verification {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #0f172a;
  color: #ffffff;
  min-height: 100vh;
}

.description {
  margin-bottom: 30px;
  color: #94a3b8;
  font-size: 16px;
  line-height: 1.6;
}

.test-section {
  margin: 30px 0;
  padding: 25px;
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
}

.test-section h2 {
  margin: 0 0 25px 0;
  color: #f1f5f9;
  font-size: 20px;
}

.network-selector {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.network-btn {
  padding: 12px 24px;
  border: 2px solid #475569;
  border-radius: 8px;
  background: #334155;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.network-btn.sepolia {
  border-color: #8b5cf6;
}

.network-btn.mainnet {
  border-color: #3b82f6;
}

.network-btn.active {
  background: #475569;
  border-color: #64748b;
}

.network-btn.sepolia.active {
  background: #7c3aed;
  border-color: #8b5cf6;
}

.network-btn.mainnet.active {
  background: #2563eb;
  border-color: #3b82f6;
}

.current-network {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #334155;
  border-radius: 8px;
}

.network-label {
  font-weight: 600;
  color: #e2e8f0;
}

.network-value {
  color: #3b82f6;
  font-weight: 600;
}

.network-chain-id {
  color: #94a3b8;
  font-size: 14px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #334155;
  border-radius: 8px;
  border: 1px solid #475569;
}

.config-item label {
  font-weight: 600;
  min-width: 120px;
  color: #e2e8f0;
}

.config-item input {
  flex: 1;
  padding: 10px;
  border: 1px solid #475569;
  border-radius: 6px;
  background: #1e293b;
  color: #ffffff;
  font-family: monospace;
}

.verify-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #059669;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.verify-btn:hover:not(:disabled) {
  background: #047857;
}

.verify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.config-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
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

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.contract-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.contract-info-card {
  padding: 20px;
  background: #334155;
  border-radius: 10px;
  border: 1px solid #475569;
}

.contract-info-card h3 {
  margin: 0 0 20px 0;
  color: #f1f5f9;
  font-size: 18px;
  border-bottom: 2px solid #475569;
  padding-bottom: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #475569;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-item label {
  font-weight: 600;
  color: #e2e8f0;
  min-width: 120px;
}

.info-item .address {
  font-family: monospace;
  color: #60a5fa;
  font-size: 12px;
}

.info-item .paused {
  color: #f87171;
}

.fetch-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.network-switch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.network-card {
  padding: 20px;
  background: #334155;
  border-radius: 10px;
  border: 1px solid #475569;
}

.network-card h3 {
  margin: 0 0 20px 0;
  color: #f1f5f9;
  font-size: 18px;
}

.network-info {
  margin-bottom: 20px;
}

.verification-results {
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.no-results {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 40px;
  background: #334155;
  border-radius: 8px;
}

.result-item {
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 10px;
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
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.result-title {
  font-weight: 600;
  color: #f1f5f9;
}

.result-network {
  padding: 4px 8px;
  background: #475569;
  border-radius: 4px;
  font-size: 12px;
  color: #e2e8f0;
}

.result-time {
  color: #94a3b8;
  font-size: 12px;
}

.result-content pre {
  background: #0f172a;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  color: #e2e8f0;
  line-height: 1.4;
}

.error-section {
  margin: 30px 0;
  padding: 25px;
  background: #7f1d1d;
  border-radius: 12px;
  border: 1px solid #ef4444;
}

.error-section h2 {
  margin: 0 0 20px 0;
  color: #fca5a5;
}

.error-content {
  background: #0f172a;
  padding: 20px;
  border-radius: 8px;
  color: #fca5a5;
  font-family: monospace;
  white-space: pre-wrap;
  margin-bottom: 20px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .contract-info-grid {
    grid-template-columns: 1fr;
  }
  
  .network-switch-grid {
    grid-template-columns: 1fr;
  }
  
  .config-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .config-item label {
    min-width: auto;
    margin-bottom: 8px;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
