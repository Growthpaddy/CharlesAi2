/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Bot, Terminal, Award, CheckCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { motion, AnimatePresence } from "motion/react";

export default function HomeExperience() {
  const { navigateTo } = useNavigation();
  const [activeTab, setActiveTab] = useState<"tutor" | "sandbox" | "audit">("tutor");

  return (
    <section id="ai-experience" className="py-24 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
      
      {/* Subtle clean tech grid pattern overlay for high visibility */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#0056D2 1px, transparent 1px), linear-gradient(to right, rgba(0,86,210,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,86,210,0.03) 1px, transparent 1px)`,
          backgroundSize: "32px 32px, 120px 120px, 120px 120px",
          backgroundPosition: "center center"
        }}
      />

      {/* Pulsing professional radial blurs */}
      <div className="absolute top-[20%] left-[15%] w-[450px] h-[450px] bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: "14s" }} />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: "18s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        
        {/* Title Block - High visibility, pristine white text */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI POWERED ENVIRONMENT</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            AI-Powered Learning Experience
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2.5xl mx-auto font-secondary leading-relaxed">
            Step into a dedicated, hands-on ecosystem. Our platform runs multi-model background agents so you learn in live, interactive environments.
          </p>
        </div>

        {/* Dynamic Interactive Dual-Column Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Sandbox Output Terminal Widget */}
          <div className="lg:col-span-7 flex justify-center items-center w-full">
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-xl bg-slate-950 rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-800 relative overflow-hidden"
            >
              {/* Subtle accent highlight gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-blue-900/10 pointer-events-none" />
              
              {/* Terminal Chrome Window Controls */}
              <div className="bg-slate-900 border-b border-slate-800 rounded-2xl px-5 py-3.5 mb-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono tracking-wider text-slate-350 bg-slate-950 px-3.5 py-1 rounded-md border border-slate-800 font-bold uppercase">
                  {activeTab === "tutor" ? "AI_Tutor_Prompt.yaml" : activeTab === "sandbox" ? "python_interpreter.sh" : "cert_builder_system.exe"}
                </span>
                <div className="w-4" />
              </div>

              {/* Terminal Inner Frame */}
              <div className="bg-slate-950 rounded-2xl p-5 sm:p-6 h-[290px] text-left overflow-y-auto font-mono relative border border-slate-905">
                <AnimatePresence mode="wait">
                  {activeTab === "tutor" && (
                    <motion.div 
                      key="tutor"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 font-sans text-sm"
                    >
                      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 max-w-[85%] text-xs text-slate-300">
                        💡 How do I construct a background Make.com scenario that scrapes LinkedIn leads and sends customizable messages?
                      </div>
                      <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl max-w-[90%] text-xs text-white space-y-2 ml-auto">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <Bot className="w-4 h-4 shrink-0 text-amber-500" />
                          <span>AI ASSISTANT RESPONSE</span>
                        </div>
                        <p className="leading-relaxed text-slate-200">
                          1. Drag a <strong>LinkedIn Scraper</strong> module to gather profile handles.<br />
                          2. Direct variables to a <strong>Gemini Prompt</strong> step formulation to compose contextual pitches.<br />
                          3. Add a standard <strong>Gmail Send Message</strong> action mapped with draft values.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "sandbox" && (
                    <motion.div 
                      key="sandbox"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 font-mono text-xs text-slate-350"
                    >
                      <p className="text-blue-400 font-bold">&gt; python make_lead_sync.py</p>
                      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px] leading-relaxed">
                        <p className="text-emerald-400">[OK] Connected with Make API client successfully...</p>
                        <p className="text-slate-350">[LOG] Scraped 15 warm prospects from LinkedIn filters.</p>
                        <p className="text-amber-450 text-amber-400">[RUNNING] Transforming cold bios into customized pitch cards...</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2.5 rounded-lg text-[10px] font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Process Completed: synced row cells back to spreadsheet.</span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "audit" && (
                    <motion.div 
                      key="audit"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="h-full flex flex-col justify-between items-center text-center py-2 font-sans"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                        <Award className="w-6 h-6 text-amber-500 fill-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white">Accredited AI Architect Credential</h4>
                        <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                          Verifiable ID generated on local registries. Validates verified performance audits on cloud prompt workflows.
                        </p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 py-1.5 px-4 rounded-xl text-[10px] text-amber-400 font-mono">
                        STATUS: VERIFIED CERTIFICATE SECURE 🔓
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Clickable Navigation Controls styled for pristine contrast */}
          <div className="lg:col-span-5 space-y-4 text-left">
            
            {/* Feature Item 1 */}
            <motion.div
              onClick={() => setActiveTab("tutor")}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeTab === "tutor"
                  ? "bg-slate-800/80 border-blue-500/40 shadow-lg"
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 rounded-md uppercase tracking-wider font-mono border border-emerald-500/20">
                  ALWAYS ONLINE
                </span>
                <Bot className={`w-5 h-5 ${activeTab === "tutor" ? "text-blue-400" : "text-slate-400"}`} />
              </div>
              <h3 className="font-bold text-base text-white mb-1">
                AI Tutor Drafts
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-secondary">
                Instantly review synthesized text solutions tuned to your prompt guidelines.
              </p>
            </motion.div>

            {/* Feature Item 2 */}
            <motion.div
              onClick={() => setActiveTab("sandbox")}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeTab === "sandbox"
                  ? "bg-slate-800/80 border-blue-500/40 shadow-lg"
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-500/10 text-blue-400 text-[9px] font-bold px-2 rounded-md uppercase tracking-wider font-mono border border-blue-500/20">
                  PRE-CONFIGURED
                </span>
                <Terminal className={`w-5 h-5 ${activeTab === "sandbox" ? "text-blue-400" : "text-slate-400"}`} />
              </div>
              <h3 className="font-bold text-base text-white mb-1">
                Virtual Sandbox Lab
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-secondary">
                Interact directly with simulated terminal runs without any local Python tooling.
              </p>
            </motion.div>

            {/* Feature Item 3 */}
            <motion.div
              onClick={() => setActiveTab("audit")}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeTab === "audit"
                  ? "bg-slate-800/80 border-blue-500/40 shadow-lg"
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-purple-500/10 text-purple-400 text-[9px] font-bold px-2 rounded-md uppercase tracking-wider font-mono border border-purple-500/20">
                  VERIFIABLE
                </span>
                <Award className={`w-5 h-5 ${activeTab === "audit" ? "text-amber-400" : "text-slate-400"}`} />
              </div>
              <h3 className="font-bold text-base text-white mb-1">
                Live Certification Auditing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-secondary">
                Your code blueprints are scanned and reviewed instantly against rigorous specs.
              </p>
            </motion.div>

            {/* High Impact Action Button */}
            <div className="pt-3">
              <motion.button
                onClick={() => navigateTo("paths")}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#0056D2] hover:bg-[#003E9C] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider min-h-[44px]"
              >
                <span>Explore AI Learning Experience</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            
          </div>

        </div>

      </div>
    </section>
  );
}
