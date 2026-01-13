# ShoreHomeScore v2.0 🏠🌊

Full-featured NJ Coastal Property Resilience Platform with user accounts, saved progress, document vault, contractor directory, and cost estimators.

## Features

- ✅ **User Accounts** - Sign up/login with email or Google
- ✅ **Onboarding Quiz** - 2-minute property assessment
- ✅ **Progress Saving** - Auto-saves as you go
- ✅ **Multiple Properties** - Track beach house + primary home
- ✅ **Cost Estimator** - See upgrade costs in real-time
- ✅ **Insurance Savings Calculator** - Annual savings projection
- ✅ **Contractor Directory** - Find FORTIFIED-certified pros
- ✅ **Document Vault** - Store elevation certs, policies, permits
- ✅ **Neighborhood Comparison** - See how you rank

## Quick Start (Demo Mode)

The app works **without Supabase** in demo mode - data saves to your browser's local storage.

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Full Setup with Supabase

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**
3. Name it `shorehomescore`
4. Set a database password (save this!)
5. Choose a region close to NJ (US East)
6. Click **Create Project** and wait ~2 minutes

### Step 2: Create Database Tables

Go to **SQL Editor** in Supabase and run this:

```sql
-- Properties table
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  address text,
  zip_code text,
  selections jsonb default '{}',
  quiz_answers jsonb default '{}',
  priorities jsonb default '[]',
  home_value integer default 500000,
  project_budget integer default 0,
  roof_age integer default 15,
  replacement_cost integer default 300000,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Documents table
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  type text not null,
  name text not null,
  size integer,
  path text,
  url text,
  created_at timestamp with time zone default now()
);

-- Leads table (for non-logged in users)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  address text,
  email text,
  phone text,
  score integer,
  selections jsonb,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.properties enable row level security;
alter table public.documents enable row level security;
alter table public.leads enable row level security;

-- Policies for properties
create policy "Users can view own properties"
  on public.properties for select
  using (auth.uid() = user_id);

create policy "Users can insert own properties"
  on public.properties for insert
  with check (auth.uid() = user_id);

create policy "Users can update own properties"
  on public.properties for update
  using (auth.uid() = user_id);

create policy "Users can delete own properties"
  on public.properties for delete
  using (auth.uid() = user_id);

-- Policies for documents
create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- Anyone can insert leads
create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);
```

### Step 3: Enable Google Auth (Optional)

1. In Supabase, go to **Authentication** > **Providers**
2. Enable **Google**
3. Follow the instructions to set up Google OAuth
4. Add your redirect URL: `https://your-app.vercel.app`

### Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase
2. Click **New Bucket**
3. Name it `documents`
4. Make it **public** (or set up policies)

### Step 5: Get Your API Keys

1. Go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key

### Step 6: Configure Environment Variables

Create `.env` in your project root:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...
```

### Step 7: Deploy to Vercel

```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

Then in Vercel:
1. Go to your project **Settings** > **Environment Variables**
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui.jsx       # Button, Input, Card, etc.
│   ├── navigation.jsx
│   └── ScoreGauge.jsx
├── pages/           # Route pages
│   ├── Landing.jsx
│   ├── Auth.jsx     # Login & Signup
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── Checklist.jsx
│   ├── Contractors.jsx
│   ├── Documents.jsx
│   └── Settings.jsx
├── lib/             # Utilities
│   ├── supabase.js  # Supabase client
│   ├── auth.jsx     # Auth context
│   ├── store.js     # Zustand state
│   └── database.js  # DB operations
├── data/            # Static data
│   ├── costs.js     # Upgrade costs
│   └── quiz.js      # Quiz questions
└── App.jsx          # Router setup
```

## Tech Stack

- **React 18** + **Vite**
- **React Router** for navigation
- **Supabase** for auth & database
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## License

MIT
