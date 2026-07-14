-- ============================================
-- SIMPLE MIGRATION: Update working hours from VARCHAR to TIME
-- Version: V2
-- ============================================

-- Step 1: Add new TIME columns
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS working_hours_start TIME,
ADD COLUMN IF NOT EXISTS working_hours_end TIME;

-- Step 2: Drop old working_hours column
ALTER TABLE jobs
DROP COLUMN IF EXISTS working_hours;

-- Step 3: Add indexes
CREATE INDEX IF NOT EXISTS idx_jobs_working_hours_start ON jobs(working_hours_start);
CREATE INDEX IF NOT EXISTS idx_jobs_working_hours_end ON jobs(working_hours_end);
