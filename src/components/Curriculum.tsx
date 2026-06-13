/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import ScrollReveal from "./ScrollReveal";
import { 
  Compass, Sparkles, Send, Briefcase, Terminal, Zap, 
  ArrowRight, ArrowLeft, CheckCircle, GraduationCap, Code, Layers 
} from "lucide-react";

export default function Curriculum() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [timelineStep, setTimelineStep] = useState<number>(0);

  const categories = [
    {
      title: "AI Beginner",
      outcome: "Master core AI logic and playground setups with zero coding.",
      duration: "2 Weeks",
      icon: Compass,
      tag: "FOUNDATION"
    },
    {
      title: "AI Creator",
      outcome: "Generate cinematic commercial videos, copy, and illustrations in seconds.",
      duration: "3 Weeks",
      icon: Sparkles,
      tag: "CREATIVE TECH"
    },
    {
      title: "AI Marketer",
      outcome: "Deploy SEO topic networks and automated warm lead lists.",
      duration: "3 Weeks",
      icon: Send,
      tag: "PROGRAMMATIC"
    },
    {
      title: "AI Entrepreneur",
      outcome: "Architect lean automated eCommerce agencies and consultation retainers.",
      duration: "4 Weeks",
      icon: Briefcase,
      tag: "REVENUE"
    },
    {
      title: "AI Developer",
      outcome: "Code database bots and multi-agent systems via lightweight frameworks.",
      duration: "4 Weeks",
      icon: Code,
      tag: "DEVELOPMENT"
    },
    {
      title: "AI Automation Expert",
      outcome: "Connect standard apps into autonomous, hands-free back-office routines.",
      duration: "4 Weeks",
      icon: Zap,
      tag: "INTEGRATION"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Choose Path",
      desc: "Select a custom trade path aligned with your professional outcome.",
      color: "border-blue-500 text-blue-500"
    },
    {
      step: "02",
      title: "Learn",
      desc: "Watch bite-sized micro-tutorials inside our premium dashboard.",
      color: "border-emerald-500 text-emerald-500"
    },
    {
      step: "03",
      title: "Build Projects",
      desc: "Deploy 12 ready-to-run automation pipelines in sandbox labs.",
      color: "border-amber-500 text-amber-500"
    },
    {
      step: "04",
      title: "Get Certified",
      desc: "Receive dynamic, verified security credentials on LinkedIn.",
      color: "border-purple-500 text-purple-500"
    },
    {
      step: "05",
      title: "Launch Career",
      desc: "Acquire high-paying consultation contracts or streamline existing jobs.",
      color: "border-[#FCF50F] text-[#08142B]"
    }
  ];

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 320 : scrollLeft + 320;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="learning-paths" className="py-20 bg-white border-b border-gray-100 overflow-hidden">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* SECTION 3: Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="text-left space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>LEARNING SYSTEM PATHS</span>
              </div>
              {/* Section heading: Under 10 words limit */}
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
                Discover Our Six Elite Specialization Concentrations
              </h2>
            </div>
            {/* Slider controls */}
            <div className="flex items-center gap-2.5 self-start md:self-end">
              <button
                onClick={() => scroll("left")}
                className="p-3 bg-white border border-gray-250 hover:border-gray-300 rounded-xl text-[#08142B] transition-colors cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center shadow-sm"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-3 bg-white border border-gray-250 hover:border-gray-300 rounded-xl text-[#08142B] transition-colors cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center shadow-sm"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories Horizontal Carousel */}
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent select-none cursor-grab"
            style={{ scrollbarWidth: "thin" }}
          >
            {categories.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="w-[290px] sm:w-[325px] shrink-0 snap-start bg-white border border-gray-150 rounded-2xl p-6 hover:border-[#2D7FF9]/40 hover:shadow-premium transition-all duration-300 flex flex-col justify-between text-left"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400">
                        {item.tag}
                      </span>
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-tight rounded-md bg-[#2D7FF9]/10 text-blue-600">
                        {item.duration}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-medium text-lg sm:text-xl text-[#08142B] mb-2">
                      {item.title}
                    </h3>
                    
                    {/* Outcome limit <= 20 words */}
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[42px]">
                      {item.outcome}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-[#2D7FF9] font-bold">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>Practical Lab Course</span>
                    </div>
                    <span className="cursor-pointer hover:underline text-[#08142B] flex items-center gap-1">Learn <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 4: HOW IT WORKS (Timeline with animated lines) */}
      <ScrollReveal>
        <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 bg-[#08142B]/5 text-[#08142B] px-3 py-1 rounded-full text-xs font-semibold">
              <span>METHODOLOGY</span>
            </div>
            {/* Section heading: Under 10 words limit */}
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
              Your Seamless Turnkey Five Step Learning Experience
            </h2>
          </div>

          {/* Interactive Responsive Stepper Timeline */}
          <div className="relative">
            {/* Desktop connecting path line banner */}
            <div className="absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-dashed border-t border-gray-200 hidden lg:block -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {steps.map((st, idx) => {
                return (
                  <div 
                    key={idx} 
                    onClick={() => setTimelineStep(idx)}
                    className={`group relative text-center space-y-4 cursor-pointer p-4 rounded-xl transition-all duration-300 ${st.step === `0${timelineStep + 1}` ? "bg-gray-50" : "hover:bg-gray-50/50"}`}
                  >
                    {/* Step Bubble circle */}
                    <div className="flex justify-center">
                      <div className={`w-14 h-14 rounded-full border-2 bg-white flex items-center justify-center font-bold text-lg font-display transition-all duration-300 relative ${timelineStep === idx ? "scale-115 active-dot-glow border-[#2D7FF9] text-[#2D7FF9]" : "border-gray-200 text-gray-400 group-hover:border-gray-300 animate-pulse"}`}>
                        {st.step}
                        {timelineStep === idx && (
                          <div className="absolute -inset-1.5 border border-[#2D7FF9]/45 rounded-full animate-ping" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display font-medium text-base text-[#08142B]">
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-[210px] mx-auto min-h-[36px]">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
