import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Send OTP
router.post('/send', sendOTP);

// Verify OTP
router.post('/verify', verifyOTP);

// Test route
router.get('/test', (req, res) => res.json({ success: true, message: 'OTP route works!' }));

export default router; 