import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as ec from '../controllers/executive.controller.js';

const router = express.Router();

// ─── Public routes ──────────────────────────────────────────────────────────
router.get('/', ec.getAll);
// Static path before any '/:id' patterns so 'past-presidents' can never be
// captured as an id. Scoped to completed Presidencies only — no open status filter.
router.get('/past-presidents', ec.getPastPresidents);

// ─── Admin: manage executive positions ─────────────────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

router.get('/admin/all', ...isAdmin, ec.getAllAdmin);
router.post('/', ...isAdmin, ec.create);
router.put('/:id', ...isAdmin, ec.update);
router.delete('/:id', ...isAdmin, ec.deletePosition);

export default router;
