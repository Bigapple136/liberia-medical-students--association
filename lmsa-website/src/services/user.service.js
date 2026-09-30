import api from './api';

export const userService = {
  /**
   * Update the signed-in member's profile (spec §4.4.1).
   *
   * The backend's PUT /users/me persists exactly full_name, phone, and bio
   * (see lmsa-api user.controller.js updateProfile) and returns the updated
   * row — so the form offers those three and nothing else.
   */
  async updateMe(profileData) {
    const response = await api.put('/users/me', profileData);
    return response.data.user;
  },
};
