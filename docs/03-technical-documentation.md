# LMSA WEBSITE - TECHNICAL DOCUMENTATION
**Complete Development & Deployment Guide**

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Project Structure](#project-structure)
6. [Development Setup](#development-setup)
7. [Environment Variables](#environment-variables)
8. [Authentication Flow](#authentication-flow)
9. [Deployment Guide](#deployment-guide)
10. [Testing Strategy](#testing-strategy)
11. [Maintenance & Monitoring](#maintenance-monitoring)

---

## 1. PROJECT OVERVIEW

### **Project Name:** LMSA Website & Member Portal

### **Description:**
Official website and member management system for the Liberia Medical Students' Association (LMSA). Includes public-facing website, member portal, ID card integration, event management, and content management.

### **Target Users:**
- Medical students at A.M. Dogliotti College of Medicine
- LMSA Executive Committee and administrators
- General public (prospective students, partners, alumni)

### **Key Features:**
- Public website with news, events, and information
- Member authentication and dashboard
- Integration with existing ID card portal
- Event registration and management
- News and content management
- Payment processing (dues, events)
- Document library and resources

---

## 2. TECH STACK

### **Frontend Repository: `lmsa-website`**

```json
{
  "name": "lmsa-website",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "tailwindcss": "^3.4.0",
    "@supabase/supabase-js": "^2.39.0",
    "axios": "^1.6.5",
    "date-fns": "^3.2.0",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "lucide-react": "^0.309.0",
    "react-hot-toast": "^2.4.1",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.11",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}
```

### **Backend Repository: `lmsa-api`**

```json
{
  "name": "lmsa-api",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.0",
    "@supabase/supabase-js": "^2.39.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.8",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.3",
    "eslint": "^8.56.0"
  }
}
```

---

## 3. DATABASE SCHEMA

### **Supabase PostgreSQL Schema**

```sql
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
```

---

## 4. API ENDPOINTS

### **Base URL:** `https://api.lmsa.org` (Production) or `http://localhost:5000` (Development)

### **Authentication Endpoints**

```
POST   /api/auth/register              Register new user
POST   /api/auth/login                 Login user
POST   /api/auth/logout                Logout user
POST   /api/auth/refresh-token         Refresh JWT token
POST   /api/auth/forgot-password       Request password reset
POST   /api/auth/reset-password        Reset password with token
GET    /api/auth/verify-email          Verify email address
GET    /api/auth/me                    Get current user profile
```

### **User Endpoints**

```
GET    /api/users                      Get all users (admin only)
GET    /api/users/:id                  Get user by ID
PUT    /api/users/:id                  Update user profile
DELETE /api/users/:id                  Delete user (admin only)
GET    /api/users/:id/activity         Get user activity log
PUT    /api/users/:id/password         Change password
POST   /api/users/:id/upload-photo     Upload profile photo
```

### **Membership Endpoints**

```
POST   /api/membership/apply           Submit membership application
GET    /api/membership/applications    Get all applications (admin)
GET    /api/membership/applications/:id  Get application by ID
PUT    /api/membership/applications/:id  Update application status
GET    /api/membership/dues            Get user's dues history
POST   /api/membership/dues/pay        Record dues payment
GET    /api/membership/status          Check membership status
```

### **News Endpoints**

```
GET    /api/news                       Get all published news posts
GET    /api/news/:slug                 Get news post by slug
POST   /api/news                       Create news post (admin)
PUT    /api/news/:id                   Update news post (admin)
DELETE /api/news/:id                   Delete news post (admin)
GET    /api/news/category/:category    Get news by category
GET    /api/news/search                Search news posts
POST   /api/news/:id/view              Increment view count
```

### **Event Endpoints**

```
GET    /api/events                     Get all events
GET    /api/events/:slug               Get event by slug
POST   /api/events                     Create event (admin)
PUT    /api/events/:id                 Update event (admin)
DELETE /api/events/:id                 Delete event (admin)
POST   /api/events/:id/register        Register for event
DELETE /api/events/:id/unregister      Unregister from event
GET    /api/events/:id/registrations   Get event registrations (admin)
PUT    /api/events/:id/attendance      Mark attendance (admin)
```

### **Committee Endpoints**

```
GET    /api/committees                 Get all committees
GET    /api/committees/:slug           Get committee by slug
POST   /api/committees                 Create committee (admin)
PUT    /api/committees/:id             Update committee (admin)
GET    /api/committees/:id/members     Get committee members
POST   /api/committees/:id/members     Add committee member (admin)
DELETE /api/committees/:id/members/:userId  Remove member (admin)
```

### **ID Card Endpoints**

```
GET    /api/id-cards/:userId           Get user's ID card
POST   /api/id-cards                   Generate ID card (admin)
PUT    /api/id-cards/:id               Update ID card (admin)
GET    /api/id-cards/:id/qr            Get QR code image
POST   /api/id-cards/verify            Verify ID card by QR code
```

### **Document Endpoints**

```
GET    /api/documents                  Get all documents
GET    /api/documents/:id              Get document by ID
POST   /api/documents                  Upload document (admin)
PUT    /api/documents/:id              Update document (admin)
DELETE /api/documents/:id              Delete document (admin)
GET    /api/documents/:id/download     Download document
GET    /api/documents/category/:category  Get documents by category
```

### **Notification Endpoints**

```
GET    /api/notifications              Get user notifications
PUT    /api/notifications/:id/read     Mark notification as read
PUT    /api/notifications/read-all     Mark all as read
DELETE /api/notifications/:id          Delete notification
```

### **Dashboard/Stats Endpoints**

```
GET    /api/dashboard/stats            Get dashboard statistics
GET    /api/dashboard/activity         Get recent activity
GET    /api/dashboard/upcoming-events  Get upcoming events
GET    /api/dashboard/announcements    Get important announcements
```

### **Admin Endpoints**

```
GET    /api/admin/analytics            Get site analytics
GET    /api/admin/users/export         Export users (CSV)
GET    /api/admin/reports/membership   Membership report
GET    /api/admin/reports/attendance   Attendance report
GET    /api/admin/reports/financial    Financial report
```

---

## 5. PROJECT STRUCTURE

### **Frontend: `lmsa-website`**

```
lmsa-website/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
│       ├── og-image.jpg
│       └── placeholder.jpg
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Spinner.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── MobileNav.jsx
│   │   │
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── ServicePillars.jsx
│   │   │   ├── PresidentMessage.jsx
│   │   │   ├── NewsSection.jsx
│   │   │   └── Partners.jsx
│   │   │
│   │   ├── news/
│   │   │   ├── NewsCard.jsx
│   │   │   ├── NewsGrid.jsx
│   │   │   ├── NewsFeatured.jsx
│   │   │   └── NewsFilters.jsx
│   │   │
│   │   ├── events/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventCalendar.jsx
│   │   │   ├── EventFilters.jsx
│   │   │   └── EventRegistration.jsx
│   │   │
│   │   ├── membership/
│   │   │   ├── MembershipForm.jsx
│   │   │   ├── MembershipBenefits.jsx
│   │   │   └── MembershipCategories.jsx
│   │   │
│   │   ├── portal/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── IDCardPreview.jsx
│   │   │   ├── ActivityLog.jsx
│   │   │   └── StatsCards.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminSidebar.jsx
│   │       ├── UserTable.jsx
│   │       ├── EventManager.jsx
│   │       └── ContentEditor.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── LeadershipPage.jsx
│   │   │   ├── MembershipPage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── EventDetailPage.jsx
│   │   │   ├── NewsPage.jsx
│   │   │   ├── NewsDetailPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   │
│   │   ├── portal/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── IDCardPage.jsx
│   │   │   ├── EventsPortalPage.jsx
│   │   │   ├── ResourcesPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── UsersManagement.jsx
│   │       ├── NewsManagement.jsx
│   │       ├── EventsManagement.jsx
│   │       ├── MembershipManagement.jsx
│   │       └── ReportsPage.jsx
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   ├── PortalLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useEvents.js
│   │   ├── useNews.js
│   │   ├── useNotifications.js
│   │   └── useMediaQuery.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── event.service.js
│   │   ├── news.service.js
│   │   ├── membership.service.js
│   │   └── supabase.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   └── storage.js
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── tailwind.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
│
├── .env
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

### **Backend: `lmsa-api`**

```
lmsa-api/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── supabase.js
│   │   └── email.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   └── logger.middleware.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── membership.routes.js
│   │   ├── news.routes.js
│   │   ├── event.routes.js
│   │   ├── committee.routes.js
│   │   ├── idcard.routes.js
│   │   ├── document.routes.js
│   │   ├── notification.routes.js
│   │   ├── dashboard.routes.js
│   │   └── admin.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── membership.controller.js
│   │   ├── news.controller.js
│   │   ├── event.controller.js
│   │   ├── committee.controller.js
│   │   ├── idcard.controller.js
│   │   ├── document.controller.js
│   │   ├── notification.controller.js
│   │   ├── dashboard.controller.js
│   │   └── admin.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── membership.model.js
│   │   ├── news.model.js
│   │   ├── event.model.js
│   │   ├── committee.model.js
│   │   └── document.model.js
│   │
│   ├── services/
│   │   ├── email.service.js
│   │   ├── upload.service.js
│   │   ├── notification.service.js
│   │   └── qrcode.service.js
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   ├── logger.js
│   │   └── errors.js
│   │
│   └── server.js
│
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── package.json
└── README.md
```

---

## 6. DEVELOPMENT SETUP

### **Prerequisites**

- Node.js 20+ LTS
- npm or pnpm
- Git
- Supabase account
- Code editor (VS Code recommended)

### **Step 1: Clone Repositories**

```bash
# Clone frontend
git clone https://github.com/your-org/lmsa-website.git
cd lmsa-website
npm install

# Clone backend (in separate terminal/folder)
git clone https://github.com/your-org/lmsa-api.git
cd lmsa-api
npm install
```

### **Step 2: Setup Supabase**

1. Create new Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Run the database schema from Section 3
4. Enable Email Auth in Authentication > Providers

### **Step 3: Configure Environment Variables**

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=LMSA
VITE_APP_URL=http://localhost:5173
```

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=24h

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=lmsa@example.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=LMSA <lmsa@example.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

### **Step 4: Run Development Servers**

**Frontend:**
```bash
cd lmsa-website
npm run dev
# Opens at http://localhost:5173
```

**Backend:**
```bash
cd lmsa-api
npm run dev
# Runs at http://localhost:5000
```

### **Step 5: Database Seeding (Optional)**

Create a seed script to populate initial data:

```javascript
// lmsa-api/src/scripts/seed.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seed() {
  // Create admin user
  const { data: adminUser } = await supabase.auth.admin.createUser({
    email: 'admin@lmsa.org',
    password: 'AdminPassword123!',
    email_confirm: true,
  });

  // Insert user data
  await supabase.from('users').insert({
    id: adminUser.user.id,
    email: 'admin@lmsa.org',
    full_name: 'LMSA Administrator',
    role: 'super_admin',
    membership_status: 'active',
  });

  // Create sample committees
  const committees = [
    { name: 'Academic Committee', slug: 'academic', icon: '📚' },
    { name: 'Health Committee', slug: 'health', icon: '🏥' },
    // ... add all 12 committees
  ];

  await supabase.from('committees').insert(committees);

  console.log('Seeding completed!');
}

seed();
```

Run: `node src/scripts/seed.js`

---

## 7. ENVIRONMENT VARIABLES

### **Frontend Environment Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `VITE_APP_NAME` | Application name | `LMSA` |
| `VITE_APP_URL` | Frontend URL | `http://localhost:5173` |

### **Backend Environment Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` / `production` |
| `PORT` | Server port | `5000` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJhbGc...` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `JWT_SECRET` | Secret for JWT signing | Random 64-char string |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email address | `lmsa@example.com` |
| `EMAIL_PASSWORD` | Email password/app password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | From email | `LMSA <lmsa@example.com>` |
| `FRONTEND_URL` | Frontend URL (CORS) | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |
| `ALLOWED_FILE_TYPES` | Allowed MIME types | `image/jpeg,image/png,application/pdf` |

---

## 8. AUTHENTICATION FLOW

### **Registration Flow**

```
1. User fills registration form (frontend)
   ↓
2. Form validation (react-hook-form + zod)
   ↓
3. POST /api/auth/register
   ↓
4. Backend validates input
   ↓
5. Create user in Supabase Auth
   ↓
6. Insert user record in users table
   ↓
7. Send verification email
   ↓
8. Return success response
   ↓
9. Redirect to "Check your email" page
```

### **Login Flow**

```
1. User enters credentials (frontend)
   ↓
2. POST /api/auth/login
   ↓
3. Validate with Supabase Auth
   ↓
4. Generate JWT token
   ↓
5. Return token + user data
   ↓
6. Store token in memory (AuthContext)
   ↓
7. Redirect to dashboard
```

### **Protected Route Access**

```
1. User navigates to protected route
   ↓
2. Check if token exists (AuthContext)
   ↓
3. If no token → Redirect to login
   ↓
4. If token exists → Attach to API requests
   ↓
5. Backend validates token (auth middleware)
   ↓
6. If valid → Process request
   ↓
7. If invalid → Return 401 Unauthorized
```

### **Token Refresh Flow**

```
1. Token expires (24h)
   ↓
2. API returns 401
   ↓
3. Frontend calls POST /api/auth/refresh-token
   ↓
4. Backend generates new token
   ↓
5. Update token in context
   ↓
6. Retry original request
```

---

## 9. DEPLOYMENT GUIDE

### **Frontend Deployment (Vercel)**

**Step 1: Connect Repository**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import `lmsa-website` repository
4. Select framework preset: Vite

**Step 2: Configure Build Settings**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Step 3: Add Environment Variables**
Add all `VITE_*` variables from `.env`

**Step 4: Deploy**
- Click "Deploy"
- Vercel will auto-deploy on every push to `main`

**Step 5: Custom Domain**
1. Buy domain: lmsa.org
2. Add to Vercel project
3. Update DNS (provided by Vercel)
4. SSL automatically enabled

**Production URL:** `https://www.lmsa.org`

---

### **Backend Deployment (Render)**

**Step 1: Create Web Service**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect `lmsa-api` repository

**Step 2: Configure Service**
```
Name: lmsa-api
Environment: Node
Region: Oregon (US West) or closest to Liberia
Branch: main
Build Command: npm install
Start Command: npm start
```

**Step 3: Add Environment Variables**
Add all backend env vars from `.env`

**Step 4: Select Plan**
- Free tier (with sleep after 15min inactivity)
- Or $7/month for always-on

**Step 5: Deploy**
- Click "Create Web Service"
- Render auto-deploys on push to `main`

**Step 6: Custom Domain (Optional)**
1. Add custom domain: `api.lmsa.org`
2. Update DNS with CNAME record
3. SSL automatically enabled

**Production URL:** `https://api.lmsa.org` or `https://lmsa-api.onrender.com`

---

### **Database (Supabase)**

Already hosted! No deployment needed.

Just ensure:
- Production environment variables point to production Supabase project
- Row Level Security (RLS) policies are enabled
- Database backups are configured (automatic in Supabase)

---

### **Post-Deployment Checklist**

- [ ] Frontend deploys successfully
- [ ] Backend deploys successfully
- [ ] Database migrations applied
- [ ] Environment variables set correctly
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] CORS configured correctly
- [ ] Test login/register flows
- [ ] Test API endpoints
- [ ] Test file uploads
- [ ] Test email sending
- [ ] Set up monitoring (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Create admin user
- [ ] Seed initial data (committees, etc.)

---

## 10. TESTING STRATEGY

### **Frontend Testing**

**Unit Tests (Vitest + React Testing Library)**

```javascript
// Example: Button component test
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

Run tests: `npm test`

**E2E Tests (Playwright) - Optional**

```javascript
// Example: Login flow test
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="email"]', 'test@lmsa.org');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:5173/portal/dashboard');
});
```

---

### **Backend Testing**

**Unit Tests (Jest + Supertest)**

```javascript
// Example: Auth endpoint test
import request from 'supertest';
import app from '../src/server.js';

describe('POST /api/auth/login', () => {
  it('returns token on valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@lmsa.org',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it('returns 401 on invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@lmsa.org',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });
});
```

Run tests: `npm test`

---

### **Manual Testing Checklist**

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Forgot password flow
- [ ] Reset password flow
- [ ] Email verification
- [ ] Logout

**Membership:**
- [ ] Submit membership application
- [ ] View application status
- [ ] Approve/reject application (admin)
- [ ] Pay membership dues
- [ ] View dues history

**Events:**
- [ ] Create new event (admin)
- [ ] Register for event
- [ ] Unregister from event
- [ ] View event details
- [ ] Mark attendance (admin)

**News:**
- [ ] Create news post (admin)
- [ ] Publish news post
- [ ] View news list
- [ ] View news detail
- [ ] Search news

**ID Cards:**
- [ ] Generate ID card (admin)
- [ ] View ID card in portal
- [ ] Download ID card
- [ ] Verify ID card by QR

**Mobile Testing:**
- [ ] Test on Android device
- [ ] Test on iOS device
- [ ] Test on different screen sizes
- [ ] Test on slow 3G connection

---

## 11. MAINTENANCE & MONITORING

### **Error Tracking (Sentry)**

**Setup:**
```bash
npm install @sentry/react @sentry/vite-plugin
```

**Frontend Integration:**
```javascript
// src/main.jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your_sentry_dsn',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

**Backend Integration:**
```javascript
// src/server.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'your_sentry_dsn',
  environment: process.env.NODE_ENV,
});
```

---

### **Analytics (Google Analytics 4)**

**Setup:**
```bash
npm install react-ga4
```

**Integration:**
```javascript
// src/App.jsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

function App() {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);
  
  // ...
}
```

---

### **Performance Monitoring**

**Frontend:**
- Lighthouse CI
- Web Vitals tracking
- Bundle size monitoring

**Backend:**
- Response time monitoring
- Database query performance
- Error rate tracking

---

### **Backup Strategy**

**Database Backups:**
- Supabase automatic daily backups (enabled by default)
- Manual backups before major changes
- Test restore process monthly

**File Storage Backups:**
- Supabase Storage has built-in redundancy
- Download critical files periodically

**Code Backups:**
- Git repository (GitHub)
- Tagged releases for each deployment

---

### **Update Schedule**

**Weekly:**
- Review error logs (Sentry)
- Check analytics (GA4)
- Monitor performance metrics

**Monthly:**
- Update dependencies (`npm update`)
- Review and archive old content
- Database maintenance (if needed)
- Test backup restore

**Quarterly:**
- Security audit
- Performance optimization
- User feedback review
- Feature planning

---

### **Support & Documentation**

**Internal Documentation:**
- Keep README.md updated
- Document major changes in CHANGELOG.md
- Comment complex code

**User Support:**
- FAQ page on website
- Contact form for inquiries
- Email support: support@lmsa.org

**Developer Handoff:**
- Onboarding guide for new developers
- Code review guidelines
- Contribution guidelines (CONTRIBUTING.md)

---

## 🎉 READY TO BUILD!

This technical documentation covers everything needed to build, deploy, and maintain the LMSA website. 

**Next Steps:**
1. Set up repositories on GitHub
2. Initialize projects with proper structure
3. Configure Supabase
4. Build authentication system
5. Implement core features
6. Deploy to staging
7. Test thoroughly
8. Deploy to production

**Questions or Issues?**
Create an issue in the repository or contact the development team.

---

**Last Updated:** April 2026  
**Version:** 1.0  
**Maintained by:** LMSA Development Team