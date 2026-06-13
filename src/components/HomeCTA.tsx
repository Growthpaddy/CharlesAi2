import React from "react";
import { Check, MessageSquare, ArrowRight, Sparkles, Star } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

export default function HomeCTA() {
  const { navigateTo } = useNavigation();

  const values = [
    "Instant 24/7 LMS Playground sandbox access",
    "Lifetime library updates as neural models evolve",
    "Direct milestone prompt review by Dr. Sandra Cole",
    "Verifiable and accredited block certification"
  ];

  return (
    <section id="onboarding-cta" className="py-24 bg-[#08142B] border-t border-white/[0.04] text-white relative overflow-hidden text-left">
      {/* Background vector decorations */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#2D7FF9]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FCF50F]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: major pitch & checks */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#FCF50F]/15 px-3 py-1.5 rounded-full border border-[#FCF50F]/20 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FCF50F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FCF50F]"></span>
              </span>
              <span className="text-[10px] font-black font-mono tracking-widest text-[#FCF50F] uppercase">
                COHORT LIMITS ACTIVE — 14 SEATS REMAINING
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Secure your place in our next cohort.
            </h2>

            <p className="text-sm sm:text-base text-slate-350 leading-relaxed max-w-xl font-medium">
              Join elite practitioners already automating workflows, delivering extreme business efficiency, and launching accredited consulting pipelines globally.
            </p>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-slate-200 font-bold leading-normal">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: CTA card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-slate-900 border border-gray-150 shadow-2xl space-y-6">
              <div className="text-center">
                <p className="text-[10px] font-mono tracking-widest text-gray-400 font-black uppercase">Cohort Enrollment Tier</p>
                <p className="text-2xl font-display font-black text-[#08142B] mt-1">Starting $49/mo</p>
                <div className="flex items-center justify-center gap-1.5 text-amber-500 text-xs mt-2 font-black font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Verified 100% Secure Checkout</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-3">
                <button
                  onClick={() => {
                    const el = document.getElementById("pricing");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-4 bg-[#2D7FF9] hover:bg-[#2D7FF9]/90 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Secure Cohort Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-[#08142B] border border-gray-100 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500/15" />
                  <span>Ask Advisor on WhatsApp</span>
                </a>
              </div>

              <p className="text-[10.5px] text-gray-400 text-center leading-normal font-semibold">
                Cohort enrollment remains active for exactly 12 more hours. Your credentials will sync dynamically straight after onboarding clearance.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
