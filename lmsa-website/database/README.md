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

## Status as of 2026-08-17

- ✅ **001 and 002 both applied successfully** against the production
  Supabase project. All base tables plus committee_announcements,
  committee_achievements, committee_subscribers, and the committee_id FK
  columns on events/documents are live.

## How to run

1. Supabase dashboard → your project → **SQL Editor**
2. Open `001_base_schema.sql`, copy the full contents, paste into a new
   query, run it. Confirm no errors — you should see ~17 new tables appear
   under **Table Editor**.
3. Open `002_committee_additions.sql`, same process.
4. Update the status line above once confirmed.
