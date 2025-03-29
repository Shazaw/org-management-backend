const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OtiBersuara = sequelize.define('OtiBersuara', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('grievance', 'suggestion', 'complaint', 'other'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'in_progress', 'resolved'),
    defaultValue: 'unread',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  respondedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = OtiBersuara; 