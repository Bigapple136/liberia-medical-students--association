import api from './api';

export const membershipService = {

  // ─── Applicant actions (authenticated) ─────────────────────────────────

  /** Submit a membership application. Body: { membership_type } */
  async apply(membershipType) {
    const response = await api.post('/membership/apply', { membership_type: membershipType });
    return response.data.application;
  },

  /** Get the current user's most recent application (or null) */
  async getStatus() {
    const response = await api.get('/membership/status');
    return response.data.application;
  },

  // ─── Admin actions ──────────────────────────────────────────────────────

  /** List all applications (optional status filter: pending|approved|rejected) */
  async getAll(status) {
    const params = status && status !== 'all' ? { status } : {};
    const response = await api.get('/membership/applications', { params });
    return response.data.applications;
  },

  /** Get a single application by id */
  async getById(id) {
    const response = await api.get(`/membership/applications/${id}`);
    return response.data.application;
  },

  /** Approve or reject an application (admin) */
  async updateStatus(id, applicationStatus, reviewNotes) {
    const response = await api.put(`/membership/applications/${id}`, {
      application_status: applicationStatus,
      review_notes: reviewNotes || null,
    });
    return response.data.application;
  },
};
