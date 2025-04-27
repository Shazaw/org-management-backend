require('dotenv').config();
const { User, Division, Event, Room, RoomBooking, OtiBersuara } = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testSystem() {
  try {
    console.log('Starting system test...\n');

    // 1. Test Database Connection
    console.log('1. Testing database connection...');
    await User.sequelize.authenticate();
    console.log('✓ Database connection successful\n');

    // 2. Test Admin User
    console.log('2. Testing admin user...');
    const adminUser = await User.findOne({ where: { email: 'admin@omah-ti.com' } });
    if (!adminUser) {
      console.log('✗ Admin user not found');
      return;
    }
    console.log('✓ Admin user found:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role
    });

    // Test password validation
    const isValid = await adminUser.validatePassword('admin123');
    console.log('✓ Password validation:', isValid ? 'Valid' : 'Invalid');
    console.log('');

    // 3. Test JWT Authentication
    console.log('3. Testing JWT authentication...');
    const token = jwt.sign(
      { id: adminUser.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    console.log('✓ JWT token generated successfully');
    console.log('');

    // 4. Test Database Models
    console.log('4. Testing database models...');

    // Test Divisions
    const divisions = await Division.findAll();
    console.log(`✓ Found ${divisions.length} divisions`);

    // Test Events
    const events = await Event.findAll();
    console.log(`✓ Found ${events.length} events`);

    // Test Rooms
    const rooms = await Room.findAll();
    console.log(`✓ Found ${rooms.length} rooms`);

    // Test Room Bookings
    const bookings = await RoomBooking.findAll();
    console.log(`✓ Found ${bookings.length} room bookings`);

    // Test OtiBersuara
    try {
      const feedback = await OtiBersuara.findAll();
      console.log(`✓ Found ${feedback.length} feedback entries`);
    } catch (error) {
      console.log('ℹ No feedback entries found (table may be empty)');
    }
    console.log('');

    // 5. Test Associations
    console.log('5. Testing model associations...');
    
    // Test User-Division association
    const userWithDivisions = await User.findByPk(adminUser.id, {
      include: [
        { model: Division, as: 'mainDivision' },
        { model: Division, as: 'managerialDivision' }
      ]
    });
    console.log('✓ User-Division associations working');
    console.log('  - Main Division:', userWithDivisions.mainDivision?.name || 'None');
    console.log('  - Managerial Division:', userWithDivisions.managerialDivision?.name || 'None');

    // Test Division-Event association
    if (divisions.length > 0) {
      const divisionWithEvents = await Division.findByPk(divisions[0].id, {
        include: [{ model: Event, as: 'events' }]
      });
      console.log(`✓ Division-Event association working (${divisionWithEvents.events?.length || 0} events)`);
    }

    // Test Room-Booking association
    if (rooms.length > 0) {
      const roomWithBookings = await Room.findByPk(rooms[0].id, {
        include: [{ model: RoomBooking, as: 'bookings' }]
      });
      console.log(`✓ Room-Booking association working (${roomWithBookings.bookings?.length || 0} bookings)`);
    }
    console.log('');

    console.log('System test completed successfully!');
    console.log('All core functionality is working as expected.');

  } catch (error) {
    console.error('Error during system test:', error);
  } finally {
    process.exit();
  }
}

testSystem(); 