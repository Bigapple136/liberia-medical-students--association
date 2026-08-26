import api from './api';

export const membershipService = {

  // ─── Applicant Actions ────────────────────────────────────────────────────

  /** Submit a membership application */
  async apply(membershipType) {
    const response = await api.post('/membership/apply', { membership_type: membershipType });
    return response.data.application;
  },

  /** Get current user's application status */
  async getStatus() {
    const response = await api.get('/membership/status');
    return response.data.application;
  },

  // ─── Admin Actions ────────────────────────────────────────────────────────

  /** Get all applications (admin), optional status filter */
  async getAll(status) {
    const params = status && status !== 'all' ? { status } : {};
    const response = await api.get('/membership/applications', { params });
    return response.data.applications;
  },

  /** Get a single application by ID (admin) */
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
