/**
 * 選舉控制器
 */
const { Election, Candidate, User, Vote } = require('../models');
const { sequelize } = require('../config/database');

// 獲取所有選舉
exports.getElections = async (req, res) => {
  try {
    // 查詢參數
    const { status, search, page = 1, limit = 10 } = req.query;
    
    // 構建查詢條件
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause[sequelize.Op.or] = [
        { title: { [sequelize.Op.like]: `%${search}%` } },
        { description: { [sequelize.Op.like]: `%${search}%` } },
        { organization: { [sequelize.Op.like]: `%${search}%` } }
      ];
    }
    
    // 計算分頁
    const offset = (page - 1) * limit;
    
    // 查詢選舉
    const { count, rows: elections } = await Election.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Candidate,
          as: 'candidates',
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit),
    });
    
    // 返回結果
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      elections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取選舉列表失敗',
      error: error.message,
    });
  }
};

// 獲取單個選舉
exports.getElection = async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Candidate,
          as: 'candidates',
          include: [
            {
              model: Vote,
              as: 'votes',
              attributes: ['id'],
            },
          ],
        },
      ],
    });
    
    if (!election) {
      return res.status(404).json({
        success: false,
        message: '找不到選舉',
      });
    }
    
    res.status(200).json({
      success: true,
      election,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取選舉失敗',
      error: error.message,
    });
  }
};

// 創建選舉
exports.createElection = async (req, res) => {
  // 開始事務
  const transaction = await sequelize.transaction();
  
  try {
    const { title, description, startTime, endTime, organization, maxSelectCount, candidates } = req.body;
    
    // 創建選舉
    const election = await Election.create({
      title,
      description,
      startTime,
      endTime,
      organization,
      maxSelectCount: maxSelectCount || 1,
      createdById: req.user.id,
      status: new Date(startTime) <= new Date() ? 'active' : 'created',
    }, { transaction });
    
    // 創建候選人
    if (candidates && candidates.length > 0) {
      const candidatePromises = candidates.map((candidate, index) => {
        return Candidate.create({
          name: candidate.name,
          description: candidate.description,
          imageUrl: candidate.imageUrl,
          electionId: election.id,
          order: index,
        }, { transaction });
      });
      
      await Promise.all(candidatePromises);
    }
    
    // 提交事務
    await transaction.commit();
    
    // 獲取完整的選舉信息（包括候選人）
    const createdElection = await Election.findByPk(election.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Candidate,
          as: 'candidates',
        },
      ],
    });
    
    res.status(201).json({
      success: true,
      message: '選舉創建成功',
      election: createdElection,
    });
  } catch (error) {
    // 回滾事務
    await transaction.rollback();
    
    res.status(500).json({
      success: false,
      message: '創建選舉失敗',
      error: error.message,
    });
  }
};

// 更新選舉
exports.updateElection = async (req, res) => {
  // 開始事務
  const transaction = await sequelize.transaction();
  
  try {
    const { title, description, startTime, endTime, organization, maxSelectCount, status } = req.body;
    
    // 查找選舉
    const election = await Election.findByPk(req.params.id);
    
    if (!election) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: '找不到選舉',
      });
    }
    
    // 檢查是否為創建者
    if (election.createdById !== req.user.id && req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: '您沒有權限更新此選舉',
      });
    }
    
    // 更新選舉
    election.title = title || election.title;
    election.description = description || election.description;
    election.startTime = startTime || election.startTime;
    election.endTime = endTime || election.endTime;
    election.organization = organization || election.organization;
    election.maxSelectCount = maxSelectCount || election.maxSelectCount;
    
    // 只有管理員可以直接更改狀態
    if (status && req.user.role === 'admin') {
      election.status = status;
    } else {
      // 根據時間自動更新狀態
      const now = new Date();
      if (new Date(election.startTime) <= now && new Date(election.endTime) > now) {
        election.status = 'active';
      } else if (new Date(election.endTime) <= now) {
        election.status = 'closed';
      } else {
        election.status = 'created';
      }
    }
    
    await election.save({ transaction });
    
    // 提交事務
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: '選舉更新成功',
      election,
    });
  } catch (error) {
    // 回滾事務
    await transaction.rollback();
    
    res.status(500).json({
      success: false,
      message: '更新選舉失敗',
      error: error.message,
    });
  }
};

// 刪除選舉
exports.deleteElection = async (req, res) => {
  // 開始事務
  const transaction = await sequelize.transaction();
  
  try {
    // 查找選舉
    const election = await Election.findByPk(req.params.id);
    
    if (!election) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: '找不到選舉',
      });
    }
    
    // 檢查是否為創建者或管理員
    if (election.createdById !== req.user.id && req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: '您沒有權限刪除此選舉',
      });
    }
    
    // 刪除相關的候選人和投票
    await Candidate.destroy({
      where: { electionId: election.id },
      transaction,
    });
    
    await Vote.destroy({
      where: { electionId: election.id },
      transaction,
    });
    
    // 刪除選舉
    await election.destroy({ transaction });
    
    // 提交事務
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: '選舉刪除成功',
    });
  } catch (error) {
    // 回滾事務
    await transaction.rollback();
    
    res.status(500).json({
      success: false,
      message: '刪除選舉失敗',
      error: error.message,
    });
  }
};

// 獲取用戶創建的選舉
exports.getMyElections = async (req, res) => {
  try {
    const elections = await Election.findAll({
      where: { createdById: req.user.id },
      include: [
        {
          model: Candidate,
          as: 'candidates',
          include: [
            {
              model: Vote,
              as: 'votes',
              attributes: ['id'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    res.status(200).json({
      success: true,
      count: elections.length,
      elections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取我的選舉失敗',
      error: error.message,
    });
  }
};
