-- Optimize search indexes for faster customer lookup
-- Note: Basic indexes already exist in migration 005_indexes.sql
-- This migration adds additional optimizations

-- Index for case-insensitive name search (simple approach)
-- Using LOWER() function index for case-insensitive searches
CREATE INDEX IF NOT EXISTS idx_customers_name_lower ON customers(LOWER(name));

-- Index for available_points (used in search results sorting)
CREATE INDEX IF NOT EXISTS idx_customers_available_points ON customers(available_points DESC);

-- Note: If pg_trgm extension is available, consider:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_customers_name_trgm ON customers USING gin(name gin_trgm_ops);
-- This provides better performance for partial name matches but requires extension

