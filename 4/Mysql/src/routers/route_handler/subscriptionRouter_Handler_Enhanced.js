const db = require('../../database/index');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

// ==================== 认购申请管理 ====================

// 获取所有认购申请（支持筛选和分页）- 管理员使用
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
      ${whereClause}
    `;

    const countResult = await query(countSql, queryParams);
    const total = countResult[0].total;

    // 查询数据 - 使用现有表结构
    const dataSql = `
      SELECT 
        s.id,
        s.user_id,
        s.user_wallet_address,
        s.project_code,
        s.project_name,
        s.trade_type,
        s.token_amount,
        s.interest_rate,
        s.expected_return,
        s.token_address_native,
        s.token_address_interest,
        s.loan_issuer_address,
        s.status,
        s.approval_notes as status_reason,
        s.approved_by,
        s.approved_at,
        s.created_at,
        s.updated_at
      FROM subscriptions s
      ${whereClause}
      ORDER BY s.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...queryParams, parseInt(limit), offset];
    const results = await query(dataSql, dataParams);

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
        s.*
      FROM subscriptions s
      WHERE s.id = ?
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        status: 1,
        message: '认购申请不存在'
      });
    }

    // 获取状态变更历史
    const historySql = `
      SELECT * FROM subscription_status_history
      WHERE subscription_id = ?
      ORDER BY created_at DESC
    `;
    const history = await query(historySql, [id]);

    // 获取支付记录
    const paymentSql = `
      SELECT * FROM subscription_payments
      WHERE subscription_id = ?
      ORDER BY created_at DESC
    `;
    const payments = await query(paymentSql, [id]);

    console.log('✅ 成功获取认购申请详情');
    res.status(200).json({
      status: 0,
      message: '获取认购申请详情成功',
      data: {
        subscription: results[0],
        history: history,
        payments: payments
      }
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
      token_address,
      token_amount,
      interest_rate,
      expected_return,
      token_address_native,
      token_address_interest,
      loan_issuer_address,
      network = 'SEPOLIA'
    } = req.body;

    // 验证必填字段
    if (!user_wallet_address || !project_code || !token_amount) {
      return res.status(400).json({
        status: 1,
        message: '缺少必填字段: user_wallet_address, project_code, token_amount'
      });
    }

    // 如果提供了项目代码，尝试获取项目信息
    let projectInfo = null;
    if (project_code) {
      const projectSql = 'SELECT * FROM projects WHERE project_code = ?';
      const projectResults = await query(projectSql, [project_code]);
      if (projectResults.length > 0) {
        projectInfo = projectResults[0];
      }
    }

    const insertData = {
      user_id: user_id || null,
      user_wallet_address,
      project_code,
      project_name: project_name || (projectInfo ? projectInfo.project_name : null),
      trade_type,
      token_address: token_address || (projectInfo ? projectInfo.token_address_native : null),
      token_amount: parseFloat(token_amount),
      interest_rate: interest_rate ? parseFloat(interest_rate) : (projectInfo ? projectInfo.interest_rate : null),
      expected_return,
      token_address_native: token_address_native || (projectInfo ? projectInfo.token_address_native : null),
      token_address_interest: token_address_interest || (projectInfo ? projectInfo.token_address_interest : null),
      loan_issuer_address: loan_issuer_address || (projectInfo ? projectInfo.loan_issuer_address : null),
      network,
      status: 'APPLIED'
    };

    const sql = 'INSERT INTO subscriptions SET ?';
    const result = await query(sql, insertData);

    const subscriptionId = result.insertId;

    // 创建通知：用户提交申请
    await createNotification({
      user_id: user_id || null,
      user_wallet_address,
      subscription_id: subscriptionId,
      type: 'SUBMITTED',
      title: '认购申请已提交',
      body: `您的${project_name || project_code}项目认购申请已成功提交，申请数量：${token_amount}。我们将尽快处理您的申请。`,
      payload: JSON.stringify({
        subscription_id: subscriptionId,
        project_code,
        token_amount
      })
    });

    console.log('✅ 认购申请创建成功，ID:', subscriptionId);

    res.status(201).json({
      status: 0,
      message: '认购申请创建成功',
      data: {
        id: subscriptionId,
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

// 更新认购申请状态（管理员操作）
async function updateSubscriptionStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, status_reason, admin_notes, approved_by, actor_type = 'ADMIN' } = req.body;

    console.log('🔄 更新认购申请状态，ID:', id, '状态:', status);

    // 验证状态值
    const allowedStatuses = ['APPLIED', 'UNDER_REVIEW', 'APPROVED', 'PAYMENT_SUBMITTED', 'PAYMENT_CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: 1,
        message: '无效的状态值'
      });
    }

    // 获取当前申请信息
    const currentSql = 'SELECT * FROM subscriptions WHERE id = ?';
    const currentResults = await query(currentSql, [id]);
    
    if (currentResults.length === 0) {
      return res.status(404).json({
        status: 1,
        message: '认购申请不存在'
      });
    }

    const currentSubscription = currentResults[0];
    const oldStatus = currentSubscription.status;

    // 更新订阅状态
    const updateData = {
      status,
      status_reason: status_reason || null,
      admin_notes: admin_notes || currentSubscription.admin_notes,
      approved_by: approved_by ? parseInt(approved_by) : currentSubscription.approved_by,
      approved_at: (status === 'APPROVED' || status === 'COMPLETED') ? new Date() : currentSubscription.approved_at,
      updated_at: new Date()
    };

    const updateSql = 'UPDATE subscriptions SET ? WHERE id = ?';
    await query(updateSql, [updateData, id]);

    // 记录状态变更历史
    const historySql = `
      INSERT INTO subscription_status_history 
      (subscription_id, old_status, new_status, actor_type, actor_id, note) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await query(historySql, [
      id,
      oldStatus,
      status,
      actor_type,
      approved_by || 'system',
      status_reason || admin_notes || `状态从 ${oldStatus} 变更为 ${status}`
    ]);

    // 根据状态变更创建通知
    await handleStatusChangeNotification(currentSubscription, status, status_reason);

    console.log('✅ 认购申请状态更新成功');

    res.status(200).json({
      status: 0,
      message: '认购申请状态更新成功',
      data: {
        id: parseInt(id),
        old_status: oldStatus,
        new_status: status,
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

// 用户提交支付交易hash
async function submitPaymentTransaction(req, res) {
  try {
    const { id } = req.params;
    const { tx_hash, user_wallet_address } = req.body;

    console.log('💳 提交支付交易，认购ID:', id, '交易hash:', tx_hash);

    if (!tx_hash) {
      return res.status(400).json({
        status: 1,
        message: '缺少交易哈希'
      });
    }

    // 获取认购申请
    const subSql = 'SELECT * FROM subscriptions WHERE id = ?';
    const subResults = await query(subSql, [id]);

    if (subResults.length === 0) {
      return res.status(404).json({
        status: 1,
        message: '认购申请不存在'
      });
    }

    const subscription = subResults[0];

    // 验证用户身份
    if (user_wallet_address && subscription.user_wallet_address.toLowerCase() !== user_wallet_address.toLowerCase()) {
      return res.status(403).json({
        status: 1,
        message: '无权操作此认购申请'
      });
    }

    // 更新认购申请状态和交易hash
    const updateSql = `
      UPDATE subscriptions 
      SET status = 'PAYMENT_SUBMITTED', latest_tx_hash = ?, updated_at = NOW()
      WHERE id = ?
    `;
    await query(updateSql, [tx_hash, id]);

    // 创建支付记录
    const paymentData = {
      subscription_id: id,
      tx_hash: tx_hash,
      network: subscription.network || 'SEPOLIA',
      from_address: subscription.user_wallet_address,
      to_address: subscription.loan_issuer_address,
      token_address: subscription.token_address || subscription.token_address_native,
      amount: subscription.token_amount,
      status: 'PENDING'
    };

    const paymentSql = 'INSERT INTO subscription_payments SET ?';
    await query(paymentSql, paymentData);

    // 创建通知
    await createNotification({
      user_id: subscription.user_id,
      user_wallet_address: subscription.user_wallet_address,
      subscription_id: id,
      type: 'PAYMENT_SUBMITTED',
      title: '支付交易已提交',
      body: `您的支付交易已提交，交易哈希：${tx_hash.substring(0, 10)}...${tx_hash.substring(tx_hash.length - 8)}。我们正在核查交易状态。`,
      payload: JSON.stringify({
        subscription_id: id,
        tx_hash: tx_hash
      })
    });

    console.log('✅ 支付交易提交成功');

    res.status(200).json({
      status: 0,
      message: '支付交易提交成功',
      data: {
        subscription_id: id,
        tx_hash: tx_hash,
        payment_status: 'PENDING'
      }
    });

  } catch (error) {
    console.error('❌ 提交支付交易失败:', error);
    res.status(500).json({
      status: 1,
      message: '提交支付交易失败: ' + error.message
    });
  }
}

// 管理员核查交易并更新支付状态
async function verifyPayment(req, res) {
  try {
    const { id } = req.params;
    const { payment_id, is_confirmed, block_number, error_message } = req.body;

    console.log('🔍 核查支付，认购ID:', id, '支付ID:', payment_id);

    // 获取认购申请
    const subSql = 'SELECT * FROM subscriptions WHERE id = ?';
    const subResults = await query(subSql, [id]);

    if (subResults.length === 0) {
      return res.status(404).json({
        status: 1,
        message: '认购申请不存在'
      });
    }

    const subscription = subResults[0];

    // 更新支付记录
    const paymentUpdateSql = `
      UPDATE subscription_payments 
      SET status = ?, block_number = ?, error_message = ?, checked_at = NOW()
      WHERE id = ? AND subscription_id = ?
    `;
    await query(paymentUpdateSql, [
      is_confirmed ? 'CONFIRMED' : 'FAILED',
      block_number || null,
      error_message || null,
      payment_id,
      id
    ]);

    // 如果确认成功，更新认购申请状态
    if (is_confirmed) {
      const updateSubSql = `
        UPDATE subscriptions 
        SET status = 'PAYMENT_CONFIRMED', updated_at = NOW()
        WHERE id = ?
      `;
      await query(updateSubSql, [id]);

      // 创建通知
      await createNotification({
        user_id: subscription.user_id,
        user_wallet_address: subscription.user_wallet_address,
        subscription_id: id,
        type: 'PAYMENT_CONFIRMED',
        title: '支付已确认',
        body: `您的支付已确认成功！交易已在区块链上完成。区块号：${block_number || 'N/A'}`,
        payload: JSON.stringify({
          subscription_id: id,
          block_number: block_number
        })
      });
    } else {
      // 支付失败，通知用户重新提交
      await createNotification({
        user_id: subscription.user_id,
        user_wallet_address: subscription.user_wallet_address,
        subscription_id: id,
        type: 'STATUS_CHANGED',
        title: '支付验证失败',
        body: `您的支付交易验证失败：${error_message || '交易未找到或未完成'}。请重新提交交易。`,
        payload: JSON.stringify({
          subscription_id: id,
          error: error_message
        })
      });
    }

    console.log('✅ 支付核查完成');

    res.status(200).json({
      status: 0,
      message: '支付核查完成',
      data: {
        subscription_id: id,
        payment_verified: is_confirmed,
        new_status: is_confirmed ? 'PAYMENT_CONFIRMED' : 'PAYMENT_SUBMITTED'
      }
    });

  } catch (error) {
    console.error('❌ 核查支付失败:', error);
    res.status(500).json({
      status: 1,
      message: '核查支付失败: ' + error.message
    });
  }
}

// ==================== 通知管理 ====================

// 获取用户通知列表
async function getUserNotifications(req, res) {
  try {
    const { user_wallet_address, user_id } = req.query;
    const { page = 1, limit = 20, is_read, type } = req.query;

    console.log('📬 获取用户通知，钱包:', user_wallet_address);

    if (!user_wallet_address && !user_id) {
      return res.status(400).json({
        status: 1,
        message: '需要提供 user_wallet_address 或 user_id'
      });
    }

    let whereConditions = [];
    let queryParams = [];

    if (user_wallet_address) {
      whereConditions.push('user_wallet_address = ?');
      queryParams.push(user_wallet_address);
    }

    if (user_id) {
      whereConditions.push('user_id = ?');
      queryParams.push(user_id);
    }

    if (is_read !== undefined) {
      whereConditions.push('is_read = ?');
      queryParams.push(is_read === 'true' ? 1 : 0);
    }

    if (type) {
      whereConditions.push('type = ?');
      queryParams.push(type);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM user_notifications ${whereClause}`;
    const countResult = await query(countSql, queryParams);
    const total = countResult[0].total;

    // 查询数据
    const dataSql = `
      SELECT * FROM user_notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...queryParams, parseInt(limit), offset];
    const results = await query(dataSql, dataParams);

    // 解析 JSON payload
    const notifications = results.map(notif => ({
      ...notif,
      payload: notif.payload ? JSON.parse(notif.payload) : null
    }));

    console.log(`✅ 成功获取通知: ${results.length}条`);

    res.status(200).json({
      status: 0,
      message: '获取通知成功',
      data: {
        notifications: notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('❌ 获取通知失败:', error);
    res.status(500).json({
      status: 1,
      message: '获取通知失败: ' + error.message
    });
  }
}

// 标记通知为已读
async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;

    console.log('✅ 标记通知已读，ID:', id);

    const sql = 'UPDATE user_notifications SET is_read = 1 WHERE id = ?';
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 1,
        message: '通知不存在'
      });
    }

    res.status(200).json({
      status: 0,
      message: '通知已标记为已读'
    });

  } catch (error) {
    console.error('❌ 标记通知已读失败:', error);
    res.status(500).json({
      status: 1,
      message: '标记通知已读失败: ' + error.message
    });
  }
}

// 批量标记通知为已读
async function markAllNotificationsAsRead(req, res) {
  try {
    const { user_wallet_address, user_id } = req.body;

    console.log('✅ 批量标记通知已读');

    if (!user_wallet_address && !user_id) {
      return res.status(400).json({
        status: 1,
        message: '需要提供 user_wallet_address 或 user_id'
      });
    }

    let sql, params;
    if (user_wallet_address) {
      sql = 'UPDATE user_notifications SET is_read = 1 WHERE user_wallet_address = ? AND is_read = 0';
      params = [user_wallet_address];
    } else {
      sql = 'UPDATE user_notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0';
      params = [user_id];
    }

    const result = await query(sql, params);

    res.status(200).json({
      status: 0,
      message: '所有通知已标记为已读',
      data: {
        updated_count: result.affectedRows
      }
    });

  } catch (error) {
    console.error('❌ 批量标记通知已读失败:', error);
    res.status(500).json({
      status: 1,
      message: '批量标记通知已读失败: ' + error.message
    });
  }
}

// ==================== 辅助函数 ====================

// 创建通知
async function createNotification({ user_id, user_wallet_address, subscription_id, type, title, body, payload }) {
  try {
    const sql = `
      INSERT INTO user_notifications 
      (user_id, user_wallet_address, subscription_id, type, title, body, payload) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await query(sql, [
      user_id || null,
      user_wallet_address,
      subscription_id || null,
      type,
      title,
      body,
      typeof payload === 'string' ? payload : JSON.stringify(payload)
    ]);
    console.log('📨 通知已创建:', title);
  } catch (error) {
    console.error('❌ 创建通知失败:', error);
  }
}

// 处理状态变更通知
async function handleStatusChangeNotification(subscription, newStatus, statusReason) {
  let title, body, type;

  switch (newStatus) {
    case 'APPLIED':
      title = '认购申请已提交';
      body = `您的${subscription.project_name || subscription.project_code}项目认购申请已成功提交，等待管理员审核。`;
      type = 'SUBSCRIPTION_APPLIED';
      break;

    case 'UNDER_REVIEW':
      title = '认购申请审批中';
      body = `您的${subscription.project_name || subscription.project_code}项目认购申请正在审批中，请耐心等待。`;
      type = 'SUBSCRIPTION_UNDER_REVIEW';
      break;

    case 'APPROVED':
      title = '认购申请已通过';
      body = `恭喜！您的认购申请已通过审核。请使用您的钱包向 ${subscription.loan_issuer_address} 转账 ${subscription.token_amount} 个代币以完成认购。`;
      type = 'SUBSCRIPTION_APPROVED';
      break;

    case 'REJECTED':
      title = '认购申请已拒绝';
      body = `很抱歉，您的认购申请未通过审核。${statusReason ? '原因：' + statusReason : ''}`;
      type = 'STATUS_CHANGED';
      break;

    case 'PAYMENT_SUBMITTED':
      title = '支付已提交';
      body = `您的支付交易已提交，正在等待确认。交易哈希：${subscription.latest_tx_hash || 'N/A'}`;
      type = 'PAYMENT_SUBMITTED';
      break;

    case 'PAYMENT_CONFIRMED':
      title = '支付已确认';
      body = `您的支付已确认成功！我们将尽快处理您的认购申请。`;
      type = 'PAYMENT_CONFIRMED';
      break;

    case 'COMPLETED':
      title = '交易成功完成';
      body = `🎉 恭喜！您的MetaMask支付交易已成功完成，认购申请已全部处理完成。您已成功认购${subscription.token_amount}个代币，可以点击查看详情。`;
      type = 'TRANSACTION_SUCCESS';
      break;

    case 'CANCELLED':
      title = '认购申请已取消';
      body = `您的认购申请已取消。`;
      type = 'STATUS_CHANGED';
      break;

    default:
      return;
  }

  await createNotification({
    user_id: subscription.user_id,
    user_wallet_address: subscription.user_wallet_address,
    subscription_id: subscription.id,
    type,
    title,
    body,
    payload: JSON.stringify({
      subscription_id: subscription.id,
      new_status: newStatus,
      reason: statusReason
    })
  });
}

// ==================== 统计和其他功能 ====================

// 删除认购申请
async function deleteSubscription(req, res) {
  try {
    const { id } = req.params;
    console.log('🗑️ 删除认购申请，ID:', id);

    const sql = 'DELETE FROM subscriptions WHERE id = ?';
    const result = await query(sql, [id]);

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

// 获取认购统计
async function getSubscriptionStats(req, res) {
  try {
    console.log('📊 获取认购申请统计信息');

    const sql = `
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'APPLIED' THEN 1 END) as applied_subscriptions,
        COUNT(CASE WHEN status = 'UNDER_REVIEW' THEN 1 END) as under_review_subscriptions,
        COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as approved_subscriptions,
        COUNT(CASE WHEN status = 'PAYMENT_SUBMITTED' THEN 1 END) as payment_submitted_subscriptions,
        COUNT(CASE WHEN status = 'PAYMENT_CONFIRMED' THEN 1 END) as payment_confirmed_subscriptions,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_subscriptions,
        COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) as rejected_subscriptions,
        SUM(CASE WHEN status IN ('APPROVED', 'PAYMENT_SUBMITTED', 'PAYMENT_CONFIRMED', 'COMPLETED') THEN token_amount ELSE 0 END) as total_approved_amount,
        SUM(token_amount) as total_amount,
        AVG(token_amount) as average_amount,
        COUNT(DISTINCT project_code) as unique_projects,
        COUNT(DISTINCT user_wallet_address) as unique_users
      FROM subscriptions
    `;

    const results = await query(sql);
    const stats = results[0];

    console.log('✅ 成功获取认购申请统计信息');

    res.status(200).json({
      status: 0,
      message: '获取统计信息成功',
      data: stats
    });

  } catch (error) {
    console.error('❌ 获取统计信息失败:', error);
    res.status(500).json({
      status: 1,
      message: '获取统计信息失败: ' + error.message
    });
  }
}

// 新项目上线通知
async function createNewProjectNotification(userId, userWalletAddress, project) {
  await createNotification({
    user_id: userId,
    user_wallet_address: userWalletAddress,
    title: '新项目上线',
    body: `🎉 新项目"${project.name}"已上线！年化收益率${project.apy}%，立即查看详情。`,
    type: 'NEW_PROJECT_LAUNCHED',
    payload: JSON.stringify({
      project_id: project.id,
      project_name: project.name,
      apy: project.apy,
      min_investment: project.min_investment
    })
  });
}

// 认购进度通知
async function createSubscriptionProgressNotification(userId, userWalletAddress, subscription, progress) {
  await createNotification({
    user_id: userId,
    user_wallet_address: userWalletAddress,
    subscription_id: subscription.id,
    title: '认购进度更新',
    body: `项目"${subscription.project_name}"认购进度已达${progress}%，还有${100 - progress}%即可满额。`,
    type: 'SUBSCRIPTION_PROGRESS',
    payload: JSON.stringify({
      subscription_id: subscription.id,
      project_name: subscription.project_name,
      progress: progress
    })
  });
}

// KYC状态更新通知
async function createKycStatusNotification(userId, userWalletAddress, kycStatus, level) {
  let title, body;
  
  switch (kycStatus) {
    case 'verified':
      title = 'KYC验证成功';
      body = `🎉 恭喜！您的KYC验证已通过，当前等级：Level ${level}`;
      break;
    case 'pending':
      title = 'KYC审核中';
      body = `您的KYC申请正在审核中，请耐心等待。`;
      break;
    case 'rejected':
      title = 'KYC验证失败';
      body = `很抱歉，您的KYC验证未通过，请重新提交申请。`;
      break;
    default:
      return;
  }

  await createNotification({
    user_id: userId,
    user_wallet_address: userWalletAddress,
    title,
    body,
    type: 'KYC_STATUS_UPDATE',
    payload: JSON.stringify({
      kyc_status: kycStatus,
      kyc_level: level
    })
  });
}

// 白名单状态更新通知
async function createWhitelistStatusNotification(userId, userWalletAddress, status) {
  let title, body;
  
  switch (status) {
    case 'approved':
      title = '白名单申请通过';
      body = `🎉 恭喜！您的白名单申请已通过，现在可以参与更多投资项目。`;
      break;
    case 'pending':
      title = '白名单审核中';
      body = `您的白名单申请正在审核中，请耐心等待。`;
      break;
    case 'rejected':
      title = '白名单申请被拒';
      body = `很抱歉，您的白名单申请未通过，请检查资料后重新申请。`;
      break;
    default:
      return;
  }

  await createNotification({
    user_id: userId,
    user_wallet_address: userWalletAddress,
    title,
    body,
    type: 'WHITELIST_STATUS_UPDATE',
    payload: JSON.stringify({
      whitelist_status: status
    })
  });
}

// 收到本金token通知
async function createPrincipalTokenNotification(userId, userWalletAddress, subscription, amount) {
  await createNotification({
    user_id: userId,
    user_wallet_address: userWalletAddress,
    subscription_id: subscription.id,
    title: '收到本金token',
    body: `💰 您已收到项目"${subscription.project_name}"的本金token ${amount}个，请查看钱包余额。`,
    type: 'PRINCIPAL_TOKEN_RECEIVED',
    payload: JSON.stringify({
      subscription_id: subscription.id,
      project_name: subscription.project_name,
      token_amount: amount
    })
  });
}

// 收到利息token通知
async function createInterestTokenNotification(userId, userWalletAddress, subscription, amount) {
  await createNotification({
    user_id: userId,
    user_wallet_address: userWalletAddress,
    subscription_id: subscription.id,
    title: '收到利息token',
    body: `💎 您已收到项目"${subscription.project_name}"的利息token ${amount}个，收益已到账！`,
    type: 'INTEREST_TOKEN_RECEIVED',
    payload: JSON.stringify({
      subscription_id: subscription.id,
      project_name: subscription.project_name,
      interest_amount: amount
    })
  });
}

// 项目到期通知
async function createProjectMaturityNotification(userId, userWalletAddress, subscription) {
  await createNotification({
    user_id: userId,
    user_wallet_address: userWalletAddress,
    subscription_id: subscription.id,
    title: '项目即将到期',
    body: `⏰ 项目"${subscription.project_name}"即将到期，请关注本金和收益返还。`,
    type: 'PROJECT_MATURITY',
    payload: JSON.stringify({
      subscription_id: subscription.id,
      project_name: subscription.project_name,
      maturity_date: subscription.maturity_date
    })
  });
}

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscriptionStatus,
  submitPaymentTransaction,
  verifyPayment,
  deleteSubscription,
  getSubscriptionStats,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  // 新增通知处理函数
  createNewProjectNotification,
  createSubscriptionProgressNotification,
  createKycStatusNotification,
  createWhitelistStatusNotification,
  createPrincipalTokenNotification,
  createInterestTokenNotification,
  createProjectMaturityNotification
};

