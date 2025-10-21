-- =============================================================================
-- DEVELOPMENT RLS POLICIES FIX
-- Description: Add INSERT policy for users table to allow mock auth registration
-- Date: 2025-01-21
-- =============================================================================

-- Allow user registration (for mock Vipps auth in development)
CREATE POLICY "Allow user registration"
  ON users FOR INSERT
  WITH CHECK (true);

-- Allow users to insert their own achievements
CREATE POLICY "Users can earn achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (user_id = auth.uid()::text OR auth.uid() IS NULL);