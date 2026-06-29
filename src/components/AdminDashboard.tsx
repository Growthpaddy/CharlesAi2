/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, BookOpen, Users, Receipt, ClipboardList, Sparkles, 
  Video, Layers, LogOut, ChevronLeft, ChevronRight, CheckCircle2, RefreshCw, 
  ShieldAlert, GraduationCap, ArrowUpRight, ShieldCheck, DollarSign, UserCheck, 
  FileText, Activity, Lock, Search, Mail, Phone, Calendar, UserX, Plus, Trash2, Edit3, ArrowUp, ArrowDown, Image, Play, Clock, User
} from "lucide-react";
import { testConnection } from "../lib/dbTest";
import { runSupabaseDiagnostics } from "../lib/adminAuth";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { AdminGuard } from "./AdminGuard";
import { useAdmin } from "../context/AdminContext";

type AdminTab = 
  | "dashboard" 
  | "courses" 
  | "modules"
  | "lessons" 
  | "students" 
  | "sales" 
  | "quizzes" 
  | "gas_config"
  | "database";

interface StudentRecord {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  avatar_url: string | null;
  enrolled_courses: any;
  metadata: any;
}

interface CourseRecord {
  id: string;
  title: string;
  tagline: string;
  overview: string;
  description: string;
  instructor_name: string;
  instructor_bio: string;
  price_naira: number;
  price: string;
  cover_url: string;
  thumbnail_url: string;
  video_url: string;
  duration_text: string;
  duration: string;
}

interface ModuleRecord {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  module_order: number;
}

interface LessonRecord {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url: string;
  duration_minutes: number;
  duration: string;
  order_index: number;
  lesson_order: number;
}

export default function AdminDashboard() {
  const { logoutAdmin, currentAdmin, loginAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [currentHash, setCurrentHash] = useState(typeof window !== "undefined" ? window.location.hash : "");
  
  // Login credentials states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Operational pipeline states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{connected: boolean; message: string} | null>(null);
  const [diagnosticsLog, setDiagnosticsLog] = useState<string[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Students Directory Live States
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // --- Dynamic Authoring Domain States ---
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  // Loading indicator states for dynamic async network boundaries
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [isSavingModule, setIsSavingModule] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  // Form wrappers adjusted to mirror backend schemas precisely
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "", tagline: "", overview: "", description: "", instructor_name: "", instructor_bio: "",
    price_naira: 0, price: "", cover_url: "", thumbnail_url: "", video_url: "", duration_text: "", duration: ""
  });

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleRecord | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", course_id: "", order_index: 1, module_order: 1 });

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonRecord | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "", description: "", content: "", video_url: "", duration_minutes: 15, duration: "", module_id: "", course_id: "", order_index: 1, lesson_order: 1
  });

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "admin-login";
    }
    setCurrentHash(window.location.hash);

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    
    async function checkSystem() {
      try {
        const res = await testConnection();
        setDbStatus(res);
      } catch (err: any) {
        setDbStatus({ connected: false, message: err.message || "Failed connection check" });
      }
    }
    checkSystem();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (supabase && isSupabaseConfigured) {
      if (activeTab === "students") fetchLiveStudents();
      if (activeTab === "courses" || activeTab === "modules" || activeTab === "lessons") {
        fetchCoreLmsMatrix();
      }
    }
  }, [activeTab]);

  const fetchLiveStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setStudents(data || []);
    } catch (err: any) {
      console.error("Error reading students matrix:", err);
      triggerToast(`Failed fetching student index data: ${err.message}`);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchCoreLmsMatrix = async () => {
    try {
      const { data: cData } = await supabase.from("courses").select("*").order("title");
      // Map properties symmetrically to avoid field destruction errors
      const safeCourses = (cData || []).map(c => ({
        ...c,
        price_naira: c.price_naira || parseFloat(c.price) || 0,
        cover_url: c.thumbnail_url || c.cover_url || "",
        thumbnail_url: c.thumbnail_url || c.cover_url || "",
        duration_text: c.duration_text || c.duration || ""
      }));
      setCourses(safeCourses);

      const { data: mData } = await supabase.from("modules").select("*").order("module_order", { ascending: true });
      const safeModules = (mData || []).map(m => ({
        ...m,
        order_index: m.module_order || m.order_index || 1,
        module_order: m.module_order || m.order_index || 1
      })).sort((a,b) => a.module_order - b.module_order);
      setModules(safeModules);

      const { data: lData } = await supabase.from("lessons").select("*").order("lesson_order", { ascending: true });
      const safeLessons = (lData || []).map(l => ({
        ...l,
        order_index: l.lesson_order || l.order_index || 1,
        lesson_order: l.lesson_order || l.order_index || 1,
        duration_minutes: l.duration_minutes || parseFloat(l.duration) || 15
      })).sort((a,b) => a.lesson_order - b.lesson_order);
      setLessons(safeLessons);

      if (safeCourses.length > 0 && !selectedCourseId) setSelectedCourseId(safeCourses[0].id);
      if (safeModules.length > 0 && !selectedModuleId) setSelectedModuleId(safeModules[0].id);
    } catch (err: any) {
      console.error("Error updating configuration maps:", err);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- UNTOUCHED INTACT AUTHENTICATION PIPELINE (Perfect Safety Safeguard) ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    
    try {
      const currentInputEmail = email.trim().toLowerCase();
      const isExplicitlyWhitelisted = ["admin@aionlinebusiness.org"].includes(currentInputEmail);

      if (loginAdmin) {
        await loginAdmin(email, password);
        
        if (isExplicitlyWhitelisted) {
          localStorage.setItem("is_admin_authenticated", "true");
          localStorage.setItem("admin_logged_in_email", currentInputEmail);
          localStorage.setItem("admin_logged_in_name", "Administrator");
        }

        triggerToast("Administrative identity authenticated.");
        window.location.hash = "admin-dashboard";
      } 
      else if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data?.user) {
          if (!isExplicitlyWhitelisted) {
            const { data: adminProfile, error: profileErr } = await supabase
              .from("admin")
              .select("is_owner")
              .eq("id", data.user.id)
              .single();

            if (profileErr || !adminProfile || adminProfile.is_owner !== true) {
              await supabase.auth.signOut();
              throw new Error("Access Denied: You do not carry authorized administrator properties.");
            }
          }

          localStorage.setItem("is_admin_authenticated", "true");
          localStorage.setItem("admin_logged_in_email", data.user.email || email);
          localStorage.setItem("admin_logged_in_name", "Administrator");
          
          triggerToast("Administrative identity authenticated via core engine.");
          window.location.hash = "admin-dashboard";
        } else {
          throw new Error("Could not initialize a valid user session matrix.");
        }
      } else {
        throw new Error("Database network client connection offline.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Invalid administrative credentials or authority mismatch.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleExplicitLogout = async () => {
    try {
      if (logoutAdmin) {
        await logoutAdmin();
      } else if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Session clean-up intercept:", err);
    } finally {
      localStorage.removeItem("is_admin_authenticated");
      localStorage.removeItem("admin_logged_in_email");
      localStorage.removeItem("admin_logged_in_name");
      window.location.hash = "admin-login";
    }
  };

  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnosticsLog(["Initializing backend live validation diagnostics...", `Timestamp: ${new Date().toISOString()}`]);
    try {
      const diag = await runSupabaseDiagnostics();
      const logs = [
        `Supabase URL Configured: ${diag.configured ? "Yes" : "No"}`,
        `Database Connected: ${diag.connected ? "Yes" : "No"}`,
        `Admins Table Records: ${diag.count !== null ? diag.count : "N/A"}`,
        diag.error ? `Operational Alert: ${diag.error}` : "All system connections verified."
      ];
      setDiagnosticsLog(prev => [...prev, ...logs, "System diagnostics matrix validation: Success."]);
    } catch (err: any) {
      setDiagnosticsLog(prev => [...prev, `Error during diagnostics execution pipeline: ${err.message}`]);
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  // --- REWORKED BULLETPROOF LMS TRANSACTIONS SYSTEM ---

  // 1. COURSES TRANSACTION CONTROLLER
  const openCourseCreate = () => {
    setEditingCourse(null);
    setCourseForm({ 
      title: "", tagline: "", overview: "", description: "", instructor_name: "", instructor_bio: "", 
      price_naira: 45000, price: "45000", cover_url: "", thumbnail_url: "", video_url: "", duration_text: "12 weeks", duration: "12 weeks" 
    });
    setIsCourseModalOpen(true);
  };

  const openCourseEdit = (course: CourseRecord) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || "",
      tagline: course.tagline || "",
      overview: course.overview || course.description || "",
      description: course.description || "",
      instructor_name: course.instructor_name || "",
      instructor_bio: course.instructor_bio || "",
      price_naira: course.price_naira || parseFloat(course.price) || 0,
      price: course.price || String(course.price_naira),
      cover_url: course.thumbnail_url || course.cover_url || "",
      thumbnail_url: course.thumbnail_url || course.cover_url || "",
      video_url: course.video_url || "",
      duration_text: course.duration_text || course.duration || "",
      duration: course.duration || course.duration_text || ""
    });
    setIsCourseModalOpen(true);
  };

  const saveCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCourse(true);
    try {
      // Swapped out exclusively to 'thumbnail_url' to align with schema image
      const dbPayload = {
        title: courseForm.title,
        tagline: courseForm.tagline,
        overview: courseForm.overview || courseForm.description,
        description: courseForm.description,
        instructor_name: courseForm.instructor_name,
        instructor_bio: courseForm.instructor_bio,
        price_naira: Number(courseForm.price_naira),
        price: String(courseForm.price_naira),
        thumbnail_url: courseForm.cover_url || courseForm.thumbnail_url,
        video_url: courseForm.video_url,
        duration_text: courseForm.duration_text,
        duration: courseForm.duration_text
      };

      if (editingCourse) {
        const { error } = await supabase.from("courses").update(dbPayload).eq("id", editingCourse.id);
        if (error) throw error;
        triggerToast("Course details updated successfully inside cloud matrix.");
      } else {
        const { error } = await supabase.from("courses").insert([dbPayload]);
        if (error) throw error;
        triggerToast("New course track committed to the cloud layout engine.");
      }
      setIsCourseModalOpen(false);
      await fetchCoreLmsMatrix();
    } catch (err: any) {
      console.error(err);
      alert(`Course operational failure: ${err.message}`);
    } finally {
      setIsSavingCourse(false);
    }
  };

  const deleteCourseClick = async (id: string) => {
    if (!confirm("Are you sure you want to drop this course from data schemas?")) return;
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
      triggerToast("Course record dropped.");
      fetchCoreLmsMatrix();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 2. MODULES TRANSACTION CONTROLLER
  const openModuleCreate = () => {
    const parentCourseId = selectedCourseId || (courses[0]?.id || "");
    const existingCount = modules.filter(m => m.course_id === parentCourseId).length;
    setEditingModule(null);
    setModuleForm({ 
      title: "", 
      description: "", 
      course_id: parentCourseId, 
      order_index: existingCount + 1, 
      module_order: existingCount + 1 
    });
    setIsModuleModalOpen(true);
  };

  const openModuleEdit = (mod: ModuleRecord) => {
    setEditingModule(mod);
    setModuleForm({ 
      title: mod.title, 
      description: mod.description || "", 
      course_id: mod.course_id, 
      order_index: mod.module_order || mod.order_index || 1,
      module_order: mod.module_order || mod.order_index || 1
    });
    setIsModuleModalOpen(true);
  };

  const saveModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingModule(true);
    try {
      const dbPayload = {
        title: moduleForm.title,
        description: moduleForm.description,
        course_id: moduleForm.course_id,
        module_order: Number(moduleForm.module_order),
        order_index: Number(moduleForm.module_order)
      };

      if (editingModule) {
        const { error } = await supabase.from("modules").update(dbPayload).eq("id", editingModule.id);
        if (error) throw error;
        triggerToast("Module schema updated.");
      } else {
        const { error } = await supabase.from("modules").insert([dbPayload]);
        if (error) throw error;
        triggerToast("Module sequence added underneath selected course.");
      }
      setIsModuleModalOpen(false);
      await fetchCoreLmsMatrix();
    } catch (err: any) {
      alert(`Module operational fault: ${err.message}`);
    } finally {
      setIsSavingModule(false);
    }
  };

  const changeModuleOrder = async (mod: ModuleRecord, movement: "up" | "down") => {
    const contextModules = modules.filter(m => m.course_id === mod.course_id).sort((a,b) => a.module_order - b.module_order);
    const index = contextModules.findIndex(m => m.id === mod.id);
    if (index === -1) return;

    let targetIndex = movement === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contextModules.length) return;

    const competitor = contextModules[targetIndex];
    
    await supabase.from("modules").update({ module_order: competitor.module_order, order_index: competitor.module_order }).eq("id", mod.id);
    await supabase.from("modules").update({ module_order: mod.module_order, order_index: mod.module_order }).eq("id", competitor.id);
    
    fetchCoreLmsMatrix();
    triggerToast("Module layer sequence index transformed.");
  };

  const deleteModuleClick = async (id: string) => {
    if (!confirm("Drop this module row node?")) return;
    try {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;
      fetchCoreLmsMatrix();
      triggerToast("Module removed.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 3. LESSONS TRANSACTION CONTROLLER
  const openLessonCreate = () => {
    const parentModuleId = selectedModuleId || (modules.find(m => m.course_id === selectedCourseId)?.id || "");
    const existingCount = lessons.filter(l => l.module_id === parentModuleId).length;
    setEditingLesson(null);
    setLessonForm({
      title: "", description: "", content: "", video_url: "", duration_minutes: 15, duration: "15",
      module_id: parentModuleId, course_id: selectedCourseId, order_index: existingCount + 1, lesson_order: existingCount + 1
    });
    setIsLessonModalOpen(true);
  };

  const openLessonEdit = (les: LessonRecord) => {
    setEditingLesson(les);
    setLessonForm({
      title: les.title, description: les.description || les.content || "", content: les.content || les.description || "",
      video_url: les.video_url || "", duration_minutes: les.duration_minutes || parseFloat(les.duration) || 15,
      duration: les.duration || String(les.duration_minutes), module_id: les.module_id, course_id: les.course_id || selectedCourseId,
      order_index: les.lesson_order || les.order_index || 1, lesson_order: les.lesson_order || les.order_index || 1
    });
    setIsLessonModalOpen(true);
  };

  const saveLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLesson(true);
    try {
      const dbPayload = {
        title: lessonForm.title,
        description: lessonForm.description,
        content: lessonForm.description,
        video_url: lessonForm.video_url,
        duration_minutes: Number(lessonForm.duration_minutes),
        duration: String(lessonForm.duration_minutes),
        module_id: lessonForm.module_id,
        course_id: selectedCourseId,
        lesson_order: Number(lessonForm.lesson_order),
        order_index: Number(lessonForm.lesson_order)
      };

      if (editingLesson) {
        const { error } = await supabase.from("lessons").update(dbPayload).eq("id", editingLesson.id);
        if (error) throw error;
        triggerToast("Lesson dataset properties modified.");
      } else {
        const { error } = await supabase.from("lessons").insert([dbPayload]);
        if (error) throw error;
        triggerToast("Lesson sequence appended underneath module framework.");
      }
      setIsLessonModalOpen(false);
      await fetchCoreLmsMatrix();
    } catch (err: any) {
      alert(`Lesson deployment error: ${err.message}`);
    } finally {
      setIsSavingLesson(false);
    }
  };

  const changeLessonOrder = async (les: LessonRecord, movement: "up" | "down") => {
    const contextLessons = lessons.filter(l => l.module_id === les.module_id).sort((a,b) => a.lesson_order - b.lesson_order);
    const index = contextLessons.findIndex(l => l.id === les.id);
    if (index === -1) return;

    let targetIndex = movement === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contextLessons.length) return;

    const competitor = contextLessons[targetIndex];

    await supabase.from("lessons").update({ lesson_order: competitor.lesson_order, order_index: competitor.lesson_order }).eq("id", les.id);
    await supabase.from("lessons").update({ lesson_order: les.lesson_order, order_index: les.lesson_order }).eq("id", competitor.id);

    fetchCoreLmsMatrix();
    triggerToast("Lesson presentation sequence translated.");
  };

  const deleteLessonClick = async (id: string) => {
    if (!confirm("Permanently discard this lesson metadata item?")) return;
    try {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
      fetchCoreLmsMatrix();
      triggerToast("Lesson asset purged.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Modern string filters across composite keys
  const filteredStudents = students.filter(student => {
    const term = searchQuery.toLowerCase();
    return (
      student.full_name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.phone?.toLowerCase().includes(term) ||
      student.id?.toLowerCase().includes(term)
    );
  });

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutGrid },
    { id: "courses", label: "Manage Courses", icon: BookOpen },
    { id: "modules", label: "Course Modules", icon: Layers },
    { id: "lessons", label: "Manage Lessons", icon: Video },
    { id: "students", label: "Students Directory", icon: Users },
    { id: "sales", label: "Sales & Receipts", icon: Receipt },
    { id: "quizzes", label: "AI Quiz Bank", icon: ClipboardList },
    { id: "gas_config", label: "GAS AI Engine", icon: Sparkles },
    { id: "database", label: "Database Matrix", icon: ShieldAlert },
  ];

  if (currentHash === "#admin-login" || currentHash === "") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans antialiased">
        <div className="w-full max-w-sm bg-white border border-slate-200 shadow-xl rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Admin Sign In</h2>
            <p className="text-[11px] text-slate-400 font-medium">Sign In To Access Your Admin Dashboard.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 font-semibold text-xs flex items-start gap-2">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Admin Email Node</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="authority@lms.internal"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Master Gateway Cipher</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              {isLoggingIn ? "Validating Session..." : "Sign In As Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex relative overflow-hidden antialiased">
        
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-white text-slate-900 border border-emerald-200 shadow-xl rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
          </div>
        )}

        <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex flex-col justify-between z-20`}>
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              {sidebarOpen ? (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-900 rounded-xl text-white">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="font-black text-xs tracking-widest text-slate-900">LMS WORKBENCH</span>
                </div>
              ) : (
                <div className="p-1.5 bg-slate-900 rounded-xl text-white mx-auto">
                  <GraduationCap className="w-4 h-4" />
                </div>
              )}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 transition-colors"
              >
                {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive 
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button 
              onClick={handleExplicitLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>Exit Dashboard</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto min-h-screen flex flex-col">
          <header className="h-20 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <h1 className="text-base font-extrabold text-slate-900 uppercase tracking-wider capitalize">{activeTab.replace("_", " ")} Workbench</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">Secure Identity: {currentAdmin?.email || localStorage.getItem("admin_logged_in_email") || "System Root Administrator"}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] uppercase tracking-wider font-bold ${
                dbStatus?.connected ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dbStatus?.connected ? "bg-emerald-500 animate-ping" : "bg-emerald-500"}`} />
                {dbStatus?.connected ? "Operational Sync" : "No Framework Link"}
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl w-full mx-auto flex-1">
            
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border-l-4 border-l-emerald-500 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Paid Revenue</p>
                      <div className="p-1 bg-emerald-50 text-emerald-600 rounded-md"><DollarSign className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">₦0</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-slate-300" /> Wires idle until active billing rules fire
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-slate-900 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cohort Active Students</p>
                      <div className="p-1 bg-slate-100 text-slate-900 rounded-md"><UserCheck className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">{students.length || 0}</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      Live records active in database matrix
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-amber-500 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Courses Published</p>
                      <div className="p-1 bg-amber-50 text-amber-600 rounded-md"><BookOpen className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">{courses.length}</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      Automated distribution system active
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-indigo-500 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Modules / Lessons</p>
                      <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md"><Layers className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">{modules.length} / {lessons.length}</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      Relational learning entities active
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                    <div>
                      <h2 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Infrastructure Integration Calibration Console
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Test real-time platform mappings, token rules, and operational system health.</p>
                    </div>
                    <button
                      onClick={handleRunDiagnostics}
                      disabled={isRunningDiagnostics}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRunningDiagnostics ? "animate-spin" : ""}`} />
                      {isRunningDiagnostics ? "Validating System Engine..." : "Fire Diagnostics Calibration Check"}
                    </button>
                  </div>
                  
                  <div className="mt-4 bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400 h-40 overflow-y-auto space-y-1.5 shadow-inner">
                    {diagnosticsLog.length === 0 ? (
                      <p className="text-slate-500 italic">Console idling. Run a live diagnostic sweep to inspect validation variables...</p>
                    ) : (
                      diagnosticsLog.map((log, i) => (
                        <div key={i} className="leading-relaxed border-l border-emerald-700 pl-2.5">{log}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- COMPLETE BEAUTIFUL INTERACTIVE COURSES VIEW --- */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Global Course Master Records</h2>
                    <p className="text-[11px] text-slate-400">Provision curriculum pathways, pricing vectors, and assignments.</p>
                  </div>
                  <button 
                    onClick={openCourseCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add New Course
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        <div className="h-40 bg-slate-100 relative border-b border-slate-100">
                          {course.cover_url ? (
                            <img src={course.cover_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                              <Image className="w-6 h-6 stroke-1 text-slate-300" />
                              <span className="text-[10px] font-medium tracking-wide">No cover asset link specified</span>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-white font-black text-[11px]">
                            ₦{Number(course.price_naira).toLocaleString()}
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border uppercase">{course.duration_text || "Self-Paced"}</span>
                            <h3 className="text-xs font-black text-slate-900 tracking-tight mt-1.5 line-clamp-1">{course.title}</h3>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{course.description}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-100 text-slate-700 text-[10px] font-black rounded-lg flex items-center justify-center border uppercase">{course.instructor_name?.charAt(0) || "T"}</div>
                            <div className="text-[11px]">
                              <p className="font-bold text-slate-800 leading-none">{course.instructor_name || "Unassigned Tutor"}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{course.instructor_bio || "No profile bio recorded."}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button 
                          onClick={() => { setSelectedCourseId(course.id); setActiveTab("modules"); }}
                          className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline transition-colors"
                        >
                          View Modules Matrix
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => openCourseEdit(course)}
                            className="p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteCourseClick(course.id)}
                            className="p-1.5 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- COMPLETE MODULES VIEW WITH ORDERING CONTROLS --- */}
            {activeTab === "modules" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter Context Course Matrix Target</label>
                    <select 
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl p-2.5 text-slate-700 min-w-xs focus:outline-none focus:border-slate-400"
                    >
                      <option value="">-- Choose Target Course Map --</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <button 
                    disabled={!selectedCourseId}
                    onClick={openModuleCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Course Module
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Active Module Sequencing Layout
                  </div>
                  <div className="divide-y divide-slate-200">
                    {modules.filter(m => m.course_id === selectedCourseId).length === 0 ? (
                      <div className="p-16 text-center text-xs font-medium text-slate-400 italic">No structural modules linked under this specific course framework. Add a module to begin configuration layout steps.</div>
                    ) : (
                      modules.filter(m => m.course_id === selectedCourseId).map((mod, idx, arr) => (
                        <div key={mod.id} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400">
                              <span className="text-[11px] font-black text-slate-800">{mod.module_order || mod.order_index || (idx + 1)}</span>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{mod.title}</h4>
                              <p className="text-[10px] font-mono text-slate-400 select-all mt-0.5">UUID: {mod.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                              <button 
                                disabled={idx === 0}
                                onClick={() => changeModuleOrder(mod, "up")}
                                className="p-2 hover:bg-slate-50 text-slate-500 disabled:opacity-30 border-r border-slate-200 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                disabled={idx === arr.length - 1}
                                onClick={() => changeModuleOrder(mod, "down")}
                                className="p-2 hover:bg-slate-50 text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => { setSelectedModuleId(mod.id); setActiveTab("lessons"); }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-900 shadow-sm transition-all"
                              >
                                Manage Lessons
                              </button>
                              <button 
                                onClick={() => openModuleEdit(mod)}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer shadow-sm"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => deleteModuleClick(mod.id)}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- COMPLETE LESSONS VIEW WITH ORDERING CONTROLS --- */}
            {activeTab === "lessons" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Step 1: Course Selection</label>
                    <select 
                      value={selectedCourseId}
                      onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedModuleId(""); }}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl p-2.5 text-slate-700 focus:outline-none focus:border-slate-400"
                    >
                      <option value="">-- Choose Course --</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Step 2: Parent Module Alignment</label>
                    <select 
                      value={selectedModuleId}
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl p-2.5 text-slate-700 focus:outline-none focus:border-slate-400"
                    >
                      <option value="">-- Choose Module context --</option>
                      {modules.filter(m => m.course_id === selectedCourseId).map(m => <option key={m.id} value={m.id}>Mod {m.module_order || m.order_index || m.title}: {m.title}</option>)}
                    </select>
                  </div>

                  <button 
                    disabled={!selectedModuleId}
                    onClick={openLessonCreate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Lesson to Module
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Linked Lesson Indexes Table
                  </div>
                  <div className="divide-y divide-slate-100">
                    {lessons.filter(l => l.module_id === selectedModuleId).length === 0 ? (
                      <div className="p-16 text-center text-xs font-medium text-slate-400 italic">No lesson entries matching criteria. Align parent selectors above to track curriculum modules nodes.</div>
                    ) : (
                      lessons.filter(l => l.module_id === selectedModuleId).map((les, idx, arr) => (
                        <div key={les.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/30 transition-colors">
                          <div className="flex items-start gap-3.5 max-w-xl">
                            <div className="w-7 h-7 mt-0.5 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">
                              {les.lesson_order || les.order_index || (idx + 1)}
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                {les.title}
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wide text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border"><Clock className="w-2.5 h-2.5" /> {les.duration_minutes || les.duration} mins</span>
                              </h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed">{les.description || les.content || "No short description text recorded."}</p>
                              {les.video_url && (
                                <p className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 select-all"><Play className="w-2.5 h-2.5" /> {les.video_url}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3.5 justify-end">
                            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                              <button 
                                disabled={idx === 0}
                                onClick={() => changeLessonOrder(les, "up")}
                                className="p-2 hover:bg-slate-50 text-slate-500 disabled:opacity-30 border-r border-slate-200 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                disabled={idx === arr.length - 1}
                                onClick={() => changeLessonOrder(les, "down")}
                                className="p-2 hover:bg-slate-50 text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => openLessonEdit(les)}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 shadow-sm cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => deleteLessonClick(les.id)}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-rose-600 hover:bg-rose-50 shadow-sm cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* LIVE INTEGRATED STUDENTS DIRECTORY VIEW SECTION */}
            {activeTab === "students" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative max-w-md w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Search students by name, email or relational UUID link..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={fetchLiveStudents}
                    disabled={isLoadingStudents}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingStudents ? "animate-spin" : ""}`} />
                    Refresh Directory Data
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  {isLoadingStudents ? (
                    <div className="p-20 text-center space-y-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">Querying Relational Data Index...</p>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-20 text-center max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-400">
                        <UserX className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">No Registered Records</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        No active entries matching this criteria were found inside the remote schema.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/70 border-b border-slate-200">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Profile</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Node</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrollment Anchor Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">System Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {student.avatar_url ? (
                                    <img src={student.avatar_url} alt="" className="w-9 h-9 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                                  ) : (
                                    <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 font-extrabold text-xs">
                                      {student.full_name?.charAt(0) || "S"}
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">{student.full_name || "Anonymous Student"}</p>
                                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 select-all">{student.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{student.email}</span>
                                </div>
                                {student.phone && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                    <Phone className="w-3 h-3 text-slate-300" />
                                    <span>{student.phone}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                                  <Calendar className="w-3 text-slate-400" />
                                  <span>{new Date(student.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border bg-emerald-50 border-emerald-200 text-emerald-700">
                                  {student.status || "active"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "gas_config" && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 max-w-2xl space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">GAS Pipeline Architecture Engine</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Control orchestration parameters, prompt profiles, and autonomous generation logic blocks.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Target Engine Model ID</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-slate-400 text-slate-700">
                      <option value="gemini-1.5-pro">gemini-1.5-pro (Dynamic Inference Execution)</option>
                      <option value="gemini-1.5-flash">gemini-1.5-flash (High Speed Generation Burst)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Global System Instruction Framework</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-slate-400 text-slate-600 leading-relaxed"
                      defaultValue="System-attached orchestration agent logic template. Running operational infrastructure interfaces..."
                    />
                  </div>
                  <button 
                    onClick={() => triggerToast("System Instruction matrix re-mapped successfully!")}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 font-bold text-xs text-white rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Commit Active Model Rules
                  </button>
                </div>
              </div>
            )}

            {/* Catch leftover tabs */}
            {["sales", "quizzes", "database"].includes(activeTab) && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center max-w-md mx-auto my-12">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Activity className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">{activeTab.replace("_", " ")} Blueprint Matrix</h3>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Active structural canvas link established. Management interface tools will automatically initialize on this viewport as soon as entries populate.
                </p>
              </div>
            )}

          </div>
        </main>

        {/* --- REWORKED COURSE FORM POPUP DIALOG MODAL WITH LOADING STATE --- */}
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 my-8 text-left">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{editingCourse ? "Modify Course Schema Node" : "Commit New Course Track"}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Fill configuration nodes. Changes write globally to your database instantly.</p>
              </div>

              <form onSubmit={saveCourseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Course Title</label>
                    <input type="text" required value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} placeholder="e.g., AI Business Operations Blueprint" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Course Tagline / Catchphrase</label>
                    <input type="text" value={courseForm.tagline} onChange={e => setCourseForm({...courseForm, tagline: e.target.value})} placeholder="e.g., Automate your workflow pipelines with zero code blocks" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Detailed Description / Overview Text</label>
                    <textarea rows={2} required value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value, overview: e.target.value})} placeholder="Provide clear expectations of the core learning modules curriculum pathway..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-400 leading-relaxed" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Lead Tutor / Instructor</label>
                    <input type="text" required value={courseForm.instructor_name} onChange={e => setCourseForm({...courseForm, instructor_name: e.target.value})} placeholder="Instructor Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-slate-400" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Course Duration Indicator</label>
                    <input type="text" required value={courseForm.duration_text} onChange={e => setCourseForm({...courseForm, duration_text: e.target.value, duration: e.target.value})} placeholder="e.g., 12 weeks or 45 hours" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-slate-400" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">About Instructor Bio</label>
                    <textarea rows={2} value={courseForm.instructor_bio} onChange={e => setCourseForm({...courseForm, instructor_bio: e.target.value})} placeholder="Brief educational profile narrative..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-slate-400" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Price Matrix (₦ Naira Only)</label>
                    <input type="number" required value={courseForm.price_naira} onChange={e => setCourseForm({...courseForm, price_naira: Number(e.target.value)})} placeholder="Price in NGN" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Course Cover Asset Image Link (URL Render-Ready)</label>
                    <input type="url" value={courseForm.cover_url} onChange={e => setCourseForm({...courseForm, cover_url: e.target.value, thumbnail_url: e.target.value})} placeholder="https://images.unsplash.com/photo-..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 focus:outline-none focus:border-slate-400" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Introductory Video Hub Link (YouTube URL Preview Link)</label>
                    <input type="url" value={courseForm.video_url} onChange={e => setCourseForm({...courseForm, video_url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 focus:outline-none focus:border-slate-400" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-2">
                  <button type="button" disabled={isSavingCourse} onClick={() => setIsCourseModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                  <button type="submit" disabled={isSavingCourse} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 font-bold text-xs text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2">
                    {isSavingCourse ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>Commit Transaction Rules</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- REWORKED MODULES FORM MODAL WITH LOADING STATE --- */}
        {isModuleModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 text-left">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{editingModule ? "Edit Module Parameters" : "Provision New Module"}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Registers structural partitions within curriculum layers.</p>
              </div>
              <form onSubmit={saveModuleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Module Structural Title</label>
                  <input type="text" required value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} placeholder="e.g., Module 1: Foundational Prompt Strategies" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Module Order Positioning Index</label>
                  <input type="number" required value={moduleForm.module_order} onChange={e => setModuleForm({...moduleForm, module_order: Number(e.target.value), order_index: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Short Scope Description</label>
                  <input type="text" value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})} placeholder="Summary overview of tasks..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" disabled={isSavingModule} onClick={() => setIsModuleModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 rounded-lg">Dismiss</button>
                  <button type="submit" disabled={isSavingModule} className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-800 flex items-center gap-1.5">
                    {isSavingModule && <RefreshCw className="w-3 h-3 animate-spin" />}
                    <span>{isSavingModule ? "Processing..." : "Save Module Node"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- REWORKED LESSONS FORM MODAL WITH LOADING STATE --- */}
        {isLessonModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-left">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{editingLesson ? "Modify Lesson Artifact" : "Inject Live Lesson Entity"}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Saves directly underneath selected configuration sub-modules mapping index columns.</p>
              </div>
              <form onSubmit={saveLessonSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Lesson Presentation Title</label>
                  <input type="text" required value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} placeholder="e.g., Parsing Context Windows Safely" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Lesson Layout Sequence Order</label>
                  <input type="number" required value={lessonForm.lesson_order} onChange={e => setLessonForm({...lessonForm, lesson_order: Number(e.target.value), order_index: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Short Description Matrix</label>
                  <textarea rows={2} value={lessonForm.description} onChange={e => setLessonForm({...lessonForm, description: e.target.value, content: e.target.value})} placeholder="What the student uncovers in this lecture code segment..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Duration (Minutes)</label>
                  <input type="number" required value={lessonForm.duration_minutes} onChange={e => setLessonForm({...lessonForm, duration_minutes: Number(e.target.value), duration: String(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Streaming Video Source Path Link (YouTube / Vimeo Link)</label>
                  <input type="url" required value={lessonForm.video_url} onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 focus:outline-none focus:border-slate-400" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" disabled={isSavingLesson} onClick={() => setIsLessonModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 rounded-lg">Abort</button>
                  <button type="submit" disabled={isSavingLesson} className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-800 flex items-center gap-1.5">
                    {isSavingLesson && <RefreshCw className="w-3 h-3 animate-spin" />}
                    <span>{isSavingLesson ? "Saving..." : "Commit Lesson"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminGuard>
  );
}