@echo off
echo ========================================
echo RWA项目数据库和服务器启动脚本
echo ========================================

echo.
echo 1. 检查MySQL服务状态...
sc query mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: MySQL服务未运行，请先启动MySQL服务
    pause
    exit /b 1
)
echo MySQL服务正在运行

echo.
echo 2. 初始化数据库...
mysql -u root -p123456 < init_database.sql
if %errorlevel% neq 0 (
    echo 错误: 数据库初始化失败，请检查MySQL连接和权限
    pause
    exit /b 1
)
echo 数据库初始化成功

echo.
echo 3. 安装依赖包...
if not exist node_modules (
    echo 正在安装依赖包...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 依赖包安装失败
        pause
        exit /b 1
    )
)
echo 依赖包安装完成

echo.
echo 4. 启动服务器...
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo.
node index.js

pause
