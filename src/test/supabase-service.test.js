import { describe, it, expect, vi } from 'vitest';

// Mock import.meta.env before importing the modules
vi.stubEnv('VITE_SUPABASE_URL', '');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

describe('Supabase Service (no credentials)', () => {
  it('isSupabaseConfigured returns false when env vars are empty', async () => {
    const { isSupabaseConfigured } = await import('../services/supabaseClient.js');
    expect(isSupabaseConfigured()).toBe(false);
  });

  it('supabase client is null when not configured', async () => {
    const { default: supabase } = await import('../services/supabaseClient.js');
    expect(supabase).toBeNull();
  });

  it('submitIncidentReport returns graceful error when not configured', async () => {
    const { submitIncidentReport } = await import('../services/supabaseService.js');
    const result = await submitIncidentReport({ title: 'Test', description: 'Test' });
    expect(result.data).toBeNull();
    expect(result.error).toContain('not configured');
  });

  it('submitVolunteerSignup returns graceful error when not configured', async () => {
    const { submitVolunteerSignup } = await import('../services/supabaseService.js');
    const result = await submitVolunteerSignup({ name: 'Test', email: 'test@test.com' });
    expect(result.data).toBeNull();
    expect(result.error).toContain('not configured');
  });

  it('subscribeNewsletter returns graceful error when not configured', async () => {
    const { subscribeNewsletter } = await import('../services/supabaseService.js');
    const result = await subscribeNewsletter('test@test.com');
    expect(result.data).toBeNull();
    expect(result.error).toContain('not configured');
  });

  it('submitContactMessage returns graceful error when not configured', async () => {
    const { submitContactMessage } = await import('../services/supabaseService.js');
    const result = await submitContactMessage({ name: 'Test', email: 'test@test.com', message: 'Hello' });
    expect(result.data).toBeNull();
    expect(result.error).toContain('not configured');
  });

  it('fetchRows returns graceful error when not configured', async () => {
    const { fetchRows } = await import('../services/supabaseService.js');
    const result = await fetchRows('incident_reports');
    expect(result.data).toBeNull();
    expect(result.error).toContain('not configured');
  });
});
