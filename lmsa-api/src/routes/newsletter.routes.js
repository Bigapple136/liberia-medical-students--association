import express from 'express';
import * as newsletterController from '../controllers/newsletter.controller.js';

const router = express.Router();

// Both routes are public (no `authenticate`): the newsletter signup is a
// site-wide, unauthenticated form, and the unsubscribe link in an email is
// clicked by someone who isn't logged in. Rate limiting (authLimiter,
// 30/15min) is applied at the /api/newsletter mount point in server.js —
// same judgment call T15 made for /api/contact, since this is a public
// endpoint that's a plausible spam target.
router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

export default router;
