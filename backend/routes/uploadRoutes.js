/**
 * 文件上傳路由
 */
const express = require('express');
const uploadController = require('../controllers/uploadController');
const { upload, handleUploadError } = require('../middleware/upload');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 所有上傳路由都需要登入
router.use(protect);

// 上傳單個文件
router.post('/file', upload.single('file'), handleUploadError, uploadController.uploadFile);

// 上傳多個文件
router.post('/files', upload.array('files', 5), handleUploadError, uploadController.uploadMultipleFiles);

// 刪除文件
router.delete('/:filename', uploadController.deleteFile);

module.exports = router;
