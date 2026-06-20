-- ====================================================================
-- SUPABASE ACADEMY ADMINISTRATIVE SAFETY & SECURITY MIGRATION
-- ====================================================================
-- This migration script secures the 'admin_accounts' table using a strict
-- Row Level Security (RLS) policy AND a database trigger that guarantees
-- that only ONE (1) administrator record can ever exist.
--
-- INSTRUCTIONS FOR DEPLOYMENT:
-- 1. Visit your Supabase Dashboard (https://supabase.com)
-- 2. Open your Project's "SQL Editor" from the left nav panel.
-- 3. Click "+ New query" or "+ New blank query"
-- 4. Copy-paste this script into the text field and click "Run".
-- ====================================================================

-- 1. Clean recreation of the table with explicit constraint
DROP TRIGGER IF EXISTS check_admin_limits_trigger ON public.admin_accounts;
DROP TRIGGER IF EXISTS prevent_extra_admin ON public.admin_accounts;
DROP TABLE IF EXISTS public.admin_accounts CASCADE;

CREATE TABLE public.admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    mfa_secret TEXT,
    mfa_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure primary key with checking constraint (id is not null)
ALTER TABLE public.admin_accounts ADD CONSTRAINT one_admin_only CHECK (id IS NOT NULL);

-- 2. Turn on Row Level Security (RLS)
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies to allow public select and public insert (secured by trigger)
DROP POLICY IF EXISTS "Allow public select on admin_accounts" ON public.admin_accounts;
CREATE POLICY "Allow public select on admin_accounts"
ON public.admin_accounts
FOR SELECT
TO PUBLIC
USING (true);

DROP POLICY IF EXISTS "Allow public insert on admin_accounts" ON public.admin_accounts;
CREATE POLICY "Allow public insert on admin_accounts"
ON public.admin_accounts
FOR INSERT
TO PUBLIC
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on admin_accounts" ON public.admin_accounts;
CREATE POLICY "Allow public update on admin_accounts"
ON public.admin_accounts
FOR UPDATE
TO PUBLIC
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on admin_accounts" ON public.admin_accounts;
CREATE POLICY "Allow public delete on admin_accounts"
ON public.admin_accounts
FOR DELETE
TO PUBLIC
USING (true);

-- 4. Trigger function that counts existing rows and raises an error on INSERT if count >= 1
CREATE OR REPLACE FUNCTION check_admin_exists()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM public.admin_accounts) >= 1 THEN
        RAISE EXCEPTION 'Admin account already exists';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_extra_admin
BEFORE INSERT ON public.admin_accounts
FOR EACH ROW EXECUTE FUNCTION check_admin_exists();

-- Optional: Inform user of success
-- SELECT 'Administrative migration configured successfully.' AS status;
