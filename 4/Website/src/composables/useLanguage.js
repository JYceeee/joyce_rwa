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
    'wallet.disconnect.select': '选择要断开的钱包账户：',
    'wallet.disconnected': '钱包已断开',
    'wallet.management': '钱包管理',
    'wallet.networkSwitchNote': '当您在钱包中切换网络时，本页网络会自动切换',
    'wallet.address': '钱包地址',
    'wallet.balance': '余额',
    'wallet.transaction': '交易',
    'wallet.noAccounts': '没有找到MetaMask中的其他账户。',
    'wallet.addAccounts': '请在MetaMask中添加更多账户并重试。',
    'wallet.account': '账户',
    'wallet.copy': '复制',
    'wallet.copied': '已复制',
    'wallet.connectWalletManagement': '请在钱包管理中连接您的钱包',
    'wallet.currentNetwork': '当前网络',
    'wallet.portfolio': '投资组合',
    'wallet.insertContractAddress': '在此插入您的合约地址：',
    'wallet.pasteERC20Address': '粘贴ERC20合约地址',
    'wallet.labelOptional': '标签（可选）',
    'wallet.addToken': '添加代币',
    'wallet.refresh': '刷新',
    'wallet.tokens': '代币',
    'wallet.clickForDetails': '点击可查看详情',
    'wallet.connectSelectedAccount': '连接选定的账户',
    'wallet.loadingAccounts': '加载账户...',
    'wallet.account': '账户',
    'wallet.disconnectSuccess': '钱包已断开',
    'wallet.disconnectSuccessMsg': '钱包已成功断开连接',
    'wallet.addressAdded': '钱包地址 {address} 已添加',
    'wallet.addressExists': '该钱包地址已存在',
    'wallet.invalidAddress': '请输入有效的以太坊地址',
    'wallet.noWalletToSet': '没有可设置的钱包地址',
    'wallet.primaryWalletSet': '主钱包已设置为: {wallet}',
    'wallet.invalidSelection': '无效的选择',
    'wallet.walletDisconnected': '钱包 {address} 已断开连接',
    
    // 设置页面
    'settings.title': '设置',
    'settings.subtitle': '管理您的应用程序设置',
    'settings.general': '常规',
    'settings.general.description': '基本应用程序设置和偏好',
    'settings.theme': '主题',
    'settings.theme.description': '选择您偏好的主题',
    'settings.language': '语言',
    'settings.language.description': '选择您偏好的语言',
    'settings.theme.dark': '深色',
    'settings.theme.light': '浅色',
    'settings.language.zh': '中文',
    'settings.language.en': '英语',
    'settings.timezone': '时区',
    'settings.timezone.description': '设置您的本地时区',
    'settings.timezone.utc': 'UTC',
    'settings.timezone.est': '东部时间',
    'settings.timezone.pst': '太平洋时间',
    'settings.timezone.cst': '中国标准时间',
    'settings.notifications': '通知',
    'settings.notifications.description': '通知偏好和提醒设置',
    'settings.privacy': '隐私',
    'settings.privacy.description': '隐私控制和数据设置',
    'settings.security': '安全',
    'settings.security.description': '密码、身份验证和安全设置',
    'settings.wallet': '钱包',
    'settings.wallet.description': '钱包连接和交易设置',
    'settings.performance': '性能',
    'settings.performance.description': '性能优化和缓存设置',
    'settings.account': '账户',
    'settings.account.description': '账户选项和个人资料设置',
    'settings.trading': '交易',
    'settings.trading.description': '交易偏好和选项设置',
    'settings.advanced': '高级',
    'settings.advanced.description': '高级设置和开发者选项',
    
    // 开场视频
    'settings.introVideo': '开场视频',
    'settings.introVideo.description': '重新观看网站开场视频',
    'settings.introVideo.watch': '观看开场视频',
    
    // 安全设置
    'settings.password': '密码',
    'settings.password.description': '更改您的账户密码',
    'settings.password.change': '更改密码',
    'settings.sessionTimeout': '会话超时',
    'settings.sessionTimeout.description': '设置自动登出时间',
    'settings.sessionTimeout.15min': '15分钟',
    'settings.sessionTimeout.30min': '30分钟',
    'settings.sessionTimeout.1hour': '1小时',
    'settings.sessionTimeout.8hours': '8小时',
    'settings.loginAlerts': '登录提醒',
    'settings.loginAlerts.description': '接收新登录尝试的通知',
    
    // 钱包设置
    'settings.defaultWallet': '默认钱包',
    'settings.defaultWallet.description': '选择您偏好的钱包提供商',
    'settings.defaultWallet.metamask': 'MetaMask',
    'settings.defaultWallet.walletconnect': '钱包连接器',
    'settings.autoConnect': '自动连接',
    'settings.autoConnect.description': '在页面加载时自动连接钱包',
    'settings.gasSettings': 'Gas设置',
    'settings.gasSettings.description': '配置交易Gas偏好',
    'settings.gasSettings.configure': 'Gas设置',
    
    // 通知设置
    'settings.pushNotifications': '推送通知',
    'settings.pushNotifications.description': '启用浏览器推送通知',
    'settings.emailNotifications': '邮箱通知',
    'settings.emailNotifications.description': '通过邮箱接收重要更新',
    'settings.smsNotifications': 'SMS通知',
    'settings.smsNotifications.description': '通过短信接收重要更新',
    
    // 性能设置
    'settings.autoRefresh': '自动刷新',
    'settings.autoRefresh.description': '自动刷新数据',
    'settings.autoRefresh.disabled': '禁用',
    'settings.autoRefresh.30sec': '30秒',
    'settings.autoRefresh.1min': '1分钟',
    'settings.autoRefresh.5min': '5分钟',
    'settings.cacheSize': '缓存大小',
    'settings.cacheSize.description': '最大缓存存储大小',
    'settings.clearCache': '清除缓存',
    'settings.clearCache.description': '清除所有缓存数据',
    'settings.clearCache.button': '清除缓存',
    
    // 账户设置
    'settings.profileVisibility': '主页可见性',
    'settings.profileVisibility.description': '控制谁可以看到您的个人信息',
    'settings.profileVisibility.public': '公开',
    'settings.profileVisibility.friends': '仅好友可见',
    'settings.profileVisibility.private': '私密',
    'settings.twoFactorAuth': '两步验证',
    'settings.twoFactorAuth.description': '为您的账户添加额外一层安全性',
    'settings.twoFactorAuth.enable': '启用两步验证',
    
    // 交易设置
    'settings.defaultTradingPair': '默认交易对',
    'settings.defaultTradingPair.description': '设置您偏好的交易对以快速访问',
    'settings.defaultTradingPair.ethUsdt': 'ETH/USDT(以太坊/美元)',
    'settings.defaultTradingPair.btcUsdt': 'BTC/USDT(比特币/美元)',
    'settings.defaultTradingPair.usdcUsdt': 'USDC/USDT(美元稳定币/美元)',
    'settings.autoConfirmTrades': '自动确认交易',
    'settings.autoConfirmTrades.description': '在指定金额下自动确认交易',
    'settings.priceAlerts': '价格提醒',
    'settings.priceAlerts.description': '当价格达到您设定的目标时通知您',
    'settings.priceAlerts.manage': '管理提醒',
    
    // 隐私设置
    'settings.dataCollection': '数据收集',
    'settings.dataCollection.description': '允许我们收集匿名使用数据',
    'settings.marketingEmails': '营销邮箱',
    'settings.marketingEmails.description': '接收促销邮件和更新',
    'settings.thirdPartySharing': '第三方分享',
    'settings.thirdPartySharing.description': '允许与信任的合作伙伴共享数据',
    
    // 高级设置
    'settings.apiAccess': 'API访问',
    'settings.apiAccess.description': '管理您的API密钥和权限',
    'settings.apiAccess.configure': 'API设置',
    'settings.exportData': '导出数据',
    'settings.exportData.description': '下载您的账户数据',
    'settings.exportData.button': '导出',
    'settings.analytics': '分析',
    'settings.analytics.description': '帮助改进应用程序通过共享使用数据',
    'settings.resetPreferences': '重置偏好',
    'settings.resetPreferences.description': '重置所有选项为默认值',
    'settings.resetPreferences.button': '重置所有',
    
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
    'project.loanAmount': '贷款金额',
    'project.interestRate': '利率',
    'project.perYear': '/年',
    'project.loanTerm': '贷款期限',
    'project.months': '月',
    'project.currentSubscription': '当前认购',
    'project.totalOffering': '总发行量',
    'project.subscribed': '已认购',
    'project.partyInfo': '相关方信息',
    'project.issuer': '发行主体',
    'project.underlyingAsset': '底层资产',
    'project.sponsor': '保荐人',
    'project.valuer': '评估机构',
    'project.lawyer': '律师',
    'project.trustee': '监管方',
    'project.viewOnEtherscan': '在Etherscan上查看',
    
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
    'about.intro1': '我们是专注于把房地产资产包装成投资人喜欢的RWA底层资产的RWA Dealmaker。本平台以保障RWA投资者资金安全为核心，精选合法合规、风险低、回报高的优质资产（如澳大利亚抵押率不超过70%、年化利率约9%的第一顺位住宅抵押贷款资产），促成投资者与资产持有人之间的交易。',
    'about.intro2': '平台展示的底层资产均受资产所在国家法律法规保护，资金可自由跨境流动。根据投资者需求，交易结构可实现底层资产与资金的独立隔离，并委托合格第三方机构进行托管。',
    'about.intro3': '除撮合投资者与RWA底层资产持有人的交易外，本平台还整合RWA代币化全链条的生态合作，涵盖专业RWA代币化技术服务公司、持牌RWA代币发行商及交易所等，确保代币化流程合法合规、高效低成本，支持公开或非公开的成功发行。',
    
    // 联系我们
    'contact.title': '联系我们',
    'contact.description': '如果您想将房地产资产或房地产抵押贷款资产作为RWA的底层资产进行融资或有意购买RWA资产，欢迎联系我们。',
    'contact.name': '姓名',
    'contact.name.placeholder': '请输入您的全名',
    'contact.email': '邮箱',
    'contact.email.placeholder': '请输入您的邮箱',
    'contact.type': '类型',
    'contact.type.placeholder': '请选择',
    'contact.type.individual': '个人',
    'contact.type.business': '企业',
    'contact.type.other': '其他',
    'contact.subject': '主题',
    'contact.subject.placeholder': '请选择',
    'contact.subject.investor': '投资咨询',
    'contact.subject.asset_holder': '资产列表',
    'contact.subject.general': '一般问题',
    'contact.subject.technical': '技术支持',
    'contact.subject.business': '业务合作',
    'contact.subject.other': '其他',
    'contact.message': '消息',
    'contact.message.placeholder': '告诉我们您想投资什么项目...',
    'contact.send': '发送消息',
    'follow.us': '关注我们',
    
    // 页脚
    'footer.disclaimer': '免责声明：本平台提供的信息仅供参考，不保证其真实性、准确性或完整性，亦不构成投资邀约或投资建议。',
    'footer.copyright': '© 2025 RWA Dealmaker. All rights reserved.',
    
    // 交易页面
    'trade.contractAddress': '合约地址',
    'trade.contractAddressDescription': '以下合约地址将用于此次交易:',
    'trade.principalTokenAddress': '本金代币地址',
    
    // Profile页面
    'profile.personalCenter': '个人中心',
    'profile.personalInfo': '个人信息',
    'profile.email': '邮箱:',
    'profile.phone': '手机号:',
    'profile.password': '密码:',
    'profile.verifyEmail': '验证邮箱',
    'profile.changePhone': '修改手机号',
    'profile.changePassword': '修改密码',
    'profile.status': '状态:',
    'profile.loadingUserInfo': '加载用户信息...',
    'profile.notProvided': '未提供',
    'profile.accountStatus': '账户状态',
    'profile.kycVerification': 'KYC 验证',
    'profile.startVerification': '立即验证',
    'profile.tradingPermission': '交易权限',
    'profile.start': '开始',
    'profile.cancelVerification': '取消验证',
    'profile.logout': '安全退出',
    'profile.checkEmail': '检查您的邮箱',
    'profile.verifyEmailDescription': '我们发送了一封带有验证按钮的邮件到您的邮箱。<br>您收到了邮件吗？如果没有，请检查您的垃圾邮件文件夹或请求新的验证邮件，有效期为3天。<br>如果您在3天内未验证您的邮箱地址，您将需要创建一个新账户。<br>如果您遇到问题，请参阅账户帮助。',
    'profile.accountHelp': '账户帮助',
    'profile.subscribe': '订阅',
    'profile.unsubscribe': '取消订阅',
    'profile.privacy': '隐私 / 不卖我的信息',
    'profile.cookiePreferences': 'Cookie 偏好',
    'profile.confirm': '确定'
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
    'wallet.disconnect': 'Disconnect Wallet',
    'wallet.disconnect.confirm': 'Are you sure you want to disconnect this wallet?',
    'wallet.disconnect.select': 'Select the wallet account you want to disconnect:',
    'wallet.disconnected': 'Wallet Disconnected',
    'wallet.management': 'Wallet Management',
    'wallet.networkSwitchNote': 'When you switch the network in your wallet, the network on this page will be automatically switched',
    'wallet.address': 'Wallet Address',
    'wallet.balance': 'Balance',
    'wallet.transaction': 'Transaction',
    'wallet.noAccounts': 'No other accounts found in MetaMask.',
    'wallet.addAccounts': 'Please add more accounts in MetaMask and try again.',
    'wallet.account': 'Account',
    'wallet.copy': 'Copy',
    'wallet.copied': 'Copied',
    'wallet.connectWalletManagement': 'Please connect your wallet in wallet management',
    'wallet.currentNetwork': 'Current Network',
    'wallet.portfolio': 'Portfolio',
    'wallet.insertContractAddress': 'Insert your contract address here:',
    'wallet.pasteERC20Address': 'Paste ERC20 contract address',
    'wallet.labelOptional': 'Label (optional)',
    'wallet.addToken': 'Add Token',
    'wallet.refresh': 'Refresh',
    'wallet.tokens': 'Tokens',
    'wallet.clickForDetails': 'Click for details',
    'wallet.connectSelectedAccount': 'Connect Selected Account',
    'wallet.loadingAccounts': 'Loading accounts...',
    'wallet.account': 'Account',
    'wallet.disconnectSuccess': 'Wallet Disconnected',
    'wallet.disconnectSuccessMsg': 'Wallet has been successfully disconnected',
    'wallet.addressAdded': 'Wallet address {address} has been added',
    'wallet.addressExists': 'This wallet address already exists',
    'wallet.invalidAddress': 'Please enter a valid Ethereum address',
    'wallet.noWalletToSet': 'No wallet address available to set',
    'wallet.primaryWalletSet': 'Primary wallet has been set to: {wallet}',
    'wallet.invalidSelection': 'Invalid selection',
    'wallet.walletDisconnected': 'Wallet {address} has been disconnected',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your application settings',
    'settings.general': 'General',
    'settings.general.description': 'Basic application settings and preferences',
    'settings.theme': 'Theme',
    'settings.theme.description': 'Choose your preferred theme',
    'settings.language': 'Language',
    'settings.language.description': 'Choose your preferred language',
    'settings.theme.dark': 'Dark',
    'settings.theme.light': 'Light',
    'settings.language.zh': '中文',
    'settings.language.en': 'English',
    'settings.timezone': 'Timezone',
    'settings.timezone.description': 'Set your local timezone',
    'settings.timezone.utc': 'UTC',
    'settings.timezone.est': 'Eastern Time',
    'settings.timezone.pst': 'Pacific Time',
    'settings.timezone.cst': 'China Standard Time',
    'settings.notifications': 'Notifications',
    'settings.notifications.description': 'Notification preferences and alert settings',
    'settings.privacy': 'Privacy',
    'settings.privacy.description': 'Privacy controls and data settings',
    'settings.security': 'Security',
    'settings.security.description': 'Password, authentication and security settings',
    'settings.wallet': 'Wallet',
    'settings.wallet.description': 'Wallet connection and transaction settings',
    'settings.performance': 'Performance',
    'settings.performance.description': 'Performance optimization and cache settings',
    'settings.account': 'Account',
    'settings.account.description': 'Account options and profile settings',
    'settings.trading': 'Trading',
    'settings.trading.description': 'Trading preferences and option settings',
    'settings.advanced': 'Advanced',
    'settings.advanced.description': 'Advanced settings and developer options',
    
    // Intro Video
    'settings.introVideo': 'Intro Video',
    'settings.introVideo.description': 'Re-watch the website intro video',
    'settings.introVideo.watch': 'Watch Intro Video',
    
    // Security Settings
    'settings.password': 'Password',
    'settings.password.description': 'Change your account password',
    'settings.password.change': 'Change Password',
    'settings.sessionTimeout': 'Session Timeout',
    'settings.sessionTimeout.description': 'Set automatic logout time',
    'settings.sessionTimeout.15min': '15 minutes',
    'settings.sessionTimeout.30min': '30 minutes',
    'settings.sessionTimeout.1hour': '1 hour',
    'settings.sessionTimeout.8hours': '8 hours',
    'settings.loginAlerts': 'Login Alerts',
    'settings.loginAlerts.description': 'Receive notifications for new login attempts',
    
    // Wallet Settings
    'settings.defaultWallet': 'Default Wallet',
    'settings.defaultWallet.description': 'Choose your preferred wallet provider',
    'settings.defaultWallet.metamask': 'MetaMask',
    'settings.defaultWallet.walletconnect': 'WalletConnect',
    'settings.autoConnect': 'Auto Connect',
    'settings.autoConnect.description': 'Automatically connect wallet on page load',
    'settings.gasSettings': 'Gas Settings',
    'settings.gasSettings.description': 'Configure transaction gas preferences',
    'settings.gasSettings.configure': 'Gas Settings',
    
    // Notification Settings
    'settings.pushNotifications': 'Push Notifications',
    'settings.pushNotifications.description': 'Enable browser push notifications',
    'settings.emailNotifications': 'Email Notifications',
    'settings.emailNotifications.description': 'Receive important updates via email',
    'settings.smsNotifications': 'SMS Notifications',
    'settings.smsNotifications.description': 'Receive important updates via SMS',
    
    // Performance Settings
    'settings.autoRefresh': 'Auto Refresh',
    'settings.autoRefresh.description': 'Automatically refresh data',
    'settings.autoRefresh.disabled': 'Disabled',
    'settings.autoRefresh.30sec': '30 seconds',
    'settings.autoRefresh.1min': '1 minute',
    'settings.autoRefresh.5min': '5 minutes',
    'settings.cacheSize': 'Cache Size',
    'settings.cacheSize.description': 'Maximum cache storage size',
    'settings.clearCache': 'Clear Cache',
    'settings.clearCache.description': 'Clear all cached data',
    'settings.clearCache.button': 'Clear Cache',
    
    // Account Settings
    'settings.profileVisibility': 'Profile Visibility',
    'settings.profileVisibility.description': 'Control who can see your personal information',
    'settings.profileVisibility.public': 'Public',
    'settings.profileVisibility.friends': 'Friends Only',
    'settings.profileVisibility.private': 'Private',
    'settings.twoFactorAuth': 'Two-Factor Authentication',
    'settings.twoFactorAuth.description': 'Add an extra layer of security to your account',
    'settings.twoFactorAuth.enable': 'Enable Two-Factor Auth',
    
    // Trading Settings
    'settings.defaultTradingPair': 'Default Trading Pair',
    'settings.defaultTradingPair.description': 'Set your preferred trading pair for quick access',
    'settings.defaultTradingPair.ethUsdt': 'ETH/USDT (Ethereum/USD)',
    'settings.defaultTradingPair.btcUsdt': 'BTC/USDT (Bitcoin/USD)',
    'settings.defaultTradingPair.usdcUsdt': 'USDC/USDT (USD Stablecoin/USD)',
    'settings.autoConfirmTrades': 'Auto Confirm Trades',
    'settings.autoConfirmTrades.description': 'Automatically confirm trades below specified amount',
    'settings.priceAlerts': 'Price Alerts',
    'settings.priceAlerts.description': 'Get notified when price reaches your target',
    'settings.priceAlerts.manage': 'Manage Alerts',
    
    // Privacy Settings
    'settings.dataCollection': 'Data Collection',
    'settings.dataCollection.description': 'Allow us to collect anonymous usage data',
    'settings.marketingEmails': 'Marketing Emails',
    'settings.marketingEmails.description': 'Receive promotional emails and updates',
    'settings.thirdPartySharing': 'Third-Party Sharing',
    'settings.thirdPartySharing.description': 'Allow sharing data with trusted partners',
    
    // Advanced Settings
    'settings.apiAccess': 'API Access',
    'settings.apiAccess.description': 'Manage your API keys and permissions',
    'settings.apiAccess.configure': 'API Settings',
    'settings.exportData': 'Export Data',
    'settings.exportData.description': 'Download your account data',
    'settings.exportData.button': 'Export',
    'settings.analytics': 'Analytics',
    'settings.analytics.description': 'Help improve the application by sharing usage data',
    'settings.resetPreferences': 'Reset Preferences',
    'settings.resetPreferences.description': 'Reset all options to default values',
    'settings.resetPreferences.button': 'Reset All',
    
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
    'project.loanAmount': 'Loan Amount',
    'project.interestRate': 'Interest Rate',
    'project.perYear': ' p.a.',
    'project.loanTerm': 'Loan Term',
    'project.months': ' Months',
    'project.currentSubscription': 'Current Subscription',
    'project.totalOffering': 'Total Offering',
    'project.subscribed': 'Subscribed',
    'project.partyInfo': 'Party Information',
    'project.issuer': 'Issuer',
    'project.underlyingAsset': 'Underlying Asset',
    'project.sponsor': 'Sponsor',
    'project.valuer': 'Valuer',
    'project.lawyer': 'Lawyer',
    'project.trustee': 'Trustee',
    'project.viewOnEtherscan': 'View on Etherscan',
    
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
    'about.intro1': 'We are RWA Dealmakers specializing in packaging real estate assets into RWA underlying assets that investors favor. Our platform prioritizes the safety of RWA investors\' funds, carefully selecting legally compliant, low-risk, high-return quality assets (such as first-lien residential mortgage assets in Australia with loan-to-value ratios not exceeding 70% and annual interest rates of approximately 9%), facilitating transactions between investors and asset holders.',
    'about.intro2': 'The underlying assets displayed on our platform are all protected by the laws and regulations of the countries where the assets are located, allowing free cross-border capital flows. According to investor needs, the transaction structure can achieve independent segregation of underlying assets and funds, with custody entrusted to qualified third-party institutions.',
    'about.intro3': 'Beyond facilitating transactions between investors and RWA underlying asset holders, our platform also integrates end-to-end ecosystem cooperation for RWA tokenization, including professional RWA tokenization technology service companies, licensed RWA token issuers, and exchanges, ensuring that the tokenization process is legally compliant, efficient, and cost-effective, supporting successful public or private issuances.',
    
    // Contact Us
    'contact.title': 'Contact Us',
    'contact.description': 'If you would like to use real estate assets or real estate mortgage loan assets as underlying assets for RWA financing, or if you are interested in purchasing RWA assets, please contact us.',
    'contact.name': 'Name',
    'contact.name.placeholder': 'Please enter your full name',
    'contact.email': 'Email',
    'contact.email.placeholder': 'Please enter your email address',
    'contact.type': 'Type',
    'contact.type.placeholder': 'Please select',
    'contact.type.individual': 'Individual',
    'contact.type.business': 'Business',
    'contact.type.other': 'Other',
    'contact.subject': 'Subject',
    'contact.subject.placeholder': 'Please select',
    'contact.subject.investor': 'Investment Inquiry',
    'contact.subject.asset_holder': 'Asset Listing',
    'contact.subject.general': 'General Question',
    'contact.subject.technical': 'Technical Support',
    'contact.subject.business': 'Business Partnership',
    'contact.subject.other': 'Other',
    'contact.message': 'Message',
    'contact.message.placeholder': 'Tell us what project you would like to invest in...',
    'contact.send': 'Send Message',
    'follow.us': 'Follow Us',
    
    // Footer
    'footer.disclaimer': 'Disclaimer: The information provided on this platform is for reference only and does not guarantee its authenticity, accuracy or completeness, nor does it constitute an investment invitation or investment advice.',
    'footer.copyright': '© 2025 RWA Dealmaker. All rights reserved.',
    
    // Trading Page
    'trade.contractAddress': 'Contract Address',
    'trade.contractAddressDescription': 'The following contract addresses will be used for this transaction:',
    'trade.principalTokenAddress': 'Principal Token Address',
    
    // Profile page
    'profile.personalCenter': 'Personal Center',
    'profile.personalInfo': 'Personal Information',
    'profile.email': 'Email:',
    'profile.phone': 'Phone:',
    'profile.password': 'Password:',
    'profile.verifyEmail': 'Verify Email',
    'profile.changePhone': 'Change Phone',
    'profile.changePassword': 'Change Password',
    'profile.status': 'Status:',
    'profile.loadingUserInfo': 'Loading user information...',
    'profile.notProvided': 'Not provided',
    'profile.accountStatus': 'Account Status',
    'profile.kycVerification': 'KYC Verification',
    'profile.startVerification': 'Start Verification',
    'profile.tradingPermission': 'Trading Permission',
    'profile.start': 'Start',
    'profile.cancelVerification': 'Cancel Verification',
    'profile.logout': 'Logout',
    'profile.checkEmail': 'Check Your Email',
    'profile.verifyEmailDescription': 'We sent an email with a verification button to your email address.<br>Did you receive the email? If not, please check your spam folder or request a new verification email, valid for 3 days.<br>If you do not verify your email address within 3 days, you will need to create a new account.<br>If you encounter problems, please refer to account help.',
    'profile.accountHelp': 'Account Help',
    'profile.subscribe': 'Subscribe',
    'profile.unsubscribe': 'Unsubscribe',
    'profile.privacy': 'Privacy / Do Not Sell My Info',
    'profile.cookiePreferences': 'Cookie Preferences',
    'profile.confirm': 'Confirm'
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
