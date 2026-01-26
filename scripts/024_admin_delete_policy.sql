-- Enable RLS on profiles if not already enabled (it should be)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to delete any profile
-- Note: This requires the user to have the 'admin' role in the profiles table
CREATE POLICY "Admins can delete any profile"
ON profiles
FOR DELETE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Policy to allow admins to update any profile (if missing)
-- This is needed for editing bank details, balance, etc.
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
