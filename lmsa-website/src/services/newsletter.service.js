import api from './api';

export const newsletterService = {

  // ─── Public ─────────────────────────────────────────────────────────────

  /** Subscribe an email to the site-wide newsletter */
  async subscribe(email) {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  /** Unsubscribe an email (email-link-driven flow, not used in the footer UI) */
  async unsubscribe(email) {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  },
};
