-- Fix: Admin Settings RLS Policy and Table Structure
-- Run this in Supabase SQL Editor

-- Check if admin_settings has the correct columns
-- If they don't exist, add them
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_settings' 
    AND column_name = 'escrow_bank_name'
  ) THEN
    -- The table might have a different structure, check and alter
    ALTER TABLE public.admin_settings 
    ADD COLUMN IF NOT EXISTS escrow_bank_name TEXT,
    ADD COLUMN IF NOT EXISTS escrow_account_number TEXT,
    ADD COLUMN IF NOT EXISTS escrow_account_name TEXT,
    ADD COLUMN IF NOT EXISTS escrow_instructions TEXT,
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Drop existing RLS policies for admin_settings
DROP POLICY IF EXISTS "Anyone can view admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admins can update admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admins can insert admin settings" ON public.admin_settings;

-- Recreate RLS policies with proper permissions
CREATE POLICY "Anyone can view admin settings" ON public.admin_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update admin settings" ON public.admin_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert admin settings" ON public.admin_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Make sure there's at least one row in admin_settings
INSERT INTO public.admin_settings (escrow_bank_name, escrow_account_number, escrow_account_name, escrow_instructions)
SELECT 'First Bank', '1234567890', 'Confirmit Escrow Ltd', 'Please use your deal ID as payment reference.'
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings LIMIT 1);

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'admin_settings';

-- Show current data
SELECT * FROM public.admin_settings LIMIT 1;
