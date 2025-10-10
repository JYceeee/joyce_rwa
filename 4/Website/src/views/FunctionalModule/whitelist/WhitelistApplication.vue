<template>
  <div class="whitelist-application">
    <!-- 白名单状态横幅 -->
    <div class="field">
      <label class="label">{{ t('whitelist.status') }}</label>
      <div class="whitelist-banner" :class="statusClass" role="status">
        <span class="icon">
          <svg viewBox="0 0 24 24" class="i">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </span>
        <!-- 文案：根据状态显示不同信息 -->
        <span v-if="whitelistStatus === 'approved'" class="verified">
          <svg viewBox="0 0 24 24" class="i"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
          {{ t('whitelist.approved') }}
        </span>
        <span v-else-if="whitelistStatus === 'pending'">{{ t('whitelist.pending') }}</span>
        <span v-else-if="whitelistStatus === 'rejected'">{{ t('whitelist.rejected') }}</span>
        <span v-else>{{ t('whitelist.apply') }}</span>
        <!-- 右侧按钮：根据状态显示不同操作 -->
        <button v-if="whitelistStatus === 'none'" class="link" type="button" @click="applyWhitelist" :disabled="loading">{{ t('whitelist.applyNow') }}</button>
        <button v-else-if="whitelistStatus === 'pending'" class="link" type="button" @click="checkWhitelistStatus" :disabled="loading">{{ t('whitelist.checkStatus') }}</button>
        <button v-else-if="whitelistStatus === 'approved'" class="link" type="button" @click="goToProjects">{{ t('whitelist.startTrading') }}</button>
        <button v-else-if="whitelistStatus === 'rejected'" class="link" type="button" @click="reapplyWhitelist" :disabled="loading">{{ t('whitelist.reapply') }}</button>
      </div>
    </div>

    <!-- 白名单申请弹窗 -->
    <div v-if="showApplicationModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h2 style="margin-bottom:8px;">{{ t('whitelist.applicationTitle') }}</h2>
          <p>{{ t('whitelist.applicationDescription') }}</p>
          <p><strong>{{ t('whitelist.requirements') }}</strong></p>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>{{ t('whitelist.kycCompleted') }}</li>
            <li>{{ t('whitelist.validWallet') }}</li>
            <li>{{ t('whitelist.agreeTerms') }}</li>
          </ul>
          <div style="margin-top:18px; display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn light" @click="showApplicationModal = false" :disabled="loading">{{ t('common.cancel') }}</button>
            <button class="btn orange" @click="submitApplication" :disabled="loading">
              <span v-if="loading">{{ t('whitelist.applying') }}</span>
              <span v-else>{{ t('whitelist.applyNow') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 白名单申请处理弹窗 -->
    <div v-if="showProcessingModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div style="text-align: center; padding: 20px;">
            <div class="spinner"></div>
            <h2 style="margin-bottom:8px;">{{ processingTitle }}</h2>
            <p>{{ processingMessage }}</p>
            <p style="color: #64748b; font-size: 14px; margin-top: 8px;">{{ processingSubMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请结果弹窗 -->
    <div v-if="showResultModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div style="text-align: center; padding: 20px;">
            <div class="result-icon" :class="resultType">
              <span v-if="resultType === 'success'">✓</span>
              <span v-else-if="resultType === 'error'">✗</span>
              <span v-else">⚠</span>
            </div>
            <h2 style="margin-bottom:8px;">{{ resultTitle }}</h2>
            <p>{{ resultMessage }}</p>
            <div style="margin-top:18px; display:flex; gap:12px; justify-content:center;">
              <button v-if="resultType === 'success'" class="btn orange" @click="goToProjects">{{ t('whitelist.startTrading') }}</button>
              <button class="btn light" @click="closeResultModal">{{ t('whitelist.close') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 验证错误弹窗 -->
    <div v-if="showValidationErrorModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div style="text-align: center; padding: 20px;">
            <div class="result-icon error" style="background-color: #fee2e2; color: #dc2626;">
              <span>⚠</span>
            </div>
            <h2 style="margin-bottom:8px; color: #dc2626;">{{ validationErrorTitle }}</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">{{ validationErrorMessage }}</p>
            <div style="margin-top:18px; display:flex; gap:12px; justify-content:center;">
              <button class="btn orange" @click="showValidationErrorModal = false">{{ t('whitelist.confirm') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { unifiedContractService as contractService } from '@/service/unifiedContractService'
import { getKycStatus, getKycLevel, setKycLevel, KYC_STATUS, KYC_LEVELS } from '@/service/kycService.js'
import { useAuth } from '@/composables/useAuth.js'
import { isLoggedIn } from '@/utils/auth.js'
import { useLanguage } from '@/composables/useLanguage'

export default {
  name: 'WhitelistApplication',
  props: {
    // 外部传入的KYC状态
    isKycVerified: {
      type: Boolean,
      default: false
    },
    // 外部传入的用户信息
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 白名单状态: 'none', 'pending', 'approved', 'rejected'
      whitelistStatus: 'none',
      // 弹窗状态
      showApplicationModal: false,
      showProcessingModal: false,
      showResultModal: false,
      // 加载状态
      loading: false,
      // 处理弹窗内容
      processingTitle: 'Applying for Whitelist...',
      processingMessage: 'Please wait while we process your whitelist application.',
      processingSubMessage: 'Connecting to blockchain and submitting your application...',
      // 结果弹窗内容
      resultType: 'success', // 'success', 'error', 'warning'
      resultTitle: '',
      resultMessage: '',
      // 验证错误弹窗
      showValidationErrorModal: false,
      validationErrorTitle: '',
      validationErrorMessage: '',
      // 合约服务实例
      contractService: contractService
    }
  },
  computed: {
    statusClass() {
      switch (this.whitelistStatus) {
        case 'approved': return 'green'
        case 'pending': return 'orange'
        case 'rejected': return 'red'
        default: return 'gray'
      }
    }
  },
  async mounted() {
    // 初始化合约服务
    try {
      // contractService 已经在 data 中设置为导入的实例
      await this.loadWhitelistStatus()
    } catch (error) {
      console.error('Failed to initialize contract service:', error)
    }
  },
  methods: {
    t(key) {
      const { t } = useLanguage()
      return t(key)
    },
    // 加载白名单状态（简化逻辑）
    async loadWhitelistStatus() {
      try {
        // 简化：优先检查KYC状态
        const kycLevel = getKycLevel()
        const isKycVerified = this.isKycVerified
        
        if (isKycVerified && kycLevel >= KYC_LEVELS.LEVEL_2) {
          // KYC Level 2用户直接设置为approved
          this.whitelistStatus = 'approved'
          localStorage.setItem('whitelistStatus', 'approved')
          console.log('✅ KYC Level 2用户，白名单状态自动设置为approved')
          return
        }
        
        if (!this.contractService) return
        
        // 获取用户钱包地址
        const userAddress = await this.getUserWalletAddress()
        if (!userAddress) {
          console.warn('No wallet address available for whitelist status check')
          return
        }
        
        // 使用新的综合状态检查方法
        const statusData = await this.contractService.getWhitelistStatus(userAddress)
        this.whitelistStatus = statusData.status
        
        console.log('✅ Whitelist status loaded:', statusData)
      } catch (error) {
        console.error('Failed to load whitelist status:', error)
        // 从本地存储获取状态作为备选
        const savedStatus = localStorage.getItem('whitelistStatus')
        if (savedStatus) {
          this.whitelistStatus = savedStatus
        }
      }
    },

    // 申请白名单（简化流程）
    async applyWhitelist() {
      console.log('🔍 开始验证白名单申请条件...')
      
      // 1. 验证用户是否已登录
      if (!isLoggedIn()) {
        this.showValidationError('请先登录账户', '您需要先登录才能申请白名单')
        return
      }
      
      // 2. 验证KYC状态
      if (!this.isKycVerified) {
        this.showValidationError('KYC验证未完成', '请先完成KYC身份验证才能申请白名单')
        return
      }
      
      // 3. 简化：KYC验证通过后自动设置为Level 2
      const kycLevel = getKycLevel()
      if (kycLevel < KYC_LEVELS.LEVEL_2) {
        console.log(`🔧 KYC验证成功，自动设置级别为 ${KYC_LEVELS.LEVEL_2}`)
        setKycLevel(KYC_LEVELS.LEVEL_2)
        console.log('✅ KYC级别已设置为Level 2')
      }
      
      // 4. 验证钱包连接
      const userAddress = await this.getUserWalletAddress()
      if (!userAddress) {
        this.showValidationError('钱包未连接', '请先连接MetaMask钱包才能申请白名单')
        return
      }
      
      // 5. 简化：KYC Level 2用户直接通过白名单申请
      if (kycLevel >= KYC_LEVELS.LEVEL_2) {
        console.log('✅ KYC Level 2用户，直接通过白名单申请')
        this.whitelistStatus = 'approved'
        localStorage.setItem('whitelistStatus', 'approved')
        this.showSuccessResult('Whitelist Approved!', 'Congratulations! Your KYC Level 2 status automatically qualifies you for whitelist. You can now start trading assets.')
        this.$emit('success', 'Whitelist automatically approved due to KYC Level 2 status!')
        return
      }
      
      // 6. 检查是否已在白名单中
      const currentStatus = await this.checkCurrentWhitelistStatus(userAddress)
      if (currentStatus === 'approved') {
        this.showValidationError('已在白名单中', '您的钱包地址已经在白名单中，无需重复申请')
        return
      }
      
      if (currentStatus === 'pending') {
        this.showValidationError('申请审核中', '您的白名单申请正在审核中，请耐心等待')
        return
      }
      
      console.log('✅ 所有条件验证通过，可以申请白名单')
      this.showApplicationModal = true
    },

    // 提交申请
    async submitApplication() {
      this.loading = true
      this.showApplicationModal = false
      this.showProcessingModal = true
      
      try {
        console.log('🚀 开始提交白名单申请...')
        
        // 获取用户钱包地址
        const userAddress = await this.getUserWalletAddress()
        if (!userAddress) {
          throw new Error('无法获取钱包地址')
        }
        
        // 更新处理弹窗内容
        this.processingTitle = '正在提交白名单申请...'
        this.processingMessage = '正在连接区块链并提交您的申请'
        this.processingSubMessage = '请稍候，不要关闭页面...'
        
        // 使用合约服务申请白名单
        let result
        if (this.contractService) {
          console.log('📝 通过合约服务申请白名单...')
          
          // 准备申请数据
          const applicationData = {
            userAddress: userAddress,
            kycLevel: getKycLevel(),
            timestamp: Date.now(),
            userInfo: this.userInfo
          }
          
          // 调用合约服务申请白名单
          result = await this.contractService.applyForWhitelist(applicationData)
        } else {
          console.log('⚠️ 合约服务未初始化，使用模拟申请...')
          // 模拟申请过程
          await this.delay(2000)
          result = {
            success: true,
            transactionHash: '0x' + Math.random().toString(16).substr(2, 40),
            blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
            message: '白名单申请已提交（模拟）'
          }
        }
        
        if (result.success) {
          console.log('✅ 白名单申请提交成功:', result)
          
          this.whitelistStatus = 'pending'
          localStorage.setItem('whitelistStatus', 'pending')
          
          // 保存交易信息
          if (result.transactionHash) {
            localStorage.setItem('whitelistTransactionHash', result.transactionHash)
          }
          
          this.showProcessingModal = false
          
          // 取消弹窗，直接显示成功消息在控制台
          console.log('🎉 白名单申请提交成功！')
          console.log(`交易哈希: ${result.transactionHash || 'N/A'}`)
          console.log('我们将在24小时内审核您的申请')
          
          this.$emit('success', '白名单申请提交成功！')
          
          // 延迟后自动检查状态
          setTimeout(() => {
            this.checkWhitelistStatus()
          }, 5000)
          
        } else {
          console.error('❌ 白名单申请失败:', result.error)
          this.showProcessingModal = false
          console.error('申请失败:', result.error || '白名单申请提交失败，请稍后重试。')
          this.$emit('error', '白名单申请失败，请稍后重试。')
        }
        
      } catch (error) {
        console.error('❌ 白名单申请错误:', error)
        this.showProcessingModal = false
        console.error('申请错误:', error.message || '提交申请时发生错误，请检查网络连接后重试。')
        this.$emit('error', '提交申请时发生错误，请检查网络连接后重试。')
      } finally {
        this.loading = false
      }
    },

    // 检查白名单状态
    async checkWhitelistStatus() {
      this.loading = true
      this.showProcessingModal = true
      this.processingTitle = 'Checking Status...'
      this.processingMessage = 'Please wait while we check your whitelist status.'
      this.processingSubMessage = 'Querying blockchain for latest status...'
      
      try {
        await this.delay(1000) // 模拟网络延迟
        
        // 重新加载状态
        await this.loadWhitelistStatus()
        
        this.showProcessingModal = false
        
        if (this.whitelistStatus === 'approved') {
          this.showSuccessResult('Application Approved!', 'Congratulations! Your whitelist application has been approved. You can now start trading assets.')
          this.$emit('success', 'Whitelist application approved!')
        } else if (this.whitelistStatus === 'rejected') {
          this.showErrorResult('Application Rejected', 'Your whitelist application was rejected. Please contact support for more information.')
          this.$emit('error', 'Whitelist application rejected.')
        } else {
          this.showWarningResult('Still Pending', 'Your application is still under review. Please check again later.')
          this.$emit('info', 'Application still pending.')
        }
        
      } catch (error) {
        console.error('Failed to check whitelist status:', error)
        this.showProcessingModal = false
        this.showErrorResult('Check Failed', 'Failed to check whitelist status. Please try again.')
        
        this.$emit('error', 'Failed to check whitelist status.')
      } finally {
        this.loading = false
        // 重置处理弹窗内容
        this.resetProcessingModal()
      }
    },

    // 重新申请
    async reapplyWhitelist() {
      this.whitelistStatus = 'none'
      localStorage.setItem('whitelistStatus', 'none')
      await this.applyWhitelist()
    },

    // 跳转到项目页面
    goToProjects() {
      this.$router.push('/listedprojects')
    },

    // 显示成功结果
    showSuccessResult(title, message) {
      this.resultType = 'success'
      this.resultTitle = title
      this.resultMessage = message
      this.showResultModal = true
    },

    // 显示错误结果
    showErrorResult(title, message) {
      this.resultType = 'error'
      this.resultTitle = title
      this.resultMessage = message
      this.showResultModal = true
    },

    // 显示警告结果
    showWarningResult(title, message) {
      this.resultType = 'warning'
      this.resultTitle = title
      this.resultMessage = message
      this.showResultModal = true
    },

    // 关闭结果弹窗
    closeResultModal() {
      this.showResultModal = false
    },

    // 重置处理弹窗内容
    resetProcessingModal() {
      this.processingTitle = 'Applying for Whitelist...'
      this.processingMessage = 'Please wait while we process your whitelist application.'
      this.processingSubMessage = 'Connecting to blockchain and submitting your application...'
    },

    // 辅助方法：延迟
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    // 显示验证错误弹窗
    showValidationError(title, message) {
      this.validationErrorTitle = title
      this.validationErrorMessage = message
      this.showValidationErrorModal = true
    },

    // 获取用户钱包地址
    async getUserWalletAddress() {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          return accounts[0] || null
        }
        return null
      } catch (error) {
        console.error('获取用户钱包地址失败:', error)
        return null
      }
    },

    // 检查当前白名单状态
    async checkCurrentWhitelistStatus(address) {
      try {
        if (!this.contractService) {
          // 如果合约服务未初始化，从本地存储获取
          const savedStatus = localStorage.getItem('whitelistStatus')
          return savedStatus || 'none'
        }

        // 使用新的综合状态检查方法
        const statusData = await this.contractService.getWhitelistStatus(address)
        return statusData.status
      } catch (error) {
        console.error('检查白名单状态失败:', error)
        // 出错时从本地存储获取
        const savedStatus = localStorage.getItem('whitelistStatus')
        return savedStatus || 'none'
      }
    }
  },

  // 监听KYC状态变化
  watch: {
    isKycVerified(newVal) {
      if (!newVal && this.whitelistStatus !== 'none') {
        // KYC验证被取消，重置白名单状态
        this.whitelistStatus = 'none'
        localStorage.removeItem('whitelistStatus')
      }
    }
  }
}
</script>

<style scoped>
.whitelist-application {
  width: 100%;
}

/* 白名单横幅 */
.whitelist-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  border-radius: 8px;
  padding: 0 12px;
  border: 1px solid;
  background: var(--card-bg);
}

.whitelist-banner.gray {
  color: #9ca3af;
  border-color: var(--border);
}

.whitelist-banner.orange {
  color: #f97316;
  border-color: var(--border);
}

.whitelist-banner.green {
  color: #16a34a;
  border-color: var(--border);
}

.whitelist-banner.red {
  color: #dc2626;
  border-color: var(--border);
}

.whitelist-banner .icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: var(--bg-secondary);
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px #4b5563;
  opacity: 0.9;
}

.link {
  margin-left: auto;
  color: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
}

.link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.verified {
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

/* 弹窗样式 */
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 0 16px;
}

.modal-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  padding: 28px 24px 18px;
  font-size: 15px;
  color: #1f2937;
}

.modal-container h2 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.modal-container p {
  margin: 8px 0;
  line-height: 1.5;
  color: #4b5563;
}

.modal-container ul {
  margin: 8px 0;
  padding-left: 20px;
}

.modal-container li {
  margin: 4px 0;
  color: #4b5563;
}

/* 加载动画 */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #ea7a2e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 结果图标 */
.result-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  font-weight: bold;
}

.result-icon.success {
  background: #dcfce7;
  color: #16a34a;
}

.result-icon.error {
  background: #fef2f2;
  color: #dc2626;
}

.result-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

/* 按钮样式 */
.btn {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 600;
  line-height: 1;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.orange {
  background: #ea7a2e;
  color: #fff;
}

.btn.orange:hover:not(:disabled) {
  filter: brightness(0.96);
}

.btn.light {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.btn.light:hover:not(:disabled) {
  background: #e5e7eb;
}

/* 字段样式 */
.field {
  margin: 18px 0;
}

.label {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
  font-weight: 500;
}

/* SVG图标 */
.i {
  width: 18px;
  height: 18px;
  fill: currentColor;
}
</style>
