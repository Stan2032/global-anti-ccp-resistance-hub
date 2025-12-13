# Phase 0: Security Architecture
**Resistance Hub Redesigned - Complete Security Design**  
**Created:** December 3, 2025  
**Status:** Design Phase - Ready for Implementation

---

## Overview

This document defines the complete security architecture for the resistance-hub-redesigned platform. Given the sensitive nature of activism against the CCP, security is paramount.

**Security Principles:**
- **Defense in Depth** - Multiple layers of security
- **Zero Trust** - Verify everything, trust nothing
- **Least Privilege** - Users get minimum necessary access
- **Encryption Everywhere** - Data encrypted at rest and in transit
- **Audit Everything** - Track all important actions
- **Privacy First** - Minimize data collection and retention

---

## 1. Authentication & Authorization

### 1.1 Authentication Methods

#### JWT (JSON Web Tokens)

**Implementation:**
```javascript
// Token Structure
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user_id",
  "email": "user@example.com",
  "roles": ["user", "activist"],
  "iat": 1638532200,
  "exp": 1638535800,
  "iss": "resistancehub.org"
}

Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), SECRET)
```

**Token Lifecycle:**
- **Access Token:** 1 hour expiration
- **Refresh Token:** 30 days expiration
- **Token Rotation:** New access token issued every refresh
- **Token Revocation:** Tokens can be blacklisted immediately

**Security Measures:**
- Tokens signed with strong secret (256+ bits)
- Tokens stored in secure HTTP-only cookies (not localStorage)
- Token verification on every request
- Token blacklist for logout/revocation

#### Password Security

**Requirements:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, special characters
- No common passwords (checked against dictionary)
- No personally identifiable information

**Hashing:**
```javascript
// Using bcrypt with cost factor 12
bcrypt.hash(password, 12) // ~100ms per hash
```

**Password Reset:**
- Reset token valid for 1 hour only
- Reset token single-use
- Email verification required
- Old sessions invalidated on password change

#### Two-Factor Authentication (Future)

**Methods:**
- TOTP (Time-based One-Time Password) - Google Authenticator, Authy
- SMS (not recommended for activists due to SIM swap risks)
- Backup codes for account recovery

---

### 1.2 Authorization & Access Control

#### Role-Based Access Control (RBAC)

**Roles:**

| Role | Permissions | Use Case |
|------|-------------|----------|
| **admin** | Full platform access | Platform administrators |
| **moderator** | Content moderation, user management | Trust & safety team |
| **organizer** | Create/manage campaigns | Campaign leaders |
| **helper** | Offer help in community support | Volunteers |
| **user** | Basic features | Standard users |
| **activist** | Verified activist features | Verified activists |

**Permission Matrix:**

```
Resource          | Admin | Moderator | Organizer | Helper | User | Activist
Users             | CRUD  | RU        | -         | -      | R    | R
Campaigns         | CRUD  | RU        | CRU*      | -      | R    | R
Organizations     | CRUD  | RU        | -         | -      | R    | R
Intelligence      | CRUD  | RU        | -         | -      | R    | R
Support Requests  | CRUD  | RU        | -         | CRU*   | CRU* | CRU*
Channels          | CRUD  | RU        | -         | -      | CRU* | CRU*
Moderation        | CRUD  | CRUD      | -         | -      | -    | -

* = Own resources only
```

#### Row-Level Security (Future)

```sql
-- Users can only see their own data
CREATE POLICY user_isolation ON users
  USING (id = current_user_id());

-- Users can see public campaigns
CREATE POLICY campaign_visibility ON campaigns
  USING (status = 'public' OR created_by = current_user_id());
```

---

## 2. Data Protection

### 2.1 Encryption at Rest

#### Database Encryption

**PostgreSQL Encryption:**
```sql
-- Encrypt sensitive columns
ALTER TABLE users ADD COLUMN phone_encrypted BYTEA;
ALTER TABLE messages ADD COLUMN content_encrypted BYTEA;

-- Use pgcrypto extension
CREATE EXTENSION pgcrypto;

-- Encrypt on insert
INSERT INTO users (phone_encrypted) 
VALUES (pgp_sym_encrypt('1234567890', 'encryption_key'));

-- Decrypt on select
SELECT pgp_sym_decrypt(phone_encrypted, 'encryption_key') FROM users;
```

**Sensitive Fields to Encrypt:**
- Phone numbers
- Home addresses
- Payment information
- Message content
- Document content

#### File Encryption

**At-Rest Encryption:**
```javascript
// Using AES-256-GCM
const crypto = require('crypto');

function encryptFile(fileBuffer, encryptionKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
  
  let encrypted = cipher.update(fileBuffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    encrypted: encrypted.toString('hex'),
    authTag: authTag.toString('hex')
  };
}
```

### 2.2 Encryption in Transit

#### HTTPS/TLS

**Requirements:**
- TLS 1.3 minimum
- Strong cipher suites only
- Certificate pinning for mobile apps
- HSTS header (Strict-Transport-Security)

**Configuration:**
```nginx
# Nginx SSL configuration
ssl_protocols TLSv1.3 TLSv1.2;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS header
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

#### End-to-End Encryption (E2E)

**For Messages:**
```javascript
// Using TweetNaCl.js for E2E encryption
const nacl = require('tweetnacl');

// Generate key pair
const keyPair = nacl.box.keyPair();

// Encrypt message
const message = 'Secret message';
const nonce = nacl.randomBytes(24);
const encrypted = nacl.box(
  nacl.util.decodeUTF8(message),
  nonce,
  recipientPublicKey,
  senderSecretKey
);

// Send: nonce + encrypted message
const ciphertext = nacl.util.encodeBase64(
  nacl.util.encodeUTF8(nonce) + nacl.util.encodeUTF8(encrypted)
);

// Decrypt on receive
const decrypted = nacl.box.open(
  encrypted,
  nonce,
  senderPublicKey,
  recipientSecretKey
);
```

**Key Management:**
- Each user has a key pair
- Public key shared with contacts
- Private key stored securely (encrypted with user password)
- Key rotation every 90 days
- Compromised keys can be revoked immediately

---

## 3. API Security

### 3.1 Input Validation

**Validation Strategy:**
```javascript
// Using Joi for validation
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(12).required(),
  username: Joi.string().alphanum().min(3).max(30).required()
});

const { error, value } = schema.validate(req.body);
if (error) {
  return res.status(422).json({ error: error.details });
}
```

**Validation Rules:**
- Type checking (string, number, boolean, etc.)
- Length validation (min/max)
- Format validation (email, URL, phone)
- Whitelist validation (only allowed values)
- Sanitization (remove dangerous characters)

### 3.2 SQL Injection Prevention

**Parameterized Queries:**
```javascript
// SAFE - Using parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);

// UNSAFE - String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`; // NEVER DO THIS
```

### 3.3 CSRF Protection

**CSRF Token Implementation:**
```javascript
// Generate CSRF token
app.use(csrf({ cookie: false }));

// Include in forms
<form method="POST" action="/campaigns">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
</form>

// Verify on POST/PUT/DELETE
app.post('/campaigns', csrf(), (req, res) => {
  // Token automatically verified by middleware
});
```

**Token Rotation:**
- New token for each form
- Token valid for 1 hour
- Token tied to session

### 3.4 Rate Limiting

**Implementation:**
```javascript
const rateLimit = require('express-rate-limit');

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false
});

app.use(limiter);

// Stricter limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true // Don't count successful logins
});

app.post('/auth/login', loginLimiter, (req, res) => {
  // Login endpoint
});
```

**Rate Limit Strategy:**
- 100 requests/hour for anonymous users
- 1000 requests/hour for authenticated users
- 5 login attempts per 15 minutes
- 10 password reset attempts per hour
- 100 API requests per minute for bulk operations

### 3.5 API Key Security (Future)

**For Third-Party Integrations:**
```javascript
// Generate API key
const apiKey = crypto.randomBytes(32).toString('hex');
const apiKeyHash = bcrypt.hashSync(apiKey, 10);

// Store hash in database
await db.query(
  'INSERT INTO api_keys (user_id, key_hash, name) VALUES ($1, $2, $3)',
  [userId, apiKeyHash, 'Integration Name']
);

// Verify API key on request
const apiKey = req.headers['x-api-key'];
const keyHash = bcrypt.hashSync(apiKey, 10);
const valid = await db.query(
  'SELECT * FROM api_keys WHERE key_hash = $1',
  [keyHash]
);
```

---

## 4. Network Security

### 4.1 Firewall Rules

**Inbound Rules:**
- Allow HTTP (80) from anywhere
- Allow HTTPS (443) from anywhere
- Allow SSH (22) from admin IPs only
- Block all other ports

**Outbound Rules:**
- Allow HTTPS (443) to external services
- Allow DNS (53) for domain resolution
- Block all other outbound traffic

### 4.2 DDoS Protection

**Cloudflare/WAF:**
- Rate limiting at edge
- Bot detection and blocking
- Geographic IP blocking (if needed)
- Request filtering

**Application Level:**
- Request size limits (10MB max)
- Connection timeouts
- Request queue limits
- Graceful degradation under load

### 4.3 VPN/Proxy Detection (For Activists)

**Real VPN Detection:**
```javascript
// WebRTC leak detection
async function detectWebRTCLeak() {
  const peerConnection = new RTCPeerConnection({ iceServers: [] });
  const dataChannel = peerConnection.createDataChannel('test');
  
  peerConnection.createOffer().then(offer => {
    peerConnection.setLocalDescription(offer);
  });
  
  return new Promise((resolve) => {
    peerConnection.onicecandidate = (ice) => {
      if (!ice || !ice.candidate) return;
      const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
      const ipAddress = ipRegex.exec(ice.candidate.candidate)[1];
      resolve(ipAddress);
    };
  });
}

// DNS leak detection
async function detectDNSLeak() {
  const response = await fetch('https://dns.google/resolve?name=example.com');
  const data = await response.json();
  // Check if DNS is using VPN provider's servers
}

// IP geolocation check
async function checkIPGeolocation() {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  return {
    ip: data.ip,
    country: data.country_name,
    isVPN: data.is_vpn,
    isTor: data.is_tor
  };
}
```

---

## 5. Application Security

### 5.1 Dependency Management

**Vulnerability Scanning:**
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Automated scanning in CI/CD
snyk test
```

**Dependency Updates:**
- Weekly security updates
- Monthly feature updates
- Quarterly major version reviews
- Automated testing before merge

### 5.2 Code Security

**Static Analysis:**
```bash
# ESLint for code quality
npx eslint .

# SonarQube for security issues
sonar-scanner

# OWASP dependency check
dependency-check
```

**Secure Coding Practices:**
- No hardcoded secrets
- No console.log of sensitive data
- Input validation on all endpoints
- Output encoding to prevent XSS
- Parameterized queries for SQL

### 5.3 Logging & Monitoring

**What to Log:**
```javascript
// Authentication events
logger.info('User login', { userId, ip, timestamp });
logger.warn('Failed login attempt', { email, ip, timestamp });

// Authorization events
logger.info('User role changed', { userId, oldRole, newRole, changedBy });
logger.warn('Unauthorized access attempt', { userId, resource, ip });

// Data access events
logger.info('User data accessed', { userId, accessedBy, timestamp });
logger.warn('Sensitive data export', { userId, dataType, count });

// System events
logger.error('Database connection failed', { error, timestamp });
logger.warn('Rate limit exceeded', { ip, endpoint, timestamp });
```

**What NOT to Log:**
- Passwords or password hashes
- Credit card numbers
- Private keys or tokens
- Personally identifiable information (unless necessary)
- Message content (unless required by law)

### 5.4 Error Handling

**Safe Error Messages:**
```javascript
// SAFE - Generic error message
res.status(500).json({
  error: 'An error occurred. Please try again later.'
});

// UNSAFE - Reveals system information
res.status(500).json({
  error: 'Database connection failed: connection refused at 192.168.1.1:5432'
});
```

**Error Logging:**
```javascript
// Log full error details internally
logger.error('Database error', {
  error: err.message,
  stack: err.stack,
  query: err.query,
  timestamp: new Date()
});

// Return generic error to user
res.status(500).json({
  error: 'An error occurred. Please try again later.'
});
```

---

## 6. Data Privacy & Compliance

### 6.1 Data Minimization

**Collect Only What's Needed:**
- Email (for authentication)
- Username (for identification)
- Password hash (for authentication)
- Profile info (optional, user-provided)
- Activity logs (for security)

**Don't Collect:**
- Browsing history
- Location data (unless user opts in)
- Device information
- Behavioral data
- Biometric data

### 6.2 Data Retention

**Retention Policy:**
- Active user data: Kept indefinitely (until deletion)
- Deleted user data: Purged after 30 days
- Logs: Kept for 90 days
- Backups: Kept for 30 days
- Audit logs: Kept for 1 year

**Data Deletion:**
```javascript
// User can request data deletion
app.delete('/users/:id', async (req, res) => {
  // Anonymize user data
  await db.query(
    'UPDATE users SET email = $1, username = $2 WHERE id = $3',
    [`deleted_${userId}@example.com`, `deleted_${userId}`, userId]
  );
  
  // Delete sensitive data
  await db.query('DELETE FROM auth_tokens WHERE user_id = $1', [userId]);
  await db.query('DELETE FROM messages WHERE sender_id = $1', [userId]);
  
  // Mark as deleted
  await db.query(
    'UPDATE users SET deleted_at = NOW() WHERE id = $1',
    [userId]
  );
});
```

### 6.3 Privacy Controls

**User Controls:**
- Download personal data
- Delete account and data
- Control notification preferences
- Control profile visibility
- Opt-out of analytics

**Privacy Settings:**
```javascript
// User privacy levels
const privacyLevels = {
  'public': 'Profile visible to everyone',
  'friends': 'Profile visible to followers only',
  'private': 'Profile hidden from everyone'
};

// User can control what data is shared
const dataSharing = {
  'email': false, // Don't share email
  'location': false, // Don't share location
  'activity': true, // Share activity
  'campaigns': true // Share campaign participation
};
```

---

## 7. Incident Response

### 7.1 Security Incident Plan

**Incident Classification:**
- **Critical:** Data breach, system compromise
- **High:** Unauthorized access, DDoS attack
- **Medium:** Failed security control, suspicious activity
- **Low:** Policy violation, security warning

**Response Steps:**
1. **Detect** - Monitor for security events
2. **Assess** - Determine severity and scope
3. **Contain** - Stop the attack/breach
4. **Eradicate** - Remove the threat
5. **Recover** - Restore normal operations
6. **Communicate** - Notify affected users
7. **Learn** - Update security controls

### 7.2 Breach Notification

**If Data is Breached:**
1. Notify affected users within 24 hours
2. Provide details of what data was accessed
3. Recommend actions (password reset, etc.)
4. Offer free credit monitoring (if applicable)
5. Report to authorities (if required)

---

## 8. Security Testing

### 8.1 Penetration Testing

**Quarterly Testing:**
- SQL injection attempts
- XSS attacks
- CSRF attacks
- Authentication bypass
- Authorization bypass
- API security testing

### 8.2 Vulnerability Scanning

**Automated Scanning:**
- OWASP ZAP scans
- Snyk dependency checks
- SonarQube code analysis
- SSL/TLS configuration testing

### 8.3 Security Audit

**Annual Audit:**
- Third-party security assessment
- Code review by security experts
- Infrastructure review
- Policy and procedure review

---

## 9. Security Checklist

### Before Production Launch

- [ ] All passwords hashed with bcrypt (cost 12+)
- [ ] All sensitive data encrypted at rest
- [ ] HTTPS/TLS 1.3 enabled
- [ ] CSRF protection implemented
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] Authentication required for sensitive endpoints
- [ ] Authorization checks on all resources
- [ ] Audit logging enabled
- [ ] Error messages don't reveal system info
- [ ] Security headers configured (HSTS, CSP, etc.)
- [ ] CORS properly configured
- [ ] Secrets not in code or logs
- [ ] Dependencies scanned for vulnerabilities
- [ ] Security testing completed
- [ ] Incident response plan documented
- [ ] Privacy policy published
- [ ] Terms of service published

---

## 10. Security Headers

**Recommended Headers:**

```nginx
# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Enable XSS protection
add_header X-XSS-Protection "1; mode=block" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

---

## Conclusion

This security architecture provides:

- ✅ Strong authentication and authorization
- ✅ Encryption at rest and in transit
- ✅ API security and input validation
- ✅ Network security and DDoS protection
- ✅ Application security best practices
- ✅ Data privacy and compliance
- ✅ Incident response procedures
- ✅ Security testing and monitoring

The security architecture is ready for implementation in Phase 1.

---

**Status:** ✅ Design Complete - Ready for Implementation  
**Next Step:** Create technology stack document
