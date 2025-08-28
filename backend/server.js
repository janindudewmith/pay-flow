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
import adminAuthRoutes from './routes/adminAuthRoutes.js';

// Middleware imports
import errorHandler from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.CLERK_SECRET_KEY) {
  console.error('ERROR: CLERK_SECRET_KEY is not set in environment variables');
  console.error('Please add CLERK_SECRET_KEY to your .env file');
  // Don't exit in production, just log the error
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
}

// Check for JWT_SECRET environment variable
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set in environment variables');
  console.warn('Using default secret for JWT. This is not secure for production.');
}

const app = express();

// Initialize Clerk
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Connect to MongoDB
connectDB();

// CORS configuration - Updated for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://pay-flow-frontend.vercel.app',
  'https://pay-flow-frontend-git-main.vercel.app',
  'https://pay-flow-frontend-git-develop.vercel.app',
  'https://new-frontend-three-blue.vercel.app',  // Add your current frontend domain
  'https://new-frontend-45r9dzfa0-hashans-projects-a831d48a.vercel.app',  // Add your new frontend domain
  'https://new-frontend-23v0ooqdy-hashans-projects-a831d48a.vercel.app'  // Add your latest frontend domain
];

// Add your actual Vercel frontend domain here
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all for now, you can change this to false in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log all incoming requests (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Request headers:', req.headers);

    if (req.method !== 'GET') {
      console.log('Request body:', JSON.stringify(req.body, null, 2));
    }

    next();
  });
}

// Routes
console.log('Loading routes...');
try {
  app.use('/api/forms', formRoutes); // Form submission routes
  console.log('✓ Forms routes loaded');
} catch (error) {
  console.error('✗ Error loading forms routes:', error);
}

try {
  app.use('/api/otp', otpRoutes); // OTP routes
  console.log('✓ OTP routes loaded');
} catch (error) {
  console.error('✗ Error loading OTP routes:', error);
}

try {
  app.use('/api/websocket', websocketRoutes);
  console.log('✓ Websocket routes loaded');
} catch (error) {
  console.error('✗ Error loading websocket routes:', error);
}

try {
  app.use('/api/newsletter', newsletterRoutes);
  console.log('✓ Newsletter routes loaded');
} catch (error) {
  console.error('✗ Error loading newsletter routes:', error);
}

try {
  app.use('/api/contact', contactRoutes);
  console.log('✓ Contact routes loaded');
} catch (error) {
  console.error('✗ Error loading contact routes:', error);
}

try {
  app.use('/api/auth', authRoutes);
  console.log('✓ Auth routes loaded');
} catch (error) {
  console.error('✗ Error loading auth routes:', error);
}

try {
  app.use('/api/requests', requestRoutes);
  console.log('✓ Request routes loaded');
} catch (error) {
  console.error('✗ Error loading request routes:', error);
}

try {
  app.use('/api/users', userRoutes);
  console.log('✓ User routes loaded');
} catch (error) {
  console.error('✗ Error loading user routes:', error);
}

try {
  app.use('/api/admin', adminAuthRoutes); // Admin authentication routes
  console.log('✓ Admin routes loaded');
} catch (error) {
  console.error('✗ Error loading admin routes:', error);
}

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PayFlow API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
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

// Test route for OTP
app.get('/api/otp/test-simple', (req, res) => {
  res.json({ 
    success: true, 
    message: 'OTP test route works!',
    timestamp: new Date().toISOString()
  });
});

// Test POST route for OTP
app.post('/api/otp/test-post', (req, res) => {
  res.json({ 
    success: true, 
    message: 'OTP POST test route works!',
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Test exact OTP send route
app.post('/api/otp/send-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'OTP send test route works!',
    method: req.method,
    email: req.body.email,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PayFlow API is healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
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

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
    console.log(`Clerk configuration: ${process.env.CLERK_SECRET_KEY ? 'PRESENT' : 'MISSING'}`);
  });

  // Handle unhandled promise rejections
  server.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

// Export for Vercel serverless
export default app;
