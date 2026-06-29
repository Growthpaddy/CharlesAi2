/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, Sparkles, LogIn, ChevronLeft, ChevronRight, CheckCircle2,
  Cpu, Users, ShieldCheck, Zap, Globe, MessageSquare
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

export default function HomeExperience() {
  const { navigateTo } = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance slides every 5 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const slides = [
    {
      id: "plus",
      // Premium Coursera Peach/Cream Styling
      bgClass: "bg-[#FFF5EB]",
      borderClass: "border-orange-100",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-center">
          {/* Left Text Detail */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4 sm:space-y-5 text-left flex flex-col justify-between h-full">
            <div className="space-y-4">
              {/* Brand Logo Banner with PLUS (Coursera mimic) */}
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black text-xs sm:text-sm tracking-tight text-[#0056D2]">
                  ai<span className="text-[#0B1B3D] font-medium font-sans">institute</span>
                </span>
                <span className="bg-[#0056D2] text-white text-[8px] sm:text-[9px] font-sans font-black px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                  Plus
                </span>
              </div>

              {/* High-visibility Headline */}
              <h3 className="font-sans font-black text-2xl sm:text-3.5xl lg:text-4xl text-[#0B1B3D] tracking-tight leading-[1.08] max-w-xl">
                Ends soon! Save more on skills that stand out
              </h3>

              {/* Body Text */}
              <p className="text-[#2A313C] text-xs sm:text-sm md:text-base font-medium font-secondary max-w-lg leading-relaxed">
                Today is a brilliant time to begin with 50% off 10,000+ custom learning programs. Price increases June 18.
              </p>
            </div>

            {/* Custom Action Call to Action */}
            <div className="pt-4 sm:pt-6 space-y-6">
              <button
                onClick={() => navigateTo("programs")}
                className="inline-flex items-center gap-2 bg-[#0056D2] hover:bg-[#003E9C] text-white font-sans font-bold text-xs sm:text-sm px-6 py-3 sm:py-3.5 rounded-lg transition-all shadow-md active:scale-98 cursor-pointer uppercase tracking-wider"
              >
                <span>Save 50% now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Institutional Endorsed Logos mimicking original */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block w-full sm:w-auto">
                  Partner curricula:
                </span>
                <div className="flex gap-2.5 sm:gap-3 items-center">
                  {[
                    { name: "Google", icon: "G" },
                    { name: "IBM", icon: "IBM" },
                    { name: "Microsoft", icon: "MS" },
                    { name: "Meta", icon: "∞" }
                  ].map((logo, index) => (
                    <div 
                      key={index}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200/85 flex items-center justify-center shadow-xs font-sans text-[8px] sm:text-[9.5px] font-black text-gray-500 hover:border-[#0056D2] hover:text-[#0056D2] transition-colors"
                      title={logo.name}
                    >
                      {logo.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Graphical Dial Banner Column */}
          <div className="lg:col-span-5 h-[240px] lg:h-full bg-gradient-to-br from-[#FE8A00] to-[#E55300] relative lg:rounded-r-3xl overflow-hidden flex items-center justify-center">
            {/* Visual background element */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_75%)]" />
            
            {/* Massive Sun Dial Graphic matching attached mockup screenshot */}
            <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full border-12 border-white/10 bg-[#FF9F1C] flex flex-col items-center justify-center shadow-2xl relative">
              <span className="text-[10px] font-sans font-extrabold text-amber-100 uppercase tracking-widest mb-1 bg-white/10 px-2 py-0.5 rounded-full">
                Early Bird Sale
              </span>
              <span className="text-4xl sm:text-5xl font-sans font-black text-white tracking-widest text-[#FFF] leading-none mb-1">
                50%
              </span>
              <span className="text-xl sm:text-2xl font-sans font-black text-white uppercase tracking-wider leading-none">
                off
              </span>

              {/* Small Overlay badge cloud */}
              <div className="absolute -bottom-1 -right-3 sm:-right-4 bg-white text-[#E55300] text-[9px] font-bold font-sans px-3 py-1.5 rounded-full shadow-lg border border-orange-50 transform rotate-3">
                Offer ends soon
              </div>
            </div>

            {/* Glowing rings */}
            <div className="absolute w-72 h-72 border border-white/[0.04] rounded-full animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
          </div>
        </div>
      )
    },
    {
      id: "teams",
      // Enterprise Deep Indigo Gradient Styling
      bgClass: "bg-gradient-to-r from-[#211F7E] to-[#141256]",
      borderClass: "border-indigo-900",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-center text-white">
          {/* Left Text Detail */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4 sm:space-y-5 text-left flex flex-col justify-between h-full">
            <div className="space-y-4">
              {/* Brand Logo Banner with Teams badge */}
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black text-xs sm:text-sm tracking-tight text-white">
                  ai<span className="text-blue-200 font-medium font-sans">institute</span>
                </span>
                <span className="bg-transparent text-blue-300 font-secondary text-[11px] font-medium lowercase tracking-wide">
                  for teams
                </span>
              </div>

              {/* High-visibility Headline */}
              <h3 className="font-sans font-black text-2xl sm:text-3.5xl lg:text-4xl text-white tracking-tight leading-[1.08] max-w-xl">
                Early-bird savings. Top team training
              </h3>

              {/* Body Text */}
              <p className="text-blue-100 text-xs sm:text-sm md:text-base font-medium font-secondary max-w-lg leading-relaxed">
                Get 50% off team learning scenarios you can start today. Deploy background systems before prices rise June 18.
              </p>
            </div>

            {/* Custom Action Call to Action */}
            <div className="pt-4 sm:pt-6 space-y-5">
              <button
                onClick={() => navigateTo("programs")}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-150 text-[#141256] font-sans font-bold text-xs sm:text-sm px-6 py-3 sm:py-3.5 rounded-lg transition-all shadow-md active:scale-98 cursor-pointer uppercase tracking-wider"
              >
                <span>Save 50% on Teams</span>
                <ArrowRight className="w-4 h-4 text-[#141256]" />
              </button>

              {/* Small benefits row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                {[
                  "Central Console Dashboard",
                  "Verified Team Accreditations",
                  "Dedicated API Sandbox Scenarios"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-blue-200 text-[10.5px] font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Custom blend of Team workspace image & badges */}
          <div className="lg:col-span-5 h-[240px] lg:h-full relative overflow-hidden flex items-center justify-center">
            {/* High-fidelity Team Workspace Photo */}
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=650&h=450" 
              alt="Team Collaborating"
              className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-luminosity bg-indigo-950"
              referrerPolicy="no-referrer"
            />
            
            {/* Indigo overlay and decorative visual dial */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-indigo-950/40 to-slate-900/10" />

            {/* Overlapping Orange badge replicating "50% off team training" from screenshot */}
            <div className="absolute top-[18%] left-[10%] w-26 h-26 sm:w-32 sm:h-32 rounded-full bg-[#FF9F1C] border-8 border-white/10 flex flex-col items-center justify-center shadow-2xl relative transform -rotate-6 scale-95 sm:scale-105">
              <span className="text-white font-sans font-black text-lg sm:text-2xl leading-none">50% off</span>
              <span className="text-[8px] sm:text-[9.5px] font-sans font-bold text-amber-100 uppercase mt-0.5 tracking-wider text-center max-w-[80%] leading-tight">
                team training
              </span>
            </div>

            {/* Early bird Cloud tag badge */}
            <div className="absolute bottom-[18%] right-[10%] bg-white text-indigo-950 text-[10px] font-extrabold font-sans px-4 py-2 rounded-full shadow-xl tracking-wider uppercase border border-indigo-50/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Early Bird Sale</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "agentic",
      // Cyber Agentic Sandbox (Vibrant Deep Charcoal Layout)
      bgClass: "bg-[#090D16]",
      borderClass: "border-[#1E293B]",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-center text-white">
          {/* Left Text Detail */}
          <div className="lg:col-span-12 xl:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4 sm:space-y-5 text-left flex flex-col justify-between h-full">
            <div className="space-y-4">
              {/* Brand Logo Banner with Sandbox badge */}
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black text-xs sm:text-sm tracking-tight text-white">
                  ai<span className="text-emerald-400 font-medium font-sans">institute</span>
                </span>
                <span className="bg-[#10B981]/10 text-emerald-400 text-[8px] sm:text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                  active_sandbox
                </span>
              </div>

              {/* High-visibility Headline */}
              <h3 className="font-sans font-black text-2xl sm:text-3.5xl lg:text-4xl text-white tracking-tight leading-[1.08] max-w-xl">
                Interactive Multi-Agent Engineering Sandbox
              </h3>

              {/* Body Text */}
              <p className="text-slate-300 text-xs sm:text-sm md:text-base font-medium font-secondary max-w-lg leading-relaxed">
                Step into live terminal sessions. Synthesize custom API routes, ground search models, and configure autonomous worker swarms dynamically.
              </p>
            </div>

            {/* Custom Action Call to Action */}
            <div className="pt-4 sm:pt-6 space-y-4">
              <button
                onClick={() => navigateTo("paths")}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-sans font-bold text-xs sm:text-sm px-6 py-3 sm:py-3.5 rounded-lg transition-all shadow-lg active:scale-98 cursor-pointer uppercase tracking-wider"
              >
                <span>Access Sandbox Labs</span>
                <ArrowRight className="w-4 h-4 text-slate-950 animate-pulse" />
              </button>

              {/* Quick statistics badge row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {[
                  { value: "4.9 ⭐", label: "Developer Rating" },
                  { value: "15+", label: "Interactive Modules" },
                  { value: "Zero Local Setup", label: "Prerequisite" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[10.5px] font-mono text-slate-300 flex gap-1.5">
                    <span className="font-bold text-emerald-400">{stat.value}</span>
                    <span className="text-slate-400">|</span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Terminal Frame */}
          <div className="hidden xl:col-span-5 h-full p-8 flex items-center justify-center">
            <div className="w-full bg-[#030712] border border-slate-800 rounded-2xl p-4 font-mono text-[10px] text-slate-300 shadow-2xl space-y-2.5 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-xl pointer-events-none" />
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-[8px] bg-slate-900 px-2 py-0.5 rounded text-amber-400 uppercase tracking-widest font-bold">swarm_core.sh</span>
              </div>
              <p className="text-slate-500">&gt; npm run start:orchestrate_agents</p>
              <p className="text-emerald-400">[READY] Initialized primary routing nodes...</p>
              <p className="text-blue-400">[LAUNCH] Loading Gemini 2.5 Flash context caches...</p>
              <p className="text-amber-400">[PENDING] Executing API hook integrations...</p>
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2 text-[9px] font-bold text-center mt-4">
                STATUS: MULTI-AGENT PIPELINE CONFIGURED successfully.
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section 
      id="ai-experience" 
      className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden border-y border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Soft architectural alignment framework grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0056d201_1px,transparent_1px),linear-gradient(to_bottom,#0056d201_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER BLOCK: Clean, crisp, high-contrast, following the prompt labels */}
        <div className="text-left space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 bg-blue-105/10 bg-blue-50 text-[#0056D2] px-3.5 py-1.5 rounded-full text-xs font-sans font-extrabold uppercase tracking-wider border border-blue-102">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI-Powered Learning Experience</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#0B1B3D] leading-tight">
            Step into a dedicated, hands-on ecosystem
          </h2>
          <p className="text-gray-500 font-secondary text-sm sm:text-base max-w-3xl leading-relaxed">
            Our platform runs multi-model background agents so you learn in live, interactive environments. Experience real-time pipelines, workspace audits, and career accelerations.
          </p>
        </div>

        {/* CAROUSEL SLIDER WRAPPER - NEAT FULL WIDTH CARD PORTAL */}
        <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl border border-gray-200 bg-white">
          <div className="relative min-h-[500px] lg:min-h-[460px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`absolute inset-0 w-full h-full ${slides[currentSlide].bgClass} border border-transparent rounded-3xl overflow-hidden`}
              >
                {slides[currentSlide].content}
              </motion.div>
            </AnimatePresence>

            {/* Left/Right manual click triggers - Highly modern hovering buttons with lucide icons */}
            <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 flex items-center gap-2 z-20">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#0B1B3D] flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer border border-[#0B1B3D]/10"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#0B1B3D] flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer border border-[#0B1B3D]/10"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Dots/Dashes indicator at the bottom left replicating exactly the attached image pattern */}
            <div className="absolute left-6 bottom-6 sm:left-10 sm:bottom-10 z-20 flex items-center gap-2.5">
              {slides.map((_, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? slides[currentSlide].id === "plus" 
                          ? "w-8 bg-[#0056D2]" 
                          : slides[currentSlide].id === "teams" 
                          ? "w-8 bg-white" 
                          : "w-8 bg-emerald-400"
                        : "w-2 bg-gray-400/50 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
