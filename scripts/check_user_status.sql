-- Diagnostic: Check User Status
-- Run this in Supabase SQL Editor to see what's blocking dashboard access

-- 1. Check auth users table
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 2. Check profiles table
SELECT 
  id,
  email,
  full_name,
  first_name,
  last_name,
  role,
  account_status,
  balance,
  telegram_handle
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;

-- 3. Find users without profiles (THIS IS THE LIKELY ISSUE)
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  'NO PROFILE FOUND' as issue
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
LIMIT 10;
