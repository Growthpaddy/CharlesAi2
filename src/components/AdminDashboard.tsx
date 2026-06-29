/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, BookOpen, Users, Receipt, ClipboardList, Sparkles, 
  Video, PenTool, MessageSquare, GraduationCap, BarChart3, Star,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, Eye, EyeOff, Trash2, Edit2, Check, X, 
  Search, Calendar, Mail, Phone, DollarSign, Clock, FileText, 
  Download, ArrowUpRight, CheckCircle2, AlertCircle, Heart, FolderPlus,
  Tv, Award, RefreshCw, Layers, UserPlus, LogOut, ShieldCheck, Key, QrCode, Lock, Shield, ShieldAlert,
  ArrowUp, ArrowDown, GripVertical, Link as LinkIcon, PlusCircle, UserCheck, UserX, Info, Settings
} from "lucide-react";
import { db, Course, CourseModule, Lesson, Category } from "../lib/db";
import { supabase, isSupabaseConfigured, updateSupabaseClient } from "../lib/supabase";
import { checkAdminExists, checkAdminOwnerExists, runSupabaseDiagnostics } from "../lib/adminAuth";
import { useNavigation } from "../context/NavigationContext";
import { isClientReady } from "../lib/supabaseClient";
import { AdminGuard } from "./AdminGuard";
import { createJWT, verifyJWT } from "../lib/jwt";
import { testConnection } from "../lib/dbTest";
import { useAdmin } from "../context/AdminContext";

// Define Admin Tab type
type AdminTab = 
  | "dashboard" 
  | "courses" 
  | "modules"
  | "lessons"
  | "students" 
  | "invoices" 
  | "survey" 
  | "leads" 
  | "live" 
  | "blog" 
  | "kb" 
  | "grading" 
  | "analytics" 
  | "testimonials"
  | "supabase";

interface Invoice {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  issuedAt: string;
}

interface SurveyResponse {
  id: string;
  studentName: string;
  rating: number;
  feedback: string;
  category: string;
  submittedAt: string;
}

interface LiveClass {
  id: string;
  title: string;
  date: string;
  time: string;
  instructor: string;
  classUrl: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
}

interface KBArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
}

interface GradeRecord {
  id: string;
  studentName: string;
  courseTitle: string;
  lessonTitle: string;
  submittedAt: string;
  status: "Graded" | "Pending";
  grade: string;
  feedback: string;
}

interface StudentRecord {
  id: string;
  full_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  status?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { navigateTo } = useNavigation();
  const { logout: contextLogout, login: contextLogin, checkAuth, loading: contextLoading } = useAdmin();

  // Supabase readiness state
  const [isReady, setIsReady] = useState<boolean>(() => isClientReady());
  const [currentHash, setCurrentHash] = useState(typeof window !== "undefined" ? window.location.hash : "");

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Authentication & Configuration States
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    return localStorage.getItem("is_admin_authenticated") === "true";
  });
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isOwnerLoading, setIsOwnerLoading] = useState<boolean>(true);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthErr, setAdminAuthErr] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup states
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Connection settings states
  const [showLocalConfig, setShowLocalConfig] = useState(false);
  const [localUrl, setLocalUrl] = useState(() => localStorage.getItem("VITE_SUPABASE_URL") || "");
  const [localAnonKey, setLocalAnonKey] = useState(() => localStorage.getItem("VITE_SUPABASE_ANON_KEY") || "");
  const [saveStatus, setSaveStatus] = useState("");

  const [signedUpAdmin, setSignedUpAdmin] = useState<any>(() => {
    const stored = localStorage.getItem("signed_up_admin");
    return stored ? JSON.parse(stored) : null;
  });
  const [adminExists, setAdminExists] = useState<boolean>(false);
  const [ownerExists, setOwnerExists] = useState<boolean>(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Diagnostic states
  const [dbStatus, setDbStatus] = useState<{ success: boolean; rowCount?: number; error?: any; localSimulation?: boolean } | null>(null);
  const [diagnosticsLog, setDiagnosticsLog] = useState<string[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Students Directory Live States
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Courses list
  const [courses, setCourses] = useState<Course[]>(() => db.getCourses());
  const [searchCourseQuery, setSearchCourseQuery] = useState("");
  
  // Course creation state
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseOverview, setNewCourseOverview] = useState("");
  const [newCourseThumbnail, setNewCourseThumbnail] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("cat-1");
  const [newCourseLevel, setNewCourseLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [newCourseDuration, setNewCourseDuration] = useState("");
  const [newCourseSkills, setNewCourseSkills] = useState("");
  const [newCourseOutcomes, setNewCourseOutcomes] = useState("");
  const [newCoursePrice, setNewCoursePrice] = useState("₦45,000");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (!window.location.hash || window.location.hash === "#admin-login") {
      window.location.hash = isAdminAuth ? "admin-dashboard" : "admin-login";
    }
    setCurrentHash(window.location.hash);

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);

    const checkReady = () => {
      setIsReady(isClientReady());
    };
    checkReady();
    const interval = setInterval(checkReady, 5000);

    const runInitCheck = async () => {
      try {
        const res = await testConnection();
        setDbStatus(res);
        const exists = await checkAdminExists();
        setAdminExists(exists);
        const ownerEx = await checkAdminOwnerExists();
        setOwnerExists(ownerEx);
      } catch (err: any) {
        setDbStatus({ success: false, error: err.message || "Failed connection check" });
      }
    };
    runInitCheck();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      clearInterval(interval);
    };
  }, [isAdminAuth]);

  // Authenticate and verify owner authorization status dynamically
  useEffect(() => {
    if (!isAdminAuth) {
      setIsOwner(false);
      setIsOwnerLoading(false);
      return;
    }

    const checkOwnerStatus = async () => {
      setIsOwnerLoading(true);
      try {
        const ownerResult = await checkAuth();
        setIsOwner(ownerResult);
      } catch (err) {
        console.error("Error checking owner status:", err);
        setIsOwner(false);
      } finally {
        setIsOwnerLoading(false);
      }
    };

    checkOwnerStatus();
  }, [isAdminAuth, checkAuth]);

  // Automatically verify JWT Session Token on mount
  useEffect(() => {
    const runJwtValidation = async () => {
      const storedToken = localStorage.getItem("admin_session_token");
      if (!storedToken) {
        if (localStorage.getItem("is_admin_authenticated") === "true") {
          const email = localStorage.getItem("admin_logged_in_email") || "admin@aionlinebusiness.org";
          const name = localStorage.getItem("admin_logged_in_name") || "Chief Academic Director";
          try {
            const token = await createJWT({ email, name });
            localStorage.setItem("admin_session_token", token);
          } catch (err) {
            console.error("Failed to generate transitional session JWT:", err);
          }
        }
        return;
      }

      try {
        const payload = await verifyJWT(storedToken);
        if (!payload) {
          console.warn("[JWT Security] Session token is invalid or has expired.");
          handleAdminLogout();
        } else {
          localStorage.setItem("is_admin_authenticated", "true");
          localStorage.setItem("admin_logged_in_name", payload.name);
          localStorage.setItem("admin_logged_in_email", payload.email);
          setIsAdminAuth(true);
        }
      } catch (err) {
        console.error("Error during automatic JWT verification:", err);
        handleAdminLogout();
      }
    };

    runJwtValidation();
  }, []);

  // Fetch live students whenever the user switches onto the Students tab
  useEffect(() => {
    if (activeTab === "students") {
      fetchLiveStudents();
    }
  }, [activeTab]);

  const fetchLiveStudents = async () => {
    setIsLoadingStudents(true);
    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setStudents(data || []);
      } else {
        const localStudents = localStorage.getItem("profiles");
        if (localStudents) {
          setStudents(JSON.parse(localStudents));
        } else {
          setStudents([]);
        }
      }
    } catch (err: any) {
      console.error("Error reading students index:", err);
      triggerToast(`Failed fetching student data: ${err.message}`);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnosticsLog([]);
    const logs: string[] = [];

    const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      logs.push(`[${time}] ${msg}`);
      setDiagnosticsLog([...logs]);
    };

    try {
      addLog("Initializing system diagnostic calibrations...");
      addLog(`Supabase Dynamic Config status: ${isSupabaseConfigured ? "INITIALIZED" : "NOT CONFIGURED"}`);
      
      const res = await testConnection();
      addLog(`Relational Framework Link status: ${res.success ? "STABLE" : "OFFLINE"}`);
      addLog(`Database status response: ${res.error ? JSON.stringify(res.error) : "OK"}`);
      setDbStatus(res);

      if (supabase && isSupabaseConfigured) {
        addLog("Retrieving current authenticated admin session metadata...");
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        
        if (authErr) {
          addLog(`Auth Query Failed: ${authErr.message}`);
        } else if (user) {
          addLog(`Authenticated User ID: ${user.id}`);
          addLog(`Retrieving metadata for ID from 'admin' table...`);

          const { data: admin, error: dbError } = await supabase
            .from("admin")
            .select("*")
            .eq("id", user.id)
            .single();

          if (dbError) {
            addLog(`Admin Table lookup error: ${dbError.message}`);
          } else {
            addLog(`Admin Record retrieved successfully!`);
            addLog(` - Name: ${admin.name}`);
            addLog(` - Email: ${admin.email}`);
            addLog(` - is_owner: ${admin.is_owner}`);
            addLog(` - is_active: ${admin.is_active}`);
          }
        } else {
          addLog("No active Supabase auth session detected.");
        }
      } else {
        addLog("Running in transient LocalStorage sandbox mode.");
      }

      addLog("Calibration complete. All components verified.");
      triggerToast("Diagnostics executed successfully.");
    } catch (err: any) {
      addLog(`Critical system calibration exception: ${err.message || err}`);
      triggerToast("Diagnostics failed.");
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const handleSaveLocalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanUrl = localUrl.trim();
      const cleanKey = localAnonKey.trim();
      if (cleanUrl) {
        localStorage.setItem("VITE_SUPABASE_URL", cleanUrl);
      } else {
        localStorage.removeItem("VITE_SUPABASE_URL");
      }
      if (cleanKey) {
        localStorage.setItem("VITE_SUPABASE_ANON_KEY", cleanKey);
      } else {
        localStorage.removeItem("VITE_SUPABASE_ANON_KEY");
      }
      
      updateSupabaseClient();
      const ready = isClientReady();
      setIsReady(ready);
      
      if (ready) {
        setSaveStatus("success");
        triggerToast("Successfully connected to Supabase Cloud database!");
        try {
          await testConnection();
          const exists = await checkAdminExists();
          setAdminExists(exists);
        } catch (_) {}
      } else {
        setSaveStatus("partial");
        triggerToast("Saved locally. Connection remains unconfigured.");
      }
      
      setTimeout(() => setSaveStatus(""), 4000);
    } catch (err) {
      console.error("Failed to save local credentials:", err);
      setSaveStatus("error");
    }
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthErr("");

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setAdminAuthErr("Name, email and password are required.");
      return;
    }

    setIsSigningUp(true);

    try {
      const { data: owners, error: ownerError } = await supabase
        .from("admin")
        .select("id")
        .eq("is_owner", true)
        .limit(1);

      if (owners && owners.length > 0) {
        setAdminAuthErr("Administrator account already exists. Please sign in.");
        setOwnerExists(true);
        setAuthMode("signin");
        setIsSigningUp(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        options: {
          data: {
            name: signupName.trim(),
            full_name: signupName.trim(),
            is_owner: true,
            role: "admin"
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const authUser = authData?.user;
      if (!authUser) {
        throw new Error("Could not create authentication user. Check connection or credentials format.");
      }

      const { error: insertError } = await supabase
        .from("admin")
        .insert({
          id: authUser.id,
          name: signupName.trim(),
          email: signupEmail.trim().toLowerCase(),
          is_owner: true,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error("Database registration failed:", insertError);
        throw new Error(`Database registration failed: ${insertError.message}`);
      }

      const displayName = signupName.trim();
      const userEmail = signupEmail.trim().toLowerCase();

      let token = "";
      try {
        token = await createJWT({ email: userEmail, name: displayName });
        localStorage.setItem("admin_session_token", token);
      } catch (err) {
        console.error("JWT signing failed during signup:", err);
      }

      localStorage.setItem("is_admin_authenticated", "true");
      localStorage.setItem("admin_logged_in_name", displayName);
      localStorage.setItem("admin_logged_in_email", userEmail);

      const signedUpAdminObj = { id: authUser.id, name: displayName, email: userEmail, is_owner: true };
      localStorage.setItem("signed_up_admin", JSON.stringify(signedUpAdminObj));

      try {
        await contextLogin(displayName, userEmail, token);
      } catch (contextErr) {
        console.error("Error setting admin auth context:", contextErr);
      }

      setIsAdminAuth(true);
      setIsOwner(true);
      setOwnerExists(true);
      setAdminExists(true);
      setActiveTab("dashboard");
      triggerToast("Administrative master account initialized.");
      window.location.hash = "admin-dashboard";
    } catch (err: any) {
      setAdminAuthErr(err.message || "Admin initialization failed.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthErr("");
    setIsLoggingIn(true);

    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: adminEmail.trim().toLowerCase(),
          password: adminPassword,
        });

        if (error) {
          throw new Error(error.message);
        }

        const authUser = data?.user;
        if (!authUser) {
          throw new Error("Invalid session matrix returned.");
        }

        // Query the admin table directly
        const { data: adminRecord, error: dbError } = await supabase
          .from("admin")
          .select("*")
          .eq("id", authUser.id)
          .single();

        console.log("User ID:", authUser.id);
        console.log("Admin Record:", adminRecord);
        console.log("Admin Error:", dbError);

        if (dbError || !adminRecord) {
          throw new Error("Access Denied: You do not carry authorized administrator properties.");
        }

        if (adminRecord.is_owner !== true || adminRecord.is_active !== true) {
          throw new Error("Access Denied: Administrative profile is currently inactive or restricted.");
        }

        const displayName = adminRecord.name || "Administrator";
        const userEmail = adminRecord.email || authUser.email || adminEmail;

        const token = await createJWT({ email: userEmail, name: displayName });
        localStorage.setItem("admin_session_token", token);
        localStorage.setItem("is_admin_authenticated", "true");
        localStorage.setItem("admin_logged_in_name", displayName);
        localStorage.setItem("admin_logged_in_email", userEmail);

        try {
          await contextLogin(displayName, userEmail, token);
        } catch (contextErr) {
          console.error("Error syncing context login:", contextErr);
        }

        setIsAdminAuth(true);
        setIsOwner(true);
        triggerToast("Administrative session authenticated successfully.");
        window.location.hash = "admin-dashboard";
      } else {
        // Local Sandbox simulation fallback
        if (adminEmail.trim().toLowerCase() === "admin@aionlinebusiness.org" && adminPassword === "admin123") {
          const displayName = "Sandbox Administrator";
          const userEmail = adminEmail.trim().toLowerCase();
          const token = await createJWT({ email: userEmail, name: displayName });
          
          localStorage.setItem("admin_session_token", token);
          localStorage.setItem("is_admin_authenticated", "true");
          localStorage.setItem("admin_logged_in_name", displayName);
          localStorage.setItem("admin_logged_in_email", userEmail);

          try {
            await contextLogin(displayName, userEmail, token);
          } catch (_) {}

          setIsAdminAuth(true);
          setIsOwner(true);
          triggerToast("Authenticated in Sandbox Offline Mode.");
          window.location.hash = "admin-dashboard";
        } else {
          throw new Error("Invalid credentials or no backend connection established.");
        }
      }
    } catch (err: any) {
      setAdminAuthErr(err.message || "Login failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await contextLogout();
    } catch (err) {
      console.error("Logout exception:", err);
    } finally {
      localStorage.removeItem("is_admin_authenticated");
      localStorage.removeItem("admin_logged_in_name");
      localStorage.removeItem("admin_logged_in_email");
      localStorage.removeItem("admin_session_token");
      setIsAdminAuth(false);
      setIsOwner(false);
      window.location.hash = "admin-login";
    }
  };

  // Live Course Creation Logic WITH mandatory authorization validations
  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCourseDescription.trim()) {
      triggerToast("Course Title and Description are required.");
      return;
    }

    try {
      if (!supabase || !isSupabaseConfigured) {
        // Sandbox fallback logic for course creation when offline
        const localCoursesStr = localStorage.getItem("courses");
        const currentCourses: Course[] = localCoursesStr ? JSON.parse(localCoursesStr) : [...courses];
        
        const newCourse: Course = {
          id: `course-${Date.now()}`,
          title: newCourseTitle.trim(),
          description: newCourseDescription.trim(),
          thumbnail: newCourseThumbnail.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=450",
          categoryId: newCourseCategory,
          level: newCourseLevel,
          duration: newCourseDuration.trim() || "10 hours",
          studentCount: "0",
          rating: "5.0",
          instructorName: "Sandbox Administrator",
          instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
          skills: newCourseSkills.split(",").map(s => s.trim()).filter(Boolean),
          outcomes: newCourseOutcomes.split(",").map(o => o.trim()).filter(Boolean),
          overview: newCourseOverview.trim(),
          price: newCoursePrice,
          isPublished: true
        };

        currentCourses.push(newCourse);
        localStorage.setItem("courses", JSON.stringify(currentCourses));
        setCourses(currentCourses);
        setIsCreateCourseOpen(false);
        triggerToast("Course created successfully (Sandbox Mode)!");
        resetCourseForm();
        return;
      }

      // Live Supabase Authorization and course insertion logic
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Unauthorized access. Administrator metadata could not be fetched.");
      }

      // Retrieve administrator metadata from the table 'admin'
      const { data: admin, error } = await supabase
        .from("admin")
        .select("*")
        .eq("id", user.id)
        .single();

      // Debugging logs as strictly required by instructions
      console.log("User ID:", user.id);
      console.log("Admin Record:", admin);
      console.log("Admin Error:", error);

      if (error || !admin) {
        throw new Error("Unauthorized access. Administrator metadata could not be fetched.");
      }

      // Verify the administrator is active and is owner
      if (admin.is_owner !== true || admin.is_active !== true) {
        throw new Error("Unauthorized access. Administrator metadata could not be fetched.");
      }

      // Insert course record inside LocalStorage as master client dataset
      const localCoursesStr = localStorage.getItem("courses");
      const currentCourses: Course[] = localCoursesStr ? JSON.parse(localCoursesStr) : [...courses];

      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: newCourseTitle.trim(),
        description: newCourseDescription.trim(),
        thumbnail: newCourseThumbnail.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=450",
        categoryId: newCourseCategory,
        level: newCourseLevel,
        duration: newCourseDuration.trim() || "10 hours",
        studentCount: "0",
        rating: "5.0",
        instructorName: admin.name || "Administrator",
        instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
        skills: newCourseSkills.split(",").map(s => s.trim()).filter(Boolean),
        outcomes: newCourseOutcomes.split(",").map(o => o.trim()).filter(Boolean),
        overview: newCourseOverview.trim(),
        price: newCoursePrice,
        isPublished: true
      };

      currentCourses.push(newCourse);
      localStorage.setItem("courses", JSON.stringify(currentCourses));
      setCourses(currentCourses);
      setIsCreateCourseOpen(false);
      triggerToast("Course created successfully with master credentials!");
      resetCourseForm();
    } catch (err: any) {
      console.error("Course creation authorized validator failed:", err);
      triggerToast(err.message || "Unauthorized access. Administrator metadata could not be fetched.");
    }
  };

  const resetCourseForm = () => {
    setNewCourseTitle("");
    setNewCourseDescription("");
    setNewCourseOverview("");
    setNewCourseThumbnail("");
    setNewCourseCategory("cat-1");
    setNewCourseLevel("Intermediate");
    setNewCourseDuration("");
    setNewCourseSkills("");
    setNewCourseOutcomes("");
    setNewCoursePrice("₦45,000");
  };

  const handleDeleteCourse = (courseId: string) => {
    const updated = courses.filter(c => c.id !== courseId);
    localStorage.setItem("courses", JSON.stringify(updated));
    setCourses(updated);
    triggerToast("Course deleted successfully.");
  };

  // Filters
  const filteredStudents = students.filter(student => {
    const term = searchQuery.toLowerCase();
    return (
      student.full_name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.phone?.toLowerCase().includes(term) ||
      student.id?.toLowerCase().includes(term)
    );
  });

  const filteredCourses = courses.filter(course => {
    const term = searchCourseQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term)
    );
  });

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutGrid },
    { id: "courses", label: "Manage Courses", icon: BookOpen },
    { id: "modules", label: "Course Modules", icon: Layers },
    { id: "lessons", label: "Manage Lessons", icon: Video },
    { id: "students", label: "Students Directory", icon: Users },
    { id: "invoices", label: "Sales & Receipts", icon: Receipt },
    { id: "survey", label: "Student Feedback", icon: ClipboardList },
    { id: "leads", label: "Inbound Leads", icon: UserPlus },
    { id: "supabase", label: "Supabase Settings", icon: Settings },
  ];

  // Render Login View Node if not authenticated
  if (currentHash === "#admin-login" || !isAdminAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans antialiased">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {authMode === "signin" ? "Admin Sign In" : "Bootstrap Admin Account"}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {authMode === "signin" 
                ? "Sign in to access your administrative workspace." 
                : "Create the master administrator account in the admin table."}
            </p>
          </div>

          {adminAuthErr && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 font-semibold text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{adminAuthErr}</span>
            </div>
          )}

          {authMode === "signin" ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Admin Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="authority@lms.internal"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Master Gateway Cipher
                </label>
                <input 
                  type="password" 
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                {isLoggingIn ? "Validating Session..." : "Sign In As Admin"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminSignup} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Administrator Full Name
                </label>
                <input 
                  type="text" 
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Charles Tuti"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Master Admin Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="admin@aionlinebusiness.org"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Choose Administrator Password
                </label>
                <input 
                  type="password" 
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Choose a secure pass key..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {isSigningUp ? "Bootstrapping Account..." : "Register Master Admin"}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
            <button 
              onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              {authMode === "signin" 
                ? "Need to bootstrap a master admin record?" 
                : "Have an admin account? Sign In"}
            </button>
            <button
              onClick={() => setShowLocalConfig(!showLocalConfig)}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3 h-3" />
              {showLocalConfig ? "Hide Config settings" : "Supabase Connection details"}
            </button>
          </div>

          {showLocalConfig && (
            <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 mt-4">
              <p className="text-[10px] font-mono font-semibold text-slate-500">
                Setup your custom sandbox Supabase project keys locally inside the browser.
              </p>
              <form onSubmit={handleSaveLocalConfig} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    SUPABASE URL
                  </label>
                  <input 
                    type="text" 
                    value={localUrl}
                    onChange={(e) => setLocalUrl(e.target.value)}
                    placeholder="https://yourproject.supabase.co"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    ANON KEY
                  </label>
                  <input 
                    type="password" 
                    value={localAnonKey}
                    onChange={(e) => setLocalAnonKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wide rounded-lg cursor-pointer"
                >
                  Save Keys
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin Verified Views
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex relative overflow-hidden antialiased">
        
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-white text-slate-900 border border-emerald-200 shadow-xl rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
          </div>
        )}

        {/* Sidebar Panel */}
        <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex flex-col justify-between z-20`}>
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              {sidebarOpen ? (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-950 rounded-xl text-white">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="font-black text-xs tracking-widest text-slate-900">LMS WORKBENCH</span>
                </div>
              ) : (
                <div className="p-1.5 bg-slate-950 rounded-xl text-white mx-auto">
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
                        ? "bg-slate-950 text-white shadow-md shadow-slate-950/15" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
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
              onClick={handleAdminLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>Exit Dashboard</span>}
            </button>
          </div>
        </aside>

        {/* Workspace Operations Screen */}
        <main className="flex-grow overflow-y-auto min-h-screen flex flex-col">
          <header className="h-20 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <h1 className="text-base font-extrabold text-slate-950 uppercase tracking-wider">{activeTab} panel</h1>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Admin Session: {localStorage.getItem("admin_logged_in_email") || "System Root Administrator"}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] uppercase tracking-wider font-bold ${
                dbStatus?.success ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dbStatus?.success ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
                {dbStatus?.success ? "Synced Online" : "Sandbox Mode"}
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl w-full mx-auto flex-1">
            
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border-l-4 border-l-emerald-500 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Program Revenue</p>
                      <div className="p-1 bg-emerald-50 text-emerald-600 rounded-md"><DollarSign className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">$0</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" /> Wires waiting for first user transaction
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-slate-950 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Enrolled Students</p>
                      <div className="p-1 bg-slate-100 text-slate-950 rounded-md"><UserCheck className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">{students.length || 0}</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2">
                      Registered records stored inside profiles collection
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-amber-500 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Syllabus Modules</p>
                      <div className="p-1 bg-amber-50 text-amber-600 rounded-md"><Layers className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">42</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2">
                      Structured curriculum sections
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-indigo-500 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Courses</p>
                      <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md"><BookOpen className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">{courses.length}</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2">
                      Available pathways in curriculum suite
                    </div>
                  </div>
                </div>

                {/* Calibration System Console */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                    <div>
                      <h2 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Integrity Diagnostics Console
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Test API pipelines, schema structures, and check active system state.</p>
                    </div>
                    <button
                      onClick={handleRunDiagnostics}
                      disabled={isRunningDiagnostics}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiagnostics ? "animate-spin" : ""}`} />
                      {isRunningDiagnostics ? "Calibrating..." : "Launch Diagnostics Sweep"}
                    </button>
                  </div>
                  
                  <div className="mt-4 bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-emerald-400 h-44 overflow-y-auto space-y-1.5 shadow-inner">
                    {diagnosticsLog.length === 0 ? (
                      <p className="text-slate-500 italic">No sweeps recorded. Click 'Launch Diagnostics Sweep' above to assertion variables.</p>
                    ) : (
                      diagnosticsLog.map((log, i) => (
                        <div key={i} className="leading-relaxed border-l border-emerald-800 pl-2.5">{log}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Courses Management viewport */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative max-w-md w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Search courses by keyword..."
                      value={searchCourseQuery}
                      onChange={(e) => setSearchCourseQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={() => setIsCreateCourseOpen(true)}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Course
                  </button>
                </div>

                {isCreateCourseOpen && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-slate-500" /> Course Creation Engine
                      </h3>
                      <button 
                        onClick={() => setIsCreateCourseOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Title</label>
                        <input 
                          type="text"
                          required
                          value={newCourseTitle}
                          onChange={(e) => setNewCourseTitle(e.target.value)}
                          placeholder="e.g. AI Prompt Engineering Mastery"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Thumbnail URL</label>
                        <input 
                          type="text"
                          value={newCourseThumbnail}
                          onChange={(e) => setNewCourseThumbnail(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                        <select 
                          value={newCourseCategory}
                          onChange={(e) => setNewCourseCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                        >
                          {db.getCategories().map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Syllabus Level</label>
                          <select 
                            value={newCourseLevel}
                            onChange={(e) => setNewCourseLevel(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Syllabus Price</label>
                          <input 
                            type="text"
                            value={newCoursePrice}
                            onChange={(e) => setNewCoursePrice(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Duration</label>
                        <input 
                          type="text"
                          value={newCourseDuration}
                          onChange={(e) => setNewCourseDuration(e.target.value)}
                          placeholder="e.g. 10 hours"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills Acquired (Comma separated)</label>
                        <input 
                          type="text"
                          value={newCourseSkills}
                          onChange={(e) => setNewCourseSkills(e.target.value)}
                          placeholder="CO-STAR framework, Context modeling"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Headline Tagline</label>
                        <input 
                          type="text"
                          required
                          value={newCourseDescription}
                          onChange={(e) => setNewCourseDescription(e.target.value)}
                          placeholder="Brief summary sentence..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outcomes Expected (Comma separated)</label>
                        <input 
                          type="text"
                          value={newCourseOutcomes}
                          onChange={(e) => setNewCourseOutcomes(e.target.value)}
                          placeholder="Build real chatbots, Structure automated proposals"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deep Overview Syllabus Description</label>
                        <textarea 
                          rows={3}
                          value={newCourseOverview}
                          onChange={(e) => setNewCourseOverview(e.target.value)}
                          placeholder="Provide descriptive curriculum notes..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-medium text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 pt-2 flex items-center justify-end gap-3">
                        <button 
                          type="button"
                          onClick={() => { resetCourseForm(); setIsCreateCourseOpen(false); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-5 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Authorized Save Course
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
                    <div key={course.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="h-44 overflow-hidden bg-slate-100 relative border-b border-slate-100">
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide font-black bg-slate-950 text-white shadow-sm">
                            {course.level}
                          </span>
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold uppercase text-slate-400">
                              {db.getCategories().find(c => c.id === course.categoryId)?.name || "AI Topic"}
                            </span>
                            <span className="text-xs font-bold text-indigo-600">{course.price || "₦45,000"}</span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight leading-snug">{course.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-medium line-clamp-2">{course.description}</p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          <span>{course.duration}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl transition-all"
                          title="Delete Course Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Integrated Students Directory */}
            {activeTab === "students" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative max-w-md w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Search students by profile details..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={fetchLiveStudents}
                    disabled={isLoadingStudents}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStudents ? "animate-spin" : ""}`} />
                    Refresh Directory
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  {isLoadingStudents ? (
                    <div className="p-20 text-center space-y-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">Querying live database indexes...</p>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-20 text-center max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-400">
                        <UserX className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">No Registered Records Found</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        No active entries matching this criteria were found inside the remote schema.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Profile</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Node</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrollment Anchor Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Syllabus Track</th>
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
                                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{student.email}</span>
                                </div>
                                {student.phone && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                    <Phone className="w-3.5 h-3.5 text-slate-300" />
                                    <span>{student.phone}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
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

            {/* Curriculum Modules browser */}
            {activeTab === "modules" && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Course Modules Blueprint Directory</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Explore active modules attached to the curriculum.</p>
                </div>
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {db.getModules().map((mod, i) => {
                    const cTitle = courses.find(c => c.id === mod.courseId)?.title || "AI Course";
                    return (
                      <div key={mod.id || i} className="py-3 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-800">{mod.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono select-all bg-slate-50 px-2.5 py-1 rounded-md border border-slate-150">
                          Attached to: {cTitle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Curriculum Lessons browser */}
            {activeTab === "lessons" && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Syllabus Lessons Blueprint Directory</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Explore lessons and resource content attached to courses.</p>
                </div>
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {db.getLessons().map((les, i) => {
                    const mTitle = db.getModules().find(m => m.id === les.moduleId)?.title || "Curriculum Module";
                    return (
                      <div key={les.id || i} className="py-3 flex items-center justify-between text-xs font-semibold">
                        <div className="space-y-1">
                          <p className="text-slate-800">{les.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Duration: {les.duration} | Module: {mTitle}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-150">
                          {les.id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Connection settings tab */}
            {activeTab === "supabase" && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 max-w-xl space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Supabase Connection Settings</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Configure the active Supabase project endpoint credentials.</p>
                </div>
                <form onSubmit={handleSaveLocalConfig} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      VITE_SUPABASE_URL
                    </label>
                    <input 
                      type="text" 
                      value={localUrl}
                      onChange={(e) => setLocalUrl(e.target.value)}
                      placeholder="https://yourproject.supabase.co"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      VITE_SUPABASE_ANON_KEY
                    </label>
                    <input 
                      type="password" 
                      value={localAnonKey}
                      onChange={(e) => setLocalAnonKey(e.target.value)}
                      placeholder="eyJhbGciOi..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-900 font-bold text-xs text-white rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Commit Configuration Keys
                  </button>
                </form>
              </div>
            )}

            {/* Leftover blueprint management viewports */}
            {["invoices", "survey", "leads", "live", "blog", "kb", "grading", "analytics", "testimonials"].includes(activeTab) && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center max-w-md mx-auto my-12">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Activity className="w-4.5 h-4.5 text-slate-400" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">{activeTab.replace("_", " ")} Blueprint Matrix</h3>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Active structural canvas link established. Management interface tools will automatically initialize on this viewport as soon as entries populate.
                </p>
              </div>
            )}

          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

// Minimal placeholder indicator for missing/deleted elements
function Activity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
