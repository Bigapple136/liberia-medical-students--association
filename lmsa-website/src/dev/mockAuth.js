// Dev-only mock auth for the admin UI preview harness (T42 rework).
// Loaded (via a mode-gated vite alias on '@services/supabase') only by
// admin-preview.html, so the same module object that AuthContext imports as
// `supabase` resolves to these stubs. `supabase: null` disables the real
// auth subscription in AuthContext's boot effect — exactly the branch an
// un-configured deployment already exercises — and a dev-only preview entry
// then populates the session through AuthContext's public API. The real
// auth.service keeps its own imports; the `api` stub mostly serves modules
// that also import it in preview mode. Never shipped: normal `dev` and all
// production builds resolve the real src/services/*.js files.

// A stub with the exact shape AuthContext touches: onAuthStateChange.
// AuthContext subscribes; The stub immediately reports a live session for a
// mock user, so the context behaves exactly as it would with Supabase,
// including running fetchProfile() through the (also mocked) api stub.
const mockUser = {
  id: 'preview-user',
  email: 'stone@lmsa.org.lr',
  full_name: 'Stone Kollie',
  role: 'super_admin',
  membership_status: 'active',
};

export const supabase = {
  auth: {
    onAuthStateChange(callback) {
      // Initial-session emission, same contract as the real client.
      setTimeout(() => callback('INITIAL_SESSION', { user: mockUser }), 0);
      return {
        data: { subscription: { unsubscribe() {} } },
      };
    },
  },
};


export const api = {
  get: async (url) => {
    if (url === '/users/me') {
      return {
        data: {
          user: {
            id: 'preview-user',
            email: 'stone@lmsa.org.lr',
            full_name: 'Stone Kollie',
            role: 'super_admin',
            membership_status: 'active',
          },
        },
      };
    }
    return { data: {} };
  },
};
