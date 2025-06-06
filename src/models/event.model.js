const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
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
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'), // Added 'cancelled'
      defaultValue: 'pending',
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('head_coordinator', 'coordinator', 'sub_coordinator', 'staff', ), 
      allowNull: true,
      defaultValue: 'staff'
    },
    coordinator_approval_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    approval_level: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 = staff, 1 = sub_coordinator, 2 = coordinator, 3 = head_coordinator
    }
  }, {
    tableName: 'events',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Event;
};