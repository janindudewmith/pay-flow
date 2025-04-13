import OTP from '../models/otpModel.js';
import generateOTP from '../utils/otpGenerator.js';
import sendEmail from '../utils/emailService.js';

// Send OTP to user's email
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate a new OTP
    const otp = generateOTP();
    
    // Store OTP in database (replace if exists)
    await OTP.findOneAndDelete({ email });
    await OTP.create({ email, otp });
    
    // Send OTP via email
    await sendEmail(
      email,
      'Your Verification OTP for PayFlow',
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6;">PayFlow Verification</h2>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; margin: 20px 0; padding: 10px; background-color: #f0f9ff; border-radius: 4px; color: #1e40af;">${otp}</h1>
        <p>This OTP is valid for 5 minutes and can be used only once.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} PayFlow. All rights reserved.</p>
      </div>`
    );
    
    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send OTP' 
    });
  }
};

// Verify OTP entered by user
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find the stored OTP
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({ 
        success: false, 
        error: 'OTP not found or expired' 
      });
    }
    
    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid OTP' 
      });
    }
    
    // Delete the used OTP
    await OTP.findOneAndDelete({ email });
    
    res.status(200).json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify OTP' 
    });
  }
};

export { sendOTP, verifyOTP };