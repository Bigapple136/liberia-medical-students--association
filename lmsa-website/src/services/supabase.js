import { createClient } from '@supabase/supabase-js';
import { authStorage } from './authStorage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// `storage` lets the session land in localStorage or sessionStorage depending
// on the sign-in form's "Remember me" choice — see authStorage.js.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { storage: authStorage },
    })
  : null;

export const isSupabaseConfigured = Boolean(supabase);