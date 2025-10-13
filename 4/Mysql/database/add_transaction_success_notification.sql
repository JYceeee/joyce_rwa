-- 完整的通知系统数据库更新脚本
-- 日期: 2025-10-13

USE `rwa_dealmaker`;

-- 检查并更新user_notifications表的type字段枚举
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
SELECT '新增通知类型: NEW_PROJECT_LAUNCHED, SUBSCRIPTION_PROGRESS, KYC_STATUS_UPDATE, WHITELIST_STATUS_UPDATE, PRINCIPAL_TOKEN_RECEIVED, INTEREST_TOKEN_RECEIVED, PROJECT_MATURITY, SUBSCRIPTION_APPLIED, SUBSCRIPTION_UNDER_REVIEW, SUBSCRIPTION_APPROVED' as new_notification_types;
SELECT '描述: 完整的RWA平台通知系统，涵盖项目、认购、KYC、白名单、交易等所有业务场景' as description;
