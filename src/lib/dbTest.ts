import { supabaseClient as supabase, isSupabaseConfigured, updateSupabaseClient } from "./supabaseClient";

/**
 * Attempts to query the admin_accounts table and logs diagnostic information to the console.
 * This is designed to help debug connection or credentials issues during administrative authentication operations.
 */
export async function testConnection(): Promise<{ success: boolean; rowCount?: number; error?: any; localSimulation?: boolean }> {
  console.log("[DB TEST] Triggering database connectivity diagnostic...");
  
  // Update client configuration if environment was populated late
  updateSupabaseClient();

  if (!isSupabaseConfigured || !supabase) {
    const localAdminsStr = localStorage.getItem("academy_admins") || "[]";
    let localCount = 0;
    try {
      const parsed = JSON.parse(localAdminsStr);
      localCount = Array.isArray(parsed) ? parsed.length : 0;
    } catch (_) {}
    
    console.log(`[DB TEST] Supabase cloud is not configured. Simulating development offline mode. Local simulated admins: ${localCount}`);
    return { success: true, rowCount: localCount, localSimulation: true };
  }

  try {
    // Attempt standard select request with row-count format
    const { data, error, count } = await supabase
      .from("admin_accounts")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[DB TEST] Error querying admin_accounts:", error);
      return { success: false, error };
    }

    console.log(`[DB TEST] Success! admin_accounts table fully reached. Account record count: ${count !== null ? count : (data ? data.length : 0)}`);
    return { 
      success: true, 
      rowCount: count !== null ? count : (data ? data.length : 0) 
    };
  } catch (error) {
    console.error("[DB TEST] Exception caught during database connectivity validation query:", error);
    return { success: false, error };
  }
}
