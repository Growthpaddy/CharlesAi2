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

          // Attempt query on the active admin table 'admin'
          const { data, error } = await supabase
            .from("admin")
            .select("email, is_owner, is_active")
            .eq("email", targetEmail.trim().toLowerCase())
            .maybeSingle();

          if (error) {
            console.error("AdminGuard: Supabase verification error:", error);
            // If connection failure, maintain safety but allow retry
            if (active) {
              setAuthorized(false);
              setChecking(false);
              if (onVerificationComplete) onVerificationComplete(false);
            }
            return;
          }

          if (data && data.is_owner && data.is_active) {
            if (active) {
              setAuthorized(true);
              setChecking(false);
              if (onVerificationComplete) onVerificationComplete(true);
            }
          } else {
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
