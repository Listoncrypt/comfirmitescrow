-- Migration: Fix RLS policies for deal updates (cancel, etc.)
-- Run this in Supabase SQL Editor

-- First, drop the restrictive update policy
DROP POLICY IF EXISTS "Sellers can update own draft deals" ON public.deals;

-- Create a more flexible update policy for deal participants
-- This allows buyers and sellers to update deals they're part of
-- The actual business logic (what can be updated) is enforced in the server actions
CREATE POLICY "Participants can update their deals" ON public.deals
  FOR UPDATE
  USING (
    -- User is the seller OR the buyer
    seller_id = auth.uid() OR buyer_id = auth.uid()
  );

-- Also ensure there's a policy for viewing deals
DROP POLICY IF EXISTS "Users can view deals they participate in" ON public.deals;
CREATE POLICY "Users can view deals they participate in" ON public.deals
  FOR SELECT USING (
    seller_id = auth.uid() 
    OR buyer_id = auth.uid()
    OR invite_code IS NOT NULL  -- Allow viewing via invite link
  );

-- Verify the policies
SELECT policyname, cmd, permissive, qual::text 
FROM pg_policies 
WHERE tablename = 'deals'
ORDER BY policyname;
