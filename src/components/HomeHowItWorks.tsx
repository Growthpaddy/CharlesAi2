import React, { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Play, Terminal, Target, Bot, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigation } from "../context/NavigationContext";

export default function HomeHowItWorks() {
  const { navigateTo } = useNavigation();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Evaluate Ambition & Track",
      subtitle: "PRE-COHORT PLANNING",
      desc: "Begin with a customized diagnostic skills evaluation. Tailor your learning journey by declaring your active marketing, creative, or operational objectives.",
      badge: "ALIGNED MATCH",
      toolStack: ["Cohort Advisor Chat", "Diagnostic Quiz"],
      actionLabel: "Find Your Path",
      illustration: (
        <div className="space-y-2 font-mono text-[10px] text-zinc-400 bg-slate-950 p-4 rounded-xl border border-white/5">
          <p className="text-blue-400"># Diagnostic Evaluation</p>
          <p>&gt; sys.evaluate_user_focus()</p>
          <p className="text-emerald-400">Analyzing: MARKETER / AUTOMATOR</p>
          <p className="text-yellow-400">Match found: Track B (Growth Agent Swarms)</p>
        </div>
      )
    },
    {
      step: 2,
      title: "Master Technical Blueprints",
      subtitle: "BITE-SIZED MICRO-TUTORIALS",
      desc: "Access our high-density LMS containing tested API recipes, schema parameters, and prompt chains. No fluff. Study exact systems used by the industry's top 1%.",
      badge: "LATEST APIS",
      toolStack: ["GPT-4o", "Claude 3.5 Sonnet", "Perplexity"],
      actionLabel: "Browse Curriculum",
      illustration: (
        <div className="space-y-1.5 font-mono text-[10px] text-zinc-400 bg-slate-950 p-4 rounded-xl border border-white/5 text-left">
          <p className="text-pink-400"># Prompt Schema Recipe</p>
          <p className="text-slate-300">{"{"}</p>
          <p className="pl-4">system_directive: "Enforce JSON format...",</p>
          <p className="pl-4">temperature: 0.15,</p>
          <p className="pl-4">validation_structure: XML_tagging</p>
          <p className="text-slate-300">{"}"}</p>
        </div>
      )
    },
    {
      step: 3,
      title: "Deploy Inside Sandbox Playgrounds",
      subtitle: "ZERO LOCAL INSTALLATION",
      desc: "Solve high-fidelity coding assignments right inside our web browser consoles. Run micro-triggers, watch logs update, and connect test API keys to ensure your builds run successfully.",
      badge: "100% HANDS-ON",
      toolStack: ["Inline Emulator", "Make.com Webhooks"],
      actionLabel: "Try Interactive Demo",
      illustration: (
        <div className="space-y-1 font-mono text-[10px] text-slate-300 bg-slate-950 p-4 rounded-xl border border-white/5 text-left">
          <div className="flex justify-between text-[8px] text-zinc-500 border-b border-white/5 pb-1 mb-1">
            <span>CONSOLE EMULATOR</span>
            <span className="text-emerald-500">READY</span>
          </div>
          <p>&gt; node automation_runner.js</p>
          <p className="text-emerald-400">[CONNECTED] Webhook triggered successfully.</p>
          <p className="text-yellow-400">[IN PROGRESS] Generating synthesized copy...</p>
        </div>
      )
    },
    {
      step: 4,
      title: "Earn Cryptographic Certification",
      subtitle: "VERIFIABLE INDUSTRY AUDIT",
      desc: "Complete your final project audit reviewed by technical lead advisors. Receive a fully accredited, LinkedIn-verifiable micro-credential with cryptographic signatures.",
      badge: "PORTFOLIO READY",
      toolStack: ["W3C Credential", "Skills Log Sheet"],
      actionLabel: "Verify Sample Certificate",
      illustration: (
        <div className="bg-gradient-to-br from-[#0c1d3c] to-[#08142B] p-4 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center h-24">
          <CheckCircle2 className="w-8 h-8 text-[#FCF50F] mb-1" />
          <h4 className="text-[10px] font-sans font-black text-white leading-tight">ACCREDITED AI ARCHITECT</h4>
          <span className="text-[8px] font-mono text-zinc-500 mt-0.5">SHA256: e87f65a12b...</span>
        </div>
      )
    },
    {
      step: 5,
      title: "Unlock Elite Consulting Work",
      subtitle: "CAREER PLACEMENT",
      desc: "Promote your existing corporate scope or activate high-ticket AI automation agency contracts. Access our private job boards and templates for business development.",
      badge: "CONVERSIONS FOCUS",
      toolStack: ["Private Job Board", "SOP Toolkits"],
      actionLabel: "Check Graduate Earnings",
      illustration: (
        <div className="space-y-2 font-mono text-[10px] text-zinc-400 bg-slate-950 p-4 rounded-xl border border-white/5">
          <p className="text-emerald-400"># Direct Placement Pipeline</p>
          <p>&gt; client_outreach.init_sequence()</p>
          <p className="text-white">Active Contracts: 3 New Listings Today</p>
          <p className="text-blue-400">Average Rate: $125 - $250 / Hr</p>
        </div>
      )
    }
  ];

  const currentStepData = steps.find((s) => s.step === activeStep) || steps[1];

  return (
    <section id="how-it-works" className="py-24 bg-[#FAFBFC] border-b border-gray-150 overflow-hidden relative">
      
      {/* Background soft styling details */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-100/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating stack symbols styling */}
      <div className="absolute top-[10%] left-[5%] opacity-15 pointer-events-none animate-pulse">
        <Target className="w-8 h-8 text-[#2D7FF9]" />
      </div>
      <div className="absolute bottom-[10%] right-[5%] opacity-15 pointer-events-none animate-pulse" style={{ animationDelay: "2s" }}>
        <Zap className="w-8 h-8 text-[#FCF50F]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-1.5 bg-[#08142B]/5 text-[#08142B] px-3.5 py-1.5 rounded-full text-[11px] font-sans font-extrabold uppercase tracking-widest border border-gray-200">
            <span>⚙ COHORT SEQUENCE METHODOLOGY</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#08142B]">
            From Novice to Certified Lead Architect
          </h2>
          <p className="text-gray-500 font-secondary text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Our high-precision, 5-stage structural methodology ensures you master every practical API mechanism with direct feedback at every stage.
          </p>
        </div>

        {/* Interactive Steps Visual Map (High Fidelity Horizontal Timeline) */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Timeline background connectors */}
          <div className="absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gray-200 hidden md:block -z-10" />
          
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((s) => {
              const isSelected = s.step === activeStep;

              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  onMouseEnter={() => setActiveStep(s.step)}
                  className="group flex flex-col items-center gap-3 focus:outline-none cursor-pointer"
                >
                  {/* Rounded Step Bubble */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-sans font-black text-lg transition-all duration-300 border-2 relative ${
                    isSelected
                      ? "bg-white border-[#2D7FF9] text-[#2D7FF9] shadow-lg scale-110"
                      : "bg-white border-gray-150 text-gray-400 group-hover:border-gray-300"
                  }`}>
                    {s.step}
                    
                    {/* Ring animation */}
                    {isSelected && (
                      <span className="absolute -inset-1.5 border border-[#2D7FF9]/30 rounded-full animate-ping pointer-events-none" />
                    )}
                  </div>

                  {/* Tiny Label Text */}
                  <span className={`text-[10px] font-sans font-black uppercase tracking-wider text-center transition-colors hidden sm:block ${
                    isSelected ? "text-[#2D7FF9]" : "text-gray-450 group-hover:text-gray-600"
                  }`}>
                    Step {s.step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento Panel Displaying Selected Step Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-gray-200/90 rounded-3xl shadow-premium p-6 sm:p-10 text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              
              {/* Left Column Content (md:col-span-7) */}
              <div className="md:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-sans font-black tracking-widest uppercase bg-blue-50 text-[#2D7FF9]">
                    {currentStepData.subtitle}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 tracking-wider">STAGE_SEC_0{currentStepData.step}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans font-black text-2xl text-[#08142B]">
                    {currentStepData.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-secondary leading-relaxed">
                    {currentStepData.desc}
                  </p>
                </div>

                {/* Built modules */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-sans font-black uppercase text-gray-400">PRACTICAL TECH DELIVERED</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentStepData.toolStack.map((tool, i) => (
                      <span key={i} className="bg-slate-50 border border-slate-150 text-slate-700 font-mono text-[10px] px-2.5 py-1 rounded-md">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Layout Showcase / Graphic (md:col-span-5) */}
              <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
                {currentStepData.illustration}

                <button
                  onClick={() => navigateTo("paths")}
                  className="w-full py-3.5 px-5 bg-[#2D7FF9] hover:bg-blue-700 text-white font-sans font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform transform active:scale-95 cursor-pointer hover:shadow-lg"
                >
                  <span>{currentStepData.actionLabel}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
