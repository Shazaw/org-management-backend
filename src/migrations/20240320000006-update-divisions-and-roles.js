'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update user roles enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'cfo';
    `);

    // Get admin user ID
    const [adminUser] = await queryInterface.sequelize.query(
      'SELECT id FROM "users" WHERE email = \'admin@omah-ti.com\'',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!adminUser) {
      throw new Error('Admin user not found. Please run the admin seeder first.');
    }

    // Drop existing divisions
    await queryInterface.bulkDelete('divisions', null, {});

    // Insert new main divisions
    await queryInterface.bulkInsert('divisions', [
      {
        id: uuidv4(),
        name: 'Data Science and Artificial Intelligence',
        type: 'main',
        description: 'Data Science and AI Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cybersecurity',
        type: 'main',
        description: 'Cybersecurity Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'UI/UX',
        type: 'main',
        description: 'UI/UX Design Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'FrontEnd',
        type: 'main',
        description: 'Front End Development Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'BackEnd',
        type: 'main',
        description: 'Back End Development Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mobile Apps',
        type: 'main',
        description: 'Mobile Application Development Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Competitive Programming',
        type: 'main',
        description: 'Competitive Programming Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Game Development',
        type: 'main',
        description: 'Game Development Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert new managerial divisions
    await queryInterface.bulkInsert('divisions', [
      {
        id: uuidv4(),
        name: 'Content and Design',
        type: 'managerial',
        description: 'Content and Design Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Resource Manager',
        type: 'managerial',
        description: 'Resource Management Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'External Affairs',
        type: 'managerial',
        description: 'External Affairs Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Research and Competition',
        type: 'managerial',
        description: 'Research and Competition Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Human Development',
        type: 'managerial',
        description: 'Human Development Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Business Management',
        type: 'managerial',
        description: 'Business Management Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Internal Affairs',
        type: 'managerial',
        description: 'Internal Affairs Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Information Technology',
        type: 'managerial',
        description: 'IT Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Project Management',
        type: 'managerial',
        description: 'Project Management Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Assignation Management',
        type: 'managerial',
        description: 'Assignation Management Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Skill Development',
        type: 'managerial',
        description: 'Skill Development Division',
        status: 'active',
        head_id: adminUser.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Drop existing events
    await queryInterface.bulkDelete('events', null, {});

    // Insert OmahTI Academy event
    await queryInterface.bulkInsert('events', [{
      id: uuidv4(),
      title: 'OmahTI Academy',
      description: 'OmahTI Academy Training Program',
      start_time: new Date('2024-05-01T09:00:00Z'),
      end_time: new Date('2024-12-31T17:00:00Z'),
      type: 'main_event',
      status: 'approved',
      role: 'head_coordinator',
      is_mandatory: true,
      location: 'Central Room',
      created_by: adminUser.id,
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Drop existing rooms
    await queryInterface.bulkDelete('rooms', null, {});

    // Insert new rooms
    await queryInterface.bulkInsert('rooms', [
      {
        id: uuidv4(),
        name: 'Inventory Room',
        capacity: 20,
        facilities: JSON.stringify(['storage', 'shelving', 'security']),
        status: 'available',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Meeting Room',
        capacity: 15,
        facilities: JSON.stringify(['projector', 'whiteboard', 'video conferencing']),
        status: 'available',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Central Room',
        capacity: 50,
        facilities: JSON.stringify(['stage', 'projector', 'sound system', 'seating']),
        status: 'available',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Note: We can't remove the 'cfo' enum value once added
    await queryInterface.bulkDelete('divisions', null, {});
    await queryInterface.bulkDelete('events', null, {});
    await queryInterface.bulkDelete('rooms', null, {});
  }
}; 