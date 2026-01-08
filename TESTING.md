# Testing Guide

This document provides information about the test suite for the MGP Loyalty Program System.

## Test Coverage

The project aims for **70%+ code coverage** across all features. Coverage includes:

- **Unit Tests**: Utility functions, validation schemas, auth functions, and Supabase client functions
- **Integration Tests**: API routes and database interactions
- **Component Tests**: React components with user interactions

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory and will show:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## Test Structure

```
├── lib/
│   ├── __tests__/
│   │   ├── auth.test.ts              # Auth function tests
│   ├── utils/
│   │   └── __tests__/
│   │       └── points.test.ts        # Points calculation tests
│   ├── validations/
│   │   └── __tests__/
│   │       └── customer.test.ts      # Validation schema tests
│   └── supabase/
│       └── __tests__/
│           ├── customers.test.ts     # Customer CRUD tests
│           └── transactions.test.ts  # Transaction tests
├── app/
│   └── api/
│       └── __tests__/
│           ├── customers.test.ts              # Customer API tests
│           ├── customers-search.test.ts      # Search API tests
│           ├── customers-id.test.ts          # Customer detail API tests
│           ├── transactions-purchase.test.ts  # Purchase API tests
│           └── transactions-redeem.test.ts   # Redemption API tests
└── components/
    └── __tests__/
        ├── PointBalance.test.tsx      # Point balance component tests
        ├── RegistrationForm.test.tsx  # Registration form tests
        ├── SearchBar.test.tsx         # Search bar component tests
        └── PurchaseForm.test.tsx      # Purchase form tests
```

## Test Categories

### Unit Tests

**Utility Functions** (`lib/utils/__tests__/points.test.ts`)
- Tests for `calculatePoints()` function
- Validates point calculation logic (₹50 = 1 point)
- Tests edge cases (minimum amounts, large amounts, decimals)

**Validation Schemas** (`lib/validations/__tests__/customer.test.ts`)
- Tests Zod validation schemas
- Validates all field constraints (name, phone, email, Aadhar, passport)
- Tests required field combinations

**Auth Functions** (`lib/__tests__/auth.test.ts`)
- Tests `getCurrentUser()`, `requireAuth()`, and `signOut()`
- Tests role-based access control
- Tests authentication failures

**Supabase Functions** (`lib/supabase/__tests__/`)
- Tests customer CRUD operations
- Tests transaction operations
- Tests search functionality
- Mocks Supabase client responses

### Integration Tests

**API Routes** (`app/api/__tests__/`)
- Tests all API endpoints
- Tests request/response handling
- Tests error scenarios
- Tests authentication requirements
- Tests validation error handling

### Component Tests

**React Components** (`components/__tests__/`)
- Tests component rendering
- Tests user interactions
- Tests form submissions
- Tests error handling
- Tests navigation

## Mocking

The test suite uses extensive mocking for:

- **Next.js Router**: `next/navigation` hooks and functions
- **Supabase Client**: Database operations
- **Fetch API**: HTTP requests
- **Toast Notifications**: `sonner` toast library

## Writing New Tests

When adding new features, follow these guidelines:

1. **Unit tests first**: Test individual functions and utilities
2. **Integration tests**: Test API routes and database interactions
3. **Component tests**: Test React components with user interactions
4. **Coverage**: Aim for 70%+ coverage for new code
5. **Naming**: Use descriptive test names that explain what is being tested
6. **Arrange-Act-Assert**: Structure tests clearly

### Example Test Structure

```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup mocks and test data
  })

  it('should do something specific', async () => {
    // Arrange
    const input = { ... }
    
    // Act
    const result = await functionUnderTest(input)
    
    // Assert
    expect(result).toEqual(expectedOutput)
  })
})
```

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipeline
- Before merging pull requests

## Troubleshooting

### Tests failing with module resolution errors
- Ensure `tsconfig.json` paths are correctly configured
- Check that `jest.config.js` has correct `moduleNameMapper`

### Mocking issues
- Verify mocks are set up in `jest.setup.js`
- Check that mocks are cleared in `beforeEach` hooks

### Coverage not meeting threshold
- Review coverage report to identify untested code paths
- Add tests for edge cases and error scenarios
- Ensure all branches are tested (if/else, ternary operators)

## Coverage Thresholds

Current coverage thresholds (configured in `jest.config.js`):
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

These thresholds are enforced when running `npm run test:coverage`.

