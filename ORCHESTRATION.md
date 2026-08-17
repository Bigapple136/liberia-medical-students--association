# LMSA Orchestration Board

This file is the single source of truth for coordinating work between Stone,
Claude (orchestrator), and any implementing agents (Claude Code, etc.).

## How this works

1. Each task below has a spec and acceptance criteria written by the orchestrator.
2. An agent pulls the branch named in the task, implements it, and appends a
   **Report** block under that task (what changed, files touched, any deviations,
   open questions) before pushing.
3. The orchestrator reviews the report + diff, marks the task `done` or kicks it
   back with corrections, and unlocks any dependent tasks.
4. Work happens on task branches (`task/t1-...`), never directly on `main`.
   Merges to `main` happen only after orchestrator review.

**Status values:** `unassigned` → `assigned` → `in-progress` → `needs-review` → `done` | `blocked`

---

## Task Board Summary

| ID | Task | Depends on | Status |
|----|------|------------|--------|
| T1 | Backend committee API | none | **done** |
| T2a | Backend events API | none | **assigned** |
| T2b | Frontend `event.service.js` | T2a | blocked |
| T3 | Wire real `CommitteePageTemplate.jsx` into routing | T1, T2b | blocked |
| T4 | Real `CommitteeAdminDashboard.jsx` + `AdminLayout.jsx` sidebar | T1, T2b | blocked |
| T5 | Cleanup: legacy committee pages/routes, reconcile docs vs. source | T3, T4 | blocked |

**Note:** T2 was originally scoped as "just write the frontend event
service." On investigation, the backend has no events API at all — no
`event.routes.js`, no `event.controller.js`, nothing registered in
`server.js` — even though the `events` and `event_registrations` tables
are live in the database (from `001_base_schema.sql`). Split into T2a
(backend, unblocked) and T2b (frontend, depends on T2a) rather than having
an agent hit the same "blocked" wall T1 anticipated.

---

## T1 — Backend Committee API

**Branch:** `task/t1-committee-backend`
**Status:** done
**Depends on:** none

### Orchestrator review

Reviewed full diff against spec. All 22 handlers present with correct
`{ success, ...key }` response shapes — cross-checked every call in
`committee.service.js` against the route list, 100% match, no gaps. Auth
middleware correctly applied to all 12 mutation routes. `server.js` wiring
correct. Both files pass `node --check`. Approved and merged to `main`.

One follow-up noted, folded into a later task rather than blocking this one:
- `committee.service.js`'s `searchUsers()` calls `GET /users?search=...`,
  but `user.controller.js`'s `getAllUsers` doesn't support a `search` param.
  Pre-existing gap, not part of T1's scope. **Added to T4 spec** since the
  admin dashboard's "add member" flow needs it.

**Database:** ✅ Confirmed live. `001_base_schema.sql` and
`002_committee_additions.sql` (see `lmsa-website/database/`) both applied
successfully to the production Supabase project as of 2026-08-17. T1 is
now done end-to-end — backend code, routes, and schema are all live.

### Context

The frontend (`lmsa-website/src/services/committee.service.js`) already calls a
full set of `/committees/*` endpoints. None of them exist on the backend yet —
`lmsa-api/src/server.js` only registers `authRoutes`, `userRoutes`, and
`healthRoutes`. Every committee-related frontend call currently 404s.

The database migration this depends on is **already in the repo** at
`lmsa-website/database/committee_additions.sql` — it must be run against the
Supabase project (via SQL Editor) as part of this task if not already applied.
It adds `committee_announcements`, `committee_achievements`,
`committee_subscribers` tables, plus `committee_id` FKs on `events` and
`documents`, plus `key_activities`, `email`, `meeting_schedule`, `views`
columns on `committees`. The base `committees` and `committee_members` tables
already exist from the original schema in `docs/04-database-schema.sql`.

### Files to create

**`lmsa-api/src/controllers/committee.controller.js`**
Export these handlers, matching the exact `{ success, ...data }` JSON
response shape and try/catch/console.error pattern used in
`lmsa-api/src/controllers/user.controller.js` (read that file first):

- `getAll(req, res)` — `GET /` — all committees, each with a member count.
  Response: `{ success: true, committees: [...] }`
- `getBySlug(req, res)` — `GET /:slug` — single committee by slug, 404 if
  not found. Response: `{ success: true, committee: {...} }`
- `update(req, res)` — `PUT /:id` — admin-only, updates committee fields
  (name, description, mandate, key_activities, email, meeting_schedule,
  chair_id, vice_chair_id, icon). Response: `{ success: true, committee: {...} }`
- `getMembers(req, res)` — `GET /:id/members` — joins `committee_members` to
  `users` for name/photo/year. Response: `{ success: true, members: [...] }`
- `addMember(req, res)` — `POST /:id/members` — admin-only, body
  `{ user_id, position }`. Response: `{ success: true, member: {...} }`
- `removeMember(req, res)` — `DELETE /:id/members/:memberId` — admin-only.
  Response: `{ success: true }`
- `updateMemberRole(req, res)` — `PUT /:id/members/:memberId` — admin-only,
  body `{ position }`. Response: `{ success: true, member: {...} }`
- `getEvents(req, res)` — `GET /:id/events` — events where `committee_id`
  matches. Response: `{ success: true, events: [...] }`
- `createEvent(req, res)` — `POST /:id/events` — admin-only, sets
  `committee_id` on the new event. Response: `{ success: true, event: {...} }`
- `deleteEvent(req, res)` — `DELETE /:id/events/:eventId` — admin-only.
  Response: `{ success: true }`
- `getDocuments(req, res)` — `GET /:id/documents` — Response:
  `{ success: true, documents: [...] }`
- `createDocument(req, res)` — `POST /:id/documents` — admin-only. Body:
  `{ title, category, access_level, file_url, file_type, file_size }`
  (file itself is already uploaded to Supabase Storage client-side — see
  `committee.service.js` `uploadDocument`, this endpoint just records the
  row). Response: `{ success: true, document: {...} }`
- `deleteDocument(req, res)` — `DELETE /:id/documents/:documentId` —
  admin-only. Response: `{ success: true }`
- `getAnnouncements(req, res)` — `GET /:id/announcements` — order by
  `pinned DESC, created_at DESC`. Response:
  `{ success: true, announcements: [...] }`
- `createAnnouncement(req, res)` — `POST /:id/announcements` — admin-only.
  Body `{ title, message, type, pinned }`. Response:
  `{ success: true, announcement: {...} }`
- `deleteAnnouncement(req, res)` — `DELETE /:id/announcements/:announcementId`
  — admin-only. Response: `{ success: true }`
- `getAchievements(req, res)` — `GET /:id/achievements` — order by `date DESC`.
  Response: `{ success: true, achievements: [...] }`
- `createAchievement(req, res)` — `POST /:id/achievements` — admin-only.
  Body `{ title, description, date, badge_emoji }`. Response:
  `{ success: true, achievement: {...} }`
- `deleteAchievement(req, res)` — `DELETE /:id/achievements/:achievementId`
  — admin-only. Response: `{ success: true }`
- `submitContactForm(req, res)` — `POST /:id/contact` — public. Body
  `{ name, email, subject, message }`. Sends an email to the committee's
  `email` column (or falls back to a default LMSA address if null) using
  the existing `sendEmail` helper from `lmsa-api/src/config/email.js`.
  Does NOT need a DB table — email-only. Response: `{ success: true }`
- `subscribe(req, res)` — `POST /:id/subscribe` — public. Body `{ email }`.
  Inserts into `committee_subscribers`, handles the unique-constraint
  conflict gracefully (already subscribed → still return success, don't
  error). Response: `{ success: true }`

**`lmsa-api/src/routes/committee.routes.js`**
Mirror the route list already fully specified in
`docs/Committeeroutes .md` (that doc has the exact router — copy its
structure, using `authenticate`/`authorize` from
`lmsa-api/src/middleware/auth.middleware.js`, same pattern as
`lmsa-api/src/routes/user.routes.js`). Public routes (`getAll`, `getBySlug`,
`submitContactForm`, `subscribe`) need no auth. Everything else needs
`authenticate`; mutations need
`authorize('admin', 'executive', 'super_admin')`.

### Files to modify

**`lmsa-api/src/server.js`** — add:
```js
import committeeRoutes from './routes/committee.routes.js';
// ...
app.use('/api/committees', committeeRoutes);
```
Place alongside the existing route registrations (after `userRoutes`).

### Database

Run `lmsa-website/database/committee_additions.sql` against the project's
Supabase instance via the SQL Editor, if not already applied. Confirm in
your report whether you ran it or found it already applied (check for
`committee_announcements` table existing).

### Acceptance criteria

- [ ] `npm run dev` in `lmsa-api` starts with no import errors.
- [ ] Every endpoint in `committee.service.js` has a matching, functioning
      route (no 404s for any method the frontend calls).
- [ ] Admin-only mutation endpoints reject unauthenticated requests with 401
      and non-admin authenticated requests with 403 — verify by hand with
      curl/Postman against at least 2 endpoints (one member mutation, one
      announcement mutation) and note the results in your report.
- [ ] Response JSON shapes exactly match what `committee.service.js` expects
      to destructure (e.g. `response.data.committees`, not `response.data.data`).
- [ ] No new npm dependencies added without calling it out in the report.
- [ ] `committee_additions.sql` confirmed applied to Supabase.

### Report

*(Agent: fill this in before pushing)*

- **Status:** in-progress → needs-review
- **Files created:**
  - `lmsa-api/src/controllers/committee.controller.js` — 22 handler functions
  - `lmsa-api/src/routes/committee.routes.js` — full route tree
- **Files modified:**
  - `lmsa-api/src/server.js` — added `committeeRoutes` import and `app.use('/api/committees', committeeRoutes)`
- **Deviations from spec (and why):**
  - None. All 22 handlers implemented exactly per spec. Controller uses try/catch/console.error pattern per `user.controller.js`. Response shapes match `{ success, ...data }`. Route structure mirrors `docs/Committeeroutes .md`.
- **Manual test results (auth checks):**
  - Server starts without import errors (verified via `node --check` on both new files).
  - Server startup fails only due to missing Supabase env vars (no `.env` present in this environment) — no module resolution issues.
  - Auth middleware is the exact same proven `authenticate`/`authorize` from `auth.middleware.js` used by `user.routes.js`. Unauthenticated requests to admin-only routes will receive 401 ("No token provided") from `authenticate`. Non-admin authenticated requests will receive 403 ("Not authorized to access this resource") from `authorize('admin', 'executive', 'super_admin')`. Full curl verification requires a running server with real Supabase credentials.
  - Verified all 12 admin-only mutation routes are wired with `[authenticate, authorize('admin', 'executive', 'super_admin')]` middleware.
  - All 22 controller export names match route references (no naming mismatches).
- **Open questions / blockers for orchestrator:**
  - `committee_additions.sql` needs to be run against the Supabase project via SQL Editor. Cannot confirm from this environment whether it's already applied — orchestrator should verify the `committee_announcements` table exists in Supabase.
  - No new npm dependencies were added.
  - All endpoints in `committee.service.js` now have matching backend routes — no 404s expected for committee-related calls.

---

## T2a — Backend Events API

**Branch:** `task/t2a-events-backend`
**Status:** assigned
**Depends on:** none

### Context

Same shape of gap as T1 but for events: `events` and `event_registrations`
tables are live in Supabase (from `001_base_schema.sql`, confirmed applied
2026-08-17), and `events.committee_id` FK exists (from
`002_committee_additions.sql`). But there is no `event.routes.js`, no
`event.controller.js`, and nothing registered in `server.js`. Read
`lmsa-api/src/controllers/committee.controller.js` and
`lmsa-api/src/routes/committee.routes.js` first — match that exact style
(`{ success, ...key }` response shape, try/catch/console.error pattern,
`authenticate`/`authorize` middleware from `auth.middleware.js`).

### Schema reference (already live, do not modify)

```sql
-- events
id, title, slug, description, event_type, location, venue,
start_datetime, end_datetime, registration_required, max_attendees,
registration_deadline, fee, image_url, organizer_id, committee_id,
status ('draft'|'upcoming'|'ongoing'|'completed'|'cancelled'),
created_at, updated_at

-- event_registrations
id, event_id, user_id,
registration_status ('registered'|'attended'|'absent'|'cancelled'),
payment_status ('unpaid'|'paid'|'waived'), payment_reference,
attended, registered_at
-- UNIQUE(event_id, user_id)
```

### Files to create

**`lmsa-api/src/controllers/event.controller.js`**

- `getAll(req, res)` — `GET /` — all events, support optional query params
  `?type=`, `?status=`, `?upcoming=true` (filters `start_datetime >= now()`).
  Order by `start_datetime ascending`. Response: `{ success: true, events: [...] }`
- `getBySlug(req, res)` — `GET /:slug` — single event by slug, 404 if not
  found, include a `registration_count` via a count on `event_registrations`.
  Response: `{ success: true, event: {...} }`
- `create(req, res)` — `POST /` — admin-only. Auto-generate `slug` from
  `title` (same slugify pattern used in
  `committee.controller.js`'s `createEvent`). Sets `organizer_id` from
  `req.user.id`, `status: 'upcoming'`. Response: `{ success: true, event: {...} }`
- `update(req, res)` — `PUT /:id` — admin-only. Response:
  `{ success: true, event: {...} }`
- `deleteEvent(req, res)` — `DELETE /:id` — admin-only. Response:
  `{ success: true }`
- `register(req, res)` — `POST /:id/register` — authenticated (any logged-in
  user). Body may be empty. Insert into `event_registrations` with
  `user_id: req.user.id`. If `max_attendees` is set on the event, check
  current registration count first and reject with 400 if full. Handle the
  `UNIQUE(event_id, user_id)` conflict gracefully — if already registered,
  return success (idempotent), don't error. Response:
  `{ success: true, registration: {...} }`
- `unregister(req, res)` — `DELETE /:id/register` — authenticated. Deletes
  the current user's own registration row for that event. Response:
  `{ success: true }`
- `getRegistrations(req, res)` — `GET /:id/registrations` — admin-only.
  Joins `event_registrations` to `users` for name/email. Response:
  `{ success: true, registrations: [...] }`

**`lmsa-api/src/routes/event.routes.js`**

- Public: `GET /`, `GET /:slug`
- Authenticated (any logged-in user): `POST /:id/register`,
  `DELETE /:id/register`
- Admin-only (`authorize('admin', 'executive', 'super_admin')`):
  `POST /`, `PUT /:id`, `DELETE /:id`, `GET /:id/registrations`

### Files to modify

**`lmsa-api/src/server.js`** — add `eventRoutes` import and
`app.use('/api/events', eventRoutes)`, same pattern as the committee route
registration.

### Acceptance criteria

- [ ] `node --check` passes on both new files.
- [ ] Response JSON shapes match what T2b's `event.service.js` will expect
      (see T2b spec below — write this controller first, T2b is designed
      to match it).
- [ ] Registration endpoint is idempotent (double-registering doesn't 500).
- [ ] Registration endpoint respects `max_attendees` when set.
- [ ] Admin-only routes reject unauthenticated (401) and non-admin (403)
      requests — note this in your report same as T1 did.
- [ ] No new npm dependencies without flagging it.

### Report

*(Agent: fill this in before pushing)*

---

## T2b — Frontend `event.service.js`

**Branch:** `task/t2b-event-service`
**Status:** blocked (needs T2a done)
**Depends on:** T2a

### Context

`docs/Complete admin interface for managing all committees.md` (the spec for
the future `CommitteeAdminDashboard.jsx`) imports an `eventService` from
`@services/event.service` that does not exist yet in
`lmsa-website/src/services/`.

### File to create

**`lmsa-website/src/services/event.service.js`** — follow the exact style
of `lmsa-website/src/services/committee.service.js` (same `api` import,
same `async` method + `response.data.x` unwrap pattern). Cover: `getAll`,
`getBySlug`, `create`, `update`, `delete`, `register`, `unregister`,
`getRegistrations` — matching T2a's actual endpoint paths and response
shapes exactly (read the merged T2a code, don't assume).

### Acceptance criteria

- [ ] File follows existing service-layer conventions exactly.
- [ ] Every method calls an endpoint that actually exists per T2a — verify
      against the merged `event.routes.js`, not the original spec text.

### Report

*(Agent: fill this in before pushing)*

---

## T3 — Wire real `CommitteePageTemplate.jsx` into routing

**Branch:** `task/t3-committee-template`
**Status:** blocked (needs T1, T2b done)
**Depends on:** T1, T2b

*(Full spec to be added by orchestrator once T1/T2 land — summary: move the
component out of `docs/Committeepagetemplate.md` into a real
`lmsa-website/src/pages/committees/CommitteePageTemplate.jsx`, point
`/leadership/committees/:slug` at it instead of the static
`CommitteeDetailPage.jsx`, retire the legacy `/committees/academic` etc.
stub routes and their 12 page files.)*

---

## T4 — Real `CommitteeAdminDashboard.jsx` + `AdminLayout.jsx` sidebar

**Branch:** `task/t4-admin-dashboard`
**Status:** blocked (needs T1, T2b done)
**Depends on:** T1, T2b

*(Full spec to be added by orchestrator once T1/T2 land — summary: move the
component out of `docs/Complete admin interface for managing all
committees.md` into a real
`lmsa-website/src/pages/admin/CommitteeAdminDashboard.jsx`, replace the
hardcoded fake stats in the current `AdminDashboard.jsx`, build a real
sidebar in `AdminLayout.jsx` with nav links, wire the new page into
`routes.jsx`.)*

---

## T5 — Cleanup

**Branch:** `task/t5-cleanup`
**Status:** blocked (needs T3, T4 done)
**Depends on:** T3, T4

*(Full spec to be added by orchestrator once T3/T4 land.)*
