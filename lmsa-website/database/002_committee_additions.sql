-- ============================================
-- LMSA Committee Management System - Database Migrations
-- Run this in Supabase SQL editor to add the new tables required by this feature
-- ============================================

-- Add committee_id to events table (if not exists)
ALTER TABLE events ADD COLUMN IF NOT EXISTS committee_id UUID REFERENCES committees(id);

-- Add committee_id to documents table (if not exists)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS committee_id UUID REFERENCES committees(id);

-- Add extra fields to committees table
ALTER TABLE committees ADD COLUMN IF NOT EXISTS key_activities TEXT[];
ALTER TABLE committees ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE committees ADD COLUMN IF NOT EXISTS meeting_schedule TEXT;
ALTER TABLE committees ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Committee announcements table
CREATE TABLE IF NOT EXISTS committee_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','urgent')),
  pinned BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committee achievements table
CREATE TABLE IF NOT EXISTS committee_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  badge_emoji TEXT DEFAULT '🏆',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committee newsletter subscribers table
CREATE TABLE IF NOT EXISTS committee_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(committee_id, email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_committee_announcements_committee_id ON committee_announcements(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_achievements_committee_id ON committee_achievements(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_subscribers_committee_id ON committee_subscribers(committee_id);
CREATE INDEX IF NOT EXISTS idx_events_committee_id ON events(committee_id);
CREATE INDEX IF NOT EXISTS idx_documents_committee_id ON documents(committee_id);

-- Enable Row Level Security
ALTER TABLE committee_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can read announcements
CREATE POLICY "Public read announcements" 
  ON committee_announcements FOR SELECT USING (true);

-- Anyone can read achievements
CREATE POLICY "Public read achievements" 
  ON committee_achievements FOR SELECT USING (true);

-- Only admins can write/delete announcements
CREATE POLICY "Admin write announcements" 
  ON committee_announcements FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin','executive','super_admin')
    )
  );

-- Only admins can write/delete achievements
CREATE POLICY "Admin write achievements" 
  ON committee_achievements FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin','executive','super_admin')
    )
  );

-- Anyone can subscribe to newsletters
CREATE POLICY "Public subscribe newsletters" 
  ON committee_subscribers FOR INSERT WITH CHECK (true);

-- Only admins can manage subscribers
CREATE POLICY "Admin manage subscribers" 
  ON committee_subscribers FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin','executive','super_admin')
    )
  );
