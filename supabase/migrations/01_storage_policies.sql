-- =============================================================================
-- STORAGE BUCKET POLICIES FOR JOB PHOTOS
-- Description: Storage configuration for before/after job photos
-- Note: You must create the bucket 'job-photos' manually first via Dashboard
-- =============================================================================

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- Allow authenticated users to upload photos to their own folder
CREATE POLICY "Users can upload photos to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'job-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read photos from applications they're part of
CREATE POLICY "Users can view photos from their applications"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'job-photos'
);

-- Allow users to delete their own uploaded photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'job-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own photos metadata
CREATE POLICY "Users can update own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'job-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================================================
-- NOTES FOR MANUAL SETUP IN SUPABASE DASHBOARD:
-- =============================================================================
-- 
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create new bucket: 'job-photos'
-- 3. Settings for bucket:
--    - Public bucket: YES (so URLs work without auth)
--    - File size limit: 5MB (recommended)
--    - Allowed MIME types: image/jpeg, image/png, image/webp
-- 
-- 4. Folder structure will be:
--    job-photos/
--      └── {user_id}/
--          └── {application_id}/
--              ├── before_001.jpg
--              ├── before_002.jpg
--              ├── after_001.jpg
--              └── after_002.jpg
--
-- =============================================================================
