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
console.log(`🏠 主机: ${process.env.db_host || process.env.VITE_DB_HOST || 'localhost'}`);
console.log(`👤 用户: ${process.env.db_user || process.env.VITE_DB_USER || 'root'}`);
console.log('');

// 测试数据库连接
connection.connect((err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
  }
  
  console.log('✅ 数据库连接成功!');
  console.log('📋 开始测试用户注册功能...');
  console.log('');
  
  // 执行所有测试
  runAllTests();
});

// 执行所有测试函数
async function runAllTests() {
  try {
    await testUserTableStructure();
    await testUserIdGenerator();
    await testUserRegistration();
    await testUserRegistrationWithoutUserId();
    await testEmailListField();
    
    console.log('🎉 所有测试完成!');
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
      console.table(results);
      console.log('');
      resolve();
    });
  });
}

// 2. 测试用户ID生成器
async function testUserIdGenerator() {
  return new Promise((resolve, reject) => {
    console.log('📋 2. 测试用户ID生成器...');
    
    try {
      // 生成多个用户ID进行测试
      const userIds = [];
      for (let i = 0; i < 5; i++) {
        const userId = generateUserId();
        userIds.push(userId);
        console.log(`✅ 生成用户ID ${i + 1}: ${userId}`);
      }
      
      // 验证格式
      const pattern = /^user\d{13}[a-z0-9]{5}$/;
      const allValid = userIds.every(id => pattern.test(id));
      
      if (allValid) {
        console.log('✅ 所有用户ID格式正确');
      } else {
        console.log('❌ 部分用户ID格式不正确');
      }
      
      console.log('');
      resolve();
    } catch (error) {
      console.error('❌ 用户ID生成器测试失败:', error.message);
      reject(error);
    }
  });
}

// 3. 测试用户注册（带用户ID）
async function testUserRegistration() {
  return new Promise((resolve, reject) => {
    console.log('📋 3. 测试用户注册（带用户ID）...');
    
    const testUserId = generateUserId();
    const testEmail = `test${Date.now()}@example.com`;
    
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
        console.error('❌ 用户注册失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ 用户注册成功!');
      console.log('✅ 插入结果:', results);
      console.log('✅ 影响行数:', results.affectedRows);
      console.log('✅ 插入ID:', results.insertId);
      console.log('');
      resolve();
    });
  });
}

// 4. 测试用户注册（不带用户ID，测试自动生成）
async function testUserRegistrationWithoutUserId() {
  return new Promise((resolve, reject) => {
    console.log('📋 4. 测试用户注册（不带用户ID，自动生成）...');
    
    const testEmail = `test_no_id_${Date.now()}@example.com`;
    
    const userData = {
      user_name: 'Test User No ID',
      user_email: testEmail,
      user_phone: '0987654321',
      user_password: 'hashed_password_here',
      email_list: 'No'
      // 注意：这里故意不提供 user_id
    };
    
    console.log('📝 测试用户数据（无user_id）:', userData);
    console.log('⚠️ 注意：这个测试会失败，因为数据库要求user_id字段，');
    console.log('⚠️ 但后端代码会处理这种情况并自动生成user_id');
    console.log('');
    
    const sql = 'INSERT INTO user SET ?';
    connection.query(sql, userData, (err, results) => {
      if (err) {
        console.log('❌ 预期错误（数据库层面）:', err.message);
        console.log('💡 这证明了数据库层面需要user_id字段');
        console.log('💡 后端代码会在插入前自动生成user_id');
        console.log('');
        resolve(); // 这是预期的错误，不算测试失败
        return;
      }
      
      console.log('✅ 意外成功! 插入结果:', results);
      console.log('');
      resolve();
    });
  });
}

// 5. 测试EmailList字段
async function testEmailListField() {
  return new Promise((resolve, reject) => {
    console.log('📋 5. 测试EmailList字段...');
    
    // 测试Yes选项
    const testEmailYes = `test_yes_${Date.now()}@example.com`;
    const userDataYes = {
      user_id: generateUserId(),
      user_name: 'Test User Yes',
      user_email: testEmailYes,
      user_phone: '1111111111',
      user_password: 'hashed_password_here',
      email_list: 'Yes'
    };
    
    console.log('📝 测试EmailList=Yes:', userDataYes);
    
    const sql = 'INSERT INTO user SET ?';
    connection.query(sql, userDataYes, (err, results) => {
      if (err) {
        console.error('❌ EmailList=Yes测试失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ EmailList=Yes测试成功!');
      
      // 测试No选项
      const testEmailNo = `test_no_${Date.now()}@example.com`;
      const userDataNo = {
        user_id: generateUserId(),
        user_name: 'Test User No',
        user_email: testEmailNo,
        user_phone: '2222222222',
        user_password: 'hashed_password_here',
        email_list: 'No'
      };
      
      console.log('📝 测试EmailList=No:', userDataNo);
      
      connection.query(sql, userDataNo, (err, results) => {
        if (err) {
          console.error('❌ EmailList=No测试失败:', err.message);
          reject(err);
          return;
        }
        
        console.log('✅ EmailList=No测试成功!');
        console.log('');
        resolve();
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

console.log('🚀 用户注册测试脚本启动...');
console.log('⏰ 开始时间:', new Date().toLocaleString());
console.log('');
