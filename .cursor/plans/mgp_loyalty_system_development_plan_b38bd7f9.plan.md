---
name: MGP Loyalty System Development Plan
overview: Update PRD and SRS documents for consistency, then create a comprehensive phased development plan for building the MGP Loyalty Program System using a feature-by-feature approach.
todos:
  - id: doc-updates
    content: Update prd.md to include passport_number field in Customer Registration feature
    status: completed
  - id: srs-tables
    content: Update srs.md to add users/staff, audit_logs, and notifications table specifications
    status: completed
  - id: project-setup
    content: Initialize Next.js 14 project with TypeScript, Tailwind CSS, and Supabase configuration
    status: completed
    dependencies:
      - doc-updates
      - srs-tables
  - id: database-schema
    content: Create database migrations for all core tables (customers, transactions, point_ledger, users, audit_logs)
    status: completed
    dependencies:
      - project-setup
  - id: auth-system
    content: Implement authentication system with Supabase Auth and role-based access control
    status: completed
    dependencies:
      - database-schema
  - id: db-functions
    content: Create database functions (generate_mgp_id, calculate_points, add_purchase, redeem_points, activate_pending_points, expire_old_points)
    status: completed
    dependencies:
      - database-schema
  - id: customer-registration
    content: Build complete customer registration feature (form, validation, API, database integration)
    status: completed
    dependencies:
      - auth-system
      - db-functions
  - id: customer-search
    content: Build customer search feature with multi-criteria search and real-time results
    status: completed
    dependencies:
      - customer-registration
  - id: customer-profile
    content: Build customer profile view with point balance summary and transaction history
    status: completed
    dependencies:
      - customer-search
  - id: purchase-transaction
    content: Build purchase transaction feature with point calculation and ledger updates
    status: completed
    dependencies:
      - customer-profile
  - id: point-redemption
    content: Build point redemption feature with discount calculation and balance updates
    status: completed
    dependencies:
      - purchase-transaction
  - id: transaction-history
    content: Build transaction history page with filters and export functionality
    status: completed
    dependencies:
      - point-redemption
  - id: point-activation-job
    content: Implement automated point activation job (hourly pg_cron)
    status: completed
    dependencies:
      - purchase-transaction
  - id: point-expiration-job
    content: Implement automated point expiration job (daily pg_cron)
    status: completed
    dependencies:
      - point-activation-job
  - id: expiring-alerts
    content: Build expiring points alerts system for dashboard and customer profiles
    status: completed
    dependencies:
      - point-expiration-job
  - id: dashboard
    content: Build main dashboard with metrics, quick actions, and activity feed
    status: completed
    dependencies:
      - expiring-alerts
  - id: balance-report
    content: Build customer balance report with filters and export
    status: completed
    dependencies:
      - dashboard
  - id: transaction-report
    content: Build transaction summary report with analytics and visualizations
    status: completed
    dependencies:
      - balance-report
  - id: testing
    content: Write unit and integration tests for all features (target 70%+ coverage)
    status: pending
    dependencies:
      - transaction-report
  - id: ui-polish
    content: Polish UI/UX, implement loading states, error boundaries, and accessibility improvements
    status: pending
    dependencies:
      - testing
  - id: deployment
    content: Deploy to production (Vercel + Supabase), configure monitoring, and conduct launch activities
    status: pending
    dependencies:
      - ui-polish
---

# MGP Loyalty Program System - Development Plan

## Overview

This plan outlines the phased development of the MGP Loyalty Program System, following a feature-by-feature approach where each feature is completed end-to-end (database, backend, frontend) before moving to the next.

## Phase 0: Documentation & Setup (Week 1)

### 0.1 Documentation Updates

- **Update [prd.md](prd.md)**: Add passport_number field to Customer Registration feature (Section 4.1, Feature 1)
- **Update [srs.md](srs.md)**: Add missing database tables:
- `users`/`staff` table for authentication
- `audit_logs` table for compliance
- `notifications` table for Phase 2 WhatsApp integration
- Ensure consistency between PRD and SRS on all business rules

### 0.2 Project Setup

- Initialize Next.js 14 project with TypeScript
- Configure Tailwind CSS
- Set up Supabase project and connection
- Configure ESLint, Prettier, and TypeScript strict mode
- Set up project structure (components, lib, app directories)
- Initialize Git repository with proper .gitignore

### 0.3 Development Environment

- Set up Supabase local development (optional)
- Configure environment variables (.env.local)
- Set up Vercel deployment configuration
- Create initial README with setup instructions

## Phase 1: Foundation & Authentication (Week 2)

### 1.1 Database Schema Setup

**Files to create:**

- `supabase/migrations/001_initial_schema.sql` - Core tables (customers, transactions, point_ledger)
- `supabase/migrations/002_auth_tables.sql` - Users/staff table
- `supabase/migrations/003_audit_logs.sql` - Audit logging table
- `supabase/migrations/004_indexes.sql` - Performance indexes
- `supabase/migrations/005_functions.sql` - Database functions (generate_mgp_id, calculate_points, etc.)

**Key tables:**

- `customers` (as per SRS Section 6.2)
- `transactions` (as per SRS Section 6.2)
- `point_ledger` (as per SRS Section 6.2)
- `users` (staff authentication)
- `audit_logs` (compliance tracking)

### 1.2 Authentication System

**Files to create:**

- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/layout.tsx` - Auth layout
- `lib/auth.ts` - Supabase auth utilities
- `lib/middleware.ts` - Route protection
- `components/auth/LoginForm.tsx` - Login form component

**Features:**

- Supabase Auth integration
- Role-based access (Staff, Manager, Admin)
- Session management (30-minute timeout)
- Password requirements enforcement

### 1.3 Database Functions

**Files to create:**

- `supabase/functions/generate_mgp_id.sql` - MGP ID generation trigger
- `supabase/functions/calculate_points.sql` - Point calculation function
- `supabase/functions/add_purchase.sql` - Purchase transaction handler
- `supabase/functions/redeem_points.sql` - Redemption transaction handler
- `supabase/functions/activate_pending_points.sql` - Point activation job
- `supabase/functions/expire_old_points.sql` - Point expiration job

## Phase 2: Customer Management (Week 3)

### 2.1 Customer Registration Feature

**Files to create:**

- `app/customers/register/page.tsx` - Registration page
- `app/api/customers/route.ts` - POST endpoint for customer creation
- `components/customers/RegistrationForm.tsx` - Registration form
- `lib/validations/customer.ts` - Validation schemas (Zod)
- `lib/supabase/customers.ts` - Customer database operations

**Complete implementation:**

- Form with name, phone, email, Aadhar, passport fields
- Real-time validation
- Duplicate detection
- MGP ID auto-generation
- Success modal with MGP ID display
- Error handling

### 2.2 Customer Search Feature

**Files to create:**

- `app/customers/search/page.tsx` - Search page
- `app/api/customers/search/route.ts` - Search API endpoint
- `components/customers/SearchBar.tsx` - Search input component
- `components/customers/CustomerCard.tsx` - Customer result card
- `lib/supabase/search.ts` - Search query logic

**Complete implementation:**

- Multi-criteria search (phone, MGP ID, name, Aadhar)
- Debounced search input
- Results display with point balance
- Empty state handling
- Keyboard shortcuts (Ctrl+K)

### 2.3 Customer Profile View

**Files to create:**

- `app/customers/[id]/page.tsx` - Customer profile page
- `app/api/customers/[id]/route.ts` - GET customer details
- `components/customers/ProfileHeader.tsx` - Customer info header
- `components/customers/PointBalance.tsx` - Point balance cards
- `components/customers/TransactionList.tsx` - Recent transactions
- `components/customers/QuickActions.tsx` - Action buttons

**Complete implementation:**

- Customer details display
- Point balance summary (available, pending, expiring)
- Recent transactions (last 10)
- Quick action buttons
- Responsive design

## Phase 3: Transaction Processing (Week 4)

### 3.1 Purchase Transaction Feature

**Files to create:**

- `app/transactions/purchase/page.tsx` - Purchase page
- `app/api/transactions/purchase/route.ts` - Purchase API endpoint
- `components/transactions/PurchaseForm.tsx` - Purchase form
- `components/transactions/PointCalculation.tsx` - Points preview
- `lib/supabase/transactions.ts` - Transaction operations

**Complete implementation:**

- Customer selection from search
- Bill amount input with validation
- Real-time points calculation
- Invoice number (optional)
- Confirmation modal
- Transaction creation with point ledger entry
- Success screen with receipt option

### 3.2 Point Redemption Feature

**Files to create:**

- `app/transactions/redeem/page.tsx` - Redemption page
- `app/api/transactions/redeem/route.ts` - Redemption API endpoint
- `components/transactions/RedemptionForm.tsx` - Redemption form
- `components/transactions/DiscountCalculator.tsx` - Discount preview

**Complete implementation:**

- Customer selection
- Available points display
- Bill amount and points to redeem inputs
- Real-time discount calculation
- Final bill calculation
- New points earned calculation
- Confirmation and success flow

### 3.3 Transaction History

**Files to create:**

- `app/transactions/history/page.tsx` - Transaction history page
- `app/api/transactions/route.ts` - GET transactions with filters
- `components/transactions/TransactionTable.tsx` - Transaction table
- `components/transactions/TransactionFilters.tsx` - Filter controls
- `lib/utils/export.ts` - CSV/PDF export utilities

**Complete implementation:**

- Transaction list with pagination
- Filters (date range, type, status, customer)
- Export to CSV/PDF
- Transaction details view

## Phase 4: Point Lifecycle Automation (Week 5)

### 4.1 Automated Point Activation

**Files to create:**

- `supabase/functions/activate_pending_points.sql` - Activation function
- `supabase/cron/activate_points.sql` - pg_cron job setup
- `lib/monitoring/jobs.ts` - Job monitoring utilities

**Complete implementation:**

- Hourly scheduled job
- Identify pending points ready for activation
- Update point status
- Recalculate customer balances
- Log activation events

### 4.2 Automated Point Expiration

**Files to create:**

- `supabase/functions/expire_old_points.sql` - Expiration function
- `supabase/cron/expire_points.sql` - pg_cron job setup

**Complete implementation:**

- Daily scheduled job (2:00 AM)
- Identify expired points
- Update point status
- Recalculate customer balances
- Generate expiration notifications (queue for Phase 2)

### 4.3 Expiring Points Alerts

**Files to create:**

- `app/dashboard/alerts/page.tsx` - Alerts page
- `components/dashboard/ExpiringPointsAlert.tsx` - Alert widget
- `app/api/reports/expiring/route.ts` - Expiring points API

**Complete implementation:**

- Dashboard widget showing expiring points
- Customer profile alerts
- 30-day threshold detection
- Staff notification system

## Phase 5: Dashboard & Reporting (Week 6)

### 5.1 Main Dashboard

**Files to create:**

- `app/dashboard/page.tsx` - Main dashboard
- `components/dashboard/MetricsWidget.tsx` - Key metrics
- `components/dashboard/QuickActions.tsx` - Action buttons
- `components/dashboard/RecentActivity.tsx` - Activity feed
- `app/api/dashboard/stats/route.ts` - Dashboard statistics API

**Complete implementation:**

- Today's summary (customers, points, redemptions)
- Quick action buttons
- Recent activity feed
- Alerts panel
- Responsive layout

### 5.2 Customer Balance Report

**Files to create:**

- `app/reports/balance/page.tsx` - Balance report page
- `app/api/reports/balance/route.ts` - Balance report API
- `components/reports/BalanceReportTable.tsx` - Report table
- `components/reports/ReportFilters.tsx` - Filter controls

**Complete implementation:**

- Customer list with point balances
- Filters (balance range, status, date range)
- Sortable columns
- CSV/PDF export

### 5.3 Transaction Summary Report

**Files to create:**

- `app/reports/transactions/page.tsx` - Transaction report page
- `app/api/reports/transactions/route.ts` - Transaction analytics API
- `components/reports/TransactionCharts.tsx` - Visualization components

**Complete implementation:**

- Transaction metrics (total, average, redemption rate)
- Date range grouping (day/week/month/year)
- Charts and visualizations
- Export functionality

## Phase 6: Testing & Polish (Week 7)

### 6.1 Unit Testing

**Files to create:**

- Test setup with Jest/Vitest
- `__tests__/lib/` - Utility function tests
- `__tests__/components/` - Component tests
- `__tests__/api/` - API endpoint tests

**Coverage:**

- Point calculation logic
- Validation functions
- Database functions
- API endpoints

### 6.2 Integration Testing

**Files to create:**

- `__tests__/integration/` - Integration test suite
- E2E test setup (Playwright or Cypress)

**Test scenarios:**

- Complete customer registration flow
- Purchase transaction flow
- Redemption flow
- Point activation/expiration jobs

### 6.3 UI/UX Polish

- Responsive design refinement
- Loading states and skeletons
- Error boundary implementation
- Accessibility improvements (WCAG 2.1 AA)
- Performance optimization

### 6.4 Documentation

- API documentation (OpenAPI/Swagger)
- Component documentation
- Deployment guide
- User manual for staff

## Phase 7: Deployment & Launch (Week 8)

### 7.1 Pre-Launch Checklist

- [ ] All MVP features tested and working
- [ ] Database backups configured
- [ ] Monitoring and error tracking set up (Sentry)
- [ ] Performance testing completed
- [ ] Security audit
- [ ] Staff training materials prepared

### 7.2 Production Deployment

- Deploy to Vercel (frontend)
- Configure Supabase production database
- Set up environment variables
- Configure custom domain
- SSL certificate setup
- Database migration to production

### 7.3 Launch Activities

- Staff training sessions
- Soft launch with limited customers
- Monitor system performance
- Gather feedback
- Full launch announcement

## Phase 8: Phase 2 Features (Post-Launch - Q2 2026)

### 8.1 WhatsApp Notifications

- Gupshup API integration
- Notification templates
- Message queue system
- Opt-in/opt-out management

### 8.2 Enhanced Reporting

- Advanced analytics dashboard
- Customer segmentation
- Predictive insights

### 8.3 Customer Statement Generation

- PDF statement generation
- Print functionality
- Email delivery option

## Technical Stack Summary

**Frontend:**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18
- Lucide React (icons)
- Sonner (notifications)

**Backend:**

- Supabase (PostgreSQL)
- Supabase Auth
- pg_cron (scheduled jobs)
- Edge Functions (Deno)

**Development Tools:**

- ESLint + Prettier
- TypeScript strict mode
- Jest/Vitest (testing)
- Playwright (E2E testing)

## Success Criteria

**Phase 1-6 (MVP):**

- All core features functional
- 99.5%+ system uptime
- < 3 second transaction processing
- 70%+ test coverage
- WCAG 2.1 AA compliant

**Launch:**

- 200+ customers enrolled in first month
- < 2% transaction error rate
- All staff trained and confident
- Zero critical security incidents

## Risk Mitigation

- **Database Performance:** Implement proper indexing from start