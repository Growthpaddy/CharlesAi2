import bcrypt from "bcryptjs";
import { supabaseClient as supabase, isSupabaseConfigured, updateSupabaseClient } from "./supabaseClient";

/**
 * Generates an SHA-256 fallback hash of a password using the built-in browser Web Crypto API.
 */
export async function hashPasswordSha256(password: string): Promise<string> {
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
 * Generates a secure, salted bcrypt hash of a password.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error("Bcrypt hashing failed, falling back to SHA-256", err);
    return await hashPasswordSha256(password);
  }
}

/**
 * Verifies if a password is valid against a stored hash value (supports bcrypt, older SHA-256 hashes, and local plaintext passwords).
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) {
    return false;
  }

  // 1. If stored hash is formatted as a bcrypt string, use bcryptjs comparison
  if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
    try {
      return await bcrypt.compare(password, storedHash);
    } catch (err) {
      console.error("Bcrypt comparison error:", err);
    }
  }

  // 2. Check older helper SHA-256 hash match
  const fallbackSha = await hashPasswordSha256(password);
  if (storedHash === fallbackSha) {
    return true;
  }

  // 3. Fallback to raw plaintext match (e.g. for initial sandbox/manual entries)
  return storedHash === password;
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

    // Verify password securely using bcrypt (with legacy SHA-256 and plaintext fallbacks)
    const isMatched = await verifyPassword(password, user.password);
    if (isMatched) {
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
    console.log("[DIAGNOSTICS] Dispatching test query to table `admin_accounts`...");
    // Check connection and obtain exact count of admin records
    const { data, count, error } = await supabase
      .from("admin_accounts")
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
    console.log(`[DIAGNOSTICS] Connection assertion successful! Retrieved ${currentCount} admin_accounts from live dataset.`);
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

