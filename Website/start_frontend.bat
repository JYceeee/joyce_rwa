@echo off
echo 启动RWA前端应用...
echo.

REM 检查是否安装了Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 正在安装依赖...
npm install

echo 正在启动开发服务器...
npm run dev

pause
