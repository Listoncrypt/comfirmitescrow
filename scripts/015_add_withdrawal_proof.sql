-- =====================================================
-- Add Proof of Payment to Withdrawals
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add column to withdrawals table
ALTER TABLE withdrawals 
ADD COLUMN IF NOT EXISTS proof_of_payment_url TEXT;

-- 2. (Optional) Create a specific folder structure policy? 
-- We'll reuse 'chat-images' bucket for now as it's already set up and public.

SELECT 'Added proof_of_payment_url column to withdrawals table.' as status;
