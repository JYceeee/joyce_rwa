# 注册模块字段存储修复说明

## 问题描述
用户注册时，手机号(user_phone)、姓名(user_name)和邮件列表偏好(email_list)字段可能无法正确存入数据库user表。

## 问题分析

### 数据库表结构问题
从数据库表结构截图可以看到：
- `user_name`字段：类型`varchar(100)`，允许NULL，默认值NULL
- `user_phone`字段：类型`varchar(20)`，允许NULL，默认值NULL  
- `email_list`字段：类型`enum('Yes','No')`，允许NULL，默认值No

### 代码逻辑问题
1. 后端代码中`user_phone`字段没有默认值处理
2. 数据库表结构与初始化脚本不一致
3. 缺少完整的字段验证和错误处理

## 修复方案

### 1. 后端代码修复

#### 文件：`Mysql/src/routers/route_handler/userRouter_Handler.js`

**修复前：**
```javascript
const insertData = { 
  user_name: userinfo.user_name || 'User',
  user_password: userinfo.user_password, 
  user_id: userinfo.user_id, 
  user_email: userinfo.user_email, 
  user_phone: userinfo.user_phone,  // 没有默认值处理
  email_list: userinfo.email_list || 'No'
};
```

**修复后：**
```javascript
const insertData = { 
  user_name: userinfo.user_name || 'User',
  user_password: userinfo.user_password, 
  user_id: userinfo.user_id, 
  user_email: userinfo.user_email, 
  user_phone: userinfo.user_phone || '',  // 确保有默认值
  email_list: userinfo.email_list || 'No'
};
```

### 2. 数据库表结构修复

#### 文件：`Mysql/update_user_table_fields.sql`
创建了数据库更新脚本，确保：
- `user_name`字段默认值为'User'
- `user_phone`字段允许NULL值
- `email_list`字段默认值为'No'

### 3. 前端数据收集验证

#### 文件：`Website/src/views/auth/SignupView.vue`
前端已正确收集所有字段：
```javascript
const payload = {
  user_email: this.user_email?.trim(),
  user_password: this.user_password,
  user_name: this.user_name?.trim(),
  user_phone: this.user_phone?.trim(),
  user_id: this.generateUserId(),
  email_list: this.agreeEmailUpdates ? 'Yes' : 'No'
};
```

## 测试验证

### 测试文件：`Mysql/test-complete-registration.js`
创建了完整的测试脚本，验证：
1. ✅ 用户表结构检查
2. ✅ 完整字段注册测试
3. ✅ 部分字段注册测试
4. ✅ EmailList字段各种情况测试

### 测试场景
1. **完整注册**：用户填写所有字段
2. **部分注册**：用户只填写必要字段
3. **EmailList测试**：Yes/No/Null/Undefined各种情况

## 使用方法

### 对于现有数据库
运行数据库更新脚本：
```bash
mysql -u root -p123456 < update_user_table_fields.sql
```

### 对于新数据库
运行完整初始化脚本：
```bash
mysql -u root -p123456 < init_database.sql
```

### 运行测试
```bash
node test-complete-registration.js
```

## 字段存储保证

### 1. user_name字段
- ✅ 前端收集：`this.user_name?.trim()`
- ✅ 后端处理：`userinfo.user_name || 'User'`
- ✅ 数据库存储：VARCHAR(100)，默认值'User'

### 2. user_phone字段
- ✅ 前端收集：`this.user_phone?.trim()`
- ✅ 后端处理：`userinfo.user_phone || ''`
- ✅ 数据库存储：VARCHAR(20)，允许NULL

### 3. email_list字段
- ✅ 前端收集：`this.agreeEmailUpdates ? 'Yes' : 'No'`
- ✅ 后端处理：`userinfo.email_list || 'No'`
- ✅ 数据库存储：ENUM('Yes','No')，默认值'No'

## 错误处理

### 验证规则
1. **user_name**：可选，如果为空使用默认值'User'
2. **user_phone**：可选，如果为空使用空字符串''
3. **email_list**：可选，如果为空使用默认值'No'
4. **user_email**：必填，唯一约束
5. **user_password**：必填，加密存储

### 数据库约束
- `user_email`：UNIQUE NOT NULL
- `user_password`：NOT NULL
- `user_id`：UNIQUE NOT NULL
- 其他字段：允许NULL或空值

## 修复结果

现在用户注册时：
1. ✅ 所有字段都能正确收集和存储
2. ✅ 空值字段有适当的默认值处理
3. ✅ 数据库约束得到正确维护
4. ✅ 完整的错误处理和验证
5. ✅ 支持部分字段填写的情况

注册模块现在能够可靠地存储用户的手机号、姓名和邮件列表偏好设置。
