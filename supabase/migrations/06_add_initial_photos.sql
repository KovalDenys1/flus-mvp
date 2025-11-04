-- Add initial_photos field to jobs table
ALTER TABLE jobs ADD COLUMN initial_photos JSONB DEFAULT '[]'::jsonb;

-- Update RLS policy if needed (already permissive)