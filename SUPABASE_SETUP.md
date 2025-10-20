# Supabase setup for FLUS

This guide wires the app to Supabase for data (Jobs now; CV/Applications/Chat next). It includes env vars, full SQL schema, optional Row Level Security (RLS) policies, seed data, and tips for Realtime.

## 1) Environment variables
Create `.env.local` at the repo root (already git-ignored):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: used only on the server for admin tasks (never expose to the browser)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Restart the dev server after editing env.

## 2) Database schema (SQL)
Open the Supabase SQL editor and run the statements below. This creates tables for Jobs, Applications, CV, and Chat.

Notes
- Uses `gen_random_uuid()` (available in Supabase). If you prefer, you can use `uuid_generate_v4()`.
- All timestamps are `timestamptz` with `now()` defaults.

```sql
-- Users (optional if you use Supabase Auth; otherwise keep as a profile table)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  role text,               -- 'worker' | 'employer'
  navn text,
  kommune text,
  fodselsdato text,
  created_at timestamptz not null default now()
);

-- Jobs
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  pay_nok numeric not null,
  duration_minutes integer not null,
  area_name text not null,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now(),
  status text not null default 'open',
  employer_id uuid references users(id)
);

create index if not exists jobs_created_idx on jobs(created_at desc);

-- Applications (a user applies to a job)
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  applicant_id uuid references users(id),
  created_at timestamptz not null default now()
);
create index if not exists applications_job_idx on applications(job_id);

-- CV entries (very simple MVP)
create table if not exists cv_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  category text not null,
  date text not null,
  created_at timestamptz not null default now()
);
create index if not exists cv_entries_user_idx on cv_entries(user_id);

-- Skills (MVP)
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index if not exists skills_user_idx on skills(user_id);

-- Conversations (chat)
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete set null,
  initiator_id uuid references users(id),     -- employer or worker
  participant_id uuid references users(id),   -- the other one
  created_at timestamptz not null default now()
);
create index if not exists conversations_participant_idx on conversations(initiator_id, participant_id, created_at desc);

-- Messages (chat)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid references users(id),
  text text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);
create index if not exists messages_conversation_idx on messages(conversation_id, created_at asc);
```

## 3) Row Level Security (RLS) policies
You have two good options depending on your demo needs:

Option A — Demo-friendly (open read)
- Enable RLS selectively and create permissive policies for public reads (useful for demos without auth).

```sql
-- Jobs readable by anyone (demo)
alter table jobs enable row level security;
drop policy if exists "read all jobs" on jobs;
create policy "read all jobs" on jobs for select using (true);
```

Option B — Auth-aware (recommended for real users)
- If you adopt Supabase Auth, limit reads/writes by `auth.uid()`.
  Example for CV tables (only owner can read/write):

```sql
alter table cv_entries enable row level security;
drop policy if exists "cv read own" on cv_entries;
drop policy if exists "cv write own" on cv_entries;
create policy "cv read own" on cv_entries for select using (user_id = auth.uid());
create policy "cv write own" on cv_entries for insert with check (user_id = auth.uid());
create policy "cv update own" on cv_entries for update using (user_id = auth.uid());
create policy "cv delete own" on cv_entries for delete using (user_id = auth.uid());

alter table skills enable row level security;
drop policy if exists "skills read own" on skills;
drop policy if exists "skills write own" on skills;
create policy "skills read own" on skills for select using (user_id = auth.uid());
create policy "skills write own" on skills for insert with check (user_id = auth.uid());
create policy "skills update own" on skills for update using (user_id = auth.uid());
create policy "skills delete own" on skills for delete using (user_id = auth.uid());
```

For `applications`, `conversations`, and `messages`, choose policies based on your auth model. For a public demo, consider allowing reads and restricting writes to a safe subset or using Service Role from the server only.

## 4) Seed some demo data (Jobs)
Option A — via API (pulls from local demo data)

After running the schema, you can seed jobs by calling the dev-only endpoint:

- Start the dev server
- POST to `/api/admin/seed/jobs`

This uses `src/lib/data/jobs.ts` and maps fields to the Supabase `jobs` table.
It will no-op if the table already has rows.

Option B — via SQL (manual insert)

Run the following to see jobs in the UI quickly:

```sql
insert into jobs (title, description, category, pay_nok, duration_minutes, area_name, lat, lng)
values
('Hagearbeid – klipping', 'Trenger hjelp til å klippe hekken i bakgården.', 'hage', 350, 120, 'Oslo', 59.9139, 10.7522),
('Flyttehjelp', 'Bære esker fra 3. etasje og inn i varebil.', 'flytting', 400, 180, 'Bergen', 60.3913, 5.3221);
```

## 5) Realtime (optional for chat)
If/when you move chat to Supabase:
- In the Supabase dashboard → Database → Replication → Configure, enable Realtime for the `messages` table.
- Subscribe to the `messages` table in the client to receive inserts in real-time.

## 6) App integration status
- Env vars: already wired (`.env.local`).
- API:
  - `GET /api/jobs` and `GET /api/jobs/[id]` now query Supabase.
  - If the `jobs` table doesn’t exist yet, the list endpoint falls back to an empty array (no 500s during setup).

## 7) Test locally
- Start dev: `npm run dev`
- Visit `/jobber` to see the jobs list.
- API checks: `/api/jobs` and `/api/jobs/<id>`.

## 8) Troubleshooting
- Error 42P01 (relation does not exist): run the SQL schema above to create tables.
- Empty list on `/jobber`: seed the `jobs` table.
- Auth-related RLS failures: use the demo-friendly policies or set up Supabase Auth and switch to auth-aware policies.

---
When you’re ready, we can migrate Applications, CV, and Chat to Supabase using the same pattern (server-side Supabase client in API routes, and optional RLS based on your auth choice).
