'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'head_approval_status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false,
    });

    await queryInterface.addColumn('users', 'approved_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'head_approval_status');
    await queryInterface.removeColumn('users', 'approved_by');
  }
}; 