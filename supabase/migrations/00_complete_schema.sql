-- =============================================================================
-- FLUS MVP - Complete Database Schema
-- Description: Full schema for job platform with photos and chat functionality
-- Date: 2025-10-21
-- =============================================================================

-- =============================================================================
-- 1. USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT ('u_' || substr(md5(random()::text), 1, 10)),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'worker' CHECK (role IN ('worker', 'employer')),
  navn TEXT,
  kommune TEXT,
  telefon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Users RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);

-- =============================================================================
-- 2. JOBS TABLE
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
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  
  -- Enhanced scheduling fields
  address TEXT,
  schedule_type TEXT DEFAULT 'flexible' CHECK (schedule_type IN ('flexible', 'fixed', 'deadline')),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  payment_type TEXT DEFAULT 'fixed' CHECK (payment_type IN ('fixed', 'hourly')),
  requirements TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_schedule_type ON jobs(schedule_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Jobs RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open jobs"
  ON jobs FOR SELECT
  USING (status = 'open' OR employer_id = auth.uid()::text);

CREATE POLICY "Employers can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (employer_id = auth.uid()::text);

CREATE POLICY "Employers can update own jobs"
  ON jobs FOR UPDATE
  USING (employer_id = auth.uid()::text);

CREATE POLICY "Employers can delete own jobs"
  ON jobs FOR DELETE
  USING (employer_id = auth.uid()::text);

-- =============================================================================
-- 3. APPLICATIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY DEFAULT ('a_' || substr(md5(random()::text), 1, 10)),
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  
  -- Work completion tracking
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

-- Applications RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (
    applicant_id = auth.uid()::text 
    OR job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()::text)
  );

CREATE POLICY "Workers can create applications"
  ON applications FOR INSERT
  WITH CHECK (applicant_id = auth.uid()::text);

CREATE POLICY "Employers can update application status"
  ON applications FOR UPDATE
  USING (job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()::text));

-- =============================================================================
-- 4. CONVERSATIONS TABLE
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

-- Conversations RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view conversations"
  ON conversations FOR SELECT
  USING (worker_id = auth.uid()::text OR employer_id = auth.uid()::text);

CREATE POLICY "Participants can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (worker_id = auth.uid()::text OR employer_id = auth.uid()::text);

-- =============================================================================
-- 5. MESSAGES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT ('msg_' || substr(md5(random()::text), 1, 10)),
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'photo', 'system')),
  text_content TEXT,
  
  -- For system messages (work status updates)
  system_event TEXT CHECK (system_event IN ('work_started', 'work_completed', 'work_approved', 'work_rejected')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: text messages must have text_content
  CONSTRAINT message_content_check CHECK (
    (message_type = 'text' AND text_content IS NOT NULL) OR
    (message_type = 'photo') OR
    (message_type = 'system' AND system_event IS NOT NULL)
  )
);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

-- Messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants can view messages"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE worker_id = auth.uid()::text OR employer_id = auth.uid()::text
    )
  );

CREATE POLICY "Conversation participants can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()::text AND
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE worker_id = auth.uid()::text OR employer_id = auth.uid()::text
    )
  );

-- =============================================================================
-- 6. JOB PHOTOS TABLE (Before/After photos)
-- =============================================================================
CREATE TABLE IF NOT EXISTS job_photos (
  id TEXT PRIMARY KEY DEFAULT ('photo_' || substr(md5(random()::text), 1, 10)),
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  uploaded_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  photo_type TEXT NOT NULL CHECK (photo_type IN ('before', 'after')),
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  storage_url TEXT, -- Public URL if needed
  
  -- Photo metadata
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job photos indexes
CREATE INDEX IF NOT EXISTS idx_job_photos_application_id ON job_photos(application_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_message_id ON job_photos(message_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_type ON job_photos(photo_type);

-- Job photos RLS
ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Application participants can view photos"
  ON job_photos FOR SELECT
  USING (
    application_id IN (
      SELECT a.id FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.applicant_id = auth.uid()::text OR j.employer_id = auth.uid()::text
    )
  );

CREATE POLICY "Workers can upload photos for their applications"
  ON job_photos FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid()::text AND
    application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()::text)
  );

-- =============================================================================
-- 7. ACHIEVEMENTS TABLE (for gamification)
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
-- 8. USER ACHIEVEMENTS TABLE (tracking earned achievements)
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

-- User achievements RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all achievements"
  ON user_achievements FOR SELECT
  USING (true);

-- =============================================================================
-- 9. SEED DATA - Achievements
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
-- 10. FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 11. HELPFUL VIEWS
-- =============================================================================

-- View for job statistics
CREATE OR REPLACE VIEW job_statistics AS
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

-- View for worker statistics
CREATE OR REPLACE VIEW worker_statistics AS
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
-- SCHEMA COMPLETE
-- =============================================================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Create Storage bucket 'job-photos' via Supabase Dashboard > Storage
-- 3. Set bucket to public with policies for authenticated users
-- =============================================================================
