<!-- <template>
  <div class="contract-page">
    <!-- 合同头部 
    <div class="contract-header">
      <div class="contract-header-content">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
        </button>
        <div class="contract-title">
          <h1>Smart Contract Details</h1>
          <p class="contract-subtitle">Real World Asset Investment Contract</p>
        </div>
      </div>
    </div>

    <!-- 合同内容 
    <div class="contract-content">
      <!-- 合同信息卡片 
      <div class="contract-card">
        <div class="contract-card-header">
          <div class="contract-icon">📄</div>
          <div class="contract-info">
            <h2>{{ contractData.projectName }}</h2>
            <p class="contract-code">Project Code: {{ contractData.projectCode }}</p>
            <p class="contract-status" :class="contractData.status">
              {{ contractData.statusText }}
            </p>
          </div>
        </div>

        <!-- 房产信息 
        <div class="contract-section">
          <h3 class="section-title">
            <span class="section-icon">🏠</span>
            Property Information
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Property Address</span>
              <span class="info-value">{{ contractData.propertyAddress }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Property Type</span>
              <span class="info-value">{{ contractData.propertyType }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Property Size</span>
              <span class="info-value">{{ contractData.propertySize }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Property Value</span>
              <span class="info-value">{{ contractData.propertyValue }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Location</span>
              <span class="info-value">{{ contractData.location }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Build Year</span>
              <span class="info-value">{{ contractData.buildYear }}</span>
            </div>
          </div>
        </div>

        <!-- 合同增发机制 
        <div class="contract-section">
          <h3 class="section-title">
            <span class="section-icon">🔄</span>
            Contract Issuance Mechanism
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Total Supply</span>
              <span class="info-value">{{ contractData.totalSupply }} tokens</span>
            </div>
            <div class="info-item">
              <span class="info-label">Issued Tokens</span>
              <span class="info-value">{{ contractData.issuedTokens }} tokens</span>
            </div>
            <div class="info-item">
              <span class="info-label">Remaining Tokens</span>
              <span class="info-value">{{ contractData.remainingTokens }} tokens</span>
            </div>
            <div class="info-item">
              <span class="info-label">Issuance Condition</span>
              <span class="info-value">{{ contractData.issuanceCondition }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Issuance Frequency</span>
              <span class="info-value">{{ contractData.issuanceFrequency }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Minimum Issuance Unit</span>
              <span class="info-value">{{ contractData.minIssuanceUnit }} tokens</span>
            </div>
          </div>
        </div>

        <!-- 认购信息 
        <div class="contract-section">
          <h3 class="section-title">
            <span class="section-icon">💰</span>
            Subscription Information
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Subscription Amount</span>
              <span class="info-value">{{ contractData.subscriptionAmount }} tokens</span>
            </div>
            <div class="info-item">
              <span class="info-label">Subscription Price</span>
              <span class="info-value">AUD${{ contractData.subscriptionPrice }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total Subscription Value</span>
              <span class="info-value">AUD${{ contractData.totalSubscriptionValue }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Subscription Date</span>
              <span class="info-value">{{ contractData.subscriptionDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Transaction Type</span>
              <span class="info-value" :class="contractData.transactionType">
                {{ contractData.transactionType.toUpperCase() }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Transaction Hash</span>
              <span class="info-value hash-value" @click="copyHash">
                {{ contractData.transactionHash }}
              </span>
            </div>
          </div>
        </div>

        <!-- 利息计息周期 
        <div class="contract-section">
          <h3 class="section-title">
            <span class="section-icon">📅</span>
            Interest Calculation Period
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Annual Yield</span>
              <span class="info-value">{{ contractData.annualYield }}%</span>
            </div>
            <div class="info-item">
              <span class="info-label">Interest Calculation</span>
              <span class="info-value">{{ contractData.interestCalculation }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Interest Period</span>
              <span class="info-value">{{ contractData.interestPeriod }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Compound Interest</span>
              <span class="info-value">{{ contractData.compoundInterest ? '是' : '否' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Minimum Interest Amount</span>
              <span class="info-value">AUD${{ contractData.minInterestAmount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Interest Start Date</span>
              <span class="info-value">{{ contractData.interestStartDate }}</span>
            </div>
          </div>
        </div>

        <!-- 发息日信息 
        <div class="contract-section">
          <h3 class="section-title">
            <span class="section-icon">💸</span>
            Distribution Information
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Distribution Frequency</span>
              <span class="info-value">{{ contractData.distributionFrequency }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Next Distribution Date</span>
              <span class="info-value">{{ contractData.nextDistributionDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Accumulated Interest</span>
              <span class="info-value">AUD${{ contractData.accumulatedInterest }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Distributed Interest</span>
              <span class="info-value">AUD${{ contractData.distributedInterest }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Pending Interest</span>
              <span class="info-value">AUD${{ contractData.pendingInterest }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Distribution Method</span>
              <span class="info-value">{{ contractData.distributionMethod }}</span>
            </div>
          </div>
        </div>

        <!-- 合约条款 
        <div class="contract-section">
          <h3 class="section-title">
            <span class="section-icon">📋</span>
            Contract Terms
          </h3>
          <div class="terms-content">
            <div class="terms-item">
              <h4>1. Investment Terms</h4>
              <p>Investors obtain a proportionate share of the rental income through the purchase of tokens for the property.</p>
            </div>
            <div class="terms-item">
              <h4>2. Revenue Distribution</h4>
              <p>Rental income will be distributed proportionally based on the investor's token holdings, with a distribution cycle of {{ contractData.distributionFrequency }}.</p>
            </div>
            <div class="terms-item">
              <h4>3. Risk Warning</h4>
              <p>Real estate investment involves market risks, and investors should fully understand and谨慎投资。</p>
            </div>
            <div class="terms-item">
              <h4>4. Exit Mechanism</h4>
              <p>投资者可在二级市场交易代币，或通过智能合约赎回机制退出投资。</p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 
        <div class="contract-actions">
          <button class="action-btn primary" @click="viewTransaction">
            View Transaction Details
          </button>
          <button class="action-btn secondary" @click="downloadContract">
            Download Contract
          </button>
          <button class="action-btn tertiary" @click="shareContract">
            Share Contract
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productAPI } from '@/service/api'

const router = useRouter()
const route = useRoute()

// 合同数据
const contractData = ref({
  projectName: '',
  projectCode: '',
  status: 'active',
  statusText: 'Active',
  propertyAddress: '',
  propertyType: '',
  propertySize: '',
  propertyValue: '',
  location: '',
  buildYear: '',
  totalSupply: 0,
  issuedTokens: 0,
  remainingTokens: 0,
  issuanceCondition: '',
  issuanceFrequency: '',
  minIssuanceUnit: 0,
  subscriptionAmount: 0,
  subscriptionPrice: 0,
  totalSubscriptionValue: 0,
  subscriptionDate: '',
  transactionType: '',
  transactionHash: '',
  annualYield: 0,
  interestCalculation: '',
  interestPeriod: '',
  compoundInterest: false,
  minInterestAmount: 0,
  interestStartDate: '',
  distributionFrequency: '',
  nextDistributionDate: '',
  accumulatedInterest: 0,
  distributedInterest: 0,
  pendingInterest: 0,
  distributionMethod: ''
})

// 加载合同数据
const loadContractData = async () => {
  try {
    const query = route.query
    console.log('📄 加载合同数据:', query)
    
    // 从URL参数获取交易信息
    contractData.value.projectCode = query.projectCode || 'RWA007'
    contractData.value.subscriptionAmount = query.amount || 0
    contractData.value.transactionType = query.type || 'buy'
    contractData.value.subscriptionDate = formatDate(query.timestamp)
    contractData.value.transactionHash = generateHash()
    
    // 从API获取项目详细信息
    if (query.projectCode) {
      const response = await productAPI.getProductByCode(query.projectCode)
      if (response.status === 0 && response.data) {
        const project = response.data
        contractData.value.projectName = project.name || 'Bondi Beach Apartment Project'
        contractData.value.propertyAddress = project.address || '123 Bondi Beach Road, Bondi NSW 2026'
        contractData.value.propertyType = project.propertyType || 'Apartment'
        contractData.value.propertySize = project.size || '85 sqm'
        contractData.value.propertyValue = `AUD$${project.valuation || '1,200,000'}`
        contractData.value.location = project.location || 'Bondi Beach, NSW'
        contractData.value.buildYear = project.buildYear || '2018'
        contractData.value.annualYield = project.targetYield || 8.5
        contractData.value.totalSupply = project.totalOffering || 1000000
        contractData.value.subscriptionPrice = project.currentPrice || 1.0
      }
    }
    
    // 计算其他数据
    calculateContractData()
    
  } catch (error) {
    console.error('❌ 加载合同数据失败:', error)
    // 使用默认数据
    setDefaultData()
  }
}

// 设置默认数据
const setDefaultData = () => {
  contractData.value = {
    projectName: 'Bondi Beach Apartment Project',
    projectCode: 'RWA007',
    status: 'active',
    statusText: '活跃',
    propertyAddress: '123 Bondi Beach Road, Bondi NSW 2026',
    propertyType: 'Apartment',
    propertySize: '85 sqm',
    propertyValue: 'AUD$1,200,000',
    location: 'Bondi Beach, NSW',
    buildYear: '2018',
    totalSupply: 1000000,
    issuedTokens: 750000,
    remainingTokens: 250000,
    issuanceCondition: '市场需求达到阈值',
    issuanceFrequency: '每月评估',
    minIssuanceUnit: 1000,
    subscriptionAmount: route.query.amount || 500,
    subscriptionPrice: 1.0,
    totalSubscriptionValue: (route.query.amount || 500) * 1.0,
    subscriptionDate: formatDate(route.query.timestamp),
    transactionType: route.query.type || 'buy',
    transactionHash: generateHash(),
    annualYield: 8.5,
    interestCalculation: '复利计算',
    interestPeriod: '按月计息',
    compoundInterest: true,
    minInterestAmount: 10,
    interestStartDate: formatDate(new Date()),
    distributionFrequency: '每月15日',
    nextDistributionDate: getNextDistributionDate(),
    accumulatedInterest: 0,
    distributedInterest: 0,
    pendingInterest: 0,
    distributionMethod: '自动转账到钱包'
  }
}

// 计算合同数据
const calculateContractData = () => {
  const amount = contractData.value.subscriptionAmount
  const price = contractData.value.subscriptionPrice
  const annualYield = contractData.value.annualYield
  
  contractData.value.totalSubscriptionValue = amount * price
  contractData.value.remainingTokens = contractData.value.totalSupply - contractData.value.issuedTokens
  
  // 计算利息相关数据
  const monthlyYield = annualYield / 12 / 100
  const monthsHeld = 6 // 假设持有6个月
  contractData.value.accumulatedInterest = amount * price * monthlyYield * monthsHeld
  contractData.value.distributedInterest = contractData.value.accumulatedInterest * 0.6 // 假设已发放60%
  contractData.value.pendingInterest = contractData.value.accumulatedInterest - contractData.value.distributedInterest
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return new Date().toLocaleDateString('zh-CN')
  const date = new Date(parseInt(timestamp))
  return date.toLocaleDateString('zh-CN')
}

// 生成交易哈希
const generateHash = () => {
  return '0x' + Math.random().toString(16).substr(2, 64)
}

// 获取下次发息日
const getNextDistributionDate = () => {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15)
  return nextMonth.toLocaleDateString('zh-CN')
}

// 复制哈希值
const copyHash = async () => {
  try {
    await navigator.clipboard.writeText(contractData.value.transactionHash)
    alert('交易哈希已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    alert('复制失败，请手动复制')
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 查看交易详情
const viewTransaction = () => {
  // 可以跳转到区块链浏览器或交易详情页面
  window.open(`https://etherscan.io/tx/${contractData.value.transactionHash}`, '_blank')
}

// 下载合同
const downloadContract = () => {
  alert('合同下载功能开发中...')
}

// 分享合同
const shareContract = () => {
  if (navigator.share) {
    navigator.share({
      title: '智能合约详情',
      text: `查看 ${contractData.value.projectName} 的合约详情`,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('合同链接已复制到剪贴板')
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadContractData()
})
</script>

<style scoped>
.contract-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.contract-header {
  background: rgba(20, 20, 40, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(138, 43, 226, 0.2);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.contract-header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(138, 43, 226, 0.1);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.back-btn:hover {
  background: rgba(138, 43, 226, 0.2);
  transform: translateY(-1px);
}

.back-icon {
  font-size: 16px;
  font-weight: bold;
}

.contract-title h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
  background: linear-gradient(135deg, #ffffff, rgba(138, 43, 226, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contract-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.contract-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.contract-card {
  background: rgba(20, 20, 40, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.contract-card-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(138, 43, 226, 0.2);
}

.contract-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(138, 43, 226, 0.1);
  border-radius: 16px;
  border: 2px solid rgba(138, 43, 226, 0.3);
}

.contract-info h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #ffffff;
}

.contract-code {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 8px 0;
  font-family: 'Courier New', monospace;
}

.contract-status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contract-status.active {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.contract-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(138, 43, 226, 0.2);
}

.section-icon {
  font-size: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(138, 43, 226, 0.05);
  border: 1px solid rgba(138, 43, 226, 0.1);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.info-item:hover {
  background: rgba(138, 43, 226, 0.1);
  transform: translateY(-1px);
}

.info-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  text-align: right;
}

.info-value.buy {
  color: #22c55e;
}

.info-value.sell {
  color: #ef4444;
}

.hash-value {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: rgba(138, 43, 226, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hash-value:hover {
  background: rgba(138, 43, 226, 0.2);
}

.terms-content {
  background: rgba(138, 43, 226, 0.05);
  border: 1px solid rgba(138, 43, 226, 0.1);
  border-radius: 12px;
  padding: 24px;
}

.terms-item {
  margin-bottom: 20px;
}

.terms-item:last-child {
  margin-bottom: 0;
}

.terms-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.terms-item p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.contract-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(138, 43, 226, 0.2);
}

.action-btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 120px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #8a2be2, #6b21a8);
  color: #ffffff;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #7c3aed, #5b21b6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
}

.action-btn.secondary {
  background: rgba(138, 43, 226, 0.1);
  color: #ffffff;
  border: 1px solid rgba(138, 43, 226, 0.3);
}

.action-btn.secondary:hover {
  background: rgba(138, 43, 226, 0.2);
  transform: translateY(-1px);
}

.action-btn.tertiary {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.tertiary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

@media (max-width: 768px) {
  .contract-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .contract-card {
    padding: 20px;
  }
  
  .contract-card-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .contract-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style> -->
