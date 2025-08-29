import express from 'express';
import { loginWithOTP, verifyLoginOTP, sendAuthOTP, verifyAuthOTP } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Login routes with OTP
router.post('/login', loginWithOTP);
router.post('/verify-login', verifyLoginOTP);
router.post('/resend-otp', sendAuthOTP);

// Send OTP for authentication
router.post('/send-otp', authMiddleware, sendAuthOTP);

// Verify OTP for authentication
router.post('/verify-otp', authMiddleware, verifyAuthOTP);

export default router;
