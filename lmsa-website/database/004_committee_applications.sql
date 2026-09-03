-- =====================================================
-- COMMITTEE APPLICATIONS
-- Depends on: 001_base_schema.sql (committees, users)
--
-- Makes "Apply now" on /get-involved/committees a real flow instead of an
-- inert button. Capacity and deadlines are stored per committee so admins
-- control the round; the frontend renders whatever the API returns and has
-- a real closed state when the window has passed.
-- =====================================================

-- ─── Application window + capacity on the committee itself ───────────────────
ALTER TABLE committees
  ADD COLUMN IF NOT EXISTS openings INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS application_deadline DATE,
  ADD COLUMN IF NOT EXISTS accepting_applications BOOLEAN NOT NULL DEFAULT false;

-- ─── Applications ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS committee_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Snapshot of what the applicant submitted. Stored on the application
  -- rather than read from the profile at review time so the record still
  -- says what the committee actually reviewed.
  year_level TEXT,
  phone TEXT,
  statement TEXT NOT NULL,
  interests TEXT,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,

  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_committee_applications_committee
  ON committee_applications(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_applications_user
  ON committee_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_committee_applications_status
  ON committee_applications(status);

-- One live application per person per committee. Partial, so a rejected or
-- withdrawn applicant can apply again without deleting their history.
CREATE UNIQUE INDEX IF NOT EXISTS uq_committee_applications_active
  ON committee_applications(committee_id, user_id)
  WHERE status IN ('pending', 'approved');

-- updated_at trigger (function is created in 001)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_committee_applications_updated_at'
  ) THEN
    CREATE TRIGGER update_committee_applications_updated_at
      BEFORE UPDATE ON committee_applications
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ─── Row level security ─────────────────────────────────────────────────────
-- The API talks to Supabase with the service-role key, so it bypasses RLS;
-- these policies protect any direct client access and match the convention
-- used for users/news/documents in 001.
ALTER TABLE committee_applications ENABLE ROW LEVEL SECURITY;

-- Applicants submit for themselves
CREATE POLICY committee_applications_insert_own ON committee_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Applicants read their own applications
CREATE POLICY committee_applications_read_own ON committee_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Admins and executives read every application. Executives are included
-- because CommitteeAdminDashboard is reachable by both roles.
CREATE POLICY committee_applications_read_admin ON committee_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
        AND role IN ('admin', 'executive', 'super_admin')
    )
  );

-- Admins and executives review (approve / reject)
CREATE POLICY committee_applications_update_admin ON committee_applications
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
