import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';
import * as contactController from '../controllers/contact.controller.js';

const router = express.Router();

// POST /api/contact — public, no auth required
// Uses authLimiter (30/15min) applied in server.js at the /api/contact mount
// point — this is an unauthenticated public-facing form, plausible spam target.
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
    validate,
  ],
  contactController.submit,
);

export default router;
