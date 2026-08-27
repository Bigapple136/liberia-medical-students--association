import api from './api';

export const dashboardService = {

  // ─── Authenticated ──────────────────────────────────────────────────────

  /** Get the logged-in user's dashboard stats */
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data.stats;
  },

  /** Get upcoming events this user is registered for (max 5) */
  async getMyUpcomingEvents() {
    const response = await api.get('/dashboard/my-events');
    return response.data.events;
  },
};
