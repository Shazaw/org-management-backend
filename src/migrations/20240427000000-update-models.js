'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update Event model
    await queryInterface.addColumn('events', 'coordinator_approval_status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    });
    await queryInterface.addColumn('events', 'approval_level', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    // Create DivisionProgress table
    await queryInterface.createTable('division_progress', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      division_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'divisions',
          key: 'id'
        }
      },
      report_type: {
        type: Sequelize.ENUM('meeting', 'event', 'competition', 'task', 'note'),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('planned', 'ongoing', 'completed'),
        defaultValue: 'planned'
      },
      progress_percentage: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      division_role: {
        type: Sequelize.ENUM('head', 'coordinator', 'member'),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Update RoomBooking model
    await queryInterface.addColumn('room_bookings', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Update OtiBersuara model
    await queryInterface.addColumn('oti_bersuara', 'visibility', {
      type: Sequelize.ENUM('anonymous', 'department_only'),
      defaultValue: 'anonymous'
    });
    await queryInterface.addColumn('oti_bersuara', 'department', {
      type: Sequelize.ENUM('human_development', 'all'),
      defaultValue: 'all'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove Event model changes
    await queryInterface.removeColumn('events', 'coordinator_approval_status');
    await queryInterface.removeColumn('events', 'approval_level');

    // Remove DivisionProgress table
    await queryInterface.dropTable('division_progress');

    // Remove RoomBooking model changes
    await queryInterface.removeColumn('room_bookings', 'approved_at');

    // Remove OtiBersuara model changes
    await queryInterface.removeColumn('oti_bersuara', 'visibility');
    await queryInterface.removeColumn('oti_bersuara', 'department');
  }
}; 