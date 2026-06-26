import { supabaseClient as supabase, isSupabaseConfigured, updateSupabaseClient } from "./supabaseClient";

/**
 * Checks if at least one administrator account exists in the database.
 * Returns true if an admin exists, false otherwise.
 */
export async function checkAdminExists(): Promise<boolean> {
  updateSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    const localAdmins = localStorage.getItem("academy_admins");
    if (localAdmins) {
      try {
        const parsed = JSON.parse(localAdmins);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch (_) {
        return false;
      }
    }
    return false;
  }
  try {
    const { data, error } = await supabase
      .from("admin")
      .select("id")
      .limit(1);

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        const localAdmins = localStorage.getItem("academy_admins");
        if (localAdmins) {
          try {
            const parsed = JSON.parse(localAdmins);
            return Array.isArray(parsed) && parsed.length > 0;
          } catch (_) {
            return false;
          }
        }
      }
      return false;
    }
    return !!(data && data.length > 0);
  } catch (err) {
    return false;
  }
}

/**
 * Checks if at least one administrator account with is_owner = true exists in the database.
 * Returns true if such an admin exists, false otherwise.
 */
export async function checkAdminOwnerExists(): Promise<boolean> {
  updateSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    const localAdmins = localStorage.getItem("academy_admins");
    if (localAdmins) {
      try {
        const parsed = JSON.parse(localAdmins);
        if (Array.isArray(parsed)) {
          return parsed.some(admin => admin.is_owner === true || admin.is_owner === "true");
        }
      } catch (_) {
        return false;
      }
    }
    const signedUp = localStorage.getItem("signed_up_admin");
    if (signedUp) {
      try {
        const parsed = JSON.parse(signedUp);
        return !!parsed && parsed.is_owner === true;
      } catch (_) {}
    }
    return false;
  }
  try {
    const { data, error } = await supabase
      .from("admin")
      .select("id")
      .eq("is_owner", true)
      .limit(1);

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist") || error.code === "42703") {
        const localAdmins = localStorage.getItem("academy_admins");
        if (localAdmins) {
          try {
            const parsed = JSON.parse(localAdmins);
            if (Array.isArray(parsed)) {
              return parsed.some(admin => admin.is_owner === true || admin.is_owner === "true" || parsed.length > 0);
            }
          } catch (_) {}
        }
        // General existence check fallback
        const { data: generalData, error: generalErr } = await supabase
          .from("admin")
          .select("id")
          .limit(1);
        if (!generalErr && generalData && generalData.length > 0) {
          return true;
        }
      }
      return false;
    }
    return !!(data && data.length > 0);
  } catch (err) {
    return false;
  }
}

/**
 * Diagnostic utility to test Supabase connection integrity and check the admin table records count.
 */
export async function runSupabaseDiagnostics(): Promise<{
  configured: boolean;
  connected: boolean;
  count: number | null;
  error?: string;
  details?: any;
}> {
  console.log("[DIAGNOSTICS] Starting live Supabase connection assertion...");

  // 1. Retrieve the URL & check configuration source
  let rawUrl = "";
  let urlSource = "";
  try {
    rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
    if (rawUrl) urlSource = "env variables (VITE_SUPABASE_URL)";
  } catch (_) {}

  if (!rawUrl) {
    rawUrl = (window as any).__SUPABASE_URL__ || "";
    if (rawUrl) urlSource = "window credentials (__SUPABASE_URL__)";
  }

  const urlVal = (typeof rawUrl === "string" ? rawUrl : "").trim();
  const hasUrl = !!urlVal;

  // 2. Retrieve the ANON KEY & check configuration source
  let rawKey = "";
  let keySource = "";
  try {
    rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";
    if (rawKey) keySource = "env variables (VITE_SUPABASE_ANON_KEY)";
  } catch (_) {}

  if (!rawKey) {
    rawKey = (window as any).__SUPABASE_ANON_KEY__ || "";
    if (rawKey) keySource = "window credentials (__SUPABASE_ANON_KEY__)";
  }

  const keyVal = (typeof rawKey === "string" ? rawKey : "").trim();
  const hasKey = !!keyVal;

  // URL validate helper
  const isUrlFormatOk = hasUrl && !urlVal.includes("VITE_SUPABASE_URL") && !urlVal.startsWith("YOUR_") && (urlVal.startsWith("http://") || urlVal.startsWith("https://"));
  const isKeyFormatOk = hasKey && !keyVal.includes("VITE_SUPABASE_ANON_KEY") && !keyVal.startsWith("YOUR_") && keyVal.length > 20;

  // Mask key safely for secure logging
  const maskedKey = isKeyFormatOk 
    ? `${keyVal.substring(0, 8)}...[masked]...${keyVal.substring(keyVal.length - 8)}` 
    : "(Missing or incomplete key)";

  console.log("[DIAGNOSTICS] Credentials Assessment:");
  console.log(` - Supabase URL: "${urlVal || "NONE"}" (Source: ${urlSource || "N/A"}) - Format check: ${isUrlFormatOk ? "VALID" : "INVALID"}`);
  console.log(` - Supabase Anon Key: "${maskedKey}" (Source: ${keySource || "N/A"}) - Format check: ${isKeyFormatOk ? "VALID" : "INVALID"}`);

  // Re-run dynamic initializer to make sure state is synchronized
  updateSupabaseClient();
  const configured = !!isSupabaseConfigured;

  console.log(` - Final target status check: Client initialized? ${configured ? "YES" : "NO"}`);

  if (!configured) {
    const err = "Supabase has not been configured or carries invalid URL/Key formats.";
    console.warn("[DIAGNOSTICS] Connection check aborted: " + err);
    return { configured: false, connected: false, count: null, error: err };
  }

  try {
    console.log("[DIAGNOSTICS] Dispatching test query to table `admin`...");
    const { data, count, error } = await supabase
      .from("admin")
      .select("id", { count: "exact" });

    if (error) {
      console.error("[DIAGNOSTICS] Table read failed on Supabase remote server:", error);
      return {
        configured: true,
        connected: false,
        count: null,
        error: error.message,
        details: error,
      };
    }

    const currentCount = count !== null ? count : (data ? data.length : 0);
    console.log(`[DIAGNOSTICS] Connection assertion successful! Retrieved ${currentCount} admin records from live dataset.`);
    return {
      configured: true,
      connected: true,
      count: currentCount,
      details: data,
    };
  } catch (err: any) {
    const errMsg = err.message || "An unexpected exception occurred during connection check.";
    console.error("[DIAGNOSTICS] Connection exception detail:", err);
    return {
      configured: true,
      connected: false,
      count: null,
      error: errMsg,
      details: err,
    };
  }
}
