/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Star, 
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
// @ts-ignore
import leadFacultyImage from "../assets/images/regenerated_image_1781336783869.png";

export default function Hero() {
  const { navigateTo } = useNavigation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 85;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  // World class universities/companies partners list matching Coursera feel
  const partners = [
    { name: "Google", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "IBM", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Microsoft", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Stanford", label: "Stanford University" },
    { name: "UPenn", label: "University of Pennsylvania" },
    { name: "OpenAI", label: "OpenAI" },
    { name: "Anthropic", label: "Anthropic" },
    { name: "DeepLearning.AI", label: "DeepLearning.AI" }
  ];

  return (
    <section id="hero" className="relative pt-32 sm:pt-36 pb-16 lg:pb-24 overflow-hidden bg-[#FAFCFF] text-gray-900 border-b border-gray-150">
      {/* Soft elegant architectural grid lines matching Coursera's neat style */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0056d203_1px,transparent_1px),linear-gradient(to_bottom,#0056d204_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      
      {/* Top subtle decorative ambient nodes */}
      <div className="absolute top-[-10%] right-[10%] w-[400px] h-[400px] bg-[#0056D2]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-amber-500/3 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Dynamic Promo Banner strip mimicking Coursera's ends soon layout */}
        <div className="mb-12 bg-gradient-to-r from-[#0056D2] to-[#003E9C] rounded-2xl p-4 sm:p-6 text-white text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-80 bg-[radial-gradient(circle_at_right_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
          <div className="space-y-1 z-10">
            <span className="inline-block bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest">
              OFFER HIGHLIGHT &bull; 50% SAVINGS
            </span>
            <h4 className="text-base sm:text-lg font-sans font-black tracking-tight">
              Ends soon! Save more on Applied AI skills that stand out.
            </h4>
            <p className="text-xs text-blue-100 max-w-xl">
              Today is a brilliant time to begin with 50% off professional cert timelines. Unlock elite workflow modules.
            </p>
          </div>
          <div className="shrink-0 z-10 w-full sm:w-auto">
            <motion.button
              onClick={() => scrollToSection("pricing")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-6 py-3 bg-white text-[#0056D2] hover:bg-blue-50 font-sans font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <span>Save 50% Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authoritative, polished LMS copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Highly respected badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0056D2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0056D2]"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-wide text-[#0056D2] uppercase">
                COHORT REGISTRATIONS ACTIVE &bull; SELECT SEATS REMAINING
              </span>
            </div>

            {/* Headline - Coursera inspired layout with pristine typography */}
            <h1 className="font-sans text-3xl sm:text-5xl lg:text-[46px] xl:text-[54px] font-black tracking-tight text-gray-900 leading-[1.1]">
              Where Executives & Technical Builders{" "}
              <span className="text-[#0056D2] relative inline-block">
                Master Applied AI
                <span className="absolute bottom-1 left-0 right-0 h-1 bg-blue-200/60 -z-10" />
              </span>{" "}
              Operations.
            </h1>

            {/* Authoritative, trust-centered description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl font-secondary">
              Step into a premium academy designed specifically to bring raw competency to your active workflow. Skip theoretical fluff and learn how to construct production-ready webhook sequences, system prompting structures, and multi-agent loops that immediately lower operating costs.
            </p>

            {/* Direct premium Call To Actions with pristine click targets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <motion.button
                onClick={() => navigateTo("programs")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-3.5 bg-[#0056D2] hover:bg-[#003E9C] text-white font-sans font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Enroll in Next Cohort</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
              
              <motion.button
                onClick={() => navigateTo("programs")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-sans font-bold text-sm rounded-xl border border-gray-200 hover:border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Explore 9 Programs</span>
              </motion.button>
            </div>

            {/* Clear trust metrics aligned cleanly to the left, styled professionally */}
            <div className="pt-6 border-t border-gray-150 max-w-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-2xl font-sans font-black text-[#0056D2]">12,000+</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">ACADEMY GRADUATES</p>
                </div>
                <div>
                  <h3 className="text-2xl font-sans font-black text-[#0056D2]">90+</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">SANDBOX LABS</p>
                </div>
                <div>
                  <h3 className="text-2xl font-sans font-black text-gray-900 flex items-center gap-0.5">
                    4.9<Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">STUDENT RATING</p>
                </div>
                <div>
                  <h3 className="text-2xl font-sans font-black text-emerald-600">100%</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">CURRICULUM TRUST</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean, high-fidelity profile layout instead of futuristic mesh */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Soft backdrop blur card */}
            <div className="absolute inset-0 max-w-sm mx-auto rounded-3xl bg-blue-50/50 blur-2xl pointer-events-none -translate-x-4" />

            <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl text-left relative transition-all duration-300 hover:shadow-2xl hover:border-gray-300 group">
              
              {/* Image Frame */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={leadFacultyImage}
                  alt="Charles Tuti - Lead AI Architect"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                
                {/* Accent Ribbon */}
                <div className="absolute top-4 right-4 bg-[#0056D2] text-white px-3 py-1 rounded-lg text-[9px] font-mono tracking-wider uppercase font-black shadow-md">
                  FOUNDING FACULTY
                </div>

                {/* Info Overlay Panel */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent p-5 text-white">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                    EX-GOOGLE ML LEAD
                  </span>
                  <h3 className="text-lg font-sans font-black mt-0.5">
                    Charles Tuti
                  </h3>
                  <p className="text-xs text-gray-200 mt-1 line-clamp-2">
                    7+ years building enterprise orchestration architectures and system pipelines.
                  </p>
                </div>
              </div>

              {/* Verified badge list below */}
              <div className="p-4 bg-gray-50 border-t border-gray-150 grid grid-cols-2 gap-3 text-xs font-semibold text-gray-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0056D2] shrink-0" />
                  <span>Interactive Labs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0056D2] shrink-0" />
                  <span>Slack Mentoring</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Brand logos wave imitating "Learn from 350+ leading universities and companies" */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Trusted by operators at world-leading organizations
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6 opacity-65">
            <span className="text-gray-500 font-sans font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1">
              <span className="text-red-500 text-lg">■</span> Stanford University
            </span>
            <span className="text-gray-500 font-sans font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1">
              <span className="text-blue-700 text-lg">■</span> Google Enterprise
            </span>
            <span className="text-gray-500 font-sans font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1">
              <span className="text-sky-500 text-lg">■</span> IBM Cloud
            </span>
            <span className="text-gray-500 font-sans font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1">
              <span className="text-[#0056D2] text-lg">■</span> UPenn Wharton
            </span>
            <span className="text-gray-500 font-sans font-mono text-xs font-black tracking-widest">
              OPENAI COGNITIVE
            </span>
            <span className="text-gray-500 font-sans font-black text-sm tracking-tight">
              DeepLearning.AI
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
