-- =====================================================
-- Create Chat Images Bucket & Policies
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Enable RLS on objects (it usually is enabled by default, but just in case)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can view (read) images in this bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'chat-images' );

-- 4. Policy: Authenticated users can upload images
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'chat-images' );

-- 5. Policy: Users can update/delete their own images (optional, but good practice)
DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
CREATE POLICY "Owner Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'chat-images' AND owner = auth.uid() );

DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'chat-images' AND owner = auth.uid() );

SELECT 'Bucket created and policies applied successfully' as status;
