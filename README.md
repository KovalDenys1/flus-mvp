# FLUS — Local Job Marketplace MVP# FLUS — MVP Platform



**FLUS** is a Norwegian job platform connecting employers with workers for small local tasks and gigs. Built with Next.js 15, Supabase, and Vipps OAuth authentication.**FLUS** is a Norwegian job platform MVP connecting employers with workers for small local tasks. Built with Next.js 15, Supabase (PostgreSQL), and real Vipps OAuth authentication.



## 🚀 Features## Features



### For Workers### For Workers (Jobbsøker)

- 🔍 Browse jobs by category, location, and keywords- Browse jobs by category, location, keywords

- ✉️ Apply to jobs with one click- Apply with cover message

- 💬 Real-time chat with employers- Chat with employers

- 📊 Track your application status- Track achievements and progress

- 👤 Create professional profile with CV and skills- View application status

- ⭐ Build reputation through reviews and ratings- Profile with CV, skills, reviews

- 📧 Email notifications for application updates- **Email notifications** for application status updates



### For Employers### For Employers (Arbeidsgiver)

- ➕ Create and manage job postings- Create jobs with requirements

- 📋 Review applications from workers- Manage posted jobs

- 💬 Chat with applicants in real-time- Chat with applicants

- 📊 View business statistics- View statistics

- ⭐ Receive and give reviews- Company profile and reviews

- 📧 Email notifications for new applications- **Email notifications** for new applications



### Platform Features### Job Features

- 🔐 Secure authentication via Vipps OAuth- Flexible scheduling (anytime/fixed/deadline)

- 📱 Fully responsive design- Location support with maps

- 🌍 Location-based job search with radius filter- Payment options (fixed/hourly)

- 📅 Flexible scheduling (anytime/fixed/deadline)- Photo uploads

- 💰 Multiple payment options (fixed price/hourly rate)- Job categories

- 📸 Photo upload support for jobs

- 🎯 Achievement system### Communication & Notifications

- 📧 Automated email notifications- **Real-time chat** between employers and workers

- **Email notifications** for:

## 🛠️ Tech Stack  - New job applications (to employers)

  - Application status changes (to workers)

- **Framework:** Next.js 15.5.4 with App Router & Turbopack  - Welcome emails upon registration

- **Database:** Supabase (PostgreSQL + Storage)- **Persistent conversations** with Supabase storage

- **Authentication:** Vipps OAuth 2.0

- **Styling:** Tailwind CSS 4.0## Tech Stack

- **UI Components:** Radix UI + shadcn/ui

- **Language:** TypeScript- **Framework**: Next.js 15.5.4 (App Router, Turbopack)

- **Email:** Nodemailer with SMTP- **Database**: Supabase (PostgreSQL, Storage, RLS)

- **State Management:** React Hooks- **Auth**: Vipps OAuth (Login API)

- **Session Management:** HTTP-only cookies- **Styling**: Tailwind CSS 4.0

- **UI**: Radix UI

## 📋 Prerequisites- **Language**: TypeScript

- **Sessions**: HTTP-only cookies

- Node.js 18+ and npm

- Supabase account## Quick Start

- Vipps developer account (for OAuth)

- Gmail account (for email notifications)### 1. Clone & Install



## 🚀 Quick Start```bash

git clone https://github.com/KovalDenys1/flus-mvp.git

### 1. Clone and Installcd flus-mvp

npm install

```bash```

git clone https://github.com/KovalDenys1/flus-mvp.git

cd flus-mvp### 2. Supabase Setup

npm install

```1. Create Supabase project at [supabase.com](https://supabase.com)

2. Run the SQL migration in `supabase/migrations/01_init_schema.sql`

### 2. Database Setup3. Create `job-photos` storage bucket (Public: YES, 5MB limit)

4. Run `supabase/migrations/02_storage_policies.sql`

1. Create a new project at [supabase.com](https://supabase.com)

### 3. Environment Variables

2. Run migrations in order in Supabase SQL Editor:

   ```Create `.env.local`:

   supabase/migrations/01_minimal_schema.sql

   supabase/migrations/02_minimal_storage.sql```env

   supabase/migrations/03_add_birth_year.sql# Supabase

   supabase/migrations/04_update_users_table.sqlNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

   supabase/migrations/05_add_support_tickets.sqlNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   supabase/migrations/06_add_initial_photos.sqlSUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   ```

# Vipps OAuth

3. Create storage bucket:VIPPS_CLIENT_ID=your-client-id

   - Navigate to Storage in Supabase DashboardVIPPS_CLIENT_SECRET=your-client-secret

   - Create bucket named `job-photos`VIPPS_SUBSCRIPTION_KEY=your-subscription-key

   - Make it **Public**VIPPS_MERCHANT_SERIAL_NUMBER=your-msn

   - Set file size limit to **5MB**VIPPS_REDIRECT_URI=https://your-domain.com/api/auth/vipps/callback



### 3. Environment Configuration# Email Configuration (SMTP)

SMTP_HOST=smtp.gmail.com

Create `.env.local` file (see `.env.example` for reference):SMTP_PORT=587

SMTP_SECURE=false

```envSMTP_USER=your_email@gmail.com

# SupabaseSMTP_PASS=your_app_password

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.coNEXT_PUBLIC_APP_URL=https://your-domain.com

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key```

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

### 4. Email Setup (Optional)

# Application

NEXT_PUBLIC_APP_URL=http://localhost:3000For email notifications, configure SMTP in `.env.local`. Uses Gmail by default:



# Vipps OAuth1. Enable 2FA on Gmail

VIPPS_CLIENT_ID=your-client-id2. Generate App Password: https://myaccount.google.com/apppasswords

VIPPS_CLIENT_SECRET=your-client-secret3. Use App Password as `SMTP_PASS`

VIPPS_SUBSCRIPTION_KEY=your-subscription-key

VIPPS_SUBSCRIPTION_KEY_SECONDARY=your-secondary-key### 5. Run

VIPPS_MERCHANT_SERIAL_NUMBER=your-msn

VIPPS_API_BASE_URL=https://apitest.vipps.no```bash

VIPPS_REDIRECT_URI=http://localhost:3000/api/auth/vipps/callbacknpm run dev

```

# Email (SMTP)

SMTP_HOST=smtp.gmail.comOpen http://localhost:3000

SMTP_PORT=587

SMTP_SECURE=false## ✅ Features Implemented

SMTP_USER=your-email@gmail.com

SMTP_PASS=your-app-password**Complete:**

```- ✅ Jobs CRUD with Supabase

- ✅ Job applications

### 4. Email Setup (Optional)- ✅ Vipps OAuth authentication

- ✅ Dual profiles (worker/employer)

To enable email notifications:- ✅ CV system (experience, skills)

- ✅ Reviews and ratings

1. Enable 2-Factor Authentication on your Gmail account- ✅ Photo uploads (Supabase Storage)

2. Generate App Password: https://myaccount.google.com/apppasswords- ✅ Real-time profile sync

3. Use the generated password as `SMTP_PASS`- ✅ **Persistent chat system** with Supabase

- ✅ **Email notifications** (applications, status updates, welcome)

### 5. Run Development Server- ✅ **E2E testing** with Playwright

- ✅ Responsive design

```bash

npm run dev**Partial/Demo:**

```- ⚠️ Chat (now persistent with database)

- ⚠️ Statistics (basic)

Open [http://localhost:3000](http://localhost:3000) in your browser.- ⚠️ Achievements (demo data)



### 6. Build for Production## API Routes



```bash**Authentication:**

npm run build- `GET /api/auth/vipps/start` - OAuth start

npm start- `GET /api/auth/vipps/callback` - OAuth callback

```- `GET /api/auth/me` - Current user

- `POST /api/auth/logout` - Logout

## 📁 Project Structure

**Jobs:**

```- `GET /api/jobs` - List jobs

flus-mvp/- `POST /api/jobs` - Create job

├── src/- `GET /api/jobs/[id]` - Job details

│   ├── app/                    # Next.js App Router- `GET /api/my-jobs` - User's jobs

│   │   ├── api/               # API routes

│   │   ├── jobber/            # Job listings**Applications:**

│   │   ├── profil/            # User profiles- `GET /api/applications` - User applications

│   │   ├── mine-jobber/       # Employer's jobs- `POST /api/applications` - Apply

│   │   ├── mine-soknader/     # Worker's applications

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
