-- =====================================================
-- Create Chat Images Bucket & Policies (v2 - Permission Fix)
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create the bucket (Try to insert, do nothing if exists)
-- Note: If this fails with permission error, you must create the bucket in Dashboard -> Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Policy: Anyone can view (read) images in this bucket
-- We use DO blocks to avoid errors if policies already exist
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'chat-images' );
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignore errors if policy creation fails (e.g. permission issues)
END $$;

-- 3. Policy: Authenticated users can upload images
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
    CREATE POLICY "Authenticated Upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK ( bucket_id = 'chat-images' );
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 4. Policy: Users can update/delete their own images
DO $$
BEGIN
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
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

SELECT 'Tried to create bucket. If this failed, please create "chat-images" bucket manually in Supabase Dashboard.' as status;
