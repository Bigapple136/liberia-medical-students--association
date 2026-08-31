import api from './api';
import { supabase } from './supabase';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  async login(email, password) {
    if (!supabase) {
      throw new Error('Member login is temporarily unavailable. Please try again later.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // No manual token storage needed — Supabase's client already persists
    // the session itself, and api.js now reads the current token directly
    // from that session on every request (see api.js for why the old
    // separately-tracked localStorage copy caused a reload loop).
    return data;
  },

  // Logout user
  async logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  // Get current user
  async getCurrentUser() {
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    return response.data;
  },
};
