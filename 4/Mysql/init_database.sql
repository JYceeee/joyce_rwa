-- RWA项目数据库初始化脚本
-- 创建数据库和用户表

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS rwa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE rwa;

-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    user_id VARCHAR(50) UNIQUE NOT NULL COMMENT '用户唯一标识符',
    user_name VARCHAR(100) DEFAULT 'User' COMMENT '用户姓名',
    user_email VARCHAR(100) UNIQUE NOT NULL COMMENT '用户邮箱',
    user_phone VARCHAR(20) COMMENT '用户电话',
    user_password VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    user_wallet VARCHAR(100) COMMENT '用户钱包地址',
    email_list ENUM('Yes', 'No') DEFAULT 'No' COMMENT '是否同意接收邮件列表',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_email (user_email),
    INDEX idx_user_id (user_id),
    INDEX idx_user_wallet (user_wallet),
    INDEX idx_email_list (email_list)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建项目表
CREATE TABLE IF NOT EXISTS project (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    project_code VARCHAR(50) UNIQUE NOT NULL COMMENT '项目代码',
    project_name VARCHAR(200) NOT NULL COMMENT '项目名称',
    loan_status ENUM('ACTIVE', 'INCOMING', 'COMPLETED', 'COMPLETE', 'DEFAULT') DEFAULT 'INCOMING' COMMENT '贷款状态',
    property_location VARCHAR(200) COMMENT '房产位置',
    property_state VARCHAR(50) COMMENT '房产州',
    property_type VARCHAR(100) COMMENT '房产类型',
    property_value DECIMAL(15,2) COMMENT '房产价值',
    property_summary TEXT COMMENT '房产摘要',
    loan_type VARCHAR(100) COMMENT '贷款类型',
    loan_product VARCHAR(100) COMMENT '贷款产品',
    loan_amount DECIMAL(15,2) COMMENT '贷款金额',
    loan_purpose VARCHAR(200) COMMENT '贷款用途',
    loan_term_months INT COMMENT '贷款期限（月）',
    lvr DECIMAL(5,2) COMMENT '贷款价值比',
    interest_rate DECIMAL(5,2) COMMENT '利率',
    default_rate DECIMAL(5,2) COMMENT '违约利率',
    subscribe_token DECIMAL(20,8) DEFAULT 0 COMMENT '已认购代币数量',
    total_offering_token DECIMAL(20,8) COMMENT '总发行代币数量',
    commencement_date DATE COMMENT '开始日期',
    expiry_date DATE COMMENT '到期日期',
    expected_recovery_date DATE COMMENT '预期回收日期',
    principal_token_address VARCHAR(42) COMMENT '本币合约地址',
    interest_token_address VARCHAR(42) COMMENT '代币合约地址',
    kyc_registry_address VARCHAR(42) COMMENT 'kyc_registry_address',
    loan_issuer_address VARCHAR(42) COMMENT 'loan_issuer_address',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_project_code (project_code),
    INDEX idx_loan_status (loan_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';

-- 创建交易历史表
CREATE TABLE IF NOT EXISTS transaction_history (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    transaction_hash VARCHAR(100) UNIQUE COMMENT '交易哈希',
    transaction_type ENUM('SUBSCRIPTION', 'REDEMPTION', 'TRANSFER') NOT NULL COMMENT '交易类型',
    project_code VARCHAR(50) COMMENT '项目代码',
    amount DECIMAL(20,8) COMMENT '交易金额',
    token_amount DECIMAL(20,8) COMMENT '代币数量',
    block_number BIGINT COMMENT '区块号',
    gas_used BIGINT COMMENT '使用的Gas',
    gas_price BIGINT COMMENT 'Gas价格',
    transaction_fee DECIMAL(20,8) COMMENT '交易费用',
    status ENUM('PENDING', 'CONFIRMED', 'FAILED') DEFAULT 'PENDING' COMMENT '交易状态',
    wallet_address VARCHAR(100) COMMENT '钱包地址',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_hash (transaction_hash),
    INDEX idx_project_code (project_code),
    INDEX idx_wallet_address (wallet_address),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_code) REFERENCES project(project_code) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='交易历史表';

-- 插入一些测试项目数据
INSERT IGNORE INTO project (
    project_code, project_name, loan_status, property_location, property_state, 
    property_type, property_value, loan_product, loan_amount, interest_rate, 
    loan_term_months, subscribe_token, total_offering_token
) VALUES 
('RWA001', 'Sydney CBD Apartment', 'ACTIVE', 'Sydney CBD, NSW', 'NSW', 
 'Apartment', 1200000.00, 'Residential Loan', 800000.00, 6.50, 
 24, 150000.00, 500000.00),
('RWA002', 'Melbourne House', 'ACTIVE', 'Melbourne, VIC', 'VIC', 
 'House', 950000.00, 'Residential Loan', 665000.00, 6.25, 
 36, 200000.00, 400000.00),
('RWA003', 'Brisbane Townhouse', 'INCOMING', 'Brisbane, QLD', 'QLD', 
 'Townhouse', 750000.00, 'Residential Loan', 525000.00, 6.75, 
 30, 0.00, 300000.00);

-- 显示创建的表
SHOW TABLES;

-- 显示用户表结构
DESCRIBE user;

-- 显示项目表结构  
DESCRIBE project;

-- 显示交易历史表结构
DESCRIBE transaction_history;

-- 插入完成提示
SELECT 'Database initialization completed successfully!' as message;
