const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateJWT, checkRole } = require('../middleware/auth.middleware');
const { Room, RoomBooking, User } = require('../models');

const router = express.Router();

// Get all rooms
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// Get room by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room' });
  }
});

// Book a room (division heads only)
router.post('/book', authenticateJWT, checkRole(['admin', 'ceo', 'head']), [
  body('roomId').isUUID(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('purpose').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomId, startTime, endTime, purpose } = req.body;

    // Check if room exists and is available
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.status !== 'available') {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Check for booking conflicts
    const conflictingBooking = await RoomBooking.findOne({
      where: {
        roomId,
        status: 'approved',
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            endTime: {
              [Op.between]: [startTime, endTime],
            },
          },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Room is already booked for this time' });
    }

    const booking = await RoomBooking.create({
      roomId,
      startTime,
      endTime,
      purpose,
      bookedBy: req.user.id,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error booking room' });
  }
});

// Get all bookings
router.get('/bookings', authenticateJWT, async (req, res) => {
  try {
    const bookings = await RoomBooking.findAll({
      include: [
        { model: Room },
        { model: User, as: 'booker' },
        { model: User, as: 'approver' },
      ],
      order: [['startTime', 'DESC']],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get bookings by room
router.get('/rooms/:id/bookings', authenticateJWT, async (req, res) => {
  try {
    const bookings = await RoomBooking.findAll({
      where: { roomId: req.params.id },
      include: [
        { model: User, as: 'booker' },
        { model: User, as: 'approver' },
      ],
      order: [['startTime', 'DESC']],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room bookings' });
  }
});

// Approve booking (Resource Manager only)
router.put('/bookings/:id/approve', authenticateJWT, checkRole(['admin', 'resource_manager']), [
  body('status').isIn(['approved', 'rejected']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await RoomBooking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking has already been processed' });
    }

    const { status } = req.body;

    await booking.update({
      status,
      approvedBy: req.user.id,
    });

    // Update room status if approved
    if (status === 'approved') {
      await booking.Room.update({ status: 'occupied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error processing booking' });
  }
});

// Cancel booking (division head or Resource Manager)
router.delete('/bookings/:id', authenticateJWT, async (req, res) => {
  try {
    const booking = await RoomBooking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to cancel
    if (booking.bookedBy !== req.user.id && !['admin', 'ceo'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await booking.destroy();

    // Update room status if it was approved
    if (booking.status === 'approved') {
      await booking.Room.update({ status: 'available' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

module.exports = router;