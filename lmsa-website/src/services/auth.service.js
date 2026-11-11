import api from './api';
import { supabase } from './supabase';
import { setRememberSession } from './authStorage';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  //
  // `rememberMe` decides where the session is kept: recorded before the
  // request because Supabase writes the session during signInWithPassword.
  async login(email, password, rememberMe = false) {
    if (!supabase) {
      throw new Error('Member login is temporarily unavailable. Please try again later.');
    }

    setRememberSession(rememberMe);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // No manual token storage needed — Supabase's client already persists
    // the session to the storage chosen above, and api.js reads the current
    // token directly from that session on every request (see api.js for why
    // the old separately-tracked localStorage copy caused a reload loop).
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

  // Reset password — handled entirely client-side, using the active
  // Supabase session from login. This allows students to change their
  // password from within the portal without requesting a recovery link.
  // The recovery link flow (forgotPassword) is still available for
  // cases where the user has forgotten their current password.
  async changePassword(newPassword) {
    if (!supabase) {
      throw new Error('Password change is temporarily unavailable. Please try again later.');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    // Also update the local AuthContext user so the change is reflected
    // immediately without a page reload. Consumers (e.g. ProfilePage)
    // should call updateUserProfile on the returned data.
    return data;
  },
};
