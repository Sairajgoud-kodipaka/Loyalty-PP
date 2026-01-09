-- INSTANT ACTIVATION: Points activate immediately (no delay)
-- IMPORTANT: This removes all activation delays for testing
-- Points will be active as soon as they're earned
-- Migration 017: Replaces test mode (20-second delay) with instant activation

-- Function to add purchase transaction (INSTANT ACTIVATION)
CREATE OR REPLACE FUNCTION add_purchase(
    p_customer_id UUID,
    p_bill_amount DECIMAL,
    p_invoice_number VARCHAR(50) DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_points DECIMAL(10,2);
    v_activation_date TIMESTAMP;
    v_expiry_date TIMESTAMP;
    v_transaction_id UUID;
    v_result JSON;
BEGIN
    -- Validate minimum bill amount
    IF p_bill_amount < 50 THEN
        RAISE EXCEPTION 'Minimum bill amount is ₹50';
    END IF;
    
    -- Calculate points
    v_points := calculate_points(p_bill_amount);
    
    -- INSTANT ACTIVATION: Set activation date to NOW() (points activate immediately)
    v_activation_date := NOW();
    
    -- Set expiry date (2 years from activation)
    v_expiry_date := v_activation_date + INTERVAL '2 years';
    
    -- Create transaction
    INSERT INTO transactions (
        customer_id,
        transaction_type,
        invoice_number,
        bill_amount,
        points_earned,
        activation_date,
        expiry_date,
        status,
        created_by
    ) VALUES (
        p_customer_id,
        'PURCHASE',
        p_invoice_number,
        p_bill_amount,
        v_points,
        v_activation_date,
        v_expiry_date,
        'active', -- Set to active immediately
        p_created_by
    ) RETURNING id INTO v_transaction_id;
    
    -- Create point ledger entry (ACTIVE IMMEDIATELY)
    INSERT INTO point_ledger (
        customer_id,
        transaction_id,
        points,
        type,
        activation_date,
        expiry_date,
        is_active, -- Set to true immediately
        description
    ) VALUES (
        p_customer_id,
        v_transaction_id,
        v_points,
        'EARNED',
        v_activation_date,
        v_expiry_date,
        true, -- Points are active immediately
        'Points earned from purchase of ₹' || p_bill_amount
    );
    
    -- Update customer totals and available points immediately
    UPDATE customers
    SET total_points_earned = total_points_earned + v_points,
        available_points = (
            SELECT COALESCE(SUM(points), 0)
            FROM point_ledger
            WHERE customer_id = p_customer_id
            AND type = 'EARNED'
            AND is_active = true
            AND is_expired = false
        ),
        updated_at = NOW()
    WHERE id = p_customer_id;
    
    -- Return result
    SELECT json_build_object(
        'transaction_id', v_transaction_id,
        'points_earned', v_points,
        'activation_date', v_activation_date,
        'expiry_date', v_expiry_date
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also update redeem_points function to activate new points immediately
CREATE OR REPLACE FUNCTION redeem_points(
    p_customer_id UUID,
    p_bill_amount DECIMAL,
    p_points_to_redeem DECIMAL,
    p_invoice_number VARCHAR(50) DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_available_points DECIMAL(10,2);
    v_discount DECIMAL(10,2);
    v_final_bill DECIMAL(10,2);
    v_new_points DECIMAL(10,2);
    v_activation_date TIMESTAMP;
    v_expiry_date TIMESTAMP;
    v_transaction_id UUID;
    v_result JSON;
    v_ledger_record RECORD;
    v_points_remaining DECIMAL(10,2);
    v_total_redeemed DECIMAL(10,2);
BEGIN
    -- Get available points
    SELECT COALESCE(SUM(points), 0)
    INTO v_available_points
    FROM point_ledger
    WHERE customer_id = p_customer_id
    AND type = 'EARNED'
    AND is_active = true
    AND is_expired = false;
    
    -- Validate sufficient points
    IF p_points_to_redeem > v_available_points THEN
        RAISE EXCEPTION 'Insufficient points. Available: %', v_available_points;
    END IF;
    
    -- Save original points to redeem
    v_total_redeemed := p_points_to_redeem;
    v_points_remaining := p_points_to_redeem;
    
    -- Calculate discount (1 point = ₹1)
    v_discount := p_points_to_redeem;
    
    -- Calculate final bill (cannot be negative)
    v_final_bill := GREATEST(p_bill_amount - v_discount, 0);
    
    -- Calculate new points on final amount
    v_new_points := calculate_points(v_final_bill);
    
    -- INSTANT ACTIVATION: Set dates for new points (activate immediately)
    v_activation_date := NOW();
    v_expiry_date := v_activation_date + INTERVAL '2 years';
    
    -- Create redemption transaction
    INSERT INTO transactions (
        customer_id,
        transaction_type,
        invoice_number,
        bill_amount,
        points_redeemed,
        discount_amount,
        final_amount,
        points_earned,
        activation_date,
        expiry_date,
        status,
        created_by
    ) VALUES (
        p_customer_id,
        'REDEMPTION',
        p_invoice_number,
        p_bill_amount,
        v_total_redeemed,
        v_discount,
        v_final_bill,
        v_new_points,
        v_activation_date,
        v_expiry_date,
        'active', -- Set to active immediately
        p_created_by
    ) RETURNING id INTO v_transaction_id;
    
    -- Deduct redeemed points from ledger (FIFO - oldest first)
    FOR v_ledger_record IN
        SELECT id, points
        FROM point_ledger
        WHERE customer_id = p_customer_id
        AND type = 'EARNED'
        AND is_active = true
        AND is_expired = false
        ORDER BY activation_date ASC, created_at ASC
    LOOP
        IF v_points_remaining <= 0 THEN
            EXIT;
        END IF;
        
        IF v_ledger_record.points <= v_points_remaining THEN
            -- Full redemption - mark as redeemed
            UPDATE point_ledger
            SET points = 0,
                description = 'Points redeemed for discount'
            WHERE id = v_ledger_record.id;
            
            -- Create redeemed entry
            INSERT INTO point_ledger (
                customer_id,
                transaction_id,
                points,
                type,
                description
            ) VALUES (
                p_customer_id,
                v_transaction_id,
                v_ledger_record.points,
                'REDEEMED',
                'Points redeemed for discount'
            );
            
            v_points_remaining := v_points_remaining - v_ledger_record.points;
        ELSE
            -- Partial redemption - split the entry
            UPDATE point_ledger
            SET points = points - v_points_remaining,
                description = 'Partial points redeemed'
            WHERE id = v_ledger_record.id;
            
            -- Create redeemed entry
            INSERT INTO point_ledger (
                customer_id,
                transaction_id,
                points,
                type,
                description
            ) VALUES (
                p_customer_id,
                v_transaction_id,
                v_points_remaining,
                'REDEEMED',
                'Points redeemed for discount'
            );
            
            v_points_remaining := 0;
        END IF;
    END LOOP;
    
    -- Add new earned points if any (ACTIVE IMMEDIATELY)
    IF v_new_points > 0 THEN
        INSERT INTO point_ledger (
            customer_id,
            transaction_id,
            points,
            type,
            activation_date,
            expiry_date,
            is_active, -- Set to true immediately
            description
        ) VALUES (
            p_customer_id,
            v_transaction_id,
            v_new_points,
            'EARNED',
            v_activation_date,
            v_expiry_date,
            true, -- Points are active immediately
            'Points earned from purchase of ₹' || v_final_bill
        );
    END IF;
    
    -- Update customer balances
    UPDATE customers
    SET total_points_redeemed = total_points_redeemed + v_total_redeemed,
        total_points_earned = total_points_earned + v_new_points,
        available_points = (
            SELECT COALESCE(SUM(points), 0)
            FROM point_ledger
            WHERE customer_id = p_customer_id
            AND type = 'EARNED'
            AND is_active = true
            AND is_expired = false
        ),
        updated_at = NOW()
    WHERE id = p_customer_id;
    
    -- Return result
    SELECT json_build_object(
        'transaction_id', v_transaction_id,
        'points_redeemed', v_total_redeemed,
        'discount', v_discount,
        'final_bill', v_final_bill,
        'new_points_earned', v_new_points
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

