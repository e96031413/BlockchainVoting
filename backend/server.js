/**
 * 主應用程序文件
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// 加載環境變量
dotenv.config();

// 導入路由
const authRoutes = require('./routes/authRoutes');
const electionRoutes = require('./routes/electionRoutes');
const voteRoutes = require('./routes/voteRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// 導入錯誤處理中間件
const { notFound, errorHandler } = require('./middleware/error');

// 導入數據庫
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// 創建 Express 應用
const app = express();

// 設置中間件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// 日誌中間件
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 設置靜態文件夾
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 設置路由
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/uploads', uploadRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '歡迎使用區塊鏈投票系統 API',
  });
});

// 錯誤處理中間件
app.use(notFound);
app.use(errorHandler);

// 設置端口
const PORT = process.env.PORT || 5000;

// 啟動服務器
const startServer = async () => {
  try {
    // 測試數據庫連接
    await testConnection();
    
    // 同步數據庫模型
    await syncDatabase();
    
    // 啟動服務器
    app.listen(PORT, () => {
      console.log(`服務器運行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('無法啟動服務器:', error);
    process.exit(1);
  }
};

startServer();
