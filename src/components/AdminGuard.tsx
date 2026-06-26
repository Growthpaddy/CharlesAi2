import React, { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useNavigation } from "../context/NavigationContext";
import { Loader2, ShieldAlert } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
  onVerificationComplete?: (isValid: boolean) => void;
}

export function AdminGuard({ children, onVerificationComplete }: AdminGuardProps) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { navigateTo } = useNavigation();

  useEffect(() => {
    let active = true;

    async function verifyAdminRole() {
      const isAuthLocal = localStorage.getItem("is_admin_authenticated") === "true";
      const loggedInEmail = localStorage.getItem("admin_logged_in_email");

      if (!isAuthLocal || !loggedInEmail) {
        if (active) {
          setAuthorized(false);
          setChecking(false);
          if (onVerificationComplete) onVerificationComplete(false);
        }
        return;
      }

      if (supabase && isSupabaseConfigured) {
        try {
          // Verify with Supabase Auth session first
          const { data: { user: authUser } } = await supabase.auth.getUser();
          const targetEmail = authUser?.email || loggedInEmail;

          if (authUser && targetEmail && authUser.email?.trim().toLowerCase() === targetEmail.trim().toLowerCase()) {
            if (active) {
              setAuthorized(true);
              setChecking(false);
              if (onVerificationComplete) onVerificationComplete(true);
            }
            return;
          }

          // Check metadata in Supabase users table
          const isOwnerFromMetadata = authUser?.user_metadata?.is_owner === true || authUser?.user_metadata?.role === "admin";

          // Attempt query on the active admin table 'admin'
          const { data, error } = await supabase
            .from("admin")
            .select("email, is_owner")
            .eq("email", targetEmail.trim().toLowerCase())
            .maybeSingle();

          if (error) {
            console.warn("AdminGuard: Supabase verification query notice:", error);
            
            if (isOwnerFromMetadata && active) {
              console.log("AdminGuard: Authorized via user_metadata in Supabase users table.");
              setAuthorized(true);
              setChecking(false);
              if (onVerificationComplete) onVerificationComplete(true);
              return;
            }

            // If the table 'admin' does not exist yet (error code 42P01), 
            // allow access as a fallback so they can run the database setup!
            const isTableMissing = error.code === "42P01" || error.message?.includes("does not exist");
            if (isTableMissing && active) {
              console.warn("AdminGuard: Table 'admin' does not exist yet. Allowing fallback access to allow database setup.");
              setAuthorized(true);
              setChecking(false);
              if (onVerificationComplete) onVerificationComplete(true);
              return;
            }

            // If connection failure, maintain safety but allow retry
            if (active) {
              setAuthorized(false);
              setChecking(false);
              if (onVerificationComplete) onVerificationComplete(false);
            }
            return;
          }

          if ((data && data.is_owner) || isOwnerFromMetadata) {
            if (active) {
              setAuthorized(true);
              setChecking(false);
              if (onVerificationComplete) onVerificationComplete(true);
            }
          } else {
            // Fallback: check if they are the signed up admin in local storage
            const signedUp = localStorage.getItem("signed_up_admin");
            if (signedUp) {
              try {
                const parsed = JSON.parse(signedUp);
                if (parsed && parsed.email?.toLowerCase() === targetEmail.trim().toLowerCase()) {
                  if (active) {
                    setAuthorized(true);
                    setChecking(false);
                    if (onVerificationComplete) onVerificationComplete(true);
                  }
                  return;
                }
              } catch (_) {}
            }

            console.warn("AdminGuard: No matching active Owner Admin account found for email:", targetEmail);
            // Session is unauthorized or was deleted from backend. Evict local credentials.
            localStorage.removeItem("is_admin_authenticated");
            localStorage.removeItem("admin_logged_in_name");
            localStorage.removeItem("admin_logged_in_email");
            localStorage.removeItem("admin_session_token");
            try {
              await supabase.auth.signOut();
            } catch (_) {}
            
            if (active) {
              setAuthorized(false);
              setChecking(false);
              if (onVerificationComplete) onVerificationComplete(false);
            }
          }
        } catch (err) {
          console.error("AdminGuard: Exception during role verification:", err);
          if (active) {
            setAuthorized(false);
            setChecking(false);
            if (onVerificationComplete) onVerificationComplete(false);
          }
        }
      } else {
        // Safe offline/local simulation fallback if remote service isn't plugged in yet
        if (active) {
          setAuthorized(true);
          setChecking(false);
          if (onVerificationComplete) onVerificationComplete(true);
        }
      }
    }

    verifyAdminRole();

    return () => {
      active = false;
    };
  }, [onVerificationComplete]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-sm">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-50 text-[#0056D2] rounded-2xl flex items-center justify-center mx-auto border border-blue-150 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin text-[#0056D2]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-800 tracking-wide">
              Securing Active Session
            </p>
            <p className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
              Verifying administrative role authority...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="max-w-md bg-white border border-slate-200/80 p-9 rounded-3xl shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border border-rose-100 shadow-xs">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-slate-900 leading-snug">
              Role Authority Denied
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              You are not registered as an authorized administrator. Your session could not be verified securely in the master database.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("is_admin_authenticated");
              localStorage.removeItem("admin_logged_in_name");
              localStorage.removeItem("admin_logged_in_email");
              navigateTo("admin");
              window.location.hash = "admin-login";
            }}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-xs font-black text-white rounded-xl shadow-md transition-all duration-150 cursor-pointer min-h-[44px]"
          >
            Access Login Portal
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
