# FLUS — Local Job Marketplace MVP# FLUS — Local Job Marketplace MVP# FLUS — Local Job Marketplace MVP# FLUS — MVP Platform



**FLUS** is a Norwegian job platform connecting employers with workers for small local tasks and gigs. Built with Next.js 15, Supabase, and Vipps OAuth authentication.



## 🚀 Features**FLUS** is a Norwegian job platform connecting employers with workers for small local tasks and gigs. Built with Next.js 15, Supabase, and Vipps OAuth authentication.



### For Workers (Jobbsøker)

- 🔍 Browse jobs by category, location, and keywords

- ✉️ Apply to jobs with one click## 🚀 Features**FLUS** is a Norwegian job platform connecting employers with workers for small local tasks and gigs. Built with Next.js 15, Supabase, and Vipps OAuth authentication.**FLUS** is a Norwegian job platform MVP connecting employers with workers for small local tasks. Built with Next.js 15, Supabase (PostgreSQL), and real Vipps OAuth authentication.

- 💬 Real-time chat with employers

- 📊 Track your application status

- 👤 Create professional profile with CV and skills

- ⭐ Build reputation through reviews and ratings### For Workers (Jobbsøker)

- 📧 Email notifications for application updates

- 🔍 Browse jobs by category, location, and keywords

### For Employers (Arbeidsgiver)

- ➕ Create and manage job postings- ✉️ Apply to jobs with one click## 🚀 Features## Features

- 📋 Review applications from workers

- 💬 Chat with applicants in real-time- 💬 Real-time chat with employers

- 📊 View business statistics

- ⭐ Receive and give reviews- 📊 Track your application status

- 📧 Email notifications for new applications

- 👤 Create professional profile with CV and skills

### Platform Features

- 🔐 Secure authentication via Vipps OAuth- ⭐ Build reputation through reviews and ratings### For Workers### For Workers (Jobbsøker)

- 📱 Fully responsive design

- 🌍 Location-based job search with address autocomplete (powered by Google Places API)- 📧 Email notifications for application updates

- 📅 Flexible scheduling (anytime/fixed/deadline)

- 💰 Multiple payment options (fixed price/hourly rate)- 🔍 Browse jobs by category, location, and keywords- Browse jobs by category, location, keywords

- 📸 Photo upload support for jobs

- 🎯 Achievement system### For Employers (Arbeidsgiver)

- 📧 Automated email notifications

- 👑 Admin dashboard for platform management- ➕ Create and manage job postings- ✉️ Apply to jobs with one click- Apply with cover message



## 🛠️ Tech Stack- 📋 Review applications from workers



- **Framework:** Next.js 15.5.4 with App Router & Turbopack- 💬 Chat with applicants in real-time- 💬 Real-time chat with employers- Chat with employers

- **Database:** Supabase (PostgreSQL + Storage)

- **Authentication:** Vipps OAuth 2.0- 📊 View business statistics

- **Styling:** Tailwind CSS 4.0

- **UI Components:** Radix UI + shadcn/ui- ⭐ Receive and give reviews- 📊 Track your application status- Track achievements and progress

- **Language:** TypeScript

- **Email:** Nodemailer with SMTP- 📧 Email notifications for new applications

- **State Management:** React Hooks

- **Session Management:** HTTP-only cookies- 👤 Create professional profile with CV and skills- View application status

- **Address Search:** Google Places API

### Platform Features

## 📋 Prerequisites

- 🔐 Secure authentication via Vipps OAuth- ⭐ Build reputation through reviews and ratings- Profile with CV, skills, reviews

- Node.js 18+ and npm

- Supabase account- 📱 Fully responsive design

- Vipps developer account (for OAuth)

- Gmail account (for email notifications)- 🌍 Location-based job search with radius filter- 📧 Email notifications for application updates- **Email notifications** for application status updates

- Google Cloud Platform account (for Places API)

- 📅 Flexible scheduling (anytime/fixed/deadline)

## 🚀 Quick Start

- 💰 Multiple payment options (fixed price/hourly rate)

### 1. Clone and Install

- 📸 Photo upload support for jobs

```bash

git clone https://github.com/KovalDenys1/flus-mvp.git- 🎯 Achievement system### For Employers### For Employers (Arbeidsgiver)

cd flus-mvp

npm install- 📧 Automated email notifications

```

- ➕ Create and manage job postings- Create jobs with requirements

### 2. Database Setup

## 🛠️ Tech Stack

1. Create a new project at [supabase.com](https://supabase.com)

2. Run migrations in order in Supabase SQL Editor:- **Framework:** Next.js 15.5.4 with App Router & Turbopack- 📋 Review applications from workers- Manage posted jobs

   - `supabase/migrations/01_minimal_schema.sql`

   - `supabase/migrations/02_minimal_storage.sql`- **Database:** Supabase (PostgreSQL + Storage)

   - `supabase/migrations/03_add_birth_year.sql`

   - `supabase/migrations/04_update_users_table.sql`- **Authentication:** Vipps OAuth 2.0- 💬 Chat with applicants in real-time- Chat with applicants

   - `supabase/migrations/05_add_support_tickets.sql`

   - `supabase/migrations/06_add_initial_photos.sql`- **Styling:** Tailwind CSS 4.0

   - `supabase/migrations/07_add_addresses_table.sql`

   - `supabase/migrations/07_add_admin_role.sql`- **UI Components:** Radix UI + shadcn/ui- 📊 View business statistics- View statistics

   - `supabase/migrations/08_enable_realtime.sql`

- **Language:** TypeScript

3. Create storage bucket:

   - Navigate to Storage in Supabase Dashboard- **Email:** Nodemailer with SMTP- ⭐ Receive and give reviews- Company profile and reviews

   - Create bucket named `job-photos`

   - Make it **Public**- **State Management:** React Hooks

   - Set file size limit to **5MB**

- **Session Management:** HTTP-only cookies- 📧 Email notifications for new applications- **Email notifications** for new applications

### 3. Environment Configuration



Create `.env.local` file (see `.env.example` for reference):

## 📋 Prerequisites

```env

# Supabase- Node.js 18+ and npm

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# FLUS — Local Job Marketplace MVP

**FLUS** is a Norwegian job platform connecting employers with workers for small local tasks and gigs. Built with Next.js 15, Supabase, and Vipps OAuth authentication.

---

## 🚀 Features

### For Workers (Jobbsøker)
- Browse jobs by category, location, and keywords
- Apply to jobs with one click
- Real-time chat with employers
- Track your application status
- Create professional profile with CV and skills
- Build reputation through reviews and ratings
- Email notifications for application updates

### For Employers (Arbeidsgiver)
- Create and manage job postings
- Review applications from workers
- Chat with applicants in real-time
- View business statistics
- Receive and give reviews
- Email notifications for new applications

### Platform Features
- Secure authentication via Vipps OAuth
- Fully responsive design
- Location-based job search with address autocomplete (Google Places API)
- Flexible scheduling (anytime/fixed/deadline)
- Multiple payment options (fixed price/hourly rate)
- Photo upload support for jobs
- Achievement system
- Admin dashboard for platform management

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15.5.4 (App Router, Turbopack)
- **Database:** Supabase (PostgreSQL + Storage)
- **Authentication:** Vipps OAuth 2.0
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Radix UI + shadcn/ui
- **Language:** TypeScript
- **Email:** Nodemailer with SMTP
- **State Management:** React Hooks
- **Session Management:** HTTP-only cookies
- **Address Search:** Google Places API

---

## 📋 Prerequisites
- Node.js 18+
- npm
- Supabase account
- Vipps developer account (for OAuth)
- Gmail account (for email notifications)
- Google Cloud Platform account (for Places API)

---

## 🚀 Quick Start
### 1. Clone and Install
```bash
git clone https://github.com/KovalDenys1/flus-mvp.git
cd flus-mvp
npm install
```

### 2. Database Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Run migrations in order in Supabase SQL Editor:
   - `supabase/migrations/01_init_schema.sql`
   - `supabase/migrations/02_storage_policies.sql`
   - `supabase/migrations/03_seed_demo_jobs.sql`
   - `supabase/migrations/04_add_birth_year.sql`
3. Create storage bucket:
   - Navigate to Storage in Supabase Dashboard
   - Create bucket named `job-photos` (Public, 5MB limit)

### 3. Environment Configuration
Create `.env.local` file (see `.env.example` for reference):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Vipps OAuth
VIPPS_CLIENT_ID=your-client-id
VIPPS_CLIENT_SECRET=your-client-secret
VIPPS_SUBSCRIPTION_KEY=your-subscription-key
VIPPS_MERCHANT_SERIAL_NUMBER=your-msn
VIPPS_API_BASE_URL=https://apitest.vipps.no
VIPPS_REDIRECT_URI=http://localhost:3000/api/auth/vipps/callback
# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
# Google Places API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. Email Setup (Optional)
To enable email notifications:
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password as `SMTP_PASS`

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Key API Routes
### Authentication
- `GET /api/auth/vipps/start` - Initiate Vipps OAuth flow
- `GET /api/auth/vipps/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[id]` - Get job details
- `DELETE /api/jobs/[id]` - Delete job
- `GET /api/my-jobs` - Get user's jobs

### Applications
- `GET /api/applications` - Get user's applications
- `POST /api/applications` - Submit job application
- `PATCH /api/applications` - Update application status

### Profile & CV
- `GET /api/profile` - Get user profile
- `POST /api/profile/update` - Update profile
- `GET /api/profile/stats` - Get user statistics
- `GET /api/cv` - Get CV entries
- `POST /api/cv` - Add CV entry
- `DELETE /api/cv` - Remove CV entry

### Chat
- `GET /api/conversations` - List conversations
- `GET /api/conversations/[id]/messages` - Get messages
- `POST /api/conversations/[id]/messages` - Send message

---

## 🐛 Troubleshooting
- **Failed to fetch:** Check `.env.local`, restart server
- **Vipps OAuth not working:** Verify redirect URI, credentials, API base URL
- **Email not sending:** Check Gmail App Password, SMTP config, 2FA
- **Database errors:** Run all migrations, check RLS policies, service role key
- **Images not uploading:** Ensure `job-photos` bucket exists, is public, file < 5MB
- **Address autocomplete not working:** Check Google Maps API key, Places API enabled

---

## 🚢 Deployment
### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Production Environment Variables
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `VIPPS_API_BASE_URL` - Change to `https://api.vipps.no`
- `VIPPS_REDIRECT_URI` - Update to production callback URL
- All Supabase credentials
- SMTP credentials
- Google Maps API key

---

## ✅ Production Release Checklist
- [ ] Lockfile (`package-lock.json` or `pnpm-lock.yaml`) is present and committed
- [ ] All migrations applied in Supabase
- [ ] All environment variables set in Vercel/production
- [ ] SMTP and OAuth credentials tested
- [ ] `npm run build` and `npm run lint` pass without errors
- [ ] E2E tests (Playwright) pass
- [ ] `.env.local` and secrets are NOT in git
- [ ] README is up to date
- [ ] CI/CD workflow (build, lint, test) is configured

---

## 👨‍💻 Author
Denys Koval - [GitHub](https://github.com/KovalDenys1)

## 🙏 Acknowledgments
- Built with Next.js and Supabase
- UI components from shadcn/ui
- Icons from Lucide React
- Authentication via Vipps

---

**Made with ❤️ in Norway**

- Check SMTP configuration

- Ensure 2FA is enabled on Gmail```- ⚠️ Chat (now persistent with database)



**Database errors:**- ⚠️ Statistics (basic)

- Run all migrations in correct order

- Check RLS policies are enabledOpen [http://localhost:3000](http://localhost:3000) in your browser.- ⚠️ Achievements (demo data)

- Verify service role key has admin access



**Images not uploading:**

- Ensure `job-photos` bucket exists### 6. Build for Production## API Routes

- Check bucket is set to public

- Verify file size is under 5MB



## 🚢 Deployment```bash**Authentication:**



### Vercel (Recommended)npm run build- `GET /api/auth/vipps/start` - OAuth start

1. Push code to GitHub

2. Import project in Vercelnpm start- `GET /api/auth/vipps/callback` - OAuth callback

3. Add environment variables

4. Deploy```- `GET /api/auth/me` - Current user



### Environment Variables for Production- `POST /api/auth/logout` - Logout

Make sure to update these for production:

- `NEXT_PUBLIC_APP_URL` - Your production domain## 📁 Project Structure

- `VIPPS_API_BASE_URL` - Change to `https://api.vipps.no`

- `VIPPS_REDIRECT_URI` - Update to production callback URL**Jobs:**

- All Supabase credentials

- SMTP credentials```- `GET /api/jobs` - List jobs



## 📄 Licenseflus-mvp/- `POST /api/jobs` - Create job

MIT License - See LICENSE file for details

├── src/- `GET /api/jobs/[id]` - Job details

## 👨‍💻 Author

Denys Koval - [GitHub](https://github.com/KovalDenys1)│   ├── app/                    # Next.js App Router- `GET /api/my-jobs` - User's jobs



## 🙏 Acknowledgments│   │   ├── api/               # API routes

- Built with Next.js and Supabase

- UI components from shadcn/ui│   │   ├── jobber/            # Job listings**Applications:**

- Icons from Lucide React

- Authentication via Vipps│   │   ├── profil/            # User profiles- `GET /api/applications` - User applications



---│   │   ├── mine-jobber/       # Employer's jobs- `POST /api/applications` - Apply



**Made with ❤️ in Norway**│   │   ├── mine-soknader/     # Worker's applications

│   │   ├── samtaler/          # Chat interface**Profile:**

│   │   └── ...- `GET /api/profile/stats` - Statistics

│   ├── components/            # React components- `POST /api/profile/update` - Update

│   │   ├── ui/               # UI primitives- `GET /api/profile/reviews` - Reviews

│   │   └── ...

│   └── lib/                   # Utilities & helpers**CV:**

│       ├── data/             # Data layer- `GET /api/cv` - Get CV

│       ├── supabase/         # Supabase client- `POST /api/cv` - Add entry

│       ├── vipps/            # Vipps integration- `DELETE /api/cv` - Remove

│       └── utils/            # Helper functions

├── supabase/## Role System

│   └── migrations/           # Database migrations

└── public/                   # Static assetsSwitch modes with navbar toggle:

```

**Worker:** Browse jobs, apply, CV, achievements  

## 🔑 Key API Routes**Employer:** Create jobs, view applicants, statistics



### AuthenticationReal-time sync - profile updates instantly when switching!

- `GET /api/auth/vipps/start` - Initiate Vipps OAuth flow

- `GET /api/auth/vipps/callback` - OAuth callback handler## Database

- `GET /api/auth/me` - Get current user

- `POST /api/auth/logout` - Logout user**Tables:**

- users, jobs, applications

### Jobs- cv_entries, skills, reviews

- `GET /api/jobs` - List all jobs (with filters)- conversations, messages

- `POST /api/jobs` - Create new job- achievements, job_photos

- `GET /api/jobs/[id]` - Get job details

- `DELETE /api/jobs/[id]` - Delete job**Storage:**

- `GET /api/my-jobs` - Get user's jobs- job-photos bucket (5MB)



### Applications## Project Structure

- `GET /api/applications` - Get user's applications

- `POST /api/applications` - Submit job application```

- `PATCH /api/applications` - Update application statusflus-mvp/

├── src/

### Profile & CV│   ├── app/

- `GET /api/profile` - Get user profile│   │   ├── api/           # API routes

- `POST /api/profile/update` - Update profile│   │   ├── jobber/        # Jobs

- `GET /api/profile/stats` - Get user statistics│   │   ├── profil/        # Profiles

- `GET /api/cv` - Get CV entries│   │   └── ...

- `POST /api/cv` - Add CV entry│   ├── components/        # React components

│   └── lib/              # Utils, data, Vipps

### Chat├── supabase/

- `GET /api/conversations` - List conversations│   └── migrations/       # DB migrations

- `GET /api/conversations/[id]/messages` - Get messages└── .env.local

- `POST /api/conversations/[id]/messages` - Send message```



## 🎯 Features Overview## Troubleshooting



### Dual Role System**"Failed to fetch":** Check `.env.local`, restart server

Users can switch between **Worker** and **Employer** modes:

- **Worker Mode:** Browse jobs, apply, manage applications, view CV**"RLS policy error":** Run database migrations

- **Employer Mode:** Post jobs, review applications, hire workers

- Seamless role switching via navbar toggle**"Job not found":** Check database setup and migrations



### Real-Time Chat## License

- Persistent conversations stored in Supabase

- Photo sharing supportMIT License - Educational prototype

- Work completion flow with before/after photos

- System notifications for work status changes(c) 2025 Denys Koval



### Job Management## Support

- Create jobs with detailed requirements

- Set flexible or fixed schedules- GitHub Issues

- Choose payment type (fixed/hourly)- Supabase Dashboard logs

- Upload photos for context

- Track job status (open/assigned/completed)---



### Application System**Built with love in Norway**

- One-click applications
- Track application status
- Email notifications for updates
- Employer can review and accept/reject

### Profile & CV
- Build professional worker profile
- Add work experience and skills
- Display reviews and ratings
- Generate PDF CV
- Track achievements and statistics

## 🔧 Configuration

### Vipps Setup
1. Register at [Vipps Developer Portal](https://vipps.no/developer)
2. Create test app for development
3. Get credentials and add to `.env.local`
4. For production, switch to production API URL

### Database Schema
The database includes these main tables:
- `users` - User accounts with roles
- `jobs` - Job postings
- `applications` - Job applications
- `conversations` - Chat conversations
- `messages` - Chat messages
- `cv_entries` - Work experience
- `skills` - User skills
- `reviews` - User reviews and ratings

## 🐛 Troubleshooting

**"Failed to fetch" errors:**
- Check that `.env.local` is properly configured
- Verify Supabase URL and keys
- Restart development server

**Vipps OAuth not working:**
- Verify redirect URI matches exactly
- Check Vipps credentials
- For production, update API base URL

**Email not sending:**
- Verify Gmail App Password is correct
- Check SMTP configuration
- Ensure 2FA is enabled on Gmail

**Database errors:**
- Run all migrations in correct order
- Check RLS policies are enabled
- Verify service role key has admin access

**Images not uploading:**
- Ensure `job-photos` bucket exists
- Check bucket is set to public
- Verify file size is under 5MB

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
Make sure to update these for production:
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `VIPPS_API_BASE_URL` - Change to `https://api.vipps.no`
- `VIPPS_REDIRECT_URI` - Update to production callback URL
- All Supabase credentials
- SMTP credentials

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Denys Koval - [GitHub](https://github.com/KovalDenys1)

## 🙏 Acknowledgments

- Built with Next.js and Supabase
- UI components from shadcn/ui
- Icons from Lucide React
- Authentication via Vipps

---

**Made with ❤️ in Norway**
