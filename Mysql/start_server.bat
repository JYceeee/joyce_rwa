@echo off
echo 启动RWA后端服务器...
echo.

REM 检查是否安装了Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 检查是否安装了MySQL
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 警告: 未找到MySQL，请确保MySQL服务正在运行
)

echo 正在启动服务器...
node index.js

pause
