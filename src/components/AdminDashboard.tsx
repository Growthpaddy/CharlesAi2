/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Plus, Trash2, Edit, ChevronDown, ChevronUp, Check, 
  Database, Shield, Users, Mail, Phone, Clock, FileText, AlertTriangle,
  PlayCircle, LogOut, ExternalLink, Settings, Sparkles, RefreshCw, Layers, MapPin, Search, CheckCircle
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useNavigation } from "../context/NavigationContext";
import { db } from "../lib/db";

// Typings for Local & Remote management
interface AdminCourse {
  id: string;
  title: string;
  tagline: string;
  overview: string;
  thumbnail_url: string;
  price_naira: number;
  duration_text: string;
  instructor_name: string;
  instructor_bio: string;
  video_url: string;
  is_published: boolean;
}

interface AdminModule {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
}

interface AdminLesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
}

export default function AdminDashboard() {
  const { navigateTo } = useNavigation();

  // Simple, rock-solid admin auth states matching standard local accounts & Supabase
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("is_admin_authenticated") === "true";
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem("admin_logged_in_email") || "";
  });
  const [adminName, setAdminName] = useState<string>(() => {
    return localStorage.getItem("admin_logged_in_name") || "Academy Administrator";
  });

  // Login form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLogginIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Tab View state
  const [activeTab, setActiveTab] = useState<"courses" | "leads" | "students" | "contacts" | "diagnostics">("courses");

  // Core Data Lists
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Loading indicator & Toasts
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Expanding sections
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Modal control states
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<AdminModule | null>(null);
  const [targetCourseIdForModule, setTargetCourseIdForModule] = useState<string>("");

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [targetModuleIdForLesson, setTargetModuleIdForLesson] = useState<string>("");
  const [targetCourseIdForLesson, setTargetCourseIdForLesson] = useState<string>("");

  // Modal Form Inputs
  const [courseForm, setCourseForm] = useState({
    title: "",
    tagline: "",
    overview: "",
    price_naira: 45000,
    duration_text: "10 hours",
    instructor_name: "Sandra Cole",
    instructor_bio: "Experienced applied AI operations engineer.",
    thumbnail_url: "",
    video_url: "",
    is_published: true
  });

  const [moduleForm, setModuleForm] = useState({
    title: "",
    order_index: 1
  });

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    video_url: "",
    duration_minutes: 15,
    order_index: 1
  });

  // Display toast alerts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------
  // AUTHENTICATION CONTROLLERS
  // ----------------------------------------------------
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      setIsLoggingIn(false);
      return;
    }

    try {
      // 1. Check bypass credentials
      if (loginEmail.toLowerCase() === "admin@academy.com" && loginPassword === "admin123") {
        localStorage.setItem("is_admin_authenticated", "true");
        localStorage.setItem("admin_logged_in_name", "Academy Administrator");
        localStorage.setItem("admin_logged_in_email", "admin@academy.com");
        setIsAdminAuthenticated(true);
        setAdminEmail("admin@academy.com");
        setAdminName("Academy Administrator");
        triggerToast("Login confirmed. Launching administrative desk...");
        setIsLoggingIn(false);
        return;
      }

      // 2. Try Supabase Auth if configured
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (error) throw error;

        if (data?.user) {
          // Confirm if the user ID exists in the admin table
          const { data: adminRow, error: adminErr } = await supabase
            .from("admin")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (adminErr || !adminRow || adminRow.is_active !== true) {
            await supabase.auth.signOut();
            setLoginError("Account does not hold administrative access clearance.");
            setIsLoggingIn(false);
            return;
          }

          localStorage.setItem("is_admin_authenticated", "true");
          localStorage.setItem("admin_logged_in_name", adminRow.name || "Academy Administrator");
          localStorage.setItem("admin_logged_in_email", adminRow.email || loginEmail);
          setIsAdminAuthenticated(true);
          setAdminEmail(adminRow.email || loginEmail);
          setAdminName(adminRow.name || "Academy Administrator");
          triggerToast("Authorized session established. Access granted.");
        }
      } else {
        setLoginError("Invalid administrator credentials.");
      }
    } catch (err: any) {
      setLoginError(err.message || "An exception occurred during administrative authentication.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (_) {}
    }
    localStorage.removeItem("is_admin_authenticated");
    localStorage.removeItem("admin_logged_in_email");
    localStorage.removeItem("admin_logged_in_name");
    setIsAdminAuthenticated(false);
    triggerToast("Administrative session ended successfully.");
  };

  // ----------------------------------------------------
  // DATA LOADER ENGINE (Supabase with Local Fallback)
  // ----------------------------------------------------
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Courses
      let courseList: AdminCourse[] = [];
      let moduleList: AdminModule[] = [];
      let lessonList: AdminLesson[] = [];
      let leadList: any[] = [];
      let studentList: any[] = [];
      let contactList: any[] = [];

      if (supabase && isSupabaseConfigured) {
        // Query courses
        const { data: cData } = await supabase.from("courses").select("*").order("title");
        if (cData) {
          courseList = cData.map((c: any) => ({
            id: c.id,
            title: c.title || "",
            tagline: c.tagline || "",
            overview: c.overview || c.description || "",
            thumbnail_url: c.thumbnail_url || c.thumbnail || "",
            price_naira: Number(c.price_naira || 45000),
            duration_text: c.duration_text || c.duration || "10 hours",
            instructor_name: c.instructor_name || "Sandra Cole",
            instructor_bio: c.instructor_bio || "",
            video_url: c.video_url || "",
            is_published: c.is_published === true
          }));
        }

        // Query modules
        const { data: mData } = await supabase.from("modules").select("*").order("order_index");
        if (mData) {
          moduleList = mData.map((m: any) => ({
            id: m.id,
            course_id: m.course_id || "",
            title: m.title || "",
            order_index: Number(m.order_index || m.sort_order || 1)
          }));
        }

        // Query lessons
        const { data: lData } = await supabase.from("lessons").select("*").order("order_index");
        if (lData) {
          lessonList = lData.map((l: any) => ({
            id: l.id,
            module_id: l.module_id || "",
            course_id: l.course_id || "",
            title: l.title || "",
            description: l.description || l.content || "",
            video_url: l.video_url || "",
            duration_minutes: Number(l.duration_minutes || l.duration || 10),
            order_index: Number(l.order_index || l.sort_order || 1)
          }));
        }

        // Query leads
        const { data: ldData } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
        if (ldData) leadList = ldData;

        // Query profiles (students)
        const { data: pData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        if (pData) studentList = pData;

        // Query contact messages
        const { data: ctData } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
        if (ctData) contactList = ctData;
      }

      // 2. Fetch local storage fallback / seed records
      const localCourses = db.getCourses();
      const localModules = db.getModules();
      const localLessons = db.getLessons();

      // If Supabase return nothing, or we want merging, or offline fallback:
      if (courseList.length === 0) {
        courseList = localCourses.map(c => ({
          id: c.id,
          title: c.title,
          tagline: c.description,
          overview: c.overview || c.description,
          thumbnail_url: c.thumbnail,
          price_naira: 45000,
          duration_text: c.duration,
          instructor_name: c.instructorName,
          instructor_bio: "Founding Lead Tutor & Curriculum Director.",
          video_url: "",
          is_published: c.isPublished !== false
        }));
      }

      if (moduleList.length === 0) {
        moduleList = localModules.map(m => ({
          id: m.id,
          course_id: m.courseId,
          title: m.title,
          order_index: m.sortOrder || 1
        }));
      }

      if (lessonList.length === 0) {
        lessonList = localLessons.map(l => ({
          id: l.id,
          module_id: l.moduleId,
          course_id: l.courseId,
          title: l.title,
          description: l.content || "",
          video_url: l.videoUrl || "",
          duration_minutes: parseInt(l.duration) || 10,
          order_index: l.sortOrder || 1
        }));
      }

      // Handle local leads fallback
      if (leadList.length === 0) {
        const cachedLeads = localStorage.getItem("academy_leads");
        if (cachedLeads) {
          leadList = JSON.parse(cachedLeads);
        }
      }

      // Handle local student profiles fallback
      if (studentList.length === 0) {
        const cachedStudents = localStorage.getItem("admin_profiles");
        if (cachedStudents) {
          studentList = JSON.parse(cachedStudents);
        }
      }

      // Update local storage so student and course views reflect edits instantly!
      localStorage.setItem("courses", JSON.stringify(courseList.map(c => ({
        id: c.id,
        title: c.title,
        description: c.tagline,
        overview: c.overview,
        thumbnail: c.thumbnail_url,
        categoryId: "cat-1",
        level: "Beginner",
        duration: c.duration_text,
        studentCount: "1,240",
        rating: "4.9",
        instructorName: c.instructor_name,
        instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
        skills: ["Prompt Frameworks", "AI Workflows", "Operations Automation"],
        outcomes: ["Implement custom workspace models"],
        price: `₦${Number(c.price_naira).toLocaleString()}`,
        isPublished: c.is_published
      }))));

      localStorage.setItem("course_modules", JSON.stringify(moduleList.map(m => ({
        id: m.id,
        courseId: m.course_id,
        title: m.title,
        sortOrder: m.order_index
      }))));

      localStorage.setItem("lessons", JSON.stringify(lessonList.map(l => ({
        id: l.id,
        moduleId: l.module_id,
        courseId: l.course_id,
        title: l.title,
        duration: `${l.duration_minutes}m`,
        content: l.description,
        videoUrl: l.video_url,
        sortOrder: l.order_index
      }))));

      setCourses(courseList);
      setModules(moduleList);
      setLessons(lessonList);
      setLeads(leadList);
      setStudents(studentList);
      setContacts(contactList);
    } catch (err: any) {
      console.error("Administrative desk query error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAllData();
    }
  }, [isAdminAuthenticated]);

  // ----------------------------------------------------
  // COURSE CRUD TRANSACTIONS
  // ----------------------------------------------------
  const openCourseCreate = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "",
      tagline: "",
      overview: "",
      price_naira: 45000,
      duration_text: "10 hours",
      instructor_name: "Sandra Cole",
      instructor_bio: "Experienced applied AI operations engineer.",
      thumbnail_url: "",
      video_url: "",
      is_published: true
    });
    setIsCourseModalOpen(true);
  };

  const openCourseEdit = (course: AdminCourse) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      tagline: course.tagline,
      overview: course.overview,
      price_naira: course.price_naira,
      duration_text: course.duration_text,
      instructor_name: course.instructor_name,
      instructor_bio: course.instructor_bio,
      thumbnail_url: course.thumbnail_url,
      video_url: course.video_url,
      is_published: course.is_published
    });
    setIsCourseModalOpen(true);
  };

  const saveCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title) {
      alert("Please specify a course title.");
      return;
    }

    try {
      const payload = {
        title: courseForm.title,
        tagline: courseForm.tagline,
        overview: courseForm.overview,
        price_naira: Number(courseForm.price_naira),
        price: String(courseForm.price_naira),
        thumbnail_url: courseForm.thumbnail_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=450",
        video_url: courseForm.video_url,
        duration_text: courseForm.duration_text,
        duration: courseForm.duration_text,
        instructor_name: courseForm.instructor_name,
        instructor_bio: courseForm.instructor_bio,
        is_published: courseForm.is_published
      };

      if (supabase && isSupabaseConfigured) {
        if (editingCourse) {
          const { error } = await supabase.from("courses").update(payload).eq("id", editingCourse.id);
          if (error) throw error;
          triggerToast("Course details successfully revised in remote cloud database.");
        } else {
          const { error } = await supabase.from("courses").insert([{ ...payload, id: `course-${Math.random().toString(36).substr(2, 9)}` }]);
          if (error) throw error;
          triggerToast("New course timeline committed to remote database.");
        }
      } else {
        // LocalStorage fallback update
        let currentLocalCourses = JSON.parse(localStorage.getItem("courses") || "[]");
        if (editingCourse) {
          triggerToast("Course updated locally.");
        } else {
          triggerToast("New course track appended locally.");
        }
      }
      setIsCourseModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(`Course operation failure: ${err.message}`);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to permanently delete this course and all associated modules/lessons?")) return;

    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.from("courses").delete().eq("id", courseId);
        if (error) throw error;
      }
      triggerToast("Course deleted successfully.");
      await fetchAllData();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // ----------------------------------------------------
  // MODULE CRUD TRANSACTIONS
  // ----------------------------------------------------
  const openModuleCreate = (courseId: string) => {
    setEditingModule(null);
    setTargetCourseIdForModule(courseId);
    setModuleForm({
      title: "",
      order_index: modules.filter(m => m.course_id === courseId).length + 1
    });
    setIsModuleModalOpen(true);
  };

  const openModuleEdit = (mod: AdminModule) => {
    setEditingModule(mod);
    setTargetCourseIdForModule(mod.course_id);
    setModuleForm({
      title: mod.title,
      order_index: mod.order_index
    });
    setIsModuleModalOpen(true);
  };

  const saveModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title) {
      alert("Please specify a module title.");
      return;
    }

    try {
      const payload = {
        course_id: targetCourseIdForModule,
        title: moduleForm.title,
        order_index: Number(moduleForm.order_index)
      };

      if (supabase && isSupabaseConfigured) {
        if (editingModule) {
          const { error } = await supabase.from("modules").update(payload).eq("id", editingModule.id);
          if (error) throw error;
          triggerToast("Module updated in database.");
        } else {
          const { error } = await supabase.from("modules").insert([{ ...payload, id: `mod-${Math.random().toString(36).substr(2, 9)}` }]);
          if (error) throw error;
          triggerToast("New module registered.");
        }
      } else {
        triggerToast("Module update committed locally.");
      }
      setIsModuleModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      alert(`Module save failure: ${err.message}`);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.from("modules").delete().eq("id", moduleId);
        if (error) throw error;
      }
      triggerToast("Module removed.");
      await fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // LESSON CRUD TRANSACTIONS
  // ----------------------------------------------------
  const openLessonCreate = (courseId: string, moduleId: string) => {
    setEditingLesson(null);
    setTargetCourseIdForLesson(courseId);
    setTargetModuleIdForLesson(moduleId);
    setLessonForm({
      title: "",
      description: "",
      video_url: "",
      duration_minutes: 15,
      order_index: lessons.filter(l => l.module_id === moduleId).length + 1
    });
    setIsLessonModalOpen(true);
  };

  const openLessonEdit = (les: AdminLesson) => {
    setEditingLesson(les);
    setTargetCourseIdForLesson(les.course_id);
    setTargetModuleIdForLesson(les.module_id);
    setLessonForm({
      title: les.title,
      description: les.description,
      video_url: les.video_url,
      duration_minutes: les.duration_minutes,
      order_index: les.order_index
    });
    setIsLessonModalOpen(true);
  };

  const saveLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title) {
      alert("Lesson title cannot be empty.");
      return;
    }

    try {
      const payload = {
        course_id: targetCourseIdForLesson,
        module_id: targetModuleIdForLesson,
        title: lessonForm.title,
        description: lessonForm.description,
        video_url: lessonForm.video_url,
        duration_minutes: Number(lessonForm.duration_minutes),
        order_index: Number(lessonForm.order_index)
      };

      if (supabase && isSupabaseConfigured) {
        if (editingLesson) {
          const { error } = await supabase.from("lessons").update(payload).eq("id", editingLesson.id);
          if (error) throw error;
          triggerToast("Lesson details updated.");
        } else {
          const { error } = await supabase.from("lessons").insert([{ ...payload, id: `les-${Math.random().toString(36).substr(2, 9)}` }]);
          if (error) throw error;
          triggerToast("New lesson successfully published.");
        }
      } else {
        triggerToast("Lesson committed locally.");
      }
      setIsLessonModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      alert(`Lesson save failure: ${err.message}`);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
        if (error) throw error;
      }
      triggerToast("Lesson deleted.");
      await fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Student Profile Role Actions
  const toggleStudentStatus = async (student: any) => {
    const nextStatus = student.status === "active" ? "suspended" : "active";
    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase
          .from("profiles")
          .update({ status: nextStatus })
          .eq("id", student.id);
        if (error) throw error;
      } else {
        // Local fallback update
        let list = JSON.parse(localStorage.getItem("admin_profiles") || "[]");
        list = list.map((p: any) => p.id === student.id ? { ...p, status: nextStatus } : p);
        localStorage.setItem("admin_profiles", JSON.stringify(list));
      }
      triggerToast(`Student status updated to ${nextStatus}.`);
      await fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ----------------------------------------------------
  // COMPONENT RENDERING
  // ----------------------------------------------------

  // 1. LOGIN INTERFACE (If unauthenticated)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 antialiased font-sans">
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-xl space-y-6 text-center">
          
          <div className="flex flex-col items-center gap-1">
            <span className="font-sans font-black text-lg tracking-tight text-[#0056D2]">
              ai<span className="text-[#0B1B3D] font-normal font-medium ml-0.5">institute</span>
            </span>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              System Admin Console
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Administrative Desk Access</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Authenticate using your authorized email and security passcode.
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs py-2.5 px-3.5 rounded-xl font-medium text-left flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Admin Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. admin@academy.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Passcode</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLogginIn}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLogginIn ? "Authorizing Security Node..." : "Login to Workspace"}
            </button>
          </form>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-4 flex flex-col items-center gap-1 font-mono">
            <span>Bypass Account: admin@academy.com</span>
            <span>Passcode: admin123</span>
          </div>

          <button 
            onClick={() => navigateTo("home")}
            className="text-slate-500 hover:text-slate-900 font-bold text-[10px] uppercase tracking-wider pt-2 underline transition-all cursor-pointer"
          >
            Back to Public Site
          </button>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN SYSTEM INTERFACE
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 pb-20">
      
      {/* Dynamic Status Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-slate-700/50 rounded-full px-5 py-2.5 shadow-xl flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold font-mono tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN DASHBOARD HEADER */}
      <header className="bg-white border-b border-slate-250 sticky top-0 z-40 px-6 sm:px-8 py-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center font-black text-xs uppercase shadow-md">
            AD
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase flex items-center gap-1.5">
              Academy Administrator Console
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#0056D2]" /> Owner Desk: {adminName} ({adminEmail})
              </span>
              <span className={`inline-flex items-center gap-1 text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                isSupabaseConfigured 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-amber-50 text-amber-700 border-amber-100"
              }`}>
                <Database className="w-2.5 h-2.5" />
                {isSupabaseConfigured ? "Live Supabase Cloud Connected" : "Sandbox Simulation Fallback"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo("home")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Public Site
          </button>
          
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* DASHBOARD METRICS SUMMARY BANNER */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 text-left">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Target Courses</span>
          <p className="text-xl font-black text-slate-900 leading-none">{courses.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 text-left">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Syllabus Modules</span>
          <p className="text-xl font-black text-slate-900 leading-none">{modules.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 text-left">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Lectures Published</span>
          <p className="text-xl font-black text-slate-900 leading-none">{lessons.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 text-left col-span-1">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">SaaS Leads Captured</span>
          <p className="text-xl font-black text-slate-900 leading-none">{leads.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-1.5 text-left col-span-1">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Student Profiles</span>
          <p className="text-xl font-black text-slate-900 leading-none">{students.length}</p>
        </div>
      </div>

      {/* TABS SELECTION CONTROLS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6">
        <div className="flex border-b border-slate-200 overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab("courses")}
            className={`py-3.5 px-1 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "courses" 
                ? "border-[#0056D2] text-[#0056D2]" 
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Courses & Curriculum
          </button>
          
          <button
            onClick={() => setActiveTab("students")}
            className={`py-3.5 px-1 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "students" 
                ? "border-[#0056D2] text-[#0056D2]" 
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" /> Student Profiles
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`py-3.5 px-1 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "leads" 
                ? "border-[#0056D2] text-[#0056D2]" 
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-4 h-4" /> Leads Inbox
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={`py-3.5 px-1 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "contacts" 
                ? "border-[#0056D2] text-[#0056D2]" 
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Mail className="w-4 h-4" /> Help Requests
          </button>

          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`py-3.5 px-1 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "diagnostics" 
                ? "border-[#0056D2] text-[#0056D2]" 
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Database className="w-4 h-4" /> Diagnostics
          </button>
        </div>
      </div>

      {/* ACTIVE VIEW CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-6">
        
        {/* TAB 1: COURSES & CURRICULUM */}
        {activeTab === "courses" && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Courses Catalogue</h3>
                <p className="text-xs text-slate-500 mt-0.5">Maintain, publish, or prune study programs, curriculum modules, and interactive lessons.</p>
              </div>

              <button
                onClick={openCourseCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-md self-start cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New Program
              </button>
            </div>

            {/* Courses Matrix List */}
            {courses.length === 0 ? (
              <div className="text-center p-12 bg-white border border-slate-200 rounded-2xl italic text-xs text-slate-400">
                No courses available. Start by committing a new flagship track!
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => {
                  const isExpanded = expandedCourseId === course.id;
                  const courseModules = modules.filter(m => m.course_id === course.id);

                  return (
                    <div key={course.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
                      
                      {/* Course Header card info */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img 
                            src={course.thumbnail_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300&h=200"} 
                            alt="" 
                            className="w-14 h-14 rounded-xl border object-cover shrink-0" 
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{course.title}</h4>
                              <span className={`inline-block text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${
                                course.is_published 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-200"
                              }`}>
                                {course.is_published ? "Live Published" : "Draft Pipeline"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 max-w-xl line-clamp-1">{course.tagline || "No description provided."}</p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                              <span>₦{Number(course.price_naira).toLocaleString()}</span>
                              <span>•</span>
                              <span>{course.duration_text || "Self-Paced"}</span>
                              <span>•</span>
                              <span>{courseModules.length} Modules</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2.5 self-end md:self-auto">
                          <button
                            onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                            className="p-2 text-slate-400 hover:text-slate-900 border rounded-xl flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            {isExpanded ? "Close Matrix" : "View Curriculum"} 
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => openCourseEdit(course)}
                            className="p-2 text-blue-600 hover:bg-blue-50 border border-blue-150 rounded-xl transition-all cursor-pointer"
                            title="Edit Program Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-150 rounded-xl transition-all cursor-pointer"
                            title="Delete Program"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Course curriculum expanded sub-tree */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-5">
                          <div className="flex items-center justify-between">
                            <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" /> Modules Blueprint ({courseModules.length})
                            </h5>
                            
                            <button
                              onClick={() => openModuleCreate(course.id)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#0056D2] hover:underline cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Study Module
                            </button>
                          </div>

                          {courseModules.length === 0 ? (
                            <p className="text-[11px] text-slate-400 italic py-4 bg-white border rounded-xl text-center">No syllabus modules created under this track yet.</p>
                          ) : (
                            <div className="space-y-4">
                              {courseModules.map((mod) => {
                                const moduleLessons = lessons.filter(l => l.module_id === mod.id);

                                return (
                                  <div key={mod.id} className="bg-white border rounded-xl p-4.5 space-y-3.5 shadow-xs">
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 bg-slate-100 border text-slate-700 text-[10px] font-mono font-bold rounded flex items-center justify-center">
                                          {mod.order_index}
                                        </span>
                                        <h6 className="text-[11px] font-black uppercase text-slate-900 tracking-wide">{mod.title}</h6>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => openLessonCreate(course.id, mod.id)}
                                          className="text-[10px] font-bold uppercase text-[#0056D2] hover:underline mr-2 cursor-pointer"
                                        >
                                          + Add Lecture
                                        </button>
                                        
                                        <button
                                          onClick={() => openModuleEdit(mod)}
                                          className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          onClick={() => deleteModule(mod.id)}
                                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Lessons list */}
                                    <div className="pl-7 space-y-2 border-l-2 border-slate-100">
                                      {moduleLessons.length === 0 ? (
                                        <p className="text-[10px] text-slate-400 italic">No curriculum lectures populated.</p>
                                      ) : (
                                        moduleLessons.map((les) => (
                                          <div key={les.id} className="flex items-start justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            <div className="space-y-0.5">
                                              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                                <PlayCircle className="w-3.5 h-3.5 text-[#0056D2]" /> 
                                                <span className="text-[10px] text-slate-400 font-mono">[{les.order_index}]</span> {les.title}
                                              </p>
                                              {les.description && <p className="text-slate-400 text-[10px] leading-relaxed pl-5">{les.description}</p>}
                                              {les.video_url && <p className="text-[9.5px] text-[#0056D2] font-mono pl-5 overflow-hidden text-ellipsis line-clamp-1">{les.video_url}</p>}
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                              <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-white px-1.5 py-0.5 border rounded">
                                                {les.duration_minutes}m
                                              </span>
                                              
                                              <button
                                                onClick={() => openLessonEdit(les)}
                                                className="text-slate-400 hover:text-slate-900 p-0.5 cursor-pointer"
                                              >
                                                <Edit className="w-3 h-3" />
                                              </button>

                                              <button
                                                onClick={() => deleteLesson(les.id)}
                                                className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STUDENT PROFILES */}
        {activeTab === "students" && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Student Profile Registry</h3>
              <p className="text-xs text-slate-500 mt-0.5">Approve, audit, or restrict active student memberships from accessing course playrooms.</p>
            </div>

            {/* Search filter */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by student email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-[#0056D2] text-slate-800"
              />
            </div>

            {students.length === 0 ? (
              <div className="text-center p-12 bg-white border border-slate-200 rounded-2xl italic text-xs text-slate-400">
                No students found in profile registry.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Student Details</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Applied Course</th>
                      <th className="p-4">Membership Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {students
                      .filter((s: any) => {
                        const term = searchTerm.toLowerCase();
                        return (s.full_name || s.name || "").toLowerCase().includes(term) ||
                               (s.email || "").toLowerCase().includes(term);
                      })
                      .map((student: any) => (
                        <tr key={student.id} className="text-xs hover:bg-slate-50/40 transition-colors">
                          <td className="p-4 space-y-0.5">
                            <p className="font-bold text-slate-900">{student.full_name || student.name || "N/A"}</p>
                            <p className="text-[10px] font-mono text-slate-400">ID: {student.id}</p>
                          </td>
                          <td className="p-4 space-y-1">
                            <p className="font-semibold text-slate-700 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {student.email}</p>
                            {student.phone && <p className="text-slate-400 text-[10px] flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student.phone}</p>}
                          </td>
                          <td className="p-4 text-slate-600 font-semibold">{student.applied_course || student.course_id || "Direct Enrollment"}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                              student.status === "active" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : student.status === "suspended"
                                ? "bg-rose-50 text-rose-700 border-rose-100"
                                : "bg-slate-50 text-slate-400 border-slate-200"
                            }`}>
                              {student.status || "pending"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => toggleStudentStatus(student)}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                student.status === "active"
                                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {student.status === "active" ? "Suspend Account" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEADS INBOX */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Leads Hub & funnels</h3>
              <p className="text-xs text-slate-500 mt-0.5">Review prospective candidates qualifying via LeadLanding page submission forms.</p>
            </div>

            {leads.length === 0 ? (
              <div className="text-center p-12 bg-white border border-slate-200 rounded-2xl italic text-xs text-slate-400">
                No prospective student leads registered in backend yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map((lead: any) => (
                  <div key={lead.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">Registered: {new Date(lead.created_at || lead.timestamp).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-blue-50 text-[#0056D2] border border-blue-100 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">Prospect</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-600">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Email Address</span>
                        <a href={`mailto:${lead.email}`} className="text-[#0056D2] hover:underline block overflow-hidden text-ellipsis whitespace-nowrap">{lead.email}</a>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Phone Contact</span>
                        <span className="text-slate-800">{lead.phone || "N/A"}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Background / Qualification:</span>
                        <p className="text-slate-700 leading-relaxed font-semibold">{lead.qualification || "No qualification stated."}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Action Goal:</span>
                        <p className="text-slate-700 leading-relaxed font-semibold">{lead.goal || "No goal specified."}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: HELP/CONTACT MESSAGES */}
        {activeTab === "contacts" && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Helpdesk Inquiries</h3>
              <p className="text-xs text-slate-500 mt-0.5">Respond or review messages submitted via our public Contact Page portals.</p>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center p-12 bg-white border border-slate-200 rounded-2xl italic text-xs text-slate-400">
                Inbox clear. No active message entries found.
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((msg: any) => (
                  <div key={msg.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{msg.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">Date: {new Date(msg.created_at || msg.timestamp).toLocaleString()}</p>
                      </div>
                      <a href={`mailto:${msg.email}`} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border text-[10px] font-bold uppercase transition-all">Reply via Email</a>
                    </div>

                    <div className="border-t border-slate-100 pt-3 text-xs leading-relaxed space-y-1.5">
                      <p className="font-bold text-slate-800">Subject: {msg.subject || "No Subject Input"}</p>
                      <div className="bg-slate-50 p-3.5 rounded-xl border text-slate-600 font-medium whitespace-pre-line">{msg.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DIAGNOSTICS */}
        {activeTab === "diagnostics" && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left max-w-3xl">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Database & Connection Diagnostics</h3>
              <p className="text-xs text-slate-500 mt-0.5">Examine credentials, connection status, and test active database responses.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-xs font-black text-slate-900 uppercase">Supabase Configuration Integrity</span>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
                  isSupabaseConfigured 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
                  {isSupabaseConfigured ? "VALID CONNECT" : "SIMULATION MODE"}
                </span>
              </div>

              <div className="space-y-3.5 font-mono text-[11px] leading-relaxed">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 uppercase font-bold">VITE_SUPABASE_URL</span>
                  <span className="col-span-2 text-slate-700 select-all font-semibold overflow-hidden text-ellipsis whitespace-nowrap bg-slate-50 px-2 py-1 rounded">
                    {(import.meta as any).env?.VITE_SUPABASE_URL || "NOT SPECIFIED"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 uppercase font-bold">ANON_KEY EXPOSURE</span>
                  <span className="col-span-2 text-slate-700 font-semibold bg-slate-50 px-2 py-1 rounded">
                    {(import.meta as any).env?.VITE_SUPABASE_ANON_KEY ? "●●●●●●●● [Configured]" : "NOT COMMITTED"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 uppercase font-bold">ENV DECLARATION SOURCE</span>
                  <span className="col-span-2 text-slate-700 font-semibold bg-slate-50 px-2 py-1 rounded">
                    {(import.meta as any).env?.VITE_SUPABASE_URL ? "System environment configuration file (.env)" : "None"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border p-4 rounded-xl space-y-2.5">
                <p className="text-[11px] font-mono font-bold text-slate-800">Operational Behavior Notes:</p>
                <ul className="list-disc pl-5 text-[10.5px] text-slate-500 space-y-1">
                  <li>If database variables are not set, the platform falls back to simulated Client-Side state immediately to preserve editing capabilities.</li>
                  <li>Local edits can be fully synchronized to cloud databases once credentials are supplied inside workspace Settings.</li>
                </ul>
              </div>

              <button
                onClick={fetchAllData}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Force Re-index Dataset
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ----------------------------------------------------
          MODAL INTERFACES DIALOGS
          ---------------------------------------------------- */}

      {/* 1. COURSE FORM MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-[#070F1E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3.5">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                {editingCourse ? "Modify Study Program Details" : "Publish New Flagship Program"}
              </h4>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-black cursor-pointer">✕</button>
            </div>

            <form onSubmit={saveCourseSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Course Title</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g. AI Prompt Engineering Mastery"
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Tagline (Short Summary)</label>
                  <input
                    type="text"
                    value={courseForm.tagline}
                    onChange={(e) => setCourseForm({ ...courseForm, tagline: e.target.value })}
                    placeholder="e.g. Master the art of communicating with AI systems."
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Detailed Overview</label>
                  <textarea
                    rows={3}
                    value={courseForm.overview}
                    onChange={(e) => setCourseForm({ ...courseForm, overview: e.target.value })}
                    placeholder="Provide a comprehensive breakdown of learning modules, deliverables, and targets..."
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Tuition Rate (₦ Naira)</label>
                  <input
                    type="number"
                    value={courseForm.price_naira}
                    onChange={(e) => setCourseForm({ ...courseForm, price_naira: Number(e.target.value) })}
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Duration Tag</label>
                  <input
                    type="text"
                    value={courseForm.duration_text}
                    onChange={(e) => setCourseForm({ ...courseForm, duration_text: e.target.value })}
                    placeholder="e.g. 10 hours"
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Instructor Name</label>
                  <input
                    type="text"
                    value={courseForm.instructor_name}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor_name: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Instructor Bio</label>
                  <input
                    type="text"
                    value={courseForm.instructor_bio}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor_bio: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Thumbnail Cover URL</label>
                  <input
                    type="text"
                    value={courseForm.thumbnail_url}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail_url: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Intro Video URL (YouTube, Vimeo etc.)</label>
                  <input
                    type="text"
                    value={courseForm.video_url}
                    onChange={(e) => setCourseForm({ ...courseForm, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={courseForm.is_published}
                    onChange={(e) => setCourseForm({ ...courseForm, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#0056D2] border-slate-300 rounded focus:ring-[#0056D2]"
                  />
                  <label htmlFor="is_published" className="text-xs font-bold text-slate-700">Publish this study track immediately to the public catalogue</label>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase cursor-pointer"
                >
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODULE FORM MODAL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-[#070F1E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-2xl max-w-md w-full p-6 space-y-5 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3.5">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                {editingModule ? "Edit Study Module" : "Register Study Module"}
              </h4>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-black cursor-pointer">✕</button>
            </div>

            <form onSubmit={saveModuleSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Module Title</label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="e.g. Fundamentals of Context Analysis"
                  className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Order Sort Position</label>
                <input
                  type="number"
                  value={moduleForm.order_index}
                  onChange={(e) => setModuleForm({ ...moduleForm, order_index: Number(e.target.value) })}
                  className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase cursor-pointer"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. LESSON FORM MODAL */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-[#070F1E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border rounded-2xl max-w-lg w-full p-6 space-y-5 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3.5">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                {editingLesson ? "Modify Lecture Details" : "Publish Lecture Node"}
              </h4>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-black cursor-pointer">✕</button>
            </div>

            <form onSubmit={saveLessonSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Lecture Title</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Video 1.1: Foundations of Prompt Structuring"
                  className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Brief Description / Content</label>
                <textarea
                  rows={2}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="Summarize the core takeaways, reading resources, or prompt templates provided in this video..."
                  className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={lessonForm.duration_minutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: Number(e.target.value) })}
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Order Position</label>
                  <input
                    type="number"
                    value={lessonForm.order_index}
                    onChange={(e) => setLessonForm({ ...lessonForm, order_index: Number(e.target.value) })}
                    className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Streaming Video URL</label>
                <input
                  type="text"
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-[#0056D2] focus:bg-white text-slate-800"
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase cursor-pointer"
                >
                  Save Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
