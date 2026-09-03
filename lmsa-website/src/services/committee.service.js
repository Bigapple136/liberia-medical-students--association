import api from './api';
import { supabase } from './supabase';

export const committeeService = {

  // ─── Committee CRUD ──────────────────────────────────────────────────────

  /** Get all committees with member counts */
  async getAll() {
    const response = await api.get('/committees');
    return response.data.committees;
  },

  /** Get single committee by slug */
  async getBySlug(slug) {
    const response = await api.get(`/committees/${slug}`);
    return response.data.committee;
  },

  /** Update committee info (admin) */
  async update(id, data) {
    const response = await api.put(`/committees/${id}`, data);
    return response.data.committee;
  },

  // ─── Members ─────────────────────────────────────────────────────────────

  /** Get all members of a committee */
  async getMembers(committeeId) {
    const response = await api.get(`/committees/${committeeId}/members`);
    return response.data.members;
  },

  /** Add a user to a committee */
  async addMember(committeeId, { user_id, position }) {
    const response = await api.post(`/committees/${committeeId}/members`, { user_id, position });
    return response.data.member;
  },

  /** Remove a member from a committee */
  async removeMember(committeeId, memberId) {
    await api.delete(`/committees/${committeeId}/members/${memberId}`);
  },

  /** Update a member's role */
  async updateMemberRole(committeeId, memberId, position) {
    const response = await api.put(`/committees/${committeeId}/members/${memberId}`, { position });
    return response.data.member;
  },

  /** Search users to add as committee members */
  async searchUsers(query) {
    const response = await api.get('/users', { params: { search: query, limit: 10 } });
    return response.data.users;
  },

  // ─── Events ──────────────────────────────────────────────────────────────

  /** Get all events for a committee */
  async getEvents(committeeId) {
    const response = await api.get(`/committees/${committeeId}/events`);
    return response.data.events;
  },

  /** Create a new event linked to this committee */
  async createEvent(committeeId, eventData) {
    const response = await api.post(`/committees/${committeeId}/events`, eventData);
    return response.data.event;
  },

  /** Delete a committee event */
  async deleteEvent(committeeId, eventId) {
    await api.delete(`/committees/${committeeId}/events/${eventId}`);
  },

  // ─── Documents ───────────────────────────────────────────────────────────

  /** Get all documents for a committee */
  async getDocuments(committeeId) {
    const response = await api.get(`/committees/${committeeId}/documents`);
    return response.data.documents;
  },

  /** Upload a document to Supabase Storage and record in DB */
  async uploadDocument(committeeId, file, { title, category, access_level }) {
    if (!supabase) {
      throw new Error('File upload is temporarily unavailable. Please try again later.');
    }

    // 1. Upload file to Supabase Storage
    const fileName = `committees/${committeeId}/${Date.now()}-${file.name}`;
    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (storageError) throw storageError;

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // 3. Save record in DB
    const response = await api.post(`/committees/${committeeId}/documents`, {
      title,
      category,
      access_level,
      file_url: publicUrl,
      file_type: file.name.split('.').pop(),
      file_size: file.size,
    });

    return response.data.document;
  },

  /** Delete a document */
  async deleteDocument(committeeId, documentId) {
    await api.delete(`/committees/${committeeId}/documents/${documentId}`);
  },

  // ─── Announcements ───────────────────────────────────────────────────────

  /** Get announcements for a committee */
  async getAnnouncements(committeeId) {
    const response = await api.get(`/committees/${committeeId}/announcements`);
    return response.data.announcements;
  },

  /** Create a new announcement */
  async createAnnouncement(committeeId, { title, message, type, pinned }) {
    const response = await api.post(`/committees/${committeeId}/announcements`, {
      title, message, type, pinned,
    });
    return response.data.announcement;
  },

  /** Delete an announcement */
  async deleteAnnouncement(committeeId, announcementId) {
    await api.delete(`/committees/${committeeId}/announcements/${announcementId}`);
  },

  // ─── Achievements ────────────────────────────────────────────────────────

  /** Get achievements for a committee */
  async getAchievements(committeeId) {
    const response = await api.get(`/committees/${committeeId}/achievements`);
    return response.data.achievements;
  },

  /** Create a new achievement */
  async createAchievement(committeeId, { title, description, date, badge_emoji }) {
    const response = await api.post(`/committees/${committeeId}/achievements`, {
      title, description, date, badge_emoji,
    });
    return response.data.achievement;
  },

  /** Delete an achievement */
  async deleteAchievement(committeeId, achievementId) {
    await api.delete(`/committees/${committeeId}/achievements/${achievementId}`);
  },

  // ─── Public Interactions ─────────────────────────────────────────────────

  /** Submit a contact form message to a committee */
  async submitContactForm(committeeId, { name, email, subject, message }) {
    const response = await api.post(`/committees/${committeeId}/contact`, {
      name, email, subject, message,
    });
    return response.data;
  },

  /** Subscribe to committee newsletter/updates */
  async subscribeNewsletter(committeeId, email) {
    const response = await api.post(`/committees/${committeeId}/subscribe`, { email });
    return response.data;
  },

  // ─── Applications ────────────────────────────────────────────────────────

  /**
   * Apply to join a committee. Requires a logged-in member.
   *
   * Rejections from the API are the *expected* path as often as not — the
   * window may have closed, the committee may be full, or the member may
   * already have a live application — so every error is surfaced with the
   * server's own message rather than a generic one.
   */
  async applyToCommittee(slug, { statement, year_level, phone, interests }) {
    const response = await api.post(`/committees/${slug}/apply`, {
      statement,
      year_level,
      phone,
      interests,
    });
    return response.data;
  },

  /** List applications for one committee (admin) */
  async getApplications(committeeId, status) {
    const response = await api.get(`/committees/${committeeId}/applications`, {
      params: status ? { status } : undefined,
    });
    return response.data.applications;
  },

  /** Approve or reject an application (admin) */
  async updateApplicationStatus(applicationId, status, reviewNotes) {
    const response = await api.put(`/committees/applications/${applicationId}`, {
      status,
      review_notes: reviewNotes || null,
    });
    return response.data.application;
  },
};
