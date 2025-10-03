# RWA项目数据库配置说明

## 数据库初始化

1. 确保MySQL服务正在运行
2. 创建数据库配置文件 `.env`（复制以下内容）：

```env
# 数据库配置
db_host=localhost
db_user=root
db_password=123456
db_name=rwa
db_port=3306
db_connection_limit=10
db_wait_for_connections=true
db_idleTimeout=30000

# JWT密钥（如果需要）
jwt_SecretKey=your-secret-key-here

# 服务器配置
PORT=3000
```

3. 运行数据库初始化脚本：
```bash
mysql -u root -p123456 < init_database.sql
```

4. 启动服务器：
```bash
node index.js
```

或者使用批处理文件（Windows）：
```bash
start_with_init.bat
```

## 数据库表结构

### product_details 表
包含所有产品项目的详细信息，包括：
- 基础信息：代码、名称、类型、地区、风险等级等
- 投资信息：认购额度、代币数量等
- 关键事实：贷款金额、利率、期限等
- 相关主体：发币方、贷款方、借款方等
- 抵押物信息：房产地址、评估价值等
- 违约处理：违约利率、触发条件等

## API接口

- `GET /api/product_details` - 获取所有产品列表
- `GET /api/product_details/:code` - 根据代码获取产品详情
- `PUT /api/product_details/:code/subscription` - 更新产品订阅信息

## 前端同步机制

- 页面加载时自动从数据库获取数据
- 每30秒自动刷新数据
- 提供手动刷新按钮
- 显示最后更新时间
