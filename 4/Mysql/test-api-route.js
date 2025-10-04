const express = require('express');
const mysql = require('./src/database/index');
const responseHandler = require('./src/middleware/responseHandler');
const { getProjectByCode } = require('./src/routers/route_handler/unifiedProjectRouter_Handler');

// 创建测试应用
const app = express();

// 添加中间件
app.use(responseHandler());
app.use(express.json());

// 添加测试路由
app.get('/api/project/:code', async (req, res) => {
  console.log('🔍 测试API路由 - 参数:', req.params);
  try {
    await getProjectByCode(req, res);
  } catch (error) {
    console.error('❌ API路由测试失败:', error);
    res.cc('API路由测试失败', 1);
  }
});

// 启动测试服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`测试服务器启动在端口 ${PORT}`);
  
  // 测试API调用
  setTimeout(async () => {
    try {
      const fetch = require('node-fetch');
      const response = await fetch(`http://localhost:${PORT}/api/project/RWA001`);
      const result = await response.json();
      console.log('✅ API测试结果:', result);
      
      // 关闭测试服务器
      process.exit(0);
    } catch (error) {
      console.error('❌ API测试失败:', error);
      process.exit(1);
    }
  }, 1000);
});
