const db = require("../../database/index");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//注册新用户处理函数
exports.regUser = (req, res) => {
  //获取用户提交数据
  const userinfo = req.body;

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

    // 定义插入用户数据的SQL语句
    const sql = 'insert into user set ?'
    db.query(sql, { user_name: userinfo.user_name, user_password: userinfo.user_password, user_id: userinfo.user_id, user_email: userinfo.user_email, user_phone: userinfo.user_phone }, (err, results) => {

      // 执行SQL语句失败
      if (err) return res.cc(err)
      // 执行SQL语句成功，但影响行数不为1
      if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')

      // 注册用户成功
      console.log('注册用户成功!')
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