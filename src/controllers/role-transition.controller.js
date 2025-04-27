const { User, Division, Event } = require('../models');
const { Op } = require('sequelize');

// Handle role transition (e.g., new head, CEO, CFO)
exports.transitionRole = async (req, res) => {
  try {
    const { userId, newRole, divisionId } = req.body;
    const currentUser = req.user;

    // Only admin can perform role transitions
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can perform role transitions' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If transitioning to head role, verify division exists
    if (newRole === 'head' && divisionId) {
      const division = await Division.findByPk(divisionId);
      if (!division) {
        return res.status(404).json({ message: 'Division not found' });
      }
    }

    // Store previous role and update new role
    await user.update({
      previous_role: user.role,
      role: newRole,
      role_transition_date: new Date(),
      handover_completed: false
    });

    // If transitioning to head role, update division head
    if (newRole === 'head' && divisionId) {
      await Division.update(
        { head_id: userId },
        { where: { id: divisionId } }
      );
    }

    res.json({ message: 'Role transition initiated successfully', user });
  } catch (error) {
    console.error('Error in role transition:', error);
    res.status(500).json({ message: 'Error performing role transition' });
  }
};

// Complete handover process
exports.completeHandover = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUser = req.user;

    // Only admin or the user themselves can complete handover
    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to complete handover' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ handover_completed: true });

    res.json({ message: 'Handover completed successfully', user });
  } catch (error) {
    console.error('Error completing handover:', error);
    res.status(500).json({ message: 'Error completing handover' });
  }
};

// Complete an event
exports.completeEvent = async (req, res) => {
  try {
    const { eventId, notes } = req.body;
    const currentUser = req.user;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only event creator or admin can complete the event
    if (event.created_by !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to complete event' });
    }

    await event.update({
      status: 'completed',
      completed_at: new Date(),
      completed_by: currentUser.id,
      completion_notes: notes
    });

    res.json({ message: 'Event completed successfully', event });
  } catch (error) {
    console.error('Error completing event:', error);
    res.status(500).json({ message: 'Error completing event' });
  }
};

// Get pending handovers
exports.getPendingHandovers = async (req, res) => {
  try {
    const currentUser = req.user;

    // Only admin can view pending handovers
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view pending handovers' });
    }

    const pendingHandovers = await User.findAll({
      where: {
        handover_completed: false,
        role_transition_date: {
          [Op.ne]: null
        }
      },
      include: [
        {
          model: Division,
          as: 'mainDivision',
          where: {
            head_id: {
              [Op.ne]: null
            }
          },
          required: false
        }
      ]
    });

    res.json(pendingHandovers);
  } catch (error) {
    console.error('Error fetching pending handovers:', error);
    res.status(500).json({ message: 'Error fetching pending handovers' });
  }
};

// Request retirement
exports.requestRetirement = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has a pending retirement request
    if (user.retirement_status === 'pending') {
      return res.status(400).json({ message: 'Retirement request already pending' });
    }

    // Check if user is already retired
    if (user.role === 'retired') {
      return res.status(400).json({ message: 'User is already retired' });
    }

    await user.update({
      retirement_status: 'pending',
      retirement_requested_at: new Date()
    });

    res.json({ message: 'Retirement request submitted successfully' });
  } catch (error) {
    console.error('Error requesting retirement:', error);
    res.status(500).json({ message: 'Error requesting retirement' });
  }
};

// Approve retirement (CEO only)
exports.approveRetirement = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUser = req.user;

    // Only CEO can approve retirement
    if (currentUser.role !== 'ceo') {
      return res.status(403).json({ message: 'Only CEO can approve retirement' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a pending retirement request
    if (user.retirement_status !== 'pending') {
      return res.status(400).json({ message: 'No pending retirement request found' });
    }

    // Store previous role and update to retired
    await user.update({
      previous_role: user.role,
      role: 'retired',
      retirement_status: 'approved',
      retirement_approved_at: new Date(),
      retirement_approved_by: currentUser.id,
      // Clear managerial division
      managerial_division_id: null,
      // Clear division status
      division_status: null
    });

    res.json({ message: 'Retirement approved successfully', user });
  } catch (error) {
    console.error('Error approving retirement:', error);
    res.status(500).json({ message: 'Error approving retirement' });
  }
};

// Reject retirement (CEO only)
exports.rejectRetirement = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUser = req.user;

    // Only CEO can reject retirement
    if (currentUser.role !== 'ceo') {
      return res.status(403).json({ message: 'Only CEO can reject retirement' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a pending retirement request
    if (user.retirement_status !== 'pending') {
      return res.status(400).json({ message: 'No pending retirement request found' });
    }

    await user.update({
      retirement_status: 'rejected'
    });

    res.json({ message: 'Retirement request rejected successfully', user });
  } catch (error) {
    console.error('Error rejecting retirement:', error);
    res.status(500).json({ message: 'Error rejecting retirement' });
  }
};

// Get pending retirement requests (CEO only)
exports.getPendingRetirements = async (req, res) => {
  try {
    const currentUser = req.user;

    // Only CEO can view pending retirements
    if (currentUser.role !== 'ceo') {
      return res.status(403).json({ message: 'Only CEO can view pending retirements' });
    }

    const pendingRetirements = await User.findAll({
      where: {
        retirement_status: 'pending'
      },
      include: [
        {
          model: Division,
          as: 'mainDivision'
        },
        {
          model: Division,
          as: 'managerialDivision'
        }
      ]
    });

    res.json(pendingRetirements);
  } catch (error) {
    console.error('Error fetching pending retirements:', error);
    res.status(500).json({ message: 'Error fetching pending retirements' });
  }
}; 