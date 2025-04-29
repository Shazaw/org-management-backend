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
  report_type: {
    type: DataTypes.ENUM('meeting', 'event', 'competition', 'task', 'note'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('planned', 'ongoing', 'completed'),
    defaultValue: 'planned',
  },
  progress_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  division_role: {
    type: DataTypes.ENUM('head', 'coordinator', 'member'),
    allowNull: false,
  }
}, {
  tableName: 'division_progress',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = DivisionProgress; 