@echo off
echo 启动RWA项目开发环境...

echo.
echo 1. 启动后端服务器...
cd Mysql
start "后端服务器" cmd /k "npm run dev"

echo.
echo 等待后端服务器启动...
timeout /t 5 /nobreak > nul

echo.
echo 2. 启动前端服务器...
cd ..\Website
start "前端服务器" cmd /k "npm run dev"

echo.
echo 开发环境启动完成！
echo 后端: http://localhost:3000
echo 前端: http://localhost:5173
echo.
pause
