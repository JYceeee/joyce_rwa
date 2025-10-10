-- RWA DealMaker 数据库初始化脚本
-- 创建数据库和表结构

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `rwa_dealmaker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `rwa_dealmaker`;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `user_name` varchar(50) NOT NULL COMMENT '用户名',
  `user_email` varchar(100) NOT NULL COMMENT '用户邮箱',
  `user_password` varchar(255) NOT NULL COMMENT '用户密码',
  `user_phone` varchar(20) DEFAULT NULL COMMENT '用户手机号',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建项目信息表
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  `project_code` varchar(50) NOT NULL COMMENT '项目代码',
  `project_name` varchar(200) NOT NULL COMMENT '项目名称',
  `description` text DEFAULT NULL COMMENT '项目描述',
  `status` enum('active','inactive','completed','cancelled') NOT NULL DEFAULT 'active' COMMENT '项目状态',
  `min_investment` decimal(20,2) DEFAULT NULL COMMENT '最小投资金额',
  `max_investment` decimal(20,2) DEFAULT NULL COMMENT '最大投资金额',
  `interest_rate` decimal(5,2) DEFAULT NULL COMMENT '年化利率',
  `maturity_period` int(11) DEFAULT NULL COMMENT '到期期限（天）',
  `token_address_native` varchar(42) DEFAULT NULL COMMENT '原生代币合约地址',
  `token_address_interest` varchar(42) DEFAULT NULL COMMENT '利息代币合约地址',
  `loan_issuer_address` varchar(42) DEFAULT NULL COMMENT '贷款发行人地址',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_project_code` (`project_code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目信息表';

-- 创建认购申请表
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
  
  -- 索引
  PRIMARY KEY (`id`),
  KEY `idx_user_wallet` (`user_wallet_address`),
  KEY `idx_project_code` (`project_code`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_trade_type` (`trade_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='认购申请表';

-- 创建交易记录表（保留原有的transaction表结构）
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '交易ID',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `user_address` varchar(42) NOT NULL COMMENT '用户钱包地址',
  `project_code` varchar(50) NOT NULL COMMENT '项目代码',
  `trade_type` enum('BUY_TOKEN','SELL_INTEREST') NOT NULL DEFAULT 'BUY_TOKEN' COMMENT '交易类型',
  `amount` decimal(20,8) NOT NULL COMMENT '交易数量',
  `price` decimal(10,4) NOT NULL COMMENT '交易价格',
  `total_value` decimal(20,2) NOT NULL COMMENT '交易总价值',
  `transaction_hash` varchar(66) DEFAULT NULL COMMENT '区块链交易哈希',
  `block_number` bigint(20) DEFAULT NULL COMMENT '区块号',
  `status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending' COMMENT '交易状态',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  PRIMARY KEY (`id`),
  KEY `idx_user_address` (`user_address`),
  KEY `idx_project_code` (`project_code`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='交易记录表';

-- 插入示例项目数据
INSERT INTO `projects` (`project_code`, `project_name`, `description`, `min_investment`, `max_investment`, `interest_rate`, `maturity_period`, `token_address_native`, `token_address_interest`, `loan_issuer_address`) VALUES
('RWA001', '悉尼CBD办公楼项目', '位于悉尼中央商务区的优质办公楼项目，具有稳定的租金收入', 1000.00, 100000.00, 8.50, 365, '0x1234567890123456789012345678901234567890', '0x0987654321098765432109876543210987654321', '0x1111111111111111111111111111111111111111'),
('RWA002', '墨尔本住宅开发项目', '墨尔本新兴住宅区的高端住宅开发项目', 5000.00, 500000.00, 9.20, 730, '0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'),
('YYD', '黄金投资组合', '多元化黄金投资组合，包含实物黄金和黄金ETF', 2000.00, 200000.00, 7.80, 180, '0x5555555555555555555555555555555555555555', '0x6666666666666666666666666666666666666666', '0x7777777777777777777777777777777777777777'),
('COMP', '复合投资产品', '包含多种资产类型的复合投资产品', 3000.00, 300000.00, 8.90, 545, '0x8888888888888888888888888888888888888888', '0x9999999999999999999999999999999999999999', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

-- 插入示例认购申请数据（注意：需要先有项目数据）
-- 如果项目表为空，请先执行项目数据插入
-- INSERT INTO `subscriptions` (
--   `user_wallet_address`, `project_code`, `project_name`, `trade_type`, `token_amount`,
--   `token_address_native`, `token_address_interest`, `loan_issuer_address`, `status`, `created_at`
-- ) VALUES
-- ('0x1234567890123456789012345678901234567890', 'RWAT0001', 'St Ives NSW Residential Project', 'BUY_TOKEN', 5000.00000000, '0x...', '0x...', '0x...', 'pending', NOW());

-- 创建管理员用户（密码需要加密）
-- 注意：这里需要手动设置密码，建议使用bcrypt加密
INSERT INTO `user` (`user_name`, `user_email`, `user_password`, `user_phone`) VALUES
('管理员', 'han@rwadealmaker.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '13800138000');

-- 显示创建结果
SELECT 'Database initialization completed successfully!' as message;
SELECT COUNT(*) as project_count FROM projects;
SELECT COUNT(*) as subscription_count FROM subscriptions;
SELECT COUNT(*) as user_count FROM user;
