import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  formType: {
    type: String,
    required: true,
    enum: ['exam_duty', 'overtime', 'paper_marking', 'petty_cash', 'transportation']
  },
  submittedBy: {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    fullName: { type: String, required: true }
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  departmentCode: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending_hod_approval', 'pending_finance_approval', 'approved', 'rejected'],
    default: 'pending_hod_approval'
  },
  currentApproverEmail: {
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  lastUpdateDate: {
    type: Date,
    default: Date.now
  },
  approvalHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    actor: String,
    comment: String
  }],
  rejectionReason: String
}, { timestamps: true });

export default mongoose.model('Request', RequestSchema);
