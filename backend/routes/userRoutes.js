import express from 'express';
import { createOrUpdateUser, getCurrentUser, updateUserProfile, getAllUsers } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create or update user
router.post('/create-update', createOrUpdateUser);

// Get current user
router.get('/:clerkId', getCurrentUser);

// Update user profile
router.put('/:clerkId', updateUserProfile);

// Get all users (admin only)
router.get('/', authMiddleware, getAllUsers);

export default router; 