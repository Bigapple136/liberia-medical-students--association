import express from 'express';
import { body } from 'express-validator';
import * as newsletterController from '../controllers/newsletter.controller.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

// Both routes are public (no `authenticate`): the newsletter signup is a
// site-wide, unauthenticated form, and the unsubscribe link in an email is
// clicked by someone who isn't logged in. Rate limiting (authLimiter,
// 30/15min) is applied at the /api/newsletter mount point in server.js —
// same judgment call T15 made for /api/contact, since this is a public
// endpoint that's a plausible spam target.
// `.trim()` runs before `.isEmail()`, so an address the member typed with a
// stray leading or trailing space is accepted rather than rejected as invalid.
const emailRules = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  validate,
];

router.post('/subscribe', emailRules, newsletterController.subscribe);
router.post('/unsubscribe', emailRules, newsletterController.unsubscribe);

export default router;
