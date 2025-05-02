const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Null for Google OAuth users
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'ceo', 'head', 'member', 'resource_manager', 'human_development', 'internal_affairs', 'cfo'), // Added 'cfo'
      defaultValue: 'member',
    },
    main_division_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    managerial_division_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    division_status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'rejected'),
      defaultValue: 'pending',
    },
    head_approval_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    available_times: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    event_roles: {
      type: DataTypes.JSONB, // Stores roles in events (e.g., head_coordinator, division_coordinator)
      allowNull: true,
    },
    retired_status: {
      type: DataTypes.ENUM('active', 'retired'),
      defaultValue: 'active',
    },
    profile_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};