# RWA前端部署指南

## 概述
本指南将帮助您部署RWA（Real World Assets）交易平台的前端应用。

## 部署方式

### 方式一：使用部署脚本（推荐）

#### Windows用户
```bash
# 使用批处理脚本
deploy.bat

# 或使用PowerShell脚本
.\deploy.ps1
```

#### Linux/Mac用户
```bash
# 创建部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 方式二：手动部署

#### 1. 安装依赖
```bash
cd Website
npm install
```

#### 2. 配置环境变量
```bash
# 复制生产环境配置
cp production.env .env

# 编辑配置文件，修改以下关键配置：
# - VITE_API_BASE_URL: 后端API地址
# - VITE_RPC_URL: 以太坊RPC地址
# - 合约地址配置
```

#### 3. 构建前端
```bash
npm run build
```

#### 4. 启动生产服务器
```bash
node production-server.js
```

## 配置说明

### 环境变量配置
在 `production.env` 文件中配置以下关键变量：

#### API配置
```env
# 后端API基础URL（必须修改为实际服务器地址）
VITE_API_BASE_URL=http://your-server-domain.com:3000/api

# 其他API端点会自动基于基础URL生成
```

#### 区块链配置
```env
# 以太坊RPC URL（必须配置）
VITE_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

# 网络配置
VITE_NETWORK_CHAIN_ID=1
VITE_NETWORK_NAME=Ethereum Mainnet
```

#### 智能合约地址
```env
# 确保所有合约地址都是正确的
VITE_KYC_REGISTRY_ADDRESS=0x...
VITE_LOAN_ISSUER_ADDRESS=0x...
VITE_PRINCIPAL_TOKEN_ADDRESS=0x...
VITE_INTEREST_TOKEN_ADDRESS=0x...
```

## 部署到云服务器

### 1. 准备服务器
- 安装Node.js (版本 >= 18)
- 安装MySQL数据库
- 配置防火墙开放端口3000

### 2. 上传代码
```bash
# 使用scp上传代码
scp -r Website/ user@your-server:/path/to/deployment/

# 或使用git克隆
git clone your-repo-url
cd your-repo/Website
```

### 3. 配置生产环境
```bash
# 修改production.env中的配置
nano production.env

# 主要修改项：
# - 数据库连接信息
# - API服务器地址
# - RPC节点地址
# - 合约地址
```

### 4. 启动服务
```bash
# 使用PM2管理进程（推荐）
npm install -g pm2
pm2 start production-server.js --name "rwa-frontend"

# 或直接启动
node production-server.js
```

## 使用Nginx反向代理（可选）

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 使用Docker部署（可选）

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "production-server.js"]
```

### 构建和运行
```bash
docker build -t rwa-frontend .
docker run -p 3000:3000 rwa-frontend
```

## 验证部署

### 1. 检查服务状态
```bash
curl http://localhost:3000/api/health
```

### 2. 访问前端
打开浏览器访问：`http://your-server:3000`

### 3. 检查功能
- 用户注册/登录
- 项目列表显示
- 钱包连接
- 交易功能

## 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 清除缓存重新构建
rm -rf node_modules dist
npm install
npm run build
```

#### 2. 端口被占用
```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# 杀死进程
taskkill /PID <进程ID> /F
```

#### 3. 环境变量未生效
```bash
# 确保.env文件存在且格式正确
cat .env

# 重启服务器
pm2 restart rwa-frontend
```

#### 4. 数据库连接失败
- 检查数据库服务是否运行
- 验证连接配置
- 检查防火墙设置

## 性能优化

### 1. 启用Gzip压缩
在 `production-server.js` 中添加：
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. 设置缓存头
```javascript
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y'
}));
```

### 3. 使用CDN
将静态资源上传到CDN，修改构建配置。

## 安全建议

1. **环境变量安全**
   - 不要将敏感信息提交到代码仓库
   - 使用环境变量管理敏感配置

2. **HTTPS配置**
   - 生产环境必须使用HTTPS
   - 配置SSL证书

3. **防火墙配置**
   - 只开放必要端口
   - 限制数据库访问

4. **定期更新**
   - 保持依赖包最新
   - 定期安全扫描

## 监控和日志

### 使用PM2监控
```bash
pm2 monit
pm2 logs rwa-frontend
```

### 设置日志轮转
```bash
pm2 install pm2-logrotate
```

## 联系支持

如果遇到部署问题，请检查：
1. Node.js版本是否符合要求
2. 环境变量配置是否正确
3. 数据库连接是否正常
4. 网络连接是否畅通

---

**注意**: 部署前请确保已完成后端API的部署和数据库的配置。

