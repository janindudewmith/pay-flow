import express from 'express';
import {
  submitForm,
  getFormsForApproval,
  approveForm,
  rejectForm,
  getUserForms,
} from '../controllers/formController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Form submission route
router.post('/submit', authMiddleware, submitForm);

// Get forms for approval (admin routes)
router.get('/approval', authMiddleware, getFormsForApproval);

// Approve form
router.post('/:formId/approve', authMiddleware, approveForm);

// Reject form
router.post('/:formId/reject', authMiddleware, rejectForm);

// Get user's forms
router.get('/user', authMiddleware, getUserForms);

export default router; 