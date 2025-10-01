const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'rwa'
});

console.log('🔍 检查数据库连接和RWA001项目数据...');

connection.query('SELECT project_code, project_name, loan_status FROM project WHERE project_code = ?', ['RWA001'], (err, results) => {
  if (err) {
    console.error('❌ 数据库查询错误:', err);
  } else {
    console.log('✅ RWA001项目数据:', results);
    if (results.length === 0) {
      console.log('⚠️ 数据库中不存在RWA001项目');
    }
  }
  
  // 检查所有项目代码
  connection.query('SELECT project_code, project_name, loan_status FROM project', (err2, allResults) => {
    if (err2) {
      console.error('❌ 查询所有项目错误:', err2);
    } else {
      console.log('📋 数据库中的所有项目:', allResults);
    }
    connection.end();
  });
});
