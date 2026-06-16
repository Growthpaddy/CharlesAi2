/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { 
  Search, Clock, Users, Star, Sparkles, ShieldCheck, 
  ArrowRight, Filter, X, CheckCircle, BookOpen, GraduationCap,
  ArrowLeft, Calendar, Award, CheckCircle2, ChevronRight, Lock, Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigation, courseIdToSlugMap } from "../context/NavigationContext";
import { db, masterCourses, masterModules, masterLessons } from "../lib/db";
import { Course } from "../types";

export default function FeaturedPrograms() {
  const { navigateTo, activeCourseId, navigateToCourse } = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Auto-expand the first module of the curriculum accordion for premium engagement
  useEffect(() => {
    if (activeCourseId) {
      const courseModules = masterModules.filter(m => m.courseId === activeCourseId);
      if (courseModules.length > 0) {
        setExpandedModules({ [courseModules[0].id]: true });
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeCourseId]);

  // Find currently active course
  const activeCourse = masterCourses.find(c => c.id === activeCourseId);

  // Filter available courses for standard catalog catalog list
  const filteredCourses = masterCourses.filter(course => {
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const levelColorMap = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Intermediate: "bg-blue-50 text-[#0056D2] border-blue-100",
    Advanced: "bg-rose-50 text-rose-700 border-rose-100"
  };

  const priceMap: Record<string, string> = {
    "course-1": "₦15,000",
    "course-2": "Free",
    "course-3": "Free",
    "course-4": "Free",
    "course-5": "Free",
    "course-6": "Free",
    "course-7": "Free",
    "course-8": "Free",
    "course-9": "Free",
    "course-10": "Free",
    "course-11": "Free",
    "course-12": "Free",
  };

  // Safe enrollment click handler
  const handleEnroll = (courseId: string) => {
    navigateTo("landing");
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // ----------------------------------------------------
  // SCREEN A: RENDER FULL ACTIVE COURSE DETAIL PAGE
  // ----------------------------------------------------
  if (activeCourse) {
    const price = priceMap[activeCourse.id] || "Free";
    const matchingModules = masterModules
      .filter(m => m.courseId === activeCourse.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    // Filter related courses (3 courses from catalog excluding current, same level or similar)
    const relatedCourses = masterCourses
      .filter(c => c.id !== activeCourse.id)
      .slice(0, 3);

    return (
      <div id="course-detail-page" className="py-16 bg-slate-50/50 min-h-screen text-left font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          
          {/* Breadcrumbs Navigation with back trigger */}
          <div className="mb-8">
            <button
              onClick={() => navigateTo("programs")}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0056D2] hover:text-[#0047B3] transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Modules Directory</span>
            </button>
          </div>

          {/* 1. HERO SECTION */}
          <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 mb-10">
            
            {/* Left Block image */}
            <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-xs bg-slate-50 shrink-0">
              <img 
                src={activeCourse.thumbnail} 
                alt={activeCourse.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                <span className="bg-[#0B132B] text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded shadow uppercase">
                  CURRICULUM SPEC
                </span>
                <span className={`text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded border shadow bg-white ${levelColorMap[activeCourse.level as keyof typeof levelColorMap]}`}>
                  {activeCourse.level} Level
                </span>
              </div>
            </div>

            {/* Right Block copy info */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#0056D2]/10 text-[#0056D2] text-[10px] font-mono font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    MODULE DETAILS
                  </span>
                  <span className="bg-amber-500/10 text-amber-700 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-550 fill-amber-550" /> 4.9 Rating
                  </span>
                  <span className="bg-slate-50 text-slate-500 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {activeCourse.studentCount || "400"} Alumni
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl font-black text-[#0B132B] tracking-tight leading-tight">
                  {activeCourse.title}
                </h1>

                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-2xl font-semibold">
                  {activeCourse.description}
                </p>
              </div>

              {/* Instant enroll box */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-150 gap-4">
                <div>
                  <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Tuition Access Model</p>
                  <p className="text-[#0056D2] text-xs font-black mt-0.5">Part of the complete AI Online Business Course</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl">Unlock All 12 Modules</span>
                  <button
                    onClick={() => handleEnroll(activeCourse.id)}
                    className="px-6 py-3 bg-[#0056D2] hover:bg-[#0047B3] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
                  >
                    <span>Enroll In Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Sub Content breakdown grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* 2. COURSE OVERVIEW */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-display font-black text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0056D2]" />
                  <span>Module Introduction & Purpose</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/55 p-5 rounded-2xl border border-slate-100 font-semibold">
                  {activeCourse.overview || "This professional training track provides high-fidelity modules and custom workflow blueprints verified across in-person physical operations standards."}
                </p>

                {/* Business Value & Strategic Reason */}
                <div className="mt-4 p-5 bg-blue-50/55 border border-blue-100 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-[#0056D2] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
                    <span>Business reason & strategic logic</span>
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-semibold">
                    This module provides actionable computational leverage. Mastering this specific domain allows enterprise systems and local businesses to bypass tedious operational bottlenecks, automate content strategies, reduce headcount parameters and secure high-retainer clients natively.
                  </p>
                </div>
              </div>

              {/* 3. LEARNING OUTCOMES */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#0056D2] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Key Program Learning Outcomes</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {(activeCourse.outcomes || [
                    "Master production-grade automation loops cleanly",
                    "Configure and list digital books on global libraries",
                    "Understand proper data privacy validation guidelines",
                    "Directly configure custom agents to solve client processes"
                  ]).map((outcome, index) => (
                    <div key={index} className="flex gap-2.5 text-xs text-slate-650 font-medium">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. COURSE CURRICULUM (Accordions) */}
              <div id="course-curriculum-accordion" className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#0056D2] flex items-center gap-2">
                    <GraduationCap className="w-4.5 h-4.5" />
                    <span>Curriculum Timeline Mod Outline</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {matchingModules.length} Modules Included
                  </span>
                </div>

                <div className="space-y-3.5">
                  {matchingModules.length > 0 ? (
                    matchingModules.map((module) => {
                      const expanded = !!expandedModules[module.id];
                      const moduleLessons = masterLessons.filter(l => l.moduleId === module.id)
                        .sort((a,b) => a.sortOrder - b.sortOrder);

                      return (
                        <div 
                          key={module.id} 
                          className="border border-slate-150 rounded-2xl overflow-hidden bg-white transition-all hover:border-slate-300"
                        >
                          {/* Accordion Trigger Header */}
                          <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full p-4 flex items-center justify-between text-left cursor-pointer bg-slate-50/50 hover:bg-slate-50 select-none"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center font-mono font-black text-[10px]">
                                {module.sortOrder}
                              </span>
                              <h4 className="text-xs sm:text-sm font-black text-slate-800">
                                {module.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                              <span>{moduleLessons.length} Lessons</span>
                              <ChevronRight className={`w-4 h-4 text-[#0056D2] transition-transform duration-300 ${expanded ? "rotate-90" : ""}`} />
                            </div>
                          </button>

                          {/* Accordion Content Lessons */}
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="border-t border-slate-150 divide-y divide-slate-100"
                              >
                                {moduleLessons.length > 0 ? (
                                  moduleLessons.map((lesson) => (
                                    <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50/40 text-xs">
                                      <div className="flex items-center gap-3.5">
                                        <div className="w-7 h-7 rounded-full bg-slate-104 text-slate-400 flex items-center justify-center shrink-0 border border-slate-150">
                                          <Play className="w-3 h-3 text-slate-400 fill-slate-450" />
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-705 leading-relaxed">{lesson.title}</p>
                                          <p className="text-[9px] text-[#0056D2] font-mono mt-0.5 uppercase tracking-wider">{lesson.duration || "15 mins"}</p>
                                        </div>
                                      </div>
                                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded font-bold font-mono">
                                        COMPLETED OUTLINE
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-4 text-center text-xs text-slate-400 italic">
                                    Curriculum details are loaded with interactive video player upon enrollment.
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      );
                    })
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
                      No matching modules for this syllabus are found in the schema seed.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Specifications Column (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* 5. INSTRUCTOR SECTION */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 text-left space-y-4">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase leading-none">Course Director</h4>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img 
                    src={activeCourse.instructorAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300"} 
                    alt={activeCourse.instructorName} 
                    className="w-12 h-12 rounded-full object-cover border border-white shadow-xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="text-xs font-black text-slate-800 leading-none">{activeCourse.instructorName}</h5>
                    <p className="text-[9px] text-[#0056D2] mt-1 font-mono font-black uppercase tracking-widest leading-none">SCHOOL ADVISOR</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">
                  Highly skilled in West Africa Digital Product curation, configuring webhook systems, automating social media models, and deploying student pipelines nationwide.
                </p>
              </div>

              {/* 6. COURSE FEATURES CARD */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 text-left space-y-5">
                <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#0056D2] leading-none">Syllabus Specifications</h4>
                
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Estimated Study Time</span>
                    <span className="text-slate-700 font-black">{activeCourse.duration}</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Difficulty Level</span>
                    <span className="text-slate-700 font-black">{activeCourse.level}</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Syllabus Modules</span>
                    <span className="text-[#0056D2] font-black">{matchingModules.length} Modules</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center font-semibold">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Alumni Credential</span>
                    <span className="text-emerald-700 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-100">
                      <Award className="w-3.5 h-3.5 text-emerald-650" /> Included
                    </span>
                  </div>
                </div>
              </div>

              {/* 7. STUDENT BENEFITS */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 text-left space-y-4">
                <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#0056D2] leading-none">Verified Student Protection</h4>
                <div className="space-y-3 pt-2">
                  <div className="flex gap-2.5 text-xs text-slate-650">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 select-none" />
                    <div>
                      <p className="font-bold text-slate-800">Lifetime updates</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Keep access to your syllabus materials at no extra fees.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 text-xs text-slate-650">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 select-none" />
                    <div>
                      <p className="font-bold text-slate-800">Community Support Rooms</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Simulate blueprints with certified mentors on Discord.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* 8. MODULE PAGE CTA SECTION */}
          <div className="bg-gradient-to-r from-[#030914] to-[#0A162B] text-white rounded-3xl p-8 sm:p-12 text-center my-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0056D2]/15 blur-[120px] pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <span className="inline-block bg-[#0056D2]/25 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase">
                COMPREHENSIVE VALUE OUTCOME
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-black">
                This Module Is Included In The Full AI Online Business Course
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                No separate purchases needed. Enrolling exactly once in our flagship training program grants you immediate lifelong access to this specific module syllabus along with all other 11 practical business modules, our Abuja/Lagos mentor network, and custom code scrapers.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                <button
                  onClick={() => handleEnroll(activeCourse.id)}
                  className="px-8 py-3.5 bg-[#0056D2] hover:bg-[#0047B3] text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 w-full sm:w-auto"
                >
                  Enroll In Full Course
                </button>
                <button
                  onClick={() => navigateTo("programs")}
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 font-bold text-xs sm:text-sm rounded-xl transition-all w-full sm:w-auto"
                >
                  See Other Modules
                </button>
              </div>
            </div>
          </div>

          {/* 9. RELATED COURSES */}
          <div className="space-y-6 text-left my-12">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#0056D2]">
              Related Specialized Tracks
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCourses.map((c) => {
                const price = priceMap[c.id] || "Free";
                const totalCourseModules = masterModules.filter(m => m.courseId === c.id).length || 4;

                return (
                  <div
                    key={c.id}
                    onClick={() => navigateToCourse(c.id)}
                    className="group bg-white border border-slate-150 hover:border-blue-400/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3 text-left">
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-xs bg-slate-50">
                        <img 
                          src={c.thumbnail} 
                          alt={c.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-102 duration-300"
                        />
                        <span className={`absolute top-2 left-2 text-[8px] font-mono font-black tracking-widest px-2 py-0.5 rounded bg-white border shadow ${levelColorMap[c.level as keyof typeof levelColorMap]}`}>
                          {c.level}
                        </span>
                      </div>

                      <h4 className="font-sans font-black text-sm text-[#0B132B] group-hover:text-[#0056D2] transition-colors leading-tight">
                        {c.title}
                      </h4>
                      
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                      <span className="bg-slate-50 text-[10px] px-2 py-0.5 rounded text-slate-500">
                        {totalCourseModules} Modules
                      </span>
                      <span className="text-[#0056D2] flex items-center gap-0.5 font-bold">
                        <span>Inspect Syllabus</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN B: RENDER NORMAL CATALOUGE (COURSE CATALOG) GRID
  // ----------------------------------------------------
  return (
    <section id="academy-programs-page" className="py-20 bg-slate-50/50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        
        {/* Title / Hero Block */}
        <div className="bg-white border border-slate-150 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL 12 CURRICULUM MODULES</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[#0B132B]">
              Explore Flagship Course Modules
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              We offer <strong className="text-[#0B132B] font-extrabold">exactly one flagship program: the AI Online Business Course</strong>. Below is the comprehensive list of its 12 learning modules. Students enroll once and gain immediate lifelong access to the entire directory of guides, templates and automated scrapers.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3 text-left max-w-xs shrink-0 self-start md:self-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black leading-none">Accredited</p>
              <p className="text-[11px] text-gray-500 mt-1 font-bold">12 modules included under a single premium enrollment ticket.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Filtering Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-150 rounded-2xl p-4 mb-10 shadow-xs">
          <div className="flex flex-wrap gap-2 text-left">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer select-none min-h-[38px] flex items-center justify-center ${
                  selectedLevel === level
                    ? "bg-[#0056D2] text-white border-[#0056D2] shadow-sm"
                    : "bg-slate-50 text-slate-600 border-gray-250 hover:border-gray-300"
                }`}
              >
                {level} {level !== "All" ? "Level" : "Tracks"}
              </button>
            ))}
          </div>

          {/* Search bar inside view */}
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="Search by keyword, tool, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#0056D2] rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-800 transition-colors focus:outline-none min-h-[42px]"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Courses Layered Neatly Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const price = priceMap[course.id] || "Free";
              // Dynamically resolve modules count
              const currentCourseModules = masterModules.filter(m => m.courseId === course.id).length || 4;

              return (
                <div
                  key={course.id}
                  onClick={() => navigateToCourse(course.id)}
                  className="group bg-white border border-slate-150 hover:border-blue-400/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between text-left cursor-pointer shadow-xs"
                >
                  {/* Image Block */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-slate-100 border-b border-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="bg-[#0B132B] text-white text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded shadow">
                        {course.categoryId === "cat-1" ? "ENGINEERING" : "AI PRACTICAL"}
                      </span>
                      <span className={`text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded border shadow ${levelColorMap[course.level as keyof typeof levelColorMap]}`}>
                        {course.level}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-white/95 px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-1 font-mono text-[10px] font-black text-[#0B132B]">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-550" />
                      <span>{course.rating || "4.9"}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                          {course.duration}
                        </span>
                        <span className="text-[#0055D2] font-mono font-bold uppercase tracking-wider bg-blue-50 border border-blue-105 px-2.5 py-0.5 rounded text-[9px]">INCLUDED IN COURSE</span>
                      </div>

                      <h3 className="font-display font-black text-base text-[#0B132B] tracking-tight group-hover:text-[#0056D2] transition-colors leading-tight">
                        {course.title}
                      </h3>
                      
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(course.skills || ["Prompting", "No Code", "Deployment"]).slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[9px] text-slate-500 font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Instructor Portrait & Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructorAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300"}
                          alt={course.instructorName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[11px] font-black text-slate-700">{course.instructorName}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        {course.studentCount} Alumni
                      </span>
                    </div>
                  </div>

                  {/* Visual card actions */}
                  <div className="px-6 pb-6 pt-0">
                    <div className="w-full bg-slate-50 group-hover:bg-blue-50 group-hover:text-[#0056D2] text-[#0B132B] py-2.5 rounded-xl text-[11px] font-black text-center transition-all flex items-center justify-center gap-1 select-none border border-slate-150 group-hover:border-blue-100">
                      <span>View Module Details</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-xs max-w-md mx-auto">
            <Filter className="w-10 h-10 text-slate-350 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">No programs match filters</h3>
            <p className="text-xs text-slate-500 mt-1 px-4">Try checking spelling or resetting your Beginner/Advanced tags.</p>
            <button
              onClick={() => { setSelectedLevel("All"); setSearchQuery(""); }}
              className="mt-5 px-5 py-2 bg-[#0B132B] hover:bg-[#15234A] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
