/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Clock, Users, ArrowRight, Lock, Award, BookOpen,
  CheckCircle, ChevronRight, PlayCircle, DollarSign, ArrowLeft, Star, Layers, ShieldCheck
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { db, Course, CourseModule, Lesson } from "../lib/db";

export default function CourseDetailPage() {
  const { navigateTo, activeCourseId, setActiveCourseId } = useNavigation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Load latest state from local db on mount
  useEffect(() => {
    const loadedCourses = db.getCourses();
    const loadedModules = db.getModules();
    const loadedLessons = db.getLessons();
    
    setCourses(loadedCourses);
    setModules(loadedModules);
    setLessons(loadedLessons);

    // Default to the first course or activeCourseId
    const initialId = activeCourseId || (loadedCourses.length > 0 ? loadedCourses[0].id : null);
    if (initialId) {
      const match = loadedCourses.find(c => c.id === initialId);
      if (match) setSelectedCourse(match);
    }
  }, [activeCourseId]);

  // Sync back active status when local selected changes
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveCourseId(course.id);
  };

  if (!selectedCourse) {
    return (
      <div className="pt-32 pb-20 text-center text-slate-705">
        <div className="w-12 h-12 border-4 border-[#0056D2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold">Loading Custom Syllabus Timelines...</p>
      </div>
    );
  }

  // Filter modules and lessons nested inside this course
  const courseModules = modules.filter(m => m.courseId === selectedCourse.id);
  const courseLessons = lessons.filter(l => l.courseId === selectedCourse.id);
  const priceDisplay = selectedCourse.price || "₦45,000";

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#0C1421] font-sans antialiased pb-20">
      
      {/* Visual LMS Header banner */}
      <section className="pt-32 sm:pt-36 pb-12 bg-gradient-to-b from-[#08122B] via-[#0E1B3E] to-[#0A1224] text-white relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[#0056D2]/10 blur-[130px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl text-left">
            <button
              onClick={() => navigateTo("landing")}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FCF50F] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Special Discount Offer
            </button>
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <span className="bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/20">
                LMS ACADEMY PRO
              </span>
              <span className="bg-white/5 text-slate-300 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-white/5">
                Cohort Approved Track
              </span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.05] text-white">
              {selectedCourse.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              {selectedCourse.description}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shrink-0 text-left md:w-80 backdrop-blur-md">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Qualified Cohort Rate
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-black text-[#FCF50F]">{priceDisplay}</span>
              <span className="text-xs text-slate-400 font-medium line-through">₦150,000</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal mb-4">
              * Active Discount applied instantly. Granting lifetime credentials, updates and group sandbox lab links.
            </p>
            <button
              onClick={() => navigateTo("checkout")}
              className="w-full py-3 bg-[#0056D2] hover:bg-blue-600 active:scale-99 text-white hover:text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#4285F4]/30"
            >
              <span>Enroll In Flagship Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main LMS Split Page Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Sidebar course select utility */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-205 rounded-2xl p-4 shadow-sm">
              <h3 className="font-sans font-extrabold text-xs text-slate-900 border-b border-gray-100 pb-2 mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0056D2]" />
                <span>SELECT SYLLABUS SUBJECT</span>
              </h3>
              
              <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
                {courses.map((crs) => {
                  const isCurrent = crs.id === selectedCourse.id;
                  return (
                    <button
                      key={crs.id}
                      onClick={() => handleSelectCourse(crs)}
                      className={`w-full p-2.5 rounded-xl text-[11px] font-bold text-left transition-all flex items-center justify-between gap-1.5 ${
                        isCurrent
                          ? "bg-indigo-50 text-indigo-700 border-l-4 border-l-indigo-600"
                          : "hover:bg-slate-50 text-slate-650"
                      }`}
                    >
                      <span className="truncate pr-1">{crs.title}</span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? "text-indigo-600" : "text-slate-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick trust assurances badge in sidebar */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-850 space-y-3">
              <span className="text-[9px] font-mono font-bold text-emerald-400 block uppercase tracking-wider">★ INCLUDED PERKS</span>
              <div className="space-y-2">
                {[
                  "Complete 12-course bundle access",
                  "Direct contact with course instructors",
                  "Saturday Live Audits sandbox",
                  "WhatsApp group link & resources support",
                  " Selar & SELAR payment ready templates",
                ].map((perk, i) => (
                  <div key={i} className="flex gap-2 items-start text-[10px]">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span className="text-slate-300">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Intensive module lessons list representing actual LMS syllabus */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Intensive Details card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="border-b border-gray-100 pb-5">
                <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight mb-2 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#0056D2]" />
                  <span>Curriculum Outlines & Syllabus Modules</span>
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Our system focuses on practical, modular steps that bypass high-level buzzwords. Review the direct, sequential lessons set up by administrators and tailored to help you launch active automated systems:
                </p>
              </div>

              {/* Course Overview section */}
              {selectedCourse.overview && (
                <div className="space-y-2.5">
                  <h3 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest text-[#0056D2]">
                    High-Performance Academic Overview
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-normal">
                    {selectedCourse.overview}
                  </p>
                </div>
              )}

              {/* Syllabus Outline module cards */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest text-[#0056D2] mb-3">
                  System Modules & Lesson Sequences ({courseModules.length} Modules)
                </h3>

                {courseModules.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-slate-500">Modules are being synced currently...</p>
                    <p className="text-[10px] text-slate-400 mt-1">Please explore other catalog items using the list to the left.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courseModules.map((mod, modIdx) => {
                      const modLessons = courseLessons.filter(l => l.moduleId === mod.id);
                      return (
                        <div key={mod.id} className="bg-[#FAFBFD] border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-400/30 transition-all shadow-xs">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 flex-wrap gap-2">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-[#0056D2] font-black uppercase tracking-wider">
                                MODULE {modIdx + 1}
                              </span>
                              <h4 className="font-sans font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                                {mod.title}
                              </h4>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 px-2.5 py-1 rounded-full uppercase">
                              {modLessons.length} Practice lessons
                            </span>
                          </div>

                          {modLessons.length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic">No structured lessons yet in this module.</p>
                          ) : (
                            <div className="divide-y divide-slate-100 bg-white border border-gray-150 rounded-xl overflow-hidden shadow-2xs">
                              {modLessons.map((les, lesIdx) => (
                                <div key={les.id} className="p-3.5 hover:bg-slate-5.0 transition-all flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                                  <div className="flex items-start gap-3">
                                    <span className="w-5 h-5 rounded-full bg-[#0056D2]/10 text-[#0056D2] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                      {lesIdx + 1}
                                    </span>
                                    <div className="space-y-0.5 text-left">
                                      <p className="text-xs font-bold text-slate-900">{les.title}</p>
                                      <p className="text-[10px] text-slate-500 font-normal leading-relaxed">{les.content}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-400 shrink-0 select-none">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="font-mono text-[10px] font-extrabold">{les.duration}</span>
                                    <Lock className="w-3.5 h-3.5 ml-1.5 text-slate-400 group-hover:text-slate-600 transition" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Skills and Outcomes grid below syllabus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 text-left">
                <div className="space-y-2.5">
                  <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest text-[#0056D2] flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Skills You Will Acquire</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCourse.skills ? (
                      selectedCourse.skills.map((sk, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-mono font-semibold">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Included standard system building competencies.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-sans font-bold text-xs text-slate-900 uppercase tracking-widest text-[#0056D2] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Expected Syllabus Outcomes</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedCourse.outcomes ? (
                      selectedCourse.outcomes.map((ot, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-650">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>{ot}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-400 italic">Graduation with active system launching capability.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Premium checkout CTA banner at bottom of card */}
              <div className="mt-8 bg-gradient-to-r from-indigo-900 to-[#0A1224] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-950">
                <div className="absolute inset-0 bg-white/5 opacity-5 pointer-events-none" />
                <div className="text-left space-y-2 max-w-lg z-10">
                  <span className="text-[10px] text-[#FCF50F] font-mono font-bold uppercase tracking-wider block">LIMITED SLOT CREDENTIALS</span>
                  <h4 className="font-sans text-lg sm:text-xl font-black text-white leading-none">
                    Claim Lifetime Course Pack Access
                  </h4>
                  <p className="text-slate-300 text-xs">
                    Lock in today&apos;s special discount price of {priceDisplay}. This includes cohort Discord rights, Saturday audit sessions, and WhatsApp mastermind credentials.
                  </p>
                </div>
                
                <button
                  onClick={() => navigateTo("checkout")}
                  className="px-8 py-3.5 bg-[#FCF50F] hover:bg-[#EAE20E] text-slate-900 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 cursor-pointer whitespace-nowrap"
                >
                  Register &amp; Claim Discount &rarr;
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
