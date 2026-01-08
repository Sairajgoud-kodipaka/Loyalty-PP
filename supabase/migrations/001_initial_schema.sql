-- Enable UUID extension (pgcrypto for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mgp_id VARCHAR(9) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(15) UNIQUE NOT NULL,
    aadhar_number VARCHAR(12) UNIQUE,
    passport_number VARCHAR(20) UNIQUE,
    total_points_earned DECIMAL(10,2) DEFAULT 0,
    available_points DECIMAL(10,2) DEFAULT 0,
    total_points_redeemed DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('PURCHASE', 'REDEMPTION')),
    invoice_number VARCHAR(50),
    bill_amount DECIMAL(10,2) NOT NULL,
    points_earned DECIMAL(10,2) DEFAULT 0,
    points_redeemed DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2),
    activation_date TIMESTAMP,
    expiry_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired')),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create point_ledger table
CREATE TABLE point_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    points DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EARNED', 'REDEEMED', 'EXPIRED')),
    description TEXT,
    activation_date TIMESTAMP,
    expiry_date TIMESTAMP,
    is_active BOOLEAN DEFAULT false,
    is_expired BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

