# Supabase Setup Guide

This project uses **Supabase** (PostgreSQL + Auth + Row Level Security) as its backend database.

---

## 1. Get Your Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public** key → `VITE_SUPABASE_ANON_KEY`

## 2. Set Environment Variables

### Local Development

Create a `.env` file in the project root (it's already in `.gitignore`):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...your-anon-key
```

### Cloudflare Pages (Production)

Go to **Cloudflare Dashboard → Pages → your project → Settings → Environment variables** and add:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your anon key |

### GitHub Pages (if applicable)

Add to your repo's **Settings → Secrets and variables → Actions → Variables**.

## 3. Create Database Tables

Go to your **Supabase Dashboard → SQL Editor** and run the following SQL.  
This creates the tables the frontend forms write to.

```sql
-- ============================================================================
-- INCIDENT REPORTS TABLE
-- For the Incident Report form (src/components/IncidentReportForm.jsx)
-- ============================================================================
CREATE TABLE IF NOT EXISTS incident_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_type TEXT,
  location TEXT,
  date_of_incident DATE,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_url TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- VOLUNTEER SIGN-UPS TABLE
-- For the Volunteer form (src/components/VolunteerSignup.jsx)
-- ============================================================================
CREATE TABLE IF NOT EXISTS volunteer_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  availability TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- For the Newsletter form (src/components/NewsDigest.jsx)
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================================================
-- CONTACT MESSAGES TABLE
-- For a future Contact form
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 4. Enable Row Level Security (RLS)

RLS restricts who can read/write each table. Run this in the SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT (submit forms) but not read other entries
CREATE POLICY "Anyone can submit incident reports"
  ON incident_reports FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can sign up as volunteer"
  ON volunteer_signups FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can send contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow upsert for newsletter (re-subscribing)
CREATE POLICY "Anyone can update their newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
```

> **Note:** These policies allow *anyone* to submit forms (insert), but no one can
> read other people's submissions through the client. Only you (via the Supabase
> Dashboard or a service-role key) can see all entries.

## 5. (Optional) Full Backend Schema

If you want to migrate the full Express backend schema (users, campaigns,
organizations, intelligence reports, etc.) to Supabase, run the existing
migration files in the SQL Editor:

1. `backend/src/db/migrations/001_create_initial_schema.sql` (15 tables + seed roles)
2. `backend/src/db/migrations/002_create_feed_tables.sql` (feed sources + items)

These use standard PostgreSQL and are fully compatible with Supabase.

## 6. Verify It Works

After setting up:

```bash
# 1. Create .env with your credentials
cp .env.example .env
# Edit .env with your real Supabase URL and anon key

# 2. Start the dev server
npm run dev

# 3. Navigate to the Incident Report form and submit a test entry
# 4. Check Supabase Dashboard → Table Editor → incident_reports
```

## Architecture

```
┌─────────────┐     HTTPS      ┌──────────────────┐
│  React App  │ ───────────── │   Supabase       │
│  (Vite)     │  anon key     │   PostgreSQL     │
│             │               │   + RLS          │
│  supabase   │               │   + Auth         │
│  Client.js  │               │   + Storage      │
└─────────────┘               └──────────────────┘
```

The frontend talks directly to Supabase using the `@supabase/supabase-js` client.
Row Level Security (RLS) policies enforce access control — no separate backend
server is needed for basic form submissions and public data reads.

---

**Security note:** The `anon` key is *designed* to be public. RLS policies are
what protect your data. Never use the `service_role` key in client code.
