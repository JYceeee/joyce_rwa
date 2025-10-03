const { deploySmartContractsToTestnet } = require('./src/routers/route_handler/unifiedProjectRouter_Handler');

// 测试错误处理
async function testErrorHandling() {
  try {
    console.log('🧪 开始测试错误处理...');
    
    // 测试1: 无效的项目代码
    console.log('\n测试1: 无效的项目代码');
    try {
      await deploySmartContractsToTestnet({
        projectCode: '',
        tradeType: 'buy',
        amount: 1,
        userAddress: '0x1234567890123456789012345678901234567890'
      });
    } catch (error) {
      console.log('✅ 错误处理正常:', error.message);
    }
    
    // 测试2: 无效的用户地址
    console.log('\n测试2: 无效的用户地址');
    try {
      await deploySmartContractsToTestnet({
        projectCode: 'RWA001',
        tradeType: 'buy',
        amount: 1,
        userAddress: 'invalid_address'
      });
    } catch (error) {
      console.log('✅ 错误处理正常:', error.message);
    }
    
    // 测试3: 环境变量未配置
    console.log('\n测试3: 环境变量未配置');
    try {
      await deploySmartContractsToTestnet({
        projectCode: 'RWA001',
        tradeType: 'buy',
        amount: 1,
        userAddress: '0x1234567890123456789012345678901234567890'
      });
    } catch (error) {
      console.log('✅ 错误处理正常:', error.message);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testErrorHandling();
