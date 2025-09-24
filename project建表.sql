1）打开rwa database
use rwa;

2) 删除旧表（若存在），防止重复建表报错
DROP TABLE IF EXISTS rwa_loan_project;

3) 建表：单表覆盖“关键信息 / 主体 / 抵押 / 违约 / 链上与文档 / 运营信息”
CREATE TABLE rwa_loan_project (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  project_code             VARCHAR(64)     NOT NULL COMMENT '项目代号，如 PW-S01',
  series_no                VARCHAR(32)     NULL     COMMENT '系列编号，如 Series 01',
  
  -- 关键信息（条款）
  loan_amount_aud          DECIMAL(15,2)   NOT NULL COMMENT '贷款金额(AUD)',
  interest_rate_pa_pct     DECIMAL(5,2)    NOT NULL COMMENT '年化利率(%)，如9.90',
  term_months              INT             NOT NULL COMMENT '期限(月)，如12',
  drawdown_date            DATE            NOT NULL COMMENT '提款日',
  maturity_date            DATE            NOT NULL COMMENT '到期日',
  repay_interest_monthly   TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '是否按月付息(1是/0否)',
  first_month_interest_prepay TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '起始日是否预付首月利息',
  principal_repay_at_maturity TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '本金到期一次性偿还',
  early_repay_after_months INT             NULL     COMMENT '允许提前还款的最早月份(如6)',
  repayment_notes          VARCHAR(500)    NULL     COMMENT '还款补充说明',
  
  -- 主体信息
  issuer_name              VARCHAR(200)    NOT NULL COMMENT '发币主体/发行人',
  issuer_shareholder_note  VARCHAR(500)    NULL     COMMENT '股东/代币说明',
  lender_name              VARCHAR(200)    NOT NULL COMMENT '出借人',
  borrower_name            VARCHAR(200)    NOT NULL COMMENT '借款人',
  guarantor_name           VARCHAR(200)    NULL     COMMENT '担保人',
  
  -- 抵押与估值
  property_address         VARCHAR(300)    NOT NULL COMMENT '抵押物地址',
  valuation_amount_aud     DECIMAL(15,2)   NOT NULL COMMENT '评估值(AUD)',
  security_rank            VARCHAR(64)     NOT NULL COMMENT '抵押等级，如 First mortgage',
  ltv_pct                  DECIMAL(5,2)    NULL     COMMENT 'LTV/LVR(%)，若提供就存',
  lvr_calc_pct             DECIMAL(7,4) GENERATED ALWAYS AS (
                            CASE WHEN valuation_amount_aud > 0
                                 THEN ROUND(loan_amount_aud / valuation_amount_aud * 100, 4)
                                 ELSE NULL END) VIRTUAL COMMENT '自动计算LVR(%)=贷款/评估值*100',
  
  -- 违约与处置
  default_rate_pa_pct      DECIMAL(5,2)    NULL     COMMENT '违约年化利率(%)',
  default_triggers         VARCHAR(500)    NULL     COMMENT '违约触发条件',
  default_process          VARCHAR(1000)   NULL     COMMENT '违约处置流程',
  
  -- 链上与文档
  issuer_token_desc        VARCHAR(500)    NULL     COMMENT '发行人股权/份额代币描述',
  loan_token_desc          VARCHAR(500)    NULL     COMMENT '借贷代币(本金/利息分配)描述',
  valuation_report_url     VARCHAR(500)    NULL     COMMENT '估值报告PDF链接',
  mortgage_deed_url        VARCHAR(500)    NULL     COMMENT '抵押文件PDF链接',
  kyc_required             TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '是否要求KYC(1是/0否)',
  
  -- 元信息
  created_at               TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at               TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  PRIMARY KEY (id),
  UNIQUE KEY uk_project_code (project_code),
  KEY idx_borrower (borrower_name),
  KEY idx_property (property_address),
  KEY idx_drawdown (drawdown_date),
  KEY idx_maturity (maturity_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='RWA抵押贷款项目（单表版）';

