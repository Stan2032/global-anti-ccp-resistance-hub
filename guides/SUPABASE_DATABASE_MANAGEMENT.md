# Supabase Database Management Guide

> **Last Updated:** March 8, 2026 (Session 235)
> **Difficulty:** Beginner
> **Time Required:** 15-30 minutes
> **Prerequisites:** Supabase account with project configured (see [Supabase Setup](../SUPABASE_SETUP.md))

---

## Overview

This guide covers day-to-day management of the Supabase backend: viewing submissions, managing admin access, monitoring usage, and maintaining data security.

The platform uses Supabase for 4 submission tables:
1. **incident_reports** — Reports of CCP human rights violations
2. **volunteer_signups** — Volunteer registrations
3. **newsletter_subscribers** — Email newsletter subscriptions
4. **contact_messages** — Contact form submissions

All submissions containing PII are encrypted client-side before storage (RSA-OAEP + AES-256-GCM).

---

## Step 1: Access the Admin Dashboard

### Option A: In-App Admin (Recommended)
1. Navigate to your deployed site
2. Go to `/admin` (e.g., `https://your-domain.com/admin`)
3. Log in with your admin email and password
4. The Admin Dashboard shows all 4 submission tables in tabs

### Option B: Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Table Editor** in the sidebar
4. Select any of the 4 tables to view submissions

---

## Step 2: Viewing Encrypted Submissions

Submissions with PII are encrypted before reaching Supabase. To decrypt:

### Using the Admin Dashboard (in-app)
The in-app admin dashboard automatically decrypts submissions using the RSA private key stored in your environment variables (`VITE_ENCRYPTION_PRIVATE_KEY`).

### Using the SQL Editor (manual decryption)
1. Go to Supabase Dashboard → **SQL Editor**
2. Run: `SELECT * FROM incident_reports ORDER BY created_at DESC LIMIT 20;`
3. Encrypted fields will appear as Base64 strings
4. To decrypt, use the private key with the decryption script in `BACKEND_GUIDE.md`

### What's Encrypted vs. Plain

| Table | Encrypted Fields | Plain Fields |
|-------|-----------------|--------------|
| incident_reports | description, location, contact_email | id, created_at, incident_type |
| volunteer_signups | name, email, message | id, created_at, skills |
| newsletter_subscribers | — | id, email, created_at |
| contact_messages | name, email, message | id, created_at, subject |

---

## Step 3: Managing Admin Users

### Add a New Admin
```sql
-- Run in Supabase SQL Editor
INSERT INTO admin_users (email, role)
VALUES ('new-admin@example.com', 'admin');
```

Then create the user in **Authentication → Users → Add User**.

### Remove an Admin
```sql
DELETE FROM admin_users WHERE email = 'old-admin@example.com';
```

### Check Who Has Admin Access
```sql
SELECT * FROM admin_users ORDER BY created_at DESC;
```

---

## Step 4: Row Level Security (RLS) Overview

All tables have RLS enabled for security:

| Operation | anon (public) | authenticated | service_role |
|-----------|--------------|---------------|--------------|
| INSERT | ✅ | ✅ | ✅ |
| SELECT | ❌ | Own rows only | ✅ All rows |
| UPDATE | ❌ | ❌ | ✅ |
| DELETE | ❌ | ❌ | ✅ |

**Important:** Anonymous users can INSERT (submit forms) but cannot read, modify, or delete any data.

---

## Step 5: Monitoring Usage

### Check Submission Counts
```sql
SELECT
  'incident_reports' AS table_name, COUNT(*) AS count FROM incident_reports
UNION ALL
SELECT 'volunteer_signups', COUNT(*) FROM volunteer_signups
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages;
```

### Check Recent Activity
```sql
-- Last 10 incident reports
SELECT id, incident_type, created_at
FROM incident_reports
ORDER BY created_at DESC
LIMIT 10;

-- Last 10 volunteer signups
SELECT id, skills, created_at
FROM volunteer_signups
ORDER BY created_at DESC
LIMIT 10;
```

### Check Database Size
Go to **Settings → Database → Database Usage** in the Supabase Dashboard.

Free tier limits:
- 500MB database storage
- 2GB bandwidth per month
- 50MB file storage

---

## Step 6: Backup & Export

### Export All Data
1. Go to Supabase Dashboard → **Settings → Database**
2. Click **Database Backups** → **Download Latest**

### Manual SQL Export
```sql
-- Export incident reports as CSV
COPY (SELECT * FROM incident_reports ORDER BY created_at DESC)
TO '/tmp/incident_reports_backup.csv'
WITH CSV HEADER;
```

### Scheduled Backups
Supabase Pro plan includes daily automated backups with point-in-time recovery. Free plan: manual backups only.

---

## Step 7: Security Maintenance

### Rotate the Anon Key (if compromised)
1. Go to **Settings → API → Project API Keys**
2. Click **Regenerate** next to the anon key
3. Update `VITE_SUPABASE_ANON_KEY` in your deployment environment
4. Redeploy the site

### Check for Suspicious Activity
```sql
-- Look for unusual submission patterns (potential spam/abuse)
SELECT DATE(created_at) as date, COUNT(*) as count
FROM incident_reports
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

### Verify RLS Policies Are Active
```sql
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## Troubleshooting

### "Coming Soon" message on forms
Forms show "Coming Soon" when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not configured. Set these in your Cloudflare Workers environment variables.

### "Service role key detected" error
The app has detected you accidentally put the **service role key** (secret) in the `VITE_SUPABASE_ANON_KEY` variable. This is a critical security issue. Use only the **anon/public** key in the frontend.

### Submissions not appearing
1. Check browser DevTools → Network tab for failed requests
2. Verify Supabase project is accessible: visit `https://YOUR_PROJECT_ID.supabase.co/rest/v1/`
3. Check RLS policies allow anon INSERT

### Too many submissions (spam)
Add rate limiting via Supabase Edge Functions or Cloudflare WAF rules.
