-- RWA项目数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS rwa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rwa;

-- 创建project表
CREATE TABLE IF NOT EXISTS project (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_code VARCHAR(50) UNIQUE NOT NULL COMMENT '项目编号',
    project_name VARCHAR(50) NOT NULL COMMENT '项目名称',
    loan_status VARCHAR(50) DEFAULT 'INCOMING' COMMENT '贷款状态 (INCOMING, ACTIVE, PERFORMING, DEFAULT等)',
    subscribe_token DECIMAL(15, 2) COMMENT '现有认购额',
    total_offering_token DECIMAL(15, 2) COMMENT '总认购额',

    -- 抵押资产物业信息
    property_location VARCHAR(255) NOT NULL COMMENT '物业位置（如：St Ives）',
    property_state VARCHAR(255) NOT NULL COMMENT '物业州',
    property_type VARCHAR(50) NOT NULL COMMENT '物业类型（如：Single House, Unit, etc.）',
    property_value DECIMAL(15, 2) COMMENT '物业价值',
    property_summary VARCHAR(255) NOT NULL COMMENT '物业描述',

    -- 贷款基本信息
    loan_type VARCHAR(50) NOT NULL COMMENT '贷款类型（如：1st Mortgage, 2nd Mortgage）',
    loan_product VARCHAR(100) NOT NULL COMMENT '贷款产品（如：FlexiBiz）',
    loan_amount DECIMAL(15, 2) NOT NULL COMMENT '贷款金额/限额',
    loan_purpose VARCHAR(255) NOT NULL COMMENT '贷款用途（如：Working Capital）',

    -- 贷款条款
    loan_term_months INT NOT NULL COMMENT '贷款期限（月）',

    -- 贷款比率
    lvr DECIMAL(5, 2) NOT NULL COMMENT 'Loan to Value Ratio (%)',
    interest_rate DECIMAL(5, 2) COMMENT '利率 (%)',
    default_rate DECIMAL(5, 2) COMMENT '违约利率 (%)',

    -- 贷款周期
    commencement_date DATE COMMENT '开始日期（当状态为PERFORMING时）',
    expiry_date DATE COMMENT '到期日期（当状态为PERFORMING时）',
    expected_recovery_date DATE COMMENT '违约后预计回款日期',

    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),

    -- 索引
    INDEX idx_loan_type (loan_type),
    INDEX idx_loan_product (loan_product),
    INDEX idx_property_status (loan_status),
    INDEX idx_property_location (property_location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';

-- 插入示例数据
INSERT INTO project (
    project_code, project_name, loan_status, subscribe_token, total_offering_token,
    property_location, property_state, property_type, property_value, property_summary,
    loan_type, loan_product, loan_amount, loan_purpose,
    loan_term_months, lvr, interest_rate, default_rate,
    commencement_date, expiry_date, expected_recovery_date,
    created_by, updated_by
) VALUES
-- 1. St Ives Residential Mortgage
('RWA001', 'St Ives NSW Residential Project', 'ACTIVE', 350000, 1000000,
 '16 Cranford Avenue, St Ives', 'NSW', 'Single House', 1500000, 'First-lien residential mortgage with monthly interest payments and controlled LTV.',
 '1st Mortgage', 'Standard Mortgage', 1000000, 'Residential development financing',
 12, 67.00, 9.90, 18.00,
 '2025-08-06', '2026-08-06', NULL,
 'system', 'system'),

-- 2. SQNB Commercial Loan
('RWA002', 'SQNB Property Loan', 'INCOMING', 0, 1800000,
 '88 George Street, Sydney', 'NSW', 'Commercial Building', 5000000, 'CBD commercial office building with strong tenant base.',
 '1st Mortgage', 'Commercial Flexi', 1800000, 'Working Capital',
 18, 55.00, 8.50, 16.00,
 NULL, NULL, NULL,
 'system', 'system'),

-- 3. LZYT Development Loan
('RWA003', 'LZYT Property Loan', 'INCOMING', 0, 750000,
 '12 Bay Road, Waverton', 'NSW', 'Unit Development', 2100000, 'Boutique apartment development near train station.',
 '1st Mortgage', 'Development Loan', 750000, 'Construction funding',
 15, 60.00, 10.50, 18.00,
 NULL, NULL, NULL,
 'system', 'system'),

-- 4. YYD Residential Loan
('RWA004', 'YYD Property Loan', 'INCOMING', 0, 1200000,
 '200 Pacific Highway, Gordon', 'NSW', 'Residential Land', 3000000, 'Large land subdivision with DA approved.',
 '1st Mortgage', 'Land Loan', 1200000, 'Land banking',
 24, 40.00, 7.50, 15.00,
 NULL, NULL, NULL,
 'system', 'system'),

-- 5. Bondi Beach Hotel Refinance
('RWA005', 'Bondi Beach Hotel Refinance', 'ACTIVE', 800000, 800000,
 '75 Hall Street, Bondi Beach', 'NSW', 'Commercial Building', 3500000, 'Prime hospitality asset near Bondi Beach.',
 '1st Mortgage', 'Refinance Facility', 800000, 'Refinancing existing debt',
 36, 23.00, 6.75, 14.00,
 '2024-06-01', '2027-06-01', NULL,
 'system', 'system'),

-- 6. Parramatta Mixed-Use Development
('RWA006', 'Parramatta Mixed-Use Development', 'PERFORMING', 1500000, 2000000,
 '120 Church Street, Parramatta', 'NSW', 'Mixed Use', 6000000, 'Retail and residential complex in Western Sydney.',
 '1st Mortgage', 'Construction Loan', 2000000, 'Development funding',
 24, 33.00, 8.20, 16.50,
 '2024-05-15', '2026-05-15', NULL,
 'system', 'system'),

-- 7. Manly Retail Strip Loan
('RWA007', 'Manly Retail Strip Loan', 'ACTIVE', 500000, 500000,
 '25 The Corso, Manly', 'NSW', 'Retail', 2000000, 'Fully leased retail strip near the beach.',
 '1st Mortgage', 'Retail Investment', 500000, 'Investment loan',
 12, 25.00, 7.80, 15.50,
 '2025-01-10', '2026-01-10', NULL,
 'system', 'system'),

-- 8. Chatswood Office Expansion
('RWA008', 'Chatswood Office Expansion', 'INCOMING', 0, 1500000,
 '10 Help Street, Chatswood', 'NSW', 'Office', 4500000, 'Expansion and refurbishment of existing office premises.',
 '2nd Mortgage', 'Office Growth Facility', 1500000, 'Office expansion funding',
 30, 33.00, 9.20, 17.00,
 NULL, NULL, NULL,
 'system', 'system'),

-- 9. Central Coast Industrial Estate
('RWA009', 'Central Coast Industrial Estate', 'INCOMING', 0, 2500000,
 '1 Industry Drive, Gosford', 'NSW', 'Industrial', 8000000, 'Modern warehouse facility with long-term lease.',
 '1st Mortgage', 'Industrial Term Loan', 2500000, 'Acquisition financing',
 60, 31.00, 8.80, 17.00,
 NULL, NULL, NULL,
 'system', 'system'),

-- 10. Penrith Student Housing
('RWA010', 'Penrith Student Housing Project', 'INCOMING', 0, 1000000,
 '50 High Street, Penrith', 'NSW', 'Student Accommodation', 3000000, 'New student housing close to university campus.',
 '1st Mortgage', 'Construction Facility', 1000000, 'Student housing construction',
 18, 33.00, 9.50, 18.00,
 NULL, NULL, NULL,
 'system', 'system');

-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE COMMENT '用户ID',
  user_wallet VARCHAR(255) UNIQUE COMMENT '用户钱包地址',
  user_name VARCHAR(100) COMMENT '用户姓名',
  user_email VARCHAR(100) NOT NULL UNIQUE COMMENT '用户邮箱',
  user_password VARCHAR(255) NOT NULL COMMENT '用户密码',
  user_phone VARCHAR(20) COMMENT '用户手机号',
  email_verified TINYINT(1) DEFAULT 0 COMMENT '邮箱验证状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_active TINYINT(1) DEFAULT 1 COMMENT '账户激活状态'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入测试用户
INSERT IGNORE INTO user (user_id, user_wallet, user_name, user_email, user_password, user_phone, email_verified, is_active) VALUES 
('USR001', '0x1234567890abcdef1234567890abcdef12345678', '管理员', 'admin@rwa.com', '123456', '13800138000', 1, 1),
('USR002', '0xabcdef1234567890abcdef1234567890abcdef12', '测试用户', 'test@rwa.com', '123456', '13800138001', 0, 1);

-- 显示创建结果
SELECT 'Database initialization completed successfully!' as message;
SELECT COUNT(*) as project_count FROM project;
SELECT COUNT(*) as user_count FROM user;
