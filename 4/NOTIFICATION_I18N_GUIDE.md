# NotificationsView.vue 中英文切换功能指南

## 🌍 功能概述

NotificationsView.vue 现在完全支持中英文切换功能，包括：
- 页面标题和按钮文本
- 通知类型和内容
- 操作按钮文本
- 模拟通知数据

## 🔧 实现细节

### 1. 翻译键值对

在 `useLanguage.js` 中新增了以下翻译键：

#### 中文翻译
```javascript
// 通知类型
'notifications.types.transactionSuccess': '交易成功完成',
'notifications.types.newProjectLaunched': '新项目上线',
'notifications.types.subscriptionProgress': '认购进度更新',
'notifications.types.kycStatusUpdate': 'KYC状态更新',
'notifications.types.whitelistStatusUpdate': '白名单状态更新',
'notifications.types.principalTokenReceived': '收到本金token',
'notifications.types.interestTokenReceived': '收到利息token',
'notifications.types.projectMaturity': '项目到期提醒',
'notifications.types.subscriptionApplied': '认购申请已提交',
'notifications.types.subscriptionUnderReview': '认购申请审批中',
'notifications.types.subscriptionApproved': '认购申请已通过',

// 通知操作按钮
'notifications.actions.viewPortfolio': '查看投资组合',
'notifications.actions.viewProject': '查看项目',
'notifications.actions.viewProfile': '查看资料',
'notifications.actions.viewDetails': '查看详情',
'notifications.actions.payNow': '立即支付',
```

#### 英文翻译
```javascript
// 通知类型
'notifications.types.transactionSuccess': 'Transaction Successfully Completed',
'notifications.types.newProjectLaunched': 'New Project Launched',
'notifications.types.subscriptionProgress': 'Subscription Progress Update',
'notifications.types.kycStatusUpdate': 'KYC Status Update',
'notifications.types.whitelistStatusUpdate': 'Whitelist Status Update',
'notifications.types.principalTokenReceived': 'Principal Token Received',
'notifications.types.interestTokenReceived': 'Interest Token Received',
'notifications.types.projectMaturity': 'Project Maturity Reminder',
'notifications.types.subscriptionApplied': 'Subscription Applied',
'notifications.types.subscriptionUnderReview': 'Subscription Under Review',
'notifications.types.subscriptionApproved': 'Subscription Approved',

// 通知操作按钮
'notifications.actions.viewPortfolio': 'View Portfolio',
'notifications.actions.viewProject': 'View Project',
'notifications.actions.viewProfile': 'View Profile',
'notifications.actions.viewDetails': 'View Details',
'notifications.actions.payNow': 'Pay Now',
```

### 2. 动态内容生成

#### 模拟通知数据
```javascript
const generateMockNotifications = () => {
  const isZh = currentLanguage.value === 'zh'
  
  return [
    {
      id: 1,
      type: 'success',
      title: isZh ? '交易成功完成' : 'Transaction Successfully Completed',
      message: isZh ? 
        '🎉 恭喜！您的MetaMask支付交易已成功完成...' :
        '🎉 Congratulations! Your MetaMask payment transaction has been successfully completed...',
      action_url: '/portfolio',
      action_text: isZh ? '查看投资组合' : 'View Portfolio',
      // ...
    }
  ]
}
```

#### 操作按钮文本
```javascript
const getActionText = (notification) => {
  if (notification.type === 'TRANSACTION_SUCCESS') {
    return t('notifications.actions.viewPortfolio')
  }
  if (notification.type === 'NEW_PROJECT_LAUNCHED') {
    return t('notifications.actions.viewProject')
  }
  // ...
}
```

### 3. 语言切换监听

```javascript
// 监听语言变化，重新生成通知数据
watch(currentLanguage, () => {
  // 如果当前使用的是模拟数据，重新生成
  if (notifications.value.length > 0 && notifications.value[0].id === 1) {
    notifications.value = generateMockNotifications()
  }
})
```

## 🎯 使用方法

### 1. 语言切换
用户可以通过header中的语言切换按钮在中英文之间切换：
- 点击 "ENG" 切换到英文
- 点击 "中文" 切换到中文

### 2. 自动更新
当语言切换时，以下内容会自动更新：
- ✅ 页面标题和按钮文本
- ✅ 通知列表中的标题和消息
- ✅ 操作按钮文本
- ✅ 过滤器和分页文本

### 3. 通知类型支持
所有通知类型都支持中英文：
- 交易成功通知
- 新项目上线通知
- 认购进度更新通知
- KYC状态更新通知
- 白名单状态更新通知
- Token接收通知
- 项目到期通知
- 认购申请状态通知

## 🔄 实时切换

语言切换是实时的，无需刷新页面：
1. 用户点击语言切换按钮
2. `currentLanguage` 响应式变量更新
3. `watch` 监听器触发
4. 重新生成模拟通知数据
5. 页面内容立即更新为对应语言

## 📱 兼容性

- ✅ 桌面端完整支持
- ✅ 移动端完整支持
- ✅ 所有浏览器兼容
- ✅ 响应式设计保持

## 🚀 扩展性

如需添加新的通知类型或语言：
1. 在 `useLanguage.js` 中添加对应的翻译键值对
2. 在 `generateMockNotifications` 中添加新的通知数据
3. 在 `getActionText` 中添加对应的操作文本逻辑

系统会自动处理新内容的语言切换。
