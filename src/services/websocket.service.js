const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { User, Division } = require('../models');

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Map of user IDs to WebSocket connections

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  async handleConnection(ws, req) {
    try {
      const token = req.url.split('token=')[1];
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        include: [
          { model: Division, as: 'mainDivision' },
          { model: Division, as: 'managerialDivision' }
        ]
      });

      if (!user) {
        ws.close(1008, 'User not found');
        return;
      }

      // Store the connection
      this.clients.set(user.id, ws);

      // Send initial data based on user's role and divisions
      this.sendInitialData(ws, user);

      ws.on('close', () => {
        this.clients.delete(user.id);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(user.id);
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(1008, 'Authentication failed');
    }
  }

  async sendInitialData(ws, user) {
    try {
      const data = {
        type: 'initial',
        user: {
          id: user.id,
          role: user.role,
          mainDivision: user.mainDivision,
          managerialDivision: user.managerialDivision
        }
      };
      ws.send(JSON.stringify(data));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  // Broadcast updates to relevant users
  broadcastUpdate(type, data, targetRoles = [], targetDivisions = []) {
    const message = JSON.stringify({ type, data });
    
    this.clients.forEach((ws, userId) => {
      // In a real implementation, you would check the user's role and divisions
      // and only send to relevant users
      ws.send(message);
    });
  }

  // Specific update methods
  notifyRoomBookingUpdate(booking) {
    this.broadcastUpdate('room_booking', booking, ['admin', 'head'], ['Resource Manager']);
  }

  notifyOtiBersuaraUpdate(feedback) {
    this.broadcastUpdate('oti_bersuara', feedback, ['admin'], ['Human Development']);
  }

  notifyDivisionUpdate(division) {
    this.broadcastUpdate('division', division, ['admin'], ['Internal Affairs']);
  }
}

module.exports = WebSocketService; 