-- Migration: Add inspection period and update currency to NGN
-- Run this in Supabase SQL Editor

-- Add inspection period column to deals table
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS inspection_period_days INTEGER DEFAULT 3;

-- Update default currency from USD to NGN
ALTER TABLE public.deals 
ALTER COLUMN currency SET DEFAULT 'NGN';

-- Update existing deals to use NGN if they're using USD or USDT
UPDATE public.deals 
SET currency = 'NGN' 
WHERE currency IN ('USD', 'USDT');

-- Add inspection_ends_at column to track when inspection period ends
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS inspection_ends_at TIMESTAMPTZ;

-- Verify columns exist
SELECT 'Inspection period columns added successfully' as status;
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'deals'
  AND column_name IN ('inspection_period_days', 'inspection_ends_at', 'currency')
ORDER BY column_name;
