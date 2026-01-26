-- Enable Withdrawal Cancellation for Users
-- Run this in Supabase SQL Editor

-- 1. Ensure RLS is enabled
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it conflicts (or create new specific one)
DROP POLICY IF EXISTS "Users can cancel their own pending withdrawals" ON public.withdrawals;

-- 3. Create the policy
-- Allows user to UPDATE their own withdrawal ONLY if it is currently 'pending'
-- And they can ONLY change status to 'cancelled' (prevent editing amount/bank details)
CREATE POLICY "Users can cancel their own pending withdrawals" ON public.withdrawals
  FOR UPDATE 
  USING (
    auth.uid() = user_id 
    AND status = 'pending'
  )
  WITH CHECK (
    status = 'cancelled'
  );

-- 4. Ensure Users can INSERT withdrawals (if not already set)
DROP POLICY IF EXISTS "Users can request withdrawals" ON public.withdrawals;
CREATE POLICY "Users can request withdrawals" ON public.withdrawals
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- 5. Ensure Users can VIEW their own withdrawals
DROP POLICY IF EXISTS "Users can view their own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can view their own withdrawals" ON public.withdrawals
  FOR SELECT USING (
    auth.uid() = user_id
  );

SELECT 'Fixed Withdrawal RLS Policies' as status;
