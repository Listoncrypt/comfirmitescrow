-- =====================================================
-- Local Payment Flow - FIX (Single Row Schema)
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add image_url column to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Add USDT columns to admin_settings table
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS usdt_network TEXT DEFAULT 'TRC20';
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS usdt_wallet_address TEXT DEFAULT '';

-- 3. Ensure we have at least one row in admin_settings
INSERT INTO admin_settings (
  id, 
  escrow_bank_name, 
  escrow_account_number, 
  escrow_account_name,
  escrow_instructions,
  usdt_network,
  usdt_wallet_address
)
SELECT 
  uuid_generate_v4(), 
  'First Bank', 
  '1234567890', 
  'Confirmit Escrow',
  'Please reference Deal ID.',
  'TRC20',
  ''
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);

-- 4. Create storage bucket for chat images (Idempotent check not easily possible in pure SQL without extensions, so just a reminder)
-- Reminder: Create 'chat-images' bucket in Supabase Dashboard -> Storage if it doesn't exist.

SELECT 'Migration completed successfully' as status;
