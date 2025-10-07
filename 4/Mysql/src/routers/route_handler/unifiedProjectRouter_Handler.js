const mysql = require('../../database/index');
const { spawn } = require('child_process');
const path = require('path');

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
    
    // 获取查询参数
    const { status } = req.query;
    
    let sql = `
      SELECT 
        id, project_code, project_name, loan_status, created_at,
        subscribe_token, total_offering_token,
        property_location, property_state, property_type, property_value, property_summary,
        loan_type, loan_product, loan_amount, loan_purpose,
        loan_term_months, lvr, interest_rate, default_rate,
        commencement_date, expiry_date, expected_recovery_date,
        principal_token_address, interest_token_address, kyc_registry_address, loan_issuer_address
      FROM project 
    `;
    
    // 如果指定了状态，添加WHERE条件
    if (status && status !== 'all') {
      sql += ` WHERE loan_status = ?`;
    }
    
    sql += ` ORDER BY created_at DESC`;
    
    console.log('📊 执行SQL查询:', sql);
    console.log('📊 查询参数:', { status });
    
    // 根据是否有状态参数决定执行方式
    const [rows] = status && status !== 'all' 
      ? await mysql.promise().execute(sql, [status])
      : await mysql.promise().execute(sql);
    
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

      //合约信息
      principaltokenaddress: project.principal_token_address,
      interesttokenaddress: project.interest_token_address,
      loanissueraddress: project.loan_issuer_address,
      kycregistryaddress: project.kyc_registry_address,
      
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
        commencement_date, expiry_date, expected_recovery_date,
        principal_token_address, interest_token_address, kyc_registry_address, loan_issuer_address
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

      //合约信息
      principaltokenaddress: project.principal_token_address,
      interesttokenaddress: project.interest_token_address,
      loanissueraddress: project.loan_issuer_address,
      kycregistryaddress: project.kyc_registry_address,
      
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
        created_by, updated_by,
        principal_token_address, interest_token_address, kyc_registry_address, loan_issuer_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      projectData.updated_by || 'system',
      projectData.principal_token_address,
      projectData.interest_token_address,
      projectData.kyc_registry_address,
      projectData.loan_issuer_address
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

    // 调用实际的智能合约部署
    const deploymentResult = await deploySmartContractsToTestnet({
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

// 实际部署智能合约到测试网
const deploySmartContractsToTestnet = async (params) => {
  return new Promise((resolve, reject) => {
    const { projectCode, tradeType, amount, userAddress } = params;
    
    console.log('🚀 开始实际部署智能合约到测试网...');
    console.log('参数:', { projectCode, tradeType, amount, userAddress });
    
    // 构建hardhat命令
    const contractDir = path.join(__dirname, '../../../my-contract');
    const hardhatCommand = 'npx';
    const hardhatArgs = [
      'hardhat',
      'run',
      'scripts/api-deploy.js',
      '--network',
      'sepolia'
    ];
    
    console.log('执行命令:', hardhatCommand, hardhatArgs.join(' '));
    console.log('工作目录:', contractDir);
    
    // 设置环境变量
    const env = {
      ...process.env,
      PROJECT_CODE: projectCode,
      TRADE_TYPE: tradeType,
      AMOUNT: amount.toString(),
      USER_ADDRESS: userAddress
    };
    
    // 启动hardhat进程
    const hardhatProcess = spawn(hardhatCommand, hardhatArgs, {
      cwd: contractDir,
      env: env,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    hardhatProcess.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      console.log('Hardhat输出:', output.trim());
    });
    
    hardhatProcess.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      console.error('Hardhat错误:', output.trim());
    });
    
    hardhatProcess.on('close', (code) => {
      console.log(`Hardhat进程退出，代码: ${code}`);
      
      if (code === 0) {
        try {
          // 尝试从输出中提取JSON结果
          const lines = stdout.split('\n');
          let result = null;
          
          // 查找JSON结果标记
          let jsonStart = false;
          let jsonLines = [];
          
          for (const line of lines) {
            if (line.includes('🎯 JSON_START')) {
              jsonStart = true;
              continue;
            }
            if (line.includes('🎯 JSON_END')) {
              break;
            }
            if (jsonStart) {
              jsonLines.push(line);
            }
          }
          
          // 解析JSON
          if (jsonLines.length > 0) {
            try {
              const jsonStr = jsonLines.join('');
              result = JSON.parse(jsonStr);
              console.log('✅ 成功解析JSON结果');
            } catch (e) {
              console.warn('解析JSON失败:', e.message);
              console.warn('JSON内容:', jsonStr);
            }
          }
          
          // 如果没找到标记的JSON，尝试查找其他格式
          if (!result) {
            for (const line of lines) {
              if (line.includes('📊 部署结果:')) {
                try {
                  const jsonStart = line.indexOf('{');
                  if (jsonStart !== -1) {
                    const jsonStr = line.substring(jsonStart);
                    result = JSON.parse(jsonStr);
                    break;
                  }
                } catch (e) {
                  console.warn('解析JSON失败:', e.message);
                }
              }
            }
          }
          
          if (result) {
            console.log('✅ 合约部署成功，解析结果:', result);
            resolve(result);
          } else {
            // 如果无法解析JSON，返回详细错误信息
            console.error('❌ 无法解析部署结果');
            console.error('Hardhat标准输出:', stdout);
            console.error('Hardhat错误输出:', stderr);
            
            let errorMsg = '无法解析合约部署结果。\n';
            errorMsg += '可能的原因:\n';
            errorMsg += '1. 合约部署失败\n';
            errorMsg += '2. 环境变量配置错误\n';
            errorMsg += '3. 网络连接问题\n';
            errorMsg += '4. 私钥余额不足\n\n';
            errorMsg += 'Hardhat输出:\n';
            errorMsg += stdout || '(无输出)\n';
            errorMsg += '\n错误输出:\n';
            errorMsg += stderr || '(无错误输出)';
            
            reject(new Error(errorMsg));
          }
        } catch (error) {
          console.error('❌ 解析部署结果失败:', error);
          reject(new Error('解析部署结果失败: ' + error.message));
        }
      } else {
        console.error('❌ 合约部署失败，退出代码:', code);
        console.error('标准输出:', stdout);
        console.error('错误输出:', stderr);
        
        let errorMsg = `合约部署失败，退出代码: ${code}\n\n`;
        errorMsg += '可能的原因:\n';
        errorMsg += '1. 环境变量配置错误 (SEPOLIA_RPC_URL, PRIVATE_KEY)\n';
        errorMsg += '2. 私钥对应的地址余额不足\n';
        errorMsg += '3. 网络连接问题\n';
        errorMsg += '4. 合约编译错误\n';
        errorMsg += '5. 权限问题\n\n';
        errorMsg += '标准输出:\n';
        errorMsg += stdout || '(无输出)\n';
        errorMsg += '\n错误输出:\n';
        errorMsg += stderr || '(无错误输出)';
        
        reject(new Error(errorMsg));
      }
    });
    
    hardhatProcess.on('error', (error) => {
      console.error('❌ 启动hardhat进程失败:', error);
      
      let errorMsg = '启动hardhat进程失败\n\n';
      errorMsg += '可能的原因:\n';
      errorMsg += '1. Node.js未安装或版本过低\n';
      errorMsg += '2. npm/npx未安装\n';
      errorMsg += '3. hardhat未安装或配置错误\n';
      errorMsg += '4. 权限问题\n';
      errorMsg += '5. 路径问题\n\n';
      errorMsg += '错误详情: ' + error.message;
      
      reject(new Error(errorMsg));
    });
    
    // 设置超时（5分钟）
    setTimeout(() => {
      hardhatProcess.kill();
      let errorMsg = '合约部署超时（5分钟）\n\n';
      errorMsg += '可能的原因:\n';
      errorMsg += '1. 网络连接缓慢\n';
      errorMsg += '2. 合约部署需要更多时间\n';
      errorMsg += '3. 区块链网络拥堵\n';
      errorMsg += '4. 私钥余额不足导致交易卡住\n\n';
      errorMsg += '建议:\n';
      errorMsg += '1. 检查网络连接\n';
      errorMsg += '2. 确认私钥余额充足\n';
      errorMsg += '3. 稍后重试\n';
      errorMsg += '4. 检查区块链网络状态';
      
      reject(new Error(errorMsg));
    }, 300000);
  });
};

// 根据项目代码获取合约地址
const getProjectContractAddresses = async (req, res) => {
  try {
    const { projectCode } = req.params;
    
    console.log('🔍 获取项目合约地址:', projectCode);
    
    if (!projectCode) {
      return res.status(400).json({
        status: 1,
        message: '项目代码不能为空'
      });
    }
    
    const sql = `
      SELECT 
        project_code,
        principal_token_address,
        interest_token_address,
        kyc_registry_address,
        loan_issuer_address
      FROM project 
      WHERE project_code = ?
    `;
    
    const [rows] = await mysql.promise().execute(sql, [projectCode]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 1,
        message: '项目未找到'
      });
    }
    
    const projectData = rows[0];
    
    // 检查合约地址是否存在
    if (!projectData.principal_token_address || !projectData.interest_token_address) {
      return res.status(400).json({
        status: 1,
        message: '项目合约地址未配置'
      });
    }
    
    console.log('✅ 获取到项目合约地址:', projectData);
    
    return res.status(200).json({
      status: 0,
      message: '获取项目合约地址成功',
      data: projectData
    });
    
  } catch (error) {
    console.error('❌ 获取项目合约地址失败:', error);
    return res.status(500).json({
      status: 1,
      message: '获取项目合约地址失败: ' + error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectByCode,
  getProjectContractAddresses,
  createProject,
  updateProjectSubscription,
  deploySmartContracts
};
