-- Indexes for customers table
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_mgp_id ON customers(mgp_id);
CREATE INDEX idx_customers_aadhar ON customers(aadhar_number);
CREATE INDEX idx_customers_passport ON customers(passport_number);
CREATE INDEX idx_customers_status ON customers(status);

-- Indexes for transactions table
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transactions_date ON transactions(created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created_by ON transactions(created_by);

-- Indexes for point_ledger table
CREATE INDEX idx_ledger_customer ON point_ledger(customer_id);
CREATE INDEX idx_ledger_transaction ON point_ledger(transaction_id);
CREATE INDEX idx_ledger_active ON point_ledger(is_active, is_expired);
CREATE INDEX idx_ledger_type ON point_ledger(type);
CREATE INDEX idx_ledger_expiry ON point_ledger(expiry_date) WHERE is_expired = false;

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Indexes for audit_logs table
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs(action_type);

-- Indexes for notifications table
CREATE INDEX idx_notifications_customer ON notifications(customer_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_pending ON notifications(status, created_at) WHERE status = 'pending';

