const mysql = require('mysql2');
const dotenv = require('dotenv');

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
console.log('📋 测试TradeProjectView数据映射...');
console.log('');

// 测试数据库连接
connection.connect((err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
  }
  
  console.log('✅ 数据库连接成功!');
  console.log('');
  
  // 执行TradeProjectView数据映射测试
  runTradeProjectMappingTests();
});

// 执行TradeProjectView数据映射测试
async function runTradeProjectMappingTests() {
  try {
    await testProjectDataMapping('RWA001');
    await testProjectDataMapping('RWA002');
    await testProjectDataMapping('RWA007');
    
    console.log('🎉 所有TradeProjectView数据映射测试完成!');
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

// 测试TradeProjectView数据映射
async function testProjectDataMapping(code) {
  return new Promise((resolve, reject) => {
    console.log(`📋 测试项目 ${code} 的TradeProjectView数据映射...`);
    
    // 使用与TradeProjectView相同的SQL查询
    const sql = `
      SELECT 
        id, project_code, project_name, loan_status, created_at,
        subscribe_token, total_offering_token,
        property_location, property_state, property_type, property_value, property_summary,
        loan_type, loan_product, loan_amount, loan_purpose,
        loan_term_months, lvr, interest_rate, default_rate,
        commencement_date, expiry_date, expected_recovery_date
      FROM project 
      WHERE project_code = ?
    `;
    
    connection.query(sql, [code], (err, results) => {
      if (err) {
        console.error(`❌ 查询项目 ${code} 失败:`, err.message);
        reject(err);
        return;
      }
      
      if (results.length === 0) {
        console.log(`⚠️ 项目 ${code} 不存在`);
        resolve();
        return;
      }
      
      const project = results[0];
      
      // 模拟TradeProjectView的数据映射逻辑
      const totalOfferingRaw = parseFloat(project.total_offering_token) || 0
      const subscribedRaw = parseFloat(project.subscribe_token) || 0
      const subscriptionProgress = totalOfferingRaw > 0 ? (subscribedRaw / totalOfferingRaw * 100).toFixed(2) : 0
      
      const mappedProduct = {
        // 基础信息 - 完全基于数据库字段
        id: project.id,
        code: project.project_code,
        name: project.project_name,
        status: project.loan_status,
        created_at: project.created_at,
        
        // 认购信息 - 基于数据库字段
        totalOffering: totalOfferingRaw > 0 ? `AUD$${totalOfferingRaw.toLocaleString()}` : 'AUD$0',
        subscribed: subscribedRaw > 0 ? `AUD$${subscribedRaw.toLocaleString()}` : 'AUD$0',
        subscriptionProgress: `${subscriptionProgress}%`,
        
        // 原始数值用于计算
        totalOfferingRaw: totalOfferingRaw,
        subscribedRaw: subscribedRaw,
        
        // 物业信息 - 基于数据库字段
        property_location: project.property_location,
        property_state: project.property_state,
        property_type: project.property_type,
        property_value: project.property_value,
        property_summary: project.property_summary,
        
        // 贷款信息 - 基于数据库字段
        loan_type: project.loan_type,
        loan_product: project.loan_product,
        loan_amount: project.loan_amount,
        loan_purpose: project.loan_purpose,
        loan_term_months: project.loan_term_months,
        
        // 贷款比率 - 基于数据库字段
        lvr: project.lvr,
        interest_rate: project.interest_rate,
        default_rate: project.default_rate,
        
        // 贷款周期 - 基于数据库字段
        commencement_date: project.commencement_date,
        expiry_date: project.expiry_date,
        expected_recovery_date: project.expected_recovery_date,
        
        // 前端显示字段 - 基于数据库字段格式化
        subtitle: `${project.loan_product} - ${project.property_type}`,
        loanAmount: project.loan_amount ? `AUD$${parseFloat(project.loan_amount).toLocaleString()}` : 'AUD$0',
        loanTerm: `${project.loan_term_months} months`,
        targetYield: project.interest_rate ? `${project.interest_rate}% p.a.` : 'TBA',
        
        // 兼容字段（用于模板显示）
        propertyType: project.property_type,
        propertyLocation: project.property_location,
        loanProduct: project.loan_product,
        propertyValue: project.property_value ? `AUD$${parseFloat(project.property_value).toLocaleString()}` : 'TBA',
        ltv: project.lvr ? `${project.lvr}%` : 'TBA'
      }
      
      // 添加计算指标 - 基于数据库字段计算
      mappedProduct.metrics = {
        currentElaraPrice: calculateTokenPrice(mappedProduct),
        collateralPropertyValue: project.property_value ? `AUD$${parseFloat(project.property_value).toLocaleString()}` : 'TBA',
        rentalIncome: calculateRentalIncome(mappedProduct),
        targetLoanYield: project.interest_rate ? `${project.interest_rate}% p.a.` : 'TBA',
        loanToValue: project.lvr ? `${project.lvr}%` : 'TBA',
        defaultRate: project.default_rate ? `${project.default_rate}%` : 'TBA'
      }
      
      // 添加时间信息
      mappedProduct.timeline = {
        created: project.created_at,
        commencement: project.commencement_date,
        expiry: project.expiry_date,
        expectedRecovery: project.expected_recovery_date
      }
      
      console.log(`✅ 项目 ${code} 数据映射成功:`);
      console.log('📊 基础信息:');
      console.log(`   代码: ${mappedProduct.code}`);
      console.log(`   名称: ${mappedProduct.name}`);
      console.log(`   状态: ${mappedProduct.status}`);
      console.log(`   副标题: ${mappedProduct.subtitle}`);
      
      console.log('💰 财务信息:');
      console.log(`   贷款金额: ${mappedProduct.loanAmount}`);
      console.log(`   贷款利率: ${mappedProduct.metrics.targetLoanYield}`);
      console.log(`   贷款期限: ${mappedProduct.loanTerm}`);
      console.log(`   物业价值: ${mappedProduct.metrics.collateralPropertyValue}`);
      console.log(`   LTV: ${mappedProduct.metrics.loanToValue}`);
      
      console.log('📈 认购信息:');
      console.log(`   总发行量: ${mappedProduct.totalOffering}`);
      console.log(`   已认购: ${mappedProduct.subscribed}`);
      console.log(`   认购进度: ${mappedProduct.subscriptionProgress}`);
      
      console.log('🏠 物业信息:');
      console.log(`   位置: ${mappedProduct.property_location}`);
      console.log(`   类型: ${mappedProduct.property_type}`);
      console.log(`   状态: ${mappedProduct.property_state}`);
      
      console.log('⏰ 时间信息:');
      console.log(`   创建时间: ${mappedProduct.timeline.created}`);
      console.log(`   开始日期: ${mappedProduct.timeline.commencement}`);
      console.log(`   到期日期: ${mappedProduct.timeline.expiry}`);
      
      console.log('');
      resolve();
    });
  });
}

// 模拟TradeProjectView的计算函数
function calculateTokenPrice(product) {
  // 基于数据库字段计算代币价格
  const basePrice = 1.00
  const yieldMultiplier = (parseFloat(product.interest_rate) || 6.0) / 6.0
  const adjustedPrice = basePrice * yieldMultiplier
  return `AUD$${adjustedPrice.toFixed(2)}`
}

function calculateRentalIncome(product) {
  // 基于数据库字段计算租金收入
  if (!product.property_value || product.property_value === 'TBA') {
    return 'TBA'
  }
  
  const propertyValue = parseFloat(product.property_value) || 0
  const interestRate = parseFloat(product.interest_rate) || 6.0
  const monthlyYield = interestRate / 12 / 100
  const estimatedRental = propertyValue * monthlyYield
  
  return `AUD$${estimatedRental.toLocaleString('en-AU', { maximumFractionDigits: 0 })} / month`
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

console.log('🚀 TradeProjectView数据映射测试脚本启动...');
console.log('⏰ 开始时间:', new Date().toLocaleString());
console.log('');
