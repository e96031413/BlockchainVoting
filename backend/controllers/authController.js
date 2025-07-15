/**
 * 用戶認證控制器
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const config = require('../config/config');

// 生成 JWT 令牌
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// 註冊新用戶
exports.register = async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;
    
    // 檢查用戶是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '該電子郵件已被註冊',
      });
    }
    
    // 創建驗證令牌
    const verificationToken = crypto.randomBytes(20).toString('hex');
    
    // 創建新用戶
    const user = await User.create({
      name,
      email,
      password,
      walletAddress,
      verificationToken,
    });
    
    // 移除敏感信息
    user.password = undefined;
    user.verificationToken = undefined;
    
    // 生成 JWT 令牌
    const token = generateToken(user.id);
    
    // 設置 cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 天
      httpOnly: true,
      secure: config.server.env === 'production',
    };
    res.cookie('token', token, cookieOptions);
    
    // 返回用戶信息和令牌
    res.status(201).json({
      success: true,
      message: '註冊成功',
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '註冊失敗',
      error: error.message,
    });
  }
};

// 用戶登入
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 檢查電子郵件和密碼是否提供
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '請提供電子郵件和密碼',
      });
    }
    
    // 查找用戶
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '電子郵件或密碼不正確',
      });
    }
    
    // 檢查密碼是否正確
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '電子郵件或密碼不正確',
      });
    }
    
    // 移除敏感信息
    user.password = undefined;
    user.verificationToken = undefined;
    
    // 生成 JWT 令牌
    const token = generateToken(user.id);
    
    // 設置 cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 天
      httpOnly: true,
      secure: config.server.env === 'production',
    };
    res.cookie('token', token, cookieOptions);
    
    // 返回用戶信息和令牌
    res.status(200).json({
      success: true,
      message: '登入成功',
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登入失敗',
      error: error.message,
    });
  }
};

// 登出
exports.logout = (req, res) => {
  // 清除 cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 秒後過期
    httpOnly: true,
  });
  
  res.status(200).json({
    success: true,
    message: '登出成功',
  });
};

// 獲取當前用戶信息
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] },
    });
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取用戶信息失敗',
      error: error.message,
    });
  }
};

// 更新用戶信息
exports.updateDetails = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // 更新用戶信息
    const user = await User.findByPk(req.user.id);
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    
    // 移除敏感信息
    user.password = undefined;
    user.verificationToken = undefined;
    
    res.status(200).json({
      success: true,
      message: '用戶信息更新成功',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新用戶信息失敗',
      error: error.message,
    });
  }
};

// 更新密碼
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 檢查當前密碼和新密碼是否提供
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '請提供當前密碼和新密碼',
      });
    }
    
    // 查找用戶
    const user = await User.findByPk(req.user.id);
    
    // 檢查當前密碼是否正確
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '當前密碼不正確',
      });
    }
    
    // 更新密碼
    user.password = newPassword;
    await user.save();
    
    // 生成新的 JWT 令牌
    const token = generateToken(user.id);
    
    // 設置 cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 天
      httpOnly: true,
      secure: config.server.env === 'production',
    };
    res.cookie('token', token, cookieOptions);
    
    res.status(200).json({
      success: true,
      message: '密碼更新成功',
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新密碼失敗',
      error: error.message,
    });
  }
};
