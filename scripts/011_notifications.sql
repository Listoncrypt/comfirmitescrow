-- =====================================================
-- Notifications System
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- System can insert notifications (via trigger or service role)
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (TRUE);

-- Function to create notifications when a message is sent
CREATE OR REPLACE FUNCTION notify_on_new_message()
RETURNS TRIGGER AS $$
DECLARE
  deal_record RECORD;
  admin_record RECORD;
  sender_name TEXT;
  deal_title TEXT;
BEGIN
  -- Get deal info
  SELECT * INTO deal_record FROM deals WHERE id = NEW.deal_id;
  
  -- Get sender name
  SELECT COALESCE(full_name, email, 'Someone') INTO sender_name 
  FROM profiles WHERE id = NEW.sender_id;
  
  -- Get deal title
  deal_title := COALESCE(deal_record.title, 'a deal');
  
  -- Notify buyer (if not the sender)
  IF deal_record.buyer_id IS NOT NULL AND deal_record.buyer_id != NEW.sender_id THEN
    INSERT INTO notifications (user_id, deal_id, message_id, title, content)
    VALUES (
      deal_record.buyer_id,
      NEW.deal_id,
      NEW.id,
      'New message in ' || deal_title,
      sender_name || ': ' || LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END
    );
  END IF;
  
  -- Notify seller (if not the sender)
  IF deal_record.seller_id IS NOT NULL AND deal_record.seller_id != NEW.sender_id THEN
    INSERT INTO notifications (user_id, deal_id, message_id, title, content)
    VALUES (
      deal_record.seller_id,
      NEW.deal_id,
      NEW.id,
      'New message in ' || deal_title,
      sender_name || ': ' || LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END
    );
  END IF;
  
  -- Notify all admins (except if sender is admin)
  FOR admin_record IN 
    SELECT id FROM profiles WHERE role = 'admin' AND id != NEW.sender_id
  LOOP
    INSERT INTO notifications (user_id, deal_id, message_id, title, content)
    VALUES (
      admin_record.id,
      NEW.deal_id,
      NEW.id,
      '[Admin] New message in ' || deal_title,
      sender_name || ': ' || LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new messages
DROP TRIGGER IF EXISTS on_new_message_notify ON messages;
CREATE TRIGGER on_new_message_notify
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_new_message();

-- Verify notifications table created
SELECT 'Notifications system created successfully!' as status;
