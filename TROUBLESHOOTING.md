# Troubleshooting Guide

## npm Install Errors

### Issue: "Invalid Version" Error

**Symptoms:**
```
npm error Invalid Version:
npm error A complete log of this run can be found in: ...
```

**Cause:**
Corrupted `package-lock.json` or `node_modules` directory, or outdated package versions.

**Solution:**

1. **Clean up and reinstall:**
   ```powershell
   # Remove node_modules and package-lock.json
   Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path package-lock.json -Force -ErrorAction SilentlyContinue
   
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall
   npm install
   ```

2. **If that doesn't work, try:**
   ```powershell
   # Update npm to latest version
   npm install -g npm@latest
   
   # Then try install again
   npm install
   ```

3. **Alternative: Use yarn instead:**
   ```powershell
   # Install yarn if not already installed
   npm install -g yarn
   
   # Use yarn instead
   yarn install
   ```

### Fixed Issues

✅ **Updated `@supabase/ssr` version** from `^0.1.0` to `^0.5.1` (correct version for Next.js 14)

## Supabase Setup Verification

### 1. Check Environment Variables

Make sure your `.env.local` file exists and has correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key-here
```

**To get these values:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **Publishable key** (or Legacy anon key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Verify Supabase Client Setup

Your Supabase clients are correctly configured:

- **Client-side** (`lib/supabase/client.ts`): Uses `createClient` from `@supabase/supabase-js`
- **Server-side** (`lib/supabase/server.ts`): Uses `createServerClient` from `@supabase/ssr`

Both use the **anon/publishable key** which is correct for client-side usage.

### 3. Run Database Migrations

**Important:** Run migrations in order (001-009):

1. Go to Supabase Dashboard → SQL Editor
2. Run each migration file in numerical order:
   - 001_initial_schema.sql
   - 002_auth_tables.sql
   - 003_audit_logs.sql
   - 004_notifications.sql
   - 005_indexes.sql
   - 006_functions.sql
   - 007_transaction_functions.sql
   - 008_automated_jobs.sql
   - **009_rls_policies.sql** (run this last!)

### 4. Enable Row Level Security (RLS)

✅ **RLS is already configured** in migration `009_rls_policies.sql`

After running migration 009:
- All tables will have RLS enabled
- Only authenticated users can access data
- Policies are set up for your role-based access control

### 5. Set Up Authentication

1. Go to Supabase Dashboard → Authentication → Users
2. Create your first user (or use Email auth)
3. Make sure the user exists in both:
   - `auth.users` (Supabase Auth)
   - `users` table (your application table)

## Common Issues

### Issue: "Cannot connect to Supabase"

**Check:**
- `.env.local` file exists and has correct values
- Supabase project is active (not paused)
- Internet connection is working
- No firewall blocking requests

### Issue: "RLS policy violation"

**Cause:** RLS is enabled but user is not authenticated

**Solution:**
- Make sure user is logged in
- Check that Supabase Auth session is valid
- Verify user exists in `users` table with `is_active = true`

### Issue: "Function not found" errors

**Cause:** Database migrations not run or run out of order

**Solution:**
- Run all migrations in order (001-009)
- Check Database → Functions in Supabase Dashboard
- Verify functions exist: `generate_mgp_id()`, `calculate_points()`, etc.

## Next Steps After Setup

1. ✅ Install dependencies: `npm install` (after fixing the error)
2. ✅ Set up `.env.local` with Supabase credentials
3. ✅ Run database migrations (001-009)
4. ✅ Create first user in Supabase Auth
5. ✅ Test the application: `npm run dev`

## Getting Help

If issues persist:
- Check Supabase Dashboard for error logs
- Review browser console for client-side errors
- Check Supabase logs: Dashboard → Logs
- Verify all migrations ran successfully

