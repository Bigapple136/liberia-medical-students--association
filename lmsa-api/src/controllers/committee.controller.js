import { supabase } from '../config/supabase.js';
import { canAccessDocument } from './document.controller.js';
import { sendEmail } from '../config/email.js';
import { escapeHtml, normalizeMaxAttendees } from '../utils/helpers.js';
import {
  compareProgrammes,
  deriveProgrammeState,
  isUuid,
  resolveProgrammeAssignment,
  sessionEndTime,
  uniqueProgrammeSlug,
} from '../utils/programmes.js';

// Approved-application counts keyed by committee id.
//
// applyToCommittee treats `openings > 0` as a hard cap on approved
// applications, so a full committee rejects new applicants. The public pages
// need the same number to say "positions filled" *before* someone writes a
// statement and is turned away at submit. Never fatal: if this lookup fails
// the committee list still loads and every committee simply reads as not-full,
// which is how it behaved before this existed (the cap is still enforced
// server-side either way). One query for all ids rather than one per committee.
const getApprovedCounts = async (committeeIds) => {
  if (!committeeIds.length) return {};
  try {
    const { data, error } = await supabase
      .from('committee_applications')
      .select('committee_id')
      .eq('status', 'approved')
      .in('committee_id', committeeIds);
    if (error || !data) return {};
    return data.reduce((counts, row) => {
      counts[row.committee_id] = (counts[row.committee_id] || 0) + 1;
      return counts;
    }, {});
  } catch {
    return {};
  }
};

// The columns a public read may return, named rather than `*` so that a column
// added to `committees` later — a budget, a private note, a staff-only link —
// cannot reach a public page just by existing in the table. The chair is a name
// and nothing else: the dashboard is where their email, year level and id live
// (docs/16-public-and-portal-boundary.md §4).
const PUBLIC_COMMITTEE_SELECT = `
        id, name, slug, description, mandate, key_activities,
        committee_type, icon, status, email, meeting_schedule, views,
        created_at, updated_at,
        chair:chair_id ( full_name ),
        member_count:committee_members(count)
      `;

// ─── GET /api/committees ──────────────────────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('committees')
      .select(PUBLIC_COMMITTEE_SELECT)
      .eq('status', 'active')
      .order('name');

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch committees',
      });
    }

    // Flatten counts
    const approvedCounts = await getApprovedCounts(data.map(c => c.id));
    const committees = data.map(c => ({
      ...c,
      member_count: c.member_count?.[0]?.count ?? 0,
      approved_count: approvedCounts[c.id] ?? 0,
    }));

    res.json({
      success: true,
      committees,
    });
  } catch (error) {
    console.error('Get all committees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch committees',
    });
  }
};

// ─── GET /api/committees/admin/all (admin) ──────────────────────────────────
// Same select/order/flattening as getAll, but no status filter: the admin
// picker must keep showing committees an admin just deactivated, or they'd
// vanish from every admin surface the moment the toggle flips (T39).
export const getAllAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('committees')
      .select(`
        *,
        chair:chair_id ( id, full_name, profile_photo_url, year_level ),
        member_count:committee_members(count)
      `)
      .order('name');

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch committees',
      });
    }

    // Flatten counts (same as getAll)
    const approvedCounts = await getApprovedCounts(data.map(c => c.id));
    const committees = data.map(c => ({
      ...c,
      member_count: c.member_count?.[0]?.count ?? 0,
      approved_count: approvedCounts[c.id] ?? 0,
    }));

    res.json({
      success: true,
      committees,
    });
  } catch (error) {
    console.error('Get all committees (admin) error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch committees',
    });
  }
};

// ─── GET /api/committees/:slug ────────────────────────────────────────────────
export const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('committees')
      .select(PUBLIC_COMMITTEE_SELECT)
      .eq('slug', slug)
      // Public detail view resolves *active* committees only — an unknown
      // slug and a deactivated one are indistinguishable to the public (both
      // 404). Admin surfaces go through getAllAdmin instead (T39).
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found',
      });
    }

    // Increment view count
    await supabase
      .from('committees')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id);

    const approvedCounts = await getApprovedCounts([data.id]);

    res.json({
      success: true,
      committee: { ...data, approved_count: approvedCounts[data.id] ?? 0 },
    });
  } catch (error) {
    console.error('Get committee by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch committee',
    });
  }
};

// ─── PUT /api/committees/:id ──────────────────────────────────────────────────
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, mandate, key_activities, email, meeting_schedule,
      chair_id, vice_chair_id, icon,
      openings, accepting_applications, application_deadline, status,
    } = req.body;

    const { data, error } = await supabase
      .from('committees')
      .update({
        name,
        description,
        mandate,
        key_activities,
        email,
        meeting_schedule,
        chair_id,
        vice_chair_id,
        icon,
        openings,
        accepting_applications,
        application_deadline,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update committee',
      });
    }

    res.json({
      success: true,
      committee: data,
    });
  } catch (error) {
    console.error('Update committee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update committee',
    });
  }
};

// ─── GET /api/committees/:id/members ─────────────────────────────────────────
export const getMembers = async (req, res) => {
  try {
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

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch members',
      });
    }

    // Flatten user data
    const members = data.map(m => ({
      ...m.user,
      id: m.id,
      user_id: m.user?.id,
      position: m.position,
      joined_at: m.joined_at,
    }));

    res.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error('Get committee members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members',
    });
  }
};

// ─── POST /api/committees/:id/members ────────────────────────────────────────
export const addMember = async (req, res) => {
  try {
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

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this committee',
      });
    }

    const { data, error } = await supabase
      .from('committee_members')
      .insert({ committee_id: id, user_id, position: position || 'Member' })
      .select(`
        id, position, joined_at,
        user:user_id ( id, full_name, email, year_level, profile_photo_url )
      `)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to add member',
      });
    }

    res.status(201).json({
      success: true,
      member: { ...data.user, id: data.id, position: data.position, joined_at: data.joined_at },
    });
  } catch (error) {
    console.error('Add committee member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add member',
    });
  }
};

// ─── DELETE /api/committees/:id/members/:memberId ────────────────────────────
export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const { error } = await supabase
      .from('committee_members')
      .update({ left_at: new Date().toISOString() })
      .eq('id', memberId)
      .eq('committee_id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to remove member',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Remove committee member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove member',
    });
  }
};

// ─── PUT /api/committees/:id/members/:memberId ──────────────────────────────
export const updateMemberRole = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { position } = req.body;

    const { data, error } = await supabase
      .from('committee_members')
      .update({ position })
      .eq('id', memberId)
      .eq('committee_id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update member role',
      });
    }

    res.json({
      success: true,
      member: data,
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update member role',
    });
  }
};

// ─── GET /api/committees/:id/events ─────────────────────────────────────────
export const getEvents = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('committee_id', id)
      .order('start_datetime', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch events',
      });
    }

    res.json({
      success: true,
      events: data,
    });
  } catch (error) {
    console.error('Get committee events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
    });
  }
};

// ─── POST /api/committees/:id/events ────────────────────────────────────────
export const createEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, event_type, location, venue,
      start_datetime, end_datetime, registration_required,
      max_attendees, fee, image_url, programme_id,
    } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // 0 (or a blank field) means no limit, so it is stored as null.
    const capacity = normalizeMaxAttendees(max_attendees);
    if (capacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Max attendees must be a whole number of 0 or more',
      });
    }

    // The event is created through the committee's own route, so the committee
    // is known: a programme from another committee is a 400, not a silent
    // mismatch between the page it appears on and the committee it belongs to.
    const assignment = await resolveProgrammeAssignment(programme_id, id);
    if (assignment.error) {
      return res.status(400).json({ success: false, message: assignment.error });
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        slug,
        description,
        event_type,
        location,
        venue,
        start_datetime,
        end_datetime,
        registration_required: registration_required || false,
        max_attendees: capacity,
        fee: fee || 0,
        image_url,
        committee_id: id,
        programme_id: assignment.programmeId,
        organizer_id: req.user.id,
        status: 'upcoming',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create event',
      });
    }

    res.status(201).json({
      success: true,
      event: data,
    });
  } catch (error) {
    console.error('Create committee event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
    });
  }
};

// ─── DELETE /api/committees/:id/events/:eventId ─────────────────────────────
export const deleteEvent = async (req, res) => {
  try {
    const { id, eventId } = req.params;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
      .eq('committee_id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete event',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete committee event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
    });
  }
};

// ─── GET /api/committees/:id/documents ──────────────────────────────────────
export const getDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('committee_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch documents',
      });
    }

    // Same rule as GET /api/documents. Listing a committee's documents must not
    // be a way around a document's access level — a members-only or executive
    // file is not readable just because it is filed under a committee. The
    // uploader id is dropped: nothing renders it, and it is a user identifier.
    const documents = (data || [])
      .filter(doc => canAccessDocument(doc, req.user))
      .map(doc => {
        const visible = { ...doc };
        delete visible.uploaded_by;
        return visible;
      });

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error('Get committee documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
    });
  }
};

// ─── POST /api/committees/:id/documents ────────────────────────────────────
export const createDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, access_level, file_url, file_type, file_size } = req.body;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        title,
        category,
        access_level: access_level || 'members',
        file_url,
        file_type,
        file_size,
        committee_id: id,
        uploaded_by: req.user.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create document',
      });
    }

    res.status(201).json({
      success: true,
      document: data,
    });
  } catch (error) {
    console.error('Create committee document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create document',
    });
  }
};

// ─── DELETE /api/committees/:id/documents/:documentId ───────────────────────
export const deleteDocument = async (req, res) => {
  try {
    const { id, documentId } = req.params;

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('committee_id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete document',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete committee document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
    });
  }
};

// ─── GET /api/committees/:id/announcements ──────────────────────────────────
export const getAnnouncements = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('committee_announcements')
      .select('*')
      .eq('committee_id', id)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch announcements',
      });
    }

    res.json({
      success: true,
      announcements: data,
    });
  } catch (error) {
    console.error('Get committee announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
    });
  }
};

// ─── POST /api/committees/:id/announcements ────────────────────────────────
export const createAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, pinned } = req.body;

    const { data, error } = await supabase
      .from('committee_announcements')
      .insert({
        committee_id: id,
        title,
        message,
        type: type || 'info',
        pinned: pinned || false,
        created_by: req.user.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create announcement',
      });
    }

    res.status(201).json({
      success: true,
      announcement: data,
    });
  } catch (error) {
    console.error('Create committee announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
    });
  }
};

// ─── DELETE /api/committees/:id/announcements/:announcementId ──────────────
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id, announcementId } = req.params;

    const { error } = await supabase
      .from('committee_announcements')
      .delete()
      .eq('id', announcementId)
      .eq('committee_id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete announcement',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete committee announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
    });
  }
};

// ─── GET /api/committees/:id/achievements ───────────────────────────────────
export const getAchievements = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('committee_achievements')
      .select('*')
      .eq('committee_id', id)
      .order('date', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch achievements',
      });
    }

    res.json({
      success: true,
      achievements: data,
    });
  } catch (error) {
    console.error('Get committee achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
    });
  }
};

// ─── POST /api/committees/:id/achievements ─────────────────────────────────
export const createAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, badge_emoji } = req.body;

    const { data, error } = await supabase
      .from('committee_achievements')
      .insert({
        committee_id: id,
        title,
        description,
        date: date || null,
        badge_emoji: badge_emoji || '🏆',
        created_by: req.user.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create achievement',
      });
    }

    res.status(201).json({
      success: true,
      achievement: data,
    });
  } catch (error) {
    console.error('Create committee achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create achievement',
    });
  }
};

// ─── DELETE /api/committees/:id/achievements/:achievementId ────────────────
export const deleteAchievement = async (req, res) => {
  try {
    const { id, achievementId } = req.params;

    const { error } = await supabase
      .from('committee_achievements')
      .delete()
      .eq('id', achievementId)
      .eq('committee_id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete achievement',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete committee achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete achievement',
    });
  }
};

// ─── Public projections ─────────────────────────────────────────────────────
// Four reads the public committee page needs and the authenticated handlers
// above cannot serve: those take a token, so the reader the page exists for —
// someone who is not a member — gets a 401 and the section renders empty.
//
// They sit under an explicit '/public/' segment rather than behind
// optionalAuthenticate, so the reduction is in the query rather than in the
// caller's role: a signed-in member sees exactly what a stranger sees, which is
// the rule that keeps a public page quotable
// (docs/16-public-and-portal-boundary.md §4, §6.1, §6.7). The three-segment
// shape also cannot collide with '/:id/members', which still answers the
// dashboard with the full roster.

// Resolves the slug to an active committee's id, or answers the request itself.
// Every projection below is scoped by that id, so a deactivated committee's
// records are as unreachable as its page.
const findPublicCommittee = async (req, res) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from('committees')
    .select('id')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    res.status(400).json({ success: false, message: 'Failed to fetch committee' });
    return null;
  }

  if (!data) {
    res.status(404).json({ success: false, message: 'Committee not found' });
    return null;
  }

  return data;
};

// ─── GET /api/committees/:slug/public/members ───────────────────────────────
// A roster on a public page is a list of representatives, not a list of users:
// a name and the public role, and nothing else (docs/16 §4). No portrait until
// there is an explicit public-profile choice, no bio, no email, no year level,
// no user id, and no joined_at — that is personnel record, not copy.
export const getPublicMembers = async (req, res) => {
  try {
    const committee = await findPublicCommittee(req, res);
    if (!committee) return;

    const { data, error } = await supabase
      .from('committee_members')
      .select('id, position, user:user_id ( full_name )')
      .eq('committee_id', committee.id)
      .is('left_at', null)
      .order('position');

    if (error) {
      return res.status(400).json({ success: false, message: 'Failed to fetch members' });
    }

    // A membership whose user row is gone has no name to publish, so it is
    // dropped rather than rendered as an empty seat.
    const members = (data || [])
      .filter((member) => member.user?.full_name)
      .map((member) => ({
        id: member.id,
        position: member.position,
        full_name: member.user.full_name,
      }));

    res.json({ success: true, members });
  } catch (error) {
    console.error('Get public committee members error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch members' });
  }
};

// ─── GET /api/committees/:slug/public/notices ───────────────────────────────
// committee_announcements carries no visibility flag, so a notice is public
// copy: pinning one is how a committee publishes it (docs/16 §9.1). The body
// comes with it, because for a notice the message *is* the content — unlike a
// news post, there is nothing behind it to click through to.
export const getPublicNotices = async (req, res) => {
  try {
    const committee = await findPublicCommittee(req, res);
    if (!committee) return;

    const { data, error } = await supabase
      .from('committee_announcements')
      .select('id, title, message, type, pinned, created_at')
      .eq('committee_id', committee.id)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: 'Failed to fetch notices' });
    }

    res.json({ success: true, notices: data || [] });
  } catch (error) {
    console.error('Get public committee notices error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notices' });
  }
};

// ─── GET /api/committees/:slug/public/documents ─────────────────────────────
// Only files an admin marked 'public'. The filter is in the query, so a
// members-only file is never fetched in order to be dropped, and the public
// list cannot hint at how many files are held back (docs/16 §6.3). `uploaded_by`
// and the committee id stay out: one is a user id, the other is already known.
export const getPublicDocuments = async (req, res) => {
  try {
    const committee = await findPublicCommittee(req, res);
    if (!committee) return;

    const { data, error } = await supabase
      .from('documents')
      .select('id, title, description, category, file_url, file_type, file_size, downloads, created_at')
      .eq('committee_id', committee.id)
      .eq('access_level', 'public')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: 'Failed to fetch documents' });
    }

    res.json({ success: true, documents: data || [] });
  } catch (error) {
    console.error('Get public committee documents error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
};

// ─── GET /api/committees/:slug/public/achievements ──────────────────────────
// What the committee is proud of is public copy: a title, a sentence and a
// date. The admin's `created_by` is not part of it.
export const getPublicAchievements = async (req, res) => {
  try {
    const committee = await findPublicCommittee(req, res);
    if (!committee) return;

    const { data, error } = await supabase
      .from('committee_achievements')
      .select('id, title, description, date, badge_emoji')
      .eq('committee_id', committee.id)
      .order('date', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: 'Failed to fetch achievements' });
    }

    res.json({ success: true, achievements: data || [] });
  } catch (error) {
    console.error('Get public committee achievements error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch achievements' });
  }
};

// ─── Committee programmes ───────────────────────────────────────────────────
// A committee page is a list of programmes, each with its own sessions. The
// frame — name, one sentence, audience, image, order — lives in
// committee_programmes; the dates, venues, fees and capacity behind it are
// ordinary `events` rows pointing at it, so the page and the calendar cannot
// drift apart. Nothing about running/upcoming/finished is stored: see
// utils/programmes.js for why.

const PROGRAMME_COLUMNS =
  'id, committee_id, name, slug, summary, audience, image_url, sort_order, status, created_at, updated_at';

const PROGRAMME_SESSION_COLUMNS =
  'id, programme_id, title, slug, start_datetime, end_datetime, venue, location, registration_required, registration_deadline, fee, image_url, status';

const PROGRAMME_STATUSES = ['draft', 'published'];
const PROGRAMME_LIMITS = { name: 60, summary: 160, audience: 120, image_url: 500 };
const PROGRAMME_FIELD_LABELS = {
  summary: 'Summary',
  audience: 'Audience',
  image_url: 'Image URL',
};

// Who may see drafts. The route is public, so this is decided per request from
// the optional auth middleware rather than by a separate admin route.
const STAFF_ROLES = ['admin', 'executive', 'super_admin'];
const isStaffUser = (user) => STAFF_ROLES.includes(user?.role);

// Validates only the fields that were actually sent, so a PUT that reorders a
// programme cannot blank its summary as a side effect. Returns { values } or
// { error } with a message fit to show in the dashboard.
const readProgrammeBody = (body = {}) => {
  const values = {};

  if (body.name !== undefined) {
    const name = String(body.name ?? '').trim();
    if (!name) return { error: 'A programme needs a name' };
    if (name.length > PROGRAMME_LIMITS.name) {
      return { error: `Programme names are limited to ${PROGRAMME_LIMITS.name} characters` };
    }
    values.name = name;
  }

  for (const field of ['summary', 'audience', 'image_url']) {
    if (body[field] === undefined) continue;
    const value = String(body[field] ?? '').trim();
    if (value.length > PROGRAMME_LIMITS[field]) {
      return {
        error: `${PROGRAMME_FIELD_LABELS[field]} is limited to ${PROGRAMME_LIMITS[field]} characters`,
      };
    }
    // Blank means "no summary / audience / image", stored as null rather than
    // an empty string so the page can test for absence.
    values[field] = value || null;
  }

  if (body.status !== undefined) {
    if (!PROGRAMME_STATUSES.includes(body.status)) {
      return { error: `Status must be ${PROGRAMME_STATUSES.join(' or ')}` };
    }
    values.status = body.status;
  }

  if (body.sort_order !== undefined) {
    const order = Number(body.sort_order);
    if (!Number.isInteger(order) || order < 0) {
      return { error: 'Sort order must be a whole number of 0 or more' };
    }
    values.sort_order = order;
  }

  return { values };
};

// Turns a duplicate name into the 409 the dashboard shows. The unique index is
// on lower(name), so the two spellings that read as one programme to a visitor
// are exactly the two that collide here.
const isDuplicateName = (error) =>
  error?.code === '23505' &&
  /committee_programmes_name/i.test(error?.message || '');

// ─── GET /api/committees/:identifier/programmes ─────────────────────────────
// One route, two readers. Express matches on path shape, so '/:slug/programmes'
// and '/:id/programmes' cannot be two routes; the identifier is resolved first
// (a uuid is an id, anything else is a slug) and the caller's role decides the
// view:
//
//   anonymous / member  → published programmes only, in public reading order,
//                         each with up to three sessions still ahead of it
//   admin / executive   → every programme including drafts, in admin order,
//                         with the counts the dashboard shows
//
// Drafts are excluded on the server, not by the page, so an unpublished
// programme cannot be read by guessing its slug.
export const getProgrammes = async (req, res) => {
  try {
    const { identifier } = req.params;
    const lookupById = isUuid(identifier);

    let committeeQuery = supabase
      .from('committees')
      .select('id, slug, name')
      .eq(lookupById ? 'id' : 'slug', identifier);

    // A deactivated committee has no public page, but the admin still needs to
    // reach it, so the status filter applies only to the public slug read.
    if (!lookupById) committeeQuery = committeeQuery.eq('status', 'active');

    const { data: committee, error: committeeError } = await committeeQuery.maybeSingle();

    if (committeeError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch programmes',
      });
    }

    if (!committee) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found',
      });
    }

    const adminView = isStaffUser(req.user);

    let programmeQuery = supabase
      .from('committee_programmes')
      .select(PROGRAMME_COLUMNS)
      .eq('committee_id', committee.id);

    if (!adminView) programmeQuery = programmeQuery.eq('status', 'published');

    const { data: programmes, error } = await programmeQuery
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch programmes',
      });
    }

    if (!programmes?.length) {
      return res.json({ success: true, programmes: [] });
    }

    const { data: sessions, error: sessionsError } = await supabase
      .from('events')
      .select(PROGRAMME_SESSION_COLUMNS)
      .in('programme_id', programmes.map((programme) => programme.id))
      .order('start_datetime', { ascending: true });

    if (sessionsError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch programme sessions',
      });
    }

    // Grouped in one pass rather than one query per programme.
    const sessionsByProgramme = new Map();
    for (const session of sessions || []) {
      const list = sessionsByProgramme.get(session.programme_id) || [];
      list.push(session);
      sessionsByProgramme.set(session.programme_id, list);
    }

    const now = Date.now();

    const shaped = programmes.map((programme) => {
      const all = sessionsByProgramme.get(programme.id) || [];
      const live = all.filter((session) => session.status !== 'cancelled');
      const ahead = live.filter((session) => sessionEndTime(session) >= now);
      const state = deriveProgrammeState(all, now);

      if (adminView) {
        return {
          ...programme,
          state,
          session_count: live.length,
          past_session_count: live.length - ahead.length,
          next_session: ahead[0] || null,
        };
      }

      return {
        ...programme,
        state,
        sessions: ahead.slice(0, 3),
        upcoming_session_count: ahead.length,
        session_count: live.length,
        past_session_count: live.length - ahead.length,
      };
    });

    // The admin sees the order it set; the public page reads best by state.
    if (!adminView) shaped.sort(compareProgrammes);

    res.json({
      success: true,
      programmes: shaped,
    });
  } catch (error) {
    console.error('Get committee programmes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programmes',
    });
  }
};

// ─── POST /api/committees/:id/programmes ────────────────────────────────────
export const createProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const { values, error: validationError } = readProgrammeBody(req.body);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!values.name) {
      return res.status(400).json({ success: false, message: 'A programme needs a name' });
    }

    const { data: committee, error: committeeError } = await supabase
      .from('committees')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (committeeError) {
      return res.status(400).json({ success: false, message: 'Failed to create programme' });
    }

    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee not found' });
    }

    // A new programme is a draft unless the admin explicitly publishes it, so
    // half-written work never reaches the public page by accident.
    const status = values.status || 'draft';
    const slug = await uniqueProgrammeSlug(id, values.name);

    let sortOrder = values.sort_order;
    if (sortOrder === undefined) {
      const { data: last } = await supabase
        .from('committee_programmes')
        .select('sort_order')
        .eq('committee_id', id)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      sortOrder = (last?.sort_order ?? -1) + 1;
    }

    const { data, error } = await supabase
      .from('committee_programmes')
      .insert({
        committee_id: id,
        name: values.name,
        slug,
        summary: values.summary ?? null,
        audience: values.audience ?? null,
        image_url: values.image_url ?? null,
        sort_order: sortOrder,
        status,
      })
      .select(PROGRAMME_COLUMNS)
      .single();

    if (error) {
      if (isDuplicateName(error)) {
        return res.status(409).json({
          success: false,
          message: `A programme called "${values.name}" already exists for this committee`,
        });
      }

      console.error('Create programme error:', error);
      return res.status(400).json({ success: false, message: 'Failed to create programme' });
    }

    res.status(201).json({
      success: true,
      programme: data,
    });
  } catch (error) {
    console.error('Create programme error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create programme',
    });
  }
};

// ─── PUT /api/committees/:id/programmes/:programmeId ────────────────────────
export const updateProgramme = async (req, res) => {
  try {
    const { id, programmeId } = req.params;
    const { values, error: validationError } = readProgrammeBody(req.body);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!Object.keys(values).length) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }

    // The slug follows the name: it is only a stable fragment for links, never
    // something the dashboard edits on its own.
    if (values.name) {
      values.slug = await uniqueProgrammeSlug(id, values.name, programmeId);
    }

    const { data, error } = await supabase
      .from('committee_programmes')
      .update(values)
      .eq('id', programmeId)
      .eq('committee_id', id)
      .select(PROGRAMME_COLUMNS)
      .maybeSingle();

    if (error) {
      if (isDuplicateName(error)) {
        return res.status(409).json({
          success: false,
          message: `A programme called "${values.name}" already exists for this committee`,
        });
      }

      console.error('Update programme error:', error);
      return res.status(400).json({ success: false, message: 'Failed to update programme' });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: 'Programme not found' });
    }

    res.json({
      success: true,
      programme: data,
    });
  } catch (error) {
    console.error('Update programme error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update programme',
    });
  }
};

// ─── DELETE /api/committees/:id/programmes/:programmeId ─────────────────────
export const deleteProgramme = async (req, res) => {
  try {
    const { id, programmeId } = req.params;

    const { count, error: countError } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('programme_id', programmeId);

    if (countError) {
      return res.status(400).json({ success: false, message: 'Failed to delete programme' });
    }

    const { data, error } = await supabase
      .from('committee_programmes')
      .delete()
      .eq('id', programmeId)
      .eq('committee_id', id)
      .select('id');

    if (error) {
      console.error('Delete programme error:', error);
      return res.status(400).json({ success: false, message: 'Failed to delete programme' });
    }

    if (!data?.length) {
      return res.status(404).json({ success: false, message: 'Programme not found' });
    }

    // Deleting the frame never deletes its sessions: the FK is ON DELETE SET
    // NULL, so those events stay on the calendar on their own. The count goes
    // back so the dashboard can say what happened instead of quietly orphaning
    // a term's worth of dates.
    res.json({
      success: true,
      unassigned_sessions: count || 0,
    });
  } catch (error) {
    console.error('Delete programme error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete programme',
    });
  }
};

// ─── PUT /api/committees/:id/programmes/reorder ─────────────────────────────
// The whole order at once, because a drag-and-drop list sends the list, not
// "move this one up by one" — the latter drifts when two admins reorder at the
// same time.
export const reorderProgrammes = async (req, res) => {
  try {
    const { id } = req.params;
    const order = Array.isArray(req.body) ? req.body : req.body?.order;

    if (!Array.isArray(order) || !order.length) {
      return res.status(400).json({
        success: false,
        message: 'Send an ordered array of programme ids',
      });
    }

    if (order.some((value) => typeof value !== 'string' || !value.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Every entry in the order must be a programme id',
      });
    }

    if (new Set(order).size !== order.length) {
      return res.status(400).json({
        success: false,
        message: 'The same programme id appears twice',
      });
    }

    const { data: existing, error } = await supabase
      .from('committee_programmes')
      .select('id')
      .eq('committee_id', id);

    if (error) {
      return res.status(400).json({ success: false, message: 'Failed to reorder programmes' });
    }

    const owned = new Set((existing || []).map((row) => row.id));
    if (order.some((programmeId) => !owned.has(programmeId))) {
      return res.status(400).json({
        success: false,
        message: 'That list contains a programme from another committee',
      });
    }

    // PostgREST has no batch update, so one small write per programme. Any
    // programme left out of the list keeps the order it already had.
    const results = await Promise.all(
      order.map((programmeId, index) =>
        supabase
          .from('committee_programmes')
          .update({ sort_order: index })
          .eq('id', programmeId)
          .eq('committee_id', id)
      )
    );

    if (results.some((result) => result.error)) {
      return res.status(400).json({ success: false, message: 'Failed to reorder programmes' });
    }

    res.json({
      success: true,
      reordered: order.length,
    });
  } catch (error) {
    console.error('Reorder programmes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder programmes',
    });
  }
};
// ─── POST /api/committees/:id/contact ──────────────────────────────────────
export const submitContactForm = async (req, res) => {
  try {
    const { id } = req.params;
    // Trim defensively even though the route validators already do: the
    // controller is the last stop before the values reach an inbox.
    const name = String(req.body?.name ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const message = String(req.body?.message ?? '').trim();
    const subject = String(req.body?.subject ?? '').trim() || 'General Inquiry';

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and message are required',
      });
    }

    // A newline in a subject line lets a value start extra mail headers, so
    // collapse them before the string reaches the transport.
    const headerSafeSubject = subject.replace(/[\r\n]+/g, ' ').trim();

    // Get committee email
    const { data: committee } = await supabase
      .from('committees')
      .select('name, email')
      .eq('id', id)
      .single();

    // Send email to committee email (or fallback to default LMSA address)
    const committeeEmail = committee?.email || process.env.DEFAULT_LMSA_EMAIL || 'info@lmsa.org';

    const committeeName = String(committee?.name || 'Committee').replace(/[\r\n]+/g, ' ').trim();

    await sendEmail({
      to: committeeEmail,
      subject: `[LMSA] New message for ${committeeName}: ${headerSafeSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(headerSafeSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message)}</p>
        <hr>
        <p style="color:#888">Sent via LMSA Website</p>
      `,
    });

    // Confirmation copy to the sender is a courtesy, not the point of this
    // endpoint — the message to the committee above already succeeded, so
    // don't fail the whole request if only this second email fails.
    try {
      await sendEmail({
        to: email,
        subject: `Your message to LMSA ${committeeName === 'Committee' ? '' : committeeName} has been received`,
        html: `
          <h2>We received your message!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for reaching out to the LMSA ${escapeHtml(committeeName)}. We'll get back to you as soon as possible.</p>
          <p><strong>Your message:</strong> ${escapeHtml(message)}</p>
          <p>Best regards,<br>LMSA Team</p>
        `,
      });
    } catch (confirmationError) {
      console.error('Contact form confirmation email failed (message to committee still sent):', confirmationError);
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
};

// ─── POST /api/committees/:id/subscribe ────────────────────────────────────
// Same shape the site-wide newsletter endpoints accept, so an address that is
// good for one subscription is good for the other.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = async (req, res) => {
  try {
    const { id } = req.params;
    // Trimmed and re-checked here as well as in the route validators: without
    // it, "   " was stored as a subscriber and "not-an-email" got this far.
    const email = String(req.body?.email ?? '').trim();

    if (!email || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email is required',
      });
    }

    // Upsert: if already subscribed, this is a no-op (unique constraint on committee_id + email)
    const { error } = await supabase
      .from('committee_subscribers')
      .upsert(
        { committee_id: id, email },
        { onConflict: 'committee_id,email' }
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to subscribe',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe',
    });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// COMMITTEE APPLICATIONS
//
// "Apply now" on /get-involved/committees used to be a button with no handler.
// This is the real flow: a member submits an application for one committee, an
// admin reviews it, and approving it seats the applicant on the committee.
//
// Capacity rules, in priority order:
//   1. `accepting_applications` false  -> closed, no applications accepted.
//   2. `application_deadline` in the past -> closed, with the date reported.
//   3. `openings > 0` acts as a hard cap on *approved* applications. Zero means
//      "no stated cap" (open recruitment), because the column defaults to 0 and
//      every existing committee would otherwise be full on day one.
// ═════════════════════════════════════════════════════════════════════════════

const VALID_APPLICATION_STATUSES = ['approved', 'rejected'];
const MAX_STATEMENT_LENGTH = 2000;

const today = () => new Date().toISOString().split('T')[0];

// ─── POST /api/committees/:slug/apply ────────────────────────────────────────
export const applyToCommittee = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;
    const { statement, year_level, phone, interests } = req.body || {};

    const trimmedStatement = typeof statement === 'string' ? statement.trim() : '';
    if (!trimmedStatement) {
      return res.status(400).json({
        success: false,
        message: 'Tell us why you want to join — a short statement is required',
      });
    }
    if (trimmedStatement.length > MAX_STATEMENT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Your statement must be ${MAX_STATEMENT_LENGTH} characters or fewer`,
      });
    }

    const { data: committee, error: committeeError } = await supabase
      .from('committees')
      .select('id, name, slug, status, accepting_applications, application_deadline, openings')
      .eq('slug', slug)
      .single();

    if (committeeError || !committee || committee.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Committee not found',
      });
    }

    if (!committee.accepting_applications) {
      return res.status(409).json({
        success: false,
        message: `${committee.name} is not accepting applications right now`,
      });
    }

    if (committee.application_deadline && committee.application_deadline < today()) {
      return res.status(409).json({
        success: false,
        message: `Applications for ${committee.name} closed on ${committee.application_deadline}`,
      });
    }

    // Duplicate guard — one live application per person per committee
    const { data: existing } = await supabase
      .from('committee_applications')
      .select('id, status')
      .eq('committee_id', committee.id)
      .eq('user_id', userId)
      .in('status', ['pending', 'approved'])
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          existing.status === 'approved'
            ? `You are already a member of ${committee.name}`
            : `You already have a pending application for ${committee.name}`,
      });
    }

    // Capacity check — openings > 0 caps approved applications
    if (committee.openings > 0) {
      const { count, error: countError } = await supabase
        .from('committee_applications')
        .select('id', { count: 'exact', head: true })
        .eq('committee_id', committee.id)
        .eq('status', 'approved');

      if (!countError && (count ?? 0) >= committee.openings) {
        return res.status(409).json({
          success: false,
          message: `${committee.name} has filled all ${committee.openings} of its open positions`,
        });
      }
    }

    const { data, error } = await supabase
      .from('committee_applications')
      .insert({
        committee_id: committee.id,
        user_id: userId,
        statement: trimmedStatement,
        year_level: year_level || null,
        phone: phone || null,
        interests: interests || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to submit your application',
      });
    }

    // Best-effort confirmation — never fails the submission (see T22: outbound
    // SMTP is blocked on Render, so email may be unverified in some environments)
    try {
      const { data: applicant } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', userId)
        .single();

      if (applicant?.email) {
        await sendEmail({
          to: applicant.email,
          subject: `Your application to ${committee.name}`,
          html: `
            <h1>Application received</h1>
            <p>Hi ${applicant.full_name},</p>
            <p>Your application to join <strong>${committee.name}</strong> has been received and is pending review.</p>
            ${committee.application_deadline ? `<p>The committee is reviewing applications through ${committee.application_deadline}.</p>` : ''}
            <p>You can withdraw it from the committee page if your plans change.</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Committee application confirmation email failed (submission still succeeded):', emailError);
    }

    res.status(201).json({
      success: true,
      application: data,
      committee: { id: committee.id, name: committee.name, slug: committee.slug },
    });
  } catch (error) {
    console.error('Apply to committee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit your application',
    });
  }
};

// ─── GET /api/committees/:id/applications ────────────────────────────────────
export const getApplications = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    let query = supabase
      .from('committee_applications')
      .select(`
        *,
        user:user_id ( id, full_name, email, year_level, student_id )
      `)
      .eq('committee_id', id)
      .order('submitted_at', { ascending: false });

    if (status && ['pending', 'approved', 'rejected', 'withdrawn'].includes(status)) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch applications',
      });
    }

    const applications = data.map(a => ({
      ...a,
      applicant_name: a.user?.full_name || null,
      applicant_email: a.user?.email || null,
      applicant_year_level: a.user?.year_level || null,
      applicant_student_id: a.user?.student_id || null,
      user: undefined,
    }));

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Get committee applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
};

// ─── PUT /api/committees/applications/:id ────────────────────────────────────
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body || {};

    if (!status || !VALID_APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${VALID_APPLICATION_STATUSES.join(', ')}`,
      });
    }

    const { data: application, error: fetchError } = await supabase
      .from('committee_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const { data, error } = await supabase
      .from('committee_applications')
      .update({
        status,
        review_notes: review_notes || null,
        reviewed_by: req.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update application',
      });
    }

    const { data: committee } = await supabase
      .from('committees')
      .select('id, name')
      .eq('id', application.committee_id)
      .single();

    // On approval, seat the applicant on the committee. Best-effort: the
    // application is approved either way, and a duplicate membership row is
    // not an error (unique on committee_id + user_id).
    if (status === 'approved') {
      const { error: memberError } = await supabase
        .from('committee_members')
        .upsert(
          {
            committee_id: application.committee_id,
            user_id: application.user_id,
            position: 'Member',
            left_at: null,
          },
          { onConflict: 'committee_id,user_id' }
        );

      if (memberError) {
        console.error('Failed to seat approved applicant on committee:', memberError);
      }
    }

    // Best-effort notification — must never fail the review action
    try {
      const { data: applicant } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', application.user_id)
        .single();

      if (applicant?.email) {
        await sendEmail({
          to: applicant.email,
          subject: status === 'approved'
            ? `Welcome to ${committee?.name || 'the committee'}`
            : 'Update on your committee application',
          html: status === 'approved'
            ? `
                <h1>You're in</h1>
                <p>Hi ${applicant.full_name},</p>
                <p>Your application to join <strong>${committee?.name}</strong> has been <strong>approved</strong>.</p>
                ${review_notes ? `<p><strong>Reviewer notes:</strong> ${review_notes}</p>` : ''}
                <p>The committee chair will be in touch with next steps.</p>
              `
            : `
                <h1>Committee application update</h1>
                <p>Hi ${applicant.full_name},</p>
                <p>Your application to join <strong>${committee?.name}</strong> was not approved this round.</p>
                ${review_notes ? `<p><strong>Reviewer notes:</strong> ${review_notes}</p>` : ''}
                <p>You are welcome to apply again next round.</p>
              `,
        });
      }
    } catch (emailError) {
      console.error('Committee application review email failed (review still succeeded):', emailError);
    }

    res.json({
      success: true,
      application: data,
    });
  } catch (error) {
    console.error('Update committee application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
    });
  }
};
