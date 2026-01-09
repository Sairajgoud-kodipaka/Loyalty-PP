-- Run this in Supabase SQL Editor to verify the RLS policy exists and is correct

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- List all policies on users table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- If the policy doesn't exist or is wrong, run this:
DROP POLICY IF EXISTS "Allow authenticated read users" ON users;
DROP POLICY IF EXISTS "Users can read own record" ON users;

CREATE POLICY "Allow authenticated read users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Verify it was created
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'users' 
AND policyname = 'Allow authenticated read users';


