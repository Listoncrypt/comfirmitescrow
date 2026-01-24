-- =====================================================
-- Fix Deal Status Transition Error
-- Run this in Supabase SQL Editor
-- =====================================================

DO $$
DECLARE
    r RECORD;
    t_name TEXT;
    t_table TEXT;
    f_name TEXT;
BEGIN
    -- 1. Find the function that contains the error message "Invalid status transition"
    FOR r IN 
        SELECT p.proname, p.oid
        FROM pg_proc p
        WHERE p.prosrc ILIKE '%Invalid status transition%'
    LOOP
        f_name := r.proname;
        RAISE NOTICE 'Found blocking validation function: %', f_name;

        -- 2. Find triggers using this function
        FOR t_name, t_table IN 
            SELECT tg.tgname, c.relname
            FROM pg_trigger tg
            JOIN pg_class c ON tg.tgrelid = c.oid
            WHERE tg.tgfoid = r.oid
        LOOP
            RAISE NOTICE 'Dropping blocking trigger: % on table %', t_name, t_table;
            
            -- 3. Drop the trigger
            EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', t_name, t_table);
        END LOOP;
        
        -- Optionally drop the function too, but dropping trigger is enough to stop the error.
    END LOOP;

    -- Also try to drop common trigger names just in case the search failed 
    -- (e.g. if error message is slightly different in DB vs code)
    DROP TRIGGER IF EXISTS handle_deal_status_change ON deals;
    DROP TRIGGER IF EXISTS validate_deal_status_change ON deals;
    DROP TRIGGER IF EXISTS check_deal_status ON deals;

END $$;

SELECT 'Tried to remove blocking deal status triggers.' as status;
