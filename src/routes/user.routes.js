const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateJWT, checkRole } = require('../middleware/auth.middleware');
const { User, Division } = require('../models');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Division, as: 'mainDivision' },
        { model: Division, as: 'managerialDivision' },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateJWT, [
  body('name').optional().trim().notEmpty(),
  body('mainDivision').optional().isUUID(),
  body('managerialDivision').optional().isUUID(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, mainDivision, managerialDivision } = req.body;

    // Check if divisions exist
    if (mainDivision) {
      const mainDiv = await Division.findByPk(mainDivision);
      if (!mainDiv) {
        return res.status(404).json({ message: 'Main division not found' });
      }
    }

    if (managerialDivision) {
      const managerialDiv = await Division.findByPk(managerialDivision);
      if (!managerialDiv) {
        return res.status(404).json({ message: 'Managerial division not found' });
      }
    }

    // Update user
    const user = await User.findByPk(req.user.id);
    await user.update({
      name: name || user.name,
      mainDivision: mainDivision || user.mainDivision,
      managerialDivision: managerialDivision || user.managerialDivision,
      divisionStatus: 'pending', // Reset status when divisions change
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get user's available times
router.get('/available-times', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user.availableTimes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available times' });
  }
});

// Update user's available times
router.put('/available-times', authenticateJWT, [
  body('availableTimes').isObject(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { availableTimes } = req.body;
    const user = await User.findByPk(req.user.id);
    await user.update({ availableTimes });

    res.json({ message: 'Available times updated successfully', availableTimes: user.availableTimes });
  } catch (error) {
    res.status(500).json({ message: 'Error updating available times' });
  }
});

// Get all users (admin only)
router.get('/', authenticateJWT, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Division, as: 'mainDivision' },
        { model: Division, as: 'managerialDivision' },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router; 