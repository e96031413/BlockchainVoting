/**
 * 投票控制器
 */
const { Vote, Election, Candidate, User } = require('../models');
const { sequelize } = require('../config/database');

// 投票
exports.castVote = async (req, res) => {
  // 開始事務
  const transaction = await sequelize.transaction();
  
  try {
    const { electionId, candidateId } = req.body;
    
    // 檢查選舉是否存在
    const election = await Election.findByPk(electionId);
    if (!election) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: '找不到選舉',
      });
    }
    
    // 檢查選舉是否處於活動狀態
    if (election.status !== 'active') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: '此選舉目前不接受投票',
      });
    }
    
    // 檢查候選人是否存在
    const candidate = await Candidate.findOne({
      where: {
        id: candidateId,
        electionId,
      },
    });
    
    if (!candidate) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: '找不到候選人',
      });
    }
    
    // 檢查用戶是否已經投票
    const existingVote = await Vote.findOne({
      where: {
        userId: req.user.id,
        electionId,
      },
    });
    
    if (existingVote) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: '您已經在此選舉中投票',
      });
    }
    
    // 創建投票記錄
    const vote = await Vote.create({
      userId: req.user.id,
      electionId,
      candidateId,
      ipAddress: req.ip,
    }, { transaction });
    
    // 更新候選人的票數
    candidate.votes += 1;
    await candidate.save({ transaction });
    
    // 提交事務
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      message: '投票成功',
      vote,
    });
  } catch (error) {
    // 回滾事務
    await transaction.rollback();
    
    res.status(500).json({
      success: false,
      message: '投票失敗',
      error: error.message,
    });
  }
};

// 獲取用戶的投票歷史
exports.getMyVotes = async (req, res) => {
  try {
    const votes = await Vote.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Election,
          as: 'election',
        },
        {
          model: Candidate,
          as: 'candidate',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    res.status(200).json({
      success: true,
      count: votes.length,
      votes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取投票歷史失敗',
      error: error.message,
    });
  }
};

// 檢查用戶是否已經在特定選舉中投票
exports.checkVoteStatus = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    // 檢查選舉是否存在
    const election = await Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: '找不到選舉',
      });
    }
    
    // 檢查用戶是否已經投票
    const vote = await Vote.findOne({
      where: {
        userId: req.user.id,
        electionId,
      },
      include: [
        {
          model: Candidate,
          as: 'candidate',
        },
      ],
    });
    
    res.status(200).json({
      success: true,
      hasVoted: !!vote,
      vote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '檢查投票狀態失敗',
      error: error.message,
    });
  }
};

// 獲取選舉結果
exports.getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    // 檢查選舉是否存在
    const election = await Election.findByPk(electionId, {
      include: [
        {
          model: Candidate,
          as: 'candidates',
          attributes: ['id', 'name', 'description', 'votes', 'imageUrl'],
          order: [['votes', 'DESC']],
        },
      ],
    });
    
    if (!election) {
      return res.status(404).json({
        success: false,
        message: '找不到選舉',
      });
    }
    
    // 計算總票數
    const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    
    // 計算每個候選人的得票百分比
    const results = election.candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      description: candidate.description,
      votes: candidate.votes,
      percentage: totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0,
      imageUrl: candidate.imageUrl,
    }));
    
    // 按票數排序
    results.sort((a, b) => b.votes - a.votes);
    
    res.status(200).json({
      success: true,
      electionId,
      totalVotes,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取選舉結果失敗',
      error: error.message,
    });
  }
};
