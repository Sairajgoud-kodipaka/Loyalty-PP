# Software Requirements Specification (SRS)
## MGP Loyalty Program System
### Version 1.0 | January 2026

---

## 1. INTRODUCTION

### 1.1 Purpose
This document specifies the software requirements for the MGP (Mangatrai Pearls & Jewellers) Loyalty Program System, a comprehensive customer rewards management platform designed to increase customer retention and track purchase behavior.

### 1.2 Scope
The MGP Loyalty Program System is a web-based application that:
- Manages customer loyalty accounts with unique MGP IDs
- Calculates and tracks reward points based on purchase amounts
- Enables point redemption with automated discount calculations
- Provides real-time customer balance inquiries
- Automates point lifecycle management (activation, expiration)
- Sends transactional notifications via WhatsApp/SMS (Phase 2)

### 1.3 Definitions and Acronyms
| Term | Definition |
|------|------------|
| MGP | Mangatrai Pearls & Jewellers |
| MGP ID | Unique customer identifier (format: MGP######) |
| MGP Points | Loyalty currency (1 point = ₹1) |
| Activation Period | 24-hour waiting period before points become redeemable |
| Point Validity | 2-year lifespan from activation date |
| Transaction | Any purchase or redemption event |
| Ledger | Detailed point movement log |

### 1.4 References
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Gupshup API Documentation: https://docs.gupshup.io/

### 1.5 Overview
This SRS contains:
- Overall system description
- Functional requirements
- Non-functional requirements
- System interfaces
- Database schema specifications
- Security requirements

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective
The MGP Loyalty Program System is a standalone web application that operates independently but is designed for potential integration with existing POS/billing systems. The system consists of:
```
┌─────────────────────────────────────────────┐
│           Admin Web Interface               │
│  (Next.js + React + Tailwind CSS)          │
└─────────────────┬───────────────────────────┘
                  │
                  │ HTTPS/REST API
                  │
┌─────────────────▼───────────────────────────┐
│         Supabase Backend Layer              │
│  - PostgreSQL Database                      │
│  - Row Level Security (RLS)                 │
│  - Edge Functions                           │
│  - Real-time Subscriptions                  │
│  - Automated Jobs (pg_cron)                 │
└─────────────────┬───────────────────────────┘
                  │
                  │ API Integration (Phase 2)
                  │
┌─────────────────▼───────────────────────────┐
│      External Services (Future)             │
│  - Gupshup (WhatsApp/SMS)                  │
│  - Email Service                            │
│  - Analytics Platform                       │
└─────────────────────────────────────────────┘
```

### 2.2 Product Functions
Primary functions include:

**Customer Management**
- Register new customers with automatic MGP ID generation
- Search customers by phone, MGP ID, name, or Aadhar
- View customer profile with complete transaction history
- Update customer information
- Deactivate/reactivate customer accounts

**Transaction Processing**
- Record purchase transactions
- Calculate reward points automatically (₹50 = 1 point)
- Process point redemptions with discount calculations
- Handle partial point redemptions
- Generate transaction receipts

**Point Lifecycle Management**
- Auto-activate points after 24 hours
- Track point expiration dates (2 years from activation)
- Auto-expire outdated points
- Alert staff about expiring points
- Maintain detailed point ledger

**Reporting & Analytics**
- Customer point balance inquiries
- Transaction history reports
- Point redemption analytics
- Customer segmentation by point balance
- Expiring points dashboard

### 2.3 User Characteristics

| User Type | Technical Expertise | Primary Tasks |
|-----------|-------------------|---------------|
| **Store Staff** | Basic computer skills | Customer registration, purchase entry, point redemption, balance inquiry |
| **Store Manager** | Moderate | All staff tasks + reporting, customer management |
| **System Admin** | Advanced | User management, system configuration, database maintenance |

### 2.4 Constraints

**Technical Constraints**
- Must support modern web browsers (Chrome, Firefox, Safari, Edge)
- Internet connectivity required for real-time operations
- Database size limited by Supabase free tier (500MB initially)
- API rate limits for external services (Gupshup: 100 req/sec)

**Business Constraints**
- Points cannot be transferred between customers
- Minimum purchase amount: ₹50 (to earn 1 point)
- No maximum limit on point accumulation
- No cash-out option for points
- 24-hour mandatory activation period
- 2-year maximum point validity

**Regulatory Constraints**
- Must comply with India's data protection laws
- Aadhar data must be encrypted at rest
- Customer consent required for data collection
- Right to data deletion upon request

### 2.5 Assumptions and Dependencies

**Assumptions**
- Customers have valid Indian phone numbers (10 digits)
- Staff has basic computer literacy
- Stable internet connection at store locations
- Single currency transactions (INR)

**Dependencies**
- Supabase platform availability (99.9% uptime SLA)
- Vercel hosting platform (for frontend)
- Gupshup API availability (Phase 2)
- Modern web browser support

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Customer Management Module

#### FR-CM-001: Customer Registration
**Priority:** High  
**Description:** System shall allow staff to register new customers

**Input:**
- Name (mandatory, 2-255 characters)
- Phone number (mandatory, 10 digits, unique)
- Email (optional, valid format)
- Aadhar number (optional, 12 digits, unique)
- Passport number (optional, if Aadhar not provided)

**Processing:**
- Validate all input fields
- Check for duplicate phone/Aadhar
- Auto-generate unique MGP ID (MGP000001, MGP000002...)
- Initialize point balances to zero
- Set status to 'active'

**Output:**
- Success message with MGP ID
- Customer profile page
- Error messages for validation failures

**Business Rules:**
- Phone number must be unique across all customers
- At least one of (Aadhar OR Passport) recommended but not mandatory
- MGP ID format: "MGP" + 6-digit sequential number with leading zeros

#### FR-CM-002: Customer Search
**Priority:** High  
**Description:** System shall provide multi-criteria customer search

**Input:**
- Search term (phone/MGP ID/name/Aadhar)

**Processing:**
- Search across multiple fields simultaneously
- Return partial matches for name
- Exact match for phone, MGP ID, Aadhar
- Sort results by relevance

**Output:**
- List of matching customers with key details
- Empty state if no matches
- Option to register new customer if not found

#### FR-CM-003: Customer Profile View
**Priority:** High  
**Description:** System shall display comprehensive customer information

**Display Elements:**
- Customer details (MGP ID, name, contact info)
- Point balance summary:
  - Available points (redeemable now)
  - Pending points (activating soon)
  - Expiring soon (within 30 days)
  - Total earned (lifetime)
  - Total redeemed (lifetime)
- Recent transactions (last 10)
- Quick actions (new purchase, redeem points)

#### FR-CM-004: Customer Update
**Priority:** Medium  
**Description:** System shall allow updates to customer information

**Updatable Fields:**
- Name
- Email
- Phone (with duplicate check)
- Aadhar (with duplicate check)

**Non-updatable Fields:**
- MGP ID (permanent identifier)
- Point balances (updated only via transactions)
- Created date

### 3.2 Transaction Management Module

#### FR-TM-001: Purchase Transaction
**Priority:** High  
**Description:** System shall record purchases and calculate reward points

**Input:**
- Customer ID (selected from search)
- Bill amount (₹, minimum ₹50)
- Invoice number (optional, unique)
- Created by (staff username)

**Processing:**
1. Calculate points: `FLOOR(bill_amount / 50)`
2. Set activation date: `current_timestamp + 24 hours`
3. Set expiry date: `activation_date + 2 years`
4. Create transaction record with status 'pending'
5. Create point ledger entry
6. Update customer's total_points_earned

**Output:**
- Success confirmation with:
  - Points earned
  - Activation date
  - Expiry date
  - Updated customer balance

**Business Rules:**
- Points earned = ₹50 per 1 point (round down)
- Points become active after 24 hours
- Points expire 2 years from activation
- Minimum bill amount: ₹50

#### FR-TM-002: Point Redemption
**Priority:** High  
**Description:** System shall process point redemptions with discount calculation

**Input:**
- Customer ID
- Bill amount (₹)
- Points to redeem
- Invoice number
- Created by (staff username)

**Processing:**
1. Validate sufficient available points
2. Validate points are active (24+ hours old)
3. Calculate discount: `points_to_redeem × ₹1`
4. Calculate final bill: `MAX(bill_amount - discount, 0)`
5. Calculate new points on final amount: `FLOOR(final_bill / 50)`
6. Create redemption transaction
7. Deduct redeemed points from ledger
8. Add new earned points to ledger
9. Update customer balances

**Output:**
- Transaction confirmation with:
  - Original bill amount
  - Points redeemed
  - Discount applied
  - Final bill amount
  - New points earned
  - Updated balance

**Business Rules:**
- Can redeem any amount ≤ available balance
- Points must be active (not pending)
- New points earned on final amount (after discount)
- 1 point = ₹1 discount
- Final bill cannot be negative

#### FR-TM-003: Transaction History
**Priority:** Medium  
**Description:** System shall display transaction history with filters

**Display Elements:**
- Transaction date/time
- Type (Purchase/Redemption)
- Bill amount
- Points earned/redeemed
- Invoice number
- Final amount
- Status

**Filters:**
- Date range
- Transaction type
- Status
- Customer

**Export:**
- CSV export option
- PDF report generation

#### FR-TM-004: Transaction Reversal (Future)
**Priority:** Low  
**Description:** System shall support transaction cancellations/reversals

**Processing:**
- Reverse point allocations
- Create reversal ledger entry
- Update customer balances
- Maintain audit trail

### 3.3 Point Lifecycle Management

#### FR-PL-001: Point Activation
**Priority:** High  
**Description:** System shall automatically activate pending points

**Trigger:** Automated job runs every hour

**Processing:**
1. Select all point_ledger entries where:
   - `is_active = false`
   - `activation_date <= current_timestamp`
   - `type = 'EARNED'`
2. Update `is_active = true`
3. Update transaction status to 'active'
4. Recalculate customer available_points

**Business Rules:**
- Points activate exactly 24 hours after purchase
- Only earned points are activated (not redeemed/expired)

#### FR-PL-002: Point Expiration
**Priority:** High  
**Description:** System shall automatically expire old points

**Trigger:** Automated job runs daily at 2:00 AM

**Processing:**
1. Select all point_ledger entries where:
   - `is_expired = false`
   - `expiry_date <= current_timestamp`
   - `type = 'EARNED'`
2. Update `is_expired = true`
3. Update transaction status to 'expired'
4. Recalculate customer available_points
5. Create notification for customer (Phase 2)

**Business Rules:**
- Points expire exactly 2 years after activation
- Expired points cannot be recovered
- Customer notified upon expiration

#### FR-PL-003: Expiring Soon Alert
**Priority:** Medium  
**Description:** System shall identify points expiring within 30 days

**Display:**
- Customer profile shows expiring points count
- Dashboard widget for all customers with expiring points
- Notification sent 30 days before expiry (Phase 2)

**Business Rules:**
- Alert threshold: 30 days before expiry
- Include point count and expiry date
- Allow staff to inform customer proactively

### 3.4 Reporting Module

#### FR-RP-001: Customer Balance Report
**Priority:** High  
**Description:** System shall generate customer point balance report

**Report Fields:**
- MGP ID
- Customer name
- Available points
- Pending points
- Expiring soon
- Total earned
- Total redeemed

**Filters:**
- Point balance range
- Status (active/inactive)
- Registration date range

**Export:** CSV, PDF

#### FR-RP-002: Transaction Summary Report
**Priority:** Medium  
**Description:** System shall generate transaction analytics

**Metrics:**
- Total transactions (count)
- Total purchases (₹)
- Total points issued
- Total points redeemed
- Average transaction value
- Redemption rate (%)

**Grouping:** By day/week/month/year

#### FR-RP-003: Customer Segmentation
**Priority:** Low  
**Description:** System shall segment customers by engagement

**Segments:**
- High value (>5000 points earned)
- Active redeemers (>50% redemption rate)
- At-risk (points expiring soon)
- Dormant (no activity in 90 days)

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance Requirements

#### NFR-PF-001: Response Time
- Customer search: < 2 seconds
- Transaction processing: < 3 seconds
- Report generation: < 5 seconds for 1000 records
- Dashboard load: < 4 seconds

#### NFR-PF-002: Scalability
- Support 10,000 active customers
- Handle 500 transactions per day
- Database growth: 1GB per year
- Concurrent users: 10 simultaneous staff

#### NFR-PF-003: Availability
- System uptime: 99.5% (excluding planned maintenance)
- Planned downtime: < 4 hours per month
- Recovery time objective (RTO): 4 hours
- Recovery point objective (RPO): 24 hours

### 4.2 Security Requirements

#### NFR-SC-001: Authentication
- Staff login with username/password
- Session timeout: 30 minutes of inactivity
- Password requirements:
  - Minimum 8 characters
  - Mix of letters, numbers, symbols
  - No password reuse (last 3 passwords)

#### NFR-SC-002: Authorization
- Role-based access control (RBAC)
- Roles: Staff, Manager, Admin
- Manager can view all reports
- Staff limited to transaction processing

#### NFR-SC-003: Data Protection
- Aadhar numbers encrypted at rest (AES-256)
- Passport numbers encrypted at rest
- Phone numbers masked in logs
- PII data not logged in plain text

#### NFR-SC-004: Audit Trail
- Log all customer data changes
- Log all transaction modifications
- Include: user, timestamp, old value, new value
- Audit logs retained for 5 years

### 4.3 Usability Requirements

#### NFR-US-001: User Interface
- Responsive design (desktop, tablet)
- Mobile-first approach for common tasks
- Maximum 3 clicks to complete any task
- Consistent navigation across all pages

#### NFR-US-002: Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode option

#### NFR-US-003: Learnability
- New staff can process transactions within 15 minutes of training
- Context-sensitive help available
- Inline validation messages
- Confirmation prompts for critical actions

### 4.4 Reliability Requirements

#### NFR-RL-001: Data Integrity
- Transaction records immutable (no updates, only inserts)
- Point ledger maintains complete audit trail
- Customer balances always reconcile with ledger
- Automated daily data consistency checks

#### NFR-RL-002: Error Handling
- Graceful degradation for API failures
- User-friendly error messages (no technical jargon)
- Automatic retry for transient failures
- Error logging for debugging

#### NFR-RL-003: Backup and Recovery
- Automated daily database backups
- Point-in-time recovery capability
- Backup retention: 30 days
- Backup testing: Monthly

### 4.5 Maintainability Requirements

#### NFR-MT-001: Code Quality
- TypeScript with strict mode
- ESLint + Prettier for code formatting
- Test coverage: > 70%
- Code review required for all changes

#### NFR-MT-002: Documentation
- Inline code comments for complex logic
- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Deployment runbook

#### NFR-MT-003: Monitoring
- Application performance monitoring (APM)
- Error tracking (Sentry)
- Database performance metrics
- API endpoint monitoring

---

## 5. SYSTEM INTERFACES

### 5.1 User Interfaces

#### UI-001: Dashboard
- Key metrics widgets (total customers, active points, today's transactions)
- Quick actions (register customer, new purchase, redeem points)
- Recent activity feed
- Alerts panel (expiring points, system notifications)

#### UI-002: Customer Registration Form
- Single-page form with validation
- Auto-formatting for phone numbers
- Duplicate detection on blur
- Success modal with generated MGP ID

#### UI-003: Customer Profile Page
- Header with customer details and MGP ID
- Point balance cards (visual hierarchy)
- Transaction history table with pagination
- Action buttons (new purchase, redeem)

#### UI-004: Purchase Transaction Form
- Customer search/selection
- Bill amount input with currency formatting
- Points calculation preview
- Invoice number (optional)
- Confirmation modal with summary

#### UI-005: Redemption Form
- Customer search/selection
- Available points display (highlighted)
- Bill amount and redemption amount inputs
- Discount calculation preview
- Final bill display
- Confirmation modal

### 5.2 Hardware Interfaces
- No direct hardware interfaces required
- Operates on standard computer hardware
- Recommended: Touchscreen-capable devices for POS integration (future)

### 5.3 Software Interfaces

#### SI-001: Supabase Database
- Protocol: PostgreSQL wire protocol
- Connection: TLS 1.2+ encrypted
- Authentication: API key + JWT
- API version: Supabase v2

#### SI-002: Gupshup Messaging API (Phase 2)
- Protocol: HTTPS REST API
- Authentication: API key in header
- Rate limit: 100 requests/second
- Message types: Template-based WhatsApp, transactional SMS

#### SI-003: External Authentication (Future)
- OAuth 2.0 support for Google/Microsoft SSO
- SAML 2.0 for enterprise integration

### 5.4 Communication Interfaces

#### CI-001: API Endpoints
All endpoints use HTTPS with JSON payloads

**Customer Management**
```
POST   /api/customers              - Create customer
GET    /api/customers/:id          - Get customer details
GET    /api/customers/search?q=    - Search customers
PATCH  /api/customers/:id          - Update customer
DELETE /api/customers/:id          - Deactivate customer
```

**Transactions**
```
POST   /api/transactions/purchase  - Record purchase
POST   /api/transactions/redeem    - Process redemption
GET    /api/transactions/:id       - Get transaction details
GET    /api/transactions?customer_id= - Get customer transactions
```

**Reports**
```
GET    /api/reports/balance        - Customer balance report
GET    /api/reports/transactions   - Transaction summary
GET    /api/reports/expiring       - Expiring points report
```

---

## 6. DATABASE SPECIFICATIONS

### 6.1 Entity Relationship Diagram
```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   CUSTOMERS     │         │  TRANSACTIONS    │         │  POINT_LEDGER   │
├─────────────────┤         ├──────────────────┤         ├─────────────────┤
│ id (PK)         │────┐    │ id (PK)          │────┐    │ id (PK)         │
│ mgp_id (unique) │    └───<│ customer_id (FK) │    └───<│ customer_id(FK) │
│ name            │         │ transaction_type │         │ transaction_id  │
│ email           │         │ bill_amount      │         │ points          │
│ phone (unique)  │         │ points_earned    │         │ type            │
│ aadhar_number   │         │ points_redeemed  │         │ activation_date │
│ passport_number │         │ discount_amount  │         │ expiry_date     │
│ total_points... │         │ final_amount     │         │ is_active       │
│ available_points│         │ activation_date  │         │ is_expired      │
│ total_points... │         │ expiry_date      │         │ created_at      │
│ status          │         │ status           │         └─────────────────┘
│ created_at      │         │ invoice_number   │
│ updated_at      │         │ created_by       │
└─────────────────┘         │ created_at       │
                            └──────────────────┘
```

### 6.2 Table Specifications

#### Table: customers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique customer identifier |
| mgp_id | VARCHAR(9) | UNIQUE, NOT NULL | Customer-facing ID (MGP000001) |
| name | VARCHAR(255) | NOT NULL | Customer full name |
| email | VARCHAR(255) | NULL | Email address |
| phone | VARCHAR(15) | UNIQUE, NOT NULL | 10-digit phone number |
| aadhar_number | VARCHAR(12) | UNIQUE, NULL | 12-digit Aadhar number |
| passport_number | VARCHAR(20) | UNIQUE, NULL | Passport number |
| total_points_earned | DECIMAL(10,2) | DEFAULT 0 | Lifetime points earned |
| available_points | DECIMAL(10,2) | DEFAULT 0 | Current redeemable balance |
| total_points_redeemed | DECIMAL(10,2) | DEFAULT 0 | Lifetime points redeemed |
| status | VARCHAR(20) | DEFAULT 'active' | Account status |
| created_at | TIMESTAMP | DEFAULT NOW() | Registration timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_customers_phone` ON phone
- `idx_customers_mgp_id` ON mgp_id
- `idx_customers_aadhar` ON aadhar_number
- `idx_customers_passport` ON passport_number

#### Table: transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Transaction identifier |
| customer_id | UUID | FOREIGN KEY → customers(id) | Customer reference |
| transaction_type | VARCHAR(20) | NOT NULL | 'PURCHASE' or 'REDEMPTION' |
| invoice_number | VARCHAR(50) | NULL | Invoice/bill number |
| bill_amount | DECIMAL(10,2) | NOT NULL | Original bill amount |
| points_earned | DECIMAL(10,2) | DEFAULT 0 | Points awarded |
| points_redeemed | DECIMAL(10,2) | DEFAULT 0 | Points used |
| discount_amount | DECIMAL(10,2) | DEFAULT 0 | Discount applied |
| final_amount | DECIMAL(10,2) | NULL | Amount after discount |
| activation_date | TIMESTAMP | NULL | When points activate |
| expiry_date | TIMESTAMP | NULL | When points expire |
| status | VARCHAR(20) | DEFAULT 'pending' | 'pending', 'active', 'expired' |
| notes | TEXT | NULL | Additional notes |
| created_by | VARCHAR(100) | NULL | Staff username |
| created_at | TIMESTAMP | DEFAULT NOW() | Transaction timestamp |

**Indexes:**
- `idx_transactions_customer` ON customer_id
- `idx_transactions_date` ON created_at DESC
- `idx_transactions_status` ON status

#### Table: point_ledger

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Ledger entry identifier |
| customer_id | UUID | FOREIGN KEY → customers(id) | Customer reference |
| transaction_id | UUID | FOREIGN KEY → transactions(id) | Transaction reference |
| points | DECIMAL(10,2) | NOT NULL | Point movement (+/-) |
| type | VARCHAR(20) | NOT NULL | 'EARNED', 'REDEEMED', 'EXPIRED' |
| description | TEXT | NULL | Entry description |
| activation_date | TIMESTAMP | NULL | When points activate |
| expiry_date | TIMESTAMP | NULL | When points expire |
| is_active | BOOLEAN | DEFAULT false | Are points active |
| is_expired | BOOLEAN | DEFAULT false | Are points expired |
| created_at | TIMESTAMP | DEFAULT NOW() | Entry timestamp |

**Indexes:**
- `idx_ledger_customer` ON customer_id
- `idx_ledger_active` ON (is_active, is_expired)

#### Table: users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address (used for login) |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| full_name | VARCHAR(255) | NOT NULL | Staff full name |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'staff' | 'staff', 'manager', 'admin' |
| phone | VARCHAR(15) | NULL | Contact phone number |
| is_active | BOOLEAN | DEFAULT true | Account active status |
| last_login | TIMESTAMP | NULL | Last login timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_users_email` ON email
- `idx_users_role` ON role
- `idx_users_active` ON is_active

#### Table: audit_logs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Log entry identifier |
| user_id | UUID | FOREIGN KEY → users(id), NULL | User who performed action |
| action_type | VARCHAR(50) | NOT NULL | Action type (CREATE, UPDATE, DELETE, etc.) |
| entity_type | VARCHAR(50) | NOT NULL | Entity type (customer, transaction, etc.) |
| entity_id | UUID | NULL | ID of affected entity |
| old_values | JSONB | NULL | Previous values (for updates) |
| new_values | JSONB | NULL | New values |
| ip_address | VARCHAR(45) | NULL | User IP address |
| user_agent | TEXT | NULL | User agent string |
| created_at | TIMESTAMP | DEFAULT NOW() | Log entry timestamp |

**Indexes:**
- `idx_audit_user` ON user_id
- `idx_audit_entity` ON (entity_type, entity_id)
- `idx_audit_date` ON created_at DESC
- `idx_audit_action` ON action_type

#### Table: notifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Notification identifier |
| customer_id | UUID | FOREIGN KEY → customers(id) | Customer to notify |
| notification_type | VARCHAR(50) | NOT NULL | 'POINTS_EARNED', 'POINTS_ACTIVATED', 'POINTS_REDEEMED', 'POINTS_EXPIRING', 'POINTS_EXPIRED' |
| channel | VARCHAR(20) | NOT NULL, DEFAULT 'whatsapp' | 'whatsapp', 'sms', 'email' |
| message_template | TEXT | NOT NULL | Message template |
| message_data | JSONB | NULL | Template variables |
| status | VARCHAR(20) | DEFAULT 'pending' | 'pending', 'sent', 'failed', 'cancelled' |
| sent_at | TIMESTAMP | NULL | When notification was sent |
| error_message | TEXT | NULL | Error details if failed |
| retry_count | INTEGER | DEFAULT 0 | Number of retry attempts |
| created_at | TIMESTAMP | DEFAULT NOW() | Notification creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_notifications_customer` ON customer_id
- `idx_notifications_status` ON status
- `idx_notifications_type` ON notification_type
- `idx_notifications_pending` ON (status, created_at) WHERE status = 'pending'

### 6.3 Database Functions

#### Function: generate_mgp_id()
- **Trigger:** BEFORE INSERT on customers
- **Purpose:** Auto-generate sequential MGP ID
- **Logic:** Find max MGP ID number + 1, format as MGP000001

#### Function: calculate_points(bill_amount)
- **Input:** DECIMAL (bill amount)
- **Returns:** DECIMAL (points)
- **Logic:** FLOOR(bill_amount / 50)

#### Function: add_purchase(...)
- **Purpose:** Process purchase transaction
- **Returns:** JSON with transaction details
- **Side effects:** Updates customers, transactions, point_ledger tables

#### Function: redeem_points(...)
- **Purpose:** Process redemption transaction
- **Returns:** JSON with redemption details
- **Validations:** Sufficient balance, active points
- **Side effects:** Updates customers, transactions, point_ledger tables

#### Function: activate_pending_points()
- **Trigger:** Scheduled hourly
- **Purpose:** Activate points after 24 hours
- **Side effects:** Updates is_active flag, recalculates available_points

#### Function: expire_old_points()
- **Trigger:** Scheduled daily at 2 AM
- **Purpose:** Expire points after 2 years
- **Side effects:** Updates is_expired flag, recalculates available_points

---

## 7. SYSTEM MODELS

### 7.1 Use Case Diagram
```
                    MGP Loyalty System
        ┌───────────────────────────────────┐
        │                                   │
    ┌───┴──┐                           ┌───┴──┐
    │Store │                           │System│
    │Staff │                           │Admin │
    └───┬──┘                           └───┬──┘
        │                                  │
        │  Register Customer               │  Configure System
        │◄─────────────────                │◄─────────────────
        │                                  │
        │  Search Customer                 │  Manage Users
        │◄─────────────────                │◄─────────────────
        │                                  │
        │  Record Purchase                 │  View Reports
        │◄─────────────────                │◄─────────────────
        │                                  │
        │  Redeem Points                   │  Export Data
        │◄─────────────────                │◄─────────────────
        │                                  │
        │  Check Balance                   │  System Maintenance
        │◄─────────────────                │◄─────────────────
        │                                  │
        │  View Transaction History        │
        │◄─────────────────                │
        │                                  │
    ┌───┴──────────────────────────────────┴──┐
    │         Automated Processes             │
    │  • Activate pending points (hourly)     │
    │  • Expire old points (daily)            │
    │  • Send notifications (Phase 2)         │
    └─────────────────────────────────────────┘
```

### 7.2 State Diagram - Point Lifecycle
```
    [Purchase]
        │
        ▼
   ┌─────────┐
   │ PENDING │ ──────── (< 24 hours)
   └────┬────┘
        │
        │ (After 24 hours - Automated)
        ▼
   ┌─────────┐
   │ ACTIVE  │ ──────── (Redeemable)
   └────┬────┘
        │
        ├────────────────┐
        │                │
        │ (Redeemed)     │ (2 years passed - Automated)
        ▼                ▼
   ┌─────────┐      ┌─────────┐
   │REDEEMED │      │ EXPIRED │
   └─────────┘      └─────────┘
```

### 7.3 Sequence Diagram - Purchase Flow
```
Staff      System      Database    Point_Engine
  │           │            │             │
  │ Enter     │            │             │
  │ Purchase  │            │             │
  │ Details   │            │             │
  ├──────────>│            │             │
  │           │            │             │
  │           │ Validate   │             │
  │           │ Customer   │             │
  │           ├───────────>│             │
  │           │            │             │
  │           │  Customer  │             │
  │           │  Data      │             │
  │           │<───────────┤             │
  │           │            │             │
  │           │ Calculate  │             │
  │           │ Points     │             │
  │           ├───────────────────────>│
  │           │            │            │
  │           │  Points    │            │
  │           │  Amount    │            │
  │           │<───────────────────────┤
  │           │            │            │
  │           │ Create     │            │
  │           │ Transaction│            │
  │           ├───────────>│            │
  │           │            │            │
  │           │ Create     │            │
  │           │ Ledger     │            │
  │           │ Entry      │            │
  │           ├───────────>│            │
  │           │            │            │
  │           │ Update     │            │
  │           │ Customer   │            │
  │           │ Totals     │            │
  │           ├───────────>│            │
  │           │            │            │
  │ Success   │  Success   │            │
  │ Message   │  Response  │            │
  │<──────────┤<───────────┤            │
  │           │            │            │
```

---

## 8. APPENDICES

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| Available Points | Points that are active and can be redeemed immediately |
| Pending Points | Points earned but not yet active (within 24-hour window) |
| Expiring Soon | Points that will expire within 30 days |
| Point Ledger | Complete audit trail of all point movements |
| Activation Period | 24-hour waiting period after purchase before points become redeemable |
| Point Validity | 2-year lifespan of points from activation date |

### Appendix B: Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-01-07 | Initial draft | Product Team |
| 1.0 | 2026-01-07 | Complete SRS | Product Team |

### Appendix C: Open Issues

| ID | Issue | Priority | Status |
|----|-------|----------|--------|
| OI-001 | Refund/return handling logic | Medium | Under Review |
| OI-002 | Multi-location support | Low | Deferred to v2.0 |
| OI-003 | Bulk point adjustments | Low | Deferred to v2.0 |

### Appendix D: Future Enhancements

**Phase 2 (Q2 2026)**
- WhatsApp/SMS notifications via Gupshup
- Customer-facing mobile app
- QR code-based point redemption
- Integration with existing POS system

**Phase 3 (Q3 2026)**
- Advanced analytics and ML predictions
- Tiered loyalty programs (Gold, Platinum)
- Special promotional campaigns
- API for third-party integrations

**Phase 4 (Q4 2026)**
- Multi-store support with franchisee management
- Gift point transfers
- Social media integration
- Gamification features