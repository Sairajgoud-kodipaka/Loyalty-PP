-- Create users table for staff authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'manager', 'admin')),
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Fix created_by column type in transactions table (if it was created as VARCHAR)
-- This handles the case where migration 001 already ran with the old VARCHAR type
DO $$
BEGIN
    -- Check if created_by exists and is VARCHAR, then alter it to UUID
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'transactions' 
        AND column_name = 'created_by'
        AND data_type = 'character varying'
    ) THEN
        -- Drop any existing foreign key constraint if it exists
        ALTER TABLE transactions DROP CONSTRAINT IF EXISTS fk_transactions_created_by;
        
        -- Drop and recreate the column with correct type (UUID instead of VARCHAR)
        ALTER TABLE transactions DROP COLUMN created_by;
        ALTER TABLE transactions ADD COLUMN created_by UUID;
    END IF;
END $$;

-- Add created_by foreign key to transactions table
ALTER TABLE transactions 
ADD CONSTRAINT fk_transactions_created_by 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

