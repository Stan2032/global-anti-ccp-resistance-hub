/**
 * Client-Side Encryption for PII Protection
 *
 * Uses the Web Crypto API (built into all modern browsers) to encrypt
 * sensitive fields BEFORE they leave the user's browser. This provides
 * defense-in-depth: even if the database is breached, PII remains encrypted.
 *
 * Encryption model: Hybrid RSA-OAEP + AES-GCM
 *   1. A random AES-256-GCM key is generated per submission
 *   2. Each PII field is encrypted with AES-GCM
 *   3. The AES key is encrypted with the admin's RSA public key
 *   4. Only the admin with the private key can decrypt submissions
 *
 * Configuration:
 *   Set VITE_ENCRYPTION_PUBLIC_KEY in your .env file with the admin's
 *   RSA public key in JWK format (base64-encoded JSON).
 *   If not set, data is sent unencrypted (graceful degradation).
 *
 * Key generation: See BACKEND_GUIDE.md for instructions.
 */

const ENCRYPTION_KEY_ENV = import.meta.env.VITE_ENCRYPTION_PUBLIC_KEY || '';

/**
 * Returns true when a public encryption key is configured.
 */
export function isEncryptionConfigured() {
  return ENCRYPTION_KEY_ENV.length > 0;
}

/**
 * Import the admin's RSA public key from the environment variable.
 * The key is expected as a base64-encoded JWK string.
 */
async function importPublicKey() {
  if (!isEncryptionConfigured()) return null;

  try {
    const jwkJson = atob(ENCRYPTION_KEY_ENV);
    const jwk = JSON.parse(jwkJson);
    return await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['wrapKey']
    );
  } catch {
    console.warn('[encryption] Failed to import public key — data will be sent unencrypted.');
    return null;
  }
}

/**
 * Generate a random AES-256-GCM key for this submission.
 */
async function generateAESKey() {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,   // extractable — so we can wrap it with RSA
    ['encrypt']
  );
}

/**
 * Encrypt a single string value using AES-256-GCM.
 * Returns { ciphertext, iv } as base64 strings.
 */
async function encryptValue(aesKey, plaintext) {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoder.encode(plaintext)
  );
  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * Wrap (encrypt) the AES key with the admin's RSA public key.
 * Returns the wrapped key as a base64 string.
 */
async function wrapAESKey(rsaPublicKey, aesKey) {
  const wrapped = await crypto.subtle.wrapKey('raw', aesKey, rsaPublicKey, {
    name: 'RSA-OAEP',
  });
  return arrayBufferToBase64(wrapped);
}

/**
 * Encrypt specified fields in a submission object.
 *
 * @param {Object} data - The form data object
 * @param {string[]} fieldsToEncrypt - Array of field names containing PII
 * @returns {Object} The data object with PII fields replaced by encrypted values,
 *                   plus an `_encryption` metadata field.
 *
 * If encryption is not configured, returns the original data unchanged.
 */
export async function encryptSubmission(data, fieldsToEncrypt) {
  if (!isEncryptionConfigured()) return data;

  const rsaPublicKey = await importPublicKey();
  if (!rsaPublicKey) return data;

  try {
    const aesKey = await generateAESKey();
    const encryptedData = { ...data };

    for (const field of fieldsToEncrypt) {
      if (encryptedData[field] && typeof encryptedData[field] === 'string') {
        encryptedData[field] = await encryptValue(aesKey, encryptedData[field]);
      }
    }

    const wrappedKey = await wrapAESKey(rsaPublicKey, aesKey);

    encryptedData._encryption = {
      version: 1,
      algorithm: 'RSA-OAEP+AES-256-GCM',
      wrappedKey,
      encryptedFields: fieldsToEncrypt.filter(f => data[f] && typeof data[f] === 'string'),
    };

    return encryptedData;
  } catch {
    console.warn('[encryption] Encryption failed — sending unencrypted.');
    return data;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default { isEncryptionConfigured, encryptSubmission };
