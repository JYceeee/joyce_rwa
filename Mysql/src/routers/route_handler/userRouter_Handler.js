const db = require("../../database/index");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateUserId } = require('../../utils/userIdGenerator');

//注册新用户处理函数
exports.regUser = (req, res) => {
  //获取用户提交数据
  const userinfo = req.body;

  // 调试：打印接收到的注册数据
  console.log('📥 后端接收到的注册数据:', userinfo);
  
  // 检查user_id状态（数据库触发器会自动处理空值）
  if (!userinfo.user_id) {
    console.log('⚠️ 前端未提供user_id，数据库触发器将自动生成');
  } else {
    console.log('✅ 使用前端提供的user_id:', userinfo.user_id);
  }

  //定义SQL语句,查询用户邮箱
  console.log('用户:' + userinfo.user_email)
  const sqlStr = 'select * from user where user_email=?'
  db.query(sqlStr, [userinfo.user_email], (err, results) => {

    // 执行SQL语句失败
    if (err) return res.cc(err)

    //判断邮箱是否被占用
    if (results.length > 0) { return res.cc('该邮箱已被注册!') }

    // 调用bcrypt.hashSync()对密码进行加密(不能解密，只能验证)
    console.log('注册用户未加密密码:' + userinfo.user_password)
    userinfo.user_password = bcrypt.hashSync(userinfo.user_password, 10)
    console.log('注册用户加密密码' + userinfo.user_password)

    // 准备插入数据，如果user_name为空则使用默认值
    const insertData = { 
      user_name: userinfo.user_name || 'User', // 如果为空则使用默认值
      user_password: userinfo.user_password, 
      user_id: userinfo.user_id, 
      user_email: userinfo.user_email, 
      user_phone: userinfo.user_phone 
    };
    
    console.log('💾 准备插入数据库的数据:', insertData);

    // 定义插入用户数据的SQL语句
    const sql = 'insert into user set ?'
    console.log('🚀 执行SQL插入:', sql);
    console.log('🚀 插入数据:', insertData);
    
    db.query(sql, insertData, (err, results) => {

      // 执行SQL语句失败
      if (err) {
        console.log('❌ 数据库插入失败:', err);
        return res.cc(err);
      }
      
      // 执行SQL语句成功，但影响行数不为1
      if (results.affectedRows !== 1) {
        console.log('❌ 数据库插入影响行数不为1:', results.affectedRows);
        return res.cc('注册用户失败，请稍后再试！');
      }

      // 注册用户成功
      console.log('✅ 注册用户成功!');
      console.log('✅ 插入结果:', results);
      console.log('✅ 影响行数:', results.affectedRows);
      console.log('✅ 插入ID:', results.insertId);
      res.send({ status: 0, message: '注册成功!!' });
    })
  })
}

//登录处理函数
exports.login = (req, res) => {
  //获取用户提交数据
  const userinfo = req.body

  const sql = 'select * from user where user_email=?'
  db.query(sql, [userinfo.user_email], (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err)
    // 执行SQL语句成功，但是查询到数据条数不等于1
    if (results.length !== 1) return res.cc('用户未注册,登录失败！')

    // 拿着用户输入的密码，和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(userinfo.user_password, results[0].user_password)
    if (!compareResult) return res.cc('密码错误,登录失败！')

    //在服务器端生成token字符串并擦除密码及id等敏感信息
    const user = { ...results[0], user_password: '', user_email: '' }

    //对用户信息进行加密，生成token字符串
    const tokenStr = jwt.sign(user, process.env.jwt_SecretKey || 'default_secret_key', { expiresIn: process.env.expiresIn || '24h' })

    console.log('用户: ' + userinfo.user_email + ' 登录成功！')

    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
    })
  })
}

//发送邮箱验证码处理函数
exports.sendEmailCode = (req, res) => {
  const { user_email } = req.body;
  
  // 生成6位数字验证码
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 设置验证码过期时间（5分钟）
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  
  // 检查是否已有该邮箱的验证码记录
  const checkSql = 'SELECT * FROM email_verification WHERE user_email = ?';
  db.query(checkSql, [user_email], (err, results) => {
    if (err) return res.cc('数据库查询失败');
    
    if (results.length > 0) {
      // 更新现有记录
      const updateSql = 'UPDATE email_verification SET verification_code = ?, expires_at = ?, created_at = NOW() WHERE user_email = ?';
      db.query(updateSql, [verificationCode, expiresAt, user_email], (err, results) => {
        if (err) return res.cc('更新验证码失败');
        
        console.log(`验证码已发送到 ${user_email}: ${verificationCode}`);
        res.send({
          status: 0,
          message: '验证码已发送到您的邮箱',
          code: verificationCode // 开发环境返回验证码，生产环境应删除此行
        });
      });
    } else {
      // 插入新记录
      const insertSql = 'INSERT INTO email_verification (user_email, verification_code, expires_at) VALUES (?, ?, ?)';
      db.query(insertSql, [user_email, verificationCode, expiresAt], (err, results) => {
        if (err) return res.cc('保存验证码失败');
        
        console.log(`验证码已发送到 ${user_email}: ${verificationCode}`);
        res.send({
          status: 0,
          message: '验证码已发送到您的邮箱',
          code: verificationCode // 开发环境返回验证码，生产环境应删除此行
        });
      });
    }
  });
}

//验证邮箱验证码处理函数
exports.verifyEmailCode = (req, res) => {
  const { user_email, verification_code } = req.body;
  
  // 查询验证码记录
  const sql = 'SELECT * FROM email_verification WHERE user_email = ? AND verification_code = ?';
  db.query(sql, [user_email, verification_code], (err, results) => {
    if (err) return res.cc('数据库查询失败');
    
    if (results.length === 0) {
      return res.cc('验证码错误');
    }
    
    const record = results[0];
    
    // 检查验证码是否过期
    if (new Date() > new Date(record.expires_at)) {
      return res.cc('验证码已过期，请重新获取');
    }
    
    // 验证成功，更新用户邮箱验证状态
    const updateUserSql = 'UPDATE user SET email_verified = 1 WHERE user_email = ?';
    db.query(updateUserSql, [user_email], (err, results) => {
      if (err) return res.cc('更新用户状态失败');
      
      // 删除已使用的验证码记录
      const deleteSql = 'DELETE FROM email_verification WHERE user_email = ?';
      db.query(deleteSql, [user_email], (err, results) => {
        if (err) console.log('删除验证码记录失败:', err);
        
        console.log(`邮箱 ${user_email} 验证成功`);
        res.send({
          status: 0,
          message: '邮箱验证成功'
        });
      });
    });
  });
}

//保存交易历史处理函数
exports.saveTransactionHistory = (req, res) => {
  const transactionData = req.body;
  
  console.log('📥 接收到的交易数据:', transactionData);
  
  // 验证必需字段 - 适配你的表结构
  const requiredFields = ['projectCode', 'tradeType', 'amount', 'price', 'total', 'userAddress'];
  for (const field of requiredFields) {
    if (!transactionData[field]) {
      return res.cc(`${field} 字段是必需的`);
    }
  }
  
  // 根据wallet_address查找或创建用户
  const findOrCreateUser = (walletAddress, callback) => {
    console.log('🔍 开始查找用户，钱包地址:', walletAddress);
    
    // 首先尝试根据wallet_address查找现有用户
    const findSql = 'SELECT user_id FROM user WHERE user_wallet = ?';
    db.query(findSql, [walletAddress], (err, results) => {
      if (err) {
        console.error('❌ 查找用户失败:', err);
        return callback(err, null);
      }
      
      console.log('🔍 查找结果:', results);
      
      if (results && results.length > 0) {
        // 找到现有用户
        console.log('✅ 找到现有用户:', results[0].user_id);
        return callback(null, results[0].user_id);
      } else {
        // 没有找到用户，创建一个新用户
        console.log('🆕 创建新用户，钱包地址:', walletAddress);
        
        // 生成新的用户ID（格式：user + 时间戳 + 随机字符串）
        const newUserId = 'user' + Date.now() + Math.random().toString(36).substr(2, 9);
        
        // 创建用户记录
        const createUserSql = 'INSERT INTO user (user_id, user_wallet, user_email, user_phone, user_name, user_password, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
        const userData = [
          newUserId,
          walletAddress,
          walletAddress + '@wallet.local', // 临时邮箱
          '00000000000', // 临时电话
          'Wallet User ' + walletAddress.slice(-6), // 临时用户名
          'temp_password_' + Date.now() // 临时密码
        ];
        
        console.log('🆕 创建用户数据:', userData);
        
        db.query(createUserSql, userData, (err, results) => {
          if (err) {
            console.error('❌ 创建用户失败:', err);
            return callback(err, null);
          }
          
          console.log('✅ 新用户创建成功:', newUserId, '插入ID:', results.insertId);
          return callback(null, newUserId);
        });
      }
    });
  };
  
  // 获取用户ID后保存交易记录
  findOrCreateUser(transactionData.userAddress, (err, userId) => {
    if (err) {
      console.error('❌ 获取用户ID失败:', err);
      return res.cc('获取用户ID失败');
    }
    
    // 准备插入数据 - 映射到实际的表结构
    const insertData = {
      user_id: userId,
      wallet_address: transactionData.userAddress,
      project_code: transactionData.projectCode || 'RWA', // 使用项目代码
      token_amount: transactionData.amount, // 用户输入的token amount
      transaction_type: transactionData.tradeType.toLowerCase(), // 转换为小写 (buy/sell)
      transaction_status: 'successful', // 交易成功状态
      transaction_hash: transactionData.transactionHash || null,
      block_number: transactionData.blockNumber || null
    };
    
    console.log('💾 准备插入交易数据:', insertData);
    
    // 插入交易历史记录
    const sql = 'INSERT INTO transactionhistory SET ?';
    console.log('💾 执行SQL:', sql);
    console.log('💾 插入数据:', JSON.stringify(insertData, null, 2));
    
    db.query(sql, insertData, (err, results) => {
      if (err) {
        console.error('❌ 插入交易历史失败:', err);
        console.error('❌ 错误详情:', {
          code: err.code,
          errno: err.errno,
          sqlState: err.sqlState,
          sqlMessage: err.sqlMessage,
          sql: err.sql
        });
        return res.cc(`保存交易历史失败: ${err.sqlMessage || err.message}`);
      }
      
      if (results.affectedRows !== 1) {
        console.error('❌ 插入交易历史影响行数不为1:', results.affectedRows);
        return res.cc('保存交易历史失败: 影响行数异常');
      }
      
      console.log('✅ 交易历史保存成功，插入ID:', results.insertId);
      res.send({
        status: 0,
        message: '交易历史保存成功',
        data: {
          id: results.insertId,
          userId: userId,
          transactionHash: insertData.transactionHash,
          transactionType: insertData.transaction_type,
          amount: insertData.amount,
          totalCost: insertData.totalCost
        }
      });
    });
  });
}

//获取交易历史处理函数 - 适配你的表结构
exports.getTransactionHistory = (req, res) => {
  const { projectCode, userAddress, limit = 50, offset = 0 } = req.query;
  
  console.log('📥 查询交易历史参数:', { projectCode, userAddress, limit, offset });
  
  let sql = 'SELECT * FROM transactionhistory WHERE 1=1';
  const params = [];
  
  // 添加查询条件 - 适配你的表结构
  if (projectCode) {
    sql += ' AND token_symbol = ?';
    params.push(projectCode);
  }
  
  if (userAddress) {
    sql += ' AND wallet_address = ?';
    params.push(userAddress);
  }
  
  // 按创建时间倒序排列
  sql += ' ORDER BY created_at DESC';
  
  // 添加分页
  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  console.log('🔍 执行查询SQL:', sql);
  console.log('🔍 查询参数:', params);
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('❌ 查询交易历史失败:', err);
      return res.cc('查询交易历史失败');
    }
    
    console.log('✅ 查询到交易历史记录数:', results.length);
    
    // 转换数据格式以匹配前端期望
    const transformedResults = results.map(trade => ({
      id: trade.id,
      trade_type: trade.transaction_type.toLowerCase(), // 转换为小写
      amount: trade.amount,
      price: trade.price,
      total: trade.totalCost,
      user_address: trade.wallet_address,
      transaction_hash: trade.transactionHash,
      block_number: trade.blockNumber,
      timestamp: new Date(trade.created_at).getTime(), // 转换为时间戳
      created_at: trade.created_at
    }));
    
    res.send({
      status: 0,
      message: '查询交易历史成功',
      data: transformedResults
    });
  });
}