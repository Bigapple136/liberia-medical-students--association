import api from './api';
import { committeeService } from './committee.service';

export const executiveService = {

  // ─── Public ─────────────────────────────────────────────────────────────

  /** Get all active executive positions (public). Supports optional ?academic_year= filter. */
  async getAll(params) {
    const response = await api.get('/executive', { params });
    return response.data.positions;
  },

  // ─── Admin ──────────────────────────────────────────────────────────────

  /** Get all positions regardless of status (admin). */
  async getAllAdmin() {
    const response = await api.get('/executive/admin/all');
    return response.data.positions;
  },

  /** Create a new executive position (admin). */
  async create(positionData) {
    const response = await api.post('/executive', positionData);
    return response.data.position;
  },

  /** Update an executive position (admin). */
  async update(id, data) {
    const response = await api.put(`/executive/${id}`, data);
    return response.data.position;
  },

  /** Delete an executive position (admin). */
  async deletePosition(id) {
    await api.delete(`/executive/${id}`);
  },

  /** Search users by name or email (reuses committee search). */
  async searchUsers(query) {
    return committeeService.searchUsers(query);
  },
};
