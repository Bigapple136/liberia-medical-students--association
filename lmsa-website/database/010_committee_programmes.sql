-- =====================================================
-- COMMITTEE PROGRAMMES
-- Depends on: 001_base_schema.sql (committees, events, users,
--             update_updated_at_column())
--
-- A committee page used to describe its programme as authored prose —
-- a mandate, a list of key activities, a term plan — which meant the
-- page could only ever be as current as the last person who edited a
-- string of text, and it had no dates, venues or sessions in it. This
-- table is the small frame an admin actually maintains: a name, one
-- sentence, who it is for, an image, and an order. Its sessions are
-- ordinary rows in `events` carrying `programme_id`, so the dates,
-- venues, fees, capacity and registration the page shows are the same
-- records the events calendar shows, and the two cannot disagree.
--
-- There is deliberately no state column. Running / upcoming /
-- finished / announced are read off the sessions' datetimes by the
-- API every time (see lmsa-api/src/utils/programmes.js). A typed
-- status would go stale the first time a session moved and the page
-- would claim a programme was still running weeks after it ended.
--
-- `status` here means only draft or published: a draft programme and
-- its sessions are invisible to the public, which is how a committee
-- stages next term's programme without publishing it.
--
-- Deleting a programme does NOT delete its sessions — the FK is
-- ON DELETE SET NULL, so those events stay on the calendar as
-- one-off events rather than disappearing with the frame.
--
-- Forward-only and safe to re-run: the table, column, constraints,
-- indexes, trigger and policies are each guarded.
-- =====================================================

-- ─── The programme frame ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS committee_programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,

  name TEXT NOT NULL,                       -- "First Aid Training"
  slug TEXT NOT NULL,                       -- stable per committee, generated from the name
  summary TEXT,                             -- one sentence, shown on the public page
  audience TEXT,                            -- "Open to students and the wider community"
  image_url TEXT,

  sort_order INTEGER NOT NULL DEFAULT 0,    -- admin order; ties broken by name
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (committee_id, slug)
);

-- One name per committee, compared case-insensitively: two programmes
-- called "First Aid Training" and "first aid training" are one
-- programme to a visitor reading the page, whatever the ids say. The
-- controller turns the violation into a 409 with a readable message.
CREATE UNIQUE INDEX IF NOT EXISTS uq_committee_programmes_name
  ON committee_programmes (committee_id, lower(name));

-- The only read the public page makes: this committee's programmes, in
-- its own order.
CREATE INDEX IF NOT EXISTS idx_committee_programmes_order
  ON committee_programmes (committee_id, sort_order);

-- ─── Sessions ───────────────────────────────────────────────────────────────
-- Nullable, and null is meaningful: most events are one-offs and belong
-- to no programme. A mismatch between the event's committee and the
-- programme's committee is rejected by the API, not by a constraint —
-- it needs a readable 400 rather than a raw FK error.
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS programme_id UUID
    REFERENCES committee_programmes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_events_programme_id
  ON events (programme_id);

-- ─── updated_at trigger (function is created in 001) ────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_committee_programmes_updated_at'
  ) THEN
    CREATE TRIGGER update_committee_programmes_updated_at
      BEFORE UPDATE ON committee_programmes
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ─── Row level security ─────────────────────────────────────────────────────
-- The API talks to Supabase with the service-role key and therefore
-- bypasses RLS; these policies are for any direct client access and
-- follow the convention used in 002/004.
ALTER TABLE committee_programmes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Published programmes are public; drafts are not.
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'committee_programmes'
      AND policyname = 'committee_programmes_public_read'
  ) THEN
    CREATE POLICY committee_programmes_public_read ON committee_programmes
      FOR SELECT USING (status = 'published');
  END IF;

  -- Admins and executives manage every programme, drafts included.
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'committee_programmes'
      AND policyname = 'committee_programmes_admin_write'
  ) THEN
    CREATE POLICY committee_programmes_admin_write ON committee_programmes
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
            AND role IN ('admin', 'executive', 'super_admin')
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
            AND role IN ('admin', 'executive', 'super_admin')
        )
      );
  END IF;
END $$;
