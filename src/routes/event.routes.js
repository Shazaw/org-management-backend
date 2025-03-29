const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Get all events
router.get('/', eventController.getAllEvents);

// Get event by ID
router.get('/:id', eventController.getEventById);

// Create new event
router.post('/', eventController.createEvent);

// Update event
router.put('/:id', eventController.updateEvent);

// Delete event
router.delete('/:id', eventController.deleteEvent);

module.exports = router; 