/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, CheckCircle, ShieldCheck, ArrowRight, CreditCard, 
  Send, Copy, Check, Upload, Clock, PhoneCall, ArrowUpRight, Lock, 
  FileCheck, ShieldAlert, Award, ChevronRight, User, Mail, Eye, KeyRound
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

export default function CheckoutPage() {
  const { activeCourseId, navigateTo } = useNavigation();
  const [copiedAccNumber, setCopiedAccNumber] = useState(false);
  const [copiedBankName, setCopiedBankName] = useState(false);
  const [copiedAccName, setCopiedAccName] = useState(false);
  
  // Student registration states
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Bank Info Constants
  const BANK_NAME = "PROVIDUS BANK";
  const BANK_ACCOUNT = "1307899418";
  const ACCOUNT_NAME = "DEINO INTEGRATED SERVICES LTD";

  // Receipt Upload States
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [isReceiptUploading, setIsReceiptUploading] = useState(false);
  const [receiptSuccess, setReceiptSuccess] = useState(false);

  // Dynamically load courses from localStorage to fetch tuition cost as set inside the admin dashboard
  const [courses] = useState(() => {
    const local = localStorage.getItem("courses");
    if (local) {
      try {
        const decoded = JSON.parse(local);
        if (Array.isArray(decoded) && decoded.length > 0) return decoded;
      } catch (e) {
        console.warn("Could not decode local courses inside checkout:", e);
      }
    }
    // Deep fallback matching master curves
    return [
      {
        id: "course-1",
        title: "AI Prompt Engineering Mastery",
        description: "Master prompt frameworks, CO-STAR logic, and automation templates.",
        price: "₦45,000",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=450"
      },
      {
        id: "course-2",
        title: "AI Digital Products Creation",
        description: "Publish your assets and monetize books on global Selar & KDP paths.",
        price: "₦45,000",
        thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600&h=450"
      }
    ];
  });

  // Identify active selected course
  const activeCourse = courses.find((c: any) => c.id === activeCourseId) || courses[0];

  // Read lead 70% tuition discount flag from lead registration
  const isDiscountClaimed = localStorage.getItem("tuition_discount_claimed") === "true";

  // Safely parse price metrics
  const rawPriceString = activeCourse.price || "₦45,000";
  const numericalPrice = parseInt(rawPriceString.replace(/[^0-9]/g, "")) || 45000;
  
  // Calculate discount metrics
  const discountAmount = Math.round(numericalPrice * 0.70);
  const finalPriceValue = isDiscountClaimed 
    ? Math.round(numericalPrice * 0.30) // 70% off means they pay only 30%!
    : numericalPrice;

  // Formatted price tags
  const formattedOriginalPrice = `₦${numericalPrice.toLocaleString()}`;
  const formattedDiscountAmount = `₦${discountAmount.toLocaleString()}`;
  const formattedFinalPrice = `₦${finalPriceValue.toLocaleString()}`;

  const copyToClipboard = (text: string, type: "bank" | "acc" | "name") => {
    navigator.clipboard.writeText(text);
    if (type === "bank") {
      setCopiedBankName(true);
      setTimeout(() => setCopiedBankName(false), 2000);
    } else if (type === "acc") {
      setCopiedAccNumber(true);
      setTimeout(() => setCopiedAccNumber(false), 2000);
    } else {
      setCopiedAccName(true);
      setTimeout(() => setCopiedAccName(false), 2000);
    }
  };

  const handleRegisterAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim() || !studentPassword.trim()) {
      alert("Please fill in your Full Name, Email, and Passcode to build your account.");
      return;
    }

    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);

      // Save Student Profile to admin list so default lists sync automatically
      const existingProfilesStr = localStorage.getItem("admin_profiles");
      let existingProfiles = [];
      if (existingProfilesStr) {
        try {
          existingProfiles = JSON.parse(existingProfilesStr);
        } catch (e) {}
      }

      const newStudentId = `stud-${Date.now()}`;
      const newProfile = {
        id: newStudentId,
        full_name: studentName,
        email: studentEmail,
        role: "student",
        status: "active",
        location: studentPhone || "Lagos",
        created_at: new Date().toISOString()
      };

      existingProfiles.push(newProfile);
      localStorage.setItem("admin_profiles", JSON.stringify(existingProfiles));

      // Enroll student in standard local courses path for the active dash
      const existingEnrollmentsStr = localStorage.getItem("enrollments");
      let existingEnrollments = [];
      if (existingEnrollmentsStr) {
        try {
          existingEnrollments = JSON.parse(existingEnrollmentsStr);
        } catch (e) {}
      }

      const newEnr = {
        id: `enr-${Date.now()}`,
        courseId: activeCourse.id,
        enrolledAt: new Date().toISOString()
      };
      existingEnrollments.push(newEnr);
      localStorage.setItem("enrollments", JSON.stringify(existingEnrollments));

      // Populate in admin_enrollments so admin side can filter this student
      const adminEnrsStr = localStorage.getItem("admin_enrollments");
      let adminEnrs = [];
      if (adminEnrsStr) {
        try {
          adminEnrs = JSON.parse(adminEnrsStr);
        } catch (e) {}
      }

      const newAdminEnr = {
        id: `enr-adm-${Date.now()}`,
        user_id: newStudentId,
        course_id: activeCourse.id,
        status: "pending", // Pending full receipt verification
        enrolled_at: new Date().toISOString()
      };
      adminEnrs.push(newAdminEnr);
      localStorage.setItem("admin_enrollments", JSON.stringify(adminEnrs));

      // Trigger visual flag
      setIsRegistered(true);
    }, 1200);
  };

  const handleReceiptSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentReceipt(e.target.files[0]);
    }
  };

  const submitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentReceipt) {
      alert("Please select or drag a corporate payment transfer screenshot first!");
      return;
    }

    setIsReceiptUploading(true);

    setTimeout(() => {
      setIsReceiptUploading(false);
      setReceiptSuccess(true);

      // Force-activate enrollment status inside admin tracking upon receiving screenshot
      const adminEnrsStr = localStorage.getItem("admin_enrollments");
      if (adminEnrsStr) {
        try {
          const adminEnrs = JSON.parse(adminEnrsStr);
          const updated = adminEnrs.map((ae: any) => {
            if (ae.course_id === activeCourse.id) {
              return { ...ae, status: "active" };
            }
            return ae;
          });
          localStorage.setItem("admin_enrollments", JSON.stringify(updated));
        } catch (err) {
          console.warn(err);
        }
      }
    }, 1800);
  };

  // Build registrar WhatsApp link with detailed dynamic prefilled text
  const whatsappPrefix = "https://wa.me/2348091234567?text=";
  const whatsappMessage = `Hello Ai -Online Business Team, I have registered my student account [${studentName}] (${studentEmail}) on the checkout portal and completed the transfer payment of ${formattedFinalPrice} for the flagship program: "${activeCourse.title}". Kindly review my screenshot and activate my course portal instantly.`;
  const encodedWhatsappUrl = whatsappPrefix + encodeURIComponent(whatsappMessage);

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-905 pt-28 pb-20 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* PREMIUM STATUS BAR TRACING HERO */}
        <div className="bg-gradient-to-r from-[#031535] to-[#0D295C] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0056D2]/15 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/20 text-blue-300 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
                <span>Interactive Student Gateway</span>
              </span>
              <h1 className="text-2xl sm:text-3.5xl font-display font-black tracking-tight leading-none text-white">
                Finalize Course Enrollment
              </h1>
              <p className="text-slate-350 text-xs sm:text-sm font-medium leading-relaxed">
                Complete your premium student account profile credentials and instantly unlock corporate bank transfer guidelines below to initialize study access.
              </p>
            </div>

            {/* Price badge block */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shrink-0 text-center md:text-right min-w-[200px]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">Tuition Access Fee</span>
              {isDiscountClaimed ? (
                <div className="space-y-1">
                  <div className="flex gap-2 items-center justify-center md:justify-end">
                    <span className="text-xs text-slate-400 line-through font-bold">{formattedOriginalPrice}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                      70% Discount Applied
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-display font-black text-rose-500 block">{formattedFinalPrice}</span>
                </div>
              ) : (
                <span className="text-2xl sm:text-3xl font-display font-black text-white block">{formattedFinalPrice}</span>
              )}
            </div>
          </div>
        </div>

        {/* CORE DUAL SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: Step Form (7 Cols) */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* STAGES CHANGER */}
            <div className="flex items-center gap-2 text-xs border-b border-gray-100 pb-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${isRegistered ? "bg-emerald-100 text-emerald-700" : "bg-[#0056D2] text-white"}`}>
                {isRegistered ? "✓" : "1"}
              </span>
              <span className={`font-bold transition ${isRegistered ? "text-slate-400 line-through" : "text-[#0056D2]"}`}>
                Student Account Setup
              </span>
              
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${isRegistered ? "bg-[#0056D2] text-white" : "bg-slate-100 text-slate-400"}`}>
                2
              </span>
              <span className={`font-bold transition ${isRegistered ? "text-slate-900" : "text-slate-400"}`}>
                Tuition Transfer Activation
              </span>
            </div>

            {/* STEP 1 CODES: ACCOUNT REGISTER */}
            {!isRegistered ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Create Your Student Account</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Set up your login passcode. This lets you login to study lessons, check milestones, and interface with your instructor.
                  </p>
                </div>

                <form onSubmit={handleRegisterAccount} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Full Student Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sandra Peters"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full text-xs p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white bg-slate-50 text-slate-900 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. sandrapeters@gmail.com"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full text-xs p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white bg-slate-50 text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                        <span>WhatsApp / Mobile Phone *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +234 809 123 4567"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        className="w-full text-xs p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white bg-slate-50 text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                      <span>Choose Student Login Passcode *</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full text-xs p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white bg-slate-50 text-slate-900 font-mono font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full mt-4 py-4 bg-[#0056D2] hover:bg-blue-600 text-white text-xs font-black rounded-xl shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <span>{isRegistering ? "Saving Student Record..." : "Register Credentials & Show Payment Details"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* ACCOUNT SUCCESSFULLY CREATED -> REVEAL BANK DETAILS */
              <div className="space-y-6">
                
                {/* ACCOUNT SUCCESS DIALOG */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-150">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm">✓</span>
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm">Student Profile Created Successfully!</h4>
                    <p className="text-[11px] text-emerald-800 leading-normal mt-0.5">
                      Congratulations, <strong>{studentName}</strong>, your credential ledger has been recorded under email <strong>{studentEmail}</strong>. 
                    </p>
                  </div>
                </div>

                {/* TRANSFER ACTIVATION FORM DETAILS */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">Step 2: Deposit Your Access Fee</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Make your tuition wire payment to the corporate account coordinates below. Your dashboard profile activates instantly once confirmed.
                    </p>
                  </div>

                  {/* PROMINENT CORPORATE BANK DETAILS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 font-sans">
                    
                    <div className="flex items-center justify-between pb-2.5 border-b border-gray-200 text-xs">
                      <span className="text-slate-400 font-bold">Bank Name</span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{BANK_NAME}</span>
                        <button 
                          onClick={() => copyToClipboard(BANK_NAME, "bank")}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition"
                          title="Copy Bank name"
                        >
                          {copiedBankName ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 text-xs">
                      <span className="text-slate-400 font-bold">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#0056D2] text-sm tracking-widest">{BANK_ACCOUNT}</span>
                        <button 
                          onClick={() => copyToClipboard(BANK_ACCOUNT, "acc")}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition"
                          title="Copy Account Number"
                        >
                          {copiedAccNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 text-xs">
                      <span className="text-slate-400 font-bold">Account Name</span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-right">{ACCOUNT_NAME}</span>
                        <button 
                          onClick={() => copyToClipboard(ACCOUNT_NAME, "name")}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition"
                          title="Copy Account Name"
                        >
                          {copiedAccName ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-400 font-bold text-xs">Amount Due *</span>
                      <span className="font-display font-black text-rose-600 text-sm">{formattedFinalPrice}</span>
                    </div>
                  </div>

                  {/* USER NOTIFICATION PROMPT */}
                  <div className="p-4 bg-amber-50 border border-amber-100/60 rounded-xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10.5px] leading-relaxed text-amber-800">
                      <strong>Transfer Instructions:</strong> Ensure to make pay via transfer and send payment screenshot to the WhatsApp line button on the screen for instant manually activation. You can also contact us via WhatsApp for alternative payment links.
                    </p>
                  </div>

                  {/* DYNAMIC WHATSAPP ACTIVATION LINK BUTTON */}
                  <a
                    href={encodedWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Receipt WhatsApp Notification</span>
                  </a>

                  {/* SECURE DIRECT RECEIPT SCREENSHOT SUBMISSION */}
                  <div className="pt-4 border-t border-gray-100">
                    {receiptSuccess ? (
                      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">Transfer receipt submitted!</h4>
                        <p className="text-[10.5px] text-slate-500 leading-normal max-w-sm mx-auto">
                          Thank you! Our ledger matching team is reviewing your wire transfer. You can now access your courses safely.
                        </p>
                        
                        <button
                          onClick={() => navigateTo("dashboard")}
                          className="w-full py-3.5 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl transition cursor-pointer min-h-[44px]"
                        >
                          Proceed directly to your Study Console
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={submitReceipt} className="space-y-3">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                          Or drag copy of transaction screenshot here:
                        </label>
                        
                        <div className="relative border-2 border-dashed border-slate-200 hover:border-[#0056D2]/60 rounded-2xl p-6 transition-all text-center bg-slate-50/40 relative group">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleReceiptSelection}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                          <div className="space-y-1">
                            <Upload className="w-5 h-5 text-slate-400 group-hover:text-amber-500 mx-auto" />
                            {paymentReceipt ? (
                              <p className="text-xs font-black text-emerald-600">✓ {paymentReceipt.name}</p>
                            ) : (
                              <p className="text-[10px] text-slate-500">Pick image, PDF, or screenshot of deposit</p>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isReceiptUploading || !paymentReceipt}
                          className={`w-full py-3 text-xs font-black rounded-xl transition min-h-[40px] uppercase ${
                            paymentReceipt 
                              ? "bg-slate-905 text-white hover:bg-slate-950 cursor-pointer" 
                              : "bg-slate-100 text-slate-400 cursor-not-allowed border border-gray-250"
                          }`}
                        >
                          {isReceiptUploading ? "Vetting Receipt..." : "Upload Transfer Receipt"}
                        </button>
                      </form>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* RIGHT COL VALUE BAR: Program Overview (5 Cols) */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            
            {/* INVOICE CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono text-slate-400 border-b border-gray-100 pb-2">
                Order Curriculum Overview
              </h4>

              <div className="flex gap-3">
                <img src={activeCourse.thumbnail} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0 border border-gray-100" />
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold">Curriculum Allocation</span>
                  <h3 className="text-xs font-black text-slate-900 leading-tight block truncate max-w-[210px]" title={activeCourse.title}>
                    {activeCourse.title}
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded-full font-bold">
                    {activeCourse.duration || "10 hours"} Live Course
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-gray-100 font-sans text-slate-600">
                <div className="flex justify-between">
                  <span>Standard Admission Plan</span>
                  <span className="font-bold text-slate-900">{formattedOriginalPrice}</span>
                </div>
                
                {isDiscountClaimed && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Lead Discount (70%)</span>
                    <span>-{formattedDiscountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-gray-100 pt-2.5 font-bold text-slate-950 text-sm">
                  <span>Total Payable</span>
                  <span className="text-emerald-700 font-black">{formattedFinalPrice}</span>
                </div>
              </div>
            </div>

            {/* VIP INCLUSIONS CARD */}
            <div className="bg-[#04112B] text-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">Standard Academic Pack</span>
              <h4 className="font-sans text-sm font-black text-white">Full Course Features & Privileges:</h4>
              
              <ul className="space-y-4 text-[11px] text-slate-350">
                <li className="flex gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Full Outlines & Modules:</strong> Lifetime access to self-paced videos, video templates, and code lessons.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Student Workspace:</strong> Live interactive sandbox simulator, mock databases, and campaign managers.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Professional Certification:</strong> Verifiable completion credentials tracked under your verified student registry.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
