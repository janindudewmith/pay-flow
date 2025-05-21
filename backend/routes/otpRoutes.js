import express from 'express';
import { generateOTP, verifyOTP } from '../controllers/otpController.js';
import { authMiddleware } from '../middleware/auth.js';
import { sendOTP } from '../services/emailService.js';

const router = express.Router();

// Generate OTP
router.post('/generate', authMiddleware, generateOTP);

// Verify OTP
router.post('/verify', authMiddleware, verifyOTP);

router.post('/send', async (req, res) => {
  const { email } = req.body;
  try {
    await sendOTP(email, 'form_submission');
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
});

router.get('/test', (req, res) => res.json({ success: true, message: 'OTP route works!' }));

export default router; 