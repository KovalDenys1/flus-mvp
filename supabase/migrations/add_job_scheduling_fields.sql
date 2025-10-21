-- Add new fields to jobs table for enhanced scheduling
-- Migration: Add scheduling and location fields
-- Date: 2025-10-21

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS schedule_type TEXT CHECK (schedule_type IN ('flexible', 'fixed', 'deadline'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_type TEXT CHECK (payment_type IN ('fixed', 'hourly')) DEFAULT 'fixed';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS requirements TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_schedule_type ON jobs(schedule_type);
CREATE INDEX IF NOT EXISTS idx_jobs_start_time ON jobs(start_time);
CREATE INDEX IF NOT EXISTS idx_jobs_end_time ON jobs(end_time);

-- Add comments for documentation
COMMENT ON COLUMN jobs.address IS 'Full address of the job location';
COMMENT ON COLUMN jobs.schedule_type IS 'Type of scheduling: flexible (start anytime), fixed (specific time range), deadline (complete by date)';
COMMENT ON COLUMN jobs.start_time IS 'When the job should start (optional for flexible)';
COMMENT ON COLUMN jobs.end_time IS 'When the job must be completed';
COMMENT ON COLUMN jobs.payment_type IS 'Payment structure: fixed price or hourly rate';
COMMENT ON COLUMN jobs.requirements IS 'Special requirements or instructions for the job';
