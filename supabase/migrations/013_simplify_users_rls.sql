-- Simplify users table RLS - remove redundant policy
-- Having two SELECT policies might cause issues with PostgREST evaluation

-- Drop both existing policies
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Allow authenticated read users" ON users;

-- Create a single, simple policy that allows authenticated users to read users table
-- This is needed for middleware to check if a user exists
CREATE POLICY "Allow authenticated read users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Verify RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

