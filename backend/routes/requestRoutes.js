import express from 'express';
import {
  submitRequest,
  approveRequest,
  rejectRequest,
  getUserRequests,
  getDepartmentRequests,
  getFinanceRequests,
  getRequestById,
  getRequests
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/submit', submitRequest);
router.put('/:id/approve', approveRequest);
router.put('/:id/reject', rejectRequest);
router.get('/user', getUserRequests);
router.get('/department', getDepartmentRequests);
router.get('/finance', getFinanceRequests);
router.get('/all', getRequests);
router.get('/:id', getRequestById);

export default router;
