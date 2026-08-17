import { createContext, useState, useEffect, useContext } from 'react';
import api from '@services/api';
import { authService } from '@services/auth.service';
import { supabase } from '@services/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

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

  const value = {
    user,
    loading,
    login: authService.login,
    logout: authService.logout,
    register: authService.register,
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
