# RWA前端部署PowerShell脚本
Write-Host "========================================" -ForegroundColor Green
Write-Host "RWA前端部署脚本" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "[1/4] 检查Node.js环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host ""
Write-Host "[2/4] 安装依赖..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "依赖安装失败"
    }
    Write-Host "依赖安装成功" -ForegroundColor Green
} catch {
    Write-Host "错误: 依赖安装失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host ""
Write-Host "[3/4] 构建前端项目..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "前端构建失败"
    }
    Write-Host "前端构建成功" -ForegroundColor Green
} catch {
    Write-Host "错误: 前端构建失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host ""
Write-Host "[4/4] 启动生产服务器..." -ForegroundColor Yellow
Write-Host "服务器将在 http://localhost:3000 启动" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Cyan
Write-Host ""
node production-server.js

