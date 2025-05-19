import express from 'express';
import { websocketService } from '../services/websocketService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// SSE endpoint for real-time updates
router.get('/updates', authMiddleware, (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Add client to WebSocket service
  websocketService.addClient(req.user.id, res);

  // Send initial connection success message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  // Handle client disconnect
  req.on('close', () => {
    websocketService.clients.delete(req.user.id);
  });
});

export default router; 