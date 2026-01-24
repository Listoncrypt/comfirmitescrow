-- =====================================================
-- Create Chat Images Bucket & Policies (v3 - Image Only Restriction)
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create/Update the bucket with image restriction
-- We use allowed_mime_types to restrict uploads to images only
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
    'chat-images', 
    'chat-images', 
    true, 
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    5242880 -- 5MB limit
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    file_size_limit = 5242880;

-- 2. Policy: Anyone can view (read) images in this bucket
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'chat-images' );
EXCEPTION
    WHEN OTHERS THEN NULL;
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

SELECT 'Bucket configured to accept ONLY images (JPEG, PNG, GIF, WebP) max 5MB.' as status;
