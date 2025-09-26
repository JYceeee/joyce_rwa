-- RWA项目数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS rwa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rwa;

-- 创建product_details表
CREATE TABLE IF NOT EXISTS product_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE COMMENT '产品代码',
  name VARCHAR(255) NOT NULL COMMENT '产品名称',
  subtitle VARCHAR(500) COMMENT '产品副标题',
  type ENUM('residential', 'commercial') NOT NULL COMMENT '产品类型',
  region VARCHAR(100) NOT NULL COMMENT '地区',
  risk ENUM('low', 'medium', 'high') NOT NULL COMMENT '风险等级',
  target_yield DECIMAL(5,2) COMMENT '目标收益率',
  status ENUM('active', 'upcoming', 'research', 'planning', 'completed') NOT NULL COMMENT '项目状态',
  summary TEXT COMMENT '项目摘要',
  
  -- 投资信息
  total_token VARCHAR(100) COMMENT '总认购额度',
  current_subscribed_token VARCHAR(100) COMMENT '已认购额度',
 
  -- 关键事实
  loan_amount VARCHAR(100) COMMENT '贷款金额',
  annual_interest_rate VARCHAR(50) COMMENT '年利率',
  loan_term VARCHAR(50) COMMENT '贷款期限',
  LTV VARCHAR(50) COMMENT '贷款价值比',
  drawdown_date DATE COMMENT '提款日期',
  early_repayment VARCHAR(200) COMMENT '提前还款选项',
  repayment_arrangement TEXT COMMENT '还款安排',
  
  -- 相关主体
  issuer VARCHAR(255) COMMENT '发币主体',
  pw_shareholders VARCHAR(500) COMMENT 'PW股东',
  lender VARCHAR(255) COMMENT '贷款方',
  borrower VARCHAR(255) COMMENT '借款方',
  guarantor VARCHAR(255) COMMENT '担保人',
  
  -- 提款与利息
  disbursement_method VARCHAR(200) COMMENT '提款方式',
  interest VARCHAR(200) COMMENT '利息详情',
  early_repayment_details VARCHAR(200) COMMENT '提前还款详情',
  maturity_date DATE COMMENT '到期日',
  
  -- 抵押物
  property_address VARCHAR(500) COMMENT '房产地址',
  valuation VARCHAR(100) COMMENT '评估价值',
  security_rank VARCHAR(100) COMMENT '抵押等级',
  lvr VARCHAR(50) COMMENT '贷款价值比',
  
  -- 违约与补救
  default_interest_rate VARCHAR(50) COMMENT '违约利率',
  default_triggers VARCHAR(500) COMMENT '违约触发条件',
  default_process TEXT COMMENT '违约处理流程',
  
  -- 链上与文档
  issuer_token VARCHAR(500) COMMENT '发币代币',
  loan_token VARCHAR(500) COMMENT '贷款代币',
  valuation_report VARCHAR(200) COMMENT '评估报告',
  mortgage_deed VARCHAR(200) COMMENT '抵押契约',
  
  -- 系统字段
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  INDEX idx_code (code),
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_region (region),
  INDEX idx_risk (risk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品详情表';

-- 插入示例数据
INSERT INTO product_details (
  code, name, subtitle, 
  type, region, risk, target_yield, status, summary,
  total_token, current_subscribed_token,
  loan_amount, annual_interest_rate, loan_term, LTV, drawdown_date, early_repayment, repayment_arrangement,
  issuer, pw_shareholders, lender, borrower, guarantor,
  disbursement_method, interest, early_repayment_details, maturity_date,
  property_address, valuation, security_rank, lvr,
  default_interest_rate, default_triggers, default_process,
  issuer_token, loan_token, valuation_report, mortgage_deed
) VALUES 
(
  'RWA001', 'St Ives NSW Residential Project', 'Prosper Way Holdings Ltd - Residential Mortgage', 
  'residential', 'NSW', 'low', 9.9, 'active', 
  'First-lien residential mortgage with monthly interest payments and controlled LTV.',
  '1000000', '350000', 
  'AUD 1,000,000', '9.9%', '12 months', '67%', '2025-08-06', 'Permitted after 6 months', 
  'Monthly interest payments (the first month\'s interest prepaid on the start date). Principal repaid in full at maturity.',
  'Prosper Way Holdings Ltd (PW)', 'A, B, C, D – each holding 25%', 'CA Capital Pty Ltd', 
  'Warby Street Development Pty Ltd', 'D Song',
  'Lump-sum, single drawdown', '9.9% p.a., payable monthly; first month prepaid at drawdown', 
  'Allowed after 6 months', '2026-08-06',
  '16 Cranford Avenue, St Ives NSW 2075', 'AUD 1,500,000', 'First mortgage', '67%',
  '18% p.a.', 'Interest or principal overdue by more than 5 days', 
  'If default occurs and remains unresolved 1 month after written notice, the lender\'s lawyer will initiate foreclosure proceedings',
  'PW issues tokens to A/B/C/D (25% each) as equity certificates', 
  'Placeholder – planned ERC-20 token to record principal and distribute interest', 'PDF available', 'PDF available'
),
(
  'RWA002', 'SQNB Property Loan', 'Commercial Mortgage Loan', 
  'commercial', 'CBD', 'medium', 7.2, 'upcoming', 
  'Commercial mortgage opportunity in CBD with stable tenancy and monthly coupons.',
  '1800000', '0', 
  'AUD 1,800,000', '7.2%', '24 months', '75%', '2025-09-15', 'Permitted after 12 months', 
  'Monthly interest payments with principal repayment at maturity.',
  'SQNB Holdings Ltd', 'E, F, G – each holding 33.33%', 'CBD Capital Pty Ltd', 
  'Commercial Development Group Pty Ltd', 'H Johnson',
  'Staged drawdown over 3 months', '7.2% p.a., payable monthly', 
  'Allowed after 12 months with penalty', '2027-09-15',
  '123 Collins Street, Melbourne VIC 3000', 'AUD 2,400,000', 'First mortgage', '75%',
  '15% p.a.', 'Interest or principal overdue by more than 7 days', 
  'Standard foreclosure proceedings initiated after 30 days notice',
  'SQNB issues tokens to E/F/G as equity certificates', 
  'Planned ERC-20 token for debt recording', 'PDF available', 'PDF available'
),
(
  'RWA003', 'LZYT Property Loan', 'Suburban Residential Loan', 
  'residential', 'Suburban', 'medium', 6.9, 'research', 
  'Suburban residential mortgage with moderate yield and steady income profile.',
  '750000', '0', 
  'AUD 750,000', '6.9%', '18 months', '76.5%', '2025-10-01', 'Permitted after 9 months', 
  'Monthly interest payments with balloon payment at maturity.',
  'LZYT Property Holdings Pty Ltd', 'I, J, K – each holding 33.33%', 'Suburban Finance Pty Ltd', 
  'Residential Development Co. Pty Ltd', 'L Smith',
  'Single drawdown at settlement', '6.9% p.a., payable monthly', 
  'Allowed after 9 months without penalty', '2027-04-01',
  '456 Suburban Drive, Brisbane QLD 4000', 'AUD 980,000', 'First mortgage', '76.5%',
  '12% p.a.', 'Interest or principal overdue by more than 10 days', 
  'Mortgagee sale proceedings after 45 days default notice',
  'LZYT issues tokens to I/J/K as equity certificates', 
  'Planned ERC-20 token for debt management', 'PDF available', 'PDF available'
),
(
  'YYD', 'YYD Property Loan', 'CBD Apartment Mortgage', 
  'residential', 'CBD', 'low', 6.1, 'planning', 
  'CBD apartment mortgage targeting stable monthly income and lower risk.',
  '1200000', '0', 
  'AUD 1,200,000', '6.1%', '36 months', '72.7%', '2025-11-15', 'Permitted after 18 months', 
  'Monthly interest payments with principal amortization over final 12 months.',
  'YYD Apartment Holdings Pty Ltd', 'M, N, O, P – each holding 25%', 'CBD Residential Finance Pty Ltd', 
  'Apartment Development Group Pty Ltd', 'Q Wilson',
  'Progressive drawdown based on construction milestones', '6.1% p.a., payable monthly', 
  'Allowed after 18 months with reduced penalty', '2028-11-15',
  '789 CBD Plaza, Sydney NSW 2000', 'AUD 1,650,000', 'First mortgage', '72.7%',
  '10% p.a.', 'Interest or principal overdue by more than 14 days', 
  'Receivership and sale proceedings after 60 days notice',
  'YYD issues tokens to M/N/O/P as equity certificates', 
  'Planned ERC-20 token for debt tracking', 'PDF available', 'PDF available'
),
(
  'COMP', 'COMPLETED Project', 'Fully Subscribed Project', 
  'residential', 'Sydney', 'low', 8.5, 'completed', 
  'This project has been fully subscribed and is now closed for new investments.',
  '2000000', '2000000', 
  'AUD 2,000,000', '8.5%', '30 months', '71.4%', '2024-06-01', 'Permitted after 15 months', 
  'Monthly interest payments with principal repayment at maturity.',
  'COMP Property Holdings Pty Ltd', 'R, S, T, U, V – each holding 20%', 'Sydney Capital Finance Pty Ltd', 
  'Premium Development Group Pty Ltd', 'W Brown',
  'Single drawdown at settlement', '8.5% p.a., payable monthly', 
  'Allowed after 15 months without penalty', '2026-12-01',
  '321 Premium Street, Sydney NSW 2000', 'AUD 2,800,000', 'First mortgage', '71.4%',
  '16% p.a.', 'Interest or principal overdue by more than 5 days', 
  'Foreclosure proceedings after 30 days written notice',
  'COMP issues tokens to R/S/T/U/V as equity certificates', 
  'Active ERC-20 token for debt management', 'PDF available', 'PDF available'
);

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

-- -- 插入测试用户
-- INSERT IGNORE INTO user (user_id, user_wallet, user_name, user_email, user_password, user_phone, email_verified, is_active) VALUES 
-- ('USR001', '0x1234567890abcdef1234567890abcdef12345678', '管理员', 'admin@rwa.com', '123456', '13800138000', 1, 1),
-- ('USR002', '0xabcdef1234567890abcdef1234567890abcdef12', '测试用户', 'test@rwa.com', '123456', '13800138001', 0, 1);

-- -- 显示创建结果
-- SELECT 'Database initialization completed successfully!' as message;
-- SELECT COUNT(*) as product_count FROM product_details;
-- SELECT COUNT(*) as user_count FROM user;
