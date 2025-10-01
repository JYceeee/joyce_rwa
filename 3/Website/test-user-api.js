// test-user-api.js - 测试用户API端点

console.log('🧪 开始测试用户API端点...');

async function testUserAPI() {
  const apiUrl = 'http://localhost:3000/user';
  
  try {
    console.log(`🔍 测试API端点: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 API响应状态:', response.status, response.statusText);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ API响应成功:');
      console.log('📊 用户数据:', JSON.stringify(userData, null, 2));
      
      // 验证数据结构
      const expectedFields = ['name', 'email', 'firstName', 'lastName', 'phone'];
      const missingFields = expectedFields.filter(field => !userData.hasOwnProperty(field));
      
      if (missingFields.length === 0) {
        console.log('✅ 所有期望字段都存在');
      } else {
        console.log('⚠️ 缺少字段:', missingFields);
      }
      
      // 检查关键字段
      if (userData.name) {
        console.log('✅ 用户名存在:', userData.name);
      } else {
        console.log('❌ 用户名为空');
      }
      
      if (userData.email) {
        console.log('✅ 用户邮箱存在:', userData.email);
      } else {
        console.log('❌ 用户邮箱为空');
      }
      
      return {
        success: true,
        data: userData,
        status: response.status
      };
      
    } else {
      console.error('❌ API请求失败:', response.status, response.statusText);
      
      // 尝试获取错误详情
      try {
        const errorData = await response.text();
        console.log('📄 错误详情:', errorData);
      } catch (e) {
        console.log('📄 无法获取错误详情');
      }
      
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status
      };
    }
    
  } catch (error) {
    console.error('❌ 网络请求失败:', error.message);
    return {
      success: false,
      error: error.message,
      status: 'NETWORK_ERROR'
    };
  }
}

// 运行测试
async function runTest() {
  console.log('🚀 开始用户API测试...');
  
  const result = await testUserAPI();
  
  console.log('\n📊 测试结果总结:');
  console.log('成功:', result.success);
  console.log('状态:', result.status);
  
  if (result.success) {
    console.log('✅ 用户API测试通过');
    console.log('📋 用户数据可用于Profile页面');
  } else {
    console.log('❌ 用户API测试失败');
    console.log('🔧 请检查:');
    console.log('1. 后端服务器是否运行在 localhost:3000');
    console.log('2. API端点 /user 是否正确配置');
    console.log('3. 数据库连接是否正常');
    console.log('4. 用户数据是否存在');
  }
  
  return result;
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
  window.testUserAPI = testUserAPI;
  window.runUserAPITest = runTest;
  console.log('✅ 测试函数已加载到浏览器全局对象');
  console.log('💡 在控制台中运行: runUserAPITest()');
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testUserAPI, runTest };
  
  // 自动运行测试
  runTest().then(result => {
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('❌ 测试运行失败:', error);
    process.exit(1);
  });
}

console.log('✅ 用户API测试脚本加载完成');
