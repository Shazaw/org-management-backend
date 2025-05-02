'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if admin user exists
      const [adminUser] = await queryInterface.sequelize.query(
        'SELECT id FROM users WHERE email = :email',
        {
          replacements: { email: 'admin@omah-ti.com' },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      const adminId = adminUser ? adminUser.id : uuidv4();
      const adminPassword = await bcrypt.hash('admin123', 10);

      if (!adminUser) {
        await queryInterface.bulkInsert('users', [{
          id: adminId,
          email: 'admin@omah-ti.com',
          password: adminPassword,
          name: 'Admin User',
          role: 'admin',
          division_status: 'confirmed',
          created_at: new Date(),
          updated_at: new Date(),
        }]);
      } else {
        await queryInterface.sequelize.query(
          'UPDATE users SET password = :password, name = :name, role = :role, division_status = :divisionStatus, updated_at = :updatedAt WHERE id = :id',
          {
            replacements: {
              id: adminId,
              password: adminPassword,
              name: 'Admin User',
              role: 'admin',
              divisionStatus: 'confirmed',
              updatedAt: new Date()
            }
          }
        );
      }

      // Check if CEO user exists
      const [ceoUser] = await queryInterface.sequelize.query(
        'SELECT id FROM users WHERE email = :email',
        {
          replacements: { email: 'ceo@omah-ti.com' },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      const ceoId = ceoUser ? ceoUser.id : uuidv4();
      const ceoPassword = await bcrypt.hash('ceo123', 10);

      if (!ceoUser) {
        await queryInterface.bulkInsert('users', [{
          id: ceoId,
          email: 'ceo@omah-ti.com',
          password: ceoPassword,
          name: 'CEO User',
          role: 'ceo',
          division_status: 'confirmed',
          created_at: new Date(),
          updated_at: new Date(),
        }]);
      } else {
        await queryInterface.sequelize.query(
          'UPDATE users SET password = :password, name = :name, role = :role, division_status = :divisionStatus, updated_at = :updatedAt WHERE id = :id',
          {
            replacements: {
              id: ceoId,
              password: ceoPassword,
              name: 'CEO User',
              role: 'ceo',
              divisionStatus: 'confirmed',
              updatedAt: new Date()
            }
          }
        );
      }

      // Check if CFO user exists
      const [cfoUser] = await queryInterface.sequelize.query(
        'SELECT id FROM users WHERE email = :email',
        {
          replacements: { email: 'cfo@omahti.com' },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      const cfoId = cfoUser ? cfoUser.id : uuidv4();
      const hashedPassword = await bcrypt.hash('cfo123', 10);

      if (!cfoUser) {
        await queryInterface.bulkInsert('users', [{
          id: cfoId,
          email: 'cfo@omahti.com',
          password: hashedPassword,
          name: 'OmahTI CFO',
          role: 'cfo', // Ensure 'cfo' is valid
          division_status: 'confirmed',
          head_approval_status: 'approved',
          created_at: new Date(),
          updated_at: new Date(),
        }]);
      } else {
        await queryInterface.sequelize.query(
          'UPDATE users SET password = :password, name = :name, role = :role, division_status = :divisionStatus, head_approval_status = :headApprovalStatus, updated_at = :updatedAt WHERE id = :id',
          {
            replacements: {
              id: cfoId,
              password: hashedPassword,
              name: 'OmahTI CFO',
              role: 'cfo',
              divisionStatus: 'confirmed',
              headApprovalStatus: 'approved',
              updatedAt: new Date()
            }
          }
        );
      }

      // Create or update divisions
      const divisions = [
        // Main Divisions
        {
          name: 'Cybersecurity',
          type: 'main',
          description: 'Cybersecurity Division',
          head_id: adminId,
          status: 'active'
        },
        {
          name: 'Data Science',
          type: 'main',
          description: 'Data Science Division',
          head_id: adminId,
          status: 'active'
        },
        {
          name: 'Front End',
          type: 'main',
          description: 'Front End Development Division',
          head_id: adminId,
          status: 'active'
        },
        {
          name: 'Back End',
          type: 'main',
          description: 'Back End Development Division',
          head_id: adminId,
          status: 'active'
        },
        {
          name: 'UI/UX',
          type: 'main',
          description: 'UI/UX Design Division',
          head_id: adminId,
          status: 'active'
        },
        // Managerial Divisions
        {
          name: 'Research and Competition',
          type: 'managerial',
          description: 'Research and Competition Division',
          head_id: ceoId,
          status: 'active'
        },
        {
          name: 'Resource Manager',
          type: 'managerial',
          description: 'Resource Management Division',
          head_id: ceoId,
          status: 'active'
        },
        {
          name: 'Creative and Design',
          type: 'managerial',
          description: 'Creative and Design Division',
          head_id: ceoId,
          status: 'active'
        },
        {
          name: 'Internal Affairs',
          type: 'managerial',
          description: 'Internal Affairs Division',
          head_id: ceoId,
          status: 'active'
        }
      ];

      const divisionIds = {};
      for (const division of divisions) {
        const [existingDivision] = await queryInterface.sequelize.query(
          'SELECT id FROM divisions WHERE name = :name',
          {
            replacements: { name: division.name },
            type: Sequelize.QueryTypes.SELECT
          }
        );

        const divisionId = existingDivision ? existingDivision.id : uuidv4();
        divisionIds[division.name] = divisionId;

        if (!existingDivision) {
          await queryInterface.bulkInsert('divisions', [{
            id: divisionId,
            ...division,
            created_at: new Date(),
            updated_at: new Date(),
          }]);
        } else {
          await queryInterface.sequelize.query(
            'UPDATE divisions SET type = :type, description = :description, head_id = :headId, status = :status, updated_at = :updatedAt WHERE id = :id',
            {
              replacements: {
                id: divisionId,
                ...division,
                updatedAt: new Date()
              }
            }
          );
        }
      }

      // Create or update room
      const [existingRoom] = await queryInterface.sequelize.query(
        'SELECT id FROM rooms WHERE name = :name',
        {
          replacements: { name: 'Meeting Room 1' },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      const roomId = existingRoom ? existingRoom.id : uuidv4();
      const roomData = {
        id: roomId,
        name: 'Meeting Room 1',
        capacity: 10,
        facilities: JSON.stringify(['projector', 'whiteboard', 'video conferencing']),
        status: 'available',
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (!existingRoom) {
        await queryInterface.bulkInsert('rooms', [roomData]);
      } else {
        await queryInterface.sequelize.query(
          'UPDATE rooms SET capacity = :capacity, facilities = :facilities, status = :status, updated_at = :updatedAt WHERE id = :id',
          {
            replacements: {
              id: roomId,
              capacity: roomData.capacity,
              facilities: roomData.facilities,
              status: roomData.status,
              updatedAt: new Date()
            }
          }
        );
      }

      // Create or update events
      const events = [
        {
          title: 'Hackathon 2024',
          description: 'Annual hackathon competition',
          status: 'approved',
          created_by: adminId,
          role: 'head_coordinator'
        },
        {
          title: 'Website Redesign Project',
          description: 'Complete overhaul of the organization website',
          status: 'approved',
          created_by: adminId,
          role: 'coordinator'
        },
        {
          title: 'Mobile App Development',
          description: 'Development of organization mobile app',
          status: 'approved',
          created_by: adminId,
          role: 'head_coordinator'
        },
        {
          title: 'Security Audit Project',
          description: 'Comprehensive security audit of systems',
          status: 'approved',
          created_by: adminId,
          role: 'coordinator'
        }
      ];

      // Insert events
      await queryInterface.bulkInsert('events', events.map(event => ({
        ...event,
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
      })));
    } catch (error) {
      console.error('Error in seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('events', null, {});
      await queryInterface.bulkDelete('rooms', null, {});
      await queryInterface.bulkDelete('divisions', null, {});
      await queryInterface.bulkDelete('users', null, {});
    } catch (error) {
      console.error('Error in seeder down:', error);
      throw error;
    }
  }
};