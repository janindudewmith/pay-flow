import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

// App config
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);        // OTP send/verify
app.use('/api/requests', requestRoutes); // Form submissions, approvals, rejections

// Test route
app.get('/', (req, res) => {
  res.send('PayFlow API is running');
});

// Start server
app.listen(port, () => {
  console.log("Server running on port", port);
});
