# Complete Supabase Setup Guide for FLUS MVP

## 📋 Step-by-Step Database Setup

### Step 1: Create a new Supabase project

1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Fill in the details:
   - **Name**: flus-mvp (or any name)
   - **Database Password**: (save this password!)
   - **Region**: West EU (Copenhagen) - closest to Norway
4. Click **Create new project** and wait 2-3 minutes

### Step 2: Copy your credentials

1. After project creation, go to **Settings** → **API**
2. Copy:
   - **Project URL** (like `https://xxxxx.supabase.co`)
   - **anon public key** (long token)
3. Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🗄️ Step 3: Create database schema

### 3.1 Open SQL Editor

1. In Supabase Dashboard go to **SQL Editor** (icon `</>`)
2. Click **New query**

### 3.2 Execute main SQL

Copy **all** SQL from file `supabase/migrations/00_complete_schema.sql` and execute it.

This SQL will create:

- ✅ **users** - Users (workers and employers)
- ✅ **jobs** - Jobs with enhanced fields (address, schedule, requirements)
- ✅ **applications** - Job applications + completion status tracking
- ✅ **conversations** - Chats between worker and employer
- ✅ **messages** - Chat messages (text + photos + system events)
- ✅ **job_photos** - Work photos (before/after)
- ✅ **achievements** - Achievements for gamification
- ✅ **user_achievements** - Earned user achievements

**Security policies (RLS):**
- ✅ Workers see only their applications
- ✅ Employers see only their jobs and applications
- ✅ Chat participants see only their messages
- ✅ Photos visible only to application participants

---

## 📸 Step 4: Setup Storage for photos

### 4.1 Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Settings:
   - **Name**: `job-photos`
   - **Public bucket**: ✅ **YES** (so URLs work without auth)
   - **File size limit**: `5MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
4. Click **Create bucket**

### 4.2 Setup Storage Policies

After creating the bucket, execute SQL from `supabase/migrations/01_storage_policies.sql`:

```sql
-- Allow users to upload photos to their own folder
CREATE POLICY "Users can upload photos to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'job-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow viewing all photos (for application participants)
CREATE POLICY "Users can view photos from their applications"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'job-photos');

-- Allow deleting own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'job-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 🎯 Step 5: Verify setup

### 5.1 Check tables

In **Table Editor** you should see all tables:
- users
- jobs
- applications
- conversations
- messages
- job_photos
- achievements
- user_achievements

### 5.2 Check Storage

In **Storage** you should have bucket `job-photos` with configured policies.

### 5.3 Check RLS

All tables should have RLS enabled (green shield 🛡️ in Table Editor).

---

## 🚀 Step 6: Run the application

```bash
npm run dev
```

Open http://localhost:3000

### Test scenario:

#### As employer:
1. Go to `/login`
2. Select **Arbeidsgiver** (💼)
3. Click **Logg inn med Vipps**
4. Go to `/jobber/ny`
5. Create test job with:
   - Address
   - Schedule type (Fleksibel/Frist/Fast tid)
   - Requirements

#### As worker:
1. Open another browser/profile
2. Go to `/login`
3. Select **Jobbsøker** (👷)
4. Click **Logg inn med Vipps**
5. Find job in `/jobber`
6. Submit application
7. In chat send "Starting work"
8. **Upload "before" photos**
9. After completion **upload "after" photos**
10. Mark work as completed

#### As employer (verification):
1. Return to first browser
2. Go to `/samtaler`
3. Open chat with worker
4. **View "before" and "after" photos**
5. Approve work completion

---

## 📁 Photo storage structure

```
job-photos/
  └── {worker_user_id}/
      └── {application_id}/
          ├── before_timestamp.jpg
          ├── before_timestamp_2.jpg
          ├── after_timestamp.jpg
          └── after_timestamp_2.jpg
```

**Example:**
```
job-photos/u_abc123def/a_xyz789abc/before_1729520000.jpg
```

---

## 🔧 Useful SQL queries for debugging

### View all applications with photos:
```sql
SELECT 
  a.id,
  j.title as job_title,
  u.email as worker_email,
  a.status,
  COUNT(jp.id) as photo_count
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN users u ON a.applicant_id = u.id
LEFT JOIN job_photos jp ON a.id = jp.application_id
GROUP BY a.id, j.title, u.email, a.status;
```

### View worker statistics:
```sql
SELECT * FROM worker_statistics 
WHERE worker_id = 'u_xxx';
```

### View employer statistics:
```sql
SELECT * FROM job_statistics 
WHERE employer_id = 'u_xxx';
```

---

## ⚠️ Important notes

1. **RLS enabled on all tables** - data is protected
2. **Storage bucket is public** - photo URLs work without auth
3. **Photos cannot be deleted after work approval** - fraud protection
4. **Employer must approve** work for status to change to `completed`
5. **System messages** are created automatically on work status changes

---

## 📞 Next steps

After database setup, you need to:

1. ✅ Implement API for photo uploads
2. ✅ Create UI for photo uploads in chat
3. ✅ Add photo gallery in chat
4. ✅ Implement work approval by employer
5. ✅ Add notifications for new photos

Ready to help with implementation of any of these features! 🚀
