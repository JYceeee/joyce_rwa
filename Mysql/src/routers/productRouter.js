const express = require('express');
const router = express.Router();

// 导入产品处理器
const {
  getAllProductDetails,
  getProductByCode,
  updateProductSubscription
} = require('./route_handler/productRouter_Handler');

// 获取所有产品详情列表
router.get('/product_details', getAllProductDetails);

// 根据产品代码获取产品详情
router.get('/product_details/:code', getProductByCode);

// 更新产品订阅信息
router.put('/product_details/:code/subscription', updateProductSubscription);

module.exports = router;
