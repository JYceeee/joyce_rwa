# 环境变量配置指南

## ⚠️ 重要：远程数据库API配置

本项目已配置为**仅使用远程数据库**，不再使用本地模拟数据。

### 配置步骤

#### 1. 创建环境变量文件

在 `Website` 目录下创建 `.env` 文件：

```bash
# 在 Website 目录下
touch .env
```

#### 2. 配置远程API地址

在 `.env` 文件中添加以下内容：

```env
# ⚠️ 重要：请将此URL替换为您的远程数据库API地址
# 例如：https://your-domain.com 或 https://api.rwadealmaker.com
VUE_APP_API_URL=https://your-remote-api-url.com

# 其他API端点配置（可选）
VITE_API_LOGIN_URL=${VUE_APP_API_URL}/user/login
VITE_API_SIGNUP_URL=${VUE_APP_API_URL}/user/reguser
VITE_API_TRANSACTION_URL=${VUE_APP_API_URL}/transaction
VITE_API_PROJECT_URL=${VUE_APP_API_URL}/api/projects
VITE_API_SUBSCRIPTION_URL=${VUE_APP_API_URL}/api/subscriptions
```

### 需要替换URL的代码位置

以下文件中已标注需要配置远程API地址的位置：

#### 1. **AdminDashboard.vue** (管理员控制台)
- **文件路径**: `Website/src/views/admin/AdminDashboard.vue`
- **行号**: 约159-164行
- **标注**: `⚠️ 重要：请将此URL替换为您的远程数据库API地址`

#### 2. **AdminSubscriptions.vue** (认购管理页面)
- **文件路径**: `Website/src/views/admin/AdminSubscriptions.vue`
- **行号**: 约356-361行, 471-475行, 521-525行
- **标注**: `⚠️ 重要：请将此URL替换为您的远程数据库API地址`

#### 3. **TradeProjectView.vue** (交易页面)
- **文件路径**: `Website/src/views/core/TradeProjectView.vue`
- **行号**: 约1117-1122行
- **标注**: `⚠️ 重要：请将此URL替换为您的远程数据库API地址`

### API端点说明

配置完成后，以下API端点将被使用：

| 功能 | API端点 | 方法 | 说明 |
|------|---------|------|------|
| 获取认购申请列表 | `/api/subscriptions` | GET | 支持分页、筛选、排序 |
| 获取认购申请详情 | `/api/subscriptions/:id` | GET | 根据ID获取详情 |
| 创建认购申请 | `/api/subscriptions` | POST | 用户提交认购申请 |
| 更新认购申请状态 | `/api/subscriptions/:id/status` | PATCH | 批准/拒绝申请 |
| 获取统计信息 | `/api/subscriptions/stats/overview` | GET | 获取认购统计数据 |

### 数据库初始化

#### 1. 创建数据库表结构

在远程MySQL数据库中执行以下SQL脚本：

```bash
# 在 Mysql/database 目录下
mysql -u your_username -p your_database < init_database.sql
```

或者手动执行：
- `Mysql/database/init_database.sql` - 创建数据库和表结构
- `Mysql/database/subscription_table.sql` - 创建认购申请表（如果单独需要）

#### 2. 插入示例数据

根据项目表生成认购申请数据：

```bash
mysql -u your_username -p your_database < insert_subscriptions_from_projects.sql
```

### 后端服务器配置

#### 1. 安装依赖

```bash
cd Mysql
npm install
```

#### 2. 配置数据库连接

编辑 `Mysql/src/database/dbConfig.js`，配置远程数据库连接信息：

```javascript
module.exports = {
  mysql: {
    host: 'your-remote-db-host',
    user: 'your-db-username',
    password: 'your-db-password',
    database: 'rwa_dealmaker',
    port: 3306
  }
}
```

#### 3. 启动后端服务

```bash
cd Mysql
npm start
# 或
node index.js
```

### CORS配置

确保后端服务器已配置CORS以允许前端跨域请求。在 `Mysql/index.js` 中已包含：

```javascript
const cors = require('cors')
app.use(cors())
```

### 错误处理

如果未配置 `VUE_APP_API_URL` 环境变量，应用将显示错误消息：

```
远程API地址未配置，请设置VUE_APP_API_URL环境变量
```

### 测试配置

#### 1. 测试API连接

```bash
curl https://your-remote-api-url.com/api/subscriptions
```

#### 2. 测试管理员登录

- 邮箱: `han@rwadealmaker.com`
- 密码: `rwadealmarker123`

#### 3. 验证功能

1. 登录管理员账户
2. 访问管理员控制台 (`/admin`)
3. 查看认购申请列表 (`/admin/subscriptions`)
4. 测试批准/拒绝功能

### 常见问题

#### Q: 为什么显示"远程API地址未配置"？
A: 请确保已创建 `.env` 文件并正确配置 `VUE_APP_API_URL`。

#### Q: API请求失败怎么办？
A: 
1. 检查远程服务器是否正常运行
2. 检查数据库连接是否正确
3. 检查CORS配置是否正确
4. 查看浏览器控制台和服务器日志

#### Q: 如何切换回本地开发？
A: 将 `VUE_APP_API_URL` 设置为 `http://localhost:3000`

### 安全建议

1. **不要将 `.env` 文件提交到版本控制系统**
2. **使用HTTPS协议保护API通信**
3. **定期更新管理员密码**
4. **限制API访问权限**
5. **启用数据库访问白名单**

### 支持

如有问题，请查看：
- 浏览器控制台日志
- 后端服务器日志 (`Mysql/`)
- 数据库连接日志

---

**最后更新**: 2025-10-10
