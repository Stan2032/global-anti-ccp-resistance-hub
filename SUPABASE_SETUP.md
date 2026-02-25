# Supabase Setup Guide (Step by Step)

Set up **Supabase** as the database backend for the Global Anti-CCP Resistance Hub.  
This guide walks you through every click, from the Supabase dashboard to a working connection.

> **Do this BEFORE setting up Cloudflare Pages.** Cloudflare needs your Supabase
> credentials as environment variables during the build.

---

## Step 1: Open Your Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in (or create an account if you haven't already)
3. You should see your project listed on the dashboard
4. Click on your project name to open it

> If you haven't created a project yet:  
> Click **New Project** → pick your organization → give it a name (e.g. `resistance-hub`) →
> set a database password (save this somewhere safe) → choose a region close to your users →
> click **Create new project**. Wait about 1 minute for it to finish provisioning.

---

## Step 2: Get Your API Credentials

You need two values. Here's exactly where to find them:

1. In your project, look at the **left sidebar**
2. Click **Settings** (the gear icon near the bottom)
3. Click **API** (under "Configuration" in the settings menu)
4. You'll see a page with your project details. Copy these two things:

| What you see on screen | What it's called | What to save it as |
|------------------------|------------------|--------------------|
| **Project URL** — a URL like `https://abcdefg.supabase.co` | Project URL | `VITE_SUPABASE_URL` |
| Under "Project API keys" — the key labeled **`anon`** `public` | anon key | `VITE_SUPABASE_ANON_KEY` |

> ⚠️ **Do NOT copy the `service_role` key.** That one bypasses all security.
> The `anon` key is the one labeled "This key is safe to use in a browser" — that's
> the one you want. Row Level Security (RLS) is what protects your data, not the key.

**Save both values somewhere** (a text file, sticky note, whatever). You'll need them in a minute.

---

## Step 3: Create the Database Tables

Now you need to create the tables that the website's forms write to.

1. In your Supabase project, look at the **left sidebar**
2. Click **SQL Editor** (the icon that looks like a terminal/code window)
3. You'll see a blank editor. **Delete anything in it**
4. **Copy the entire block of SQL below** and paste it into the editor:

```sql
-- ============================================================================
-- TABLE 1: INCIDENT REPORTS
-- This is where the "Report CCP Harassment" form saves data
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
-- TABLE 2: VOLUNTEER SIGN-UPS
-- This is where the "Volunteer" form saves data
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
-- TABLE 3: NEWSLETTER SUBSCRIBERS
-- This is where the "Newsletter" form saves data
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================================================
-- TABLE 4: CONTACT MESSAGES
-- This is where a future "Contact Us" form will save data
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

5. Click the **Run** button (green play button, or press Ctrl+Enter / Cmd+Enter)
6. You should see **"Success. No rows returned"** — that means it worked

---

## Step 4: Set Up Security (Row Level Security)

This step makes sure random people on the internet can submit forms, but can't read
other people's submissions. Only you can see all entries via the Supabase dashboard.

1. You should still be in the **SQL Editor**
2. Click **+** to open a new query tab (or clear the current one)
3. **Copy the entire block below** and paste it in:

```sql
-- Enable Row Level Security on all four tables
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SUBMIT forms (insert rows) but NOT read other entries
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

-- Allow newsletter re-subscribing (upsert)
CREATE POLICY "Anyone can update their newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
```

4. Click **Run**
5. You should see **"Success. No rows returned"** again — that means it worked

---

## Step 5: Verify Your Tables Were Created

1. In the **left sidebar**, click **Table Editor** (the grid/table icon)
2. You should see 4 tables listed:
   - `incident_reports`
   - `volunteer_signups`
   - `newsletter_subscribers`
   - `contact_messages`
3. Click on any table — it should be empty (no rows yet), which is correct

If you see all 4 tables, **Supabase is fully set up.** 🎉

---

## Step 6: Connect to Your Website

You have two options depending on how you're deploying:

### Option A: Cloudflare Pages (recommended)

Follow the [Cloudflare Pages Deployment Guide](CLOUDFLARE_DEPLOY.md). When it asks
you to set environment variables, use the values you saved in Step 2:

| Variable name | Value |
|---------------|-------|
| `VITE_BASE_PATH` | `/` |
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` (from Step 2) |
| `VITE_SUPABASE_ANON_KEY` | Your anon key (from Step 2) |
| `NODE_VERSION` | `20` |

### Option B: Local Development

1. In the project root, copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in a text editor and fill in your values:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the site in your browser (usually `http://localhost:5173`)

### Option C: GitHub Pages

Add these as **repository variables** (not secrets — Vite needs them at build time):

1. Go to your repo on GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Click the **Variables** tab
3. Click **New repository variable** and add:
   - Name: `VITE_SUPABASE_URL` / Value: your project URL
   - Name: `VITE_SUPABASE_ANON_KEY` / Value: your anon key

---

## Step 7: Test That It Works

1. Open your site (local dev, Cloudflare, or GitHub Pages — wherever it's running)
2. Navigate to the **Incident Report form** (Security Center → Report tab, or find it in the nav)
3. The form should **no longer show the yellow "Coming Soon" banner** — that means
   Supabase is connected
4. Fill in a test report and click **Submit Securely**
5. Go back to **Supabase Dashboard → Table Editor → incident_reports**
6. You should see your test entry in the table

If you see the entry, **everything is working.** Forms are live. 🎉

---

## How It Works

```
┌─────────────────┐                ┌──────────────────┐
│  Your Website    │    HTTPS       │   Supabase       │
│  (React + Vite)  │ ────────────→ │                  │
│                  │   anon key     │   PostgreSQL DB  │
│  supabaseClient  │               │   + RLS policies │
│  .js             │               │   + Dashboard    │
└─────────────────┘                └──────────────────┘

User fills form → supabaseService.js sends data → Supabase stores it
                                                   ↓
                                    You view entries in Supabase Dashboard
                                    (Table Editor → select a table)
```

- The website talks directly to Supabase — no separate backend server needed
- **RLS policies** control who can do what (insert only, no reading other entries)
- The **anon key** is designed to be public (it's embedded in the website's JavaScript)
- Only you can see all data, via the Supabase Dashboard or using the `service_role` key

---

## Troubleshooting

### Forms still show "Coming Soon"
- The yellow banner means `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing
- Make sure both variables are set in your `.env` file (local) or Cloudflare environment variables (production)
- If you just added them to Cloudflare, trigger a redeploy (push a commit, or go to Deployments → Retry)

### "Error submitting report" message after clicking Submit
- Open browser DevTools (F12) → Console tab — look for red error messages
- Common cause: you haven't run the SQL from Steps 3 and 4 yet
- Common cause: RLS is blocking the insert — make sure you ran the policies in Step 4

### Table exists but no data appears after submitting
- Check that RLS policies were created (Step 4)
- In Supabase Dashboard, click on a table → click **RLS policies** tab → you should see the policies listed

### "relation does not exist" error
- You haven't created the tables yet — go back to Step 3 and run the SQL

---

## (Optional) Full Backend Schema

If you want to migrate the complete Express backend schema (users, campaigns,
organizations, intelligence reports, etc.) to Supabase, you can run these
existing migration files in the SQL Editor:

1. `backend/src/db/migrations/001_create_initial_schema.sql` — 15 tables + seed roles
2. `backend/src/db/migrations/002_create_feed_tables.sql` — feed sources + items

These use standard PostgreSQL and are fully compatible with Supabase.

---

## Quick Reference

| What | Where to find it |
|------|-----------------|
| Your Supabase project URL | Dashboard → Settings → API → Project URL |
| Your anon key | Dashboard → Settings → API → Project API keys → `anon` `public` |
| Your tables | Dashboard → Table Editor |
| SQL Editor | Dashboard → SQL Editor |
| Row Level Security policies | Dashboard → Table Editor → select a table → RLS policies tab |
| Your form submissions | Dashboard → Table Editor → select `incident_reports` (or other table) |

---

**You do NOT need:**
- ❌ Supabase Pro plan (free tier is enough)
- ❌ Supabase GitHub integration (that's a Pro feature for syncing migrations — we do it manually)
- ❌ The `service_role` key (never put this in your website code)
- ❌ A separate backend server (the React app talks directly to Supabase)
