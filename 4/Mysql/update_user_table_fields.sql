-- 更新user表字段以确保正确存储用户数据
-- 修复user_name和user_phone字段的默认值问题

USE rwa;

-- 检查并更新user_name字段的默认值
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'user' 
     AND table_schema = 'rwa' 
     AND column_name = 'user_name'
     AND column_default = 'User') > 0,
    'SELECT "user_name字段默认值已正确设置" as message;',
    'ALTER TABLE user MODIFY COLUMN user_name VARCHAR(100) DEFAULT "User" COMMENT "用户姓名";'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查并更新user_phone字段，确保可以存储空字符串
SET @sql2 = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'user' 
     AND table_schema = 'rwa' 
     AND column_name = 'user_phone'
     AND is_nullable = 'YES') > 0,
    'SELECT "user_phone字段已允许NULL值" as message;',
    'ALTER TABLE user MODIFY COLUMN user_phone VARCHAR(20) NULL COMMENT "用户电话";'
));

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- 检查并更新email_list字段的默认值
SET @sql3 = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'user' 
     AND table_schema = 'rwa' 
     AND column_name = 'email_list'
     AND column_default = 'No') > 0,
    'SELECT "email_list字段默认值已正确设置" as message;',
    'ALTER TABLE user MODIFY COLUMN email_list ENUM("Yes", "No") DEFAULT "No" COMMENT "是否同意接收邮件列表";'
));

PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- 显示更新后的表结构
DESCRIBE user;

-- 显示成功消息
SELECT 'User表字段更新完成!' as message;
SELECT '现在可以正确存储user_name, user_phone和email_list字段' as note;
