/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, BookOpen, CheckCircle, Circle, PlayCircle, 
  Trophy, GraduationCap, ChevronRight, Bookmark, ArrowLeft, 
  Hourglass, BarChart3, Clock, Play, CheckSquare, Square,
  Database, Shield, Table, Copy, Check, RefreshCw, Server,
  Lock, Mail, User, MapPin, Key, LogOut, ChevronDown, ChevronUp, PlaySquare, Phone, Settings
} from "lucide-react";
import { db, Course, CourseModule, Lesson, Enrollment, StudentProgress } from "../lib/db";
import { supabase, isSupabaseConfigured, syncLocalStorageToSupabase } from "../lib/supabase";
import { StudentProfileSettings } from "./StudentProfileSettings";

export default function StudentDashboard() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [isAdminPreview, setIsAdminPreview] = useState(false);

  // Authentication Mode: "login" or "signup"
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authAppliedCourse, setAuthAppliedCourse] = useState("");
  const [studentStatus, setStudentStatus] = useState("active");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // LMS Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Supabase user_lessons records
  const [userLessons, setUserLessons] = useState<any[]>([]);

  // Calculate completion percentage based on user's progress records in user_lessons table
  const getSupabaseCourseProgressPct = (courseId: string) => {
    const courseLessons = lessons.filter(l => l.courseId === courseId);
    if (courseLessons.length === 0) return 0;
    
    // Filter user_lessons for the current course and mark completed
    const completedForCourse = userLessons.filter(
      ul => ul.course_id === courseId && (ul.completed === true || ul.completed === 'true' || ul.completed === 1)
    );
    
    return Math.round((completedForCourse.length / courseLessons.length) * 100);
  };

  // Global completion percentage across all enrolled courses based on user_lessons table
  const getSupabaseGlobalProgressPct = () => {
    const enrolledList = courses.filter(c => enrollments.some(e => e.courseId === c.id));
    if (enrolledList.length === 0) return 0;
    const totalPcts = enrolledList.reduce((sum, c) => sum + getSupabaseCourseProgressPct(c.id), 0);
    return Math.round(totalPcts / enrolledList.length);
  };

  const fetchUserLessons = async (currentStudentId?: string) => {
    const sId = currentStudentId || studentId || localStorage.getItem("student_logged_in_id") || "sandbox-student";
    if (supabase && isSupabaseConfigured && sId) {
      try {
        const { data, error } = await supabase
          .from("user_lessons")
          .select("*")
          .eq("user_id", sId);
        if (!error && data) {
          setUserLessons(data);
        }
      } catch (err) {
        console.warn("Could not query user_lessons from Supabase:", err);
      }
    }
  };

  // Layout states
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"course_overview" | "lesson_player" | "catalog" | "settings">("course_overview");

  // Tab selection for Sidebar
  const [activeTab, setActiveTab] = useState<"enrolled" | "catalog">("enrolled");

  // Load state and authenticate session
  const checkAuthAndLoadData = () => {
    // 1. Check Admin status
    const adminAuth = localStorage.getItem("is_admin_authenticated") === "true";
    
    // 2. Check Student status
    const studentAuth = localStorage.getItem("is_student_authenticated") === "true";
    const loggedName = localStorage.getItem("student_logged_in_name") || "";
    const loggedEmail = localStorage.getItem("student_logged_in_email") || "";
    const loggedId = localStorage.getItem("student_logged_in_id") || "";
    const loggedPhone = localStorage.getItem("student_logged_in_phone") || "";

    if (adminAuth) {
      setIsAuthenticated(true);
      setIsAdminPreview(true);
      setStudentName("Academy Administrator (Sandbox)");
      setStudentEmail("admin@academy.com");
      setStudentId("ADMIN-OVERRIDE");
      setStudentPhone("");
    } else if (studentAuth && loggedEmail) {
      setIsAuthenticated(true);
      setIsAdminPreview(false);
      setStudentName(loggedName || "Registered Student");
      setStudentEmail(loggedEmail);
      setStudentId(loggedId || "STD-MEMBER");
      setStudentPhone(loggedPhone);
      setStudentStatus(localStorage.getItem("student_logged_in_status") || "active");
    } else {
      setIsAuthenticated(false);
      setIsAdminPreview(false);
    }

    // Load DB records
    setCourses(db.getCourses());
    const enrs = db.getEnrollments();
    setEnrollments(enrs);
    setProgress(db.getStudentProgress());
    setModules(db.getModules());
    setLessons(db.getLessons());

    // Auto-select first course if none selected yet
    if (enrs.length > 0 && !activeCourseId) {
      setActiveCourseId(enrs[0].courseId);
      setExpandedCourseId(enrs[0].courseId);
    }
  };

  // Run initial state loading
  useEffect(() => {
    checkAuthAndLoadData();

    // Pull live updates if connected to Supabase
    syncWithSupabase();
    
    // Fetch live user_lessons records
    fetchUserLessons();

    const handleStorageChange = () => {
      checkAuthAndLoadData();
      fetchUserLessons();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [activeCourseId]);

  // Handle auto-lesson selection when active course changes
  useEffect(() => {
    if (activeCourseId) {
      const courseLessons = lessons.filter(l => l.courseId === activeCourseId);
      if (courseLessons.length > 0) {
        // Find first incomplete lesson, or select the first lesson overall
        const courseProgress = progress.filter(p => p.courseId === activeCourseId && p.completed);
        const nextIncomplete = courseLessons.find(l => !courseProgress.some(p => p.lessonId === l.id));
        
        if (nextIncomplete) {
          setActiveLessonId(nextIncomplete.id);
        } else {
          setActiveLessonId(courseLessons[0].id);
        }
      } else {
        setActiveLessonId(null);
      }
    }
  }, [activeCourseId, lessons]);

  // Sync data with Supabase
  const syncWithSupabase = () => {
    if (supabase && isSupabaseConfigured) {
      setIsSyncing(true);

      const loggedEmail = localStorage.getItem("student_logged_in_email") || studentEmail;
      const profilePromise = loggedEmail
        ? supabase.from("profiles").select("status, phone, full_name").eq("email", loggedEmail.toLowerCase()).maybeSingle()
        : Promise.resolve({ data: null, error: null });

      Promise.all([
        supabase.from("courses").select("*"),
        supabase.from("modules").select("*"),
        supabase.from("lessons").select("*"),
        supabase.from("enrollments").select("*"),
        supabase.from("student_progress").select("*"),
        profilePromise
      ]).then(([cRes, mRes, lRes, eRes, pRes, profRes]) => {
        if (profRes && !profRes.error && profRes.data) {
          const fetchedStatus = profRes.data.status || "active";
          setStudentStatus(fetchedStatus);
          localStorage.setItem("student_logged_in_status", fetchedStatus);

          if (profRes.data.phone) {
            setStudentPhone(profRes.data.phone);
            localStorage.setItem("student_logged_in_phone", profRes.data.phone);
          }
          if (profRes.data.full_name) {
            setStudentName(profRes.data.full_name);
            localStorage.setItem("student_logged_in_name", profRes.data.full_name);
          }
        }

        if (!cRes.error && cRes.data && cRes.data.length > 0) {
          const mappedCourses = cRes.data.map((row: any) => ({
            id: row.id,
            title: row.title || "",
            description: row.description || "",
            overview: row.overview || row.description || "",
            thumbnail: row.thumbnail_url || row.thumbnail || "",
            categoryId: row.category || row.category_id || "",
            level: row.level || "Beginner",
            duration: row.duration || "",
            studentCount: row.student_count || "0",
            rating: row.rating || "4.9",
            instructorName: row.instructor_name || "Sandra Cole",
            instructorAvatar: row.instructor_avatar || "",
            skills: Array.isArray(row.skills) ? row.skills : [],
            outcomes: Array.isArray(row.outcomes) ? row.outcomes : [],
            price: row.price || "₦45,000"
          }));
          setCourses(mappedCourses);
          localStorage.setItem("courses", JSON.stringify(mappedCourses));
        }

        if (!mRes.error && mRes.data && mRes.data.length > 0) {
          const mappedModules = mRes.data.map((row: any) => ({
            id: row.id,
            courseId: row.course_id || "",
            title: row.title || "",
            sortOrder: Number(row.sort_order || row.order_index || 0)
          }));
          setModules(mappedModules);
          localStorage.setItem("course_modules", JSON.stringify(mappedModules));
        }

        if (!lRes.error && lRes.data && lRes.data.length > 0) {
          const mappedLessons = lRes.data.map((row: any) => ({
            id: row.id,
            moduleId: row.module_id || "",
            courseId: row.course_id || "",
            title: row.title || "",
            duration: row.duration || "",
            content: row.content || "",
            videoUrl: row.video_url || "",
            sortOrder: Number(row.sort_order || row.order_index || 0)
          }));
          setLessons(mappedLessons);
          localStorage.setItem("lessons", JSON.stringify(mappedLessons));
        }
        setIsSyncing(false);
        fetchUserLessons();
      }).catch(err => {
        console.warn("Supabase background student lms sync failed:", err);
        setIsSyncing(false);
      });
    }
  };

  // Sign up standard student account
  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!authName.trim()) {
      setAuthError("Please input your full name for official certificates.");
      return;
    }
    if (!authEmail.trim() || !authEmail.includes("@")) {
      setAuthError("Please input a valid student email address.");
      return;
    }
    if (!authPassword.trim() || authPassword.length < 6) {
      setAuthError("Security passcode must be at least 6 alphanumeric characters.");
      return;
    }

    setIsAuthSubmitting(true);

    try {
      // Generate a clean RFC4122-compliant UUID string
      const generatedId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      const newStudentProfile = {
        id: generatedId,
        full_name: authName.trim(),
        email: authEmail.trim().toLowerCase(),
        password: authPassword, 
        role: "student",
        status: "pending", // Starts in Pending Mode awaiting admin approval
        location: "",
        phone: authPhone.trim() || "",
        applied_course: authAppliedCourse || "",
        createdAt: new Date().toISOString()
      };

      // 1. Save to local profiles array
      const localProfilesStr = localStorage.getItem("admin_profiles");
      const currentProfiles = localProfilesStr ? JSON.parse(localProfilesStr) : [];
      
      // Prevent duplicates
      if (currentProfiles.some((p: any) => p.email === newStudentProfile.email)) {
        setAuthError("A student profile with this email already exists.");
        setIsAuthSubmitting(false);
        return;
      }

      currentProfiles.push(newStudentProfile);
      localStorage.setItem("admin_profiles", JSON.stringify(currentProfiles));

      // 2. Synchronize to Supabase if configured
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.from("profiles").insert({
          id: generatedId,
          full_name: newStudentProfile.full_name,
          email: newStudentProfile.email,
          role: "student",
          status: "pending", // Awaiting Admin Approval
          location: newStudentProfile.location,
          phone: newStudentProfile.phone,
          applied_course: newStudentProfile.applied_course,
          password: newStudentProfile.password
        });
        if (error) console.warn("Supabase profile sync failed:", error);
      }

      setAuthSuccess(`Account created successfully! Your profile is pending Admin Approval. Welcome to the study gateway!`);
      
      // Auto-Login in Pending mode
      setTimeout(() => {
        localStorage.setItem("is_student_authenticated", "true");
        localStorage.setItem("student_logged_in_name", newStudentProfile.full_name);
        localStorage.setItem("student_logged_in_email", newStudentProfile.email);
        localStorage.setItem("student_logged_in_id", newStudentProfile.id);
        localStorage.setItem("student_logged_in_status", "pending");
        localStorage.setItem("student_logged_in_course", newStudentProfile.applied_course);
        localStorage.setItem("student_logged_in_phone", newStudentProfile.phone);
        
        setIsAuthenticated(true);
        setStudentName(newStudentProfile.full_name);
        setStudentEmail(newStudentProfile.email);
        setStudentId(newStudentProfile.id);
        setStudentPhone(newStudentProfile.phone);
        setStudentStatus("pending");
        setIsAuthSubmitting(false);
        
        // Reset form inputs
        setAuthName("");
        setAuthEmail("");
        setAuthPassword("");
        setAuthPhone("");
        setAuthAppliedCourse("");
      }, 1500);

    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred during registration.");
      setIsAuthSubmitting(false);
    }
  };

  // Sign In standard student account
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!authEmail.trim()) {
      setAuthError("Email address is required.");
      return;
    }
    if (!authPassword) {
      setAuthError("Passcode is required.");
      return;
    }

    setIsAuthSubmitting(true);

    try {
      // 1. Check Supabase first (Live connection)
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", authEmail.trim().toLowerCase())
          .maybeSingle();

        if (error) {
          console.warn("Supabase login query error:", error);
        }

        if (data) {
          // Check passcode (password field)
          if (data.password === authPassword) {
            if (data.status === "suspended") {
              setAuthError("Your student account is suspended. Please contact Admin support.");
              setIsAuthSubmitting(false);
              return;
            }

            setAuthSuccess(`Access verified. Welcome back, ${data.full_name}!`);
            
            setTimeout(() => {
              localStorage.setItem("is_student_authenticated", "true");
              localStorage.setItem("student_logged_in_name", data.full_name);
              localStorage.setItem("student_logged_in_email", data.email);
              localStorage.setItem("student_logged_in_id", data.id);
              localStorage.setItem("student_logged_in_status", data.status || "active");
              localStorage.setItem("student_logged_in_course", data.applied_course || "");
              localStorage.setItem("student_logged_in_phone", data.phone || "");
              
              setIsAuthenticated(true);
              setStudentName(data.full_name);
              setStudentEmail(data.email);
              setStudentId(data.id);
              setStudentPhone(data.phone || "");
              setStudentStatus(data.status || "active");
              setIsAuthSubmitting(false);

              setAuthEmail("");
              setAuthPassword("");
            }, 1000);
            return;
          } else {
            setAuthError("Incorrect passcode. Please try again.");
            setIsAuthSubmitting(false);
            return;
          }
        }
      }

      // 2. Fallback to local profiles list if offline or not in cloud yet
      const localProfilesStr = localStorage.getItem("admin_profiles");
      const currentProfiles = localProfilesStr ? JSON.parse(localProfilesStr) : [];
      
      const matched = currentProfiles.find(
        (p: any) => p.email.toLowerCase() === authEmail.trim().toLowerCase() && p.password === authPassword
      );

      if (matched) {
        if (matched.status === "suspended") {
          setAuthError("Your student account is suspended. Please contact Admin support.");
          setIsAuthSubmitting(false);
          return;
        }

        setAuthSuccess(`Access granted. Welcome back, ${matched.full_name}!`);
        
        setTimeout(() => {
          localStorage.setItem("is_student_authenticated", "true");
          localStorage.setItem("student_logged_in_name", matched.full_name);
          localStorage.setItem("student_logged_in_email", matched.email);
          localStorage.setItem("student_logged_in_id", matched.id);
          localStorage.setItem("student_logged_in_status", matched.status || "active");
          localStorage.setItem("student_logged_in_course", matched.applied_course || "");
          localStorage.setItem("student_logged_in_phone", matched.phone || "");
          
          setIsAuthenticated(true);
          setStudentName(matched.full_name);
          setStudentEmail(matched.email);
          setStudentId(matched.id);
          setStudentPhone(matched.phone || "");
          setStudentStatus(matched.status || "active");
          setIsAuthSubmitting(false);

          setAuthEmail("");
          setAuthPassword("");
        }, 1000);
      } else {
        setAuthError("Student profile not found or invalid security credentials.");
        setIsAuthSubmitting(false);
      }

    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred during sign-in.");
      setIsAuthSubmitting(false);
    }
  };

  // Sign out student
  const handleLogout = () => {
    localStorage.removeItem("is_student_authenticated");
    localStorage.removeItem("student_logged_in_name");
    localStorage.removeItem("student_logged_in_email");
    localStorage.removeItem("student_logged_in_id");
    localStorage.removeItem("student_logged_in_phone");
    
    // Also remove admin bypass if clicked logout from here
    localStorage.removeItem("is_admin_authenticated");

    setIsAuthenticated(false);
    setIsAdminPreview(false);
    setStudentName("");
    setStudentEmail("");
    setStudentId("");
    setStudentPhone("");
    
    // Refresh to update header & UI
    window.dispatchEvent(new Event("storage"));
  };

  // Single Course completions calculation helper
  const getCourseProgressPct = (courseId: string) => {
    const courseLessons = lessons.filter(l => l.courseId === courseId);
    if (courseLessons.length === 0) return 0;
    const completedForCourse = progress.filter(p => p.courseId === courseId && p.completed);
    return Math.round((completedForCourse.length / courseLessons.length) * 100);
  };

  // Toggle completed state on lesson
  const handleToggleLessonComplete = async (courseId: string, lessonId: string, isCompleted: boolean) => {
    const updated = db.toggleLessonProgress(courseId, lessonId, isCompleted);
    setProgress(updated);

    // Sync to user_lessons table in Supabase
    if (supabase && isSupabaseConfigured) {
      const uId = studentId || localStorage.getItem("student_logged_in_id") || "sandbox-student";
      const recordId = `${uId}_${lessonId}`;
      try {
        await supabase.from("user_lessons").upsert({
          id: recordId,
          user_id: uId,
          course_id: courseId,
          lesson_id: lessonId,
          completed: isCompleted,
          completed_at: new Date().toISOString()
        });
        fetchUserLessons(uId);
      } catch (err) {
        console.warn("Error updating user_lessons in Supabase:", err);
      }
    }

    window.dispatchEvent(new Event("storage"));
  };

  // Enroll in a new course
  const handleEnrollNow = (courseId: string) => {
    const activeId = studentId || "std-member";
    const newEnr: Enrollment = {
      id: `enr-${activeId}-${courseId}`,
      courseId: courseId,
      enrolledAt: new Date().toISOString()
    };

    const updated = [...enrollments, newEnr];
    localStorage.setItem("enrollments", JSON.stringify(updated));
    setEnrollments(updated);

    // Sync to Supabase
    if (supabase && isSupabaseConfigured) {
      supabase.from("enrollments").upsert({
        id: newEnr.id,
        user_id: activeId,
        course_id: courseId,
        status: "active"
      }).then(({ error }) => {
        if (error) console.error("Supabase enrollment sync failed:", error);
      });
    }

    setActiveCourseId(courseId);
    setExpandedCourseId(courseId);
    setViewMode("course_overview");
    setActiveTab("enrolled");
    window.dispatchEvent(new Event("storage"));
  };

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeLesson = lessons.find(l => l.id === activeLessonId);

  // Split courses list
  const enrolledCoursesList = courses.filter(c => enrollments.some(e => e.courseId === c.id));
  const catalogCoursesList = courses.filter(c => !enrollments.some(e => e.courseId === c.id));

  // 1. RENDER AUTHENTICATION LOCK SCREEN IF NOT LOGGED IN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 sm:pt-40 pb-16 flex items-center justify-center px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl text-left relative z-10 space-y-6">
          
          {/* Logo Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-55 border border-indigo-100 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3 text-indigo-600" /> Secure Study Gateway
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Student Terminal
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Log in or register to access personalized modules and track your learning progress.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold leading-relaxed animate-in fade-in">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-semibold leading-relaxed animate-in fade-in">
              {authSuccess}
            </div>
          )}

          <AnimatePresence mode="wait">
            {authMode === "login" ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onSubmit={handleStudentLogin} 
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Student Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="email"
                      required
                      placeholder="sandra@microsoft.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Security Passcode</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md shadow-indigo-100"
                >
                  {isAuthSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Security Keys...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Workspace Terminal</span>
                      <ChevronRight className="w-4 h-4 font-black" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="signup-form"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onSubmit={handleStudentSignup} 
                className="space-y-3.5"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name (Used for certification)</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Student Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="email"
                      required
                      placeholder="johndoe@gmail.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Security Passcode (6+ chars)</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. +234 81..."
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Course Applied for</label>
                  <select
                    required
                    value={authAppliedCourse}
                    onChange={(e) => setAuthAppliedCourse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">-- Choose Applied Course --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md shadow-indigo-100"
                >
                  {isAuthSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Live Student Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setAuthError("");
                setAuthMode(authMode === "login" ? "signup" : "login");
              }}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold tracking-wide transition-all cursor-pointer"
            >
              {authMode === "login" 
                ? "Don't have a student account? Register here" 
                : "Already registered student? Login to study terminal"
              }
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 1.5 RENDER PENDING APPROVAL SCREEN IF PENDING
  if (isAuthenticated && studentStatus === "pending" && !isAdminPreview) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 sm:pt-40 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200">
            <Hourglass className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">
              Awaiting Admin Approval
            </h2>
            <p className="text-slate-500 text-sm">
              Hello <span className="font-bold text-slate-800">{studentName}</span>, your registration is successful! Your student profile is currently <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs">Pending Approval</span>.
            </p>
            <p className="text-slate-400 text-xs">
              Once the Admin approves your account, you will have immediate access to your courses and learning resources.
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2 text-xs text-slate-600">
            <div><span className="font-bold text-slate-700">Applied Course:</span> {localStorage.getItem("student_logged_in_course") || "Not specified"}</div>
            <div><span className="font-bold text-slate-700">Email:</span> {studentEmail}</div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => syncWithSupabase()}
              disabled={isSyncing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Checking Cloud Server...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Approval Status</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Log Out / Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN REDESIGNED LAYOUT FOR LOGGED IN USERS
  return (
    <div id="student-workspace" className="min-h-screen bg-[#F3F5F9] pt-28 sm:pt-32 pb-12">
      
      {/* 2.1 HIGH LEVEL HEADER STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-[#0B1B3D] text-white border border-slate-850 rounded-2xl px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative overflow-hidden">
          
          {/* Subtle decoration */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#2D7FF9]/15 blur-2xl pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2D7FF9]/25 border border-[#2D7FF9]/45 flex items-center justify-center text-[#2D7FF9] text-lg font-black shrink-0">
              🎓
            </div>
            <div className="text-left space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#2D7FF9] uppercase tracking-wider font-mono">
                  DSP Study Portal
                </span>
                {isAdminPreview ? (
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ADMIN PREVIEW SANDBOX
                  </span>
                ) : (
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE STUDENT STATE
                  </span>
                )}
              </div>
              <h1 className="font-display text-base sm:text-lg font-black text-white leading-tight">
                Welcome back, <span className="text-[#2D7FF9]">{studentName}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
            <div className="hidden sm:block text-right text-[10.5px] font-mono text-slate-400 leading-normal">
              <p>Terminal ID: <span className="text-slate-200">{studentId}</span></p>
              <p>Channel: <span className="text-[#2D7FF9]">Secure Web3 Cloud Tunnel</span></p>
            </div>
            
            <button
              onClick={() => {
                if (viewMode === "settings") {
                  setViewMode("course_overview");
                } else {
                  setViewMode("settings");
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                viewMode === "settings"
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : "bg-slate-900/50 text-slate-300 border-slate-800 hover:bg-slate-800"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/50 hover:bg-rose-500/15 hover:text-rose-300 border border-slate-800 hover:border-rose-500/25 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2.2 CENTRAL INTERACTIVE SPLIT PANEL WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 2.2.1 LEFT PANEL: COMPACT SIDEBAR CONTROLLER (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Stats Block */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex justify-around items-center divide-x divide-gray-100">
              <div className="text-center px-2 space-y-0.5 flex-1">
                <span className="text-[10px] font-mono font-black text-gray-400 block uppercase tracking-wider">Studies</span>
                <span className="text-lg font-black text-[#0B1B3D] font-display">{enrolledCoursesList.length}</span>
              </div>
              <div className="text-center px-2 space-y-0.5 flex-1">
                <span className="text-[10px] font-mono font-black text-gray-400 block uppercase tracking-wider">Completed</span>
                <span className="text-lg font-black text-emerald-600 font-display">
                  {progress.filter(p => p.completed).length} lessons
                </span>
              </div>
              <div className="text-center px-2 space-y-0.5 flex-1">
                <span className="text-[10px] font-mono font-black text-gray-400 block uppercase tracking-wider">Progress</span>
                <span className="text-lg font-black text-[#2D7FF9] font-display">
                  {enrolledCoursesList.length > 0 
                    ? Math.round(
                        enrolledCoursesList.reduce((sum, c) => sum + getCourseProgressPct(c.id), 0) / enrolledCoursesList.length
                      )
                    : 0}%
                </span>
              </div>
            </div>

            {/* Supabase 'user_lessons' Progress Widget */}
            <div id="supabase-user-lessons-progress" className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-sm text-left space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#0B1B3D] uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-500" />
                  Cloud Progress Sync
                </span>
                <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  user_lessons Table
                </span>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Supabase Completion</span>
                  <span className="text-emerald-600 font-mono font-black text-sm">
                    {getSupabaseGlobalProgressPct()}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${getSupabaseGlobalProgressPct()}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-medium text-slate-400 leading-normal">
                    Verified live in <code className="font-mono bg-slate-50 text-slate-600 px-1 py-0.5 rounded text-[8px]">user_lessons</code>
                  </p>
                  <button 
                    onClick={() => fetchUserLessons()}
                    className="text-[9px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5 animate-spin-hover" />
                    Force Reload
                  </button>
                </div>
              </div>

              {/* Course-wise breakdown based on user_lessons in Supabase */}
              {enrolledCoursesList.length > 0 && (
                <div className="pt-3 border-t border-gray-100 space-y-2.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-black block tracking-wider">
                    Course Completion Breakdown
                  </span>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {enrolledCoursesList.map(c => {
                      const pct = getSupabaseCourseProgressPct(c.id);
                      return (
                        <div key={c.id} className="space-y-1">
                          <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-600">
                            <span className="truncate max-w-[190px]">{c.title}</span>
                            <span className="text-emerald-600 font-mono font-bold text-[10px] shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-400 transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Collapsible Course Selector Console */}
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm text-left overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-150/60 flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#0B1B3D] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#2D7FF9]" />
                  Active Study Desk
                </span>
                {isSyncing && <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
              </div>

              {/* Sidebar Tabs */}
              <div className="flex border-b border-gray-100 bg-white">
                <button
                  onClick={() => {
                    setActiveTab("enrolled");
                    setViewMode("course_overview");
                  }}
                  className={`flex-1 py-3 text-center text-xs font-bold transition-all relative ${
                    activeTab === "enrolled" ? "text-[#0B1B3D]" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  My Active Courses ({enrolledCoursesList.length})
                  {activeTab === "enrolled" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D7FF9]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("catalog");
                    setViewMode("catalog");
                  }}
                  className={`flex-1 py-3 text-center text-xs font-bold transition-all relative ${
                    activeTab === "catalog" ? "text-[#0B1B3D]" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Browse Catalog ({catalogCoursesList.length})
                  {activeTab === "catalog" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D7FF9]" />
                  )}
                </button>
              </div>

              <div className="p-3 space-y-2.5 max-h-[500px] overflow-y-auto">
                {activeTab === "enrolled" ? (
                  enrolledCoursesList.length === 0 ? (
                    <div className="py-8 px-4 text-center text-xs text-slate-400 space-y-2 font-semibold">
                      <p>You are not enrolled in any study pathways yet.</p>
                      <button
                        onClick={() => {
                          setActiveTab("catalog");
                          setViewMode("catalog");
                        }}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Enroll from Catalog
                      </button>
                    </div>
                  ) : (
                    enrolledCoursesList.map((c) => {
                      const isExpanded = expandedCourseId === c.id;
                      const coursePct = getCourseProgressPct(c.id);
                      
                      return (
                        <div key={c.id} className="border border-gray-100 rounded-xl overflow-hidden transition-all bg-slate-50/50">
                          {/* Main Course Accordion trigger header */}
                          <div
                            onClick={() => {
                              setActiveCourseId(c.id);
                              setViewMode("course_overview");
                              setExpandedCourseId(isExpanded ? null : c.id);
                            }}
                            className={`p-3 cursor-pointer flex items-center justify-between gap-2.5 transition-all select-none ${
                              activeCourseId === c.id
                                ? "bg-[#0B1B3D] text-white border-transparent"
                                : "bg-white hover:bg-slate-50 text-[#0B1B3D]"
                            }`}
                          >
                            <div className="space-y-1 overflow-hidden">
                              <h4 className="font-display font-black text-xs truncate max-w-[200px] leading-tight">
                                {c.title}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[9.5px]">
                                <span className={activeCourseId === c.id ? "text-blue-300 font-bold" : "text-blue-600 font-bold"}>
                                  {coursePct}% completed
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className={activeCourseId === c.id ? "text-slate-300 font-semibold" : "text-slate-500 font-semibold"}>
                                  {c.duration}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>

                          {/* Expanded Modules & Lessons under this course */}
                          {isExpanded && (
                            <div className="p-2.5 bg-white border-t border-gray-100 space-y-3.5 animate-in slide-in-from-top-1 duration-200">
                              {modules
                                .filter(m => m.courseId === c.id)
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map((mod) => {
                                  const modLessons = lessons.filter(l => l.moduleId === mod.id);
                                  
                                  return (
                                    <div key={mod.id} className="space-y-1.5">
                                      {/* Module Title */}
                                      <h5 className="font-sans font-bold text-[10.5px] text-[#0B1B3D] bg-slate-50 px-2 py-1.5 rounded-md flex justify-between items-center">
                                        <span className="truncate pr-1">{mod.title}</span>
                                        <span className="text-[9px] font-mono text-slate-400 shrink-0">{modLessons.length} clips</span>
                                      </h5>

                                      {/* Lessons */}
                                      <div className="space-y-1 pl-1.5">
                                        {modLessons.map((les) => {
                                          const isCompleted = progress.some(p => p.lessonId === les.id && p.completed);
                                          const isCurrent = activeLessonId === les.id;
                                          
                                          return (
                                            <button
                                              key={les.id}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveCourseId(c.id);
                                                setActiveLessonId(les.id);
                                                setViewMode("lesson_player");
                                              }}
                                              className={`w-full p-2 rounded-lg text-left text-[11px] transition-all flex items-center justify-between gap-2 border ${
                                                isCurrent
                                                  ? "bg-blue-50 border-blue-300 font-bold text-blue-700 shadow-3xs"
                                                  : "bg-white border-transparent hover:bg-slate-50 text-slate-600 font-semibold"
                                              }`}
                                            >
                                              <div className="flex items-center gap-1.5 overflow-hidden">
                                                {isCompleted ? (
                                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                  <PlaySquare className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                                )}
                                                <span className="truncate leading-none">{les.title}</span>
                                              </div>
                                              <span className="text-[9px] text-gray-400 shrink-0 font-mono">{les.duration}</span>
                                            </button>
                                          );
                                        })}
                                        {modLessons.length === 0 && (
                                          <p className="text-[10px] text-slate-400 italic pl-2">No video lectures added yet.</p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )
                ) : (
                  <div className="py-2.5 text-left space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block px-1">Academy Catalog</span>
                    {catalogCoursesList.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveCourseId(c.id);
                          setViewMode("catalog");
                        }}
                        className={`w-full p-3 bg-white border border-gray-150 rounded-xl hover:border-blue-300 text-left transition-all flex items-center justify-between gap-2 ${
                          activeCourseId === c.id ? "ring-2 ring-blue-400" : ""
                        }`}
                      >
                        <div className="overflow-hidden space-y-0.5">
                          <h4 className="font-display font-black text-xs text-[#0B1B3D] truncate">{c.title}</h4>
                          <p className="text-[9.5px] font-mono text-slate-400">{c.duration} &bull; {c.level}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    ))}
                    {catalogCoursesList.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-6 font-semibold">You have unlocked all courses.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Instructors Widget */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm text-left space-y-3.5">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">Academy Instructors Clinic</span>
              <div className="flex gap-3 items-center">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150" 
                  alt="Sandra Cole" 
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-black text-[#0B1B3D]">Sandra Cole</h4>
                  <p className="text-[10px] font-mono text-slate-400">Head of Curriculum Design &bull; Abuja HQ</p>
                </div>
              </div>
            </div>

            {/* Quick Profile Settings Link Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-sm text-left space-y-3">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">Account Desk</span>
              <button
                onClick={() => setViewMode(viewMode === "settings" ? "course_overview" : "settings")}
                className={`w-full p-3 border rounded-xl text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  viewMode === "settings"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                    : "bg-white border-gray-150 hover:border-[#2D7FF9] text-slate-700 font-semibold"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Settings className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs truncate">Configure Profile Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            </div>

          </div>

          {/* 2.2.2 RIGHT PANEL: EXTREMELY PREMIUM DYNAMIC STUDY CONTENT (8 Columns) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              
              {/* VIEW MODE A: COURSE CARD OVERVIEW */}
              {viewMode === "course_overview" && activeCourse && (
                <motion.div
                  key="course-overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm text-left"
                >
                  {/* Banner Image */}
                  <div className="h-48 sm:h-56 bg-slate-900 relative">
                    <img 
                      src={activeCourse.thumbnail} 
                      alt={activeCourse.title} 
                      className="w-full h-full object-cover opacity-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#2D7FF9] text-white rounded-full text-[9px] font-mono uppercase tracking-wider font-bold">
                        {activeCourse.level} STUDY LINE
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight leading-tight">
                        {activeCourse.title}
                      </h2>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Progress indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Course Study Progress</span>
                        <span className="text-[#2D7FF9]">{getCourseProgressPct(activeCourse.id)}% Finished</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${getCourseProgressPct(activeCourse.id)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-150 text-center">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase block">Duration</span>
                        <span className="text-xs font-bold text-[#0B1B3D]">{activeCourse.duration}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase block">Category</span>
                        <span className="text-xs font-bold text-[#0B1B3D]">{activeCourse.categoryId}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase block">Instructor</span>
                        <span className="text-xs font-bold text-[#0B1B3D]">{activeCourse.instructorName || "Sandra Cole"}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase block">Rating</span>
                        <span className="text-xs font-bold text-amber-500">★ {activeCourse.rating || "4.9"}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                      <h3 className="font-display font-black text-sm text-[#0B1B3D] uppercase tracking-wider block">Course Synopsis:</h3>
                      <p>{activeCourse.overview || activeCourse.description}</p>
                    </div>

                    {/* Skills learned */}
                    {activeCourse.skills && activeCourse.skills.length > 0 && (
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-3">
                        <h4 className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase block">Pathway Skills Gained:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                          {activeCourse.skills.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Launch Course button */}
                    <button
                      onClick={() => {
                        const courseLessons = lessons.filter(l => l.courseId === activeCourse.id);
                        if (courseLessons.length > 0) {
                          // Find first uncompleted or fallback to first
                          const courseProgress = progress.filter(p => p.courseId === activeCourse.id && p.completed);
                          const nextIncomplete = courseLessons.find(l => !courseProgress.some(p => p.lessonId === l.id));
                          
                          setActiveLessonId(nextIncomplete ? nextIncomplete.id : courseLessons[0].id);
                          setViewMode("lesson_player");
                        }
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-[#0B1B3D] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Resume Lecture Series</span>
                      <PlayCircle className="w-4 h-4 text-white fill-white/20 animate-pulse" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW MODE B: DYNAMIC SPLIT VIDEO PLAYER */}
              {viewMode === "lesson_player" && activeCourse && activeLesson && (
                <motion.div
                  key="lesson-player"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm text-left space-y-6"
                >
                  {/* Premium HTML5 Video Player Frame */}
                  <div className="aspect-video bg-slate-950 relative overflow-hidden flex items-center justify-center text-white">
                    {activeLesson.videoUrl ? (
                      <video 
                        key={activeLesson.id}
                        src={activeLesson.videoUrl} 
                        controls 
                        className="w-full h-full object-cover"
                        poster={activeCourse.thumbnail}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 space-y-4">
                        <PlayCircle className="w-16 h-16 text-[#FCF50F] animate-pulse" />
                        <span className="text-xs font-mono tracking-widest text-slate-350">VIDEO SOURCE RESTRICTED FOR SANBOX SECURITY</span>
                      </div>
                    )}
                    
                    {/* Brand Watermark Overlay */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[8.5px] font-mono tracking-widest text-blue-300 border border-white/10 uppercase leading-none">
                      DSP ONLINE ACADEMY
                    </div>
                  </div>

                  {/* Interactive Details area */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Completion control bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                      <div className="space-y-0.5">
                        <span className="text-[9.5px] font-mono font-bold text-[#2D7FF9] uppercase tracking-widest block">Active Lecture</span>
                        <h3 className="font-display font-black text-[#0B1B3D] text-lg sm:text-xl leading-snug">
                          {activeLesson.title}
                        </h3>
                        <p className="text-[10.5px] text-slate-400 font-medium">
                          Duration: {activeLesson.duration} mins &bull; {activeCourse.title}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const isCurrentlyDone = progress.some(p => p.lessonId === activeLesson.id && p.completed);
                          handleToggleLessonComplete(activeCourse.id, activeLesson.id, !isCurrentlyDone);
                        }}
                        className={`px-4.5 py-3 rounded-xl text-xs font-black transition-all cursor-pointer select-none flex items-center gap-2 border shrink-0 ${
                          progress.some(p => p.lessonId === activeLesson.id && p.completed)
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-slate-50 border-slate-200 hover:bg-[#0B1B3D] hover:text-white hover:border-transparent text-[#0B1B3D]"
                        }`}
                      >
                        {progress.some(p => p.lessonId === activeLesson.id && p.completed) ? (
                          <>
                            <CheckSquare className="w-4.5 h-4.5 text-emerald-600" />
                            <span>Lesson Completed!</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-4.5 h-4.5 text-slate-400" />
                            <span>Mark Lecture Complete</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Lesson text content / directives */}
                    <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-semibold">
                      <h4 className="font-display font-black text-sm text-[#0B1B3D] uppercase tracking-wider block">Directives & Reference:</h4>
                      <p className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-normal leading-normal text-slate-500">
                        {activeLesson.content || "Download study resources, compile project toolkits, and test prompts in live sandbox systems as part of this course step."}
                      </p>
                      <p className="text-[11px] text-slate-400 font-normal">
                        Pro-Tip: Make sure to implement the directives step-by-step. All student codes and campaign completions are logged in the student logs. You can submit finished assignments to the admin via the dashboard desk anytime.
                      </p>
                    </div>

                    <button
                      onClick={() => setViewMode("course_overview")}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span>Back to Course Syllabus Details</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW MODE C: CATALOG VIEW */}
              {viewMode === "catalog" && (
                <motion.div
                  key="catalog-list"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 text-left"
                >
                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
                    <h2 className="font-display text-xl font-black text-[#0B1B3D] tracking-tight">
                      DSP Academy Course Catalog
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Explore our top accredited AI Business modules and unlock immediate lifetime learning access.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catalogCoursesList.map((c) => (
                      <div key={c.id} className="bg-white border border-gray-150 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-video">
                          <img src={c.thumbnail} alt={c.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          <span className="absolute bottom-3 left-3 bg-[#0B1B3D] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {c.level}
                          </span>
                        </div>

                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono font-black text-[#2D7FF9] uppercase tracking-wider block">DSP ONLINE</span>
                            <h3 className="font-display font-extrabold text-sm sm:text-base text-[#0B1B3D] leading-tight line-clamp-1">{c.title}</h3>
                            <p className="text-[11.5px] text-slate-500 leading-relaxed line-clamp-2">{c.description}</p>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 border-t border-gray-50 pt-2.5">
                              <span>🕒 {c.duration}</span>
                              <span>⭐ Rating: {c.rating}</span>
                            </div>

                            <button
                              onClick={() => handleEnrollNow(c.id)}
                              className="w-full bg-blue-600 hover:bg-[#0B1B3D] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>Enroll in course</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {catalogCoursesList.length === 0 && (
                    <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-3.5">
                      <Trophy className="w-12 h-12 text-[#FCF50F] mx-auto" />
                      <h3 className="font-display font-extrabold text-base text-[#0B1B3D]">All Pathways unlocked</h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                        Amazing! You are enrolled in all available courses inside our Academy catalog. Go ahead and start complete them module-by-module.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* VIEW MODE D: SETTINGS VIEW */}
              {viewMode === "settings" && (
                <StudentProfileSettings
                  studentId={studentId}
                  studentName={studentName}
                  studentEmail={studentEmail}
                  studentPhone={studentPhone}
                  isAdminPreview={isAdminPreview}
                  onUpdateSuccess={(newName, newEmail, newPhone) => {
                    setStudentName(newName);
                    setStudentEmail(newEmail);
                    setStudentPhone(newPhone);
                  }}
                />
              )}

              {/* FALLBACK IF NO ACTIVE STATE */}
              {!activeCourse && viewMode !== "catalog" && viewMode !== "settings" && (
                <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center text-slate-400 font-semibold font-secondary">
                  Please select an active course under the study desk selector.
                </div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>

    </div>
  );
}
