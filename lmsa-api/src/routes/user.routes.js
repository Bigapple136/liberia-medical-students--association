import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// Get current user
router.get('/me', authenticate, userController.getCurrentUser);

// Update profile
router.put('/me', authenticate, userController.updateProfile);

// Get all users (admin only — includes 'executive' to match every other
// admin-gated route and the frontend's ADMIN_ROLES; this endpoint backs
// the committee "add member" and executive "assign position" search
// typeaheads, both reachable by executive-role admins, so it must accept
// the same roles they're already let into the admin panel with)
router.get('/', authenticate, authorize('admin', 'executive', 'super_admin'), userController.getAllUsers);

// Get user by ID (admin only — not currently called from anywhere in the
// frontend; self-lookup goes through /users/me instead. Previously
// authenticate-only with no role check, which let any logged-in user
// fetch any other user's full profile — email, phone, date of birth,
// gender, student ID — by id. Restricted rather than removed in case
// something external depends on it.)
router.get('/:id', authenticate, authorize('admin', 'executive', 'super_admin'), userController.getUserById);

export default router;