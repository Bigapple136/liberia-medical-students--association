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
    // The length caps match the form's maxLength attributes (80 / 254 / 150 /
    // 2000), so a direct POST can't put an unbounded body into an inbox.
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 80 })
      .withMessage('Name is limited to 80 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .isLength({ max: 254 })
      .withMessage('Email is limited to 254 characters'),
    body('subject')
      .trim()
      .optional({ values: 'falsy' })
      .isLength({ max: 150 })
      .withMessage('Subject is limited to 150 characters'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 2000 })
      .withMessage('Message is limited to 2000 characters'),
    validate,
  ],
  contactController.submit,
);

export default router;
