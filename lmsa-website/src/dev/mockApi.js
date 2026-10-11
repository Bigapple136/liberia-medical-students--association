// Dev-only API stub for the admin UI preview harness (T42 rework).
// Aliased over '@services/api' ONLY when Vite runs with --mode preview
// (see vite.config.js); a production build never resolves this file.
// Exports the default axios-like surface the app expects, returning the
// mock profile for /users/me so AuthContext's fetchProfile() merge yields
// role: super_admin.
const mockUser = {
  id: 'preview-user',
  email: 'stone@lmsa.org.lr',
  full_name: 'Stone Kollie',
  role: 'super_admin',
  membership_status: 'active',
};

const respond = (url, getBody) => ({
  data: getBody,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { url },
});

const api = {
  get: async (url) => {
    if (url === '/users/me') return respond(url, { user: mockUser });
    return respond(url, {});
  },
  post: async (url) => respond(url, {}),
  put: async (url) => respond(url, {}),
  patch: async (url) => respond(url, {}),
  delete: async (url) => respond(url, {}),
};

export default api;
