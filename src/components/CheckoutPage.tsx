/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Lock, CreditCard, Landmark, CheckCircle, ShieldCheck, 
  UserPlus, FileText, ChevronLeft, Copy, ExternalLink, 
  MessageSquare, ArrowRight, ShieldAlert, Sparkles, Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";

export default function CheckoutPage({ 
  courseId, 
  onNavigate 
}: { 
  courseId: string; 
  onNavigate: (page: string, params?: any) => void 
}) {
  const [course, setCourse] = useState<any>(null);
  const [isStudentRegistered, setIsStudentRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Custom interactive notifications state
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Accurate payload schema fields as represented inside your database structure (now with password support)
  const [studentForm, setStudentForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    status: "Active",
    metadata: { generated_via: "public_checkout_pipeline" }
  });

  useEffect(() => {
    async function getCheckoutTarget() {
      setIsLoading(true);
      setError(null);
      try {
        let targetId = courseId;
        
        // Fallback: If no courseId is provided, fetch the first available course
        if (!targetId) {
          const { data: allCourses, error: listErr } = await supabase
            .from("courses")
            .select("id")
            .limit(1);
          
          if (listErr) throw listErr;
          
          if (allCourses && allCourses.length > 0) {
            targetId = allCourses[0].id;
          }
        }

        if (!targetId) {
          throw new Error("No active academic course tracks could be found in the database.");
        }

        const { data, error: fetchErr } = await supabase
          .from("courses")
          .select("id, title, tagline, overview, instructor_name, instructor_bio, price_naira, thumbnail_url, duration_text, difficulty")
          .eq("id", targetId)
          .single();

        if (fetchErr) throw fetchErr;
        if (!data) throw new Error("The requested course track detail could not be resolved.");

        setCourse(data);
      } catch (err: any) {
        console.error("Checkout course loader error:", err);
        setError(err.message || "Failed to initialize active checkout invoice.");
      } finally {
        setIsLoading(false);
      }
    }
    getCheckoutTarget();
  }, [courseId]);

  const handleStudentRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setIsSubmitting(true);
    setNotification({ type: null, message: "" });
    
    try {
      if (!studentForm.password || studentForm.password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      // Execute native Supabase signup call
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentForm.email.trim().toLowerCase(),
        password: studentForm.password,
        options: {
          data: {
            full_name: studentForm.full_name,
            phone: studentForm.phone
          }
        }
      });

      if (authError) throw authError;

      if (!authData?.user) {
        throw new Error("Account registration did not return a valid student user record.");
      }

      // Profile correlation row insertion inside public.students
      const { error: insertError } = await supabase.from("students").insert([
        {
          id: authData.user.id, // Explicitly anchor the student record to the Auth User ID
          full_name: studentForm.full_name,
          email: studentForm.email.trim().toLowerCase(),
          phone: studentForm.phone,
          status: "Active",
          enrolled_courses: [course.id],
          metadata: { ...studentForm.metadata, auth_link_executed: true }
        }
      ]);

      if (insertError) throw insertError;
      
      setIsStudentRegistered(true);
      setNotification({
        type: "success",
        message: "Student account created successfully! Payment gateways have been unlocked."
      });
    } catch (err: any) {
      setNotification({
        type: "error",
        message: `Registration block: ${err.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText("1307899418");
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Helper to safely format Nigerian Naira pricing
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-100 to-slate-200/50 flex flex-col items-center justify-center py-24 px-6 pt-28">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#0056D2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Assembling Secure Invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-100 to-slate-200/50 flex flex-col items-center justify-center py-24 px-6 pt-28">
        <div className="max-w-md bg-white/85 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
            <Lock className="w-5 h-5 stroke-2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Checkout Target Blocked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {error || "We could not resolve any academic course target for the checkout pipeline."}
            </p>
          </div>
          <button 
            onClick={() => onNavigate("programs")}
            className="w-full py-3 bg-[#0056D2] hover:bg-[#003E9C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Explore Course Programs
          </button>
        </div>
      </div>
    );
  }

  const courseCover = course.thumbnail_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=600";
  
  // Dynamic message construction for direct checkout verification WhatsApp pipeline
  const formattedPrice = formatNaira(course.price_naira);
  const whatsappMsgText = `Hello DSP Academy! I have completed payment for the course "${course.title}" via direct bank transfer of ${formattedPrice}.\n\nHere are my enrollment details:\n- Name: ${studentForm.full_name || "(Provided in Slip)"}\n- Registered Email: ${studentForm.email || "(Provided in Slip)"}\n- Phone: ${studentForm.phone || "(Provided in Slip)"}\n\nI have attached my transfer payment receipt below. Kindly verify and activate my course access.`;
  const whatsappConfirmationUrl = `https://wa.me/2347068300818?text=${encodeURIComponent(whatsappMsgText)}`;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#F8FAFC] via-[#EEF2F6] to-[#E2E8F0] font-sans antialiased text-slate-800 py-12 px-4 sm:px-6 md:px-8 pt-28 relative overflow-hidden">
      
      {/* Absolute Decorative Premium Ambient Backdrop Rings */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation & Back Action Bar */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate("course_details", { courseId: course.id })}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0056D2] transition-colors group cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
            <span>Return to Course Syllabus</span>
          </button>

          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/80 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold text-slate-500 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>SECURE 256-BIT CRYPTO ENDPOINT</span>
          </div>
        </div>

        {/* STEP-BY-STEP PROGRESS PIPELINE MAPPED */}
        <div className="bg-white/45 backdrop-blur-md border border-white/60 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0 items-center justify-between text-left relative overflow-hidden">
          
          {/* Phase 1 Indicator */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
              isStudentRegistered 
                ? "bg-emerald-100 text-emerald-700 border border-emerald-300" 
                : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
            }`}>
              {isStudentRegistered ? <Check className="w-4 h-4 stroke-[3]" /> : "01"}
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Phase 1</p>
              <h4 className={`text-xs font-black uppercase tracking-tight ${!isStudentRegistered ? "text-slate-900" : "text-slate-500"}`}>
                Student Ledger Account Verification
              </h4>
            </div>
          </div>

          {/* Phase 2 Indicator */}
          <div className="flex items-center gap-3 sm:border-l sm:border-slate-300/40 sm:pl-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
              isStudentRegistered 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "bg-slate-200 text-slate-400 border border-slate-300"
            }`}>
              02
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Phase 2</p>
              <h4 className={`text-xs font-black uppercase tracking-tight ${isStudentRegistered ? "text-slate-900" : "text-slate-400"}`}>
                Unlock Gateway & Fee Settlement
              </h4>
            </div>
          </div>
        </div>

        {/* Notification Toast Banner */}
        <AnimatePresence mode="wait">
          {notification.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs text-left ${
                notification.type === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-extrabold uppercase tracking-wider text-[10px]">
                  {notification.type === "success" ? "Verification Successful" : "Operational Exception Alert"}
                </p>
                <p className="font-medium leading-relaxed">{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ASYMMETRIC GLASSMORPHISM GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* LEFT / CENTER CONTROLS COLUMN (Steps) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Step 1: Secure Student Account Signup Wrapper */}
            <div className="bg-white/70 backdrop-blur-lg border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/40">
                <div className={`p-2 rounded-xl text-white shadow-sm transition-all duration-300 ${isStudentRegistered ? "bg-emerald-600" : "bg-[#0056D2]"}`}>
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Step 1: Create Secure Student Account</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Register your profile and choose an access password before unlocking the payment gateway.</p>
                </div>
              </div>

              {isStudentRegistered ? (
                <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1 text-xs">
                  <p className="font-extrabold text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Student Account Created
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium leading-relaxed">
                    Student account is registered and authenticated. You can now select payment methods from the card below to finalize course access.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleStudentRegistrationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1.5">Student Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={studentForm.full_name} 
                        onChange={e => setStudentForm({...studentForm, full_name: e.target.value})} 
                        placeholder="John Doe" 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#0056D2] rounded-xl px-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-colors" 
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1.5">Active Contact Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={studentForm.email} 
                        onChange={e => setStudentForm({...studentForm, email: e.target.value})} 
                        placeholder="name@example.com" 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#0056D2] rounded-xl px-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-colors" 
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1.5">Access Password (Minimum 6 characters)</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required 
                          value={studentForm.password} 
                          onChange={e => setStudentForm({...studentForm, password: e.target.value})} 
                          placeholder="••••••••" 
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#0056D2] rounded-xl px-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-colors pr-12" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-mono uppercase tracking-wider font-extrabold focus:outline-none cursor-pointer"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1.5">WhatsApp / Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={studentForm.phone} 
                        onChange={e => setStudentForm({...studentForm, phone: e.target.value})} 
                        placeholder="e.g. +234 706 830 0818" 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#0056D2] rounded-xl px-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-colors" 
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Student Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account & Unlock Gateway</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Step 2: Payment Gateways Selection (Glassmorphism Unlocked Mode) */}
            <div className={`bg-white/70 backdrop-blur-lg border rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-xl space-y-6 text-left relative overflow-hidden ${
              isStudentRegistered 
                ? "border-white/60 opacity-100" 
                : "border-slate-200/30 opacity-45 select-none pointer-events-none"
            }`}>
              
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200/40">
                <div className={`p-2 rounded-xl shadow-sm transition-all duration-300 ${isStudentRegistered ? "bg-[#0056D2] text-white" : "bg-slate-100 text-slate-400"}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Step 2: Interactive Payment Gateways</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Select your preferred payment gateway interface below to complete transaction.</p>
                </div>
              </div>

              {!isStudentRegistered && (
                <div className="p-4 bg-slate-100/60 border border-slate-200/50 rounded-2xl flex items-center gap-2.5 text-xs text-slate-400 font-medium">
                  <Lock className="w-4 h-4 shrink-0 text-slate-400 animate-pulse" />
                  <span>Please complete profile registration in Step 1 to unlock gateway options.</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {/* Option A: Pay Online via Paystack */}
                <button
                  type="button"
                  disabled={!isStudentRegistered}
                  onClick={() => setSelectedMethod("paystack")}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    selectedMethod === "paystack" 
                      ? "border-[#0056D2] bg-blue-50/10 shadow-sm" 
                      : "border-slate-200/70 hover:border-slate-300 bg-white/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg border mt-0.5 ${selectedMethod === "paystack" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Paystack Secure Online Gate</span>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded px-1 text-[8px] font-mono uppercase tracking-wider font-extrabold">Instant</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Pay automatically using Cards, USSD, Bank Apps, or Bank Transfers with automatic approval.</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${selectedMethod === "paystack" ? "border-[#0056D2]" : "border-slate-300"}`}>
                    {selectedMethod === "paystack" && <div className="w-2 h-2 bg-[#0056D2] rounded-full" />}
                  </div>
                </button>

                {/* Option B: Direct Manual Bank Wire Transfer */}
                <button
                  type="button"
                  disabled={!isStudentRegistered}
                  onClick={() => setSelectedMethod("transfer")}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    selectedMethod === "transfer" 
                      ? "border-[#0056D2] bg-blue-50/10 shadow-sm" 
                      : "border-slate-200/70 hover:border-slate-300 bg-white/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg border mt-0.5 ${selectedMethod === "transfer" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Manual Bank Wire Transfer</span>
                        <span className="bg-amber-50 text-amber-600 border border-amber-100 rounded px-1 text-[8px] font-mono uppercase tracking-wider font-extrabold">Manual Verify</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Transfer directly to our corporate accounts and upload your transaction receipt to WhatsApp.</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${selectedMethod === "transfer" ? "border-[#0056D2]" : "border-slate-300"}`}>
                    {selectedMethod === "transfer" && <div className="w-2 h-2 bg-[#0056D2] rounded-full" />}
                  </div>
                </button>
              </div>

              {/* DYNAMIC PAYMENT METHOD RENDERING */}
              <AnimatePresence mode="wait">
                {selectedMethod === "paystack" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-blue-50/20 border border-blue-100 rounded-2xl space-y-4"
                  >
                    <div className="text-left space-y-1">
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#0056D2]" /> Paystack Secure Checkout Gateway
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Your billing profile mapping has been constructed. Tap below to launch Paystack's verified modal to complete instant credit payment.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => alert(`Redirecting parameters to Paystack Gateway: NGN ${course.price_naira.toLocaleString()}`)}
                      className="w-full py-4 bg-[#0056D2] hover:bg-[#003E9C] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" /> Secure Online Payment (Naira {course.price_naira.toLocaleString()})
                    </button>
                  </motion.div>
                )}

                {selectedMethod === "transfer" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 text-left"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Direct Corporate Billing Account</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Please perform the transfer of exact total investment fees using the coordinates below:</p>
                    </div>

                    {/* Highly Polished Copyable Account Coordinates Block */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Bank Name</p>
                          <p className="font-extrabold text-slate-900 uppercase">PROVIDUS BANK</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Account Name</p>
                          <p className="font-extrabold text-slate-900">DEINO INTEGRATED SERVICES LTD</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Account Number</p>
                          <p className="text-base font-mono font-black text-blue-600 tracking-wider">1307899418</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={copyAccountNumber}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer shrink-0 min-h-[38px]"
                        >
                          {copySuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp Confirm Slip CTA Block */}
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 space-y-3.5">
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        <strong>Important:</strong> After successful wire execution, capture the digital transaction receipt and click the instant validation button below to send verification details directly to our registrar office.
                      </p>

                      <a
                        href={whatsappConfirmationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer no-underline text-center"
                      >
                        <MessageSquare className="w-4.5 h-4.5 shrink-0" />
                        <span>Confirm Transfer on WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Glassmorphic Invoice Summary Card */}
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-40">
            <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl p-6 shadow-xl space-y-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200/40">
                <FileText className="w-4.5 h-4.5 text-[#0056D2]" />
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">Order Invoice Summary</h4>
              </div>

              {/* Cover Artwork */}
              <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 relative bg-slate-900 shadow-inner">
                <img 
                  src={courseCover} 
                  alt="" 
                  className="w-full h-full object-cover filter saturate-90 brightness-95"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3 pt-8">
                  <span className="bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {course.difficulty || "Certified Hub"}
                  </span>
                </div>
              </div>

              {/* Course Title and parameters */}
              <div className="space-y-1 text-left">
                <h5 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{course.title}</h5>
                <p className="text-[10px] font-medium text-slate-400">Academic Instructor: {course.instructor_name}</p>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal Tuition</span>
                  <span className="text-slate-800">{formatNaira(course.price_naira)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Resource Pack Materials</span>
                  <span className="text-emerald-600 uppercase font-extrabold text-[10px] tracking-wide">Included Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Global Examination Voucher</span>
                  <span className="text-emerald-600 uppercase font-extrabold text-[10px] tracking-wide">Included Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Database Hosting Levy</span>
                  <span>₦0.00</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-slate-900">
                  <span className="font-black uppercase tracking-wider text-[10px]">Grand Total Fees</span>
                  <span className="text-xl font-black text-[#0056D2] tracking-tight">{formatNaira(course.price_naira)}</span>
                </div>
              </div>

              {/* Security Shield Label */}
              <div className="pt-2 text-[10px] text-slate-500 font-medium flex items-start gap-2 bg-slate-50/50 p-3 rounded-2xl border border-dashed border-slate-200">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold uppercase text-[9px] text-slate-700 leading-tight">Secure Payment Protection</p>
                  <p className="text-slate-400 leading-normal">Your digital credentials and access certificates are encrypted and generated instantly on verification.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
