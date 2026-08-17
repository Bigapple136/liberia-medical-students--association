import { supabase } from '../config/supabase.js';

// ─── GET /api/events ──────────────────────────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('start_datetime', { ascending: true });

    const { type, status, upcoming } = req.query;

    if (type) {
      query = query.eq('event_type', type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (upcoming === 'true') {
      query = query.gte('start_datetime', new Date().toISOString());
    }

    const { data, error } = await query;

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

    // Get registration count
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', data.id);

    res.json({
      success: true,
      event: {
        ...data,
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
        registration_deadline: registration_deadline || null,
        fee: fee || 0,
        image_url,
        committee_id: committee_id || null,
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
      committee_id, status,
    } = req.body;

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
        max_attendees,
        registration_deadline,
        fee,
        image_url,
        committee_id,
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
