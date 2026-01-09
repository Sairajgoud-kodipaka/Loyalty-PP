-- IMMEDIATE FIX: Activate abhinav's 200 points RIGHT NOW
-- Run this in Supabase SQL Editor

-- Step 1: Set activation_date to past (so it can activate)
UPDATE point_ledger
SET activation_date = NOW() - INTERVAL '1 minute'
WHERE customer_id IN (
    SELECT id FROM customers WHERE name = 'abhinav'
)
AND type = 'EARNED'
AND is_active = false
AND is_expired = false;

-- Step 2: Activate the points
SELECT activate_pending_points();

-- Step 3: Verify it worked
SELECT 
    c.name,
    c.available_points,
    pl.points,
    pl.is_active,
    pl.activation_date
FROM customers c
JOIN point_ledger pl ON pl.customer_id = c.id
WHERE c.name = 'abhinav'
  AND pl.type = 'EARNED'
ORDER BY pl.created_at DESC;

-- Expected result: 
-- available_points should be 200
-- is_active should be true

