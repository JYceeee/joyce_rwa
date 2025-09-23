-- 创建数据库
CREATE DATABASE IF NOT EXISTS rwa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE rwa;

-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL COMMENT '用户ID',
    user_wallet VARCHAR(255) UNIQUE COMMENT '用户钱包地址',
    user_name VARCHAR(100) NOT NULL COMMENT '用户名',
    user_email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    user_password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
    user_phone VARCHAR(20) COMMENT '手机号',
    email_verified TINYINT(1) DEFAULT 0 COMMENT '邮箱是否已验证',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否激活',
    
    -- 添加索引
    INDEX idx_user_wallet (user_wallet)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建邮箱验证表
CREATE TABLE IF NOT EXISTS email_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL COMMENT '邮箱地址',
    verification_code VARCHAR(6) NOT NULL COMMENT '验证码',
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_email (user_email),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邮箱验证码表';

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(50) UNIQUE NOT NULL COMMENT '项目ID',
    name VARCHAR(200) NOT NULL COMMENT '项目名称',
    
    -- 基本信息
    issuer VARCHAR(200) COMMENT '发币主体',
    pw_shareholders TEXT COMMENT 'PW的股东',
    lender VARCHAR(200) COMMENT '贷款主体',
    borrower VARCHAR(200) COMMENT '借款主体',
    
    -- 贷款信息
    loan_amount DECIMAL(20,2) COMMENT '贷款金额',
    withdrawal_arrangement TEXT COMMENT '提款安排',
    loan_term VARCHAR(100) COMMENT '贷款期限',
    loan_withdrawal_date DATE COMMENT '贷款提款日',
    
    -- 利息信息
    loan_interest VARCHAR(100) COMMENT '贷款利息',
    interest_payment_method VARCHAR(200) COMMENT '付息方式',
    
    -- 抵押物信息
    collateral TEXT COMMENT '抵押物',
    collateral_value DECIMAL(20,2) COMMENT '抵押物评估值',
    collateral_grade VARCHAR(50) COMMENT '抵押等级',
    collateral_ratio VARCHAR(50) COMMENT '抵押率',
    
    -- 担保与违约信息
    guarantor VARCHAR(200) COMMENT '担保人',
    default_interest_rate VARCHAR(100) COMMENT '违约时的利率',
    default_circumstances TEXT COMMENT '违约情形',
    default_arrangement TEXT COMMENT '违约时安排',
    
    -- 项目介绍
    intro_title VARCHAR(200) COMMENT '介绍标题',
    intro_content TEXT COMMENT '介绍内容',
    
    -- 系统字段
    status ENUM('active', 'inactive', 'completed') DEFAULT 'active' COMMENT '项目状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_project_id (project_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='RWA项目表';

-- 创建RWA贷款产品表
CREATE TABLE IF NOT EXISTS rwa_loan_product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) UNIQUE NOT NULL COMMENT '产品ID',
    name VARCHAR(200) NOT NULL COMMENT '产品名称',
    code VARCHAR(50) NOT NULL COMMENT '产品代码',
    subtitle VARCHAR(300) COMMENT '产品副标题',
    image VARCHAR(500) COMMENT '产品图片路径',
    
    -- 产品分类信息
    type ENUM('residential', 'commercial', 'industrial') COMMENT '产品类型',
    region VARCHAR(100) COMMENT '地区',
    risk ENUM('low', 'medium', 'high') COMMENT '风险等级',
    
    -- 财务信息
    target_yield DECIMAL(5,2) COMMENT '目标收益率(%)',
    current_price DECIMAL(10,2) COMMENT '当前价格',
    collateral_property_value DECIMAL(15,2) COMMENT '抵押物价值',
    loan_amount DECIMAL(15,2) COMMENT '贷款金额',
    target_loan_yield VARCHAR(100) COMMENT '目标贷款收益率',
    rental_income VARCHAR(100) COMMENT '租金收入',
    
    -- 产品状态
    status ENUM('active', 'inactive', 'completed') DEFAULT 'active' COMMENT '产品状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_product_id (product_id),
    INDEX idx_code (code),
    INDEX idx_type (type),
    INDEX idx_region (region),
    INDEX idx_risk (risk),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='RWA贷款产品表';

-- 插入测试数据
INSERT INTO projects (
    project_id, name, issuer, pw_shareholders, lender, borrower,
    loan_amount, withdrawal_arrangement, loan_term, loan_withdrawal_date,
    loan_interest, interest_payment_method,
    collateral, collateral_value, collateral_grade, collateral_ratio,
    guarantor, default_interest_rate, default_circumstances, default_arrangement,
    intro_title, intro_content
) VALUES 
(
    'RWA001', 
    'St Ives NSW Residential Real Estate Projects', 
    'Prosper Way Holdings Ltd',
    'A (25%), B (25%), C (25%), D (25%)',
    'CA Capital Pty Ltd',
    'Warby Street Development Pty Ltd',
    1000000.00,
    'One-time withdrawal',
    '12 months, with the option to prepay after 6 months',
    '2025-08-06',
    '9.9%/年',
    '每月付当月的，贷款起始日提前付当月的',
    '16 Cranford Avenue St Ives NSW 2075',
    1500000.00,
    'first mortgagee',
    '67%',
    'D Song',
    '18%',
    '付息时间延后超过5天，还本时间延后超过5天',
    '违约情形发生后，贷款人书面通知后1个月内没有偿还本金，利息和违约金时，贷款公司的律师开始启动拍卖程序',
    'Project Introduction',
    'This premium residential property project is located in the St Ives area of Sydney\'s North Shore. Boasting an exceptional location with comprehensive surrounding amenities, it represents an outstanding RWA investment opportunity. The project developer is a renowned real estate company with extensive experience in residential property development and management.'
);



-- 创建交易历史表
CREATE TABLE IF NOT EXISTS transactionhistory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    wallet_address VARCHAR(255) NOT NULL COMMENT '钱包地址',
    token_symbol VARCHAR(20) NOT NULL COMMENT '代币符号',
    amount DECIMAL(18,6) NOT NULL COMMENT '交易数量',
    price DECIMAL(18,6) NOT NULL COMMENT '交易价格',
    totalCost DECIMAL(18,6) NOT NULL DEFAULT 0.000000 COMMENT '总成本',
    transaction_type ENUM('BUY','SELL') NOT NULL COMMENT '交易类型',
    status ENUM('BUY','SELL','FAILED') DEFAULT 'PENDING' COMMENT '交易状态',
    transactionHash VARCHAR(100) COMMENT '交易哈希',
    blockNumber BIGINT COMMENT '区块号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 添加外键约束，连接到user表
    CONSTRAINT fk_transactionhistory_user_id 
        FOREIGN KEY (user_id) REFERENCES user(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- 添加索引
    INDEX idx_user_id (user_id),
    INDEX idx_wallet_address (wallet_address),
    INDEX idx_token_symbol (token_symbol),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='交易历史表';