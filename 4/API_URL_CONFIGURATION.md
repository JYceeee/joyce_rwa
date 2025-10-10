# API URL 配置说明

## 📍 当前配置状态

### 前端API连接地址

所有管理员功能和认购功能现在都连接到 **localhost**：

```
http://localhost:3000
```

### 已配置的文件

1. **AdminDashboard.vue** (管理员控制台)
   - 文件路径: `Website/src/views/admin/AdminDashboard.vue`
   - 行号: 161
   - API地址: `http://localhost:3000`

2. **AdminSubscriptions.vue** (认购管理页面)
   - 文件路径: `Website/src/views/admin/AdminSubscriptions.vue`
   - 行号: 358, 472
   - API地址: `http://localhost:3000`

3. **TradeProjectView.vue** (交易页面)
   - 文件路径: `Website/src/views/core/TradeProjectView.vue`
   - 行号: 1119
   - API地址: `http://localhost:3000`

---

## 🔧 如何切换API地址

### 方法1: 直接修改代码（当前方法）

在以下文件中查找并替换 `apiUrl` 的值：

#### AdminDashboard.vue
```javascript
// 第161行
const apiUrl = 'http://localhost:3000'  // 修改这里
```

#### AdminSubscriptions.vue
```javascript
// 第358行
const apiUrl = 'http://localhost:3000'  // 修改这里

// 第472行
const apiUrl = 'http://localhost:3000'  // 修改这里
```

#### TradeProjectView.vue
```javascript
// 第1119行
const apiUrl = 'http://localhost:3000'  // 修改这里
```

### 方法2: 使用环境变量（推荐）

如果需要频繁切换，建议修改代码使用环境变量：

#### 修改代码为：
```javascript
const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
```

#### 然后在 `.env` 文件中配置：

**本地开发环境** (`.env.local`):
```env
VUE_APP_API_URL=http://localhost:3000
```

**生产环境** (`.env.production`):
```env
VUE_APP_API_URL=http://13.239.255.133:3000
```

---

## 🌐 不同环境的配置

### 本地开发环境
```
API地址: http://localhost:3000
数据库: localhost:3306
```

**使用场景**:
- 本地开发和测试
- 调试功能
- 快速迭代

**配置方法**:
```javascript
const apiUrl = 'http://localhost:3000'
```

### 远程服务器环境
```
API地址: http://13.239.255.133:3000
数据库: 13.239.255.133:3306
```

**使用场景**:
- 生产环境
- 团队协作
- 远程测试

**配置方法**:
```javascript
const apiUrl = 'http://13.239.255.133:3000'
```

### 使用域名（推荐生产环境）
```
API地址: https://api.rwadealmaker.com
数据库: 内网地址（不对外暴露）
```

**使用场景**:
- 正式上线
- 安全性要求高
- 使用HTTPS

**配置方法**:
```javascript
const apiUrl = 'https://api.rwadealmaker.com'
```

---

## 🔄 快速切换脚本

### 切换到localhost

创建 `switch-to-localhost.sh`:
```bash
#!/bin/bash
echo "切换API地址到localhost..."

# 替换AdminDashboard.vue
sed -i "s|http://[0-9.]*:3000|http://localhost:3000|g" Website/src/views/admin/AdminDashboard.vue

# 替换AdminSubscriptions.vue
sed -i "s|http://[0-9.]*:3000|http://localhost:3000|g" Website/src/views/admin/AdminSubscriptions.vue

# 替换TradeProjectView.vue
sed -i "s|http://[0-9.]*:3000|http://localhost:3000|g" Website/src/views/core/TradeProjectView.vue

echo "✅ 已切换到localhost"
```

### 切换到远程服务器

创建 `switch-to-remote.sh`:
```bash
#!/bin/bash
echo "切换API地址到远程服务器..."

REMOTE_IP="13.239.255.133"

# 替换AdminDashboard.vue
sed -i "s|http://localhost:3000|http://$REMOTE_IP:3000|g" Website/src/views/admin/AdminDashboard.vue

# 替换AdminSubscriptions.vue
sed -i "s|http://localhost:3000|http://$REMOTE_IP:3000|g" Website/src/views/admin/AdminSubscriptions.vue

# 替换TradeProjectView.vue
sed -i "s|http://localhost:3000|http://$REMOTE_IP:3000|g" Website/src/views/core/TradeProjectView.vue

echo "✅ 已切换到远程服务器: $REMOTE_IP"
```

**使用方法**:
```bash
# 赋予执行权限
chmod +x switch-to-localhost.sh
chmod +x switch-to-remote.sh

# 执行切换
./switch-to-localhost.sh
# 或
./switch-to-remote.sh
```

---

## ⚠️ 重要提示

### 端口说明

| 服务 | 端口 | 用途 |
|------|------|------|
| 前端开发服务器 | 5173 | Vite开发服务器 |
| 后端API服务器 | 3000 | Express API服务 |
| MySQL数据库 | 3306 | 数据库连接 |

### 常见错误

#### ❌ 错误1: 使用数据库端口
```javascript
const apiUrl = 'http://localhost:3306'  // 错误！
```
**原因**: 3306是MySQL数据库端口，不是API服务器端口

**正确**:
```javascript
const apiUrl = 'http://localhost:3000'  // 正确！
```

#### ❌ 错误2: 混淆前端和后端端口
```javascript
const apiUrl = 'http://localhost:5173'  // 错误！
```
**原因**: 5173是前端开发服务器端口，不是后端API端口

**正确**:
```javascript
const apiUrl = 'http://localhost:3000'  // 正确！
```

---

## 🧪 测试API连接

### 测试localhost连接

```bash
# 测试后端服务器是否运行
curl http://localhost:3000/

# 测试健康检查
curl http://localhost:3000/health

# 测试认购申请API
curl http://localhost:3000/api/subscriptions
```

### 测试远程连接

```bash
# 测试远程服务器
curl http://13.239.255.133:3000/

# 测试远程API
curl http://13.239.255.133:3000/api/subscriptions
```

---

## 📋 启动服务清单

### 本地开发环境

1. **启动MySQL数据库**
   ```bash
   # Windows
   net start MySQL80
   
   # Linux/Mac
   sudo service mysql start
   ```

2. **启动后端API服务器**
   ```bash
   cd Mysql
   npm install
   node index.js
   ```
   
   ✅ 应该看到: `服务器3000端口已启动成功`

3. **启动前端开发服务器**
   ```bash
   cd Website
   npm install
   npm run dev
   ```
   
   ✅ 应该看到: `Local: http://localhost:5173/`

4. **访问管理员页面**
   - 登录: `http://localhost:5173/login`
   - 邮箱: `han@rwadealmaker.com`
   - 密码: `rwadealmarker123`
   - 控制台: `http://localhost:5173/admin`

---

## 🔍 故障排查

### 问题1: 无法连接到API

**症状**: 前端显示"加载认购申请失败"

**检查清单**:
1. ✅ 后端服务器是否运行在3000端口？
2. ✅ MySQL数据库是否正常运行？
3. ✅ API地址是否正确配置为 `http://localhost:3000`？
4. ✅ 防火墙是否阻止了3000端口？

**解决方法**:
```bash
# 检查端口占用
netstat -ano | findstr :3000

# 重启后端服务
cd Mysql
node index.js
```

### 问题2: CORS错误

**症状**: 浏览器控制台显示CORS错误

**解决方法**:
确认 `Mysql/index.js` 中已启用CORS:
```javascript
const cors = require('cors')
app.use(cors())
```

### 问题3: 数据库连接失败

**症状**: 后端日志显示"数据库连接错误"

**解决方法**:
检查 `Mysql/src/database/dbConfig.js`:
```javascript
module.exports = {
  mysql: {
    host: 'localhost',      // 确认是localhost
    user: 'root',           // 确认用户名
    password: 'your_password', // 确认密码
    database: 'rwa_dealmaker',
    port: 3306
  }
}
```

---

## 📝 配置历史

### 2025-10-10
- ✅ 将所有API地址从 `http://13.239.255.133:3000` 改为 `http://localhost:3000`
- ✅ 修改了3个文件中的4处API地址配置
- ✅ 验证了所有远程IP地址已完全移除

---

## 🔗 相关文档

- `ENV_CONFIGURATION.md` - 环境变量配置指南
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `ADMIN_SYSTEM_SUMMARY.md` - 管理员系统总结

---

**最后更新**: 2025-10-10  
**当前配置**: localhost  
**状态**: ✅ 已配置
