/**
 * 文件上傳控制器
 */
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// 上傳單個文件
exports.uploadFile = async (req, res) => {
  try {
    // 檢查文件是否存在
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '未提供文件',
      });
    }
    
    // 構建文件 URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // 返回文件信息
    res.status(200).json({
      success: true,
      message: '文件上傳成功',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '文件上傳失敗',
      error: error.message,
    });
  }
};

// 上傳多個文件
exports.uploadMultipleFiles = async (req, res) => {
  try {
    // 檢查文件是否存在
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '未提供文件',
      });
    }
    
    // 構建文件 URL
    const files = req.files.map(file => {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      return {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
      };
    });
    
    // 返回文件信息
    res.status(200).json({
      success: true,
      message: '文件上傳成功',
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '文件上傳失敗',
      error: error.message,
    });
  }
};

// 刪除文件
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // 檢查文件名是否有效
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: '未提供文件名',
      });
    }
    
    // 構建文件路徑
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // 檢查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '文件不存在',
      });
    }
    
    // 刪除文件
    fs.unlinkSync(filePath);
    
    // 返回結果
    res.status(200).json({
      success: true,
      message: '文件刪除成功',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '文件刪除失敗',
      error: error.message,
    });
  }
};
