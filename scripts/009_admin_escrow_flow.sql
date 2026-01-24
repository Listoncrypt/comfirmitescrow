-- Migration: Add columns for admin-controlled escrow flow
-- Run this in Supabase SQL Editor

-- Add columns to deals table for admin completion
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(15, 2) DEFAULT 0;

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES public.profiles(id);

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES public.profiles(id);

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS admin_resolution TEXT;

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

-- Add columns to withdrawals table
ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS withdrawal_type TEXT DEFAULT 'bank';

ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS crypto_type TEXT;

ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS withdrawal_fee DECIMAL(15, 2) DEFAULT 0;

ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS amount_sent DECIMAL(15, 2);

ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Rename column if it exists with different name
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'withdrawals' AND column_name = 'admin_notes') THEN
    -- Column exists, no action needed
    NULL;
  ELSE
    ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS admin_notes TEXT;
  END IF;
END $$;

-- Update withdrawal status enum to include 'successful' if not exists
-- Note: PostgreSQL doesn't easily support IF NOT EXISTS for enum values
-- So we use a DO block with exception handling
DO $$ BEGIN
  ALTER TYPE withdrawal_status ADD VALUE IF NOT EXISTS 'successful';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE withdrawal_status ADD VALUE IF NOT EXISTS 'cancelled';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Verify columns were added
SELECT 'Migration complete. Columns added for admin-controlled escrow flow.' as status;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'deals'
  AND column_name IN ('platform_fee', 'completed_by', 'cancelled_by', 'cancelled_at', 'admin_resolution', 'resolved_at')
ORDER BY column_name;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'withdrawals'
  AND column_name IN ('withdrawal_type', 'wallet_address', 'crypto_type', 'withdrawal_fee', 'amount_sent', 'rejection_reason')
ORDER BY column_name;
