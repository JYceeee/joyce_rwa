import { deployContractsForAPI } from './scripts/api-deploy.js';

// 测试部署功能
async function testDeployment() {
  try {
    console.log('🧪 开始测试合约部署...');
    
    const result = await deployContractsForAPI(
      'RWA001',  // projectCode
      'buy',     // tradeType
      '1',       // amount
      '0x1234567890123456789012345678901234567890' // userAddress
    );
    
    console.log('✅ 测试部署成功！');
    console.log('结果:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ 测试部署失败:', error);
  }
}

// 运行测试
testDeployment();
