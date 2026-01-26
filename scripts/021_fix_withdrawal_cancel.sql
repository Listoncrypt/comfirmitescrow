-- 021_fix_withdrawal_cancel.sql
-- Run this in Supabase SQL Editor to fix cancellation issue

-- 1. Add 'cancelled' to the enum if needed (Ignore error if exists, usually ALTER TYPE ADD VALUE IF NOT EXISTS is valid in PG 12+)
ALTER TYPE public.withdrawal_status ADD VALUE IF NOT EXISTS 'cancelled';

-- 2. Explicitly Grant UPDATE Permission
GRANT UPDATE ON public.withdrawals TO authenticated;

-- 2. Ensure RLS is enabled
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- 3. Recreate the Cancellation Policy
DROP POLICY IF EXISTS "Users can cancel their own pending withdrawals" ON public.withdrawals;

CREATE POLICY "Users can cancel their own pending withdrawals" ON public.withdrawals
  FOR UPDATE 
  USING (
    auth.uid() = user_id 
    AND status = 'pending'
  )
  WITH CHECK (
    status = 'cancelled'
  );

-- 4. Verify existing policies
-- Ensure Insert is allowed too
DROP POLICY IF EXISTS "Users can request withdrawals" ON public.withdrawals;
CREATE POLICY "Users can request withdrawals" ON public.withdrawals
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can view their own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can view their own withdrawals" ON public.withdrawals
  FOR SELECT USING (
    auth.uid() = user_id
  );

SELECT 'Applied Withdrawal Permission Fixes' as status;
