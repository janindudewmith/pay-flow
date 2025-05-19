import express from 'express';
import { sendAuthOTP, verifyAuthOTP } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Send OTP for authentication
router.post('/send-otp', authMiddleware, sendAuthOTP);

// Verify OTP for authentication
router.post('/verify-otp', authMiddleware, verifyAuthOTP);

export default router;
