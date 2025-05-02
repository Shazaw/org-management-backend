require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { sequelize } = require('./models');

// Load passport configuration
require('./config/passport');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://oticonnect.vercel.app', 
    'https://oticonnect.onrender.com',
    'http://localhost:3000',  // Add frontend dev server
    'http://localhost:3001',  // Add Next.js dev server 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/divisions', require('./routes/division.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/calendar', require('./routes/calendar.routes'));
app.use('/api/rooms', require('./routes/room.routes'));
app.use('/api/oti-bersuara', require('./routes/oti-bersuara.routes'));
app.use('/api/internal-affairs', require('./routes/internal-affairs.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

const PORT = process.env.PORT || 3000;

// Database connection and server start
sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync the database:', err);
  });