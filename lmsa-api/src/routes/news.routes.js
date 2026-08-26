import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as nc from '../controllers/news.controller.js';

const router = express.Router();

// ─── Admin-only: manage posts ────────────────────────────────────────────────
// Register before /:slug so literal paths aren't swallowed by the wildcard.
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

router.get('/admin/all', ...isAdmin, nc.getAllAdmin);
router.post('/', ...isAdmin, nc.create);
router.put('/:id', ...isAdmin, nc.update);
router.delete('/:id', ...isAdmin, nc.deletePost);

// ─── Public routes ───────────────────────────────────────────────────────────
// /tags registered before /:slug to avoid being captured by the wildcard.
router.get('/tags', nc.getTags);
router.get('/', nc.getAll);
router.get('/:slug', nc.getBySlug);

export default router;
