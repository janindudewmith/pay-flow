import express from 'express';
import { generateOTP, verifyOTP } from '../controllers/otpController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Generate OTP
router.post('/generate', authMiddleware, generateOTP);

// Verify OTP
router.post('/verify', authMiddleware, verifyOTP);

export default router; 