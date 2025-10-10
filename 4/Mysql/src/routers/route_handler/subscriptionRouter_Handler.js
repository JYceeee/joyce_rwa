const db = require('../../database/connection');

// 获取所有认购申请（支持筛选和分页）
async function getSubscriptions(req, res) {
  try {
    console.log('📊 获取认购申请列表，查询参数:', req.query);
    
    const {
      page = 1,
      limit = 10,
      status,
      project_code,
      trade_type,
      user_wallet_address,
      start_date,
      end_date,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];

    if (status) {
      whereConditions.push('s.status = ?');
      queryParams.push(status);
    }

    if (project_code) {
      whereConditions.push('s.project_code = ?');
      queryParams.push(project_code);
    }

    if (trade_type) {
      whereConditions.push('s.trade_type = ?');
      queryParams.push(trade_type);
    }

    if (user_wallet_address) {
      whereConditions.push('s.user_wallet_address LIKE ?');
      queryParams.push(`%${user_wallet_address}%`);
    }

    if (start_date) {
      whereConditions.push('s.created_at >= ?');
      queryParams.push(start_date);
    }

    if (end_date) {
      whereConditions.push('s.created_at <= ?');
      queryParams.push(end_date);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // 计算偏移量
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // 构建排序
    const allowedSortFields = ['id', 'created_at', 'updated_at', 'token_amount', 'project_code', 'status'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // 查询总数
    const countSql = `
      SELECT COUNT(*) as total 
      FROM subscriptions s 
      LEFT JOIN projects p ON s.project_code = p.project_code
      ${whereClause}
    `;

    const countResult = await new Promise((resolve, reject) => {
      db.query(countSql, queryParams, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const total = countResult[0].total;

    // 查询数据
    const dataSql = `
      SELECT 
        s.id,
        s.user_id,
        s.user_wallet_address,
        s.project_code,
        COALESCE(s.project_name, p.project_name) as project_name,
        s.trade_type,
        s.token_amount,
        s.interest_rate,
        s.expected_return,
        s.token_address_native,
        s.token_address_interest,
        s.loan_issuer_address,
        s.status,
        s.approval_notes,
        s.approved_by,
        s.approved_at,
        s.created_at,
        s.updated_at
      FROM subscriptions s
      LEFT JOIN project p ON s.project_code = p.project_code
      ${whereClause}
      ORDER BY s.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...queryParams, parseInt(limit), offset];

    const results = await new Promise((resolve, reject) => {
      db.query(dataSql, dataParams, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    console.log(`✅ 成功获取认购申请: ${results.length}条记录，总计${total}条`);

    res.status(200).json({
      status: 0,
      message: '获取认购申请成功',
      data: {
        subscriptions: results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('❌ 获取认购申请失败:', error);
    res.status(500).json({
      status: 1,
      message: '获取认购申请失败: ' + error.message
    });
  }
}

// 根据ID获取单个认购申请详情
async function getSubscriptionById(req, res) {
  try {
    const { id } = req.params;
    console.log('📋 获取认购申请详情，ID:', id);

    const sql = `
      SELECT 
        s.*,
        p.project_name as full_project_name,
        p.description as project_description,
        p.interest_rate,
        p.maturity_period
      FROM subscriptions s
      LEFT JOIN projects p ON s.project_code = p.project_code
      WHERE s.id = ?
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (results.length === 0) {
      return res.status(404).json({
        status: 1,
        message: '认购申请不存在'
      });
    }

    console.log('✅ 成功获取认购申请详情');
    res.status(200).json({
      status: 0,
      message: '获取认购申请详情成功',
      data: results[0]
    });

  } catch (error) {
    console.error('❌ 获取认购申请详情失败:', error);
    res.status(500).json({
      status: 1,
      message: '获取认购申请详情失败: ' + error.message
    });
  }
}

// 创建新的认购申请
async function createSubscription(req, res) {
  try {
    console.log('📝 创建认购申请，数据:', req.body);

    const {
      user_id,
      user_wallet_address,
      project_code,
      project_name,
      trade_type = 'BUY_TOKEN',
      token_amount,
      interest_rate,
      expected_return,
      token_address_native,
      token_address_interest,
      loan_issuer_address
    } = req.body;

    // 验证必填字段
    if (!user_wallet_address || !project_code || !token_amount) {
      return res.status(400).json({
        status: 1,
        message: '缺少必填字段: user_wallet_address, project_code, token_amount'
      });
    }

    const insertData = {
      user_id,
      user_wallet_address,
      project_code,
      project_name,
      trade_type,
      token_amount: parseFloat(token_amount),
      interest_rate: interest_rate ? parseFloat(interest_rate) : null,
      expected_return,
      token_address_native,
      token_address_interest,
      loan_issuer_address,
      status: 'pending'
    };

    const sql = `
      INSERT INTO subscriptions SET ?
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, insertData, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    console.log('✅ 认购申请创建成功，ID:', result.insertId);

    res.status(201).json({
      status: 0,
      message: '认购申请创建成功',
      data: {
        id: result.insertId,
        ...insertData
      }
    });

  } catch (error) {
    console.error('❌ 创建认购申请失败:', error);
    res.status(500).json({
      status: 1,
      message: '创建认购申请失败: ' + error.message
    });
  }
}

// 更新认购申请状态
async function updateSubscriptionStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, approval_notes, approved_by } = req.body;

    console.log('🔄 更新认购申请状态，ID:', id, '状态:', status);

    // 验证状态值
    const allowedStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: 1,
        message: '无效的状态值'
      });
    }

    const updateData = {
      status,
      approval_notes,
      approved_by: approved_by ? parseInt(approved_by) : null,
      approved_at: status !== 'pending' ? new Date() : null,
      updated_at: new Date()
    };

    const sql = `
      UPDATE subscriptions 
      SET ? 
      WHERE id = ?
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [updateData, id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 1,
        message: '认购申请不存在'
      });
    }

    console.log('✅ 认购申请状态更新成功');

    res.status(200).json({
      status: 0,
      message: '认购申请状态更新成功',
      data: {
        id: parseInt(id),
        ...updateData
      }
    });

  } catch (error) {
    console.error('❌ 更新认购申请状态失败:', error);
    res.status(500).json({
      status: 1,
      message: '更新认购申请状态失败: ' + error.message
    });
  }
}

// 更新认购申请信息
async function updateSubscription(req, res) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    console.log('📝 更新认购申请信息，ID:', id, '数据:', updateData);

    // 移除不允许更新的字段
    delete updateData.id;
    delete updateData.created_at;
    updateData.updated_at = new Date();

    const sql = `
      UPDATE subscriptions 
      SET ? 
      WHERE id = ?
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [updateData, id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 1,
        message: '认购申请不存在'
      });
    }

    console.log('✅ 认购申请信息更新成功');

    res.status(200).json({
      status: 0,
      message: '认购申请信息更新成功',
      data: {
        id: parseInt(id),
        ...updateData
      }
    });

  } catch (error) {
    console.error('❌ 更新认购申请信息失败:', error);
    res.status(500).json({
      status: 1,
      message: '更新认购申请信息失败: ' + error.message
    });
  }
}

// 删除认购申请
async function deleteSubscription(req, res) {
  try {
    const { id } = req.params;
    console.log('🗑️ 删除认购申请，ID:', id);

    const sql = `
      DELETE FROM subscriptions WHERE id = ?
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 1,
        message: '认购申请不存在'
      });
    }

    console.log('✅ 认购申请删除成功');

    res.status(200).json({
      status: 0,
      message: '认购申请删除成功'
    });

  } catch (error) {
    console.error('❌ 删除认购申请失败:', error);
    res.status(500).json({
      status: 1,
      message: '删除认购申请失败: ' + error.message
    });
  }
}

// 获取认购申请统计信息
async function getSubscriptionStats(req, res) {
  try {
    console.log('📊 获取认购申请统计信息');

    const sql = `
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_subscriptions,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_subscriptions,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_subscriptions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_subscriptions,
        SUM(CASE WHEN status IN ('approved', 'completed') THEN token_amount ELSE 0 END) as total_approved_amount,
        SUM(token_amount) as total_amount,
        AVG(token_amount) as average_amount,
        MAX(token_amount) as max_amount,
        MIN(token_amount) as min_amount,
        COUNT(DISTINCT project_code) as unique_projects,
        COUNT(DISTINCT user_wallet_address) as unique_users
      FROM subscriptions
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const stats = results[0];

    // 获取最近7天的申请趋势
    const trendSql = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(token_amount) as total_amount
      FROM subscriptions 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    const trendResults = await new Promise((resolve, reject) => {
      db.query(trendSql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // 按项目统计
    const projectStatsSql = `
      SELECT 
        project_code,
        COUNT(*) as subscription_count,
        SUM(token_amount) as total_amount,
        AVG(token_amount) as average_amount
      FROM subscriptions
      GROUP BY project_code
      ORDER BY total_amount DESC
    `;

    const projectStatsResults = await new Promise((resolve, reject) => {
      db.query(projectStatsSql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    console.log('✅ 成功获取认购申请统计信息');

    res.status(200).json({
      status: 0,
      message: '获取统计信息成功',
      data: {
        overview: stats,
        trends: trendResults,
        projectStats: projectStatsResults
      }
    });

  } catch (error) {
    console.error('❌ 获取统计信息失败:', error);
    res.status(500).json({
      status: 1,
      message: '获取统计信息失败: ' + error.message
    });
  }
}

// 导出认购申请数据为CSV
async function exportSubscriptionsToCSV(req, res) {
  try {
    console.log('📤 导出认购申请数据为CSV');

    const { status, project_code, start_date, end_date } = req.query;

    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];

    if (status) {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    if (project_code) {
      whereConditions.push('project_code = ?');
      queryParams.push(project_code);
    }

    if (start_date) {
      whereConditions.push('created_at >= ?');
      queryParams.push(start_date);
    }

    if (end_date) {
      whereConditions.push('created_at <= ?');
      queryParams.push(end_date);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const sql = `
      SELECT 
        id,
        user_wallet_address,
        project_code,
        project_name,
        trade_type,
        token_amount,
        interest_rate,
        expected_return,
        token_address_native,
        token_address_interest,
        loan_issuer_address,
        status,
        approval_notes,
        approved_at,
        created_at,
        updated_at
      FROM subscriptions
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(sql, queryParams, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // 生成CSV内容
    const csvHeaders = [
      'ID', '用户钱包地址', '项目代码', '项目名称', '交易类型', 
      '代币数量', '年化收益率', '预期收益', '原生代币地址', '利息代币地址', '贷款发行人地址',
      '状态', '审批备注', '审批时间', '创建时间', '更新时间'
    ];

    const csvRows = results.map(row => [
      row.id,
      row.user_wallet_address,
      row.project_code,
      row.project_name || '',
      row.trade_type,
      row.token_amount || '',
      row.interest_rate || '',
      row.expected_return || '',
      row.token_address_native || '',
      row.token_address_interest || '',
      row.loan_issuer_address || '',
      row.status,
      row.approval_notes || '',
      row.approved_at ? new Date(row.approved_at).toLocaleString('zh-CN') : '',
      new Date(row.created_at).toLocaleString('zh-CN'),
      new Date(row.updated_at).toLocaleString('zh-CN')
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const filename = `subscriptions_export_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + csvContent); // 添加BOM以支持中文

    console.log('✅ CSV导出成功，记录数:', results.length);

  } catch (error) {
    console.error('❌ CSV导出失败:', error);
    res.status(500).json({
      status: 1,
      message: 'CSV导出失败: ' + error.message
    });
  }
}

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscriptionStatus,
  updateSubscription,
  deleteSubscription,
  getSubscriptionStats,
  exportSubscriptionsToCSV
};
