import axios from 'axios';
import { API_URL } from '@utils/constants';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach the current Supabase session token.
//
// Previously this read a separately-maintained `lmsa_token` in
// localStorage, set only inside the login button's click handler. That
// went out of sync with Supabase's own (auto-persisted, auto-refreshed)
// session on every page load that wasn't the instant after clicking
// "Login" — a refresh, a new tab, revisiting later — causing every
// authenticated request to 401 even with a perfectly valid session,
// which in turn triggered a hard reload below, which hit the exact same
// problem again: an infinite reload loop. Reading the token live from
// Supabase's session on each request removes the second, driftable copy
// entirely.
api.interceptors.request.use(
  async config => {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    // Deliberately no hard redirect here (previously
    // `window.location.href = '/login'`). ProtectedRoute already handles
    // unauthenticated access via React Router's <Navigate>, driven by
    // AuthContext's `user` state — a full page reload on every 401 was
    // both redundant and, combined with the stale-token bug above, the
    // actual mechanism of the reload loop. A genuinely expired/invalid
    // session will naturally resolve to `user: null` via Supabase's own
    // auth state change events, and ProtectedRoute will redirect
    // normally without forcing a full app reload.
    return Promise.reject(error);
  }
);

export default api;