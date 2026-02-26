import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the encryption module in isolation by mocking import.meta.env
describe('Encryption utility', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_ENCRYPTION_PUBLIC_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('isEncryptionConfigured returns false when env var is empty', async () => {
    const { isEncryptionConfigured } = await import('../utils/encryption.js');
    expect(isEncryptionConfigured()).toBe(false);
  });

  it('encryptSubmission returns data unchanged when encryption is not configured', async () => {
    const { encryptSubmission } = await import('../utils/encryption.js');
    const data = { name: 'John', email: 'john@test.com', message: 'Hello' };
    const result = await encryptSubmission(data, ['name', 'email']);
    expect(result).toEqual(data);
    expect(result._encryption).toBeUndefined();
  });

  it('encryptSubmission does not modify non-string fields', async () => {
    const { encryptSubmission } = await import('../utils/encryption.js');
    const data = { name: 'John', skills: ['research', 'writing'], count: 42 };
    const result = await encryptSubmission(data, ['name', 'skills', 'count']);
    expect(result).toEqual(data);
  });

  it('encryptSubmission handles null/undefined fields gracefully', async () => {
    const { encryptSubmission } = await import('../utils/encryption.js');
    const data = { name: null, email: undefined, subject: '' };
    const result = await encryptSubmission(data, ['name', 'email', 'subject']);
    expect(result).toEqual(data);
  });

  it('isEncryptionConfigured returns true when env var is set', async () => {
    // Reset module cache to pick up new env
    vi.resetModules();
    vi.stubEnv('VITE_ENCRYPTION_PUBLIC_KEY', 'dGVzdC1rZXk=');
    const { isEncryptionConfigured } = await import('../utils/encryption.js');
    expect(isEncryptionConfigured()).toBe(true);
  });

  it('encryptSubmission returns data unchanged when public key is invalid', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_ENCRYPTION_PUBLIC_KEY', 'not-valid-base64-jwk');
    const { encryptSubmission } = await import('../utils/encryption.js');
    const data = { name: 'John', email: 'john@test.com' };
    const result = await encryptSubmission(data, ['name', 'email']);
    // Should gracefully fall back to unencrypted
    expect(result).toEqual(data);
  });
});
