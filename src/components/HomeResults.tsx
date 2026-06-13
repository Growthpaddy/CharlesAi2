import React from "react";
import { Sparkles } from "lucide-react";

export default function HomeResults() {
  const metrics = [
    {
      value: "90%",
      label: "Average Salary Increase",
    },
    {
      value: "24",
      label: "Support Team Members",
    },
    {
      value: "100+",
      label: "Active Workgroup Hubs",
    },
    {
      value: "12,000+",
      label: "Certified Alumni",
    },
  ];

  return (
    <section id="proven-results" className="py-16 bg-slate-950 border-y border-white/[0.04] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0056D2]/10 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Core Statistic Numbers Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center text-white">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-display font-black text-4xl sm:text-5xl lg:text-5xl text-white tracking-tight">
                {m.value}
              </h3>
              <p className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Subtitle statement */}
        <div className="mt-12 pt-8 border-t border-white/[0.05] max-w-4xl mx-auto">
          <p className="text-sm text-slate-300 leading-relaxed font-semibold max-w-2xl mx-auto">
            "94% of graduates reported immediate performance increases or streamlined job promotions within 30 days of cohort completion."
          </p>
        </div>

      </div>
    </section>
  );
}
