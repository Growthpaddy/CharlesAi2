/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, ShieldCheck, Mail, Lock, Play, ArrowRight, Chrome, Github } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

export default function LoginPortalModal() {
  const { isLoginOpen, setLoginOpen } = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [authError, setAuthError] = useState("");

  if (!isLoginOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!email || !password) {
      setAuthError("Please input an active student email and secure passcode.");
      return;
    }

    setIsSubmitting(true);
    // Simulate active sandbox authentication
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        setLoginOpen(false);
        alert("Authentication complete! Entering direct student workspace console...");
      }, 1500);
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#070F1E]/75 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 md:p-10 scrollbar-none">
        
        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative bg-[#FAFBFC] w-full max-w-6xl rounded-3xl shadow-3xl border border-white/10 overflow-hidden my-auto flex flex-col"
        >
          {/* Top Sticky Header */}
          <div className="sticky top-0 bg-[#FAFBFC]/95 backdrop-blur-md border-b border-gray-200/60 z-30 px-6 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-sans font-black text-sm tracking-tight text-[#0056D2]">
                ai<span className="text-[#0B1B3D] font-normal leading-none font-medium ml-0.5">institute</span>
              </span>
              <span className="bg-blue-50 text-[#0056D2] border border-blue-100 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Student Gate
              </span>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setLoginOpen(false)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[#0B1B3D] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 bg-white">
            
            {/* LEFT AREA: HIGH ACCREDITATION SECURE AUTHENTICATION FORM (5 columns) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#0056D2]/5 text-[#0056D2] px-3 py-1 rounded-full text-[10px] font-sans font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>Secure Sandbox Gateway</span>
                </div>
                
                <h3 className="font-sans text-2xl font-black text-[#0B1B3D] tracking-tight leading-none">
                  Enter student workspace
                </h3>
                
                <p className="text-gray-400 font-secondary text-xs leading-relaxed">
                  Authenticate using your active institutional credentials or secure enrollment hash link.
                </p>
              </div>

              {loginSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 text-center space-y-3 py-10 my-8">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-sans font-extrabold text-sm uppercase tracking-wider">Passcode matches</h4>
                  <p className="text-xs text-emerald-600/90">Synchronizing live multi-agent clusters & launching Jupyter sandbox labs. Please hold...</p>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4 my-4">
                  {authError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs py-2.5 px-3.5 rounded-xl font-medium">
                      {authError}
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Student Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sandra@microsoft.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0056D2] focus:bg-white text-gray-800 tracking-wide transition-all"
                      />
                    </div>
                  </div>

                  {/* Passcode Input */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Secure Passcode</label>
                      <a href="#reset" className="text-[10px] text-[#0056D2] font-semibold hover:underline">Forgot passcode?</a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0056D2] focus:bg-white text-gray-800 tracking-wide transition-all"
                      />
                    </div>
                  </div>

                  {/* Custom System Checkbox */}
                  <div className="flex items-center gap-2 pt-1.5 text-left">
                    <input
                      type="checkbox"
                      id="save-creds"
                      defaultChecked
                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#0056D2] focus:ring-[#0056D2]"
                    />
                    <label htmlFor="save-creds" className="text-[10.5px] text-gray-400 font-semibold select-none cursor-pointer">
                      Stay authenticated in this browser session
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0B1B3D] hover:bg-[#0056D2] text-white py-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? "Authenticating security tags..." : "Enter Sandbox Portal"}</span>
                    <Play className="w-3.5 h-3.5 font-bold" />
                  </button>
                </form>
              )}

              {/* Secure Federated Single Sign-On Mimic */}
              <div className="space-y-3.5 pt-4 border-t border-gray-100">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block text-center">
                  Or authenticate with federated SSO
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => alert("Google SSO initialized. Verifying Google security tokens...")}
                    className="flex justify-center items-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors cursor-pointer"
                  >
                    <Chrome className="w-3.5 h-3.5 text-rose-500" />
                    <span>Google</span>
                  </button>
                  <button 
                    onClick={() => alert("GitHub SSO initialized. Matching academic developer keys...")}
                    className="flex justify-center items-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-900" />
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT AREA: WELCOMING PERSUASIVE PANEL (7 columns) */}
            <div className="lg:col-span-7 bg-[#0B1B3D] p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-white relative overflow-hidden">
              {/* Subtle visual ambient glow */}
              <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[#0056D2]/25 rounded-full filter blur-[60px] pointer-events-none" />
              <div className="absolute -left-20 -top-20 w-60 h-60 bg-amber-500/10 rounded-full filter blur-[60px] pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500/15 text-blue-300 border border-blue-500/20 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" /> Welcome back, leader!
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    Pick Up Where You Left Off
                  </h3>
                  <p className="text-blue-100/70 text-xs sm:text-sm font-medium leading-relaxed">
                    Log back into your specialized AI Online Business student terminal and step straight into direct wealth-building execution lanes.
                  </p>
                </div>

                {/* Key motivating pillars */}
                <div className="space-y-5 pt-5 border-t border-white/10">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/20 flex items-center justify-center shrink-0 text-blue-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white">Latest High-Yield AI Frameworks</h4>
                      <p className="text-[11px] sm:text-xs text-blue-100/60 leading-normal">
                        Access detailed prompt modules, video translators, and complete blueprint repositories for automated Telegram bots, e-books, and social agency contracts.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/20 flex items-center justify-center shrink-0 text-blue-300">
                      <Play className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white">Interactive Sandbox & Practical Labs</h4>
                      <p className="text-[11px] sm:text-xs text-blue-100/60 leading-normal">
                        Launch your zero-install Jupyter notebook and play with client pitches, financial records systems, and Amazon-ready publishing designs in one place.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#0056D2]/25 border border-blue-400/20 flex items-center justify-center shrink-0 text-blue-300">
                      <ArrowRight className="w-4 h-4 text-blue-305" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white">Direct Mentorship & Vetting Feed</h4>
                      <p className="text-[11px] sm:text-xs text-blue-100/60 leading-normal">
                        Submit your active campaigns to Coach Charles. Share milestones, network with top alumni, and audit matching student databases from Abuja, Port Harcourt, and Lagos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivational high-context alumni quote footer */}
              <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex flex-col gap-3">
                <blockquote className="text-xs text-amber-205 font-bold italic border-l-2 border-amber-400 pl-3 leading-relaxed text-amber-205">
                  "This course changes lives. It didn't just teach me about AI — it made me believe that it is completely possible for me, where I am, with what I had."
                </blockquote>
                <div className="flex justify-between items-center text-[10px] font-mono text-blue-200/50">
                  <span className="font-extrabold uppercase">Omega / ChainFlow Systems</span>
                  <span>Vetted Student Success Proof</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}
