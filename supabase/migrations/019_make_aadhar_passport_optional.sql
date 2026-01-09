-- Make Aadhar and Passport truly optional in database
-- This ensures both fields can be NULL without any constraints

-- Drop existing unique constraints (they already allow NULL, but let's ensure they're properly set)
-- PostgreSQL allows multiple NULLs in UNIQUE columns by default, but we'll make it explicit

-- First, check if there are any existing constraints and drop them if needed
DO $$ 
BEGIN
    -- Drop unique constraint on aadhar_number if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'customers_aadhar_number_key'
    ) THEN
        ALTER TABLE customers DROP CONSTRAINT customers_aadhar_number_key;
    END IF;
    
    -- Drop unique constraint on passport_number if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'customers_passport_number_key'
    ) THEN
        ALTER TABLE customers DROP CONSTRAINT customers_passport_number_key;
    END IF;
END $$;

-- Recreate unique constraints that allow NULL values
-- PostgreSQL UNIQUE constraints already allow multiple NULLs, but we'll use partial unique indexes
-- to ensure uniqueness only for non-NULL values

-- Create partial unique index for aadhar_number (only enforces uniqueness for non-NULL values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_aadhar_unique 
ON customers(aadhar_number) 
WHERE aadhar_number IS NOT NULL;

-- Create partial unique index for passport_number (only enforces uniqueness for non-NULL values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_passport_unique 
ON customers(passport_number) 
WHERE passport_number IS NOT NULL;

-- Ensure columns are nullable (they should already be, but making it explicit)
ALTER TABLE customers 
ALTER COLUMN aadhar_number DROP NOT NULL,
ALTER COLUMN passport_number DROP NOT NULL;

-- Add comment to document the optional nature
COMMENT ON COLUMN customers.aadhar_number IS 'Optional - 12-digit Aadhar number. Can be NULL.';
COMMENT ON COLUMN customers.passport_number IS 'Optional - Passport number. Can be NULL.';

