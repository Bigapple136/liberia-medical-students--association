import express from 'express';
import { body } from 'express-validator';
import {
  authenticate,
  authorize,
  optionalAuthenticate,
} from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as cc from '../controllers/committee.controller.js';

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', cc.getAll);
router.get('/:slug', cc.getBySlug);

// A committee's programmes. One route for both readers — '/:slug/programmes'
// and '/:id/programmes' are the same path shape, so the controller resolves the
// identifier and the caller's role decides whether drafts are included.
router.get('/:identifier/programmes', optionalAuthenticate, cc.getProgrammes);

// ─── Public interactions ──────────────────────────────────────────────────────
// `.trim()` sanitises before `.notEmpty()` checks, so a submission of spaces
// only is rejected here rather than mailed out as an empty message. The length
// caps match the committee page's maxLength attributes (80 / 254 / 150 / 2000)
// so a direct POST can't bypass the form.
router.post(
  '/:id/contact',
  [
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
  cc.submitContactForm,
);
router.post(
  '/:id/subscribe',
  [
    body('email').trim().isEmail().withMessage('A valid email is required'),
    validate,
  ],
  cc.subscribe,
);

// ─── Authenticated: apply to join a committee ────────────────────────────────
// Note: '/:slug/apply' must stay distinct from the '/:id/...' routes below —
// Express matches on path shape, and ':slug' here is only ever a committee slug.
router.post('/:slug/apply', authenticate, cc.applyToCommittee);

// ─── Authenticated: read committee data ──────────────────────────────────────
router.get('/:id/members', authenticate, cc.getMembers);
router.get('/:id/events', authenticate, cc.getEvents);
router.get('/:id/documents', authenticate, cc.getDocuments);
router.get('/:id/announcements', authenticate, cc.getAnnouncements);
router.get('/:id/achievements', authenticate, cc.getAchievements);

// ─── Admin: manage committee details ─────────────────────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

// Admin-only list, no status filter — the admin picker's data source, so a
// committee stays visible and reactivatable after an admin deactivates it.
// The public GET / below stays active-only and untouched (T39).
router.get('/admin/all', ...isAdmin, cc.getAllAdmin);

router.put('/:id', ...isAdmin, cc.update);

// Members
router.post('/:id/members', ...isAdmin, cc.addMember);
router.put('/:id/members/:memberId', ...isAdmin, cc.updateMemberRole);
router.delete('/:id/members/:memberId', ...isAdmin, cc.removeMember);

// Events
router.post('/:id/events', ...isAdmin, cc.createEvent);
router.delete('/:id/events/:eventId', ...isAdmin, cc.deleteEvent);

// Documents
router.post('/:id/documents', ...isAdmin, cc.createDocument);
router.delete('/:id/documents/:documentId', ...isAdmin, cc.deleteDocument);

// Announcements
router.post('/:id/announcements', ...isAdmin, cc.createAnnouncement);
router.delete('/:id/announcements/:announcementId', ...isAdmin, cc.deleteAnnouncement);

// Applications (join requests from members)
router.get('/:id/applications', ...isAdmin, cc.getApplications);
router.put('/applications/:id', ...isAdmin, cc.updateApplicationStatus);

// Achievements
router.post('/:id/achievements', ...isAdmin, cc.createAchievement);
router.delete('/:id/achievements/:achievementId', ...isAdmin, cc.deleteAchievement);

// Programmes
// 'reorder' is declared before the ':programmeId' update: both are PUTs under
// the same prefix, and Express takes the first route that matches.
router.post('/:id/programmes', ...isAdmin, cc.createProgramme);
router.put('/:id/programmes/reorder', ...isAdmin, cc.reorderProgrammes);
router.put('/:id/programmes/:programmeId', ...isAdmin, cc.updateProgramme);
router.delete('/:id/programmes/:programmeId', ...isAdmin, cc.deleteProgramme);

export default router;
