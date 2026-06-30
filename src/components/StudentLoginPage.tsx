import React, { useState, useEffect } from "react";
import { Mail, Lock, Phone, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useNavigation } from "../context/NavigationContext";

export default function StudentLoginPage() {
  const { navigateTo } = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // If already authenticated locally or in session, check and redirect
    const checkUserSession = async () => {
      if (supabase && isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          localStorage.setItem("is_student_authenticated", "true");
          localStorage.setItem("student_logged_in_id", session.user.id);
          localStorage.setItem("student_logged_in_email", session.user.email || "");
          navigateTo("dashboard");
        }
      } else {
        if (localStorage.getItem("is_student_authenticated") === "true") {
          navigateTo("dashboard");
        }
      }
    };
    checkUserSession();
  }, [navigateTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg("Please provide your email address and secure passcode.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          // Check fallback profile mapping (for manual/direct profiles)
          const { data: profileRecord, error: profileError } = await supabase
            .from("students")
            .select("*")
            .eq("email", cleanEmail)
            .maybeSingle();

          if (!profileError && profileRecord && profileRecord.password === password) {
            // Bypass if password matches raw column (for compatibility with existing students)
            setSuccessMsg(`Bypass verified. Welcome, ${profileRecord.full_name}!`);
            localStorage.setItem("is_student_authenticated", "true");
            localStorage.setItem("student_logged_in_name", profileRecord.full_name);
            localStorage.setItem("student_logged_in_email", profileRecord.email);
            localStorage.setItem("student_logged_in_id", profileRecord.id);
            localStorage.setItem("student_logged_in_status", (profileRecord.status || "Pending").toLowerCase());
            
            setTimeout(() => {
              navigateTo("dashboard");
            }, 1000);
            return;
          }
          throw error;
        }

        if (data?.user) {
          // Fetch student record for profile details
          const { data: studentRecord, error: studentError } = await supabase
            .from("students")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();

          const studentName = studentRecord?.full_name || data.user.email?.split("@")[0] || "Student Member";
          const studentStatus = studentRecord?.status || "Pending";

          setSuccessMsg(`Access verified. Welcome, ${studentName}!`);
          localStorage.setItem("is_student_authenticated", "true");
          localStorage.setItem("student_logged_in_name", studentName);
          localStorage.setItem("student_logged_in_email", data.user.email || "");
          localStorage.setItem("student_logged_in_id", data.user.id);
          localStorage.setItem("student_logged_in_status", studentStatus.toLowerCase());

          setTimeout(() => {
            navigateTo("dashboard");
          }, 1000);
        }
      } else {
        // Local storage / Sandbox accounts fallback simulation
        const localProfilesStr = localStorage.getItem("admin_profiles");
        const currentProfiles = localProfilesStr ? JSON.parse(localProfilesStr) : [];
        const matched = currentProfiles.find(
          (p: any) => p.email.toLowerCase() === cleanEmail && p.password === password
        );

        if (matched) {
          setSuccessMsg(`Access verified (Sandbox). Welcome back, ${matched.full_name}!`);
          localStorage.setItem("is_student_authenticated", "true");
          localStorage.setItem("student_logged_in_name", matched.full_name);
          localStorage.setItem("student_logged_in_email", matched.email);
          localStorage.setItem("student_logged_in_id", matched.id);
          localStorage.setItem("student_logged_in_status", (matched.status || "active").toLowerCase());
          
          setTimeout(() => {
            navigateTo("dashboard");
          }, 1000);
        } else {
          setErrorMsg("Student profile not found or invalid security credentials.");
        }
      }
    } catch (err: any) {
      console.error("Authentication fault:", err);
      setErrorMsg(err.message || "Student profile not found or invalid security credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = "Hello Support, I am experiencing a login difficulty accessing my student dashboard account. Kindly assist with my activation status.";
  const whatsappUrl = `https://wa.me/2347068300818?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16 text-white relative overflow-hidden">
      {/* Background visual graphics elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-900/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10">
        
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950 border border-blue-800/30 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Institutional Study Gate</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Study Terminal
          </h1>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Log in using your authorized email address and secure passcode credentials to enter your active workspace.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/60 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/30 text-rose-300 text-xs rounded-xl font-medium text-left leading-relaxed">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/30 text-emerald-300 text-xs rounded-xl font-medium text-left leading-relaxed">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4.5 h-4.5" />
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 focus:bg-slate-950/40 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4.5 h-4.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 focus:bg-slate-950/40 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-900/20"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Log In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* SOS Support Pipeline */}
        <div className="pt-2 text-center space-y-3">
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">
            Experiencing entry faults?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-emerald-950/40 w-full justify-center"
          >
            {/* Elegant Inline SVG WhatsApp icon inside */}
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.488 2.01 14.039.987 11.99.987 6.558.987 2.13 5.36 2.127 10.79c-.001 1.748.473 3.456 1.372 4.975l-.973 3.55 3.642-.955zM17.15 14.39c-.28-.14-1.65-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.28-.73.9-.9 1.1-.17.19-.34.21-.62.07-1.42-.71-2.34-1.28-3.23-2.82-.23-.4-.23-.74-.09-.88.13-.13.28-.34.42-.51.14-.17.19-.29.28-.49.09-.19.04-.37-.02-.51-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.51.07-.78.36-.27.29-1.03 1.01-1.03 2.46s1.05 2.85 1.2 3.05c.15.19 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.62.71.22 1.35.19 1.86.12.57-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.12-.26-.19-.54-.33z" />
            </svg>
            <span>WhatsApp Support (07068300818)</span>
          </a>
        </div>

      </div>
    </div>
  );
}
