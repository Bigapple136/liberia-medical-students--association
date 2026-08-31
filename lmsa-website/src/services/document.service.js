import api from './api';

export const documentService = {

  // ─── Public ─────────────────────────────────────────────────────────────

  /** Get general documents (supports ?category= filter) */
  async getAll(params = {}) {
    const response = await api.get('/documents', { params });
    return response.data.documents;
  },

  /** Get file URL and increment download count, then trigger browser download */
  async download(id) {
    const response = await api.get(`/documents/${id}/download`);
    const { file_url } = response.data;
    if (file_url) {
      window.open(file_url, '_blank');
    }
    return file_url;
  },

  // ─── Admin ──────────────────────────────────────────────────────────────

  /** Get all general documents regardless of access level (admin) */
  async getAllAdmin() {
    const response = await api.get('/documents/admin/all');
    return response.data.documents;
  },

  /** Create a new general document (admin) */
  async create(docData) {
    const response = await api.post('/documents', docData);
    return response.data.document;
  },

  /** Delete a general document (admin) */
  async delete(id) {
    await api.delete(`/documents/${id}`);
  },
};
