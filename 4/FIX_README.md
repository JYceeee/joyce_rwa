# RWA项目修复指南

## 问题诊断

通过分析代码，发现了以下主要问题：

1. **API连接配置问题**：前端配置使用了远程服务器地址，但可能无法连接
2. **缺少环境变量文件**：前端和后端都缺少 `.env` 文件
3. **API路径不匹配**：前端调用的API路径与后端路由不完全匹配
4. **数据库连接配置**：需要确保数据库配置正确

## 修复内容

### 1. 前端修复

- ✅ 更新了 `Website/src/service/api.ts` 中的API配置
- ✅ 添加了详细的日志输出用于调试
- ✅ 修复了 `TradeProjectView.vue` 中的API调用
- ✅ 创建了 `.env` 文件模板（需要手动创建）

### 2. 后端修复

- ✅ 修复了 `Mysql/src/routers/unifiedProjectRouter.js` 中的路由配置
- ✅ 添加了 `/select/:code` 路由以匹配前端调用
- ✅ 修复了 `Mysql/src/routers/route_handler/unifiedProjectRouter_Handler.js` 中的SQL语法错误
- ✅ 更新了 `Mysql/src/database/dbConfig.js` 添加了配置日志
- ✅ 在 `Mysql/index.js` 中添加了健康检查路由

### 3. 数据库修复

- ✅ 创建了 `Mysql/init-database.sql` 数据库初始化脚本
- ✅ 包含了完整的表结构和示例数据

## 使用步骤

### 1. 创建环境变量文件

**前端环境变量文件** (`Website/.env`):
```env
# API配置
VITE_API_BASE_URL=http://localhost:3000
VITE_API_PROJECT_URL=http://localhost:3000/api/project
VITE_API_PROJECT_BY_CODE_URL=http://localhost:3000/project/select
VITE_API_PROJECT_SUBSCRIPTION_URL=http://localhost:3000/api/loans
VITE_API_TRANSACTION_URL=http://localhost:3000/transaction

# 区块链配置
VITE_NETWORK_CHAIN_ID=11155111
VITE_NETWORK_NAME=Sepolia Test Network
VITE_RPC_URL=https://sepolia.infura.io/v3/s9YBJHw1dEizTkvbyMkn

# 智能合约地址
VITE_KYC_REGISTRY_ADDRESS=0x0A96077ffe3f06274d869ba1eed6cB7324270C2f
VITE_LOAN_ISSUER_ADDRESS=0x13159e6417D98528C220b12Ec4950D5A343E5eAA
VITE_PRINCIPAL_TOKEN_ADDRESS=0xA41b4F0417d588a08F914Ca17b07c99783D5c3FC
VITE_INTEREST_TOKEN_ADDRESS=0x9d3175E3F8c055389e070e058f717D450bB89206
VITE_COMPLIANCE_GUARD_ADDRESS=0x448d5FB04025FDb01b97e9bB5e5FD12c687cd480
VITE_HOLDER_REGISTRY_ADDRESS=0x1E77C41899D1d34A11E3BF55809962fE6a929074
```

**后端环境变量文件** (`Mysql/.env`):
```env
# 数据库配置
db_host=localhost
db_user=root
db_password=123456
db_name=rwa
db_port=3306

# 服务器配置
VITE_BACKEND_PORT=3000

# JWT配置
jwt_SecretKey=your_jwt_secret_key_here

# 区块链配置
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/s9YBJHw1dEizTkvbyMkn
PRIVATE_KEY=your_private_key_here
```

### 2. 初始化数据库

1. 确保MySQL服务正在运行
2. 执行数据库初始化脚本：
```bash
mysql -u root -p < Mysql/init-database.sql
```

### 3. 安装依赖

**后端依赖**:
```bash
cd Mysql
npm install
```

**前端依赖**:
```bash
cd Website
npm install
```

### 4. 启动服务

**方法1：使用启动脚本**
```bash
# 在项目根目录运行
start-dev.bat
```

**方法2：手动启动**
```bash
# 启动后端（在Mysql目录）
cd Mysql
npm run dev

# 启动前端（在Website目录）
cd Website
npm run dev
```

### 5. 测试连接

访问以下URL测试服务是否正常：

- 后端健康检查: http://localhost:3000/health
- 项目API: http://localhost:3000/api/project
- 前端应用: http://localhost:5173

## 故障排除

### 1. 数据库连接失败

检查以下配置：
- MySQL服务是否运行
- 数据库用户名和密码是否正确
- 数据库 `rwa` 是否存在
- 端口3306是否被占用

### 2. API连接失败

检查以下配置：
- 后端服务器是否在3000端口运行
- 前端环境变量是否正确设置
- 网络防火墙是否阻止连接

### 3. 前端加载失败

检查以下配置：
- 前端环境变量文件是否存在
- API URL配置是否正确
- 浏览器控制台是否有错误信息

## 调试技巧

1. **查看后端日志**：后端服务器会输出详细的数据库配置和API请求日志
2. **查看前端控制台**：前端会输出API配置和请求详情
3. **使用健康检查**：访问 `/health` 端点检查服务状态
4. **检查网络请求**：使用浏览器开发者工具查看网络请求

## 下一步

修复完成后，trade页面应该能够：
1. 正常加载项目数据
2. 显示项目详情
3. 处理交易请求
4. 与数据库正常交互

如果仍有问题，请检查控制台日志并确保所有服务都正常运行。
