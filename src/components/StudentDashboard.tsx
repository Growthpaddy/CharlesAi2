import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, BookOpen, CheckCircle, PlayCircle, Trophy, 
  Hourglass, Play, CheckSquare, Square, Lock, Mail, 
  User, Phone, LogOut, ChevronDown, ChevronUp, AlertCircle, HelpCircle, ArrowLeft, RefreshCw,
  Menu, X, FileText, GraduationCap, MessageSquare, Award, Star
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
  
  // LMS static databases
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

  // Floating collapsible sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<"classroom" | "help" | "docs">("classroom");

  // Global viewport isolation: inject style rule to hide general page headers/navbars/footers
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "hide-global-nav-footer";
    style.innerHTML = `
      header, footer, nav, .global-header, .global-footer, #global-nav, #global-footer, .site-header, .site-footer {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existing = document.getElementById("hide-global-nav-footer");
      if (existing) existing.remove();
    };
  }, []);

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

        let activeProfile = null;

        if (studentRecord) {
          activeProfile = studentRecord;
        } else {
          // Fallback to checking profiles table
          const { data: profileRecord } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();
          if (profileRecord) activeProfile = profileRecord;
        }

        if (activeProfile) {
          setStudentProfile(activeProfile);
          const status = (activeProfile.status || "Pending").toLowerCase() === "active" ? "active" : "pending";
          setStudentStatus(status);
          
          localStorage.setItem("student_logged_in_name", activeProfile.full_name || "");
          localStorage.setItem("student_logged_in_email", activeProfile.email || "");
          localStorage.setItem("student_logged_in_id", activeProfile.id);
          localStorage.setItem("student_logged_in_status", status);
        } else {
          // Manual local mock profile creation if no record exists yet
          const fallbackStudent = {
            id: user.id,
            full_name: user.email?.split("@")[0].toUpperCase() || "Sandbox Student",
            email: user.email || "",
            status: "Pending",
            enrolled_courses: ["course-1", "course-2"]
          };
          setStudentProfile(fallbackStudent);
          setStudentStatus("pending");
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
        // Fallback simulation for offline testing
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
          enrolled_courses: ["course-1", "course-2"]
        });
        setStudentStatus(status);

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
          
          await supabase.from("student_progress").upsert({
            id: recordId,
            course_id: courseId,
            lesson_id: lessonId,
            completed: !isCompleted,
            completed_at: new Date().toISOString()
          });

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

  const getIsLessonLocked = (lesson: Lesson, moduleLessons: Lesson[]) => {
    const sortedModuleLessons = [...moduleLessons].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );
    const index = sortedModuleLessons.findIndex(l => l.id === lesson.id);
    if (index <= 0) return false;

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

  // HELPER METADATA PARSER: Standardizes messy admin database field formats into explicit IDs
  const getEnrolledCourses = (): Course[] => {
    if (!studentProfile) return [];
    
    // Check possible naming formats assigned by your admin portal
    const rawEnrolled = studentProfile.enrolled_courses || studentProfile.enrolled_course || studentProfile.courses;
    
    if (!rawEnrolled) return [];

    let courseIdsArray: string[] = [];

    if (Array.isArray(rawEnrolled)) {
      courseIdsArray = rawEnrolled.map(item => String(item).trim());
    } else if (typeof rawEnrolled === "string") {
      // Handle JSON strings or single comma-separated text blocks
      if (rawEnrolled.startsWith("[") && rawEnrolled.endsWith("]")) {
        try {
          courseIdsArray = JSON.parse(rawEnrolled).map((item: any) => String(item).trim());
        } catch {
          courseIdsArray = [rawEnrolled.trim()];
        }
      } else if (rawEnrolled.includes(",")) {
        courseIdsArray = rawEnrolled.split(",").map(id => id.trim());
      } else {
        courseIdsArray = [rawEnrolled.trim()];
      }
    }

    // Return courses that match, with a global fallback option if it matches nothing
    const assignedCourses = courses.filter(c => courseIdsArray.includes(String(c.id)));
    if (assignedCourses.length === 0 && courses.length > 0) {
      return [courses[0]]; // Fallback sanity checkpoint to guarantee they see a classroom card
    }
    return assignedCourses;
  };

  const enrolledCoursesList = getEnrolledCourses();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-[9999] flex flex-col items-center justify-center text-slate-800">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">Synchronizing Live Student Portal...</p>
      </div>
    );
  }

  if (studentStatus === "pending") {
    return (
      <div className="fixed inset-0 bg-slate-50 z-[9999] flex flex-col items-center justify-center px-4 py-16 text-slate-800 overflow-y-auto">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-lg bg-white border border-slate-200 p-8 rounded-3xl shadow-xl text-center space-y-6 relative z-10">
          <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200">
            <Hourglass className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Account Pending Activation</h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Welcome, <span className="text-amber-600 font-bold">{studentProfile?.full_name || "Student"}</span>. Your registration is successful. An administrator is currently verifying your course access profile. Once approved, you will get instant video player clearance.
            </p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" /> Notice
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">If you want to accelerate your portal profile approval timeline, please contact our student desk team below.</p>
          </div>
          <div className="pt-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full justify-center shadow-md">
              <span>Coordinate via WhatsApp (07068300818)</span>
            </a>
          </div>
          <div className="pt-2">
            <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-slate-800 font-semibold underline cursor-pointer">Log out and change account</button>
          </div>
        </div>
      </div>
    );
  }

  if (isPlayerOpen && activeCourse) {
    const courseModules = modules.filter(m => m.courseId === activeCourse.id);
    const sortedModules = [...courseModules].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const allCourseLessons = lessons.filter(l => l.courseId === activeCourse.id);
    const currentActiveLesson = activeLesson || allCourseLessons[0];
    const totalLessonsCount = allCourseLessons.length;
    const completedCourseLessons = allCourseLessons.filter(l => completedLessonIds.includes(l.id));
    const completedLessonsCount = completedCourseLessons.length;
    const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

    return (
      <div className="fixed inset-0 bg-slate-50 z-[9999] text-slate-800 flex flex-col font-sans antialiased overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
          <button onClick={() => { setIsPlayerOpen(false); setActiveLesson(null); }} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
            <ArrowLeft className="w-4 h-4" /><span>Exit Course Player</span>
          </button>
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Study Room</p>
            <p className="text-xs font-black text-blue-600 truncate max-w-xs">{activeCourse.title}</p>
          </div>
        </div>

        <div className="bg-white border-b border-slate-200/80 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Course Progress:</span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">{progressPercent}% Complete</span>
          </div>
          <div className="relative group flex-grow max-w-md w-full pt-4 pb-2 md:py-1">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 p-[1px]">
              <motion.div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="w-full lg:w-[35%] bg-white border-r border-slate-200 p-6 overflow-y-auto max-h-[300px] lg:max-h-full divide-y divide-slate-100">
            <h3 className="text-xs font-mono text-slate-400 uppercase font-black tracking-widest mb-4">Curriculum Roadmap</h3>
            <div className="space-y-4 pt-2">
              {sortedModules.map((mod, modIdx) => {
                const moduleLessons = lessons.filter(l => l.moduleId === mod.id);
                const sortedModuleLessons = [...moduleLessons].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                return (
                  <div key={mod.id} className="space-y-2 pt-2 first:pt-0">
                    <p className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-600 text-[10px] flex items-center justify-center font-mono">{modIdx + 1}</span>
                      <span>{mod.title}</span>
                    </p>
                    <div className="space-y-1.5 pl-7">
                      {sortedModuleLessons.map((les) => {
                        const isCompleted = completedLessonIds.includes(les.id);
                        const isSelected = currentActiveLesson?.id === les.id;
                        const isLocked = getIsLessonLocked(les, moduleLessons);
                        return (
                          <div key={les.id} className="space-y-1">
                            <button onClick={() => handleLessonClick(les, moduleLessons)} className={`w-full text-left p-3 rounded-xl flex items-center justify-between border ${isSelected ? "bg-blue-50 border-blue-200 text-blue-700 font-bold" : isLocked ? "bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                              <div className="flex items-center gap-2.5 min-w-0">
                                {isCompleted ? <CheckSquare className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> : <Square className="w-4.5 h-4.5 text-slate-400 shrink-0" />}
                                <span className="text-[11.5px] font-semibold truncate leading-tight">{les.title}</span>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 ml-1">{les.duration}</span>
                            </button>
                            <AnimatePresence>
                              {lockedTooltipId === les.id && (
                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[10px] bg-rose-50 border border-rose-200 text-rose-700 p-2 rounded-lg">
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

          <div className="w-full lg:w-[65%] bg-slate-50 p-6 flex flex-col justify-between max-h-full overflow-y-auto">
            {currentActiveLesson ? (
              <div className="space-y-6">
                {progressPercent === 100 && (
                  <div className="mb-2">
                    <CertificateService studentName={studentProfile?.full_name || "Authorized Student"} courseTitle={activeCourse.title} courseId={activeCourse.id} studentId={studentProfile?.id || "sandbox-std-id"} />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className="text-left">
                    <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black">Active Module Video</span>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900">{currentActiveLesson.title}</h2>
                  </div>
                  <button onClick={() => handleMarkComplete(currentActiveLesson.id, activeCourse.id)} className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border ${completedLessonIds.includes(currentActiveLesson.id) ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-blue-600 text-white border-transparent"}`}>
                    <CheckCircle className="w-4 h-4" />
                    <span>{completedLessonIds.includes(currentActiveLesson.id) ? "Lesson Completed!" : "Mark as Complete"}</span>
                  </button>
                </div>

                <div className="relative aspect-video w-full bg-slate-900 rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                  {currentActiveLesson.videoUrl ? (
                    <iframe src={currentActiveLesson.videoUrl} title={currentActiveLesson.title} className="absolute inset-0 w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-950">
                      <PlayCircle className="w-12 h-12 text-slate-600" />
                      <p className="text-xs font-mono uppercase tracking-widest">No Streaming Feed Configured</p>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 text-left">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Lesson Guidelines & Resources</h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{currentActiveLesson.content || "No lesson description guidelines have been customized for this section."}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-16 bg-white border border-slate-200 rounded-2xl">
                <BookOpen className="w-12 h-12 text-slate-300" />
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Select a lesson from the roadmap to start watching</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-50 z-[9999] flex flex-col text-slate-800 font-sans antialiased overflow-hidden">
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span className="font-extrabold tracking-tight text-slate-900 text-base">DSP Academy</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Authorized Student</span>
            <span className="text-xs font-extrabold text-slate-850">{studentProfile?.full_name || "Sandbox Student"}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer">
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <motion.aside initial={{ width: sidebarOpen ? 240 : 0, opacity: sidebarOpen ? 1 : 0 }} animate={{ width: sidebarOpen ? 240 : 0, opacity: sidebarOpen ? 1 : 0 }} transition={{ duration: 0.25 }} className="bg-slate-100/60 border-r border-slate-200/80 flex flex-col justify-between shrink-0 overflow-hidden">
          <div className="p-4 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-3">Navigation Deck</p>
              <div className="space-y-1 pt-2">
                <button onClick={() => { setIsPlayerOpen(false); setAccordionA(true); setCurrentTab("classroom"); }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left cursor-pointer ${currentTab === "classroom" ? "bg-white text-blue-600 border border-slate-200 shadow-xs" : "text-slate-600 hover:bg-slate-200/50"}`}>
                  <BookOpen className="w-4 h-4" /><span>My Classroom</span>
                </button>
                <button onClick={() => { setIsPlayerOpen(false); setAccordionB(true); setCurrentTab("help"); setTimeout(() => { document.getElementById("accordion-b")?.scrollIntoView({ behavior: "smooth" }); }, 100); }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left cursor-pointer ${currentTab === "help" ? "bg-white text-emerald-600 border border-slate-200 shadow-xs" : "text-slate-600 hover:bg-slate-200/50"}`}>
                  <MessageSquare className="w-4 h-4" /><span>Get Live Help</span>
                </button>
                <button onClick={() => { setIsPlayerOpen(false); setAccordionC(true); setCurrentTab("docs"); setTimeout(() => { document.getElementById("accordion-c")?.scrollIntoView({ behavior: "smooth" }); }, 100); }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left cursor-pointer ${currentTab === "docs" ? "bg-white text-amber-600 border border-slate-200 shadow-xs" : "text-slate-600 hover:bg-slate-200/50"}`}>
                  <FileText className="w-4 h-4" /><span>Docs Base</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 text-center">DSP Academy © 2026</div>
        </motion.aside>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 sm:p-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black block">Student Workspace</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">{studentProfile?.full_name || "Authorized Student"}</h1>
              <p className="text-slate-500 text-xs font-medium">Welcome back to your curriculum hub. Launch any course to resume learning.</p>
            </div>
            <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
              <LogOut className="w-4 h-4 text-rose-500" /><span>Sign Out</span>
            </button>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* ACCORDION A: ENROLLED COURSE */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button onClick={() => setAccordionA(!accordionA)} className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 text-left">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <h3 className="text-slate-900 text-sm sm:text-base font-extrabold uppercase tracking-wide">Enrolled Course</h3>
                </div>
                {accordionA ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {accordionA && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-slate-100 bg-slate-50/20">
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
                                <div key={course.id} onClick={() => { setActiveCourse(course); setIsPlayerOpen(true); }} className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-2xl overflow-hidden transition-all cursor-pointer group text-left flex flex-col justify-between">
                                  <div>
                                    <div className="relative h-44 w-full bg-slate-100">
                                      {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                                      ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-mono text-[10px]">No Thumbnail</div>
                                      )}
                                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-md font-mono uppercase tracking-wider">Enrolled</div>
                                      {percent === 100 && (
                                        <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black rounded-md font-mono uppercase tracking-wider shadow-md flex items-center gap-1">
                                          <Trophy className="w-3.5 h-3.5" /><span>Graduated</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="p-5 space-y-2.5">
                                      <h4 className="font-extrabold text-sm text-slate-950 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                                      <p className="text-slate-600 text-[11px] line-clamp-2">{course.description}</p>
                                      <div className="pt-2 space-y-1">
                                        <div className="flex items-center justify-between text-[10px] font-mono">
                                          <span className="text-slate-400">Curriculum Progress</span>
                                          <span className={percent === 100 ? "text-amber-500 font-bold" : "text-blue-600 font-bold"}>{percent}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 p-[1px]">
                                          <div className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? "bg-gradient-to-r from-amber-500 to-emerald-500" : "bg-blue-600"}`} style={{ width: `${percent}%` }} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-5 pt-0">
                                    <div className="pt-2.5 flex items-center justify-between border-t border-slate-200/60 text-[10.5px] font-mono text-slate-400">
                                      <span>Instructor: {course.instructorName || "Sandra Cole"}</span>
                                      <span className="text-blue-600 font-bold uppercase tracking-wider group-hover:underline flex items-center gap-1">Launch Player <Play className="w-3.5 h-3.5 text-blue-600 fill-current" /></span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10 space-y-2 text-slate-400 bg-white rounded-2xl border border-slate-200">
                          <BookOpen className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
                          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">No Subscribed Courses Found</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION B: SUPPORT & HELPDESK */}
            <div id="accordion-b" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button onClick={() => setAccordionB(!accordionB)} className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 text-left">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-slate-900 text-sm sm:text-base font-extrabold uppercase tracking-wide">Support & Helpdesk</h3>
                </div>
                {accordionB ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              <AnimatePresence initial={false}>
                {accordionB && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-slate-100 bg-slate-50/40 text-left">
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-slate-600">Need direct campaign reviews or setup help? Contact support below.</p>
                      <div className="p-4 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs">
                        <p><strong>Official Support WhatsApp Line:</strong> <span className="font-mono text-emerald-600 font-extrabold">07068300818</span></p>
                      </div>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs">
                        <Phone className="w-4 h-4" /><span>Connect with support via WhatsApp</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION C: KNOWLEDGE BASE & FAQ */}
            <div id="accordion-c" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button onClick={() => setAccordionC(!accordionC)} className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 text-left">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-slate-900 text-sm sm:text-base font-extrabold uppercase tracking-wide">Knowledge Base & FAQ</h3>
                </div>
                {accordionC ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              <AnimatePresence initial={false}>
                {accordionC && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-slate-100 bg-slate-50/40 text-left">
                    <div className="p-6 space-y-4 text-xs text-slate-600">
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-amber-500" />When will my certificate be ready?</h4>
                        <p className="pl-5.5">Once all video modules are checked as complete, certificate printing activates automatically.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}