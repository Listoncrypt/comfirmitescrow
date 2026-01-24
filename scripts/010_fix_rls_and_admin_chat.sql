-- Migration: Fix RLS policies for deal acceptance and admin chat
-- Run this in Supabase SQL Editor

-- ============================================
-- FIX DEALS RLS - Allow proper read/update
-- ============================================

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can view deals by invite code" ON public.deals;
DROP POLICY IF EXISTS "Users can view deals they participate in" ON public.deals;
DROP POLICY IF EXISTS "Participants can update their deals" ON public.deals;

-- Create comprehensive SELECT policy
CREATE POLICY "Users can view deals" ON public.deals
  FOR SELECT USING (
    -- User is a participant
    seller_id = auth.uid() 
    OR buyer_id = auth.uid()
    -- OR user is admin
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    -- OR deal has invite code (for invite page)
    OR invite_code IS NOT NULL
  );

-- Create UPDATE policy for participants and authenticated users joining
CREATE POLICY "Users can update deals" ON public.deals
  FOR UPDATE USING (
    -- User is a participant
    seller_id = auth.uid() 
    OR buyer_id = auth.uid()
    -- OR user is admin
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    -- OR the deal is being joined (buyer_id or seller_id is null and invite code exists)
    OR (invite_code IS NOT NULL AND (buyer_id IS NULL OR seller_id IS NULL))
  );

-- ============================================
-- FIX MESSAGES RLS - Allow admin to chat
-- ============================================

-- Drop existing message policies
DROP POLICY IF EXISTS "Users can view messages for their deals" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages to their deals" ON public.messages;

-- Allow viewing messages for participants and admins
CREATE POLICY "Users can view messages" ON public.messages
  FOR SELECT USING (
    -- User is participant in the deal
    EXISTS (
      SELECT 1 FROM deals 
      WHERE id = deal_id 
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
    -- OR user is admin
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow inserting messages for participants and admins
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND (
      -- User is participant in the deal
      EXISTS (
        SELECT 1 FROM deals 
        WHERE id = deal_id 
        AND (buyer_id = auth.uid() OR seller_id = auth.uid())
      )
      -- OR user is admin
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- ============================================
-- VERIFY POLICIES
-- ============================================
SELECT policyname, cmd, permissive, qual::text 
FROM pg_policies 
WHERE tablename IN ('deals', 'messages')
ORDER BY tablename, policyname;
