-- 删除并重新创建认购申请表
-- 基于认购摘要信息构建新表结构

USE `rwa_dealmaker`;

-- 删除现有的subscriptions表
DROP TABLE IF EXISTS `subscriptions`;

-- 创建新的认购申请表（基于认购摘要信息）
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '认购申请ID',
  
  -- 用户信息
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID，关联user表',
  `user_wallet_address` varchar(42) NOT NULL COMMENT '用户钱包地址',
  
  -- 项目信息（从认购摘要）
  `project_code` varchar(50) NOT NULL COMMENT '项目代码',
  `project_name` varchar(200) DEFAULT NULL COMMENT '项目名称',
  
  -- 交易信息（从认购摘要）
  `trade_type` enum('BUY_TOKEN','SELL_INTEREST') NOT NULL DEFAULT 'BUY_TOKEN' COMMENT '交易类型：代币认购或利息赎回',
  `token_amount` decimal(20,8) NOT NULL COMMENT '代币数量',
  `interest_rate` decimal(5,2) DEFAULT NULL COMMENT '年化收益率（%）',
  `expected_return` varchar(100) DEFAULT NULL COMMENT '预期收益',
  
  -- 合约地址信息
  `token_address_native` varchar(42) DEFAULT NULL COMMENT '原生代币合约地址',
  `token_address_interest` varchar(42) DEFAULT NULL COMMENT '利息代币合约地址',
  `loan_issuer_address` varchar(42) DEFAULT NULL COMMENT '贷款发行人钱包地址',
  
  -- 状态管理
  `status` enum('pending','approved','rejected','completed','cancelled') NOT NULL DEFAULT 'pending' COMMENT '申请状态：待审核、已批准、已拒绝、已完成、已取消',
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

-- 插入示例数据（基于project表）
INSERT INTO `subscriptions` (
  `user_wallet_address`, 
  `project_code`, 
  `project_name`, 
  `trade_type`, 
  `token_amount`,
  `interest_rate`,
  `expected_return`,
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
  p.interest_rate,
  CONCAT('AUD ', FORMAT(5000 * p.interest_rate / 100, 2), ' /年'),
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
  `interest_rate`,
  `expected_return`,
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
  p.interest_rate,
  CONCAT('AUD ', FORMAT(10000 * p.interest_rate / 100, 2), ' /年'),
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
  `interest_rate`,
  `expected_return`,
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
  p.interest_rate,
  CONCAT('AUD ', FORMAT(3000 * p.interest_rate / 100, 2), ' /年'),
  p.principal_token_address,
  p.interest_token_address,
  p.loan_issuer_address,
  'pending',
  DATE_SUB(NOW(), INTERVAL 2 HOUR)
FROM project p
WHERE p.project_code = 'RWA0001'
LIMIT 1;

INSERT INTO `subscriptions` (
  `user_wallet_address`, 
  `project_code`, 
  `project_name`, 
  `trade_type`, 
  `token_amount`,
  `interest_rate`,
  `expected_return`,
  `token_address_native`,
  `token_address_interest`,
  `loan_issuer_address`,
  `status`,
  `approval_notes`,
  `approved_at`,
  `created_at`
)
SELECT 
  '0x4d5e6f7890abcdef1234567890abcdef12345678',
  p.project_code,
  p.project_name,
  'BUY_TOKEN',
  7500.00000000,
  p.interest_rate,
  CONCAT('AUD ', FORMAT(7500 * p.interest_rate / 100, 2), ' /年'),
  p.principal_token_address,
  p.interest_token_address,
  p.loan_issuer_address,
  'rejected',
  '不符合投资要求',
  DATE_SUB(NOW(), INTERVAL 2 DAY),
  DATE_SUB(NOW(), INTERVAL 3 DAY)
FROM project p
WHERE p.project_code = 'RWA0002'
LIMIT 1;

INSERT INTO `subscriptions` (
  `user_wallet_address`, 
  `project_code`, 
  `project_name`, 
  `trade_type`, 
  `token_amount`,
  `interest_rate`,
  `expected_return`,
  `token_address_native`,
  `token_address_interest`,
  `loan_issuer_address`,
  `status`,
  `approved_at`,
  `created_at`
)
SELECT 
  '0x5e6f7890abcdef1234567890abcdef123456789a',
  p.project_code,
  p.project_name,
  'BUY_TOKEN',
  15000.00000000,
  p.interest_rate,
  CONCAT('AUD ', FORMAT(15000 * p.interest_rate / 100, 2), ' /年'),
  p.principal_token_address,
  p.interest_token_address,
  p.loan_issuer_address,
  'completed',
  DATE_SUB(NOW(), INTERVAL 4 DAY),
  DATE_SUB(NOW(), INTERVAL 5 DAY)
FROM project p
WHERE p.project_code = 'RWAT0001'
LIMIT 1;

-- 显示结果
SELECT '认购申请表重建完成！' as message;
SELECT COUNT(*) as total_subscriptions FROM subscriptions;
SELECT 
  project_code, 
  COUNT(*) as count,
  SUM(token_amount) as total_tokens
FROM subscriptions 
GROUP BY project_code;

-- 显示表结构
DESCRIBE subscriptions;
