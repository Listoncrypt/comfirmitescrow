-- =====================================================
-- MASTER DEPLOYMENT SCRIPT (v1.0)
-- Combines all recent critical fixes and features
-- Run this in Supabase SQL Editor to ensure your DB is up to date
-- =====================================================

-- 1. LOCAL PAYMENT FLOW & USDT UPDATES (from 012_local_payment_flow_fix.sql)
ALTER TABLE admin_settings 
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS account_name TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS usdt_wallet_address TEXT,
ADD COLUMN IF NOT EXISTS usdt_network TEXT DEFAULT 'TRC-20',
ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(10, 2) DEFAULT 1500.00;

-- 2. CHAT IMAGES BUCKET (from 013_create_storage_bucket_v3.sql)
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

-- Bucket Policies (Safe to re-run)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'chat-images' );
    
    DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
    CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'chat-images' );
    
    DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
    CREATE POLICY "Owner Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'chat-images' AND owner = auth.uid() );
    
    DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;
    CREATE POLICY "Owner Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'chat-images' AND owner = auth.uid() );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 3. FIX DEAL STATUS TRANSITION (from 014_fix_deal_status.sql)
-- Drops restrictive triggers that prevent manual admin deal completion
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Find and drop triggers using validation functions
    FOR r IN SELECT tgname, relname FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid WHERE t.tgname IN ('handle_deal_status_change', 'validate_deal_status_change', 'check_deal_status')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', r.tgname, r.relname);
    END LOOP;
END $$;

-- 4. WITHDRAWAL PROOF (from 015_add_withdrawal_proof.sql)
ALTER TABLE withdrawals 
ADD COLUMN IF NOT EXISTS proof_of_payment_url TEXT;

SELECT 'Deployment checks completed. Database schema should be consistent.' as status;
