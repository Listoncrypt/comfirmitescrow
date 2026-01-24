-- Migration: Add missing columns to deals table
-- Run this in Supabase SQL Editor

-- Add counterparty_email column for storing invited party's email
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS counterparty_email TEXT;

-- Add timestamp columns for tracking deal lifecycle
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS funded_at TIMESTAMPTZ;

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS disputed_at TIMESTAMPTZ;

-- Add disputed_by to track who opened the dispute
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS disputed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add new status values that the code expects
-- First, we need to add new enum values if they don't exist
DO $$ BEGIN
  -- Add pending_seller status
  ALTER TYPE deal_status ADD VALUE IF NOT EXISTS 'pending_seller';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  -- Add pending_buyer status  
  ALTER TYPE deal_status ADD VALUE IF NOT EXISTS 'pending_buyer';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  -- Add funded status
  ALTER TYPE deal_status ADD VALUE IF NOT EXISTS 'funded';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create index on counterparty_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_deals_counterparty_email ON public.deals(counterparty_email);

-- Update the RLS policy to allow users to view deals where they are invited
DROP POLICY IF EXISTS "Users can view deals they participate in" ON public.deals;
CREATE POLICY "Users can view deals they participate in" ON public.deals
  FOR SELECT USING (
    seller_id = auth.uid() 
    OR buyer_id = auth.uid()
    OR counterparty_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Allow users to join deals via invite code
DROP POLICY IF EXISTS "Users can join deals via invite" ON public.deals;
CREATE POLICY "Users can join deals via invite" ON public.deals
  FOR UPDATE USING (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    -- And either already a participant or the invited counterparty
    AND (
      seller_id = auth.uid() 
      OR buyer_id = auth.uid()
      OR counterparty_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      -- Or the deal is pending and they're joining via invite code
      OR (status IN ('pending_seller', 'pending_buyer', 'draft', 'awaiting_buyer'))
    )
  );

-- Verify the changes
DO $$
DECLARE
  col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO col_count 
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'deals' 
    AND column_name = 'counterparty_email';
  
  IF col_count > 0 THEN
    RAISE NOTICE 'SUCCESS: counterparty_email column exists';
  ELSE
    RAISE EXCEPTION 'FAILED: counterparty_email column was not created';
  END IF;
END $$;

SELECT 'Migration complete! The following columns were added to deals table:' as status;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'deals'
  AND column_name IN ('counterparty_email', 'funded_at', 'delivered_at', 'completed_at', 'disputed_at', 'disputed_by')
ORDER BY column_name;
