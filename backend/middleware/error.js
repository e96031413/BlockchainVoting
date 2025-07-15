/**
 * 錯誤處理中間件
 */

// 處理 404 錯誤
exports.notFound = (req, res, next) => {
  const error = new Error(`找不到 - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// 處理所有其他錯誤
exports.errorHandler = (err, req, res, next) => {
  // 如果狀態碼仍然是 200，則設置為 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // 設置響應狀態碼
  res.status(statusCode);
  
  // 返回錯誤信息
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
