/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

const getSupabaseUrl = (): string => {
  const url = 
    (import.meta as any).env?.VITE_SUPABASE_URL || 
    (window as any).__SUPABASE_URL__ || 
    "";
  return (typeof url === "string" ? url : "").trim();
};

const getSupabaseAnonKey = (): string => {
  const key = 
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
    (window as any).__SUPABASE_ANON_KEY__ || 
    "";
  return (typeof key === "string" ? key : "").trim();
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Ensure the URL is truthy, non-placeholder, and is a valid HTTP/HTTPS URL
const isValidHttpUrl = (url: string): boolean => {
  if (!url || url.includes("VITE_SUPABASE_URL") || url.startsWith("YOUR_")) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// Graceful check for active credentials
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && isValidHttpUrl(supabaseUrl));

let supabaseClient = null;
if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    console.log("Supabase client initialized successfully with URL:", supabaseUrl);
  } catch (err) {
    console.error("Failed to initialize Supabase client with active credentials:", err);
  }
} else {
  console.warn("Supabase is not configured yet. Checked URL:", supabaseUrl || "(empty)");
}

export const supabase = supabaseClient;

// Clean SQL migration sequence to copy/paste directly in Supabase SQL Editor
export const SUPABASE_SQL_藍圖 = `
-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    qualification TEXT,
    goal TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create student enrollment registries
CREATE TABLE IF NOT EXISTS public.enrollments (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create student lesson completion registries
CREATE TABLE IF NOT EXISTS public.student_progress (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT true NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create admin accounts table for persistent admin accounts across sessions
CREATE TABLE IF NOT EXISTS public.admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    mfa_secret TEXT,
    mfa_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set Row Level Security (RLS) policies for simulation parameters
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for Leads & Contact inquiries
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select of leads" ON public.leads FOR SELECT USING (true);

CREATE POLICY "Allow public insert to contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select of contact_messages" ON public.contact_messages FOR SELECT USING (true);

-- Allow public access to enrollments for this educational simulation
CREATE POLICY "Allow public read/write to enrollments" ON public.enrollments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write to student_progress" ON public.student_progress FOR ALL USING (true) WITH CHECK (true);

-- Allow public select on admin_accounts so registration and dynamic login verification work
CREATE POLICY "Allow public select on admin_accounts" ON public.admin_accounts 
    FOR SELECT USING (true);

-- Allow inserting into admin_accounts ONLY if the current admin-count is 0 (first administrator registration)
CREATE POLICY "Allow signup only if empty" ON public.admin_accounts 
    FOR INSERT WITH CHECK (
        (SELECT count(*) FROM public.admin_accounts) = 0
    );

-- Allow public update and delete for maintenance and account synchronization
CREATE POLICY "Allow public update on admin_accounts" ON public.admin_accounts 
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on admin_accounts" ON public.admin_accounts  
    FOR DELETE USING (true);

-- Trigger-level constraint to guarantee a maximum of one row in the table
CREATE OR REPLACE FUNCTION check_admin_limits()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM public.admin_accounts) >= 1 THEN
        RAISE EXCEPTION 'Administrative registration limit reached. Only one global account is authorized.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_admin_limits_trigger ON public.admin_accounts;
CREATE TRIGGER check_admin_limits_trigger
BEFORE INSERT ON public.admin_accounts
FOR EACH ROW EXECUTE FUNCTION check_admin_limits();
`;

/**
 * Sync LocalStorage data with Supabase if connected
 */
export async function syncLocalStorageToSupabase() {
  if (!supabase) return;

  try {
    // 1. Sync Leads
    const localLeads = localStorage.getItem("academy_leads");
    if (localLeads) {
      const leads = JSON.parse(localLeads);
      if (Array.isArray(leads) && leads.length > 0) {
        for (const lead of leads) {
          // Check if exists
          const { data: existing } = await supabase
            .from("leads")
            .select("email")
            .eq("email", lead.email || "")
            .maybeSingle();

          if (!existing) {
            await supabase.from("leads").insert({
              name: lead.name,
              phone: lead.phone,
              email: lead.email,
              qualification: lead.qualification,
              goal: lead.goal,
              created_at: lead.timestamp || new Date().toISOString()
            });
          }
        }
      }
    }

    // 2. Sync Enrollments
    const localEnrollments = localStorage.getItem("enrollments");
    if (localEnrollments) {
      const enrollments = JSON.parse(localEnrollments);
      if (Array.isArray(enrollments) && enrollments.length > 0) {
        for (const enr of enrollments) {
          await supabase.from("enrollments").upsert({
            id: enr.id,
            course_id: enr.courseId,
            enrolled_at: enr.enrolledAt
          });
        }
      }
    }

    // 3. Sync Student Progress
    const localProgress = localStorage.getItem("student_progress");
    if (localProgress) {
      const progresses = JSON.parse(localProgress);
      if (Array.isArray(progresses) && progresses.length > 0) {
        for (const prog of progresses) {
          await supabase.from("student_progress").upsert({
            id: prog.id,
            course_id: prog.courseId,
            lesson_id: prog.lessonId,
            completed: prog.completed,
            completed_at: prog.completedAt || new Date().toISOString()
          });
        }
      }
    }
  } catch (error) {
    console.error("Error synchronizing tracking indices to Supabase: ", error);
  }
}

/**
 * Create a new lead record
 */
export async function insertLead(lead: {
  name: string;
  phone: string;
  email: string;
  qualification: string;
  goal: string;
}) {
  // Store locally for quick rendering & local offline integrity
  const existingLeadsStr = localStorage.getItem("academy_leads");
  const existingLeads = existingLeadsStr ? JSON.parse(existingLeadsStr) : [];
  const newLead = { ...lead, id: `lead-${Date.now()}`, timestamp: new Date().toISOString() };
  existingLeads.push(newLead);
  localStorage.setItem("academy_leads", JSON.stringify(existingLeads));
  localStorage.setItem("has_qualified_lead", "true");

  if (supabase) {
    try {
      const { error } = await supabase.from("leads").insert({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        qualification: lead.qualification,
        goal: lead.goal
      });
      if (error) throw error;
      console.log("Lead synced cleanly to Supabase cloud table!");
    } catch (err) {
      console.error("Error pushing lead record to Supabase backend: ", err);
    }
  }
}

/**
 * Create custom contact messages
 */
export async function insertContactMessage(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (supabase) {
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message
      });
      if (error) throw error;
      console.log("Contact message dispatched to Supabase table!");
    } catch (err) {
      console.error("Error inserting inquiry message to Supabase: ", err);
    }
  }
}
