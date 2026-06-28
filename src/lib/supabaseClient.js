import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseEnv = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key'),
);

function createSupabaseClient() {
  if (!hasSupabaseEnv) {
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Supabase client initialization failed:', error);
    return null;
  }
}

export const supabase = createSupabaseClient();
export const isSupabaseConfigured = Boolean(supabase);
