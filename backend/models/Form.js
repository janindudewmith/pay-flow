import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  formType: {
    type: String,
    required: true,
    enum: ['petty_cash', 'travel', 'purchase', 'leave', 'other'],
  },
  submittedBy: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved_by_dept', 'rejected_by_dept', 'approved_by_finance', 'rejected_by_finance'],
    default: 'pending',
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  currentApprover: {
    type: String,
    required: true,
  },
  rejectionReason: {
    type: String,
    required: false,
  },
  departmentHeadApproval: {
    approvedBy: String,
    approvedAt: Date,
    comments: String,
  },
  financeApproval: {
    approvedBy: String,
    approvedAt: Date,
    comments: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
formSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Form = mongoose.model('Form', formSchema);

export default Form; 