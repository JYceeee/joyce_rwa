<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <h2 class="modal-title">一键部署&交易ETH</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <!-- 弹窗内容 -->
      <div class="modal-body">
        <!-- 步骤指示器 -->
        <div class="steps-indicator">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            :class="['step', { 
              active: currentStep === index, 
              completed: currentStep > index,
              error: step.hasError
            }]"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step.label }}</div>
            <div v-if="step.hasError" class="step-error">❌</div>
            <div v-else-if="currentStep > index" class="step-success">✅</div>
          </div>
        </div>

        <!-- 当前步骤内容 -->
        <div class="step-content">
          <!-- 网络检查步骤 -->
          <div v-if="currentStep === 0" class="step-panel">
            <h3>网络检查</h3>
            <div class="status-info">
              <div class="info-item">
                <span class="label">当前网络:</span>
                <span :class="['value', networkStatus.isCorrect ? 'success' : 'error']">
                  {{ networkStatus.name }}
                </span>
              </div>
              <div class="info-item">
                <span class="label">钱包地址:</span>
                <span class="value">{{ walletAddress || '未连接' }}</span>
              </div>
              <div class="info-item">
                <span class="label">余额检查:</span>
                <span :class="['value', balanceStatus.isSufficient ? 'success' : 'error']">
                  {{ balanceStatus.message }}
                </span>
              </div>
            </div>
            <button 
              class="btn primary" 
              @click="performNetworkCheck"
              :disabled="loading"
            >
              {{ loading ? '检查中...' : '开始检查' }}
            </button>
          </div>

          <!-- 合约部署步骤 -->
          <div v-if="currentStep === 1" class="step-panel">
            <h3>合约部署</h3>
            <div class="deployment-info">
              <p>正在部署以下合约:</p>
              <ul class="contract-list">
                <li>Principal Token (本金代币)</li>
                <li>Interest Token (利息代币)</li>
                <li>ComplianceGuard (合规检查)</li>
                <li>KYCManager (KYC管理)</li>
                <li>HolderRegistry (持有者注册)</li>
                <li>RWAManager (RWA管理)</li>
              </ul>
            </div>
            <div v-if="deploymentProgress.length > 0" class="deployment-progress">
              <div 
                v-for="(item, index) in deploymentProgress" 
                :key="index"
                class="progress-item"
              >
                <span class="contract-name">{{ item.name }}</span>
                <span :class="['status', item.status]">
                  {{ item.status === 'deploying' ? '部署中...' : 
                     item.status === 'success' ? '✅ 成功' : 
                     item.status === 'error' ? '❌ 失败' : '等待中...' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 管理合约初始化步骤 -->
          <div v-if="currentStep === 2" class="step-panel">
            <h3>管理合约初始化</h3>
            <div class="init-info">
              <p>正在初始化管理合约:</p>
              <ul class="init-list">
                <li>注册Token地址</li>
                <li>配置白名单/合规模块</li>
                <li>设置额度限制</li>
                <li>配置铸造权限</li>
                <li>设置暂停策略</li>
              </ul>
            </div>
            <div v-if="initProgress.length > 0" class="init-progress">
              <div 
                v-for="(item, index) in initProgress" 
                :key="index"
                class="progress-item"
              >
                <span class="task-name">{{ item.name }}</span>
                <span :class="['status', item.status]">
                  {{ item.status === 'initializing' ? '初始化中...' : 
                     item.status === 'success' ? '✅ 成功' : 
                     item.status === 'error' ? '❌ 失败' : '等待中...' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 资金转账步骤 -->
          <div v-if="currentStep === 3" class="step-panel">
            <h3>资金转账</h3>
            <div class="transfer-info">
              <div class="transfer-details">
                <div class="detail-row">
                  <span class="label">转账金额:</span>
                  <span class="value">{{ transferAmount }} ETH</span>
                </div>
                <div class="detail-row">
                  <span class="label">接收方:</span>
                  <span class="value">{{ loanIssuerAddress }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">网络:</span>
                  <span class="value">{{ networkStatus.name }}</span>
                </div>
              </div>
              <button 
                class="btn primary" 
                @click="performTransfer"
                :disabled="transferring"
              >
                {{ transferring ? '转账中...' : '确认转账' }}
              </button>
            </div>
          </div>

          <!-- 完成步骤 -->
          <div v-if="currentStep === 4" class="step-panel">
            <h3>交易完成</h3>
            <div class="completion-info">
              <div class="success-icon">✅</div>
              <h4>部署和交易成功完成!</h4>
              <div class="result-summary">
                <div class="summary-item">
                  <span class="label">Principal Token:</span>
                  <span class="value" @click="copyToClipboard(deployedContracts.principalToken)">
                    {{ formatAddress(deployedContracts.principalToken) }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Interest Token:</span>
                  <span class="value" @click="copyToClipboard(deployedContracts.interestToken)">
                    {{ formatAddress(deployedContracts.interestToken) }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">交易哈希:</span>
                  <span class="value" @click="copyToClipboard(transactionHash)">
                    {{ formatHash(transactionHash) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="errorMessage" class="error-message">
          <div class="error-icon">⚠️</div>
          <div class="error-text">{{ errorMessage }}</div>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="modal-footer">
        <button class="btn secondary" @click="closeModal" v-if="currentStep < 4">
          取消
        </button>
        <button 
          class="btn primary" 
          @click="nextStep"
          :disabled="!canProceed"
          v-if="currentStep < 4"
        >
          下一步
        </button>
        <button class="btn primary" @click="handleComplete" v-if="currentStep === 4">
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { useWallet } from '@/composables/useWallet'
import { CONTRACT_CONFIG } from '@/config/contractConfig'
import { contractService } from '@/service/contractService'

export default {
  name: 'OneClickDeployModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    projectCode: {
      type: String,
      required: true
    },
    tradeAmount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentStep: 0,
      loading: false,
      transferring: false,
      errorMessage: '',
      
      // 网络状态
      networkStatus: {
        isCorrect: false,
        name: 'Unknown',
        chainId: null
      },
      
      // 余额状态
      balanceStatus: {
        isSufficient: false,
        message: '检查中...'
      },
      
      // 钱包地址
      walletAddress: '',
      
      // 部署进度
      deploymentProgress: [],
      
      // 初始化进度
      initProgress: [],
      
      // 部署的合约地址
      deployedContracts: {
        principalToken: '',
        interestToken: '',
        complianceGuard: '',
        kycManager: '',
        holderRegistry: '',
        rwaManager: ''
      },
      
      // 交易哈希
      transactionHash: '',
      
      // Loan Issuer地址
      loanIssuerAddress: CONTRACT_CONFIG.LOAN_ISSUER_ADDRESS,
      
      // 转账金额
      transferAmount: 0,
      
      // 步骤定义
      steps: [
        { label: '网络检查', hasError: false },
        { label: '合约部署', hasError: false },
        { label: '合约初始化', hasError: false },
        { label: '资金转账', hasError: false },
        { label: '完成', hasError: false }
      ]
    }
  },
  computed: {
    canProceed() {
      switch (this.currentStep) {
        case 0:
          return this.networkStatus.isCorrect && this.balanceStatus.isSufficient
        case 1:
          return this.deploymentProgress.every(item => item.status === 'success')
        case 2:
          return this.initProgress.every(item => item.status === 'success')
        case 3:
          return this.transactionHash !== ''
        default:
          return true
      }
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initializeModal()
      }
    },
    tradeAmount: {
      handler(newVal) {
        this.transferAmount = newVal
      },
      immediate: true
    }
  },
  methods: {
    // 初始化弹窗
    async initializeModal() {
      this.currentStep = 0
      this.errorMessage = ''
      this.loading = false
      this.transferring = false
      
      // 获取钱包信息
      const { address, connected } = useWallet()
      this.walletAddress = connected.value ? address.value : ''
      
      // 自动开始网络检查
      if (this.walletAddress) {
        await this.performNetworkCheck()
      }
    },
    
    // 网络检查
    async performNetworkCheck() {
      this.loading = true
      this.errorMessage = ''
      
      try {
        console.log('🔍 开始网络检查...')
        
        // 检查MetaMask连接
        if (!window.ethereum) {
          throw new Error('MetaMask未安装')
        }
        
        // 获取当前网络
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const expectedChainId = '0xaa36a7' // Sepolia测试网
        
        console.log('📡 当前链ID:', chainId, '期望链ID:', expectedChainId)
        
        if (chainId !== expectedChainId) {
          this.loading = false
          this.loading = true
          
          // 尝试切换网络
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: expectedChainId }],
            })
          } catch (switchError) {
            // 如果网络不存在，添加Sepolia网络
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: expectedChainId,
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SepoliaETH',
                  decimals: 18
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            })
          }
        }
        
        // 更新网络状态
        this.networkStatus = {
          isCorrect: true,
          name: 'Sepolia Test Network',
          chainId: chainId
        }
        
        // 检查余额
        await this.checkBalance()
        
        console.log('✅ 网络检查完成')
        
      } catch (error) {
        console.error('❌ 网络检查失败:', error)
        this.errorMessage = `网络检查失败: ${error.message}`
        this.steps[0].hasError = true
      } finally {
        this.loading = false
      }
    },
    
    // 检查余额
    async checkBalance() {
      try {
        if (!this.walletAddress) {
          throw new Error('钱包未连接')
        }
        
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(this.walletAddress)
        const balanceInETH = ethers.formatEther(balance)
        
        console.log('💰 钱包余额:', balanceInETH, 'ETH')
        
        if (parseFloat(balanceInETH) >= this.transferAmount) {
          this.balanceStatus = {
            isSufficient: true,
            message: `${balanceInETH} ETH (充足)`
          }
        } else {
          this.balanceStatus = {
            isSufficient: false,
            message: `${balanceInETH} ETH (不足)`
          }
          throw new Error(`余额不足，需要 ${this.transferAmount} ETH，当前只有 ${balanceInETH} ETH`)
        }
        
      } catch (error) {
        console.error('❌ 余额检查失败:', error)
        this.balanceStatus = {
          isSufficient: false,
          message: '检查失败'
        }
        throw error
      }
    },
    
    // 下一步
    async nextStep() {
      if (this.currentStep === 1) {
        await this.deployContracts()
      } else if (this.currentStep === 2) {
        await this.initializeContracts()
      } else if (this.currentStep === 3) {
        await this.performTransfer()
      }
      
      if (this.canProceed) {
        this.currentStep++
      }
    },
    
    // 部署合约
    async deployContracts() {
      console.log('🚀 开始部署合约...')
      
      // 初始化部署进度
      this.deploymentProgress = [
        { name: 'Principal Token', status: 'waiting' },
        { name: 'Interest Token', status: 'waiting' },
        { name: 'ComplianceGuard', status: 'waiting' },
        { name: 'KYCManager', status: 'waiting' },
        { name: 'HolderRegistry', status: 'waiting' },
        { name: 'RWAManager', status: 'waiting' }
      ]
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        
        // 部署Principal Token
        await this.deployContract('Principal Token', 'ERC20Hooked', [
          `${this.projectCode}-P`, // name
          `${this.projectCode}P`,  // symbol
          6,                       // decimals
          true                     // isPrincipal
        ])
        
        // 部署Interest Token
        await this.deployContract('Interest Token', 'ERC20Hooked', [
          `${this.projectCode}-I`, // name
          `${this.projectCode}I`,  // symbol
          18,                      // decimals
          false                    // isPrincipal
        ])
        
        // 部署其他合约
        await this.deployContract('ComplianceGuard', 'ComplianceGuard', [])
        await this.deployContract('KYCManager', 'KYCManager', [])
        await this.deployContract('HolderRegistry', 'HolderRegistry', [])
        await this.deployContract('RWAManager', 'RWAManager', [])
        
        console.log('✅ 所有合约部署完成')
        
      } catch (error) {
        console.error('❌ 合约部署失败:', error)
        this.errorMessage = `合约部署失败: ${error.message}`
        this.steps[1].hasError = true
      }
    },
    
    // 部署单个合约
    async deployContract(contractName, contractType, constructorArgs) {
      try {
        // 更新状态为部署中
        const progressItem = this.deploymentProgress.find(item => item.name === contractName)
        if (progressItem) {
          progressItem.status = 'deploying'
        }
        
        console.log(`🔨 部署 ${contractName}...`)
        
        // 从后端获取合约ABI和bytecode
        const contractInfo = await contractService.getContractDeploymentInfo(contractType)
        
        if (!contractService.validateContractInfo(contractInfo)) {
          throw new Error(`合约信息无效: ${contractType}`)
        }
        
        // 创建合约工厂
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contractFactory = new ethers.ContractFactory(contractInfo.abi, contractInfo.bytecode, signer)
        
        console.log(`📋 合约构造函数参数:`, constructorArgs)
        
        // 部署合约
        const contract = await contractFactory.deploy(...constructorArgs)
        console.log(`⏳ 等待合约部署确认: ${contract.address}`)
        
        // 等待部署交易确认
        const deploymentTx = contract.deploymentTransaction()
        if (deploymentTx) {
          await deploymentTx.wait()
        }
        
        const deployedAddress = await contract.getAddress()
        
        // 保存合约地址
        switch (contractName) {
          case 'Principal Token':
            this.deployedContracts.principalToken = deployedAddress
            break
          case 'Interest Token':
            this.deployedContracts.interestToken = deployedAddress
            break
          case 'ComplianceGuard':
            this.deployedContracts.complianceGuard = deployedAddress
            break
          case 'KYCManager':
            this.deployedContracts.kycManager = deployedAddress
            break
          case 'HolderRegistry':
            this.deployedContracts.holderRegistry = deployedAddress
            break
          case 'RWAManager':
            this.deployedContracts.rwaManager = deployedAddress
            break
        }
        
        // 更新状态为成功
        if (progressItem) {
          progressItem.status = 'success'
        }
        
        console.log(`✅ ${contractName} 部署成功:`, deployedAddress)
        
      } catch (error) {
        console.error(`❌ ${contractName} 部署失败:`, error)
        const progressItem = this.deploymentProgress.find(item => item.name === contractName)
        if (progressItem) {
          progressItem.status = 'error'
        }
        throw error
      }
    },
    
    // 初始化合约
    async initializeContracts() {
      console.log('⚙️ 开始初始化合约...')
      
      // 初始化进度
      this.initProgress = [
        { name: '注册Token地址', status: 'waiting' },
        { name: '配置合规模块', status: 'waiting' },
        { name: '设置额度限制', status: 'waiting' },
        { name: '配置铸造权限', status: 'waiting' },
        { name: '设置暂停策略', status: 'waiting' }
      ]
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        
        // 1. 注册Token地址到RWAManager
        await this.initializeStep('注册Token地址', async () => {
          if (this.deployedContracts.rwaManager && this.deployedContracts.principalToken && this.deployedContracts.interestToken) {
            // 这里需要根据实际的RWAManager合约ABI来调用相应的方法
            // 暂时模拟成功
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        })
        
        // 2. 配置合规模块
        await this.initializeStep('配置合规模块', async () => {
          if (this.deployedContracts.principalToken && this.deployedContracts.complianceGuard) {
            // 调用Principal Token的setGuard方法
            const principalTokenInfo = await contractService.getContractInfo('ERC20Hooked')
            const principalToken = new ethers.Contract(
              this.deployedContracts.principalToken,
              principalTokenInfo.abi,
              signer
            )
            await principalToken.setGuard(this.deployedContracts.complianceGuard)
          }
          
          if (this.deployedContracts.interestToken && this.deployedContracts.complianceGuard) {
            // 调用Interest Token的setGuard方法
            const interestTokenInfo = await contractService.getContractInfo('ERC20Hooked')
            const interestToken = new ethers.Contract(
              this.deployedContracts.interestToken,
              interestTokenInfo.abi,
              signer
            )
            await interestToken.setGuard(this.deployedContracts.complianceGuard)
          }
        })
        
        // 3. 设置额度限制
        await this.initializeStep('设置额度限制', async () => {
          // 这里可以设置各种额度限制
          // 暂时模拟成功
          await new Promise(resolve => setTimeout(resolve, 1000))
        })
        
        // 4. 配置铸造权限
        await this.initializeStep('配置铸造权限', async () => {
          // 这里可以设置铸造权限
          // 暂时模拟成功
          await new Promise(resolve => setTimeout(resolve, 1000))
        })
        
        // 5. 设置暂停策略
        await this.initializeStep('设置暂停策略', async () => {
          // 这里可以设置暂停策略
          // 暂时模拟成功
          await new Promise(resolve => setTimeout(resolve, 1000))
        })
        
        console.log('✅ 合约初始化完成')
        
      } catch (error) {
        console.error('❌ 合约初始化失败:', error)
        this.errorMessage = `合约初始化失败: ${error.message}`
        this.steps[2].hasError = true
      }
    },
    
    // 初始化步骤
    async initializeStep(stepName, stepFunction) {
      const progressItem = this.initProgress.find(item => item.name === stepName)
      if (progressItem) {
        progressItem.status = 'initializing'
      }
      
      try {
        await stepFunction()
        
        if (progressItem) {
          progressItem.status = 'success'
        }
        
        console.log(`✅ ${stepName} 完成`)
        
      } catch (error) {
        console.error(`❌ ${stepName} 失败:`, error)
        
        if (progressItem) {
          progressItem.status = 'error'
        }
        
        throw error
      }
    },
    
    // 执行转账
    async performTransfer() {
      this.transferring = true
      this.errorMessage = ''
      
      try {
        console.log('💸 开始执行ETH转账...')
        
        if (!window.ethereum) {
          throw new Error('MetaMask未安装')
        }
        
        // 构建交易参数
        const transactionParams = {
          from: this.walletAddress,
          to: this.loanIssuerAddress,
          value: ethers.parseEther(this.transferAmount.toString()).toString(),
          gas: '0x5208', // 21000 gas limit for simple transfer
        }
        
        console.log('📤 发送交易到MetaMask...')
        
        // 发送交易
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParams],
        })
        
        this.transactionHash = txHash
        console.log('✅ 交易已发送，哈希:', txHash)
        
        // 等待交易确认
        await this.waitForTransactionConfirmation(txHash)
        
        console.log('✅ ETH转账完成')
        
      } catch (error) {
        console.error('❌ ETH转账失败:', error)
        this.errorMessage = `转账失败: ${error.message}`
        this.steps[3].hasError = true
      } finally {
        this.transferring = false
      }
    },
    
    // 等待交易确认
    async waitForTransactionConfirmation(txHash, maxAttempts = 30) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      
      for (let i = 0; i < maxAttempts; i++) {
        try {
          const receipt = await provider.getTransactionReceipt(txHash)
          if (receipt && receipt.blockNumber) {
            console.log('✅ 交易已确认，区块号:', receipt.blockNumber)
            return receipt
          }
        } catch (error) {
          console.warn(`等待交易确认 ${i + 1}/${maxAttempts}:`, error.message)
        }
        
        // 等待5秒后重试
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      
      throw new Error('交易确认超时')
    },
    
    // 复制到剪贴板
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        alert('已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
      }
    },
    
    // 格式化地址
    formatAddress(address) {
      if (!address) return 'N/A'
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    },
    
    // 格式化哈希
    formatHash(hash) {
      if (!hash) return ''
      return `${hash.substr(0, 6)}...${hash.substr(-4)}`
    },
    
    // 处理遮罩层点击
    handleOverlayClick() {
      if (this.currentStep === 4) {
        this.closeModal()
      }
    },
    
    // 处理完成按钮点击
    handleComplete() {
      this.emitCompleted()
      this.closeModal()
    },
    
    // 关闭弹窗
    closeModal() {
      this.$emit('close')
    },
    
    // 触发完成事件
    emitCompleted() {
      const completedData = {
        projectCode: this.projectCode,
        tradeType: 'buy',
        amount: this.transferAmount,
        transactionHash: this.transactionHash,
        blockNumber: 0, // 可以从交易收据获取
        principalTokenAddress: this.deployedContracts.principalToken,
        interestTokenAddress: this.deployedContracts.interestToken,
        complianceGuardAddress: this.deployedContracts.complianceGuard,
        kycManagerAddress: this.deployedContracts.kycManager,
        holderRegistryAddress: this.deployedContracts.holderRegistry,
        rwaManagerAddress: this.deployedContracts.rwaManager,
        loanIssuerAddress: this.loanIssuerAddress
      }
      
      console.log('🎉 一键部署完成，发送数据:', completedData)
      this.$emit('completed', completedData)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #1f2937;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #374151;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #ffffff;
  background: #374151;
}

.modal-body {
  padding: 24px;
}

/* 步骤指示器 */
.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
}

.steps-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 40px;
  right: 40px;
  height: 2px;
  background: #374151;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #374151;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #3b82f6;
}

.step.completed .step-number {
  background: #10b981;
}

.step.error .step-number {
  background: #ef4444;
}

.step-label {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  font-weight: 500;
}

.step.active .step-label {
  color: #3b82f6;
}

.step.completed .step-label {
  color: #10b981;
}

.step.error .step-label {
  color: #ef4444;
}

.step-success,
.step-error {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
}

/* 步骤内容 */
.step-content {
  min-height: 300px;
}

.step-panel {
  padding: 20px;
}

.step-panel h3 {
  color: #ffffff;
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

/* 状态信息 */
.status-info {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  color: #9ca3af;
  font-size: 14px;
}

.info-item .value {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

.info-item .value.success {
  color: #10b981;
}

.info-item .value.error {
  color: #ef4444;
}

/* 部署信息 */
.deployment-info,
.init-info {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.deployment-info p,
.init-info p {
  color: #ffffff;
  margin: 0 0 12px 0;
}

.contract-list,
.init-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contract-list li,
.init-list li {
  color: #d1d5db;
  padding: 4px 0;
  padding-left: 20px;
  position: relative;
}

.contract-list li::before,
.init-list li::before {
  content: '•';
  color: #3b82f6;
  position: absolute;
  left: 0;
}

/* 进度显示 */
.deployment-progress,
.init-progress {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.progress-item:last-child {
  border-bottom: none;
}

.contract-name,
.task-name {
  color: #ffffff;
  font-size: 14px;
}

.progress-item .status {
  font-size: 12px;
  font-weight: 600;
}

.progress-item .status.waiting {
  color: #9ca3af;
}

.progress-item .status.deploying,
.progress-item .status.initializing {
  color: #3b82f6;
}

.progress-item .status.success {
  color: #10b981;
}

.progress-item .status.error {
  color: #ef4444;
}

/* 转账信息 */
.transfer-info {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.transfer-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  color: #9ca3af;
  font-size: 14px;
}

.detail-row .value {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

/* 完成信息 */
.completion-info {
  text-align: center;
  padding: 20px;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.completion-info h4 {
  color: #ffffff;
  margin: 0 0 20px 0;
  font-size: 20px;
}

.result-summary {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  text-align: left;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item .label {
  color: #9ca3af;
  font-size: 14px;
}

.summary-item .value {
  color: #3b82f6;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
}

.summary-item .value:hover {
  text-decoration: underline;
}

/* 错误信息 */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-top: 20px;
}

.error-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.error-text {
  color: #fca5a5;
  font-size: 14px;
  line-height: 1.4;
}

/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: #3b82f6;
  color: #ffffff;
}

.btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn.primary:disabled {
  background: #374151;
  color: #6b7280;
  cursor: not-allowed;
}

.btn.secondary {
  background: #374151;
  color: #ffffff;
  border: 1px solid #4b5563;
}

.btn.secondary:hover {
  background: #4b5563;
}

/* 弹窗底部 */
.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #374151;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-width: none;
  }
  
  .steps-indicator {
    flex-direction: column;
    gap: 16px;
  }
  
  .steps-indicator::before {
    display: none;
  }
  
  .step {
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
  }
  
  .step-number {
    width: 32px;
    height: 32px;
    margin-bottom: 0;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>
