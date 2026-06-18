/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Clock, Users, ArrowRight, Lock, ShieldAlert, 
  HelpCircle, CheckCircle, AlertTriangle, ShieldCheck, Mail, User, Phone,
  FileCode, Star, ArrowUpRight
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { insertLead, isSupabaseConfigured } from "../lib/supabase";

export default function LeadLandingPage() {
  const { navigateTo } = useNavigation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real-time Urgency states
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });
  const [activeLeadsCounter, setActiveLeadsCounter] = useState(134);
  const [remainingSlots, setRemainingSlots] = useState(7);

  // Decelerating countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Restart to keep active urgency
          return { minutes: 14, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulating live demand and decreasing seats
  useEffect(() => {
    const userInterval = setInterval(() => {
      setActiveLeadsCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 4500);

    const seatInterval = setInterval(() => {
      setRemainingSlots(prev => {
        if (prev > 2) {
          return prev - 1;
        }
        return 2; // Keep at least 2 is a strong conversion sweet spot
      });
    }, 28000);

    return () => {
      clearInterval(userInterval);
      clearInterval(seatInterval);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.whatsapp) {
      alert("Please enter all required information to lock in your 70% Tuition Discount!");
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem("tuition_discount_claimed", "true");

    // Call Supabase lead sync layer
    insertLead({
      name: formData.fullName,
      phone: formData.whatsapp,
      email: formData.email,
      qualification: "70% Discount Locked Lead",
      goal: "LMS 70% Tuition Discount Claimed"
    }).then(() => {
      setIsSubmitting(false);
      // Seamlessly redirect to Course Details page
      navigateTo("course_details");
    }).catch((err) => {
      console.error(err);
      setIsSubmitting(false);
      navigateTo("course_details"); // Fallback gracefully
    });
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#0C1421] font-sans antialiased relative">
      
      {/* SECTION 1: SPACIOUS REDESIGNED HERO WITH EXPLICIT HEADER GAP AND ZERO CLASHING */}
      <section className="pt-32 sm:pt-40 pb-20 bg-gradient-to-b from-[#08122B] via-[#0E1B3E] to-[#0A1224] text-white relative overflow-hidden text-left border-b border-slate-800">
        <div className="absolute inset-0 bg-[#0056D2]/10 blur-[130px] pointer-events-none" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl mx-auto bg-cover bg-center mix-blend-overlay opacity-5 pointer-events-none" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200")' }} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top inline micro notification widget */}
          <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 bg-white/5 border border-white/10 text-slate-300 px-4 py-2 rounded-full text-xs font-semibold mb-8 backdrop-blur-md">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Limited Offer: 70% Flagship Tuition Discount Locked In Today</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="font-mono text-[11px] text-[#FCF50F] bg-[#FCF50F]/10 px-2 py-0.5 rounded">
              Only {remainingSlots} slots remaining
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Bold Copy, Problem Statement, Pain Hook */}
            <div className="lg:col-span-7 space-y-6 lg:pr-4">
              
              <div className="inline-flex items-center gap-1.5 text-rose-400 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/25 text-[11px] font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Structural Professional Threat</span>
              </div>

              {/* Headline under 10 words constraint */}
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95] text-white">
                Master Applied AI. <br />
                Secure Your Advantage.
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
                By late 2026, over 75% of copywriting, operations, scraping, and lead processing will run on autonomous AI assistants. Legacy professionals refusing to build custom systems are losing market share. This 12-module course teaches you how to design dynamic prompt structures, connect automations, and close premium contracts.
              </p>

              {/* Clean minimal lists */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      <strong className="text-rose-400">Inefficient Manual Chains:</strong> Spending 30+ hours weekly on manual copy and sorting leads while automated rivals trigger personalized webhooks in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      <strong className="text-rose-400">The Overhead Burn:</strong> Bleeding monthly dollars on basic content drafts and manual research that a structured Prompt Hook executes flawlessly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      <strong className="text-emerald-400">The Modern Play:</strong> Get our private, tested <span className="text-white font-bold underline decoration-amber-400">AI Business Toolkit ($1,499 Value)</span> compiled immediately for you to capture copy-paste automation templates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social trust metric wave, very clean and flat */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#0056D2]" />
                  <span>Join <strong className="text-white">3,500+ Qualified</strong> Alumni</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Average rating <strong className="text-white">4.9/5.0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span><strong>{activeLeadsCounter} Professionals</strong> online now</span>
                </div>
              </div>

            </div>

            {/* Right Column: High-Converting Opt-In Lead Magnet Card */}
            <div className="lg:col-span-5 relative lg:sticky lg:top-24 mt-8 lg:mt-0">
              <span className="absolute -top-3 -right-2 bg-[#FCF50F] text-slate-900 px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider shadow-md z-20">
                ★ COHORT ACCESS ENABLED
              </span>
              
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#0056D2]" />
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      Instant Lock-In
                    </span>
                    <span className="bg-[#FCF50F]/20 text-[#0E1B3E] px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-[#FCF50F]/40">
                      70% TUITION DISCOUNT ACTIVE
                    </span>
                  </div>

                  <h3 className="font-sans text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Lock In Your 70% Discount
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Submit your basic registration details below to immediately lock in our 70% tuition discount code and proceed directly to full course outlines, modules, and billing credentials.
                  </p>

                  <div className="flex items-center gap-2 bg-amber-50/70 border border-amber-100/60 rounded-xl p-3 text-xs justify-center font-mono">
                    <Clock className="w-4 h-4 text-[#0056D2] animate-pulse" />
                    <span className="text-slate-600 font-bold">Offer expiring in:</span>
                    <span className="text-[#0E1B3E] font-black text-xs bg-[#FCF50F] px-2.5 py-0.5 rounded text-slate-900 border border-[#b2ac0e]/20 shadow-xs">
                      {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </div>

                {/* Form Input fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        placeholder="Sandra Oluchi"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] transition-all min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Primary Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="sandra@business.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] transition-all min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="whatsapp" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Active WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        required
                        placeholder="+234 809 123 4567"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] transition-all min-h-[44px]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">
                      Required for live group invites and direct download link.
                    </p>
                  </div>

                  {/* Submit button with visual state changes */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 bg-[#0056D2] hover:bg-[#0047B3] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none min-h-[48px] group"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Locking in Tuition Discount...</span>
                      </>
                    ) : (
                      <>
                        <span>Claim Discount &amp; View Syllabus outlines</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                </form>

                {/* Guarantees on opt-in card footer */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> SECURE SSL CONNECTION
                  </span>
                  {isSupabaseConfigured ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      SUPABASE SYNC ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      SECURE OFFLINE ENGINE
                    </span>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: WHAT NOT SECURING LEVERAGE ACTUALLY COSTS */}
      <section className="py-20 bg-white border-b border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-red-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>THE COST OF DELAY</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              What Are You Actively Losing?
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Operating with traditional manual methods is expensive. Delaying the transition to intelligent, modular processes drains valuable resources daily:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Loss Factor 1 */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-mono font-black text-xs">
                01
              </div>
              <h3 className="font-bold text-[#0C1421] text-sm tracking-tight leading-snug">
                Substantial Overhead Waste Yearly
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paying service providers to manually deal with copy drafts, list sorting, and transcribing that a modular webhook pipeline executes in less than 90 seconds. Wiping out operations overhead.
              </p>
            </div>

            {/* Loss Factor 2 */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-mono font-black text-xs">
                02
              </div>
              <h3 className="font-bold text-[#0C1421] text-sm tracking-tight leading-snug">
                Loss of Premium USD Clients
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                While local specialists struggle with slow response formats, automated practitioners curate targets, trigger personalized outreach instantly, and deliver complete projects 10x faster.
              </p>
            </div>

            {/* Loss Factor 3 */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-mono font-black text-xs">
                03
              </div>
              <h3 className="font-bold text-[#0C1421] text-sm tracking-tight leading-snug">
                Operational &amp; Creative Burnout
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Spending hours daily on administrative operations, content drafts, and formatting files. This manual loop consumes valuable hours and stunts direct professional leverage.
              </p>
            </div>

            {/* Loss Factor 4 */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-mono font-black text-xs">
                04
              </div>
              <h3 className="font-bold text-[#0C1421] text-sm tracking-tight leading-snug">
                Constant Value Depreciation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Maintaining a generic digital role (e.g., manual content writer, basic marketer) drops in leverage every month. In this environment, only system builders retain robust professional billing power.
              </p>
            </div>

          </div>

          {/* Dual Profile Comparison: Owner vs Legacy Operator */}
          <div className="mt-16 bg-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden border border-slate-850">
            <div className="absolute inset-0 bg-[#0056D2]/5 blur-3xl pointer-events-none" />
            
            <div className="text-left space-y-2 mb-10 max-w-xl">
              <span className="text-[10px] text-[#0056D2] font-mono font-bold uppercase tracking-wider block">Contrast Study</span>
              <h3 className="font-sans text-xl sm:text-2xl font-black text-white">Compare Your Trajectory</h3>
              <p className="text-slate-400 text-xs font-normal">
                Choose which architectural path your digital workflow takes:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Profile A: The Automated Leverage Master */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-xl border border-emerald-500/10 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider">
                    Persona A: The AI System Designer
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">HIGH LEVERAGE</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 text-left">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                    <span><strong>10x Delivery Speeds:</strong> Trigger modular automation structures to draft content, scripts, and logs in under 90 seconds.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                    <span><strong>USD Client Access:</strong> Program automated scrapers to safely fetch qualified contracts and generate high margins.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                    <span><strong>Professional Autonomy:</strong> Replace rigid daily schedules with self-directed systems and assets.</span>
                  </li>
                </ul>
              </div>

              {/* Profile B: The Manual Operator */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-xl border border-rose-500/10 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider">
                    Persona B: The Legacy Operator
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold font-mono">LOW LEVERAGE</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-400 text-left">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 shrink-0 font-bold">✕</span>
                    <span><strong>Manual Friction:</strong> Spend repetitive hours writing outline adjustments, correcting copy sheets, and sorting data.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 shrink-0 font-bold">✕</span>
                    <span><strong>Price Undercutting:</strong> Struggle on competitive hubs against practitioners running active AI templates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 shrink-0 font-bold">✕</span>
                    <span><strong>Client Attrition:</strong> Lose retainers to forward-thinking competitors who provide complex systems.</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="pt-6 text-center border-t border-slate-800/60 mt-8">
              <a 
                href="#fullName"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#FCF50F] hover:text-white transition-colors tracking-wide animate-pulse"
              >
                <span>Complete enrollment to secure the Free Advantage Toolkit &rarr;</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: REVIEWS AND SHINY TESTIMONIAL PORTFOLIO */}
      <section className="py-20 bg-slate-50 border-b border-slate-150 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-105">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>3,500+ VERIFIED GRADUATES</span>
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                Real Professional Trajectories
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Read direct outcome narratives from digital operators, marketers, and business owners who built robust advantage metrics:
              </p>
            </div>
            
            <a
              href="#fullName"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              Secure Free Toolkit
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Review Card 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                
                <h4 className="font-sans font-bold text-sm text-[#0C1421]">
                  &ldquo;Saved me 30 hours weekly writing copy. Closed valuable clients within our active cohort group!&rdquo;
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  I joined from Abuja, feeling like automated structures were too complex. This 12-module track made it practical. I built a supporting assistant that processes questions instantly. Worth every single step.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Sandra" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-[#0C1421]">Olawale Adesina</h5>
                  <p className="text-[9px] font-mono text-[#0056D2] font-bold uppercase tracking-wider">SEO Agency lead</p>
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                
                <h4 className="font-sans font-bold text-sm text-[#0C1421]">
                  &ldquo;A complete roadmap to USD retainers with tested automated tools.&rdquo;
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  The faceless content module is spectacular. I learned how to manage voice setups and sequence layouts. I closed 2 retainer contracts within the first 30 days. Phenomenal mentoring.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Chioma" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-[#0C1421]">Chioma Nnaji</h5>
                  <p className="text-[9px] font-mono text-[#0056D2] font-bold uppercase tracking-wider">Freelance Content Specialist</p>
                </div>
              </div>
            </div>

            {/* Review Card 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                
                <h4 className="font-sans font-bold text-sm text-[#0C1421]">
                  &ldquo;A cohesive handbook in offline-to-online workspace deployment.&rdquo;
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  I oversee digital deployments in Lagos. We integrated the custom scraper and automation templates which reduced bottleneck operations reporting in our weekly workflow.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100" alt="Chinedu" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-[#0C1421]">Chinedu Okafor</h5>
                  <p className="text-[9px] font-mono text-[#0056D2] font-bold uppercase tracking-wider">Corporate Ops Officer</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: THE 12 INCLUDED HIGH-VALUE SYLLABUS DIRECTORY */}
      <section className="py-20 bg-white border-b border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl space-y-3 mb-16 text-center mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
              <FileCode className="w-4 h-4" />
              <span>THE COHORT SYLLABUS</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              Explore the 12 Learning Modules
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              One-time registration grants you direct and lifelong access to all 12 specialized paths without dynamic upgrades or extra module fees:
            </p>
          </div>

          {/* Grid Layout listing 12 Modules with status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[
              { id: "1", title: "AI Prompt Engineering", icon: "01", status: "Active Guide" },
              { id: "2", title: "AI Digital Products Formulation", icon: "02", status: "Active Guide" },
              { id: "3", title: "AI High-Speed Content Creation", icon: "03", status: "Active Guide" },
              { id: "4", title: "App Creation with Zero-Code AI", icon: "04", status: "Active Guide" },
              { id: "5", title: "Advanced Make/Zapier Automations", icon: "05", status: "Active Guide" },
              { id: "6", title: "Faceless Cash Cow YouTube Channels", icon: "06", status: "Active Guide" },
              { id: "7", title: "International Client Acquisition", icon: "07", status: "Active Guide" },
              { id: "8", title: "AI-Powered Affiliate Marketing Hooks", icon: "08", status: "Active Guide" },
              { id: "9", title: "Automated Social Advertising Funnel", icon: "09", status: "Active Guide" },
              { id: "10", title: "AI-Powered Business Operations", icon: "10", status: "Active Guide" },
              { id: "11", title: "Lagos/Abuja SMM Optimization Blueprint", icon: "11", status: "Active Guide" },
              { id: "12", title: "AI Ghostwriting & Digital Product Sales", icon: "12", status: "Active Guide" }
            ].map((m) => (
              <div 
                key={m.id}
                className="bg-[#FAFBFD] border border-slate-200 rounded-xl p-4 hover:border-blue-400/30 hover:bg-white transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#0056D2]/10 text-[#0056D2] font-mono font-black text-xs flex items-center justify-center shrink-0">
                    {m.icon}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0C1421]">{m.title}</h4>
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                      {m.status}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-300">✓</span>
              </div>
            ))}
          </div>

          {/* Guarantee, clean layout */}
          <div className="mt-16 p-6 bg-blue-50/40 border border-blue-100 rounded-2xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
            <div className="w-10 h-10 rounded-full bg-[#0056D2]/10 text-[#0056D2] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Cohort Security & Saturday Live Audits Guarantee
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Direct rights to post specific system or workflow questions to our support desk. If you don&apos;t experience 100% actionable value from your first 2 Saturday labs, we will process your refund instantly.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: FINAL CLEAN ACTION COMPONENT */}
      <section className="py-20 bg-slate-950 text-white relative text-center overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-[#0056D2]/15 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full">
            ★ CRITICAL TIMELINE OFFER
          </span>

          <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight leading-none text-white">
            Secure Your 70% Flagship Tuition Discount Now
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Do not let another week pass with legacy manual processes. Lock in your limited credential slot, secure your discount, and begin learning immediately.
          </p>

          <div className="flex flex-col gap-4 justify-center items-center max-w-md mx-auto">
            <a
              href="#fullName"
              className="w-full sm:w-auto px-8 py-4 bg-[#FCF50F] hover:bg-yellow-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group transform hover:scale-[1.02] duration-200"
            >
              <span>🚀 SCROLL UP &amp; CLAIM 70% OFF ({String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')} LEFT)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="pt-4 text-xs text-slate-500 font-mono flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <span>✓ {remainingSlots} Slots Left</span>
            <span>✓ Evergreen Timer Offer</span>
            <span>✓ Direct Instructor Guidance</span>
          </div>

        </div>
      </section>

      {/* FAQ Block */}
      <section className="py-16 bg-slate-50 border-t border-slate-150 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-sans text-xl font-black text-slate-900 text-center mb-10">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 hover:border-slate-300 transition-all">
              <h4 className="text-xs sm:text-sm font-bold text-[#0C1421]">How do I get my Free Blueprint and Prompt Sheets?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Immediately after completing the registration form above, you will be directed to the success page. Once your active digital profile is compiled, all tools and blueprint files are sent to your designated email.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 hover:border-slate-300 transition-all">
              <h4 className="text-xs sm:text-sm font-bold text-[#0C1421]">Are there additional cohort upgrades?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                No, your single profile registration processes your lifelong permissions path directly. All 12 specialized domains and Saturday sandbox updates are included.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
