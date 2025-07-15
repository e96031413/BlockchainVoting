// 引入必要的套件
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 載入環境變數
dotenv.config();

// 創建 Express 應用
const app = express();

// 設置中間件
app.use(cors());
app.use(express.json());

// 定義端口
const PORT = process.env.PORT || 5000;

// 基本路由
app.get('/', (req, res) => {
  res.json({
    message: '歡迎使用區塊鏈投票系統 API',
    status: 'online',
    time: new Date().toISOString()
  });
});

// API 路由
app.use('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
