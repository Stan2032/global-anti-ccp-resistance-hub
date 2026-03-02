# Supabase Auth Setup — Step-by-Step Guide

> **Context:** You already have 4 tables (`incident_reports`, `volunteer_signups`, `newsletter_subscribers`, `contact_messages`) with anonymous INSERT policies. This guide adds admin authentication so you can VIEW submitted data.

---

## Step 1: Enable Email Auth in Supabase Dashboard

1. Go to **https://supabase.com/dashboard** → Select your project
2. Navigate to **Authentication** → **Providers** (left sidebar)
3. Under **Email**, make sure it's **Enabled**
4. **Recommended settings:**
   - ✅ Enable email confirmations (toggle ON)
   - ✅ Enable email change confirmations
   - Set **Minimum password length** to **12** (for admin accounts)
   - ❌ Disable "Allow new user signups" — you'll create the admin user manually (prevents random people from signing up)
5. Click **Save**

> **IMPORTANT:** Disabling signups means only you (via the Supabase Dashboard) can create new users. This is the correct security posture for a single-admin setup.

---

## Step 2: Create Your Admin User

### Option A: Via Supabase Dashboard (Recommended)
1. Go to **Authentication** → **Users** (left sidebar)
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email:** your admin email (e.g., `admin@yourdomain.com`)
   - **Password:** a strong password (12+ characters, mix of upper/lower/numbers/symbols)
   - ✅ Check **"Auto Confirm User"** (skips email verification for the admin)
4. Click **Create user**
5. **Copy the user's UUID** — you'll need it for Step 3

### Option B: Via SQL Editor
```sql
-- Only if Option A doesn't work for some reason
-- Go to SQL Editor in Supabase Dashboard and run:
SELECT id, email FROM auth.users;
-- This shows existing users. If you created one via Dashboard, 
-- copy the UUID from here.
```

---

## Step 3: Create the `admin_users` Table

This table maps Supabase Auth users to admin roles. Go to **SQL Editor** in the Supabase Dashboard and run:

```sql
-- =============================================
-- STEP 3A: Create admin_users table
-- =============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add a comment for documentation
COMMENT ON TABLE public.admin_users IS 'Maps Supabase Auth users to admin roles. Only users in this table can access the admin dashboard.';

-- =============================================
-- STEP 3B: Insert yourself as admin
-- Replace 'YOUR-USER-UUID-HERE' with the UUID from Step 2
-- =============================================
INSERT INTO public.admin_users (user_id, role)
VALUES ('YOUR-USER-UUID-HERE', 'superadmin');

-- =============================================
-- STEP 3C: Enable RLS on admin_users
-- =============================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read admin_users (to check their own role)
CREATE POLICY "Authenticated users can read own admin record"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE via API — admin records managed via Dashboard/SQL only
-- This prevents privilege escalation
```

---

## Step 4: Update RLS on Existing 4 Tables (Allow Admin READ)

Currently your 4 tables only allow anonymous INSERT. Run this SQL to **add** read access for authenticated admins:

```sql
-- =============================================
-- Allow admins to READ all 4 submission tables
-- These ADD to existing policies (don't remove the INSERT policies)
-- =============================================

-- incident_reports: Admin can read all
CREATE POLICY "Admin can read incident reports"
  ON public.incident_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- volunteer_signups: Admin can read all
CREATE POLICY "Admin can read volunteer signups"
  ON public.volunteer_signups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- newsletter_subscribers: Admin can read all
CREATE POLICY "Admin can read newsletter subscribers"
  ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- contact_messages: Admin can read all
CREATE POLICY "Admin can read contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- =============================================
-- OPTIONAL: Allow admin to UPDATE status fields
-- =============================================
CREATE POLICY "Admin can update incident report status"
  ON public.incident_reports
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can update volunteer signup status"
  ON public.volunteer_signups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );
```

---

## Step 5: Verify the Setup (Test Queries)

Run these in the SQL Editor to confirm everything works:

```sql
-- Check your admin user exists
SELECT au.*, u.email 
FROM public.admin_users au 
JOIN auth.users u ON au.user_id = u.id;

-- Check RLS policies on incident_reports
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'incident_reports';

-- Should show both the INSERT (anonymous) and SELECT (authenticated) policies
```

---

## Step 6: Frontend Code (Already Implemented)

The following frontend files have been created in this session:

| File | Purpose |
|------|---------|
| `src/services/authService.js` | Auth functions: login, logout, getSession, isAdmin check |
| `src/contexts/AuthContext.jsx` | React Context for auth state, wraps the app |
| `src/components/ProtectedRoute.jsx` | Route guard — redirects non-admins to login |
| `src/pages/AdminLogin.jsx` | Login page with email/password form |
| `src/pages/AdminDashboard.jsx` | Dashboard to view submitted form data |
| `src/App.jsx` | Updated with `/admin` and `/admin/login` routes |

### Environment Variables Required

Make sure your `.env` (or Cloudflare Pages environment) has:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> ⚠️ **CRITICAL:** Use the key labeled **"anon / public"** from Supabase Dashboard → Settings → API.
> Do **NOT** use the "service_role / secret" key — it bypasses all Row Level Security.
> If you use the wrong key, you'll see: _"Forbidden use of secret API key in browser"_

---

## Step 7: Test the Complete Flow

1. **Build the app:** `npm run build`
2. **Navigate to:** `https://yoursite.com/admin/login`
3. **Enter** your admin email and password from Step 2
4. **You should see** the Admin Dashboard with tabs for:
   - Incident Reports
   - Volunteer Signups
   - Newsletter Subscribers
   - Contact Messages
5. **Test unauthorized access:** Open an incognito window, go to `/admin` — should redirect to `/admin/login`
6. **Test logout:** Click the logout button — should return to login page

---

## Security Checklist

- [x] Email auth enabled, new signups DISABLED
- [x] Single admin user created manually
- [x] `admin_users` table with RLS (users can only read their own record)
- [x] 4 data tables: admin-only SELECT policies (via admin_users join)
- [x] No admin management via API — only via Dashboard/SQL
- [x] Client-side auth state with Supabase session tokens
- [x] Protected routes redirect unauthenticated users
- [x] PII encryption still in place for stored data
- [x] Anon key is safe to expose (RLS enforces access control)

---

## Troubleshooting

### ⚠️ "Forbidden use of secret API key in browser"
**This is the most common setup mistake.** You put the **service_role (secret)** key into `VITE_SUPABASE_ANON_KEY` instead of the **anon (public)** key.

**How to fix:**
1. Go to **Supabase Dashboard → Settings → API**
2. You'll see **two** keys under "Project API keys":
   - **`anon` / `public`** — ✅ Use THIS one for `VITE_SUPABASE_ANON_KEY`
   - **`service_role` / `secret`** — ❌ NEVER put this in client code
3. Copy the **anon** key and update your environment variable
4. Redeploy your site

**Why it matters:** The service_role key bypasses all Row Level Security — anyone who inspects your frontend JavaScript could extract it and read/write ALL your data. The anon key is safe to expose because RLS policies control what it can access.

**How to tell them apart:** Both are JWTs (long base64 strings). The anon key's payload contains `"role": "anon"`, while the service_role key contains `"role": "service_role"`. The app now detects this automatically and blocks the service_role key from being used.

### "Invalid login credentials"
- Check that the user exists in Authentication → Users
- Check that Auto Confirm was enabled (or confirm the email)
- Verify the email/password are correct

### "Permission denied" when reading tables
- Run the Step 4 SQL again — make sure all 4 SELECT policies exist
- Check that the `admin_users` table has your user_id inserted
- Verify with: `SELECT * FROM public.admin_users;`

### "Supabase not configured" message
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- In Cloudflare Pages: Settings → Environment Variables → Add both
- Redeploy after adding env vars

### Admin can't see data / tables are empty
- The encrypted fields (name, email, etc.) will appear as encrypted strings
- This is expected — decryption key is needed to read PII
- Non-PII fields (status, dates, types) are readable as-is
