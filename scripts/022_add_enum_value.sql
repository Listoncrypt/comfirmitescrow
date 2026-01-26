-- 022_add_enum_value.sql
-- Run this FIRST and ALONE.

ALTER TYPE public.withdrawal_status ADD VALUE IF NOT EXISTS 'cancelled';
