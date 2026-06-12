/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, Cpu, Compass, CheckCircle, Users, Award, 
  MessageSquare, Play, Sparkles, Server, Zap, ChevronRight 
} from "lucide-react";

export default function SuccessSection() {
  const [activeTab, setActiveTab] = useState<"tutor" | "labs" | "review">("tutor");
  
  // States for counter simulation
  const [metrics, setMetrics] = useState({
    advancement: 0,
    response: 100,
    project: 0,
    students: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const nextAdv = prev.advancement < 90 ? prev.advancement + 3 : 90;
        const nextResp = prev.response > 24 ? prev.response - 4 : 24;
        const nextProj = prev.project < 100 ? prev.project + 4 : 100;
        const nextStud = prev.students < 12000 ? prev.students + 400 : 12000;
        
        if (nextAdv === 90 && nextResp === 24 && nextProj === 100 && nextStud === 12000) {
          clearInterval(interval);
        }
        return {
          advancement: nextAdv,
          response: nextResp,
          project: nextProj,
          students: nextStud
        };
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const benefits = [
    {
      title: "AI Tutor",
      desc: "24/7 intelligent coach provides real-time prompt edits and operational reviews.",
      icon: Bot,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "AI Practice Labs",
      desc: "Interactive sandboxes with complete code compilers and pre-configured workflow APIs.",
      icon: Cpu,
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Personalized Roadmaps",
      desc: "Customized module tracks aligned dynamically with your background trade.",
      icon: Compass,
      color: "text-amber-600 bg-amber-50"
    },
    {
      title: "Project Reviews",
      desc: "Line-by-line structural audit feedback from certified systems engineers within hours.",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Community Support",
      desc: "Lifetime membership to circles of elite developers, consultants, and founders.",
      icon: Users,
      color: "text-pink-600 bg-pink-50"
    }
  ];

  // Instructors block
  const instructors = [
    {
      name: "Dr. Sandra Cole",
      role: "Head of AI Education",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500&h=600",
      bio: "Former Principal AI Lead at Apex Systems. Over a decade engineering adaptive language nodes and automated operations pipelines.",
      expertise: "Autonomous Multi-Agent Loops, Deep RAG, System Prompt Engineering.",
      courses: "AI Business Automation, Designing Advanced AI Agents, ChatGPT Mastery.",
      tag: "CHIEF ADVISOR"
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 85;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div id="experience-section" className="relative bg-[#FAFBFC]">
      
      {/* SECTION 6: AI LEARNING EXPERIENCE */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Hand: Interactive browser lab mockup */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl -z-10" />
              
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xl overflow-hidden text-left relative">
                {/* Header bar */}
                <div className="bg-gray-50 border-b border-gray-200/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 bg-red-400 rounded-full inline-block" />
                    <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block" />
                    <span className="w-3 h-3 bg-green-400 rounded-full inline-block" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">AISTUDIO_SIMULATOR_SANDBOX</span>
                  <div className="w-6" />
                </div>

                {/* Simulated workspace navigation */}
                <div className="flex border-b border-gray-150 text-[11px] font-mono text-gray-500">
                  <button 
                    onClick={() => setActiveTab("tutor")}
                    className={`flex-1 py-2.5 text-center transition-colors font-bold cursor-pointer border-b ${activeTab === "tutor" ? "border-[#2D7FF9] text-[#2D7FF9] bg-[#2D7FF9]/5" : "border-transparent hover:text-gray-800"}`}
                  >
                    ai-tutor.py
                  </button>
                  <button 
                    onClick={() => setActiveTab("labs")}
                    className={`flex-1 py-2.5 text-center transition-colors font-bold cursor-pointer border-b ${activeTab === "labs" ? "border-[#2D7FF9] text-[#2D7FF9] bg-[#2D7FF9]/5" : "border-transparent hover:text-gray-800"}`}
                  >
                    database_api.json
                  </button>
                  <button 
                    onClick={() => setActiveTab("review")}
                    className={`flex-1 py-2.5 text-center transition-colors font-bold cursor-pointer border-b ${activeTab === "review" ? "border-[#2D7FF9] text-[#2D7FF9] bg-[#2D7FF9]/5" : "border-transparent hover:text-gray-800"}`}
                  >
                    review-critique.md
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-5 h-[280px] text-xs font-mono">
                  {activeTab === "tutor" && (
                    <div className="space-y-4 flex flex-col justify-between h-full">
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        <p className="text-[#2D7FF9] font-bold">// INITIATING 24/7 AI COACH SYSTEM</p>
                        <p className="text-gray-550 leading-relaxed">[PROMPT] Analyze the system latency of this multi-agent trigger loop:</p>
                        <p className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 font-sans leading-relaxed">
                          "Excellent setup. To subtract 200ms latency, shift the agent schema to stream outputs directly using standard WebSockets."
                        </p>
                      </div>
                      <div className="flex gap-2 p-1 border border-gray-200 rounded-lg">
                        <span className="text-gray-400 px-1 py-1">➔</span>
                        <input type="text" readOnly placeholder="Enter response edit..." className="bg-transparent border-0 flex-1 outline-none text-[11px] text-gray-700" />
                      </div>
                    </div>
                  )}

                  {activeTab === "labs" && (
                    <div className="space-y-3 h-full flex flex-col justify-between text-left">
                      <div className="bg-gray-50 p-3 rounded-lg text-gray-600 space-y-1 overflow-x-auto leading-normal">
                        <p className="text-purple-600 font-bold">"make_workflow_webhook": {"{"}</p>
                        <p className="pl-4">"trigger": "stripe_invoice_payment_succeeded",</p>
                        <p className="pl-4">"action": "openai_agent_lead_audit",</p>
                        <p className="pl-4 text-emerald-600">"status": "active_24_7_verification"</p>
                        <p className="text-purple-600 font-bold">{"}"}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-[10px] text-emerald-800 font-bold flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Integration active. Executing test event... Successful!</span>
                      </div>
                    </div>
                  )}

                  {activeTab === "review" && (
                    <div className="space-y-3 text-left">
                      <p className="text-pink-600 font-bold"># REVIEWER VERIFICATION LOG</p>
                      <p className="text-gray-500 font-sans leading-relaxed">
                        "Your Make.com JSON schema handles standard API exceptions cleanly. We have verified your playground parameters and authorized your graduation credits."
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold">
                        <span>✔ ACENET-VERIFIED</span>
                        <span>|</span>
                        <span>GRADE: PASS EXCELLENT</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Hand: Benefits Lists */}
            <div className="lg:col-span-6 text-left space-y-8 z-10">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>INTELLIGENT LMS LEARNING ENGINE</span>
                </span>
                {/* Heading under 10 words limit */}
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
                  Experience a Modern SaaS Learning Ecosystem
                </h2>
              </div>

              {/* Dynamic Benefits Grid Stack */}
              <div className="space-y-4">
                {benefits.map((bf, idx) => {
                  const Icon = bf.icon;
                  return (
                    <div 
                      key={idx}
                      className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-white border border-transparent hover:border-gray-150 hover:shadow-sm transition-all duration-200"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bf.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-[#08142B] leading-snug">
                          {bf.title}
                        </h4>
                        {/* Description under 20 words limit */}
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5 max-w-sm">
                          {bf.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: SUCCESS METRICS (DARK Premium Section) */}
      <section id="metrics" className="py-20 bg-[#08142B] text-white relative overflow-hidden">
        {/* Soft layout visual graphic dots / blur */}
        <div className="absolute top-[20%] right-[-100px] w-[450px] h-[450px] bg-[#2D7FF9]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1 bg-[#2D7FF9]/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider">
              QUANTIFIABLE COHORT METRICS
            </div>
            {/* Heading under 10 words limit */}
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Real Predictable Business Outcomes Built For Authority
            </h2>
          </div>

          {/* 4 Counter Statistics elements mapped natively as requested */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 text-center">
            
            {/* Stat 1: 90% */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#FCF50F] tracking-tight">
                {metrics.advancement}%
              </p>
              <h4 className="font-display font-medium text-sm text-white mt-3 mb-1">
                Career Advancement
              </h4>
              <p className="text-[11px] text-slate-400">Verified LinkedIn alumni data.</p>
            </div>

            {/* Stat 2: 24 Hours */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#2D7FF9] tracking-tight">
                {metrics.response}h
              </p>
              <h4 className="font-display font-medium text-sm text-white mt-3 mb-1">
                Average Response Time
              </h4>
              <p className="text-[11px] text-slate-400">Line-by-line code feedback logs.</p>
            </div>

            {/* Stat 3: 100% */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#FCF50F] tracking-tight">
                {metrics.project}%
              </p>
              <h4 className="font-display font-medium text-sm text-white mt-3 mb-1">
                Project-Based Learning
              </h4>
              <p className="text-[11px] text-slate-400">Direct active sandbox exercises.</p>
            </div>

            {/* Stat 4: 12,000+ */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <p className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {metrics.students.toLocaleString()}+
              </p>
              <h4 className="font-display font-medium text-sm text-white mt-3 mb-1">
                Students Trained
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">Global executive alumni pool.</p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 9: INSTRUCTORS */}
      <section id="instructors" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-[#2D7FF9] inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 bg-gradient-to-r rounded-full text-xs font-semibold uppercase font-mono tracking-wider">
              <span>ACADEMIC FOUNDING DIRECTORS</span>
            </div>
            {/* Heading under 10 words limit */}
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
              Meet the Visionary Instructors Leading Your Training
            </h2>
          </div>

          {/* Instructor Showcase */}
          <div className="max-w-3xl mx-auto">
            {instructors.map((ins, idx) => {
              return (
                <div 
                  key={idx}
                  className="group bg-white border border-gray-150/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 grid grid-cols-1 md:grid-cols-12 relative"
                >
                  {/* Left picture section: Large Portrait */}
                  <div className="md:col-span-5 h-[340px] md:h-full min-h-[380px] bg-gray-100 relative overflow-hidden">
                    <img 
                      src={ins.avatar} 
                      alt={ins.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-[#08142B] text-white text-[10px] font-mono tracking-wider font-bold px-3 py-1 rounded-full uppercase shadow">
                      {ins.tag}
                    </div>
                  </div>

                  {/* Right credentials content */}
                  <div className="md:col-span-7 p-6 sm:p-8 text-left space-y-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-black text-[#08142B]">{ins.name}</h3>
                      <p className="text-sm font-bold text-[#2D7FF9] uppercase font-mono tracking-wider">{ins.role}</p>
                      
                      {/* Bio under 3 lines layout */}
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
                        {ins.bio}
                      </p>
                    </div>

                    {/* Hover Reveal Block Information */}
                    <div className="space-y-3.5 pt-4 border-t border-gray-100">
                      <div>
                        <h4 className="text-[10px] font-mono font-bold tracking-wider text-[#2D7FF9] uppercase">ACADEMIC EXPERTISE</h4>
                        <p className="text-xs text-gray-800 font-semibold mt-0.5">{ins.expertise}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-mono font-bold tracking-wider text-[#2D7FF9] uppercase">ACTIVE LESSON MODULES</h4>
                        <p className="text-xs text-gray-800 font-medium mt-0.5 italic">{ins.courses}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => scrollToSection("pricing")}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D7FF9] hover:text-[#08142B] transition-colors"
                      >
                        <span>Schedule Cohort Consultation</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
