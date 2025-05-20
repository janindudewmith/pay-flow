import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  formType: {
    type: String,
    required: true,
    enum: [
      'petty_cash',
      'purchase_request',
      'leave_request',
      'exam_duty',
      'transport',
      'paper_marking',
      'overtime'
    ]
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  submittedBy: {
    userId: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending_hod_approval',
      'pending_finance_approval',
      'approved',
      'rejected'
    ],
    default: 'pending_hod_approval'
  },
  otpVerified: {
    type: Boolean,
    default: false
  },
  otpExpiry: Date,
  otpCode: String,
  approvalHistory: [{
    action: {
      type: String,
      enum: ['approve', 'reject'],
      required: true
    },
    by: {
      userId: String,
      email: String,
      fullName: String,
      department: String
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Enable strict mode to allow flexible form data
  strict: false
});

// Update the updatedAt timestamp before saving
formSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Form = mongoose.model('Form', formSchema);

export default Form; 