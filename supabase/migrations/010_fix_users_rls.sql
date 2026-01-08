-- Fix RLS policy for users table to avoid circular dependency
-- The is_authenticated_user() function queries the users table, which creates a circular dependency
-- when used in RLS policies on the users table itself.

-- Drop the problematic policy that uses is_authenticated_user()
DROP POLICY IF EXISTS "Allow authenticated read users" ON users;

-- Create a new policy that allows authenticated users to read users table
-- This checks auth.uid() directly without querying the users table first
-- This is needed for middleware and initial authentication checks
CREATE POLICY "Allow authenticated read users"
ON users FOR SELECT
USING (
  -- Allow if user is authenticated (has auth.uid())
  auth.uid() IS NOT NULL
);

-- Note: The "Users can read own record" policy (line 117-121) is more restrictive
-- and will still apply, allowing users to read their own record by email match.
-- This new policy allows any authenticated user to read from the users table,
-- which is necessary for the middleware to check if a user exists.
-- You can make this more restrictive later if needed for security.

