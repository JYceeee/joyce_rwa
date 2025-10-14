-- 完整通知系统数据库更新脚本
-- 日期: 2025-10-13
-- 描述: 更新user_notifications表以支持完整的RWA平台通知系统

USE `rwa`;

-- 更新user_notifications表的type字段枚举，添加所有新的通知类型
ALTER TABLE `user_notifications` 
MODIFY COLUMN `type` ENUM(
    'SUBMITTED',                    -- 用户提交申请
    'STATUS_CHANGED',               -- 管理员改状态
    'PAYMENT_REQUIRED',             -- 通知去链上支付（APPROVED触发）
    'PAYMENT_SUBMITTED',            -- 收到用户提交的交易hash
    'PAYMENT_CONFIRMED',            -- 后台核验成功
    'COMPLETED',                    -- 交易完成
    'TRANSACTION_SUCCESS',          -- 交易成功完成
    'NEW_PROJECT_LAUNCHED',         -- 新项目上线提醒
    'SUBSCRIPTION_PROGRESS',        -- 上链项目认购进度提醒
    'KYC_STATUS_UPDATE',            -- KYC申请状态更新
    'WHITELIST_STATUS_UPDATE',      -- 白名单申请状态更新
    'PRINCIPAL_TOKEN_RECEIVED',     -- 收到本金token
    'INTEREST_TOKEN_RECEIVED',      -- 收到利息token
    'PROJECT_MATURITY',             -- 项目到期提醒
    'SUBSCRIPTION_APPLIED',         -- 认购申请已提交
    'SUBSCRIPTION_UNDER_REVIEW',    -- 认购申请审批中
    'SUBSCRIPTION_APPROVED'         -- 认购申请已通过
) NOT NULL;

-- 显示更新结果
SELECT '✅ 完整通知系统更新完成！' as message;

-- 显示所有支持的通知类型
SELECT 
    'SUBMITTED' as notification_type, '用户提交申请' as description
UNION ALL
SELECT 'STATUS_CHANGED', '管理员改状态'
UNION ALL
SELECT 'PAYMENT_REQUIRED', '通知去链上支付'
UNION ALL
SELECT 'PAYMENT_SUBMITTED', '收到用户提交的交易hash'
UNION ALL
SELECT 'PAYMENT_CONFIRMED', '后台核验成功'
UNION ALL
SELECT 'COMPLETED', '交易完成'
UNION ALL
SELECT 'TRANSACTION_SUCCESS', '交易成功完成'
UNION ALL
SELECT 'NEW_PROJECT_LAUNCHED', '新项目上线提醒'
UNION ALL
SELECT 'SUBSCRIPTION_PROGRESS', '上链项目认购进度提醒'
UNION ALL
SELECT 'KYC_STATUS_UPDATE', 'KYC申请状态更新'
UNION ALL
SELECT 'WHITELIST_STATUS_UPDATE', '白名单申请状态更新'
UNION ALL
SELECT 'PRINCIPAL_TOKEN_RECEIVED', '收到本金token'
UNION ALL
SELECT 'INTEREST_TOKEN_RECEIVED', '收到利息token'
UNION ALL
SELECT 'PROJECT_MATURITY', '项目到期提醒'
UNION ALL
SELECT 'SUBSCRIPTION_APPLIED', '认购申请已提交'
UNION ALL
SELECT 'SUBSCRIPTION_UNDER_REVIEW', '认购申请审批中'
UNION ALL
SELECT 'SUBSCRIPTION_APPROVED', '认购申请已通过'
ORDER BY notification_type;

