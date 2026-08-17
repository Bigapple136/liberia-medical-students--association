import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as ec from '../controllers/event.controller.js';

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', ec.getAll);
router.get('/:slug', ec.getBySlug);

// ─── Authenticated: register / unregister ────────────────────────────────────
router.post('/:id/register', authenticate, ec.register);
router.delete('/:id/register', authenticate, ec.unregister);

// ─── Admin: manage events ────────────────────────────────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

router.post('/', ...isAdmin, ec.create);
router.put('/:id', ...isAdmin, ec.update);
router.delete('/:id', ...isAdmin, ec.deleteEvent);
router.get('/:id/registrations', ...isAdmin, ec.getRegistrations);

export default router;
