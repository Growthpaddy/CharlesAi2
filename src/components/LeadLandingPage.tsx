/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Clock, Users, ArrowRight, Lock, ShieldAlert, 
  TrendingUp, Coins, Download, HelpCircle, CheckCircle, 
  Percent, AlertTriangle, ShieldCheck, Mail, User, Phone,
  FileCode, PlayCircle, Star, ArrowUpRight
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

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
      alert("Please enter all required information to qualify for the Free Toolkit!");
      return;
    }

    setIsSubmitting(true);

    // Simulate lead capture save
    setTimeout(() => {
      const existingLeads = JSON.parse(localStorage.getItem("academy_leads") || "[]");
      const newLead = {
        ...formData,
        id: `lead-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      existingLeads.push(newLead);
      localStorage.setItem("academy_leads", JSON.stringify(existingLeads));
      
      // Auto-enroll simulation status so they appear initialized in dashboard if wanted
      localStorage.setItem("has_qualified_lead", "true");
      
      setIsSubmitting(false);
      // Seamlessly redirect to Thank You page
      navigateTo("thankyou");
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-[#0B132B] font-sans antialiased relative">
      {/* Dynamic Urgency Sticky Header Banner */}
      <div className="bg-[#0056D2] text-white py-2 px-4 text-center text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 select-none sticky top-16 z-40 shadow-sm border-b border-blue-600/50">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>
          <strong>OFFER EXPIRING:</strong> Grab the $1,499 AI Blueprint &amp; Prompt Pack free. Only <strong>{remainingSlots} slots</strong> left today.
        </span>
        <span className="bg-slate-900/45 px-2 py-0.5 rounded font-mono text-[10px]">
          {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>

      {/* SECTION 1: HERO CONTAINER WITH DUAL-COLUMN LAYOUT AND OPT-IN */}
      <section className="pt-16 pb-24 bg-gradient-to-b from-[#091530] via-[#0B183A] to-[#0A132B] text-white relative overflow-hidden text-left border-b border-slate-800">
        <div className="absolute inset-0 bg-[#0056D2]/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl mx-auto bg-cover bg-center mix-blend-overlay opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200")' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bold Copy, Problem Statement, Pain Hook */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/35 text-rose-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Critical Digital Threat: System Stagnation</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-[44px] xl:text-[54px] tracking-tight leading-[1.08] text-white">
              Stop Bleeding Clients &amp; Revenue To Automated AI Competitors.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              By December 2026, 75% of legacy marketing, template copy, operations, and basic sales processes will run fully on AI agents. Digital professionals refusing to adapt are actively deprecating their value. Our flagship curriculum teaches you to build premium custom automations and secure high-retainer clients natively.
            </p>

            {/* Benefit Bullets (Tainted Gains/Consequences) */}
            <div className="space-y-3.5 pt-2">
              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold">✕</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                    <strong className="text-rose-400">The Hard Truth:</strong> Competing manually means working 70-hour weeks for peanuts, while rivals use custom scrapers to scale business workflows in minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold">✕</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                    <strong className="text-rose-400">The Revenue Drain:</strong> Nigerian startups and agencies are bleeding $3,000+ monthly on manual copywriters and data operators that a single Prompt Hook performs flawlessly.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                    <strong className="text-emerald-400">The Leverage Play:</strong> Secure our private premium <span className="text-amber-300 font-bold">AI Business Toolkit ($1,499 Value)</span> right now to claim copy-paste prompt structures and automation templates.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0056D2]" />
                <span><strong className="text-white">3,500+ Qualified</strong> Alumni Globally</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Rated <strong className="text-white">4.9/5.0</strong> by Tech Leaders</span>
              </div>
              <div className="text-emerald-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span><strong>{activeLeadsCounter} Professionals</strong> Viewing This Minute</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Converting Opt-In Lead Magnet Card */}
          <div className="lg:col-span-5 relative">
            <span className="absolute -top-3 -right-3 bg-amber-400 text-slate-900 px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest shadow-lg z-20 animate-bounce">
              ★ FREE TOOLKIT INSIDE
            </span>
            
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-500" />
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Instant Access
                  </span>
                  <span className="bg-rose-50 text-rose-600 px-2   py-0.5 rounded text-[10px] font-bold">
                    $1,499 VALUE 100% FREE
                  </span>
                </div>

                <h3 className="font-sans text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Download AI Online Business Blueprint
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Submit your billing details information below to immediately claim active prompt databases, automated Make templates, and our exclusive Abuja/Lagos live-lab video recording.
                </p>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="e.g. Sandra Oluchi"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] font-semibold transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Primary Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. sandra@business.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] font-semibold transition-all min-h-[44px]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    We will never share your email. Your digital credentials are secure with 256-bit SSL protection.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="whatsapp" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Active WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      placeholder="e.g. +234 809 123 4567"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] font-semibold transition-all min-h-[44px]"
                    />
                  </div>
                  <p className="text-[10px] text-[#0056D2] font-semibold leading-normal">
                    ✓ Required for direct access link &amp; WhatsApp group invites.
                  </p>
                </div>

                {/* Submit button with visual state changes */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-4 bg-[#0056D2] hover:bg-[#0047B3] text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none min-h-[48px] border-b-2 border-blue-900 group"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Qualifying Your Premium Access...</span>
                    </>
                  ) : (
                    <>
                      <span>Unlock Blueprint &amp; Pay Tuition</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

              </form>

              {/* Guarantees on opt-in card footer */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> SSL PROTECTEDSECURE
                </span>
                <span>SPOTS GRANTED: {activeLeadsCounter}/150</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: WHAT THEY STAND TO LOSE (HIGH STAKES INACTION ANALYSIS) */}
      <section className="py-24 bg-white border-b border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-red-150">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>THE INACTION CRISIS</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              By Not Acquiring AI Automation Leverage Now, What Are You Actively Losing?
            </h2>
            <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">
              Ignorance is not bliss — it is expensive. Running your business, career, or freelance operations using standard frameworks is bleeding tangible resources daily. Review your structural losses:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Loss Factor 1 */}
            <div className="bg-red-50/30 border border-red-100 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100/50 text-red-600 flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
                01
              </div>
              <h3 className="font-bold text-[#0B132B] text-base font-sans tracking-tight leading-tight">
                ₦1.2 Million - ₦3.5 Million in Active Overhead Wastage Yearly
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                You are paying agencies and hiring copy writers, transcribers, data enterers, and customer service staff to manually deal with tasks that a robust workflow hook executes in minutes. Secure the tools to wipe out 80% of unnecessary operational overheads.
              </p>
            </div>

            {/* Loss Factor 2 */}
            <div className="bg-red-50/30 border border-red-100 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100/50 text-red-600 flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
                02
              </div>
              <h3 className="font-bold text-[#0B132B] text-base font-sans tracking-tight leading-tight">
                Loss of Premium International Clients Paying in USD
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                While local specialists struggle to close jobs due to slow responses, automated prompt engineers scrape target client databases, trigger personalized cold pitches instantly, and deliver premium client projects 10x faster. You stand to lose these elite contracts to automation.
              </p>
            </div>

            {/* Loss Factor 3 */}
            <div className="bg-red-50/30 border border-red-100 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100/50 text-red-600 flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
                03
              </div>
              <h3 className="font-bold text-[#0B132B] text-base font-sans tracking-tight leading-tight">
                Mental &amp; Physical Burnout inside Legacy Work Chains
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Spending 5 hours daily on repetitive admin: sorting leads, preparing content drafts, scheduling social posts manually, and creating repetitive slide decks. This grunt work kills creativity and drains your active entrepreneurial leverage.
              </p>
            </div>

            {/* Loss Factor 4 */}
            <div className="bg-red-50/30 border border-red-100 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100/50 text-red-600 flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
                04
              </div>
              <h3 className="font-bold text-[#0B132B] text-base font-sans tracking-tight leading-tight">
                Severe Skill Deprecation Within Your Career Sector
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                By maintaining a standard legacy service profile (e.g. 'WordPress web designer' or 'SMM content marketer'), your skill index drops 35% every half-year in value. In today&apos;s economy, only those who engineer custom automated systems retain ultimate premium billing leverage.
              </p>
            </div>

          </div>

          {/* Dual Profile Comparison: Owner vs Legacy Operator */}
          <div className="mt-16 bg-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800">
            <div className="absolute inset-0 bg-[#0056D2]/5 blur-3xl pointer-events-none" />
            
            <div className="text-center sm:text-left space-y-2 mb-10 max-w-xl">
              <span className="text-[10px] text-[#0056D2] font-mono font-black uppercase tracking-widest block">Structural Comparison</span>
              <h3 className="font-sans text-xl sm:text-2xl font-extrabold">The Contrast Is Startling.</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">
                Choose which digital persona you will inhabit during the late-2026 consolidation era:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Profile A: The Automated Leverage Master */}
              <div className="bg-[#0B132B] p-6 sm:p-8 rounded-2xl border border-emerald-500/20 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
                    Persona A: The AI System Designer
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">100% LEVERAGED</span>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                    <span><strong>10x Work Speed:</strong> Triggers 5-step webhook automation pipelines to create 15 blog posts, newsletters, and lead scripts in precisely 90 seconds.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                    <span><strong>High Retainers:</strong> Sells AI Operations auditing to traditional companies for upwards of ₦750,000 to ₦1.5M monthly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                    <span><strong>Unshakable Autonomy:</strong> Employs custom script scrapers to auto-discover fresh clients daily while keeping operational schedules fully flexible.</span>
                  </li>
                </ul>
              </div>

              {/* Profile B: The Manual Operator */}
              <div className="bg-[#0B132B] p-6 sm:p-8 rounded-2xl border border-rose-500/20 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
                    Persona B: The Stale Manual Operator
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">0% ADVANTAGES</span>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 shrink-0 font-bold">✕</span>
                    <span><strong>70-Hour Sludge:</strong> Spends tedious hours copying, pasting, correcting typos manually, and feeling structurally exhausted before noon.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 shrink-0 font-bold">✕</span>
                    <span><strong>Bottom-Price Slavery:</strong> Constantly undercut on gig websites by competitors utilizing robust model chains who deliver faster and cheaper.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 shrink-0 font-bold">✕</span>
                    <span><strong>Extreme Client Bleeding:</strong> Losing trust as client requirements demand dynamic automated pipelines that legacy workers cannot comprehend.</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="pt-8 text-center">
              <a 
                href="#fullName"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-white transition-colors uppercase tracking-widest font-mono"
              >
                <span>Jump to Opt-In Form and Capture Your Free Advantage Toolkit →</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: REVIEWS AND SHINY TESTIMONIAL PORTFOLIO */}
      <section className="py-24 bg-slate-50 border-b border-slate-150 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-105">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>3,500+ VERIFIED GRADUATES</span>
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Alumni Results That Standardize Excellence
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                Read direct success narratives from digital professionals, marketing specialists, and small business owners in Lagos, Abuja, Port Harcourt and beyond who gained absolute high-speed advantages.
              </p>
            </div>
            
            <a
              href="#fullName"
              className="px-6 py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 uppercase tracking-wider"
            >
              Get Free Toolkit Now
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Review Card 1 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                
                <h4 className="font-display font-bold text-sm text-[#0B132B] italic">
                  &ldquo;Saved me 30 hours weekly writing copy. Gained 4 premium clients inside our WhatsApp Group!&rdquo;
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  I joined from Abuja, feeling like AI was too high-tech. The step-by-step 12 modules completely demystified the process. I constructed a 1-click customer support assistant that handles over 80% of routine client questions. Worth every kobo!
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Sandra" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-[#0B132B]">Olawale Adesina</h5>
                  <p className="text-[10px] font-mono text-[#0056D2] font-bold uppercase tracking-wider">SEO Agency Director</p>
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                
                <h4 className="font-display font-bold text-sm text-[#0B132B] italic">
                  &ldquo;Secured a $1,200 monthly USD retainer with an automation blueprint I copy-pasted.&rdquo;
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  The faceless video modules alone are spectacular. I learned how to create reels with automated scripts and voice clones. I closed 2 agency clients in London inside my first month of study. Dr Sandra Cole is a phenomenal mentor.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Chioma" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-[#0B132B]">Chioma Nnaji</h5>
                  <p className="text-[10px] font-mono text-[#0056D2] font-bold uppercase tracking-wider">Freelance Content Architect</p>
                </div>
              </div>
            </div>

            {/* Review Card 3 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                
                <h4 className="font-display font-bold text-sm text-[#0B132B] italic">
                  &ldquo;A complete masterclass in offline-to-online digital scaling. Worth 20x the cost.&rdquo;
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  I lead digital transformations in Lekki, Lagos. We used the custom AI tool scraper templates inside Module 4 to track target market prices automatically. This wiped out overhead hours and reduced our reporting bottleneck fully. Highly recommended.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100" alt="Chinedu" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-[#0B132B]">Chinedu Okafor</h5>
                  <p className="text-[10px] font-mono text-[#0056D2] font-bold uppercase tracking-wider">Corporate Ops Advisor</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: THE 12 INCLUDED HIGH-VALUE SYLLABUS DIRECTORY */}
      <section className="py-24 bg-white border-b border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-20 text-center mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <FileCode className="w-4 h-4" />
              <span>THE ULTIMATE MASTER SYLLABUS</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              One Single Enrollment Gates Instant Access To All 12 Learning Modules
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
              Forget buying piece-meal microcourses costing ₦15,000 to ₦25,000 separately. The <strong className="text-slate-900">AI Online Business Course</strong> is built into a unified curriculum. Below are the 12 domains:
            </p>
          </div>

          {/* Grid Layout listing 12 Modules with status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
            ].map((m, index) => (
              <div 
                key={m.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-blue-400/30 hover:bg-white transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-[#0056D2]/10 text-[#0056D2] font-mono font-black text-sm flex items-center justify-center shrink-0">
                    {m.icon}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0B132B]">{m.title}</h4>
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                      {m.status}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-350 select-none">✓</span>
              </div>
            ))}
          </div>

          {/* Urgent Risk Pledge footer */}
          <div className="mt-16 p-8 bg-blue-50/50 border border-blue-105 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-[#0056D2]/10 text-[#0056D2] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Our Abuja/Lagos Weekly Office-Hours Live Sandbox Lab Guarantee
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Gain direct student rights to ask active code-auditing questions live to Dr Sandra Cole and mentors every Saturday mornings. If you don&apos;t feel 100% satisfied during your first 2 labs we will instantly process a refund transfer.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: POWERFUL FINAL CONVERSION TRIGGER WITH URGENCY */}
      <section className="py-24 bg-slate-950 text-white relative text-center overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-[#0056D2]/15 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full">
            ★ SENSITIVE TIME LIMIT EXPIRES TONIGHT
          </span>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-2xl mx-auto">
            Ready to Take Control of Your Digital Career and Financial Leverage?
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-semibold">
            Do not let another week evaporate on traditional, physical, or slow legacy routines. Download the free blueprint, secure your ticket to the weekly labs, and gain lifelong access to the entire 12-module directory.
          </p>

          <div className="flex flex-col sm:sm-row gap-4 justify-center items-center">
            <a
              href="#fullName"
              className="px-8 py-4 bg-[#0056D2] hover:bg-[#0047b3] text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
            >
              <span>Secure Your Package Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            
            <a
              href="#fullName"
              className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-xs sm:text-sm rounded-xl transition-all"
            >
              Explore Free Blueprint First
            </a>
          </div>

          <div className="pt-6 text-xs text-slate-500 font-mono flex justify-center items-center gap-6">
            <span>✓ Lifetime Updates Included</span>
            <span>✓ Abuja/Lagos Mentors Included</span>
            <span>✓ 100% Risk Free Pledge</span>
          </div>

        </div>
      </section>

      {/* FAQ Block */}
      <section className="py-20 bg-slate-50 border-t border-slate-150 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-sans text-xl font-extrabold text-slate-900 text-center mb-12">Frequently Asked Inquiries</h3>
          
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0B132B]">How do I get my Free Blueprint and Prompt Sheet Pack?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Immediately after entering your information in the card above, you will be redirected to the secure Thank You and Payment gateway page. Once payment is confirmed, your files are dynamically generated and emailed to your primary email address.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0B132B]">How is the payment processed? Is Paystack safe?</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Absolutely. Paystack is one of Africa&apos;s leading secure PCI-compliant payment gateways, acquired by Stripe. Your details are encrypted. If you prefer Bank Direct Transfer, our support desk tracks receipts instantly on WhatsApp to activate your student credentials.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
