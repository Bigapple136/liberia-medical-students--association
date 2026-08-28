CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (public signup)
CREATE POLICY "Public can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Anyone can unsubscribe (email-link-driven flow, no auth) — also covers the
-- upsert's update path so re-subscribing an existing email flips it back to
-- 'active' instead of hitting an RLS violation.
CREATE POLICY "Public can unsubscribe" ON newsletter_subscribers
  FOR UPDATE USING (true) WITH CHECK (true);
