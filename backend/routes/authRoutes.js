/**
 * 用戶認證路由
 */
const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 公共路由
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// 受保護的路由（需要登入）
router.get('/me', protect, authController.getMe);
router.put('/updatedetails', protect, authController.updateDetails);
router.put('/updatepassword', protect, authController.updatePassword);

module.exports = router;
