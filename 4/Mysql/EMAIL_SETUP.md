# 邮件发送功能配置说明

## 环境变量配置

在 `Mysql` 目录下创建 `.env` 文件，添加以下配置：

```env
# 邮件配置
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Gmail配置步骤

### 1. 启用两步验证
1. 登录您的Gmail账户
2. 进入 [Google账户安全设置](https://myaccount.google.com/security)
3. 启用"两步验证"

### 2. 生成应用专用密码
1. 在安全设置页面，找到"应用专用密码"
2. 选择"邮件"作为应用类型
3. 生成16位应用专用密码
4. 将此密码设置为 `EMAIL_PASS` 环境变量

### 3. 配置示例
```env
EMAIL_USER=joyceyang2024@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## 测试邮件功能

### 启动后端服务
```bash
cd Mysql
npm run dev
```

### 测试联系表单
1. 打开前端应用
2. 填写联系表单
3. 点击"发送消息"
4. 检查邮箱是否收到邮件

## API端点

- **POST** `/api/contact` - 提交联系表单
- **GET** `/api/health` - 健康检查

## 邮件模板

### 发送到公司邮箱的邮件包含：
- 用户联系信息（姓名、邮箱、类型、主题）
- 详细消息内容
- 提交时间和IP信息

### 发送给用户的确认邮件包含：
- 感谢信息
- 消息摘要
- 预计回复时间

## 故障排除

### 常见问题
1. **认证失败**: 检查Gmail应用专用密码是否正确
2. **连接超时**: 检查网络连接和防火墙设置
3. **邮件被标记为垃圾邮件**: 检查Gmail安全设置

### 日志查看
后端控制台会显示邮件发送的详细日志，包括成功和失败信息。

