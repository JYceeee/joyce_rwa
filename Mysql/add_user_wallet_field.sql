-- 添加user_wallet字段到user表
-- 用于关联用户和钱包地址

USE rwa;

-- 添加user_wallet字段
ALTER TABLE user ADD COLUMN user_wallet VARCHAR(42) NULL COMMENT '用户钱包地址' AFTER user_phone;

-- 添加索引以提高查询性能
ALTER TABLE user ADD INDEX idx_user_wallet (user_wallet);

-- 添加唯一约束，确保一个钱包地址只能关联一个用户
ALTER TABLE user ADD UNIQUE KEY unique_user_wallet (user_wallet);

-- 显示表结构确认修改
DESCRIBE user;
