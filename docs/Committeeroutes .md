// ============================================
// FILE: src/routes/committee.routes.js
// All committee API routes
// ============================================
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as cc from '../controllers/committee.controller.js';

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/',       cc.getAll);
router.get('/:slug',  cc.getBySlug);

// ─── Public interactions ──────────────────────────────────────────────────────
router.post('/:id/contact',   cc.submitContactForm);
router.post('/:id/subscribe', cc.subscribe);

// ─── Authenticated: read committee data ──────────────────────────────────────
router.get('/:id/members',       authenticate, cc.getMembers);
router.get('/:id/events',        authenticate, cc.getEvents);
router.get('/:id/documents',     authenticate, cc.getDocuments);
router.get('/:id/announcements', authenticate, cc.getAnnouncements);
router.get('/:id/achievements',  authenticate, cc.getAchievements);

// ─── Admin: manage committee details ─────────────────────────────────────────
const isAdmin = [authenticate, authorize('admin', 'executive', 'super_admin')];

router.put('/:id', ...isAdmin, cc.update);

// Members
router.post('/:id/members',                ...isAdmin, cc.addMember);
router.put( '/:id/members/:memberId',      ...isAdmin, cc.updateMemberRole);
router.delete('/:id/members/:memberId',    ...isAdmin, cc.removeMember);

// Events
router.post('/:id/events',               ...isAdmin, cc.createEvent);
router.delete('/:id/events/:eventId',    ...isAdmin, cc.deleteEvent);

// Documents
router.post('/:id/documents',            ...isAdmin, cc.addDocument);
router.delete('/:id/documents/:docId',   ...isAdmin, cc.deleteDocument);

// Announcements
router.post('/:id/announcements',            ...isAdmin, cc.createAnnouncement);
router.delete('/:id/announcements/:annId',   ...isAdmin, cc.deleteAnnouncement);

// Achievements
router.post('/:id/achievements',              ...isAdmin, cc.createAchievement);
router.delete('/:id/achievements/:achId',     ...isAdmin, cc.deleteAchievement);

export default router;


// ============================================
// FILE: src/controllers/committee.controller.js
// ============================================
import { supabase } from '../config/supabase.js';
import { sendEmail } from '../config/email.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ok  = (res, data, status = 200) => res.status(status).json({ success: true, ...data });
const err = (res, msg, status = 400) => res.status(status).json({ success: false, message: msg });

// ─── GET /api/committees ──────────────────────────────────────────────────────
export async function getAll(_req, res) {
  const { data, error } = await supabase
    .from('committees')
    .select(`
      *,
      chair:chair_id ( id, full_name, profile_photo_url, year_level ),
      member_count:committee_members(count)
    `)
    .eq('status', 'active')
    .order('name');

  if (error) return err(res, error.message);

  // Flatten counts
  const committees = data.map(c => ({
    ...c,
    member_count: c.member_count?.[0]?.count ?? 0,
  }));
  ok(res, { committees });
}

// ─── GET /api/committees/:slug ────────────────────────────────────────────────
export async function getBySlug(req, res) {
  const { slug } = req.params;
  const { data, error } = await supabase
    .from('committees')
    .select(`
      *,
      chair:chair_id ( id, full_name, profile_photo_url, year_level, email ),
      vice_chair:vice_chair_id ( id, full_name, profile_photo_url, year_level )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return err(res, 'Committee not found', 404);

  // Increment view count
  await supabase.from('committees').update({ views: (data.views || 0) + 1 }).eq('id', data.id);

  ok(res, { committee: data });
}

// ─── PUT /api/committees/:id ──────────────────────────────────────────────────
export async function update(req, res) {
  const { id } = req.params;
  const { name, description, mandate, key_activities, email, status, meeting_schedule } = req.body;

  const { data, error } = await supabase
    .from('committees')
    .update({ name, description, mandate, key_activities, email, status, meeting_schedule, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return err(res, error.message);
  ok(res, { committee: data });
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function getMembers(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('committee_members')
    .select(`
      id, position, joined_at,
      user:user_id ( id, full_name, email, year_level, profile_photo_url, bio )
    `)
    .eq('committee_id', id)
    .is('left_at', null)
    .order('position');

  if (error) return err(res, error.message);
  // Flatten user data
  const members = data.map(m => ({ ...m.user, id: m.id, user_id: m.user?.id, position: m.position, joined_at: m.joined_at }));
  ok(res, { members });
}

export async function addMember(req, res) {
  const { id } = req.params;
  const { user_id, position } = req.body;

  // Check not already a member
  const { data: existing } = await supabase
    .from('committee_members')
    .select('id')
    .eq('committee_id', id)
    .eq('user_id', user_id)
    .is('left_at', null)
    .single();

  if (existing) return err(res, 'User is already a member of this committee');

  const { data, error } = await supabase
    .from('committee_members')
    .insert({ committee_id: id, user_id, position: position || 'Member' })
    .select(`
      id, position, joined_at,
      user:user_id ( id, full_name, email, year_level, profile_photo_url )
    `)
    .single();

  if (error) return err(res, error.message);
  ok(res, { member: { ...data.user, id: data.id, position: data.position, joined_at: data.joined_at } }, 201);
}

export async function updateMemberRole(req, res) {
  const { id, memberId } = req.params;
  const { position } = req.body;

  const { data, error } = await supabase
    .from('committee_members')
    .update({ position })
    .eq('id', memberId)
    .eq('committee_id', id)
    .select()
    .single();

  if (error) return err(res, error.message);
  ok(res, { member: data });
}

export async function removeMember(req, res) {
  const { id, memberId } = req.params;

  const { error } = await supabase
    .from('committee_members')
    .update({ left_at: new Date().toISOString() })
    .eq('id', memberId)
    .eq('committee_id', id);

  if (error) return err(res, error.message);
  ok(res, { message: 'Member removed' });
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('committee_id', id)
    .order('start_datetime', { ascending: false });

  if (error) return err(res, error.message);
  ok(res, { events: data });
}

export async function createEvent(req, res) {
  const { id } = req.params;
  const {
    title, description, event_type, location, venue,
    start_datetime, end_datetime, registration_required,
    max_attendees, fee, image_url,
  } = req.body;

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const { data, error } = await supabase
    .from('events')
    .insert({
      title, slug, description, event_type, location, venue,
      start_datetime, end_datetime, registration_required: registration_required || false,
      max_attendees: max_attendees || null,
      fee: fee || 0,
      image_url,
      committee_id: id,
      organizer_id: req.user.id,
      status: 'upcoming',
    })
    .select()
    .single();

  if (error) return err(res, error.message);
  ok(res, { event: data }, 201);
}

export async function deleteEvent(req, res) {
  const { id, eventId } = req.params;
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('committee_id', id);

  if (error) return err(res, error.message);
  ok(res, { message: 'Event deleted' });
}

// ─── Documents ───────────────────────────────────────────────────────────────

export async function getDocuments(req, res) {
  const { id } = req.params;
  const isAuth = !!req.user;

  let query = supabase
    .from('documents')
    .select('*')
    .eq('committee_id', id)
    .order('created_at', { ascending: false });

  if (!isAuth) query = query.eq('access_level', 'public');

  const { data, error } = await query;
  if (error) return err(res, error.message);
  ok(res, { documents: data });
}

export async function addDocument(req, res) {
  const { id } = req.params;
  const { title, category, access_level, file_url, file_type, file_size } = req.body;

  const { data, error } = await supabase
    .from('documents')
    .insert({
      title, category, access_level: access_level || 'members',
      file_url, file_type, file_size,
      committee_id: id,
      uploaded_by: req.user.id,
    })
    .select()
    .single();

  if (error) return err(res, error.message);
  ok(res, { document: data }, 201);
}

export async function deleteDocument(req, res) {
  const { id, docId } = req.params;
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId)
    .eq('committee_id', id);

  if (error) return err(res, error.message);
  ok(res, { message: 'Document deleted' });
}

// ─── Announcements ───────────────────────────────────────────────────────────

export async function getAnnouncements(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('committee_announcements')
    .select('*')
    .eq('committee_id', id)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return err(res, error.message);
  ok(res, { announcements: data });
}

export async function createAnnouncement(req, res) {
  const { id } = req.params;
  const { title, message, type, pinned } = req.body;

  const { data, error } = await supabase
    .from('committee_announcements')
    .insert({ committee_id: id, title, message, type: type || 'info', pinned: pinned || false, created_by: req.user.id })
    .select()
    .single();

  if (error) return err(res, error.message);
  ok(res, { announcement: data }, 201);
}

export async function deleteAnnouncement(req, res) {
  const { id, annId } = req.params;
  const { error } = await supabase
    .from('committee_announcements')
    .delete()
    .eq('id', annId)
    .eq('committee_id', id);

  if (error) return err(res, error.message);
  ok(res, { message: 'Announcement deleted' });
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export async function getAchievements(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('committee_achievements')
    .select('*')
    .eq('committee_id', id)
    .order('date', { ascending: false });

  if (error) return err(res, error.message);
  ok(res, { achievements: data });
}

export async function createAchievement(req, res) {
  const { id } = req.params;
  const { title, description, date, badge_emoji } = req.body;

  const { data, error } = await supabase
    .from('committee_achievements')
    .insert({ committee_id: id, title, description, date: date || null, badge_emoji: badge_emoji || '🏆', created_by: req.user.id })
    .select()
    .single();

  if (error) return err(res, error.message);
  ok(res, { achievement: data }, 201);
}

export async function deleteAchievement(req, res) {
  const { id, achId } = req.params;
  const { error } = await supabase
    .from('committee_achievements')
    .delete()
    .eq('id', achId)
    .eq('committee_id', id);

  if (error) return err(res, error.message);
  ok(res, { message: 'Achievement deleted' });
}

// ─── Public interactions ──────────────────────────────────────────────────────

export async function submitContactForm(req, res) {
  const { id } = req.params;
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) return err(res, 'name, email, and message are required');

  // Get committee email
  const { data: committee } = await supabase
    .from('committees')
    .select('name, email')
    .eq('id', id)
    .single();

  // Send email to committee chair
  if (committee?.email) {
    await sendEmail({
      to: committee.email,
      subject: `[LMSA] New message for ${committee.name}: ${subject || 'General Inquiry'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p style="color:#888">Sent via LMSA Website</p>
      `,
    });
  }

  // Also send confirmation to sender
  await sendEmail({
    to: email,
    subject: `Your message to LMSA ${committee?.name || ''} has been received`,
    html: `
      <h2>We received your message!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to the LMSA ${committee?.name || 'Committee'}. We'll get back to you as soon as possible.</p>
      <p><strong>Your message:</strong> ${message}</p>
      <p>Best regards,<br>LMSA Team</p>
    `,
  });

  ok(res, { message: 'Message sent successfully' });
}

export async function subscribe(req, res) {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) return err(res, 'Email is required');

  const { error } = await supabase
    .from('committee_subscribers')
    .upsert({ committee_id: id, email }, { onConflict: 'committee_id,email' });

  if (error) return err(res, error.message);
  ok(res, { message: 'Subscribed successfully' });
}


// ============================================
// FILE: database/committee_additions.sql
// Run this in Supabase SQL editor to add
// the new tables required by this feature
// ============================================

/*
-- Add committee_id to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS committee_id UUID REFERENCES committees(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS committee_id UUID REFERENCES committees(id);

-- Add extra fields to committees
ALTER TABLE committees ADD COLUMN IF NOT EXISTS key_activities TEXT[];
ALTER TABLE committees ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE committees ADD COLUMN IF NOT EXISTS meeting_schedule TEXT;
ALTER TABLE committees ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Committee announcements
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

-- Committee achievements
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

-- Committee newsletter subscribers
CREATE TABLE IF NOT EXISTS committee_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID REFERENCES committees(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(committee_id, email)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_committee_announcements_committee_id ON committee_announcements(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_achievements_committee_id ON committee_achievements(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_subscribers_committee_id ON committee_subscribers(committee_id);
CREATE INDEX IF NOT EXISTS idx_events_committee_id ON events(committee_id);
CREATE INDEX IF NOT EXISTS idx_documents_committee_id ON documents(committee_id);

-- RLS
ALTER TABLE committee_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can read announcements and achievements
CREATE POLICY "Public read announcements" ON committee_announcements FOR SELECT USING (true);
CREATE POLICY "Public read achievements" ON committee_achievements FOR SELECT USING (true);

-- Only admins can write
CREATE POLICY "Admin write announcements" ON committee_announcements
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','executive','super_admin')));

CREATE POLICY "Admin write achievements" ON committee_achievements
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','executive','super_admin')));
*/


// ============================================
// FILE: src/routes.jsx — ADD THESE ROUTES
// ============================================
/*
import CommitteeAdminDashboard from '@pages/admin/CommitteeAdminDashboard';
import CommitteePageDynamic, { CommitteesOverviewPage } from '@pages/committees/CommitteePageTemplate';

// In your public routes (inside PublicLayout):
<Route path="/committees" element={<CommitteesOverviewPage />} />
<Route path="/committees/:slug" element={<CommitteePageDynamic />} />

// Alias for /leadership/committees
<Route path="/leadership/committees" element={<CommitteesOverviewPage />} />

// In admin routes (inside AdminLayout, protected):
<Route path="committees" element={<CommitteeAdminDashboard />} />
*/