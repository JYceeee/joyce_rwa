<template>
  <section class="profile-page">
    <!-- 顶部：面包屑 & 操作按钮 -->
    <header class="topbar container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <button class="crumb-back" @click="$emit('navigate','home')" aria-label="Back to Home">
          <svg viewBox="0 0 24 24" class="i"><path d="M10 19a1 1 0 0 1-.7-.3l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 1 1 1.4 1.4L4.41 11H21a1 1 0 1 1 0 2H4.41l6.3 6.3A1 1 0 0 1 10 19z"/></svg>
        </button>
        <span class="sep">/</span>
        <span class="crumb-current">Profile</span>
      </nav>
    </header>
      
    <!-- 标题块 -->
    <div class="container head">
      <div class="avatar">
        <span class="avatar-initial">{{ userInitial }}</span>
        </div>
      <div>
        <h1 class="title">{{ userName }}</h1>
      </div>
      <p class="title">{{ userid }}</p>
     
    </div>
    <form class="container form" @submit.prevent="onSave">

    <!-- 用户联系信息 -->
    <div class="user-contact-info">
      <!--email and phone-->
      <div>
        <label class="label">Personal Information <span class="req"></span></label>
        <div class="contact-item">
          <!-- <span class="contact-icon">📧</span> -->
          <span class="contact-label">Email:</span>
          <span class="contact-value">
            {{ userEmail || 'Not provided' }}
          </span>
          <span class="email-status" :class="emailVerificationClass"> &nbsp; {{ emailVerificationText }}</span>
          <button v-if="!emailVerified" class="btn-small" type="button" @click="sendEmailVerification">
            Verify Email
          </button>
        </div>
        <div class="contact-item">
          <!-- <span class="contact-icon">📱</span> -->
          <span class="contact-label">Phone:</span>
          <span class="contact-value">
            {{ userPhone || 'Not provided' }}
          </span>
          <button class="btn-small" type="button" >Change my phone number</button>
        </div>
        <div class="contact-item">
          <span class="contact-label">Password:</span>
          <button class="btn-small" type="button" >Change my password</button>
        </div>
        <div v-if="userLoading" class="contact-item loading-item">
          <span class="contact-icon">🔄</span>
          <span class="contact-label">Status:</span>
          <span class="contact-value">Loading user information...</span>
        </div>
        <div v-if="userError && !userLoading" class="contact-item error-item">
          <span class="contact-icon">⚠️</span>
          <span class="contact-label">Status:</span>
          <span class="contact-value">{{ userError }}</span>
        </div>
      </div>

        <!-- 邮箱验证弹窗 -->
      <div v-if="showEmailModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <h2 style="margin-bottom:8px;">Check Your Email</h2>
            <p>Verify your email address to use your account.<br>
            We sent an email with a button to verify your email address.<br>
            Did you receive the email? If not, check your spam folder or request a new verification email for up to 3 days.<br>
            If you do not verify your email address within 3 days, you will need to create a new account.<br>
            If you are having trouble, see Account Help.</p>
            <div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:10px;">
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Account Help</a>
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Subscriptions</a>
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Unsubscribe</a>
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Privacy / Do Not Sell My Info</a>
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Cookie Preferences</a>
            </div>
            <div style="margin-top:18px; text-align:right;">
              <button class="btn orange" @click="showEmailModal=false">OK</button>
            </div>
          </div>
        </div>
      </div> 
    </div>
    
    <!-- KYC & Whitelist Status Section -->
    <div class="status-section">
      <h3 class="status-title">Account Status</h3>
      <!-- KYC -->
      <div class="field">
        <label class="label">KYC verification <span class="req">*</span></label>
        <div class="kyc-banner" :class="isVerified ? 'green' : 'orange'" role="status">
          <span class="icon">
            <svg viewBox="0 0 24 24" class="i">
              <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 4v13l10 5 10-5V4L12 9Zm0 9.5-7-3.5V9l7 3.5V20.5Z"/>
            </svg>
          </span>
          <span v-if="!isVerified">Verify now</span>
          <span v-else class="verified">
            <svg viewBox="0 0 24 24" class="i"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
            <!-- Verified -->{{ kycLevelText }}
            <!-- <span class="level-badge" :class="kycLevelClass"> {{ kycLevelText }}</span> -->
          </span>
          <!-- 右侧按钮：未验证=Start；已验证=Cancel -->
          <button v-if="!isVerified" class="link" type="button" @click="verifyKYC">Start</button>
          <button v-else class="link danger" type="button" @click="cancelKYC">Cancel verification</button>
        </div>
      </div>

      <!-- Whitelist Application Component -->
      <WhitelistApplication 
        v-if="isVerified"
        :is-kyc-verified="isVerified"
        :user-info="userInfo"
        @success="handleWhitelistSuccess"
        @error="handleWhitelistError"
        @info="handleWhitelistInfo"
      />

      <!-- Trading Permission -->
      <div class="field">
        <label class="label">Trading Permission <span class="req"></span></label>
        <div class="kyc-banner" :class="isVerified ? 'green' : 'orange'" role="status">
          <span class="icon">
            <svg viewBox="0 0 24 24" class="i">
              <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
            </svg>
          </span>
          <span class="permission-text">                
            <li v-for="requirement in tradingPermissionRequirements" :key="requirement" 
                      :class="{ 'requirement-met': isRequirementMet(requirement) }">
                    <span class="requirement-icon">{{ isRequirementMet(requirement) ? '' : '' }}</span>
                    {{ requirement }}
                  </li></span>
          <span class="permission-badge" :class="tradingPermissionClass">{{ tradingPermissionText }}</span>
          <!-- 右侧按钮：未验证=Start；已验证=Cancel -->
          <button v-if="!isVerified" class="link" type="button" @click="verifyKYC">Start</button>
          <button v-else class="link danger" type="button" @click="cancelKYC">Cancel verification</button>
        </div>
      </div>
    </div>
  
    <!-- 底部按钮 -->
    <div class="actions bottom">
      <button class="btn light" type="button" @click="onCancel">Cancel</button>
      <button class="btn orange" type="submit">Save</button>
      <!-- 新增：安全退出 -->
      <button class="btn light" type="button" @click="logout" style="margin-left:auto;">Log out</button>
    </div>
    </form>

  </section>
</template>

<script>
import {
  getKycStatus,
  setKycStatus,
  setKycLevel,
  getKycLevel,
  KYC_STATUS,
  KYC_LEVELS
} from '/src/service/kycService'
import WhitelistApplication from '@/views/FunctionalModule/whitelist/WhitelistApplication.vue'
import {
  getUserInfo,
  getUserName,
  getUserInitial,
  getUserEmail,
  setUserInfo,
  USER_INFO_EVENT
} from '@/service/userService'
import { userAPI } from '@/service/api'
import { unifiedContractService as contractService } from '@/service/unifiedContractService'

export default {
  name: 'ProfileView',
  components: {
    WhitelistApplication
  },
  emits: ['navigate','notify'],
  data(){
    return {
      kycStatus: getKycStatus(),
      form: {
        twoFA: 'off',
        email: '',
        walletAction: ''
      },
      emailCode: '',
      emailCodeSent: false,
      emailVerified: false,
      generatedCode: '',
  _offVis: null,
  _offStorage: null,
  _offAfterEach: null,
  showEmailModal: false,
  // 用户信息，传递给白名单组件
  userInfo: getUserInfo(),
  // 状态信息
  whitelistStatus: 'none',
  kycLevel: getKycLevel(),
  // API获取的用户数据
  apiUserData: null,
  userLoading: false,
  userError: null
    }
  },
  computed:{
    isVerified(){ return this.kycStatus === KYC_STATUS.VERIFIED },
    isPending(){ return this.kycStatus === KYC_STATUS.PENDING },
    // 用户信息计算属性
    userid(){
      // 多重fallback策略
      if (this.apiUserData?.user_id) {
        return this.apiUserData.user_id
      }
      
      if (this.apiUserData?.id) {
        return this.apiUserData.id
      }
      
      // 从localStorage获取用户ID
      const localUserInfo = getUserInfo()
      if (localUserInfo.user_id) {
        return localUserInfo.user_id
      }
      
      if (localUserInfo.id) {
        return localUserInfo.id
      }
      
      return 'User ID'
    },
    userName(){   
      // 多重fallback策略
      if (this.apiUserData?.name) {
        return this.apiUserData.name
      }
      
      const localName = getUserName()
      if (localName) {
        return localName
      }
      
      // 从邮箱生成用户名
      const email = this.userEmail
      if (email && email.includes('@')) {
        return email.split('@')[0]
      }
      
      return 'User'
    },
    
    userInitial(){ 
      // 多重fallback策略
      if (this.apiUserData?.name) {
        return this.apiUserData.name.charAt(0).toUpperCase()
      }
      
      const localInitial = getUserInitial()
      if (localInitial) {
        return localInitial
      }
      
      // 从邮箱生成首字母
      const email = this.userEmail
      if (email && email.includes('@')) {
        return email.charAt(0).toUpperCase()
      }
      
      return 'U'
    },
    
    userEmail(){ 
      // 多重fallback策略
      if (this.apiUserData?.email) {
        return this.apiUserData.email
      }
      
      const localEmail = getUserEmail()
      if (localEmail) {
        return localEmail
      }
      
      // 从localStorage获取记住的邮箱
      const rememberEmail = localStorage.getItem('remember_email')
      if (rememberEmail) {
        return rememberEmail
      }
      
      return ''
    },
    
    userPhone() {
      // 多重fallback策略
      if (this.apiUserData?.phone) {
        return this.apiUserData.phone
      }
      
      // 从本地存储获取手机号
      const userInfo = getUserInfo()
      if (userInfo.phone) {
        return userInfo.phone
      }
      
      return ''
    },
    
    // Email验证状态
    emailVerificationText() {
      if (this.emailVerified) {
        return 'Verified'
      } else if (this.emailCodeSent) {
        return 'Verification Sent'
      } else {
        return 'Not Verified'
      }
    },
    
    emailVerificationIcon() {
      if (this.emailVerified) {
        return '✅'
      } else if (this.emailCodeSent) {
        return '📧'
      } else {
        return '❌'
      }
    },
    
    emailVerificationClass() {
      if (this.emailVerified) {
        return 'email-verified'
      } else if (this.emailCodeSent) {
        return 'email-pending'
      } else {
        return 'email-unverified'
      }
    },
    
    // KYC等级显示
    kycLevelText() {
      switch(this.kycLevel) {
        case KYC_LEVELS.LEVEL_0: return 'Level 0 (Unverified)'
        case KYC_LEVELS.LEVEL_1: return 'Level 1 (Basic)'
        case KYC_LEVELS.LEVEL_2: return 'Level 2 (Advanced)'
        case KYC_LEVELS.LEVEL_3: return 'Level 3 (Premium)'
        default: return 'Unknown'
      }
    },
    
    kycLevelClass() {
      switch(this.kycLevel) {
        case KYC_LEVELS.LEVEL_0: return 'level-0'
        case KYC_LEVELS.LEVEL_1: return 'level-1'
        case KYC_LEVELS.LEVEL_2: return 'level-2'
        case KYC_LEVELS.LEVEL_3: return 'level-3'
        default: return 'level-unknown'
      }
    },
    
    // 白名单状态显示
    whitelistStatusText() {
      switch(this.whitelistStatus) {
        case 'approved': return 'Approved'
        case 'pending': return 'Pending Review'
        case 'rejected': return 'Not Qualified for Transaction'
        case 'none': return 'Not Applied'
        default: return 'Unknown'
      }
    },
    
    whitelistStatusClass() {
      switch(this.whitelistStatus) {
        case 'approved': return 'status-approved'
        case 'pending': return 'status-pending'
        case 'rejected': return 'status-rejected'
        case 'none': return 'status-none'
        default: return 'status-unknown'
      }
    },
    
    // 交易权限显示
    tradingPermissionText() {
      if (this.kycLevel >= KYC_LEVELS.LEVEL_2 && this.whitelistStatus === 'approved') {
        return 'Full Access'
      } else if (this.kycLevel >= KYC_LEVELS.LEVEL_2) {
        return 'Limited Access'
      } else {
        return 'No Access'
      }
    },
    
    tradingPermissionClass() {
      if (this.kycLevel >= KYC_LEVELS.LEVEL_2 && this.whitelistStatus === 'approved') {
        return 'permission-full'
      } else if (this.kycLevel >= KYC_LEVELS.LEVEL_2) {
        return 'permission-limited'
      } else {
        return 'permission-none'
      }
    },
    
    // 交易权限详细描述
    tradingPermissionDescription() {
      if (this.kycLevel >= KYC_LEVELS.LEVEL_2 && this.whitelistStatus === 'approved') {
        return 'Complete trading access to all RWA products and features'
      } else if (this.kycLevel >= KYC_LEVELS.LEVEL_2) {
        return 'Limited trading access - whitelist approval required for full access'
      } else {
        return 'Trading access requires KYC verification and whitelist approval'
      }
    },
    
    // 交易权限要求列表
    tradingPermissionRequirements() {
      const requirements = []
      
      // KYC要求
      if (this.kycLevel < KYC_LEVELS.LEVEL_2) {
        requirements.push('Complete KYC verification (Level 2+)')
      }
      
      // 白名单要求
      if (this.whitelistStatus !== 'approved') {
        if (this.whitelistStatus === 'none') {
          requirements.push('Apply for whitelist approval')
        } else if (this.whitelistStatus === 'pending') {
          requirements.push('Wait for whitelist approval')
        } else if (this.whitelistStatus === 'rejected') {
          requirements.push('Reapply for whitelist approval')
        }
      }
      
      // 其他要求（如果有的话）
      if (this.kycLevel >= KYC_LEVELS.LEVEL_2 && this.whitelistStatus === 'approved') {
        requirements.push('All requirements met')
      }
      
      return requirements
    }
  },
  watch: {
    // 监听KYC状态变化
    kycStatus: {
      handler(newStatus, oldStatus) {
        console.log('🔄 KYC状态变化:', oldStatus, '->', newStatus)
        if (newStatus === KYC_STATUS.VERIFIED && oldStatus !== KYC_STATUS.VERIFIED) {
          console.log('✅ KYC验证成功，自动更新Account Status')
          // KYC验证成功时，自动设置等级为2并更新白名单状态
          this.kycLevel = getKycLevel()
          if (this.kycLevel < KYC_LEVELS.LEVEL_2) {
            setKycLevel(KYC_LEVELS.LEVEL_2)
            this.kycLevel = KYC_LEVELS.LEVEL_2
            console.log('🔧 自动设置KYC等级为Level 2')
          }
          // 更新白名单状态
          this.loadStatusInfo()
        }
      },
      immediate: false
    },
    
    // 监听KYC等级变化
    kycLevel: {
      handler(newLevel, oldLevel) {
        console.log('🔄 KYC等级变化:', oldLevel, '->', newLevel)
        if (newLevel >= KYC_LEVELS.LEVEL_2 && this.isVerified) {
          console.log('✅ KYC等级达到Level 2，自动更新白名单状态')
          // 更新白名单状态
          this.loadStatusInfo()
        }
      },
      immediate: false
    }
  },
  async mounted(){
    // 刷新函数：从 localStorage 读取最新状态
    const refresh = () => { 
      this.kycStatus = getKycStatus()
      this.kycLevel = getKycLevel()
      // KYC状态变化时，立即更新Account Status
      this.loadStatusInfo()
    }
    const refreshUserInfo = () => { this.userInfo = getUserInfo() }
    const refreshStatus = () => { this.loadStatusInfo() }

    // 1) 初次进入
    refresh()
    refreshUserInfo()
    refreshStatus()
    
    // 2) 立即初始化用户信息显示
    this.initializeUserDisplay()
    
    // 3) 从API获取用户信息
    await this.loadUserFromAPI()
    
    // 3) 监听登录状态变化
    const onAuthChange = () => {
      console.log('🔄 ProfileView: 检测到登录状态变化，重新加载用户信息')
      this.loadUserFromAPI()
    }
    window.addEventListener('auth-changed', onAuthChange)
    this._offAuthChange = () => window.removeEventListener('auth-changed', onAuthChange)
    
    // 4) 标签激活（从 /kycService 返回就会触发）
    const onVis = () => document.visibilityState === 'visible' && (refresh(), refreshUserInfo(), refreshStatus())
    document.addEventListener('visibilitychange', onVis)
    this._offVis = () => document.removeEventListener('visibilitychange', onVis)

    // 3) 跨标签同步（若多标签页同时登录）
    const onStore = (e) => { 
      if (e.key === 'kycStatus') refresh()
      if (e.key === 'kycLevel') refresh()
      if (e.key === 'userInfo') refreshUserInfo()
      if (e.key === 'whitelistStatus') refreshStatus()
    }
    window.addEventListener('storage', onStore)
    this._offStorage = () => window.removeEventListener('storage', onStore)

    // 4) 路由返回时（从 KYC 页面 push 回来）
    this._offAfterEach = this.$router.afterEach((to) => {
      if (to.path === '/profile') {
        refresh()
        refreshUserInfo()
        refreshStatus()
      }
    })

    // 5) 监听用户信息更新事件
    const onUserInfoChange = () => {
      refreshUserInfo()
      this.$forceUpdate() // 强制更新组件
    }
    window.addEventListener(USER_INFO_EVENT, onUserInfoChange)
    this._offUserInfo = () => window.removeEventListener(USER_INFO_EVENT, onUserInfoChange)

    // 6) 监听KYC验证成功事件
    const onKycSuccess = () => {
      console.log('🎉 收到KYC验证成功事件，更新Account Status')
      refresh()
    }
    window.addEventListener('kyc-verification-success', onKycSuccess)
    this._offKycSuccess = () => window.removeEventListener('kyc-verification-success', onKycSuccess)
  },
  activated(){
    // keep-alive 场景下也会被调用
    this.kycStatus = getKycStatus()
  },
  beforeUnmount(){
    this._offVis && this._offVis()
    this._offStorage && this._offStorage()
    this._offAfterEach && this._offAfterEach()
    this._offUserInfo && this._offUserInfo()
    this._offKycSuccess && this._offKycSuccess()
    this._offAuthChange && this._offAuthChange()
  },
  methods:{
    // 初始化用户信息显示
    initializeUserDisplay() {
      console.log('🚀 ProfileView: 初始化用户信息显示')
      
      // 立即尝试显示本地存储的用户信息
      const localUserInfo = getUserInfo()
      const rememberEmail = localStorage.getItem('remember_email')
      
      if (localUserInfo.name || localUserInfo.email || rememberEmail) {
        this.apiUserData = {
          name: localUserInfo.name || (rememberEmail ? rememberEmail.split('@')[0] : ''),
          email: localUserInfo.email || rememberEmail || '',
          phone: localUserInfo.phone || '',
          firstName: localUserInfo.firstName || '',
          lastName: localUserInfo.lastName || '',
          user_id: localUserInfo.user_id || localUserInfo.id || '',
          id: localUserInfo.user_id || localUserInfo.id || ''
        }
        console.log('✅ ProfileView: 立即显示本地用户信息:', this.apiUserData)
      }
    },
    
    // 从API获取用户信息
    async loadUserFromAPI() {
      try {
        this.userLoading = true
        this.userError = null
        console.log('🔄 ProfileView: 开始获取用户信息...')
        
        // 检查用户是否已登录
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const token = localStorage.getItem('token')
        const rememberEmail = localStorage.getItem('remember_email')
        
        console.log('📊 ProfileView: 登录状态检查:', { isLoggedIn, hasToken: !!token, rememberEmail })
        
        // 如果用户未登录，尝试使用本地存储的信息
        if (!isLoggedIn || !token) {
          console.log('⚠️ ProfileView: 用户未登录，使用本地存储信息')
          
          // 从本地存储获取用户信息
          const localUserInfo = getUserInfo()
          if (localUserInfo.name || localUserInfo.email) {
            this.apiUserData = {
              name: localUserInfo.name,
              email: localUserInfo.email,
              phone: localUserInfo.phone,
              firstName: localUserInfo.firstName,
              lastName: localUserInfo.lastName,
              user_id: localUserInfo.user_id || localUserInfo.id || '',
              id: localUserInfo.user_id || localUserInfo.id || ''
            }
            console.log('✅ ProfileView: 使用本地存储用户信息:', this.apiUserData)
            return
          }
          
          // 如果有记住的邮箱，使用它
          if (rememberEmail) {
            this.apiUserData = {
              email: rememberEmail,
              name: rememberEmail.split('@')[0] // 使用邮箱前缀作为默认用户名
            }
            console.log('✅ ProfileView: 使用记住的邮箱信息:', this.apiUserData)
            return
          }
          
          this.userError = '用户未登录，请先登录'
          return
        }
        
        console.log('🔑 ProfileView: 使用userAPI获取用户信息')
        
        // 使用userAPI获取用户信息
        const response = await userAPI.getUserInfoFromServer()
        
        let userData = null
        let lastError = null
        
        if (response.status === 0 && response.data) {
          userData = response.data
          console.log('✅ ProfileView: 成功获取用户数据:', userData)
          console.log('🔍 ProfileView: user_id字段:', userData.user_id)
          console.log('🔍 ProfileView: id字段:', userData.id)
        } else {
          lastError = response.message || '获取用户信息失败'
          console.warn('⚠️ ProfileView: 获取用户信息失败:', lastError)
        }
        
        if (userData) {
          
          // 处理并更新用户信息
          const processedUserData = {
            // 处理邮箱字段
            email: userData.user_email || userData.email || userData.userEmail,
            // 处理姓名字段
            name: userData.user_name || userData.name || userData.userName,
            // 处理电话字段
            phone: userData.user_phone || userData.phone || userData.userPhone,
            // 处理其他字段
            firstName: userData.firstName || userData.first_name,
            lastName: userData.lastName || userData.last_name,
            user_id: userData.user_id || userData.id || userData.userId,
            id: userData.user_id || userData.id || userData.userId
          }
          
          // 保存API获取的用户数据（包含处理后的数据）
          this.apiUserData = {
            ...userData,
            ...processedUserData
          }
          
          // 过滤掉空值
          const validUserData = Object.fromEntries(
            Object.entries(processedUserData).filter(([_, value]) => value)
          )
          
          if (Object.keys(validUserData).length > 0) {
            const updatedUserInfo = {
              ...getUserInfo(),
              ...validUserData
            }
            
            // 更新本地用户信息
            setUserInfo(updatedUserInfo)
            this.userInfo = updatedUserInfo
            
            console.log('✅ ProfileView: 本地用户信息已更新:', updatedUserInfo)
          }
        } else {
          console.warn('⚠️ ProfileView: 所有API端点都失败，使用本地存储信息')
          
          // 如果所有API都失败，使用本地存储信息
          const localUserInfo = getUserInfo()
          if (localUserInfo.name || localUserInfo.email) {
            this.apiUserData = {
              name: localUserInfo.name,
              email: localUserInfo.email,
              phone: localUserInfo.phone,
              user_id: localUserInfo.user_id || localUserInfo.id || '',
              id: localUserInfo.user_id || localUserInfo.id || ''
            }
            console.log('✅ ProfileView: 使用本地存储作为fallback:', this.apiUserData)
          } else {
            this.userError = lastError || '无法获取用户信息'
          }
        }
        
      } catch (error) {
        console.error('❌ ProfileView: 获取用户信息失败:', error)
        
        // 检查是否是网络错误
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          this.userError = '网络连接失败，使用本地存储信息'
          
          // 网络失败时使用本地存储
          const localUserInfo = getUserInfo()
          if (localUserInfo.name || localUserInfo.email) {
            this.apiUserData = {
              name: localUserInfo.name,
              email: localUserInfo.email,
              phone: localUserInfo.phone,
              user_id: localUserInfo.user_id || localUserInfo.id || '',
              id: localUserInfo.user_id || localUserInfo.id || ''
            }
            console.log('✅ ProfileView: 网络失败，使用本地存储:', this.apiUserData)
          }
        } else {
          this.userError = `获取用户信息失败: ${error.message}`
        }
      } finally {
        this.userLoading = false
        console.log('🏁 ProfileView: 用户信息加载完成')
      }
    },
    
    // 检查要求是否满足
    isRequirementMet(requirement) {
      if (requirement.includes('KYC verification')) {
        return this.kycLevel >= KYC_LEVELS.LEVEL_2
      } else if (requirement.includes('whitelist approval')) {
        return this.whitelistStatus === 'approved'
      } else if (requirement.includes('All requirements met')) {
        return this.kycLevel >= KYC_LEVELS.LEVEL_2 && this.whitelistStatus === 'approved'
      }
      return false
    },
    
    // 加载状态信息
    async loadStatusInfo() {
      try {
        console.log('🔄 开始加载状态信息...')
        // 更新KYC等级
        this.kycLevel = getKycLevel()
        console.log('📊 当前KYC等级:', this.kycLevel)
        console.log('📊 当前KYC状态:', this.kycStatus)
        
        // 加载白名单状态（无论KYC状态如何都显示）
        if (this.isVerified) {
          console.log('✅ 用户已通过KYC验证')
          // 简化：KYC Level 2用户直接设置为approved
          if (this.kycLevel >= KYC_LEVELS.LEVEL_2) {
            this.whitelistStatus = 'approved'
            localStorage.setItem('whitelistStatus', 'approved')
            console.log('✅ KYC Level 2用户，白名单状态自动设置为approved')
            console.log('📊 更新后的状态 - KYC Level:', this.kycLevel, 'Whitelist:', this.whitelistStatus)
            return
          }
          
          // 从本地存储获取白名单状态
          const savedStatus = localStorage.getItem('whitelistStatus')
          if (savedStatus) {
            this.whitelistStatus = savedStatus
            console.log('📊 从本地存储加载白名单状态:', savedStatus)
          }
        } else {
          // 如果KYC未验证，设置默认状态
          this.whitelistStatus = 'none'
          console.log('❌ 用户未通过KYC验证，设置默认状态')
        }
        console.log('📊 最终状态 - KYC Level:', this.kycLevel, 'Whitelist:', this.whitelistStatus)
      } catch (error) {
        console.error('Failed to load status info:', error)
      }
    },

    // 校验邮箱格式
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // 发送邮箱验证
    async sendEmailVerification() {
      const email = this.userEmail;
      if (!email || !this.isValidEmail(email)) {
        this.$emit('notify', 'Please provide a valid email address');
        return;
      }

      try {
        console.log('📧 发送邮箱验证到:', email);
        
        // 调用后端API发送验证邮件
        const res = await fetch(import.meta.env.VITE_API_EmailVerify || 'http://localhost:3000/api/email/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: email })
        });

        if (res.ok) {
          this.emailCodeSent = true;
          this.$emit('notify', 'Verification email sent successfully');
          console.log('✅ 邮箱验证邮件发送成功');
        } else {
          this.$emit('notify', 'Failed to send verification email');
          console.error('❌ 邮箱验证邮件发送失败:', res.status);
        }
      } catch (error) {
        console.error('❌ 发送邮箱验证失败:', error);
        this.$emit('notify', 'Network error, please try again');
      }
    },

    // 发送验证码
    async sendEmailCode() {
      if (!this.isValidEmail(this.form.email)) {
        this.$emit('notify','Please enter a valid email.');
        return;
      }
      try {
        // 调用后端API发送验证码邮件
        const res = await fetch(import.meta.env.VITE_API_EmailVerify, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: this.form.email })
        });
        const data = await res.json();
        if (data.status === 0) {
          this.emailCodeSent = true;
          this.generatedCode = data.code; // 开发环境返回验证码，便于测试
          this.showEmailModal = true;
          this.$emit('notify', data.message || '验证码已发送到您的邮箱');
        } else {
          this.$emit('notify', data.message || 'Failed to send email.');
        }
      } catch (e) {
        this.$emit('notify','Network error, please try again.');
      }
    },

    // 验证验证码
    async verifyEmailCode() {
      try {
        // 调用后端API校验验证码
        const res = await fetch(import.meta.env.VITE_API_EmailVerify, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_email: this.form.email, 
            verification_code: this.form.emailCode 
          })
        });
        const data = await res.json();
        if (data.status === 0) {
          this.emailVerified = true;
          this.emailCodeSent = false; // 隐藏验证码输入框
          this.form.emailCode = ''; // 清空验证码
          this.$emit('notify', data.message || 'Email verified and bound to account.');
        } else {
          this.$emit('notify', data.message || 'Incorrect verification code.');
        }
      } catch (e) {
        this.$emit('notify','Network error, please try again.');
      }
    },
    verifyKYC(){ this.$router.push('/kycService') },

    // 撤销 KYC：立即变回黄色并显示 Start
    cancelKYC(){
      if (!confirm('Are you sure you want to cancel KYC verification?')) return
      setKycStatus(KYC_STATUS.UNVERIFIED)     // 写入存储
      this.kycStatus = KYC_STATUS.UNVERIFIED  // 立刻刷新 UI
      
      // 清除KYC级别
      setKycLevel(KYC_LEVELS.LEVEL_0)
      
      this.$emit('notify','KYC verification has been cancelled.')
    },

    onCancel(){ this.$emit('navigate','home') },

    onSave(){
      if (!this.isVerified) return this.$emit('notify','Please complete KYC first.')
      if (this.form.email && !this.isValidEmail(this.form.email))
        return this.$emit('notify','Please enter a valid email.')
      if (this.form.email && !this.emailVerified)
        return this.$emit('notify','Please verify your email before saving.')
      this.$emit('notify','Profile saved (demo)')
    },

    logout() {
    // 1) 清理本地状态
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('remember_email');
    
    // 2) 触发全局登录状态更新事件
    window.dispatchEvent(new CustomEvent('auth-changed'));

    // 3) 友好提示
    this.$emit('notify','You have logged out.');

    // 4) 跳转到登录页
    this.$router.push('/login');
  },

  // 白名单组件事件处理
  handleWhitelistSuccess(message) {
    console.log('✅ Whitelist application successful:', message)
    this.$emit('notify', message);
    
    // 更新白名单状态
    this.whitelistStatus = 'pending'
    localStorage.setItem('whitelistStatus', 'pending')
    
    // 刷新状态信息
    this.loadStatusInfo();
    
    // 更新Trading Permission显示
    console.log('🔄 Trading Permission updated after whitelist application')
  },

  handleWhitelistError(message) {
    console.log('❌ Whitelist application error:', message)
    this.$emit('notify', message);
  },

  handleWhitelistInfo(message) {
    console.log('ℹ️ Whitelist application info:', message)
    this.$emit('notify', message);
    
    // 刷新状态信息
    this.loadStatusInfo();
    
    // 更新Trading Permission显示
    console.log('🔄 Trading Permission updated after whitelist info update')
  }
}
}
</script>

<style scoped>
/* 加载指示器样式 */
.loading-indicator {
  display: inline-block;
  margin-left: 8px;
  animation: spin 1s linear infinite;
  font-size: 0.8em;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误文本样式 */
.error-text {
  color: #dc3545;
  font-size: 0.9em;
  margin-top: 4px;
  font-weight: 500;
}

/* 用户操作区域样式 */
.user-actions {
  margin-top: 8px;
}

.btn-refresh {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover:not(:disabled) {
  background: #0056b3;
}

.btn-refresh:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-retry {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.btn-retry:hover:not(:disabled) {
  background: #c82333;
}

.btn-retry:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* 用户联系信息样式 - 与标题风格一致 */
.user-contact-info {
  max-width: 1000px;
  margin: 20px 0;
  margin-left: 50px;
  padding: 24px;
  background: rgba(45, 55, 72, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(74, 85, 104, 0.4);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.user-contact-info .label {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  display: block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(74, 85, 104, 0.4);
  transition: background-color 0.2s ease;
}

.contact-item:hover {
  background-color: rgba(74, 85, 104, 0.1);
  border-radius: 8px;
  margin: 0 -8px;
  padding-left: 8px;
  padding-right: 8px;
}

.contact-item:first-child {
  padding-top: 0;
}

.contact-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.contact-icon {
  font-size: 16px;
  margin-right: 8px;
  width: 20px;
  text-align: center;
}

.contact-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #f4f7f9;
  min-width: 80px;
  flex-shrink: 0;
  font-size: 14px;
  letter-spacing: 0.3px;
}

.contact-value {
  color: #ffffff;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  background: rgba(31, 41, 55, 0.6);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(74, 85, 104, 0.3);
  flex: 1;
  max-width: 200px;
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  font-size: 13px;
  transition: all 0.2s ease;
}

.contact-value:hover {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(74, 85, 104, 0.5);
}

/* Email验证状态样式 */
.email-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.email-status-icon {
  font-size: 14px;
}

.email-verified {
  color: #10b981;
}

.email-pending {
  color: #f59e0b;
}

.email-unverified {
  color: #ef4444;
}

.btn-small {
  background: #374151;
  color: #ffffff;
  border: 1px solid #4b5563;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.btn-small:hover {
  background: #4b5563;
}

/* 确保按钮贴着右侧 */
.contact-item .btn-small {
  margin-left: auto;
  flex-shrink: 0;
}

/* 加载状态样式 */
.loading-item .contact-value {
  background: #92400e;
  border-color: #b45309;
  color: #fbbf24;
  animation: pulse 1.5s ease-in-out infinite;
}

/* 错误状态样式 */
.error-item .contact-value {
  background: #7f1d1d;
  border-color: #991b1b;
  color: #fca5a5;
}

/* 脉冲动画 */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 加载图标动画 */
.loading-item .contact-icon {
  animation: spin 1s linear infinite;
}
/* 状态显示区域样式 */
.status-section {
  max-width: 1000px;
  margin: 20px 0;
  margin-left: 50px;
  padding: 20px;
  background: rgba(45, 55, 72, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(74, 85, 104, 0.3);
  backdrop-filter: blur(10px);
}

.status-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #f4f7f9;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(74, 85, 104, 0.3);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #e2e8f0;
}

.status-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.kyc-icon {
  color: #007bff;
}

.whitelist-icon {
  color: #28a745;
}

.trading-icon {
  color: #ffc107;
}

.status-value {
  display: flex;
  align-items: center;
}

/* KYC等级徽章样式 */
.level-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.level-0 {
  background: #f8d7da;
  color: #721c24;
}

.level-1 {
  background: #fff3cd;
  color: #856404;
}

.level-2 {
  background: #d4edda;
  color: #155724;
}

.level-3 {
  background: #cce5ff;
  color: #004085;
}

.level-unknown {
  background: #e2e3e5;
  color: #6c757d;
}

/* 白名单状态徽章样式 */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.status-none {
  background: #e2e3e5;
  color: #6c757d;
}

.status-unknown {
  background: #f8d7da;
  color: #721c24;
}

/* 交易权限徽章样式 */
.permission-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.permission-full {
  background: #d4edda;
  color: #155724;
}

.permission-limited {
  background: #fff3cd;
  color: #856404;
}

.permission-none {
  background: #f8d7da;
  color: #721c24;
}

/* 交易权限详细信息样式 */
.permission-details {
  margin-top: 8px;
  padding: 12px;
  background: rgba(31, 41, 55, 0.9);
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.permission-description {
  display: block;
  font-size: 13px;
  color: #cbd5e1;
  margin-bottom: 8px;
  line-height: 1.4;
}

.permission-requirements {
  margin-top: 8px;
}

.requirements-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 6px;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  display: flex;
  align-items: center;
  padding: 4px 0;
  font-size: 12px;
  color: #cbd5e1;
  transition: all 0.2s ease;
}

.requirements-list li:hover {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  padding-left: 8px;
}

.requirement-icon {
  margin-right: 8px;
  font-size: 14px;
  width: 16px;
  text-align: center;
}

.requirement-met {
  color: #10b981;
}

.requirement-met .requirement-icon {
  color: #10b981;
}

.requirements-list li:not(.requirement-met) {
  color: #ef4444;
}

.requirements-list li:not(.requirement-met) .requirement-icon {
  color: #ef4444;
}

/* 简易弹窗样式 */
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-wrapper {
  width: 100%;
  max-width: 420px;
}
.modal-container {
  background: #1f2937;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  padding: 28px 24px 18px;
  font-size: 15px;
  color: #ffffff;
  border: 1px solid rgba(74, 85, 104, 0.3);
}
.container { max-width: 920px; margin: 0 auto; }
/* 页面容器深色主题 - 与图片风格一致 */
.profile-page { 
  padding-bottom: 64px; 
  background: linear-gradient(180deg, #0f1419 0%, #1a1f2e 50%, #2d3748 100%);
  min-height: 100vh;
  color: #ffffff;
}

.container {
  background: transparent;
}

/* 顶部 */
.topbar { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:24px 16px;font-size: 20px; }.breadcrumb { display:flex; align-items:center; gap:10px; color:#9ca3af; }
.crumb-back { border:0; background:transparent; cursor:pointer; color:#9ca3af; }
.sep{ opacity:.6; }
.crumb-current{ color:#ffffff; font-weight:600; }

/* 标题块 */
.head { display:flex; align-items:center; gap:16px; padding:0 16px 8px; }
.avatar{ width:44px; height:44px; border-radius:999px; background:#374151; display:grid; place-items:center;}
.avatar-initial{ font-weight:700; color:#ffffff; }
.title{ font-size:24px; line-height:1.2; margin:0; color:#ffffff; }
.subtitle{ margin:2px 0 0; color:#9ca3af; }

/* 表单与控件 */
.form{ margin-top:24px; padding:0 16px; }
.field{ margin:18px 0; }
.label{ display:block; font-size:12px; color:#9ca3af; margin-bottom:8px; }
.req{ color:#f97316; }
.input{ width:100%; height:40px; border:1px solid #374151; border-radius:8px; padding:0 12px; background:#1f2937; color:#ffffff; }
.input:focus{ border-color:#4b5563; box-shadow:0 0 0 3px rgba(59, 130, 246, 0.1); }
.input::placeholder{ color:#9ca3af; }
.input.with-icon{ display:flex; align-items:center; gap:8px; padding:0 8px; }
.input.with-icon select{ border:0; outline:none; width:100%; height:38px; background:transparent; color:#ffffff; }
.input.with-icon .icon{ width:28px; height:28px; border-radius:10px; background:#374151; display:grid; place-items:center;
  box-shadow:0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px #4b5563; }
.i{ width:18px; height:18px; fill:currentColor; color:#ffffff; }

/* KYC 横幅 */
.kyc-banner{ display:flex; align-items:center; gap:10px; height:40px; border-radius:8px; padding:0 12px; border:1px solid; }
.kyc-banner.orange{ background:#1f2937; color:#f97316; border-color:#374151; }
.kyc-banner.green{ background:#1f2937; color:#16a34a; border-color:#374151; }
.kyc-banner .icon{
  width:28px; height:28px; border-radius:10px; background:#374151; display:grid; place-items:center;
  box-shadow:0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px #4b5563; opacity:.9;
}


.link{ margin-left:auto; color:inherit; background:transparent; border:0; cursor:pointer; text-decoration:underline; }
.link.danger{ color:#dc2626; }
.verified{ margin-left:4px; display:inline-flex; align-items:center; gap:6px; font-weight:600; }


/* 底部按钮 */
.actions { display:flex; gap:12px; }
.actions.bottom { margin-top: 16px; }
.btn{ border:1px solid transparent; border-radius:10px; padding:8px 14px; cursor:pointer; font-weight:600; line-height:1; }
.btn.orange{ background:#ea7a2e; color:#fff; }
.btn.orange:hover{ filter:brightness(.96); }
.btn.light{ background:#374151; color:#ffffff; border-color:#4b5563; }
.btn.light:hover{ background:#4b5563; }
</style>
