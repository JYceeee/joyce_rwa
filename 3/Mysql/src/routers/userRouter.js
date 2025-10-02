const express = require('express')
const userRouter = express.Router()

//导入用户路由处理函数
const userRouterHandler = require('./route_handler/userRouter_Handler')

//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
//导入需要验证的规则对象
const { reg_schema, login_schema, email_verification_schema } = require('../middleware/mw_userRoute')

//注册用户(加上用于验证的中间件，并传入验证规则reg_schema)
userRouter.post('/reguser', expressJoi(reg_schema), userRouterHandler.regUser)

//登录用户
userRouter.post('/login', expressJoi(login_schema), userRouterHandler.login)

//发送邮箱验证码
userRouter.post('/send-email-code', expressJoi(email_verification_schema), userRouterHandler.sendEmailCode)

//验证邮箱验证码
userRouter.post('/verify-email-code', expressJoi(email_verification_schema), userRouterHandler.verifyEmailCode)

//获取用户信息
userRouter.get('/', userRouterHandler.getUserInfo)

//交易历史相关路由
userRouter.post('/transactionhistory', userRouterHandler.saveTransactionHistory)
userRouter.get('/transactionhistory', userRouterHandler.getTransactionHistory)

module.exports = userRouter