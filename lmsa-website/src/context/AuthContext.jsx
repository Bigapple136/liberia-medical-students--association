import { createContext, useCallback, useState, useEffect, useContext } from 'react';
import api from '@services/api';
import { authService } from '@services/auth.service';
import { supabase } from '@services/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    // Fetch the full profile row (role, membership_status, etc.) from the
    // backend.  Merges those fields onto the Supabase auth user so downstream
    // components (e.g. ProtectedRoute) can read `user.role` directly.
    const fetchProfile = async (sessionUser) => {
      try {
        const { data } = await api.get('/users/me');
        if (mounted) {
          // Keep auth fields (id, email …) and layer the profile on top.
          setUser((prev) => ({ ...prev, ...data.user }));
        }
      } catch {
        // Network hiccup or backend unavailable — fall back to the bare
        // Supabase session user.  ProtectedRoute will correctly deny
        // role-gated access since `role` will be undefined.
        if (mounted) setUser(sessionUser);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // onAuthStateChange fires once at subscription time with the current
    // session (INITIAL_SESSION event), so we don't need a separate
    // getSession() call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          // A new session was detected (initial load, or a fresh sign-in /
          // token refresh after the first check already settled). Mark a
          // fetch as in-progress again so ProtectedRoute waits instead of
          // seeing the stale `loading: false` + `user: null` from the very
          // first page-load check — without this, navigating into a
          // protected route the instant login() resolves races the profile
          // fetch below and bounces the (actually logged-in) user back to
          // /login. fetchProfile's `finally` resets it once settled.
          setLoading(true);
          fetchProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Profile updates from the portal's profile page merge into the session
  // user so every consumer (shell identity chip, dashboards, welcome
  // headings) reflects a saved name/phone change without a re-fetch (spec §4.4.1).
  const updateUserProfile = useCallback((updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  }, []);

  const value = {
    user,
    loading,
    login: authService.login,
    logout: authService.logout,
    register: authService.register,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
