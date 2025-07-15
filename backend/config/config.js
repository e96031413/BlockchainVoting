/**
 * 應用程序配置
 */
require('dotenv').config();

module.exports = {
  // 服務器配置
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // 數據庫配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'blockchain_voting',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    url: process.env.DATABASE_URL,
  },
  
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // 區塊鏈配置
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545',
    chainId: process.env.BLOCKCHAIN_CHAIN_ID || 1337,
    votingContractAddress: process.env.VOTING_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
  
  // 郵件配置
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM || 'noreply@blockvoting.com',
  },
  
  // 文件上傳配置
  upload: {
    maxSize: process.env.UPLOAD_MAX_SIZE || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
};
