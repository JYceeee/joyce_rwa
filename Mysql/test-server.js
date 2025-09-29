const express = require('express')
const app = express()
const cors = require('cors')

// 启用CORS
app.use(cors())

// 解析JSON
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 简单的测试路由
app.get('/', (req, res) => {
  res.json({ message: '后端服务正常运行', timestamp: new Date().toISOString() })
})

app.get('/user/transactionhistory', (req, res) => {
  res.json({
    status: 0,
    message: '测试成功',
    data: []
  })
})

app.post('/user/transactionhistory', (req, res) => {
  console.log('收到POST请求:', req.body)
  res.json({
    status: 0,
    message: '测试保存成功',
    data: { id: 123 }
  })
})

// 启动服务器
const PORT = import.meta.env.db_port
app.listen(PORT, () => {
  console.log(`测试服务器在端口 ${PORT} 启动成功`)
  console.log(`访问地址: import.meta.env.VITE_API_BASE_URL:${PORT}`)
})
