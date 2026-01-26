-- 023_fix_permissions.sql
-- Run this AFTER 022_add_enum_value.sql

-- 1. Explicitly Grant UPDATE Permission
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

-- 4. Verify/Recreate other policies
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

SELECT 'Permissions and Policies Applied' as status;
