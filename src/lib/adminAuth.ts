import { supabase, isSupabaseConfigured, updateSupabaseClient } from "./supabase";

/**
 * Generates a SHA-256 hash of a password using the built-in browser Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.error("Web Crypto API hashing failed, falling back to simple hash", err);
    // Simple fallback hash if running in environments lacking crypto.subtle
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `fb_${hash.toString(16)}`;
  }
}

/**
 * Checks if at least one administrator account exists in the database.
 * Returns true if an admin exists, false otherwise.
 */
export async function checkAdminExists(): Promise<boolean> {
  updateSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    return false;
  }
  try {
    const { data, error } = await supabase
      .from("admin_accounts")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Error in checkAdminExists query:", error);
      return false;
    }
    return !!(data && data.length > 0);
  } catch (err) {
    console.error("Exception in checkAdminExists:", err);
    return false;
  }
}

/**
 * Handle administrative registration/signup.
 * Ensures that no other administrator exists prior to registration to maintain the strict one-admin rule.
 * Hashes the password securely before insertion.
 */
export async function handleAdminSignup(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; data?: any; error?: string; code?: string }> {
  updateSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: "Database client is not initialized or configured." };
  }

  try {
    // 1. Verify existence check first to prevent duplicate signups before insert attempt
    const exists = await checkAdminExists();
    if (exists) {
      return {
        success: false,
        error: "An administrator account has already been registered globally. Signup is closed.",
        code: "ADM01",
      };
    }

    // 2. Hash the password securely
    const hashedPassword = await hashPassword(password);

    // 3. Store in Supabase
    const { data, error } = await supabase
      .from("admin_accounts")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword, // Store secure hash
        mfa_secret: null,
        mfa_enabled: false,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error inserting remote admin account in signup:", error);
      return {
        success: false,
        error: error.message || "Database insert failed.",
        code: error.code,
      };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Exception in handleAdminSignup:", err);
    return {
      success: false,
      error: err.message || "An unexpected registration error occurred.",
    };
  }
}

/**
 * Handle administrative login credentials verification.
 * Supports checking against both hashed password (preferred) for security,
 * and handles plaintext password checks (as a fallback for older database records) cleanly.
 */
export async function handleAdminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; data?: any; error?: string; code?: string }> {
  updateSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: "Database client is not initialized or configured." };
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    
    // Fetch user details by email
    const { data: user, error } = await supabase
      .from("admin_accounts")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (error) {
      console.error("Error querying email during login:", error);
      return {
        success: false,
        error: error.message || "Database query failed.",
        code: error.code,
      };
    }

    if (!user) {
      return { success: false, error: "Invalid email address or unauthorized credentials." };
    }

    // Hash the input password to check against the secure database hash
    const inputHash = await hashPassword(password);

    // Verify hashed password OR fallback plaintext password
    if (user.password === inputHash || user.password === password) {
      return { success: true, data: user };
    }

    return { success: false, error: "Invalid password. Access unauthorized." };
  } catch (err: any) {
    console.error("Exception in handleAdminLogin:", err);
    return {
      success: false,
      error: err.message || "An unexpected visual database error occurred during login.",
    };
  }
}

/**
 * Diagnostic utility to test Supabase connection integrity, verify credentials,
 * and fetch/log the current count of records in the `admin_accounts` table.
 */
export async function runSupabaseDiagnostics(): Promise<{
  configured: boolean;
  connected: boolean;
  count: number | null;
  error?: string;
  details?: any;
}> {
  updateSupabaseClient();
  const configured = !!isSupabaseConfigured;
  if (!configured) {
    const err = "Supabase has not been configured in env or window credentials.";
    console.warn("[DIAGNOSTICS] " + err);
    return { configured: false, connected: false, count: null, error: err };
  }

  try {
    // Check connection and obtain exact count of admin records
    const { data, count, error } = await supabase
      .from("admin_accounts")
      .select("id", { count: "exact" });

    if (error) {
      console.error("[DIAGNOSTICS] Table read failed:", error);
      return {
        configured: true,
        connected: false,
        count: null,
        error: error.message,
        details: error,
      };
    }

    const currentCount = count !== null ? count : (data ? data.length : 0);
    console.log(`[DIAGNOSTICS] connection successful! Found ${currentCount} admin_accounts in Supabase.`);
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

