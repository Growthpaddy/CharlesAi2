/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { featuredCourses } from "../data";
import { Search, Clock, Users, Star, Sparkles, ShieldCheck, ArrowRight, Filter } from "lucide-react";
import { motion } from "motion/react";

export default function FeaturedPrograms() {
  const [selectedLevel, setSelectedLevel] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = featuredCourses.filter(course => {
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Limit featured programs to MAXIMUM of 6 cards as explicitly requested
  const displayCourses = filteredCourses.slice(0, 6);

  const levelColorMap = {
    Beginner: "bg-green-50 text-emerald-700 border-emerald-100",
    Intermediate: "bg-blue-50 text-[#2D7FF9] border-blue-100",
    Advanced: "bg-rose-50 text-rose-600 border-rose-100"
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 85;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  // Safe layout text strict trimmer to guarantee NO description is longer than 20 words
  const trimDescription = (desc: string) => {
    const words = desc.split(" ");
    if (words.length <= 18) return desc;
    return words.slice(0, 17).join(" ") + "...";
  };

  return (
    <section id="featured-programs" className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION 5: TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-gray-100">
          <div className="text-left space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ELITE LMS CATALOGUE</span>
            </div>
            {/* Heading under 10 words limit */}
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
              Featured Programs
            </h2>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center gap-3 text-left shadow-sm shrink-0 md:max-w-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">100% Accredited</p>
              {/* Under 20 words for card / text labels */}
              <p className="text-xs text-gray-500 font-medium">Verify credentials on corporate portfolios instantly.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Filtering */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8">
          <div className="flex flex-wrap gap-2">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((level) => (
              <motion.button
                key={level}
                onClick={() => setSelectedLevel(level)}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer select-none min-h-[44px] sm:min-h-[40px] flex items-center justify-center ${
                  selectedLevel === level
                    ? "bg-[#2D7FF9] text-white border-[#2D7FF9] shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {level} {level !== "All" ? "Level" : "Paths"}
              </motion.button>
            ))}
          </div>

          {/* Search bar inside view */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search specific topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 hover:bg-gray-50 border border-gray-200 focus:border-[#2D7FF9] rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-800 transition-colors focus:outline-none focus:ring-0 min-h-[44px]"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* LMS Grid (Max 6 elements) */}
        {displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {displayCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                animate={{
                  y: [0, -4, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.4
                }}
                whileHover={{
                  y: -10,
                  scale: 1.015,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white border border-gray-150 hover:border-gray-300 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-premium flex flex-col justify-between text-left cursor-pointer"
              >
                {/* Thumb Space */}
                <div className="relative overflow-hidden aspect-[16/10] bg-gray-50">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="bg-[#08142B] text-white text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded shadow">
                      {course.category}
                    </span>
                    <span className={`text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border shadow ${levelColorMap[course.level]}`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Body Space */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* LMS metadata line */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1 bg-[#FCF50F]/20 text-[#08142B] px-1.5 py-0.5 rounded font-mono">
                        <Star className="w-3 h-3 fill-current" />
                        4.9 Rating
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-[#08142B] tracking-tight group-hover:text-[#2D7FF9] transition-colors leading-tight">
                      {course.title}
                    </h3>
                    
                    {/* strict description <= 20 words */}
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                      {trimDescription(course.tagline)}
                    </p>
                  </div>

                  {/* Skills lists block */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap gap-1">
                      {course.skillsAcquired.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[10px] text-gray-550 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Instructor portrait & active graduates outcome */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-500 font-medium font-sans">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-7 h-7 rounded-full object-cover border border-white"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[11px] font-bold text-gray-700">{course.instructor}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      {course.studentCount} Alumni
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToSection("pricing");
                    }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full bg-gray-50 hover:bg-[#2D7FF9] text-[#08142B] hover:text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 group select-none cursor-pointer min-h-[48px]"
                  >
                    <span>Request Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No programs found</h3>
            <button
              onClick={() => { setSelectedLevel("All"); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 bg-white text-xs border border-gray-250 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
