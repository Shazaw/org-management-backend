const sequelize = require('../config/database');
const User = require('./user.model');
const Division = require('./division.model');
const Event = require('./event.model');
const Room = require('./room.model');
const RoomBooking = require('./room-booking.model');
const OtiBersuara = require('./oti-bersuara.model');

// User associations
User.belongsTo(Division, {
  foreignKey: 'main_division_id',
  as: 'mainDivision',
});

User.belongsTo(Division, {
  foreignKey: 'managerial_division_id',
  as: 'managerialDivision',
});

User.hasMany(Event, {
  foreignKey: 'created_by',
  as: 'createdEvents',
});

User.hasMany(RoomBooking, {
  foreignKey: 'booked_by',
  as: 'roomBookings',
});

User.hasMany(RoomBooking, {
  foreignKey: 'approved_by',
  as: 'approvedBookings',
});

User.hasMany(OtiBersuara, {
  foreignKey: 'responded_by',
  as: 'respondedFeedback',
});

// Division associations
Division.hasMany(User, {
  foreignKey: 'main_division_id',
  as: 'members',
});

Division.hasMany(User, {
  foreignKey: 'managerial_division_id',
  as: 'managerialMembers',
});

Division.belongsTo(User, {
  foreignKey: 'head_id',
  as: 'head',
});

Division.hasMany(Event, {
  foreignKey: 'division_id',
  as: 'events',
});

Division.belongsTo(Division, {
  foreignKey: 'parent_division_id',
  as: 'parentDivision',
});

Division.hasMany(Division, {
  foreignKey: 'parent_division_id',
  as: 'subDivisions',
});

// Event associations
Event.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Room associations
Room.hasMany(RoomBooking, {
  foreignKey: 'room_id',
  as: 'bookings',
});

// RoomBooking associations
RoomBooking.belongsTo(Room, {
  foreignKey: 'room_id',
  as: 'room',
});

RoomBooking.belongsTo(User, {
  foreignKey: 'booked_by',
  as: 'bookedByUser',
});

RoomBooking.belongsTo(User, {
  foreignKey: 'approved_by',
  as: 'approvedByUser',
});

// OtiBersuara associations
OtiBersuara.belongsTo(User, {
  foreignKey: 'responded_by',
  as: 'responder',
});

module.exports = {
  sequelize,
  User,
  Division,
  Event,
  Room,
  RoomBooking,
  OtiBersuara,
}; 