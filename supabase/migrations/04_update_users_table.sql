-- =============================================================================
-- FLUS MVP - Update users table with missing columns
-- Description: Add missing columns to existing users table
-- Date: 2025-10-29
-- =============================================================================

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fodselsdato TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_approve_applications BOOLEAN DEFAULT false;

-- Add new profile columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_org_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_worker BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_employer BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vipps_sub TEXT;

-- Add indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_worker ON users(is_worker);
CREATE INDEX IF NOT EXISTS idx_users_is_employer ON users(is_employer);

-- Add check constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS role_check;
ALTER TABLE users ADD CONSTRAINT role_check CHECK (role IN ('worker', 'employer'));

ALTER TABLE users DROP CONSTRAINT IF EXISTS email_format_check;
ALTER TABLE users ADD CONSTRAINT email_format_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add comments
COMMENT ON COLUMN users.password_hash IS 'Hashed password for authentication';
COMMENT ON COLUMN users.fodselsdato IS 'Birth date (legacy field, use birth_year instead)';
COMMENT ON COLUMN users.auto_approve_applications IS 'Auto-approve job applications (for employers)';
COMMENT ON COLUMN users.bio IS 'User biography/description';
COMMENT ON COLUMN users.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN users.github_url IS 'GitHub profile URL';
COMMENT ON COLUMN users.website_url IS 'Personal/company website URL';
COMMENT ON COLUMN users.company_name IS 'Company name (for employers)';
COMMENT ON COLUMN users.company_org_number IS 'Company organization number';
COMMENT ON COLUMN users.is_worker IS 'User is registered as worker';
COMMENT ON COLUMN users.is_employer IS 'User is registered as employer';
COMMENT ON COLUMN users.vipps_sub IS 'Vipps subscription identifier';

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users table
DROP POLICY IF EXISTS "users_own_data" ON users;
CREATE POLICY "users_own_data" ON users FOR ALL USING (auth.uid()::text = id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON users TO anon, authenticated, service_role;