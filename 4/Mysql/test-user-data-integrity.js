const mysql = require('mysql2');
const dotenv = require('dotenv');
const { generateUserId } = require('./src/utils/userIdGenerator');

// 加载环境变量
dotenv.config();

// 创建数据库连接
const connection = mysql.createConnection({
  host: process.env.db_host || process.env.VITE_DB_HOST || 'localhost',
  user: process.env.db_user || process.env.VITE_DB_USER || 'root',
  password: process.env.db_password || process.env.VITE_DB_PASSWORD || '123456',
  database: process.env.db_name || process.env.VITE_DB_NAME || 'rwa',
  port: process.env.db_port || process.env.VITE_DB_PORT || 3306,
});

console.log('🔗 正在连接到MySQL数据库...');
console.log(`📊 数据库: ${process.env.db_name || process.env.VITE_DB_NAME || 'rwa'}`);
console.log('');

// 测试数据库连接
connection.connect((err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
  }
  
  console.log('✅ 数据库连接成功!');
  console.log('📋 开始测试用户数据完整性...');
  console.log('');
  
  // 执行所有测试
  runAllTests();
});

// 执行所有测试函数
async function runAllTests() {
  try {
    await checkExistingUserData();
    await testUserTableConstraints();
    await testNewUserRegistration();
    await verifyDataIntegrity();
    
    console.log('🎉 用户数据完整性测试完成!');
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    // 关闭数据库连接
    connection.end((err) => {
      if (err) {
        console.error('❌ 关闭数据库连接失败:', err.message);
      } else {
        console.log('🔒 数据库连接已关闭');
      }
    });
  }
}

// 1. 检查现有用户数据
async function checkExistingUserData() {
  return new Promise((resolve, reject) => {
    console.log('📋 1. 检查现有用户数据...');
    
    const sql = `
      SELECT 
        id,
        user_id,
        user_name,
        user_phone,
        email_list,
        user_email,
        CASE 
          WHEN user_id IS NULL THEN '❌ user_id缺失'
          WHEN user_name IS NULL THEN '❌ user_name缺失'
          WHEN user_phone IS NULL THEN '❌ user_phone缺失'
          WHEN email_list IS NULL THEN '❌ email_list缺失'
          ELSE '✅ 数据完整'
        END as data_status
      FROM user 
      ORDER BY id
    `;
    
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('❌ 检查现有用户数据失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('📊 现有用户数据状态:');
      console.table(results);
      
      // 统计缺失数据
      const nullCounts = {
        user_id: results.filter(r => r.user_id === null).length,
        user_name: results.filter(r => r.user_name === null).length,
        user_phone: results.filter(r => r.user_phone === null).length,
        email_list: results.filter(r => r.email_list === null).length
      };
      
      console.log('📈 缺失数据统计:');
      Object.entries(nullCounts).forEach(([field, count]) => {
        if (count > 0) {
          console.log(`   ❌ ${field}: ${count}条记录缺失`);
        } else {
          console.log(`   ✅ ${field}: 无缺失数据`);
        }
      });
      
      console.log('');
      resolve();
    });
  });
}

// 2. 测试用户表约束
async function testUserTableConstraints() {
  return new Promise((resolve, reject) => {
    console.log('📋 2. 测试用户表约束...');
    
    const sql = `
      SELECT 
        COLUMN_NAME,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'rwa' 
      AND TABLE_NAME = 'user'
      AND COLUMN_NAME IN ('user_id', 'user_name', 'user_phone', 'email_list')
      ORDER BY ORDINAL_POSITION
    `;
    
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('❌ 检查表约束失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('📊 用户表约束状态:');
      console.table(results);
      
      // 检查关键约束
      const constraints = {
        'user_id不能为NULL': results.find(r => r.COLUMN_NAME === 'user_id')?.IS_NULLABLE === 'NO',
        'user_name不能为NULL': results.find(r => r.COLUMN_NAME === 'user_name')?.IS_NULLABLE === 'NO',
        'user_phone不能为NULL': results.find(r => r.COLUMN_NAME === 'user_phone')?.IS_NULLABLE === 'NO',
        'email_list不能为NULL': results.find(r => r.COLUMN_NAME === 'email_list')?.IS_NULLABLE === 'NO'
      };
      
      console.log('🔒 约束检查结果:');
      Object.entries(constraints).forEach(([constraint, isEnforced]) => {
        console.log(`   ${isEnforced ? '✅' : '❌'} ${constraint}`);
      });
      
      console.log('');
      resolve();
    });
  });
}

// 3. 测试新用户注册
async function testNewUserRegistration() {
  return new Promise((resolve, reject) => {
    console.log('📋 3. 测试新用户注册...');
    
    const testUserId = generateUserId();
    const testEmail = `integrity_test_${Date.now()}@example.com`;
    
    // 模拟完整的用户数据
    const userData = {
      user_id: testUserId,
      user_name: 'Test User',
      user_email: testEmail,
      user_phone: '1234567890',
      user_password: 'hashed_password_here',
      email_list: 'Yes'
    };
    
    console.log('📝 测试用户数据:', userData);
    
    const sql = 'INSERT INTO user SET ?';
    connection.query(sql, userData, (err, results) => {
      if (err) {
        console.error('❌ 新用户注册测试失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ 新用户注册测试成功!');
      console.log('✅ 插入结果:', results);
      
      // 验证插入的数据
      const verifySql = 'SELECT * FROM user WHERE id = ?';
      connection.query(verifySql, [results.insertId], (err, verifyResults) => {
        if (err) {
          console.error('❌ 验证插入数据失败:', err.message);
          reject(err);
          return;
        }
        
        console.log('📊 验证插入的数据:');
        const user = verifyResults[0];
        console.log(`   user_id: ${user.user_id ? '✅' : '❌'} ${user.user_id}`);
        console.log(`   user_name: ${user.user_name ? '✅' : '❌'} ${user.user_name}`);
        console.log(`   user_phone: ${user.user_phone !== null ? '✅' : '❌'} ${user.user_phone}`);
        console.log(`   email_list: ${user.email_list ? '✅' : '❌'} ${user.email_list}`);
        console.log('');
        resolve();
      });
    });
  });
}

// 4. 验证数据完整性
async function verifyDataIntegrity() {
  return new Promise((resolve, reject) => {
    console.log('📋 4. 验证数据完整性...');
    
    const sql = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(user_id) as users_with_user_id,
        COUNT(user_name) as users_with_user_name,
        COUNT(user_phone) as users_with_user_phone,
        COUNT(email_list) as users_with_email_list,
        COUNT(CASE WHEN user_id IS NOT NULL AND user_name IS NOT NULL AND user_phone IS NOT NULL AND email_list IS NOT NULL THEN 1 END) as complete_records
      FROM user
    `;
    
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('❌ 验证数据完整性失败:', err.message);
        reject(err);
        return;
      }
      
      const stats = results[0];
      console.log('📊 数据完整性统计:');
      console.log(`   总用户数: ${stats.total_users}`);
      console.log(`   有user_id的用户: ${stats.users_with_user_id}`);
      console.log(`   有user_name的用户: ${stats.users_with_user_name}`);
      console.log(`   有user_phone的用户: ${stats.users_with_user_phone}`);
      console.log(`   有email_list的用户: ${stats.users_with_email_list}`);
      console.log(`   完整记录数: ${stats.complete_records}`);
      
      const integrityPercentage = (stats.complete_records / stats.total_users * 100).toFixed(2);
      console.log(`   数据完整性: ${integrityPercentage}%`);
      
      if (integrityPercentage === '100.00') {
        console.log('✅ 所有用户数据完整!');
      } else {
        console.log('⚠️ 存在数据缺失，需要运行修复脚本');
      }
      
      console.log('');
      resolve();
    });
  });
}

// 错误处理
process.on('unhandledRejection', (err) => {
  console.error('❌ 未处理的Promise拒绝:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ 未捕获的异常:', err);
  process.exit(1);
});

console.log('🚀 用户数据完整性测试脚本启动...');
console.log('⏰ 开始时间:', new Date().toLocaleString());
console.log('');
