-- Row Level Security (RLS) Policies
-- This migration enables RLS and creates policies for all tables
-- Based on role-based access control: staff, manager, admin

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role from auth.users
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_email TEXT;
  user_role TEXT;
BEGIN
  -- Get email from auth.users
  user_email := (SELECT email FROM auth.users WHERE id = auth.uid());
  
  IF user_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get role from users table
  SELECT role INTO user_role
  FROM users
  WHERE email = user_email AND is_active = true;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is authenticated and active
CREATE OR REPLACE FUNCTION is_authenticated_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CUSTOMERS TABLE POLICIES
-- ============================================

-- Allow authenticated users to read all customers
CREATE POLICY "Allow authenticated read customers"
ON customers FOR SELECT
USING (is_authenticated_user());

-- Allow authenticated users to insert customers
CREATE POLICY "Allow authenticated insert customers"
ON customers FOR INSERT
WITH CHECK (is_authenticated_user());

-- Allow authenticated users to update customers
CREATE POLICY "Allow authenticated update customers"
ON customers FOR UPDATE
USING (is_authenticated_user())
WITH CHECK (is_authenticated_user());

-- Only managers and admins can delete customers (soft delete via status)
-- Deletion is handled via status update, not actual DELETE

-- ============================================
-- TRANSACTIONS TABLE POLICIES
-- ============================================

-- Allow authenticated users to read all transactions
CREATE POLICY "Allow authenticated read transactions"
ON transactions FOR SELECT
USING (is_authenticated_user());

-- Allow authenticated users to insert transactions
CREATE POLICY "Allow authenticated insert transactions"
ON transactions FOR INSERT
WITH CHECK (is_authenticated_user());

-- Allow authenticated users to update transactions
CREATE POLICY "Allow authenticated update transactions"
ON transactions FOR UPDATE
USING (is_authenticated_user())
WITH CHECK (is_authenticated_user());

-- ============================================
-- POINT_LEDGER TABLE POLICIES
-- ============================================

-- Allow authenticated users to read all point ledger entries
CREATE POLICY "Allow authenticated read point_ledger"
ON point_ledger FOR SELECT
USING (is_authenticated_user());

-- Allow authenticated users to insert point ledger entries
CREATE POLICY "Allow authenticated insert point_ledger"
ON point_ledger FOR INSERT
WITH CHECK (is_authenticated_user());

-- Allow authenticated users to update point ledger entries
CREATE POLICY "Allow authenticated update point_ledger"
ON point_ledger FOR UPDATE
USING (is_authenticated_user())
WITH CHECK (is_authenticated_user());

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can read their own record
CREATE POLICY "Users can read own record"
ON users FOR SELECT
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Only admins can read all users (handled in application layer)
-- For now, allow authenticated users to read all users for staff management
-- You can restrict this further if needed
CREATE POLICY "Allow authenticated read users"
ON users FOR SELECT
USING (is_authenticated_user());

-- Only admins can insert/update/delete users (handled in application layer)
-- RLS allows authenticated users, but your app should check role before allowing

-- ============================================
-- AUDIT_LOGS TABLE POLICIES
-- ============================================

-- Allow authenticated users to read audit logs
CREATE POLICY "Allow authenticated read audit_logs"
ON audit_logs FOR SELECT
USING (is_authenticated_user());

-- Only system functions can insert audit logs (handled via SECURITY DEFINER functions)
-- Regular users cannot insert audit logs directly

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

-- Users can read their own notifications (if user_id is set)
-- For now, allow authenticated users to read all notifications
CREATE POLICY "Allow authenticated read notifications"
ON notifications FOR SELECT
USING (is_authenticated_user());

-- Only system functions can insert notifications (handled via SECURITY DEFINER functions)
-- Regular users cannot insert notifications directly

-- ============================================
-- NOTES
-- ============================================
-- 
-- These policies provide basic RLS protection. Additional role-based restrictions
-- should be enforced in your application layer (lib/auth.ts) using the requireAuth()
-- function with role checks.
--
-- For stricter security, you can add role-specific policies:
-- - Staff: Can only read/insert, cannot update/delete
-- - Manager: Can read/insert/update, cannot delete
-- - Admin: Full access
--
-- Example of role-specific policy:
-- CREATE POLICY "Managers can update customers"
-- ON customers FOR UPDATE
-- USING (get_user_role() IN ('manager', 'admin'))
-- WITH CHECK (get_user_role() IN ('manager', 'admin'));

