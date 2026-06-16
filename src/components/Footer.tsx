/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Sparkles, Phone, MapPin, GraduationCap, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { useNavigation, ViewType } from "../context/NavigationContext";

export default function Footer() {
  const { navigateTo } = useNavigation();

  // Helper to change page instantly and scroll up
  const handleNav = (view: ViewType) => {
    navigateTo(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="global-footer" className="bg-[#0B132B] text-slate-300 border-t border-slate-800 pt-16 pb-12 relative z-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: BRAND INTRO & VALUE STATEMENT BENTO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Main Logo & Identity */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2D7FF9] flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white leading-none">
                  AI ONLINE<span className="text-[#2D7FF9] ml-1">BUSINESS</span>
                </span>
                <span className="block text-[8px] font-mono tracking-[0.18em] text-slate-400 uppercase font-semibold mt-0.5">
                  Professional Practical Training Academy
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Transform your high-value digital competence. Empowering over 3,500 students to master prompt engineering, automated customer pipelines, and live practical systems.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-[#2D7FF9] shrink-0" />
                <span>Lekki, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone className="w-4 h-4 text-[#2D7FF9] shrink-0" />
                <span>+234 708 260 8128</span>
              </div>
            </div>
          </div>

          {/* Value Accordion Pointers */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-left space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/15 text-[#2D7FF9] px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
                <Sparkles className="w-3 h-3" /> Custom Coaching
              </span>
              <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">Premium 1-on-1 Modules</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Work directly with physical instructors in Lagos to audit your business systems and build target sales agents over 6 weeks.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-left space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
                <ShieldCheck className="w-3 h-3" /> Accredited Certificates
              </span>
              <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">Corporate Validation</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Graduate and obtain verifications trusted across Nigeria for physical placement and outsourced digital services.
              </p>
            </div>

          </div>

        </div>

        {/* ROW 2: DETAILED SYLLABI & LINKS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-800 text-left">
          
          {/* Column 1: Curriculum Modules */}
          <div className="space-y-4">
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-[#2D7FF9]">
              Curriculum Modules
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => handleNav("programs")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  AI Prompt Engineering
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("programs")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  AI Digital Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("programs")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  AI Content Creation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("programs")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  App Creation with AI
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("programs")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  AI Business Automation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Advanced Pathways */}
          <div className="space-y-4">
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-400">
              Advanced Syllabi
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => handleNav("paths")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Client Acquisition
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("paths")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  AI Affiliate Marketing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("paths")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Google & Facebook Advertising
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("paths")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Faceless YouTube
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("paths")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  AI Ghostwriting Specialist
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Academy Services */}
          <div className="space-y-4">
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-400">
              Coaching & Corporate
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => handleNav("services")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  One-on-One Audits (6w)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("services")} className="hover:text-white hover:underline transition-colors cursor-pointer text-[#2D7FF9] text-left focus:outline-none">
                  Group Mastermind (1m)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("services")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Corporate Team Training
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("contact")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Physical Campus Registry
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("contact")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Request Custom Proposal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Private Student Desk */}
          <div className="space-y-4">
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-[#2D7FF9]">
              Student Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => handleNav("dashboard")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  ⚡ Open Study Console
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("success")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Course Completion Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("resources")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Helpdesk FAQ Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("about")} className="hover:text-white hover:underline transition-colors cursor-pointer text-left focus:outline-none">
                  Our Founding Manifesto
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* ROW 3: LEGAL ACCREDITATION & TRADEMARKS */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-slate-500 font-medium font-sans">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} AI ONLINE BUSINESS. All Rights Reserved.</span>
            <span>•</span>
            <span>Instructors physical campus at Lekki, Lagos, Nigeria.</span>
            <span>•</span>
            <button onClick={() => handleNav("about")} className="hover:text-white transition-colors cursor-pointer focus:outline-none">Terms of Service</button>
            <span>•</span>
            <button onClick={() => handleNav("about")} className="hover:text-white transition-colors cursor-pointer focus:outline-none">Privacy Policy</button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#2D7FF9]/15 border border-slate-700 flex items-center justify-center text-[10px] text-[#2D7FF9] font-bold" title="Official Verified Academy Logo">
              ✓
            </div>
            <span className="text-[10px] text-slate-400 font-sans tracking-wide uppercase font-bold">Verified Training Hub</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
