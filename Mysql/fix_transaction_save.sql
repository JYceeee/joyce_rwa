-- 修复交易历史保存问题
USE rwa;

-- 1. 首先检查user表结构
DESCRIBE user;

-- 2. 检查transactionhistory表结构
DESCRIBE transactionhistory;

-- 3. 检查现有的用户数据
SELECT user_id, user_wallet, user_name, user_email FROM user LIMIT 5;

-- 4. 检查现有的交易历史数据
SELECT user_id, wallet_address, token_symbol, amount, transaction_type, status FROM transactionhistory LIMIT 5;

-- 5. 创建测试用户（如果不存在）
INSERT IGNORE INTO user (user_id, user_wallet, user_name, user_email, user_password, user_phone) VALUES 
('user1758605762188fkiyu', '0x1234567890123456789012345678901234567890', 'Test User 1', 'test1@example.com', 'hashed_password_1', '1234567890'),
('user1758605762189abcde', '0x9876543210987654321098765432109876543210', 'Test User 2', 'test2@example.com', 'hashed_password_2', '0987654321');

-- 6. 测试插入交易历史记录
INSERT INTO transactionhistory (
    user_id, wallet_address, token_symbol, amount, price, totalCost, 
    transaction_type, status, transactionHash, blockNumber
) VALUES 
(
    'user1758605762188fkiyu', 
    '0x1234567890123456789012345678901234567890', 
    'RWA001', 
    100.000000, 
    1.000000, 
    100.000000, 
    'BUY', 
    'Pending', 
    '0xabc123def45678901234567890123456789012345678901234567890123456789012', 
    1448109
);

-- 7. 验证插入结果
SELECT * FROM transactionhistory WHERE user_id = 'user1758605762188fkiyu';

-- 8. 测试连接查询
SELECT 
    u.user_id,
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
WHERE u.user_id = 'user1758605762188fkiyu';
