-- RWA项目数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS rwa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rwa;

-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(50) NOT NULL UNIQUE,
    project_name VARCHAR(200) NOT NULL,
    loan_status ENUM('INCOMING', 'ACTIVE', 'COMPLETED', 'DEFAULT', 'CANCELLED') DEFAULT 'INCOMING',
    subscribe_token DECIMAL(20,2) DEFAULT 0,
    total_offering_token DECIMAL(20,2) NOT NULL,
    property_location VARCHAR(200),
    property_state VARCHAR(50),
    property_type VARCHAR(100),
    property_value DECIMAL(20,2),
    property_summary TEXT,
    loan_type VARCHAR(100),
    loan_product VARCHAR(100),
    loan_amount DECIMAL(20,2),
    loan_purpose TEXT,
    loan_term_months INT,
    lvr DECIMAL(5,2),
    interest_rate DECIMAL(5,2),
    default_rate DECIMAL(5,2),
    commencement_date DATE,
    expiry_date DATE,
    expected_recovery_date DATE,
    principal_token_address VARCHAR(42),
    interest_token_address VARCHAR(42),
    kyc_registry_address VARCHAR(42),
    loan_issuer_address VARCHAR(42),
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建交易记录表
CREATE TABLE IF NOT EXISTS transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    project_code VARCHAR(50) NOT NULL,
    trade_type ENUM('buy', 'sell') NOT NULL,
    amount DECIMAL(20,2) NOT NULL,
    transaction_hash VARCHAR(66),
    block_number BIGINT,
    gas_used BIGINT,
    status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_address (user_address),
    INDEX idx_project_code (project_code),
    INDEX idx_transaction_hash (transaction_hash)
);

-- 插入示例数据
INSERT INTO project (
    project_code, project_name, loan_status, subscribe_token, total_offering_token,
    property_location, property_state, property_type, property_value, property_summary,
    loan_type, loan_product, loan_amount, loan_purpose,
    loan_term_months, lvr, interest_rate, default_rate,
    commencement_date, expiry_date, expected_recovery_date,
    principal_token_address, interest_token_address, kyc_registry_address, loan_issuer_address,
    created_by, updated_by
) VALUES (
    'RWA001', '悉尼市中心公寓项目', 'ACTIVE', 500000, 1000000,
    'Sydney CBD', 'NSW', 'Apartment', 2000000, '位于悉尼市中心的豪华公寓项目，地理位置优越',
    'Residential', 'Property Loan', 1500000, '房地产开发',
    24, 75.00, 6.50, 2.00,
    '2024-01-01', '2026-01-01', '2026-06-01',
    '0xA41b4F0417d588a08F914Ca17b07c99783D5c3FC',
    '0x9d3175E3F8c055389e070e058f717D450bB89206',
    '0x0A96077ffe3f06274d869ba1eed6cB7324270C2f',
    '0x13159e6417D98528C220b12Ec4950D5A343E5eAA',
    'system', 'system'
) ON DUPLICATE KEY UPDATE
    project_name = VALUES(project_name),
    loan_status = VALUES(loan_status),
    subscribe_token = VALUES(subscribe_token),
    total_offering_token = VALUES(total_offering_token);

-- 插入更多示例项目
INSERT INTO project (
    project_code, project_name, loan_status, subscribe_token, total_offering_token,
    property_location, property_state, property_type, property_value, property_summary,
    loan_type, loan_product, loan_amount, loan_purpose,
    loan_term_months, lvr, interest_rate, default_rate,
    commencement_date, expiry_date, expected_recovery_date,
    principal_token_address, interest_token_address, kyc_registry_address, loan_issuer_address,
    created_by, updated_by
) VALUES (
    'RWA002', '墨尔本商业地产项目', 'ACTIVE', 300000, 800000,
    'Melbourne CBD', 'VIC', 'Commercial', 3000000, '墨尔本中央商务区优质商业地产',
    'Commercial', 'Property Loan', 2400000, '商业地产开发',
    36, 80.00, 7.20, 1.80,
    '2024-02-01', '2027-02-01', '2027-08-01',
    '0xA41b4F0417d588a08F914Ca17b07c99783D5c3FC',
    '0x9d3175E3F8c055389e070e058f717D450bB89206',
    '0x0A96077ffe3f06274d869ba1eed6cB7324270C2f',
    '0x13159e6417D98528C220b12Ec4950D5A343E5eAA',
    'system', 'system'
) ON DUPLICATE KEY UPDATE
    project_name = VALUES(project_name),
    loan_status = VALUES(loan_status),
    subscribe_token = VALUES(subscribe_token),
    total_offering_token = VALUES(total_offering_token);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_project_code ON project(project_code);
CREATE INDEX IF NOT EXISTS idx_loan_status ON project(loan_status);
CREATE INDEX IF NOT EXISTS idx_property_type ON project(property_type);
CREATE INDEX IF NOT EXISTS idx_created_at ON project(created_at);

-- 显示表结构
DESCRIBE project;
DESCRIBE user;
DESCRIBE transaction;

-- 显示示例数据
SELECT * FROM project LIMIT 5;
