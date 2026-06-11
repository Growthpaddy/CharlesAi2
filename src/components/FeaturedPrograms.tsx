/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { featuredCourses } from "../data";
import { Search, Clock, Users, BookOpen, Star, Sparkles, Filter, ShieldCheck, ArrowRight } from "lucide-react";

export default function FeaturedPrograms() {
  const [selectedLevel, setSelectedLevel] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = featuredCourses.filter(course => {
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.skillsAcquired.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const levelColorMap = {
    Beginner: "bg-green-50 text-emerald-700 border-emerald-100",
    Intermediate: "bg-blue-50 text-[#2D7FF9] border-blue-100",
    Advanced: "bg-red-50 text-red-600 border-red-100"
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <section id="featured-programs" className="py-20 md:py-28 bg-white border-t border-b border-gray-100 relative">
      {/* Background visual graphics */}
      <div className="absolute top-[40%] left-[-100px] w-[450px] h-[450px] rounded-full bg-[#2D7FF9]/3 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-150px] w-[500px] h-[500px] rounded-full bg-[#FCF50F]/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Headings */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-gray-100">
          <div className="text-left space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-[#011673]/5 text-[#011673] px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#2D7FF9]" />
              <span>curated academic CATALOGUE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
              Unveiling Our Featured Programs
            </h2>
            <p className="text-base text-gray-500 max-w-2xl leading-relaxed font-normal">
              Acquire in-demand skills in AI strategy, workflow automation, and no-code builders. Hover to explore tools and graduation credentials.
            </p>
          </div>

          {/* Quick trust metrics panel */}
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4 text-left font-sans shadow-sm shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#12B76A]/10 text-[#12B76A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Accredited</p>
              <p className="text-sm font-bold text-[#101828]">All 8 modules verify on LinkedIn</p>
            </div>
          </div>
        </div>

        {/* Dynamic Filtering Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8">
          {/* Level tabs with premium outline styling */}
          <div className="flex flex-wrap gap-2">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all border cursor-pointer select-none ${
                  selectedLevel === level
                    ? "bg-[#011673] text-white border-[#011673] shadow-sm"
                    : "bg-white text-gray-550 border-gray-200 hover:border-gray-300"
                }`}
              >
                {level} {level !== "All" ? "Level" : "Programs"}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search specific topics or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 hover:bg-gray-50 border border-gray-200 focus:border-[#2D7FF9] rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 transition-colors focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Courses Responsive Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white border border-gray-150 hover:border-gray-350 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-premium-xl flex flex-col justify-between text-left"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="bg-white/95 backdrop-blur-sm text-[9px] font-mono font-bold tracking-wider px-2 py-1 rounded-md text-[#011673] uppercase shadow-sm">
                      {course.category}
                    </span>
                    <span className={`text-[9px] font-mono font-bold tracking-wider px-2 py-1 rounded-md border shadow-sm ${levelColorMap[course.level]}`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-[#101828] group-hover:text-[#011673] transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Skills lists block */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                      SKILLS YOU WILL MASTER:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {course.skillsAcquired.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[10px] text-gray-550 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {course.skillsAcquired.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] text-gray-400 font-mono">
                          +{course.skillsAcquired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Instructor / Cohort reference */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-7 h-7 rounded-full object-cover border border-white max-w-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left font-sans">
                      <p className="text-[11px] font-semibold text-gray-800 leading-none">
                        {course.instructor}
                      </p>
                      <p className="text-[9px] text-gray-400 leading-none mt-0.5">
                        Lead Instructor
                      </p>
                    </div>
                  </div>

                  {/* Pricing / Enrollment Footer */}
                  <div className="pt-2 flex items-center justify-between text-xs font-medium text-gray-500 font-sans">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {course.duration}
                    </span>
                    <span className="text-gray-200">|</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {course.studentCount} Alumni
                    </span>
                  </div>
                </div>

                {/* Bottom Enroll Actions */}
                <div className="px-5 pb-5 pt-0">
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="w-full bg-gray-50 hover:bg-[#011673] text-[#011673] hover:text-white py-2.5 rounded-xl text-xs font-semibold transiton-all duration-300 flex items-center justify-center gap-1.5 group select-none cursor-pointer"
                  >
                    <span>Request Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No programs match your search</h3>
            <p className="text-xs text-gray-400 mt-1">Try relaxing your search terms or shifting levels.</p>
            <button
              onClick={() => { setSelectedLevel("All"); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 bg-white text-xs border border-gray-200 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
