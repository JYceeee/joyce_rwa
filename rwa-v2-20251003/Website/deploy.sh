#!/bin/bash

# RWA前端部署脚本
echo "========================================"
echo "RWA前端部署脚本"
echo "========================================"

echo ""
echo "[1/4] 检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "Node.js版本: $NODE_VERSION"

echo ""
echo "[2/4] 安装依赖..."
if ! npm install; then
    echo "错误: 依赖安装失败"
    exit 1
fi

echo ""
echo "[3/4] 构建前端项目..."
if ! npm run build; then
    echo "错误: 前端构建失败"
    exit 1
fi

echo ""
echo "[4/4] 启动生产服务器..."
echo "服务器将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务器"
echo ""
node production-server.js

