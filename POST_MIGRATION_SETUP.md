# Post-Migration Setup Guide

## ✅ Step 1: Verify Migrations

1. Go to your **Supabase Dashboard** → **Table Editor**
2. Verify these tables exist:
   - ✅ `customers`
   - ✅ `transactions`
   - ✅ `point_ledger`
   - ✅ `users`
   - ✅ `audit_logs`
   - ✅ `notifications`

3. Go to **Database** → **Functions** and verify:
   - ✅ `generate_mgp_id()`
   - ✅ `calculate_points()`
   - ✅ `add_purchase()`
   - ✅ `redeem_points()`
   - ✅ `activate_pending_points()`
   - ✅ `expire_old_points()`

## ✅ Step 2: Enable pg_cron Extension

**Important:** The scheduled jobs (point activation/expiration) require the `pg_cron` extension.

1. Go to **Supabase Dashboard** → **Database** → **Extensions**
2. Search for `pg_cron`
3. Click **Enable** (if not already enabled)

**Note:** If you see an error about pg_cron, you may need to enable it via SQL:
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

## ✅ Step 3: Verify Environment Variables

Make sure your `.env.local` file exists with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**To get your keys:**
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **Publishable key** (anon key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Step 4: Create Your First User

You need to create a user in **both** Supabase Auth and your `users` table.

### Method 1: Via Supabase Dashboard (Recommended)

1. **Create Auth User:**
   - Go to **Authentication** → **Users** → **Add User**
   - Enter email and password
   - Click **Create User**
   - **Note the email address**

2. **Create User Record:**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run this SQL (replace with your email):
   
   ```sql
   -- Replace 'your-email@example.com' with the email you just created
   INSERT INTO users (id, email, password_hash, full_name, role, is_active)
   SELECT 
       id,
       email,
       '' as password_hash,
       'Admin User' as full_name,
       'admin' as role,
       true as is_active
   FROM auth.users
   WHERE email = 'your-email@example.com'
   ON CONFLICT (email) DO UPDATE
   SET 
       full_name = EXCLUDED.full_name,
       role = EXCLUDED.role,
       is_active = EXCLUDED.is_active;
   ```

### Method 2: Using the SQL Script

1. Open `supabase/create_first_user.sql`
2. Replace `'your-email@example.com'` with your actual email
3. Run it in **SQL Editor**

## ✅ Step 5: Test the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - You should be redirected to `/login`

3. **Login:**
   - Use the email and password you created in Step 4
   - You should be redirected to `/dashboard`

4. **Test Features:**
   - ✅ Register a new customer
   - ✅ Search for customers
   - ✅ Add a purchase transaction
   - ✅ Redeem points

## ✅ Step 6: Verify Scheduled Jobs (Optional)

The automated jobs should be running:
- **Point Activation:** Runs hourly (activates pending points after 24 hours)
- **Point Expiration:** Runs daily at 2 AM (expires points after 2 years)

To verify:
1. Go to **Database** → **Cron Jobs** (if available in your Supabase plan)
2. Or test manually in SQL Editor:
   ```sql
   SELECT activate_pending_points();
   SELECT expire_old_points();
   ```

## 🐛 Troubleshooting

### Issue: "Cannot connect to Supabase"
- ✅ Check `.env.local` has correct values
- ✅ Verify Supabase project is active (not paused)
- ✅ Check internet connection

### Issue: "RLS policy violation"
- ✅ Make sure you're logged in
- ✅ Verify user exists in `users` table with `is_active = true`
- ✅ Check that user email matches in both `auth.users` and `users` table

### Issue: "Function not found"
- ✅ Verify all migrations ran successfully
- ✅ Check Database → Functions in Supabase Dashboard
- ✅ Re-run migrations if needed

### Issue: "pg_cron not available"
- ✅ Enable pg_cron extension (Step 2)
- ✅ Some Supabase plans may not support pg_cron
- ✅ You can manually run the functions via SQL if needed

## 🎉 You're All Set!

Your MGP Loyalty System is now ready to use. Start by:
1. Creating your first customer
2. Recording a purchase transaction
3. Testing point redemption

For more information, see:
- `README.md` - Project overview
- `SUPABASE_SETUP.md` - Detailed setup guide
- `TROUBLESHOOTING.md` - Common issues and solutions

