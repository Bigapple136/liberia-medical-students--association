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

    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        event:event_id (
          id, title, slug, description, event_type,
          location, venue, start_datetime, end_datetime,
          image_url, status
        ),
        registered_at
      `)
      .eq('user_id', userId)
      .gte('event.start_datetime', now)
      .order('event.start_datetime', { ascending: true })
      .limit(5);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to load upcoming events',
      });
    }

    // Flatten event data
    const events = (data || [])
      .filter(r => r.event)
      .map(r => ({
        ...r.event,
        registered_at: r.registered_at,
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
