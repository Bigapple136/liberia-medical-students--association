import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as mc from '../controllers/membership.controller.js';

const router = express.Router();

// ─── Authenticated: applicant actions ───────────────────────────────────────
router.post('/apply', authenticate, mc.apply);
router.get('/status', authenticate, mc.getStatus);

// ─── Admin: manage applications ─────────────────────────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

router.get('/applications', ...isAdmin, mc.getAll);
router.get('/applications/:id', ...isAdmin, mc.getById);
router.put('/applications/:id', ...isAdmin, mc.updateStatus);

export default router;
