# FLUS — MVP Platform (Supabase Edition)

**FLUS** is an MVP platform for small jobs where employers can create jobs and job seekers can apply for and complete local tasks. The project uses Supabase for persistent storage and Next.js for frontend/backend.

This repository contains the FLUS MVP prototype — a small-job platform for discovering and applying to local tasks, with chat functionality and employer tools. The prototype uses Supabase for persistent data (jobs, users, applications, CV).

> � **Quick Start:** See [QUICK_START.md](./QUICK_START.md) for step-by-step setup guide!

---

**Note:** This is an educational prototype, not production-ready. It is designed for demos and local development.

---

## ✨ Key Features

### For Job Seekers (Worker)
- � **Find Jobs** - Search and filter jobs by category, distance, and keywords
- � **Apply** - Submit applications directly
- � **Chat** - Communicate with employers
- � **Achievements** - Track your completed jobs and earn achievements
- � **My Applications** - Overview of submitted applications
- � **Profile** - Manage your profile, work experience, and skills

### For Employers
- ➕ **Create Jobs** - Publish new jobs with detailed information
- � **My Jobs** - Overview of your published jobs
- � **Chat** - Communicate with applicants
- � **Statistics** - View statistics about your jobs
- � **Profile** - Manage your profile

### Enhanced Job Scheduling
- **Flexible timing** - Start anytime
- **Fixed times** - Specific time slots (e.g., 12:00-14:00)
- **Deadlines** - Complete within given time
- **Location** - Full address support
- **Payment types** - Fixed price or hourly rate
- **Requirements** - Specific instructions or qualifications

---

## �️ Tech Stack

- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI
- **Authentication**: Real Vipps OAuth (cookie-based sessions)
- **Language**: TypeScript

---

## � Quick Summary of Implemented Features

- **Jobs listing and detail pages** backed by Supabase
- **Enhanced job scheduling**: Flexible timing, fixed schedules, deadlines
- **Location tracking**: Full addresses, map integration
- **Payment flexibility**: Fixed price or hourly rates
- **Job creation form** with all scheduling options at `/jobber/ny`
- **Apply flow** that creates an application in Supabase and returns a conversation ID for the chat UI
- **Real Vipps OAuth authentication** with user data fetched from Vipps API
- **Internationalization (i18n)**: Norwegian (default) and English language support
- **Language switcher**: Toggle between NO/EN in navbar
- **Demo chat and conversations** remain partly in-memory for quick demo conversations
- **Profile page** (demo data) and placeholders for CV; CV persistence is implemented

---

## � Developer Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create `.env.local` in the root folder with your Supabase credentials (see `SUPABASE_SETUP.md` for details):

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: only for server-side admin tasks
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Migrations

Go to Supabase Dashboard → SQL Editor and run the migrations from `supabase/migrations/`:

```sql
-- See supabase/migrations/ directory for all migration files
-- Run them in order: 00, 01, 02, 03, 04
```

### 4. Start Dev Server

```bash
npm run dev
```

Open http://localhost:3000 (or the port printed by Next.js) to view the app.

---

## � Authentication

The project uses real Vipps OAuth for authentication. Users can freely switch between seeking jobs and creating jobs using the toggle in the navbar.

### How to Test the Vipps OAuth Flow

1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000/login`
3. Click **Logg inn med Vipps** (Log in with Vipps)
4. You will be redirected to Vipps for authentication
5. After authenticating with Vipps, you'll be logged in and can switch between worker/employer modes using the toggle in the navbar

---

## � Important API Routes

### Jobs
- `GET /api/jobs` — Lists jobs from Supabase
- `POST /api/jobs` — Creates a new job (requires session)
- `GET /api/jobs/[id]` — Job detail
- `GET /api/my-jobs` — Lists user's jobs (employer view)

### Applications
- `GET /api/applications` — Lists user's applications
- `POST /api/applications` — Creates an application (requires session) and returns a `conversationId` for the chat UI

### CV
- `GET /api/cv` — Returns user's CV entries and skills
- `POST /api/cv` — Adds new CV entry or skill (requires auth)

### Auth
- `GET /api/auth/vipps/start` — Initiates Vipps OAuth flow, redirects to Vipps authorization URL
- `GET /api/auth/vipps/callback` — Handles OAuth callback, exchanges code for token, creates/finds user in Supabase
- `GET /api/auth/me` — Returns current user (reads from Supabase when possible)
- `POST /api/auth/logout` — Logs out user

### Dev Helpers
- `POST /api/admin/seed/jobs` — Dev-only seed endpoint that inserts example jobs (no UI; use curl or Postman)

---

## �️ Seed Jobs Quickly (Dev)

If your Supabase project has no `jobs` rows yet, use the dev seed endpoint after starting the dev server:

```bash
# If Next runs on 3000
curl -X POST http://localhost:3000/api/admin/seed/jobs
# or replace port with the one Next reports (3001, etc.)
```

This endpoint will no-op if jobs already exist.

---

## � Role Management

The system supports two roles:

### Worker (Job Seeker)
- Can apply for jobs
- View my applications
- Chat with employers
- Earn achievements

### Employer
- Can create jobs
- View my jobs
- Chat with applicants
- View statistics

**Role Switching:** Use the button in the navbar to switch between roles (saved in localStorage).

---

## ��️ Database Schema

### Tables
- `users` — Users (id, email, role, navn, kommune)
- `jobs` — Jobs with all fields including scheduling
- `applications` — Applications (job_id, applicant_id)
- `cv_entries` — Work experience (title, company, dates)
- `skills` — Skills (skill_name, proficiency_level, years_experience)
- `conversations` — (In-memory for now)

See `SUPABASE_SETUP.md` for complete schema.

---

## � Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── jobs/              # Jobs (GET/POST)
│   │   ├── my-jobs/           # My jobs (employer)
│   │   ├── applications/      # Applications
│   │   ├── cv/                # CV management
│   │   ├── auth/              # Authentication
│   │   └── ...
│   ├── jobber/                # Job listing
│   │   └── ny/                # Create job (employer)
│   ├── mine-jobber/           # My jobs (employer)
│   ├── mine-soknader/         # My applications (worker)
│   ├── samtaler/              # Chat
│   ├── prestasjoner/          # Achievements
│   ├── statistikk/            # Statistics (employer)
│   └── profil/                # Profile
├── components/
│   ├── Navbar.tsx             # Main navigation with role toggle
│   ├── JobDetailsDialog.tsx   # Job details modal
│   └── ui/                    # UI components
└── lib/
    ├── data/                  # Data handling
    │   ├── sessions.ts        # Session management
    │   ├── users.ts           # User data
    │   └── jobs.ts            # Job data (mock)
    └── utils/                 # Utility functions
```

---

## ⚙️ Known Limitations

1. **Real Vipps OAuth** — Secure authentication via Vipps API
2. **In-memory Conversations** — Chats stored in memory (lost on restart)
3. **No geocoding** — Coordinates default to Oslo center
4. **Statistics placeholder** — Shows 0 values (API not implemented)

### � RLS Error Fix

If you get error `"new row violates row-level security policy"` when creating jobs:
1. Open Supabase SQL Editor
2. Run SQL from `supabase/migrations/04_fix_rls_for_cookie_auth.sql`
3. This makes RLS compatible with cookie-based auth

---

## � Current Limitations and Next Work

- CV persistence: the database schema includes `cv_entries` and `skills`, and the API/UI for saving CV items is implemented.
- Chat persistence: conversations/messages are still in-memory for demo conversations; migrating chat to Supabase (with optional Realtime) is planned.
- Auth: current flow uses real Vipps OAuth. Ensure proper security for production use.

---

## � Next Steps (Recommended)

- [ ] Migrate chat (conversations/messages) to Supabase and enable Realtime for live messaging
- [ ] Add geocoding for addresses
- [ ] Implement statistics API with real metrics
- [ ] Add rating system for users
- [ ] Add push notifications
- [ ] Add image upload for jobs

---

## � Developer Notes and Guidelines

- Keep code comments in English. UI should be in Norwegian (as the app is targeted locally).
- Avoid server-side calls to the app itself; prefer using Supabase or other external services from server routes.
- When changing server routes that return server components, `await params` before using `params.id` to avoid Next.js validator issues.

---

## � License

Educational prototype. Reuse for non-commercial, educational purposes with attribution.

© 2025 — Denys Koval
