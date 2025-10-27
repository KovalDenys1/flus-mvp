-- =============================================================================
-- FLUS MVP - Add Sessions Table
-- Description: Add persistent sessions table to prevent logout on server restart
-- Date: 2025-10-27
-- =============================================================================

-- Create sessions table for persistent authentication
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT ('sess_' || substr(md5(random()::text), 1, 10)),
  token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),

  -- Index for fast token lookup
  CONSTRAINT sessions_token_unique UNIQUE (token)
);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Sessions RLS (permissive for cookie-based auth)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sessions" ON sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create sessions" ON sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete sessions" ON sessions
  FOR DELETE USING (true);

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$;

-- Optional: Clean expired sessions on a schedule (run this manually or via cron)
-- SELECT cleanup_expired_sessions();

-- =============================================================================
-- SESSIONS TABLE CREATED ✅
-- =============================================================================</content>
<parameter name="filePath">c:\Users\Denys\Documents\flus-mvp\supabase\add_sessions_table.sql