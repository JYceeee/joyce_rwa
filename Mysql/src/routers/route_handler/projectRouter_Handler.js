const mysql = require('../../database/index');

// 获取所有项目列表
const getAllProjects = async (req, res) => {
  try {
    const sql = `
      SELECT 
        project_id, name, status, created_at,
        issuer, lender, borrower,
        loan_amount, loan_term, loan_interest,
        collateral_value, collateral_grade
      FROM projects 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `;
    
    const [rows] = await mysql.promise().execute(sql);
    
    res.cc('获取项目列表成功', 0, rows);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.cc('获取项目列表失败', 1);
  }
};

// 根据项目ID获取项目详情
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.cc('缺少项目ID参数', 1);
    }
    
    const sql = `
      SELECT * FROM projects 
      WHERE project_id = ? AND status = 'active'
    `;
    
    const [rows] = await mysql.promise().execute(sql, [projectId]);
    
    if (rows.length === 0) {
      return res.cc('项目不存在', 1);
    }
    
    // 格式化数据以匹配前端字段名
    const project = rows[0];
    const formattedProject = {
      id: project.id,
      project_id: project.project_id,
      name: project.name,
      
      // 基本信息
      issuer: project.issuer,
      pwShareholders: project.pw_shareholders,
      lender: project.lender,
      borrower: project.borrower,
      
      // 贷款信息
      loanAmount: project.loan_amount ? `$${project.loan_amount.toLocaleString()}` : null,
      withdrawalArrangement: project.withdrawal_arrangement,
      loanTerm: project.loan_term,
      loanWithdrawalDate: project.loan_withdrawal_date,
      
      // 利息信息
      loanInterest: project.loan_interest,
      interestPaymentMethod: project.interest_payment_method,
      
      // 抵押物信息
      collateral: project.collateral,
      collateralValue: project.collateral_value ? `$${project.collateral_value.toLocaleString()}` : null,
      collateralGrade: project.collateral_grade,
      collateralRatio: project.collateral_ratio,
      
      // 担保与违约信息
      guarantor: project.guarantor,
      defaultInterestRate: project.default_interest_rate,
      defaultCircumstances: project.default_circumstances,
      defaultArrangement: project.default_arrangement,
      
      // 项目介绍
      introTitle: project.intro_title,
      introContent: project.intro_content,
      
      // 系统字段
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    };
    
    res.cc('获取项目详情成功', 0, formattedProject);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.cc('获取项目详情失败', 1);
  }
};

// 根据项目ID获取项目详情（用于前端路由）
const getProjectByProjectId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.cc('缺少项目ID参数', 1);
    }
    
    const sql = `
      SELECT * FROM projects 
      WHERE project_id = ? AND status = 'active'
    `;
    
    const [rows] = await mysql.promise().execute(sql, [id]);
    
    if (rows.length === 0) {
      return res.cc('项目不存在', 1);
    }
    
    // 格式化数据以匹配前端字段名
    const project = rows[0];
    const formattedProject = {
      id: project.id,
      project_id: project.project_id,
      name: project.name,
      
      // 基本信息
      issuer: project.issuer,
      pwShareholders: project.pw_shareholders,
      lender: project.lender,
      borrower: project.borrower,
      
      // 贷款信息
      loanAmount: project.loan_amount ? `$${project.loan_amount.toLocaleString()}` : null,
      withdrawalArrangement: project.withdrawal_arrangement,
      loanTerm: project.loan_term,
      loanWithdrawalDate: project.loan_withdrawal_date,
      
      // 利息信息
      loanInterest: project.loan_interest,
      interestPaymentMethod: project.interest_payment_method,
      
      // 抵押物信息
      collateral: project.collateral,
      collateralValue: project.collateral_value ? `$${project.collateral_value.toLocaleString()}` : null,
      collateralGrade: project.collateral_grade,
      collateralRatio: project.collateral_ratio,
      
      // 担保与违约信息
      guarantor: project.guarantor,
      defaultInterestRate: project.default_interest_rate,
      defaultCircumstances: project.default_circumstances,
      defaultArrangement: project.default_arrangement,
      
      // 项目介绍
      introTitle: project.intro_title,
      introContent: project.intro_content,
      
      // 系统字段
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    };
    
    res.cc('获取项目详情成功', 0, formattedProject);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.cc('获取项目详情失败', 1);
  }
};

// 创建新项目（管理员功能）
const createProject = async (req, res) => {
  try {
    const {
      project_id, name, issuer, pw_shareholders, lender, borrower,
      loan_amount, withdrawal_arrangement, loan_term, loan_withdrawal_date,
      loan_interest, interest_payment_method,
      collateral, collateral_value, collateral_grade, collateral_ratio,
      guarantor, default_interest_rate, default_circumstances, default_arrangement,
      intro_title, intro_content
    } = req.body;
    
    // 验证必填字段
    if (!project_id || !name) {
      return res.cc('项目ID和项目名称不能为空', 1);
    }
    
    const sql = `
      INSERT INTO projects (
        project_id, name, issuer, pw_shareholders, lender, borrower,
        loan_amount, withdrawal_arrangement, loan_term, loan_withdrawal_date,
        loan_interest, interest_payment_method,
        collateral, collateral_value, collateral_grade, collateral_ratio,
        guarantor, default_interest_rate, default_circumstances, default_arrangement,
        intro_title, intro_content
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      project_id, name, issuer, pw_shareholders, lender, borrower,
      loan_amount, withdrawal_arrangement, loan_term, loan_withdrawal_date,
      loan_interest, interest_payment_method,
      collateral, collateral_value, collateral_grade, collateral_ratio,
      guarantor, default_interest_rate, default_circumstances, default_arrangement,
      intro_title, intro_content
    ];
    
    const [result] = await mysql.promise().execute(sql, values);
    
    if (result.affectedRows > 0) {
      res.cc('项目创建成功', 0, { id: result.insertId });
    } else {
      res.cc('项目创建失败', 1);
    }
  } catch (error) {
    console.error('创建项目失败:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.cc('项目ID已存在', 1);
    } else {
      res.cc('创建项目失败', 1);
    }
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectByProjectId,
  createProject
};