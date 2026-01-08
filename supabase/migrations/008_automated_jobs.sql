-- Enable pg_cron extension for scheduled jobs
-- Note: pg_cron must be enabled in Supabase project settings
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function to activate pending points
CREATE OR REPLACE FUNCTION activate_pending_points()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Activate points that have passed their activation date
    UPDATE point_ledger
    SET is_active = true
    WHERE type = 'EARNED'
    AND is_active = false
    AND is_expired = false
    AND activation_date <= NOW();
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    -- Update transaction status
    UPDATE transactions
    SET status = 'active'
    WHERE id IN (
        SELECT DISTINCT transaction_id
        FROM point_ledger
        WHERE type = 'EARNED'
        AND is_active = true
        AND activation_date <= NOW()
    )
    AND status = 'pending';
    
    -- Recalculate available points for all affected customers
    UPDATE customers
    SET available_points = (
        SELECT COALESCE(SUM(points), 0)
        FROM point_ledger
        WHERE customer_id = customers.id
        AND type = 'EARNED'
        AND is_active = true
        AND is_expired = false
    )
    WHERE id IN (
        SELECT DISTINCT customer_id
        FROM point_ledger
        WHERE type = 'EARNED'
        AND is_active = true
        AND activation_date <= NOW()
    );
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to expire old points
CREATE OR REPLACE FUNCTION expire_old_points()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Expire points that have passed their expiry date
    UPDATE point_ledger
    SET is_expired = true,
        is_active = false
    WHERE type = 'EARNED'
    AND is_expired = false
    AND expiry_date <= NOW();
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    -- Update transaction status
    UPDATE transactions
    SET status = 'expired'
    WHERE id IN (
        SELECT DISTINCT transaction_id
        FROM point_ledger
        WHERE type = 'EARNED'
        AND is_expired = true
        AND expiry_date <= NOW()
    )
    AND status = 'active';
    
    -- Create expiration notifications (Phase 2)
    INSERT INTO notifications (
        customer_id,
        notification_type,
        channel,
        message_template,
        status
    )
    SELECT DISTINCT
        customer_id,
        'POINTS_EXPIRED',
        'whatsapp',
        'Your MGP Points have expired. Visit us to earn new points!',
        'pending'
    FROM point_ledger
    WHERE type = 'EARNED'
    AND is_expired = true
    AND expiry_date <= NOW()
    AND expiry_date >= NOW() - INTERVAL '1 day';
    
    -- Recalculate available points for all affected customers
    UPDATE customers
    SET available_points = (
        SELECT COALESCE(SUM(points), 0)
        FROM point_ledger
        WHERE customer_id = customers.id
        AND type = 'EARNED'
        AND is_active = true
        AND is_expired = false
    )
    WHERE id IN (
        SELECT DISTINCT customer_id
        FROM point_ledger
        WHERE type = 'EARNED'
        AND is_expired = true
        AND expiry_date <= NOW()
    );
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule point activation job (hourly)
SELECT cron.schedule(
    'activate-pending-points',
    '0 * * * *', -- Every hour
    $$SELECT activate_pending_points();$$
);

-- Schedule point expiration job (daily at 2 AM)
SELECT cron.schedule(
    'expire-old-points',
    '0 2 * * *', -- Daily at 2:00 AM
    $$SELECT expire_old_points();$$
);

