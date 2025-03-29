const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateJWT, checkRole, checkDivisionHead } = require('../middleware/auth.middleware');
const { Division, User } = require('../models');

const router = express.Router();

// Get all divisions
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const divisions = await Division.findAll({
      include: [
        { model: User, as: 'head' },
        { model: User, as: 'members' },
        { model: User, as: 'managerialMembers' },
      ],
    });
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching divisions' });
  }
});

// Get division by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const division = await Division.findByPk(req.params.id, {
      include: [
        { model: User, as: 'head' },
        { model: User, as: 'members' },
        { model: User, as: 'managerialMembers' },
        { model: Division, as: 'childDivisions' },
      ],
    });

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    res.json(division);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching division' });
  }
});

// Create new division (admin only)
router.post('/', authenticateJWT, checkRole(['admin']), [
  body('name').trim().notEmpty(),
  body('type').isIn(['main', 'managerial']),
  body('description').optional().trim(),
  body('headId').isUUID(),
  body('parentDivisionId').optional().isUUID(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, description, headId, parentDivisionId } = req.body;

    // Check if head exists and has appropriate role
    const head = await User.findByPk(headId);
    if (!head) {
      return res.status(404).json({ message: 'Division head not found' });
    }

    if (!['admin', 'ceo', 'head'].includes(head.role)) {
      return res.status(400).json({ message: 'Invalid division head role' });
    }

    // Check parent division if provided
    if (parentDivisionId) {
      const parentDivision = await Division.findByPk(parentDivisionId);
      if (!parentDivision) {
        return res.status(404).json({ message: 'Parent division not found' });
      }
    }

    const division = await Division.create({
      name,
      type,
      description,
      headId,
      parentDivisionId,
    });

    res.status(201).json(division);
  } catch (error) {
    res.status(500).json({ message: 'Error creating division' });
  }
});

// Update division (admin or division head)
router.put('/:id', authenticateJWT, [
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('headId').optional().isUUID(),
  body('status').optional().isIn(['active', 'inactive']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const division = await Division.findByPk(req.params.id);
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    // Check if user is admin or division head
    if (req.user.role !== 'admin' && division.headId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, headId, status } = req.body;

    // Check new head if provided
    if (headId) {
      const newHead = await User.findByPk(headId);
      if (!newHead) {
        return res.status(404).json({ message: 'New division head not found' });
      }
      if (!['admin', 'ceo', 'head'].includes(newHead.role)) {
        return res.status(400).json({ message: 'Invalid division head role' });
      }
    }

    await division.update({
      name: name || division.name,
      description: description || division.description,
      headId: headId || division.headId,
      status: status || division.status,
    });

    res.json(division);
  } catch (error) {
    res.status(500).json({ message: 'Error updating division' });
  }
});

// Confirm division member (division head only)
router.post('/:id/confirm-member', authenticateJWT, checkDivisionHead, [
  body('userId').isUUID(),
  body('status').isIn(['confirmed', 'rejected']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, status } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user belongs to this division
    if (user.mainDivision !== req.params.id && user.managerialDivision !== req.params.id) {
      return res.status(400).json({ message: 'User does not belong to this division' });
    }

    await user.update({ divisionStatus: status });

    res.json({ message: `Member ${status} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming division member' });
  }
});

module.exports = router; 