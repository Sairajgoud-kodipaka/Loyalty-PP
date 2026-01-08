-- Make password_hash nullable in users table
-- Since we're using Supabase Auth, passwords are managed by auth.users
-- The password_hash column in the users table is not needed but kept for compatibility

ALTER TABLE users 
ALTER COLUMN password_hash DROP NOT NULL;

-- Update existing rows to set password_hash to NULL if it's empty
UPDATE users 
SET password_hash = NULL 
WHERE password_hash = '';

