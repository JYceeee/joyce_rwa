# ProjectsView 字段映射分析（保留

## 数据库表字段 → 前端显示字段映射

### 1. 基础信息映射
| 数据库字段 | 前端字段 | 显示用途 | 状态 |
|-----------|---------|---------|------|
| `id` | `id` | 项目ID | ✅ 正确 |
| `project_code` | `code` | 项目代码 | ✅ 正确 |
| `project_name` | `name` | 项目名称 | ✅ 正确 |
| `loan_status` | `status` | 项目状态 | ✅ 正确 |

### 2. 认购信息映射
| 数据库字段 | 前端字段 | 显示用途 | 状态 |
|-----------|---------|---------|------|
| `total_offering_token` | `totalOffering` | 总认购额 (格式: A$xxx,xxx) | ✅ 正确 |
| `subscribe_token` | `subscribed` | 已认购额 (格式: A$xxx,xxx) | ✅ 正确 |

### 3. 物业信息映射
| 数据库字段 | 前端字段 | 显示用途 | 状态 |
|-----------|---------|---------|------|
| `property_location` | `property_location` | 物业位置 | ✅ 正确 |
| `property_state` | `property_state` | 物业州 | ✅ 正确 |
| `property_type` | `property_type` | 物业类型 | ✅ 正确 |
| `property_value` | `property_value` | 物业价值 | ✅ 正确 |
| `property_summary` | `property_summary` | 物业描述 | ✅ 正确 |

### 4. 贷款信息映射
| 数据库字段 | 前端字段 | 显示用途 | 状态 |
|-----------|---------|---------|------|
| `loan_type` | `loan_type` | 贷款类型 | ✅ 正确 |
| `loan_product` | `loan_product` | 贷款产品 | ✅ 正确 |
| `loan_amount` | `loanAmount` | 贷款金额 (格式: A$xxx,xxx) | ✅ 正确 |
| `loan_purpose` | `loan_purpose` | 贷款用途 | ✅ 正确 |
| `loan_term_months` | `loanTerm` | 贷款期限 (格式: xx months) | ✅ 正确 |

### 5. 贷款比率映射
| 数据库字段 | 前端字段 | 显示用途 | 状态 |
|-----------|---------|---------|------|
| `lvr` | `lvr` | 贷款价值比 | ✅ 正确 |
| `interest_rate` | `interest_rate` | 利率 (原始值) | ✅ 正确 |
| `interest_rate` | `targetYield` | 目标收益率 (原始值) | ✅ 正确 |
| **`interest_rate`** | **`metrics.targetLoanYield`** | **EST. YIELD (IRR) (格式: xx% p.a.)** | ✅ **正确映射** |
| `default_rate` | `default_rate` | 违约利率 | ✅ 正确 |

### 6. 贷款周期映射
| 数据库字段 | 前端字段 | 显示用途 | 状态 |
|-----------|---------|---------|------|
| `commencement_date` | `commencement_date` | 开始日期 | ✅ 正确 |
| `expiry_date` | `expiry_date` | 到期日期 | ✅ 正确 |
| `expected_recovery_date` | `expected_recovery_date` | 预计回款日期 | ✅ 正确 |

### 7. 计算字段映射
| 计算字段 | 前端字段 | 显示用途 | 状态 |
|---------|---------|---------|------|
| `${loan_product} - ${property_type}` | `subtitle` | 项目副标题 | ✅ 正确 |
| `calculateTokenPrice()` | `metrics.currentElaraPrice` | 当前代币价格 | ✅ 正确 |
| `A$${property_value}` | `metrics.collateralPropertyValue` | 抵押物业价值 | ✅ 正确 |
| `calculateRentalIncome()` | `metrics.rentalIncome` | 租金收入 | ✅ 正确 |
| **`${interest_rate}% p.a.`** | **`metrics.targetLoanYield`** | **EST. YIELD (IRR)** | ✅ **正确映射** |

## 模板中的字段使用

### 项目卡片显示字段
```vue
<!-- 项目头部 -->
{{ p.code }} • {{ p.name }}  <!-- 使用 code, name -->
{{ p.subtitle }}             <!-- 使用 subtitle -->

<!-- 项目指标 -->
{{ p.loanAmount }}           <!-- 使用 loanAmount -->
{{ p.metrics.targetLoanYield }} <!-- 使用 metrics.targetLoanYield ✅ -->
{{ p.loanTerm }} months      <!-- 使用 loanTerm -->

<!-- 投资进度 -->
A${{ formatNumber(p.subscribed || 0) }}     <!-- 使用 subscribed -->
A${{ formatNumber(p.totalOffering || 0) }}  <!-- 使用 totalOffering -->
{{ getSubscriptionProgress(p) }}%           <!-- 计算进度 -->
```

## 问题分析

### ✅ EST. YIELD (IRR) 映射正确
- 数据库字段：`interest_rate` (DECIMAL(5,2))
- 前端显示：`p.metrics.targetLoanYield` 
- 映射代码：`targetLoanYield: \`${project.interest_rate}% p.a.\``
- 状态：**映射正确，无需修改**

### 🔍 可能的问题原因
1. **数据加载问题**：API返回的数据可能为空或格式不正确
2. **CSS显示问题**：项目卡片可能被CSS隐藏
3. **JavaScript错误**：可能有JavaScript错误阻止渲染
4. **过滤条件**：filteredProducts可能为空

## 建议检查步骤
1. 检查浏览器控制台是否有JavaScript错误
2. 检查`this.products`数组是否有数据
3. 检查`this.filteredProducts`计算属性是否返回数据
4. 检查CSS样式是否隐藏了项目列表
