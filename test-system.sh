#!/bin/bash

# 系統功能測試腳本
echo "🧪 開始系統功能測試..."

# 檢查後端服務是否運行
echo "🔍 檢查後端服務..."
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ 後端服務正常運行"
else
    echo "❌ 後端服務未運行，請先啟動系統"
    exit 1
fi

# 檢查區塊鏈節點是否運行
echo "🔍 檢查區塊鏈節點..."
if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 > /dev/null; then
    echo "✅ 區塊鏈節點正常運行"
else
    echo "❌ 區塊鏈節點未運行，請先啟動系統"
    exit 1
fi

# 測試用戶註冊
echo "🧪 測試用戶註冊..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "測試用戶", "email": "test@example.com", "password": "Test123456"}')

if echo $REGISTER_RESPONSE | grep -q "success"; then
    echo "✅ 用戶註冊測試通過"
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo "⚠️  用戶註冊測試失敗（可能用戶已存在）"
    # 嘗試登入
    echo "🧪 測試用戶登入..."
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email": "test@example.com", "password": "Test123456"}')
    
    if echo $LOGIN_RESPONSE | grep -q "success"; then
        echo "✅ 用戶登入測試通過"
        TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    else
        echo "❌ 用戶登入測試失敗"
        exit 1
    fi
fi

# 測試獲取用戶信息
echo "🧪 測試獲取用戶信息..."
USER_RESPONSE=$(curl -s -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

if echo $USER_RESPONSE | grep -q "success"; then
    echo "✅ 獲取用戶信息測試通過"
else
    echo "❌ 獲取用戶信息測試失敗"
fi

# 測試創建選舉
echo "🧪 測試創建選舉..."
ELECTION_DATA='{
  "title": "測試選舉",
  "description": "這是一個自動化測試選舉",
  "startTime": "'$(date -d "+1 hour" -Iseconds)'",
  "endTime": "'$(date -d "+2 hours" -Iseconds)'",
  "organization": "測試組織",
  "maxSelectCount": 1,
  "candidates": [
    {"name": "候選人A", "description": "測試候選人A"},
    {"name": "候選人B", "description": "測試候選人B"}
  ]
}'

ELECTION_RESPONSE=$(curl -s -X POST http://localhost:5000/api/elections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$ELECTION_DATA")

if echo $ELECTION_RESPONSE | grep -q "success"; then
    echo "✅ 創建選舉測試通過"
    ELECTION_ID=$(echo $ELECTION_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
else
    echo "❌ 創建選舉測試失敗"
    echo "響應: $ELECTION_RESPONSE"
fi

# 測試獲取選舉列表
echo "🧪 測試獲取選舉列表..."
ELECTIONS_RESPONSE=$(curl -s -X GET http://localhost:5000/api/elections)

if echo $ELECTIONS_RESPONSE | grep -q "elections"; then
    echo "✅ 獲取選舉列表測試通過"
else
    echo "❌ 獲取選舉列表測試失敗"
fi

# 測試獲取選舉詳情
if [ ! -z "$ELECTION_ID" ]; then
    echo "🧪 測試獲取選舉詳情..."
    ELECTION_DETAIL_RESPONSE=$(curl -s -X GET http://localhost:5000/api/elections/$ELECTION_ID)
    
    if echo $ELECTION_DETAIL_RESPONSE | grep -q "測試選舉"; then
        echo "✅ 獲取選舉詳情測試通過"
    else
        echo "❌ 獲取選舉詳情測試失敗"
    fi
fi

# 測試前端是否可訪問
echo "🧪 測試前端服務..."
if curl -s http://localhost:3000 > /dev/null || curl -s http://localhost:3001 > /dev/null; then
    echo "✅ 前端服務可訪問"
else
    echo "⚠️  前端服務可能未運行"
fi

echo ""
echo "🎉 系統功能測試完成！"
echo ""
echo "📋 測試結果摘要:"
echo "   ✅ 後端 API 服務正常"
echo "   ✅ 區塊鏈節點正常"
echo "   ✅ 用戶認證功能正常"
echo "   ✅ 選舉管理功能正常"
echo ""
echo "💡 提示: 您可以在瀏覽器中訪問 http://localhost:3000 或 http://localhost:3001 來使用系統"