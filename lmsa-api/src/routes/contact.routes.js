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
    // `.trim()` sanitises before `.notEmpty()` checks, so a submission of
    // spaces only is rejected here rather than mailed out as an empty message.
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('subject').trim().optional({ values: 'falsy' }),
    body('message').trim().notEmpty().withMessage('Message is required'),
    validate,
  ],
  contactController.submit,
);

export default router;
