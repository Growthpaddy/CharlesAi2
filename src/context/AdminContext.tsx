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

  const isAuthorized = useCallback(async (email: string): Promise<boolean> => {
    if (!email) return false;

    if (supabase && isSupabaseConfigured) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const isOwnerFromMetadata = authUser?.user_metadata?.is_owner === true || authUser?.user_metadata?.role === "admin";

        const { data, error } = await supabase
          .from("admin")
          .select("email, is_owner")
          .eq("email", email.trim().toLowerCase())
          .maybeSingle();

        if (error) {
          console.warn("AdminContext authorization query notice:", error);
          if (isOwnerFromMetadata) {
            return true;
          }
          // If the table 'admin' does not exist yet (error code 42P01), 
          // let's fall back to checking if this email is the signed_up_admin or is in local fallback 
          // instead of instantly locking them out and deleting their session!
          const isTableMissing = error.code === "42P01" || error.message?.includes("does not exist");
          if (isTableMissing) {
            const signedUp = localStorage.getItem("signed_up_admin");
            if (signedUp) {
              const parsed = JSON.parse(signedUp);
              if (parsed && parsed.email?.toLowerCase() === email.trim().toLowerCase()) {
                return true;
              }
            }
            // Also allow the default admin email as fallback
            if (email.toLowerCase() === "admin@aionlinebusiness.org") {
              return true;
            }
          }
          return false;
        }

        if (data && data.is_owner === true) {
          return true;
        }

        if (isOwnerFromMetadata) {
          return true;
        }

        // If data is null (empty table or user missing), let's also check if they are the signed up admin in localStorage
        const signedUp = localStorage.getItem("signed_up_admin");
        if (signedUp) {
          try {
            const parsed = JSON.parse(signedUp);
            if (parsed && parsed.email?.toLowerCase() === email.trim().toLowerCase()) {
              return true;
            }
          } catch (_) {}
        }

        return false;
      } catch (err) {
        console.error("AdminContext authorization exception:", err);
        return false;
      }
    } else {
      // Offline fallback check using localStorage
      const localAdmins = localStorage.getItem("academy_admins");
      if (localAdmins) {
        try {
          const parsed = JSON.parse(localAdmins);
          if (Array.isArray(parsed)) {
            return parsed.some(admin => admin.email?.toLowerCase() === email.trim().toLowerCase());
          }
        } catch (_) {}
      }
      
      const signedUp = localStorage.getItem("signed_up_admin");
      if (signedUp) {
        try {
          const parsed = JSON.parse(signedUp);
          if (parsed && parsed.email?.toLowerCase() === email.trim().toLowerCase()) {
            return true;
          }
        } catch (_) {}
      }

      // Default fallback if no admin accounts found but auth was completed
      return true;
    }
  }, []);

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
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const targetEmail = authUser?.email || adminUser?.email || localStorage.getItem("admin_logged_in_email");
        if (!targetEmail) return false;

        const isOwnerFromMetadata = authUser?.user_metadata?.is_owner === true || authUser?.user_metadata?.role === "admin";

        const { data, error } = await supabase
          .from("admin")
          .select("email, is_owner")
          .eq("email", targetEmail.trim().toLowerCase())
          .maybeSingle();

        if (error) {
          console.warn("AdminContext checkAuth query notice:", error);
          if (isOwnerFromMetadata) {
            return true;
          }
          const isTableMissing = error.code === "42P01" || error.message?.includes("does not exist");
          if (isTableMissing) {
            const signedUp = localStorage.getItem("signed_up_admin");
            if (signedUp) {
              const parsed = JSON.parse(signedUp);
              if (parsed && parsed.email?.toLowerCase() === targetEmail.trim().toLowerCase()) {
                return true;
              }
            }
            if (targetEmail.toLowerCase() === "admin@aionlinebusiness.org") {
              return true;
            }
          }
          return false;
        }

        if (data && data.is_owner === true) {
          return true;
        }

        if (isOwnerFromMetadata) {
          return true;
        }

        // Check fallback if not in database yet
        const signedUp = localStorage.getItem("signed_up_admin");
        if (signedUp) {
          try {
            const parsed = JSON.parse(signedUp);
            if (parsed && parsed.email?.toLowerCase() === targetEmail.trim().toLowerCase()) {
              return true;
            }
          } catch (_) {}
        }

        return false;
      } catch (err) {
        console.error("AdminContext checkAuth exception:", err);
        return false;
      }
    } else {
      // Offline fallback
      const targetEmail = adminUser?.email || localStorage.getItem("admin_logged_in_email");
      if (!targetEmail) return false;

      const localAdmins = localStorage.getItem("academy_admins");
      if (localAdmins) {
        try {
          const parsed = JSON.parse(localAdmins);
          if (Array.isArray(parsed)) {
            const match = parsed.find(admin => admin.email?.toLowerCase() === targetEmail.trim().toLowerCase());
            return !!match && (match.is_owner === true || match.is_owner === undefined || match.is_owner === null);
          }
        } catch (_) {}
      }

      const signedUp = localStorage.getItem("signed_up_admin");
      if (signedUp) {
        try {
          const parsed = JSON.parse(signedUp);
          if (parsed && parsed.email?.toLowerCase() === targetEmail.trim().toLowerCase()) {
            return parsed.is_owner === true || parsed.is_owner === undefined || parsed.is_owner === null;
          }
        } catch (_) {}
      }

      return true;
    }
  }, [adminUser]);

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
