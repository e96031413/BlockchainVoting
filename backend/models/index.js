/**
 * 模型索引文件
 * 設置模型之間的關聯，並導出所有模型
 */
const { sequelize } = require('../config/database');
const User = require('./User');
const Election = require('./Election');
const Candidate = require('./Candidate');
const Vote = require('./Vote');

// 設置模型之間的關聯
// 用戶與選舉的關聯（創建者）
User.hasMany(Election, { foreignKey: 'createdById', as: 'createdElections' });
Election.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });

// 選舉與候選人的關聯
Election.hasMany(Candidate, { foreignKey: 'electionId', as: 'candidates' });
Candidate.belongsTo(Election, { foreignKey: 'electionId', as: 'election' });

// 用戶與投票的關聯
User.hasMany(Vote, { foreignKey: 'userId', as: 'votes' });
Vote.belongsTo(User, { foreignKey: 'userId', as: 'voter' });

// 選舉與投票的關聯
Election.hasMany(Vote, { foreignKey: 'electionId', as: 'votes' });
Vote.belongsTo(Election, { foreignKey: 'electionId', as: 'election' });

// 候選人與投票的關聯
Candidate.hasMany(Vote, { foreignKey: 'candidateId', as: 'votes' });
Vote.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });

// 同步模型到數據庫
const syncDatabase = async () => {
  try {
    // 在開發環境中，可以使用 { force: true } 選項來重新創建表
    // 在生產環境中，應該使用 { alter: true } 或不使用任何選項
    await sequelize.sync();
    console.log('數據庫模型同步成功');
  } catch (error) {
    console.error('數據庫模型同步失敗:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Election,
  Candidate,
  Vote,
  syncDatabase,
};
