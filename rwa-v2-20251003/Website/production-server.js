// 生产环境 Express 服务器
// 用于部署前端静态文件和API服务
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务 - 提供前端构建文件
app.use(express.static(path.join(__dirname, 'dist')));

// API路由 - 邮件验证服务
const { sendVerificationCode, verifyCode } = require('./src/service/emailService');

// 发送验证码邮件
app.post('/api/send-email-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email required.' });
  try {
    const code = await sendVerificationCode(email);
    // 实际生产环境不返回code，仅用于前端演示
    res.json({ success: true, code });
  } catch (e) {
    res.json({ success: false, message: 'Failed to send email.' });
  }
});

// 校验验证码
app.post('/api/verify-email-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.json({ success: false, message: 'Email and code required.' });
  try {
    const ok = await verifyCode(email, code);
    res.json({ success: ok });
  } catch (e) {
    res.json({ success: false, message: 'Verification failed.' });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: 'production'
  });
});

// 所有其他路由都返回前端应用 (SPA路由支持)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Production server running on http://${HOST}:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
  console.log(`🌍 Environment: production`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

