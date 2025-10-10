# 联系表单故障排除指南

## 🚨 常见问题及解决方案

### 1. Form submission failed 错误

#### 问题原因：
- 后端服务器未启动
- 缺少 `.env` 文件配置
- 邮件配置不正确
- 网络连接问题

#### 解决步骤：

#### 步骤1: 启动后端服务器
```bash
cd Mysql
npm run dev
```
确保看到：`服务器3000端口已启动成功`

#### 步骤2: 创建 `.env` 文件
在 `Mysql` 目录下创建 `.env` 文件：
```env
# 邮件配置
EMAIL_USER=joyceyang2024@gmail.com
EMAIL_PASS=your_gmail_app_password

# 服务器端口
VITE_BACKEND_PORT=3000
```

#### 步骤3: 配置Gmail应用密码
1. 登录Gmail账户
2. 进入 [Google账户安全设置](https://myaccount.google.com/security)
3. 启用"两步验证"
4. 生成"应用专用密码"
5. 将密码设置为 `EMAIL_PASS`

### 2. 测试模式运行

如果暂时无法配置邮件，系统会自动进入测试模式：
- ✅ 表单提交会成功
- ✅ 返回测试模式提示
- ⚠️ 不会实际发送邮件

### 3. 调试步骤

#### 检查后端日志
启动后端后，查看控制台输出：
```
📧 收到联系表单请求: {...}
📝 准备发送邮件: {...}
📨 邮件发送结果: {...}
```

#### 检查网络连接
在浏览器开发者工具中查看：
1. Network 标签
2. 检查 `/api/contact` 请求状态
3. 查看响应内容

#### 测试API端点
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "email": "test@example.com",
    "subject": "测试主题",
    "message": "测试消息"
  }'
```

## 🔧 完整配置清单

### 必需文件：
- [ ] `.env` 文件存在
- [ ] `EMAIL_USER` 配置正确
- [ ] `EMAIL_PASS` 配置正确
- [ ] 后端服务器运行在端口3000

### 可选配置：
- [ ] 数据库连接配置
- [ ] JWT密钥配置

## 📧 邮件配置详细步骤

### Gmail设置：
1. **启用两步验证**
2. **生成应用专用密码**：
   - 应用类型：邮件
   - 设备：其他（自定义名称）
   - 复制生成的16位密码

### 环境变量示例：
```env
EMAIL_USER=joyceyang2024@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## 🚀 快速测试

### 1. 启动服务
```bash
# 终端1: 启动后端
cd Mysql
npm run dev

# 终端2: 启动前端
cd Website
npm run dev
```

### 2. 测试表单
1. 打开 http://localhost:5173
2. 导航到联系我们页面
3. 填写表单
4. 点击"发送消息"
5. 查看控制台日志

### 3. 预期结果
- 前端：显示成功消息
- 后端：显示详细日志
- 邮箱：收到邮件（如果配置正确）

## 🆘 如果仍然失败

### 检查清单：
- [ ] 后端服务器是否运行？
- [ ] 端口3000是否被占用？
- [ ] `.env` 文件是否存在？
- [ ] 邮件配置是否正确？
- [ ] 网络连接是否正常？

### 获取帮助：
1. 查看后端控制台错误信息
2. 查看浏览器开发者工具Network标签
3. 检查防火墙设置
4. 确认Gmail应用密码正确
