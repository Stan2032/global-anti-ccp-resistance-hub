/**
 * Supabase Client Configuration
 *
 * Connects the frontend to a Supabase PostgreSQL backend.
 * Requires two environment variables set in .env (local) or your hosting dashboard:
 *   VITE_SUPABASE_URL  — your Supabase project URL (e.g. https://xyz.supabase.co)
 *   VITE_SUPABASE_ANON_KEY — the public "anon" key (safe to expose in client code)
 *
 * Usage:
 *   import supabase from '../services/supabaseClient';
 *   const { data, error } = await supabase.from('table').select('*');
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create the client if credentials are configured.
// This allows the site to build and run without Supabase (static-only mode).
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Returns true when Supabase credentials are configured and the client is available.
 */
export const isSupabaseConfigured = () => supabase !== null;

export default supabase;
