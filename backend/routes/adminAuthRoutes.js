import express from 'express';
import { check } from 'express-validator';
import { login, verifyToken, getCurrentAdmin, isDepartmentHead, isFinanceOfficer } from '../controllers/adminAuthController.js';

const router = express.Router();

// Admin login route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('role', 'Role is required').exists()
  ],
  login
);

// Get current admin profile
router.get(
  '/me',
  verifyToken,
  getCurrentAdmin
);

// Protected routes for department heads
router.get(
  '/department-head/dashboard',
  verifyToken,
  isDepartmentHead,
  (req, res) => {
    res.json({
      success: true,
      message: 'Department Head Dashboard Access Granted',
      admin: req.admin
    });
  }
);

// Protected routes for finance officers
router.get(
  '/finance/dashboard',
  verifyToken,
  isFinanceOfficer,
  (req, res) => {
    res.json({
      success: true,
      message: 'Finance Officer Dashboard Access Granted',
      admin: req.admin
    });
  }
);

export default router; 