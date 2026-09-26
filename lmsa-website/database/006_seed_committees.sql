-- =====================================================
-- SEED: STANDING COMMITTEES
-- Depends on: 001_base_schema.sql (committees table),
--             004_committee_applications.sql (openings,
--             application_deadline, accepting_applications
--             columns and their defaults)
--
-- 001-005 built the entire committees schema correctly (columns, RLS,
-- recruitment fields) but none of them ever inserted a single row. The
-- table has been empty since it was created, which is why the public
-- Committees page, the admin Committee Management picker, and every
-- feature downstream of a committee existing (member assignment,
-- announcements, applications, recruitment settings) had nothing to
-- show or operate on.
--
-- Names, slugs, and descriptions here are the same 12 committees
-- already hardcoded as icon/fallback data in
-- lmsa-website/src/config/committees.js (`committeeVisuals`) — that
-- file's own comment already anticipated this exact situation
-- ("Shown only when the API is unreachable... database not migrated
-- yet"). Using the same slugs is not optional: they're what the
-- frontend's icon mapping keys off, so a mismatched slug here would
-- silently fall back to the generic icon instead of erroring.
--
-- Deliberately left `openings`, `accepting_applications`, and
-- `application_deadline` unset (they fall back to each column's own
-- default: 0 / false / null) and `chair_id`/`vice_chair_id` unset —
-- same reasoning as the README's existing note on 004/005: an honest
-- "not recruiting yet" beats an invented default. Turn recruitment on
-- per committee, and assign chairs, through the already-built Admin →
-- Committee Management flow once real leadership/timing is decided.
-- =====================================================

INSERT INTO committees (name, slug, description, committee_type, status)
VALUES
  ('Medical Education Committee', 'medical-education', 'Academic standards and curriculum support', 'standing', 'active'),
  ('Community Health Committee', 'community-health', 'Public health outreach and education', 'standing', 'active'),
  ('Research & Innovation Committee', 'research-innovation', 'Scientific research promotion', 'standing', 'active'),
  ('Student Welfare Committee', 'student-welfare', 'Student support services', 'standing', 'active'),
  ('Professional Development Committee', 'professional-development', 'Career and skills training', 'standing', 'active'),
  ('Public Relations Committee', 'public-relations', 'Communications and media', 'standing', 'active'),
  ('International Relations Committee', 'international-relations', 'Global partnerships', 'standing', 'active'),
  ('Finance & Budget Committee', 'finance-budget', 'Financial management', 'standing', 'active'),
  ('Ethics & Discipline Committee', 'ethics-discipline', 'Code of conduct enforcement', 'standing', 'active'),
  ('Legislative Affairs Committee', 'legislative-affairs', 'Policy and advocacy', 'standing', 'active'),
  ('Sports & Recreation Committee', 'sports-recreation', 'Athletic activities', 'standing', 'active'),
  ('Cultural Affairs Committee', 'cultural-affairs', 'Arts and cultural programmes', 'standing', 'active')
ON CONFLICT (slug) DO NOTHING;
