import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as cc from '../controllers/committee.controller.js';

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', cc.getAll);
router.get('/:slug', cc.getBySlug);

// ─── Public interactions ──────────────────────────────────────────────────────
router.post('/:id/contact', cc.submitContactForm);
router.post('/:id/subscribe', cc.subscribe);

// ─── Authenticated: read committee data ──────────────────────────────────────
router.get('/:id/members', authenticate, cc.getMembers);
router.get('/:id/events', authenticate, cc.getEvents);
router.get('/:id/documents', authenticate, cc.getDocuments);
router.get('/:id/announcements', authenticate, cc.getAnnouncements);
router.get('/:id/achievements', authenticate, cc.getAchievements);

// ─── Admin: manage committee details ─────────────────────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

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

// Achievements
router.post('/:id/achievements', ...isAdmin, cc.createAchievement);
router.delete('/:id/achievements/:achievementId', ...isAdmin, cc.deleteAchievement);

export default router;
