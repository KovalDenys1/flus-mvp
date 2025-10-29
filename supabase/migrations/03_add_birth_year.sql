-- =============================================================================
-- FLUS MVP - Add birth_year to users table
-- Description: Add birth_year field for age verification
-- Date: 2025-10-29
-- =============================================================================

-- Add birth_year column to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_year INTEGER;

-- Add check constraint for reasonable birth years
ALTER TABLE users DROP CONSTRAINT IF EXISTS birth_year_check;
ALTER TABLE users ADD CONSTRAINT birth_year_check
  CHECK (birth_year IS NULL OR (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE)));

-- Add comment
COMMENT ON COLUMN users.birth_year IS 'Birth year for age verification (users must be 18+)';

-- Create index for potential age-based queries
CREATE INDEX IF NOT EXISTS idx_users_birth_year ON users(birth_year);