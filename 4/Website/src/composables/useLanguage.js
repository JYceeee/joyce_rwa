import { ref, computed } from 'vue'

// 语言状态管理
const currentLanguage = ref('zh')

// 语言配置
const languages = {
  zh: {
    name: '中文',
    code: 'zh',
    dir: 'ltr'
  },
  en: {
    name: 'English',
    code: 'en',
    dir: 'ltr'
  }
}

// 语言包
const translations = {
  zh: {
    // 通用
    'common.home': '首页',
    'common.products': '产品',
    'common.about': '关于我们',
    'common.contact': '联系我们',
    'common.settings': '设置',
    'common.profile': '个人中心',
    'common.login': '登录',
    'common.signup': '注册',
    'common.logout': '退出登录',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.loading': '加载中...',
    'common.loadingVideo': '加载视频...',
    'common.loadingProducts': '加载产品数据...',
    'common.videoLoadError': '视频加载失败',
    'common.loadFailed': '加载失败',
    'common.retry': '重试',
    'common.refresh': '刷新',
    'common.close': '关闭',
    'common.sending': '发送中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.browserNotSupported': '你的浏览器不支持视频播放',
    'common.skipVideo': '跳过视频',
    
    // 导航
    'nav.home': '首页',
    'nav.listedProjects': '已上链RWA',
    'nav.toBeListed': '待上链RWA',
    'nav.trading': '交易',
    'nav.about': '关于我们',
    'nav.contact': '联系我们',
    'nav.settings': '设置',
    'nav.profile': '个人中心',
    
    // 钱包相关
    'wallet.connect': '连接钱包',
    'wallet.connect.description': '选择一个MetaMask账户来连接到您的个人资料:',
    'wallet.connect.new': '连接新钱包',
    'wallet.connected': '已连接',
    'wallet.disconnect': '断开钱包',
    'wallet.disconnect.confirm': '您确定要断开这个钱包吗？',
    'wallet.management': '钱包管理',
    'wallet.address': '钱包地址',
    'wallet.balance': '余额',
    'wallet.transaction': '交易',
    'wallet.noAccounts': '没有找到MetaMask中的其他账户。',
    'wallet.addAccounts': '请在MetaMask中添加更多账户并重试。',
    
    // 设置页面
    'settings.title': '设置',
    'settings.general': '常规设置',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.theme.dark': '深色',
    'settings.theme.light': '浅色',
    'settings.language.zh': '中文',
    'settings.language.en': 'English',
    'settings.language.description': '选择您偏好的语言',
    'settings.timezone': '时区',
    'settings.timezone.description': '设置您的本地时区',
    'settings.notifications': '通知',
    'settings.privacy': '隐私',
    'settings.security': '安全',
    
    // 项目相关
    'project.title': '项目',
    'project.name': '项目名称',
    'project.code': '项目代码',
    'project.status': '状态',
    'project.yield': '收益率',
    'project.term': '期限',
    'project.amount': '金额',
    'project.progress': '进度',
    'project.details': '详情',
    'project.invest': '投资',
    'project.trade': '交易',
    
    // 个人中心
    'profile.title': '个人中心',
    'profile.info': '个人信息',
    'profile.email': '邮箱',
    'profile.phone': '手机号',
    'profile.wallet': '钱包',
    'profile.kyc': 'KYC认证',
    'profile.whitelist': '白名单',
    'profile.trading': '交易权限',
    
    // 关于我们
    'about.title': '关于我们',
    'about.headline': '我们是专注于把房地产资产包装成投资人喜欢的RWA底层资产的RWA Dealmaker',
    'about.description': '我们致力于为投资者提供透明、安全、高效的房地产代币化投资平台。',
    
    // 联系我们
    'contact.title': '联系我们',
    'contact.description': '如果您是资产所有人或有意投资，欢迎联系我们。',
    'contact.name': '姓名',
    'contact.email': '邮箱',
    'contact.message': '消息',
    'contact.send': '发送消息',
    
    // 页脚
    'footer.disclaimer': '免责声明：本平台提供的信息仅供参考，不保证其真实性、准确性或完整性，亦不构成投资邀约或投资建议。',
    'footer.copyright': '© 2025 RWA Dealmaker. All rights reserved.',
    
    // 交易页面
    'trade.contractAddress': '合约地址',
    'trade.contractAddressDescription': '以下合约地址将用于此次交易:',
    'trade.principalTokenAddress': '本金代币地址'
  },
  en: {
    // Common
    'common.home': 'Home',
    'common.products': 'Products',
    'common.about': 'About Us',
    'common.contact': 'Contact Us',
    'common.settings': 'Settings',
    'common.profile': 'Profile',
    'common.login': 'Login',
    'common.signup': 'Sign Up',
    'common.logout': 'Logout',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.loadingVideo': 'Loading video...',
    'common.loadingProducts': 'Loading product data...',
    'common.videoLoadError': 'Video loading failed',
    'common.loadFailed': 'Load failed',
    'common.retry': 'Retry',
    'common.refresh': 'Refresh',
    'common.close': 'Close',
    'common.sending': 'Sending...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.browserNotSupported': 'Your browser does not support video playback',
    'common.skipVideo': 'Skip Video',
    
    // Navigation
    'nav.home': 'Home',
    'nav.listedProjects': 'Listed RWA',
    'nav.toBeListed': 'To Be Listed RWA',
    'nav.trading': 'Trading',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    
    // Wallet
    'wallet.connect': 'Connect Wallet',
    'wallet.connect.description': 'Select a MetaMask account to connect to your profile:',
    'wallet.connect.new': 'Connect New Wallet',
    'wallet.connected': 'Connected',
    'wallet.disconnect': 'Disconnect',
    'wallet.disconnect.confirm': 'Are you sure you want to disconnect this wallet?',
    'wallet.management': 'Wallet Management',
    'wallet.address': 'Wallet Address',
    'wallet.balance': 'Balance',
    'wallet.transaction': 'Transaction',
    
    // Settings
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.theme.dark': 'Dark',
    'settings.theme.light': 'Light',
    'settings.language.zh': '中文',
    'settings.language.en': 'English',
    'settings.language.description': 'Choose your preferred language',
    'settings.timezone': 'Timezone',
    'settings.timezone.description': 'Set your local timezone',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.security': 'Security',
    
    // Projects
    'project.title': 'Projects',
    'project.name': 'Project Name',
    'project.code': 'Project Code',
    'project.status': 'Status',
    'project.yield': 'Yield',
    'project.term': 'Term',
    'project.amount': 'Amount',
    'project.progress': 'Progress',
    'project.details': 'Details',
    'project.invest': 'Invest',
    'project.trade': 'Trade',
    
    // Profile
    'profile.title': 'Profile',
    'profile.info': 'Personal Information',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.wallet': 'Wallet',
    'profile.kyc': 'KYC Verification',
    'profile.whitelist': 'Whitelist',
    'profile.trading': 'Trading Permission',
    
    // About Us
    'about.title': 'About Us',
    'about.headline': 'We are RWA Dealmakers focused on packaging real estate assets into RWA underlying assets that investors love',
    'about.description': 'We are committed to providing investors with a transparent, secure, and efficient real estate tokenization investment platform.',
    
    // Contact Us
    'contact.title': 'Contact Us',
    'contact.description': 'If you are an asset owner or interested in investing, please contact us.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    
    // Footer
    'footer.disclaimer': 'Disclaimer: The information provided on this platform is for reference only and does not guarantee its authenticity, accuracy or completeness, nor does it constitute an investment invitation or investment advice.',
    'footer.copyright': '© 2025 RWA Dealmaker. All rights reserved.',
    
    // Trading Page
    'trade.contractAddress': 'Contract Address',
    'trade.contractAddressDescription': 'The following contract addresses will be used for this transaction:',
    'trade.principalTokenAddress': 'Principal Token Address'
  }
}

// 应用语言到文档
const applyLanguage = (languageCode) => {
  const language = languages[languageCode]
  if (!language) return

  const root = document.documentElement
  root.setAttribute('lang', languageCode)
  root.setAttribute('dir', language.dir)
  localStorage.setItem('rwa-language', languageCode)
  currentLanguage.value = languageCode
}

// 从 localStorage 加载保存的语言
const loadSavedLanguage = () => {
  const saved = localStorage.getItem('rwa-language')
  if (saved && languages[saved]) {
    currentLanguage.value = saved
  } else {
    // 如果没有保存的语言，使用浏览器语言偏好
    const browserLang = navigator.language.split('-')[0]
    currentLanguage.value = languages[browserLang] ? browserLang : 'zh'
  }
  applyLanguage(currentLanguage.value)
}

// 切换语言
const setLanguage = (languageCode) => {
  if (!languages[languageCode]) {
    console.warn(`Language "${languageCode}" not found`)
    return
  }
  
  currentLanguage.value = languageCode
  applyLanguage(languageCode)
}

// 获取翻译文本
const t = (key) => {
  const currentTranslations = translations[currentLanguage.value]
  if (!currentTranslations) {
    console.warn(`Translations not found for language: ${currentLanguage.value}`)
    return key
  }
  
  return currentTranslations[key] || key
}

// 获取当前语言信息
const getCurrentLanguage = computed(() => {
  return {
    name: languages[currentLanguage.value].name,
    code: currentLanguage.value
  }
})

// 获取所有可用语言
const getAvailableLanguages = () => {
  return Object.entries(languages).map(([value, config]) => ({
    value,
    name: config.name
  }))
}

// 初始化语言
const initLanguage = () => {
  loadSavedLanguage()
}

export function useLanguage() {
  return {
    currentLanguage,
    setLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    initLanguage,
    applyLanguage,
    t
  }
}
