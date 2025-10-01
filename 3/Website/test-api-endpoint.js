import fetch from 'node-fetch';

async function testAPIEndpoint() {
  console.log('🔍 测试API端点...');
  
  try {
    // 测试获取所有项目
    console.log('\n1. 测试获取所有项目...');
    const allProjectsResponse = await fetch('http://localhost:3000/api/project');
    console.log('状态码:', allProjectsResponse.status);
    const allProjectsData = await allProjectsResponse.json();
    console.log('返回数据:', allProjectsData);
    
    // 测试根据代码获取项目
    console.log('\n2. 测试根据代码获取RWA001项目...');
    const projectResponse = await fetch('http://localhost:3000/api/project/RWA001');
    console.log('状态码:', projectResponse.status);
    const projectData = await projectResponse.json();
    console.log('返回数据:', projectData);
    
  } catch (error) {
    console.error('❌ API测试失败:', error);
  }
}

testAPIEndpoint();
