# RWA (Real World Assets) 平台功能报告

## 项目概述

RWA平台是一个基于区块链技术的房地产代币化投资平台，允许用户通过智能合约进行房地产代币的买卖交易。平台集成了完整的用户管理系统、钱包连接、KYC验证、白名单管理和交易功能。

## 核心功能模块

### 1. 用户注册与登录系统

#### 1.1 用户注册功能
**文件位置**: `Website/src/views/auth/SignupView.vue`

**核心功能**:
- ✅ 邮箱验证注册
- ✅ 密码强度验证
- ✅ 用户信息收集
- ✅ 实时状态反馈
- ✅ 邮箱验证码验证

**技术实现**:
```javascript
// 注册表单验证
const submitSignup = async () => {
  // 1. 表单验证
  // 2. 邮箱格式检查
  // 3. 密码强度验证
  // 4. 发送验证码
  // 5. 验证邮箱验证码
  // 6. 创建用户账户
}
```

**安全特性**:
- 密码bcrypt加密存储
- 邮箱验证码6位数字验证
- 验证码5分钟有效期
- 防止重复注册

#### 1.2 用户登录功能
**文件位置**: `Website/src/views/auth/LoginView.vue`

**核心功能**:
- ✅ 邮箱密码登录
- ✅ 记住登录状态（30天）
- ✅ 忘记密码功能
- ✅ 登录状态持久化
- ✅ JWT Token认证

**技术实现**:
```javascript
// 登录流程
const submitLogin = async () => {
  // 1. 邮箱密码验证
  // 2. 生成JWT Token
  // 3. 保存登录状态
  // 4. 路由跳转
}
```

### 2. 钱包连接与管理系统

#### 2.1 MetaMask钱包连接
**文件位置**: `Website/src/views/core/WalletView.vue`

**核心功能**:
- ✅ MetaMask自动连接
- ✅ 多账户管理
- ✅ 钱包地址显示
- ✅ 账户绑定/解绑
- ✅ 实时余额查询
- ✅ 自定义代币管理

**技术实现**:
```javascript
// 钱包连接流程
const connect = async () => {
  // 1. 检测MetaMask
  // 2. 请求账户权限
  // 3. 获取账户列表
  // 4. 保存到localStorage
  // 5. 更新UI状态
}
```

**账户管理功能**:
- 主账户设置
- 账户切换
- 账户解绑
- 新账户链接

#### 2.2 代币余额显示
**显示内容**:
- SepoliaETH余额及AUD价值
- 自定义代币余额
- 实时价格更新
- 多代币支持

### 3. KYC 验证系统

#### 3.1 身份验证流程
**文件位置**: `Website/src/components/kycService.vue`

**验证步骤**:
1. **证件上传与OCR识别**
   - 支持护照、驾照、身份证
   - 自动OCR信息提取
   - 多国家证件支持

2. **活体检测**
   - 摄像头实时检测
   - 人脸识别验证
   - 防欺诈检测

3. **验证完成**
   - KYC等级自动升级至Level 2 <!--后续接入kyc将修改-->
   - 白名单申请资格获得

**技术实现**:
```javascript
// KYC验证流程
const completeKYC = async () => {
  // 1. 证件信息验证
  // 2. 活体检测
  // 3. 智能合约KYC等级设置
  // 4. 白名单申请资格激活
}
```

#### 3.2 智能合约集成
- KYC等级存储在区块链
- 防篡改验证记录
- 自动权限管理

### 4. 白名单申请与管理系统

#### 4.1 白名单申请流程
**文件位置**: `Website/src/views/FunctionalModule/whitelist/WhitelistApplication.vue`

**申请条件**:
- ✅ KYC验证完成（Level 2）
- ✅ 钱包连接有效
- ✅ 同意服务条款

**状态管理**:
- `none`: 未申请
- `pending`: 申请中
- `approved`: 已批准
- `rejected`: 被拒绝

**技术实现**:
```javascript
// 白名单申请
const applyWhitelist = async () => {
  // 1. 验证KYC状态
  // 2. 验证钱包连接
  // 3. 调用智能合约
  // 4. 更新白名单状态
}
```

#### 4.2 权限验证
- 实时KYC状态检查
- 钱包连接验证
- 智能合约权限查询

### 5. 资产认购与交易系统

#### 5.1 项目详情展示
**文件位置**: `Website/src/views/core/DetailPage.vue`

**项目信息**:
- 项目基本信息（名称、类型、地区）
- 财务指标（房产价值、贷款金额、收益率）
- 风险等级评估
- 投资门槛说明

#### 5.2 交易功能
**文件位置**: `Website/src/views/core/TradeProjectView.vue`

**核心交易功能**:
- ✅ Buy/Sell代币交易
- ✅ 实时余额检查
- ✅ 智能合约交互
- ✅ 交易确认弹窗
- ✅ 交易历史记录

**余额检查规则**:
```javascript
// 基于代币符号的余额检查
const checkBalance = async (tokenSymbol) => {
  // 1. 获取特定代币余额
  // 2. 与交易数量比较
  // 3. 显示具体代币符号
  // 4. 返回检查结果
}
```

**交易流程**:
1. **权限验证**: 登录状态、钱包连接、KYC验证、白名单状态
2. **余额检查**: 基于代币符号的余额验证
3. **合约交互**: 智能合约调用
4. **交易确认**: 成功/失败反馈
5. **数据保存**: 交易记录存储到数据库

#### 5.3 智能合约集成
**合约服务**: `Website/src/service/contractService.js`

**支持的合约**:
- KYC注册表合约
- 贷款发行合约
- 合规ERC20代币合约

**核心方法**:
```javascript
// 用户代币余额查询
async getUserTokenBalance(userAddress, tokenSymbol)

// 代币价格查询
async getTokenPrice(tokenSymbol)

// 交易执行
async executeTrade(tradeType, amount, userAddress)
```

### 6. 资产总结与投资组合管理

#### 6.1 投资组合总览
**文件位置**: `Website/src/views/core/PortfolioView.vue`

**核心功能**:
- ✅ 多钱包资产管理
- ✅ 资产分布图表
- ✅ 投资表现分析
- ✅ 交易历史记录
- ✅ 实时价值更新

**资产管理**:
- 绑定钱包账户管理
- 代币持仓统计
- 投资收益率计算
- 风险分散分析

#### 6.2 交易历史管理
**功能特性**:
- 时间范围筛选（7天、30天、90天、全部）
- 交易类型过滤（买入/卖出）
- 详细交易记录
- 交易状态跟踪

**数据可视化**:
- 柱状图显示交易分布
- 饼图显示资产配置
- 趋势线显示投资表现

### 7. 智能合约集成架构

#### 7.1 合约配置管理
**配置文件**: `Website/src/config/contractConfig.js`

**配置内容**:
- 合约地址管理
- ABI接口定义
- 网络配置
- 环境变量支持

#### 7.2 合约交互服务
**核心服务**: `contractService.js`

**主要功能**:
- 合约初始化
- 用户地址获取
- 余额查询
- 交易执行
- 事件监听

**错误处理**:
- 网络连接异常处理
- 合约调用失败重试
- 用户友好的错误提示

### 8. 数据库架构

#### 8.1 用户数据管理
**数据库**: MySQL `rwa`数据库

**核心表结构**:

**用户表 (user)**:
```sql
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    user_wallet VARCHAR(255) UNIQUE,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    email_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**交易历史表 (transactionhistory)**:
```sql
CREATE TABLE transactionhistory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    token_symbol VARCHAR(20) NOT NULL,
    amount DECIMAL(18,6) NOT NULL,
    price DECIMAL(18,6) NOT NULL,
    totalCost DECIMAL(18,6) NOT NULL,
    transaction_type ENUM('BUY','SELL') NOT NULL,
    status ENUM('BUY','SELL','FAILED') DEFAULT 'PENDING',
    transactionHash VARCHAR(100),
    blockNumber BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES user(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE
);
```

#### 8.2 数据关联
- 用户与交易记录的外键关联
- 钱包地址与用户账户的绑定
- 交易记录的完整追踪

### 9. 安全与合规特性

#### 9.1 身份验证安全
- JWT Token认证
- 密码bcrypt加密
- 邮箱验证机制
- 会话管理

#### 9.2 交易安全
- 智能合约权限验证
- KYC合规检查
- 白名单访问控制
- 交易签名验证

#### 9.3 数据安全
- 用户数据加密存储
- 敏感信息保护
- 审计日志记录
- 数据备份机制

### 10. 用户体验优化

#### 10.1 响应式设计
- 移动端适配
- 跨浏览器兼容
- 现代化UI设计
- 直观的操作流程

#### 10.2 实时反馈
- 交易状态实时更新
- 余额变化即时显示
- 错误信息友好提示
- 加载状态指示

#### 10.3 性能优化
- 前端代码分割
- 图片资源优化
- API请求缓存
- 数据库查询优化

## 技术栈

### 前端技术
- **框架**: Vue.js 3 + Composition API
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **UI组件**: 自定义组件库
- **构建工具**: Vite
- **区块链集成**: Ethers.js

### 后端技术
- **运行环境**: Node.js
- **框架**: Express.js
- **数据库**: MySQL
- **认证**: JWT
- **密码加密**: bcryptjs

### 区块链技术
- **网络**: Ethereum Sepolia测试网
- **钱包**: MetaMask
- **智能合约**: Solidity
- **开发工具**: Hardhat

## 部署架构

### 前端部署
- 静态文件服务
- CDN加速
- HTTPS安全连接
- 环境变量配置

### 后端部署
- Node.js服务器
- MySQL数据库
- API接口服务
- 日志监控

### 智能合约部署
- 测试网部署
- 合约验证
- 事件监听
- 升级管理

## 功能完整性总结

### ✅ 已实现功能
1. **用户管理系统**: 注册、登录、邮箱验证
2. **钱包连接**: MetaMask集成、多账户管理
3. **KYC验证**: 身份验证、活体检测、智能合约集成
4. **白名单管理**: 申请、状态跟踪、权限控制
5. **资产交易**: 代币买卖、余额检查、合约交互
6. **投资组合**: 资产管理、交易历史、数据可视化
7. **数据库管理**: 用户数据、交易记录、关联查询
8. **安全机制**: 身份验证、权限控制、数据保护

### 🔄 持续优化
1. **性能优化**: 前端加载速度、数据库查询效率
2. **用户体验**: 界面交互、错误提示、操作流程
3. **安全增强**: 漏洞修复、权限细化、审计完善
4. **功能扩展**: 新代币支持、高级交易功能

## 结论

RWA平台已经实现了完整的房地产代币化投资功能，包括用户管理、身份验证、资产交易和投资组合管理等核心模块。平台采用现代化的技术架构，确保了安全性、可扩展性和用户体验。通过智能合约集成，实现了去中心化的资产交易，同时保持了合规性和用户友好性。

平台已准备好进行测试和部署，为用户提供安全、便捷的房地产代币投资服务。
