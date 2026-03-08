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
import supabase, { isSupabaseConfigured } from './supabaseClient';
import { encryptSubmission } from '../utils/encryption';

/** Standard result returned by write operations. */
export interface SupabaseResult {
  /** Returned row(s), or null on error */
  data: Record<string, unknown> | Record<string, unknown>[] | null;
  /** Error message, or null on success */
  error: string | null;
}

/** Paginated result returned by read operations. */
export interface PaginatedResult {
  /** Returned rows, or null on error */
  data: Record<string, unknown>[] | null;
  /** Total row count (for pagination) */
  count?: number | null;
  /** Error message, or null on success */
  error: string | null;
}

/** Incident report submission payload. */
export interface IncidentReport {
  title: string;
  description: string;
  incidentType?: string;
  location?: string;
  dateOfIncident?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  sourceUrl?: string;
  contactEmail?: string;
}

/** Volunteer sign-up submission payload. */
export interface VolunteerData {
  name: string;
  email: string;
  skills?: string[];
  languages?: string[];
  availability?: string;
  message?: string;
}

/** Contact message submission payload. */
export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/** Pagination and sorting options for fetchRows. */
export interface FetchRowsOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
}

const NOT_CONFIGURED: SupabaseResult & PaginatedResult = {
  data: null,
  error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  count: null,
};

// ─── INCIDENT REPORTS ────────────────────────────────────────────────

/**
 * Submit an incident report.
 * Writes to the `incident_reports` table (see SUPABASE_SETUP.md for schema).
 * PII fields (contact_email, description, location) are encrypted before storage.
 */
export async function submitIncidentReport(report: IncidentReport): Promise<SupabaseResult> {
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

  const { data, error } = await supabase!
    .from('incident_reports')
    .insert([encrypted])
    .select();

  return { data, error: error?.message || null };
}

// ─── VOLUNTEER SIGN-UPS ──────────────────────────────────────────────

/**
 * Submit a volunteer sign-up.
 * PII fields (name, email, message) are encrypted before storage.
 */
export async function submitVolunteerSignup(volunteer: VolunteerData): Promise<SupabaseResult> {
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

  const { data, error } = await supabase!
    .from('volunteer_signups')
    .insert([encrypted])
    .select();

  return { data, error: error?.message || null };
}

// ─── NEWSLETTER SUBSCRIPTIONS ────────────────────────────────────────

/**
 * Subscribe to the newsletter.
 * Uses upsert to avoid duplicate entries for the same email.
 */
export async function subscribeNewsletter(email: string): Promise<SupabaseResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const { data, error } = await supabase!
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
 */
export async function submitContactMessage(message: ContactMessage): Promise<SupabaseResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const row = {
    name: message.name,
    email: message.email,
    subject: message.subject || null,
    message: message.message,
  };

  const encrypted = await encryptSubmission(row, ['name', 'email', 'message']);

  const { data, error } = await supabase!
    .from('contact_messages')
    .insert([encrypted])
    .select();

  return { data, error: error?.message || null };
}

// ─── READ HELPERS (public data) ──────────────────────────────────────

/**
 * Fetch a paginated list of rows from any public table.
 * Caller is responsible for RLS policies allowing this.
 */
export async function fetchRows(
  table: string,
  { page = 1, pageSize = 25, orderBy = 'created_at', ascending = false }: FetchRowsOptions = {}
): Promise<PaginatedResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase!
    .from(table)
    .select('*', { count: 'exact' })
    .order(orderBy, { ascending })
    .range(from, to);

  return { data, count, error: error?.message || null };
}
