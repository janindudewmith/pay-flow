import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'department_head', 'finance_officer'], default: 'user' },
  department: { type: String },

  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
export default userModel;
