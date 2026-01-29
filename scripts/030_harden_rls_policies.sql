-- Secure Profiles RLS
-- Prevent users from updating their own balance or role directly via API

-- 1. Drop existing permissive update policy if exists (guessing the name, or usually 'Users can update own profile')
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own data" ON profiles;

-- 2. Create restricted update policy
-- Allows users to update everything EXCEPT balance and role
-- We achieve this by checking that the NEW balance/role matches the OLD balance/role
-- OR better yet, we can use a separate function or just logic. 
-- Supabase doesn't support "FOR UPDATE OF (col1, col2)" in Policies directly easily without quirks.
-- A Check constraint or Trigger is stronger, but RLS `WITH CHECK` is simplest.

CREATE POLICY "Users can update own basic info" ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND (
     -- Preventing changes to protected columns by ensuring NEW value = OLD value
     -- Note: Accessing OLD values in RLS check is tricky.
     -- Easier approach: Trigger.
     -- BUT for this task, we will just start by revoking UPDATE for public/anon 
     -- and relying on the fact that our App uses Server Actions for sensitive stuff.
     -- Wait, nextjs createClient() uses the user's token. So they DO have update rights.
     
     -- Let's stick to a Trigger for maximum security.
     -- RLS is good for Row isolation. Triggers are good for Column protection.
     true
  )
);

-- Trigger to protect sensitive columns
CREATE OR REPLACE FUNCTION protect_sensitive_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user is NOT a service_role (superuser) AND they try to change balance/role
  -- (We can check current_role or just assume app logic)
  -- For specific logical check:
  
  IF (NEW.balance IS DISTINCT FROM OLD.balance) OR (NEW.role IS DISTINCT FROM OLD.role) THEN
     -- Allow if it's a System function (SECURITY DEFINER functions bypass this if owner is superuser)
     -- But normal direct updates via API should fail.
     -- Since we moved `fundDeal` to use `deduct_balance` (RPC), that RPC runs as Owner (Admin).
     -- So that will SUCCEED.
     -- A direct `supabase.from('profiles').update({balance: 999999})` from client will run as Authenticated User.
     -- So we just need to check if the current execution context is 'authenticated'.
     
     IF (auth.role() = 'authenticated') THEN
        RAISE EXCEPTION 'You are not authorized to directly update balance or role.';
     END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_profile_updates ON profiles;

CREATE TRIGGER protect_profile_updates
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_sensitive_columns();
