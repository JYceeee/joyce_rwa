// 调试API调用
const testAPI = async () => {
  try {
    console.log('🔍 测试API调用...');
    
    // 测试正确的API路径
    const response = await fetch('http://localhost:3000/api/project/RWA001', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ API调用成功:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ API调用失败:', error);
    throw error;
  }
};

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
} else {
  // 如果在Node.js环境中运行
  testAPI().then(result => {
    console.log('测试完成:', result);
  }).catch(error => {
    console.error('测试失败:', error);
  });
}
