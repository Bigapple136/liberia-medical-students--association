import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

// GET /api/dashboard/stats — authenticated
router.get('/stats', authenticate, dashboardController.getMyStats);

// GET /api/dashboard/my-events — authenticated
router.get('/my-events', authenticate, dashboardController.getMyUpcomingEvents);

export default router;
