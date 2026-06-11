/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Star, ArrowRight, BookOpen, Bot, Send, GitMerge, TrendingUp, Sparkles, Code, Play } from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"chat" | "automation" | "analytics" | "content">("chat");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "user", text: "Create an high-retention marketing sequence for my gourmet coffee agency." },
    { sender: "ai", text: "🎯 **AI Sequence Formulated**\n\n1. **Hook:** \"Why 94% of remote founders brew the wrong bean...\"\n2. **Value Stat:** Save 12 hours of midday brain-fog.\n3. **Closer AI Action:** Personalized calendar reservation with custom video." }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsgs = [...chatMessages, { sender: "user", text: chatInput }];
    setChatMessages(newMsgs);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: "ai", text: "🤖 **Bespoke automation trigger generated!** Workflow initiated: Syncing Lead database with HubSpot Custom Fields..." }
      ]);
    }, 1000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#FAFBFC] z-10">
      {/* Soft gradient background accents */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#2D7FF9]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[300px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#FCF50F]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Premium Title & Copy */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Rating trust pill */}
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-150 shadow-sm animate-fade-in">
              <span className="flex text-[#FCF50F] items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                ))}
              </span>
              <span className="text-xs font-semibold text-[#101828] bg-gray-550">
                4.9/5 Rating
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-550 font-medium">
                12k+ Active Alumni
              </span>
            </div>

            {/* Main Premium Typography H1 */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#101828] leading-[1.1]">
              Master AI Skills That{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#011673] to-[#2D7FF9]">
                Build Businesses,
              </span>{" "}
              Create Income & Future-Proof Career.
            </h1>

            {/* High Conversion Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 font-normal leading-relaxed max-w-2xl">
              Learn practical AI tools, automation systems, smart content creation, business scaling architectures, and hands-free productivity frameworks from real industry consultants.
            </p>

            {/* CTA Tri-Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection("pricing")}
                className="glow-btn px-8 py-4 bg-[#011673] hover:bg-[#2D7FF9] text-white font-semibold text-base rounded-2xl shadow-premium-xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>Start Learning Today</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-[#FCF50F]" />
              </button>
              <button
                onClick={() => scrollToSection("curriculum")}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-[#101828] font-semibold text-base rounded-2xl border border-gray-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <BookOpen className="w-5 h-5 text-gray-500" />
                <span>View Curriculum</span>
              </button>
            </div>

            {/* Quick trust metrics row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#011673] font-display">12,000+</p>
                <p className="text-xs text-gray-500 uppercase font-mono tracking-wider mt-1">Students</p>
              </div>
              <div className="border-l border-gray-100 pl-4">
                <p className="text-2xl sm:text-3xl font-bold text-[#011673] font-display">150+</p>
                <p className="text-xs text-gray-500 uppercase font-mono tracking-wider mt-1">Lessons</p>
              </div>
              <div className="border-l border-gray-100 pl-4">
                <p className="text-2xl sm:text-3xl font-bold text-[#011673] font-display">30+</p>
                <p className="text-xs text-gray-500 uppercase font-mono tracking-wider mt-1">AI Tools</p>
              </div>
            </div>

          </div>

          {/* Right Column: Premium AI Interactive Workspace & Floating Glass Cards */}
          <div className="lg:col-span-6 relative mt-10 lg:mt-0 flex justify-center items-center">
            
            {/* Main Interactive AI Dashboard Container */}
            <div className="w-full max-w-lg md:max-w-xl bg-white border border-gray-200/80 rounded-3xl shadow-premium-xl overflow-hidden relative z-20 text-left">
              {/* Top Header tab bar */}
              <div className="bg-gray-50/80 border-b border-gray-150 px-4 py-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex bg-white/90 border border-gray-200 p-0.5 rounded-lg text-xs font-mono text-gray-400">
                  <span className="px-2 text-gray-700">ai_online_dashboard.tsx</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Navigation Dashboard Tabs */}
              <div className="grid grid-cols-4 border-b border-gray-100 text-xs font-medium text-gray-500">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
                    activeTab === "chat"
                      ? "border-[#2D7FF9] text-[#2D7FF9] bg-blue-50/10"
                      : "border-transparent hover:text-gray-900"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>ChatGPT</span>
                </button>
                <button
                  onClick={() => setActiveTab("automation")}
                  className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
                    activeTab === "automation"
                      ? "border-[#2D7FF9] text-[#2D7FF9] bg-blue-50/10"
                      : "border-transparent hover:text-gray-900"
                  }`}
                >
                  <GitMerge className="w-4 h-4" />
                  <span>Automation</span>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
                    activeTab === "analytics"
                      ? "border-[#2D7FF9] text-[#2D7FF9] bg-blue-50/10"
                      : "border-transparent hover:text-gray-900"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
                    activeTab === "content"
                      ? "border-[#2D7FF9] text-[#2D7FF9] bg-blue-50/10"
                      : "border-transparent hover:text-gray-900"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Content AI</span>
                </button>
              </div>

              {/* Dynamic Tab Workspace panels */}
              <div className="p-5 h-[320px] overflow-y-auto font-sans bg-white">
                {activeTab === "chat" && (
                  <div className="space-y-4 flex flex-col h-full justify-between">
                    <div className="space-y-3 overflow-y-auto pr-1 text-sm">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-gray-150 text-[#101828] self-end ml-auto rounded-tr-none"
                              : "bg-blue-50 text-[#011673] border border-blue-100 self-start mr-auto rounded-tl-none"
                          }`}
                        >
                          <p className="whitespace-pre-line text-xs font-normal">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                    
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask the Business Architect custom prompt..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2D7FF9]"
                      />
                      <button
                        type="submit"
                        className="bg-[#2D7FF9] hover:bg-[#011673] text-white p-2.5 rounded-xl transition-colors shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "automation" && (
                  <div className="space-y-4 text-xs h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-[#2D7FF9]/10 rounded-lg text-[#2D7FF9]">
                            <TrendingUp className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Trigger: Stripe Lead Signup</p>
                            <p className="text-gray-400 font-mono text-[9px]">Listening on port: 3000</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold font-mono text-[9px] uppercase">Active</span>
                      </div>

                      <div className="flex justify-center my-1">
                        <div className="w-0.5 h-6 bg-dashed border-l-2 border-gray-200" />
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-[#FCF50F]/25 rounded-lg text-amber-700">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Compute: Claude 3.5 Operational Audit</p>
                            <p className="text-gray-400 text-[10px]">Processing custom context profiles</p>
                          </div>
                        </div>
                        <span className="font-mono text-gray-400 text-[10px]">92ms delay</span>
                      </div>

                      <div className="flex justify-center my-1">
                        <div className="w-0.5 h-6 bg-dashed border-l-2 border-gray-200" />
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-50 rounded-lg text-emerald-600">
                            <Code className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Action: Deploy Automation Pipeline</p>
                            <p className="text-gray-400 text-[10px5]">Syncing Sheets with Gmail draft queues</p>
                          </div>
                        </div>
                        <span className="font-mono text-emerald-600 font-semibold text-[10px]">Success</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl border border-blue-50 bg-blue-50/20 text-left">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Saved Time Weekly</p>
                        <p className="text-2xl font-bold text-[#011673] font-display mt-1">22.4 hrs</p>
                        <span className="text-[9px] text-[#12B76A] font-semibold">↑ 412% Productivity Boost</span>
                      </div>
                      <div className="p-4 rounded-xl border border-yellow-50 bg-amber-50/10 text-left">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">New Revenue Engineered</p>
                        <p className="text-2xl font-bold text-[#011673] font-display mt-1">$12,410</p>
                        <span className="text-[9px] text-[#12B76A] font-semibold">↑ Average custom agency contract</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mb-2">
                        <span>AUTOMATION FLOW EFFICIENCY</span>
                        <span>98.4% uptime</span>
                      </div>
                      <div className="h-16 flex items-end justify-between gap-1.5">
                        <div className="h-[20%] w-full bg-[#011673]/20 rounded-md" />
                        <div className="h-[40%] w-full bg-[#011673]/30 rounded-md" />
                        <div className="h-[35%] w-full bg-[#2D7FF9]/45 rounded-md" />
                        <div className="h-[65%] w-full bg-[#2D7FF9]/60 rounded-md" />
                        <div className="h-[80%] w-full bg-[#011673] rounded-md" />
                        <div className="h-[95%] w-full bg-[#2D7FF9] rounded-md" />
                        <div className="h-[100%] w-full bg-[#FCF50F] rounded-md" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="space-y-3 h-full overflow-y-auto pr-1">
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/80">
                      <p className="text-xs font-mono text-gray-400 uppercase mb-1.5">Midjourney Promo Prompt Formulation:</p>
                      <p className="text-xs text-gray-700 italic border-l-2 border-[#2D7FF9] pl-2 font-display bg-white p-2 rounded-lg">
                        \"Medium shot of a confident Black young female tech CEO with elegant glasses, working on a clean laptop, bright ambient studio lighting with deep blue corporate accents, depth of field, photorealistic, premium corporate styling.\"
                      </p>
                    </div>
                    
                    {/* Simulated Output Card featuring authentic black professional representation */}
                    <div className="flex gap-3 items-center p-3 rounded-xl border border-green-50 bg-emerald-50/15">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
                        alt="High quality black woman tech worker"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-gray-800">Media Generation Suite</p>
                          <span className="text-[9px] bg-emerald-150 text-[#12B76A] font-semibold px-2 py-0.5 rounded-full">HQ Rendered</span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">Image matching branding rules. Download raw PNG for campaign.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Glass Card 1: Students success - authentic black professional photo */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute left-[-40px] md:left-[-60px] bottom-[30px] z-30 glass max-w-[210px] p-3.5 rounded-2xl shadow-premium-xl text-left hidden sm:block pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150&h=150"
                  alt="Nia Mitchell remote digital creator"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#2D7FF9]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs font-bold text-[#101828]">Nia Mitchell</p>
                  <p className="text-[10px] text-[#2D7FF9] font-semibold">Freelance Creator</p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-gray-100 flex justify-between items-center">
                <span className="font-mono text-[9px] text-gray-400">Monthly Revenue:</span>
                <span className="text-xs font-bold text-emerald-600 font-display">+$8,400</span>
              </div>
            </motion.div>

            {/* Floating Glass Card 2: Student automation - portrait of black engineer */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
              className="absolute right-[-20px] top-[40px] z-30 glass max-w-[190px] p-3.5 rounded-2xl shadow-premium-xl text-left hidden sm:block pointer-events-auto"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Active System</p>
                  <p className="text-xs font-bold text-[#101828]">ChatGPT Agent V2</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">Runs 44 tasks autonomously every single hour.</p>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
