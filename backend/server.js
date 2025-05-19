import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import formRoutes from './routes/formRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import websocketRoutes from './routes/websocketRoutes.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import { Clerk } from '@clerk/clerk-sdk-node';

// Route imports
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

// Middleware imports
import errorHandler from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();

// Initialize Clerk
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(authMiddleware); // Verify Clerk token for all routes

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/websocket', websocketRoutes);
app.use('/api/auth', authRoutes);        // OTP send/verify
app.use('/api/requests', requestRoutes); // Form submissions, approvals, rejections

// Test route
app.get('/', (req, res) => {
  res.send('PayFlow API is running');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
