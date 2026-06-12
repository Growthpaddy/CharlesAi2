/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Star, ArrowRight, Play, Bot, Sparkles, Send, Zap, Award, Layers, CheckCircle } from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"chat" | "stats" | "certificate">("chat");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "user", text: "Create an autonomous marketing queue for my local consultancy." },
    { sender: "ai", text: "🤖 **Automation formulated!** I have paired Claude with Make.com to auto-scrape warm prospects and draft personalized pitch templates in your inbox draft folder." }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚡ **Integration verified!** Automatically syncing lead data row back to client spreadsheet." }
      ]);
    }, 800);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 85;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-20 lg:pb-28 overflow-hidden bg-white">
      {/* SaaS Developer style grid layout overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2d80f905_1px,transparent_1px),linear-gradient(to_bottom,#2d80f905_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Absolute blur backdrops */}
      <div className="absolute top-[5%] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#2D7FF9]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[2%] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#FCF50F]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authentic Premium Copy */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 text-left z-10">
            {/* Live active members pulse */}
            <div className="inline-flex items-center gap-2 bg-gray-550/10 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold font-mono tracking-wider text-[#08142B] uppercase">
                COHORT ENROLLMENT LIVE TODAY
              </span>
            </div>

            {/* Headline - Exact 9 words: Master AI Skills That Transform Careers and Businesses */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#08142B] leading-[1.15]">
              Master AI Skills That{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 text-[#2D7FF9]">Transform Careers</span>
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-1 left-0 h-2 bg-[#FCF50F] -z-10 rounded-full"
                />
              </span>{" "}
              and{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 text-[#08142B]">Businesses</span>
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-1 left-0 h-1.5 bg-[#2D7FF9]/40 -z-10 rounded-full"
                />
              </span>
            </h1>

            {/* Subheading - Strict constraint (under 20 words): One concise sentence only */}
            <p className="text-base sm:text-lg text-gray-550 leading-relaxed max-w-xl font-normal">
              Build high-paying consulting systems, hands-free automation loops, and modern content assets in any business today.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection("pricing")}
                className="glow-btn px-8 py-4 bg-[#2D7FF9] hover:bg-[#2D7FF9]/95 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer min-h-[48px]"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection("featured-programs")}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-[#08142B] font-bold text-base rounded-2xl border border-gray-250 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
              >
                <span>Explore Programs</span>
              </button>
            </div>

            {/* Trust Row immediately below */}
            <div className="pt-6 border-t border-gray-100 max-w-lg">
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#08142B] font-display">12,000+</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase font-mono tracking-wide mt-0.5">Students</p>
                </div>
                <div className="border-l border-gray-100 pl-3">
                  <p className="text-xl sm:text-2xl font-black text-[#08142B] font-display">90+</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase font-mono tracking-wide mt-0.5">Courses</p>
                </div>
                <div className="border-l border-gray-100 pl-3">
                  <p className="text-xl sm:text-2xl font-black text-[#08142B] font-display flex items-center gap-0.5">
                    4.9<Star className="w-3.5 h-3.5 fill-current text-[#FCF50F] stroke-[#08142B] shrink-0" />
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase font-mono tracking-wide mt-0.5">Rating</p>
                </div>
                <div className="border-l border-gray-100 pl-3">
                  <p className="text-xl sm:text-2xl font-black text-[#08142B] font-display">100+</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase font-mono tracking-wide mt-0.5">Countries</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Dashboard Mockup (NOT screenshots) */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-full z-10 px-2">
            <div className="w-full max-w-xl bg-[#08142B] rounded-3xl shadow-2xl overflow-hidden border border-white/10 text-left relative">
              {/* Top application bar */}
              <div className="bg-[#0c1d3c] border-b border-white/5 px-5 py-3.5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-[#08142B] px-3.5 py-1 rounded-lg border border-white/5 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LMS_ACTIVE_WORKSPACE.EXE
                </span>
                <div className="w-6" />
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="grid grid-cols-3 bg-[#0c1d3c]/50 text-xs text-slate-400">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`py-3.5 flex items-center justify-center gap-2 border-b-2 font-bold cursor-pointer transition-colors ${activeTab === "chat" ? "border-[#2D7FF9] text-[#2D7FF9] bg-[#08142B]" : "border-transparent hover:text-white"}`}
                >
                  <Bot className="w-4 h-4" />
                  <span>AI Tutor Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`py-3.5 flex items-center justify-center gap-2 border-b-2 font-bold cursor-pointer transition-colors ${activeTab === "stats" ? "border-[#2D7FF9] text-[#2D7FF9] bg-[#08142B]" : "border-transparent hover:text-white"}`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Stats Engine</span>
                </button>
                <button
                  onClick={() => setActiveTab("certificate")}
                  className={`py-3.5 flex items-center justify-center gap-2 border-b-2 font-bold cursor-pointer transition-colors ${activeTab === "certificate" ? "border-[#2D7FF9] text-[#2D7FF9] bg-[#08142B]" : "border-transparent hover:text-white"}`}
                >
                  <Award className="w-4 h-4" />
                  <span>Certificates</span>
                </button>
              </div>

              {/* Dynamic Interactive Body Display */}
              <div className="p-6 h-[330px] overflow-y-auto text-sm text-slate-300">
                {activeTab === "chat" && (
                  <div className="flex flex-col h-full justify-between gap-4">
                    <div className="space-y-4 overflow-y-auto max-h-[220px] pr-1">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-[#2D7FF9]/15 text-white ml-auto border border-[#2D7FF9]/20 rounded-tr-none"
                              : "bg-[#0c1d3c] text-slate-200 border border-slate-700/55 mr-auto rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2 bg-[#0c1d3c] p-1.5 rounded-xl border border-white/5">
                      <input
                        type="text"
                        placeholder="Create complex automation script..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-transparent border-0 text-xs px-3 focus:outline-none focus:ring-0 text-white placeholder-slate-500"
                      />
                      <button type="submit" className="bg-[#2D7FF9] hover:bg-white text-[#08142B] hover:text-[#08142B] p-2 rounded-lg transition-colors font-bold cursor-pointer">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "stats" && (
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 font-mono mb-1.5">
                        <span>COURSE PATH PROGRESSION</span>
                        <span className="text-[#2D7FF9] font-bold">81% Complete</span>
                      </div>
                      <div className="w-full bg-[#0c1d3c] h-3 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          className="bg-gradient-to-r from-[#2D7FF9] to-cyan-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "81%" }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0c1d3c] p-4 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Lab Uptime</span>
                        <p className="text-xl font-bold text-white mt-1">100%</p>
                        <p className="text-[9px] text-[#2D7FF9] mt-0.5">24/7 background servers online</p>
                      </div>
                      <div className="bg-[#0c1d3c] p-4 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Practice Run time</span>
                        <p className="text-xl font-bold text-white mt-1">42.8h</p>
                        <p className="text-[9px] text-[#FCF50F] mt-0.5">Completed 12 projects challenge</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center italic leading-tight">
                      Sandbox metrics calibrate dynamically every 15 seconds.
                    </p>
                  </div>
                )}

                {activeTab === "certificate" && (
                  <div className="h-full flex flex-col justify-between items-center text-center p-3">
                    <div className="w-14 h-14 rounded-full bg-[#2D7FF9]/10 text-[#2D7FF9] flex items-center justify-center border border-[#2D7FF9]/25 animate-pulse">
                      <Award className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold tracking-tight text-white leading-tight">Applied AI Architect Certification</p>
                      <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                        Issued dynamically upon complete verification of Make.com triggers and model playground parameters.
                      </p>
                    </div>
                    <div className="bg-[#0c1d3c] px-4 py-2 rounded-xl border border-white/5 text-[11px] font-mono flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ID: AISTUDIO-94025-COLE</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* floating badging element 1: rating banner */}
            <motion.div
              initial={{ y: 15 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute left-[-25px] bottom-6 bg-[#08142B] p-4 rounded-2xl border border-white/10 shadow-xl hidden sm:block text-left max-w-[170px]"
            >
              <div className="flex items-center gap-1.5 text-[#FCF50F] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current shrink-0" />
                ))}
              </div>
              <p className="text-[11px] font-bold text-white tracking-tight leading-tight">
                Recommended by 98% of cohort executives
              </p>
            </motion.div>

            {/* floating badging element 2: speed marker */}
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-[-15px] top-6 bg-[#2D7FF9] p-3 rounded-2xl shadow-xl hidden sm:block text-left text-white max-w-[155px]"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-[#FCF50F]" />
                <span className="font-mono text-[9px] font-bold tracking-wider">SPEED SCALE</span>
              </div>
              <p className="text-[11px] font-bold leading-tight">
                Build cloud integrations 10x faster.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
