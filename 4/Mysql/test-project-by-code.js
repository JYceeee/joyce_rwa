const mysql = require('./src/database/index');

async function testGetProjectByCode() {
  try {
    console.log('🔍 测试根据代码获取项目详情...');
    
    const code = 'RWA001';
    const sql = `
      SELECT 
        id, project_code, project_name, loan_status, created_at,
        subscribe_token, total_offering_token,
        property_location, property_state, property_type, property_value, property_summary,
        loan_type, loan_product, loan_amount, loan_purpose,
        loan_term_months, lvr, interest_rate, default_rate,
        commencement_date, expiry_date, expected_recovery_date
      FROM project 
      WHERE project_code = ?
    `;
    
    console.log('SQL查询:', sql);
    console.log('查询参数:', [code]);
    
    const [rows] = await mysql.promise().execute(sql, [code]);
    console.log('查询结果行数:', rows.length);
    
    if (rows.length === 0) {
      console.log('❌ 项目不存在');
      return;
    }
    
    const project = rows[0];
    console.log('✅ 找到项目:', {
      id: project.id,
      project_code: project.project_code,
      project_name: project.project_name,
      loan_status: project.loan_status
    });
    
    console.log('📋 完整项目数据:', project);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    mysql.end();
  }
}

testGetProjectByCode();
