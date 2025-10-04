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
  console.log('📋 开始测试完整注册流程...');
  console.log('');
  
  // 执行所有测试
  runAllTests();
});

// 执行所有测试函数
async function runAllTests() {
  try {
    await testUserTableStructure();
    await testCompleteUserRegistration();
    await testUserRegistrationWithAllFields();
    await testUserRegistrationWithPartialFields();
    await testEmailListField();
    
    console.log('🎉 所有注册测试完成!');
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

// 1. 测试用户表结构
async function testUserTableStructure() {
  return new Promise((resolve, reject) => {
    console.log('📋 1. 检查user表结构...');
    
    const sql = 'DESCRIBE user';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('❌ 获取用户表结构失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ user表结构:');
      results.forEach(field => {
        if (['user_name', 'user_phone', 'email_list', 'user_email'].includes(field.Field)) {
          console.log(`   ${field.Field}: ${field.Type} | Default: ${field.Default} | Null: ${field.Null}`);
        }
      });
      console.log('');
      resolve();
    });
  });
}

// 2. 测试完整用户注册（所有字段）
async function testCompleteUserRegistration() {
  return new Promise((resolve, reject) => {
    console.log('📋 2. 测试完整用户注册（所有字段）...');
    
    const testUserId = generateUserId();
    const testEmail = `complete_test_${Date.now()}@example.com`;
    
    const userData = {
      user_id: testUserId,
      user_name: 'John Doe',
      user_email: testEmail,
      user_phone: '1234567890',
      user_password: 'hashed_password_here',
      email_list: 'Yes'
    };
    
    console.log('📝 完整用户数据:', userData);
    
    const sql = 'INSERT INTO user SET ?';
    connection.query(sql, userData, (err, results) => {
      if (err) {
        console.error('❌ 完整用户注册失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ 完整用户注册成功!');
      console.log('✅ 插入结果:', results);
      console.log('✅ 影响行数:', results.affectedRows);
      console.log('✅ 插入ID:', results.insertId);
      console.log('');
      resolve();
    });
  });
}

// 3. 测试用户注册（所有字段，包括空值处理）
async function testUserRegistrationWithAllFields() {
  return new Promise((resolve, reject) => {
    console.log('📋 3. 测试用户注册（包含空值处理）...');
    
    const testUserId = generateUserId();
    const testEmail = `all_fields_test_${Date.now()}@example.com`;
    
    // 模拟后端处理逻辑
    const userData = {
      user_name: 'Jane Smith', // 有值
      user_password: 'hashed_password_here',
      user_id: testUserId,
      user_email: testEmail,
      user_phone: '0987654321', // 有值
      email_list: 'No' // 有值
    };
    
    console.log('📝 处理后用户数据:', userData);
    
    const sql = 'INSERT INTO user SET ?';
    connection.query(sql, userData, (err, results) => {
      if (err) {
        console.error('❌ 用户注册失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ 用户注册成功!');
      console.log('✅ 插入结果:', results);
      console.log('');
      resolve();
    });
  });
}

// 4. 测试部分字段注册（模拟用户只填写部分信息）
async function testUserRegistrationWithPartialFields() {
  return new Promise((resolve, reject) => {
    console.log('📋 4. 测试部分字段注册（模拟用户只填写部分信息）...');
    
    const testUserId = generateUserId();
    const testEmail = `partial_test_${Date.now()}@example.com`;
    
    // 模拟用户只填写了email和password，其他字段为空
    const userData = {
      user_name: 'User', // 后端默认值
      user_password: 'hashed_password_here',
      user_id: testUserId,
      user_email: testEmail,
      user_phone: '', // 空字符串
      email_list: 'No' // 后端默认值
    };
    
    console.log('📝 部分字段用户数据:', userData);
    
    const sql = 'INSERT INTO user SET ?';
    connection.query(sql, userData, (err, results) => {
      if (err) {
        console.error('❌ 部分字段用户注册失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ 部分字段用户注册成功!');
      console.log('✅ 插入结果:', results);
      console.log('');
      resolve();
    });
  });
}

// 5. 测试EmailList字段的各种情况
async function testEmailListField() {
  return new Promise((resolve, reject) => {
    console.log('📋 5. 测试EmailList字段的各种情况...');
    
    const tests = [
      { email_list: 'Yes', description: '用户选择接收邮件' },
      { email_list: 'No', description: '用户不选择接收邮件' },
      { email_list: null, description: 'email_list为null' },
      { email_list: undefined, description: 'email_list为undefined' }
    ];
    
    let completedTests = 0;
    
    tests.forEach((test, index) => {
      const testUserId = generateUserId();
      const testEmail = `email_test_${Date.now()}_${index}@example.com`;
      
      const userData = {
        user_id: testUserId,
        user_name: 'Email Test User',
        user_email: testEmail,
        user_phone: '5555555555',
        user_password: 'hashed_password_here',
        email_list: test.email_list || 'No' // 后端默认处理
      };
      
      console.log(`📝 ${test.description}:`, userData);
      
      const sql = 'INSERT INTO user SET ?';
      connection.query(sql, userData, (err, results) => {
        if (err) {
          console.error(`❌ ${test.description} 测试失败:`, err.message);
        } else {
          console.log(`✅ ${test.description} 测试成功!`);
        }
        
        completedTests++;
        if (completedTests === tests.length) {
          console.log('');
          resolve();
        }
      });
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

console.log('🚀 完整注册流程测试脚本启动...');
console.log('⏰ 开始时间:', new Date().toLocaleString());
console.log('');
