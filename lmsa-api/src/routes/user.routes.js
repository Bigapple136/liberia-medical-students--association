import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// Get current user
router.get('/me', authenticate, userController.getCurrentUser);

// Update profile
router.put('/me', authenticate, userController.updateProfile);

// Get all users (admin only)
router.get('/', authenticate, authorize('admin', 'super_admin'), userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticate, userController.getUserById);

export default router;