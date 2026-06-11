/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { learningPaths, curriculumModules } from "../data";
import { 
  Briefcase, Cpu, Sparkles, GitBranch, Megaphone, 
  TrendingUp, DollarSign, Zap, Bot, Layers, 
  ChevronDown, ChevronUp, Clock, BookOpen, Key, CheckCircle, Smartphone 
} from "lucide-react";

// Helper map to dynamically assign Lucide components based on data string representations
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Cpu,
  Sparkles,
  GitBranch,
  Megaphone,
  TrendingUp,
  DollarSign,
  Zap,
  Bot,
  Layers
};

export default function Curriculum() {
  const [expandedModule, setExpandedModule] = useState<string | null>("m-1");

  const toggleModule = (id: string) => {
    if (expandedModule === id) {
      setExpandedModule(null);
    } else {
      setExpandedModule(id);
    }
  };

  return (
    <section id="learning-paths" className="py-20 md:py-28 bg-[#FAFBFC]">
      {/* SECTION 4: Learning Paths */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left md:text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-[#011673] px-3.5 py-1 rounded-full text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-[#2D7FF9]" />
            <span>DISCOVER YOUR CONCENTRATION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
            Explore Our 10 Specialized Learning Paths
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Tailor-made sequences structured by application. Dive deep into your specific trade, freelance niche, or operational workspace.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-12">
          {learningPaths.map((path) => {
            const IconComp = iconMap[path.icon] || Cpu;
            return (
              <div
                key={path.id}
                className="group relative bg-white border border-gray-150 hover:border-gray-300 rounded-2xl p-5 transition-all duration-300 hover:shadow-premium hover:-translate-y-1 text-left flex flex-col justify-between"
              >
                <div>
                  {/* Icon wrapper */}
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#2D7FF9] group-hover:bg-[#011673] group-hover:text-white transition-colors duration-300">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="mt-4 space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-[#2D7FF9] uppercase">
                      {path.tag}
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#101828] group-hover:text-[#011673] transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 line-clamp-3 leading-relaxed mt-1">
                      {path.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {path.lessons} Lessons
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="truncate max-w-[100px] text-gray-400 font-mono">
                    {path.tools[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 8: Curriculum Showcase */}
      <div id="curriculum" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Dynamic Sticky Info Block */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 text-left">
            <span className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>12 WEEKS TO COMPLETION</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
              The Most Rigorous Applied AI Syllabus Ever Designed
            </h2>
            <p className="text-base text-gray-500 leading-relaxed font-normal">
              Go from installing core models to configuring multiple localized background agents that collaborate on research, copy formulation, and lead databases. 
            </p>
            <div className="p-5 rounded-2xl bg-[#011673]/5 border border-[#011673]/10 space-y-4">
              <h4 className="font-bold text-[#011673] text-sm">Graduation Requirements:</h4>
              <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
                <li className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5" />
                  <span>Execute 12 complete portfolio project challenges</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5" />
                  <span>Build 1 fully autonomous background workflow using custom JSON webhooks</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5" />
                  <span>Audit a real business and suggest 3 high-impact AI pipelines</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Timeline Expandable Modules */}
          <div className="lg:col-span-7 space-y-4">
            {curriculumModules.map((module) => {
              const isOpen = expandedModule === module.id;
              return (
                <div
                  key={module.id}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden text-left ${
                    isOpen
                      ? "border-[#2D7FF9] bg-white shadow-premium"
                      : "border-gray-200/80 bg-white/70 hover:border-gray-300"
                  }`}
                >
                  {/* Module Toggle Trigger Button Bar */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-0 select-none cursor-pointer"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider font-bold rounded-md uppercase bg-blue-50 text-blue-600 border border-blue-100">
                          {module.weeks}
                        </span>
                        <span className="text-[11px] font-mono text-gray-400 font-medium">
                          {module.lessonsCount} Core Lessons
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#101828]">
                        {module.title}
                      </h3>
                    </div>
                    
                    <div className={`p-2 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-4 h-4 text-gray-550" />
                    </div>
                  </button>

                  {/* Body Expand Section with high-fidelity modules details */}
                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 border-t border-gray-100 space-y-5 animate-in fade-in duration-200">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {module.description}
                      </p>

                      <div className="space-y-2.5">
                        <h4 className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                          STUDY SYLLABUS DIRECTIVES:
                        </h4>
                        <div className="space-y-2">
                          {module.lessons.map((lesson, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-700">
                              <span className="w-5 h-5 rounded-full bg-[#12B76A]/10 text-[#12B76A] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="font-medium">{lesson}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h4 className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                          INTEGRATED TECH & API LIFECYCLES:
                        </h4>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {module.toolsCovered.map((tool, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-150 text-[10px] font-mono text-gray-550 font-medium"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
