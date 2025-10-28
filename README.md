# FLUS — MVP Platform

**FLUS** is a Norwegian job platform MVP connecting employers with workers for small local tasks. Built with Next.js 15, Supabase (PostgreSQL), and real Vipps OAuth authentication.

## Features

### For Workers (Jobbsøker)
- Browse jobs by category, location, keywords
- Apply with cover message
- Chat with employers
- Track achievements and progress
- View application status
- Profile with CV, skills, reviews
- **Email notifications** for application status updates

### For Employers (Arbeidsgiver)
- Create jobs with requirements
- Manage posted jobs
- Chat with applicants
- View statistics
- Company profile and reviews
- **Email notifications** for new applications

### Job Features
- Flexible scheduling (anytime/fixed/deadline)
- Location support with maps
- Payment options (fixed/hourly)
- Photo uploads
- Job categories

### Communication & Notifications
- **Real-time chat** between employers and workers
- **Email notifications** for:
  - New job applications (to employers)
  - Application status changes (to workers)
  - Welcome emails upon registration
- **Persistent conversations** with Supabase storage

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL, Storage, RLS)
- **Auth**: Vipps OAuth (Login API)
- **Styling**: Tailwind CSS 4.0
- **UI**: Radix UI
- **Language**: TypeScript
- **Sessions**: HTTP-only cookies

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/KovalDenys1/flus-mvp.git
cd flus-mvp
npm install
```

### 2. Supabase Setup

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migration in `supabase/migrations/01_init_schema.sql`
3. Create `job-photos` storage bucket (Public: YES, 5MB limit)
4. Run `supabase/migrations/02_storage_policies.sql`

### 3. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vipps OAuth
VIPPS_CLIENT_ID=your-client-id
VIPPS_CLIENT_SECRET=your-client-secret
VIPPS_SUBSCRIPTION_KEY=your-subscription-key
VIPPS_MERCHANT_SERIAL_NUMBER=your-msn
VIPPS_REDIRECT_URI=https://your-domain.com/api/auth/vipps/callback

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. Email Setup (Optional)

For email notifications, configure SMTP in `.env.local`. Uses Gmail by default:

1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password as `SMTP_PASS`

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000

## ✅ Features Implemented

**Complete:**
- ✅ Jobs CRUD with Supabase
- ✅ Job applications
- ✅ Vipps OAuth authentication
- ✅ Dual profiles (worker/employer)
- ✅ CV system (experience, skills)
- ✅ Reviews and ratings
- ✅ Photo uploads (Supabase Storage)
- ✅ Real-time profile sync
- ✅ **Persistent chat system** with Supabase
- ✅ **Email notifications** (applications, status updates, welcome)
- ✅ **E2E testing** with Playwright
- ✅ Responsive design

**Partial/Demo:**
- ⚠️ Chat (now persistent with database)
- ⚠️ Statistics (basic)
- ⚠️ Achievements (demo data)

## API Routes

**Authentication:**
- `GET /api/auth/vipps/start` - OAuth start
- `GET /api/auth/vipps/callback` - OAuth callback
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout

**Jobs:**
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs/[id]` - Job details
- `GET /api/my-jobs` - User's jobs

**Applications:**
- `GET /api/applications` - User applications
- `POST /api/applications` - Apply

**Profile:**
- `GET /api/profile/stats` - Statistics
- `POST /api/profile/update` - Update
- `GET /api/profile/reviews` - Reviews

**CV:**
- `GET /api/cv` - Get CV
- `POST /api/cv` - Add entry
- `DELETE /api/cv` - Remove

## Role System

Switch modes with navbar toggle:

**Worker:** Browse jobs, apply, CV, achievements  
**Employer:** Create jobs, view applicants, statistics

Real-time sync - profile updates instantly when switching!

## Database

**Tables:**
- users, jobs, applications
- cv_entries, skills, reviews
- conversations, messages
- achievements, job_photos

**Storage:**
- job-photos bucket (5MB)

## Project Structure

```
flus-mvp/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── jobber/        # Jobs
│   │   ├── profil/        # Profiles
│   │   └── ...
│   ├── components/        # React components
│   └── lib/              # Utils, data, Vipps
├── supabase/
│   └── migrations/       # DB migrations
└── .env.local
```

## Troubleshooting

**"Failed to fetch":** Check `.env.local`, restart server

**"RLS policy error":** Run database migrations

**"Job not found":** Check database setup and migrations

## License

MIT License - Educational prototype

(c) 2025 Denys Koval

## Support

- GitHub Issues
- Supabase Dashboard logs

---

**Built with love in Norway**
