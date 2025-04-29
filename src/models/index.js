const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};

// Use the sequelize instance from database.js
const sequelize = require('../config/database');

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define relationships
const { User, Division, Event, Room, RoomBooking, OtiBersuara, DivisionProgress } = db;

// User relationships
User.belongsTo(Division, { as: 'mainDivision', foreignKey: 'main_division_id' });
User.belongsTo(Division, { as: 'managerialDivision', foreignKey: 'managerial_division_id' });

// Division relationships
Division.hasMany(User, { as: 'members', foreignKey: 'main_division_id' });
Division.hasMany(User, { as: 'managerialMembers', foreignKey: 'managerial_division_id' });
Division.belongsTo(User, { as: 'head', foreignKey: 'head_id' });

// Event relationships
Event.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

// Room Booking relationships
RoomBooking.belongsTo(Room, { foreignKey: 'room_id' });
RoomBooking.belongsTo(User, { as: 'booker', foreignKey: 'user_id' });
RoomBooking.belongsTo(User, { as: 'approver', foreignKey: 'approved_by' });

// OtiBersuara relationships
OtiBersuara.belongsTo(User, { as: 'reader', foreignKey: 'read_by' });

// Division Progress relationships
DivisionProgress.belongsTo(Division, { foreignKey: 'division_id' });
DivisionProgress.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 