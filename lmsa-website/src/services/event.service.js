import api from './api';

export const eventService = {

  // ─── Event CRUD ───────────────────────────────────────────────────────

  /** Get all events (supports ?type=, ?status=, ?upcoming=true query params) */
  async getAll(params = {}) {
    const response = await api.get('/events', { params });
    return response.data.events;
  },

  /** Get single event by slug (includes registration_count) */
  async getBySlug(slug) {
    const response = await api.get(`/events/${slug}`);
    return response.data.event;
  },

  /** Create a new event (admin) */
  async create(eventData) {
    const response = await api.post('/events', eventData);
    return response.data.event;
  },

  /** Update an event (admin) */
  async update(id, data) {
    const response = await api.put(`/events/${id}`, data);
    return response.data.event;
  },

  /** Delete an event (admin) */
  async delete(id) {
    await api.delete(`/events/${id}`);
  },

  // ─── Registration ─────────────────────────────────────────────────────

  /** Register for an event (authenticated, idempotent) */
  async register(eventId) {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data.registration;
  },

  /** Unregister from an event (authenticated) */
  async unregister(eventId) {
    await api.delete(`/events/${eventId}/register`);
  },

  /** Get all registrations for an event (admin) */
  async getRegistrations(eventId) {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data.registrations;
  },
};
