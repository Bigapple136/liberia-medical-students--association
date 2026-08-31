import express from 'express';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.middleware.js';
import * as dc from '../controllers/document.controller.js';

const router = express.Router();

// ─── Public routes (optionally authenticated — req.user is populated if a
// valid token is present, so access-level filtering can correctly tell an
// anonymous visitor apart from a logged-in member; neither case is ever
// rejected here) ────────────────────────────────────────────────────────
router.get('/', optionalAuthenticate, dc.getAll);
router.get('/:id/download', optionalAuthenticate, dc.download);

// ─── Admin routes ───────────────────────────────────────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

router.get('/admin/all', ...isAdmin, dc.getAllAdmin);
router.post('/', ...isAdmin, dc.create);
router.delete('/:id', ...isAdmin, dc.deleteDocument);

export default router;
