# Sales Dashboard

A responsive sales management and analytics dashboard built as a focused Next.js MVP. It delivers a polished overview of revenue, orders, sales mix, and recent customer transactions, with a safe path to connect Supabase when credentials are available.

## Key features

- Responsive analytics workspace with desktop sidebar and mobile navigation
- Revenue KPIs, monthly revenue visualization, plan mix, and recent transaction table
- INR currency formatting in one central utility
- Supabase browser and server client foundations using `@supabase/ssr`
- PostgreSQL schema, indexes, seed records, and row level security foundation
- Safe local preview data when Supabase is not configured

## Technology stack

- Next.js App Router and React
- TypeScript
- Supabase and PostgreSQL
- Recharts and Lucide React
- Zod, React Hook Form, TanStack Table, date-fns, and Sonner

## Architecture

```
src/app                 App Router routes and dashboard layout
src/components          Layout, dashboard, and chart components
src/lib/queries         Preview data and future query boundary
src/lib/supabase        Browser and server Supabase clients
src/lib/utils           Shared utilities including currency formatting
src/types               Shared domain types
supabase/migrations     Database schema, indexes, and RLS policies
supabase/seed.sql       Synthetic starter records
```

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The root route redirects to `/dashboard`.

## Environment variables

Create `.env.local` from `.env.example` and add these values only when you are ready to connect Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The application does not use or expose a Supabase service role key. Without these values, the dashboard intentionally uses local preview data.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/20261126000000_initial_schema.sql` in the SQL editor or through the Supabase CLI.
3. Run `supabase/seed.sql` to add synthetic starter data.
4. Add the project URL and anonymous key to `.env.local`.

The migration enables Row Level Security. Its demo policies grant authenticated users read access only. Before production writes, add organisation ownership and membership checks to every policy.

## Commands

```bash
npm run dev        # Run the local development server
npm run typecheck  # Check TypeScript
npm run lint       # Run ESLint
npm run build      # Create a production build
npm run start      # Serve the production build
```
