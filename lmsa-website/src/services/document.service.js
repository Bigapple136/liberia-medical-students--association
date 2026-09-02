// ============================================
// FILE: src/services/document.service.js
// Service for general (non-committee) documents.
// Reuses the proven Supabase Storage upload + DB record pattern from
// committeeService.uploadDocument, but with no committee scope
// (committee_id is left null).
// ============================================
import api from './api';
import { supabase } from './supabase';

export const documentService = {

  // ─── Public ─────────────────────────────────────────────────────────────

  /** Get general documents (supports { category } filter) */
  async getAll(params = {}) {
    const response = await api.get('/documents', { params });
    return response.data.documents;
  },

  /**
   * Increment the download count, open the file in a new tab, and also
   * return the file_url in case the caller wants to do something else
   * with it (e.g. DocumentsAdminPage.jsx uses the return value directly;
   * the public DocumentsPage.jsx just relies on the window.open side
   * effect and ignores the return value — both are satisfied).
   */
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

  /** Upload a file to Supabase Storage and record it as a general document */
  async upload(file, { title, description, category, access_level }) {
    if (!supabase) {
      throw new Error('File upload is temporarily unavailable. Please try again later.');
    }

    // 1. Upload file to Supabase Storage
    const fileName = `general/${Date.now()}-${file.name}`;
    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (storageError) throw storageError;

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // 3. Save record in DB (committee_id left null = general/org-wide)
    const response = await api.post('/documents', {
      title,
      description,
      category,
      access_level,
      file_url: publicUrl,
      file_type: file.name.split('.').pop(),
      file_size: file.size,
    });

    return response.data.document;
  },

  /** Delete a general document (admin) */
  async deleteDocument(id) {
    await api.delete(`/documents/${id}`);
  },
};
