-- =============================================================================
-- FLUS MVP - Addresses Table
-- Description: Create addresses table for street name autocomplete
-- Date: 2025-11-05
-- =============================================================================

-- =============================================================================
-- ADDRESSES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY DEFAULT ('addr_' || substr(md5(random()::text), 1, 10)),
  city TEXT NOT NULL,
  street_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses indexes for fast search
CREATE INDEX IF NOT EXISTS idx_addresses_city ON addresses(city);
CREATE INDEX IF NOT EXISTS idx_addresses_street_name ON addresses(street_name);
CREATE INDEX IF NOT EXISTS idx_addresses_city_street ON addresses(city, street_name);

-- Enable case-insensitive search with GIN index
CREATE INDEX IF NOT EXISTS idx_addresses_street_name_gin ON addresses USING gin(street_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_addresses_city_gin ON addresses USING gin(city gin_trgm_ops);

-- Enable trigram extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================================================
-- ENABLE RLS
-- =============================================================================
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES (read-only for all users)
-- =============================================================================
DROP POLICY IF EXISTS "addresses_select_policy" ON addresses;
CREATE POLICY "addresses_select_policy" ON addresses FOR SELECT USING (true);

-- =============================================================================
-- UPDATE TRIGGER
-- =============================================================================
DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
CREATE TRIGGER update_addresses_updated_at 
  BEFORE UPDATE ON addresses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================
GRANT SELECT ON addresses TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON addresses TO service_role;

-- =============================================================================
-- ADDRESSES TABLE COMPLETE ✅
-- =============================================================================
