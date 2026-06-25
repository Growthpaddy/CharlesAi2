-- ====================================================================
-- SUPABASE RESET RLS POLICIES FOR ALL SCHEMAS
-- ====================================================================
-- This script resets all Row Level Security (RLS) policies on all tables
-- to be completely permissive (USING true / WITH CHECK true) to guarantee
-- that there are no "Missing or insufficient permissions" or connectivity
-- issues between the Admin & Student dashboards and Supabase.
--
-- RUNNING THIS SCRIPT:
-- 1. Go to your Supabase Dashboard (https://supabase.com)
-- 2. Open the SQL Editor from the sidebar.
-- 3. Create a new query block.
-- 4. Paste this entire script and run it.
-- ====================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- 2. Clean out previous policies to prevent overlapping conflicts
DROP POLICY IF EXISTS "Allow public insert to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public select of leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public select of contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public read/write to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read/write to enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Allow public read/write to student_progress" ON public.student_progress;
DROP POLICY IF EXISTS "Allow public read/write to user_lessons" ON public.user_lessons;

-- 3. Create fully permissive policies
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select of leads" ON public.leads FOR SELECT USING (true);

CREATE POLICY "Allow public insert to contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select of contact_messages" ON public.contact_messages FOR SELECT USING (true);

CREATE POLICY "Allow public read/write to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write to enrollments" ON public.enrollments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write to student_progress" ON public.student_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write to user_lessons" ON public.user_lessons FOR ALL USING (true) WITH CHECK (true);

-- 4. Clean out admin policies
DROP POLICY IF EXISTS "Allow public select on admin" ON public.admin;
DROP POLICY IF EXISTS "Allow public insert on admin" ON public.admin;
DROP POLICY IF EXISTS "Allow public update on admin" ON public.admin;
DROP POLICY IF EXISTS "Allow public delete on admin" ON public.admin;
DROP POLICY IF EXISTS "Allow individual read" ON public.admin;
DROP POLICY IF EXISTS "Allow self update" ON public.admin;
DROP POLICY IF EXISTS "admin_permissive_select" ON public.admin;
DROP POLICY IF EXISTS "admin_permissive_insert" ON public.admin;
DROP POLICY IF EXISTS "admin_permissive_update" ON public.admin;
DROP POLICY IF EXISTS "admin_permissive_delete" ON public.admin;

-- 5. Set admin permissive policies
CREATE POLICY "admin_permissive_select" ON public.admin FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "admin_permissive_insert" ON public.admin FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "admin_permissive_update" ON public.admin FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY "admin_permissive_delete" ON public.admin FOR DELETE TO PUBLIC USING (true);

-- 6. Log success notice
SELECT 'Permissive Row-Level Security policies successfully configured for all active dashboards.' AS status_report;
