# Backend & Security Guide

This document evaluates free backend options for the Global Anti-CCP Resistance Hub,
explains the chosen security model, and provides setup instructions.

> **Context**: This site serves activists, dissidents, and human rights defenders who
> may face real-world danger if their personal information is exposed. Security is not
> optional — it is a fundamental requirement.

---

## Threat Model

**Who are we protecting?**
- People submitting incident reports about CCP harassment
- Volunteers providing their names and contact information
- Newsletter subscribers whose email addresses could identify them
- Anyone whose participation in anti-CCP activities could endanger them or their families

**What are the threats?**
- Database breach (external hacking or insider access)
- Legal compulsion (government demands for data)
- Network interception (man-in-the-middle attacks)
- Metadata analysis (identifying users by access patterns)

---

## Options Evaluated

### ✅ Supabase Free Tier (RECOMMENDED — Already Integrated)

| Feature | Details |
|---------|---------|
| **Cost** | Free — 500MB database, 1GB file storage, 50K monthly active users |
| **Encryption in transit** | TLS 1.2+ (HTTPS) for all connections |
| **Encryption at rest** | AES-256 on AWS infrastructure |
| **Access control** | Row Level Security (RLS) — users can INSERT but not READ |
| **Compliance** | SOC 2 Type II certified |
| **Infrastructure** | AWS, multiple regions (US, EU, Asia-Pacific) |
| **Already integrated** | Yes — all 4 forms are wired, RLS policies defined |

**Why Supabase wins:**
1. Already fully integrated in the codebase (zero migration work)
2. Free tier is generous enough for this project
3. RLS prevents any user from reading other submissions
4. Combined with client-side encryption (see below), provides defense-in-depth

### ❌ Cloudflare D1 (Evaluated, Not Chosen)

| Feature | Details |
|---------|---------|
| **Cost** | Free — 5GB storage, 5M reads/day, 100K writes/day |
| **Pros** | Already on Cloudflare for hosting; no new vendor |
| **Cons** | Requires writing Cloudflare Workers (serverless functions) and SQL migrations |
| **Why not** | Supabase is already integrated; switching would require rewriting all form services |

### ❌ Google Forms / Airtable / Formspree (Evaluated, Not Chosen)

| Feature | Details |
|---------|---------|
| **Cost** | Free tiers available |
| **Cons** | Data is readable by the service provider; no client-side encryption support |
| **Why not** | Unacceptable for sensitive activist data — no way to prevent provider access |

### ❌ Self-Hosted PostgreSQL (Evaluated, Not Chosen)

| Feature | Details |
|---------|---------|
| **Cost** | Free if you have a server; Docker Compose already exists in `backend/` |
| **Cons** | Requires server maintenance, security patching, backups |
| **Why not** | Operational burden too high for a volunteer-maintained project |

### ❌ No Backend / Remove Forms (Last Resort)

| Feature | Details |
|---------|---------|
| **Approach** | Replace all forms with links to established organizations |
| **Why not** | Forms serve a real purpose — incident reports, volunteer coordination |
| **Fallback** | The site already degrades gracefully when Supabase is not configured |

---

## Security Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  USER'S BROWSER                                                      │
│                                                                      │
│  1. User fills out form                                              │
│  2. encryption.js encrypts PII fields with admin's RSA public key    │
│     (name, email, message → AES-256-GCM → RSA-OAEP wrapped key)    │
│  3. Encrypted data sent via HTTPS to Supabase                        │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ HTTPS (TLS 1.2+)
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│  SUPABASE (PostgreSQL + RLS)                                         │
│                                                                      │
│  • Data stored as encrypted ciphertext                               │
│  • RLS: anon users can INSERT only, cannot SELECT/UPDATE/DELETE      │
│  • Supabase encrypts entire database at rest (AES-256)               │
│  • Even Supabase employees see only ciphertext for PII fields        │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ Admin accesses via Dashboard
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│  ADMIN (you)                                                         │
│                                                                      │
│  • Views submissions in Supabase Dashboard                           │
│  • Decrypts PII fields offline using private key                     │
│  • Private key NEVER leaves admin's machine                          │
└──────────────────────────────────────────────────────────────────────┘
```

### Defense-in-Depth Layers

1. **TLS/HTTPS** — Data encrypted in transit (browser → Supabase)
2. **Client-side encryption** — PII encrypted before it leaves the browser
3. **Row Level Security** — Database prevents users from reading others' data
4. **Encryption at rest** — Supabase/AWS encrypts the entire database on disk
5. **Key separation** — Only the admin holds the decryption key

### What This Means in Practice

- If Supabase is breached: Attackers see encrypted ciphertext, not names/emails
- If network is intercepted: TLS prevents reading, and PII is double-encrypted
- If a government demands data: Supabase can only hand over ciphertext
- If admin's machine is compromised: Only that one private key is at risk

---

## Setup Instructions

### Step 1: Set Up Supabase (Required)

Follow the existing [Supabase Setup Guide](SUPABASE_SETUP.md). It covers:
- Creating a Supabase project (free)
- Running the SQL to create tables and RLS policies
- Setting `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Step 2: Generate Encryption Keys (Recommended)

This creates an RSA key pair for client-side encryption. Run this in Node.js
(or any JavaScript runtime with Web Crypto API support):

```javascript
// generate-keys.mjs — Run with: node generate-keys.mjs
import { webcrypto } from 'node:crypto';
const { subtle } = webcrypto;

async function generateKeys() {
  const keyPair = await subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['wrapKey', 'unwrapKey']
  );

  const publicJWK = await subtle.exportKey('jwk', keyPair.publicKey);
  const privateJWK = await subtle.exportKey('jwk', keyPair.privateKey);

  const publicB64 = Buffer.from(JSON.stringify(publicJWK)).toString('base64');

  console.log('=== PUBLIC KEY (set as VITE_ENCRYPTION_PUBLIC_KEY) ===');
  console.log(publicB64);
  console.log('');
  console.log('=== PRIVATE KEY (save securely, NEVER commit or share) ===');
  console.log(JSON.stringify(privateJWK, null, 2));
  console.log('');
  console.log('IMPORTANT:');
  console.log('1. Set VITE_ENCRYPTION_PUBLIC_KEY in your .env or hosting dashboard');
  console.log('2. Save the private key in a secure location (password manager, encrypted file)');
  console.log('3. NEVER commit the private key to version control');
}

generateKeys();
```

### Step 3: Configure the Public Key

Add the base64-encoded public key to your environment:

**Local development** (`.env`):
```
VITE_ENCRYPTION_PUBLIC_KEY=eyJhbGciOiJSU0EtT0FFUCIs...
```

**Cloudflare Pages**:
Add as an environment variable in your Cloudflare dashboard.

### Step 4: Decrypting Submissions

When you need to read encrypted submissions, use this script with your private key:

```javascript
// decrypt-submission.mjs — Run with: node decrypt-submission.mjs
import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
const { subtle } = webcrypto;

// Load your private key (keep this file secure!)
const privateJWK = JSON.parse(readFileSync('private-key.json', 'utf-8'));

function base64ToArrayBuffer(b64) {
  const binary = Buffer.from(b64, 'base64');
  return binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
}

async function decrypt(encryptedField, wrappedKeyB64) {
  const privateKey = await subtle.importKey(
    'jwk', privateJWK,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false, ['unwrapKey']
  );

  const aesKey = await subtle.unwrapKey(
    'raw',
    base64ToArrayBuffer(wrappedKeyB64),
    privateKey,
    { name: 'RSA-OAEP' },
    { name: 'AES-GCM', length: 256 },
    false, ['decrypt']
  );

  const decrypted = await subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToArrayBuffer(encryptedField.iv) },
    aesKey,
    base64ToArrayBuffer(encryptedField.ciphertext)
  );

  return new TextDecoder().decode(decrypted);
}

// Example: decrypt a field from a Supabase row
// const row = { ... }; // fetched from Supabase
// const name = await decrypt(row.name, row._encryption.wrappedKey);
// console.log('Decrypted name:', name);
```

---

## Security Recommendations for Users

The following guidance is shown on all forms:

1. **Use a secure email provider** — ProtonMail, Tutanota, or similar
2. **Use Tor or a VPN** — Prevents network-level surveillance
3. **Use a pseudonym** — Where real name is not required
4. **Submit anonymously** — Incident and sighting reports default to anonymous
5. **Do not upload files** — No file upload is supported (by design)

---

## Data Minimization

Forms collect only what is necessary:

| Form | Required Fields | Optional Fields |
|------|----------------|-----------------|
| Contact | email, message | name, subject |
| Volunteer | email, availability | name, skills, message |
| Newsletter | email | (preferences stored client-side only) |
| Incident Report | description | type, location, date, email (anonymous by default) |

---

## FAQ

**Q: Is Supabase safe for activist data?**
A: With client-side encryption enabled, Supabase stores only ciphertext for PII fields.
Even Supabase employees cannot read the data. The encryption key never leaves your machine.

**Q: What if I don't set up encryption?**
A: The site works fine without it. Supabase still provides RLS (insert-only access),
TLS in transit, and AES-256 encryption at rest. Client-side encryption adds an extra layer.

**Q: What if Supabase shuts down?**
A: Export your data from the Supabase dashboard at any time. The SQL schema is in
`SUPABASE_SETUP.md` and can be recreated on any PostgreSQL database.

**Q: Can I switch to Cloudflare D1 later?**
A: Yes. The service layer (`supabaseService.js`) abstracts database access.
Replace the Supabase calls with D1 Worker calls and the rest of the app stays the same.

**Q: What about email delivery (newsletters, notifications)?**
A: Email delivery is a separate concern (deferred). The newsletter form stores subscriptions;
an email service (Resend, Postmark, or Mailgun free tier) can be added later.
