require('dotenv').config();
const { User } = require('./models');

async function testDatabase() {
  try {
    // Test database connection
    await User.sequelize.authenticate();
    console.log('Database connection successful');

    // Check if admin user exists
    const adminUser = await User.findOne({ where: { email: 'admin@omah-ti.com' } });
    if (adminUser) {
      console.log('Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        hasPassword: !!adminUser.password
      });
    } else {
      console.log('Admin user not found');
    }

    // Test password validation
    if (adminUser) {
      const isValid = await adminUser.validatePassword('admin123');
      console.log('Password validation test:', isValid);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

testDatabase(); 