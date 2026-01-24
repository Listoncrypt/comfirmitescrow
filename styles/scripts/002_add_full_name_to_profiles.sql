-- Migration: Add full_name and telegram_handle columns to profiles table
-- This fixes the schema mismatch between database and UI components

-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS telegram_handle TEXT;

-- Migrate existing data: combine first_name and last_name into full_name
UPDATE public.profiles
SET full_name = TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))
WHERE full_name IS NULL AND (first_name IS NOT NULL OR last_name IS NOT NULL);

-- Update the trigger function to handle full_name properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->>> 'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->>> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->>> 'last_name', NULL)
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name);
  RETURN NEW;
END;
$$;

-- Verify the changes
SELECT 
  id, 
  email, 
  full_name, 
  first_name, 
  last_name,
  telegram_handle,
  balance,
  role
FROM public.profiles
LIMIT 5;
