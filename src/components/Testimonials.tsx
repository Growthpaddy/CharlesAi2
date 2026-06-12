/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Play, X, Star, ArrowLeft, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<{
    name: string;
    role: string;
    company: string;
    avatar: string;
    videoThumb: string;
    before: string;
    after: string;
    outcome: string;
  } | null>(null);

  const students = [
    {
      id: "student-1",
      name: "Marcus Adenbayo",
      role: "Founding Partner",
      company: "Aven Automation",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300",
      before: "Spent 40 hours weekly on lead entry.",
      after: "Saves 35 hours weekly with Claude.",
      outcome: "+310% Agency Growth",
      quote: "The blueprints helped me configure autonomous research workflows in days. I saved hours instantly.",
      videoThumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      id: "student-2",
      name: "Nia Mitchell",
      role: "Brand Director",
      company: "Vibrant Studio",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=300",
      before: "Paid $3k monthly to video editors.",
      after: "Renders series in minutes using Runway.",
      outcome: "Saved $36,000 Annually",
      quote: "We scaled our micro-content production 3x while cutting production overhead margins by 85%.",
      videoThumb: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      id: "student-3",
      name: "Tariq Jackson",
      role: "eCom Founder",
      company: "Zuri Luxury Goods",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
      before: "Handled hundreds of support tickets manually.",
      after: "Resolves refunds instantly via custom agent.",
      outcome: "-45% Support Overhead",
      quote: "Embedding an inventory chatbot that triggers real-time refunds completely streamlined store support.",
      videoThumb: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=600&h=400"
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
    <section id="testimonials" className="py-20 bg-[#FAFBFC] border-b border-gray-150 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION 8: HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left space-y-4 max-w-2xl">
            <div className="inline-[#2D7FF9] inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <span>ALUMNI VIDEO INTERVIEWS</span>
            </div>
            {/* Heading limit: max 10 words */}
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
              Verified Graduate Case Studies and Before After Results
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
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

        {/* Carousel containing Student Success Stories */}
        <div
          ref={carouselRef}
          className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent select-none cursor-grab"
          style={{ scrollbarWidth: "thin" }}
        >
          {students.map((student) => (
            <div
              key={student.id}
              className="w-[300px] sm:w-[410px] shrink-0 snap-start bg-white border border-gray-150 rounded-2xl p-6 hover:shadow-premium transition-all duration-300 text-left flex flex-col justify-between"
            >
              {/* Image & play video overlay */}
              <div 
                onClick={() => setActiveVideo(student)}
                className="relative rounded-xl overflow-hidden aspect-[16/10] bg-gray-900 group cursor-pointer mb-5"
              >
                <img 
                  src={student.videoThumb} 
                  alt={student.name}
                  className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* Big play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#FCF50F] text-[#08142B] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-[9px] font-mono tracking-widest text-white font-bold uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#FCF50F]" />
                  PLAY SYSTEM STUDY
                </span>
              </div>

              {/* Before/After parameters */}
              <div className="grid grid-cols-2 gap-4 border border-dashed border-gray-200 bg-gray-50/50 p-3.5 rounded-xl text-xs mb-5">
                <div>
                  <p className="text-[10px] font-mono font-black text-rose-600 uppercase tracking-wider mb-1">❌ BEFORE</p>
                  <p className="text-gray-550 leading-snug">{student.before}</p>
                </div>
                <div className="border-l border-gray-250 pl-3">
                  <p className="text-[10px] font-mono font-black text-emerald-600 uppercase tracking-wider mb-1">✔ AFTER AI</p>
                  <p className="text-gray-550 leading-snug">{student.after}</p>
                </div>
              </div>

              <div className="space-y-3 flex-1 mb-5">
                <span className="inline-block py-1 px-2.5 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-bold">
                  {student.outcome}
                </span>
                
                {/* description / quote limit: max 20 words */}
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "{student.quote}"
                </p>
              </div>

              {/* Profile identity footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <img 
                  src={student.avatar} 
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#08142B] leading-tight">{student.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{student.role}, <span className="font-bold text-[#2D7FF9]">{student.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Lightbox Modal Overlay */}
        {activeVideo && (
          <div className="fixed inset-0 bg-[#08142B]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#08142B] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl text-left">
              
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-[#FCF50F] fill-current" />
                  <span className="text-sm font-bold tracking-tight">Case Study: {activeVideo.name}</span>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1 px-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>

              {/* Video Player Graphic Sandbox */}
              <div className="aspect-[16/9] bg-black relative flex items-center justify-center">
                <img 
                  src={activeVideo.videoThumb} 
                  alt="Testimonial clip playback mockup"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white space-y-4 text-center z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#FCF50F] text-[#08142B] flex items-center justify-center shadow-lg animate-pulse">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display">{activeVideo.outcome}</h4>
                    <p className="text-[11px] text-slate-300 max-w-md mx-auto leading-relaxed mt-1">Review the full 5-minute integration walk-through and prompt sheets inside our cohort portal.</p>
                  </div>
                  
                  {/* Timeline */}
                  <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden max-w-sm">
                    <div className="bg-[#2D7FF9] w-[40%] h-full" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-[#0c1d3c] text-xs text-slate-400 flex items-center gap-2 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified student outcomes from official class audit registries.</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
