/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, Award, CheckCircle2, Star } from "lucide-react";
import { motion } from "motion/react";

export default function HomeInstructor() {
  const highlights = [
    {
      title: "Ex-Google ML Lead",
      desc: "Directed deep neural model applications and customized LLMs with 10+ years of Silicon Valley engineering background."
    },
    {
      title: "Tactical Advisory Record",
      desc: "Designed and deployed operational AI automation strategies within fast-growing enterprises across 40+ countries."
    },
    {
      title: "Direct Sandbox Portfolios Audit",
      desc: "Personally examines and audits prompt guidelines, API wrappers, and custom webhook models of our cohort enrollees."
    }
  ];

  return (
    <section id="instructor-showcase" className="py-24 bg-white border-b border-gray-150 relative overflow-hidden">
      {/* Decorative ambient blurred nodes */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 w-[40%] h-[40%] bg-[#0056D2]/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating badges in the background representing team technologies */}
      <div className="absolute top-[15%] left-[8%] opacity-20 pointer-events-none animate-bounce" style={{ animationDuration: "5s" }}>
        <div className="bg-slate-50 border border-slate-150 px-2 py-1 rounded text-[9px] font-mono font-bold tracking-wider text-slate-500">
          COHORT_COACH_SYS
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Stylized round portrait image box with hover zoom */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              {/* Outer decorative accents */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#0056D2]/15 to-amber-500/15 rounded-full blur-3xl opacity-75 pointer-events-none" />
              
              <motion.div 
                whileHover={{ scale: 1.03, rotate: 1 }}
                className="w-72 h-72 sm:w-85 sm:h-85 rounded-full border border-gray-200/90 p-3 bg-white relative z-10 shadow-premium"
              >
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600"
                    alt="Sandra Cole"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle visual scanlines overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011638]/40 to-transparent pointer-events-none" />
                </div>
                
                {/* Float badges representing real metrics */}
                <div className="absolute bottom-6 right-2 sm:right-6 bg-slate-900 text-white py-2.5 px-4 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-xl border border-white/10 flex items-center gap-1.5 z-25">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>5.0 ALUMNI RATING &bull; Sandra Cole</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Copy containing checks */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-4 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-widest border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DISTINGUISHED ADVISORY</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#0B1B3D]">
                Study Under Elite AI Practitioners
              </h2>
              <div>
                <h3 className="text-2xl font-sans font-bold text-[#0056D2] flex items-center gap-2">
                  <span>Sandra Cole</span>
                  <span className="text-xs font-mono font-bold text-gray-450 bg-gray-50 border border-gray-150 px-2.5 py-1 rounded uppercase">CO-FOUNDER & COACH</span>
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono mt-1">EX-GOOGLE MACHINE LEARNING TEAM LEAD</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-secondary">
              Sandra Cole and our technical coach guild skip abstract academic theories. We train you directly on the core automation algorithms, live schemas, and private prompt techniques required to run successful, scalable agent networks.
            </p>

            {/* Custom high fidelity hoverable highlights cards */}
            <div className="space-y-4 pt-2">
              {highlights.map((h, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 border border-gray-150 rounded-2xl p-4 flex items-start gap-3.5 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0056D2] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0056D2]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-[#0B1B3D] flex items-center gap-1.5">
                      {h.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-secondary leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Light gray bottom certificate check label */}
            <div className="p-4 bg-yellow-50/50 border border-yellow-200/50 rounded-2xl flex items-center gap-3 max-w-xl shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-yellow-101 text-amber-700 flex items-center justify-center shrink-0 bg-amber-50">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-[11px] text-zinc-600 font-secondary leading-relaxed">
                <strong className="text-zinc-900 font-sans">Active Manual Submissions Auditing:</strong> No boilerplate bot graders here. Our human advisors manually inspect your prompt scenarios, YAML configurations, and code files.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
