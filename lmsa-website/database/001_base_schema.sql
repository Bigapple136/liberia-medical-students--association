-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  year_level INTEGER CHECK (year_level BETWEEN 1 AND 6),
  student_id TEXT UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'executive', 'super_admin')),
  membership_type TEXT DEFAULT 'full' CHECK (membership_type IN ('full', 'associate', 'honorary', 'veteran')),
  membership_status TEXT DEFAULT 'pending' CHECK (membership_status IN ('active', 'pending', 'inactive', 'suspended')),
  profile_photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User metadata
CREATE TABLE user_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address TEXT,
  city TEXT,
  county TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MEMBERSHIP
-- =====================================================

-- Membership applications
CREATE TABLE membership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  membership_type TEXT NOT NULL,
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Membership payments/dues
CREATE TABLE membership_dues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  semester TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'mobile_money', 'bank_transfer', 'card')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'waived')),
  transaction_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting attendance
CREATE TABLE meeting_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meeting_type TEXT CHECK (meeting_type IN ('general_assembly', 'executive_council', 'executive_committee')),
  meeting_date DATE NOT NULL,
  attended BOOLEAN DEFAULT FALSE,
  excuse_provided BOOLEAN DEFAULT FALSE,
  excuse_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ID CARDS (Integration with existing portal)
-- =====================================================

CREATE TABLE id_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  card_number TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  qr_code_url TEXT,
  year_level INTEGER NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'replaced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONTENT MANAGEMENT
-- =====================================================

-- News/Blog posts
CREATE TABLE news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT CHECK (category IN ('news', 'announcement', 'achievement', 'opportunity', 'health', 'academic', 'event')),
  author_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News tags
CREATE TABLE news_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- News-tag relationships
CREATE TABLE news_post_tags (
  news_post_id UUID REFERENCES news_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES news_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (news_post_id, tag_id)
);

-- =====================================================
-- EVENTS
-- =====================================================

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT CHECK (event_type IN ('academic', 'social', 'community', 'sports', 'general_assembly', 'symposium')),
  location TEXT,
  venue TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  registration_required BOOLEAN DEFAULT FALSE,
  max_attendees INTEGER,
  registration_deadline TIMESTAMPTZ,
  fee DECIMAL(10, 2) DEFAULT 0,
  image_url TEXT,
  organizer_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event registrations
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  registration_status TEXT DEFAULT 'registered' CHECK (registration_status IN ('registered', 'attended', 'absent', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'waived')),
  payment_reference TEXT,
  attended BOOLEAN DEFAULT FALSE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- =====================================================
-- COMMITTEES
-- =====================================================

-- Standing committees
CREATE TABLE committees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  mandate TEXT,
  committee_type TEXT CHECK (committee_type IN ('standing', 'ad_hoc', 'special')),
  chair_id UUID REFERENCES users(id),
  vice_chair_id UUID REFERENCES users(id),
  icon TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committee members
CREATE TABLE committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  position TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE(committee_id, user_id)
);

-- =====================================================
-- EXECUTIVE POSITIONS
-- =====================================================

-- Executive committee positions
CREATE TABLE executive_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_name TEXT NOT NULL,
  position_rank INTEGER,
  user_id UUID REFERENCES users(id),
  academic_year TEXT NOT NULL,
  elected_at DATE,
  term_start DATE,
  term_end DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'impeached')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESOURCES & DOCUMENTS
-- =====================================================

-- Document library
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT CHECK (category IN ('constitution', 'bylaws', 'report', 'journal', 'newsletter', 'study_material', 'other')),
  uploaded_by UUID REFERENCES users(id),
  access_level TEXT DEFAULT 'members' CHECK (access_level IN ('public', 'members', 'executive', 'admin')),
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT CHECK (notification_type IN ('info', 'success', 'warning', 'error', 'reminder')),
  related_entity_type TEXT,
  related_entity_id UUID,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & ACTIVITY
-- =====================================================

-- Activity log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_membership_status ON users(membership_status);
CREATE INDEX idx_users_year_level ON users(year_level);

-- News
CREATE INDEX idx_news_posts_status ON news_posts(status);
CREATE INDEX idx_news_posts_category ON news_posts(category);
CREATE INDEX idx_news_posts_published_at ON news_posts(published_at DESC);
CREATE INDEX idx_news_posts_slug ON news_posts(slug);

-- Events
CREATE INDEX idx_events_start_datetime ON events(start_datetime);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_slug ON events(slug);

-- Event registrations
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);

-- Activity log
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users: Read own data, admins can read all
CREATE POLICY users_read_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_read_all_for_admins ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- News: Published posts are public
CREATE POLICY news_posts_public_read ON news_posts
  FOR SELECT USING (status = 'published');

-- Events: Upcoming/ongoing events are public
CREATE POLICY events_public_read ON events
  FOR SELECT USING (status IN ('upcoming', 'ongoing'));

-- Documents: Access based on access_level
CREATE POLICY documents_public_read ON documents
  FOR SELECT USING (access_level = 'public');

CREATE POLICY documents_members_read ON documents
  FOR SELECT USING (
    access_level = 'members' AND auth.uid() IS NOT NULL
  );

-- Event registrations: Users can read own registrations
CREATE POLICY event_registrations_read_own ON event_registrations
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_posts_updated_at BEFORE UPDATE ON news_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_id_cards_updated_at BEFORE UPDATE ON id_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug = lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_news_slug BEFORE INSERT ON news_posts
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();

CREATE TRIGGER generate_event_slug BEFORE INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();
