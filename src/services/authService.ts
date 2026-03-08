/**
 * Auth Service — Supabase Authentication
 *
 * Provides login, logout, session management, and admin role checking.
 * Uses the Supabase client from supabaseClient.
 */
import supabase, { isSupabaseConfigured } from './supabaseClient';
import type { AuthChangeEvent, Session, Subscription } from '@supabase/supabase-js';

/** Result returned by the sign-in operation. */
export interface SignInResult {
  user: Record<string, unknown> | null;
  error: string | null;
}

/** Sign in with email and password. */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  if (!isSupabaseConfigured()) {
    return { user: null, error: 'Supabase is not configured' };
  }
  const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user as unknown as Record<string, unknown>, error: null };
}

/** Sign out the current user. */
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await supabase!.auth.signOut();
}

/** Get the current session (null if not logged in). */
export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase!.auth.getSession();
  return data.session;
}

/**
 * Check if the currently authenticated user is an admin.
 * Queries the admin_users table — RLS ensures they can only see their own record.
 */
export async function checkIsAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { data: { user } } = await supabase!.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase!
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error || !data) return false;
  return true;
}

/**
 * Subscribe to auth state changes.
 * Callback receives (event, session).
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): Subscription | { unsubscribe: () => void } {
  if (!isSupabaseConfigured()) return { unsubscribe: () => {} };
  const { data } = supabase!.auth.onAuthStateChange(callback);
  return data.subscription;
}
