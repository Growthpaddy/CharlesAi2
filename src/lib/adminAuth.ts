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

  // Trim the stored hash to handle copy-paste or database string padding robustly
  const cleanStoredHash = storedHash.trim();

  // 1. If stored hash is formatted as a bcrypt string, use bcryptjs comparison
  const isBcryptStyle = cleanStoredHash.startsWith("$2a$") || 
                        cleanStoredHash.startsWith("$2b$") || 
                        cleanStoredHash.startsWith("$2y$") || 
                        cleanStoredHash.startsWith("$2x$") ||
                        /^\$2[abxy]?\$\d+\$[./A-Za-z0-9]{53}$/.test(cleanStoredHash);

  if (isBcryptStyle) {
    try {
      // Perform the secure bcrypt compare. It is asynchronous and returns a promise.
      const match = await bcrypt.compare(password, cleanStoredHash);
      if (match) {
        return true;
      }
    } catch (err) {
      console.error("[verifyPassword] Bcrypt comparison error:", err);
      // Fallback in case comparison fails due to unexpected environment constraints
    }
  }

  // 2. Check older helper SHA-256 hash match
  const fallbackSha = await hashPasswordSha256(password);
  if (cleanStoredHash === fallbackSha) {
    console.log("[verifyPassword] SHA-256 fallback hash matches successfully.");
    return true;
  }

  // 3. Fallback to raw plaintext match (e.g. for initial sandbox/manual entries)
  if (cleanStoredHash === password) {
    console.warn("[verifyPassword] Security warning: Plaintext password match occurred. Consider updating password to direct bcrypt hashing.");
    return true;
  }

  return false;
}

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
      .from("admin_accounts")
      .select("id")
      .limit(1);

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("Table 'admin_accounts' does not exist in Supabase yet. Falling back to local storage admin verification.");
        const localAdmins = localStorage.getItem("academy_admins");
        if (localAdmins) {
          try {
            const parsed = JSON.parse(localAdmins);
            return Array.isArray(parsed) && parsed.length > 0;
          } catch (_) {
            return false;
          }
        }
      } else {
        console.error("Error in checkAdminExists query:", error);
      }
      return false;
    }
    return !!(data && data.length > 0);
  } catch (err) {
    console.error("Exception in checkAdminExists:", err);
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
    return false;
  }
  try {
    const { data, error } = await supabase
      .from("admin_accounts")
      .select("id")
      .eq("is_owner", true)
      .limit(1);

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist") || error.code === "42703") {
        console.warn("Table or column is_owner does not exist in Supabase yet. Falling back to general existence check.");
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
          .from("admin_accounts")
          .select("id")
          .limit(1);
        if (!generalErr && generalData && generalData.length > 0) {
          return true;
        }
      } else {
        console.error("Error in checkAdminOwnerExists query:", error);
      }
      return false;
    }
    return !!(data && data.length > 0);
  } catch (err) {
    console.error("Exception in checkAdminOwnerExists:", err);
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
    // Local offline simulation fallback
    try {
      const exists = await checkAdminOwnerExists();
      if (exists) {
        return {
          success: false,
          error: "Administrator account already exists. Please sign in.",
          code: "ADM01",
        };
      }

      const hashedPassword = await hashPassword(password);
      const newAdmin = {
        id: "offline-admin-id-" + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        mfa_secret: null,
        mfa_enabled: false,
        is_owner: true,
        created_at: new Date().toISOString()
      };

      const admins = [newAdmin];
      localStorage.setItem("academy_admins", JSON.stringify(admins));
      return { success: true, data: newAdmin };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "An unexpected offline registration error occurred."
      };
    }
  }

  try {
    // 1. Verify owner existence check first to prevent duplicate signups before insert attempt
    const exists = await checkAdminOwnerExists();
    if (exists) {
      return {
        success: false,
        error: "Administrator account already exists. Please sign in.",
        code: "ADM01",
      };
    }

    // 2. Hash the password securely
    const hashedPassword = await hashPassword(password);

    // 3. Store in Supabase
    let insertObj: any = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword, // Store secure hash
      mfa_secret: null,
      mfa_enabled: false,
      is_owner: true,
    };

    let { data, error } = await supabase
      .from("admin_accounts")
      .insert(insertObj)
      .select()
      .maybeSingle();

    if (error && (error.code === "42703" || error.message?.includes("is_owner"))) {
      console.warn("is_owner column does not exist in remote table, retrying insert without is_owner");
      delete insertObj.is_owner;
      const retryResult = await supabase
        .from("admin_accounts")
        .insert(insertObj)
        .select()
        .maybeSingle();
      data = retryResult.data;
      error = retryResult.error;
    }

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
    // Local offline simulation fallback
    try {
      const cleanEmail = email.trim().toLowerCase();
      const localAdmins = localStorage.getItem("academy_admins");
      if (!localAdmins) {
        return { success: false, error: "No administrator accounts registered locally. Please sign up first." };
      }
      const parsedAdmins = JSON.parse(localAdmins);
      if (!Array.isArray(parsedAdmins)) {
        return { success: false, error: "Corrupted local storage admin registry." };
      }
      const user = parsedAdmins.find(admin => admin.email === cleanEmail);
      if (!user) {
        return { success: false, error: "Invalid email address or unauthorized credentials." };
      }
      const isMatched = await verifyPassword(password, user.password);
      if (isMatched) {
        return { success: true, data: user };
      }
      return { success: false, error: "Invalid password. Access unauthorized." };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "An unexpected offline authentication error occurred during login."
      };
    }
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

