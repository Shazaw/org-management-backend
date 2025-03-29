const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function testAuth() {
  try {
    // Test database connection
    await User.sequelize.authenticate();
    console.log('Database connection successful');

    // Find admin user
    const adminUser = await User.findOne({ where: { email: 'admin@omah-ti.com' } });
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    console.log('Admin user found:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      hasPassword: !!adminUser.password
    });

    // Test password validation
    const isValid = await adminUser.validatePassword('admin123');
    console.log('Password validation result:', isValid);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

testAuth(); 