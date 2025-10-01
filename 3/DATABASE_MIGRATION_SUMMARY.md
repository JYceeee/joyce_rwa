# 数据库迁移总结

## 概述
成功将项目从使用 `product_details` 表迁移到新的 `project` 表，并更新了所有相关的后端API和前端代码。

## 已完成的更改

### 1. 数据库表结构更新 ✅

#### 旧表：product_details
- 使用复杂的字段结构
- 包含大量冗余信息
- 字段命名不规范

#### 新表：project
```sql
CREATE TABLE project (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(50) NOT NULL,
    loan_status VARCHAR(50) DEFAULT 'INCOMING',
    subscribe_token DECIMAL(15, 2),
    total_offering_token DECIMAL(15, 2),
    
    -- 抵押资产物业信息
    property_location VARCHAR(255) NOT NULL,
    property_state VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    property_value DECIMAL(15, 2),
    property_summary VARCHAR(255) NOT NULL,
    
    -- 贷款基本信息
    loan_type VARCHAR(50) NOT NULL,
    loan_product VARCHAR(100) NOT NULL,
    loan_amount DECIMAL(15, 2) NOT NULL,
    loan_purpose VARCHAR(255) NOT NULL,
    
    -- 贷款条款
    loan_term_months INT NOT NULL,
    
    -- 贷款比率
    lvr DECIMAL(5, 2) NOT NULL,
    interest_rate DECIMAL(5, 2),
    default_rate DECIMAL(5, 2),
    
    -- 贷款周期
    commencement_date DATE,
    expiry_date DATE,
    expected_recovery_date DATE,
    
    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);
```

### 2. 后端API更新 ✅

#### 更新的文件：
- `Mysql/src/routers/route_handler/projectRouter_Handler.js`

#### 主要更改：
1. **getAllProjects()** - 从 `product_details` 改为 `project` 表
2. **getProjectById()** - 使用 `project_code` 作为查询条件
3. **getProjectByProjectId()** - 更新字段映射
4. **createProject()** - 匹配新的表结构

#### 字段映射：
```javascript
// 数据库字段 -> 前端字段
project_code -> code
project_name -> name
loan_status -> status
subscribe_token -> currentSubscribedToken
total_offering_token -> totalToken
property_location -> propertyLocation
property_state -> propertyState
property_type -> propertyType
property_value -> propertyValue
property_summary -> propertySummary
loan_type -> loanType
loan_product -> loanProduct
loan_amount -> loanAmount
loan_purpose -> loanPurpose
loan_term_months -> loanTermMonths
lvr -> lvr
interest_rate -> interestRate
default_rate -> defaultRate
commencement_date -> commencementDate
expiry_date -> expiryDate
expected_recovery_date -> expectedRecoveryDate
```

### 3. 前端API服务更新 ✅

#### 更新的文件：
- `Website/src/service/api.ts`

#### 主要更改：
1. **productAPI** 重命名为 **projectAPI**
2. **getAllProducts()** -> **getAllProjects()**
3. **getProductByCode()** -> **getProjectByCode()**
4. **searchProducts()** -> **searchProjects()**
5. **getProductsByType()** -> **getProjectsByType()**
6. **getProductsByRisk()** -> **getProjectsByStatus()**
7. **updateProductSubscription()** -> **updateProjectSubscription()**

#### 向后兼容性：
- 保留了 `productAPI` 作为 `projectAPI` 的别名
- 确保现有前端代码不会中断

### 4. 数据库初始化脚本更新 ✅

#### 更新的文件：
- `Mysql/init_database.sql`

#### 主要更改：
1. 替换 `product_details` 表为 `project` 表
2. 更新插入语句以匹配新表结构
3. 添加了10个示例项目数据

#### 示例数据包括：
- RWA001: St Ives NSW Residential Project (ACTIVE)
- RWA002: SQNB Property Loan (INCOMING)
- RWA003: LZYT Property Loan (INCOMING)
- RWA004: YYD Property Loan (INCOMING)
- RWA005: Bondi Beach Hotel Refinance (ACTIVE)
- RWA006: Parramatta Mixed-Use Development (PERFORMING)
- RWA007: Manly Retail Strip Loan (ACTIVE)
- RWA008: Chatswood Office Expansion (INCOMING)
- RWA009: Central Coast Industrial Estate (INCOMING)
- RWA010: Penrith Student Housing Project (INCOMING)

## API端点映射

### 后端路由
```
GET /projects - 获取所有项目
GET /projects/:projectId - 根据项目代码获取项目详情
GET /project/:id - 根据项目代码获取项目详情（前端路由）
POST /projects - 创建新项目
```

### 前端API调用
```javascript
// 获取所有项目
const response = await projectAPI.getAllProjects()

// 根据代码获取项目
const project = await projectAPI.getProjectByCode('RWA001')

// 搜索项目
const results = await projectAPI.searchProjects('Sydney')

// 根据类型过滤
const filtered = await projectAPI.getProjectsByType('Commercial Building')

// 根据状态过滤
const active = await projectAPI.getProjectsByStatus('ACTIVE')

// 更新订阅信息
const update = await projectAPI.updateProjectSubscription('RWA001', { subscribe_token: 500000 })
```

## 字段对应关系

### 项目状态映射
- `INCOMING` - 即将开始的项目
- `ACTIVE` - 活跃项目（可认购）
- `PERFORMING` - 执行中的项目
- `DEFAULT` - 违约项目

### 物业类型映射
- `Single House` - 独栋房屋
- `Commercial Building` - 商业建筑
- `Unit Development` - 单元开发
- `Residential Land` - 住宅用地
- `Mixed Use` - 混合用途
- `Retail` - 零售
- `Office` - 办公室
- `Industrial` - 工业
- `Student Accommodation` - 学生住宿

### 贷款类型映射
- `1st Mortgage` - 第一抵押贷款
- `2nd Mortgage` - 第二抵押贷款

## 测试验证

### 后端测试
- ✅ 数据库表创建成功
- ✅ 示例数据插入成功
- ✅ API端点响应正常
- ✅ 字段映射正确

### 前端测试
- ✅ API服务更新完成
- ✅ 向后兼容性保持
- ✅ 字段名称映射正确

## 部署说明

### 1. 数据库迁移
```sql
-- 执行初始化脚本
source Mysql/init_database.sql
```

### 2. 后端部署
```bash
cd Mysql
npm install
npm start
```

### 3. 前端部署
```bash
cd Website
npm install
npm run build
```

## 注意事项

1. **向后兼容性**：保留了 `productAPI` 别名，确保现有代码不会中断
2. **字段验证**：新表结构包含必填字段验证
3. **数据类型**：使用 DECIMAL 类型存储金额，确保精度
4. **索引优化**：添加了常用查询字段的索引
5. **审计字段**：包含创建和更新信息，便于追踪

## 后续工作建议

1. **数据迁移脚本**：为生产环境创建从旧表到新表的数据迁移脚本
2. **API文档更新**：更新API文档以反映新的字段结构
3. **前端组件更新**：逐步更新前端组件以使用新的字段名
4. **性能优化**：根据实际使用情况优化数据库查询
5. **监控告警**：添加API性能监控和错误告警

## 总结

本次迁移成功完成了：
- ✅ 数据库表结构优化
- ✅ 后端API完全更新
- ✅ 前端API服务更新
- ✅ 向后兼容性保持
- ✅ 测试验证通过

新的 `project` 表结构更加规范，字段命名更加清晰，数据类型更加合适，为后续的功能扩展奠定了良好的基础。
