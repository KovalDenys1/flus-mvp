-- =============================================================================
-- SUPPORT TICKETS TABLE
-- Description: Add support tickets table for customer support system
-- Date: 2025-11-03
-- =============================================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY DEFAULT ('support_' || substr(md5(random()::text), 1, 8)),
  worker_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support tickets indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_worker_id ON support_tickets(worker_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "support_tickets_select_policy" ON support_tickets;
CREATE POLICY "support_tickets_select_policy" ON support_tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "support_tickets_insert_policy" ON support_tickets;
CREATE POLICY "support_tickets_insert_policy" ON support_tickets FOR INSERT WITH CHECK (auth.uid()::text = worker_id);

DROP POLICY IF EXISTS "support_tickets_update_policy" ON support_tickets;
CREATE POLICY "support_tickets_update_policy" ON support_tickets FOR UPDATE USING (true);

-- Add to updated_at trigger
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets;
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON support_tickets TO service_role;
GRANT SELECT, INSERT ON support_tickets TO anon, authenticated;