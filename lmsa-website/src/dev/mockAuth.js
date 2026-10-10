// Port T42's dev-only mock auth for the admin UI preview harness (T42 rework).
// The preview entry imports this BEFORE AuthContext/services, so the
// `supabase` and `api` singletons resolve to these stubs everywhere.
// Loaded only by admin-preview.html, never by the production entry, and
// stripped from dist builds (nothing in src/ outside src/dev imports it).

export const supabase = null;

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
