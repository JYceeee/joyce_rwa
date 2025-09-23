-- 测试user表与transactionhistory表的连接
USE rwa;

-- 1. 查看表结构
DESCRIBE user;
DESCRIBE transactionhistory;

-- 2. 查看外键约束
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

-- 3. 插入测试用户数据
INSERT IGNORE INTO user (user_id, user_wallet, user_name, user_email, user_password, user_phone) VALUES 
('user_001', '0x1234567890123456789012345678901234567890', 'Test User 1', 'user1@test.com', 'hashed_password_1', '1234567890'),
('user_002', '0x9876543210987654321098765432109876543210', 'Test User 2', 'user2@test.com', 'hashed_password_2', '0987654321');

-- 4. 插入测试交易数据
INSERT IGNORE INTO transactionhistory (
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

-- 5. 测试连接查询 - 显示用户及其交易历史
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

-- 6. 测试连接查询 - 显示详细的交易历史
SELECT 
    u.user_name,
    u.user_wallet,
    t.token_symbol,
    t.amount,
    t.price,
    t.totalCost,
    t.transaction_type,
    t.status,
    t.created_at
FROM user u
INNER JOIN transactionhistory t ON u.user_id = t.user_id
ORDER BY t.created_at DESC;

-- 7. 测试外键约束 - 尝试插入无效的user_id
-- 这应该失败
INSERT INTO transactionhistory (
    user_id, wallet_address, token_symbol, amount, price, totalCost, 
    transaction_type, status
) VALUES (
    'invalid_user_id', 
    '0x1111111111111111111111111111111111111111', 
    'TEST', 
    1.000000, 
    1.000000, 
    1.000000, 
    'BUY', 
    'BUY'
);

-- 8. 测试级联删除 - 删除用户应该删除其交易记录
-- 注意：这只是一个测试，实际使用时请谨慎
-- DELETE FROM user WHERE user_id = 'user_002';
-- SELECT COUNT(*) as remaining_transactions FROM transactionhistory WHERE user_id = 'user_002';

-- 9. 显示索引信息
SHOW INDEX FROM user;
SHOW INDEX FROM transactionhistory;

-- 10. 显示表的统计信息
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH,
    (DATA_LENGTH + INDEX_LENGTH) as TOTAL_SIZE
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = 'rwa' 
    AND TABLE_NAME IN ('user', 'transactionhistory');
