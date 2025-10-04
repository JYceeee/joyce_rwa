-- 为project表添加合约地址字段
-- 执行此脚本前请确保已备份数据库

USE rwa;

-- 添加新的合约地址字段
ALTER TABLE project
ADD COLUMN principal_token_address VARCHAR(42) COMMENT '本币合约地址',
ADD COLUMN interest_token_address VARCHAR(42) COMMENT '代币合约地址',
ADD COLUMN kyc_registry_address VARCHAR(42) COMMENT 'kyc_registry_address',
ADD COLUMN loan_issuer_address VARCHAR(42) COMMENT 'loan_issuer_address';

-- 显示更新后的表结构
DESCRIBE project;

-- 显示更新完成信息
SELECT 'Contract address columns added successfully to project table!' as message;
