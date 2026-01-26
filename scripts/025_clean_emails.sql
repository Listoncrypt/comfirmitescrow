-- Ensure all emails in profiles are trimmed and lowercased for consistency
UPDATE profiles 
SET email = LOWER(TRIM(email)) 
WHERE email IS NOT NULL;

-- Function to handle new user creation (ensuring email is clean)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    'user', 
    LOWER(TRIM(new.email))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
