import express from 'express';
import {
  submitRequest,
  approveRequest,
  rejectRequest,
  getUserRequests,
  getPendingRequests
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/submit', submitRequest);
router.put('/:id/approve', approveRequest);
router.put('/:id/reject', rejectRequest);
router.get('/user', getUserRequests);
router.get('/pending', getPendingRequests);
router.get('/:id', getRequestById);

export default router;
