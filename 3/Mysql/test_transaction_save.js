// 测试交易历史保存功能
const axios = require('axios');

// 测试数据
const testTransactionData = {
  projectCode: 'RWA001',
  tradeType: 'buy',
  amount: 100,
  price: 1.0,
  total: 100.0,
  userAddress: '0x1234567890123456789012345678901234567890',
  transactionHash: '0xabc123def45678901234567890123456789012345678901234567890123456789012',
  blockNumber: 1448109
};

// API端点
const apiUrl = import.meta.env.VITE_API_BASE_URL + '/user/transactionhistory';

async function testTransactionSave() {
  try {
    console.log('🧪 开始测试交易历史保存功能...');
    console.log('📊 测试数据:', JSON.stringify(testTransactionData, null, 2));
    
    const response = await axios.post(apiUrl, testTransactionData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10秒超时
    });
    
    console.log('✅ 测试成功!');
    console.log('📈 响应状态:', response.status);
    console.log('📈 响应数据:', JSON.stringify(response.data, null, 2));
    
    // 验证响应数据
    if (response.data.status === 0) {
      console.log('✅ 交易历史保存成功');
      console.log('🆔 交易ID:', response.data.data.id);
      console.log('👤 用户ID:', response.data.data.userId);
      console.log('🔗 交易哈希:', response.data.data.transactionHash);
    } else {
      console.log('❌ 交易历史保存失败:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    if (error.response) {
      console.error('📊 错误响应状态:', error.response.status);
      console.error('📊 错误响应数据:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('🌐 网络请求失败:', error.request);
    } else {
      console.error('🔧 请求配置错误:', error.message);
    }
  }
}

// 测试多次保存（验证用户创建和重用）
async function testMultipleTransactions() {
  console.log('\n🧪 开始测试多次交易保存...');
  
  const testAddresses = [
    '0x1234567890123456789012345678901234567890',
    '0x9876543210987654321098765432109876543210',
    '0x1111111111111111111111111111111111111111'
  ];
  
  for (let i = 0; i < testAddresses.length; i++) {
    const testData = {
      ...testTransactionData,
      userAddress: testAddresses[i],
      amount: (i + 1) * 50,
      total: (i + 1) * 50
    };
    
    console.log(`\n📊 测试第${i + 1}个交易，地址: ${testData.userAddress}`);
    
    try {
      const response = await axios.post(apiUrl, testData);
      console.log('✅ 成功:', response.data.data.userId);
    } catch (error) {
      console.error('❌ 失败:', error.response?.data?.message || error.message);
    }
    
    // 等待1秒避免过快请求
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// 运行测试
async function runTests() {
  console.log('🚀 开始运行交易历史保存测试...\n');
  
  await testTransactionSave();
  await testMultipleTransactions();
  
  console.log('\n🏁 测试完成!');
}

// 如果直接运行此脚本
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testTransactionSave,
  testMultipleTransactions,
  runTests
};
