# Vercel Environment Variables

Copy and paste these environment variables into your Vercel project settings.

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below (one at a time or paste all at once)
4. Make sure to set them for **Production**, **Preview**, and **Development** environments

---

## Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## Detailed Instructions

### 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following values:

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Location:** Project URL
- **Example:** `https://abcdefghijklmnop.supabase.co`
- **Note:** This is public and safe to expose

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Location:** Project API keys → **anon** `public` key (or Publishable key)
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Note:** This is public and safe to expose (it's the anon key)

#### `NEXT_SUPABASE_SERVICE_ROLE_KEY`
- **Location:** Project API keys → **service_role** `secret` key
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **⚠️ IMPORTANT:** This is a SECRET key - never expose it in client-side code
- **Note:** Do NOT use `NEXT_PUBLIC_` prefix for this one (it's server-side only)

---

## Quick Copy-Paste Template

Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

---

## Environment-Specific Configuration

### Production Environment
- Set all three variables for **Production**
- Use your production Supabase project credentials

### Preview Environment (for Pull Requests)
- Set all three variables for **Preview**
- You can use the same Supabase project or a separate test project

### Development Environment
- Set all three variables for **Development**
- Use your development/test Supabase project credentials

---

## Verification

After adding the environment variables:

1. **Redeploy** your application in Vercel
2. Check the build logs to ensure no environment variable errors
3. Test the application to verify:
   - Authentication works
   - Database connections work
   - User registration works (requires service role key)

---

## Security Notes

✅ **Safe to expose (NEXT_PUBLIC_ prefix):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

❌ **Never expose (no NEXT_PUBLIC_ prefix):**
- `NEXT_SUPABASE_SERVICE_ROLE_KEY` - This bypasses Row Level Security (RLS)

---

## Troubleshooting

### Build Fails with "Environment variable not found"
- Ensure all variables are set in Vercel dashboard
- Check that variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Authentication Not Working
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active and accessible

### User Registration Fails
- Verify `NEXT_SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Ensure the key has not expired or been rotated
- Check Supabase project settings → API → Service Role Key

---

## Next Steps After Deployment

1. ✅ Verify all environment variables are set
2. ✅ Run database migrations in Supabase (if not already done)
3. ✅ Create your first admin user
4. ✅ Test the application end-to-end
5. ✅ Monitor Vercel deployment logs for any errors

---

**Need Help?** Check the main README.md or SUPABASE_SETUP.md for more details.

