'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, check if admin user exists
    const existingAdmin = await queryInterface.sequelize.query(
      'SELECT * FROM "Users" WHERE email = \'admin@omah-ti.com\'',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin.length === 0) {
      // Create admin user
      await queryInterface.bulkInsert('Users', [{
        id: uuidv4(),
        email: 'admin@omah-ti.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: 'admin',
        divisionStatus: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@omah-ti.com' }, {});
  }
}; 