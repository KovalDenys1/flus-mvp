# � Quick Start Guide - FLUS MVP

## Follow these steps for full project functionality:

### 1. ✅ Apply RLS Migration (if not done yet)

**Run in Supabase SQL Editor:**
```sql
-- File: supabase/migrations/04_fix_rls_for_cookie_auth.sql
```

This will allow creating jobs without RLS errors.

---

### 2. � Add Test Jobs

**Run in Supabase SQL Editor:**
```sql
-- File: supabase/seed_demo_jobs.sql
```

This will add 8 demo jobs in different categories.

---

### 3. � Verify Everything Works

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Test the flow:**
   - Register via Vipps (or use existing user)
   - Switch to "Jobbsøker" (worker) mode
   - Navigate to `/jobber` - you'll see the job list
   - Click on a job → detail page opens
   - Click "Søk" → creates an application
   - Switch to "Arbeidsgiver" (employer) mode
   - Navigate to `/jobber/ny` → create a new job
   - Navigate to `/mine-jobber` → see your jobs

---

## ✅ What Should Work:

### For Jobbsøker (Worker):
- ✅ View all open jobs at `/jobber`
- ✅ Filter by category and search
- ✅ Job details at `/jobber/[id]`
- ✅ Submit application
- ✅ View your applications at `/mine-soknader`
- ✅ Chat with employer at `/samtaler/[id]`
- ✅ Manage CV at `/profil`

### For Arbeidsgiver (Employer):
- ✅ Create jobs at `/jobber/ny`
- ✅ View your jobs at `/mine-jobber`
- ✅ Edit jobs
- ✅ View applications for jobs
- ✅ Chat with applicants

---

## � Quick Troubleshooting:

### "No jobs found"
→ Run `supabase/seed_demo_jobs.sql` in Supabase SQL Editor

### "Row violates RLS policy"
→ Run `supabase/migrations/04_fix_rls_for_cookie_auth.sql`

### "Unauthorized"
→ Log in via `/login` → "Logg inn med Vipps"

---

## � Verify Data in Supabase:

```sql
-- Check users
SELECT id, email, role, navn FROM users;

-- Check jobs
SELECT id, title, category, status, employer_id FROM jobs ORDER BY created_at DESC;

-- Check applications
SELECT id, job_id, applicant_id, status FROM applications;
```

---

Done! Project is fully functional! �
