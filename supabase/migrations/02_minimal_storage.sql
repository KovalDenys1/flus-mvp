-- =============================================================================
-- FLUS MVP - Storage Policies (Minimal)
-- Description: Configure security policies for Supabase Storage
-- Date: 2025-10-29
-- =============================================================================

-- Note: Create 'job-photos' bucket manually in Supabase Dashboard first
-- Bucket settings: Public, 5MB limit, image MIME types only

-- Storage policies (permissive - security enforced at API layer)
DROP POLICY IF EXISTS "job_photos_select" ON storage.objects;
CREATE POLICY "job_photos_select" ON storage.objects FOR SELECT USING (bucket_id = 'job-photos');

DROP POLICY IF EXISTS "job_photos_insert" ON storage.objects;
CREATE POLICY "job_photos_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'job-photos');

DROP POLICY IF EXISTS "job_photos_update" ON storage.objects;
CREATE POLICY "job_photos_update" ON storage.objects FOR UPDATE USING (bucket_id = 'job-photos');

DROP POLICY IF EXISTS "job_photos_delete" ON storage.objects;
CREATE POLICY "job_photos_delete" ON storage.objects FOR DELETE USING (bucket_id = 'job-photos');