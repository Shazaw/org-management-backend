const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateJWT, checkRole } = require('../middleware/auth.middleware');
const { Division } = require('../models');

const router = express.Router();

// Get all divisions progress
router.get('/divisions', authenticateJWT, checkRole(['admin', 'internal_affairs']), async (req, res) => {
  try {
    const divisions = await Division.findAll({
      include: [
        { model: User, as: 'head' },
        { model: User, as: 'members' },
        { model: User, as: 'managerialMembers' },
      ],
    });

    const progress = divisions.map(division => ({
      id: division.id,
      name: division.name,
      type: division.type,
      head: division.head,
      memberCount: division.members.length,
      progress: division.progress,
      tasks: division.tasks,
      status: division.status,
    }));

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching division progress' });
  }
});

// Update division tasks
router.put('/divisions/:id/tasks', authenticateJWT, checkRole(['admin', 'head']), [
  body('tasks').isArray(),
  body('tasks.*.title').trim().notEmpty(),
  body('tasks.*.description').optional().trim(),
  body('tasks.*.deadline').isISO8601(),
  body('tasks.*.status').isIn(['not_started', 'in_progress', 'finished']),
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

    // Check if user is head of the division
    if (req.user.role === 'head' && division.headId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { tasks } = req.body;

    // Calculate overall progress
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'finished').length;
    const progress = Math.round((completedTasks / totalTasks) * 100);

    await division.update({
      tasks,
      progress,
    });

    res.json(division);
  } catch (error) {
    res.status(500).json({ message: 'Error updating division tasks' });
  }
});

// Get division progress report
router.get('/divisions/:id/report', authenticateJWT, checkRole(['admin']), async (req, res) => {
  try {
    const division = await Division.findByPk(req.params.id, {
      include: [
        { model: User, as: 'head' },
        { model: User, as: 'members' },
        { model: User, as: 'managerialMembers' },
      ],
    });

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    const report = {
      id: division.id,
      name: division.name,
      type: division.type,
      head: division.head,
      memberCount: division.members.length,
      progress: division.progress,
      tasks: division.tasks,
      status: division.status,
      members: division.members.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
      })),
      managerialMembers: division.managerialMembers.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
      })),
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating division report' });
  }
});

// Get overall organization progress report
router.get('/reports', authenticateJWT, checkRole(['admin']), async (req, res) => {
  try {
    const divisions = await Division.findAll({
      include: [
        { model: User, as: 'head' },
        { model: User, as: 'members' },
        { model: User, as: 'managerialMembers' },
      ],
    });

    const report = {
      totalDivisions: divisions.length,
      activeDivisions: divisions.filter(d => d.status === 'active').length,
      averageProgress: Math.round(
        divisions.reduce((acc, div) => acc + div.progress, 0) / divisions.length
      ),
      divisions: divisions.map(division => ({
        id: division.id,
        name: division.name,
        type: division.type,
        head: division.head,
        memberCount: division.members.length,
        progress: division.progress,
        status: division.status,
      })),
      progressByType: {
        main: Math.round(
          divisions
            .filter(d => d.type === 'main')
            .reduce((acc, div) => acc + div.progress, 0) /
          divisions.filter(d => d.type === 'main').length
        ),
        managerial: Math.round(
          divisions
            .filter(d => d.type === 'managerial')
            .reduce((acc, div) => acc + div.progress, 0) /
          divisions.filter(d => d.type === 'managerial').length
        ),
      },
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating organization report' });
  }
});

const { DivisionProgress, User } = require('../models');

router.get('/', authenticateJWT, checkRole(['admin', 'ceo', 'cfo', 'head', 'internal_affairs']), async (req, res) => {
  try {
    const progressReports = await DivisionProgress.findAll();
    res.json(progressReports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress reports' });
  }
});

router.post('/submit', authenticateJWT, checkRole(['head', 'ceo', 'cfo']), async (req, res) => {
  try {
    const { divisionId, progress, notes } = req.body;

    const report = await DivisionProgress.create({
      division_id: divisionId,
      progress,
      notes,
      submitted_by: req.user.id,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting progress report' });
  }
});

module.exports = router;