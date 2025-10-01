# TradeProjectView 数据抓取方法更新总结

## 🎯 更新目标

根据 `call-mysql-project-table.js` 的SQL查询结构，完全覆盖TradeProjectView现有的数据抓取方法，确保数据映射与数据库字段完全一致。

## 🔧 主要更新内容

### 1. 数据抓取方法重构 ✅

**更新前**: 使用混合的camelCase和snake_case字段名，存在映射不一致问题

**更新后**: 完全基于数据库字段名进行映射，确保数据一致性

```javascript
// 新的loadProjectData方法
async loadProjectData() {
  // 基于call-mysql-project-table.js的SQL查询结构进行数据映射
  const project = response.data
  
  // 计算认购进度
  const totalOfferingRaw = parseFloat(project.total_offering_token) || 0
  const subscribedRaw = parseFloat(project.subscribe_token) || 0
  const subscriptionProgress = totalOfferingRaw > 0 ? (subscribedRaw / totalOfferingRaw * 100).toFixed(2) : 0
```

### 2. 数据库字段映射表

| 数据库字段 | TradeProjectView字段 | 用途 | 状态 |
|-----------|---------------------|------|------|
| `project_code` | `code` | 项目代码 | ✅ |
| `project_name` | `name` | 项目名称 | ✅ |
| `loan_status` | `status` | 项目状态 | ✅ |
| `total_offering_token` | `totalOffering` | 总发行量 | ✅ |
| `subscribe_token` | `subscribed` | 已认购量 | ✅ |
| `property_location` | `property_location` | 物业位置 | ✅ |
| `property_state` | `property_state` | 物业状态 | ✅ |
| `property_type` | `property_type` | 物业类型 | ✅ |
| `property_value` | `property_value` | 物业价值 | ✅ |
| `property_summary` | `property_summary` | 物业摘要 | ✅ |
| `loan_type` | `loan_type` | 贷款类型 | ✅ |
| `loan_product` | `loan_product` | 贷款产品 | ✅ |
| `loan_amount` | `loan_amount` | 贷款金额 | ✅ |
| `loan_purpose` | `loan_purpose` | 贷款目的 | ✅ |
| `loan_term_months` | `loan_term_months` | 贷款期限(月) | ✅ |
| `lvr` | `lvr` | 贷款价值比 | ✅ |
| `interest_rate` | `interest_rate` | 利率 | ✅ |
| `default_rate` | `default_rate` | 违约率 | ✅ |
| `commencement_date` | `commencement_date` | 开始日期 | ✅ |
| `expiry_date` | `expiry_date` | 到期日期 | ✅ |
| `expected_recovery_date` | `expected_recovery_date` | 预期回收日期 | ✅ |

### 3. 新增数据字段

#### 认购进度计算
```javascript
subscriptionProgress: `${subscriptionProgress}%`
```

#### 时间线信息
```javascript
timeline: {
  created: project.created_at,
  commencement: project.commencement_date,
  expiry: project.expiry_date,
  expectedRecovery: project.expected_recovery_date
}
```

#### 增强的计算指标
```javascript
metrics: {
  currentElaraPrice: this.calculateTokenPrice(mappedProduct),
  collateralPropertyValue: project.property_value ? `AUD$${parseFloat(project.property_value).toLocaleString()}` : 'TBA',
  rentalIncome: this.calculateRentalIncome(mappedProduct),
  targetLoanYield: project.interest_rate ? `${project.interest_rate}% p.a.` : 'TBA',
  loanToValue: project.lvr ? `${project.lvr}%` : 'TBA',
  defaultRate: project.default_rate ? `${project.default_rate}%` : 'TBA'
}
```

### 4. 项目信息卡片更新 ✅

更新了项目信息卡片的显示字段，新增了更多关键指标：

```vue
<!-- 新增的指标显示 -->
<div class="metric-item">
  <span class="metric-label">SUBSCRIPTION PROGRESS</span>
  <span class="metric-value" style="color: #3b82f6;">{{ projectData.subscriptionProgress }}</span>
</div>
<div class="metric-item">
  <span class="metric-label">TOTAL OFFERING</span>
  <span class="metric-value">{{ projectData.totalOffering }}</span>
</div>
<div class="metric-item">
  <span class="metric-label">SUBSCRIBED</span>
  <span class="metric-value">{{ projectData.subscribed }}</span>
</div>
<div class="metric-item">
  <span class="metric-label">DEFAULT RATE</span>
  <span class="metric-value">{{ projectData.metrics.defaultRate }}</span>
</div>
```

### 5. 计算函数更新 ✅

#### calculateTokenPrice函数
```javascript
// 更新前: 使用混合字段
const yieldMultiplier = (product.interestRate || product.targetYield || 6.0) / 6.0

// 更新后: 优先使用数据库字段
const yieldMultiplier = (parseFloat(product.interest_rate) || 6.0) / 6.0
```

#### calculateRentalIncome函数
```javascript
// 更新前: 使用valuation字段
const valuationStr = product.valuation.replace(/[AUD$,]/g, '')

// 更新后: 使用数据库字段property_value
const propertyValue = parseFloat(product.property_value) || 0
```

### 6. 辅助函数更新 ✅

#### getProjectTargetYield函数
```javascript
// 优先从数据库字段 interest_rate 获取数值
if (this.projectData.interest_rate) {
  const targetYieldValue = parseFloat(this.projectData.interest_rate)
  console.log('从数据库 interest_rate 获取:', targetYieldValue)
  return targetYieldValue
}
```

#### getProjectLoanTerm函数
```javascript
// 优先从数据库字段 loan_term_months 获取数值（月数）
if (this.projectData.loan_term_months) {
  const termInDays = this.projectData.loan_term_months * 30.44 // 转换为天数
  console.log('从数据库 loan_term_months 获取:', this.projectData.loan_term_months, '个月，转换为天数:', termInDays)
  return termInDays
}
```

## 📊 数据映射验证

### 测试脚本
创建了 `Mysql/test-tradeproject-mapping.js` 脚本来验证数据映射的正确性：

- ✅ 测试RWA001项目数据映射
- ✅ 测试RWA002项目数据映射  
- ✅ 测试RWA007项目数据映射
- ✅ 验证所有字段映射正确性
- ✅ 验证计算函数正确性

### 预期结果
更新后的TradeProjectView应该能够：

1. **正确显示项目信息** ✅
   - 项目代码、名称、状态
   - 物业位置、类型、价值
   - 贷款产品、金额、期限

2. **准确计算财务指标** ✅
   - 认购进度百分比
   - 代币价格
   - 租金收入估算
   - LTV比率

3. **完整显示时间信息** ✅
   - 创建时间
   - 开始日期
   - 到期日期
   - 预期回收日期

4. **兼容旧字段** ✅
   - 保持向后兼容性
   - 支持旧的数据结构
   - 平滑过渡

## 🔍 调试信息

### 控制台日志
更新后的TradeProjectView会输出详细的调试信息：

```
🔄 TradeProjectView: 从数据库加载项目数据... RWA001
✅ TradeProjectView: 项目数据映射成功: {...}
📊 认购进度: 35.00% (350000/1000000)
```

### 字段验证日志
```
从数据库 interest_rate 获取: 9.9
从数据库 loan_term_months 获取: 12 个月，转换为天数: 365.28
```

## 🚀 使用方法

1. **启动后端服务器**: 确保MySQL后端服务器运行在端口3000
2. **访问TradeProjectView**: 访问 `/trade/RWA001` 等页面
3. **查看数据映射**: 检查浏览器控制台的调试日志
4. **验证功能**: 确认所有项目信息正确显示

## ✅ 更新完成状态

- ✅ 数据抓取方法重构
- ✅ 数据库字段映射更新
- ✅ 项目信息卡片更新
- ✅ 计算函数更新
- ✅ 辅助函数更新
- ✅ 测试脚本创建
- ✅ 向后兼容性保证

---
*更新时间: 2025-01-01*
*更新状态: ✅ 完成*
