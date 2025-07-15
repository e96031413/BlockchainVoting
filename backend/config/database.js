/**
 * 數據庫連接配置
 */
const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('./config');

// 定義 SQLite 數據庫文件路徑
const dbPath = path.resolve(__dirname, '../database.sqlite');

// 創建 Sequelize 實例
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: config.server.env === 'development' ? console.log : false,
});

// 測試數據庫連接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('數據庫連接成功');
  } catch (error) {
    console.error('無法連接到數據庫:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
};
