-- Fix RLS policies for cookie-based authentication
-- Security is enforced at API layer via session cookies

-- Jobs table
DROP POLICY IF EXISTS "Employers can create jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can update own jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can delete own jobs" ON jobs;
DROP POLICY IF EXISTS "Anyone can view open jobs" ON jobs;
DROP POLICY IF EXISTS "Anyone can view jobs" ON jobs;
DROP POLICY IF EXISTS "Allow job creation" ON jobs;
DROP POLICY IF EXISTS "Allow job updates" ON jobs;
DROP POLICY IF EXISTS "Allow job deletion" ON jobs;

CREATE POLICY "Anyone can view jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Allow job creation" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow job updates" ON jobs FOR UPDATE USING (true);
CREATE POLICY "Allow job deletion" ON jobs FOR DELETE USING (true);

-- Applications table
DROP POLICY IF EXISTS "Workers can view own applications" ON applications;
DROP POLICY IF EXISTS "Workers can create applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for own jobs" ON applications;

CREATE POLICY "Allow application read" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow application creation" ON applications FOR INSERT WITH CHECK (true);

-- CV Entries
DROP POLICY IF EXISTS "Users can manage own CV entries" ON cv_entries;
CREATE POLICY "Allow CV management" ON cv_entries FOR ALL USING (true);

-- Skills
DROP POLICY IF EXISTS "Users can manage own skills" ON skills;
CREATE POLICY "Allow skills management" ON skills FOR ALL USING (true);

-- Users
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Allow profile updates" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow user creation" ON users FOR INSERT WITH CHECK (true);
