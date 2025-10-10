const express = require('express')
const router = express.Router()
const { sendContactEmail, sendConfirmationEmail } = require('../utils/emailService')

// 联系表单提交路由
router.post('/contact', async (req, res) => {
  try {
    console.log('📧 收到联系表单请求:', {
      body: req.body,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    })
    
    const { name, email, type, subject, message } = req.body
    
    // 验证必填字段
    if (!name || !email || !subject || !message) {
      console.log('❌ 验证失败: 缺少必填字段')
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      })
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ 验证失败: 邮箱格式不正确')
      return res.status(400).json({
        success: false,
        message: '请输入有效的邮箱地址'
      })
    }
    
    // 准备邮件数据
    const formData = {
      name: name.trim(),
      email: email.trim(),
      type: type || 'general',
      subject: subject.trim(),
      message: message.trim(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    }
    
    console.log('准备发送邮件:', formData)
    
    // 发送邮件到公司邮箱
    const emailResult = await sendContactEmail(formData)
    
    console.log('📨 邮件发送结果:', emailResult)
    
    // 发送确认邮件给用户（可选，不影响主流程）
    if (!emailResult.testMode) {
      try {
        await sendConfirmationEmail(formData)
        console.log('✅ 确认邮件发送成功')
      } catch (confirmationError) {
        console.log('⚠️ 确认邮件发送失败，但不影响主流程:', confirmationError.message)
      }
    }
    
    // 返回成功响应
    const responseMessage = emailResult.testMode 
      ? '消息发送成功！我们会在24小时内回复您。（测试模式）'
      : '消息发送成功！我们会在24小时内回复您。'
    
    res.status(200).json({
      success: true,
      message: responseMessage,
      data: {
        messageId: emailResult.messageId,
        timestamp: new Date().toISOString(),
        testMode: emailResult.testMode || false
      }
    })
    
  } catch (error) {
    console.error('❌ 联系表单处理错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试',
      error: error.message
    })
  }
})

// 健康检查路由
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '联系表单服务正常',
    timestamp: new Date().toISOString()
  })
})

module.exports = router
