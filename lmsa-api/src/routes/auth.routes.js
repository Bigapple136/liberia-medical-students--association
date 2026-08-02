import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('year_level').isInt({ min: 1, max: 6 }).withMessage('Invalid year level'),
    validate,
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  authController.login
);

// Logout
router.post('/logout', authController.logout);

// Forgot password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    validate,
  ],
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    validate,
  ],
  authController.resetPassword
);

export default router;