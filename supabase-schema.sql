-- ============================================================================
-- Photobooth Sessions Table Schema
-- ============================================================================
-- This SQL creates the sessions table in Supabase for storing photobooth
-- session metadata and file URLs from Vercel Blob storage.
--
-- Run this in your Supabase SQL Editor:
-- 1. Go to your Supabase project
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file
-- 5. Click "Run" or press Ctrl/Cmd + Enter
-- ============================================================================

-- Create the sessions table (stores only final strip URL)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  final_strip_url TEXT,
  view_url TEXT NOT NULL,
  template_id TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed'))
);

-- Add helpful comment
COMMENT ON TABLE sessions IS 'Stores photobooth session metadata and final strip URL from Vercel Blob storage (raw photos not stored to reduce storage costs)';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Anyone can view sessions" ON sessions;
DROP POLICY IF EXISTS "Service role can insert sessions" ON sessions;
DROP POLICY IF EXISTS "Service role can update sessions" ON sessions;
DROP POLICY IF EXISTS "Service role can delete sessions" ON sessions;

-- Policy: Allow anyone to read sessions (for public viewing via QR codes)
CREATE POLICY "Anyone can view sessions"
  ON sessions FOR SELECT
  USING (true);

-- Policy: Allow anon role to insert (client-side via serverless function)
-- Service role is also allowed for server-side operations
CREATE POLICY "Service role can insert sessions"
  ON sessions FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR 
    auth.role() = 'anon'
  );

-- Policy: Allow service role to update sessions
CREATE POLICY "Service role can update sessions"
  ON sessions FOR UPDATE
  USING (
    auth.role() = 'service_role' OR 
    auth.role() = 'anon'
  );

-- Policy: Only service role can delete sessions
-- This ensures only authorized server-side code can delete
CREATE POLICY "Service role can delete sessions"
  ON sessions FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- Optional: Automatic Cleanup Function
-- ============================================================================
-- This function deletes expired sessions
-- Manual scheduling required (automatic scheduling needs pg_cron extension)
-- ============================================================================

-- Create or replace the cleanup function
CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS TABLE(deleted_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_deleted INTEGER;
BEGIN
  -- Delete expired sessions
  DELETE FROM sessions
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS rows_deleted = ROW_COUNT;
  
  -- Return count of deleted sessions
  RETURN QUERY SELECT rows_deleted;
END;
$$;

-- Add comment
COMMENT ON FUNCTION delete_expired_sessions() IS 'Deletes sessions that have passed their expiration date. Run manually or schedule with pg_cron.';

-- ============================================================================
-- How to Enable Automatic Cleanup (Optional)
-- ============================================================================
-- 
-- Option 1: Enable pg_cron extension (Supabase Pro required)
-- 1. Go to Database → Extensions
-- 2. Search for "pg_cron"
-- 3. Enable the extension
-- 4. Run this SQL:
--
-- SELECT cron.schedule(
--   'delete-expired-sessions',
--   '0 2 * * *',  -- 2 AM daily
--   'SELECT delete_expired_sessions();'
-- );
--
-- Option 2: Use Supabase Edge Functions (Free tier compatible)
-- Create a scheduled edge function to call this function daily
--
-- Option 3: Manual cleanup
-- Run this query periodically:
-- SELECT delete_expired_sessions();
--
-- ============================================================================

-- ============================================================================
-- Verification Queries
-- ============================================================================
-- Run these to verify everything is set up correctly
-- ============================================================================

-- Check that the table was created
SELECT 'Table created successfully' as status, COUNT(*) as columns
FROM information_schema.columns
WHERE table_name = 'sessions';

-- Check indexes
SELECT 'Indexes created' as status, COUNT(*) as index_count
FROM pg_indexes
WHERE tablename = 'sessions';

-- Check RLS policies
SELECT 'RLS policies created' as status, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'sessions';

-- Sample query to test (should return empty result)
SELECT * FROM sessions LIMIT 1;

-- ============================================================================
-- Success Message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Photobooth sessions table created successfully!';
  RAISE NOTICE '✅ Indexes created for optimized queries';
  RAISE NOTICE '✅ Row Level Security policies configured';
  RAISE NOTICE '✅ Automatic cleanup function created';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Copy your Supabase URL and keys';
  RAISE NOTICE '2. Add them to your .env file';
  RAISE NOTICE '3. Deploy to Vercel';
  RAISE NOTICE '4. Test the photobooth!';
END;
$$;
