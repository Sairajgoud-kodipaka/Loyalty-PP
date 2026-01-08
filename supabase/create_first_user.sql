-- Script to create your first admin user
-- Replace the values below with your actual user details

-- Step 1: First, create the user in Supabase Auth via Dashboard
-- Go to: Authentication → Users → Add User
-- Use the email and password you want

-- Step 2: After creating the user in Auth, run this SQL query
-- Replace 'your-email@example.com' with the email you used in Supabase Auth
-- Replace 'Your Full Name' with the actual name
-- The role can be 'staff', 'manager', or 'admin'

-- Get the auth user ID and create corresponding user record
INSERT INTO users (id, email, password_hash, full_name, role, is_active)
SELECT 
    id,
    email,
    '' as password_hash, -- Password is managed by Supabase Auth
    'Admin User' as full_name, -- Change this to your name
    'admin' as role, -- Change to 'staff' or 'manager' if needed
    true as is_active
FROM auth.users
WHERE email = 'your-email@example.com' -- CHANGE THIS EMAIL
ON CONFLICT (email) DO UPDATE
SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- Verify the user was created
SELECT id, email, full_name, role, is_active FROM users WHERE email = 'your-email@example.com';

