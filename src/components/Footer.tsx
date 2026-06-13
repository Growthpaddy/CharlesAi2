/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Sparkles, Twitter, Linkedin, Github, Send, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useNavigation, ViewType } from "../context/NavigationContext";

export default function Footer() {
  const { navigateTo } = useNavigation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNav = (view: ViewType) => {
    navigateTo(view);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail("");
    }, 1000);
  };

  return (
    <footer className="bg-[#070A14] text-slate-400 py-20 border-t border-white/[0.04] relative overflow-hidden">
      
      {/* Decorative subtle background nodes */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#2D7FF9]/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Modern Email Subscriber Segment Spanning Top of Footer */}
        <div className="mb-16 pb-12 border-b border-white/[0.04] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-left">
          <div className="max-w-md space-y-2">
            <span className="inline-flex items-center gap-1 bg-[#2D7FF9]/15 text-[#2D7FF9] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-blue-500/10">
              STAY AHEAD OF AUTOMATION
            </span>
            <h3 className="text-xl sm:text-2xl font-sans font-black text-white tracking-tight">
              Subscribe to elite AI briefings
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-secondary">
              Receive raw, weekly prompt blueprints, webhook sequences, and multi-agent code templates used by leading operators.
            </p>
          </div>

          <div className="w-full max-w-md shrink-0">
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 text-emerald-400"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-xs font-sans font-bold">Successfully subscribed! Welcome to the weekly briefing pipeline.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your professional email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#2D7FF9] focus:border-[#2D7FF9] transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.96 }}
                  className="h-12 px-6 bg-[#2D7FF9] hover:bg-blue-600 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0 select-none cursor-pointer transition-colors"
                >
                  {isSubmitting ? (
                    <span>Configuring...</span>
                  ) : (
                    <>
                      <span>Brief Me</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>

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
