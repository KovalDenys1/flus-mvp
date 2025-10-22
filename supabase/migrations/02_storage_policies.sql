-- =============================================================================
-- FLUS MVP - Storage Policies
-- Description: Configure security policies for Supabase Storage (job photos)
-- Date: 2025-10-22
-- =============================================================================

-- Ensure storage schema exists
CREATE SCHEMA IF NOT EXISTS storage;

-- Note: Storage bucket 'job-photos' must be created manually in Supabase Dashboard
-- Dashboard > Storage > New Bucket:
--   - Name: job-photos
--   - Public: YES
--   - File size limit: 5 MB
--   - Allowed MIME types: image/png, image/jpeg, image/jpg, image/webp

-- =============================================================================
-- STORAGE POLICIES (Permissive for cookie-based auth)
-- =============================================================================

-- Allow anyone to view job photos (public bucket)
CREATE POLICY "Anyone can view job photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'job-photos');

-- Allow anyone to upload job photos
CREATE POLICY "Anyone can upload job photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'job-photos');

-- Allow anyone to update their uploads
CREATE POLICY "Anyone can update job photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'job-photos');

-- Allow anyone to delete job photos
CREATE POLICY "Anyone can delete job photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'job-photos');

-- =============================================================================
-- STORAGE SETUP COMPLETE ✅
-- =============================================================================
-- Security Note: Permissive policies are used because authentication is
-- enforced at the API layer via HTTP-only cookies. The application code
-- validates user sessions before allowing photo uploads/deletes.
-- =============================================================================
