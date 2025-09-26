// 测试API接口的脚本
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 开始测试RWA项目API接口...\n');

  try {
    // 测试获取所有产品
    console.log('1. 测试获取所有产品...');
    const response = await fetch(`${API_BASE_URL}/product_details`);
    const data = await response.json();
    
    if (data.status === 0) {
      console.log('✅ 获取所有产品成功');
      console.log(`   返回产品数量: ${data.data.length}`);
      console.log(`   产品列表: ${data.data.map(p => p.code).join(', ')}`);
    } else {
      console.log('❌ 获取所有产品失败:', data.message);
    }

    console.log('\n2. 测试获取单个产品...');
    const singleResponse = await fetch(`${API_BASE_URL}/product_details/RWA001`);
    const singleData = await singleResponse.json();
    
    if (singleData.status === 0) {
      console.log('✅ 获取单个产品成功');
      console.log(`   产品名称: ${singleData.data.name}`);
      console.log(`   产品状态: ${singleData.data.status}`);
    } else {
      console.log('❌ 获取单个产品失败:', singleData.message);
    }

    console.log('\n3. 测试更新产品订阅信息...');
    const updateResponse = await fetch(`${API_BASE_URL}/product_details/RWA001/subscription`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_subscribed_token: 'A$400,000'
      })
    });
    const updateData = await updateResponse.json();
    
    if (updateData.status === 0) {
      console.log('✅ 更新产品订阅信息成功');
    } else {
      console.log('❌ 更新产品订阅信息失败:', updateData.message);
    }

    console.log('\n4. 验证更新后的数据...');
    const verifyResponse = await fetch(`${API_BASE_URL}/product_details/RWA001`);
    const verifyData = await verifyResponse.json();
    
    if (verifyData.status === 0) {
      console.log('✅ 验证更新成功');
      console.log(`   更新后的认购额度: ${verifyData.data.subscribed}`);
    } else {
      console.log('❌ 验证更新失败:', verifyData.message);
    }

    console.log('\n🎉 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    console.log('\n请确保：');
    console.log('1. MySQL服务正在运行');
    console.log('2. 数据库已初始化（运行 init_database.sql）');
    console.log('3. 后端服务器正在运行（node index.js）');
  }
}

// 运行测试
testAPI();
