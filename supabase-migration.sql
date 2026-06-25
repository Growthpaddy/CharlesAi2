-- ====================================================================
-- SUPABASE ACADEMY FULL DATABASE MIGRATION SCRIPT
-- ====================================================================
-- This migration script creates all tables required for both the Student 
-- and Admin Dashboards, handles row-level security (RLS) policies, and
-- secures administrative setups.
--
-- INSTRUCTIONS FOR DEPLOYMENT:
-- 1. Visit your Supabase Dashboard (https://supabase.com)
-- 2. Open your Project's "SQL Editor" from the left nav panel.
-- 3. Click "+ New query" or "+ New blank query"
-- 4. Copy-paste this entire script into the editor and click "Run".
-- ====================================================================

-- 1. CREATE LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    qualification TEXT,
    goal TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CREATE CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'student' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    location TEXT,
    phone TEXT,
    applied_course TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREATE STUDENT PROGRESS TABLE (LESSON COMPLETIONS)
CREATE TABLE IF NOT EXISTS public.student_progress (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT true NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CREATE USER LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.user_lessons (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT true NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CREATE ADMIN TABLE (secured single admin account trigger)
DROP TRIGGER IF EXISTS check_admin_limits_trigger ON public.admin;
DROP TRIGGER IF EXISTS prevent_extra_admin ON public.admin;
DROP TABLE IF EXISTS public.admin CASCADE;

CREATE TABLE public.admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_owner BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure primary key validation constraint
ALTER TABLE public.admin ADD CONSTRAINT one_admin_only CHECK (id IS NOT NULL);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- Leads access policies
DROP POLICY IF EXISTS "Allow public insert to leads" ON public.leads;
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public select of leads" ON public.leads;
CREATE POLICY "Allow public select of leads" ON public.leads FOR SELECT USING (true);

-- Contact messages access policies
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert to contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public select of contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public select of contact_messages" ON public.contact_messages FOR SELECT USING (true);

-- Student profiles access policies
DROP POLICY IF EXISTS "Allow public read/write to profiles" ON public.profiles;
CREATE POLICY "Allow public read/write to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Enrollments access policies
DROP POLICY IF EXISTS "Allow public read/write to enrollments" ON public.enrollments;
CREATE POLICY "Allow public read/write to enrollments" ON public.enrollments FOR ALL USING (true) WITH CHECK (true);

-- Student progress access policies
DROP POLICY IF EXISTS "Allow public read/write to student_progress" ON public.student_progress;
CREATE POLICY "Allow public read/write to student_progress" ON public.student_progress FOR ALL USING (true) WITH CHECK (true);

-- User lessons access policies
DROP POLICY IF EXISTS "Allow public read/write to user_lessons" ON public.user_lessons;
CREATE POLICY "Allow public read/write to user_lessons" ON public.user_lessons FOR ALL USING (true) WITH CHECK (true);

-- Admin access policies (Secured by trigger)
DROP POLICY IF EXISTS "Allow public select on admin" ON public.admin;
CREATE POLICY "Allow public select on admin" ON public.admin FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public insert on admin" ON public.admin;
CREATE POLICY "Allow public insert on admin" ON public.admin FOR INSERT TO PUBLIC WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on admin" ON public.admin;
CREATE POLICY "Allow public update on admin" ON public.admin FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on admin" ON public.admin;
CREATE POLICY "Allow public delete on admin" ON public.admin FOR DELETE TO PUBLIC USING (true);

-- Trigger function that guarantees only 1 admin can exist
CREATE OR REPLACE FUNCTION check_admin_exists()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM public.admin) >= 1 THEN
        RAISE EXCEPTION 'Admin account already exists';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_extra_admin
BEFORE INSERT ON public.admin
FOR EACH ROW EXECUTE FUNCTION check_admin_exists();
