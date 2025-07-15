/**
 * 投票模型
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  electionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  candidateId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  transactionHash: {
    type: DataTypes.STRING,
  },
  blockNumber: {
    type: DataTypes.INTEGER,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ipAddress: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'electionId'],
      name: 'unique_user_election_vote'
    },
  ],
});

module.exports = Vote;
