-- =====================================================
-- FIX: `mandate` COLUMN TYPE MISMATCH (crash in production)
-- Depends on: 001_base_schema.sql (committees.mandate as TEXT)
--
-- Root cause of the "l.mandate.map is not a function" crash reported
-- right after 006 was run (both in the admin Committee Management
-- Details tab and, unguarded, on the public committee detail page
-- too — same bug, two surfaces):
--
-- `001_base_schema.sql` declared `mandate TEXT` (a single scalar
-- string). But every place that actually reads or writes it —
-- CommitteeAdminDashboard.jsx's DetailsTab (the mandate bullet-point
-- editor), and CommitteePageTemplate.jsx's public display — has
-- always treated it as an array of strings, one per mandate item,
-- exactly like its sibling column `key_activities`, which IS
-- correctly `TEXT[]` (added in 002). The schema for `mandate` was
-- simply never updated to match; 006 didn't create this bug, it just
-- seeded the first real committee rows anyone could actually open the
-- Details tab and save against, which is what exposed it.
--
-- What happens without this fix: the admin edit form sends a JS array
-- for `mandate` on save (`committee.service.js` -> `PUT /:id` ->
-- `committee.controller.js`'s `update`, which passes `mandate`
-- through unchanged). Supabase serializes that array as JSON and
-- Postgres accepts it into the TEXT column as its literal JSON-string
-- form, e.g. '["Plan events","Review budgets"]' -- silently "working"
-- at save time, but from then on `mandate` is a truthy *string*, not
-- an array, and the very next `.map()` over it throws exactly the
-- error reported.
--
-- This migration corrects the column type to TEXT[] (matching
-- key_activities) and repairs any row already corrupted by the bug
-- above, rather than just fixing new saves going forward:
--   - NULL / blank stays NULL (matches key_activities' own default —
--     an honest "not set" rather than an invented empty array)
--   - a value that looks like the JSON-array string the bug above
--     produces (starts with '[', ends with ']') gets unpacked back
--     into a real array, undoing the corruption rather than losing
--     whatever was typed in
--   - anything else (a genuine plain string, however that could have
--     happened) is wrapped as a single-item array rather than
--     discarded, so no data is silently dropped either way
--
-- Done as add-column / populate / drop / rename rather than a single
-- ALTER COLUMN ... TYPE ... USING (...): Postgres doesn't allow a
-- set-returning subquery (jsonb_array_elements_text(...), needed to
-- actually unpack a corrupted row) inside a column-type USING
-- transform expression — "ERROR: 0A000: cannot use subquery in
-- transform expression" — even though the identical logic is fine in
-- a plain UPDATE ... SET. This is a one-time structural migration, not
-- designed to be safely re-run after it has already fully succeeded
-- once (by then `mandate` is real TEXT[], and step 2's string
-- functions like btrim()/left() would error against an array type) —
-- same as 001-005, only 006 was made idempotent since seed data is
-- more likely to be re-run by accident.
-- =====================================================

-- 1. New column to populate before touching the original.
ALTER TABLE committees ADD COLUMN IF NOT EXISTS mandate_new TEXT[];

-- 2. Populate it from the existing (scalar TEXT) `mandate`, per the
--    same three cases as before.
UPDATE committees
SET mandate_new = CASE
  WHEN mandate IS NULL OR btrim(mandate) = '' THEN NULL
  WHEN left(btrim(mandate), 1) = '[' AND right(btrim(mandate), 1) = ']' THEN
    (SELECT array_agg(value) FROM jsonb_array_elements_text(mandate::jsonb) AS value)
  ELSE ARRAY[mandate]
END;

-- 3. Drop the old scalar column.
ALTER TABLE committees DROP COLUMN IF EXISTS mandate;

-- 4. Rename the new one into its place.
ALTER TABLE committees RENAME COLUMN mandate_new TO mandate;
