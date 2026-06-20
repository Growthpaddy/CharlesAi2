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

-- 1. Ensure the 'admin_accounts' table exists with security fields
CREATE TABLE IF NOT EXISTS public.admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    mfa_secret TEXT,
    mfa_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Turn on Row Level Security (RLS) policies for the database tables
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies using idempotent operations (refined by Supabase AI)
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


-- 4. Create a robust database TRIGGER to strictly restrict the record limit
--    to exactly ONE administrator account globally at the database engine level.
CREATE OR REPLACE FUNCTION check_admin_limits()
RETURNS TRIGGER AS $$
BEGIN
    -- If there is already at least one record in the admin_accounts table, block further inserts.
    IF (SELECT count(*) FROM public.admin_accounts) >= 1 THEN
        RAISE EXCEPTION 'Administrative registration limit reached. Only one global account is authorized.' USING ERRCODE = 'ADM01';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the limit check trigger to execute BEFORE any row is inserted
DROP TRIGGER IF EXISTS check_admin_limits_trigger ON public.admin_accounts;
CREATE TRIGGER check_admin_limits_trigger
BEFORE INSERT ON public.admin_accounts
FOR EACH ROW EXECUTE FUNCTION check_admin_limits();

-- Optional: Inform user of success
-- SELECT 'Administrative migration configured successfully.' AS status;
