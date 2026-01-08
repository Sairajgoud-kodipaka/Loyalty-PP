# Product Requirements Document (PRD)
## MGP Loyalty Program System
### Version 1.0 | January 2026

---

## EXECUTIVE SUMMARY

### Product Vision
Empower Mangatrai Pearls & Jewellers to build lasting customer relationships through a simple, reliable, and automated loyalty rewards program that drives repeat purchases and increases customer lifetime value.

### Problem Statement
Mangatrai Pearls & Jewellers currently lacks a systematic way to:
- Track and reward loyal customers
- Incentivize repeat purchases
- Differentiate from competitors
- Build long-term customer relationships
- Collect customer purchase data for insights

Manual or paper-based loyalty tracking is error-prone, difficult to scale, and provides poor customer experience.

### Solution
A digital loyalty program system that automatically calculates and tracks reward points, enables seamless redemption, and provides staff with real-time customer insights—all while maintaining simplicity and reliability.

### Success Metrics (6 months post-launch)
- **Customer Adoption:** 60% of customers enrolled in program
- **Redemption Rate:** 30% of earned points redeemed
- **Repeat Purchase:** 25% increase in customer return rate
- **Average Transaction:** 15% increase in average purchase value
- **Customer Satisfaction:** NPS score > 50

---

## 1. PRODUCT OVERVIEW

### 1.1 Product Description
MGP Loyalty Program is a web-based customer rewards management system that:

**For Customers:**
- Earns them MGP Points on every purchase (₹50 = 1 point)
- Allows redemption for discounts (1 point = ₹1)
- Tracks their rewards balance and history
- Provides exclusive benefits for loyalty

**For Business:**
- Increases customer retention and repeat visits
- Collects valuable customer purchase data
- Provides competitive differentiation
- Enables targeted marketing campaigns
- Automates reward calculations and tracking

### 1.2 Target Users

#### Primary Users: Store Staff (8-10 people)
**Profile:**
- Age: 25-45
- Technical skills: Basic
- Daily tasks: Sales, billing, customer service
- Work environment: In-store, POS terminals

**Needs:**
- Quick customer lookup
- Simple transaction entry
- Real-time point balance checks
- Minimal training required

#### Secondary Users: Store Managers (2-3 people)
**Profile:**
- Age: 30-50
- Technical skills: Moderate
- Responsibilities: Operations, customer relations, reporting

**Needs:**
- Customer insights and reports
- Point redemption trends
- Staff performance tracking
- System administration

### 1.3 Product Positioning

| Attribute | Description |
|-----------|-------------|
| **Target Market** | Single-location jewelry retail store (expandable to multi-store) |
| **Product Category** | Customer Loyalty & Rewards Management |
| **Key Differentiation** | Simple, automated, jewelry-focused with high-value transaction support |
| **Competitive Advantage** | No monthly fees for basic tier, local data control, jewelry-specific features |

---

## 2. BUSINESS OBJECTIVES

### 2.1 Primary Objectives

**Objective 1: Increase Customer Retention**
- **Target:** 25% increase in repeat customer rate within 6 months
- **Measurement:** Monthly returning customer percentage
- **Why:** Acquiring new customers is 5-7x more expensive than retaining existing ones

**Objective 2: Boost Average Transaction Value**
- **Target:** 15% increase in average purchase amount
- **Measurement:** Average transaction value for loyalty members vs non-members
- **Why:** Points incentive encourages customers to spend more to reach reward thresholds

**Objective 3: Build Customer Database**
- **Target:** Enroll 60% of customers in first 6 months
- **Measurement:** Total enrolled customers / estimated unique customers
- **Why:** Customer data enables targeted marketing and personalized service

### 2.2 Secondary Objectives

- Reduce manual tracking errors
- Improve customer service speed
- Enable data-driven decision making
- Differentiate from local competitors
- Build foundation for digital transformation

### 2.3 Key Results (OKRs)

**Q1 2026 (Launch Quarter)**
- KR1: Launch MVP with 0 critical bugs
- KR2: Train 100% of staff on system usage
- KR3: Enroll 200+ customers in first month
- KR4: Achieve 95%+ system uptime

**Q2 2026 (Growth Quarter)**
- KR1: Reach 1,000 enrolled customers
- KR2: Achieve 20% point redemption rate
- KR3: Add WhatsApp notification feature
- KR4: Generate first quarterly insights report

---

## 3. USER PERSONAS

### Persona 1: Priya (Store Associate)

**Demographics:**
- Age: 28
- Role: Sales Associate
- Experience: 3 years in jewelry retail
- Tech comfort: Basic (uses smartphone, WhatsApp)

**Goals:**
- Process customers quickly
- Provide excellent service
- Meet sales targets
- Avoid billing errors

**Pain Points:**
- Customers ask "How many points do I have?" - no quick way to check
- Manual calculation of discounts is slow
- Customers forget their previous purchases
- Can't offer personalized service without history

**User Story:**
> "As a sales associate, I want to quickly look up a customer's point balance so I can inform them of rewards and encourage redemption."

### Persona 2: Rajesh (Store Manager)

**Demographics:**
- Age: 42
- Role: Store Manager
- Experience: 15 years in jewelry business
- Tech comfort: Moderate (uses Excel, email)

**Goals:**
- Increase store profitability
- Improve customer satisfaction
- Understand customer behavior
- Make data-driven decisions

**Pain Points:**
- No visibility into customer purchase patterns
- Can't identify top customers for VIP treatment
- Difficult to measure loyalty program ROI
- Manual reporting is time-consuming

**User Story:**
> "As a store manager, I want to see which customers have high point balances so I can personally reach out and thank them for their loyalty."

### Persona 3: Meera (Regular Customer)

**Demographics:**
- Age: 35
- Occupation: Software Engineer
- Shopping frequency: 2-3 times per year
- Spending: ₹25,000 - ₹50,000 per visit

**Goals:**
- Get best value for money
- Feel appreciated for loyalty
- Simple redemption process
- Track rewards easily

**Pain Points:**
- Forgets about loyalty points
- Doesn't know current balance
- Redemption process is unclear
- Points expire without notification

**User Story:**
> "As a loyal customer, I want to receive notifications about my points so I don't forget to use them before they expire."

---

## 4. FEATURES & REQUIREMENTS

### 4.1 MVP Features (Phase 1 - Launch)

#### Feature 1: Customer Registration
**Priority:** P0 (Must Have)  
**User Story:** As staff, I want to quickly register new customers so they can start earning points immediately.

**Acceptance Criteria:**
- [ ] Can register customer with name, phone, email, Aadhar (optional), Passport (optional)
- [ ] System auto-generates unique MGP ID
- [ ] Phone number validation (10 digits, unique)
- [ ] Duplicate detection prevents multiple accounts (phone, Aadhar, Passport)
- [ ] Registration completes in < 30 seconds
- [ ] Success confirmation shows MGP ID

**UI/UX Requirements:**
- Single-page form with clear labels
- Real-time validation feedback
- Auto-format phone numbers
- Large, touch-friendly buttons for POS
- Success modal with "Print Card" option

**Technical Requirements:**
- Database trigger generates MGP ID
- Unique constraints on phone/Aadhar/Passport
- Encrypted storage for Aadhar and Passport
- Audit log for registrations

---

#### Feature 2: Customer Search
**Priority:** P0 (Must Have)  
**User Story:** As staff, I want to find customers quickly by phone or name so I can access their account.

**Acceptance Criteria:**
- [ ] Search by phone, MGP ID, name, or Aadhar
- [ ] Results appear as user types (debounced)
- [ ] Shows top 10 matches by relevance
- [ ] Each result shows: MGP ID, name, phone, available points
- [ ] Click result to view full profile
- [ ] "Register New" option if not found
- [ ] Search completes in < 2 seconds

**UI/UX Requirements:**
- Prominent search bar on every page
- Keyboard shortcut (Ctrl+K) to focus search
- Clear result cards with point balance highlighted
- Empty state with helpful message

---

#### Feature 3: Purchase Transaction Entry
**Priority:** P0 (Must Have)  
**User Story:** As staff, I want to record purchases and automatically calculate points so customers earn rewards.

**Acceptance Criteria:**
- [ ] Select customer from search
- [ ] Enter bill amount (validates ≥ ₹50)
- [ ] System calculates points (₹50 = 1 point)
- [ ] Optional invoice number field
- [ ] Shows: points earned, activation date, expiry date
- [ ] Confirms transaction with summary
- [ ] Updates customer's total earned points
- [ ] Transaction recorded in history

**Business Rules:**
- Minimum bill amount: ₹50
- Points calculation: FLOOR(amount / 50)
- Points activate after 24 hours
- Points expire after 2 years from activation

**UI/UX Requirements:**
- Clean form with currency formatting
- Real-time points calculation preview
- Confirmation modal before submission
- Success screen with print option
- Error handling for failed transactions

---

#### Feature 4: Point Redemption
**Priority:** P0 (Must Have)  
**User Story:** As staff, I want to redeem customer points for discounts so they can use their rewards.

**Acceptance Criteria:**
- [ ] Select customer from search
- [ ] Display available point balance prominently
- [ ] Enter bill amount
- [ ] Enter points to redeem (validates ≤ available)
- [ ] System calculates: discount, final bill, new points earned
- [ ] Confirms redemption with summary
- [ ] Updates customer's available balance
- [ ] Records redemption transaction

**Business Rules:**
- Only active points can be redeemed (not pending)
- 1 point = ₹1 discount
- Can redeem partial amounts
- New points earned on final bill amount (after discount)
- Final bill cannot be negative

**UI/UX Requirements:**
- Large display of available points
- Two input fields: Bill amount, Points to redeem
- Real-time calculation of final bill
- Clear before/after comparison
- Warning if redeeming > 50% of balance

---

#### Feature 5: Customer Profile View
**Priority:** P0 (Must Have)  
**User Story:** As staff, I want to view customer details and point balance so I can answer their questions.

**Acceptance Criteria:**
- [ ] Displays: MGP ID, name, contact info, enrollment date
- [ ] Point balance summary:
  - Available (green, prominent)
  - Pending activation (yellow)
  - Expiring soon (red, if within 30 days)
  - Total earned lifetime
  - Total redeemed lifetime
- [ ] Recent transactions (last 10)
- [ ] Quick action buttons: New Purchase, Redeem Points
- [ ] View full transaction history link

**UI/UX Requirements:**
- Card-based layout for point summary
- Color coding for point status
- Transaction list with type icons
- Responsive design for tablet/mobile
- Print-friendly customer statement

---

#### Feature 6: Automated Point Activation
**Priority:** P0 (Must Have)  
**User Story:** As system, I want to automatically activate pending points after 24 hours so customers can redeem them.

**Acceptance Criteria:**
- [ ] Automated job runs every hour
- [ ] Identifies points with activation_date ≤ NOW()
- [ ] Updates point status from pending → active
- [ ] Recalculates customer's available_points
- [ ] Logs activation in audit trail
- [ ] No manual intervention required

**Technical Requirements:**
- Supabase pg_cron scheduled function
- Database function: activate_pending_points()
- Idempotent operation (safe to run multiple times)
- Performance: < 5 seconds for 1000 points

---

#### Feature 7: Automated Point Expiration
**Priority:** P0 (Must Have)  
**User Story:** As system, I want to automatically expire old points after 2 years so the program remains sustainable.

**Acceptance Criteria:**
- [ ] Automated job runs daily at 2:00 AM
- [ ] Identifies points with expiry_date ≤ NOW()
- [ ] Updates point status to expired
- [ ] Recalculates customer's available_points
- [ ] Generates expiration notification queue (Phase 2)
- [ ] Logs expiration in audit trail

**Technical Requirements:**
- Supabase pg_cron scheduled function
- Database function: expire_old_points()
- Performance: < 10 seconds for 10,000 points

---

### 4.2 Phase 2 Features (Post-Launch)

#### Feature 8: WhatsApp Notifications
**Priority:** P1 (Should Have)  
**Launch Target:** Q2 2026

**User Story:** As a customer, I want to receive WhatsApp messages when I earn or redeem points so I stay informed.

**Message Types:**
1. **Points Earned:** "Congratulations! You earned 200 MGP Points worth ₹200. Redeemable after 24 hours."
2. **Points Activated:** "Your 200 MGP Points are now active! Visit us to redeem."
3. **Points Redeemed:** "You redeemed 150 points. New balance: 350 points. Thank you!"
4. **Points Expiring:** "Reminder: Your 200 MGP Points expire in 30 days. Use them now!"

**Technical Requirements:**
- Gupshup WhatsApp Business API integration
- Supabase Edge Functions for message triggers
- SMS fallback for failed WhatsApp delivery
- Template approval from Meta
- Opt-in/opt-out management

---

#### Feature 9: Basic Reporting Dashboard
**Priority:** P1 (Should Have)  
**Launch Target:** Q2 2026

**Reports:**
1. **Customer Balance Report**
   - All customers with available points
   - Sortable by balance, enrollment date
   - Export to CSV

2. **Transaction Summary**
   - Total purchases, redemptions by date range
   - Points issued vs redeemed ratio
   - Average transaction value

3. **Expiring Points Alert**
   - Customers with points expiring in 30 days
   - Proactive customer outreach list

---

#### Feature 10: Customer Statement Generation
**Priority:** P2 (Nice to Have)  
**Launch Target:** Q3 2026

**User Story:** As staff, I want to print customer point statements so customers have a physical record.

**Contents:**
- Customer details
- Current point balance
- Transaction history (last 6 months)
- Expiring points warning
- QR code for digital access (future)

---

### 4.3 Future Considerations (Phase 3+)

- Customer-facing mobile app
- Tiered loyalty (Silver, Gold, Platinum)
- Referral bonus program
- Birthday/anniversary bonuses
- Integration with existing POS system
- Multi-location support
- API for third-party integrations
- Advanced analytics and ML insights

---

## 5. USER EXPERIENCE

### 5.1 User Flows

#### Flow 1: Register New Customer
```
Staff opens app
  ↓
Click "Register Customer"
  ↓
Enter: Name, Phone, Email, Aadhar (optional)
  ↓
System validates data
  ↓
[If duplicate phone] → Show error, option to merge
  ↓
Click "Register"
  ↓
System generates MGP ID
  ↓
Success modal shows:
  - MGP ID: MGP000123
  - "Customer registered successfully!"
  - [Print Card] [View Profile] buttons
  ↓
Done (30 seconds total)
```

#### Flow 2: Process Purchase
```
Customer arrives at checkout
  ↓
Staff searches customer by phone
  ↓
System shows customer profile with available points
  ↓
Staff clicks "New Purchase"
  ↓
Enter bill amount: ₹10,000
  ↓
System shows: "This earns 200 MGP Points"
  ↓
Optional: Enter invoice number
  ↓
Staff clicks "Confirm Purchase"
  ↓
Success screen:
  - "200 points added!"
  - "Redeemable from: [tomorrow's date]"
  - [Print Receipt] option
  ↓
Done (45 seconds total)
```

#### Flow 3: Redeem Points
```
Customer wants to use points
  ↓
Staff searches customer
  ↓
Profile shows: "Available: 1,500 points"
  ↓
Staff clicks "Redeem Points"
  ↓
Enter bill amount: ₹12,000
  ↓
Customer says: "Use 1,000 points"
  ↓
Staff enters: 1,000
  ↓
System shows real-time calculation:
  - Original: ₹12,000
  - Discount: -₹1,000
  - Final: ₹11,000
  - New points earned: 220
  - New balance: 720
  ↓
Staff confirms redemption
  ↓
Success screen with summary
  ↓
Done (60 seconds total)
```

### 5.2 Wireframes

#### Dashboard (Home Page)
```
┌────────────────────────────────────────────────┐
│ [MGP Logo]   Search: [        🔍]   [Profile ▼]│
├────────────────────────────────────────────────┤
│                                                │
│  📊 Today's Summary                           │
│  ┌──────────┬──────────┬──────────┐          │
│  │ Customers│ Points   │Redemptions│          │
│  │    15    │  3,450   │    8      │          │
│  └──────────┴──────────┴──────────┘          │
│                                                │
│  🚀 Quick Actions                             │
│  [Register Customer]  [New Purchase]          │
│  [Redeem Points]      [View Reports]          │
│                                                │
│  📋 Recent Activity                           │
│  • Rajesh Kumar redeemed 500 pts (2 min ago)  │
│  • New customer: Priya Sharma (15 min ago)    │
│  • Amit Patel earned 150 pts (1 hour ago)     │
│                                                │
│  ⚠️  Alerts                                    │
│  • 5 customers have points expiring this week │
│                                                │
└────────────────────────────────────────────────┘
```

#### Customer Profile
```
┌────────────────────────────────────────────────┐
│ ← Back   MGP000456 - Rajesh Kumar   [Edit]    │
├────────────────────────────────────────────────┤
│                                                │
│  📱 9876543210   📧 rajesh@email.com          │
│  📅 Member since: Jan 15, 2026                │
│                                                │
│  💎 POINTS BALANCE                            │
│  ┌────────────────────────────────────────┐  │
│  │  Available Points                       │  │
│  │        2,340                            │  │
│  │  Worth ₹2,340 discount                 │  │
│  └────────────────────────────────────────┘  │
│                                                │
│  ┌──────────┬──────────┐                     │
│  │ Pending  │ Expiring │                     │
│  │   150    │   200    │                     │
│  │(Jan 10)  │(Feb 15)  │                     │
│  └──────────┴──────────┘                     │
│                                                │
│  Lifetime Stats                               │
│  • Total Earned: 5,890 pts                   │
│  • Total Redeemed: 3,550 pts                 │
│                                                │
│  [New Purchase]  [Redeem Points]              │
│                                                │
│  📜 Recent Transactions                       │
│  ───────────────────────────────────────────  │
│  Jan 8  Purchase  +200 pts  ₹10,000         │
│  Jan 5  Redemption  -500 pts  Saved ₹500    │
│  Dec 28 Purchase  +150 pts  ₹7,500          │
│                                                │
│  [View All Transactions]                      │
│                                                │
└────────────────────────────────────────────────┘
```

#### Purchase Form
```
┌────────────────────────────────────────────────┐
│ ← Back         New Purchase                    │
├────────────────────────────────────────────────┤
│                                                │
│  Customer: Rajesh Kumar (MGP000456)           │
│  Current Balance: 2,340 points                │
│                                                │
│  ┌──────────────────────────────────────────┐│
│  │ Bill Amount (₹) *                        ││
│  │ [         10,000                    ]    ││
│  └──────────────────────────────────────────┘│
│                                                │
│  💡 This purchase earns: 200 MGP Points       │
│     Redeemable after: Jan 9, 2026 10:30 AM   │
│     Expires on: Jan 9, 2028                   │
│                                                │
│  ┌──────────────────────────────────────────┐│
│  │ Invoice Number (Optional)                ││
│  │ [                                    ]   ││
│  └──────────────────────────────────────────┘│
│                                                │
│  ┌──────────────────────────────────────────┐│
│  │ Notes (Optional)                         ││
│  │ [                                    ]   ││
│  └──────────────────────────────────────────┘│
│                                                │
│         [Cancel]  [Confirm Purchase]          │
│                                                │
└────────────────────────────────────────────────┘
```

#### Redemption Form
```
┌────────────────────────────────────────────────┐
│ ← Back       Redeem Points                     │
├────────────────────────────────────────────────┤
│                                                │
│  Customer: Rajesh Kumar (MGP000456)           │
│                                                │
│  ┌────────────────────────────────────────┐  │
│  │ 💎 Available Points: 2,340             │  │
│  │    Worth ₹2,340 discount               │  │
│  └────────────────────────────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐│
│  │ Bill Amount (₹) *                        ││
│  │ [         12,000                    ]    ││
│  └──────────────────────────────────────────┘│
│                                                │
│  ┌──────────────────────────────────────────┐│
│  │ Points to Redeem *                       ││
│  │ [          1,000                    ]    ││
│  │ [Use Maximum: 2,340]                    ││
│  └──────────────────────────────────────────┘│
│                                                │
│  ═══════════════════════════════════════════  │
│                                                │
│  Original Bill:        ₹12,000                │
│  Discount (1,000 pts): - ₹1,000               │
│  ───────────────────────────────              │
│  Final Bill:            ₹11,000               │
│                                                │
│  New points earned:     220 points            │
│  New balance:           1,560 points          │
│                                                │
│         [Cancel]  [Confirm Redemption]        │
│                                                │
└────────────────────────────────────────────────┘
```

### 5.3 Design Principles

**Simplicity First**
- Minimal clicks to complete tasks
- Clear visual hierarchy
- No unnecessary features

**Speed Matters**
- Optimized for quick customer interactions
- Keyboard shortcuts for power users
- Real-time calculations and validations

**Error Prevention**
- Input validation before submission
- Confirmation prompts for critical actions
- Clear error messages with solutions

**Accessibility**
- Large touch targets (48x48px minimum)
- High contrast text
- Readable font sizes (16px+ for body)
- Keyboard navigation support

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Technology Stack

**Frontend:**
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- UI Library: React 18
- Styling: Tailwind CSS
- Icons: Lucide React
- Notifications: Sonner (toast)

**Backend:**
- Database: Supabase (PostgreSQL 15)
- Authentication: Supabase Auth
- API: Supabase Auto-generated REST API
- Real-time: Supabase Realtime
- Functions: Supabase Edge Functions (Deno)
- Jobs: pg_cron

**External Services (Phase 2):**
- Messaging: Gupshup (WhatsApp/SMS)
- Email: Resend or SendGrid
- Analytics: Vercel Analytics

**Infrastructure:**
- Hosting: Vercel (frontend)
- Database: Supabase Cloud
- CDN: Vercel Edge Network
- SSL: Auto (Vercel + Supabase)

### 6.2 System Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│              Users (Staff)                      │
│         (Chrome, Firefox, Safari)               │
└────────────────┬────────────────────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────┐
│           Vercel Edge Network                   │
│         (CDN + Edge Functions)                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Next.js Application                     │
│  ┌───────────────────────────────────────────┐ │
│  │  Pages:                                   │ │
│  │  • Dashboard                              │ │
│  │  • Customer Management                    │ │
│  │  • Transactions                           │ │
│  │  • Reports                                │ │
│  └───────────────────────────────────────────┘ │
└────────────────┬────────────────────────────────┘
                 │ Supabase Client
                 │ (REST API + WebSocket)
                 ▼
┌─────────────────────────────────────────────────┐
│           Supabase Platform                     │
│  ┌───────────────────────────────────────────┐ │
│  │  PostgREST (Auto-generated API)          │ │
│  │  • GET /customers                         │ │
│  │  • POST /transactions                     │ │
│  │  • RPC /redeem_points()                   │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │  PostgreSQL Database                      │ │
│  │  • customers                              │ │
│  │  • transactions                           │ │
│  │  • point_ledger                           │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │  Edge Functions (Serverless)              │ │
│  │  • send-notifications                     │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │  pg_cron (Scheduled Jobs)                 │ │
│  │  • activate_pending_points (hourly)       │ │
│  │  • expire_old_points (daily)              │ │
│  └───────────────────────────────────────────┘ │
└────────────────┬────────────────────────────────┘
                 │
                 │ (Phase 2)
                 ▼
┌─────────────────────────────────────────────────┐
│         External Services                       │
│  • Gupshup (WhatsApp/SMS)                      │
│  • Email Provider                               │
│  • Analytics Platform                           │
└─────────────────────────────────────────────────┘
```

### 6.3 Data Flow

**Purchase Flow:**
```
User Input → Next.js → Supabase API → add_purchase() function
  ↓
Calculate points (bill_amount / 50)
  ↓
Create transaction record (status: pending)
  ↓
Create point_ledger entry (is_active: false)
  ↓
Update customer.total_points_earned
  ↓
Return success response
  ↓
Display confirmation to user
```

**Point Activation (Automated):**
```
pg_cron triggers every hour
  ↓
activate_pending_points() function runs
  ↓
Find point_ledger entries where:
  - activation_date <= NOW()
  - is_active = false
  ↓
Update is_active = true
  ↓
Recalculate customer.available_points
  ↓
Update transaction.status = 'active'
```

### 6.4 Security Measures

**Authentication:**
- Supabase Auth with email/password
- Session-based authentication (JWT)
- 30-minute session timeout
- Secure password hashing (bcrypt)

**Authorization:**
- Row Level Security (RLS) policies
- Staff can only access own store data
- Manager role has extended permissions
- Admin role for system configuration

**Data Protection:**
- Aadhar/Passport encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- No sensitive data in logs
- PII redacted in error messages

**Audit Trail:**
- All transactions immutable
- Customer data changes logged
- User actions timestamped
- 5-year retention for compliance

---

## 7. LAUNCH STRATEGY

### 7.1 Go-to-Market Plan

**Pre-Launch (Week -2 to 0)**
- [ ] Complete staff training sessions (2 hours)
- [ ] Create training videos and documentation
- [ ] Test system with dummy data
- [ ] Prepare customer communication materials
- [ ] Set up monitoring and alerts

**Soft Launch (Week 1-2)**
- [ ] Limited rollout to 10-20 loyal customers
- [ ] Staff feedback sessions daily
- [ ] Monitor system performance closely
- [ ] Fix critical bugs within 24 hours
- [ ] Gather customer feedback

**Full Launch (Week 3+)**
- [ ] Announce to all customers via WhatsApp/SMS
- [ ] In-store signage and promotional materials
- [ ] Enroll all walk-in customers
- [ ] Track adoption metrics daily
- [ ] Weekly review meetings

### 7.2 Training Plan

**Staff Training Program (2 hours)**

**Session 1: Introduction (30 min)**
- Why we're launching loyalty program
- Benefits for customers and business
- Overview of system capabilities
- Demo of key features

**Session 2: Hands-on Practice (60 min)**
- Register a new customer
- Process a purchase transaction
- Redeem points for a customer
- Look up customer balance
- Handle common scenarios

**Session 3: Edge Cases & Troubleshooting (30 min)**
- What if system is slow/down?
- Duplicate customer registrations
- Customer disputes point balance
- How to escalate technical issues

**Training Materials:**
- Video tutorials (5-10 min each)
- Quick reference guide (1-page laminated)
- FAQ document
- Help desk contact (phone/WhatsApp)

### 7.3 Marketing & Communication

**Customer Communication:**

**Announcement Message:**
> "Exciting News! 🎉
> 
> Introducing MGP Rewards - our new loyalty program!
> 
> ✨ Earn 1 point for every ₹50 spent
> 💰 Redeem points for instant discounts (1 point = ₹1)
> 🎁 Points valid for 2 years
> 
> Visit us to enroll and start earning today!
> 
> - Team Mangatrai Pearls & Jewellers"

**In-Store Materials:**
- Counter standees explaining program
- Flyers with program details
- Posters near entrance
- Sample MGP point card design

**Digital Presence:**
- Update website with loyalty program page
- Social media announcements
- WhatsApp status updates
- Google Business profile update

---

## 8. SUCCESS METRICS & KPIs

### 8.1 Key Performance Indicators

**Customer Adoption (Primary)**
- Total enrolled customers (target: 1,000 in 6 months)
- Enrollment rate (% of transactions with loyalty)
- New enrollments per week

**Engagement (Primary)**
- Active customers (purchased in last 30 days)
- Point redemption rate (target: 30%)
- Average days between purchases (decrease)

**Business Impact (Primary)**
- Average transaction value (loyalty vs non-loyalty)
- Customer retention rate (90-day repeat rate)
- Revenue attributed to loyalty program

**Operational (Secondary)**
- System uptime (target: 99.5%)
- Average transaction processing time
- Staff satisfaction score
- Support ticket volume

### 8.2 Measurement Dashboard

**Weekly Metrics:**
```
┌────────────────────────────────────────┐
│ Week of Jan 7, 2026                   │
├────────────────────────────────────────┤
│ New Enrollments:           45          │
│ Total Enrolled:           245          │
│ Active Customers:          89 (36%)    │
│ Points Issued:         12,340          │
│ Points Redeemed:        3,120 (25%)    │
│ Avg Transaction:       ₹18,450         │
│ System Uptime:           99.8%         │
└────────────────────────────────────────┘
```

**Monthly Business Review:**
- Month-over-month growth trends
- Cohort analysis (retention by signup month)
- Top 10 customers by points earned
- Redemption patterns analysis
- Staff performance comparison

### 8.3 Success Criteria

**Launch Success (Month 1)**
- ✅ 200+ customers enrolled
- ✅ <2% transaction error rate
- ✅ 99%+ system uptime
- ✅ All staff trained and confident
- ✅ Customer NPS > 40

**Growth Success (Month 3)**
- ✅ 600+ customers enrolled
- ✅ 25%+ repeat purchase rate
- ✅ 20%+ average transaction increase
- ✅ 15%+ point redemption rate
- ✅ Zero critical security incidents

**Maturity Success (Month 6)**
- ✅ 1,000+ customers enrolled
- ✅ 30%+ point redemption rate
- ✅ 35%+ repeat purchase rate
- ✅ 20%+ average transaction increase
- ✅ Positive ROI on development costs

---

## 9. RISKS & MITIGATION

### 9.1 Technical Risks

**Risk 1: System Downtime**
- **Impact:** High - Cannot process transactions
- **Probability:** Low
- **Mitigation:**
  - Use reliable hosting (Supabase/Vercel 99.9% SLA)
  - Implement health monitoring
  - Manual fallback process documented
  - Daily backups with 4-hour RTO

**Risk 2: Data Loss**
- **Impact:** Critical - Loss of customer data/points
- **Probability:** Very Low
- **Mitigation:**
  - Automated daily backups
  - Point-in-time recovery capability
  - 30-day backup retention
  - Quarterly backup restoration tests

**Risk 3: Performance Degradation**
- **Impact:** Medium - Slow response times
- **Probability:** Low
- **Mitigation:**
  - Database indexing on frequently queried fields
  - Query optimization
  - CDN for static assets
  - Performance monitoring alerts

### 9.2 Business Risks

**Risk 1: Low Customer Adoption**
- **Impact:** High - Program doesn't achieve goals
- **Probability:** Medium
- **Mitigation:**
  - Strong staff training and incentives
  - Clear customer communication
  - Attractive reward structure (1:1 value)
  - Active promotion in-store

**Risk 2: Fraud/Abuse**
- **Impact:** Medium - Loss of points integrity
- **Probability:** Low
- **Mitigation:**
  - Audit trail for all transactions
  - Manager approval for large redemptions
  - Pattern detection for suspicious activity
  - Point expiration policy

**Risk 3: Staff Resistance**
- **Impact:** Medium - Poor user experience
- **Probability:** Medium
- **Mitigation:**
  - Involve staff in design process
  - Comprehensive training program
  - User-friendly interface design
  - Quick support response

### 9.3 Compliance Risks

**Risk 1: Data Privacy Violations**
- **Impact:** Critical - Legal/regulatory issues
- **Probability:** Low
- **Mitigation:**
  - Encryption for sensitive data (Aadhar)
  - Consent forms for data collection
  - Right to deletion implementation
  - Regular security audits

**Risk 2: Point Liability**
- **Impact:** Medium - Financial exposure
- **Probability:** Low
- **Mitigation:**
  - 2-year expiration policy
  - Cap on maximum point accumulation (optional)
  - Clear terms and conditions
  - Accounting reserves for liability

---

## 10. ROADMAP

### 10.1 Phase 1: MVP Launch (Q1 2026)

**January 2026**
- Week 1-2: Development & testing
- Week 3: Staff training & soft launch
- Week 4: Full launch & monitoring

**Features:**
- ✅ Customer registration
- ✅ Purchase transaction entry
- ✅ Point redemption
- ✅ Customer search & profile
- ✅ Automated point lifecycle
- ✅ Basic reporting

**Deliverables:**
- Functional web application
- Database with sample data
- Staff training materials
- Customer communication materials
- Support documentation

### 10.2 Phase 2: Engagement Features (Q2 2026)

**February-March 2026**

**Features:**
- WhatsApp/SMS notifications (Gupshup integration)
- Enhanced reporting dashboard
- Customer statement generation
- Expiring points proactive alerts
- Bulk customer import tool

**Goals:**
- Increase point redemption to 30%
- Automate customer communications
- Reduce manual customer inquiries

### 10.3 Phase 3: Growth & Scale (Q3 2026)

**April-June 2026**

**Features:**
- Customer-facing mobile app (view points, history)
- Tiered loyalty (Bronze, Silver, Gold tiers)
- Referral bonus program
- Birthday/anniversary bonuses
- Integration with existing POS system

**Goals:**
- Scale to 2,000+ enrolled customers
- Launch self-service customer portal
- Reduce staff workload by 30%

### 10.4 Phase 4: Advanced Features (Q4 2026)

**July-September 2026**

**Features:**
- Multi-location support (franchisee management)
- Advanced analytics & ML predictions
- Promotional campaign engine
- API for third-party integrations
- Gamification features

**Goals:**
- Expand to 3+ store locations
- Predictive customer churn prevention
- Automated marketing campaigns

---

## 11. APPENDICES

### Appendix A: Competitive Analysis

| Feature | MGP Loyalty | Generic POS Loyalty | Paper Cards |
|---------|-------------|-------------------|-------------|
| **Setup Cost** | Low (₹0-20k) | High (₹50k+) | Very Low (₹5k) |
| **Automation** | ✅ Fully automated | ✅ Automated | ❌ Manual |
| **Real-time Balance** | ✅ Yes | ✅ Yes | ❌ No |
| **Point Expiration** | ✅ Automated | ⚠️ Manual | ❌ Not tracked |
| **Reporting** | ✅ Built-in | ✅ Yes | ❌ None |
| **Notifications** | ✅ WhatsApp/SMS | ⚠️ Email only | ❌ None |
| **Customization** | ✅ High | ❌ Low | ✅ Full control |
| **Data Ownership** | ✅ Your database | ⚠️ Vendor lock-in | ✅ Yours |

### Appendix B: Customer FAQs

**Q: How do I earn MGP Points?**  
A: Earn 1 MGP Point for every ₹50 you spend. For example, a ₹10,000 purchase earns 200 points.

**Q: When can I use my points?**  
A: Points become active 24 hours after earning and are valid for 2 years.

**Q: How do I redeem points?**  
A: Simply inform our staff during billing. Each point gives you ₹1 discount.

**Q: Can I transfer points to someone else?**  
A: No, points are non-transferable and linked to your account.

**Q: What happens if my points expire?**  
A: Expired points cannot be recovered, but we'll notify you 30 days before expiration.

**Q: Is there a limit on how many points I can earn?**  
A: No limit! Earn and redeem as much as you like.

### Appendix C: Budget Estimate

**Development Costs (One-time)**
- Development (100 hours @ ₹1,500/hr): ₹1,50,000
- Design & UX (20 hours): ₹30,000
- Testing & QA (20 hours): ₹20,000
- **Total Development:** ₹2,00,000

**Monthly Operating Costs**
- Supabase (Free tier initially): ₹0
- Vercel hosting: ₹0 (Hobby tier)
- Gupshup WhatsApp/SMS (3,000 msgs): ₹900
- Domain & SSL: ₹100
- Monitoring tools: ₹500
- **Total Monthly:** ~₹1,500

**First Year Total Cost:** ₹2,18,000

**Break-even Analysis:**
- If loyalty program increases revenue by 10% = ₹10,000+ extra per customer
- Need only 22 customers to break even in first year
- Expected 1,000+ enrolled customers = massive ROI

### Appendix D: Glossary

| Term | Definition |
|------|------------|
| **MGP** | Mangatrai Pearls & Jewellers |
| **MGP ID** | Unique customer identifier (MGP000001) |
| **MGP Points** | Loyalty currency (1 point = ₹1) |
| **Available Points** | Points that can be redeemed now |
| **Pending Points** | Points earned but not yet active (<24 hours) |
| **Expiring Soon** | Points that expire within 30 days |
| **Activation Period** | 24-hour waiting period before redemption |
| **Point Validity** | 2-year lifespan from activation |
| **Redemption Rate** | % of earned points that are redeemed |
| **Retention Rate** | % of customers who return within timeframe |

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-07 | Product Team | Initial draft |
| 0.5 | 2026-01-07 | Product Team | Complete first review |
| 1.0 | 2026-01-07 | Product Team | Final PRD approved |

**Approved by:**
- [ ] Product Manager
- [ ] Technical Lead
- [ ] Business Owner
- [ ] Design Lead

**Next Review Date:** April 1, 2026