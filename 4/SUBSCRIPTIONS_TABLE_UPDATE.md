# Subscriptions 表结构更新说明

## 📋 更新概述

已成功简化 `subscriptions` 表结构，移除不需要的字段，保留核心认购申请信息。

---

## 🔄 表结构变更

### 移除的字段

以下字段已从表结构中移除：

| 字段名 | 说明 | 移除原因 |
|--------|------|----------|
| `purchase_amount` | 认购金额（澳元） | 使用token_amount代替 |
| `token_price` | 代币单价 | 不需要单独存储 |
| `total_value` | 总价值 | 可通过计算得出 |
| `transaction_hash` | 交易哈希 | 简化区块链信息 |
| `block_number` | 区块号 | 简化区块链信息 |
| `network_id` | 网络ID | 简化区块链信息 |
| `gas_used` | 使用的Gas | 简化区块链信息 |
| `gas_price` | Gas价格 | 简化区块链信息 |

### 保留的字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | INT | 主键，自增 |
| `user_id` | INT | 用户ID（关联user表） |
| `user_wallet_address` | VARCHAR(42) | 用户钱包地址 |
| `project_code` | VARCHAR(50) | 项目代码 |
| `project_name` | VARCHAR(200) | 项目名称 |
| `trade_type` | ENUM | 交易类型 |
| `token_amount` | DECIMAL(20,8) | 代币数量 ⭐ |
| `token_address_native` | VARCHAR(42) | 原生代币地址 |
| `token_address_interest` | VARCHAR(42) | 利息代币地址 |
| `loan_issuer_address` | VARCHAR(42) | 贷款发行人地址 |
| `status` | ENUM | 申请状态 |
| `approval_notes` | TEXT | 审批备注 |
| `approved_by` | INT | 审批人ID |
| `approved_at` | DATETIME | 审批时间 |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

---

## 📝 更新的文件

### 1. 数据库脚本

#### ✅ `Mysql/database/update_subscriptions_table.sql` (新文件)
- 删除旧表并创建新表结构
- 根据project表插入示例数据
- 使用简化的字段结构

#### ✅ `Mysql/database/init_database.sql`
- 更新subscriptions表定义
- 移除不需要的字段
- 更新索引配置

### 2. 后端API

#### ✅ `Mysql/src/routers/route_handler/subscriptionRouter_Handler.js`

**修改内容**:

1. **getSubscriptions()** - 获取认购申请列表
   - 移除 `purchase_amount`, `token_price`, `total_value`, `transaction_hash`, `block_number`, `network_id`, `gas_used`, `gas_price` 字段
   - 更新排序字段从 `purchase_amount` 改为 `token_amount`

2. **createSubscription()** - 创建认购申请
   - 简化必填字段验证：`user_wallet_address`, `project_code`, `token_amount`
   - 移除价格和区块链相关字段

3. **getSubscriptionStats()** - 获取统计信息
   - 将所有 `purchase_amount` 改为 `token_amount`
   - 统计总代币数而非总金额

4. **exportSubscriptionsToCSV()** - 导出CSV
   - 更新CSV表头和数据列
   - 移除价格和区块链字段

### 3. 前端页面

#### ✅ `Website/src/views/admin/AdminDashboard.vue`

**修改内容**:
- 统计卡片：将"总认购金额"改为"总认购代币数"
- 表格显示：将"认购金额"改为"代币数量"
- 计算逻辑：使用 `token_amount` 代替 `purchase_amount`
- 模拟数据：更新字段名

#### ✅ `Website/src/views/admin/AdminSubscriptions.vue`

**修改内容**:
- 表头：将"认购金额"改为"代币数量"
- 排序字段：从 `purchase_amount` 改为 `token_amount`
- 详情弹窗：显示代币地址而非交易哈希
- 模拟数据：更新字段结构

#### ✅ `Website/src/views/core/TradeProjectView.vue`

**修改内容**:
- 提交数据：移除 `purchase_amount`, `token_price`, `total_value`, `transaction_hash`, `block_number`, `network_id`, `gas_used`, `gas_price`
- 保留 `token_amount` 和代币地址字段

---

## 🗄️ 新表结构

```sql
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '认购申请ID',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID，关联user表',
  `user_wallet_address` varchar(42) NOT NULL COMMENT '用户钱包地址',
  `project_code` varchar(50) NOT NULL COMMENT '项目代码，如RWA001、YYD等',
  `project_name` varchar(200) DEFAULT NULL COMMENT '项目名称',
  `trade_type` enum('BUY_TOKEN','SELL_INTEREST') NOT NULL DEFAULT 'BUY_TOKEN' COMMENT '交易类型：认购代币或赎回利息',
  `token_amount` decimal(20,8) DEFAULT NULL COMMENT '代币数量',
  
  -- 项目相关地址
  `token_address_native` varchar(42) DEFAULT NULL COMMENT '原生代币合约地址',
  `token_address_interest` varchar(42) DEFAULT NULL COMMENT '利息代币合约地址',
  `loan_issuer_address` varchar(42) DEFAULT NULL COMMENT '贷款发行人钱包地址',
  
  -- 状态管理
  `status` enum('pending','approved','rejected','completed','cancelled') NOT NULL DEFAULT 'pending' COMMENT '申请状态',
  `approval_notes` text DEFAULT NULL COMMENT '审批备注',
  `approved_by` int(11) DEFAULT NULL COMMENT '审批人用户ID',
  `approved_at` datetime DEFAULT NULL COMMENT '审批时间',
  
  -- 时间戳
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='认购申请表';
```

---

## 🚀 如何应用更新

### 方法1: 使用更新脚本（推荐）

```bash
# 执行更新脚本（会删除旧表并创建新表）
mysql -u root -p rwa_dealmaker < Mysql/database/update_subscriptions_table.sql
```

⚠️ **警告**: 此方法会删除现有的认购申请数据！

### 方法2: 手动迁移数据

如果需要保留现有数据：

```sql
-- 1. 备份现有数据
CREATE TABLE subscriptions_backup AS SELECT * FROM subscriptions;

-- 2. 创建新表
CREATE TABLE subscriptions_new (
  -- 使用新的表结构
  ...
);

-- 3. 迁移数据
INSERT INTO subscriptions_new (
  id, user_id, user_wallet_address, project_code, project_name, 
  trade_type, token_amount, token_address_native, token_address_interest, 
  loan_issuer_address, status, approval_notes, approved_by, approved_at, 
  created_at, updated_at
)
SELECT 
  id, user_id, user_wallet_address, project_code, project_name,
  trade_type, token_amount, token_address_native, token_address_interest,
  loan_issuer_address, status, approval_notes, approved_by, approved_at,
  created_at, updated_at
FROM subscriptions;

-- 4. 删除旧表并重命名新表
DROP TABLE subscriptions;
RENAME TABLE subscriptions_new TO subscriptions;
```

### 方法3: 使用ALTER TABLE（如果表已有数据）

```sql
-- 删除不需要的列
ALTER TABLE subscriptions DROP COLUMN purchase_amount;
ALTER TABLE subscriptions DROP COLUMN token_price;
ALTER TABLE subscriptions DROP COLUMN total_value;
ALTER TABLE subscriptions DROP COLUMN transaction_hash;
ALTER TABLE subscriptions DROP COLUMN block_number;
ALTER TABLE subscriptions DROP COLUMN network_id;
ALTER TABLE subscriptions DROP COLUMN gas_used;
ALTER TABLE subscriptions DROP COLUMN gas_price;

-- 删除外键约束（如果存在）
ALTER TABLE subscriptions DROP FOREIGN KEY subscriptions_ibfk_1;
ALTER TABLE subscriptions DROP FOREIGN KEY subscriptions_ibfk_2;

-- 删除不需要的索引
ALTER TABLE subscriptions DROP INDEX idx_transaction_hash;
```

---

## 🔌 API变更

### 创建认购申请 API

**旧格式**:
```json
{
  "user_wallet_address": "0x...",
  "project_code": "RWAT0001",
  "purchase_amount": 5000.00,
  "token_amount": 5000.00,
  "token_price": 1.00,
  "total_value": 5000.00,
  "transaction_hash": "0x...",
  "block_number": 18500000,
  "network_id": 1,
  "gas_used": 21000,
  "gas_price": "20000000000"
}
```

**新格式** ⭐:
```json
{
  "user_wallet_address": "0x...",
  "project_code": "RWAT0001",
  "token_amount": 5000.00,
  "token_address_native": "0x...",
  "token_address_interest": "0x...",
  "loan_issuer_address": "0x..."
}
```

### 响应数据格式

**旧格式**:
```json
{
  "id": 1,
  "project_code": "RWAT0001",
  "purchase_amount": 5000.00,
  "token_amount": 5000.00,
  "transaction_hash": "0x...",
  "block_number": 18500000
}
```

**新格式** ⭐:
```json
{
  "id": 1,
  "project_code": "RWAT0001",
  "token_amount": 5000.00,
  "token_address_native": "0x...",
  "token_address_interest": "0x...",
  "loan_issuer_address": "0x..."
}
```

---

## 🎯 前端显示变更

### AdminDashboard.vue

**变更前**:
- 显示: "总认购金额: AUD125,000"
- 表头: "认购金额"
- 数据: "AUD5000"

**变更后** ⭐:
- 显示: "总认购代币数: 125,000"
- 表头: "代币数量"
- 数据: "5000 Tokens"

### AdminSubscriptions.vue

**变更前**:
- 表头: "认购金额"
- 排序字段: `purchase_amount`
- 详情显示: 交易哈希、区块号

**变更后** ⭐:
- 表头: "代币数量"
- 排序字段: `token_amount`
- 详情显示: 原生代币地址、利息代币地址、贷款发行人地址

---

## 📊 数据迁移示例

### 从project表生成认购申请数据

```sql
-- 使用 insert_subscriptions_from_projects.sql
-- 此脚本会自动从project表读取项目信息并生成认购申请

mysql -u root -p rwa_dealmaker < Mysql/database/insert_subscriptions_from_projects.sql
```

### 验证数据

```sql
-- 查看所有认购申请
SELECT * FROM subscriptions;

-- 查看认购申请及关联的项目信息
SELECT 
  s.id,
  s.project_code,
  s.project_name,
  s.token_amount,
  s.token_address_native,
  s.status,
  p.interest_rate,
  p.maturity_period
FROM subscriptions s
LEFT JOIN projects p ON s.project_code = p.project_code;

-- 统计各状态的认购数量
SELECT 
  status,
  COUNT(*) as count,
  SUM(token_amount) as total_tokens
FROM subscriptions
GROUP BY status;
```

---

## ✅ 更新清单

- [x] 更新数据库表结构
- [x] 创建更新SQL脚本
- [x] 更新后端API处理代码
- [x] 更新前端管理员控制台
- [x] 更新前端认购管理页面
- [x] 更新前端交易提交页面
- [x] 更新CSV导出功能
- [x] 更新统计计算逻辑
- [x] 更新模拟数据生成
- [x] 验证无linting错误

---

## 🔧 配置说明

### 数据库连接

**后端配置** (`Mysql/src/database/dbConfig.js`):
```javascript
module.exports = {
  mysql: {
    host: 'localhost',           // 本地数据库
    user: 'root',
    password: 'your_password',
    database: 'rwa_dealmaker',
    port: 3306                   // MySQL端口
  }
}
```

### API连接

**前端配置** (已更新为localhost):
```javascript
const apiUrl = 'http://localhost:3000'  // 后端API端口
```

**已更新的文件**:
1. `Website/src/views/admin/AdminDashboard.vue` - 第161行
2. `Website/src/views/admin/AdminSubscriptions.vue` - 第358行, 472行
3. `Website/src/views/core/TradeProjectView.vue` - 第1119行

---

## 🧪 测试步骤

### 1. 更新数据库

```bash
# 执行更新脚本
mysql -u root -p rwa_dealmaker < Mysql/database/update_subscriptions_table.sql

# 验证表结构
mysql -u root -p rwa_dealmaker -e "DESCRIBE subscriptions;"
```

### 2. 启动后端服务

```bash
cd Mysql
node index.js
```

✅ 应该看到: `服务器3000端口已启动成功`

### 3. 启动前端服务

```bash
cd Website
npm run dev
```

✅ 应该看到: `Local: http://localhost:5173/`

### 4. 测试管理员功能

1. 访问: `http://localhost:5173/login`
2. 登录管理员账户:
   - 邮箱: `han@rwadealmaker.com`
   - 密码: `rwadealmarker123`
3. 验证跳转到: `http://localhost:5173/admin`
4. 查看统计数据（应显示"总认购代币数"）
5. 访问认购管理页面: `http://localhost:5173/admin/subscriptions`
6. 验证表头显示"代币数量"
7. 测试批准/拒绝功能

### 5. 测试用户认购

1. 以普通用户登录
2. 访问项目页面并点击"Trade"
3. 填写认购表单
4. 提交认购申请
5. 切换到管理员账户
6. 在认购管理页面查看新提交的申请

---

## 📊 数据示例

### 认购申请记录示例

```json
{
  "id": 1,
  "user_id": 5,
  "user_wallet_address": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
  "project_code": "RWAT0001",
  "project_name": "St Ives NSW Residential Project",
  "trade_type": "BUY_TOKEN",
  "token_amount": 5000.00000000,
  "token_address_native": "0x1234567890123456789012345678901234567890",
  "token_address_interest": "0x0987654321098765432109876543210987654321",
  "loan_issuer_address": "0x1111111111111111111111111111111111111111",
  "status": "pending",
  "approval_notes": null,
  "approved_by": null,
  "approved_at": null,
  "created_at": "2025-10-10 10:30:00",
  "updated_at": "2025-10-10 10:30:00"
}
```

---

## 🔍 常见问题

### Q1: 为什么移除了purchase_amount字段？
**A**: 使用 `token_amount` 更准确地表示认购的代币数量，价格信息可以从项目表中获取。

### Q2: 如何计算认购金额？
**A**: 认购金额 = `token_amount` × 项目单价（从项目表获取）

### Q3: 为什么移除了区块链相关字段？
**A**: 简化表结构，区块链交易信息可以在实际上链时再记录到单独的交易表。

### Q4: 旧数据会丢失吗？
**A**: 如果使用 `update_subscriptions_table.sql`，旧数据会被清除。建议先备份。

### Q5: 如何恢复旧表结构？
**A**: 使用备份的 `subscription_table.sql` 重新创建。

---

## 🎯 优势

### 简化后的优势

1. **更清晰的数据模型**: 专注于认购申请核心信息
2. **减少冗余**: 移除可计算的字段
3. **更好的性能**: 减少字段数量，提高查询速度
4. **易于维护**: 简化的结构更容易理解和维护
5. **灵活性**: 代币地址信息更适合多链环境

---

## 📚 相关文档

- `update_subscriptions_table.sql` - 表结构更新脚本
- `init_database.sql` - 数据库初始化脚本
- `insert_subscriptions_from_projects.sql` - 数据生成脚本
- `API_URL_CONFIGURATION.md` - API地址配置说明

---

**更新日期**: 2025-10-10  
**版本**: 2.0.0  
**状态**: ✅ 完成
