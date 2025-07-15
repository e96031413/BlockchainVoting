/**
 * 選舉路由
 */
const express = require('express');
const electionController = require('../controllers/electionController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// 公共路由
router.get('/', electionController.getElections);
router.get('/:id', electionController.getElection);

// 受保護的路由（需要登入）
router.use(protect);

// 獲取用戶創建的選舉
router.get('/my', electionController.getMyElections);

// 創建選舉
router.post('/', electionController.createElection);

// 更新和刪除選舉（只有創建者和管理員可以）
router.put('/:id', electionController.updateElection);
router.delete('/:id', electionController.deleteElection);

module.exports = router;
