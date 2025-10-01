# TradeProjectView "Failed to Load Project" 错误修复指南

## 🚨 问题描述
TradeProjectView页面显示"Failed to Load Project"错误，无法加载项目数据。

## 🔍 根本原因分析

### 1. **后端服务器未启动** (主要原因)
- 后端服务器没有运行在端口3000
- 导致前端API调用失败

### 2. **数据库连接正常** ✅
- 数据库 `rwa` 存在且包含项目数据
- RWA001项目数据完整

### 3. **API路由配置正确** ✅
- `/api/project/:code` 路由已配置
- 前端API调用URL正确

### 4. **前端代码已修复** ✅
- 重试按钮现在调用正确的 `loadProjectData` 方法
- 错误处理逻辑完善

## 🛠️ 修复步骤

### 步骤1: 启动后端服务器
```bash
# 进入后端目录
cd ../Mysql

# 启动服务器
npm start
```

### 步骤2: 验证服务器启动
- 服务器应该在端口3000上运行
- 控制台应该显示 "Server running on port 3000"

### 步骤3: 测试API端点
访问以下URL测试API是否正常：
- `http://localhost:3000/api/project` - 获取所有项目
- `http://localhost:3000/api/project/RWA001` - 获取RWA001项目

### 步骤4: 测试前端页面
访问 `http://localhost:5177/trade/RWA001` 验证修复结果

## 🔧 快速修复脚本

### 使用批处理文件启动服务器
1. **启动后端**: 双击 `Mysql/start-backend.bat`
2. **启动前端**: 双击 `Website/start-frontend.bat`

### 使用诊断工具
访问 `Website/fix-tradeproject-error.html` 进行实时诊断

## 📊 验证修复结果

### 成功指标
- ✅ TradeProjectView正常显示项目信息卡片
- ✅ 项目数据正确加载和显示
- ✅ 交易表单正常显示
- ✅ 重试按钮正常工作

### 失败排查
如果问题仍然存在：
1. 检查浏览器控制台错误信息
2. 验证后端服务器日志
3. 确认数据库连接状态
4. 测试API端点响应

## 🐛 常见问题

### Q: 端口3000被占用
**A**: 更改后端配置或停止占用进程
```bash
# 查看端口占用
netstat -ano | findstr :3000

# 停止进程
taskkill /PID <进程ID> /F
```

### Q: 数据库连接失败
**A**: 检查MySQL服务是否启动
```bash
# 启动MySQL服务
net start mysql
```

### Q: API返回404错误
**A**: 检查路由配置和服务器启动状态

## 📝 技术细节

### API调用流程
1. 前端调用 `productAPI.getProductByCode(code)`
2. 发送GET请求到 `/api/project/:code`
3. 后端查询数据库返回项目数据
4. 前端接收数据并渲染页面

### 错误处理机制
- 网络错误: 显示"网络错误，无法获取项目数据"
- API错误: 显示后端返回的错误消息
- 数据错误: 显示"获取项目数据失败"

## 🎯 预期结果
修复完成后，TradeProjectView应该能够：
- 正确加载和显示项目信息
- 提供完整的交易功能
- 响应所有用户交互
- 提供良好的错误处理体验

---
*最后更新: 2025-01-01*
