# RWA DealMaker 部署指南

## 📋 目录

1. [系统要求](#系统要求)
2. [数据库部署](#数据库部署)
3. [后端API部署](#后端api部署)
4. [前端部署](#前端部署)
5. [管理员配置](#管理员配置)
6. [测试验证](#测试验证)

---

## 系统要求

### 服务器环境
- **操作系统**: Linux (Ubuntu 20.04+ 推荐) 或 Windows Server
- **Node.js**: v16.0.0 或更高版本
- **MySQL**: v8.0 或更高版本
- **内存**: 最少 2GB RAM
- **存储**: 最少 10GB 可用空间

### 开发工具
- Git
- npm 或 yarn
- MySQL客户端工具

---

## 数据库部署

### 步骤 1: 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS `rwa_dealmaker` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 步骤 2: 初始化数据库表结构

```bash
# 连接到MySQL数据库
mysql -u your_username -p

# 使用数据库
USE rwa_dealmaker;

# 执行初始化脚本
source /path/to/Mysql/database/init_database.sql;
```

或者直接执行：

```bash
mysql -u your_username -p rwa_dealmaker < Mysql/database/init_database.sql
```

### 步骤 3: 插入认购申请数据

```bash
mysql -u your_username -p rwa_dealmaker < Mysql/database/insert_subscriptions_from_projects.sql
```

### 步骤 4: 验证数据库

```sql
-- 检查表是否创建成功
SHOW TABLES;

-- 检查项目数据
SELECT * FROM projects;

-- 检查认购申请数据
SELECT * FROM subscriptions;

-- 检查用户数据
SELECT user_id, user_name, user_email FROM user;
```

---

## 后端API部署

### 步骤 1: 安装依赖

```bash
cd Mysql
npm install
```

### 步骤 2: 配置数据库连接

编辑 `Mysql/src/database/dbConfig.js`:

```javascript
module.exports = {
  mysql: {
    host: 'your-remote-db-host',      // ⚠️ 替换为您的数据库主机地址
    user: 'your-db-username',          // ⚠️ 替换为您的数据库用户名
    password: 'your-db-password',      // ⚠️ 替换为您的数据库密码
    database: 'rwa_dealmaker',
    port: 3306,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
  }
}
```

### 步骤 3: 配置环境变量

创建 `Mysql/.env` 文件：

```env
# JWT密钥
jwt_SecretKey=your-secret-key-here

# Token过期时间
expiresIn=24h

# 服务器端口
VITE_BACKEND_PORT=3000

# 邮件配置（可选）
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 步骤 4: 启动后端服务

#### 开发环境

```bash
cd Mysql
node index.js
```

#### 生产环境（使用PM2）

```bash
# 安装PM2
npm install -g pm2

# 启动服务
pm2 start index.js --name rwa-api

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs rwa-api

# 重启服务
pm2 restart rwa-api
```

### 步骤 5: 验证后端API

```bash
# 测试根路径
curl http://localhost:3000/

# 测试健康检查
curl http://localhost:3000/health

# 测试认购申请API
curl http://localhost:3000/api/subscriptions
```

---

## 前端部署

### 步骤 1: 安装依赖

```bash
cd Website
npm install
```

### 步骤 2: 配置环境变量

创建 `Website/.env` 文件：

```env
# ⚠️ 重要：远程数据库API地址
# 请替换为您的实际API地址
VUE_APP_API_URL=https://your-domain.com

# 或者使用IP地址
# VUE_APP_API_URL=http://your-server-ip:3000

# 其他API端点（可选）
VITE_API_LOGIN_URL=${VUE_APP_API_URL}/user/login
VITE_API_SIGNUP_URL=${VUE_APP_API_URL}/user/reguser
VITE_API_TRANSACTION_URL=${VUE_APP_API_URL}/transaction
VITE_API_PROJECT_URL=${VUE_APP_API_URL}/api/projects
VITE_API_SUBSCRIPTION_URL=${VUE_APP_API_URL}/api/subscriptions
```

### 步骤 3: 构建生产版本

```bash
cd Website
npm run build
```

构建完成后，生成的文件将在 `Website/dist` 目录中。

### 步骤 4: 部署到Web服务器

#### 选项 A: 使用Nginx

1. 安装Nginx：

```bash
sudo apt update
sudo apt install nginx
```

2. 配置Nginx：

创建 `/etc/nginx/sites-available/rwa-dealmaker`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/rwa-dealmaker;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理（可选）
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /user/ {
        proxy_pass http://localhost:3000/user/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /transaction/ {
        proxy_pass http://localhost:3000/transaction/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. 启用站点并重启Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/rwa-dealmaker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. 复制构建文件：

```bash
sudo mkdir -p /var/www/rwa-dealmaker
sudo cp -r Website/dist/* /var/www/rwa-dealmaker/
sudo chown -R www-data:www-data /var/www/rwa-dealmaker
```

#### 选项 B: 使用Node.js静态服务器

```bash
# 安装serve
npm install -g serve

# 启动服务
cd Website/dist
serve -s . -p 8080

# 使用PM2管理
pm2 serve Website/dist 8080 --name rwa-frontend
```

---

## 管理员配置

### 默认管理员账户

- **邮箱**: `han@rwadealmaker.com`
- **密码**: `rwadealmarker123`

### 修改管理员密码

1. 生成新的bcrypt密码哈希：

```javascript
const bcrypt = require('bcrypt');
const password = 'your-new-password';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

2. 更新数据库：

```sql
UPDATE user 
SET user_password = 'your-bcrypt-hash' 
WHERE user_email = 'han@rwadealmaker.com';
```

### 创建新管理员

```sql
INSERT INTO user (user_name, user_email, user_password, user_phone) 
VALUES ('管理员姓名', 'admin@example.com', 'bcrypt-hash', '手机号');
```

---

## 测试验证

### 1. 测试数据库连接

```bash
# 在后端服务器日志中查看
# 应该看到：数据库连接成功!
```

### 2. 测试API端点

```bash
# 测试获取认购申请
curl -X GET http://your-domain.com/api/subscriptions

# 测试创建认购申请
curl -X POST http://your-domain.com/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "user_wallet_address": "0x1234...",
    "project_code": "RWAT0001",
    "purchase_amount": 1000
  }'
```

### 3. 测试管理员登录

1. 访问前端网站
2. 点击登录
3. 使用管理员账户登录
4. 验证是否跳转到管理员控制台

### 4. 测试认购管理功能

1. 访问 `/admin/subscriptions`
2. 查看认购申请列表
3. 测试筛选和搜索功能
4. 测试批准/拒绝功能

---

## 故障排查

### 问题 1: 数据库连接失败

**症状**: 后端启动时显示"数据库连接错误"

**解决方案**:
1. 检查数据库配置是否正确
2. 确认数据库服务是否运行
3. 检查防火墙设置
4. 验证数据库用户权限

### 问题 2: API请求失败

**症状**: 前端显示"远程API地址未配置"

**解决方案**:
1. 确认 `.env` 文件已创建
2. 检查 `VUE_APP_API_URL` 是否正确配置
3. 重新构建前端应用

### 问题 3: CORS错误

**症状**: 浏览器控制台显示CORS错误

**解决方案**:
1. 确认后端已启用CORS
2. 检查Nginx配置中的代理设置
3. 添加正确的CORS头

### 问题 4: 认购申请数据为空

**症状**: 管理员页面显示"暂无认购申请"

**解决方案**:
1. 检查数据库中是否有数据
2. 执行 `insert_subscriptions_from_projects.sql`
3. 检查API响应是否正确

---

## 安全建议

1. **使用HTTPS**: 配置SSL证书（Let's Encrypt免费）
2. **更改默认密码**: 修改管理员默认密码
3. **限制数据库访问**: 只允许特定IP访问数据库
4. **定期备份**: 设置自动数据库备份
5. **更新依赖**: 定期更新npm包和系统软件
6. **监控日志**: 使用PM2或其他工具监控应用日志
7. **防火墙配置**: 只开放必要的端口

---

## 维护建议

### 日常维护

```bash
# 查看后端日志
pm2 logs rwa-api

# 重启后端服务
pm2 restart rwa-api

# 查看服务状态
pm2 status

# 数据库备份
mysqldump -u username -p rwa_dealmaker > backup_$(date +%Y%m%d).sql
```

### 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 更新后端
cd Mysql
npm install
pm2 restart rwa-api

# 3. 更新前端
cd ../Website
npm install
npm run build
sudo cp -r dist/* /var/www/rwa-dealmaker/
```

---

## 支持与联系

如有问题或需要帮助，请：
- 查看项目文档
- 检查日志文件
- 联系技术支持团队

---

**部署完成后，请务必测试所有功能以确保系统正常运行！**
