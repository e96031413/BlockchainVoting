#!/bin/bash

# 區塊鏈投票系統停止腳本
echo "🛑 停止區塊鏈投票系統..."

# 停止所有相關進程
echo "🧹 清理進程..."

# 從 PID 文件停止進程
if [ -f "pids.txt" ]; then
    while read pid; do
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            echo "✅ 已停止進程 $pid"
        else
            echo "⚠️  進程 $pid 已經停止"
        fi
    done < pids.txt
    rm pids.txt
    echo "✅ 已清理 PID 文件"
fi

# 停止可能運行的 Node.js 進程
echo "🔍 查找並停止相關 Node.js 進程..."

# 停止 Hardhat 節點
HARDHAT_PIDS=$(pgrep -f "hardhat node")
if [ ! -z "$HARDHAT_PIDS" ]; then
    echo "🔗 停止 Hardhat 節點..."
    echo $HARDHAT_PIDS | xargs kill
    echo "✅ Hardhat 節點已停止"
fi

# 停止後端服務
BACKEND_PIDS=$(pgrep -f "node.*server.js")
if [ ! -z "$BACKEND_PIDS" ]; then
    echo "🖥️  停止後端服務..."
    echo $BACKEND_PIDS | xargs kill
    echo "✅ 後端服務已停止"
fi

# 停止前端服務
FRONTEND_PIDS=$(pgrep -f "react-scripts start")
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "🌐 停止前端服務..."
    echo $FRONTEND_PIDS | xargs kill
    echo "✅ 前端服務已停止"
fi

# 清理日誌文件（可選）
read -p "🗑️  是否刪除日誌文件? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "blockchain.log" ]; then
        rm blockchain.log
        echo "✅ 已刪除 blockchain.log"
    fi
    if [ -f "backend.log" ]; then
        rm backend.log
        echo "✅ 已刪除 backend.log"
    fi
fi

echo ""
echo "🎉 系統已完全停止！"
echo "💡 提示: 使用 ./start.sh 重新啟動系統"