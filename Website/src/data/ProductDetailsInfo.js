// ProductDetailsInfo.js - 存储所有产品的详细信息和字段
export const products = [
  {
    code: 'RWA001',
    name: 'St Ives NSW Residential Project',
    image: '/pics/TYMU.png',
    subtitle: 'Prosper Way Holdings Ltd - Residential Mortgage',
    type: 'residential',
    region: 'St Ives NSW',
    risk: 'low',
    targetYield: 9.9,
    status: 'active',
    summary: 'First-lien residential mortgage with monthly interest payments and controlled LTV.',
    totalOffering: 'A$1,000,000',
    subscribed: 'A$350,000',
    totalSubscriptionTokens: 100,
    subscribedTokens: 35,
    
    // Key Facts
    loanAmount: 'AUD 1,000,000',
    annualInterestRate: '9.9%',
    loanTerm: '12 months',
    ltv: '67%',
    drawdownDate: '2025-08-06',
    earlyRepayment: 'Permitted after 6 months',
    repaymentArrangement: 'Monthly interest payments (the first month\'s interest prepaid on the start date). Principal repaid in full at maturity.',
    
    // Parties
    issuer: 'Prosper Way Holdings Ltd (PW)',
    pwShareholders: 'A, B, C, D – each holding 25%',
    lender: 'CA Capital Pty Ltd',
    borrower: 'Warby Street Development Pty Ltd',
    guarantor: 'D Song',
    
    // Disbursement & Interest
    disbursementMethod: 'Lump-sum, single drawdown',
    interest: '9.9% p.a., payable monthly; first month prepaid at drawdown',
    earlyRepaymentDetails: 'Allowed after 6 months',
    maturityDate: '2026-08-06',
    
    // Collateral
    propertyAddress: '16 Cranford Avenue, St Ives NSW 2075',
    valuation: 'AUD 1,500,000',
    securityRank: 'First mortgage',
    lvr: '67%',
    
    // Default & Remedies
    defaultInterestRate: '18% p.a.',
    defaultTriggers: 'Interest or principal overdue by more than 5 days',
    defaultProcess: 'If default occurs and remains unresolved 1 month after written notice, the lender\'s lawyer will initiate foreclosure proceedings',
    
    // On-Chain & Documents
    issuerToken: 'PW issues tokens to A/B/C/D (25% each) as equity certificates',
    loanToken: 'Placeholder – planned ERC-20 token to record principal and distribute interest',
    valuationReport: 'PDF available',
    mortgageDeed: 'PDF available'
  },

  {
    code: 'RWA002',
    name: 'SQNB Property Loan',
    image: '/pics/SQNB.png',
    subtitle: 'Commercial Mortgage Loan',
    type: 'commercial',
    region: 'CBD',
    risk: 'medium',
    targetYield: 7.2,
    status: 'upcoming',
    summary: 'Commercial mortgage opportunity in CBD with stable tenancy and monthly coupons.',
    totalOffering: 'A$1,800,000',
    subscribed: 'A$0',
    totalSubscriptionTokens: 180,
    subscribedTokens: 0,
    
    // Key Facts
    loanAmount: 'AUD 1,800,000',
    annualInterestRate: '7.2%',
    loanTerm: '24 months',
    ltv: '75%',
    drawdownDate: '2025-09-15',
    earlyRepayment: 'Permitted after 12 months',
    repaymentArrangement: 'Monthly interest payments with principal repayment at maturity.',
    
    // Parties
    issuer: 'SQNB Holdings Ltd',
    pwShareholders: 'E, F, G – each holding 33.33%',
    lender: 'CBD Capital Pty Ltd',
    borrower: 'Commercial Development Group Pty Ltd',
    guarantor: 'H Johnson',
    
    // Disbursement & Interest
    disbursementMethod: 'Staged drawdown over 3 months',
    interest: '7.2% p.a., payable monthly',
    earlyRepaymentDetails: 'Allowed after 12 months with penalty',
    maturityDate: '2027-09-15',
    
    // Collateral
    propertyAddress: '123 Collins Street, Melbourne VIC 3000',
    valuation: 'AUD 2,400,000',
    securityRank: 'First mortgage',
    lvr: '75%',
    
    // Default & Remedies
    defaultInterestRate: '15% p.a.',
    defaultTriggers: 'Interest or principal overdue by more than 7 days',
    defaultProcess: 'Standard foreclosure proceedings initiated after 30 days notice',
    
    // On-Chain & Documents
    issuerToken: 'SQNB issues tokens to E/F/G as equity certificates',
    loanToken: 'Planned ERC-20 token for debt recording',
    valuationReport: 'PDF available',
    mortgageDeed: 'PDF available'
  },

  {
    code: 'RWA003',
    name: 'LZYT Property Loan',
    image: '/pics/LZYT.png',
    subtitle: 'Suburban Residential Loan',
    type: 'residential',
    region: 'Suburban',
    risk: 'medium',
    targetYield: 6.9,
    status: 'research',
    summary: 'Suburban residential mortgage with moderate yield and steady income profile.',
    totalOffering: 'A$750,000',
    subscribed: 'A$0',
    totalSubscriptionTokens: 75,
    subscribedTokens: 0,
    
    // Key Facts
    loanAmount: 'AUD 750,000',
    annualInterestRate: '6.9%',
    loanTerm: '18 months',
    ltv: '76.5%',
    drawdownDate: '2025-10-01',
    earlyRepayment: 'Permitted after 9 months',
    repaymentArrangement: 'Monthly interest payments with balloon payment at maturity.',
    
    // Parties
    issuer: 'LZYT Property Holdings Pty Ltd',
    pwShareholders: 'I, J, K – each holding 33.33%',
    lender: 'Suburban Finance Pty Ltd',
    borrower: 'Residential Development Co. Pty Ltd',
    guarantor: 'L Smith',
    
    // Disbursement & Interest
    disbursementMethod: 'Single drawdown at settlement',
    interest: '6.9% p.a., payable monthly',
    earlyRepaymentDetails: 'Allowed after 9 months without penalty',
    maturityDate: '2027-04-01',
    
    // Collateral
    propertyAddress: '456 Suburban Drive, Brisbane QLD 4000',
    valuation: 'AUD 980,000',
    securityRank: 'First mortgage',
    lvr: '76.5%',
    
    // Default & Remedies
    defaultInterestRate: '12% p.a.',
    defaultTriggers: 'Interest or principal overdue by more than 10 days',
    defaultProcess: 'Mortgagee sale proceedings after 45 days default notice',
    
    // On-Chain & Documents
    issuerToken: 'LZYT issues tokens to I/J/K as equity certificates',
    loanToken: 'Planned ERC-20 token for debt management',
    valuationReport: 'PDF available',
    mortgageDeed: 'PDF available'
  },
  {
    code: 'YYD',
    name: 'YYD Property Loan',
    image: '/pics/YYD.png',
    subtitle: 'CBD Apartment Mortgage',
    type: 'residential',
    region: 'CBD',
    risk: 'low',
    targetYield: 6.1,
    status: 'planning',
    summary: 'CBD apartment mortgage targeting stable monthly income and lower risk.',
    totalOffering: 'A$1,200,000',
    subscribed: 'A$0',
    totalSubscriptionTokens: 120,
    subscribedTokens: 0,
    
    // Key Facts
    loanAmount: 'AUD 1,200,000',
    annualInterestRate: '6.1%',
    loanTerm: '36 months',
    ltv: '72.7%',
    drawdownDate: '2025-11-15',
    earlyRepayment: 'Permitted after 18 months',
    repaymentArrangement: 'Monthly interest payments with principal amortization over final 12 months.',
    
    // Parties
    issuer: 'YYD Apartment Holdings Pty Ltd',
    pwShareholders: 'M, N, O, P – each holding 25%',
    lender: 'CBD Residential Finance Pty Ltd',
    borrower: 'Apartment Development Group Pty Ltd',
    guarantor: 'Q Wilson',
    
    // Disbursement & Interest
    disbursementMethod: 'Progressive drawdown based on construction milestones',
    interest: '6.1% p.a., payable monthly',
    earlyRepaymentDetails: 'Allowed after 18 months with reduced penalty',
    maturityDate: '2028-11-15',
    
    // Collateral
    propertyAddress: '789 CBD Plaza, Sydney NSW 2000',
    valuation: 'AUD 1,650,000',
    securityRank: 'First mortgage',
    lvr: '72.7%',
    
    // Default & Remedies
    defaultInterestRate: '10% p.a.',
    defaultTriggers: 'Interest or principal overdue by more than 14 days',
    defaultProcess: 'Receivership and sale proceedings after 60 days notice',
    
    // On-Chain & Documents
    issuerToken: 'YYD issues tokens to M/N/O/P as equity certificates',
    loanToken: 'Planned ERC-20 token for debt tracking',
    valuationReport: 'PDF available',
    mortgageDeed: 'PDF available'
  },
  {
    code: 'COMP',
    name: 'COMPLETED Project',
    image: '/pics/TYMU.png',
    subtitle: 'Fully Subscribed Project',
    type: 'residential',
    region: 'Sydney',
    risk: 'low',
    targetYield: 8.5,
    status: 'completed',
    summary: 'This project has been fully subscribed and is now closed for new investments.',
    totalOffering: 'A$2,000,000',
    subscribed: 'A$2,000,000',
    totalSubscriptionTokens: 200,
    subscribedTokens: 200,
    
    // Key Facts
    loanAmount: 'AUD 2,000,000',
    annualInterestRate: '8.5%',
    loanTerm: '30 months',
    ltv: '71.4%',
    drawdownDate: '2024-06-01',
    earlyRepayment: 'Permitted after 15 months',
    repaymentArrangement: 'Monthly interest payments with principal repayment at maturity.',
    
    // Parties
    issuer: 'COMP Property Holdings Pty Ltd',
    pwShareholders: 'R, S, T, U, V – each holding 20%',
    lender: 'Sydney Capital Finance Pty Ltd',
    borrower: 'Premium Development Group Pty Ltd',
    guarantor: 'W Brown',
    
    // Disbursement & Interest
    disbursementMethod: 'Single drawdown at settlement',
    interest: '8.5% p.a., payable monthly',
    earlyRepaymentDetails: 'Allowed after 15 months without penalty',
    maturityDate: '2026-12-01',
    
    // Collateral
    propertyAddress: '321 Premium Street, Sydney NSW 2000',
    valuation: 'AUD 2,800,000',
    securityRank: 'First mortgage',
    lvr: '71.4%',
    
    // Default & Remedies
    defaultInterestRate: '16% p.a.',
    defaultTriggers: 'Interest or principal overdue by more than 5 days',
    defaultProcess: 'Foreclosure proceedings after 30 days written notice',
    
    // On-Chain & Documents
    issuerToken: 'COMP issues tokens to R/S/T/U/V as equity certificates',
    loanToken: 'Active ERC-20 token for debt management',
    valuationReport: 'PDF available',
    mortgageDeed: 'PDF available'
  }
]

// 产品字段定义和说明
export const productFields = {
  // 基础信息字段
  basicInfo: {
    code: '项目代码',
    name: '项目名称',
    image: '项目图片路径',
    subtitle: '项目副标题',
    type: '项目类型',
    region: '地区',
    risk: '风险等级',
    targetYield: '目标收益率',
    status: '项目状态',
    summary: '项目摘要'
  },
  
  // 投资信息字段
  investmentInfo: {
    totalOffering: '总认购额度',
    subscribed: '已认购额度',
    totalSubscriptionTokens: '总认购代币数',
    subscribedTokens: '已认购代币数'
  },
  
  // Key Facts 关键信息字段
  keyFacts: {
    loanAmount: '贷款金额',
    annualInterestRate: '年利率',
    loanTerm: '贷款期限',
    ltv: '贷款价值比',
    drawdownDate: '提款日期',
    earlyRepayment: '提前还款选项',
    repaymentArrangement: '还款安排'
  },
  
  // Parties 相关主体字段
  parties: {
    issuer: '发币主体',
    pwShareholders: 'PW股东',
    lender: '贷款方',
    borrower: '借款方',
    guarantor: '担保人'
  },
  
  // Disbursement & Interest 提款与利息字段
  disbursementInterest: {
    disbursementMethod: '提款方式',
    interest: '利息详情',
    earlyRepaymentDetails: '提前还款详情',
    maturityDate: '到期日'
  },
  
  // Collateral 抵押物字段
  collateral: {
    propertyAddress: '房产地址',
    valuation: '评估价值',
    securityRank: '抵押等级',
    lvr: '贷款价值比'
  },
  
  // Default & Remedies 违约与补救措施字段
  defaultRemedies: {
    defaultInterestRate: '违约利率',
    defaultTriggers: '违约触发条件',
    defaultProcess: '违约处理流程'
  },
  
  // On-Chain & Documents 链上与文档字段
  onChainDocuments: {
    issuerToken: '发币代币',
    loanToken: '贷款代币',
    valuationReport: '评估报告',
    mortgageDeed: '抵押契约'
  }
}

// 辅助函数
export const productUtils = {
  // 根据代码获取产品
  getProductByCode: (code) => {
    return products.find(product => product.code === code)
  },
  
  // 根据状态获取产品列表
  getProductsByStatus: (status) => {
    return products.filter(product => product.status === status)
  },
  
  // 根据类型获取产品列表
  getProductsByType: (type) => {
    return products.filter(product => product.type === type)
  },
  
  // 根据风险等级获取产品列表
  getProductsByRisk: (risk) => {
    return products.filter(product => product.risk === risk)
  },
  
  // 获取所有产品代码
  getAllProductCodes: () => {
    return products.map(product => product.code)
  },
  
  // 获取所有产品状态
  getAllStatuses: () => {
    return [...new Set(products.map(product => product.status))]
  },
  
  // 获取所有产品类型
  getAllTypes: () => {
    return [...new Set(products.map(product => product.type))]
  },
  
  // 获取所有风险等级
  getAllRisks: () => {
    return [...new Set(products.map(product => product.risk))]
  }
}

// 默认导出所有产品
export default products
