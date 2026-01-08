-- Function to generate MGP ID
CREATE OR REPLACE FUNCTION generate_mgp_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
    new_mgp_id VARCHAR(9);
BEGIN
    -- Get the next sequential number
    SELECT COALESCE(MAX(CAST(SUBSTRING(mgp_id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM customers;
    
    -- Format as MGP000001, MGP000002, etc.
    new_mgp_id := 'MGP' || LPAD(next_num::TEXT, 6, '0');
    
    NEW.mgp_id := new_mgp_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate MGP ID before insert
CREATE TRIGGER trigger_generate_mgp_id
BEFORE INSERT ON customers
FOR EACH ROW
WHEN (NEW.mgp_id IS NULL OR NEW.mgp_id = '')
EXECUTE FUNCTION generate_mgp_id();

-- Function to calculate points
CREATE OR REPLACE FUNCTION calculate_points(bill_amount DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    RETURN FLOOR(bill_amount / 50);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

