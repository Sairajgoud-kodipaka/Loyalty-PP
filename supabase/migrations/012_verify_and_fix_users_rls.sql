-- Verify and ensure users table RLS policy is correct
-- This migration checks if policies exist and recreates them if needed

-- First, check if RLS is enabled (it should be from migration 009)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Allow authenticated read users" ON users;

-- Create the policy with explicit TO authenticated clause
-- This is the most permissive policy needed for middleware to work
CREATE POLICY "Allow authenticated read users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Verify the policy was created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Allow authenticated read users'
  ) THEN
    RAISE EXCEPTION 'Policy creation failed';
  END IF;
END $$;

