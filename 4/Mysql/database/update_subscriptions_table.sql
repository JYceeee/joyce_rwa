-- 更新认购申请表结构
-- 移除不需要的字段，简化表结构

USE `rwa_dealmaker`;

-- 如果表已存在，先删除
DROP TABLE IF EXISTS `subscriptions`;

-- 创建新的认购申请表
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

-- 插入示例数据（根据项目表）
INSERT INTO `subscriptions` (
  `user_wallet_address`, 
  `project_code`, 
  `project_name`, 
  `trade_type`, 
  `token_amount`,
  `token_address_native`,
  `token_address_interest`,
  `loan_issuer_address`,
  `status`, 
  `created_at`
)
SELECT 
  '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
  p.project_code,
  p.project_name,
  'BUY_TOKEN',
  5000.00000000,
  p.principal_token_address,
  p.interest_token_address,
  p.loan_issuer_address,
  'pending',
  NOW()
FROM project p
WHERE p.project_code = 'RWAT0001'
LIMIT 1;

INSERT INTO `subscriptions` (
  `user_wallet_address`, 
  `project_code`, 
  `project_name`, 
  `trade_type`, 
  `token_amount`,
  `token_address_native`,
  `token_address_interest`,
  `loan_issuer_address`,
  `status`,
  `approved_at`,
  `created_at`
)
SELECT 
  '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
  p.project_code,
  p.project_name,
  'BUY_TOKEN',
  10000.00000000,
  p.principal_token_address,
  p.interest_token_address,
  p.loan_issuer_address,
  'approved',
  DATE_SUB(NOW(), INTERVAL 12 HOUR),
  DATE_SUB(NOW(), INTERVAL 1 DAY)
FROM project p
WHERE p.project_code = 'RWAT0001'
LIMIT 1;

INSERT INTO `subscriptions` (
  `user_wallet_address`, 
  `project_code`, 
  `project_name`, 
  `trade_type`, 
  `token_amount`,
  `token_address_native`,
  `token_address_interest`,
  `loan_issuer_address`,
  `status`, 
  `created_at`
)
SELECT 
  '0x3c4d5e6f7890abcdef1234567890abcdef123456',
  p.project_code,
  p.project_name,
  'BUY_TOKEN',
  3000.00000000,
  p.principal_token_address,
  p.interest_token_address,
  p.loan_issuer_address,
  'pending',
  DATE_SUB(NOW(), INTERVAL 2 HOUR)
FROM project p
WHERE p.project_code = 'RWA0001'
LIMIT 1;

-- 显示结果
SELECT '认购申请表更新完成！' as message;
SELECT COUNT(*) as total_subscriptions FROM subscriptions;
SELECT * FROM subscriptions ORDER BY created_at DESC;

-- 显示表结构
DESCRIBE subscriptions;
