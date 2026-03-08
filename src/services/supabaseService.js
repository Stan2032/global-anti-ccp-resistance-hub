/**
 * Supabase Service Layer
 *
 * Provides read/write helpers for the frontend to interact with Supabase tables.
 * All functions are safe to call even when Supabase is not configured —
 * they return { data: null, error: 'Supabase not configured' } gracefully.
 *
 * PII fields are encrypted client-side before storage when an encryption
 * public key is configured (see BACKEND_GUIDE.md).
 *
 * @module supabaseService
 */
import supabase, { isSupabaseConfigured } from './supabaseClient.js';
import { encryptSubmission } from '../utils/encryption.js';

/**
 * @typedef {Object} SupabaseResult
 * @property {Object|Object[]|null} data - Returned row(s), or null on error
 * @property {string|null} error - Error message, or null on success
 */

/**
 * @typedef {Object} PaginatedResult
 * @property {Object[]|null} data - Returned rows, or null on error
 * @property {number} [count] - Total row count (for pagination)
 * @property {string|null} error - Error message, or null on success
 */

const NOT_CONFIGURED = { data: null, error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };

// ─── INCIDENT REPORTS ────────────────────────────────────────────────

/**
 * Submit an incident report.
 * Writes to the `incident_reports` table (see SUPABASE_SETUP.md for schema).
 * PII fields (contact_email, description, location) are encrypted before storage.
 *
 * @param {Object} report - Incident report data
 * @param {string} report.title - Report title
 * @param {string} report.description - Incident description
 * @param {string} [report.incidentType] - Type of incident
 * @param {string} [report.location] - Location of incident
 * @param {string} [report.dateOfIncident] - Date of incident (ISO 8601)
 * @param {'critical'|'high'|'medium'|'low'} [report.severity='medium'] - Severity level
 * @param {string} [report.sourceUrl] - Source URL for verification
 * @param {string} [report.contactEmail] - Reporter's email (encrypted)
 * @returns {Promise<SupabaseResult>} Inserted row or error
 */
export async function submitIncidentReport(report) {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const row = {
    title: report.title,
    description: report.description,
    incident_type: report.incidentType || null,
    location: report.location || null,
    date_of_incident: report.dateOfIncident || null,
    severity: report.severity || 'medium',
    source_url: report.sourceUrl || null,
    contact_email: report.contactEmail || null,
    status: 'pending',
  };

  const encrypted = await encryptSubmission(row, ['contact_email', 'description', 'location']);

  const { data, error } = await supabase
    .from('incident_reports')
    .insert([encrypted])
    .select();

  return { data, error: error?.message || null };
}

// ─── VOLUNTEER SIGN-UPS ──────────────────────────────────────────────

/**
 * Submit a volunteer sign-up.
 * PII fields (name, email, message) are encrypted before storage.
 *
 * @param {Object} volunteer - Volunteer data
 * @param {string} volunteer.name - Volunteer's name (encrypted)
 * @param {string} volunteer.email - Volunteer's email (encrypted)
 * @param {string[]} [volunteer.skills] - List of skills
 * @param {string[]} [volunteer.languages] - Languages spoken
 * @param {string} [volunteer.availability] - Availability description
 * @param {string} [volunteer.message] - Personal message (encrypted)
 * @returns {Promise<SupabaseResult>} Inserted row or error
 */
export async function submitVolunteerSignup(volunteer) {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const row = {
    name: volunteer.name,
    email: volunteer.email,
    skills: volunteer.skills || [],
    languages: volunteer.languages || [],
    availability: volunteer.availability || null,
    message: volunteer.message || null,
    status: 'pending',
  };

  const encrypted = await encryptSubmission(row, ['name', 'email', 'message']);

  const { data, error } = await supabase
    .from('volunteer_signups')
    .insert([encrypted])
    .select();

  return { data, error: error?.message || null };
}

// ─── NEWSLETTER SUBSCRIPTIONS ────────────────────────────────────────

/**
 * Subscribe to the newsletter.
 * Uses upsert to avoid duplicate entries for the same email.
 *
 * @param {string} email - Subscriber's email address
 * @returns {Promise<SupabaseResult>} Upserted row or error
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
 * PII fields (name, email, message) are encrypted before storage.
 *
 * @param {Object} message - Contact message data
 * @param {string} message.name - Sender's name (encrypted)
 * @param {string} message.email - Sender's email (encrypted)
 * @param {string} [message.subject] - Message subject
 * @param {string} message.message - Message body (encrypted)
 * @returns {Promise<SupabaseResult>} Inserted row or error
 */
export async function submitContactMessage(message) {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const row = {
    name: message.name,
    email: message.email,
    subject: message.subject || null,
    message: message.message,
  };

  const encrypted = await encryptSubmission(row, ['name', 'email', 'message']);

  const { data, error } = await supabase
    .from('contact_messages')
    .insert([encrypted])
    .select();

  return { data, error: error?.message || null };
}

// ─── READ HELPERS (public data) ──────────────────────────────────────

/**
 * Fetch a paginated list of rows from any public table.
 * Caller is responsible for RLS policies allowing this.
 *
 * @param {string} table - Supabase table name
 * @param {Object} [options] - Pagination and sorting options
 * @param {number} [options.page=1] - Page number (1-based)
 * @param {number} [options.pageSize=25] - Rows per page
 * @param {string} [options.orderBy='created_at'] - Column to sort by
 * @param {boolean} [options.ascending=false] - Sort direction
 * @returns {Promise<PaginatedResult>} Paginated rows with count, or error
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
