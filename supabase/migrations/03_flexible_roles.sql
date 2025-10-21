-- =============================================================================
-- FLEXIBLE USER ROLES
-- Description: Allow users to switch between worker and employer roles freely
-- Date: 2025-01-21
-- =============================================================================

-- Remove strict role constraint to allow flexible role switching
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('worker', 'employer'));

-- Add default role for existing users
UPDATE users SET role = 'worker' WHERE role IS NULL OR role NOT IN ('worker', 'employer');