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
    if (!supabase || !isSupabaseConfigured) {
      return false;
    }
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.warn("[AdminContext] isAuthorized: No active authenticated user found.");
        return false;
      }

      const { data: admin, error } = await supabase
        .from("admin")
        .select("*")
        .eq("id", authUser.id)
        .single();

      console.log("User ID:", authUser.id);
      console.log("Admin Record:", admin);
      console.log("Admin Error:", error);

      if (error || !admin) {
        return false;
      }

      return admin.is_owner === true && admin.is_active === true;
    } catch (err) {
      console.error("AdminContext isAuthorized exception:", err);
      return false;
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
    if (!supabase || !isSupabaseConfigured) {
      return false;
    }
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.warn("[AdminContext] checkAuth: No active authenticated user found.");
        return false;
      }

      const { data: admin, error } = await supabase
        .from("admin")
        .select("*")
        .eq("id", authUser.id)
        .single();

      console.log("User ID:", authUser.id);
      console.log("Admin Record:", admin);
      console.log("Admin Error:", error);

      if (error || !admin) {
        return false;
      }

      return admin.is_owner === true && admin.is_active === true;
    } catch (err) {
      console.error("AdminContext checkAuth exception:", err);
      return false;
    }
  }, []);



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
