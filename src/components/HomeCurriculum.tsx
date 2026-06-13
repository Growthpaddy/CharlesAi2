import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Sparkles, Server, FileCode, PlayCircle } from "lucide-react";

export default function HomeCurriculum() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

  const curriculumData = [
    {
      week: "Week 1",
      title: "Core Automation Setup",
      bullets: [
        "Configuring raw webhooks and background event loops on Make.com.",
        "Constructing complex variables and parsing JSON payloads dynamically.",
        "Error handling: setting up autonomous retries and fallbacks."
      ]
    },
    {
      week: "Week 2",
      title: "GPT Prompt Tuning & Structuring",
      bullets: [
        "Mastering temperature, system instructions, and advanced model schemas.",
        "Outputting perfect structured JSON formats that do not break parser steps.",
        "Few-shot stringing and contextual prompting for complex analytics."
      ]
    },
    {
      week: "Week 3",
      title: "Autonomous Content Pipelines",
      bullets: [
        "Triggering automatic script formulations from YouTube transcripts.",
        "Deploying multi-step scheduled posting agents onto media channels.",
        "Generating beautiful graphics in active automated marketing workflows."
      ]
    },
    {
      week: "Week 4",
      title: "Enterprise Bot Architecture",
      bullets: [
        "Integrating direct DB layers (Airtable, Firestore) with dynamic model prompts.",
        "Designing conversational safety guards and prompt injection shields.",
        "Executing fully automated email, Slack, and CRM synchronization loops."
      ]
    }
  ];

  return (
    <section id="curriculum" className="py-20 bg-white border-b border-gray-150 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-blue-105">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            <span>RIGOROUS CURRICULUM</span>
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1B3D]">
            Elite Cohort Curriculum
          </h2>
          <p className="text-gray-450 text-sm max-w-xl mx-auto">
            Practical, task-based modules verified to transition learners into highly capable applied AI masters under 30 days.
          </p>
        </div>

        {/* Dual Column Core */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Expandable weekly accordion dropdowns */}
          <div className="lg:col-span-7 space-y-4">
            {curriculumData.map((c, idx) => {
              const isExpanded = expandedWeek === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs transition-colors hover:border-gray-250"
                >
                  {/* Header trigger */}
                  <div
                    onClick={() => setExpandedWeek(isExpanded ? null : idx)}
                    className="p-6 flex justify-between items-center cursor-pointer select-none text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="bg-blue-50 text-[#0056D2] text-xs font-black px-3 py-1 rounded-lg uppercase font-mono tracking-wider border border-blue-100/40">
                        {c.week}
                      </span>
                      <h3 className="font-display font-black text-base text-[#0B1B3D] truncate max-w-xs sm:max-w-md">
                        {c.title}
                      </h3>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#0056D2]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expandee content with bullets */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/40 text-left animate-in duration-250 fade-in select-text">
                      <ul className="space-y-3">
                        {c.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-xs text-gray-550 leading-relaxed font-medium">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: copying direct sandbox template highlighting */}
          <div className="lg:col-span-5 text-left bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0056D2]/10 blur-2xl rounded-full" />
            
            <div className="space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-amber-400 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-white/5">
                🎁 COHORT BONUS BUNDLE
              </span>

              <h3 className="font-display font-black text-xl text-white leading-snug">
                Copy-Paste Playbook Templates Attached
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Gain instant backend access to over 15+ proven Make.com scenarios, GPT-4 custom instructions parameters, and copyable prompt templates.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 border border-white/5">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-100 font-bold">1-Click Scenario Sync triggers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 border border-white/5">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-100 font-bold">Raw Prompt Blueprint text docs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 border border-white/5">
                    <PlayCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-100 font-bold">Over-the-shoulder video guides</span>
                </div>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                <span>ESTIMATED VALUE</span>
                <span className="text-white text-base font-display font-black">$1,499 (FREE WITH COHORT)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
