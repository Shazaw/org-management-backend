'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('cfo123', 10); // Default password
    const cfoId = uuidv4();

    await queryInterface.bulkInsert('users', [{
      id: cfoId,
      email: 'cfo@omahti.com',
      password: hashedPassword,
      name: 'OmahTI CFO',
      role: 'cfo',
      division_status: 'confirmed',
      head_approval_status: 'approved',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { role: 'cfo' }, {});
  }
};
