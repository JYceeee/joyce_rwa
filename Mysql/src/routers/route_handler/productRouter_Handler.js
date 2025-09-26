const mysql = require('../../database/index');

// 获取所有产品详情列表
const getAllProductDetails = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, code, name, subtitle, type, region, risk, target_yield, status, summary,
        total_offering, subscribed, total_subscription_tokens, subscribed_tokens,
        current_subscription, total_subscription,
        loan_amount, annual_interest_rate, loan_term, ltv, drawdown_date, early_repayment, repayment_arrangement,
        issuer, pw_shareholders, lender, borrower, guarantor,
        disbursement_method, interest, early_repayment_details, maturity_date,
        property_address, valuation, security_rank, lvr,
        default_interest_rate, default_triggers, default_process,
        issuer_token, loan_token, valuation_report, mortgage_deed,
        created_at, updated_at
      FROM product_details 
      ORDER BY created_at DESC
    `;
    
    const [rows] = await mysql.promise().execute(sql);
    
    // 格式化数据以匹配前端期望的字段名
    const formattedProducts = rows.map(product => ({
      id: product.id,
      code: product.code,
      name: product.name,
      subtitle: product.subtitle,
      type: product.type,
      region: product.region,
      risk: product.risk,
      targetYield: product.target_yield,
      status: product.status,
      summary: product.summary,
      
      // 投资信息
      totalOffering: product.total_offering,
      subscribed: product.subscribed,
      totalSubscriptionTokens: product.total_subscription_tokens,
      subscribedTokens: product.subscribed_tokens,
      currentSubscription: product.current_subscription,
      totalSubscription: product.total_subscription,
      
      // 关键事实
      loanAmount: product.loan_amount,
      annualInterestRate: product.annual_interest_rate,
      loanTerm: product.loan_term,
      ltv: product.ltv,
      drawdownDate: product.drawdown_date,
      earlyRepayment: product.early_repayment,
      repaymentArrangement: product.repayment_arrangement,
      
      // 相关主体
      issuer: product.issuer,
      pwShareholders: product.pw_shareholders,
      lender: product.lender,
      borrower: product.borrower,
      guarantor: product.guarantor,
      
      // 提款与利息
      disbursementMethod: product.disbursement_method,
      interest: product.interest,
      earlyRepaymentDetails: product.early_repayment_details,
      maturityDate: product.maturity_date,
      
      // 抵押物
      propertyAddress: product.property_address,
      valuation: product.valuation,
      securityRank: product.security_rank,
      lvr: product.lvr,
      
      // 违约与补救
      defaultInterestRate: product.default_interest_rate,
      defaultTriggers: product.default_triggers,
      defaultProcess: product.default_process,
      
      // 链上与文档
      issuerToken: product.issuer_token,
      loanToken: product.loan_token,
      valuationReport: product.valuation_report,
      mortgageDeed: product.mortgage_deed,
      
      // 系统字段
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      
      // 前端显示需要的字段
      image: getProductImage(product.code)
    }));
    
    res.cc('获取产品详情列表成功', 0, formattedProducts);
  } catch (error) {
    console.error('获取产品详情列表失败:', error);
    res.cc('获取产品详情列表失败', 1);
  }
};

// 根据产品代码获取产品详情
const getProductByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!code) {
      return res.cc('缺少产品代码参数', 1);
    }
    
    const sql = `
      SELECT * FROM product_details 
      WHERE code = ?
    `;
    
    const [rows] = await mysql.promise().execute(sql, [code]);
    
    if (rows.length === 0) {
      return res.cc('产品不存在', 1);
    }
    
    const product = rows[0];
    const formattedProduct = {
      id: product.id,
      code: product.code,
      name: product.name,
      subtitle: product.subtitle,
      type: product.type,
      region: product.region,
      risk: product.risk,
      targetYield: product.target_yield,
      status: product.status,
      summary: product.summary,
      
      // 投资信息
      totalOffering: product.total_offering,
      subscribed: product.subscribed,
      totalSubscriptionTokens: product.total_subscription_tokens,
      subscribedTokens: product.subscribed_tokens,
      currentSubscription: product.current_subscription,
      totalSubscription: product.total_subscription,
      
      // 关键事实
      loanAmount: product.loan_amount,
      annualInterestRate: product.annual_interest_rate,
      loanTerm: product.loan_term,
      ltv: product.ltv,
      drawdownDate: product.drawdown_date,
      earlyRepayment: product.early_repayment,
      repaymentArrangement: product.repayment_arrangement,
      
      // 相关主体
      issuer: product.issuer,
      pwShareholders: product.pw_shareholders,
      lender: product.lender,
      borrower: product.borrower,
      guarantor: product.guarantor,
      
      // 提款与利息
      disbursementMethod: product.disbursement_method,
      interest: product.interest,
      earlyRepaymentDetails: product.early_repayment_details,
      maturityDate: product.maturity_date,
      
      // 抵押物
      propertyAddress: product.property_address,
      valuation: product.valuation,
      securityRank: product.security_rank,
      lvr: product.lvr,
      
      // 违约与补救
      defaultInterestRate: product.default_interest_rate,
      defaultTriggers: product.default_triggers,
      defaultProcess: product.default_process,
      
      // 链上与文档
      issuerToken: product.issuer_token,
      loanToken: product.loan_token,
      valuationReport: product.valuation_report,
      mortgageDeed: product.mortgage_deed,
      
      // 系统字段
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      
      // 前端显示需要的字段
      image: getProductImage(product.code)
    };
    
    res.cc('获取产品详情成功', 0, formattedProduct);
  } catch (error) {
    console.error('获取产品详情失败:', error);
    res.cc('获取产品详情失败', 1);
  }
};

// 更新产品订阅信息
const updateProductSubscription = async (req, res) => {
  try {
    const { code } = req.params;
    const { subscribed, subscribed_tokens, current_subscription } = req.body;
    
    if (!code) {
      return res.cc('缺少产品代码参数', 1);
    }
    
    const sql = `
      UPDATE product_details 
      SET subscribed = ?, subscribed_tokens = ?, current_subscription = ?, updated_at = CURRENT_TIMESTAMP
      WHERE code = ?
    `;
    
    const [result] = await mysql.promise().execute(sql, [subscribed, subscribed_tokens, current_subscription, code]);
    
    if (result.affectedRows > 0) {
      res.cc('更新产品订阅信息成功', 0);
    } else {
      res.cc('产品不存在或更新失败', 1);
    }
  } catch (error) {
    console.error('更新产品订阅信息失败:', error);
    res.cc('更新产品订阅信息失败', 1);
  }
};

// 根据产品代码获取对应的图片路径
function getProductImage(code) {
  const imageMap = {
    'RWA001': '/pics/TYMU.png',
    'RWA002': '/pics/SQNB.png',
    'RWA003': '/pics/LZYT.png',
    'YYD': '/pics/YYD.png',
    'COMP': '/pics/TYMU.png'
  };
  
  return imageMap[code] || '/pics/TYMU.png';
}

module.exports = {
  getAllProductDetails,
  getProductByCode,
  updateProductSubscription
};