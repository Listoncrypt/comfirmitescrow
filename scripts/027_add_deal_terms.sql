-- Add inspection_period_days (if not already present) and delivery_period to deals table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'inspection_period_days') THEN
        ALTER TABLE deals ADD COLUMN inspection_period_days INTEGER DEFAULT 3;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'delivery_period') THEN
        ALTER TABLE deals ADD COLUMN delivery_period INTEGER;
    END IF;
END $$;
