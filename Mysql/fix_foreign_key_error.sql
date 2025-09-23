-- 修复外键约束错误
USE rwa;

-- 1. 检查当前user表中的数据
SELECT * FROM user;

-- 2. 检查transactionhistory表中的数据
SELECT * FROM transactionhistory;

-- 3. 检查外键约束
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

-- 4. 如果user表为空，先插入测试用户数据
INSERT IGNORE INTO user (
    user_id, 
    user_wallet, 
    user_name, 
    user_email, 
    user_password, 
    user_phone,
    email_verified,
    is_active
) VALUES 
(
    'user_001', 
    '0x1234567890123456789012345678901234567890', 
    'Test User 1', 
    'user1@test.com', 
    '$2b$10$example_hash_1', 
    '1234567890',
    1,
    1
),
(
    'user_002', 
    '0x9876543210987654321098765432109876543210', 
    'Test User 2', 
    'user2@test.com', 
    '$2b$10$example_hash_2', 
    '0987654321',
    1,
    1
),
(
    'user_003', 
    '0xabcdef1234567890abcdef1234567890abcdef12', 
    'Test User 3', 
    'user3@test.com', 
    '$2b$10$example_hash_3', 
    '1122334455',
    1,
    1
);

-- 5. 验证用户数据已插入
SELECT user_id, user_name, user_wallet, user_email FROM user ORDER BY user_id;

-- 6. 现在插入交易历史数据（修正status值）
INSERT INTO transactionhistory (
    user_id, 
    wallet_address, 
    token_symbol, 
    amount, 
    price, 
    totalCost, 
    transaction_type, 
    status, 
    transactionHash, 
    blockNumber
) VALUES 
(
    'user_001', 
    '0x1234567890123456789012345678901234567890', 
    'RWA001', 
    100.000000, 
    1.000000, 
    100.000000, 
    'BUY', 
    'BUY',  -- 修正：status应该是'BUY'而不是'Pending'
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
),
(
    'user_003', 
    '0xabcdef1234567890abcdef1234567890abcdef12', 
    'YYD', 
    75.000000, 
    1.050000, 
    78.750000, 
    'BUY', 
    'BUY',
    '0x456789abc012345678901234567890123456789012345678901234567890123456', 
    1448112
);

-- 7. 验证交易历史数据已插入
SELECT 
    t.id,
    t.user_id,
    u.user_name,
    t.wallet_address,
    t.token_symbol,
    t.amount,
    t.price,
    t.totalCost,
    t.transaction_type,
    t.status,
    t.created_at
FROM transactionhistory t
JOIN user u ON t.user_id = u.user_id
ORDER BY t.created_at DESC;

-- 8. 测试连接查询
SELECT 
    u.user_id,
    u.user_name,
    u.user_wallet,
    COUNT(t.id) as transaction_count,
    SUM(CASE WHEN t.transaction_type = 'BUY' THEN t.totalCost ELSE 0 END) as total_buy_amount,
    SUM(CASE WHEN t.transaction_type = 'SELL' THEN t.totalCost ELSE 0 END) as total_sell_amount,
    MAX(t.created_at) as last_transaction_date
FROM user u
LEFT JOIN transactionhistory t ON u.user_id = t.user_id
GROUP BY u.user_id, u.user_name, u.user_wallet
ORDER BY transaction_count DESC;

-- 9. 显示表的统计信息
SELECT 
    'user' as table_name,
    COUNT(*) as record_count
FROM user
UNION ALL
SELECT 
    'transactionhistory' as table_name,
    COUNT(*) as record_count
FROM transactionhistory;
