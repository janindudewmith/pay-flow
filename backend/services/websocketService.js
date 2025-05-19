import { EventEmitter } from 'events';

class WebSocketService extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map();
  }

  // Add a new client
  addClient(userId, res) {
    this.clients.set(userId, res);

    // Remove client when connection closes
    res.on('close', () => {
      this.clients.delete(userId);
    });
  }

  // Send update to specific user
  sendUpdate(userId, data) {
    const client = this.clients.get(userId);
    if (client) {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  // Send update to all clients
  broadcastUpdate(data) {
    this.clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
}

export const websocketService = new WebSocketService(); 