'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'ceo', 'head', 'member'),
        defaultValue: 'member',
      },
      mainDivisionId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      managerialDivisionId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      divisionStatus: {
        type: Sequelize.ENUM('pending', 'confirmed', 'rejected'),
        defaultValue: 'pending',
      },
      availableTimes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
}; 