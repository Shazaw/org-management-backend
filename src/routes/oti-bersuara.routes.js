const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateJWT, checkRole } = require('../middleware/auth.middleware');
const { OtiBersuara, User } = require('../models');

const router = express.Router();

// Submit anonymous feedback
router.post('/', [
  body('message').trim().notEmpty(),
  body('category').isIn(['grievance', 'suggestion', 'complaint', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, category, priority } = req.body;

    const feedback = await OtiBersuara.create({
      message,
      category,
      priority: priority || 'medium',
      status: 'unread',
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Get all feedback (Human Development only)
router.get('/', authenticateJWT, checkRole(['admin']), async (req, res) => {
  try {
    const feedback = await OtiBersuara.findAll({
      include: [{ model: User, as: 'responder' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Get feedback by status
router.get('/status/:status', authenticateJWT, checkRole(['admin']), async (req, res) => {
  try {
    const feedback = await OtiBersuara.findAll({
      where: { status: req.params.status },
      include: [{ model: User, as: 'responder' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback by status' });
  }
});

// Get feedback by category
router.get('/category/:category', authenticateJWT, checkRole(['admin']), async (req, res) => {
  try {
    const feedback = await OtiBersuara.findAll({
      where: { category: req.params.category },
      include: [{ model: User, as: 'responder' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback by category' });
  }
});

// Update feedback status
router.put('/:id/status', authenticateJWT, checkRole(['admin']), [
  body('status').isIn(['unread', 'read', 'in_progress', 'resolved']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const feedback = await OtiBersuara.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await feedback.update({
      status: req.body.status,
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback status' });
  }
});

// Respond to feedback
router.put('/:id/respond', authenticateJWT, checkRole(['admin']), [
  body('response').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const feedback = await OtiBersuara.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await feedback.update({
      response: req.body.response,
      respondedBy: req.user.id,
      respondedAt: new Date(),
      status: 'resolved',
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error responding to feedback' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', authenticateJWT, checkRole(['admin']), async (req, res) => {
  try {
    const feedback = await OtiBersuara.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await feedback.destroy();

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback' });
  }
});

module.exports = router; 