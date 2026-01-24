-- Confirmit Escrow Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMs
DO $$ BEGIN
  CREATE TYPE deal_status AS ENUM (
    'draft',
    'awaiting_buyer',
    'awaiting_payment',
    'in_escrow',
    'delivered',
    'completed',
    'disputed',
    'cancelled',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('restricted', 'active', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE withdrawal_status AS ENUM ('pending', 'successful', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  account_status account_status DEFAULT 'active' NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Deals table
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,
  status deal_status DEFAULT 'draft' NOT NULL,
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex') NOT NULL,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  payment_proof_url TEXT,
  delivery_proof_url TEXT,
  dispute_reason TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Messages table (for deal chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Withdrawals table
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  status withdrawal_status DEFAULT 'pending' NOT NULL,
  admin_notes TEXT,
  processed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Admin settings table (singleton)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escrow_bank_name TEXT NOT NULL,
  escrow_account_number TEXT NOT NULL,
  escrow_account_name TEXT NOT NULL,
  escrow_instructions TEXT,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Admin audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deals_seller_id ON public.deals(seller_id);
CREATE INDEX IF NOT EXISTS idx_deals_buyer_id ON public.deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_invite_code ON public.deals(invite_code);
CREATE INDEX IF NOT EXISTS idx_messages_deal_id ON public.messages(deal_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON public.admin_audit_log(admin_id);

-- Insert default admin settings if not exists
INSERT INTO public.admin_settings (escrow_bank_name, escrow_account_number, escrow_account_name, escrow_instructions)
SELECT 'First Bank', '1234567890', 'Confirmit Escrow Ltd', 'Please use your deal ID as payment reference.'
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS deals_updated_at ON public.deals;
CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS withdrawals_updated_at ON public.withdrawals;
CREATE TRIGGER withdrawals_updated_at
  BEFORE UPDATE ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for auto profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to validate deal status transitions
CREATE OR REPLACE FUNCTION validate_deal_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Define valid transitions
  IF OLD.status = 'draft' AND NEW.status NOT IN ('awaiting_buyer', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status transition from draft';
  END IF;
  
  IF OLD.status = 'awaiting_buyer' AND NEW.status NOT IN ('awaiting_payment', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status transition from awaiting_buyer';
  END IF;
  
  IF OLD.status = 'awaiting_payment' AND NEW.status NOT IN ('in_escrow', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status transition from awaiting_payment';
  END IF;
  
  IF OLD.status = 'in_escrow' AND NEW.status NOT IN ('delivered', 'disputed', 'refunded') THEN
    RAISE EXCEPTION 'Invalid status transition from in_escrow';
  END IF;
  
  IF OLD.status = 'delivered' AND NEW.status NOT IN ('completed', 'disputed') THEN
    RAISE EXCEPTION 'Invalid status transition from delivered';
  END IF;
  
  IF OLD.status = 'disputed' AND NEW.status NOT IN ('completed', 'refunded', 'in_escrow') THEN
    RAISE EXCEPTION 'Invalid status transition from disputed';
  END IF;
  
  -- Terminal states
  IF OLD.status IN ('completed', 'cancelled', 'refunded') THEN
    RAISE EXCEPTION 'Cannot transition from terminal status';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS deal_status_transition ON public.deals;
CREATE TRIGGER deal_status_transition
  BEFORE UPDATE OF status ON public.deals
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION validate_deal_status_transition();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for deals
CREATE POLICY "Users can view deals they participate in" ON public.deals
  FOR SELECT USING (
    seller_id = auth.uid() OR buyer_id = auth.uid()
  );

CREATE POLICY "Users can create deals" ON public.deals
  FOR INSERT WITH CHECK (
    seller_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'user')
  );

CREATE POLICY "Sellers can update own draft deals" ON public.deals
  FOR UPDATE USING (
    seller_id = auth.uid() AND status = 'draft'
  );

CREATE POLICY "Admins can view all deals" ON public.deals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all deals" ON public.deals
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for messages
CREATE POLICY "Participants can view deal messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.deals 
      WHERE deals.id = messages.deal_id 
      AND (deals.seller_id = auth.uid() OR deals.buyer_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.deals 
      WHERE deals.id = deal_id 
      AND (deals.seller_id = auth.uid() OR deals.buyer_id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all messages" ON public.messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can send messages to any deal" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for withdrawals
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create withdrawals" ON public.withdrawals
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all withdrawals" ON public.withdrawals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update withdrawals" ON public.withdrawals
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for admin_settings
CREATE POLICY "Anyone can view admin settings" ON public.admin_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update admin settings" ON public.admin_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for admin_audit_log
CREATE POLICY "Admins can view audit log" ON public.admin_audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert audit log" ON public.admin_audit_log
  FOR INSERT WITH CHECK (
    admin_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
