import api from './api';

export const newsService = {

  // ─── Public ─────────────────────────────────────────────────────────────

  /** Get published posts (supports ?category=, ?page=, ?limit= query params) */
  async getAll(params = {}) {
    const response = await api.get('/news', { params });
    return { posts: response.data.posts, total: response.data.total };
  },

  /** Get single published post by slug (includes tags, increments views) */
  async getBySlug(slug) {
    const response = await api.get(`/news/${slug}`);
    return response.data.post;
  },

  /** Get all tags (public, for filter UI) */
  async getTags() {
    const response = await api.get('/news/tags');
    return response.data.tags;
  },

  // ─── Admin ──────────────────────────────────────────────────────────────

  /** Get all posts regardless of status (admin, supports ?status= filter) */
  async getAllAdmin(params = {}) {
    const response = await api.get('/news/admin/all', { params });
    return response.data.posts;
  },

  /** Create a new news post (admin) */
  async create(postData) {
    const response = await api.post('/news', postData);
    return response.data.post;
  },

  /** Update a news post (admin) */
  async update(id, data) {
    const response = await api.put(`/news/${id}`, data);
    return response.data.post;
  },

  /** Delete a news post (admin) */
  async delete(id) {
    await api.delete(`/news/${id}`);
  },
};
