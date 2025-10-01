// fix-tradeproject-display.js - TradeProjectView显示问题修复脚本

console.log('🔧 TradeProjectView 显示问题修复脚本启动');

// 检查常见问题
const diagnostics = {
  // 1. 检查路由配置
  checkRoutes() {
    console.log('📋 检查路由配置...');
    const routes = [
      '/trade/RWA001',
      '/trade/RWA002', 
      '/trade/RWA007'
    ];
    
    routes.forEach(route => {
      console.log(`路由: ${route} - 测试链接: http://localhost:5173${route}`);
    });
    
    return routes;
  },
  
  // 2. 检查后端API
  async checkBackendAPI() {
    console.log('🌐 检查后端API...');
    const testCases = [
      'http://localhost:3000/api/project',
      'http://localhost:3000/api/project/RWA001',
      'http://localhost:3000/api/project/RWA002',
      'http://localhost:3000/api/project/RWA007'
    ];
    
    const results = {};
    
    for (const url of testCases) {
      try {
        console.log(`测试: ${url}`);
        const response = await fetch(url);
        const data = await response.json();
        
        results[url] = {
          status: response.status,
          ok: response.ok,
          data: data.status === 0 ? '成功' : `错误: ${data.message}`,
          hasData: data.data ? '有数据' : '无数据'
        };
        
        console.log(`✅ ${url}: ${response.ok ? '成功' : '失败'} - ${data.status === 0 ? '有数据' : data.message}`);
      } catch (error) {
        results[url] = {
          status: 'ERROR',
          ok: false,
          error: error.message
        };
        console.error(`❌ ${url}: ${error.message}`);
      }
    }
    
    return results;
  },
  
  // 3. 检查Vue组件
  checkVueComponent() {
    console.log('🎯 检查Vue组件...');
    
    // 检查组件是否正确导入
    const componentChecks = {
      'TradeProjectView.vue': '存在',
      'TradeProjectViewTest.vue': '存在',
      '路由配置': '已配置 /trade/:code'
    };
    
    console.log('组件状态:', componentChecks);
    return componentChecks;
  },
  
  // 4. 检查常见错误
  checkCommonErrors() {
    console.log('⚠️ 检查常见错误...');
    
    const commonErrors = [
      '后端服务器未运行 (端口3000)',
      '数据库连接失败',
      'API端点不存在',
      '路由参数错误',
      '组件语法错误',
      'JavaScript运行时错误',
      'CSS样式问题',
      '网络请求失败'
    ];
    
    console.log('常见问题列表:', commonErrors);
    return commonErrors;
  },
  
  // 5. 生成修复建议
  generateFixSuggestions() {
    console.log('💡 生成修复建议...');
    
    const suggestions = [
      {
        problem: 'TradeProjectView不显示',
        solutions: [
          '1. 检查后端服务器是否运行: npm start (在Mysql目录)',
          '2. 检查数据库连接和项目数据',
          '3. 访问测试路由: /trade-test/RWA001',
          '4. 检查浏览器控制台错误',
          '5. 清除浏览器缓存并刷新',
          '6. 检查路由URL是否正确'
        ]
      },
      {
        problem: 'API请求失败',
        solutions: [
          '1. 确保后端服务器在localhost:3000运行',
          '2. 检查API端点 /api/project/:code',
          '3. 验证数据库中有项目数据',
          '4. 检查网络连接'
        ]
      },
      {
        problem: '组件加载失败',
        solutions: [
          '1. 检查组件文件路径',
          '2. 验证组件语法',
          '3. 检查依赖导入',
          '4. 使用测试组件 /trade-test/:code'
        ]
      }
    ];
    
    console.log('修复建议:', suggestions);
    return suggestions;
  }
};

// 运行诊断
async function runDiagnostics() {
  console.log('🚀 开始TradeProjectView诊断...');
  
  try {
    // 检查路由
    diagnostics.checkRoutes();
    
    // 检查后端API
    const apiResults = await diagnostics.checkBackendAPI();
    
    // 检查Vue组件
    diagnostics.checkVueComponent();
    
    // 检查常见错误
    diagnostics.checkCommonErrors();
    
    // 生成修复建议
    diagnostics.generateFixSuggestions();
    
    // 生成诊断报告
    const report = {
      timestamp: new Date().toISOString(),
      routes: diagnostics.checkRoutes(),
      apiResults,
      componentStatus: diagnostics.checkVueComponent(),
      commonErrors: diagnostics.checkCommonErrors(),
      suggestions: diagnostics.generateFixSuggestions()
    };
    
    console.log('📊 诊断报告:', report);
    
    // 如果API测试失败，提供快速修复
    const failedAPIs = Object.entries(apiResults).filter(([url, result]) => !result.ok);
    if (failedAPIs.length > 0) {
      console.log('🔧 检测到API问题，建议快速修复:');
      console.log('1. 停止当前后端服务器 (Ctrl+C)');
      console.log('2. 导航到 Mysql 目录');
      console.log('3. 运行: npm start');
      console.log('4. 等待服务器启动完成');
      console.log('5. 刷新浏览器页面');
    }
    
    return report;
    
  } catch (error) {
    console.error('❌ 诊断过程中发生错误:', error);
    return { error: error.message };
  }
}

// 自动运行诊断
if (typeof window !== 'undefined') {
  // 浏览器环境
  window.addEventListener('load', () => {
    setTimeout(runDiagnostics, 2000);
  });
} else {
  // Node.js环境
  runDiagnostics().then(report => {
    console.log('✅ 诊断完成');
    process.exit(0);
  }).catch(error => {
    console.error('❌ 诊断失败:', error);
    process.exit(1);
  });
}

// 导出诊断函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { diagnostics, runDiagnostics };
}

console.log('✅ TradeProjectView 修复脚本加载完成');
