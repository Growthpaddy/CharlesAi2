/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Bot, Sparkles, Cpu, Globe, Terminal, ShieldCheck, 
  Star, Award, Zap, TrendingUp, Search, Network, Database, Laptop
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

// Trending Searches Data (Matches top half of the Coursera redesign sample)
interface TrendingCategory {
  title: string;
  items: {
    iconBg: string;
    icon: React.ComponentType<{ className?: string }>;
    institution: string;
    courseName: string;
    type: string;
    rating: string;
  }[];
}

const TRENDING_CATEGORIES: TrendingCategory[] = [
  {
    title: "Agentic AI",
    items: [
      {
        icon: Bot,
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        institution: "OpenAI Platform Developer",
        courseName: "API Parameter Optimization & Structured JSON Outputs",
        type: "Specialization",
        rating: "4.9"
      },
      {
        icon: Sparkles,
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
        institution: "Anthropic Partner Network",
        courseName: "Advanced Claude XML System Tag Structures & Prompt Contexts",
        type: "Specialization",
        rating: "4.8"
      },
      {
        icon: Laptop,
        iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        institution: "Local LLM Hub",
        courseName: "DeepSeek RAG Tuning & Local Model Quantization",
        type: "Course",
        rating: "4.7"
      }
    ]
  },
  {
    title: "Workflow Automations",
    items: [
      {
        icon: Network,
        iconBg: "bg-purple-50 text-purple-600 border-purple-100",
        institution: "Make.com Operations",
        courseName: "Enterprise Hook Parsers, API Routers, & Webhooks",
        type: "Specialization",
        rating: "4.9"
      },
      {
        icon: Cpu,
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        institution: "Google AI Developer",
        courseName: "Gemini Multimodal Real-time Audio & Video Analysis",
        type: "Professional Certificate",
        rating: "4.8"
      },
      {
        icon: Terminal,
        iconBg: "bg-slate-50 text-slate-700 border-slate-200",
        institution: "UI Copilots Lab",
        courseName: "Vercel Workbench Prototyping (v0 & Next.js Stacks)",
        type: "Professional Certificate",
        rating: "4.6"
      }
    ]
  },
  {
    title: "Semantic Data Ops",
    items: [
      {
        icon: Globe,
        iconBg: "bg-teal-50 text-teal-600 border-teal-100",
        institution: "Perplexity Research API",
        courseName: "Real-time Grounding & Dynamic Search Pipelines",
        type: "Course",
        rating: "4.9"
      },
      {
        icon: Database,
        iconBg: "bg-rose-50 text-rose-600 border-rose-100",
        institution: "Pinecone Enterprise Core",
        courseName: "Vector Chunking & High-Density Similarity Indexing",
        type: "Professional Certificate",
        rating: "4.8"
      },
      {
        icon: ShieldCheck,
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        institution: "Cyber LLM Standards",
        courseName: "System Injection Safeguards & Input Sanitization Tools",
        type: "Professional Certificate",
        rating: "4.6"
      }
    ]
  }
];

// Bottom Portfolio Collection (Matches the blue-themed portfolio box in the Coursera sample)
interface PortfolioCard {
  imageUrl: string;
  title: string;
  type: string;
}

const PORTFOLIO_CARDS: PortfolioCard[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=260",
    title: "LLM Engineering That Works: Prompting, Tuning, and Retrieval",
    type: "Professional Certificate"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400&h=260",
    title: "Train, Tune, & Ship: End-to-End Multimodal Pipelines",
    type: "Specialization"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400&h=260",
    title: "AI Agent Orchestration & Workspace Swarm Paradigms",
    type: "Specialization"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400&h=260",
    title: "State-of-the-Art Operations: Building Custom Workbenches",
    type: "Specialization"
  }
];

export default function AITechStack() {
  const { navigateTo } = useNavigation();

  return (
    <section id="ai-tech-stack" className="py-24 bg-white border-b border-gray-150 relative overflow-hidden">
      
      {/* Decorative top grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0056d201_1px,transparent_1px),linear-gradient(to_bottom,#0056d201_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl space-y-4 mb-20">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider border border-blue-100">
            <TrendingUp className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Graduate with Hands-On API Expertise</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#0B1B3D] leading-tight">
            Comprehensive Curriculum Architecture
          </h2>
          <p className="text-gray-500 font-secondary text-sm sm:text-base leading-relaxed">
            We don't teach abstract theories. Our curriculum focuses directly on building, deploying, and maintaining multi-agent systems using industry-standard tools. Redesigned to replicate live career track portals.
          </p>
        </div>

        {/* 1. TOP PART: TRENDING SEARCHES SECTION */}
        <div className="mb-20 text-left">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-sans font-extrabold text-lg text-slate-800 tracking-tight">Trending searches</h3>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-xs text-gray-400 font-mono">active_syllabus_tracks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRENDING_CATEGORIES.map((category, idx) => (
              <div 
                key={idx} 
                className="bg-[#EDF2FA]/50 border border-blue-100/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden shadow-xs hover:shadow-sm transition-all"
              >
                {/* Column category Title with right chevron click */}
                <div className="flex items-center justify-between text-slate-800 hover:text-[#0056D2] transition-colors cursor-pointer group">
                  <span className="font-sans font-bold text-sm tracking-tight">{category.title}</span>
                  <span className="text-xs font-sans font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>

                {/* Sub items inside the container box */}
                <div className="flex flex-col gap-3">
                  {category.items.map((item, itemIdx) => {
                    const IconComponent = item.icon;
                    return (
                      <div 
                        key={itemIdx}
                        onClick={() => navigateTo("paths")}
                        className="bg-white border border-slate-150 rounded-xl p-3.5 flex gap-3 text-left hover:border-[#0056D2] hover:shadow-xs transition-all cursor-pointer group/item"
                      >
                        {/* Styled Icon Badge */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${item.iconBg}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>

                        {/* Title, institution & stars */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-gray-400 group-hover/item:text-[#0056D2] font-semibold truncate transition-colors">
                              {item.institution}
                            </span>
                          </div>
                          <h4 className="font-sans font-bold text-xs text-[#0B1B3D] tracking-tight leading-snug line-clamp-2">
                            {item.courseName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[9.5px] text-gray-500 font-secondary">
                            <span>{item.type}</span>
                            <span>&bull;</span>
                            <div className="flex items-center gap-0.5 text-slate-700 font-sans">
                              <Star className="w-3 h-3 text-amber-501 fill-amber-500 text-amber-500 shrink-0" />
                              <span className="font-bold text-[9.5px]">{item.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. BOTTOM PART: HIGH PROFILE BLUE CONTAINER PORTFOLIO ROW (NEAT FULL WIDTH) */}
        <div className="w-full">
          <div 
            className="w-full bg-[#0056D2] text-white rounded-3xl p-6 sm:p-8 lg:p-11 shadow-xl overflow-hidden relative text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            id="curriculum-collection-blue-banner"
          >
            {/* Background glowing particles mapping */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.04] blur-2xl rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[10%] w-60 h-60 bg-white/[0.02] blur-3xl rounded-full pointer-events-none" />

            {/* Left Header Panel Columns: 3 */}
            <div className="lg:col-span-3 space-y-5 lg:pr-4">
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-white px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-white/5">
                <Award className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Professional Track
              </span>
              <div className="space-y-3">
                <h3 className="font-sans text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  AI Engineering Collection
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm font-secondary leading-relaxed">
                  Develop the real-world skills you need to shine in today’s AI engineering roles. Learn prompt pipelines, agent state rooms, and production deployments.
                </p>
              </div>

              {/* Action Button replicating the original mockup */}
              <button
                onClick={() => navigateTo("pricing")}
                className="bg-white hover:bg-slate-100 text-[#0056D2] font-sans font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1 w-full sm:w-auto uppercase tracking-wider"
              >
                <span>Start 7-day free trial</span>
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              </button>
            </div>

            {/* Right Cards List Columns: 9 */}
            {/* Using horizontal scroll container on mobile/tablet, and clean fit grid on desktop */}
            <div className="lg:col-span-9">
              <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
                
                {PORTFOLIO_CARDS.map((card, idx) => (
                  <div 
                    key={idx}
                    onClick={() => navigateTo("programs")}
                    className="min-w-[250px] sm:min-w-[260px] lg:min-w-0 bg-white rounded-2xl p-1 shadow-lg border border-white/10 hover:shadow-2xl transition-all duration-300 cursor-pointer group snap-center flex flex-col justify-between"
                  >
                    <div>
                      {/* Course Image Wrapper */}
                      <div className="w-full h-36 rounded-xl overflow-hidden relative bg-slate-100">
                        <img 
                          src={card.imageUrl} 
                          alt={card.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
                      </div>

                      {/* Info body */}
                      <div className="p-3.5 space-y-2.5">
                        
                        {/* Course Provider/Partner Mimic (AI Institute banner tag) */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded bg-[#0056D2] flex items-center justify-center text-white scale-90">
                            <span className="text-[7px] font-black font-sans">ai</span>
                          </div>
                          <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-slate-400">
                            AI Institute
                          </span>
                        </div>

                        {/* Title matching exact typography sizing from sample */}
                        <h4 className="font-sans font-extrabold text-xs text-slate-800 tracking-tight leading-snug line-clamp-3 group-hover:text-[#0056D2] transition-colors h-14">
                          {card.title}
                        </h4>

                      </div>
                    </div>

                    {/* Bottom Metadata Category bar */}
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-50">
                      <span className="text-[10px] text-gray-400 font-sans font-medium">
                        {card.type}
                      </span>
                    </div>

                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
