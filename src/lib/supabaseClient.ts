import { createClient } from "@supabase/supabase-js";

const getSupabaseUrl = (): string => {
  let url = "";
  try {
    url = (import.meta as any).env?.VITE_SUPABASE_URL || "";
  } catch (_) {}
  if (!url) {
    url = (window as any).__SUPABASE_URL__ || "";
  }
  return (typeof url === "string" ? url : "").trim();
};

const getSupabaseAnonKey = (): string => {
  let key = "";
  try {
    key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";
  } catch (_) {}
  if (!key) {
    key = (window as any).__SUPABASE_ANON_KEY__ || "";
  }
  return (typeof key === "string" ? key : "").trim();
};

const isValidHttpUrl = (url: string): boolean => {
  if (!url || url.includes("VITE_SUPABASE_URL") || url.startsWith("YOUR_")) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export let isSupabaseConfigured = false;
export let supabaseClient: any = null;

export const updateSupabaseClient = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  const configured = !!(url && key && isValidHttpUrl(url));
  
  if (configured !== isSupabaseConfigured || (configured && !supabaseClient)) {
    isSupabaseConfigured = configured;
    if (configured) {
      try {
        supabaseClient = createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          }
        });
        console.log("Central Supabase client initialized cleanly in supabaseClient.ts with URL:", url);
      } catch (err) {
        console.error("Failed to initialize central Supabase client in supabaseClient.ts:", err);
        supabaseClient = null;
        isSupabaseConfigured = false;
      }
    } else {
      supabaseClient = null;
    }
  }
};

/**
 * Sync evaluation check. Logs the initialized URL and returns whether the client is ready for queries.
 */
export const isClientReady = (): boolean => {
  updateSupabaseClient();
  const ready = isSupabaseConfigured && supabaseClient !== null;
  const url = getSupabaseUrl();
  console.log(`[SUPABASE CONNECTIVITY CHECK] Client URL: "${url || "NOT CONFIGURED"}". Ready to query? ${ready}`);
  return ready;
};

// Initial evaluation at module load
updateSupabaseClient();
