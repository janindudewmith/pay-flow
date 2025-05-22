import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import formRoutes from './routes/formRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import websocketRoutes from './routes/websocketRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import { Clerk } from '@clerk/clerk-sdk-node';
import { sendFormNotification } from './services/emailService.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Middleware imports
import errorHandler from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.CLERK_SECRET_KEY) {
  console.error('ERROR: CLERK_SECRET_KEY is not set in environment variables');
  console.error('Please add CLERK_SECRET_KEY to your .env file');
  process.exit(1);
}

const app = express();

// Initialize Clerk
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Request headers:', req.headers);

  if (req.method !== 'GET') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }

  next();
});

// Routes
app.use('/api/forms', formRoutes); // Form submission routes
app.use('/api/otp', otpRoutes); // OTP routes
app.use('/api/websocket', websocketRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('PayFlow API is running');
});

// Test route for user API
app.get('/api/users/test', (req, res) => {
  res.json({
    success: true,
    message: 'User API is working',
    timestamp: new Date().toISOString()
  });
});

// Test route for Clerk
app.get('/api/test-clerk', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Clerk is configured correctly',
      secretKeyPresent: !!process.env.CLERK_SECRET_KEY,
      secretKeyFirstChars: process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.substring(0, 5) + '...' : 'Not available'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing Clerk configuration',
      error: error.message
    });
  }
});

app.get('/api/test-email', async (req, res) => {
  try {
    await sendFormNotification(
      process.env.EMAIL_USER, // send to yourself for testing
      'Test Email from PayFlow',
      'This is a test email sent from your PayFlow backend.'
    );
    res.json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log(`Clerk configuration: ${process.env.CLERK_SECRET_KEY ? 'PRESENT' : 'MISSING'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
