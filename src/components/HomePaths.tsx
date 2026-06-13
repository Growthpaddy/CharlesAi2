import React, { useState } from "react";
import { 
  ArrowRight, Compass, Sparkles, Send, Briefcase, 
  CheckCircle2, Flame, Bot, BookOpen, Layers, Terminal 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigation } from "../context/NavigationContext";

export default function HomePaths() {
  const { navigateTo } = useNavigation();
  const [activeHoverId, setActiveHoverId] = useState<number | null>(null);

  const paths = [
    {
      id: 0,
      title: "AI Media & Content Creator",
      desc: "Assemble programmatic storytelling engines. Automate cinematic audio/video generation, synthetic avatars, content localization, and rapid copywriting grids.",
      level: "Core Master class",
      duration: "6 WEEKS COHORT",
      programs: "2 Elite Pipelines",
      icon: Sparkles,
      accentColor: "from-blue-500 to-cyan-500 shadow-blue-500/10 hover:shadow-blue-500/15",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
      tools: ["Midjourney v6", "ElevenLabs", "Sora / Runway", "Claude 3.5"],
      metrics: "Average 85% reduction in asset development schedules"
    },
    {
      id: 1,
      title: "AI Growth Engineer & Marketer",
      desc: "Deploy automated scraping networks, synthetic brand clones, SEO topical clusters, and lead recommendation databases using autonomous multi-agent pipelines.",
      level: "Intermediate Core",
      duration: "6 WEEKS COHORT",
      programs: "3 Specialized Bots",
      icon: Send,
      accentColor: "from-[#7a5df5] to-[#da70d6] shadow-purple-500/10 hover:shadow-purple-500/15",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
      tools: ["Perplexity API", "Make.com", "Clay.com", "GPT-3.5/4o"],
      metrics: "Average 4.8x outbound response scaling within 45 days"
    },
    {
      id: 2,
      title: "Applied AI Automation Architect",
      desc: "Scale highly-profitable multi-agent consulting frameworks, customized prompt engines, SaaS prototype wrappers, and private business integrations.",
      level: "Advanced Elite",
      duration: "8 WEEKS COHORT",
      programs: "4 Live Prototypes",
      icon: Briefcase,
      accentColor: "from-amber-500 to-orange-600 shadow-amber-500/10 hover:shadow-amber-500/15",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
      tools: ["LangChain", "Gemini Pro SDK", "Docker Systems", "Advanced APIs"],
      metrics: "Empowers solo engineers to direct standard 5-agent swarms"
    },
  ];

  return (
    <section id="home-learning-paths" className="py-24 bg-[#FAFBFC] border-b border-gray-150 relative overflow-hidden">
      {/* Decorative premium glowing radial spheres */}
      <div className="absolute top-[10%] left-[-20%] w-[60%] h-[60%] bg-[#0056D2]/2 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-20%] w-[60%] h-[60%] bg-amber-500/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating abstract code nodes */}
      <div className="absolute top-20 left-[2%] opacity-15 pointer-events-none">
        <div className="font-mono text-[10px] text-gray-400 bg-slate-100 p-2.5 rounded-lg border border-gray-200">
          <Terminal className="w-3.5 h-3.5 mb-1 text-blue-500" />
          <span>$ init agent_mesh_sys</span>
        </div>
      </div>
      <div className="absolute bottom-20 right-[2%] opacity-15 pointer-events-none">
        <div className="font-mono text-[10px] text-gray-400 bg-slate-100 p-2.5 rounded-lg border border-gray-200">
          <Layers className="w-3.5 h-3.5 mb-1 text-purple-500" />
          <span>Active Nodes: 7/7 online</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block with high performance details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-4 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-widest border border-blue-100">
              <Compass className="w-3.5 h-3.5" />
              <span>DEDICATED MASTERY TRACKS</span>
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#0B1B3D]">
              Custom Careers Engineered with Precision
            </h2>
            <p className="text-gray-500 font-secondary text-sm sm:text-base leading-relaxed">
              Skip generalist courses. Select an elite track engineered precisely for your active visual, mechanical, or operational scaling objectives.
            </p>
          </div>

          <button
            onClick={() => navigateTo("paths")}
            className="group flex items-center gap-3 text-xs font-sans font-bold text-[#0056D2] hover:text-[#003E9C] transition-colors uppercase tracking-widest shrink-0 self-start md:self-auto"
          >
            <span>Compare Curriculums</span>
            <div className="w-10 h-10 rounded-full border border-blue-100 flex items-center justify-center bg-white shadow-sm group-hover:bg-[#0056D2] group-hover:text-white transition-all transform group-hover:scale-105">
              <ArrowRight className="w-4.5 h-4.5" />
            </div>
          </button>
        </div>

        {/* 3 Premium Interactive Cards Grid with custom hover states */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {paths.map((p) => {
            const Icon = p.icon;
            const isHovered = activeHoverId === p.id;

            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setActiveHoverId(p.id)}
                onMouseLeave={() => setActiveHoverId(null)}
                animate={{
                  y: [0, -6, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.id * 0.6
                }}
                whileHover={{
                  y: -14,
                  scale: 1.025,
                  transition: { type: "spring", stiffness: 450, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo("paths")}
                className={`group relative bg-white border rounded-3xl p-8 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between h-full border-gray-150 shadow-sm ${
                  isHovered 
                    ? `border-blue-200 shadow-xl ring-1 ring-blue-500/10` 
                    : ``
                }`}
              >
                {/* Micro Ambient Glow behind current card */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-tr ${p.accentColor} opacity-0 transition-opacity duration-300 pointer-events-none ${
                  isHovered ? "opacity-5" : ""
                }`} />

                {/* Accent strip bar on active card */}
                <div className={`absolute top-0 left-8 right-8 h-[3px] rounded-b-full bg-gradient-to-r ${p.accentColor} opacity-80`} />

                <div className="space-y-6 relative z-10">
                  {/* Card Icon & Header Tags */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon className="w-6 h-6 text-[#0056D2]" />
                    </div>
                    {/* Circle indicators resembling dashboard controls */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider">ONLINE_DEPLOY</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="font-sans font-black text-xl text-[#0B1B3D] group-hover:text-[#0056D2] transition-colors flex items-center justify-between">
                      <span>{p.title}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </h3>
                    <p className="text-xs text-gray-500 font-secondary leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  {/* Mastered Technologies listed as beautiful micro tags */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-sans font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#0056D2]" />
                      <span>Syllabus Tool Stack</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tools.map((tool, tIdx) => (
                        <span 
                          key={tIdx}
                          className="bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conversion Focused Metrics / Badges row */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-4 relative z-10">
                  {/* Real-world performance impact metric banner */}
                  <div className="bg-slate-50/85 border border-slate-100/90 rounded-2xl p-3.5 text-[11px] font-secondary text-gray-600 flex items-start gap-2 leading-relaxed">
                    <Flame className="w-4 h-4 text-[#0056D2] shrink-0 mt-0.5 fill-[#0056D2]/15" />
                    <p>
                      <strong className="text-gray-900 font-sans">Business Impact:</strong> {p.metrics}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-slate-200">
                      {p.level}
                    </span>
                    <span className="bg-blue-50 text-[#0056D2] text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-blue-100">
                      {p.duration}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-emerald-100 ml-auto">
                      {p.programs}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Visual timeline carousel progress indicators to showcase world-class UX */}
        <div className="flex justify-center items-center gap-2 pt-12">
          {paths.map((p) => (
            <button
              key={p.id}
              onClick={() => navigateTo("paths")}
              className={`transition-all duration-300 rounded-full h-2 ${
                activeHoverId === p.id ? "w-6 bg-[#0056D2]" : "w-2 bg-gray-200"
              }`}
              aria-label={`Go to path ${p.title}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
