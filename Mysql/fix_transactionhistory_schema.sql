-- 修复transactionhistory表结构以匹配新的schema
USE rwa;

-- 删除现有的transactionhistory表（如果存在）
DROP TABLE IF EXISTS transactionhistory;

-- 创建新的transactionhistory表，匹配提供的schema
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

-- 检查user表是否有user_wallet字段，如果没有则添加
-- 这个字段用于存储用户的钱包地址
ALTER TABLE user 
ADD COLUMN IF NOT EXISTS user_wallet VARCHAR(255) UNIQUE COMMENT '用户钱包地址' AFTER user_id;

-- 为user_wallet字段添加索引
CREATE INDEX IF NOT EXISTS idx_user_wallet ON user (user_wallet);

-- 插入一些测试数据
INSERT INTO transactionhistory (
    user_id, wallet_address, token_symbol, amount, price, totalCost, 
    transaction_type, status, transactionHash, blockNumber
) VALUES 
(
    'user_001', 
    '0x1234567890123456789012345678901234567890', 
    'RWA001', 
    100.000000, 
    1.000000, 
    100.000000, 
    'BUY', 
    'BUY', 
    '0xabc123def45678901234567890123456789012345678901234567890123456789012', 
    1448109
),
(
    'user_001', 
    '0x1234567890123456789012345678901234567890', 
    'SQNB', 
    50.000000, 
    1.020000, 
    51.000000, 
    'BUY', 
    'BUY', 
    '0xdef456abc78901234567890123456789012345678901234567890123456789012345', 
    1448110
),
(
    'user_002', 
    '0x9876543210987654321098765432109876543210', 
    'LZYT', 
    25.000000, 
    0.980000, 
    24.500000, 
    'SELL', 
    'SELL', 
    '0x789012def34567890123456789012345678901234567890123456789012345678901', 
    1448111
);

-- 验证表结构
DESCRIBE transactionhistory;

-- 验证外键约束
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE 
    TABLE_SCHEMA = 'rwa' 
    AND TABLE_NAME = 'transactionhistory' 
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 显示表之间的连接关系
SELECT 
    tc.CONSTRAINT_NAME,
    tc.TABLE_NAME,
    kcu.COLUMN_NAME,
    tc.REFERENCED_TABLE_NAME,
    kcu.REFERENCED_COLUMN_NAME,
    rc.UPDATE_RULE,
    rc.DELETE_RULE
FROM 
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
        ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
    JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc 
        ON tc.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
WHERE 
    tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
    AND tc.TABLE_SCHEMA = 'rwa'
    AND tc.TABLE_NAME = 'transactionhistory';
