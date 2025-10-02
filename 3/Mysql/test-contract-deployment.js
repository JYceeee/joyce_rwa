const { deploySmartContractsToTestnet } = require('./src/routers/route_handler/unifiedProjectRouter_Handler');

// 测试合约部署API
async function testContractDeployment() {
  try {
    console.log('🧪 开始测试合约部署API...');
    
    const params = {
      projectCode: 'RWA001',
      tradeType: 'buy',
      amount: 1,
      userAddress: '0x1234567890123456789012345678901234567890'
    };
    
    console.log('测试参数:', params);
    
    const result = await deploySmartContractsToTestnet(params);
    
    console.log('✅ 合约部署API测试成功！');
    console.log('结果:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ 合约部署API测试失败:', error);
  }
}

// 运行测试
testContractDeployment();
