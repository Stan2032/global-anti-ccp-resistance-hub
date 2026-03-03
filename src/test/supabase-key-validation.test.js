import { describe, it, expect } from 'vitest';
import { isServiceRoleKey } from '../services/supabaseClient.js';

/**
 * Tests for service_role key detection.
 *
 * Supabase JWTs have a "role" field in the payload.
 * The anon key has role:"anon", while the service_role key has role:"service_role".
 * We decode the JWT (without verification) to check this.
 */

// Helper: create a fake JWT with the given payload
function fakeJwt(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const sig = btoa('fake-signature');
  return `${header}.${body}.${sig}`;
}

describe('isServiceRoleKey', () => {
  it('returns true for a service_role JWT', () => {
    const key = fakeJwt({ role: 'service_role', iss: 'supabase', iat: 1 });
    expect(isServiceRoleKey(key)).toBe(true);
  });

  it('returns false for an anon JWT', () => {
    const key = fakeJwt({ role: 'anon', iss: 'supabase', iat: 1 });
    expect(isServiceRoleKey(key)).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isServiceRoleKey('')).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isServiceRoleKey(null)).toBe(false);
    expect(isServiceRoleKey(undefined)).toBe(false);
  });

  it('returns false for a non-JWT string', () => {
    expect(isServiceRoleKey('not-a-jwt')).toBe(false);
  });

  it('returns false for a JWT with no role field', () => {
    const key = fakeJwt({ iss: 'supabase', iat: 1 });
    expect(isServiceRoleKey(key)).toBe(false);
  });

  it('returns false for a JWT with role "authenticated"', () => {
    const key = fakeJwt({ role: 'authenticated', iss: 'supabase', iat: 1 });
    expect(isServiceRoleKey(key)).toBe(false);
  });

  it('handles base64url encoding (with - and _)', () => {
    // Create a payload that would produce - or _ in base64url
    const key = fakeJwt({ role: 'service_role', data: '>>>???<<<' });
    expect(isServiceRoleKey(key)).toBe(true);
  });
});
