# Supabase Setup Guide

This guide will help you set up your Supabase project and run the database migrations.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: MGP Loyalty System (or your preferred name)
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to be ready (2-3 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: Copy this value (e.g., `https://xxxxx.supabase.co`)
   - **Publishable key**: Copy this value (or use the Legacy "anon" key if preferred)

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key-here
   ```

## Step 4: Run Database Migrations

You have three options to run the migrations:

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Run each migration file **in order** (001 through 010):
   - Click "New query"
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" (or press Ctrl+Enter)
   - Repeat for files 002, 003, 004, 005, 006, 007, 008, 009, and 010
   - **Important:** Run 009 and 010 in order - 010 fixes a critical RLS issue

**Migration Order:**
1. `001_initial_schema.sql` - Core tables (customers, transactions, point_ledger)
2. `002_auth_tables.sql` - Users/staff table
3. `003_audit_logs.sql` - Audit logging table
4. `004_notifications.sql` - Notifications table
5. `005_indexes.sql` - Performance indexes
6. `006_functions.sql` - Database functions
7. `007_transaction_functions.sql` - Transaction handlers
8. `008_automated_jobs.sql` - Automated point lifecycle jobs
9. `009_rls_policies.sql` - **Row Level Security policies (IMPORTANT: Run this before 010)**
10. `010_fix_users_rls.sql` - **Fix RLS circular dependency (IMPORTANT: Run this last)**

### Option B: Using Supabase CLI (Recommended for developers)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref your-project-id
   ```
   (Find your project ID in the project URL: `https://xxxxx.supabase.co`)

4. **Run all migrations:**
   ```bash
   supabase db push
   ```
   This will apply all migrations in order (001-010).

5. **If you need to run a specific migration:**
   ```bash
   # Run a single migration file
   supabase db push --file supabase/migrations/010_fix_users_rls.sql
   ```

6. **Check migration status:**
   ```bash
   supabase migration list
   ```

7. **Generate TypeScript types (optional but recommended):**
   ```bash
   supabase gen types typescript --linked > types/supabase.ts
   ```

### Option C: Using psql (Advanced)

If you have PostgreSQL client installed:

1. Get your database connection string from Supabase Dashboard → Settings → Database
2. Run migrations:
   ```bash
   psql "your-connection-string" -f supabase/migrations/001_initial_schema.sql
   psql "your-connection-string" -f supabase/migrations/002_auth_tables.sql
   # ... continue for all 8 files
   ```

## Step 5: Verify Setup

1. In Supabase Dashboard, go to **Table Editor**
2. You should see the following tables:
   - `customers`
   - `transactions`
   - `point_ledger`
   - `users`
   - `audit_logs`
   - `notifications`

3. Go to **Database** → **Functions** to verify functions are created:
   - `generate_mgp_id()`
   - `calculate_points()`
   - `add_purchase()`
   - `redeem_points()`
   - `activate_pending_points()`
   - `expire_old_points()`

4. Go to **Database** → **Cron Jobs** to verify scheduled jobs:
   - `activate_pending_points` (hourly)
   - `expire_old_points` (daily at 2 AM)

## Step 6: Row Level Security (RLS) - ✅ Included in Migration 009

**Good news!** RLS policies are already included in migration `009_rls_policies.sql`. This migration:

- Enables RLS on all tables (customers, transactions, point_ledger, users, audit_logs, notifications)
- Creates helper functions to check user authentication and roles
- Sets up policies that allow authenticated users to access data
- Provides a foundation for role-based access control

**Important Notes:**
- Run migration `009_rls_policies.sql` **after** all other migrations (001-008)
- **CRITICAL:** Run migration `010_fix_users_rls.sql` **after** 009 to fix RLS circular dependency
- The policies allow authenticated users to read/write data
- Additional role-based restrictions (staff vs manager vs admin) are enforced in your application code (`lib/auth.ts`)
- If you need stricter database-level role restrictions, you can modify the policies in migration 009

**After enabling RLS:**
- Your app will only work for authenticated users
- Make sure you've set up Supabase Auth and created at least one user before testing
- Unauthenticated requests will be blocked at the database level
- **If you get 403 errors on login**, make sure you've run migration 010 to fix the RLS issue

## Troubleshooting

### Migration Errors

- **Error: "relation already exists"**: The table/function already exists. You can either:
  - Drop it first: `DROP TABLE IF EXISTS table_name;`
  - Or skip that migration if it's already applied

- **Error: "extension already exists"**: This is fine, the `IF NOT EXISTS` clause should handle it

- **Error: "permission denied"**: Make sure you're using the correct database user with proper permissions

### Connection Issues

- Verify your `.env.local` file has the correct values
- Check that your Supabase project is active (not paused)
- Ensure you're using the correct project URL and API key

## Next Steps

After completing the setup:

1. Test your connection by running the app:
   ```bash
   npm run dev
   ```

2. Try logging in (you may need to create a user first in Supabase Auth)

3. Test customer registration and transactions

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the project README.md for more information

