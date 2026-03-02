/**
 * Auth Service — Supabase Authentication
 *
 * Provides login, logout, session management, and admin role checking.
 * Uses the Supabase client from supabaseClient.js.
 */
import supabase, { isSupabaseConfigured } from './supabaseClient';

/**
 * Sign in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ user: object|null, error: string|null }}
 */
export async function signIn(email, password) {
  if (!isSupabaseConfigured()) {
    return { user: null, error: 'Supabase is not configured' };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  if (!isSupabaseConfigured()) return;
  await supabase.auth.signOut();
}

/**
 * Get the current session (null if not logged in).
 */
export async function getSession() {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Check if the currently authenticated user is an admin.
 * Queries the admin_users table — RLS ensures they can only see their own record.
 * @returns {boolean}
 */
export async function checkIsAdmin() {
  if (!isSupabaseConfigured()) return false;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error || !data) return false;
  return true;
}

/**
 * Subscribe to auth state changes.
 * @param {function} callback — receives (event, session)
 * @returns {{ unsubscribe: function }}
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured()) return { unsubscribe: () => {} };
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}
