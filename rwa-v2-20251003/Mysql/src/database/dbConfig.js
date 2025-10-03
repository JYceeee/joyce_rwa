/*mysql配置信息*/
require('dotenv').config()
module.exports = {
  mysql: {
    host: process.env.db_host || process.env.VITE_DB_HOST || 'localhost',                        // 数据库IP地址
    user: process.env.db_user || process.env.VITE_DB_USER || 'root',                             // 用户名
    password: process.env.db_password || process.env.VITE_DB_PASSWORD || '123456',               // 密码
    database: process.env.db_name || process.env.VITE_DB_NAME || 'rwa',                          // 数据库名   
    port: process.env.db_port || process.env.VITE_DB_PORT || 3306,                               // 端口号（默认都是3306）
    connectionLimit: process.env.db_connection_limit || process.env.VITE_DB_CONNECTION_LIMIT || 10,          //池内最大连接数
    waitForConnections: process.env.db_waitForConnections || process.env.VITE_DB_WAIT_FOR_CONNECTIONS || true, //等待连接池可用
    idleTimeout: process.env.db_idleTimeout || process.env.VITE_DB_IDLE_TIMEOUT || 30000,               //空闲30秒后回收
  }
};