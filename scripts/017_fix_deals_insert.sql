-- Fix RLS policy to allow users to create deals
-- Run this in Supabase SQL Editor

-- 1. Drop existing INSERT policy if it exists (to start fresh)
DROP POLICY IF EXISTS "Users can create deals" ON public.deals;

-- 2. Create the policy
-- Allows any authenticated user to create a deal as long as they are either the buyer or the seller.
CREATE POLICY "Users can create deals" ON public.deals
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND (
      auth.uid() = seller_id OR auth.uid() = buyer_id
    )
  );

SELECT 'Fixed Deals INSERT Policy' as status;
