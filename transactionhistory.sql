USE rwa;
DROP TABLE transactionhistory;
USE rwa;
DROP TABLE IF EXISTS transactionhistory;
CREATE TABLE transactionhistory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) COMMENT '用户ID',
    wallet_address VARCHAR(42) COMMENT '钱包地址',
    project_code VARCHAR(20) COMMENT '代币符号',
    token_amount DECIMAL(18,6) COMMENT '交易数量',
    transaction_type ENUM('buy','sell') COMMENT '交易类型',
    transaction_status ENUM('successful','failed','pending') COMMENT '交易状态',
    transaction_hash VARCHAR(66) COMMENT '交易哈希',
    block_number BIGINT COMMENT '区块号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);

USE rwa;
Select * from transactionhistory;

DESCRIBE transactionhistory;
