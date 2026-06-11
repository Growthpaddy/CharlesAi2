/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { testimonials } from "../data";
import { Star, MessageSquare, Play, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Testimonials() {
  const [activeVideoTestimonial, setActiveVideoTestimonial] = useState<typeof testimonials[0] | null>(null);

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#FAFBFC] border-b border-gray-150 relative">
      
      {/* Decorative gradient accents */}
      <div className="absolute top-[30%] left-[-150px] w-[500px] h-[500px] rounded-full bg-[#2D7FF9]/4 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-100px] w-[450px] h-[450px] rounded-full bg-[#FCF50F]/4 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section with centered layout */}
        <div className="text-left md:text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-[#011673] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-[#2D7FF9]" />
            <span>ALUMNI ACCREDITATION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
            Alumni Success Case Studies
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-normal">
            Read detailed breakdowns from successful Black directors, founders, and content builders who designed customized AI infrastructure.
          </p>
        </div>

        {/* Testimonials Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => {
            return (
              <div
                key={testimonial.id}
                className="bg-white border border-gray-150 hover:border-gray-300 rounded-3xl p-6 shadow-sm hover:shadow-premium-xl transition-all duration-300 flex flex-col justify-between text-left"
              >
                
                {/* Visual Video Testimonial Mock Thumbnail */}
                {testimonial.videoThumb ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-gray-900 group/video mb-6 cursor-pointer"
                       onClick={() => setActiveVideoTestimonial(testimonial)}>
                    <img
                      src={testimonial.videoThumb}
                      alt={`${testimonial.name} Video Case Study`}
                      className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover/video:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient blur */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Big pulsing Play controller */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#FCF50F] text-[#011673] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/video:scale-110">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/65 backdrop-blur-sm rounded-lg text-[9px] font-mono font-bold uppercase text-white tracking-widest flex items-center gap-1.5 border border-white/10">
                      <Zap className="w-3 h-3 text-[#FCF50F]" />
                      VIDEO INTERVIEW
                    </span>
                  </div>
                ) : (
                  <div className="h-6 flex items-center mb-4 text-[#FCF50F]">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                )}

                {/* Main feedback text */}
                <div className="space-y-4 flex-1">
                  {/* Highlight outcome banner */}
                  <div className="inline-block py-1 px-3 bg-emerald-50 text-[#12B76A] rounded-lg text-xs font-semibold">
                    🏆 {testimonial.highlightOutcome}
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed italic font-normal">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                {/* Profile block */}
                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left font-sans">
                      <h4 className="text-sm font-bold text-[#101828] leading-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                        {testimonial.role}
                      </p>
                      <p className="text-[9px] text-[#2D7FF9] font-medium uppercase font-mono tracking-wider mt-0.5">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Growth stats tag */}
                  <div className="text-right pl-2 shrink-0">
                    <span className="inline-block px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-[#12B76A]">
                      {testimonial.growthMetric}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Video Testimonial Lightbox Modal overlay */}
        {activeVideoTestimonial && (
          <div className="fixed inset-0 bg-[#0A0F1E]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0D1326] border border-white/10 rounded-3xl overflow-hidden w-full max-w-2xl relative shadow-2xl text-left animate-in zoom-in-95 duration-200">
              
              {/* Modal header details */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between text-white bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <img
                    src={activeVideoTestimonial.avatar}
                    alt={activeVideoTestimonial.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-sm leading-none">{activeVideoTestimonial.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{activeVideoTestimonial.role} {activeVideoTestimonial.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideoTestimonial(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors cursor-pointer"
                  aria-label="Close Video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Workspace (Rich Interactive Video Player Mockup) */}
              <div className="aspect-[16/9] bg-black relative flex items-center justify-center text-white">
                <img
                  src={activeVideoTestimonial.videoThumb}
                  alt="Video playing container showcase"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />

                {/* Glowing audio speaker spectrum simulation bar graph */}
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 z-10 px-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#FCF50F] text-[#0A0F1E] flex items-center justify-center shadow-premium-xl animate-pulse">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold font-display">Play Interview: {activeVideoTestimonial.highlightOutcome}</p>
                    <p className="text-[10.5px] text-gray-300 max-w-md antialiased">
                      Review how Marcus integrated GPT actions into local data engines to completely double cash conversions downstream.
                    </p>
                  </div>
                  
                  {/* Simulated timeline control dock */}
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-2 max-w-sm relative">
                    <div className="bg-[#2D7FF9] w-[35%] h-full absolute left-0 top-0" />
                  </div>
                  <div className="flex justify-between w-full max-w-sm text-[9px] font-mono text-gray-400 mt-1">
                    <span>01:14</span>
                    <span>04:45</span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Footer and summary notes */}
              <div className="p-5 text-gray-400 text-xs flex justify-between items-center bg-white/[0.01]">
                <div className="flex gap-1.5 items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-medium">Identity verified via LinkedIn Alumni records</span>
                </div>
                <button
                  onClick={() => setActiveVideoTestimonial(null)}
                  className="text-xs text-[#FCF50F] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Close Window</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
