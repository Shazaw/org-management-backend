const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DivisionProgress = sequelize.define('DivisionProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  division_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  progress: {
    type: DataTypes.ENUM('planned', 'ongoing', 'finished'),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  submitted_by: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'division_progress',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DivisionProgress;