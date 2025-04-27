const express = require('express');
const router = express.Router();
const roleTransitionController = require('../controllers/role-transition.controller');
const authJwt = require('../middleware/authJwt');
const { authenticateJWT, checkRole } = require('../middleware/auth.middleware');

// Role transition routes
router.post(
  '/transition',
  [authJwt.verifyToken],
  roleTransitionController.transitionRole
);

router.post(
  '/complete-handover',
  [authJwt.verifyToken],
  roleTransitionController.completeHandover
);

router.post(
  '/complete-event',
  [authJwt.verifyToken],
  roleTransitionController.completeEvent
);

router.get(
  '/pending-handovers',
  [authJwt.verifyToken],
  roleTransitionController.getPendingHandovers
);

// Retirement routes
router.post(
  '/request-retirement',
  authenticateJWT,
  roleTransitionController.requestRetirement
);

router.post(
  '/approve-retirement',
  authenticateJWT,
  checkRole(['ceo']),
  roleTransitionController.approveRetirement
);

router.post(
  '/reject-retirement',
  authenticateJWT,
  checkRole(['ceo']),
  roleTransitionController.rejectRetirement
);

router.get(
  '/pending-retirements',
  authenticateJWT,
  checkRole(['ceo']),
  roleTransitionController.getPendingRetirements
);

module.exports = router; 