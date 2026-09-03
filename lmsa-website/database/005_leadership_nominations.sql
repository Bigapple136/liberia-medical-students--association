-- =====================================================
-- LEADERSHIP NOMINATIONS
-- Depends on: 001_base_schema.sql (users, and the
--             update_updated_at_column() trigger function)
--
-- "Elections are held annually" was the entire process description on
-- /get-involved/leadership. This makes the cycle real data: admins set the
-- nomination window and election date, members nominate themselves for a
-- position, and admins review. Same shape as committee applications (004).
-- =====================================================

-- ─── One row per election cycle ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS election_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year TEXT UNIQUE NOT NULL,          -- e.g. '2026-2027'
  nomination_opens DATE,
  nomination_closes DATE,
  election_date DATE,
  -- Admin-controlled master switch, independent of the dates, so a round can
  -- be paused without editing the calendar.
  accepting_nominations BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_election_cycles_year ON election_cycles(academic_year);

-- ─── Nominations ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leadership_nominations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES election_cycles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Which role. `level` is 'executive' for elected officers and 'class_rep'
  -- for class representatives. Committee chairs are appointed, not nominated,
  -- and are deliberately absent from this table.
  level TEXT NOT NULL CHECK (level IN ('executive', 'class_rep')),
  position_name TEXT NOT NULL,

  -- Snapshot of what the nominee submitted, so the record reflects what the
  -- reviewing body actually read.
  year_level TEXT,
  phone TEXT,
  statement TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,

  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leadership_nominations_cycle
  ON leadership_nominations(cycle_id);
CREATE INDEX IF NOT EXISTS idx_leadership_nominations_user
  ON leadership_nominations(user_id);
CREATE INDEX IF NOT EXISTS idx_leadership_nominations_status
  ON leadership_nominations(status);

-- One live nomination per person per position per cycle. Partial, so a
-- rejected or withdrawn nominee can stand again in a later round (or the same
-- one, if it is reopened) without deleting their history.
CREATE UNIQUE INDEX IF NOT EXISTS uq_leadership_nominations_active
  ON leadership_nominations(cycle_id, position_name, user_id)
  WHERE status IN ('pending', 'approved');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_election_cycles_updated_at'
  ) THEN
    CREATE TRIGGER update_election_cycles_updated_at
      BEFORE UPDATE ON election_cycles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_leadership_nominations_updated_at'
  ) THEN
    CREATE TRIGGER update_leadership_nominations_updated_at
      BEFORE UPDATE ON leadership_nominations
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ─── Row level security ─────────────────────────────────────────────────────
-- The API uses the service-role key and bypasses RLS; these protect direct
-- client access and follow the convention in 001/004.
ALTER TABLE election_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_nominations ENABLE ROW LEVEL SECURITY;

-- The calendar is public information: anyone can see when elections are.
CREATE POLICY election_cycles_public_read ON election_cycles
  FOR SELECT USING (true);

CREATE POLICY election_cycles_write_admin ON election_cycles
  FOR ALL USING (
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

-- Nominees submit and read their own nominations
CREATE POLICY leadership_nominations_insert_own ON leadership_nominations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY leadership_nominations_read_own ON leadership_nominations
  FOR SELECT USING (auth.uid() = user_id);

-- Admins and executives review every nomination
CREATE POLICY leadership_nominations_read_admin ON leadership_nominations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
        AND role IN ('admin', 'executive', 'super_admin')
    )
  );

CREATE POLICY leadership_nominations_update_admin ON leadership_nominations
  FOR UPDATE USING (
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
