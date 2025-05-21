import OTP from '../models/OTP.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Pay Flow',
      html: `<h1>Your OTP is: ${otp}</h1><p>This OTP will expire in 5 minutes.</p>`,
    });
    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    await OTP.deleteOne({ _id: otpRecord._id });
    res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
  }
}; 