# Committee programmes — implementation plan

Status: proposed, not started.
Scope: an admin-fed programme page for committees, shipped on Health first.

## 0. The four decisions

**1. Model: programmes as series over `events` (option C).**
A programme is a small frame record — name, one-line summary, audience, image, order — and
its sessions are ordinary rows in `events` carrying `committee_id` and a new
`programme_id`. Dates, venues, fees, capacity and registration all come from the sessions
that already exist, so the page gets real, checkable detail instead of prose, and the
programme can never disagree with the events list.

**2. State is derived, never typed.**
No `status: 'ongoing'` anywhere. A programme's state is computed at render from its
sessions' datetimes:

| condition | state | shown as |
|---|---|---|
| now is between the earliest start and the latest end of its sessions | running | "Running now" |
| next session start > now | upcoming | "Next: <date>" |
| all sessions ended | finished | "Finished" (kept for the current term) |
| no sessions, or all cancelled | announced | "Dates to be announced" |

`events.status` is not read for this: it is a manual label that goes stale. Only
`cancelled` is respected. A programme that ended last month reads as finished with nobody
touching the dashboard.

**3. The fault-report band stays, as one band.**
It is the committee's standing duty and the thing a student may need today, so it is not
dropped — but it stops being a co-equal section: one band after the programme, with the
existing copy and the form link, no three-step loop on this page. It becomes a shared
component every committee page can carry.

**4. Build it general, ship it on Health first.**
The model is committee-agnostic: Academic's symposia, Social's events, Research's
publications are all programmes. The template renders a programme section wherever a
committee has programmes and keeps its current shape otherwise, so nothing regresses.
`layout: 'service'` (the Health special case) has since been retired: Health is
`layout: 'tabs'`, the layout flag names the only departure from the stacked page, and
`planLayout` is gone with it — a committee either publishes programmes under the tabbed
layout or reads its plan from the registry.

## 1. Data model

New table — the frame only, deliberately thin:

```
committee_programmes
  id                uuid pk
  committee_id      uuid not null → committees(id) on delete cascade
  name              text not null                      -- "First Aid Training"
  slug              text not null                      -- unique per committee
  summary           text                               -- one sentence, ~140 chars
  audience          text                               -- "Open to students and the wider community"
  image_url         text
  sort_order        integer not null default 0
  status            text not null default 'draft'      -- 'draft' | 'published'
  created_at, updated_at
  unique (committee_id, slug)
  index  (committee_id, sort_order)
```

Change to `events`: `programme_id uuid null → committee_programmes(id) on delete set null`,
indexed. Deleting a programme orphans its sessions rather than destroying them; the admin
confirm says so.

Integrity rule enforced in the controller, not in SQL: an event's `programme_id` must
belong to the same `committee_id`, else 400. A programme must match its event's committee
or neither moves.

Migration: `lmsa-website/database/010_committee_programmes.sql` (last is 009). Forward-only,
idempotent (`if not exists`). No backfill — no programme rows exist yet, and inventing them
is exactly what this plan removes.

## 2. API

Public reads:

- `GET /api/committees/:slug/programmes` → published programmes with:
  `sessions` = next ≤3 upcoming (id, title, slug, start_datetime, end_datetime, venue,
  location, registration_required, registration_deadline, fee, image_url),
  `past_session_count`, and a server-computed `state`. Computed server-side so the page
  and any future client agree.
- `GET /api/events` gains `?committee=<slug|id>` and `?programme=<id>`. Today it filters
  only by `type`, `status`, `upcoming`.
- `GET /api/committees/:id/events` currently sits behind `authenticate`, so anonymous
  visitors cannot read a committee's events at all. The public page should use the filtered
  events endpoint instead; leaving the authenticated one for the member portal.

Admin writes (all `isAdmin`):

- `GET / POST / PUT / DELETE /api/committees/:id/programmes`, plus
  `PUT /api/committees/:id/programmes/reorder` taking an ordered id array.
- `POST/PUT /api/events` accept `programme_id`; `committee.controller.update` is unchanged.

Failure cases that need real messages: duplicate name within a committee (409),
programme/committee mismatch (400), event assigned to a draft programme (allowed in
admin, excluded from public reads).

## 3. The page (Health first)

Skeleton, top to bottom:

1. **Hero** — committee name, one line naming the audience, one action. "See the
   programme" when there is a programme; otherwise "Report an issue".
2. **The programme** — one entry per programme:
   - name at 21–24px, the entry's heading;
   - summary at 17px, one sentence, capped measure;
   - audience line only when the programme's audience differs from the page's;
   - next session as a fact, not a promise: "Tue 3 Mar · 10:00 · A.M. Dogliotti";
   - one action: the next session's page, or "Register" where registration is required
     and open; "Dates to be announced" when the frame has no sessions;
   - past sessions as a count ("3 sessions this term"), not a second list.
   - state as words, plus the single accent dot that already means state on this site —
     never colour alone.
3. **Report band** — one band, existing copy, link to the form.
4. **Contact + closing** — unchanged.
5. **Calendar section removed where programmes exist.** The programme *is* the calendar;
   keeping both is the duplication the Health critique already flagged. News stays.

Ordering: running, then upcoming by next session, then announced, then finished. Admin
`sort_order` breaks ties so a committee can lead with its flagship.

Fallback fixtures: `committeesData.js` gains a typed `programmes` array per committee
(same shape the endpoint returns, including sessions), so the page can be designed and
reviewed while the API is unreachable from localhost. Fixtures are typed data, not prose —
and must not present invented dates as scheduled sessions; programme frames only, with
empty sessions, until the committee publishes real ones.

Empty state design (decided here, not discovered later): no programmes published →
no programme section at all, hero keeps its "Report an issue" action, report band moves up.
No "no programmes yet" placeholder in the middle of a public page.

## 4. Admin

- Committee detail gains a **Programmes** section above Applications: list with order
  controls, state chip (derived, read-only), session count, Edit, Publish/Unpublish,
  Delete (with the orphan warning).
- Each programme row has **Add session**, opening the existing event form prefilled with
  `committee_id` and `programme_id`.
- The event form gains a **Programme** select filtered to the event's committee, with
  "None" allowed for one-off events.
- Drafts are invisible publicly, so a committee can stage next term's programme.

## 5. Phasing

- **P1 — page on fixtures** (frontend only, reviewable now): programme section, derived
  state function, report band demotion, calendar dedupe, empty state. No backend needed.
- **P2 — model + public API**: migration 010, programmes endpoint, events filters.
- **P3 — admin**: programme CRUD and the event form's programme select.
- **P4 — switch over**: point the page at the endpoint, retire `layout: 'service'` (done),
  delete Health's hidden mandate/activities blocks and the drafted `term_plan`, keep
  Academic's plan until it moves to programmes.

P1 is deliberately first so the design can be settled without waiting on DB access, and so
the page never renders an empty section while the backend catches up.

## 6. Risks and limits

- The database is remote (Supabase); migrations cannot be rehearsed locally. P2 needs DB
  access and a deploy of the API before P4 can be verified end to end.
- CORS currently allows only the workers.dev origin, so localhost cannot read the API;
  P1 must work on fixtures and P4 must be verified against the deployed API.
- If no admin ever publishes a programme, Health is a hero and a report band. That is the
  accepted cost of dropping authored copy, and why the empty state is designed in P1.
- Timezone: store UTC, render Africa/Monrovia. It is UTC+0 today, but the code should say
  so rather than rely on it.
- Two systems of truth if Academic keeps `term_plan` while Health uses programmes. Accept
  for one release; the template supports both.

## 7. Verification

- Migration applied to a branch DB; new endpoint returns published-only, with derived
  state for all four cases (running, upcoming, announced, finished) built from seeded test
  sessions.
- `GET /api/events?committee=` returns the same sessions the programme shows.
- Frontend: `npm run build`, `npx eslint src --ext .jsx,.js`.
- Browser at 1440 and 390: all four states rendered from fixtures, keyboard order through
  the programme, no horizontal overflow, state conveyed as text.
- Empty state: zero published programmes → no section, hero action correct.
- Non-programme committees (Academic, Social) unchanged.
