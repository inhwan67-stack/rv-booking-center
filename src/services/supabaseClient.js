const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isConfigured: isSupabaseConfigured,
  };
}

// TODO: 실제 Supabase 연결 단계에서 @supabase/supabase-js를 설치한 뒤 아래 형태로 교체합니다.
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = null;
