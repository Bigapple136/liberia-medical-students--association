import { supabase } from '../config/supabase.js';
import { normalizeMaxAttendees } from '../utils/helpers.js';
import { isUuid, resolveProgrammeAssignment } from '../utils/programmes.js';
import { deriveEventStatus } from '../utils/eventStatus.js';

const STAFF_ROLES = ['admin', 'executive', 'super_admin'];
const isStaffUser = (user) => STAFF_ROLES.includes(user?.role);

// ─── GET /api/events ──────────────────────────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('start_datetime', { ascending: true });

    const { type, status, upcoming, committee, programme } = req.query;

    if (type) {
      query = query.eq('event_type', type);
    }

    // The status filter is applied below, after the rows are read, because a
    // stored status is not always the true one — see deriveEventStatus.

    if (upcoming === 'true') {
      query = query.gte('start_datetime', new Date().toISOString());
    }

    // The committee page reads its sessions from here: GET
    // /api/committees/:id/events is behind auth, so an anonymous visitor can
    // only ever reach a committee's events through this list. Accepts a slug
    // (what the page has) or an id (what the dashboard has).
    if (committee) {
      let committeeId = committee;

      if (!isUuid(committee)) {
        const { data: row, error: committeeError } = await supabase
          .from('committees')
          .select('id')
          .eq('slug', committee)
          .maybeSingle();

        if (committeeError) {
          return res.status(400).json({
            success: false,
            message: 'Failed to fetch events',
          });
        }

        if (!row) {
          return res.status(404).json({
            success: false,
            message: 'Committee not found',
          });
        }

        committeeId = row.id;
      }

      query = query.eq('committee_id', committeeId);
    }

    if (programme) {
      query = query.eq('programme_id', programme);
    }

    // A draft programme hides its sessions from the public as well as itself —
    // otherwise next term's dates leak onto the calendar before they are
    // announced. Staff keep seeing everything, which is why this is decided
    // from the optional auth on the route rather than by the page.
    if (!isStaffUser(req.user)) {
      const { data: drafts } = await supabase
        .from('committee_programmes')
        .select('id')
        .eq('status', 'draft');

      const draftIds = (drafts || []).map((row) => row.id);

      if (draftIds.length) {
        // NOT IN alone would drop every one-off event too: NULL is never "in"
        // a list, so the OR keeps events that belong to no programme.
        query = query.or(
          `programme_id.is.null,programme_id.not.in.(${draftIds.join(',')})`
        );
      }
    }

    // A draft event has not been announced: an anonymous visitor does not see it
    // at all, rather than receiving it with `status: 'draft'` for the client to
    // hide. Staff keep the whole list, which the dashboard edits from.
    if (!isStaffUser(req.user)) {
      query = query.neq('status', 'draft');
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch events',
      });
    }

    // Attach registration_count per event (batched — one query for all
    // events' registrations, not N+1). Without this, EventsAdminPage.jsx's
    // list-view count always falls back to 0 until an admin manually
    // expands each event to fetch its registrations individually.
    // Mirrors the same fix applied to news.controller.js's getAllAdmin
    // for tag_ids.
    const eventIds = (data || []).map((e) => e.id);
    let countsByEvent = {};

    if (eventIds.length > 0) {
      const { data: regRows } = await supabase
        .from('event_registrations')
        .select('event_id')
        .in('event_id', eventIds);

      countsByEvent = (regRows || []).reduce((acc, row) => {
        acc[row.event_id] = (acc[row.event_id] || 0) + 1;
        return acc;
      }, {});
    }

    // `organizer_id` is a user id: no public surface renders it, and a public
    // response should carry no personal identifier. `registration_count` stays:
    // it is an aggregate that answers the one public question about it — is
    // there room for me — and both the event page and the symposia list read it.
    // Derived on read: `upcoming` is not a fact once the end time has gone by,
    // and nothing rewrites the column when it does. Without this an event sits
    // in the past still labelled Upcoming until somebody edits it by hand.
    const readable = (data || []).map((event) => {
      const visible = { ...event, status: deriveEventStatus(event) };
      delete visible.organizer_id;
      visible.registration_count = countsByEvent[event.id] || 0;
      return visible;
    });

    // Filtered here rather than in SQL for the same reason: a row stored as
    // 'upcoming' whose dates have passed has to answer to ?status=completed,
    // and must not answer to ?status=upcoming.
    const events = status
      ? readable.filter((event) => event.status === status)
      : readable;

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
    });
  }
};

// ─── GET /api/events/:slug ────────────────────────────────────────────────────
export const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // A draft event is not public, and guessing its slug must not confirm that
    // it exists — the same 404 as an unknown slug.
    if (data.status === 'draft' && !isStaffUser(req.user)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // A session of a draft programme is as unpublished as the programme: its
    // detail page must not reveal next term's dates to whoever guesses the slug.
    if (data.programme_id && !isStaffUser(req.user)) {
      const { data: programme } = await supabase
        .from('committee_programmes')
        .select('status')
        .eq('id', data.programme_id)
        .maybeSingle();

      if (programme?.status === 'draft') {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }
    }

    // Get registration count
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', data.id);

    const visibleEvent = { ...data, status: deriveEventStatus(data) };
    delete visibleEvent.organizer_id;

    res.json({
      success: true,
      event: {
        ...visibleEvent,
        registration_count: count ?? 0,
      },
    });
  } catch (error) {
    console.error('Get event by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
    });
  }
};

// ─── POST /api/events ────────────────────────────────────────────────────────
export const create = async (req, res) => {
  try {
    const {
      title, description, event_type, location, venue,
      start_datetime, end_datetime, registration_required,
      max_attendees, registration_deadline, fee, image_url, committee_id,
      programme_id,
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

    // A programme belongs to exactly one committee; assigning a session to
    // another committee's programme would put it on a page whose owner cannot
    // see or edit it.
    const assignment = await resolveProgrammeAssignment(programme_id, committee_id || null);
    if (assignment.error) {
      return res.status(400).json({
        success: false,
        message: assignment.error,
      });
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
        registration_deadline: registration_deadline || null,
        fee: fee || 0,
        image_url,
        committee_id: committee_id || null,
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
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
    });
  }
};

// ─── PUT /api/events/:id ──────────────────────────────────────────────────────
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, event_type, location, venue,
      start_datetime, end_datetime, registration_required,
      max_attendees, registration_deadline, fee, image_url,
      committee_id, status, programme_id,
    } = req.body;

    // Only touched when the key is sent: the status-only update issued right
    // after a create must not clear an existing capacity.
    let capacity;
    if (max_attendees !== undefined) {
      capacity = normalizeMaxAttendees(max_attendees);
      if (capacity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Max attendees must be a whole number of 0 or more',
        });
      }
    }

    // Changing the committee has to clear the programme, because a programme
    // belongs to one committee. The dashboard sends the whole event on save, so
    // "did the committee change" can only be answered against the stored row —
    // otherwise every ordinary edit would drop the session out of its
    // programme. Moving the session to another committee clears it.
    let programmeId;
    if (programme_id !== undefined || committee_id !== undefined) {
      let effectiveCommittee = committee_id || null;

      if (programme_id === undefined || committee_id === undefined) {
        const { data: existing } = await supabase
          .from('events')
          .select('committee_id')
          .eq('id', id)
          .maybeSingle();

        if (committee_id === undefined) {
          effectiveCommittee = existing?.committee_id || null;
        } else if (
          programme_id === undefined &&
          (existing?.committee_id || null) !== (committee_id || null)
        ) {
          programmeId = null;
        }
      }

      if (programmeId === undefined && programme_id !== undefined) {
        const assignment = await resolveProgrammeAssignment(programme_id, effectiveCommittee);
        if (assignment.error) {
          return res.status(400).json({
            success: false,
            message: assignment.error,
          });
        }
        programmeId = assignment.programmeId;
      }
    }

    const { data, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        event_type,
        location,
        venue,
        start_datetime,
        end_datetime,
        registration_required,
        max_attendees: capacity,
        registration_deadline,
        fee,
        image_url,
        committee_id,
        programme_id: programmeId,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update event',
      });
    }

    res.json({
      success: true,
      event: data,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
    });
  }
};

// ─── DELETE /api/events/:id ───────────────────────────────────────────────────
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

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
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
    });
  }
};

// ─── POST /api/events/:id/register ───────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if already registered (idempotent)
    const { data: existing } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.json({
        success: true,
        registration: existing,
      });
    }

    // Check max_attendees if set
    const { data: event } = await supabase
      .from('events')
      .select('max_attendees')
      .eq('id', id)
      .single();

    if (event?.max_attendees) {
      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

      if (count >= event.max_attendees) {
        return res.status(400).json({
          success: false,
          message: 'Event is full',
        });
      }
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: id,
        user_id: userId,
        registration_status: 'registered',
        payment_status: 'unpaid',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to register for event',
      });
    }

    res.status(201).json({
      success: true,
      registration: data,
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
    });
  }
};

// ─── DELETE /api/events/:id/register ─────────────────────────────────────────
export const unregister = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to unregister from event',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from event',
    });
  }
};

// ─── GET /api/events/:id/registrations ───────────────────────────────────────
export const getRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        id, registration_status, payment_status, payment_reference,
        attended, registered_at,
        user:user_id ( id, full_name, email, year_level, profile_photo_url )
      `)
      .eq('event_id', id)
      .order('registered_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch registrations',
      });
    }

    // Flatten user data
    const registrations = data.map(r => ({
      ...r.user,
      registration_id: r.id,
      registration_status: r.registration_status,
      payment_status: r.payment_status,
      payment_reference: r.payment_reference,
      attended: r.attended,
      registered_at: r.registered_at,
    }));

    res.json({
      success: true,
      registrations,
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
    });
  }
};
