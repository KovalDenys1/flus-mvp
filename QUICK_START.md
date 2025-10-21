# íº€ Quick Start Guide - FLUS MVP

## Follow these steps for full project functionality:

### 1. âœ… Apply RLS Migration (if not done yet)

**Run in Supabase SQL Editor:**
```sql
-- File: supabase/migrations/04_fix_rls_for_cookie_auth.sql
```

This will allow creating jobs without RLS errors.

---

### 2. í³‹ Add Test Jobs

**Run in Supabase SQL Editor:**
```sql
-- File: supabase/seed_demo_jobs.sql
```

This will add 8 demo jobs in different categories.

---

### 3. í¾¯ Verify Everything Works

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Test the flow:**
   - Register via Vipps (or use existing user)
   - Switch to "JobbsÃ¸ker" (worker) mode
   - Navigate to `/jobber` - you'll see the job list
   - Click on a job â†’ detail page opens
   - Click "SÃ¸k" â†’ creates an application
   - Switch to "Arbeidsgiver" (employer) mode
   - Navigate to `/jobber/ny` â†’ create a new job
   - Navigate to `/mine-jobber` â†’ see your jobs

---

## âœ… What Should Work:

### For JobbsÃ¸ker (Worker):
- âœ… View all open jobs at `/jobber`
- âœ… Filter by category and search
- âœ… Job details at `/jobber/[id]`
- âœ… Submit application
- âœ… View your applications at `/mine-soknader`
- âœ… Chat with employer at `/samtaler/[id]`
- âœ… Manage CV at `/profil`

### For Arbeidsgiver (Employer):
- âœ… Create jobs at `/jobber/ny`
- âœ… View your jobs at `/mine-jobber`
- âœ… Edit jobs
- âœ… View applications for jobs
- âœ… Chat with applicants

---

## í´§ Quick Troubleshooting:

### "No jobs found"
â†’ Run `supabase/seed_demo_jobs.sql` in Supabase SQL Editor

### "Row violates RLS policy"
â†’ Run `supabase/migrations/04_fix_rls_for_cookie_auth.sql`

### "Unauthorized"
â†’ Log in via `/login` â†’ "Logg inn med Vipps"

---

## í³Š Verify Data in Supabase:

```sql
-- Check users
SELECT id, email, role, navn FROM users;

-- Check jobs
SELECT id, title, category, status, employer_id FROM jobs ORDER BY created_at DESC;

-- Check applications
SELECT id, job_id, applicant_id, status FROM applications;
```

---

Done! Project is fully functional! í¾‰
