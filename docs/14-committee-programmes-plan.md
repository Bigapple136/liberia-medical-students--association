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

*Superseded after P4.* Built rather than argued, the band failed its own test: with the
programme tab carrying the ledger, the join tab carrying a second report call, and the
closing note carrying the promise a third time, the page pitched one duty three times and
read as the portal’s fault desk. The band and the join-tab call are gone. Reporting is
said once, in the closing note (“the record stays open until the fault is closed”), and
the public form at the foot files it with the Health subject already set. A member still
has the portal’s own route to the committee.

*Amended again.* The closing note went the same way as the band it had outlived: a
paragraph promising reporting, above the fields that take it, on the one page that also
carries the programme. Health sets `closing: 'hidden'`, so the landing page ends on the
form itself, and its opening line names the three things that arrive there. The form is
not repeated elsewhere: the team and about pages carry no contact section, and the
committee’s address stays in the header of all three for a reader who only wants to
write. A roster that has not been published is stated on the team page, where it belongs,
rather than beside a form that is no longer there.

**4. Build it general, ship it on Health first.**
The model is committee-agnostic: Academic's symposia, Social's events, Research's
publications are all programmes. The template renders a programme section wherever a
committee has programmes and keeps its current shape otherwise, so nothing regresses.
`layout: 'service'` (the Health special case) has since been retired: Health is
`layout: 'pages'`, the layout flag names the only departure from the stacked page, and
`planLayout` is gone with it — a committee either publishes programmes under the paged
layout or reads its plan from the registry.

*Amended after P4.* The paged layout first shipped as three tabs on one URL (`?view=`),
and tabs were the wrong shape for it: the programme, the roster and the register are
three different pages for three different readers, and a tab is a folded section, not a
page. Health is now three addresses under the committee's own:

| Address | Holds |
| --- | --- |
| `/leadership/committees/health` | the next dates, updates, the programme ledger, the reporting filed under Health, and the contact form |
| `/leadership/committees/health/team` | the roster and how to join |
| `/leadership/committees/health/about` | the constitution's register, the committee's records |

The rail under the header is the way between them and marks the open page with
`aria-current`. A subpage a committee does not have — any second segment on a stacked
committee, or an unknown one on a paged committee — is redirected to the committee's
landing page. The old `?view=` addresses are ignored rather than honoured: what they
named lives on the landing page (the programme and the dates) or is one rail link
away (the roster).

*Added after the three-page split.* The landing page carries a strip of facts under the
rail — “At a glance” — and it is deliberately not a preview of what sits below it. The
dates and the programme are one screen down, so the cards say the things the landing
page does not: how many people serve and who chairs them, how many duties the register
sets, how many documents are published, how many pieces of health reporting exist, and
the committee’s address. Each count is one the API returned; a committee that has
published nothing gets a shorter strip rather than a strip of zeros, and fewer than two
cards is no strip at all. It scrolls sideways with the arrows and by swipe rather than
advancing on a timer, because a page that moves under a reader is the thing WCAG 2.2.2
is for.

*The reporting band, for when posts exist.* Health has no committee-scoped news
endpoint, so the page carries association posts filed under the shared `health` category
(`alsoInNews`). Where a committee's page also prints a calendar of dates, the reporting
sits beside it in a column; Health prints no calendar — the programme carries the dates —
so the band is the reporting on its own: named “Health notes”, three posts across, each a
date, a title and the opening of the piece, and one route to `/news`. It renders only
when posts are published, so until the news API returns any health pieces the landing
page goes from the programme straight to the form. The form band keeps the page's usual
80/112 top padding for exactly that reason: what sits above it can disappear, and the
form should not end up against the ledger when it does.

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
