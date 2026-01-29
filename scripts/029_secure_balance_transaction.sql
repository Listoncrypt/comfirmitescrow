-- Secure Balance Transaction Function
-- improved security: ATOMIC update to prevent race conditions (double spending)
-- improved security: SECURITY DEFINER allows it to run with elevated privileges, 
-- so we can revoke direct UPDATE access from users later.

CREATE OR REPLACE FUNCTION deduct_balance(user_id UUID, amount DECIMAL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as the creator (admin), bypassing RLS for the update
SET search_path = public -- Secure search path
AS $$
DECLARE
  current_bal DECIMAL;
  new_bal DECIMAL;
BEGIN
  -- 1. Lock the row for update to prevent concurrent modifications
  SELECT balance INTO current_bal
  FROM profiles
  WHERE id = user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'User not found');
  END IF;

  -- 2. Check sufficient funds
  IF current_bal < amount THEN
    RETURN jsonb_build_object('error', 'Insufficient funds');
  END IF;

  -- 3. Update balance
  new_bal := current_bal - amount;
  
  UPDATE profiles
  SET balance = new_bal
  WHERE id = user_id;

  RETURN jsonb_build_object('success', true, 'new_balance', new_bal);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION deduct_balance(UUID, DECIMAL) TO authenticated;
