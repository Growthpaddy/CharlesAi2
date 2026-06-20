-- ====================================================================
-- SUPABASE RESET RLS POLICIES FOR ADMIN_ACCOUNTS
-- ====================================================================
-- This script resets all Row Level Security (RLS) policies on the
-- 'admin_accounts' table to be completely permissive (USING true / WITH CHECK true).
-- This handles testing/verification of connectivity issues or 
-- "Invalid Administrative credentials" errors.
--
-- RUNNING THIS SCRIPT:
-- 1. Go to your Supabase Dashboard (https://supabase.com)
-- 2. Open the SQL Editor from the sidebar.
-- 3. Create a new query block.
-- 4. Paste this entire script and run it.
-- ====================================================================

-- 1. Ensure Row Level Security is enabled (required for active policies)
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- 2. Clean out any previous policies to prevent overlapping conflicts
DROP POLICY IF EXISTS "Allow public select on admin_accounts" ON public.admin_accounts;
DROP POLICY IF EXISTS "Allow public insert on admin_accounts" ON public.admin_accounts;
DROP POLICY IF EXISTS "Allow public update on admin_accounts" ON public.admin_accounts;
DROP POLICY IF EXISTS "Allow public delete on admin_accounts" ON public.admin_accounts;
DROP POLICY IF EXISTS "Allow individual read" ON public.admin_accounts;
DROP POLICY IF EXISTS "Allow self update" ON public.admin_accounts;
DROP POLICY IF EXISTS "admin_accounts_permissive_select" ON public.admin_accounts;
DROP POLICY IF EXISTS "admin_accounts_permissive_insert" ON public.admin_accounts;
DROP POLICY IF EXISTS "admin_accounts_permissive_update" ON public.admin_accounts;
DROP POLICY IF EXISTS "admin_accounts_permissive_delete" ON public.admin_accounts;

-- 3. Create permissive SELECT policy to allow administrative lookups during login
CREATE POLICY "admin_accounts_permissive_select"
ON public.admin_accounts
FOR SELECT
TO PUBLIC
USING (true);

-- 4. Create permissive INSERT policy to allow initial setup of admin accounts
CREATE POLICY "admin_accounts_permissive_insert"
ON public.admin_accounts
FOR INSERT
TO PUBLIC
WITH CHECK (true);

-- 5. Create permissive UPDATE policy to support settings and edits
CREATE POLICY "admin_accounts_permissive_update"
ON public.admin_accounts
FOR UPDATE
TO PUBLIC
USING (true)
WITH CHECK (true);

-- 6. Create permissive DELETE policy
CREATE POLICY "admin_accounts_permissive_delete"
ON public.admin_accounts
FOR DELETE
TO PUBLIC
USING (true);

-- 7. Log validation notice
SELECT 'Permissive Row-Level Security policies successfully reset on Table public.admin_accounts' AS status_report;
