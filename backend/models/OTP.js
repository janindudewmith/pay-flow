import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['form_submission', 'approval', 'rejection', 'authentication', 'login'],
    required: true,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 min
  },
});

// Check if model exists before creating it
const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);

export default OTP;