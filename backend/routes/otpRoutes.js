import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';
import { authMiddleware } from '../middleware/auth.js';
import { sendSimpleEmail } from '../services/emailService.js';

const router = express.Router();

// Send OTP
router.post('/send', sendOTP);

// Verify OTP
router.post('/verify', verifyOTP);

// Test route
router.get('/test', (req, res) => res.json({ success: true, message: 'OTP route works!' }));

// Test email service
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    await sendSimpleEmail(
      email,
      'Test Email from PayFlow',
      'This is a test email to verify the email service is working correctly.'
    );
    res.json({ success: true, message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ success: false, message: 'Error sending test email', error: error.message });
  }
});

export default router; 