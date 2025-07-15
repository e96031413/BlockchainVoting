/**
 * 文件上傳中間件
 */
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const config = require('../config/config');

// 設置存儲引擎
const storage = multer.diskStorage({
  // 設置上傳文件的目的地
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  // 設置上傳文件的文件名
  filename: (req, file, cb) => {
    // 生成隨機文件名
    const randomName = crypto.randomBytes(16).toString('hex');
    // 獲取文件擴展名
    const ext = path.extname(file.originalname);
    // 設置文件名
    cb(null, `${randomName}${ext}`);
  },
});

// 文件過濾器
const fileFilter = (req, file, cb) => {
  // 檢查文件類型是否允許
  const allowedTypes = config.upload.allowedTypes;
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件類型。允許的類型: ${allowedTypes.join(', ')}`), false);
  }
};

// 創建 multer 實例
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize,
  },
});

// 處理上傳錯誤
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `文件大小超過限制 (${config.upload.maxSize / (1024 * 1024)} MB)`,
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  next();
};

module.exports = {
  upload,
  handleUploadError,
};
