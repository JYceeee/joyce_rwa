function responseHandler() {
  return (req, res, next) => {
    // 封装统一响应函数
    res.cc = function (err, status = 1, data = null) {
      console.log(err)
      const response = {
        status,
        message: err instanceof Error ? err.message : err
      }
      
      // 如果有数据，添加到响应中
      if (data !== null) {
        response.data = data
      }
      
      res.send(response)
    }
    next()
  }
}

module.exports = responseHandler