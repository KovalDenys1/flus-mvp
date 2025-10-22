# FLUS — MVP Platform

**FLUS** is a Norwegian job platform MVP connecting employers with workers for small local tasks. Built with Next.js 15, Supabase (PostgreSQL), and real Vipps OAuth authentication.

> **Quick Start:** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete setup guide!

---

## Features

### For Workers (Jobbsøker)
- Browse jobs by category, location, keywords
- Apply with cover message
- Chat with employers
- Track achievements and progress
- View application status
- Profile with CV, skills, reviews

### For Employers (Arbeidsgiver)
- Create jobs with requirements
- Manage posted jobs
- Chat with applicants
- View statistics
- Company profile and reviews

### Job Features
- Flexible scheduling (anytime/fixed/deadline)
- Location support with maps
- Payment options (fixed/hourly)
- Photo uploads
- Job categories

---

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL, Storage, RLS)
- **Auth**: Vipps OAuth (Login API)
- **Styling**: Tailwind CSS 4.0
- **UI**: Radix UI
- **Language**: TypeScript
- **Sessions**: HTTP-only cookies

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/KovalDenys1/flus-mvp.git
cd flus-mvp
npm install
```

### 2. Supabase Setup

**See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed guide!**

Quick steps:
1. Create Supabase project
2. Run `supabase/migrations/01_init_schema.sql` (includes all security fixes)
3. Create `job-photos` storage bucket (Public: YES, 5MB limit)
4. Run `supabase/migrations/02_storage_policies.sql`
5. (Optional) Run `supabase/migrations/03_seed_demo_jobs.sql` for test data

### 3. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Vipps OAuth
VIPPS_CLIENT_ID=your-client-id
VIPPS_CLIENT_SECRET=your-client-secret
VIPPS_SUBSCRIPTION_KEY=your-subscription-key
VIPPS_MERCHANT_SERIAL_NUMBER=your-msn
VIPPS_REDIRECT_URI=http://localhost:3000/api/auth/vipps/callback
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

---

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
- ✅ Responsive design

**Partial/Demo:**
- ⚠️ Chat (in-memory, migration ready)
- ⚠️ Statistics (basic)
- ⚠️ Achievements (demo data)

---

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

---

## Role System

Switch modes with navbar toggle:

**Worker:** Browse jobs, apply, CV, achievements  
**Employer:** Create jobs, view applicants, statistics

Real-time sync - profile updates instantly when switching!

---

## Database

**Tables:**
- users, jobs, applications
- cv_entries, skills, reviews
- conversations, messages
- achievements, job_photos

**Storage:**
- job-photos bucket (5MB)

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md#database-schema) for details.

---

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

---

## Troubleshooting

**"Failed to fetch":** Check `.env.local`, restart server

**"RLS policy error":** Run `01_init_schema.sql`

**"Job not found":** Run migrations, seed data

More help: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md#common-issues)

---

## Roadmap

**High Priority:**
- Migrate chat to Supabase + Realtime
- Add geocoding
- Image optimization
- Enhanced statistics

**Medium:**
- Email notifications
- Push notifications
- Vipps payments
- Advanced filters

**Nice to Have:**
- Dark mode
- Language switcher
- Export CV as PDF
- Job recommendations

---

## Contributing

1. Fork repository
2. Create branch (`git checkout -b feature/name`)
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/name`)
5. Open Pull Request

---

## Acknowledgments

Special thanks to **Ayanle** and **Alexander** for their invaluable help with database design and implementation.

---

## License

MIT License - Educational prototype

(c) 2025 Denys Koval

---

## Support

- GitHub Issues
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Supabase Dashboard logs

---

**Built with love in Norway**
