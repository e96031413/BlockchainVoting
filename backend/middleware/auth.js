/**
 * 身份驗證中間件
 */
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

// 驗證 JWT 令牌
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // 從請求頭或 cookie 中獲取令牌
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    // 檢查令牌是否存在
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未授權，請登入',
      });
    }
    
    // 驗證令牌
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // 檢查用戶是否存在
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '此令牌的用戶不存在',
      });
    }
    
    // 將用戶信息添加到請求對象
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '未授權，請登入',
      error: error.message,
    });
  }
};

// 限制特定角色訪問
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '您沒有權限執行此操作',
      });
    }
    next();
  };
};
