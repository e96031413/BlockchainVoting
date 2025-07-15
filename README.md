# 區塊鏈投票系統 🗳️

這是一個基於區塊鏈技術的電子投票系統，旨在提供安全、透明和高效的投票解決方案。

## 🚀 快速開始

### 一鍵啟動（推薦）

```bash
./start.sh
```

### 一鍵停止

```bash
./stop.sh
```

## ✨ 最新修復和改進

### 🔧 後端修復
- ✅ 修復了環境變數配置問題，添加了完整的 `.env` 文件
- ✅ 修復了數據庫模型關聯問題
- ✅ 完善了所有控制器的錯誤處理
- ✅ 修復了投票模型的唯一性約束
- ✅ 優化了選舉搜索功能，支持多字段搜索
- ✅ 完善了文件上傳功能和中間件

### 🎨 前端修復
- ✅ 修復了用戶認證狀態管理
- ✅ 完善了所有頁面組件的實現
- ✅ 添加了響應式設計支持
- ✅ 修復了API服務調用問題
- ✅ 完善了錯誤處理和用戶體驗
- ✅ 添加了完整的選舉詳情頁面
- ✅ 實現了投票功能和結果顯示

### ⛓️ 區塊鏈修復
- ✅ 完善了智能合約的安全性檢查
- ✅ 添加了完整的測試套件
- ✅ 修復了部署腳本
- ✅ 優化了合約的 gas 使用

### 🛠️ 系統改進
- ✅ 添加了自動化啟動和停止腳本
- ✅ 完善了錯誤日誌記錄
- ✅ 優化了開發體驗
- ✅ 添加了完整的文檔

## 項目概述

區塊鏈投票系統是一個完整的全棧應用程序，包括：

- **前端**：使用 React 和 Tailwind CSS 構建的用戶界面
- **後端**：使用 Express.js 和 SQLite 構建的 API 服務
- **區塊鏈**：使用 Solidity 編寫的智能合約，部署在本地區塊鏈上

## 功能特點

- 用戶註冊和身份驗證
- 創建和管理選舉
- 安全投票
- 實時結果統計
- 區塊鏈上的投票記錄，確保透明和不可篡改
- 響應式設計，支持各種設備

## 技術棧

### 前端
- React.js 19.1.0
- TypeScript
- Tailwind CSS
- React Router
- Zustand (狀態管理)
- Ethers.js (區塊鏈交互)

### 後端
- Node.js
- Express.js
- SQLite (開發環境)
- Sequelize ORM
- JSON Web Token (JWT)
- bcryptjs (密碼加密)

### 區塊鏈
- Solidity 0.8.19
- Hardhat
- Ethers.js

## 項目結構

```
Blockchain_Web/
├── frontend/            # 前端 React 應用
│   ├── public/         # 靜態文件
│   ├── src/           # 源代碼
│   │   ├── components/ # React 組件
│   │   ├── pages/     # 頁面組件
│   │   ├── services/  # API 服務
│   │   ├── stores/    # Zustand 狀態管理
│   │   └── utils/     # 工具函數
│   └── package.json
├── backend/            # 後端 Express API
│   ├── config/        # 配置文件
│   ├── controllers/   # 控制器
│   ├── middleware/    # 中間件
│   ├── models/        # 數據模型
│   ├── routes/        # 路由定義
│   ├── utils/         # 工具函數
│   ├── uploads/       # 文件上傳目錄
│   ├── database.sqlite # SQLite 數據庫
│   └── package.json
├── blockchain/         # 區塊鏈智能合約
│   ├── contracts/     # Solidity 合約
│   ├── scripts/       # 部署腳本
│   ├── artifacts/     # 編譯後的合約
│   └── package.json
└── README.md
```

## 快速開始

### 前提條件
- Node.js (v16 或更高版本)
- npm 或 yarn
- Git

### 一鍵啟動

1. **克隆項目**
   ```bash
   git clone <repository-url>
   cd Blockchain_Web
   ```

2. **安裝所有依賴**
   ```bash
   # 安裝後端依賴
   cd backend && npm install
   
   # 安裝前端依賴
   cd ../frontend && npm install
   
   # 安裝區塊鏈依賴
   cd ../blockchain && npm install
   ```

3. **啟動區塊鏈節點**
   ```bash
   cd blockchain
   npx hardhat node
   ```
   保持此終端運行，這將啟動本地區塊鏈節點。

4. **部署智能合約**
   ```bash
   # 在新終端中運行
   cd blockchain
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   ```
   記下輸出的合約地址。

5. **啟動後端服務器**
   ```bash
   # 在新終端中運行
   cd backend
   npm start
   ```
   後端將在 http://localhost:5000 運行。

6. **啟動前端應用**
   ```bash
   # 在新終端中運行
   cd frontend
   npm start
   ```
   前端將在 http://localhost:3001 運行。

7. **開始使用**
   在瀏覽器中打開 http://localhost:3001 開始使用系統。

## 功能說明

### 1. 用戶管理
- **註冊**：新用戶可以註冊帳戶，包括姓名、電子郵件和密碼
- **登入**：已註冊用戶可以使用電子郵件和密碼登入
- **個人資料**：用戶可以查看和更新個人信息
- **安全**：密碼使用 bcrypt 加密存儲，使用 JWT 進行身份驗證

### 2. 選舉管理
- **創建選舉**：用戶可以創建新的選舉活動
  - 設置選舉標題和描述
  - 指定開始和結束時間
  - 添加候選人信息
  - 設置最大選擇數量
- **選舉列表**：瀏覽所有可用的選舉
- **選舉詳情**：查看特定選舉的詳細信息和候選人

### 3. 投票功能
- **安全投票**：確保每個用戶在每個選舉中只能投票一次
- **實時驗證**：檢查選舉狀態和時間限制
- **透明記錄**：所有投票都記錄在區塊鏈上
- **即時結果**：投票後立即查看更新的結果

### 4. 區塊鏈集成
- **智能合約**：使用 Solidity 編寫的投票合約
- **透明性**：所有投票記錄都存儲在區塊鏈上
- **不可篡改**：一旦記錄在區塊鏈上，投票結果無法被修改
- **可驗證**：任何人都可以驗證投票的真實性

## API 端點

### 認證相關
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `GET /api/auth/logout` - 用戶登出
- `GET /api/auth/me` - 獲取當前用戶信息
- `PUT /api/auth/updatedetails` - 更新用戶資料
- `PUT /api/auth/updatepassword` - 更新密碼

### 選舉相關
- `GET /api/elections` - 獲取選舉列表
- `GET /api/elections/:id` - 獲取特定選舉
- `POST /api/elections` - 創建新選舉
- `PUT /api/elections/:id` - 更新選舉
- `DELETE /api/elections/:id` - 刪除選舉
- `GET /api/elections/my` - 獲取我創建的選舉

### 投票相關
- `POST /api/votes` - 投票
- `GET /api/votes/my` - 獲取我的投票歷史
- `GET /api/votes/status/:electionId` - 檢查投票狀態
- `GET /api/votes/results/:electionId` - 獲取選舉結果

## 智能合約功能

### 主要功能
- `createElection()` - 創建新選舉
- `vote()` - 進行投票
- `getElectionResults()` - 獲取選舉結果
- `hasVoted()` - 檢查是否已投票

### 安全特性
- 確保每個地址只能在每個選舉中投票一次
- 時間限制驗證
- 候選人存在性檢查
- 選民註冊和驗證

## 數據庫模型

### User (用戶)
- id, name, email, password, walletAddress
- isVerified, role, avatarUrl
- 創建和更新時間戳

### Election (選舉)
- id, title, description, startTime, endTime
- status, organization, maxSelectCount
- 創建者 ID 和區塊鏈地址

### Candidate (候選人)
- id, name, description, imageUrl
- 所屬選舉 ID 和得票數

### Vote (投票)
- id, userId, electionId, candidateId
- 交易哈希和區塊號
- IP 地址和時間戳

## 環境配置

### 後端環境變量 (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_CHAIN_ID=1337
VOTING_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 前端環境變量 (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BLOCKCHAIN_RPC_URL=http://localhost:8545
REACT_APP_VOTING_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## 測試

### 測試用戶註冊
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "測試用戶", "email": "test@example.com", "password": "123456"}'
```

### 測試用戶登入
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "123456"}'
```

## 故障排除

### 常見問題

1. **端口衝突**
   - 如果 3000 端口被占用，前端會自動使用 3001 端口
   - 如果 5000 端口被占用，請修改後端 .env 文件中的 PORT

2. **區塊鏈連接問題**
   - 確保 Hardhat 節點正在運行
   - 檢查合約地址是否正確配置
   - 確認 RPC URL 設置正確

3. **數據庫問題**
   - SQLite 數據庫會自動創建
   - 如果需要重置數據庫，刪除 `backend/database.sqlite` 文件

4. **依賴安裝問題**
   - 清除 node_modules 並重新安裝：`rm -rf node_modules && npm install`
   - 更新 npm：`npm install -g npm@latest`

## 安全考慮

1. **密碼安全**：使用 bcrypt 進行密碼哈希
2. **JWT 安全**：設置適當的過期時間和安全密鑰
3. **輸入驗證**：所有用戶輸入都經過驗證
4. **CORS 配置**：限制跨域請求來源
5. **區塊鏈安全**：智能合約包含必要的安全檢查

## 開發狀態

### 已完成功能 ✅
- 用戶註冊和登入系統
- 選舉創建和管理
- 投票功能
- 區塊鏈集成
- 前端用戶界面
- 後端 API
- 智能合約部署
- 基本測試

### 下一步開發計劃
- 單元測試和集成測試
- 用戶頭像上傳功能
- 選舉結果可視化圖表
- 實時通知系統
- 多語言支持
- 生產環境部署配置

## 許可證

本項目採用 MIT 許可證。詳見 LICENSE 文件。

## 貢獻

歡迎提交 Issue 和 Pull Request！請遵循項目的代碼風格和提交規範。
