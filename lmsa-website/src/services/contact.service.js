import api from './api';

export const contactService = {

  // ─── Public ─────────────────────────────────────────────────────────────

  /** Submit a contact form message */
  async submit({ name, email, subject, message }) {
    const response = await api.post('/contact', { name, email, subject, message });
    return response.data;
  },
};
