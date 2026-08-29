import { supabase } from '../config/supabase.js';

// ─── GET /api/dashboard/stats ───────────────────────────────────────────────
export const getMyStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count events this user is registered for
    const { count: events_registered_count, error: eventsError } = await supabase
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (eventsError) {
      console.error('Dashboard stats — events count error:', eventsError);
    }

    // Count committees this user is an active member of
    const { count: committees_count, error: committeesError } = await supabase
      .from('committee_members')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('left_at', null);

    if (committeesError) {
      console.error('Dashboard stats — committees count error:', committeesError);
    }

    res.json({
      success: true,
      stats: {
        membership_status: req.user.membership_status || null,
        events_registered_count: events_registered_count ?? 0,
        committees_count: committees_count ?? 0,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard stats',
    });
  }
};

// ─── GET /api/dashboard/my-events ──────────────────────────────────────────
export const getMyUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date().toISOString();

    // Query FROM events (not event_registrations), inner-joining
    // event_registrations filtered to this user. This targets
    // start_datetime as a column on the BASE table being queried, which
    // PostgREST fully and unambiguously supports for filtering/ordering.
    //
    // The original version queried FROM event_registrations and tried to
    // filter/order by `event.start_datetime` -- a column on the *embedded*
    // resource, not the base table. PostgREST's support for ordering the
    // outer result set by an embedded resource's column is limited/
    // inconsistent, and this was very likely erroring out at the query
    // level rather than just returning wrong results -- which, combined
    // with DashboardPage.jsx's Promise.all (one rejected call fails the
    // whole batch), explains both reported symptoms: registered events
    // never showing up, AND the whole portal failing to load with
    // "Failed to load portal data."
    const { data, error } = await supabase
      .from('events')
      .select(`
        id, title, slug, description, event_type,
        location, venue, start_datetime, end_datetime,
        image_url, status,
        event_registrations!inner(registered_at, user_id)
      `)
      .eq('event_registrations.user_id', userId)
      .gte('start_datetime', now)
      .order('start_datetime', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Get my upcoming events query error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to load upcoming events',
      });
    }

    // Flatten: pull registered_at out of the nested event_registrations
    // array (inner-joined + filtered to this user, so at most one row)
    // and drop the nested field from the final shape.
    const events = (data || []).map(({ event_registrations, ...event }) => ({
      ...event,
      registered_at: event_registrations?.[0]?.registered_at ?? null,
    }));

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Get my upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load upcoming events',
    });
  }
};
