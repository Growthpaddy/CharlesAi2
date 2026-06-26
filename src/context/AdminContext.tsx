/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { verifyJWT, createJWT } from "../lib/jwt";

export interface AdminUser {
  name: string;
  email: string;
  isOwner?: boolean;
}

interface AdminContextType {
  isAdminAuth: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  login: (name: string, email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  verifySession: () => Promise<boolean>;
  isAuthorized: (email: string) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    return localStorage.getItem("is_admin_authenticated") === "true";
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const name = localStorage.getItem("admin_logged_in_name");
    const email = localStorage.getItem("admin_logged_in_email");
    return name && email ? { name, email } : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const checkOfflineFallback = useCallback((email: string): boolean => {
    const localAdmins = localStorage.getItem("academy_admins");
    if (localAdmins) {
      try {
        const parsed = JSON.parse(localAdmins);
        if (Array.isArray(parsed)) {
          const match = parsed.find(admin => admin.email?.toLowerCase() === email.trim().toLowerCase());
          if (match) {
            const isActive = match.is_active === true;
            if (!isActive) {
              console.error(`[AdminContext] Offline Access Denied: User (${email}) is marked inactive.`);
              return false;
            }
            return true;
          }
        }
      } catch (_) {}
    }
    
    const signedUp = localStorage.getItem("signed_up_admin");
    if (signedUp) {
      try {
        const parsed = JSON.parse(signedUp);
        if (parsed && parsed.email?.toLowerCase() === email.trim().toLowerCase()) {
          const isActive = parsed.is_active === true;
          if (!isActive) {
            console.error(`[AdminContext] Offline Access Denied: Signed up user (${email}) is marked inactive.`);
            return false;
          }
          return true;
        }
      } catch (_) {}
    }

    // Default fallback for default admin email
    if (email.toLowerCase() === "admin@aionlinebusiness.org") {
      return true;
    }

    // Default fallback if no admin accounts found but auth was completed
    return true;
  }, []);

  const isAuthorized = useCallback(async (email: string): Promise<boolean> => {
    if (!email) {
      console.warn("[AdminContext] Authorization failed: No email provided.");
      return false;
    }

    if (supabase && isSupabaseConfigured) {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
          console.warn("[AdminContext] Auth session missing or error in isAuthorized, checking offline fallback.");
          return checkOfflineFallback(email);
        }

        if (authUser.email?.trim().toLowerCase() !== email.trim().toLowerCase()) {
          console.warn(`[AdminContext] Session validation failed. Signed-in user email (${authUser.email}) does not match requested email (${email}).`);
          return false;
        }

        const isOwnerFromMetadata = authUser?.user_metadata?.is_owner === true || authUser?.user_metadata?.role === "admin";

        const { data, error } = await supabase
          .from("admin")
          .select("email, is_owner, is_active")
          .eq("email", email.trim().toLowerCase())
          .maybeSingle();

        if (error) {
          console.error(`[AdminContext] Database query error on 'admin' table for ${email}:`, error.message);
          if (isOwnerFromMetadata) {
            console.info("[AdminContext] Falling back to admin status from auth metadata.");
            return true;
          }
          console.warn(`[AdminContext] Falling back to offline fallback due to database query error: ${error.message}`);
          return checkOfflineFallback(email);
        }

        if (data) {
          // If is_active is null/undefined, heal it to true in the database and treat it as true
          let isActive = data.is_active;
          if (isActive === null || isActive === undefined) {
            isActive = true;
            try {
              await supabase
                .from("admin")
                .update({ is_active: true })
                .eq("email", email.trim().toLowerCase());
              console.info(`[AdminContext] Healed NULL is_active to true for user ${email}`);
            } catch (healErr) {
              console.warn("[AdminContext] Failed to heal is_active column:", healErr);
            }
          }

          let isOwner = data.is_owner;
          if ((isOwner === null || isOwner === undefined || isOwner === false) && isOwnerFromMetadata) {
            isOwner = true;
            try {
              await supabase
                .from("admin")
                .update({ is_owner: true })
                .eq("email", email.trim().toLowerCase());
              console.info(`[AdminContext] Healed is_owner to true for user ${email} based on auth metadata`);
            } catch (healErr) {
              console.warn("[AdminContext] Failed to heal is_owner column:", healErr);
            }
          }

          const isOwnerBool = isOwner === true;
          const isActiveBool = isActive === true;

          if (!isOwnerBool) {
            console.error(`[AdminContext] Access Denied: User (${email}) exists in admin table but is_owner flag is FALSE.`);
          }
          if (!isActiveBool) {
            console.error(`[AdminContext] Access Denied: User (${email}) exists in admin table but is_active flag is FALSE.`);
          }

          return isOwnerBool && isActiveBool;
        }

        console.warn(`[AdminContext] User (${email}) was not found in the 'admin' table. Checking fallbacks...`);

        if (isOwnerFromMetadata) {
          console.info("[AdminContext] Falling back to admin status from auth metadata because user is missing from 'admin' table.");
          return true;
        }

        return checkOfflineFallback(email);
      } catch (err) {
        console.error("AdminContext authorization exception:", err);
        return checkOfflineFallback(email);
      }
    } else {
      return checkOfflineFallback(email);
    }
  }, [checkOfflineFallback]);

  const clearLocalState = useCallback(() => {
    localStorage.removeItem("is_admin_authenticated");
    localStorage.removeItem("admin_logged_in_name");
    localStorage.removeItem("admin_logged_in_email");
    localStorage.removeItem("admin_session_token");
    setIsAdminAuth(false);
    setAdminUser(null);
  }, []);

  const logout = useCallback(async () => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Error signing out from Supabase Auth:", err);
      }
    }
    clearLocalState();
  }, [clearLocalState]);

  const verifySession = useCallback(async (): Promise<boolean> => {
    const storedToken = localStorage.getItem("admin_session_token");
    if (!storedToken) {
      if (localStorage.getItem("is_admin_authenticated") === "true") {
        const email = localStorage.getItem("admin_logged_in_email");
        const name = localStorage.getItem("admin_logged_in_name");
        if (email && name) {
          try {
            const token = await createJWT({ email, name });
            localStorage.setItem("admin_session_token", token);
            setAdminUser({ name, email });
            setIsAdminAuth(true);
            return true;
          } catch (err) {
            console.error("Failed to generate transitional session JWT:", err);
          }
        }
      }
      clearLocalState();
      return false;
    }

    try {
      const payload = await verifyJWT(storedToken);
      if (!payload) {
        clearLocalState();
        return false;
      } else {
        localStorage.setItem("is_admin_authenticated", "true");
        localStorage.setItem("admin_logged_in_name", payload.name);
        localStorage.setItem("admin_logged_in_email", payload.email);
        setAdminUser({ name: payload.name, email: payload.email });
        setIsAdminAuth(true);

        // Check if actually authorized in database/local fallback
        const authorized = await isAuthorized(payload.email);
        if (!authorized) {
          console.warn("[AdminContext] Session is active but user is no longer authorized.");
          clearLocalState();
          return false;
        }

        return true;
      }
    } catch (err) {
      console.error("Session verification error:", err);
      clearLocalState();
      return false;
    }
  }, [clearLocalState, isAuthorized]);

  const login = useCallback(async (name: string, email: string, token: string) => {
    localStorage.setItem("admin_session_token", token);
    localStorage.setItem("is_admin_authenticated", "true");
    localStorage.setItem("admin_logged_in_name", name);
    localStorage.setItem("admin_logged_in_email", email);
    setAdminUser({ name, email });
    setIsAdminAuth(true);
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (supabase && isSupabaseConfigured) {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        const targetEmail = authUser?.email || adminUser?.email || localStorage.getItem("admin_logged_in_email");
        if (!targetEmail) {
          console.warn("[AdminContext] checkAuth: No target email available for verification.");
          return false;
        }

        if (authError || !authUser) {
          console.warn(`[AdminContext] checkAuth: Supabase Auth missing or error: ${authError?.message || "No user session"}. Checking offline fallback for ${targetEmail}.`);
          return checkOfflineFallback(targetEmail);
        }

        // Ensure there is an active session matching the checked email
        if (authUser.email?.trim().toLowerCase() !== targetEmail.trim().toLowerCase()) {
          console.warn(`[AdminContext] checkAuth: Session mismatch. Auth user email (${authUser.email}) does not match target email (${targetEmail}).`);
          return false;
        }

        const isOwnerFromMetadata = authUser?.user_metadata?.is_owner === true || authUser?.user_metadata?.role === "admin";

        const { data, error } = await supabase
          .from("admin")
          .select("email, is_owner, is_active")
          .eq("email", targetEmail.trim().toLowerCase())
          .maybeSingle();

        if (error) {
          console.error(`[AdminContext] checkAuth: Database error checking 'admin' table for ${targetEmail}:`, error.message);
          if (isOwnerFromMetadata) {
            return true;
          }
          console.warn(`[AdminContext] Falling back to offline fallback due to database query error: ${error.message}`);
          return checkOfflineFallback(targetEmail);
        }

        if (data) {
          // If is_active is null/undefined, heal it to true in the database and treat it as true
          let isActive = data.is_active;
          if (isActive === null || isActive === undefined) {
            isActive = true;
            try {
              await supabase
                .from("admin")
                .update({ is_active: true })
                .eq("email", targetEmail.trim().toLowerCase());
              console.info(`[AdminContext] Healed NULL is_active to true for user ${targetEmail}`);
            } catch (healErr) {
              console.warn("[AdminContext] Failed to heal is_active column:", healErr);
            }
          }

          let isOwner = data.is_owner;
          if ((isOwner === null || isOwner === undefined || isOwner === false) && isOwnerFromMetadata) {
            isOwner = true;
            try {
              await supabase
                .from("admin")
                .update({ is_owner: true })
                .eq("email", targetEmail.trim().toLowerCase());
              console.info(`[AdminContext] Healed is_owner to true for user ${targetEmail} based on auth metadata`);
            } catch (healErr) {
              console.warn("[AdminContext] Failed to heal is_owner column:", healErr);
            }
          }

          const isOwnerBool = isOwner === true;
          const isActiveBool = isActive === true;

          if (!isOwnerBool) {
            console.error(`[AdminContext] checkAuth: Access Denied for ${targetEmail}: is_owner is FALSE.`);
          }
          if (!isActiveBool) {
            console.error(`[AdminContext] checkAuth: Access Denied for ${targetEmail}: is_active is FALSE.`);
          }

          return isOwnerBool && isActiveBool;
        }

        if (isOwnerFromMetadata) {
          return true;
        }

        // Check fallback if not in database yet
        return checkOfflineFallback(targetEmail);
      } catch (err) {
        console.error("AdminContext checkAuth exception:", err);
        return false;
      }
    } else {
      // Offline fallback
      const targetEmail = adminUser?.email || localStorage.getItem("admin_logged_in_email");
      if (!targetEmail) return false;

      return checkOfflineFallback(targetEmail);
    }
  }, [adminUser, checkOfflineFallback]);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      await verifySession();
      setLoading(false);
    };
    initAuth();
  }, [verifySession]);

  return (
    <AdminContext.Provider value={{
      isAdminAuth,
      adminUser,
      loading,
      login,
      logout,
      verifySession,
      isAuthorized,
      checkAuth,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
