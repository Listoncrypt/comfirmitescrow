-- Fix Deals Table Constraints to allow Invitations
-- Run this in Supabase SQL Editor

-- 1. Modify columns to allow NULL (so you can create a deal without the other person joining yet)
ALTER TABLE public.deals ALTER COLUMN seller_id DROP NOT NULL;
ALTER TABLE public.deals ALTER COLUMN buyer_id DROP NOT NULL;

-- 2. Add constraint to ensure AT LEAST ONE party is present (prevent orphan deals)
ALTER TABLE public.deals DROP CONSTRAINT IF EXISTS deals_participants_check;
ALTER TABLE public.deals ADD CONSTRAINT deals_participants_check 
  CHECK (seller_id IS NOT NULL OR buyer_id IS NOT NULL);

SELECT 'Fixed Deals Schema Constraints' as status;
