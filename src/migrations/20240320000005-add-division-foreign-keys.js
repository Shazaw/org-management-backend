'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Users', {
      fields: ['mainDivisionId'],
      type: 'foreign key',
      name: 'users_mainDivisionId_fkey',
      references: {
        table: 'Divisions',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Users', {
      fields: ['managerialDivisionId'],
      type: 'foreign key',
      name: 'users_managerialDivisionId_fkey',
      references: {
        table: 'Divisions',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Users', 'users_managerialDivisionId_fkey');
    await queryInterface.removeConstraint('Users', 'users_mainDivisionId_fkey');
  }
}; 