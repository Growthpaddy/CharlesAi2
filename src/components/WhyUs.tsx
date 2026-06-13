import React from "react";
import { motion } from "motion/react";
import { 
  Zap, Users, Cpu, Award, ArrowUpRight, 
  Sparkles, Terminal, CheckCircle2 
} from "lucide-react";

export default function WhyUs() {
  const features = [
    {
      title: "10X Skill Velocity",
      badge: "ELITE SPEED",
      desc: "Master high-fidelity custom agent frameworks and cognitive loops in hours, not semesters. Save months of trial and error.",
      bullets: ["Pre-built API scaffolding", "Optimized template blueprints", "Immediate copy-paste scripts"],
      icon: Zap,
      accent: "from-amber-400 to-[#FCF50F]",
      outlineGlow: "group-hover:border-amber-400/40 group-hover:shadow-[0_0_30px_rgba(252,245,15,0.12)]",
      iconClass: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Elite Mentor Network",
      badge: "LEAD ARCHITECTS",
      desc: "Direct guidance from lead ML researchers, former Silicon Valley engineers, and certified workflow automation geniuses.",
      bullets: ["Charles Tuti & Ex-Google Leads", "Weekly Live Code Reviews", "Private Discord Support Channels"],
      icon: Users,
      accent: "from-blue-600 to-indigo-700",
      outlineGlow: "group-hover:border-blue-400/40 group-hover:shadow-[0_0_30px_rgba(0,86,210,0.12)]",
      iconClass: "bg-blue-500/10 text-[#0056D2]",
    },
    {
      title: "Live Production Sandboxes",
      badge: "HANDS-ON FIRST",
      desc: "Deploy twelve autonomous pipelines directly within our live emulator systems without installing complex local Python code.",
      bullets: ["Inline terminal outputs", "Interactive prompt validators", "Real-time trigger webhooks"],
      icon: Cpu,
      accent: "from-emerald-400 to-teal-500",
      outlineGlow: "group-hover:border-emerald-400/40 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]",
      iconClass: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Recognized Credentials",
      badge: "GOLD STANDARD",
      desc: "Gain industry-accredited, cryptographic, verifiable micro-degrees ready to mount on LinkedIn and employer portfolios.",
      bullets: ["W3C compliant signatures", "Widespread corporate alignment", "Verified skills audit logs"],
      icon: Award,
      accent: "from-purple-500 to-pink-500",
      outlineGlow: "group-hover:border-purple-400/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]",
      iconClass: "bg-purple-500/10 text-purple-600",
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-white border-y border-gray-150 relative overflow-hidden">
      
      {/* Decorative ambient background blur nodes */}
      <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-amber-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[10%] w-80 h-80 bg-[#0056D2]/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Mini Web Stacks floating in background */}
      <div className="absolute top-10 right-[15%] opacity-20 pointer-events-none animate-bounce" style={{ animationDuration: "6s" }}>
        <div className="flex items-center gap-1 bg-[#10a37f]/5 px-2.5 py-1 rounded-lg border border-[#10a37f]/10 text-[#10a37f]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10a37f]" />
          <span className="text-[9px] font-mono font-bold tracking-wider">GPT-4o API</span>
        </div>
      </div>
      <div className="absolute bottom-12 left-[12%] opacity-20 pointer-events-none animate-bounce" style={{ animationDuration: "8s" }}>
        <div className="flex items-center gap-1 bg-[#da7756]/5 px-2.5 py-1 rounded-lg border border-[#da7756]/10 text-[#da7756]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#da7756]" />
          <span className="text-[9px] font-mono font-bold tracking-wider">CLAUDE-3.5 API</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* WhyUs Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0056D2] px-4 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-widest border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCELERATED OUTCOMES</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#0B1B3D]">
            Why the World’s Leading AI Practitioners Train Here
          </h2>
          <p className="text-gray-500 font-secondary text-sm sm:text-base leading-relaxed">
            By avoiding abstract computer science theory and focusing entirely on production-grade agent implementation, we build operational software leaders.
          </p>
        </div>

        {/* Remade Cards Layout (Multi-tiered interactive design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                animate={{
                  y: [0, -6, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
                whileHover={{
                  y: -12,
                  scale: 1.025,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
                className={`group relative bg-white border border-gray-150 ${item.outlineGlow} rounded-3xl p-6 transition-all duration-300 text-left flex flex-col justify-between h-full hover:shadow-premium cursor-pointer`}
              >
                {/* Gradient Accent Bar along card top boundary */}
                <div className={`absolute top-0 left-6 right-6 h-[2.5px] rounded-b-full bg-gradient-to-r ${item.accent} opacity-80`} />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    {/* Circle Icon Badge */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${item.iconClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Tiny Custom Tag badge */}
                    <span className="text-[9px] font-mono font-black tracking-wider text-gray-400 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md uppercase">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-sans font-black text-base sm:text-lg text-[#0B1B3D] group-hover:text-[#0056D2] transition-colors flex items-center justify-between">
                      <span>{item.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#0056D2] transition-all" />
                    </h3>
                    <p className="text-xs text-gray-500 font-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Bullets mapping internally */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
                  <p className="text-[9px] font-sans font-black uppercase text-gray-400">Core Deliverables</p>
                  <ul className="space-y-1.5">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-1.5 text-[10px] text-gray-600 font-secondary leading-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
