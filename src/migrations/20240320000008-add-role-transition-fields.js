'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add fields to users table for role transitions
    await queryInterface.addColumn('users', 'previous_role', {
      type: Sequelize.ENUM('admin', 'ceo', 'cfo', 'head', 'member'),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'role_transition_date', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'handover_completed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // Add fields to events table for completion tracking
    await queryInterface.addColumn('events', 'completed_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('events', 'completed_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    });

    await queryInterface.addColumn('events', 'completion_notes', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'previous_role');
    await queryInterface.removeColumn('users', 'role_transition_date');
    await queryInterface.removeColumn('users', 'handover_completed');
    await queryInterface.removeColumn('events', 'completed_at');
    await queryInterface.removeColumn('events', 'completed_by');
    await queryInterface.removeColumn('events', 'completion_notes');
  }
}; 