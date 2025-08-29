import OTP from '../models/OTP.js';
import { sendOTP as sendEmailOTP } from '../services/emailService.js';

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email },
      { 
        email,
        otp,
        purpose: 'login',
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await sendEmailOTP(email, otp, 'login');
    
    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find OTP in database and check if it's not expired (5 minutes)
    const otpRecord = await OTP.findOne({
      email,
      otp,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
  }
}; 