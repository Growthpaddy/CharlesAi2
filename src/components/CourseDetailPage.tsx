/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, GraduationCap, Video, Layers, Users, Clock, 
  ShoppingCart, CheckCircle2, ChevronDown, ChevronUp, Sparkles,
  BookOpen, Award, ShieldAlert, Zap, Globe, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";

interface CompleteCourseMap {
  id: string;
  title: string;
  tagline?: string;
  overview?: string;
  instructor_name: string;
  instructor_bio?: string;
  price_naira: number;
  thumbnail_url?: string;
  duration_text?: string;
  difficulty?: string;
}

interface ModuleMap {
  id: string;
  title: string;
  module_order: number;
  description?: string;
}

interface LessonMap {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  duration_minutes?: number;
  lesson_order: number;
}

interface CourseDetailPageProps {
  courseId: string;
  onNavigate: (page: string, params?: any) => void;
}

export default function CourseDetailPage({ courseId, onNavigate }: CourseDetailPageProps) {
  const [course, setCourse] = useState<CompleteCourseMap | null>(null);
  const [modules, setModules] = useState<ModuleMap[]>([]);
  const [lessons, setLessons] = useState<LessonMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!courseId) return;
    
    async function loadWholeCurriculumMap() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch Course Core Details
        const { data: cData, error: cErr } = await supabase
          .from("courses")
          .select("id, title, tagline, overview, instructor_name, instructor_bio, price_naira, thumbnail_url, duration_text, difficulty")
          .eq("id", courseId)
          .single();
        
        if (cErr) throw cErr;
        setCourse(cData);

        // 2. Fetch Structural Modules
        const { data: mData, error: mErr } = await supabase
          .from("modules")
          .select("id, title, module_order, description")
          .eq("course_id", courseId)
          .order("module_order", { ascending: true });

        if (mErr) throw mErr;
        const fetchedModules = mData || [];
        setModules(fetchedModules);

        // Default expand the first module for dynamic page visual response
        if (fetchedModules.length > 0) {
          setExpandedModules({ [fetchedModules[0].id]: true });
        }

        // 3. Fetch Curriculum Lessons - Explicitly query non-sensitive metadata only (SECURITY GATE: Exclude video_url)
        const { data: lData, error: lErr } = await supabase
          .from("lessons")
          .select("id, module_id, title, description, duration_minutes, lesson_order")
          .order("lesson_order", { ascending: true });

        if (lErr) throw lErr;
        setLessons(lData || []);

      } catch (err: any) {
        console.error("Error constructing dynamic matrix:", err);
        setError(err.message || "Failed to load core cohort parameters.");
      } finally {
        setIsLoading(false);
      }
    }
    loadWholeCurriculumMap();
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Helper to safely format Nigerian Naira pricing
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center pt-24">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#0056D2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Assembling Syllabus Matrix...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 pt-24 text-left">
        <div className="max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Operational Pipeline Block</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{error || "The requested cohort key could not be resolved from active databases."}</p>
          </div>
          <button 
            onClick={() => onNavigate("programs")}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  const courseCover = course.thumbnail_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=600";
  const difficultyTier = course.difficulty || "Beginner";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800 relative z-10 pt-20">
      
      {/* Visual Navigation Backbar - completely isolated */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 sm:px-8 sticky top-20 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => onNavigate("programs")}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0056D2] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
            <span>Back to Storefront</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Enrolling for Upcoming Cohort</span>
          </div>
        </div>
      </div>

      {/* Cinematic Hero Canvas with soft dark glassmorphism gradient overlay */}
      <div className="relative overflow-hidden bg-[#0A0F1D] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={courseCover}
            alt=""
            className="w-full h-full object-cover filter brightness-30 contrast-110 saturate-75 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-[#0A0F1D]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24 text-left">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COHORT CERTIFIED TRACK</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              {course.title}
            </h1>
            
            {course.tagline && (
              <p className="text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                {course.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
                <Users className="w-4 h-4 text-blue-400" />
                <div className="text-left">
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none mb-0.5">TUTOR</p>
                  <p className="text-xs font-bold text-white leading-none">{course.instructor_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none mb-0.5">DURATION</p>
                  <p className="text-xs font-bold text-white leading-none">{course.duration_text || "Self-Paced Track"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none mb-0.5">Difficulty</p>
                  <p className="text-xs font-bold text-white leading-none">{difficultyTier}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asymmetric Content Split Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Syllabus, Bio, and Overview */}
          <div className="lg:col-span-2 space-y-8 text-left">
            
            {/* Overview / Narrative Description */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#0056D2] flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Cohort Narrative Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {course.overview || "Join dynamic curriculum workflows built to integrate theoretical operational paradigms with applied industrial frameworks. Gain core verification certifications accepted globally."}
              </p>
            </div>

            {/* Curriculum Accordion Matrix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Syllabus Curriculum Map
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full">
                  {modules.length} modules
                </span>
              </div>

              {modules.length === 0 ? (
                <div className="bg-white border border-slate-200/60 rounded-2xl p-8 text-center italic text-xs text-slate-400">
                  No structural modules populated for this track yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {modules.map((mod, idx) => {
                    const isOpen = !!expandedModules[mod.id];
                    const moduleLessons = lessons.filter(l => l.module_id === mod.id);
                    
                    return (
                      <div 
                        key={mod.id} 
                        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
                      >
                        {/* Accordion Trigger Header */}
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 bg-blue-50 text-[#0056D2] text-xs font-bold rounded-lg flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 uppercase">
                                {mod.title}
                              </h4>
                              {mod.description && (
                                <p className="text-[10px] text-slate-400 leading-normal line-clamp-1 mt-0.5">
                                  {mod.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                              {moduleLessons.length} lessons
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </button>

                        {/* Expandable Module Lessons Block */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/30 divide-y divide-slate-100">
                                {moduleLessons.length === 0 ? (
                                  <p className="text-[10px] text-slate-400 italic py-3">
                                    No lesson lectures have been cataloged in this segment.
                                  </p>
                                ) : (
                                  moduleLessons.map((les, lessonIdx) => (
                                    <div 
                                      key={les.id} 
                                      className="py-3 flex items-start justify-between gap-4 text-left"
                                    >
                                      <div className="flex items-start gap-2.5">
                                        <div className="p-1 bg-white border rounded-md shrink-0 text-slate-400 mt-0.5">
                                          <Video className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-800 leading-tight">
                                            {les.title}
                                          </p>
                                          {les.description && (
                                            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                                              {les.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      {les.duration_minutes && (
                                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-100 rounded px-1.5 py-0.5 shrink-0">
                                          {les.duration_minutes}m
                                        </span>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Instructor Bio Profile */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4" /> Lead Academic Coordinator
              </h3>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <div className="w-14 h-14 bg-slate-900 text-white font-black text-xl rounded-2xl flex items-center justify-center uppercase shrink-0 shadow-sm border border-slate-200">
                  {course.instructor_name?.charAt(0) || "T"}
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {course.instructor_name}
                  </h4>
                  <p className="text-xs font-mono font-bold text-blue-600 uppercase">
                    Direct Instruction & Strategy Advisor
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2">
                {course.instructor_bio || "Our courses are directed by applied Nigerian and international operations specialists, providing high-fidelity strategic frameworks for professionals."}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Conversion Card */}
          <div className="space-y-6 lg:sticky lg:top-40">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
              
              {/* Cover Thumbnail Preview */}
              <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 relative group bg-slate-900">
                <img 
                  src={courseCover} 
                  alt="" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-slate-950/25 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/90 text-slate-900 rounded-full flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-5 h-5 stroke-2 text-[#0056D2]" />
                  </div>
                </div>
              </div>

              {/* Fee Investment Block */}
              <div className="space-y-1 text-left">
                <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest leading-none block">Total Enrollment Fee</span>
                <div className="text-3xl font-black text-slate-950 tracking-tight leading-none pt-1">
                  {formatNaira(course.price_naira)}
                </div>
              </div>

              {/* Key Features Badges */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                  <Clock className="w-4 h-4 text-emerald-500 mb-1" />
                  <p className="text-[9px] font-mono text-slate-400 uppercase">DURATION</p>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">{course.duration_text || "Self-Paced"}</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                  <Award className="w-4 h-4 text-amber-500 mb-1" />
                  <p className="text-[9px] font-mono text-slate-400 uppercase">LEVEL</p>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">{difficultyTier}</p>
                </div>
              </div>

              {/* Checkout Enrollment CTA Gate */}
              <button
                onClick={() => onNavigate("checkout", { courseId: course.id })}
                className="w-full py-4 bg-[#0056D2] hover:bg-[#003E9C] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <ShoppingCart className="w-4 h-4" /> Enroll Into Course Now
              </button>

              {/* Guarantees Wrapper */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-left">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0056D2]" /> 
                  <span>Official Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <Zap className="w-4 h-4 text-[#0056D2]" /> 
                  <span>Instant Access to Modules Hub</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <MessageSquare className="w-4 h-4 text-[#0056D2]" /> 
                  <span>Direct Workspace Coordinator QA Support</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <Globe className="w-4 h-4 text-[#0056D2]" /> 
                  <span>Interactive Hybrid Cohort Schedules</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
