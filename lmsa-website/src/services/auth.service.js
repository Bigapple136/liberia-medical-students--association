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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    localStorage.setItem('lmsa_token', data.session.access_token);
    return data;
  },

  // Logout user
  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('lmsa_token');
  },

  // Get current user
  async getCurrentUser() {
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
