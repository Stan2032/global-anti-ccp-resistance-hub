/**
 * Supabase Service Layer
 *
 * Provides read/write helpers for the frontend to interact with Supabase tables.
 * All functions are safe to call even when Supabase is not configured —
 * they return { data: null, error: 'Supabase not configured' } gracefully.
 */
import supabase, { isSupabaseConfigured } from './supabaseClient.js';

const NOT_CONFIGURED = { data: null, error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };

// ─── INCIDENT REPORTS ────────────────────────────────────────────────

/**
 * Submit an incident report.
 * Writes to the `incident_reports` table (see SUPABASE_SETUP.md for schema).
 */
export async function submitIncidentReport(report) {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const { data, error } = await supabase
    .from('incident_reports')
    .insert([{
      title: report.title,
      description: report.description,
      incident_type: report.incidentType || null,
      location: report.location || null,
      date_of_incident: report.dateOfIncident || null,
      severity: report.severity || 'medium',
      source_url: report.sourceUrl || null,
      contact_email: report.contactEmail || null,
      status: 'pending',
    }])
    .select();

  return { data, error: error?.message || null };
}

// ─── VOLUNTEER SIGN-UPS ──────────────────────────────────────────────

/**
 * Submit a volunteer sign-up.
 */
export async function submitVolunteerSignup(volunteer) {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const { data, error } = await supabase
    .from('volunteer_signups')
    .insert([{
      name: volunteer.name,
      email: volunteer.email,
      skills: volunteer.skills || [],
      languages: volunteer.languages || [],
      availability: volunteer.availability || null,
      message: volunteer.message || null,
      status: 'pending',
    }])
    .select();

  return { data, error: error?.message || null };
}

// ─── NEWSLETTER SUBSCRIPTIONS ────────────────────────────────────────

/**
 * Subscribe to the newsletter.
 */
export async function subscribeNewsletter(email) {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert([{ email }], {
      onConflict: 'email',
      ignoreDuplicates: true,
    })
    .select();

  return { data, error: error?.message || null };
}

// ─── CONTACT FORM ────────────────────────────────────────────────────

/**
 * Submit a contact message.
 */
export async function submitContactMessage(message) {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{
      name: message.name,
      email: message.email,
      subject: message.subject || null,
      message: message.message,
    }])
    .select();

  return { data, error: error?.message || null };
}

// ─── READ HELPERS (public data) ──────────────────────────────────────

/**
 * Fetch a paginated list of rows from any public table.
 * Caller is responsible for RLS policies allowing this.
 */
export async function fetchRows(table, { page = 1, pageSize = 25, orderBy = 'created_at', ascending = false } = {}) {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact' })
    .order(orderBy, { ascending })
    .range(from, to);

  return { data, count, error: error?.message || null };
}
