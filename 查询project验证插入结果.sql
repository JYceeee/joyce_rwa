-- 查询验证插入结果
SELECT 
    project_id,
    name,
    issuer,
    loan_amount,
    collateral_value,
    status
FROM projects 
WHERE project_id = 'RWA001';