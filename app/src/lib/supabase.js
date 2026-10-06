import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Nos testes automáticos a página recebe um Supabase de mentira.
export function getSupabase() {
  if (typeof window !== 'undefined' && window.__FAKE_SUPABASE__) return window.__FAKE_SUPABASE__;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
}
