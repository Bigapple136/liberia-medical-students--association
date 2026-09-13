# Database Migrations

Run these in the Supabase SQL Editor **in numeric order**, once each,
against your project. Supabase does not track migration history
automatically for hand-run SQL Editor scripts — there's no `schema_migrations`
table here — so run each file exactly once and keep this list updated as
new numbered files are added.

| # | File | What it does |
|---|------|---------------|
| 001 | `001_base_schema.sql` | Creates all core tables (`users`, `events`, `committees`, `committee_members`, `documents`, `news_posts`, `event_registrations`, etc.), indexes, RLS policies, and triggers. Must run first — everything else depends on these tables existing. |
| 002 | `002_committee_additions.sql` | Adds `committee_id` FK columns to `events` and `documents`, extra columns on `committees` (`key_activities`, `email`, `meeting_schedule`, `views`), and creates `committee_announcements`, `committee_achievements`, `committee_subscribers` tables. Depends on 001 being applied first. |
| 003 | `003_newsletter.sql` | Creates the site-wide `newsletter_subscribers` table (separate from the per-committee `committee_subscribers`), its email index, RLS, and a public insert policy so the unauthenticated footer signup can write. Depends on 001 being applied first (RLS enabled; no FK dependencies). |
| 004 | `004_committee_applications.sql` | Makes "Apply now" a real flow. Adds `openings`, `application_deadline` and `accepting_applications` to `committees`, creates `committee_applications` (statement, year level, phone, status, review fields) with a partial unique index allowing one live application per person per committee, plus RLS. Depends on 001 (`committees`, `users`, and the `update_updated_at_column()` trigger function). |
| 005 | `005_leadership_nominations.sql` | Makes "how to stand for office" a real flow. Creates `election_cycles` (academic year, nomination open/close dates, election date, `accepting_nominations` switch) and `leadership_nominations` (level, position, statement, status, review fields) with a partial unique index allowing one live nomination per person per position per cycle, plus RLS. Depends on 001 (`users`, and the `update_updated_at_column()` trigger function). |

## Status as of 2026-09-03

- ✅ **004 and 005 both applied** — confirmed by Stone. `committees` now
  has real `openings`/`application_deadline`/`accepting_applications`
  columns, `committee_applications` exists, and `election_cycles`/
  `leadership_nominations` both exist with RLS.

**Two follow-up actions still needed to make these features actually
useful (not migration steps, just data — either via Supabase directly
or the app's own admin UI):**
- Every committee still defaults to `accepting_applications = false`,
  `openings = 0`, `application_deadline = null` — set these on whichever
  committees are actually recruiting, or the "Apply now" flow stays
  correctly closed everywhere.
- No `election_cycles` row exists yet — create one via **Admin →
  Executive → Nominations & election cycle** (academic year, the three
  dates, `accepting_nominations = true`), or `/leadership#stand` keeps
  showing the closed/no-dates state.

## Status as of 2026-08-17

- ✅ **001 and 002 both applied successfully** against the production
  Supabase project. All base tables plus committee_announcements,
  committee_achievements, committee_subscribers, and the committee_id FK
  columns on events/documents are live.
- ✅ **003 applied** — `newsletter_subscribers` table, its email index,
  RLS, and both public insert/update policies are live in production
  (confirmed by Stone).

## How to run (for reference — 001–005 are all applied as of 2026-09-03)

1. Supabase dashboard → your project → **SQL Editor**
2. Open `001_base_schema.sql`, copy the full contents, paste into a new
   query, run it. Confirm no errors — you should see ~17 new tables appear
   under **Table Editor**.
3. Open `002_committee_additions.sql`, same process.
4. Open `003_newsletter.sql`, copy the full contents, paste into a new
   query, run it. Confirm no errors — you should see a `newsletter_subscribers`
   table appear under **Table Editor**.
5. Open `004_committee_applications.sql`, same process. Confirm no errors —
   three new columns on `committees`, a `committee_applications` table, and
   four policies on it.
6. Open `005_leadership_nominations.sql`, same process. Confirm no errors —
   an `election_cycles` table, a `leadership_nominations` table, and six
   policies across the two.
7. Update the status line above once confirmed.

When 004 wasn't yet applied, `/get-involved/committees` and
`/leadership/committees` fell back to a static committee list with **no**
recruitment window (nothing claimed to be recruiting and no deadline was
shown) — deliberate: the defect this replaced was a hardcoded "May 31, 2026"
deadline that silently went stale, so the honest fallback was "not open
yet," not an invented date. Now that 004 is applied, this only matters
per-committee until `accepting_applications`/`openings`/
`application_deadline` are actually set (see the status note above).

Same reasoning applied to 005 before it was run: `/leadership#stand`
listed the three leadership levels but showed no dates and no nomination
button, rather than describing elections as "held annually" with no real
year or window. Now that 005 is applied, this only matters until an
`election_cycles` row actually exists.
