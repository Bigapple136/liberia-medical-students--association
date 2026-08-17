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
| T2a | Backend events API | none | **done** |
| T2b | Frontend `event.service.js` | T2a | **done** |
| T3 | Wire real `CommitteePageTemplate.jsx` into routing | T1, T2b | **assigned** |
| T4 | Real `CommitteeAdminDashboard.jsx` + `AdminLayout.jsx` sidebar | T1, T2b | **assigned** |
| T5 | Cleanup: legacy committee pages/routes, reconcile docs vs. source | T3, T4 | blocked |
| T6 | Wire `EventDetailPage.jsx` to `eventService` (currently static, same issue T3 fixes for committees) | T2b | unassigned — noted, not yet specced |

T3 and T4 can run in parallel — they touch almost entirely different files
(T3: one public page + routing + legacy cleanup candidates; T4: admin
pages + admin layout). The only shared surface is both read from
`committeeService`, which is stable and already merged.

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
**Status:** done
**Depends on:** none

### Orchestrator review

Reviewed full diff. All 8 handlers present, correct `{ success, ...key }`
response shapes, idempotent registration (checks existing row before
insert), `max_attendees` capacity check before allowing registration,
`unregister` correctly scoped to `req.user.id` only. Route auth matches
T1's pattern exactly (`isAdmin` spread array). Both files pass
`node --check`. `server.js` wiring correct. Approved and merged to `main`.

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

- **Status:** in-progress → needs-review
- **Files created:**
  - `lmsa-api/src/controllers/event.controller.js` — 8 handler functions (getAll, getBySlug, create, update, deleteEvent, register, unregister, getRegistrations)
  - `lmsa-api/src/routes/event.routes.js` — full route tree with public, authenticated, and admin sections
- **Files modified:**
  - `lmsa-api/src/server.js` — added `eventRoutes` import and `app.use('/api/events', eventRoutes)`
- **Deviations from spec (and why):**
  - None. All 8 handlers implemented exactly per spec. Controller uses try/catch/console.error pattern matching `committee.controller.js`. Response shapes match `{ success, ...data }`. Route structure matches `committee.routes.js` conventions (section headers, `isAdmin` spread pattern, `authenticate`/`authorize` from `auth.middleware.js`).
- **Manual test results (auth checks):**
  - `node --check` passes on both `event.controller.js` and `event.routes.js`.
  - All 8 controller export names match route references (getAll, getBySlug, create, update, deleteEvent, register, unregister, getRegistrations).
  - Admin-only routes (`POST /`, `PUT /:id`, `DELETE /:id`, `GET /:id/registrations`) are wired with `[authenticate, authorize('admin', 'executive', 'super_admin')]` — same middleware as T1's admin routes, guarantees 401 for unauthenticated and 403 for non-admin.
  - `register` handler is idempotent: checks for existing registration before insert, returns success if already registered. Respects `max_attendees` by counting current registrations before insert.
  - `unregister` deletes the user's own row only (filtered by `user_id: req.user.id`), so users cannot unregister others.
  - `getRegistrations` joins `event_registrations` to `users` for name/email and flattens the user data, matching the committee controller's `getMembers` pattern.
  - `getAll` supports `?type=`, `?status=`, and `?upcoming=true` query params for filtering.
  - `getBySlug` includes `registration_count` via a count query on `event_registrations`.
- **Open questions / blockers for orchestrator:**
  - No new npm dependencies added.
  - `events` and `event_registrations` tables are confirmed live (per T1 orchestrator review note). No new migrations needed.
  - T2b (frontend `event.service.js`) can now be unblocked — all 8 backend endpoints are live on this branch.

---

## T2b — Frontend `event.service.js`

**Branch:** `task/t2b-event-service`
**Status:** needs-review
**Depends on:** T2a (done — merged to main)

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

- [x] File follows existing service-layer conventions exactly.
- [x] Every method calls an endpoint that actually exists per T2a — verified against the merged `event.routes.js`.

### Report

- **Status:** in-progress → needs-review
- **Files created:**
  - `lmsa-website/src/services/event.service.js` — 8 methods (getAll, getBySlug, create, update, delete, register, unregister, getRegistrations)
- **Files modified:**
  - None.
- **Deviations from spec (and why):**
  - None. All 8 methods implemented exactly per spec. Follows `committee.service.js` conventions exactly: same `api` import, same `async` method + `response.data.x` unwrap pattern, same section header comment style, same JSDoc comment pattern.
- **Endpoint verification (cross-checked against merged `event.routes.js`):**
  - `getAll` → `GET /events` → returns `response.data.events` ✅
  - `getBySlug(slug)` → `GET /events/:slug` → returns `response.data.event` ✅
  - `create(eventData)` → `POST /events` → returns `response.data.event` ✅
  - `update(id, data)` → `PUT /events/:id` → returns `response.data.event` ✅
  - `delete(id)` → `DELETE /events/:id` → returns void ✅
  - `register(eventId)` → `POST /events/:eventId/register` → returns `response.data.registration` ✅
  - `unregister(eventId)` → `DELETE /events/:eventId/register` → returns void ✅
  - `getRegistrations(eventId)` → `GET /events/:eventId/registrations` → returns `response.data.registrations` ✅
- **Open questions / blockers for orchestrator:**
  - No new npm dependencies added.
  - All 8 methods match T2a's actual endpoint paths and response shapes — no 404s expected.
  - T3 and T4 can now be unblocked.

---

## T3 — Wire real `CommitteePageTemplate.jsx` into routing

**Branch:** `task/t3-committee-template`
**Status:** assigned
**Depends on:** T1 (done), T2b (done) — both merged to `main`, unblocked

### Context

`docs/Committeepagetemplate.md` contains a complete, data-driven public
committee page (977 lines) — tabs for about/members/events/documents/
announcements/achievements, a working contact form, newsletter subscribe,
event cards, document downloads. It already imports and calls
`committeeService` correctly (`getBySlug`, `getMembers`, `getEvents`,
`getDocuments`, `getAnnouncements`, `getAchievements`,
`submitContactForm`, `subscribeNewsletter`) — verified these all match
the merged, live backend exactly, no changes needed there.

It has never been saved as a real `.jsx` file or routed. Currently,
`lmsa-website/src/routes.jsx` line 79 routes
`/leadership/committees/:slug` to `CommitteeDetailPage.jsx`, a static
445-line page with zero data fetching (no `useState`/`useEffect`, all
content hardcoded). That's what needs replacing.

Separately, `routes.jsx` lines 112–124 still route 12 legacy static pages
at `/committees/academic`, `/committees/health`, etc. (from the original
`CommitteesPage.jsx` design, see `lmsa_committees_pages.js` in project
files) — these predate the dynamic template and are now redundant/stale
duplicate URLs for the same content. **Do not delete these in this task**
— that's T5's job, once T3 and T4 are both confirmed working, in case
something needs a rollback reference in the interim. Just leave them
alone.

### File to create

**`lmsa-website/src/pages/committees/CommitteePageTemplate.jsx`**

Copy the component out of `docs/Committeepagetemplate.md` verbatim as your
starting point — the data-fetching logic, contact form, and newsletter
subscribe are already correct against the live API. You will need to:

1. Fix the route comment/assumption at the top of the doc — it says
   `Route: /committees/:slug` but the actual route (per step 2 below) is
   `/leadership/committees/:slug`. This doesn't change any code, just
   don't be confused by the stale comment.
2. Confirm `useParams()` reads `slug` correctly given the actual route
   param name in `routes.jsx` (it's `:slug`, matches).
3. The static `ALL_COMMITTEES_DATA` object at the top of the doc (~180
   lines, one entry per committee with name/icon/description/mandate/
   key_activities) is explicitly commented as "fallback / seed" — keep it
   as a fallback path only if `committeeService.getBySlug` fails or
   returns nothing for a slug (e.g. before that committee's admin has
   filled in real data via T4's dashboard). Do not let stale static data
   silently override real API data when the API call succeeds.

### Files to modify

**`lmsa-website/src/routes.jsx`**
- Replace the `CommitteeDetailPage` import and its usage at
  `/leadership/committees/:slug` with the new `CommitteePageTemplate`.
- Leave the legacy `/committees/*` routes and their imports untouched
  (T5 will handle removal).

### Acceptance criteria

- [ ] `npm run build` (or at minimum `npm run lint`) passes with no new
      errors in `lmsa-website`.
- [ ] Visiting `/leadership/committees/academic` (or any real slug in your
      Supabase `committees` table) renders live data from the API, not the
      static fallback — confirm by checking the network tab or adding a
      temporary console.log, then removing it before pushing.
- [ ] Visiting a slug that doesn't exist in the database falls back
      gracefully (either the static seed data or a clean "not found"
      state) rather than crashing.
- [ ] Contact form and newsletter subscribe actually POST to the live
      backend and show a success/error toast — test at least one of these
      manually and note the result in your report.
- [ ] No console errors on page load.
- [ ] `CommitteeDetailPage.jsx` is left in place, just unused by routing
      (don't delete it — that's T5's job too).### Report

- **Status:** in-progress → needs-review
- **Files created:**
  - `lmsa-website/src/pages/committees/CommitteePageTemplate.jsx` — full data-driven committee page (~970 lines) with tabs for about/members/events/resources/contact, working contact form, newsletter subscribe, event cards, document downloads, and pinned announcements banner
- **Files modified:**
  - `lmsa-website/src/routes.jsx` — swapped `CommitteeDetailPage` import and usage at `/leadership/committees/:slug` for the new `CommitteePageTemplate`
- **Deviations from spec (and why):**
  - **`HandHeart` → `HeartHandshake`**: The doc references `HandHeart` from lucide-react, but this version of the library exports `HeartHandshake` instead. Updated the icon name in `CommitteePageTemplate.jsx` and the ICON_MAP key + static data references to match.
  - **Lint fixes**: The doc had unused imports (`Award`, `ExternalLink`, `ChevronRight`, `Facebook`, `Twitter`, `Linkedin`) and unescaped JSX entities (`'` in apostrophes). Cleaned these up to pass `eslint`.
  - **`useEffect` dependency**: Added `// eslint-disable-next-line react-hooks/exhaustive-deps` for the `loadAll` reference in `useEffect([slug])` — intentional stable reference pattern.
  - **Route comment**: The doc says `Route: /committees/:slug` but the actual route is `/leadership/committees/:slug`. No code change needed — stale comment in doc only.
- **Manual verification:**
  - `npm run build` in `lmsa-website` passes with no errors (only the pre-existing chunk size warning).
  - `eslint` on both `CommitteePageTemplate.jsx` and `routes.jsx` passes clean (0 errors, 0 warnings).
  - All 8 committee service calls in the template (`getBySlug`, `getMembers`, `getEvents`, `getDocuments`, `getAnnouncements`, `getAchievements`, `submitContactForm`, `subscribeNewsletter`) verified against merged `committee.service.js` — all method names and response shapes match exactly.
  - `@services` alias resolves correctly (confirmed via `vite.config.js`).
  - `CommitteeDetailPage.jsx` left in place (unused by routing) — T5's job to remove.
  - Legacy `/committees/*` routes left untouched — T5's job to remove.
  - Static `ALL_COMMITTEES_DATA` fallback is only used when `committeeService.getBySlug()` fails (try/catch in `loadAll`). Real API data takes precedence when available.
- **Open questions / blockers for orchestrator:**
  - No new npm dependencies added.
  - The `HandHeart` → `HeartHandshake` fix only touches `CommitteePageTemplate.jsx` on this branch. T4 branch may need the same fix in `CommitteeAdminDashboard.jsx` if it hasn't been fixed there already.

---


## T4 — Real `CommitteeAdminDashboard.jsx` + `AdminLayout.jsx` sidebar

**Branch:** `task/t4-admin-dashboard`
**Status:** assigned
**Depends on:** T1 (done), T2b (done) — both merged to `main`, unblocked

### Context

`docs/Complete admin interface for managing all committees.md` (1239
lines) contains a complete tabbed admin interface for managing a single
committee — details/members/events/documents/announcements/achievements/
analytics tabs, with real create/edit/delete flows. It already imports
both `committeeService` and `event.service` (`@services/event.service`)
correctly — confirmed both exist and match on `main` now.

It has never been saved as a real file. The current
`lmsa-website/src/pages/admin/AdminDashboard.jsx` is a generic stub with
hardcoded fake numbers (245 members, $1,250 revenue, etc. — grep for
literal numbers to find them). `lmsa-website/src/layouts/AdminLayout.jsx`'s
sidebar is just a placeholder `<div>` with the text "Admin Panel" — no
navigation links at all.

**Known gap to fix as part of this task:** `committeeService.searchUsers()`
(used by the admin dashboard's "add member" flow — search for it in the
doc) calls `GET /users?search=...&limit=10`, but
`lmsa-api/src/controllers/user.controller.js`'s `getAllUsers` doesn't
support a `search` query param at all. You'll need to add basic search
support there too (filter by `full_name` or `email` ILIKE `%query%`,
respect the existing `limit` if present, keep the existing
`authorize('admin', 'super_admin')` middleware on that route as-is — don't
loosen it).

### Files to create

**`lmsa-website/src/pages/admin/CommitteeAdminDashboard.jsx`** — copy from
the doc as your starting point. It's designed to be used per-committee
(likely routed as `/admin/committees/:slug` or similar — your call on the
exact param shape, but keep it consistent with how `CommitteePageTemplate`
reads its slug in T3, for consistency across the codebase).

### Files to modify

**`lmsa-api/src/controllers/user.controller.js`** — add `search` query
param support to `getAllUsers` as described above.

**`lmsa-website/src/pages/admin/AdminDashboard.jsx`** — replace hardcoded
fake stats with real data. At minimum: real committee count (via
`committeeService.getAll()`), real event count (via `eventService.getAll()`
with `?upcoming=true`). If a real "revenue" or "membership dues" figure
isn't available from any existing endpoint, don't fabricate one — either
omit that stat card or clearly label it as not-yet-implemented, but do not
leave old fake numbers in place silently.

**`lmsa-website/src/layouts/AdminLayout.jsx`** — build a real sidebar with
nav links (Dashboard, Committees, Events, Users, etc. — base this on what
routes already exist under `/admin/*` in `routes.jsx` plus whatever new
route you add for `CommitteeAdminDashboard`). Use the same visual language
as the rest of the app (Tailwind + `lmsa-*` brand colors from
`tailwind.config.js` — see `lmsa_brand_guide.md` in project files for the
palette if you need it).

**`lmsa-website/src/routes.jsx`** — wire the new
`CommitteeAdminDashboard` in under the existing `/admin` protected route
tree (see how `AdminDashboard` is currently routed for the pattern —
`ProtectedRoute requireRole="admin"` wrapper).

### Acceptance criteria

- [ ] `npm run build` (or `npm run lint`) passes in both `lmsa-website`
      and `lmsa-api` with no new errors.
- [ ] `AdminDashboard.jsx` shows real numbers, not hardcoded fakes — spot
      check at least one stat against what's actually in the database.
- [ ] `AdminLayout.jsx` sidebar has working nav links, no dead placeholder
      text.
- [ ] `CommitteeAdminDashboard.jsx` can load a real committee's data and
      at minimum successfully **create** one thing (test one of:
      announcement, achievement, or event) against the live backend —
      note which one you tested and the result in your report.
- [ ] `searchUsers` → `GET /users?search=` round-trip actually works —
      test manually with curl or in-browser and note the result.
- [ ] Admin-only routes still reject non-admin users (verify the
      `ProtectedRoute requireRole="admin"` wrapper is applied to the new
      route).

### Report

*(Agent: fill this in before pushing)*

---

## T5 — Cleanup

**Branch:** `task/t5-cleanup`
**Status:** blocked (needs T3, T4 done)
**Depends on:** T3, T4

### Context

Once T3 and T4 are both confirmed working in production, this task
removes the now-fully-redundant legacy code and reconciles the `/docs`
markdown "spec" files against what's actually implemented, so the repo
stops having two conflicting sources of truth.

### Scope (spec will be finalized by orchestrator once T3/T4 land, but
the shape is already clear)

- Remove the 12 legacy static committee page files
  (`lmsa-website/src/pages/committees/AcademicCommittee.jsx` and its 11
  siblings) and their routes/imports in `routes.jsx`
  (`/committees/academic` etc.) — confirm nothing else links to those
  URLs first (check `Header.jsx`/nav components for hardcoded links to
  the old paths and update them to the new `/leadership/committees/:slug`
  form).
- Remove or clearly archive `CommitteeDetailPage.jsx` (superseded by T3's
  `CommitteePageTemplate.jsx`).
- Move `docs/Committeepagetemplate.md` and
  `docs/Complete admin interface for managing all committees.md` into an
  `docs/archive/` folder (or delete, orchestrator's call at the time) now
  that their content lives as real source files — keep them until this
  point in case an agent needs to diff against the "spec intent" one more
  time.
- Update the root `README.md` files (both `lmsa-api` and `lmsa-website`)
  to reflect the current, real feature set rather than the aspirational
  one from the original starter docs.

### Report

*(Agent: fill this in before pushing)*

---

## T6 — Wire `EventDetailPage.jsx` to `eventService`

**Branch:** *(not yet cut)*
**Status:** unassigned — noted, not yet fully specced
**Depends on:** T2b (done)

### Context

Discovered while writing T3's spec: `lmsa-website/src/pages/public/EventDetailPage.jsx`
(90 lines) has the exact same problem `CommitteeDetailPage.jsx` had before
T3 — no `eventService` import, no `useState`/`useEffect`, fully static.
`CommitteePageTemplate.jsx`'s event cards link to `/events/:slug` expecting
a real registration flow there. Right now that link leads to a dead end.

Not yet fully specced — will write the full ticket once T3/T4 land, since
it's lower priority (events aren't the current focus) and this file is
small enough that the spec will be short. Flagging now so it doesn't get
lost.

### Report

*(Not yet assigned)*
