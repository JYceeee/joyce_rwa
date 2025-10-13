const express = require('express');
const router = express.Router();
const subscriptionHandler = require('./route_handler/subscriptionRouter_Handler_Enhanced');

// ==================== 认购申请管理 ====================

// 获取所有认购申请（支持筛选和分页）
router.get('/', subscriptionHandler.getSubscriptions);

// 根据ID获取单个认购申请详情（包含历史和支付记录）
router.get('/:id', subscriptionHandler.getSubscriptionById);

// 创建新的认购申请
router.post('/', subscriptionHandler.createSubscription);

// 更新认购申请状态（管理员操作）
router.patch('/:id/status', subscriptionHandler.updateSubscriptionStatus);

// 用户提交支付交易hash
router.post('/:id/payment', subscriptionHandler.submitPaymentTransaction);

// 管理员核查支付
router.post('/:id/verify-payment', subscriptionHandler.verifyPayment);

// 删除认购申请
router.delete('/:id', subscriptionHandler.deleteSubscription);

// 获取认购申请统计信息
router.get('/stats/overview', subscriptionHandler.getSubscriptionStats);

// ==================== 通知管理 ====================

// 获取用户通知列表
router.get('/notifications/list', subscriptionHandler.getUserNotifications);

// 标记通知为已读
router.patch('/notifications/:id/read', subscriptionHandler.markNotificationAsRead);

// 批量标记通知为已读
router.post('/notifications/mark-all-read', subscriptionHandler.markAllNotificationsAsRead);

module.exports = router;

