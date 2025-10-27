# Supabase Setup Guide

Complete step-by-step guide to set up Supabase from scratch for the FLUS MVP platform.

---

## Prerequisites

- Supabase account (free tier works fine)
- Project created at [supabase.com](https://supabase.com)

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `flus-mvp` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `Europe West (London)`)
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to be provisioned

---

## Step 2: Get Your API Keys

1. In your project dashboard, click **Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

---

## Step 3: Configure Environment Variables

Create `.env.local` in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Vipps OAuth
VIPPS_CLIENT_ID=your-vipps-client-id
VIPPS_CLIENT_SECRET=your-vipps-client-secret
VIPPS_SUBSCRIPTION_KEY=your-vipps-subscription-key
VIPPS_MSN=your-merchant-serial-number
```

**Important:** 
- Get `SUPABASE_SERVICE_ROLE_KEY` from Settings → API → `service_role` key
- This key is required for user registration to work properly

---

## Step 4: Run Database Migrations

### 4.1 Main Schema (Required) ⭐

1. Open Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Copy entire content of `supabase/migrations/01_init_schema.sql`
4. Paste into editor and click **"Run"**
5. Success: ✅ **"Success. No rows returned"**

**This migration includes:**
- ✅ All tables (users, jobs, applications, cv_entries, skills, reviews, etc.)
- ✅ All RLS policies (optimized, no duplicates)
- ✅ All indexes and triggers
- ✅ Views with proper security settings
- ✅ Schema permissions (security fix)
- ✅ Fixed function search_path
- ✅ Achievement seed data

**Note:** This is a consolidated migration that includes all security and performance fixes.

### 4.2 Storage Policies (Required)

1. **First create storage bucket** (see Step 5)
2. Then run `supabase/migrations/02_storage_policies.sql` in SQL Editor

### 4.4 Add Birth Year Field (Required for Age Verification)

Run `supabase/migrations/04_add_birth_year.sql` to add birth_year field to users table for age verification.

---

## Step 5: Create Storage Bucket

1. Go to **Storage** → **"Create a new bucket"**
2. Configure:
   - Name: `job-photos`
   - Public: ✅ YES
   - File size: 5 MB
   - MIME types: image/png, image/jpeg, image/jpg, image/webp
3. Click **"Create bucket"**

---

## Step 6: Verify Setup

### Tables (Table Editor)
✅ users, jobs, applications, conversations, messages  
✅ cv_entries, skills, reviews, achievements  
✅ user_achievements, job_photos

### Storage
✅ job-photos bucket (Public)

---

## Step 7: Test Your Setup

```bash
npm install
npm run dev
```

1. Open `http://localhost:3000/login`
2. Login with Vipps
3. Switch to Arbeidsgiver mode
4. Create a test job
5. Check Supabase Table Editor → jobs table

---

## Common Issues

### ❌ "Failed to fetch"
- Check `.env.local` has correct credentials
- Restart dev server

### ❌ "RLS policy violation"
- Verify you ran `01_init_schema.sql`
- Check policies exist in Dashboard → Database → Policies

### ❌ "Job not found"
- Run `03_seed_demo_jobs.sql`
- Or create job manually

---

## Database Schema

### users
id, email, role, navn, bio, social links, company info

### jobs  
id, employer_id, title, category, pay_nok, schedule_type, payment_type

### applications
id, job_id, applicant_id, status, message

### cv_entries
id, user_id, title, company, dates

### skills
id, user_id, skill_name, proficiency_level (1-5)

### reviews
id, reviewer_id, reviewee_id, rating (1-5), comment

---

**Full documentation:** See file for complete field list and constraints.

---

**Happy coding! ���**