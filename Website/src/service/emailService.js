// 邮件发送服务（Node.js后端API示例，需配合后端部署）
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

// 邮箱配置（请替换为实际邮箱服务信息）
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 465,
  secure: true,
  auth: {
    user: 'joyce_yang2020@163.com',
    pass: 'wangyidafahao1_'
  }
});

// MySQL数据库配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_db_password',
  database: 'your_db_name'
};

// 发送验证码邮件并保存到数据库
async function sendVerificationCode(email) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // 发送邮件
  await transporter.sendMail({
    from: 'your@email.com',
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`
  });
  // 保存验证码到数据库
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(
    'INSERT INTO email_verification (email, code, created_at) VALUES (?, ?, NOW())',
    [email, code]
  );
  await conn.end();
  return code;
}

// 校验验证码
async function verifyCode(email, code) {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute(
    'SELECT * FROM email_verification WHERE email = ? AND code = ? AND created_at > NOW() - INTERVAL 10 MINUTE',
    [email, code]
  );
  await conn.end();
  return rows.length > 0;
}

module.exports = { sendVerificationCode, verifyCode };