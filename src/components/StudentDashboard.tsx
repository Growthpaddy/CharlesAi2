import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, BookOpen, CheckCircle, PlayCircle, Trophy, 
  Hourglass, Play, CheckSquare, Square, Lock, Mail, 
  User, Phone, LogOut, ChevronDown, ChevronUp, AlertCircle, HelpCircle, ArrowLeft, RefreshCw
} from "lucide-react";
import { db, Course, CourseModule, Lesson } from "../lib/db";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useNavigation } from "../context/NavigationContext";
import CertificateService from "./CertificateService";

export default function StudentDashboard() {
  const { navigateTo } = useNavigation();

  // Authentication & session state
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [studentStatus, setStudentStatus] = useState<"pending" | "active">("pending");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  
  // LMS static databases (with fallbacks)
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Local Accordion Open/Close states
  const [accordionA, setAccordionA] = useState(true);
  const [accordionB, setAccordionB] = useState(false);
  const [accordionC, setAccordionC] = useState(false);

  // Active video player state
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lockedTooltipId, setLockedTooltipId] = useState<string | null>(null);

  // Load database structures
  useEffect(() => {
    setCourses(db.getCourses());
    setModules(db.getModules());
    setLessons(db.getLessons());
  }, []);

  // Fetch student status & completed lessons
  const fetchStudentData = async () => {
    try {
      if (supabase && isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // If no active auth user, redirect back to login page
          localStorage.clear();
          navigateTo("log-in");
          return;
        }

        // Fetch official profile from public.students table
        const { data: studentRecord, error } = await supabase
          .from("students")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (studentRecord) {
          setStudentProfile(studentRecord);
          const status = (studentRecord.status || "Pending").toLowerCase() === "active" ? "active" : "pending";
          setStudentStatus(status);
          
          localStorage.setItem("student_logged_in_name", studentRecord.full_name);
          localStorage.setItem("student_logged_in_email", studentRecord.email);
          localStorage.setItem("student_logged_in_id", studentRecord.id);
          localStorage.setItem("student_logged_in_status", status);
        } else {
          // Fallback to checking the profiles table
          const { data: profileRecord } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (profileRecord) {
            setStudentProfile(profileRecord);
            const status = (profileRecord.status || "Pending").toLowerCase() === "active" ? "active" : "pending";
            setStudentStatus(status);
            localStorage.setItem("student_logged_in_name", profileRecord.full_name);
            localStorage.setItem("student_logged_in_status", status);
          } else {
            // Manual local mock profile creation to allow seamless preview testing
            const fallbackStudent = {
              id: user.id,
              full_name: user.email?.split("@")[0].toUpperCase() || "Sandbox Student",
              email: user.email || "",
              status: "Pending",
              enrolled_courses: ["course-2"]
            };
            setStudentProfile(fallbackStudent);
            setStudentStatus("pending");
          }
        }

        // Fetch completed student_progress for this student
        const { data: progressData, error: progressError } = await supabase
          .from("student_progress")
          .select("lesson_id, completed")
          .like("id", `${user.id}_%`);

        if (!progressError && progressData && progressData.length > 0) {
          const completedIds = progressData
            .filter((row: any) => row.completed === true || row.completed === "true" || row.completed === 1)
            .map((row: any) => row.lesson_id);
          setCompletedLessonIds(completedIds);
        } else {
          // Fallback to fetch completed user_lessons if student_progress is empty for this user
          const { data: userLessonsData } = await supabase
            .from("user_lessons")
            .select("lesson_id")
            .eq("user_id", user.id)
            .eq("completed", true);

          if (userLessonsData) {
            setCompletedLessonIds(userLessonsData.map((row: any) => row.lesson_id));
          }
        }
      } else {
        // Fallback simulation for sandbox environments (Offline)
        const isStudentAuth = localStorage.getItem("is_student_authenticated") === "true";
        if (!isStudentAuth) {
          navigateTo("log-in");
          return;
        }

        const name = localStorage.getItem("student_logged_in_name") || "Sandbox Student";
        const email = localStorage.getItem("student_logged_in_email") || "student@academy.com";
        const id = localStorage.getItem("student_logged_in_id") || "sandbox-std-id";
        const status = (localStorage.getItem("student_logged_in_status") || "pending") as "pending" | "active";

        setStudentProfile({
          id,
          full_name: name,
          email,
          status,
          enrolled_courses: ["course-2"]
        });
        setStudentStatus(status);

        // Load mock completed lessons
        const savedCompleted = localStorage.getItem(`completed_lessons_${id}`);
        if (savedCompleted) {
          setCompletedLessonIds(JSON.parse(savedCompleted));
        }
      }
    } catch (err) {
      console.error("Error building student session gate:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [navigateTo]);

  // Handle Logout Action
  const handleLogout = async () => {
    setLoading(true);
    try {
      if (supabase && isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Sign out err:", err);
    } finally {
      // Purge cached states
      localStorage.removeItem("is_student_authenticated");
      localStorage.removeItem("student_logged_in_name");
      localStorage.removeItem("student_logged_in_email");
      localStorage.removeItem("student_logged_in_id");
      localStorage.removeItem("student_logged_in_status");
      localStorage.removeItem("student_logged_in_phone");
      
      navigateTo("log-in");
    }
  };

  // Toggle Lesson Completion status
  const handleMarkComplete = async (lessonId: string, courseId: string) => {
    const isCompleted = completedLessonIds.includes(lessonId);
    let newCompletedList = [...completedLessonIds];

    if (isCompleted) {
      newCompletedList = newCompletedList.filter(id => id !== lessonId);
    } else {
      newCompletedList.push(lessonId);
    }

    setCompletedLessonIds(newCompletedList);

    try {
      if (supabase && isSupabaseConfigured) {
        const uId = studentProfile?.id;
        if (uId) {
          const recordId = `${uId}_${lessonId}`;
          
          // Upsert to student_progress table
          await supabase.from("student_progress").upsert({
            id: recordId,
            course_id: courseId,
            lesson_id: lessonId,
            completed: !isCompleted,
            completed_at: new Date().toISOString()
          });

          // Also upsert to user_lessons table for backward compatibility
          await supabase.from("user_lessons").upsert({
            id: recordId,
            user_id: uId,
            course_id: courseId,
            lesson_id: lessonId,
            completed: !isCompleted,
            completed_at: new Date().toISOString()
          });
        }
      } else {
        const uId = studentProfile?.id || "sandbox-std-id";
        localStorage.setItem(`completed_lessons_${uId}`, JSON.stringify(newCompletedList));
      }
    } catch (err) {
      console.error("Failed saving progression tag:", err);
    }
  };

  // Helper check to verify if a lesson is locked under linear progress constraints
  const getIsLessonLocked = (lesson: Lesson, moduleLessons: Lesson[]) => {
    const sortedModuleLessons = [...moduleLessons].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );
    const index = sortedModuleLessons.findIndex(l => l.id === lesson.id);
    if (index <= 0) return false; // First lesson is unlocked

    // Check if any preceding lesson in this module is not complete
    for (let i = 0; i < index; i++) {
      if (!completedLessonIds.includes(sortedModuleLessons[i].id)) {
        return true;
      }
    }
    return false;
  };

  const handleLessonClick = (lesson: Lesson, moduleLessons: Lesson[]) => {
    const isLocked = getIsLessonLocked(lesson, moduleLessons);
    if (isLocked) {
      setLockedTooltipId(lesson.id);
      setTimeout(() => {
        setLockedTooltipId(null);
      }, 3000);
      return;
    }
    setActiveLesson(lesson);
  };

  // SOS WhatsApp configurations
  const whatsappMessage = "Hello Support, I am experiencing a login difficulty accessing my student dashboard account. Kindly assist with my activation status.";
  const whatsappUrl = `https://wa.me/2347068300818?text=${encodeURIComponent(whatsappMessage)}`;

  // Loading state visual guard
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Synchronizing Live Student Portal...</p>
      </div>
    );
  }

  // PENDING MICRO-STATE LAYOUT
  if (studentStatus === "pending") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16 text-white relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-amber-950/15 blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800/80 p-8 rounded-3xl shadow-2xl text-center space-y-6 relative z-10">
          <div className="mx-auto w-16 h-16 bg-amber-950/40 rounded-full flex items-center justify-center border border-amber-800/50">
            <Hourglass className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
          
          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Account Pending Activation
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Welcome, <span className="text-amber-400 font-bold">{studentProfile?.full_name || "Student"}</span>. Your registration is successful. An administrator is currently verifying your course fee payment transaction. Once cleared, you will receive full active access to the study curriculum dashboard.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800/50 rounded-2xl text-left space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Institutional Notice
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If you have already submitted your payment proof and wish to accelerate activation, please tap below to coordinate directly with our student onboarding assistants.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer w-full justify-center shadow-lg"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.488 2.01 14.039.987 11.99.987 6.558.987 2.13 5.36 2.127 10.79c-.001 1.748.473 3.456 1.372 4.975l-.973 3.55 3.642-.955zM17.15 14.39c-.28-.14-1.65-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.28-.73.9-.9 1.1-.17.19-.34.21-.62.07-1.42-.71-2.34-1.28-3.23-2.82-.23-.4-.23-.74-.09-.88.13-.13.28-.34.42-.51.14-.17.19-.29.28-.49.09-.19.04-.37-.02-.51-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.51.07-.78.36-.27.29-1.03 1.01-1.03 2.46s1.05 2.85 1.2 3.05c.15.19 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.62.71.22 1.35.19 1.86.12.57-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.12-.26-.19-.54-.33z" />
              </svg>
              <span>Coordinate via WhatsApp (07068300818)</span>
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="text-xs text-slate-500 hover:text-slate-400 font-semibold underline cursor-pointer"
            >
              Log out and change account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE PLAYER FULL-SCREEN VIEWER
  if (isPlayerOpen && activeCourse) {
    const courseModules = modules.filter(m => m.courseId === activeCourse.id);
    const sortedModules = [...courseModules].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    // Fallback if no lesson is actively selected yet
    const allCourseLessons = lessons.filter(l => l.courseId === activeCourse.id);
    const currentActiveLesson = activeLesson || allCourseLessons[0];

    // Calculate course progress based on active completed lessons fetched from the database
    const totalLessonsCount = allCourseLessons.length;
    const completedCourseLessons = allCourseLessons.filter(l => completedLessonIds.includes(l.id));
    const completedLessonsCount = completedCourseLessons.length;
    const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        {/* Course Player Sticky Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              setIsPlayerOpen(false);
              setActiveLesson(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Course Player</span>
          </button>
          
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Study Room</p>
            <p className="text-xs font-bold text-blue-400 truncate max-w-xs">{activeCourse.title}</p>
          </div>
        </div>

        {/* Visual Course Completion Progress Bar Gauge */}
        <div id="course-completion-progress-banner" className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-slate-300">Course Progress:</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900/40 px-2.5 py-0.5 rounded-full">
              {progressPercent}% Complete
            </span>
            <span className="text-xs font-medium text-slate-400">
              ({completedLessonsCount} of {totalLessonsCount} lessons cleared)
            </span>
          </div>

          {/* Tooltip Wrapper with Hover triggers */}
          <div className="relative group flex-grow max-w-md w-full pt-4 pb-2 md:py-1">
            {/* Completion Milestone Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 border border-slate-700/80 text-white rounded-xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out whitespace-nowrap text-xs font-semibold flex items-center gap-2 z-50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Completion Milestone</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-emerald-400 font-mono font-bold">
                {completedLessonsCount} of {totalLessonsCount} Lessons Completed
              </span>
              {/* Tooltip bottom indicator arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-700/80" />
            </div>

            {/* Progress Track Container */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800/80 p-[1px] hover:border-slate-700 transition-colors cursor-help">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
              />
            </div>
          </div>
        </div>

        {/* Main Split Layout: Left Modules Map (35%), Right Video Player Canvas (65%) */}
        <div className="flex-1 flex flex-col lg:flex-row">
          
          {/* LEFT COLUMN: MODULES & LESSONS MAP */}
          <div className="w-full lg:w-[35%] bg-slate-900 border-r border-slate-800/80 p-6 overflow-y-auto max-h-[400px] lg:max-h-[calc(100vh-73px)] divide-y divide-slate-800/50">
            <h3 className="text-xs font-mono text-slate-400 uppercase font-black tracking-widest mb-4">
              Curriculum Roadmap
            </h3>
            
            <div className="space-y-4 pt-2">
              {sortedModules.map((mod, modIdx) => {
                const moduleLessons = lessons.filter(l => l.moduleId === mod.id);
                const sortedModuleLessons = [...moduleLessons].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

                return (
                  <div key={mod.id} className="space-y-2 pt-2 first:pt-0">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-950 border border-blue-900 text-blue-400 text-[10px] flex items-center justify-center font-mono">
                        {modIdx + 1}
                      </span>
                      <span>{mod.title}</span>
                    </p>

                    <div className="space-y-1.5 pl-7">
                      {sortedModuleLessons.map((les) => {
                        const isCompleted = completedLessonIds.includes(les.id);
                        const isSelected = currentActiveLesson?.id === les.id;
                        const isLocked = getIsLessonLocked(les, moduleLessons);

                        return (
                          <div key={les.id} className="space-y-1">
                            <button
                              onClick={() => handleLessonClick(les, moduleLessons)}
                              className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer border ${
                                isSelected 
                                  ? "bg-blue-600/10 border-blue-500 text-white" 
                                  : isLocked
                                    ? "bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed"
                                    : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {isCompleted ? (
                                  <CheckSquare className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <Square className="w-4.5 h-4.5 text-slate-600 shrink-0" />
                                )}
                                <span className="text-[11.5px] font-semibold truncate leading-tight">
                                  {les.title}
                                </span>
                              </div>
                              
                              <span className="text-[9px] font-mono text-slate-500 shrink-0 ml-1">
                                {les.duration}
                              </span>
                            </button>

                            {/* Sequential Lock Warning Inline Tool-Tip */}
                            <AnimatePresence>
                              {lockedTooltipId === les.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="text-[10px] bg-rose-950/40 border border-rose-900/40 text-rose-300 p-2 rounded-lg font-medium leading-tight text-left"
                                >
                                  ⚠️ Please complete previous lesson criteria to advance.
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: VIDEO PLAYER CANVAS */}
          <div className="w-full lg:w-[65%] bg-slate-950 p-6 flex flex-col justify-between max-h-[calc(100vh-73px)] overflow-y-auto">
            
            {currentActiveLesson ? (
              <div className="space-y-6">
                
                {progressPercent === 100 && (
                  <div className="mb-2">
                    <CertificateService
                      studentName={studentProfile?.full_name || "Authorized Student"}
                      courseTitle={activeCourse.title}
                      courseId={activeCourse.id}
                      studentId={studentProfile?.id || "sandbox-std-id"}
                    />
                  </div>
                )}
                
                {/* Header controls inside canvas */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-left">
                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-black">Active Module Video</span>
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">{currentActiveLesson.title}</h2>
                  </div>

                  <button
                    onClick={() => handleMarkComplete(currentActiveLesson.id, activeCourse.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border ${
                      completedLessonIds.includes(currentActiveLesson.id)
                        ? "bg-emerald-600/10 border-emerald-500 text-emerald-400 hover:bg-emerald-600/20"
                        : "bg-blue-600 hover:bg-blue-500 text-white border-transparent"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{completedLessonIds.includes(currentActiveLesson.id) ? "Lesson Completed!" : "Mark as Complete"}</span>
                  </button>
                </div>

                {/* Cinematic player frame */}
                <div className="relative aspect-video w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                  {currentActiveLesson.videoUrl ? (
                    <iframe
                      src={currentActiveLesson.videoUrl}
                      title={currentActiveLesson.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <PlayCircle className="w-12 h-12 text-slate-600" />
                      <p className="text-xs font-mono uppercase tracking-widest">No Streaming Feed Configured</p>
                    </div>
                  )}
                </div>

                {/* Video description copy */}
                <div className="bg-slate-900/40 border border-slate-800/40 p-6 rounded-2xl space-y-3 text-left">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Lesson Guidelines & Resources
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                    {currentActiveLesson.content || "No lesson description guidelines have been customized for this section."}
                  </p>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3 py-16">
                <BookOpen className="w-12 h-12 text-slate-700" />
                <p className="text-xs font-mono uppercase tracking-widest text-slate-600">Select a lesson from the curriculum blueprint to play video</p>
              </div>
            )}
            
          </div>

        </div>
      </div>
    );
  }

  // ACTIVE MAIN WORKSPACE
  // Filter active student's courses
  const enrolledCourseIds = studentProfile?.enrolled_courses || ["course-2"];
  const enrolledCoursesList = courses.filter(c => enrolledCourseIds.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      
      {/* ULTRA-MINIMAL ACTIVE WORKSPACE HEADER */}
      <div className="bg-slate-900 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black block mb-1">
              Student Workspace
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
              {studentProfile?.full_name || "Authorized Student"}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-slate-700/50"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* CORE WORKSPACE TRIPLE ACCORDION CONTAINER */}
      <div className="max-w-4xl mx-auto px-6 py-8 sm:py-12 space-y-4">
        
        {/* ACCORDION A: ENROLLED COURSE */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden transition-all shadow-md">
          <button
            onClick={() => setAccordionA(!accordionA)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="font-display text-sm sm:text-base font-extrabold uppercase tracking-wide">
                Enrolled Course
              </h3>
            </div>
            {accordionA ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          <AnimatePresence initial={false}>
            {accordionA && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-slate-800/40 bg-slate-950/40"
              >
                <div className="p-6">
                  {enrolledCoursesList.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enrolledCoursesList.map((course) => {
                          const courseLessons = lessons.filter(l => l.courseId === course.id);
                          const totalCount = courseLessons.length;
                          const completedCount = courseLessons.filter(l => completedLessonIds.includes(l.id)).length;
                          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                          return (
                            <div
                              key={course.id}
                              onClick={() => {
                                setActiveCourse(course);
                                setIsPlayerOpen(true);
                              }}
                              className="bg-slate-900 border border-slate-800 hover:border-blue-500/80 rounded-2xl overflow-hidden transition-all cursor-pointer group shadow-lg text-left flex flex-col justify-between"
                            >
                              <div>
                                <div className="relative h-44 w-full bg-slate-800">
                                  {course.thumbnail ? (
                                    <img
                                      src={course.thumbnail}
                                      alt={course.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-600 font-mono text-[10px]">No Thumbnail</div>
                                  )}
                                  
                                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-md font-mono uppercase tracking-wider">
                                    Enrolled
                                  </div>

                                  {percent === 100 && (
                                    <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[9px] font-black rounded-md font-mono uppercase tracking-wider shadow-md flex items-center gap-1">
                                      <Trophy className="w-3.5 h-3.5" />
                                      <span>Graduated</span>
                                    </div>
                                  )}
                                </div>

                                <div className="p-5 space-y-2.5">
                                  <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                  </h4>
                                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                                    {course.description}
                                  </p>

                                  {/* Progress bar inside card */}
                                  <div className="pt-2 space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-mono">
                                      <span className="text-slate-500">Curriculum Progress</span>
                                      <span className={percent === 100 ? "text-amber-400 font-bold animate-pulse" : "text-blue-400 font-bold"}>
                                        {percent}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850 p-[1px]">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          percent === 100 ? "bg-gradient-to-r from-amber-500 to-emerald-500" : "bg-blue-600"
                                        }`}
                                        style={{ width: `${percent}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-5 pt-0">
                                <div className="pt-2.5 flex items-center justify-between border-t border-slate-800/60 text-[10.5px] font-mono text-slate-500">
                                  <span>Instructor: {course.instructorName || "Sandra Cole"}</span>
                                  <span className="text-blue-400 font-bold uppercase tracking-wider group-hover:underline flex items-center gap-1">
                                    Launch Player <Play className="w-3 h-3 text-blue-400 fill-current" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Render Certificate Claim Panels for any completed courses */}
                      {enrolledCoursesList.map((course) => {
                        const courseLessons = lessons.filter(l => l.courseId === course.id);
                        const totalCount = courseLessons.length;
                        const completedCount = courseLessons.filter(l => completedLessonIds.includes(l.id)).length;
                        const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                        if (percent === 100) {
                          return (
                            <div key={`cert-claim-${course.id}`} className="mt-4 border-t border-slate-800/60 pt-6">
                              <CertificateService
                                studentName={studentProfile?.full_name || "Authorized Student"}
                                courseTitle={course.title}
                                courseId={course.id}
                                studentId={studentProfile?.id || "sandbox-std-id"}
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-2 text-slate-500">
                      <BookOpen className="w-10 h-10 mx-auto text-slate-700" />
                      <p className="text-xs font-mono uppercase tracking-widest text-slate-600">No Authorized Subscribed Courses Detected</p>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">Please secure course fee payments or contact customer onboarding coordinators to authorize access to modules.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACCORDION B: SUPPORT */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden transition-all shadow-md">
          <button
            onClick={() => setAccordionB(!accordionB)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-display text-sm sm:text-base font-extrabold uppercase tracking-wide">
                Support & Vetting Helpdesk
              </h3>
            </div>
            {accordionB ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          <AnimatePresence initial={false}>
            {accordionB && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-slate-800/40 bg-slate-950/40 text-left"
              >
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Need direct campaign reviews, practical prompt optimization diagnostics, or coordination regarding certification? Tap below to open a ticket directly with Coach Charles or our active support systems.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-slate-400">
                    <p className="text-xs"><strong className="text-slate-200">Official Support WhatsApp Line:</strong> 07068300818</p>
                    <p className="text-xs"><strong className="text-slate-200">Operating Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM (West African Time)</p>
                  </div>

                  <div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>Connect with support via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACCORDION C: KNOWLEDGE BASE */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden transition-all shadow-md">
          <button
            onClick={() => setAccordionC(!accordionC)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="font-display text-sm sm:text-base font-extrabold uppercase tracking-wide">
                Knowledge Base & FAQ
              </h3>
            </div>
            {accordionC ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          <AnimatePresence initial={false}>
            {accordionC && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-slate-800/40 bg-slate-950/40 text-left"
              >
                <div className="p-6 space-y-5">
                  <div className="space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      When will my official certificate be ready for download?
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                      Once all modules are marked complete, and your live campaign pitches are successfully evaluated and approved by Coach Charles, your graduation certificate will generate automatically in the system.
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-800/40 pt-4">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      Can I study and build application campaigns on a mobile device?
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                      Absolutely! The video lectures and resource text templates are completely responsive. However, we highly recommend utilizing a laptop or desktop computer during practical development and campaign publishing.
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-800/40 pt-4">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      How do I submit my practical campaigns for vetting?
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                      Inside your Support and Helpdesk panel (Accordion B), tap the direct WhatsApp support line and submit your campaign URLs, Canva design outlines, or Selar link proofs for vetting and review.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
