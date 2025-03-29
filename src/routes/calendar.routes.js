const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateJWT } = require('../middleware/auth.middleware');
const { Event, User, Division } = require('../models');

const router = express.Router();

// Get organization calendar
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        status: 'approved',
        startTime: {
          [Op.gte]: new Date(), // Only future events
        },
      },
      include: [
        { model: User, as: 'creator' },
        { model: Division },
      ],
      order: [['startTime', 'ASC']],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendar' });
  }
});

// Get division calendar
router.get('/division/:id', authenticateJWT, async (req, res) => {
  try {
    const division = await Division.findByPk(req.params.id);
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    const events = await Event.findAll({
      where: {
        divisionId: req.params.id,
        status: 'approved',
        startTime: {
          [Op.gte]: new Date(), // Only future events
        },
      },
      include: [
        { model: User, as: 'creator' },
        { model: Division },
      ],
      order: [['startTime', 'ASC']],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching division calendar' });
  }
});

// Get user's calendar
router.get('/user/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get events where user is an attendee or is in the division
    const events = await Event.findAll({
      where: {
        status: 'approved',
        startTime: {
          [Op.gte]: new Date(), // Only future events
        },
        [Op.or]: [
          { attendees: { [Op.contains]: [user.id] } },
          { divisionId: user.mainDivision },
          { divisionId: user.managerialDivision },
        ],
      },
      include: [
        { model: User, as: 'creator' },
        { model: Division },
      ],
      order: [['startTime', 'ASC']],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user calendar' });
  }
});

// Get events by date range
router.get('/range', authenticateJWT, [
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate } = req.body;

    const events = await Event.findAll({
      where: {
        status: 'approved',
        startTime: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        { model: User, as: 'creator' },
        { model: Division },
      ],
      order: [['startTime', 'ASC']],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events by date range' });
  }
});

// Get upcoming mandatory events
router.get('/mandatory', authenticateJWT, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        status: 'approved',
        isMandatory: true,
        startTime: {
          [Op.gte]: new Date(), // Only future events
        },
      },
      include: [
        { model: User, as: 'creator' },
        { model: Division },
      ],
      order: [['startTime', 'ASC']],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mandatory events' });
  }
});

module.exports = router; 