# MGP Loyalty Program System

Customer rewards management platform for Mangatrai Pearls & Jewellers.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, React 18
- **Backend:** Supabase (PostgreSQL), Supabase Auth
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create `.env.local` file in the root directory (this is your main config file)
   - Copy the template from `.env.example` (or create manually)
   - Update with your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (from Project Settings > API)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase Publishable key (or Legacy anon key)
     - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase Service Role key (from Project Settings > API) - **Required for user registration**
   
   **Note:** The npm scripts automatically sync `.env.local` to `.env` for Supabase CLI compatibility. You only need to maintain `.env.local`.
   
   **Important:** The `SUPABASE_SERVICE_ROLE_KEY` is used server-side only (never exposed to client) for creating users. Get it from Supabase Dashboard → Settings → API → Service Role Key.

3. Set up Supabase:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run database migrations in order (001-010) from `supabase/migrations/` directory
   - See `SUPABASE_SETUP.md` for detailed migration instructions
   
   **Quick migration options:**
   - **Option A (Dashboard)**: Copy/paste each migration file into Supabase SQL Editor
   - **Option B (CLI - Recommended)**: See Supabase CLI commands below
   - **Option C**: Use the migration files with psql

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── customers/         # Customer management
│   ├── transactions/      # Transaction processing
│   ├── dashboard/         # Dashboard and reports
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client setup
│   └── validations/      # Zod schemas
├── supabase/              # Database files
│   ├── migrations/       # SQL migration files
│   └── functions/       # Database functions
└── public/               # Static assets
```

## Features

### Phase 1 (MVP)
- ✅ Customer registration with MGP ID
- ✅ Customer search and profile view
- ✅ Purchase transaction entry
- ✅ Point redemption
- ✅ Automated point activation (24 hours)
- ✅ Automated point expiration (2 years)
- ✅ Dashboard and reporting

### Phase 2 (Post-Launch)
- WhatsApp/SMS notifications
- Enhanced reporting
- Customer statement generation

## Supabase CLI Commands

If you're using Supabase CLI for database management:

### Initial Setup

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref your-project-id
   ```
   (Find your project ID in the project URL: `https://xxxxx.supabase.co`)

### Running Migrations

**Push all migrations to remote database:**
```bash
supabase db push
```

**Run a specific migration file:**
```bash
supabase db push --file supabase/migrations/010_fix_users_rls.sql
```

**Check migration status:**
```bash
supabase migration list
```

**Reset database (⚠️ WARNING: This deletes all data):**
```bash
supabase db reset
```

### Development Workflow

**Start local Supabase (optional, for local development):**
```bash
supabase start
```

**Stop local Supabase:**
```bash
supabase stop
```

**Generate TypeScript types from your database:**
```bash
supabase gen types typescript --linked > types/supabase.ts
```

**View database changes:**
```bash
supabase db diff
```

**Create a new migration from schema changes:**
```bash
supabase migration new migration_name
```

For more details, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Testing

The project includes comprehensive unit and integration tests targeting 70%+ code coverage.

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## License

Private - Mangatrai Pearls & Jewellers

