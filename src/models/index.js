const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};

// Use the sequelize instance from database.js
const sequelize = require('../config/database');

// First, load all models
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
    const model = require(path.join(__dirname, file));
    let modelInstance;
    
    try {
      // Try as a class first
      modelInstance = new model(sequelize);
    } catch (e) {
      // If that fails, try as a function
      modelInstance = model(sequelize);
    }
    
    db[modelInstance.name] = modelInstance;
  });

// Then, set up associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Now that all models are loaded, set up relationships
if (db.User && db.Division) {
  // User relationships
  db.User.belongsTo(db.Division, { as: 'mainDivision', foreignKey: 'main_division_id' });
  db.User.belongsTo(db.Division, { as: 'managerialDivision', foreignKey: 'managerial_division_id' });

  // Division relationships
  db.Division.hasMany(db.User, { as: 'members', foreignKey: 'main_division_id' });
  db.Division.hasMany(db.User, { as: 'managerialMembers', foreignKey: 'managerial_division_id' });
  db.Division.belongsTo(db.User, { as: 'head', foreignKey: 'head_id' });
}

if (db.Event && db.User) {
  // Event relationships
  db.Event.belongsTo(db.User, { as: 'creator', foreignKey: 'created_by' });
}

if (db.RoomBooking && db.Room && db.User) {
  // Room Booking relationships
  db.RoomBooking.belongsTo(db.Room, { foreignKey: 'room_id' });
  db.RoomBooking.belongsTo(db.User, { as: 'booker', foreignKey: 'user_id' });
  db.RoomBooking.belongsTo(db.User, { as: 'approver', foreignKey: 'approved_by' });
}

if (db.OtiBersuara && db.User) {
  // OtiBersuara relationships
  db.OtiBersuara.belongsTo(db.User, { as: 'reader', foreignKey: 'read_by' });
}

if (db.DivisionProgress && db.Division && db.User) {
  // Division Progress relationships
  db.DivisionProgress.belongsTo(db.Division, { foreignKey: 'division_id' });
  db.DivisionProgress.belongsTo(db.User, { as: 'creator', foreignKey: 'created_by' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 