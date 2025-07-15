#!/bin/bash

# 區塊鏈投票系統啟動腳本
echo "🚀 啟動區塊鏈投票系統..."

# 檢查 Node.js 是否安裝
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤: Node.js 未安裝，請先安裝 Node.js"
    exit 1
fi

# 檢查 npm 是否安裝
if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤: npm 未安裝，請先安裝 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安裝"

# 安裝依賴
echo "📦 安裝依賴..."

# 安裝後端依賴
echo "📦 安裝後端依賴..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 後端依賴安裝失敗"
        exit 1
    fi
fi
cd ..

# 安裝前端依賴
echo "📦 安裝前端依賴..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 前端依賴安裝失敗"
        exit 1
    fi
fi
cd ..

# 安裝區塊鏈依賴
echo "📦 安裝區塊鏈依賴..."
cd blockchain
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 區塊鏈依賴安裝失敗"
        exit 1
    fi
fi
cd ..

echo "✅ 所有依賴安裝完成"

# 檢查環境變數文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  警告: backend/.env 文件不存在，將使用默認配置"
fi

# 啟動服務
echo "🔧 啟動服務..."

# 啟動區塊鏈節點（後台運行）
echo "🔗 啟動本地區塊鏈節點..."
cd blockchain
npx hardhat node > ../blockchain.log 2>&1 &
BLOCKCHAIN_PID=$!
echo "區塊鏈節點 PID: $BLOCKCHAIN_PID"
cd ..

# 等待區塊鏈節點啟動
echo "⏳ 等待區塊鏈節點啟動..."
sleep 5

# 部署智能合約
echo "📜 部署智能合約..."
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
if [ $? -ne 0 ]; then
    echo "❌ 智能合約部署失敗"
    kill $BLOCKCHAIN_PID
    exit 1
fi
cd ..

# 啟動後端服務（後台運行）
echo "🖥️  啟動後端服務..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "後端服務 PID: $BACKEND_PID"
cd ..

# 等待後端服務啟動
echo "⏳ 等待後端服務啟動..."
sleep 3

# 啟動前端服務
echo "🌐 啟動前端服務..."
cd frontend

# 創建 PID 文件用於清理
echo $BLOCKCHAIN_PID > ../pids.txt
echo $BACKEND_PID >> ../pids.txt

echo ""
echo "🎉 系統啟動完成！"
echo ""
echo "📋 服務信息:"
echo "   🔗 區塊鏈節點: http://localhost:8545"
echo "   🖥️  後端 API: http://localhost:5000"
echo "   🌐 前端應用: http://localhost:3000"
echo ""
echo "📝 日誌文件:"
echo "   🔗 區塊鏈: blockchain.log"
echo "   🖥️  後端: backend.log"
echo ""
echo "⚠️  注意: 關閉此終端將停止前端服務"
echo "💡 提示: 使用 Ctrl+C 停止前端，然後運行 ./stop.sh 停止所有服務"
echo ""

# 啟動前端（前台運行）
npm start

# 如果前端停止，清理後台進程
echo "🧹 清理後台進程..."
if [ -f "../pids.txt" ]; then
    while read pid; do
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            echo "已停止進程 $pid"
        fi
    done < ../pids.txt
    rm ../pids.txt
fi

echo "👋 系統已停止"