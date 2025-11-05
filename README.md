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

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key- Supabase account### Platform Features### Job Features

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

- Vipps developer account (for OAuth)

# Application

NEXT_PUBLIC_APP_URL=http://localhost:3000- Gmail account (for email notifications)- 🔐 Secure authentication via Vipps OAuth- Flexible scheduling (anytime/fixed/deadline)



# Vipps OAuth

VIPPS_CLIENT_ID=your-client-id

VIPPS_CLIENT_SECRET=your-client-secret## 🚀 Quick Start- 📱 Fully responsive design- Location support with maps

VIPPS_SUBSCRIPTION_KEY=your-subscription-key

VIPPS_SUBSCRIPTION_KEY_SECONDARY=your-secondary-key

VIPPS_MERCHANT_SERIAL_NUMBER=your-msn

VIPPS_API_BASE_URL=https://apitest.vipps.no### 1. Clone and Install- 🌍 Location-based job search with radius filter- Payment options (fixed/hourly)

VIPPS_REDIRECT_URI=http://localhost:3000/api/auth/vipps/callback

```bash

# Email Configuration (SMTP)

SMTP_HOST=smtp.gmail.comgit clone https://github.com/KovalDenys1/flus-mvp.git- 📅 Flexible scheduling (anytime/fixed/deadline)- Photo uploads

SMTP_PORT=587

SMTP_SECURE=falsecd flus-mvp

SMTP_USER=your-email@gmail.com

SMTP_PASS=your-app-passwordnpm install- 💰 Multiple payment options (fixed price/hourly rate)- Job categories



# Google Places API```

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

```- 📸 Photo upload support for jobs



### 4. Email Setup (Optional)### 2. Database Setup



To enable email notifications:1. Create a new project at [supabase.com](https://supabase.com)- 🎯 Achievement system### Communication & Notifications

1. Enable 2-Factor Authentication on your Gmail account

2. Generate App Password: https://myaccount.google.com/apppasswords2. Run migrations in order in Supabase SQL Editor:

3. Use the generated password as `SMTP_PASS`

   - `supabase/migrations/01_minimal_schema.sql`- 📧 Automated email notifications- **Real-time chat** between employers and workers

### 5. Run Development Server

   - `supabase/migrations/02_minimal_storage.sql`

```bash

npm run dev   - `supabase/migrations/03_add_birth_year.sql`- **Email notifications** for:

```

   - `supabase/migrations/04_update_users_table.sql`

Open [http://localhost:3000](http://localhost:3000) in your browser.

   - `supabase/migrations/05_add_support_tickets.sql`## 🛠️ Tech Stack  - New job applications (to employers)

## 📁 Project Structure

   - `supabase/migrations/06_add_initial_photos.sql`

```

flus-mvp/   - `supabase/migrations/07_add_addresses_table.sql`  - Application status changes (to workers)

├── src/

│   ├── app/                    # Next.js App Router   - `supabase/migrations/07_add_admin_role.sql`

│   │   ├── api/               # API routes

│   │   ├── admin/             # Admin dashboard   - `supabase/migrations/08_enable_realtime.sql`- **Framework:** Next.js 15.5.4 with App Router & Turbopack  - Welcome emails upon registration

│   │   ├── jobber/            # Job listings

│   │   ├── profil/            # User profiles

│   │   ├── mine-jobber/       # Employer's jobs

│   │   ├── mine-soknader/     # Worker's applications3. Create storage bucket:- **Database:** Supabase (PostgreSQL + Storage)- **Persistent conversations** with Supabase storage

│   │   ├── samtaler/          # Chat interface

│   │   └── ...   - Navigate to Storage in Supabase Dashboard

│   ├── components/            # React components

│   │   ├── ui/               # UI primitives   - Create bucket named `job-photos`- **Authentication:** Vipps OAuth 2.0

│   │   ├── AddressAutocomplete.tsx  # Address search component

│   │   └── ...   - Make it **Public**

│   └── lib/                   # Utilities & helpers

│       ├── data/             # Data layer   - Set file size limit to **5MB**- **Styling:** Tailwind CSS 4.0## Tech Stack

│       ├── supabase/         # Supabase client

│       ├── vipps/            # Vipps integration

│       └── utils/            # Helper functions

├── supabase/### 3. Environment Configuration- **UI Components:** Radix UI + shadcn/ui

│   └── migrations/           # Database migrations

├── scripts/Create `.env.local` file (see `.env.example` for reference):

│   └── populate-addresses.js # Address population script

└── public/                   # Static assets- **Language:** TypeScript- **Framework**: Next.js 15.5.4 (App Router, Turbopack)

```

```env

## 🔑 Key API Routes

# Supabase- **Email:** Nodemailer with SMTP- **Database**: Supabase (PostgreSQL, Storage, RLS)

### Authentication

- `GET /api/auth/vipps/start` - Initiate Vipps OAuth flowNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

- `GET /api/auth/vipps/callback` - OAuth callback handler

- `GET /api/auth/me` - Get current userNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key- **State Management:** React Hooks- **Auth**: Vipps OAuth (Login API)

- `POST /api/auth/logout` - Logout user

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

### Jobs

- `GET /api/jobs` - List all jobs (with filters)- **Session Management:** HTTP-only cookies- **Styling**: Tailwind CSS 4.0

- `POST /api/jobs` - Create new job

- `GET /api/jobs/[id]` - Get job details# Application

- `DELETE /api/jobs/[id]` - Delete job

- `GET /api/my-jobs` - Get user's jobsNEXT_PUBLIC_APP_URL=http://localhost:3000- **UI**: Radix UI



### Applications

- `GET /api/applications` - Get user's applications

- `POST /api/applications` - Submit job application# Vipps OAuth## 📋 Prerequisites- **Language**: TypeScript

- `PATCH /api/applications` - Update application status

VIPPS_CLIENT_ID=your-client-id

### Profile & CV

- `GET /api/profile` - Get user profileVIPPS_CLIENT_SECRET=your-client-secret- **Sessions**: HTTP-only cookies

- `POST /api/profile/update` - Update profile

- `GET /api/profile/stats` - Get user statisticsVIPPS_SUBSCRIPTION_KEY=your-subscription-key

- `GET /api/cv` - Get CV entries

- `POST /api/cv` - Add CV entryVIPPS_SUBSCRIPTION_KEY_SECONDARY=your-secondary-key- Node.js 18+ and npm

- `DELETE /api/cv` - Remove CV entry

VIPPS_MERCHANT_SERIAL_NUMBER=your-msn

### Chat

- `GET /api/conversations` - List conversationsVIPPS_API_BASE_URL=https://apitest.vipps.no- Supabase account## Quick Start

- `GET /api/conversations/[id]/messages` - Get messages

- `POST /api/conversations/[id]/messages` - Send messageVIPPS_REDIRECT_URI=http://localhost:3000/api/auth/vipps/callback



## 🎯 Features Overview- Vipps developer account (for OAuth)



### Dual Role System# Email Configuration (SMTP)

Users can switch between **Worker** and **Employer** modes:

- **Worker Mode:** Browse jobs, apply, manage applications, view CVSMTP_HOST=smtp.gmail.com- Gmail account (for email notifications)### 1. Clone & Install

- **Employer Mode:** Post jobs, review applications, hire workers

- Seamless role switching via navbar toggleSMTP_PORT=587



### Real-Time ChatSMTP_SECURE=false

- Persistent conversations stored in Supabase

- Photo sharing supportSMTP_USER=your-email@gmail.com

- Work completion flow with before/after photos

- System notifications for work status changesSMTP_PASS=your-app-password## 🚀 Quick Start```bash



### Job Management```

- Create jobs with detailed requirements

- Set flexible or fixed schedulesgit clone https://github.com/KovalDenys1/flus-mvp.git

- Choose payment type (fixed/hourly)

- Upload photos for context### 4. Email Setup (Optional)

- Track job status (open/assigned/completed)

- **Address autocomplete** for accurate location inputTo enable email notifications:### 1. Clone and Installcd flus-mvp



### Application System1. Enable 2-Factor Authentication on your Gmail account

- One-click applications

- Track application status2. Generate App Password: https://myaccount.google.com/apppasswordsnpm install

- Email notifications for updates

- Employer can review and accept/reject3. Use the generated password as `SMTP_PASS`



### Profile & CV```bash```

- Build professional worker profile

- Add work experience and skills### 5. Run Development Server

- Display reviews and ratings

- Track achievements and statistics```bashgit clone https://github.com/KovalDenys1/flus-mvp.git



### Admin Dashboardnpm run dev

- Platform management interface

- Real-time user and job statistics```cd flus-mvp### 2. Supabase Setup

- Live activity logs

- User role management

- Company (bedrift) oversight

Open [http://localhost:3000](http://localhost:3000) in your browser.npm install

## 👥 Team Contributors



This project was developed collaboratively by:

## 📁 Project Structure```1. Create Supabase project at [supabase.com](https://supabase.com)

- **Denys Koval** - Project lead, core features, authentication, and deployment

- **Alexander** - Address autocomplete API integration using Google Places API

- **Ayanle** - Admin dashboard development with real-time analytics and monitoring

```2. Run the SQL migration in `supabase/migrations/01_init_schema.sql`

## 🔧 Configuration

flus-mvp/

### Vipps Setup

1. Register at [Vipps Developer Portal](https://vipps.no/developer)├── src/### 2. Database Setup3. Create `job-photos` storage bucket (Public: YES, 5MB limit)

2. Create test app for development

3. Get credentials and add to `.env.local`│   ├── app/                    # Next.js App Router

4. For production, switch to production API URL

│   │   ├── api/               # API routes4. Run `supabase/migrations/02_storage_policies.sql`

### Google Places API Setup

1. Create project in [Google Cloud Console](https://console.cloud.google.com)│   │   ├── jobber/            # Job listings

2. Enable Places API

3. Create API key with Places API restriction│   │   ├── profil/            # User profiles1. Create a new project at [supabase.com](https://supabase.com)

4. Add key to `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

│   │   ├── mine-jobber/       # Employer's jobs

### Database Schema

The database includes these main tables:│   │   ├── mine-soknader/     # Worker's applications### 3. Environment Variables

- `users` - User accounts with roles

- `jobs` - Job postings│   │   ├── samtaler/          # Chat interface

- `applications` - Job applications

- `conversations` - Chat conversations│   │   └── ...2. Run migrations in order in Supabase SQL Editor:

- `messages` - Chat messages

- `cv_entries` - Work experience│   ├── components/            # React components

- `skills` - User skills

- `reviews` - User reviews and ratings│   │   ├── ui/               # UI primitives   ```Create `.env.local`:

- `bedrift` - Company management

│   │   └── ...

## 🐛 Troubleshooting

│   └── lib/                   # Utilities & helpers   supabase/migrations/01_minimal_schema.sql

**"Failed to fetch" errors:**

- Check that `.env.local` is properly configured│       ├── data/             # Data layer

- Verify Supabase URL and keys

- Restart development server│       ├── supabase/         # Supabase client   supabase/migrations/02_minimal_storage.sql```env



**Vipps OAuth not working:**│       ├── vipps/            # Vipps integration

- Verify redirect URI matches exactly

- Check Vipps credentials│       └── utils/            # Helper functions   supabase/migrations/03_add_birth_year.sql# Supabase

- For production, update API base URL

├── supabase/

**Email not sending:**

- Verify Gmail App Password is correct│   └── migrations/           # Database migrations   supabase/migrations/04_update_users_table.sqlNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

- Check SMTP configuration

- Ensure 2FA is enabled on Gmail├── scripts/



**Database errors:**│   └── populate-addresses.js # Address population script   supabase/migrations/05_add_support_tickets.sqlNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

- Run all migrations in correct order

- Check RLS policies are enabled└── public/                   # Static assets

- Verify service role key has admin access

```   supabase/migrations/06_add_initial_photos.sqlSUPABASE_SERVICE_ROLE_KEY=your-service-role-key

**Images not uploading:**

- Ensure `job-photos` bucket exists

- Check bucket is set to public

- Verify file size is under 5MB## 🔑 Key API Routes   ```



**Address autocomplete not working:**

- Verify Google Maps API key is correct

- Check that Places API is enabled in Google Cloud Console### Authentication# Vipps OAuth

- Ensure billing is enabled on Google Cloud project

- `GET /api/auth/vipps/start` - Initiate Vipps OAuth flow

## 🚢 Deployment

- `GET /api/auth/vipps/callback` - OAuth callback handler3. Create storage bucket:VIPPS_CLIENT_ID=your-client-id

### Vercel (Recommended)

- `GET /api/auth/me` - Get current user

1. Push code to GitHub

2. Import project in Vercel- `POST /api/auth/logout` - Logout user   - Navigate to Storage in Supabase DashboardVIPPS_CLIENT_SECRET=your-client-secret

3. Add environment variables

4. Deploy



### Environment Variables for Production### Jobs   - Create bucket named `job-photos`VIPPS_SUBSCRIPTION_KEY=your-subscription-key

Make sure to update these for production:

- `NEXT_PUBLIC_APP_URL` - Your production domain- `GET /api/jobs` - List all jobs (with filters)

- `VIPPS_API_BASE_URL` - Change to `https://api.vipps.no`

- `VIPPS_REDIRECT_URI` - Update to production callback URL- `POST /api/jobs` - Create new job   - Make it **Public**VIPPS_MERCHANT_SERIAL_NUMBER=your-msn

- All Supabase credentials

- SMTP credentials- `GET /api/jobs/[id]` - Get job details

- Google Maps API key

- `DELETE /api/jobs/[id]` - Delete job   - Set file size limit to **5MB**VIPPS_REDIRECT_URI=https://your-domain.com/api/auth/vipps/callback

## 📄 License

- `GET /api/my-jobs` - Get user's jobs

MIT License - See LICENSE file for details



## 👨‍💻 Author

### Applications

Denys Koval - [GitHub](https://github.com/KovalDenys1)

- `GET /api/applications` - Get user's applications### 3. Environment Configuration# Email Configuration (SMTP)

## 🙏 Acknowledgments

- `POST /api/applications` - Submit job application

- Built with Next.js and Supabase

- UI components from shadcn/ui- `PATCH /api/applications` - Update application statusSMTP_HOST=smtp.gmail.com

- Icons from Lucide React

- Authentication via Vipps

- Address search powered by Google Places API

### Profile & CVCreate `.env.local` file (see `.env.example` for reference):SMTP_PORT=587

---

- `GET /api/profile` - Get user profile

**Made with ❤️ in Norway**

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
