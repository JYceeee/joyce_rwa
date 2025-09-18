# RWA项目数据库和认证系统说明

启动前端：
cd D:\1-USYD\2025-S2\RWA\website\2\RWA-WEBSITE-TRIAL3
npm run dev
启动后端执行：
cd D:\1-USYD\2025-S2\RWA\website\2\RWA_Project-master
node index.js

注册测试
$ Invoke-RestMethod -Uri "http://localhost:3000/user/reguser" -Method POST -ContentType "application/json" -Body '{"user_email":"ceshi222_joyce@163.com","user_password":"rwa12345","user_name":"ceshi222_joyce","user_id":"user_ceshi222","user_phone":""}'

登录测试
$ Invoke-RestMethod -Uri "http://localhost:3000/user/login" -Method POST -ContentType "application/json" -Body '{"user_email":"ceshi222_joyce@163.com","user_password":"rwa12345"}'


## 后端MySQL数据库逻辑

### 数据库配置
- 数据库名: `rwa`
- 主机: `localhost`
- 端口: `3306`
- 用户: `root`
- 密码: `123456`

### 用户表结构
```sql
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL COMMENT '用户ID',
    user_name VARCHAR(100) NOT NULL COMMENT '用户名',
    user_email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    user_password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
    user_phone VARCHAR(20) COMMENT '手机号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否激活'
);
```

### 认证流程
1. **注册流程**:
   - 用户提交邮箱和密码
   - 后端验证邮箱格式和密码强度
   - 检查邮箱是否已存在
   - 使用bcrypt加密密码
   - 保存用户信息到数据库

2. **登录流程**:
   - 用户提交邮箱和密码
   - 后端查询用户信息
   - 使用bcrypt验证密码
   - 生成JWT token
   - 返回token给前端

### API端点
- `POST /user/reguser` - 用户注册
- `POST /user/login` - 用户登录

## 前端认证模块

### 主要功能
1. **用户注册**: 支持邮箱注册，自动生成用户名和用户ID
2. **用户登录**: 支持邮箱密码登录，记住登录状态
3. **自动登录**: 注册成功后自动登录
4. **状态管理**: 使用Vue 3 Composition API管理认证状态

### 技术实现
- 使用Vue 3 Composition API
- 统一的认证状态管理 (`useAuth` composable)
- JWT token自动处理
- 本地存储持久化

## 快速启动

### 1. 启动后端服务器
```bash
cd RWA_Project-master
# 确保MySQL服务正在运行
# 运行数据库初始化脚本
mysql -u root -p < database_init.sql
# 启动服务器
node index.js
```

### 2. 启动前端应用
```bash
cd RWA-WEBSITE-TRIAL3
npm install
npm run dev
```

### 3. 使用批处理文件（Windows）
- 后端: 双击 `RWA_Project-master/start_server.bat`
- 前端: 双击 `RWA-WEBSITE-TRIAL3/start_frontend.bat`

## 环境配置

### 后端环境变量 (.env)
```
db_host=localhost
db_user=root
db_password=123456
db_name=rwa
db_port=3306
jwt_SecretKey=your_jwt_secret_key_here_please_change_this
expiresIn=24h
```

### 前端环境变量 (.env)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_API_LOGIN_URL=http://localhost:3000/user/login
VITE_API_SIGNUP_URL=http://localhost:3000/user/reguser
```

## 安全特性
1. 密码使用bcrypt加密存储
2. JWT token用于身份验证
3. 输入验证和错误处理
4. CORS跨域支持

## 注意事项
1. 确保MySQL服务正在运行
2. 修改默认的JWT密钥
3. 在生产环境中使用强密码
4. 定期备份数据库
