-- Run this in Supabase SQL Editor to check if your user exists
-- Replace 'sairajgoudkodipaka@gmail.com' with your actual email

-- Check if user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'sairajgoudkodipaka@gmail.com';

-- Check if user exists in public.users table
SELECT id, email, full_name, role, is_active 
FROM users 
WHERE email = 'sairajgoudkodipaka@gmail.com';

-- If user exists in auth.users but NOT in public.users, create the record:
-- (Replace the values with your actual details)
INSERT INTO users (id, email, password_hash, full_name, role, is_active)
SELECT 
    id,
    email,
    '' as password_hash, -- Password is managed by Supabase Auth
    'Your Full Name' as full_name, -- CHANGE THIS
    'admin' as role, -- Change to 'staff' or 'manager' if needed
    true as is_active
FROM auth.users
WHERE email = 'sairajgoudkodipaka@gmail.com'
ON CONFLICT (email) DO UPDATE
SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

