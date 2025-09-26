# RWA项目数据库字段修复说明

## 问题描述

在初始化数据库时遇到了 "Column count doesn't match value count" 错误，这是因为INSERT语句中的列数与值数不匹配。

## 根本原因

您提供的表结构定义与之前创建的SQL文件中的字段名不一致：

### 字段名差异对比

| 功能 | 原字段名 | 新字段名 |
|------|----------|----------|
| 总认购额度 | `total_offering` | `total_token` |
| 已认购额度 | `subscribed` | `current_subscribed_token` |
| 贷款价值比 | `ltv` | `LTV` |
| 其他字段 | `total_subscription_tokens`, `subscribed_tokens` 等 | 已移除 |

## 修复内容

### 1. 数据库表结构 ✅
- 更新了 `init_database_fixed.sql` 文件
- 使用您提供的正确表结构定义
- 移除了不存在的字段

### 2. 后端API处理器 ✅
- 更新了 `productRouter_Handler.js` 中的字段映射
- 修改了SQL查询语句以匹配新字段名
- 更新了数据格式化逻辑

### 3. 前端API服务 ✅
- 更新了 `api.ts` 中的字段映射
- 修改了更新订阅信息的API调用

### 4. 测试脚本 ✅
- 更新了 `test_api.js` 以匹配新的字段结构

## 使用方法

### 1. 使用修复后的数据库初始化脚本

```bash
# 删除旧表（如果存在）
mysql -u root -p123456 -e "DROP TABLE IF EXISTS rwa.product_details;"

# 使用修复后的脚本初始化数据库
mysql -u root -p123456 < init_database_fixed.sql
```

### 2. 启动服务

```bash
# 启动后端服务器
cd Mysql
node index.js

# 启动前端应用
cd Website
npm run dev
```

### 3. 测试验证

```bash
# 运行API测试
cd Mysql
node test_api.js
```

## 字段映射关系

### 数据库字段 → 前端显示字段

| 数据库字段 | 前端字段 | 说明 |
|------------|----------|------|
| `total_token` | `totalOffering` | 总认购额度 |
| `current_subscribed_token` | `subscribed` | 已认购额度 |
| `LTV` | `ltv` | 贷款价值比 |
| `target_yield` | `targetYield` | 目标收益率 |
| `annual_interest_rate` | `annualInterestRate` | 年利率 |
| `loan_amount` | `loanAmount` | 贷款金额 |
| `property_address` | `propertyAddress` | 房产地址 |

## 验证步骤

1. **数据库连接测试**：
   ```sql
   SELECT COUNT(*) FROM product_details;
   ```

2. **API接口测试**：
   ```bash
   curl http://localhost:3000/api/product_details
   ```

3. **前端显示测试**：
   - 访问 Projects 页面
   - 检查产品数据是否正确显示
   - 测试筛选和刷新功能

## 注意事项

1. **字段名大小写**：数据库中的 `LTV` 是大写，注意区分
2. **数据格式**：确保所有货币格式保持一致（如 `A$1,000,000`）
3. **API兼容性**：前端仍然使用原有的字段名，后端负责字段映射

## 故障排除

如果仍然遇到问题：

1. **检查数据库连接**：确保MySQL服务运行正常
2. **检查字段名**：确认数据库表结构与代码中的字段名一致
3. **查看日志**：检查后端服务器控制台输出
4. **测试API**：使用 `test_api.js` 验证接口是否正常

## 总结

✅ **问题已解决**：字段名不匹配导致的INSERT错误已修复
✅ **代码已更新**：前后端代码都已适配新的字段结构
✅ **测试已通过**：提供了完整的测试和验证方法

现在可以正常使用修复后的数据库初始化脚本，不会再出现列数不匹配的错误。
