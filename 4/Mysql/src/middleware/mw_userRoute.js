//导入定义验证规则的包
const joi = require('joi');

//定义用户名,密码和身份证的验证规则
const user_name = joi.string().min(2).max(50).optional();
const user_email = joi.string().trim().email({ tlds: { allow: false } }).required();
const user_password = joi.string().pattern(/^[\S]{6,54}$/).required();
const user_phone = joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required();
const user_id = joi.string().optional();
const email_list = joi.string().valid('Yes', 'No').optional();
// const verification_code = joi.string().length(6).pattern(/^\d{6}$/).optional();

//定义验证注册表单数据的规则对象
exports.reg_schema = {
  body: {
    user_name,
    user_email,
    user_password,
    user_phone,
    user_id,
    email_list
  }
}

//定义验证登录表单数据的规则对象
exports.login_schema = {
  body: {
    user_email,
    user_password
  }
}

// //定义邮箱验证的规则对象
// exports.email_verification_schema = {
//   body: {
//     user_email,
//     verification_code
//   }
// }