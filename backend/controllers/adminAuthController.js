import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

// Admin credentials (in a real-world scenario, these would be in a database)
const adminCredentials = [
  // Department Head Credentials
  {
    email: process.env.ADMIN_EIE_EMAIL || 'head.eie.ruh@gmail.com',
    password: process.env.ADMIN_EIE_PASSWORD || 'headeie123',
    role: 'department_head',
    name: process.env.ADMIN_EIE_NAME || 'Dr. Rajitha Udawalpola',
    department: process.env.ADMIN_EIE_DEPARTMENT || 'EIE'
  },
  {
    email: process.env.ADMIN_CEE_EMAIL || 'head.cee.ruh@gmail.com',
    password: process.env.ADMIN_CEE_PASSWORD || 'headcee123',
    role: 'department_head',
    name: process.env.ADMIN_CEE_NAME || 'Dr. T.N. Wickramarachchi',
    department: process.env.ADMIN_CEE_DEPARTMENT || 'CEE'
  },
  {
    email: process.env.ADMIN_MME_EMAIL || 'head.mme.ruh@gmail.com',
    password: process.env.ADMIN_MME_PASSWORD || 'headmme123',
    role: 'department_head',
    name: process.env.ADMIN_MME_NAME || 'Dr. B. Annasiwaththa',
    department: process.env.ADMIN_MME_DEPARTMENT || 'MME'
  },
  // Finance Officer Credentials
  {
    email: process.env.ADMIN_FINANCE_EMAIL || 'sab.finance.ruh@gmail.com',
    password: process.env.ADMIN_FINANCE_PASSWORD || 'finance123',
    role: 'finance_officer',
    name: process.env.ADMIN_FINANCE_NAME || 'Finance Officer',
    department: null
  }
];

// Hash all passwords on server start (this would be done at user creation in a real DB)
adminCredentials.forEach(admin => {
  const salt = bcrypt.genSaltSync(10);
  admin.hashedPassword = bcrypt.hashSync(admin.password, salt);
});

// Login controller
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    // Find admin by email
    const admin = adminCredentials.find(admin => admin.email === email);

    // Check if admin exists
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if role matches
    if (admin.role !== role) {
      return res.status(401).json({ message: 'Invalid role for this user' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.email,
        role: admin.role,
        name: admin.name,
        department: admin.department
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    // Return admin info and token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        email: admin.email,
        role: admin.role,
        name: admin.name,
        department: admin.department
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Verify token middleware
export const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // Add admin to request
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Check if user is department head
export const isDepartmentHead = (req, res, next) => {
  if (req.admin.role !== 'department_head') {
    return res.status(403).json({ success: false, message: 'Access denied. Not a department head.' });
  }
  next();
};

// Check if user is finance officer
export const isFinanceOfficer = (req, res, next) => {
  if (req.admin.role !== 'finance_officer') {
    return res.status(403).json({ success: false, message: 'Access denied. Not a finance officer.' });
  }
  next();
};

// Get current admin profile
export const getCurrentAdmin = (req, res) => {
  res.json({
    success: true,
    id: req.admin.id,
    email: req.admin.id, // Email is used as ID
    name: req.admin.name,
    role: req.admin.role,
    department: req.admin.department
  });
}; 