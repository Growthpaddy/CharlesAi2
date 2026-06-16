/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, BookOpen, CheckCircle, Circle, PlayCircle, 
  Trophy, GraduationCap, ChevronRight, Bookmark, ArrowLeft, 
  Hourglass, BarChart3, Clock, Play, CheckSquare, Square
} from "lucide-react";
import { db, Course, CourseModule, Lesson, Enrollment, StudentProgress } from "../lib/db";

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Selected player states
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Tab selections
  const [activeTab, setActiveTab] = useState<"enrolled" | "catalog">("enrolled");

  // Load from db
  const loadDatabaseState = () => {
    setCourses(db.getCourses());
    const enrs = db.getEnrollments();
    setEnrollments(enrs);
    setProgress(db.getStudentProgress());
    setModules(db.getModules());
    setLessons(db.getLessons());

    // Auto select first enrolled course if none selected
    if (enrs.length > 0 && !activeCourseId) {
      setActiveCourseId(enrs[0].courseId);
    }
  };

  useEffect(() => {
    loadDatabaseState();
    // Watch localStorage for updates made elsewhere in application
    const handleStorageChange = () => {
      loadDatabaseState();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Set default lesson when course shifts
  useEffect(() => {
    if (activeCourseId) {
      const courseLessons = lessons.filter(l => l.courseId === activeCourseId);
      if (courseLessons.length > 0) {
        // Pick first uncompleted, or first lesson
        const courseProgress = progress.filter(p => p.courseId === activeCourseId && p.completed);
        const nextUncompleted = courseLessons.find(l => !courseProgress.some(p => p.lessonId === l.id));
        setActiveLessonId(nextUncompleted ? nextUncompleted.id : courseLessons[0].id);
      } else {
        setActiveLessonId(null);
      }
    }
  }, [activeCourseId, lessons]);

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeLesson = lessons.find(l => l.id === activeLessonId);

  // Calculate stats
  const enrolledCoursesList = courses.filter(c => enrollments.some(e => e.courseId === c.id));
  const catalogCoursesList = courses.filter(c => !enrollments.some(e => e.courseId === c.id));
  
  const totalCompletedLessons = progress.filter(p => p.completed).length;
  const enrolledLessons = lessons.filter(l => enrollments.some(e => e.courseId === l.courseId));
  const totalLessonsInEnrolled = enrolledLessons.length;
  const overallCompletionsPct = totalLessonsInEnrolled > 0 
    ? Math.round((progress.filter(p => p.completed && enrolledLessons.some(el => el.id === p.lessonId)).length / totalLessonsInEnrolled) * 100) 
    : 0;

  // Single Course completions calculation helper
  const getCourseProgressPct = (courseId: string) => {
    const courseLessons = lessons.filter(l => l.courseId === courseId);
    if (courseLessons.length === 0) return 0;
    const completedForCourse = progress.filter(p => p.courseId === courseId && p.completed);
    return Math.round((completedForCourse.length / courseLessons.length) * 100);
  };

  const handleToggleLessonComplete = (lessonId: string, isCompleted: boolean) => {
    if (!activeCourseId) return;
    const updated = db.toggleLessonProgress(activeCourseId, lessonId, isCompleted);
    setProgress(updated);
    // Send standard storage event to update other components
    window.dispatchEvent(new Event("storage"));
  };

  const handleEnrollNow = (courseId: string) => {
    const updated = db.enrollInCourse(courseId);
    setEnrollments(updated);
    setActiveCourseId(courseId);
    setActiveTab("enrolled");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div id="student-dashboard" className="min-h-screen bg-[#F8F9FA] pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* UPPER ACADEMY HERO HEADER */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-[#2D7FF9] px-3 py-1 rounded-full text-[10px] font-sans font-extrabold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-[#2D7FF9]" />
              <span>COGNITIVE STUDENT ACCESS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#08142B] tracking-tight">
              Welcome Back, Active Student
            </h2>
            <p className="text-gray-400 text-xs font-semibold leading-none">
              AI Online Business Academy &bull; Student ID: AIOB-37492
            </p>
          </div>

          {/* Rapid Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 divide-x divide-gray-100">
            <div className="text-center px-4 space-y-1">
              <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase tracking-wider">Programs</span>
              <span className="text-xl font-black text-[#08142B] font-display">{enrolledCoursesList.length}</span>
            </div>
            <div className="text-center px-4 space-y-1">
              <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase tracking-wider">Completed</span>
              <span className="text-xl font-black text-emerald-600 font-display">{totalCompletedLessons} lessons</span>
            </div>
            <div className="text-center px-4 space-y-1">
              <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase tracking-wider">Progress</span>
              <span className="text-xl font-black text-[#2D7FF9] font-display">{overallCompletionsPct}%</span>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveTab("enrolled")}
            className={`pb-4 px-2 font-display text-sm font-bold transition-all relative ${
              activeTab === "enrolled" ? "text-[#08142B]" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span>My Active Studies ({enrolledCoursesList.length})</span>
            {activeTab === "enrolled" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D7FF9] rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("catalog")}
            className={`pb-4 px-2 font-display text-sm font-bold transition-all relative ${
              activeTab === "catalog" ? "text-[#08142B]" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span>Academy Courses Catalog ({catalogCoursesList.length})</span>
            {activeTab === "catalog" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D7FF9] rounded-full" />
            )}
          </button>
        </div>

        {/* VIEW 1: ACTIVE STUDIES (PLAYER ROUTE) */}
        {activeTab === "enrolled" && (
          <>
            {enrolledCoursesList.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2D7FF9] flex items-center justify-center mx-auto text-xl">
                  📖
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#08142B]">No Active Enrollments Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Unlock access to some of our official AI Online Business courses in our dynamic listing catalog tab!
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="bg-[#08142B] hover:bg-[#2D7FF9] text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* MIDDLE/LEFT: PLAYER CONSOLE & STUDY CARD (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {activeCourse && activeLesson ? (
                    <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
                      
                      {/* Interactive Video simulated Box */}
                      <div className="aspect-video bg-slate-900 relative flex items-center justify-center text-white border-b border-gray-100 group">
                        
                        {/* Mock elegant thumbnail screen */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-xs" style={{ backgroundImage: `url(${activeCourse.thumbnail})` }} />
                        
                        <div className="relative z-10 text-center space-y-4 px-6">
                          <PlayCircle className="w-16 h-16 text-[#FCF50F] mx-auto animate-pulse group-hover:scale-105 transition-transform cursor-pointer" />
                          <div className="space-y-1">
                            <h4 className="font-display font-black text-lg md:text-xl text-white tracking-tight">{activeLesson.title}</h4>
                            <p className="text-xs text-slate-350 font-mono">Lecture Duration: {activeLesson.duration} mins &bull; Course: {activeCourse.title}</p>
                          </div>
                        </div>

                        {/* Video watermark brand */}
                        <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-[#FCF50F] font-mono text-[9px] px-2.5 py-1 rounded-md uppercase tracking-widest leading-none">
                          AI ONLINE BUSINESS
                        </span>
                      </div>

                      {/* Lesson Context Control Strip */}
                      <div className="p-6 sm:p-8 space-y-6">
                        
                        {/* Upper row completion switcher */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Active Lecture Synopsis</span>
                            <h3 className="font-display font-black text-[#08142B] text-xl leading-tight">{activeLesson.title}</h3>
                          </div>

                          <button
                            onClick={() => {
                              const isCurrentlyCompleted = progress.some(p => p.lessonId === activeLesson.id && p.completed);
                              handleToggleLessonComplete(activeLesson.id, !isCurrentlyCompleted);
                            }}
                            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-2 border min-h-[44px] ${
                              progress.some(p => p.lessonId === activeLesson.id && p.completed)
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : "bg-gray-50 border-gray-200 hover:bg-[#08142B] hover:text-white hover:border-transparent text-[#08142B]"
                            }`}
                          >
                            {progress.some(p => p.lessonId === activeLesson.id && p.completed) ? (
                              <>
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                                <span>Completed! Click to Undo</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-4 h-4" />
                                <span>Mark Lesson Complete</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Module overview text */}
                        <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-semibold">
                          <p>{activeLesson.content}</p>
                          <p className="text-slate-400 font-normal leading-normal">
                            All students are required to review the video above comprehensively twice. Try compiling standard outcomes, editing experimental prompts inside models (e.g. ChatGPT, Claude, Grok), saving parameters in documents databases, and reporting accomplishments to Sandra Cole or instructors during group training office clinics.
                          </p>
                        </div>

                        {/* Learning Outcomes checklists */}
                        <div className="bg-slate-50 rounded-2xl p-5 border border-gray-150/60 text-left space-y-3.5">
                          <h4 className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase">Active Course Core Skills:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                            {activeCourse.skills.map((s, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-[#2D7FF9] text-sm">&bull;</span>
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  ) : (
                    <div className="bg-white border text-center p-12 rounded-3xl text-gray-400 font-secondary">
                      No lecture selected. Choose standard items in the right console tracker.
                    </div>
                  )}

                </div>

                {/* RIGHT: COMPREHENSIVE COURSE NAVIGATOR & PROGRESS (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Select Enrolled Studies dropdown/cards list */}
                  <div className="bg-white border border-gray-150 rounded-3xl p-6 space-y-4 shadow-sm text-left">
                    <h3 className="font-sans font-extrabold text-sm text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-2">
                      Selector Console:
                    </h3>
                    
                    <div className="space-y-2.5 max-h-[190px] overflow-y-auto scrollbar-none">
                      {enrolledCoursesList.map((c) => {
                        const pctComp = getCourseProgressPct(c.id);
                        return (
                          <button
                            key={c.id}
                            onClick={() => setActiveCourseId(c.id)}
                            className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              activeCourseId === c.id
                                ? "bg-[#08142B] text-white border-transparent shadow"
                                : "bg-white hover:bg-gray-50 border-gray-200 text-slate-800"
                            }`}
                          >
                            <div className="space-y-1 overflow-hidden">
                              <h4 className="font-sans font-bold text-[12.5px] truncate max-w-[210px]">{c.title}</h4>
                              <div className="flex items-center gap-2 text-[10.5px]">
                                <span className={activeCourseId === c.id ? "text-slate-300" : "text-gray-400"}>{pctComp}% finished</span>
                                <span className="text-gray-300">|</span>
                                <span className={activeCourseId === c.id ? "text-amber-300" : "text-blue-600"}>{c.duration}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE SYLLABUS SYNC CLOCK INDEX */}
                  {activeCourse && (
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 space-y-4 shadow-sm text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Lectures Hierarchy</span>
                        <h3 className="font-display font-extrabold text-[#08142B] text-base leading-tight">Course Outline Syllabus</h3>
                      </div>

                      {/* Scrollable list of modules & lessons */}
                      <div className="space-y-4 max-h-[380px] overflow-y-auto scrollbar-none pr-1">
                        {modules
                          .filter(m => m.courseId === activeCourse.id)
                          .sort((a,b) => a.sortOrder - b.sortOrder)
                          .map((mod) => {
                            const modLessons = lessons.filter(l => l.moduleId === mod.id);
                            return (
                              <div key={mod.id} className="space-y-2">
                                <h4 className="font-sans font-bold text-xs text-[#08142B] border-b border-slate-100 pb-1 flex justify-between items-center bg-slate-50/70 p-2 rounded-lg">
                                  <span>{mod.title}</span>
                                  <span className="text-[10px] font-mono text-gray-400">{modLessons.length} clips</span>
                                </h4>
                                
                                <div className="space-y-1.5 pl-1.5">
                                  {modLessons.map((l) => {
                                    const isDone = progress.some(p => p.lessonId === l.id && p.completed);
                                    return (
                                      <button
                                        key={l.id}
                                        onClick={() => setActiveLessonId(l.id)}
                                        className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2 border ${
                                          activeLessonId === l.id
                                            ? "bg-blue-50 border-[#2D7FF9] font-bold text-[#0056D2]"
                                            : "bg-white border-transparent hover:bg-gray-50 text-slate-600 font-semibold"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          {isDone ? (
                                            <CheckSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                          ) : (
                                            <Square className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                          )}
                                          <span className="truncate leading-none">{l.title}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 shrink-0 font-mono">{l.duration}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}
          </>
        )}

        {/* VIEW 2: FULL COURSES CATALOG TABS */}
        {activeTab === "catalog" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalogCoursesList.map((c) => (
              <div key={c.id} className="bg-white border border-gray-150 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                
                {/* Thumbnail info */}
                <div className="relative aspect-video">
                  <img src={c.thumbnail} alt={c.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-[#08142B] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {c.level}
                  </span>
                </div>

                {/* Content body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-black text-[#2D7FF9] uppercase tracking-wider block">AI ONLINE BUSINESS</span>
                    <h3 className="font-display font-extrabold text-lg text-[#08142B] leading-tight text-left">{c.title}</h3>
                    <p className="text-xs text-slate-500 text-left line-clamp-2 leading-relaxed">{c.description}</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center text-[11px] font-mono font-bold text-gray-400 border-t border-gray-50 pt-3">
                      <span>🕒 {c.duration}</span>
                      <span>⭐ Rating: {c.rating}</span>
                    </div>

                    <button
                      onClick={() => handleEnrollNow(c.id)}
                      className="w-full bg-[#2D7FF9] hover:bg-[#08142B] text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Unlock & Enroll Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {catalogCoursesList.length === 0 && (
              <div className="col-span-full bg-white border border-gray-150 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-2">
                <Trophy className="w-12 h-12 text-[#FCF50F] mx-auto" />
                <h3 className="font-display font-extrabold text-lg text-[#08142B]">All Academy Courses Enrolled</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Congratulations! You have unlocked all 12 modules of the AI Online Business Academy. Learn, complete modules, and start building high-value business systems.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
