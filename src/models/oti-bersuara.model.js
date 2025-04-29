const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OtiBersuara = sequelize.define('OtiBersuara', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  visibility: {
    type: DataTypes.ENUM('anonymous', 'department_only'),
    defaultValue: 'anonymous',
  },
  department: {
    type: DataTypes.ENUM('human_development', 'all'),
    defaultValue: 'all',
  },
  status: {
    type: DataTypes.ENUM('pending', 'read', 'archived'),
    defaultValue: 'pending',
  },
  read_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'oti_bersuara',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = OtiBersuara; 