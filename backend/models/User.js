import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  profileImageUrl: {
    type: String
  },
  department: {
    type: String,
    enum: ['Electrical', 'Mechanical', 'Civil', 'Marine', 'Other'],
    default: 'Other'
  },
  position: {
    type: String,
    enum: ['Senior Lecturer', 'Lecturer', 'Temporary Lecturer', 'Probationary Lecturer', 'Instructor', 'Other'],
    default: 'Other'
  },
  role: {
    type: String,
    enum: ['user', 'department_head', 'finance_officer', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the lastLogin date before saving
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = Date.now();
  return this.save();
};

// Pre-save hook to update timestamps
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User; 