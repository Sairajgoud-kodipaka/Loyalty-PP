-- Robust fix for users table RLS policy
-- This ensures authenticated users can read from the users table

-- Drop ALL existing policies on users table to start fresh
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Allow authenticated read users" ON users;

-- Create a simple policy that allows any authenticated user to read users table
-- This is needed for middleware to check if a user exists
CREATE POLICY "Allow authenticated read users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Also allow users to read their own record specifically (more restrictive)
CREATE POLICY "Users can read own record"
ON users FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Note: The first policy (Allow authenticated read users) allows any authenticated
-- user to read any row in the users table. This is necessary for the middleware
-- to check if a user exists. The second policy is more specific but redundant
-- given the first policy. Both are kept for clarity and potential future restrictions.

