import OTP from '../models/OTP.js';
import { sendOTP } from '../services/emailService.js';

// Send OTP for authentication
export const sendAuthOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      purpose: 'authentication',
    });

    // Send OTP via email
    await sendOTP(email, otp, 'authentication');

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message,
    });
  }
};

// Verify OTP for authentication
export const verifyAuthOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP in database
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'authentication',
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // OTP not expired (5 minutes)
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message,
    });
  }
};