-- =====================================================
-- Local Payment Flow - Database Changes (Updated)
-- Run this in Supabase SQL Editor
-- Includes Bank Transfer and USDT payment options
-- =====================================================

-- 1. Add image_url column to messages table for chat images
ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Create admin_settings table for payment details
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insert default bank details (Admin can update these from dashboard)
INSERT INTO admin_settings (key, value) VALUES
  ('bank_name', 'First Bank'),
  ('account_number', '1234567890'),
  ('account_name', 'Confirmit Escrow'),
  ('usdt_network', 'TRC20'),
  ('usdt_wallet_address', ''),
  ('escrow_fee_percent', '2.5'),
  ('payment_methods_enabled', 'bank,usdt')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- 4. Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS: Everyone can read admin settings
DROP POLICY IF EXISTS "Anyone can view admin settings" ON admin_settings;
CREATE POLICY "Anyone can view admin settings"
  ON admin_settings FOR SELECT
  USING (true);

-- 6. RLS: Only admins can update admin settings
DROP POLICY IF EXISTS "Only admins can update settings" ON admin_settings;
CREATE POLICY "Only admins can update settings"
  ON admin_settings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. RLS: Only admins can insert admin settings
DROP POLICY IF EXISTS "Only admins can insert settings" ON admin_settings;
CREATE POLICY "Only admins can insert settings"
  ON admin_settings FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. Grant access
GRANT SELECT, INSERT, UPDATE ON admin_settings TO authenticated;
GRANT SELECT ON admin_settings TO anon;

-- 9. Create storage bucket for chat images if not exists
-- Note: This needs to be done via Supabase Dashboard or API
-- Go to Storage > Create bucket > Name: "chat-images" > Public: Yes

SELECT 'Migration completed! Remember to create chat-images storage bucket in Supabase Dashboard.' as status;
