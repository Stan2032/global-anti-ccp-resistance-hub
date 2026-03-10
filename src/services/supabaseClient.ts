/**
 * Supabase Client Configuration
 *
 * Connects the frontend to a Supabase PostgreSQL backend.
 * Requires two environment variables set in .env (local) or your hosting dashboard:
 *   VITE_SUPABASE_URL  — your Supabase project URL (e.g. https://xyz.supabase.co)
 *   VITE_SUPABASE_ANON_KEY — the public "anon" key (safe to expose in client code)
 *
 * ⚠️  NEVER use the service_role key here — it bypasses RLS and must stay server-side.
 *     The anon key is the shorter one labelled "anon / public" in the Supabase dashboard.
 *
 * Usage:
 *   import supabase from '../services/supabaseClient';
 *   const { data, error } = await supabase.from('table').select('*');
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

/** Decoded JWT payload shape (minimal fields we inspect). */
interface JwtPayload {
  role?: string;
  [key: string]: unknown;
}

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Decode a JWT payload without verifying the signature.
 * Returns the parsed JSON payload, or null on failure.
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns true if the provided key is a Supabase service_role (secret) key.
 * These keys have `"role": "service_role"` in the JWT payload and must NEVER
 * be used in browser code — they bypass Row Level Security.
 */
export function isServiceRoleKey(key: string | undefined | null): boolean {
  if (!key) return false;
  const payload = decodeJwtPayload(key);
  return payload?.role === 'service_role';
}

// Block the most common misconfiguration: using the service_role (secret) key
// in the browser instead of the anon (public) key.
let _serviceRoleError = false;
if (supabaseAnonKey && isServiceRoleKey(supabaseAnonKey)) {
  _serviceRoleError = true;
  logger.error(
    'supabase',
    '❌ CRITICAL: You have set VITE_SUPABASE_ANON_KEY to the service_role (secret) key!\n' +
    'This key bypasses Row Level Security and must NEVER be exposed in browser code.\n\n' +
    'FIX: In your Supabase Dashboard → Settings → API, copy the key labelled "anon / public"\n' +
    '(NOT the one labelled "service_role / secret") and update your environment variable.\n\n' +
    'The Supabase client has been disabled to protect your data.'
  );
}

/** Returns true when the service_role key was accidentally used instead of anon. */
export const isServiceRoleKeyError = (): boolean => _serviceRoleError;

// Only create the client if credentials are configured AND the key is safe.
// This allows the site to build and run without Supabase (static-only mode).
const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && !_serviceRoleError
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/** Returns true when Supabase credentials are configured and the client is available. */
export const isSupabaseConfigured = (): boolean => supabase !== null;

export default supabase;
