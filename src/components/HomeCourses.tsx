import React from "react";
import { Clock, Star, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { featuredCourses } from "../data";

export default function HomeCourses() {
  const { navigateTo } = useNavigation();

  // Show only top 6 courses on the homepage as requested
  const displayCourses = featuredCourses.slice(0, 6);

  const priceMap: Record<string, string> = {
    "course-1": "$299",
    "course-2": "$249",
    "course-3": "$299",
    "course-4": "$349",
    "course-5": "$299",
    "course-6": "$249",
  };

  return (
    <section id="featured-programs" className="py-20 bg-white border-b border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-gray-150 text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ELITE LMS CATALOGUE</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
              Featured Programs
            </h2>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center gap-3 shadow-xs max-w-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-extrabold leading-none">100% Accredited</p>
              <p className="text-xs text-gray-500 font-bold mt-1 leading-snug">Verify credentials on corporate portfolios instantly.</p>
            </div>
          </div>
        </div>

        {/* 6 Elegant Custom Priced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          {displayCourses.map((course) => {
            const price = priceMap[course.id] || "$249";
            return (
              <div
                key={course.id}
                onClick={() => navigateTo("programs")}
                className="group bg-white border border-gray-150 hover:border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer text-left flex flex-col justify-between"
              >
                {/* Image Thumb Space */}
                <div className="relative overflow-hidden aspect-[16/10] bg-gray-50">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 bg-[#08142B] text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-0.5 rounded shadow-sm uppercase">
                    {course.category}
                  </span>

                  {/* Rating Pill overlay */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-gray-150/70 shadow-sm flex items-center gap-1 font-mono text-[10px] font-bold text-[#08142B]">
                    <Star className="w-3 h-3 text-[#FCF50F] fill-[#FCF50F]" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* Content body layout */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#2D7FF9]" />
                        {course.duration}
                      </span>
                      <span className="text-[#2D7FF9] font-black">{course.level}</span>
                    </div>

                    <h3 className="font-display font-black text-lg text-[#08142B] tracking-tight group-hover:text-[#2D7FF9] transition-colors leading-tight">
                      {course.title}
                    </h3>

                    <p className="text-xs text-gray-450 leading-relaxed font-medium line-clamp-2">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Instructor Identity & Custom Price Tag Details */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-9 h-9 rounded-full object-cover border border-gray-150"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-black text-[#08142B] leading-none">{course.instructor}</p>
                        <p className="text-[9px] text-gray-400 mt-1 font-mono font-semibold uppercase tracking-wider">LMS ARCHITECT</p>
                      </div>
                    </div>

                    {/* Highly descriptive price accent bubble */}
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-gray-400 font-bold tracking-widest uppercase">COHORT VALUE</p>
                      <p className="text-xl font-display font-black text-[#2D7FF9]">{price}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Home Course Navigation Trigger with custom arrow */}
        <div className="pt-16 flex justify-center">
          <button
            onClick={() => navigateTo("programs")}
            className="group px-8 py-4 bg-[#08142B] hover:bg-[#122A54] text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}
