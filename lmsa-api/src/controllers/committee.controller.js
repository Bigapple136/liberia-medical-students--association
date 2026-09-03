import { supabase } from '../config/supabase.js';
import { sendEmail } from '../config/email.js';

// ─── GET /api/committees ──────────────────────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('committees')
      .select(`
        *,
        chair:chair_id ( id, full_name, profile_photo_url, year_level ),
        member_count:committee_members(count)
      `)
      .eq('status', 'active')
      .order('name');

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch committees',
      });
    }

    // Flatten counts
    const committees = data.map(c => ({
      ...c,
      member_count: c.member_count?.[0]?.count ?? 0,
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

// ─── GET /api/committees/:slug ────────────────────────────────────────────────
export const getBySlug = async (req, res) => {
  try {
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

    res.json({
      success: true,
      committee: data,
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
    const { name, description, mandate, key_activities, email, meeting_schedule, chair_id, vice_chair_id, icon } = req.body;

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
      max_attendees, fee, image_url,
    } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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
        max_attendees: max_attendees || null,
        fee: fee || 0,
        image_url,
        committee_id: id,
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

    res.json({
      success: true,
      documents: data,
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

// ─── POST /api/committees/:id/contact ──────────────────────────────────────
export const submitContactForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and message are required',
      });
    }

    // Get committee email
    const { data: committee } = await supabase
      .from('committees')
      .select('name, email')
      .eq('id', id)
      .single();

    // Send email to committee email (or fallback to default LMSA address)
    const committeeEmail = committee?.email || process.env.DEFAULT_LMSA_EMAIL || 'info@lmsa.org';

    await sendEmail({
      to: committeeEmail,
      subject: `[LMSA] New message for ${committee?.name || 'Committee'}: ${subject || 'General Inquiry'}`,
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

    // Confirmation copy to the sender is a courtesy, not the point of this
    // endpoint — the message to the committee above already succeeded, so
    // don't fail the whole request if only this second email fails.
    try {
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
export const subscribe = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
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
