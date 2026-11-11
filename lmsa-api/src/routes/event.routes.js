import express from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
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

// Nothing checked these columns before, so an event could be saved with an end
// before its start, or a registration deadline after the event had begun. Every
// rule below is skipped when its field is absent, which is what the status-only
// update issued after creating an event needs.
const isUnreadableDate = (value) => Number.isNaN(new Date(value).getTime());

const eventDateRules = ({ startRequired }) => [
  (startRequired
    ? body('start_datetime').notEmpty().withMessage('Start date and time is required').bail()
    : body('start_datetime').optional({ values: 'falsy' })
  ).isISO8601().withMessage('Start date and time must be a valid date'),
  body('end_datetime')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('End date and time must be a valid date')
    .bail()
    .custom((value, { req }) => {
      const start = req.body.start_datetime;
      if (!start || isUnreadableDate(start)) return true;
      if (new Date(value) < new Date(start)) {
        throw new Error('End date and time must not be before the start');
      }
      return true;
    }),
  body('registration_deadline')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('Registration deadline must be a valid date')
    .bail()
    .custom((value, { req }) => {
      const start = req.body.start_datetime;
      if (!start || isUnreadableDate(start)) return true;
      if (new Date(value) > new Date(start)) {
        throw new Error('Registration deadline must not be after the event starts');
      }
      return true;
    }),
];

router.post('/', ...isAdmin, eventDateRules({ startRequired: true }), validate, ec.create);
router.put('/:id', ...isAdmin, eventDateRules({ startRequired: false }), validate, ec.update);
router.delete('/:id', ...isAdmin, ec.deleteEvent);
router.get('/:id/registrations', ...isAdmin, ec.getRegistrations);

export default router;
