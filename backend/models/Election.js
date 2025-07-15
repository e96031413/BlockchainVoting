/**
 * 選舉模型
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Election = sequelize.define('Election', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('created', 'active', 'closed', 'tallied'),
    defaultValue: 'created',
  },
  organization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maxSelectCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  blockchainAddress: {
    type: DataTypes.STRING,
  },
  transactionHash: {
    type: DataTypes.STRING,
  },
  createdById: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Election;
