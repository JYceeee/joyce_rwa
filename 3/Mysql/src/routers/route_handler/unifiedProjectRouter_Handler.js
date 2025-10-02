const mysql = require('../../database/index');

// 获取项目图片的辅助函数
const getProductImage = (projectCode) => {
  const imageMap = {
    'RWA001': '/pics/TYMU.png',
    'RWA002': '/pics/SQNB.png',
    'RWA003': '/pics/LZYT.png',
    'RWA004': '/pics/YYD.png',
    'RWA005': '/pics/TYMU.png',
    'RWA006': '/pics/SQNB.png',
    'RWA007': '/pics/LZYT.png',
    'RWA008': '/pics/YYD.png',
    'RWA009': '/pics/TYMU.png',
    'RWA010': '/pics/SQNB.png'
  };
  return imageMap[projectCode] || '/pics/TYMU.png';
};

// 获取所有项目列表
const getAllProjects = async (req, res) => {
  try {
    console.log('🔍 开始查询所有项目详情...');
    const sql = `
      SELECT 
        id, project_code, project_name, loan_status, created_at,
        subscribe_token, total_offering_token,
        property_location, property_state, property_type, property_value, property_summary,
        loan_type, loan_product, loan_amount, loan_purpose,
        loan_term_months, lvr, interest_rate, default_rate,
        commencement_date, expiry_date, expected_recovery_date
      FROM project 
      ORDER BY created_at DESC
    `;
    
    const [rows] = await mysql.promise().execute(sql);
    
    // 格式化数据以匹配前端字段结构
    const formattedProjects = rows.map(project => ({
      // 基础信息
      id: project.id,
      code: project.project_code,
      name: project.project_name,
      status: project.loan_status,
      createdAt: project.created_at,
      
      // 投资信息
      totalToken: project.total_offering_token,
      currentSubscribedToken: project.subscribe_token,
      subscribe_token: project.subscribe_token,
      total_offering_token: project.total_offering_token,
      
      // 物业信息
      propertyLocation: project.property_location,
      propertyState: project.property_state,
      propertyType: project.property_type,
      propertyValue: project.property_value,
      propertySummary: project.property_summary,
      
      // 贷款信息
      loanType: project.loan_type,
      loanProduct: project.loan_product,
      loanAmount: project.loan_amount,
      loanPurpose: project.loan_purpose,
      loanTermMonths: project.loan_term_months,
      
      // 贷款比率
      lvr: project.lvr,
      interestRate: project.interest_rate,
      defaultRate: project.default_rate,
      
      // 贷款周期
      commencementDate: project.commencement_date,
      expiryDate: project.expiry_date,
      expectedRecoveryDate: project.expected_recovery_date,
      
      // 前端显示需要的字段
      image: getProductImage(project.project_code)
    }));
    
    res.cc('获取项目列表成功', 0, formattedProjects);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.cc('获取项目列表失败', 1);
  }
};

// 根据项目ID获取项目详情
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log('🔍 根据ID获取项目详情:', projectId);
    
    const sql = `
      SELECT 
        id, project_code, project_name, loan_status, created_at,
        subscribe_token, total_offering_token,
        property_location, property_state, property_type, property_value, property_summary,
        loan_type, loan_product, loan_amount, loan_purpose,
        loan_term_months, lvr, interest_rate, default_rate,
        commencement_date, expiry_date, expected_recovery_date
      FROM project 
      WHERE id = ?
    `;
    
    const [rows] = await mysql.promise().execute(sql, [projectId]);
    
    if (rows.length === 0) {
      return res.cc('项目不存在', 1);
    }
    
    const project = rows[0];
    const formattedProject = {
      // 基础信息
      id: project.id,
      code: project.project_code,
      name: project.project_name,
      status: project.loan_status,
      createdAt: project.created_at,
      
      // 投资信息
      totalToken: project.total_offering_token,
      currentSubscribedToken: project.subscribe_token,
      subscribe_token: project.subscribe_token,
      total_offering_token: project.total_offering_token,
      
      // 物业信息
      propertyLocation: project.property_location,
      propertyState: project.property_state,
      propertyType: project.property_type,
      propertyValue: project.property_value,
      propertySummary: project.property_summary,
      
      // 贷款信息
      loanType: project.loan_type,
      loanProduct: project.loan_product,
      loanAmount: project.loan_amount,
      loanPurpose: project.loan_purpose,
      loanTermMonths: project.loan_term_months,
      
      // 贷款比率
      lvr: project.lvr,
      interestRate: project.interest_rate,
      defaultRate: project.default_rate,
      
      // 贷款周期
      commencementDate: project.commencement_date,
      expiryDate: project.expiry_date,
      expectedRecoveryDate: project.expected_recovery_date,
      
      // 前端显示需要的字段
      image: getProductImage(project.project_code)
    };
    
    res.cc('获取项目详情成功', 0, formattedProject);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.cc('获取项目详情失败', 1);
  }
};

// 根据项目代码获取项目详情
const getProjectByCode = async (req, res) => {
  try {
    const { code } = req.params;
    console.log('🔍 根据代码获取项目详情:', code);
    
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
    
    const [rows] = await mysql.promise().execute(sql, [code]);
    
    if (rows.length === 0) {
      return res.cc('项目不存在', 1);
    }
    
    const project = rows[0];
    const formattedProject = {
      // 基础信息
      id: project.id,
      project_code: project.project_code,
      project_name: project.project_name,
      loan_status: project.loan_status,
      created_at: project.created_at,
      
      // 认购信息
      subscribe_token: project.subscribe_token,
      total_offering_token: project.total_offering_token,
      
      // 抵押资产物业信息
      property_location: project.property_location,
      property_state: project.property_state,
      property_type: project.property_type,
      property_value: project.property_value,
      property_summary: project.property_summary,
      
      // 贷款基本信息
      loan_type: project.loan_type,
      loan_product: project.loan_product,
      loan_amount: project.loan_amount,
      loan_purpose: project.loan_purpose,
      
      // 贷款条款
      loan_term_months: project.loan_term_months,
      
      // 贷款比率
      lvr: project.lvr,
      interest_rate: project.interest_rate,
      default_rate: project.default_rate,
      
      // 贷款周期
      commencement_date: project.commencement_date,
      expiry_date: project.expiry_date,
      expected_recovery_date: project.expected_recovery_date,
      
      // 前端显示需要的字段
      image: getProductImage(project.project_code)
    };
    
    res.cc('获取项目详情成功', 0, formattedProject);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.cc('获取项目详情失败', 1);
  }
};

// 创建新项目
const createProject = async (req, res) => {
  try {
    const projectData = req.body;
    console.log('📝 创建新项目:', projectData);
    
    const sql = `
      INSERT INTO project (
        project_code, project_name, loan_status, subscribe_token, total_offering_token,
        property_location, property_state, property_type, property_value, property_summary,
        loan_type, loan_product, loan_amount, loan_purpose,
        loan_term_months, lvr, interest_rate, default_rate,
        commencement_date, expiry_date, expected_recovery_date,
        created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      projectData.project_code,
      projectData.project_name,
      projectData.loan_status || 'INCOMING',
      projectData.subscribe_token || 0,
      projectData.total_offering_token,
      projectData.property_location,
      projectData.property_state,
      projectData.property_type,
      projectData.property_value,
      projectData.property_summary,
      projectData.loan_type,
      projectData.loan_product,
      projectData.loan_amount,
      projectData.loan_purpose,
      projectData.loan_term_months,
      projectData.lvr,
      projectData.interest_rate,
      projectData.default_rate,
      projectData.commencement_date,
      projectData.expiry_date,
      projectData.expected_recovery_date,
      projectData.created_by || 'system',
      projectData.updated_by || 'system'
    ];
    
    const [result] = await mysql.promise().execute(sql, values);
    
    res.cc('创建项目成功', 0, {
      id: result.insertId,
      project_code: projectData.project_code
    });
  } catch (error) {
    console.error('创建项目失败:', error);
    res.cc('创建项目失败', 1);
  }
};

// 更新项目订阅信息
const updateProjectSubscription = async (req, res) => {
  try {
    const { code } = req.params;
    const { subscribe_token } = req.body;
    console.log('📊 更新项目订阅信息:', code, subscribe_token);
    
    const sql = `UPDATE project SET subscribe_token = ?, updated_at = CURRENT_TIMESTAMP WHERE project_code = ?`;
    const [result] = await mysql.promise().execute(sql, [subscribe_token, code]);
    
    if (result.affectedRows === 0) {
      return res.cc('项目不存在', 1);
    }
    
    res.cc('更新订阅信息成功', 0, {
      project_code: code,
      subscribe_token: subscribe_token
    });
  } catch (error) {
    console.error('更新订阅信息失败:', error);
    res.cc('更新订阅信息失败', 1);
  }
};

// 部署智能合约并处理认购
const deploySmartContracts = async (req, res) => {
  try {
    const {
      projectCode,
      tradeType,
      amount,
      userAddress
    } = req.body;

    // 验证必需参数
    if (!projectCode || !tradeType || !amount || !userAddress) {
      return res.status(400).json({ 
        status: 1, 
        message: '缺少必需参数' 
      });
    }

    console.log('🚀 开始部署智能合约:', {
      projectCode,
      tradeType,
      amount,
      userAddress
    });

    // 这里应该调用实际的智能合约部署逻辑
    // 基于 scripts/rwa_deploy.js 和 scripts/interact.js 的逻辑
    
    // 模拟智能合约部署过程
    const deploymentResult = await simulateSmartContractDeployment({
      projectCode,
      tradeType,
      amount: parseFloat(amount),
      userAddress
    });

    console.log('✅ 智能合约部署完成:', deploymentResult);

    return res.status(200).json({
      status: 0,
      message: '智能合约部署成功',
      data: deploymentResult
    });

  } catch (error) {
    console.error('❌ 智能合约部署失败:', error);
    return res.status(500).json({
      status: 1,
      message: '智能合约部署失败: ' + error.message
    });
  }
};

// 模拟智能合约部署过程
const simulateSmartContractDeployment = async (params) => {
  return new Promise((resolve) => {
    // 模拟部署时间
    setTimeout(() => {
      resolve({
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
        // 基于实际合约部署的地址
        kycRegistryAddress: process.env.VITE_KYC_REGISTRY_ADDRESS || '0x4533f47BE0ce8b80F7bbdF02939f81F4A15b7A45',
        loanIssuerAddress: process.env.VITE_LOAN_ISSUER_ADDRESS || '0x13159e6417D98528C220b12Ec4950D5A343E5eAA',
        principalTokenAddress: process.env.VITE_PRINCIPAL_TOKEN_ADDRESS || '0x45b1eCb3D9af651244eC656ed15B86404924c354',
        interestTokenAddress: process.env.VITE_INTEREST_TOKEN_ADDRESS || '0xE6aeE4a898c6d99033ee5380Df407C5DD470fb17'
      });
    }, 2000);
  });
};

module.exports = {
  getAllProjects,
  getProjectByCode,
  createProject,
  updateProjectSubscription,
  deploySmartContracts
};
