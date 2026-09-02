import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as nc from '../controllers/nomination.controller.js';

const router = express.Router();

// ─── Public: the election calendar ───────────────────────────────────────────
router.get('/cycle', nc.getCycle);

// ─── Authenticated: nominate yourself ────────────────────────────────────────
router.post('/', authenticate, nc.nominate);

// ─── Admin: manage the cycle and review nominations ──────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

router.put('/cycle', ...isAdmin, nc.saveCycle);
router.get('/', ...isAdmin, nc.getAll);
router.put('/:id', ...isAdmin, nc.updateStatus);

export default router;
