import { supabaseClient as supabase, isSupabaseConfigured, updateSupabaseClient } from "./supabaseClient";

/**
 * Attempts to query the admin_accounts table and logs diagnostic information to the console.
 * This is designed to help debug connection or credentials issues during administrative authentication operations.
 */
export async function testConnection(): Promise<{ success: boolean; rowCount?: number; error?: any }> {
  console.log("[DB TEST] Triggering database connectivity diagnostic...");
  
  // Update client configuration if environment was populated late
  updateSupabaseClient();

  if (!isSupabaseConfigured || !supabase) {
    const errMsg = "[DB TEST] Supabase is not configured yet! Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.";
    console.warn(errMsg);
    return { success: false, error: errMsg };
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
