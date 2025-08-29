import OTP from '../models/OTP.js';
import { sendSimpleEmail } from '../services/emailService.js';
import User from '../models/User.js';

// Login with OTP
export const loginWithOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First verify the email and password
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await sendSimpleEmail(
      email,
      'Your PayFlow Login OTP',
      `Your OTP for PayFlow login is: ${otp}\n\nThis OTP will expire in 5 minutes.`
    );

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      requireOTP: true,
      userId: user._id
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Verify login OTP
export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP in database
    const otpRecord = await OTP.findOne({
      email,
      otp,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // OTP not expired (5 minutes)
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Get user details
    const user = await User.findOne({ email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

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
    await sendSimpleEmail(
      email,
      'Your PayFlow Authentication OTP',
      `Your OTP for PayFlow authentication is: ${otp}\n\nThis OTP will expire in 5 minutes.`
    );

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