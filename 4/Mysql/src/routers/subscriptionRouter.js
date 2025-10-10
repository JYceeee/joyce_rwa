const express = require('express');
const router = express.Router();
const subscriptionHandler = require('./route_handler/subscriptionRouter_Handler');

// 获取所有认购申请（支持筛选和分页）
router.get('/', subscriptionHandler.getSubscriptions);

// 根据ID获取单个认购申请详情
router.get('/:id', subscriptionHandler.getSubscriptionById);

// 创建新的认购申请
router.post('/', subscriptionHandler.createSubscription);

// 更新认购申请状态（批准/拒绝）
router.patch('/:id/status', subscriptionHandler.updateSubscriptionStatus);

// 更新认购申请信息
router.put('/:id', subscriptionHandler.updateSubscription);

// 删除认购申请
router.delete('/:id', subscriptionHandler.deleteSubscription);

// 获取认购申请统计信息
router.get('/stats/overview', subscriptionHandler.getSubscriptionStats);

// 导出认购申请数据
router.get('/export/csv', subscriptionHandler.exportSubscriptionsToCSV);

module.exports = router;
