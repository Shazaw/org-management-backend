const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

const options = {
  jwtFromRequest: (req) => {
    let token = null;
    if (req && req.headers) {
      token = req.headers['authorization']?.split(' ')[1];
      console.log('Extracted token:', token ? 'Token present' : 'No token');
    }
    return token;
  },
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  ignoreExpiration: false,
};

// JWT Strategy
passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
    console.log('JWT Payload:', payload);
    const user = await User.findByPk(payload.id);
    if (user) {
      console.log('User found:', user.id);
      return done(null, user);
    }
    console.log('No user found for ID:', payload.id);
    return done(null, false);
  } catch (error) {
    console.error('JWT Strategy Error:', error);
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { googleId: profile.id } });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        password: null, // No password for Google OAuth users
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport; 