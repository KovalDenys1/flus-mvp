# FLUS — Local Job Marketplace MVP# FLUS — Local Job Marketplace MVP# FLUS — MVP Platform



**FLUS** is a Norwegian job platform connecting employers with workers for small local tasks and gigs. Built with Next.js 15, Supabase, and Vipps OAuth authentication.



## 🚀 Features**FLUS** is a Norwegian job platform connecting employers with workers for small local tasks and gigs. Built with Next.js 15, Supabase, and Vipps OAuth authentication.**FLUS** is a Norwegian job platform MVP connecting employers with workers for small local tasks. Built with Next.js 15, Supabase (PostgreSQL), and real Vipps OAuth authentication.



### For Workers (Jobbsøker)

- 🔍 Browse jobs by category, location, and keywords

- ✉️ Apply to jobs with one click## 🚀 Features## Features

- 💬 Real-time chat with employers

- 📊 Track your application status

- 👤 Create professional profile with CV and skills

- ⭐ Build reputation through reviews and ratings### For Workers### For Workers (Jobbsøker)

- 📧 Email notifications for application updates

- 🔍 Browse jobs by category, location, and keywords- Browse jobs by category, location, keywords

### For Employers (Arbeidsgiver)

- ➕ Create and manage job postings- ✉️ Apply to jobs with one click- Apply with cover message

- 📋 Review applications from workers

- 💬 Chat with applicants in real-time- 💬 Real-time chat with employers- Chat with employers

- 📊 View business statistics

- ⭐ Receive and give reviews- 📊 Track your application status- Track achievements and progress

- 📧 Email notifications for new applications

- 👤 Create professional profile with CV and skills- View application status

### Platform Features

- 🔐 Secure authentication via Vipps OAuth- ⭐ Build reputation through reviews and ratings- Profile with CV, skills, reviews

- 📱 Fully responsive design

- 🌍 Location-based job search with radius filter- 📧 Email notifications for application updates- **Email notifications** for application status updates

- 📅 Flexible scheduling (anytime/fixed/deadline)

- 💰 Multiple payment options (fixed price/hourly rate)

- 📸 Photo upload support for jobs

- 🎯 Achievement system### For Employers### For Employers (Arbeidsgiver)

- 📧 Automated email notifications

- ➕ Create and manage job postings- Create jobs with requirements

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 with App Router & Turbopack- 📋 Review applications from workers- Manage posted jobs

- **Database:** Supabase (PostgreSQL + Storage)

- **Authentication:** Vipps OAuth 2.0- 💬 Chat with applicants in real-time- Chat with applicants

- **Styling:** Tailwind CSS 4.0

- **UI Components:** Radix UI + shadcn/ui- 📊 View business statistics- View statistics

- **Language:** TypeScript

- **Email:** Nodemailer with SMTP- ⭐ Receive and give reviews- Company profile and reviews

- **State Management:** React Hooks

- **Session Management:** HTTP-only cookies- 📧 Email notifications for new applications- **Email notifications** for new applications



## 📋 Prerequisites

- Node.js 18+ and npm

- Supabase account### Platform Features### Job Features

- Vipps developer account (for OAuth)

- Gmail account (for email notifications)- 🔐 Secure authentication via Vipps OAuth- Flexible scheduling (anytime/fixed/deadline)



## 🚀 Quick Start- 📱 Fully responsive design- Location support with maps



### 1. Clone and Install- 🌍 Location-based job search with radius filter- Payment options (fixed/hourly)

```bash

git clone https://github.com/KovalDenys1/flus-mvp.git- 📅 Flexible scheduling (anytime/fixed/deadline)- Photo uploads

cd flus-mvp

npm install- 💰 Multiple payment options (fixed price/hourly rate)- Job categories

```

- 📸 Photo upload support for jobs

### 2. Database Setup

1. Create a new project at [supabase.com](https://supabase.com)- 🎯 Achievement system### Communication & Notifications

2. Run migrations in order in Supabase SQL Editor:

   - `supabase/migrations/01_minimal_schema.sql`- 📧 Automated email notifications- **Real-time chat** between employers and workers

   - `supabase/migrations/02_minimal_storage.sql`

   - `supabase/migrations/03_add_birth_year.sql`- **Email notifications** for:

   - `supabase/migrations/04_update_users_table.sql`

   - `supabase/migrations/05_add_support_tickets.sql`## 🛠️ Tech Stack  - New job applications (to employers)

   - `supabase/migrations/06_add_initial_photos.sql`

   - `supabase/migrations/07_add_addresses_table.sql`  - Application status changes (to workers)

   - `supabase/migrations/07_add_admin_role.sql`

   - `supabase/migrations/08_enable_realtime.sql`- **Framework:** Next.js 15.5.4 with App Router & Turbopack  - Welcome emails upon registration



3. Create storage bucket:- **Database:** Supabase (PostgreSQL + Storage)- **Persistent conversations** with Supabase storage

   - Navigate to Storage in Supabase Dashboard

   - Create bucket named `job-photos`- **Authentication:** Vipps OAuth 2.0

   - Make it **Public**

   - Set file size limit to **5MB**- **Styling:** Tailwind CSS 4.0## Tech Stack



### 3. Environment Configuration- **UI Components:** Radix UI + shadcn/ui

Create `.env.local` file (see `.env.example` for reference):

- **Language:** TypeScript- **Framework**: Next.js 15.5.4 (App Router, Turbopack)

```env

# Supabase- **Email:** Nodemailer with SMTP- **Database**: Supabase (PostgreSQL, Storage, RLS)

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key- **State Management:** React Hooks- **Auth**: Vipps OAuth (Login API)

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

- **Session Management:** HTTP-only cookies- **Styling**: Tailwind CSS 4.0

# Application

NEXT_PUBLIC_APP_URL=http://localhost:3000- **UI**: Radix UI



# Vipps OAuth## 📋 Prerequisites- **Language**: TypeScript

VIPPS_CLIENT_ID=your-client-id

VIPPS_CLIENT_SECRET=your-client-secret- **Sessions**: HTTP-only cookies

VIPPS_SUBSCRIPTION_KEY=your-subscription-key

VIPPS_SUBSCRIPTION_KEY_SECONDARY=your-secondary-key- Node.js 18+ and npm

VIPPS_MERCHANT_SERIAL_NUMBER=your-msn

VIPPS_API_BASE_URL=https://apitest.vipps.no- Supabase account## Quick Start

VIPPS_REDIRECT_URI=http://localhost:3000/api/auth/vipps/callback

- Vipps developer account (for OAuth)

# Email Configuration (SMTP)

SMTP_HOST=smtp.gmail.com- Gmail account (for email notifications)### 1. Clone & Install

SMTP_PORT=587

SMTP_SECURE=false

SMTP_USER=your-email@gmail.com

SMTP_PASS=your-app-password## 🚀 Quick Start```bash

```

git clone https://github.com/KovalDenys1/flus-mvp.git

### 4. Email Setup (Optional)

To enable email notifications:### 1. Clone and Installcd flus-mvp

1. Enable 2-Factor Authentication on your Gmail account

2. Generate App Password: https://myaccount.google.com/apppasswordsnpm install

3. Use the generated password as `SMTP_PASS`

```bash```

### 5. Run Development Server

```bashgit clone https://github.com/KovalDenys1/flus-mvp.git

npm run dev

```cd flus-mvp### 2. Supabase Setup



Open [http://localhost:3000](http://localhost:3000) in your browser.npm install



## 📁 Project Structure```1. Create Supabase project at [supabase.com](https://supabase.com)



```2. Run the SQL migration in `supabase/migrations/01_init_schema.sql`

flus-mvp/

├── src/### 2. Database Setup3. Create `job-photos` storage bucket (Public: YES, 5MB limit)

│   ├── app/                    # Next.js App Router

│   │   ├── api/               # API routes4. Run `supabase/migrations/02_storage_policies.sql`

│   │   ├── jobber/            # Job listings

│   │   ├── profil/            # User profiles1. Create a new project at [supabase.com](https://supabase.com)

│   │   ├── mine-jobber/       # Employer's jobs

│   │   ├── mine-soknader/     # Worker's applications### 3. Environment Variables

│   │   ├── samtaler/          # Chat interface

│   │   └── ...2. Run migrations in order in Supabase SQL Editor:

│   ├── components/            # React components

│   │   ├── ui/               # UI primitives   ```Create `.env.local`:

│   │   └── ...

│   └── lib/                   # Utilities & helpers   supabase/migrations/01_minimal_schema.sql

│       ├── data/             # Data layer

│       ├── supabase/         # Supabase client   supabase/migrations/02_minimal_storage.sql```env

│       ├── vipps/            # Vipps integration

│       └── utils/            # Helper functions   supabase/migrations/03_add_birth_year.sql# Supabase

├── supabase/

│   └── migrations/           # Database migrations   supabase/migrations/04_update_users_table.sqlNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

├── scripts/

│   └── populate-addresses.js # Address population script   supabase/migrations/05_add_support_tickets.sqlNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

└── public/                   # Static assets

```   supabase/migrations/06_add_initial_photos.sqlSUPABASE_SERVICE_ROLE_KEY=your-service-role-key



## 🔑 Key API Routes   ```



### Authentication# Vipps OAuth

- `GET /api/auth/vipps/start` - Initiate Vipps OAuth flow

- `GET /api/auth/vipps/callback` - OAuth callback handler3. Create storage bucket:VIPPS_CLIENT_ID=your-client-id

- `GET /api/auth/me` - Get current user

- `POST /api/auth/logout` - Logout user   - Navigate to Storage in Supabase DashboardVIPPS_CLIENT_SECRET=your-client-secret



### Jobs   - Create bucket named `job-photos`VIPPS_SUBSCRIPTION_KEY=your-subscription-key

- `GET /api/jobs` - List all jobs (with filters)

- `POST /api/jobs` - Create new job   - Make it **Public**VIPPS_MERCHANT_SERIAL_NUMBER=your-msn

- `GET /api/jobs/[id]` - Get job details

- `DELETE /api/jobs/[id]` - Delete job   - Set file size limit to **5MB**VIPPS_REDIRECT_URI=https://your-domain.com/api/auth/vipps/callback

- `GET /api/my-jobs` - Get user's jobs



### Applications

- `GET /api/applications` - Get user's applications### 3. Environment Configuration# Email Configuration (SMTP)

- `POST /api/applications` - Submit job application

- `PATCH /api/applications` - Update application statusSMTP_HOST=smtp.gmail.com



### Profile & CVCreate `.env.local` file (see `.env.example` for reference):SMTP_PORT=587

- `GET /api/profile` - Get user profile

- `POST /api/profile/update` - Update profileSMTP_SECURE=false

- `GET /api/profile/stats` - Get user statistics

- `GET /api/cv` - Get CV entries```envSMTP_USER=your_email@gmail.com

- `POST /api/cv` - Add CV entry

- `DELETE /api/cv` - Remove CV entry# SupabaseSMTP_PASS=your_app_password



### ChatNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.coNEXT_PUBLIC_APP_URL=https://your-domain.com

- `GET /api/conversations` - List conversations

- `GET /api/conversations/[id]/messages` - Get messagesNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key```

- `POST /api/conversations/[id]/messages` - Send message

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

## 🎯 Features Overview

### 4. Email Setup (Optional)

### Dual Role System

Users can switch between **Worker** and **Employer** modes:# Application

- **Worker Mode:** Browse jobs, apply, manage applications, view CV

- **Employer Mode:** Post jobs, review applications, hire workersNEXT_PUBLIC_APP_URL=http://localhost:3000For email notifications, configure SMTP in `.env.local`. Uses Gmail by default:

- Seamless role switching via navbar toggle



### Real-Time Chat

- Persistent conversations stored in Supabase# Vipps OAuth1. Enable 2FA on Gmail

- Photo sharing support

- Work completion flow with before/after photosVIPPS_CLIENT_ID=your-client-id2. Generate App Password: https://myaccount.google.com/apppasswords

- System notifications for work status changes

VIPPS_CLIENT_SECRET=your-client-secret3. Use App Password as `SMTP_PASS`

### Job Management

- Create jobs with detailed requirementsVIPPS_SUBSCRIPTION_KEY=your-subscription-key

- Set flexible or fixed schedules

- Choose payment type (fixed/hourly)VIPPS_SUBSCRIPTION_KEY_SECONDARY=your-secondary-key### 5. Run

- Upload photos for context

- Track job status (open/assigned/completed)VIPPS_MERCHANT_SERIAL_NUMBER=your-msn



### Application SystemVIPPS_API_BASE_URL=https://apitest.vipps.no```bash

- One-click applications

- Track application statusVIPPS_REDIRECT_URI=http://localhost:3000/api/auth/vipps/callbacknpm run dev

- Email notifications for updates

- Employer can review and accept/reject```



### Profile & CV# Email (SMTP)

- Build professional worker profile

- Add work experience and skillsSMTP_HOST=smtp.gmail.comOpen http://localhost:3000

- Display reviews and ratings

- Track achievements and statisticsSMTP_PORT=587



## 🔧 ConfigurationSMTP_SECURE=false## ✅ Features Implemented



### Vipps SetupSMTP_USER=your-email@gmail.com

1. Register at [Vipps Developer Portal](https://vipps.no/developer)

2. Create test app for developmentSMTP_PASS=your-app-password**Complete:**

3. Get credentials and add to `.env.local`

4. For production, switch to production API URL```- ✅ Jobs CRUD with Supabase



### Database Schema- ✅ Job applications

The database includes these main tables:

- `users` - User accounts with roles### 4. Email Setup (Optional)- ✅ Vipps OAuth authentication

- `jobs` - Job postings

- `applications` - Job applications- ✅ Dual profiles (worker/employer)

- `conversations` - Chat conversations

- `messages` - Chat messagesTo enable email notifications:- ✅ CV system (experience, skills)

- `cv_entries` - Work experience

- `skills` - User skills- ✅ Reviews and ratings

- `reviews` - User reviews and ratings

1. Enable 2-Factor Authentication on your Gmail account- ✅ Photo uploads (Supabase Storage)

## 🐛 Troubleshooting

2. Generate App Password: https://myaccount.google.com/apppasswords- ✅ Real-time profile sync

**"Failed to fetch" errors:**

- Check that `.env.local` is properly configured3. Use the generated password as `SMTP_PASS`- ✅ **Persistent chat system** with Supabase

- Verify Supabase URL and keys

- Restart development server- ✅ **Email notifications** (applications, status updates, welcome)



**Vipps OAuth not working:**### 5. Run Development Server- ✅ **E2E testing** with Playwright

- Verify redirect URI matches exactly

- Check Vipps credentials- ✅ Responsive design

- For production, update API base URL

```bash

**Email not sending:**

- Verify Gmail App Password is correctnpm run dev**Partial/Demo:**

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
