-- Fix: Infinite Recursion in RLS Policies
-- Run this in Supabase SQL Editor

-- Step 1: Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Step 2: Create a security definer function to check admin status
-- This avoids the recursion by using SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Step 3: Recreate admin policies using the function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    public.is_admin()
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    public.is_admin()
  );

-- Step 4: Also fix the trigger function to use the correct JSON operator
-- The ->>> operator doesn't exist, should use ->>
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 
             CONCAT(
               COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
               ' ',
               COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
             ))
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

-- Step 5: Verify the fix by checking if profiles table has the full_name column
-- If not, add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'telegram_handle'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN telegram_handle TEXT;
  END IF;
END $$;

-- Step 6: Show current profiles to verify
SELECT id, email, full_name, role, balance FROM public.profiles LIMIT 5;
