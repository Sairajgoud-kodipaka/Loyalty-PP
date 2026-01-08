# Database Migration Checklist

Run these migrations **in order** in your Supabase SQL Editor:

## Migration Order

- [ ] **001_initial_schema.sql** - Core tables (customers, transactions, point_ledger)
- [ ] **002_auth_tables.sql** - Users/staff table for authentication
- [ ] **003_audit_logs.sql** - Audit logging table
- [ ] **004_notifications.sql** - Notifications table (for Phase 2 features)
- [ ] **005_indexes.sql** - Performance indexes for faster queries
- [ ] **006_functions.sql** - Database functions (generate_mgp_id, calculate_points, triggers)
- [ ] **007_transaction_functions.sql** - Transaction handlers (add_purchase, redeem_points)
- [ ] **008_automated_jobs.sql** - Automated point lifecycle (activation, expiration)
- [ ] **009_rls_policies.sql** - Row Level Security policies (IMPORTANT: Enable after all tables are created)

## Quick Steps

1. Open Supabase Dashboard → SQL Editor
2. For each file above:
   - Click "New query"
   - Copy entire contents of the migration file
   - Paste into SQL Editor
   - Click "Run" (or Ctrl+Enter)
   - Verify success message
3. Verify in Table Editor that all tables are created
4. Verify in Database → Functions that all functions are created
5. Verify in Database → Cron Jobs that scheduled jobs are set up

## Files Location

All migration files are in: `supabase/migrations/`

