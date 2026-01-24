-- Migration: Add full_name column to profiles and update trigger
-- Run this in Supabase SQL Editor

-- Step 1: Add full_name column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Step 2: Migrate existing data (combine first_name and last_name into full_name)
UPDATE public.profiles 
SET full_name = CONCAT(
  COALESCE(first_name, ''), 
  CASE WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN ' ' ELSE '' END,
  COALESCE(last_name, '')
)
WHERE full_name IS NULL AND (first_name IS NOT NULL OR last_name IS NOT NULL);

-- Step 3: Add telegram_handle column if it doesn't exist (used by settings page)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS telegram_handle TEXT;

-- Step 4: Update the trigger function to handle full_name from signup
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
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- The trigger already exists, it will use the updated function automatically
