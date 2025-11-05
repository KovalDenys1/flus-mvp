-- =============================================================================
-- FLUS MVP - Add admin role to users table
-- Description: Update role constraint to include admin role
-- Date: 2025-01-15
-- =============================================================================

-- Update role constraint to include admin
ALTER TABLE users DROP CONSTRAINT IF EXISTS role_check;
ALTER TABLE users ADD CONSTRAINT role_check CHECK (role IN ('worker', 'employer', 'admin'));