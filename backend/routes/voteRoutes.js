/**
 * 投票路由
 */
const express = require('express');
const voteController = require('../controllers/voteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 所有投票路由都需要登入
router.use(protect);

// 投票
router.post('/', voteController.castVote);

// 獲取用戶的投票歷史
router.get('/me', voteController.getMyVotes);

// 檢查用戶是否已經在特定選舉中投票
router.get('/check/:electionId', voteController.checkVoteStatus);

// 獲取選舉結果
router.get('/results/:electionId', voteController.getElectionResults);

module.exports = router;
