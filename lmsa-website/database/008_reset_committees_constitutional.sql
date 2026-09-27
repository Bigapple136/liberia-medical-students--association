-- =====================================================
-- RESET: REPLACE WITH THE ACTUAL CONSTITUTIONAL COMMITTEES
-- Depends on: 006_seed_committees.sql (committees table has rows),
--             007_fix_mandate_column_type.sql (mandate is TEXT[] —
--             this migration inserts array literals into it, which
--             will fail with a type error if 007 hasn't run yet)
--
-- 006 seeded 12 committees under a generic, made-up naming scheme
-- (medical-education, community-health, ...) that doesn't match
-- LMSA's actual constitution. The real 12 standing committees, with
-- full descriptions, mandates, and key activities, were already
-- written out in lmsa-website/src/utils/committeesData.js
-- (ALL_COMMITTEES_DATA) — that file's own header comment says as much
-- ("mirrors the committee mandates documented in docs/LMSA STANDING
-- COMMITTEES - COMPLETE PAGES.md") but nothing had ever actually
-- loaded it into the database. This migration does that: deletes the
-- 006 placeholder rows and inserts the real 12, verbatim, generated
-- directly from committeesData.js (not hand-transcribed) to guarantee
-- the name/slug/description/mandate/key_activities/icon values below
-- match that file exactly, apostrophe-escaping included.
--
-- `icon` is now populated too (006 left it NULL) — these are Lucide
-- icon *names* as plain strings (e.g. 'BookOpen'), matching both
-- CommitteePageTemplate.jsx's ICON_MAP lookup and
-- committeesData.js's own `icon` field. The corresponding public
-- listing page's icon config (src/config/committees.js) is being
-- re-keyed to the same 12 slugs in the same change that introduces
-- this migration — if you're reading this after that file was
-- reverted independently, the listing page's icons will silently stop
-- matching these slugs again.
--
-- This is a one-time destructive reset (DELETE FROM committees, not
-- an upsert) — safe run once, but running it again after committee
-- data has since been genuinely customized (chairs assigned, real
-- members added, mandates hand-edited via the admin panel) would wipe
-- that. `committee_members`/committee-scoped events/documents/
-- announcements/achievements/applications are all ON DELETE CASCADE
-- from committees, so they'd be removed too, not orphaned. The two
-- non-cascading references — events.committee_id and
-- documents.committee_id (a top-level event/document can *optionally*
-- tag a committee) — are plain foreign keys with no ON DELETE clause,
-- so if anything currently has one of those set, this DELETE will
-- fail outright with a clear FK-violation error rather than silently
-- breaking that reference; nothing is expected to be affected at this
-- early stage, but that's the safety net if there is.
-- =====================================================

DELETE FROM committees;

INSERT INTO committees (name, slug, description, mandate, key_activities, icon, committee_type, status)
VALUES
  ('Academic Committee', 'academic', 'The Academic Committee plans and executes all functions related to LMSA''s academic affairs, including symposia, conferences, and student academic support.', ARRAY['Plan and execute clinical and pre-clinical conferences', 'Organize and conduct intellectual discourses', 'Assist library staff with journals and periodicals', 'Plan convenient library schedules for students', 'Execute at least two symposia per academic year', 'Select topics and invite participants for academic events'], ARRAY['Annual Medical Symposium', 'Clinical Skills Workshops', 'Academic Mentorship Program', 'Study Group Coordination', 'Library Resource Management', 'Guest Speaker Series'], 'BookOpen', 'standing', 'active'),
  ('Health Committee', 'health', 'The Health Committee ensures the general sanitation of dormitories, academic buildings, and their environs while planning health-related functions for LMSA members.', ARRAY['Ensure satisfactory sanitation of dormitories and academic buildings', 'Maintain acceptable health standards in all LMSA facilities', 'Plan and execute health-related functions for members', 'Coordinate with health authorities on student health matters', 'Conduct regular health and sanitation inspections', 'Promote health awareness among students'], ARRAY['Campus Health Inspections', 'Health Awareness Campaigns', 'First Aid Training', 'Mental Health Support Programs', 'Vaccination Drives', 'Wellness Workshops'], 'Heart', 'standing', 'active'),
  ('Research & Journal Committee', 'research-journal', 'The Research & Journal Committee gathers, organizes, edits, and publishes data for LMSA''s official journal and newsletters while promoting research among members.', ARRAY['Publish one journal per academic year', 'Publish at least two newsletters per semester', 'Gather and organize content for publications', 'Edit and review submitted articles', 'Promote research culture among students', 'May publish yearbook'], ARRAY['LMSA Journal Publication', 'Quarterly Newsletters', 'Research Symposium', 'Student Research Projects', 'Publication Workshops', 'Medical Writing Training'], 'FileText', 'standing', 'active'),
  ('Social & Program Committee', 'social-program', 'The Social & Program Committee plans and executes all social events, including the end-of-year program, initiation ceremony, and other student engagement activities.', ARRAY['Plan and execute the annual end-of-year program', 'Organize the initiation ceremony for new students', 'Coordinate social events and student networking activities', 'Foster community spirit and student cohesion', 'Manage entertainment and recreational programs', 'Organize inter-class social events'], ARRAY['End-of-Year Program', 'Initiation Ceremony', 'Cultural Nights', 'Inter-Class Games', 'Networking Mixers', 'Student Talent Shows'], 'Users', 'standing', 'active'),
  ('Dietary Committee', 'dietary', 'The Dietary Committee works directly with dietary staff to improve meal programs and ensure students have access to adequate and nutritious food throughout the academic year.', ARRAY['Liaise with dietary staff on meal planning and quality', 'Advocate for improved nutritional standards in student meals', 'Monitor cafeteria hygiene and food safety standards', 'Gather student feedback on dietary services', 'Negotiate meal package improvements with administration', 'Report dietary concerns to LMSA executive committee'], ARRAY['Cafeteria Inspections', 'Nutrition Awareness Month', 'Student Dietary Surveys', 'Food Safety Workshops', 'Menu Review Meetings', 'Healthy Eating Campaigns'], 'Utensils', 'standing', 'active'),
  ('Judicial Committee', 'judicial', 'The Judicial Committee handles all legal matters within LMSA, upholds student rights, interprets the constitution, and ensures due process in disciplinary proceedings.', ARRAY['Handle and adjudicate legal matters within LMSA', 'Uphold and protect student rights and liberties', 'Interpret the LMSA Constitution when disputes arise', 'Ensure due process in all disciplinary proceedings', 'Review and recommend constitutional amendments', 'Serve as the appeals body for executive decisions'], ARRAY['Constitution Review Sessions', 'Student Rights Workshops', 'Disciplinary Hearings', 'Legal Aid Clinics', 'Ethics Training', 'Constitutional Debates'], 'Scale', 'standing', 'active'),
  ('Sports Committee', 'sports', 'The Sports Committee promotes physical health, sportsmanship, and team spirit through organized athletics, inter-class competitions, and recreational sports programs.', ARRAY['Organize and supervise inter-class sports competitions', 'Promote physical fitness and active lifestyles among students', 'Coordinate LMSA''s participation in external sports events', 'Manage sports equipment and facilities', 'Recognize and celebrate athletic achievements', 'Ensure fair play and sportsmanship in all events'], ARRAY['Inter-Class Football Tournament', 'Annual Sports Day', 'Basketball League', 'Table Tennis Championship', 'LMSA Olympics', 'Fitness Boot Camps'], 'Trophy', 'standing', 'active'),
  ('Auditing Committee', 'auditing', 'The Auditing Committee ensures full financial transparency and accountability by auditing LMSA''s accounts and reporting findings to the membership.', ARRAY['Audit all LMSA financial accounts and transactions', 'Prepare and present financial reports to general assembly', 'Ensure proper accounting and record-keeping standards', 'Monitor budget allocations and expenditures', 'Investigate any financial discrepancies or irregularities', 'Recommend financial policies and controls'], ARRAY['Semester Financial Audits', 'Annual Report Preparation', 'Budget Review Sessions', 'Financial Transparency Reports', 'Expense Verification', 'Dues Collection Oversight'], 'DollarSign', 'standing', 'active'),
  ('Foreign Affairs Committee', 'foreign-affairs', 'The Foreign Affairs Committee coordinates international opportunities, exchange programs, and global health partnerships for LMSA members.', ARRAY['Identify and promote international exchange opportunities', 'Coordinate relationships with international medical student organizations', 'Facilitate student participation in global health conferences', 'Disseminate information on international scholarships and fellowships', 'Represent LMSA at international medical student events', 'Promote cross-cultural understanding and global health awareness'], ARRAY['IFMSA Exchange Programs', 'Global Health Conferences', 'International Scholarship Database', 'Cultural Exchange Events', 'Global Health Symposium', 'Study Abroad Guidance'], 'Globe', 'standing', 'active'),
  ('Membership Committee', 'membership', 'The Membership Committee recruits new members, manages member registration, oversees ID card issuance, and maintains the LMSA membership database.', ARRAY['Recruit and onboard new LMSA members', 'Manage membership registration and renewal processes', 'Oversee the issuance and management of student ID cards', 'Maintain accurate and up-to-date membership records', 'Verify membership eligibility and dues payment', 'Conduct membership drives at the start of each semester'], ARRAY['Membership Drives', 'ID Card Distribution', 'New Member Orientations', 'Membership Database Management', 'Dues Collection', 'Member Verification'], 'UserPlus', 'standing', 'active'),
  ('Media & Publicity Committee', 'media-publicity', 'The Media & Publicity Committee manages all LMSA communications, social media presence, branding, and promotional activities to amplify the organization''s voice.', ARRAY['Manage LMSA''s official social media accounts and website', 'Create promotional materials for LMSA events and programs', 'Document LMSA events through photography and videography', 'Draft and distribute official press releases and communications', 'Maintain consistent LMSA brand identity across all platforms', 'Coordinate media coverage for major LMSA events'], ARRAY['Social Media Management', 'Event Photography', 'LMSA Newsletter Design', 'Press Releases', 'Promotional Videos', 'Brand Guidelines'], 'Megaphone', 'standing', 'active'),
  ('Welfare Committee', 'welfare', 'The Welfare Committee ensures the holistic wellbeing of all LMSA members, providing support services, advocacy, and resources for students in need.', ARRAY['Identify and address student welfare needs and concerns', 'Advocate for improved student living and learning conditions', 'Coordinate support services for students in distress', 'Manage emergency assistance funds for members in need', 'Promote mental health awareness and resources', 'Liaise with university administration on student welfare issues'], ARRAY['Mental Health Awareness Month', 'Emergency Fund Management', 'Student Counseling Referrals', 'Welfare Surveys', 'Accommodation Advocacy', 'Financial Aid Guidance'], 'HeartHandshake', 'standing', 'active');
