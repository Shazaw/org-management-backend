const passport = require('passport');
const { User, Division, Event } = require('../models');

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('JWT Authentication Error:', err);
      return res.status(500).json({ message: 'Authentication error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

const checkDivisionHead = async (req, res, next) => {
  try {
    const divisionId = req.params.divisionId || req.body.divisionId;
    if (!divisionId) {
      return res.status(400).json({ message: 'Division ID is required' });
    }

    const division = await Division.findByPk(divisionId, {
      include: [{ model: User, as: 'head' }]
    });

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    if (division.headId !== req.user.id) {
      return res.status(403).json({ message: 'Only division head can perform this action' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking division head status' });
  }
};

const checkEventCreator = async (req, res, next) => {
  try {
    const eventId = req.params.eventId || req.body.eventId;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Only event creator can perform this action' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking event creator status' });
  }
};

module.exports = {
  authenticateJWT,
  checkRole,
  checkDivisionHead,
  checkEventCreator,
}; 