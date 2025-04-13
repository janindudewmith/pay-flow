import mongoose from 'mongoose';

const approvalStepSchema = new mongoose.Schema({
  role: { type: String, enum: ['department_head', 'finance_officer'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  timestamp: Date,
  reason: String,
}, { _id: false });

const requestSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  formType: { type: String, required: true }, // e.g., ExamDuty, Overtime, etc.
  formData: { type: Object, required: true },

  currentApprover: {
    type: String,
    enum: ['department_head', 'finance_officer'],
    default: 'department_head'
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  approvalHistory: [approvalStepSchema],

  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const requestModel = mongoose.model('Request', requestSchema);
export default requestModel;
