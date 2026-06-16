/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, CheckCircle, ShieldCheck, ArrowRight, CreditCard, 
  Send, HelpCircle, PhoneCall, Copy, Check, Upload, Clock,
  FileSpreadsheet, FileCheck, ShieldAlert, Coins, Users, ArrowUpRight
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { db } from "../lib/db"; // Let's check how we enroll

export default function ThankYouPage() {
  const { navigateTo } = useNavigation();
  const [copiedBankName, setCopiedBankName] = useState(false);
  const [copiedAccNumber, setCopiedAccNumber] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [isReceiptUploading, setIsReceiptUploading] = useState(false);
  const [receiptSuccess, setReceiptSuccess] = useState(false);
  
  // Paystack Modal simulation states
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [paystackCardNumber, setPaystackCardNumber] = useState("");
  const [paystackExpiry, setPaystackExpiry] = useState("");
  const [paystackCVV, setPaystackCVV] = useState("");
  const [paystackEmail, setPaystackEmail] = useState("student@gmail.com");
  const [isProcessingPaystack, setIsProcessingPaystack] = useState(false);
  const [paystackPaymentSuccess, setPaystackPaymentSuccess] = useState(false);

  // Bank Info constants
  const BANK_NAME = "Sterling Bank PLC";
  const BANK_ACCOUNT = "0124809511";
  const ACCOUNT_NAME = "DSP Digital Academy Ltd";
  const TUITION_FEE = "₦35,000"; // Dynamic localized value

  const copyToClipboard = (text: string, type: "bank" | "acc") => {
    navigator.clipboard.writeText(text);
    if (type === "bank") {
      setCopiedBankName(true);
      setTimeout(() => setCopiedBankName(false), 2000);
    } else {
      setCopiedAccNumber(true);
      setTimeout(() => setCopiedAccNumber(false), 2000);
    }
  };

  const handleReceiptSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentReceipt(e.target.files[0]);
    }
  };

  const submitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentReceipt) {
      alert("Please upload or drag a receipt screenshot first!");
      return;
    }

    setIsReceiptUploading(true);

    // Simulate OCR receipt validation
    setTimeout(() => {
      setIsReceiptUploading(false);
      setReceiptSuccess(true);
      
      // Upgrade enrollment status in localStorage
      localStorage.setItem("enrollment_completed", "true");
      localStorage.setItem("user_tier", "platinum");
      
      // Store mock user info
      localStorage.setItem("student_payment_method", "bank_transfer");
      
      // Trigger actual master DB enrollment (adds all courses to their profile)
      db.enrollInFlagshipProgram();
      // Let's call the localStorage helper or trigger database save. 
      // We will also guarantee their student profile is fully verified.
      localStorage.setItem("enrollments", JSON.stringify([
        { id: "flagship-full", courseId: "course-1", enrolledAt: new Date().toISOString() }
      ]));
    }, 2000);
  };

  const handlePaystackPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paystackCardNumber.length < 12 || paystackExpiry.length < 4 || paystackCVV.length < 3) {
      alert("Please enter a valid card sequence, expiry date, and security code!");
      return;
    }
    
    setIsProcessingPaystack(true);

    // Simulate Paystack transaction gateway
    setTimeout(() => {
      setIsProcessingPaystack(false);
      setPaystackPaymentSuccess(true);
      
      localStorage.setItem("enrollment_completed", "true");
      localStorage.setItem("user_tier", "platinum");
      localStorage.setItem("student_payment_method", "paystack_online");
      
      localStorage.setItem("enrollments", JSON.stringify([
        { id: "flagship-full", courseId: "course-1", enrolledAt: new Date().toISOString() }
      ]));
    }, 2200);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-[#0B132B] font-sans antialiased pt-24 pb-20 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-350">
        
        {/* TOP LEVEL SUCCESS STATE */}
        <div className="bg-[#0056D2] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-blue-600">
          <div className="absolute inset-0 bg-[#0056D2]/25 blur-[90px] pointer-events-none" />
          
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DECISION OF EMINENCE OUTCOME CONFIRMED</span>
            </span>
            
            <h1 className="font-display font-black text-2xl sm:text-4xl tracking-tight leading-tight">
              Congratulations! You are about to take one of the best choices of your digital career.
            </h1>
            
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed max-w-xl mx-auto">
              Your free <strong className="text-white">AI Business Blueprint &amp; 150+ Prompt Sheet Toolkit</strong> is being processed for delivery to your designated inbox. Your next vital step is to finalize your tuition enrollment to unlock all 12 modules and enter your exclusive Live Saturdays office-hours dashboard.
            </p>
          </div>
        </div>

        {/* CORE DUAL OPTIONS PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main payment box (Left column - 7cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
            
            <div className="space-y-2">
              <h3 className="font-sans text-xl font-extrabold text-slate-900">
                Select Your Desired Payment System
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose between secure credit card/online instant processing or direct manual bank deposit transfer below to activate your student vault:
              </p>
            </div>

            {/* DUAL PAYMENT METHOD SELECTORS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option A Card (Paystack) */}
              <button
                onClick={() => {
                  setShowPaystackModal(true);
                  setReceiptSuccess(false);
                }}
                className="bg-gradient-to-br from-[#FAFCFF] to-white hover:to-blue-50/20 border border-blue-150 hover:border-[#0056D2] rounded-2xl p-5 text-left transition-all cursor-pointer min-h-[110px] flex flex-col justify-between group"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="w-9 h-9 rounded-xl bg-[#0056D2]/10 text-[#0056D2] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-[#0056D2] font-extrabold uppercase">Instant</span>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1 group-hover:text-[#0056D2]">
                    <span>Pay by Paystack Online</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Card, USSD, or Bank App. Instant activation.
                  </p>
                </div>
              </button>

              {/* Option B Card (Bank Transfer) */}
              <a
                href="#bank-transfer-form"
                onClick={() => {
                  setShowPaystackModal(false);
                }}
                className="bg-gradient-to-br from-[#FCFCFC] to-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-2xl p-5 text-left transition-all cursor-pointer min-h-[110px] flex flex-col justify-between group"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Manual</span>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                    <span>Pay by Bank Transfer</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Direct transfer to corporate account. 10min review.
                  </p>
                </div>
              </a>

            </div>

            {/* PAYMENT SUCCESS SCREENS */}
            {paystackPaymentSuccess && (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-905">Paystack Transaction Confirmed!</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Your student account was successfully provisioned with full Platinum status.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo("dashboard")}
                  className="w-full py-3 bg-[#0056D2] hover:bg-[#0047B3] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Enter Student LMS Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {receiptSuccess && (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 text-left">Receipt Received Successfully!</h4>
                    <p className="text-[10px] text-slate-500 text-left mt-0.5">Our finance desk is matching your transfer confirmation. Direct LMS access is pre-activated.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo("dashboard")}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Enter Student LMS Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* DETAILED DIRECT BANK TRANSFER DETAILS BLOCK */}
            <hr id="bank-transfer-form" className="border-slate-100" />
            
            <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                  Option B Details
                </span>
                <span className="text-xs text-slate-500 font-bold font-sans">Corporate Banking Platform</span>
              </div>

              {/* Table of corporate info */}
              <div className="space-y-3.5 font-sans text-xs pt-2">
                
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-400 font-medium">Bank Name</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{BANK_NAME}</span>
                    <button 
                      onClick={() => copyToClipboard(BANK_NAME, "bank")}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded active:scale-95 transition-all"
                    >
                      {copiedBankName ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-400 font-medium">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-[#0056D2] text-sm">{BANK_ACCOUNT}</span>
                    <button 
                      onClick={() => copyToClipboard(BANK_ACCOUNT, "acc")}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded active:scale-95 transition-all"
                    >
                      {copiedAccNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-400 font-medium">Account Name</span>
                  <span className="font-extrabold text-slate-900">{ACCOUNT_NAME}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400 font-medium">Tuition Access Fee</span>
                  <span className="font-display font-black text-rose-600 text-sm">{TUITION_FEE}</span>
                </div>

              </div>
            </div>

            {/* RECEIPT DRAG AND DROP FORM */}
            <form onSubmit={submitReceipt} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block text-left">
                  Upload Payment Screenshot / Transfer Receipt
                </label>
                
                <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-6 transition-all text-center group cursor-pointer bg-slate-50/55">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleReceiptSelection}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />
                  <div className="space-y-2 select-none">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 group-hover:text-slate-700">
                      <Upload className="w-5 h-5" />
                    </div>
                    {paymentReceipt ? (
                      <div>
                        <p className="text-xs font-extrabold text-emerald-600 truncate max-w-xs mx-auto">
                          ✓ {paymentReceipt.name}
                        </p>
                        <p className="text-[9px] text-slate-400">Click or drag again to replace</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-slate-700">Drag &amp; Drop receipt here, or browse files</p>
                        <p className="text-[9px] text-slate-400">Supports JPG, PNG, mock receipts. File is vetted in sandbox.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isReceiptUploading || !paymentReceipt}
                className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow transition-all flex items-center justify-center gap-1.5 ${
                  paymentReceipt 
                    ? "bg-[#0B132B] hover:bg-[#15234A] text-white cursor-pointer" 
                    : "bg-slate-150 text-slate-400 border border-slate-200 cursor-not-allowed"
                }`}
              >
                {isReceiptUploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Saving Secure Receipt Ledger...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Payment Confirmation Receipt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Value Stack & Urgent stats sidebar (Right column - 5cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Guarantee Vault info */}
            <div className="bg-[#0B132B] text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
              <span className="text-[10px] font-mono text-[#0056D2] font-black uppercase tracking-widest block">Access Status Summary</span>
              <h4 className="font-sans text-lg font-black text-white">Your Tuition Bundle Includes:</h4>
              
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>12 Core Learning Modules:</strong> Complete direct lifetime student rights to download files, guides, and prompts instantly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>Lagos/Abuja Physical Lab:</strong> Invite to Saturday webinars and in-person review hubs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>Alumni WhatsApp Support:</strong> Direct network coordinates to share contracts with fellow prompt engineers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>14-Day Performance Guarantee:</strong> Try everything securely. Refund available if you aren&apos;t fully satisfied.</span>
                </li>
              </ul>
            </div>

            {/* Direct Phone / Whatsapp Contact */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0056D2] flex items-center justify-center mx-auto">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900">Need Immediate Assistance?</h4>
                <p className="text-[10px] text-slate-500 leading-normal max-w-xs mx-auto">
                  Our Registrar Support Office is active online. Chat with us directly on WhatsApp to confirm payment instantly or clarify technical details.
                </p>
              </div>
              
              <a 
                href="https://wa.me/2348091234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm"
              >
                <span>Live Chat on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* POPUP PAYSTACK INTERACTIVE SIMULATOR DIALOG */}
      {showPaystackModal && (
        <div className="fixed inset-0 bg-[#0B132B]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-left select-none animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Paystack header brand banner */}
            <div className="bg-[#09A5DB] text-white p-5 flex justify-between items-center relative">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-100 font-bold block">Secure Gateway</span>
                <h4 className="font-sans text-sm font-black flex items-center gap-1">
                  <span>Paystack Online checkout</span>
                  <span className="text-[10px] bg-slate-900/25 px-1.5 py-0.5 rounded block">Demo Simulator</span>
                </h4>
              </div>
              <button
                onClick={() => setShowPaystackModal(false)}
                className="w-8 h-8 rounded-full bg-slate-900/15 text-white hover:bg-slate-900/30 flex items-center justify-center text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span>Tuition Enrollment Fee</span>
                <span className="font-mono font-black text-[#0B132B]">{TUITION_FEE}</span>
              </div>

              <form onSubmit={handlePaystackPayment} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={paystackEmail}
                    onChange={(e) => setPaystackEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#09A5DB] text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4000 1234 5678 9010"
                    maxLength={19}
                    value={paystackCardNumber}
                    onChange={(e) => setPaystackCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#09A5DB] font-mono text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={paystackExpiry}
                      onChange={(e) => setPaystackExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#09A5DB] font-mono text-slate-900"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="123"
                      maxLength={3}
                      value={paystackCVV}
                      onChange={(e) => setPaystackCVV(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#09A5DB] font-mono text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPaystack}
                  className="w-full mt-4 py-3 bg-[#09A5DB] hover:bg-[#0890c0] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {isProcessingPaystack ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Payment securely...</span>
                    </>
                  ) : (
                    <>
                      <span>Simulate Paystack Deposit of {TUITION_FEE}</span>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-[10px] text-center text-slate-400 font-mono leading-normal pt-2">
                🔒 Secured by Paystack Encrypted Checksum Engine. Your secrets are never held.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
