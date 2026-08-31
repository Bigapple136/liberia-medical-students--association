import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as dc from '../controllers/document.controller.js';

const router = express.Router();

// ─── Public routes (no authenticate — controller reads req.user if present) ─
router.get('/', dc.getAll);
router.get('/:id/download', dc.download);

// ─── Admin routes ───────────────────────────────────────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

router.get('/admin/all', ...isAdmin, dc.getAllAdmin);
router.post('/', ...isAdmin, dc.create);
router.delete('/:id', ...isAdmin, dc.deleteDocument);

export default router;
