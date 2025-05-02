'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, add retired to the role enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'retired';
    `);

    // Add retirement approval fields
    await queryInterface.addColumn('users', 'retirement_status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: null,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'retirement_requested_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'retirement_approved_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'retirement_approved_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'retirement_status');
    await queryInterface.removeColumn('users', 'retirement_requested_at');
    await queryInterface.removeColumn('users', 'retirement_approved_at');
    await queryInterface.removeColumn('users', 'retirement_approved_by');
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" DROP VALUE 'retired';
    `); // Ensure the 'retired' value is removed
  }
};