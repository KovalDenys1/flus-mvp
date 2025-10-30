-- =============================================================================
-- FLUS MVP - Database Schema (Tables Only)
-- Description: Create all tables except users (users table already exists)
-- Date: 2025-10-29
-- =============================================================================

-- =============================================================================
-- JOBS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY DEFAULT ('j_' || substr(md5(random()::text), 1, 10)),
  employer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  pay_nok INTEGER NOT NULL CHECK (pay_nok > 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  area_name TEXT NOT NULL,
  lat FLOAT DEFAULT 59.9139,
  lng FLOAT DEFAULT 10.7522,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'completed', 'cancelled')),
  address TEXT,
  schedule_type TEXT DEFAULT 'flexible' CHECK (schedule_type IN ('flexible', 'fixed', 'deadline')),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  payment_type TEXT DEFAULT 'fixed' CHECK (payment_type IN ('fixed', 'hourly')),
  requirements TEXT,
  selected_worker_id TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- =============================================================================
-- APPLICATIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY DEFAULT ('a_' || substr(md5(random()::text), 1, 10)),
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  message TEXT,
  conversation_id TEXT,
  work_started_at TIMESTAMPTZ,
  work_completed_at TIMESTAMPTZ,
  employer_approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- =============================================================================
-- CONVERSATIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY DEFAULT ('conv_' || substr(md5(random()::text), 1, 10)),
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_job_id ON conversations(job_id);
CREATE INDEX IF NOT EXISTS idx_conversations_worker_id ON conversations(worker_id);
CREATE INDEX IF NOT EXISTS idx_conversations_employer_id ON conversations(employer_id);

-- =============================================================================
-- MESSAGES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT ('msg_' || substr(md5(random()::text), 1, 10)),
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'photo', 'system')),
  text_content TEXT,
  photo_url TEXT,
  system_event TEXT CHECK (system_event IN ('work_started', 'work_completed', 'work_approved', 'work_rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT message_content_check CHECK (
    (message_type = 'text' AND text_content IS NOT NULL) OR
    (message_type = 'photo' AND photo_url IS NOT NULL) OR
    (message_type = 'system' AND system_event IS NOT NULL)
  )
);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

-- =============================================================================
-- JOB PHOTOS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS job_photos (
  id TEXT PRIMARY KEY DEFAULT ('photo_' || substr(md5(random()::text), 1, 10)),
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  uploaded_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('before', 'after')),
  storage_path TEXT NOT NULL,
  storage_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job photos indexes
CREATE INDEX IF NOT EXISTS idx_job_photos_application_id ON job_photos(application_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_message_id ON job_photos(message_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_type ON job_photos(photo_type);

-- =============================================================================
-- ACHIEVEMENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('jobs_completed', 'total_earnings', 'rating', 'streak')),
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- USER ACHIEVEMENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY DEFAULT ('ua_' || substr(md5(random()::text), 1, 10)),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User achievements indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- =============================================================================
-- CV ENTRIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS cv_entries (
  id TEXT PRIMARY KEY DEFAULT ('cv_' || substr(md5(random()::text), 1, 10)),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current_job BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cv_entry_dates_check CHECK (
    (current_job = true AND end_date IS NULL) OR
    (current_job = false)
  )
);

-- CV entries indexes
CREATE INDEX IF NOT EXISTS idx_cv_entries_user_id ON cv_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_entries_start_date ON cv_entries(start_date DESC);

-- =============================================================================
-- SKILLS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY DEFAULT ('skill_' || substr(md5(random()::text), 1, 10)),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
  years_experience NUMERIC DEFAULT 0 CHECK (years_experience >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(skill_name);

-- =============================================================================
-- REVIEWS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT ('rev_' || substr(md5(random()::text), 1, 10)),
  reviewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id TEXT REFERENCES jobs(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reviewer_id, reviewee_id, job_id)
);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_job_id ON reviews(job_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- =============================================================================
-- SESSIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- =============================================================================
-- ENABLE RLS ON ALL TABLES (except users - handled separately)
-- =============================================================================
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PERMISSIVE RLS POLICIES (security enforced at API layer)
-- =============================================================================
DROP POLICY IF EXISTS "jobs_all_policy" ON jobs;
CREATE POLICY "jobs_all_policy" ON jobs FOR ALL USING (true);

DROP POLICY IF EXISTS "applications_all_policy" ON applications;
CREATE POLICY "applications_all_policy" ON applications FOR ALL USING (true);

DROP POLICY IF EXISTS "conversations_all_policy" ON conversations;
CREATE POLICY "conversations_all_policy" ON conversations FOR ALL USING (true);

DROP POLICY IF EXISTS "messages_all_policy" ON messages;
CREATE POLICY "messages_all_policy" ON messages FOR ALL USING (true);

DROP POLICY IF EXISTS "job_photos_all_policy" ON job_photos;
CREATE POLICY "job_photos_all_policy" ON job_photos FOR ALL USING (true);

DROP POLICY IF EXISTS "achievements_select_policy" ON achievements;
CREATE POLICY "achievements_select_policy" ON achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "user_achievements_all_policy" ON user_achievements;
CREATE POLICY "user_achievements_all_policy" ON user_achievements FOR ALL USING (true);

DROP POLICY IF EXISTS "cv_entries_all_policy" ON cv_entries;
CREATE POLICY "cv_entries_all_policy" ON cv_entries FOR ALL USING (true);

DROP POLICY IF EXISTS "skills_all_policy" ON skills;
CREATE POLICY "skills_all_policy" ON skills FOR ALL USING (true);

DROP POLICY IF EXISTS "reviews_all_policy" ON reviews;
CREATE POLICY "reviews_all_policy" ON reviews FOR ALL USING (true);

DROP POLICY IF EXISTS "sessions_all_policy" ON sessions;
CREATE POLICY "sessions_all_policy" ON sessions FOR ALL USING (true);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cv_entries_updated_at ON cv_entries;
CREATE TRIGGER update_cv_entries_updated_at BEFORE UPDATE ON cv_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SEED ACHIEVEMENTS
-- =============================================================================
INSERT INTO achievements (id, title, description, icon, requirement_type, requirement_value)
VALUES
  ('ach_first_job', 'Første Jobb', 'Fullfør din første jobb', '🎉', 'jobs_completed', 1),
  ('ach_five_jobs', 'Erfaren Hjelper', 'Fullfør 5 jobber', '⭐', 'jobs_completed', 5),
  ('ach_ten_jobs', 'Jobbjeger', 'Fullfør 10 jobber', '🏆', 'jobs_completed', 10),
  ('ach_first_1000', 'Første Tusen', 'Tjen 1000 NOK totalt', '💰', 'total_earnings', 1000),
  ('ach_five_1000', 'Fem Tusen', 'Tjen 5000 NOK totalt', '💵', 'total_earnings', 5000)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- VIEWS FOR STATISTICS
-- =============================================================================
CREATE OR REPLACE VIEW job_statistics
WITH (security_invoker = true) AS
SELECT
  j.employer_id,
  COUNT(DISTINCT j.id) as total_jobs,
  COUNT(DISTINCT CASE WHEN j.status = 'open' THEN j.id END) as open_jobs,
  COUNT(DISTINCT CASE WHEN j.status = 'completed' THEN j.id END) as completed_jobs,
  COUNT(DISTINCT a.id) as total_applications,
  COUNT(DISTINCT CASE WHEN a.status = 'accepted' THEN a.id END) as accepted_applications
FROM jobs j
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.employer_id;

CREATE OR REPLACE VIEW worker_statistics
WITH (security_invoker = true) AS
SELECT
  u.id as worker_id,
  u.email,
  u.navn,
  COUNT(DISTINCT a.id) as total_applications,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_jobs,
  COALESCE(SUM(CASE WHEN a.status = 'completed' THEN j.pay_nok END), 0) as total_earnings
FROM users u
LEFT JOIN applications a ON u.id = a.applicant_id
LEFT JOIN jobs j ON a.job_id = j.id
WHERE u.role = 'worker'
GROUP BY u.id, u.email, u.navn;

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, authenticated;

-- Grant permissions on views
GRANT SELECT ON job_statistics TO anon, authenticated, service_role;
GRANT SELECT ON worker_statistics TO anon, authenticated, service_role;

-- =============================================================================
-- SCHEMA COMPLETE ✅
-- =============================================================================