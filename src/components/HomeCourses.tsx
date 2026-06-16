/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Clock, Star, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { featuredCourses } from "../data";

export default function HomeCourses() {
  const { navigateTo } = useNavigation();

  // Selected 3 premium spotlight courses to serve as the signature "Nice looking few cards"
  const spotlightIds = ["course-1", "course-2", "course-5"];
  const displayCourses = featuredCourses.filter((course) => spotlightIds.includes(course.id));

  const priceMap: Record<string, string> = {
    "course-1": "₦15,000",
    "course-2": "Free",
    "course-5": "Free",
  };

  const handleSpotlightClick = (courseId: string) => {
    localStorage.setItem("selected_course_id", courseId);
    navigateTo("programs");
  };

  return (
    <section id="homepage-courses" className="py-24 bg-gradient-to-b from-white to-[#F8FAFC] border-b border-gray-150 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-100 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-[#0056D2] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Academy Syllabi</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-[#0B132B]">
              Featured Learning Path Programs
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Skip traditional theory. Explore practical business accelerators engineered specifically to construct high-value online revenue streams immediately.
            </p>
          </div>

          <div className="p-4 bg-white border border-gray-150 rounded-2xl flex items-center gap-3 shadow-xs max-w-xs shrink-0 self-start md:self-end">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black leading-none">100% Practical</p>
              <p className="text-xs text-slate-605 font-bold mt-1 leading-snug">Verify all credentials on active corporate portfolios instantly.</p>
            </div>
          </div>
        </div>

        {/* Highlighted Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {displayCourses.map((course) => {
            const price = priceMap[course.id] || "Free";
            const isPremium = course.id === "course-1";

            return (
              <div
                key={course.id}
                onClick={() => handleSpotlightClick(course.id)}
                className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer text-left flex flex-col justify-between relative ${
                  isPremium 
                    ? "border-blue-200 ring-2 ring-blue-500/10 shadow-md" 
                    : "border-gray-150 hover:border-blue-300/60"
                }`}
              >
                {isPremium && (
                  <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-[9px] font-mono font-black tracking-wider px-2 py-0.5 rounded shadow">
                    PREMIUM TRACK
                  </div>
                )}

                {/* Cover Image */}
                <div className="relative overflow-hidden aspect-[16/10] bg-slate-50">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category badge */}
                  <span className="absolute bottom-3 left-3 bg-[#0B132B] text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded shadow-md uppercase">
                    {course.category}
                  </span>

                  {/* Rating indicator */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-1 font-mono text-[10px] font-bold text-[#0B132B]">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* Content description wrapper */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                        {course.duration}
                      </span>
                      <span className="text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{course.level}</span>
                    </div>

                    <h3 className="font-display font-black text-base text-[#0B132B] tracking-tight group-hover:text-[#0056D2] transition-colors leading-tight">
                      {course.title}
                    </h3>

                    <p className="text-xs text-gray-450 leading-relaxed font-medium line-clamp-2">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Pricing tag & CTA summary */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full object-cover border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-[10px] font-bold text-[#0B132B] leading-none">{course.instructor}</p>
                        <p className="text-[8px] text-gray-400 mt-1 font-mono uppercase tracking-wider">Instructor</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] font-mono text-gray-400 font-bold tracking-widest uppercase">TUITION FEE</p>
                      <p className={`text-base font-display font-black ${isPremium ? "text-[#0056D2]" : "text-emerald-600"}`}>
                        {price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Giant Redirection CTA to see all 12 courses */}
        <div className="pt-16 flex flex-col items-center gap-3">
          <button
            onClick={() => navigateTo("programs")}
            className="group px-8 py-4 bg-[#0B132B] hover:bg-[#15234A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2.5 cursor-pointer max-w-sm"
          >
            <span>Explore All 12 Academy Courses</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            Prompting • Digital Products • Content • App Building • automation • ghostwriting
          </span>
        </div>

      </div>
    </section>
  );
}
