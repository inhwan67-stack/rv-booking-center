import {
  hasSupabaseEnv,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabaseClient.js';

export function getSupabaseConfig() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    hasEnv: hasSupabaseEnv,
    isConfigured: isSupabaseConfigured,
  };
}

export { hasSupabaseEnv, isSupabaseConfigured, supabase };
