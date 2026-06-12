/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Sparkles, Twitter, Linkedin, Github } from "lucide-react";
import { useNavigation, ViewType } from "../context/NavigationContext";

export default function Footer() {
  const { navigateTo } = useNavigation();

  const handleNav = (view: ViewType) => {
    navigateTo(view);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <footer className="bg-[#070A14] text-slate-400 py-16 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/[0.04] text-left">
          {/* Branding */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav("home")}>
              <div className="w-8 h-8 rounded-lg bg-[#2D7FF9] flex items-center justify-center text-white font-bold relative">
                <Sparkles className="w-4.5 h-4.5 text-[#FCF50F]" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-white animate-in">
                AIOnline<span className="text-[#2D7FF9]">Business</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal max-w-xs">
              The premier applied AI learning academy helping entrepreneurs and leaders develop real automation routines and skills.
            </p>
            
            {/* social buttons link */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Programs */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-[9px] uppercase tracking-wider font-bold text-white">Programs</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleNav("programs")} className="hover:text-white cursor-pointer select-none text-left">AI Business Mastery</button></li>
              <li><button onClick={() => handleNav("programs")} className="hover:text-white cursor-pointer select-none text-left">ChatGPT Mastery</button></li>
              <li><button onClick={() => handleNav("programs")} className="hover:text-white cursor-pointer select-none text-left">AI Content Creation</button></li>
              <li><button onClick={() => handleNav("programs")} className="hover:text-white cursor-pointer select-none text-left">Developer Automation</button></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-[9px] uppercase tracking-wider font-bold text-white">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleNav("resources")} className="hover:text-white cursor-pointer select-none text-left">Prompt Libraries</button></li>
              <li><button onClick={() => handleNav("resources")} className="hover:text-white cursor-pointer select-none text-left font-sans">Automation Blueprints</button></li>
              <li><button onClick={() => handleNav("resources")} className="hover:text-white cursor-pointer select-none text-left">Weekly Webinars</button></li>
              <li><button onClick={() => handleNav("success")} className="hover:text-white cursor-pointer select-none text-left">Case Studies</button></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-[9px] uppercase tracking-wider font-bold text-white">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleNav("about")} className="hover:text-white cursor-pointer select-none text-left">Why Us</button></li>
              <li><button onClick={() => handleNav("success")} className="hover:text-white cursor-pointer select-none text-left">Student Success</button></li>
              <li><button onClick={() => handleNav("resources")} className="hover:text-white cursor-pointer select-none text-left">Alumni Forum</button></li>
              <li><button onClick={() => handleNav("about")} className="hover:text-white cursor-pointer select-none text-left">Contact Sales</button></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-[9px] uppercase tracking-wider font-bold text-white">Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-slate-500 block">Admissions:</span> info@aionlinebusiness.com</li>
              <li><span className="text-slate-500 block">Partnership:</span> partners@academy.com</li>
            </ul>
          </div>

        </div>

        {/* Legal copyrights banner */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest text-center sm:text-left">
          <span>© {new Date().getFullYear()} AIOnlineBusiness. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer" onClick={() => handleNav("about")}>Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => handleNav("about")}>Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
