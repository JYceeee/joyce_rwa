const nodemailer = require('nodemailer')

// 创建邮件传输器
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // 您的Gmail邮箱
      pass: process.env.EMAIL_PASS  // 您的Gmail应用密码
    }
  })
}

// 发送联系表单邮件
const sendContactEmail = async (formData) => {
  try {
    // 检查邮件配置
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ 邮件配置缺失，使用测试模式')
      return { 
        success: true, 
        messageId: 'test-' + Date.now(),
        testMode: true,
        message: '测试模式：邮件配置未完成'
      }
    }
    
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'joyceyang2024@gmail.com', // 目标邮箱
      subject: `新联系表单 - ${formData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">新联系表单提交</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">联系信息</h3>
            <p><strong>姓名:</strong> ${formData.name}</p>
            <p><strong>邮箱:</strong> ${formData.email}</p>
            <p><strong>类型:</strong> ${formData.type}</p>
            <p><strong>主题:</strong> ${formData.subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #495057; margin-top: 0;">消息内容</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 3px; white-space: pre-wrap; line-height: 1.6;">${formData.message}</div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
            <p><strong>提交时间:</strong> ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            <p><strong>IP地址:</strong> ${formData.ip || '未知'}</p>
            <p><strong>用户代理:</strong> ${formData.userAgent || '未知'}</p>
          </div>
        </div>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ 邮件发送成功:', result.messageId)
    return { success: true, messageId: result.messageId }
    
  } catch (error) {
    console.error('❌ 邮件发送失败:', error)
    throw new Error('邮件发送失败: ' + error.message)
  }
}

// 发送确认邮件给用户
const sendConfirmationEmail = async (formData) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: '感谢您的联系 - RWA Trading Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #007bff;">感谢您联系RWA Trading Platform</h2>
          
          <p>亲爱的 ${formData.name}，</p>
          
          <p>感谢您对我们的关注！我们已经收到您的消息，并会在24小时内回复您。</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">您的消息摘要</h3>
            <p><strong>主题:</strong> ${formData.subject}</p>
            <p><strong>提交时间:</strong> ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
          </div>
          
          <p>如果您有任何紧急问题，请直接回复此邮件。</p>
          
          <p>祝好，<br>RWA Trading Platform 团队</p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
          <p style="font-size: 12px; color: #6c757d;">
            此邮件由系统自动发送，请勿直接回复。
          </p>
        </div>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('确认邮件发送成功:', result.messageId)
    return { success: true, messageId: result.messageId }
    
  } catch (error) {
    console.error('确认邮件发送失败:', error)
    // 确认邮件发送失败不影响主流程
    return { success: false, error: error.message }
  }
}

module.exports = {
  sendContactEmail,
  sendConfirmationEmail
}
