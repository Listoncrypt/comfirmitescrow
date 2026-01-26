-- Add bank details to profiles table
-- These are set during registration and used for withdrawals

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS account_name TEXT;

-- Verify
SELECT * FROM information_schema.columns WHERE table_name = 'profiles';
