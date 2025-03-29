const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomBooking = sequelize.define('RoomBooking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  roomId: {
    type: DataTypes.UUID,
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
  purpose: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  bookedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

module.exports = RoomBooking; 