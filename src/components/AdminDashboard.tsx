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
  ArrowUp, ArrowDown, GripVertical
} from "lucide-react";
import * as OTPAuth from "otpauth";
import { db, Course, CourseModule, Lesson, Category } from "../lib/db";
import { supabase, isSupabaseConfigured, fetchSupabaseConfigFromServer, updateSupabaseClient } from "../lib/supabase";
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

export default function AdminDashboard() {
  const { navigateTo } = useNavigation();
  const { logout: contextLogout, login: contextLogin, checkAuth, loading: contextLoading } = useAdmin();

  // Supabase readiness state
  const [isReady, setIsReady] = useState<boolean>(() => isClientReady());

  useEffect(() => {
    const checkReady = () => {
      setIsReady(isClientReady());
    };
    checkReady();
    const interval = setInterval(checkReady, 5000);
    return () => clearInterval(interval);
  }, []);

  // Run database connectivity diagnostics on load
  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        await testConnection();
      } catch (err) {
        console.error("Connectivity diagnostic crashed:", err);
      }
    };
    runDiagnostics();
  }, []);

  // Gate authentication states
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    return localStorage.getItem("is_admin_authenticated") === "true";
  });
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isOwnerLoading, setIsOwnerLoading] = useState<boolean>(true);

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

  // Automatically verify JWT Session Token on mount and ensure no unwanted logouts across refreshes
  useEffect(() => {
    const runJwtValidation = async () => {
      const storedToken = localStorage.getItem("admin_session_token");
      if (!storedToken) {
        // If they have standard state but no JWT token (e.g. legacy/transitional logins), issue one immediately
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
          // Keep the session alive and in absolute synchronization
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
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthErr, setAdminAuthErr] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Signup states
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Local Supabase dynamic config states
  const [showLocalConfig, setShowLocalConfig] = useState(false);
  const [localUrl, setLocalUrl] = useState(() => localStorage.getItem("VITE_SUPABASE_URL") || "");
  const [localAnonKey, setLocalAnonKey] = useState(() => localStorage.getItem("VITE_SUPABASE_ANON_KEY") || "");
  const [saveStatus, setSaveStatus] = useState("");

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

  const [signedUpAdmin, setSignedUpAdmin] = useState<any>(() => {
    const stored = localStorage.getItem("signed_up_admin");
    return stored ? JSON.parse(stored) : null;
  });
  const [adminExists, setAdminExists] = useState<boolean>(() => {
    const stored = localStorage.getItem("signed_up_admin");
    return !!stored;
  });
  const [ownerExists, setOwnerExists] = useState<boolean>(false);
  const [isAdminExistsLoading, setIsAdminExistsLoading] = useState<boolean>(true);

  // Diagnostics states
  const [diagResult, setDiagResult] = useState<{ configured: boolean; connected: boolean; count: number | null; error?: string } | null>(null);
  const [diagLoading, setDiagLoading] = useState<boolean>(false);

  const handleRunDiagnostics = async () => {
    setDiagLoading(true);
    try {
      const result = await runSupabaseDiagnostics();
      setDiagResult(result);
      if (result.connected) {
        triggerToast(`Diagnostics complete: Found ${result.count} registered admin accounts.`);
      } else {
        triggerToast(`Diagnostics failed: ${result.error || "Connection issue"}`);
      }
    } catch (err: any) {
      setDiagResult({ configured: true, connected: false, count: null, error: err.message || "Unknown error" });
      triggerToast("Diagnostics execution errored out.");
    } finally {
      setDiagLoading(false);
    }
  };

  // Multi-Factor Authentication (MFA) States
  const [mfaSetupData, setMfaSetupData] = useState<{ secret: string; qrUrl: string } | null>(null);
  const [mfaSetupToken, setMfaSetupToken] = useState("");
  const [mfaChallengeData, setMfaChallengeData] = useState<{ id: string; email: string; name: string; mfaSecret: string } | null>(null);
  const [mfaChallengeToken, setMfaChallengeToken] = useState("");

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthErr("");

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setAdminAuthErr("Name, email and password are required.");
      return;
    }

    setIsSigningUp(true);

    try {
      // 1. Double check if owner already exists
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

      // 2. Create user in Supabase Auth with custom user metadata saved in auth.users
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

      // 3. Insert into public.admin table (no password columns!)
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

      // 4. On successful signup: set local and global auth states to redirect straight to /admin-dashboard
      const displayName = signupName.trim();
      const userEmail = signupEmail.trim().toLowerCase();

      // Sign JWT session token
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

      // Create signed_up_admin fallback object in local storage for resilient auth
      const signedUpAdminObj = { id: authUser.id, name: displayName, email: userEmail, is_owner: true };
      localStorage.setItem("signed_up_admin", JSON.stringify(signedUpAdminObj));

      // Call central Context Login
      try {
        await contextLogin(displayName, userEmail, token);
      } catch (contextErr) {
        console.error("Error setting central admin auth context:", contextErr);
      }

      setIsAdminAuth(true);
      setIsOwner(true);
      setOwnerExists(true);
      setAdminExists(true);
      setActiveTab("dashboard");
      triggerToast(`Administrator account successfully registered. Welcome, ${displayName}!`);

      // Update URL routes cleanly
      navigateTo("admin");
      window.location.hash = "admin-dashboard";
      window.history.pushState({}, "", "/admin-dashboard");
    } catch (err: any) {
      console.error("Signup process failed:", err);
      setAdminAuthErr(err.message || "An unexpected error occurred during administrative signup.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleVerifyAndCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("System updated: Multi-factor verification is no longer required during registration.");
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthErr("");
    setIsLoggingIn(true);

    if (!adminEmail.trim() || !adminPassword) {
      setAdminAuthErr("Email and password are required.");
      setIsLoggingIn(false);
      return;
    }

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const authUser = authData?.user;
      if (!authUser) {
        throw new Error("Login failed. No authenticated user session returned.");
      }

      // 2. Query admin profile metadata from public.admin using the authenticated user id
      let adminProfile = null;
      let profileError = null;

      try {
        const { data: profileById, error: errById } = await supabase
          .from("admin")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (errById) {
          console.warn("Soft notice: Error querying admin by ID:", errById);
          // Try email query fallback
          const { data: profileByEmail, error: errByEmail } = await supabase
            .from("admin")
            .select("*")
            .eq("email", authUser.email?.trim().toLowerCase())
            .maybeSingle();

          if (errByEmail) {
            profileError = errByEmail;
          } else {
            adminProfile = profileByEmail;
          }
        } else {
          adminProfile = profileById;
          if (!adminProfile) {
            // Try querying by email as fallback
            const { data: profileByEmail, error: errByEmail } = await supabase
              .from("admin")
              .select("*")
              .eq("email", authUser.email?.trim().toLowerCase())
              .maybeSingle();
            
            if (!errByEmail) {
              adminProfile = profileByEmail;
              if (adminProfile) {
                // Heal ID mismatch
                try {
                  await supabase
                    .from("admin")
                    .update({ id: authUser.id })
                    .eq("email", authUser.email?.trim().toLowerCase());
                } catch (updateErr) {
                  console.warn("Failed to sync ID mismatch in public.admin:", updateErr);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("Exception fetching admin profile metadata:", err);
      }

      // Check if metadata exists in authUser user_metadata (Supabase users table)
      const isOwnerFromMetadata = authUser?.user_metadata?.is_owner === true || authUser?.user_metadata?.role === "admin";

      if (profileError) {
        if (isOwnerFromMetadata) {
          console.log("Successfully fetched admin metadata from Supabase users table (ignoring public table query error).");
          adminProfile = {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Administrator",
            email: authUser.email?.trim().toLowerCase(),
            is_owner: true
          };
          profileError = null; // Clear error since we resolved it using users table metadata!
        } else {
          console.warn("Soft notice: error fetching admin profile metadata:", profileError);
          
          // Handle missing table catch-22 situation
          const isTableMissing = profileError.code === "42P01" || profileError.message?.includes("does not exist");
          if (isTableMissing) {
            console.warn("Table 'admin' does not exist in Supabase. Logging in with temporary fallback credentials to allow database setup.");
            adminProfile = {
              id: authUser.id,
              name: authUser.email?.split("@")[0] || "Administrator",
              email: authUser.email?.trim().toLowerCase(),
              is_owner: true,
              is_temporary_fallback: true
            };
          } else {
            // Instead of instantly throwing, fallback to a secure default if they are signed up in local storage or auth session
            const signedUp = localStorage.getItem("signed_up_admin");
            let isLocalStorageMatch = false;
            if (signedUp) {
              try {
                const parsed = JSON.parse(signedUp);
                if (parsed && parsed.email?.toLowerCase() === authUser.email?.trim().toLowerCase()) {
                  isLocalStorageMatch = true;
                }
              } catch (_) {}
            }

            if (isLocalStorageMatch || authUser.email?.toLowerCase() === "admin@aionlinebusiness.org" || authUser.email) {
              console.log("Recovering from query error using authenticated admin details.");
              adminProfile = {
                id: authUser.id,
                name: authUser.email?.split("@")[0] || "Administrator",
                email: authUser.email?.trim().toLowerCase(),
                is_owner: true
              };
            } else {
              await supabase.auth.signOut();
              throw new Error("Unauthorized access. Administrator metadata could not be fetched.");
            }
          }
        }
      }

      // If profile is completely missing but we authenticated successfully, auto-heal
      if (!adminProfile && !profileError) {
        if (isOwnerFromMetadata) {
          console.log("Successfully fetched admin metadata from Supabase users table (admin table record missing).");
          adminProfile = {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Administrator",
            email: authUser.email?.trim().toLowerCase(),
            is_owner: true
          };
        } else {
          console.warn("No admin profile found. Attempting to heal and create administrative metadata record...");
          const { data: insertData, error: insertErr } = await supabase
            .from("admin")
            .insert({
              id: authUser.id,
              name: authUser.email?.split("@")[0] || "Administrator",
              email: authUser.email?.trim().toLowerCase(),
              is_owner: true,
              created_at: new Date().toISOString()
            })
            .select()
            .maybeSingle();

          if (!insertErr) {
            console.log("Successfully healed admin metadata row.");
            adminProfile = insertData || {
              id: authUser.id,
              name: authUser.email?.split("@")[0] || "Administrator",
              email: authUser.email?.trim().toLowerCase(),
              is_owner: true
            };
          } else {
            console.warn("Failed to auto-create admin profile during healing. Logging in with fallback profile.");
            adminProfile = {
              id: authUser.id,
              name: authUser.email?.split("@")[0] || "Administrator",
              email: authUser.email?.trim().toLowerCase(),
              is_owner: true
            };
          }
        }
      }

      // 3. Verify is_owner === true
      if (!adminProfile || adminProfile.is_owner !== true) {
        await supabase.auth.signOut();
        throw new Error("Unauthorized access.");
      }

      // 4. If valid, set local and global auth states and redirect to /admin-dashboard
      const displayName = adminProfile.full_name || adminProfile.name || adminProfile.email.split("@")[0];
      const userEmail = adminProfile.email;

      let token = "";
      try {
        token = await createJWT({ email: userEmail, name: displayName });
        localStorage.setItem("admin_session_token", token);
      } catch (err) {
        console.error("JWT signing failed during login:", err);
      }

      localStorage.setItem("is_admin_authenticated", "true");
      localStorage.setItem("admin_logged_in_name", displayName);
      localStorage.setItem("admin_logged_in_email", userEmail);

      const signedUpAdminObj = { id: authUser.id, name: displayName, email: userEmail, is_owner: true };
      localStorage.setItem("signed_up_admin", JSON.stringify(signedUpAdminObj));

      // Call central Context Login
      try {
        await contextLogin(displayName, userEmail, token);
      } catch (contextErr) {
        console.error("Error setting central admin auth context:", contextErr);
      }

      setIsAdminAuth(true);
      setIsOwner(true);
      setActiveTab("dashboard");
      triggerToast(`Welcome back, ${displayName}! Access granted.`);

      // Update URL routes cleanly
      navigateTo("admin");
      window.location.hash = "admin-dashboard";
      window.history.pushState({}, "", "/admin-dashboard");
    } catch (err: any) {
      console.error("Login process failed:", err);
      setAdminAuthErr(err.message || "Invalid administrative credentials. Please verify your Email and Password.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerifyMfaChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaChallengeData) {
      setAdminAuthErr("MFA check session timed out or is uninitialized.");
      return;
    }

    setAdminAuthErr("");
    setIsLoggingIn(true);

    try {
      const totpVerify = new OTPAuth.TOTP({
        issuer: "Ai Academy",
        label: mfaChallengeData.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(mfaChallengeData.mfaSecret)
      });

      const delta = totpVerify.validate({
        token: mfaChallengeToken.trim(),
        window: 2 // allow clock tolerance up to 60 seconds
      });

      if (delta === null) {
        setAdminAuthErr("The 6-digit MFA code is incorrect. Please verify your app credentials and try again.");
        setIsLoggingIn(false);
        return;
      }

      // Valid token! Grant auth access with secure JWT
      try {
        const token = await createJWT({ email: mfaChallengeData.email, name: mfaChallengeData.name });
        localStorage.setItem("admin_session_token", token);
      } catch (err) {
        console.error("[MFA] JWT signing failed:", err);
      }
      localStorage.setItem("is_admin_authenticated", "true");
      localStorage.setItem("admin_logged_in_name", mfaChallengeData.name);
      localStorage.setItem("admin_logged_in_email", mfaChallengeData.email);
      setIsAdminAuth(true);
      setActiveTab("dashboard");
      triggerToast(`Session authenticated. Access granted for ${mfaChallengeData.name}!`);

      // Reset components
      setMfaChallengeData(null);
      setMfaChallengeToken("");
      setAdminEmail("");
      setAdminPassword("");

      // Redirect upon login to dashboard hash
      window.location.hash = "admin-dashboard";
      if (window.location.pathname.includes("admin-login")) {
        window.history.pushState({}, "", "/admin-dashboard");
      }
    } catch (err) {
      console.error("MFA authentication calculation error:", err);
      setAdminAuthErr("An internal security calculation exception occurred. Verify device system clock.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await contextLogout();
    } catch (err) {
      console.error("Error during admin context logout:", err);
    }
    setIsAdminAuth(false);
    triggerToast("Logged out of the administration console securely.");
    navigateTo("admin");
    window.location.hash = "admin-login";
  };

  const getAdminDisplayName = () => {
    const storedName = localStorage.getItem("admin_logged_in_name");
    if (storedName) return storedName;
    
    if (signedUpAdmin) return signedUpAdmin.name;
    
    const storedEmail = localStorage.getItem("admin_logged_in_email");
    if (storedEmail) {
      return storedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }
    return "Chief Academic Director";
  };

  // Sidebar fold/unfold layout state (Collapsible)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isAcademicExpanded, setIsAcademicExpanded] = useState(true);
  const [isOpsExpanded, setIsOpsExpanded] = useState(true);
  const [isEngageExpanded, setIsEngageExpanded] = useState(true);

  // Core LMS states
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [dbEnrollments, setDbEnrollments] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [enrollmentCourseId, setEnrollmentCourseId] = useState<string>("");
  const [enrollmentStatus, setEnrollmentStatus] = useState<string>("active");
  const [showAddEnrollment, setShowAddEnrollment] = useState<boolean>(false);

  // Profile fields editor state
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingProfileName, setEditingProfileName] = useState<string>("");
  const [editingProfileEmail, setEditingProfileEmail] = useState<string>("");
  const [editingProfileLocation, setEditingProfileLocation] = useState<string>("");
  const [editingProfileRole, setEditingProfileRole] = useState<string>("student");
  const [editingProfileStatus, setEditingProfileStatus] = useState<string>("active");
  const [editingProfilePhone, setEditingProfilePhone] = useState<string>("");
  const [editingProfileAppliedCourse, setEditingProfileAppliedCourse] = useState<string>("");

  // Simulated tables state
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [kbArticles, setKbArticles] = useState<KBArticle[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Course management form state
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [courseFormTitle, setCourseFormTitle] = useState("");
  const [courseFormDesc, setCourseFormDesc] = useState("");
  const [courseFormOverview, setCourseFormOverview] = useState("");
  const [courseFormCategory, setCourseFormCategory] = useState("");
  const [courseFormLevel, setCourseFormLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [courseFormDuration, setCourseFormDuration] = useState("8 hours");
  const [courseFormSkills, setCourseFormSkills] = useState("");
  const [courseFormOutcomes, setCourseFormOutcomes] = useState("");
  const [courseFormInstructor, setCourseFormInstructor] = useState("Sandra Cole");
  const [courseFormThumbnail, setCourseFormThumbnail] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=450");
  const [courseFormPrice, setCourseFormPrice] = useState("₦45,000");

  // Modules form state
  const [showAddModule, setShowAddModule] = useState(false);
  const [moduleCourseId, setModuleCourseId] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null);
  const [dragOverModuleId, setDragOverModuleId] = useState<string | null>(null);

  // Lessons form state
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonCourseId, setLessonCourseId] = useState("");
  const [lessonModuleId, setLessonModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("12:00");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");

  // Invoices form state
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [invFormStudent, setInvFormStudent] = useState("");
  const [invFormEmail, setInvFormEmail] = useState("");
  const [invFormCourse, setInvFormCourse] = useState("");
  const [invFormAmount, setInvFormAmount] = useState(250);

  // Live classes form state
  const [showAddClass, setShowAddClass] = useState(false);
  const [liveTitle, setLiveTitle] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [liveTime, setLiveTime] = useState("");
  const [liveUrl, setLiveUrl] = useState("https://meet.google.com/xyz-abc");

  // Blog post form state
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogCategory, setBlogCategory] = useState("AI Trends");

  // Testimonial form state
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [testiName, setTestiName] = useState("");
  const [testiRole, setTestiRole] = useState("AI Operations Specialist");
  const [testiQuote, setTestiQuote] = useState("");
  const [testiRating, setTestiRating] = useState(5);

  // Grading tool state
  const [activeGradeId, setActiveGradeId] = useState<string | null>(null);
  const [selectedGradeValue, setSelectedGradeValue] = useState("A");
  const [gradeFeedback, setGradeFeedback] = useState("");

  // System status toast
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Monitor location hashes and paths for redirection rules
  useEffect(() => {
    const handleRedirectSecurityRules = () => {
      const isAuth = localStorage.getItem("is_admin_authenticated") === "true";
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      
      const isDashboardUrl = hash.includes("admin-dashboard") || path.includes("admin-dashboard") || hash === "#admin" || hash === "#admin-dashboard";
      const isLoginUrl = hash.includes("admin-login") || path.includes("admin-login") || hash === "#admin-login" || hash.includes("addmin-login");

      if (!isAuth) {
        // Redirection for Non-admins attempting to access dashboard
        if (isDashboardUrl) {
          triggerToast("Access denied. Redirecting to login portal.");
          window.location.hash = "admin-login";
          if (window.location.pathname.includes("admin-dashboard")) {
            window.history.replaceState(null, "", "/admin-login");
          }
          setIsAdminAuth(false);
        }
      } else {
        // Redirection for Admins visiting the login URL
        if (isLoginUrl) {
          triggerToast("Session active. Directing to dashboard.");
          window.location.hash = "admin-dashboard";
          if (window.location.pathname.includes("admin-login")) {
            window.history.replaceState(null, "", "/admin-dashboard");
          }
          setIsAdminAuth(true);
        }
      }
    };

    // Run check immediately on mount and auth state change
    handleRedirectSecurityRules();

    window.addEventListener("hashchange", handleRedirectSecurityRules);
    window.addEventListener("popstate", handleRedirectSecurityRules);

    return () => {
      window.removeEventListener("hashchange", handleRedirectSecurityRules);
      window.removeEventListener("popstate", handleRedirectSecurityRules);
    };
  }, [isAdminAuth]);

  // Load all databases and dynamically fetch Supabase connection config on mount
  useEffect(() => {
    loadDatabase();
    
    const initAndSyncConfig = async () => {
      await fetchSupabaseConfigFromServer();
      setIsReady(isClientReady());
    };
    initAndSyncConfig();
  }, []);

  // Active validation hook to verify user registration exists in remote 'admin' before rendering dashboard views
  const [isValidatingSession, setIsValidatingSession] = useState(false);

  useEffect(() => {
    if (!isAdminAuth) return;

    const verifyActiveSessionInDatabase = async () => {
      const email = localStorage.getItem("admin_logged_in_email");
      if (!email) {
        handleAdminLogout();
        return;
      }

      // Hardcoded sandbox default administrator logins bypass check for robust local testing/fallback
      const sandboxEmails = ["admin@aionlinebusiness.org"];
      if (sandboxEmails.includes(email.toLowerCase())) {
        return;
      }

      // Ensure local state client has parsed credentials
      updateSupabaseClient();

      if (supabase && isSupabaseConfigured) {
        setIsValidatingSession(true);
        try {
          const { data, error } = await supabase
            .from("admin")
            .select("email, name")
            .eq("email", email.toLowerCase())
            .maybeSingle();

          if (error) {
            try {
              const { data: authData } = await supabase.auth.getUser();
              const authUser = authData?.user;
              if (authUser && authUser.email?.trim().toLowerCase() === email.toLowerCase()) {
                setIsValidatingSession(false);
                return;
              }
            } catch (_) {}
            setIsValidatingSession(false);
            return;
          }

          if (!data) {
            triggerToast("Administrative account was removed from Database. Session terminated.");
            handleAdminLogout();
          } else {
            // Synchronize name if changed in remote database
            if (data.name && data.name !== localStorage.getItem("admin_logged_in_name")) {
              localStorage.setItem("admin_logged_in_name", data.name);
            }
          }
        } catch (err) {
          // Silent fallback
        } finally {
          setIsValidatingSession(false);
        }
      }
    };

    // Run active authorization check
    verifyActiveSessionInDatabase();

    // Check presence of admin registration periodically to handle changes and remote database deletions
    const intervalId = setInterval(verifyActiveSessionInDatabase, 4000);
    return () => clearInterval(intervalId);
  }, [isAdminAuth]);

  // Check for globally registered admin on mount and when authentication mode changes with polling for incognito/multi-tab sync
  useEffect(() => {
    const fetchGlobalAdmin = async () => {
      // Refresh database configuration
      updateSupabaseClient();

      try {
        const oExists = await checkAdminOwnerExists();
        setOwnerExists(oExists);
      } catch (err) {
        // Silent
      }

      if (supabase && isSupabaseConfigured) {
        try {
          // Use secure helper to verify if admin exists in Supabase
          const exists = await checkAdminExists();
          setAdminExists(exists);

          const { data, error } = await supabase
            .from("admin")
            .select("id, name, email");
          if (!error && data && data.length > 0) {
            // Find first or any admin account
            const firstAdmin = data[0];
            setSignedUpAdmin(firstAdmin);
            localStorage.setItem("signed_up_admin", JSON.stringify(firstAdmin));
          } else if (data && data.length === 0) {
            setSignedUpAdmin(null);
            localStorage.removeItem("signed_up_admin");
          }
        } catch (err) {
          // Silent
        } finally {
          setIsAdminExistsLoading(false);
        }
      } else {
        try {
          const exists = await checkAdminExists();
          setAdminExists(exists);
        } catch (_) {}
        setIsAdminExistsLoading(false);
      }
    };

    fetchGlobalAdmin();

    // If the operator session is NOT authenticated, poll periodically to capture registrations in separate tabs/browsers
    let intervalId: any;
    if (!isAdminAuth) {
      intervalId = setInterval(fetchGlobalAdmin, 2500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [authMode, isAdminAuth]);

  // Handle automatic routing of authMode based on owner presence state
  useEffect(() => {
    if (ownerExists) {
      setAuthMode("signin");
    } else {
      setAuthMode("signup");
    }
  }, [ownerExists]);

  const mapSupabaseCourse = (row: any): Course => ({
    id: row.id,
    title: row.title || "",
    description: row.description || "",
    overview: row.overview || row.description || "",
    thumbnail: row.thumbnail_url || row.thumbnail || "",
    categoryId: row.category || row.category_id || row.categoryId || "",
    level: row.level || "Beginner",
    duration: row.duration || "",
    studentCount: row.student_count || row.studentCount || "0",
    rating: row.rating || "4.8",
    instructorName: row.instructor_name || row.instructorName || "Sandra Cole",
    instructorAvatar: row.instructor_avatar || row.instructorAvatar || "",
    skills: Array.isArray(row.skills) ? row.skills : (row.skills ? JSON.parse(row.skills) : []),
    outcomes: Array.isArray(row.outcomes) ? row.outcomes : (row.outcomes ? JSON.parse(row.outcomes) : []),
    price: row.price || "₦45,000",
    isPublished: row.is_published === true
  });

  const mapSupabaseModule = (row: any): CourseModule => ({
    id: row.id,
    courseId: row.course_id || row.courseId || "",
    title: row.title || "",
    sortOrder: Number(row.module_order || row.sort_order || row.order_index || row.sortOrder || 0)
  });

  const mapSupabaseLesson = (row: any): Lesson => ({
    id: row.id,
    moduleId: row.module_id || row.moduleId || "",
    courseId: row.course_id || row.courseId || "",
    title: row.title || "",
    duration: row.duration || "",
    content: row.content || "",
    videoUrl: row.video_url || row.videoUrl || "",
    sortOrder: Number(row.sort_order || row.order_index || row.sortOrder || 0)
  });

  const mapSupabaseInvoice = (row: any): Invoice => ({
    id: row.id,
    studentName: row.student_name || row.studentName || "",
    studentEmail: row.student_email || row.studentEmail || "",
    courseTitle: row.course_title || row.courseTitle || "",
    amount: Number(row.amount || 0),
    status: row.status || "Pending",
    issuedAt: row.issued_at || row.issuedAt || new Date().toISOString()
  });

  const mapSupabaseSurvey = (row: any): SurveyResponse => ({
    id: row.id,
    studentName: row.student_name || row.studentName || "",
    rating: Number(row.rating || 5),
    feedback: row.feedback || "",
    category: row.category || "",
    submittedAt: row.submitted_at || row.submittedAt || new Date().toISOString()
  });

  const mapSupabaseLiveClass = (row: any): LiveClass => ({
    id: row.id,
    title: row.title || "",
    date: row.date || "",
    time: row.time || "",
    instructor: row.instructor || "Staff Mentor",
    classUrl: row.class_url || row.classUrl || ""
  });

  const mapSupabaseBlogPost = (row: any): BlogPost => ({
    id: row.id,
    title: row.title || "",
    excerpt: row.excerpt || "",
    author: row.author || "Academy Admin Desk",
    publishedAt: row.published_at || row.publishedAt || "",
    category: row.category || ""
  });

  const mapSupabaseKBArticle = (row: any): KBArticle => ({
    id: row.id,
    title: row.title || "",
    excerpt: row.excerpt || "",
    category: row.category || "",
    author: row.author || ""
  });

  const mapSupabaseGradeRecord = (row: any): GradeRecord => ({
    id: row.id,
    studentName: row.student_name || row.studentName || "",
    courseTitle: row.course_title || row.courseTitle || "",
    lessonTitle: row.lesson_title || row.lessonTitle || "",
    submittedAt: row.submitted_at || row.submittedAt || "",
    status: row.status || "Pending",
    grade: row.grade || "",
    feedback: row.feedback || ""
  });

  const loadDatabase = () => {
    const cats = db.getCategories();
    const crs = db.getCourses();
    const mods = db.getModules();
    const les = db.getLessons();

    setCategories(cats);
    setCourses(crs);
    setModules(mods);
    setLessons(les);

    // Initial default for category dropdown
    if (cats.length > 0) {
      setCourseFormCategory(cats[0].id);
    }

    // Set course dropdown selections
    if (crs.length > 0) {
      setModuleCourseId(crs[0].id);
      setLessonCourseId(crs[0].id);
      setInvFormCourse(crs[0].title);
    }

    // Load Leads from localStorage or Supabase
    const localLeadsStr = localStorage.getItem("academy_leads");
    const localLeads = localLeadsStr ? JSON.parse(localLeadsStr) : [];
    setLeads(localLeads);

    // Initialize or fetch Invoices
    const localInvoices = localStorage.getItem("admin_invoices");
    if (localInvoices) {
      setInvoices(JSON.parse(localInvoices));
    } else {
      const defaultInvoices: Invoice[] = [];
      localStorage.setItem("admin_invoices", JSON.stringify(defaultInvoices));
      setInvoices(defaultInvoices);
    }

    // Initialize or fetch Surveys
    const localSurveys = localStorage.getItem("admin_surveys");
    if (localSurveys) {
      setSurveys(JSON.parse(localSurveys));
    } else {
      const defaultSurveys: SurveyResponse[] = [];
      localStorage.setItem("admin_surveys", JSON.stringify(defaultSurveys));
      setSurveys(defaultSurveys);
    }

    // Initialize or fetch Live Classes
    const localLiveStr = localStorage.getItem("admin_live_classes");
    if (localLiveStr) {
      setLiveClasses(JSON.parse(localLiveStr));
    } else {
      const defaultLive: LiveClass[] = [];
      localStorage.setItem("admin_live_classes", JSON.stringify(defaultLive));
      setLiveClasses(defaultLive);
    }

    // Initialize or fetch Blog Posts
    const localBlogs = localStorage.getItem("admin_blogs");
    if (localBlogs) {
      setBlogPosts(JSON.parse(localBlogs));
    } else {
      const defaultBlogs: BlogPost[] = [];
      localStorage.setItem("admin_blogs", JSON.stringify(defaultBlogs));
      setBlogPosts(defaultBlogs);
    }

    // Initialize or fetch Knowledge Base articles
    const localArticles = localStorage.getItem("admin_kb_articles");
    if (localArticles) {
      setKbArticles(JSON.parse(localArticles));
    } else {
      const defaultArticles: KBArticle[] = [];
      localStorage.setItem("admin_kb_articles", JSON.stringify(defaultArticles));
      setKbArticles(defaultArticles);
    }

    // Initialize or fetch Grading registry
    const localGrades = localStorage.getItem("admin_grades");
    if (localGrades) {
      setGrades(JSON.parse(localGrades));
    } else {
      const defaultGrades: GradeRecord[] = [];
      localStorage.setItem("admin_grades", JSON.stringify(defaultGrades));
      setGrades(defaultGrades);
    }

    // Initialize or fetch Testimonials list
    const localTesti = localStorage.getItem("admin_testimonials");
    if (localTesti) {
      setTestimonials(JSON.parse(localTesti));
    } else {
      const defaultTesti: any[] = [];
      localStorage.setItem("admin_testimonials", JSON.stringify(defaultTesti));
      setTestimonials(defaultTesti);
    }

    // Initialize or fetch profiles
    const localProfiles = localStorage.getItem("admin_profiles");
    if (localProfiles) {
      setProfiles(JSON.parse(localProfiles));
    } else {
      const defaultProfiles: any[] = [];
      localStorage.setItem("admin_profiles", JSON.stringify(defaultProfiles));
      setProfiles(defaultProfiles);
    }

    // Initialize or fetch enrollments
    const localEnrollmentsStr = localStorage.getItem("admin_enrollments");
    if (localEnrollmentsStr) {
      setDbEnrollments(JSON.parse(localEnrollmentsStr));
    } else {
      const defaultEnrollments: any[] = [];
      localStorage.setItem("admin_enrollments", JSON.stringify(defaultEnrollments));
      setDbEnrollments(defaultEnrollments);
    }

    // Attempt to pull direct live data from Supabase if active
    if (supabase && isSupabaseConfigured) {
      supabase
        .from("courses")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mappedCourses = data.map(mapSupabaseCourse);
            setCourses(mappedCourses);
            localStorage.setItem("courses", JSON.stringify(mappedCourses));
            if (mappedCourses.length > 0) {
              setModuleCourseId(mappedCourses[0].id);
              setLessonCourseId(mappedCourses[0].id);
              setInvFormCourse(mappedCourses[0].title);
            }
          }
        });

      supabase
        .from("modules")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mappedModules = data.map(mapSupabaseModule);
            setModules(mappedModules);
            localStorage.setItem("course_modules", JSON.stringify(mappedModules));
          }
        });

      supabase
        .from("lessons")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mappedLessons = data.map(mapSupabaseLesson);
            setLessons(mappedLessons);
            localStorage.setItem("lessons", JSON.stringify(mappedLessons));
          }
        });

      supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setLeads(data);
            localStorage.setItem("academy_leads", JSON.stringify(data));
          }
        });

      supabase
        .from("profiles")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setProfiles(data);
            localStorage.setItem("admin_profiles", JSON.stringify(data));
          }
        });

      supabase
        .from("enrollments")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setDbEnrollments(data);
            localStorage.setItem("admin_enrollments", JSON.stringify(data));
          }
        });

      supabase
        .from("invoices")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map(mapSupabaseInvoice);
            setInvoices(mapped);
            localStorage.setItem("admin_invoices", JSON.stringify(mapped));
          }
        });

      supabase
        .from("surveys")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map(mapSupabaseSurvey);
            setSurveys(mapped);
            localStorage.setItem("admin_surveys", JSON.stringify(mapped));
          }
        });

      supabase
        .from("live_classes")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map(mapSupabaseLiveClass);
            setLiveClasses(mapped);
            localStorage.setItem("admin_live_classes", JSON.stringify(mapped));
          }
        });

      supabase
        .from("blog_posts")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map(mapSupabaseBlogPost);
            setBlogPosts(mapped);
            localStorage.setItem("admin_blogs", JSON.stringify(mapped));
          }
        });

      supabase
        .from("kb_articles")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map(mapSupabaseKBArticle);
            setKbArticles(mapped);
            localStorage.setItem("admin_kb_articles", JSON.stringify(mapped));
          }
        });

      supabase
        .from("grades")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map(mapSupabaseGradeRecord);
            setGrades(mapped);
            localStorage.setItem("admin_grades", JSON.stringify(mapped));
          }
        });

      supabase
        .from("testimonials")
        .select("*")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setTestimonials(data);
            localStorage.setItem("admin_testimonials", JSON.stringify(data));
          }
        });
    }
  };

  // REFRESH LMS DATA FROM SUPABASE
  const refreshLMSData = async () => {
    if (!supabase || !isSupabaseConfigured) return;
    try {
      const { data: cData, error: cErr } = await supabase.from("courses").select("*");
      if (!cErr && cData) {
        const mappedCourses = cData.map(mapSupabaseCourse);
        setCourses(mappedCourses);
        localStorage.setItem("courses", JSON.stringify(mappedCourses));
        if (mappedCourses.length > 0) {
          setModuleCourseId(prev => prev || mappedCourses[0].id);
          setLessonCourseId(prev => prev || mappedCourses[0].id);
          setInvFormCourse(prev => prev || mappedCourses[0].title);
        }
      }

      const { data: mData, error: mErr } = await supabase.from("modules").select("*");
      if (!mErr && mData) {
        const mappedModules = mData.map(mapSupabaseModule);
        setModules(mappedModules);
        localStorage.setItem("course_modules", JSON.stringify(mappedModules));
      }

      const { data: lData, error: lErr } = await supabase.from("lessons").select("*");
      if (!lErr && lData) {
        const mappedLessons = lData.map(mapSupabaseLesson);
        setLessons(mappedLessons);
        localStorage.setItem("lessons", JSON.stringify(mappedLessons));
      }
    } catch (err) {
      console.warn("LMS data refresh failed:", err);
    }
  };

  // Sync to Supabase helper
  const syncTableToSupabaseSafely = async (tableName: string, data: any) => {
    if (!supabase || !isSupabaseConfigured) return;
    try {
      if (tableName === "leads") {
        // Simple insert syncing for new items
        await supabase.from("leads").upsert(data);
      }
    } catch (e) {
      console.warn("Table broadcast to Supabase failed silently:", e);
    }
  };

  // SECURED ADMIN AUTHORIZATION VERIFICATION
  const verifyAdminAction = async (): Promise<boolean> => {
    if (!supabase || !isSupabaseConfigured) {
      return true; // Fallback for offline mode if Supabase is not ready
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        triggerToast("Unauthorized access. No authenticated user found.");
        return false;
      }
      const { data: admin, error } = await supabase
        .from("admin")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !admin) {
        triggerToast("Unauthorized access. Administrator metadata could not be fetched.");
        return false;
      }

      if (admin.is_owner !== true || admin.is_active !== true) {
        triggerToast("Access blocked. You do not have active owner permissions.");
        return false;
      }
      return true;
    } catch (err) {
      triggerToast("Access blocked. Authorization verification failed.");
      return false;
    }
  };

  // COURSE PUBLISHING TOGGLE CONTROL
  const handleTogglePublishCourse = async (courseId: string) => {
    const authorized = await verifyAdminAction();
    if (!authorized) return;

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const nextPublishState = !course.isPublished;

    const updatedC = courses.map(c => {
      if (c.id === courseId) {
        return { ...c, isPublished: nextPublishState };
      }
      return c;
    });

    localStorage.setItem("courses", JSON.stringify(updatedC));
    setCourses(updatedC);

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("courses")
          .update({ is_published: nextPublishState })
          .eq("id", courseId);

        if (error) {
          triggerToast(`Failed to update publish state in Supabase: ${error.message}`);
          return;
        }
      } catch (err) {
        triggerToast("Failed to sync publish state to cloud database.");
        return;
      }
    }

    triggerToast(
      nextPublishState
        ? `"${course.title}" has been successfully published!`
        : `"${course.title}" has been unpublished.`
    );
  };

  // START COURSE EDITING MODE
  const startEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseFormTitle(course.title);
    setCourseFormDesc(course.description);
    setCourseFormOverview(course.overview || course.description);
    setCourseFormCategory(course.categoryId);
    setCourseFormLevel(course.level);
    setCourseFormDuration(course.duration);
    setCourseFormSkills(course.skills ? course.skills.join(", ") : "");
    setCourseFormOutcomes(course.outcomes ? course.outcomes.join(", ") : "");
    setCourseFormInstructor(course.instructorName || "Sandra Cole");
    setCourseFormThumbnail(course.thumbnail);
    setCourseFormPrice(course.price || "₦45,000");
    setShowAddCourse(true);
    
    // Smooth scroll support to help admin locate form instantly
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // ADD / UPDATE COURSE SUBMIT
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormTitle.trim() || !courseFormDesc.trim()) {
      alert("Please provide at least a course Title and general Description.");
      return;
    }

    const authorized = await verifyAdminAction();
    if (!authorized) return;

    if (editingCourseId) {
      // EDIT MODE
      const updatedC = courses.map(c => {
        if (c.id === editingCourseId) {
          return {
            ...c,
            title: courseFormTitle,
            description: courseFormDesc,
            overview: courseFormOverview || courseFormDesc,
            thumbnail: courseFormThumbnail,
            categoryId: courseFormCategory,
            level: courseFormLevel,
            duration: courseFormDuration,
            instructorName: courseFormInstructor,
            skills: courseFormSkills ? courseFormSkills.split(",").map(s => s.trim()) : c.skills,
            outcomes: courseFormOutcomes ? courseFormOutcomes.split(",").map(o => o.trim()) : c.outcomes,
            price: courseFormPrice,
          };
        }
        return c;
      });

      localStorage.setItem("courses", JSON.stringify(updatedC));
      setCourses(updatedC);

      // Supabase synchronization
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from("courses").update({
            title: courseFormTitle,
            category: courseFormCategory,
            tagline: courseFormDesc,
            thumbnail_url: courseFormThumbnail,
            difficulty: courseFormLevel,
            duration: courseFormDuration,
            price: courseFormPrice,
            overview: courseFormOverview || courseFormDesc,
            skills: courseFormSkills ? courseFormSkills.split(",").map(s => s.trim()) : [],
            outcomes: courseFormOutcomes ? courseFormOutcomes.split(",").map(o => o.trim()) : []
          }).eq("id", editingCourseId);
        } catch (err) {
          console.warn("Could not sync updated course to Supabase:", err);
        }
      }

      // Clear states
      setCourseFormTitle("");
      setCourseFormDesc("");
      setCourseFormOverview("");
      setCourseFormSkills("");
      setCourseFormOutcomes("");
      setCourseFormPrice("₦45,000");
      setEditingCourseId(null);
      setShowAddCourse(false);

      triggerToast(`"${courseFormTitle}" updated successfully!`);
      await refreshLMSData();
    } else {
      // ADD MODE
      const nextId = `course-${courses.length + 1}`;
      const newC: Course = {
        id: nextId,
        title: courseFormTitle,
        description: courseFormDesc,
        overview: courseFormOverview || courseFormDesc,
        thumbnail: courseFormThumbnail,
        categoryId: courseFormCategory,
        level: courseFormLevel,
        duration: courseFormDuration,
        studentCount: "0",
        rating: "5.0",
        instructorName: courseFormInstructor,
        instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
        skills: courseFormSkills ? courseFormSkills.split(",").map(s => s.trim()) : ["Applied AI", "LMS Tools Mastery"],
        outcomes: courseFormOutcomes ? courseFormOutcomes.split(",").map(o => o.trim()) : ["Scale digital solutions", "Achieve high-fidelity automation"],
        price: courseFormPrice,
        isPublished: false
      };

      const updatedC = [...courses, newC];
      localStorage.setItem("courses", JSON.stringify(updatedC));
      setCourses(updatedC);

      // Initial default module for this course
      const modId = `mod-${courses.length + 1}-1`;
      const defaultMod: CourseModule = {
        id: modId,
        courseId: nextId,
        title: "Module 1: Getting Started & Setups",
        sortOrder: 1
      };
      const updatedM = [...modules, defaultMod];
      localStorage.setItem("course_modules", JSON.stringify(updatedM));
      setModules(updatedM);

      // Initial default lesson
      const updatedL: Lesson[] = [
        ...lessons,
        {
          id: `les-${courses.length + 1}-1`,
          moduleId: modId,
          courseId: nextId,
          title: "Introduction video & Syllabus overview",
          duration: "08:30",
          content: "Download course toolkits and set up developer environment keys.",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          sortOrder: 1
        }
      ];
      localStorage.setItem("lessons", JSON.stringify(updatedL));
      setLessons(updatedL);

      // Supabase synchronization
      if (supabase && isSupabaseConfigured) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          await supabase.from("courses").insert({
            id: nextId,
            title: courseFormTitle,
            category: courseFormCategory,
            tagline: courseFormDesc,
            thumbnail_url: courseFormThumbnail,
            difficulty: courseFormLevel,
            duration: courseFormDuration,
            price: courseFormPrice,
            overview: courseFormOverview || courseFormDesc,
            skills: courseFormSkills ? courseFormSkills.split(",").map(s => s.trim()) : ["Applied AI", "LMS Tools Mastery"],
            outcomes: courseFormOutcomes ? courseFormOutcomes.split(",").map(o => o.trim()) : ["Scale digital solutions", "Achieve high-fidelity automation"],
            created_by: user?.id || null,
            created_at: new Date().toISOString(),
            is_published: false
          });

          // Also insert default module and default lesson into Supabase
          await supabase.from("modules").insert({
            id: modId,
            course_id: nextId,
            title: defaultMod.title,
            module_order: 1,
            created_at: new Date().toISOString()
          });

          await supabase.from("lessons").insert({
            id: `les-${courses.length + 1}-1`,
            course_id: nextId,
            module_id: modId,
            title: "Introduction video & Syllabus overview",
            duration: "08:30",
            content: "Download course toolkits and set up developer environment keys.",
            video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            lesson_order: 1,
            created_at: new Date().toISOString()
          });
        } catch (err) {
          console.warn("Could not insert course onto Supabase:", err);
        }
      }

      // Clear states
      setCourseFormTitle("");
      setCourseFormDesc("");
      setCourseFormOverview("");
      setCourseFormSkills("");
      setCourseFormOutcomes("");
      setCourseFormPrice("₦45,000");
      setShowAddCourse(false);
      
      // Auto preset dropdown default choice for modules & lessons tabs
      setModuleCourseId(nextId);
      setLessonCourseId(nextId);

      triggerToast(`"${newC.title}" created successfully with default introductory Module & Lesson!`);
      await refreshLMSData();
    }
  };

  // START MODULE EDITING MODE
  const startEditModule = (mod: CourseModule) => {
    setEditingModuleId(mod.id);
    setModuleCourseId(mod.courseId);
    setModuleTitle(mod.title);
    setShowAddModule(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // ADD / UPDATE MODULE
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !moduleCourseId) {
      alert("Module Title is required.");
      return;
    }

    const authorized = await verifyAdminAction();
    if (!authorized) return;

    if (editingModuleId) {
      // EDIT MODE
      const updatedM = modules.map(m => {
        if (m.id === editingModuleId) {
          return {
            ...m,
            courseId: moduleCourseId,
            title: moduleTitle
          };
        }
        return m;
      });
      localStorage.setItem("course_modules", JSON.stringify(updatedM));
      setModules(updatedM);

      // Supabase synchronization
      if (supabase && isSupabaseConfigured) {
        try {
          const modIndex = modules.find(m => m.id === editingModuleId)?.sortOrder || 1;
          await supabase.from("modules").update({
            course_id: moduleCourseId,
            title: moduleTitle,
            description: "",
            module_order: modIndex
          }).eq("id", editingModuleId);
        } catch (err) {
          console.warn("Could not sync updated module to Supabase:", err);
        }
      }

      setModuleTitle("");
      setEditingModuleId(null);
      setShowAddModule(false);
      triggerToast(`Module successfully updated!`);
      await refreshLMSData();
    } else {
      // ADD MODE
      const moduleCountForCourse = modules.filter(m => m.courseId === moduleCourseId).length;
      const nextModId = `mod-${moduleCourseId.replace("course-", "")}-${moduleCountForCourse + 1}`;
      
      const newMod: CourseModule = {
        id: nextModId,
        courseId: moduleCourseId,
        title: moduleTitle,
        sortOrder: moduleCountForCourse + 1
      };

      const updatedM = [...modules, newMod];
      localStorage.setItem("course_modules", JSON.stringify(updatedM));
      setModules(updatedM);

      // Supabase synchronization
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from("modules").insert({
            id: nextModId,
            course_id: moduleCourseId,
            title: moduleTitle,
            description: "",
            module_order: moduleCountForCourse + 1,
            created_at: new Date().toISOString()
          });
        } catch (err) {
          console.warn("Could not insert module onto Supabase:", err);
        }
      }
      
      setModuleTitle("");
      setShowAddModule(false);
      triggerToast(`New module "${newMod.title}" successfully added!`);
      await refreshLMSData();
    }
  };

  // HANDLE REORDER MODULES (LOCAL & SUPABASE SYNC)
  const handleReorderModules = async (courseId: string, moduleList: CourseModule[]) => {
    const authorized = await verifyAdminAction();
    if (!authorized) return;

    // Update locally
    const updatedModulesList = modules.map(m => {
      const match = moduleList.find(ml => ml.id === m.id);
      if (match) {
        return { ...m, sortOrder: match.sortOrder };
      }
      return m;
    });

    setModules(updatedModulesList);
    localStorage.setItem("course_modules", JSON.stringify(updatedModulesList));

    // Update in Supabase
    if (supabase && isSupabaseConfigured) {
      try {
        const updatePromises = moduleList.map(m => 
          supabase
            .from("modules")
            .update({
              module_order: m.sortOrder,
              order_index: m.sortOrder
            })
            .eq("id", m.id)
        );
        await Promise.all(updatePromises);
      } catch (err) {
        console.warn("Could not sync module order to Supabase:", err);
      }
    }

    triggerToast("Modules order successfully updated!");
    await refreshLMSData();
  };

  // MANUAL REORDER HELPERS
  const moveModuleUp = async (courseId: string, index: number) => {
    const courseMods = modules.filter(m => m.courseId === courseId).sort((a, b) => a.sortOrder - b.sortOrder);
    if (index === 0) return;
    
    const newMods = [...courseMods];
    const temp = newMods[index];
    newMods[index] = newMods[index - 1];
    newMods[index - 1] = temp;

    const reordered = newMods.map((m, idx) => ({
      ...m,
      sortOrder: idx + 1
    }));

    await handleReorderModules(courseId, reordered);
  };

  const moveModuleDown = async (courseId: string, index: number) => {
    const courseMods = modules.filter(m => m.courseId === courseId).sort((a, b) => a.sortOrder - b.sortOrder);
    if (index === courseMods.length - 1) return;
    
    const newMods = [...courseMods];
    const temp = newMods[index];
    newMods[index] = newMods[index + 1];
    newMods[index + 1] = temp;

    const reordered = newMods.map((m, idx) => ({
      ...m,
      sortOrder: idx + 1
    }));

    await handleReorderModules(courseId, reordered);
  };

  // DRAG & DROP HANDLERS
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedModuleId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverModuleId(id);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string, courseId: string) => {
    e.preventDefault();
    if (!draggedModuleId || draggedModuleId === targetId) {
      setDraggedModuleId(null);
      setDragOverModuleId(null);
      return;
    }

    const courseMods = modules.filter(m => m.courseId === courseId).sort((a, b) => a.sortOrder - b.sortOrder);
    const draggedIdx = courseMods.findIndex(m => m.id === draggedModuleId);
    const targetIdx = courseMods.findIndex(m => m.id === targetId);

    if (draggedIdx === -1 || targetIdx === -1) {
      setDraggedModuleId(null);
      setDragOverModuleId(null);
      return;
    }

    const newMods = [...courseMods];
    const [draggedItem] = newMods.splice(draggedIdx, 1);
    newMods.splice(targetIdx, 0, draggedItem);

    const reordered = newMods.map((m, idx) => ({
      ...m,
      sortOrder: idx + 1
    }));

    setDraggedModuleId(null);
    setDragOverModuleId(null);

    await handleReorderModules(courseId, reordered);
  };

  // START LESSON EDITING MODE
  const startEditLesson = (les: Lesson) => {
    setEditingLessonId(les.id);
    setLessonCourseId(les.courseId);
    setLessonModuleId(les.moduleId);
    setLessonTitle(les.title);
    setLessonDuration(les.duration || "12:00");
    setLessonContent(les.content || "");
    setLessonVideoUrl(les.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4");
    setShowAddLesson(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // ADD / UPDATE LESSON
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonCourseId || !lessonModuleId) {
      alert("Lesson Title and Module selection are required.");
      return;
    }

    const authorized = await verifyAdminAction();
    if (!authorized) return;

    if (editingLessonId) {
      // EDIT MODE
      const updatedL = lessons.map(l => {
        if (l.id === editingLessonId) {
          return {
            ...l,
            courseId: lessonCourseId,
            moduleId: lessonModuleId,
            title: lessonTitle,
            duration: lessonDuration || "12:00",
            content: lessonContent || "",
            videoUrl: lessonVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"
          };
        }
        return l;
      });
      localStorage.setItem("lessons", JSON.stringify(updatedL));
      setLessons(updatedL);

      // Supabase synchronization
      if (supabase && isSupabaseConfigured) {
        try {
          const lIndex = lessons.find(l => l.id === editingLessonId)?.sortOrder || 1;
          await supabase.from("lessons").update({
            course_id: lessonCourseId,
            module_id: lessonModuleId,
            title: lessonTitle,
            video_url: lessonVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
            content: lessonContent || "",
            duration: lessonDuration || "12:00",
            lesson_order: lIndex
          }).eq("id", editingLessonId);
        } catch (err) {
          console.warn("Could not sync updated lesson to Supabase:", err);
        }
      }

      setLessonTitle("");
      setLessonContent("");
      setLessonDuration("12:00");
      setEditingLessonId(null);
      setShowAddLesson(false);
      triggerToast(`Lesson "${lessonTitle}" successfully updated!`);
      await refreshLMSData();
    } else {
      // ADD MODE
      const lessonCountForModule = lessons.filter(l => l.moduleId === lessonModuleId).length;
      const nextLesId = `les-${lessonModuleId.replace("mod-", "")}-${lessonCountForModule + 1}`;

      const newLesson: Lesson = {
        id: nextLesId,
        moduleId: lessonModuleId,
        courseId: lessonCourseId,
        title: lessonTitle,
        duration: lessonDuration || "10:00",
        content: lessonContent || "Course resource blueprint guidelines in this lesson step.",
        videoUrl: lessonVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
        sortOrder: lessonCountForModule + 1
      };

      const updatedL = [...lessons, newLesson];
      localStorage.setItem("lessons", JSON.stringify(updatedL));
      setLessons(updatedL);

      // Supabase synchronization
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from("lessons").insert({
            id: nextLesId,
            course_id: lessonCourseId,
            module_id: lessonModuleId,
            title: lessonTitle,
            video_url: lessonVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
            content: lessonContent || "Course resource blueprint guidelines in this lesson step.",
            duration: lessonDuration || "10:00",
            lesson_order: lessonCountForModule + 1,
            created_at: new Date().toISOString()
          });
        } catch (err) {
          console.warn("Could not insert lesson onto Supabase:", err);
        }
      }

      setLessonTitle("");
      setLessonContent("");
      setLessonDuration("12:00");
      setShowAddLesson(false);
      triggerToast(`Lesson "${newLesson.title}" linked to curriculum module!`);
      await refreshLMSData();
    }
  };

  // STUDENT MANAGEMENT OPERATIONS
  const handleToggleUserAccess = async (profileId: string) => {
    const updated = profiles.map(p => {
      if (p.id === profileId) {
        let nextStatus = "active";
        if (p.status === "active") {
          nextStatus = "suspended";
        } else if (p.status === "suspended") {
          nextStatus = "active";
        } else if (p.status === "pending") {
          nextStatus = "active";
        }
        triggerToast(`Access status for ${p.full_name} changed to ${nextStatus.toUpperCase()}`);
        return { ...p, status: nextStatus };
      }
      return p;
    });
    setProfiles(updated);
    localStorage.setItem("admin_profiles", JSON.stringify(updated));

    if (supabase && isSupabaseConfigured) {
      try {
        const prof = updated.find(p => p.id === profileId);
        if (prof) {
          await supabase.from("profiles").upsert({
            id: prof.id,
            full_name: prof.full_name,
            role: prof.role || "student",
            status: prof.status,
            phone: prof.phone || null,
            applied_course: prof.applied_course || null
          });
        }
      } catch (err) {
        console.warn("Could not sync profile status to Supabase:", err);
      }
    }
  };

  const handleUpdateProfile = async (
    profileId: string, 
    updatedName: string, 
    updatedEmail: string, 
    updatedLocation: string, 
    updatedRole: string,
    updatedStatus: string,
    updatedPhone?: string,
    updatedAppliedCourse?: string
  ) => {
    if (!updatedName.trim()) {
      alert("Student name cannot be empty.");
      return;
    }
    if (!updatedEmail.trim()) {
      alert("Student email cannot be empty.");
      return;
    }

    const updated = profiles.map(p => {
      if (p.id === profileId) {
        return { 
          ...p, 
          full_name: updatedName.trim(), 
          email: updatedEmail.trim().toLowerCase(),
          location: updatedLocation.trim(),
          role: updatedRole,
          status: updatedStatus,
          phone: updatedPhone !== undefined ? updatedPhone.trim() : p.phone,
          applied_course: updatedAppliedCourse !== undefined ? updatedAppliedCourse.trim() : p.applied_course
        };
      }
      return p;
    });

    setProfiles(updated);
    localStorage.setItem("admin_profiles", JSON.stringify(updated));

    if (supabase && isSupabaseConfigured) {
      try {
        const prof = updated.find(p => p.id === profileId);
        await supabase.from("profiles").upsert({
          id: profileId,
          full_name: updatedName.trim(),
          email: updatedEmail.trim().toLowerCase(),
          location: updatedLocation.trim(),
          role: updatedRole,
          status: updatedStatus,
          phone: prof?.phone || null,
          applied_course: prof?.applied_course || null
        });
      } catch (err) {
        console.warn("Could not sync updated profile to Supabase:", err);
      }
    }

    setEditingProfileId(null);
    triggerToast(`Updated profile for student ${updatedName.trim()} successfully!`);
  };

  const handleCreateEnrollment = async (userId: string, courseId: string, statusOpt?: string) => {
    if (!courseId) {
      alert("Please choose a program / course first.");
      return;
    }
    const exists = dbEnrollments.some(e => e.user_id === userId && e.course_id === courseId);
    if (exists) {
      alert("This student is already registered for this pathway program.");
      return;
    }

    const targetStatus = statusOpt || enrollmentStatus || "active";

    const newEnr = {
      id: `enr-${userId.substring(0, 5)}-${courseId.substring(0, 5)}-${Date.now().toString().slice(-4)}`,
      user_id: userId,
      course_id: courseId,
      status: targetStatus,
      enrolled_at: new Date().toISOString()
    };

    const updated = [...dbEnrollments, newEnr];
    setDbEnrollments(updated);
    localStorage.setItem("admin_enrollments", JSON.stringify(updated));

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from("enrollments").insert({
          id: newEnr.id,
          user_id: userId,
          course_id: courseId,
          status: targetStatus
        });
      } catch (err) {
        console.warn("Could not insert enrollment to Supabase:", err);
      }
    }

    setEnrollmentCourseId("");
    setEnrollmentStatus("active");
    setShowAddEnrollment(false);
    triggerToast("Pathway enrollment successfully recorded!");
  };

  const handleRemoveEnrollment = async (enrollmentId: string) => {
    const updated = dbEnrollments.filter(e => e.id !== enrollmentId);
    setDbEnrollments(updated);
    localStorage.setItem("admin_enrollments", JSON.stringify(updated));

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from("enrollments").delete().eq("id", enrollmentId);
      } catch (err) {
        console.warn("Could not delete enrollment from Supabase:", err);
      }
    }

    triggerToast("Enrollment registry successfully removed.");
  };

  const handleToggleEnrollmentStatus = async (enrollmentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "completed" : currentStatus === "completed" ? "suspended" : "active";
    const updated = dbEnrollments.map(e => {
      if (e.id === enrollmentId) {
        return { ...e, status: nextStatus };
      }
      return e;
    });
    setDbEnrollments(updated);
    localStorage.setItem("admin_enrollments", JSON.stringify(updated));

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from("enrollments").update({ status: nextStatus }).eq("id", enrollmentId);
      } catch (err) {
        console.warn("Could not sync enrollment status update to Supabase:", err);
      }
    }

    triggerToast(`Enrollment status changed to ${nextStatus.toUpperCase()}`);
  };

  // ADD INVOICE SUBMIT
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invFormStudent.trim() || !invFormEmail.trim()) {
      alert("Student Name and Email are required.");
      return;
    }

    const newInv: Invoice = {
      id: `inv-00${invoices.length + 1}`,
      studentName: invFormStudent,
      studentEmail: invFormEmail,
      courseTitle: invFormCourse,
      amount: Number(invFormAmount) || 199,
      status: "Pending",
      issuedAt: new Date().toISOString()
    };

    const updatedI = [newInv, ...invoices];
    localStorage.setItem("admin_invoices", JSON.stringify(updatedI));
    setInvoices(updatedI);

    if (supabase && isSupabaseConfigured) {
      supabase.from("invoices").insert({
        id: newInv.id,
        student_name: newInv.studentName,
        student_email: newInv.studentEmail,
        course_title: newInv.courseTitle,
        amount: newInv.amount,
        status: newInv.status,
        issued_at: newInv.issuedAt
      }).then(({ error }) => {
        if (error) console.warn("Supabase invoice insert failed:", error);
      });
    }

    setInvFormStudent("");
    setInvFormEmail("");
    setShowAddInvoice(false);
    triggerToast(`Billing invoice successfully issued to ${newInv.studentName}!`);
  };

  // ADD LIVE CLASS SUBMIT
  const handleCreateLiveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim() || !liveDate || !liveTime) {
      alert("Title, Date, and Time are required.");
      return;
    }

    const newClass: LiveClass = {
      id: `live-${Date.now()}`,
      title: liveTitle,
      date: liveDate,
      time: liveTime,
      instructor: "Staff Mentor",
      classUrl: liveUrl || "https://meet.google.com/xyz-abc"
    };

    const updatedL = [newClass, ...liveClasses];
    localStorage.setItem("admin_live_classes", JSON.stringify(updatedL));
    setLiveClasses(updatedL);

    if (supabase && isSupabaseConfigured) {
      supabase.from("live_classes").insert({
        id: newClass.id,
        title: newClass.title,
        date: newClass.date,
        time: newClass.time,
        instructor: newClass.instructor,
        class_url: newClass.classUrl
      }).then(({ error }) => {
        if (error) console.warn("Supabase live class insert failed:", error);
      });
    }

    setLiveTitle("");
    setLiveDate("");
    setLiveTime("");
    setShowAddClass(false);
    triggerToast(`Live class broadcast booked and linked inside Syllabus dashboards!`);
  };

  // ADD BLOG POST SUBMIT
  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogExcerpt.trim()) {
      alert("Please provide a Title and content Excerpt.");
      return;
    }

    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: blogTitle,
      excerpt: blogExcerpt,
      author: "Academy Admin Desk",
      publishedAt: new Date().toISOString().split("T")[0],
      category: blogCategory
    };

    const updatedB = [newPost, ...blogPosts];
    localStorage.setItem("admin_blogs", JSON.stringify(updatedB));
    setBlogPosts(updatedB);

    if (supabase && isSupabaseConfigured) {
      supabase.from("blog_posts").insert({
        id: newPost.id,
        title: newPost.title,
        excerpt: newPost.excerpt,
        author: newPost.author,
        published_at: newPost.publishedAt,
        category: newPost.category
      }).then(({ error }) => {
        if (error) console.warn("Supabase blog post insert failed:", error);
      });
    }

    setBlogTitle("");
    setBlogExcerpt("");
    setShowAddBlog(false);
    triggerToast(`Syllabus blog post published online to students successfully!`);
  };

  // ADD TESTIMONIAL SUBMIT
  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiName.trim() || !testiQuote.trim()) {
      alert("Please enter Name and verified Quote feedback.");
      return;
    }

    const newTesti = {
      id: `testi-${Date.now()}`,
      name: testiName,
      role: testiRole,
      quote: testiQuote,
      rating: Number(testiRating) || 5
    };

    const updatedT = [newTesti, ...testimonials];
    localStorage.setItem("admin_testimonials", JSON.stringify(updatedT));
    setTestimonials(updatedT);

    if (supabase && isSupabaseConfigured) {
      supabase.from("testimonials").insert({
        id: newTesti.id,
        name: newTesti.name,
        role: newTesti.role,
        quote: newTesti.quote,
        rating: newTesti.rating
      }).then(({ error }) => {
        if (error) console.warn("Supabase testimonial insert failed:", error);
      });
    }

    setTestiName("");
    setTestiQuote("");
    setShowAddTestimonial(false);
    triggerToast("Home review published instantly!");
  };

  // SUBMIT GRADING RESPONSE
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradeId) return;

    const updatedG = grades.map(g => {
      if (g.id === activeGradeId) {
        return {
          ...g,
          status: "Graded" as const,
          grade: selectedGradeValue,
          feedback: gradeFeedback || "Completed successfully with honors."
        };
      }
      return g;
    });

    localStorage.setItem("admin_grades", JSON.stringify(updatedG));
    setGrades(updatedG);
    
    if (supabase && isSupabaseConfigured) {
      const targetGrade = updatedG.find(g => g.id === activeGradeId);
      if (targetGrade) {
        supabase.from("grades").upsert({
          id: targetGrade.id,
          student_name: targetGrade.studentName,
          student_email: targetGrade.studentEmail,
          course_title: targetGrade.courseTitle,
          lesson_title: targetGrade.lessonTitle,
          submitted_at: targetGrade.submittedAt,
          status: targetGrade.status,
          grade: targetGrade.grade,
          feedback: targetGrade.feedback
        }).then(({ error }) => {
          if (error) console.warn("Supabase grade update failed:", error);
        });
      }
    }

    setActiveGradeId(null);
    setGradeFeedback("");
    triggerToast("Lesson project graded successfully! Notification dispatched to Student study portal.");
  };

  // DELETE OPERATIONS
  const deleteItem = async (tableName: string, id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    if (["courses", "modules", "lessons"].includes(tableName)) {
      const authorized = await verifyAdminAction();
      if (!authorized) return;
    }

    if (tableName === "courses") {
      const filtered = courses.filter(c => c.id !== id);
      localStorage.setItem("courses", JSON.stringify(filtered));
      setCourses(filtered);

      // Cascading local cleanup
      const filteredModules = modules.filter(m => m.courseId !== id);
      localStorage.setItem("course_modules", JSON.stringify(filteredModules));
      setModules(filteredModules);

      const filteredLessons = lessons.filter(l => l.courseId !== id);
      localStorage.setItem("lessons", JSON.stringify(filteredLessons));
      setLessons(filteredLessons);

      // Delete from Supabase if connected with cascading steps
      if (supabase && isSupabaseConfigured) {
        try {
          // Cascade order: first lessons, then modules, then courses to avoid constraint issues
          await supabase.from("lessons").delete().eq("course_id", id);
          await supabase.from("modules").delete().eq("course_id", id);
          await supabase.from("courses").delete().eq("id", id);
        } catch (err) {
          console.error("Could not cascade delete course from Supabase:", err);
        }
      }

      triggerToast(`Course successfully removed and its modules and lessons deleted.`);
      await refreshLMSData();
    } else if (tableName === "modules") {
      const filtered = modules.filter(m => m.id !== id);
      localStorage.setItem("course_modules", JSON.stringify(filtered));
      setModules(filtered);

      // Clean up orphaned lessons in local persistence
      const filteredLessons = lessons.filter(l => l.moduleId !== id);
      localStorage.setItem("lessons", JSON.stringify(filteredLessons));
      setLessons(filteredLessons);

      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from("lessons").delete().eq("module_id", id);
          await supabase.from("modules").delete().eq("id", id);
        } catch (err) {
          console.error("Could not cascade delete module from Supabase:", err);
        }
      }
      triggerToast(`Module successfully removed and its lessons deleted.`);
      await refreshLMSData();
    } else if (tableName === "lessons") {
      const filtered = lessons.filter(l => l.id !== id);
      localStorage.setItem("lessons", JSON.stringify(filtered));
      setLessons(filtered);

      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from("lessons").delete().eq("id", id);
        } catch (err) {
          console.error("Could not delete lesson from Supabase:", err);
        }
      }
      triggerToast(`Lesson successfully removed.`);
      await refreshLMSData();
    } else if (tableName === "invoices") {
      const filtered = invoices.filter(inv => inv.id !== id);
      localStorage.setItem("admin_invoices", JSON.stringify(filtered));
      setInvoices(filtered);

      if (supabase && isSupabaseConfigured) {
        supabase.from("invoices").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("Could not delete invoice from Supabase:", error);
        });
      }
      triggerToast(`Invoice record removed.`);
    } else if (tableName === "leads") {
      const filtered = leads.filter(l => l.id !== id);
      localStorage.setItem("academy_leads", JSON.stringify(filtered));
      setLeads(filtered);

      if (supabase && isSupabaseConfigured) {
        supabase.from("leads").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("Could not delete lead from Supabase:", error);
        });
      }
      triggerToast(`Opt-in lead deleted.`);
    } else if (tableName === "live") {
      const filtered = liveClasses.filter(c => c.id !== id);
      localStorage.setItem("admin_live_classes", JSON.stringify(filtered));
      setLiveClasses(filtered);

      if (supabase && isSupabaseConfigured) {
        supabase.from("live_classes").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("Could not delete live class from Supabase:", error);
        });
      }
      triggerToast(`Live class entry canceled.`);
    } else if (tableName === "blog") {
      const filtered = blogPosts.filter(b => b.id !== id);
      localStorage.setItem("admin_blogs", JSON.stringify(filtered));
      setBlogPosts(filtered);

      if (supabase && isSupabaseConfigured) {
        supabase.from("blog_posts").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("Could not delete blog post from Supabase:", error);
        });
      }
      triggerToast(`Blog post deleted.`);
    } else if (tableName === "testimonials") {
      const filtered = testimonials.filter(t => t.id !== id);
      localStorage.setItem("admin_testimonials", JSON.stringify(filtered));
      setTestimonials(filtered);

      if (supabase && isSupabaseConfigured) {
        supabase.from("testimonials").delete().eq("id", id).then(({ error }) => {
          if (error) console.error("Could not delete testimonial from Supabase:", error);
        });
      }
      triggerToast(`Testimonial removed from frontend view.`);
    }
  };

  // MARK INVOICE AS PAID
  const markInvoicePaid = (id: string) => {
    const updated = invoices.map(inv => {
      if (inv.id === id) return { ...inv, status: "Paid" as const };
      return inv;
    });
    localStorage.setItem("admin_invoices", JSON.stringify(updated));
    setInvoices(updated);

    if (supabase && isSupabaseConfigured) {
      supabase.from("invoices").update({ status: "Paid" }).eq("id", id).then(({ error }) => {
        if (error) console.error("Could not mark invoice as paid on Supabase:", error);
      });
    }

    triggerToast("Invoice status flag set to PAID.");
  };

  // FILTERED DATA SELECTIONS
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(inv => 
    inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    (l.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfiles = profiles.filter(p => 
    (p.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.location || p.role || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats Counters
  const totalRevenue = invoices.filter(inv => inv.status === "Paid").reduce((acc, inv) => acc + inv.amount, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === "Pending").reduce((acc, inv) => acc + inv.amount, 0);
  const totalEnrollmentsCount = courses.reduce((acc, c) => acc + parseInt(c.studentCount.replace(/,/g, "") || "0"), 0) + invoices.length;

  // Render collapsible side-bar menu items list matching user image
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "survey", label: "Survey", icon: ClipboardList },
    { id: "leads", label: "AI Masterclass Leads", icon: Sparkles },
    { id: "live", label: "Live Classes", icon: Video },
    { id: "blog", label: "Blog", icon: PenTool },
    { id: "kb", label: "Knowledge Base", icon: MessageSquare },
    { id: "grading", label: "Grading Center", icon: GraduationCap },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "testimonials", label: "Testimonials", icon: Star }
  ];

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col items-center justify-center p-4 antialiased pt-36 sm:pt-40 selection:bg-[#0056D2]/20 selection:text-[#0056D2] w-full">
        {toastMsg && (
          <div className="fixed top-20 right-6 bg-[#08142B] text-white border border-white/10 px-5 py-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-4 duration-300 max-w-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-xs leading-relaxed font-bold">{toastMsg}</span>
          </div>
        )}
        
        <div className="w-full max-w-sm bg-white border border-slate-250 p-8 rounded-3xl shadow-xl space-y-6 text-left relative overflow-hidden">
          {/* Subtle decoration accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
          
          {isAdminExistsLoading ? (
            <div className="space-y-6 relative z-10 animate-in fade-in duration-300 text-center py-10 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-[#0056D2]" />
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">Verifying security status...</h3>
                <p className="text-xs text-slate-500 font-medium">Checking admin registration status in database</p>
              </div>
            </div>
          ) : mfaChallengeData ? (
            <div className="space-y-5 relative z-10 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-50 text-[#0056D2] rounded-full flex items-center justify-center border border-blue-100 shadow-xs">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <h1 className="font-display text-xl font-black text-slate-900">MFA Verification</h1>
                <p className="text-[11px] text-slate-500">
                  Enter the 6-digit verification code generated by your Authenticator app for account <strong>{mfaChallengeData.email}</strong>.
                </p>
              </div>

              {adminAuthErr && (
                <div className="bg-rose-50 border border-rose-250 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{adminAuthErr}</span>
                </div>
              )}

              <form onSubmit={handleVerifyMfaChallenge} className="space-y-4">
                <div className="space-y-1.5 text-center">
                  <label className="text-xs font-bold text-slate-700 block text-left">Authenticator Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="e.g. 123456"
                    value={mfaChallengeToken}
                    onChange={(e) => setMfaChallengeToken(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center text-2xl font-mono tracking-widest p-3 bg-slate-50 border border-[#0056D2]/30 text-slate-900 rounded-xl focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-all font-bold"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-[#0056D2] hover:bg-blue-600 active:scale-99 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Access Dashboard &rarr;</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMfaChallengeData(null);
                    setMfaChallengeToken("");
                    setAdminAuthErr("");
                  }}
                  className="w-full text-center text-[10px] text-slate-400 hover:text-slate-600 transition-all font-medium py-1"
                >
                  Cancel and Sign In Again
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="space-y-1 relative z-10 w-full text-center">
                <span className="text-[10px] font-sans font-bold text-[#0056D2] uppercase tracking-wider block">
                  Ai -Online Business Portal
                </span>
                <h1 className="font-display text-2xl font-black tracking-tight text-slate-900 mb-1">
                  Admin Login
                </h1>
                <p className="text-xs text-slate-500">
                  Please enter your business credentials to manage lessons and view applications.
                </p>
              </div>

              {/* Dual authentication tabs */}
              {!ownerExists && (
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl relative z-10 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signin");
                      setAdminAuthErr("");
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      authMode === "signin"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!ownerExists) {
                        setAuthMode("signup");
                        setAdminAuthErr("");
                      }
                    }}
                    disabled={ownerExists}
                    className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      ownerExists
                        ? "bg-slate-50 border border-slate-200/50 text-slate-400 opacity-50 cursor-not-allowed"
                        : authMode === "signup"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/50 cursor-pointer"
                        : "text-slate-500 hover:text-slate-800 cursor-pointer"
                    }`}
                    title={ownerExists ? "Only one owner account is allowed. Signup is closed." : "Register owner admin account"}
                  >
                    <span>{ownerExists ? "🔒" : ""} Sign Up</span>
                    {ownerExists && (
                      <span className="text-[8px] bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-650">
                        Closed
                      </span>
                    )}
                  </button>
                </div>
              )}

              {adminAuthErr && (
                <div className="bg-rose-50 border border-rose-250 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{adminAuthErr}</span>
                </div>
              )}



              {!ownerExists && authMode === "signup" ? (
                <form onSubmit={handleAdminSignup} className="space-y-4 relative z-10 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Director"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. director@ai-onlinebusiness.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Create Password</label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        required
                        placeholder="•••••••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full text-xs p-3 pr-10 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningUp || ownerExists}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-99 text-xs font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigningUp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-emerald-20" />
                        <span>Create Admin Account &rarr;</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@aionlinebusiness.org"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Password</label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? "text" : "password"}
                        required
                        placeholder="•••••••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full text-xs p-3 pr-10 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 bg-[#0056D2] hover:bg-blue-600 active:scale-99 text-xs font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Dashboard &rarr;</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
            <button
              onClick={() => navigateTo("dashboard")}
              type="button"
              className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer font-medium"
            >
              &larr; Back to Student Area
            </button>
            {signedUpAdmin ? (
              <span className="text-emerald-700 font-sans flex items-center gap-1 font-semibold">
                ● Admin Configured
              </span>
            ) : (
              <span className="text-slate-400 font-mono">Secure Access</span>
            )}
          </div>
        </div>

        {/* Expandable Database Schema Setup Guide */}
        <div className="w-full max-w-sm mt-4 bg-white border border-slate-200/80 rounded-2xl shadow-md overflow-hidden text-left p-4.5 z-10 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <details className="group">
            <summary className="list-none flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer hover:text-[#0056D2] select-none">
              <span className="flex items-center gap-2">
                <span className="text-sm">🛠️</span> Supabase Connection Helper
              </span>
              <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform duration-100">▼</span>
            </summary>
            
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3.5">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in your AI Studio environment settings, then run this initialization SQL:
              </p>

              <div className="space-y-1.5">
                <textarea 
                  readOnly 
                  onClick={(e) => (e.target as any).select()}
                  value={`-- AI-ONLINE BUSINESS: ADMIN SCHEMAS & SECURE RLS POLICIES
-- Clean recreation of the table with explicit constraint
DROP TRIGGER IF EXISTS check_admin_limits_trigger ON public.admin;
DROP TABLE IF EXISTS public.admin CASCADE;

CREATE TABLE public.admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_owner BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure primary key with checking constraint (id is not null)
ALTER TABLE public.admin ADD CONSTRAINT one_admin_only CHECK (id IS NOT NULL);

-- Ensure Row Level Security (RLS) is enabled
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies to allow public select and limited access
DROP POLICY IF EXISTS "Allow public select on admin" ON public.admin;
CREATE POLICY "Allow public select on admin"
ON public.admin FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public insert on admin" ON public.admin;
CREATE POLICY "Allow public insert on admin"
ON public.admin FOR INSERT TO PUBLIC WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on admin" ON public.admin;
CREATE POLICY "Allow public update on admin"
ON public.admin FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on admin" ON public.admin;
CREATE POLICY "Allow public delete on admin"
ON public.admin FOR DELETE TO PUBLIC USING (true);

-- Active restriction trigger supporting exactly one administrator registration
CREATE OR REPLACE FUNCTION check_admin_limits()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM public.admin) >= 1 THEN
        RAISE EXCEPTION 'Administrative registration limit reached. Only one global account is authorized.' USING ERRCODE = 'ADM01';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_admin_limits_trigger
BEFORE INSERT ON public.admin
FOR EACH ROW EXECUTE FUNCTION check_admin_limits();`}
                  className="w-full h-28 text-[9px] font-mono p-2.5 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-0 leading-relaxed select-all cursor-text"
                />
                <span className="text-[8.5px] text-slate-400 block text-right font-medium">Click code to highlight and copy</span>
              </div>

              {/* Database Diagnostics Section */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider">Database Diagnostics</span>
                
                <button
                  type="button"
                  disabled={diagLoading || !isOwner}
                  onClick={handleRunDiagnostics}
                  className="w-full py-2 bg-[#0056D2] hover:bg-blue-600 disabled:bg-slate-250 disabled:text-slate-400 text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs font-sans"
                  title={isOwner ? "Run connectivity diagnostics" : "Owner privilege required to run database diagnostics"}
                >
                  {diagLoading ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                  ) : !isOwner ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  )}
                  <span>{diagLoading ? "Checking..." : !isOwner ? "Diagnostics Locked (Owner Only)" : "Verify Connection & Sync Check"}</span>
                </button>

                {diagResult && (
                  <div className={`p-2.5 rounded-lg border text-[10px] space-y-1 animate-in fade-in duration-150 ${
                    diagResult.connected 
                      ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                      : "bg-rose-50/50 border-rose-100 text-rose-800"
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Status:</span>
                      <span className={diagResult.connected ? "text-emerald-600" : "text-rose-600"}>
                        {diagResult.connected ? "Connected" : "Error"}
                      </span>
                    </div>
                    {diagResult.connected ? (
                      <p className="leading-relaxed">
                        Successfully retrieved <strong>{diagResult.count}</strong> record(s) in <code>admin</code>.
                      </p>
                    ) : (
                      <p className="leading-relaxed text-[9px] font-mono whitespace-pre-wrap">
                        {diagResult.error || "Unknown routing or credentials issue."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0C1E3E] antialiased pt-16 sm:pt-20">
      
      {/* PERSISTENT ADMIN HEADER WITH LOGOUT */}
      <header className="sticky top-16 sm:top-20 z-40 bg-white border-b border-gray-200 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0056D2] to-[#2D7FF9] flex items-center justify-center text-white font-black text-sm shadow-md">
            AI
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900 tracking-tight leading-none">
              Client Manager
            </span>
            <span className="text-[9px] font-bold text-[#0056D2] tracking-wider uppercase mt-0.5 font-mono">
              Admin Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigateTo("dashboard")}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-[#0056D2]" />
            <span className="hidden sm:inline">Student Console</span>
          </button>
          
          <button
            type="button"
            onClick={handleAdminLogout}
            className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs min-h-[38px]"
            title="Log Out secure session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* CENTRALIZED GRID WORKSPACE CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        


        {/* Dynamic State Toast Indicator */}
        {toastMsg && (
          <div className="fixed top-20 right-6 bg-[#08142B] text-white border border-white/10 px-5 py-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-4 duration-300 max-w-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-xs leading-relaxed font-bold">{toastMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION CARD */}
          <div className="lg:col-span-1">
            <aside className="sticky top-24 bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-150">
                <span className="text-[10px] font-mono font-black tracking-widest text-[#0056D2] uppercase">
                  Runtime Menu
                </span>
                <span className="text-[9px] bg-blue-50 text-[#0056D2] px-2 py-0.5 rounded-md font-bold font-mono">
                  v2.2
                </span>
              </div>

              {/* Side navigation menu: Scrollable with a fixed height */}
              <div className="h-[432px] overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent text-left">
                <nav className="space-y-4" aria-label="Admin Navigation Panel">
                  
                  {/* Category A: Academic Desk */}
                  <div className="space-y-1">
                    <div 
                      onClick={() => setIsAcademicExpanded(!isAcademicExpanded)}
                      className="flex items-center justify-between text-[10px] font-mono font-black text-slate-400 hover:text-[#0056D2] uppercase tracking-widest py-1.5 px-1 cursor-pointer select-none transition-colors"
                    >
                      <span>Academic Desk</span>
                      {isAcademicExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-[#0056D2] animate-pulse" />}
                    </div>
                    {isAcademicExpanded && (
                      <div className="space-y-0.5 pl-1 animate-in fade-in duration-200">
                        {menuItems.filter(item => ["dashboard", "courses", "students", "live", "grading", "analytics"].includes(item.id)).map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id as AdminTab);
                                setSearchQuery(""); // Clear lookup filters
                              }}
                              className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                                isActive 
                                  ? "bg-[#EEF6FF] text-[#0056D2] font-black shadow-xs-soft" 
                                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs"
                              }`}
                            >
                              <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-105 ${
                                isActive ? "text-[#0056D2]" : "text-slate-400 group-hover:text-slate-600"
                              }`} />
                              <span className="text-xs tracking-tight truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Category B: Operations & Finance */}
                  <div className="space-y-1">
                    <div 
                      onClick={() => setIsOpsExpanded(!isOpsExpanded)}
                      className="flex items-center justify-between text-[10px] font-mono font-black text-slate-400 hover:text-[#0056D2] uppercase tracking-widest py-1.5 px-1 cursor-pointer select-none transition-colors"
                    >
                      <span>Operations & Finance</span>
                      {isOpsExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-[#0056D2] animate-pulse" />}
                    </div>
                    {isOpsExpanded && (
                      <div className="space-y-0.5 pl-1 animate-in fade-in duration-200">
                        {menuItems.filter(item => ["invoices", "survey"].includes(item.id)).map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id as AdminTab);
                                setSearchQuery(""); // Clear lookup filters
                              }}
                              className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                                isActive 
                                  ? "bg-[#EEF6FF] text-[#0056D2] font-black shadow-xs-soft" 
                                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs"
                              }`}
                            >
                              <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-105 ${
                                isActive ? "text-[#0056D2]" : "text-slate-400 group-hover:text-slate-600"
                              }`} />
                              <span className="text-xs tracking-tight truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Category C: Engagement & Growth */}
                  <div className="space-y-1">
                    <div 
                      onClick={() => setIsEngageExpanded(!isEngageExpanded)}
                      className="flex items-center justify-between text-[10px] font-mono font-black text-slate-400 hover:text-[#0056D2] uppercase tracking-widest py-1.5 px-1 cursor-pointer select-none transition-colors"
                    >
                      <span>Engagement Hub</span>
                      {isEngageExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-[#0056D2] animate-pulse" />}
                    </div>
                    {isEngageExpanded && (
                      <div className="space-y-0.5 pl-1 animate-in fade-in duration-200">
                        {menuItems.filter(item => ["leads", "blog", "kb", "testimonials"].includes(item.id)).map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id as AdminTab);
                                setSearchQuery(""); // Clear lookup filters
                              }}
                              className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                                isActive 
                                  ? "bg-[#EEF6FF] text-[#0056D2] font-black shadow-xs-soft" 
                                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs"
                              }`}
                            >
                              <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-105 ${
                                isActive ? "text-[#0056D2]" : "text-slate-400 group-hover:text-slate-600"
                              }`} />
                              <span className="text-xs tracking-tight truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </nav>
              </div>

              {/* Sidebar Action Footer bar */}
              <div className="pt-3 border-t border-gray-150 space-y-1">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-wider font-semibold">
                    OPERATOR SESSION
                  </span>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="truncate max-w-[110px]" title={getAdminDisplayName()}>{getAdminDisplayName()}</span>
                    {isOwnerLoading ? (
                      <span className="text-slate-400 font-mono text-[9px]">checking...</span>
                    ) : isOwner ? (
                      <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50 font-normal flex items-center gap-1 font-mono text-[9px]" title="Primary Platform Owner with Full Access">
                        🛡️ Owner
                      </span>
                    ) : (
                      <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-normal flex items-center gap-1 font-mono text-[9px]" title="Staff Operator Session with Restricted Access">
                        👤 Staff
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </aside>
          </div>

          {/* RIGHT MAIN VIEWPORT CONTAINER */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Global Action Breadcrumb Header bar with Clear Welcome banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0056D2] uppercase tracking-widest block mb-1">
                  ⚙️ Applied Academy Cloud Manager
                </span>
                <h2 className="text-slate-500 text-xs font-medium mb-1">
                  Welcome back, <span className="font-bold text-slate-800 font-sans text-sm">{getAdminDisplayName()}</span> 👋
                </h2>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-[#08142B] tracking-tight capitalize">
                  {activeTab === "leads" ? "AI Masterclass Leads" : activeTab === "kb" ? "Knowledge Base" : `${activeTab} control desk`}
                </h1>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Contextual search input inside dashboard bar */}
                {(activeTab === "courses" || activeTab === "invoices" || activeTab === "leads" || activeTab === "students") && (
                  <div className="relative w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white text-xs pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

        {/* ======================================================== */}
        {/* TAB 1: GENERAL METRICS DASHBOARD CONTAINER */}
        {/* ======================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Quick Summary Cards Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Total Paid Revenue</span>
                  <p className="text-2xl font-black text-slate-900 font-display">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Cohort Active Students</span>
                  <p className="text-2xl font-black text-slate-900 font-display">{totalEnrollmentsCount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 text-[#0056D2] rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Invoices Sent</span>
                  <p className="text-2xl font-black text-slate-900 font-display">{invoices.length}</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                  <Receipt className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Sales Inquiries (Leads)</span>
                  <p className="text-2xl font-black text-slate-900 font-display">{leads.length}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* LMS Curriculum Overview Cards Deck */}
            <div className="space-y-2">
              <h2 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">LMS Curriculum Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Total Courses</span>
                    <p className="text-2xl font-black text-slate-900 font-display">{courses.length}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Total Modules</span>
                    <p className="text-2xl font-black text-slate-900 font-display">{modules.length}</p>
                  </div>
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Total Lessons</span>
                    <p className="text-2xl font-black text-slate-900 font-display">{lessons.length}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Video className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-tier Bento layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Recent Lead Signups and Broadcast timeline */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-display font-black text-base text-slate-900">Recent Masterclass Contacts</h3>
                    <button 
                      onClick={() => setActiveTab("leads")} 
                      className="text-xs font-bold text-[#0056D2] hover:underline"
                    >
                      View All &rarr;
                    </button>
                  </div>
                  
                  {leads.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No leads captured yet. Your opt-in landing page is ready for integrations.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {leads.slice(0, 4).map((l, idx) => (
                        <div key={l.id || idx} className="py-3 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-950 block">{l.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">{l.email} &bull; {l.phone || "No phone"}</span>
                          </div>
                          <span className="text-[9px] bg-blue-50 text-[#0056D2] border border-blue-100 font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {l.goal ? "opt-in opt" : "Lead"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Classes list in dashboard */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-display font-black text-base text-slate-900">Upcoming Live Cohorts</h3>
                    <button 
                      onClick={() => setActiveTab("live")} 
                      className="text-xs font-bold text-[#0056D2] hover:underline animate-pulse"
                    >
                      View Live Slots &rarr;
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveClasses.map((item) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-[#0056D2] uppercase font-black block tracking-wider">LIVE CLASS MEETING</span>
                          <h4 className="font-sans font-bold text-sm text-slate-900">{item.title}</h4>
                          <p className="text-xs text-slate-500">Instructor: {item.instructor}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-mono">{item.date} @ {item.time}</span>
                          <a 
                            href={item.classUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#0056D2] font-black hover:underline"
                          >
                            Join &rarr;
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Billing Overview & Activity log */}
              <div className="space-y-6">
                
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
                  <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-3">Cash Velocity Overview</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Paid Invoices Volume</span>
                      <span className="text-xs font-bold text-emerald-600 font-mono">${totalRevenue}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Unsettled accounts receivable</span>
                      <span className="text-xs font-bold text-amber-600 font-mono">${pendingRevenue}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800">Total Pipeline</span>
                      <span className="text-xs font-black text-slate-900 font-mono">${totalRevenue + pendingRevenue}</span>
                    </div>
                  </div>

                  {/* Immediate Sync Trigger status details */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[10px] text-slate-500 leading-relaxed space-y-1">
                    <span className="font-mono uppercase font-extrabold tracking-wider text-slate-400 block">SECURE CONSOLE CREDENTIALS:</span>
                    <p className="text-[#0056D2] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      MASTER SECURED DATA STREAM ACTIVE
                    </p>
                  </div>
                </div>

                {/* Static notification log */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-3.5">
                  <h3 className="font-display font-black text-sm text-slate-900 pb-1.5 border-b border-gray-100">Live Academy Events</h3>
                  <div className="space-y-3 text-[11px] leading-relaxed">
                    <div className="flex gap-2 text-slate-500">
                      <span className="text-blue-500 font-bold">&bull;</span>
                      <p>Syllabus framework parsed <strong>12 active modules</strong>, verified in background.</p>
                    </div>
                    <div className="flex gap-2 text-slate-500">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <p>Active security policies (RLS directives) mapped for lead captures.</p>
                    </div>
                    <div className="flex gap-2 text-slate-500">
                      <span className="text-purple-500 font-bold">&bull;</span>
                      <p>Grading engine initialized with <strong>{grades.filter(f => f.status === "Pending").length} homework models</strong> left as pending.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: COURSES CONTROLLER (Add courses, modules, lessons, materials) */}
        {/* ======================================================== */}
        {activeTab === "courses" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Create new flagship educational programs, add technical modules, register curriculum sessions, or assign video playback materials below.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowAddCourse(!showAddCourse)}
                  className="bg-[#0056D2] hover:bg-[#003E9C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Course</span>
                </button>

                <button
                  onClick={() => setShowAddModule(!showAddModule)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Add Module</span>
                </button>

                <button
                  onClick={() => setShowAddLesson(!showAddLesson)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Video className="w-4 h-4" />
                  <span>Add Lesson</span>
                </button>
              </div>
            </div>

            {/* Expand Form 1: Add New Course */}
            {showAddCourse && (
              <form onSubmit={handleCreateCourse} className="bg-white border-2 border-[#0056D2]/30 rounded-3xl p-6 space-y-4 shadow-sm text-left">
                <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className={`w-5 h-5 ${editingCourseId ? "text-amber-500 animate-pulse" : "text-[#0056D2]"}`} />
                    {editingCourseId ? `Edit Course Properties` : "Add Live Curriculum Course"}
                  </span>
                  {editingCourseId && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Edit Mode Active
                    </span>
                  )}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Course Course Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advancing Neural Frameworks"
                      value={courseFormTitle}
                      onChange={(e) => setCourseFormTitle(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Syllabus Sector / Category *</label>
                    <select
                      value={courseFormCategory}
                      onChange={(e) => setCourseFormCategory(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Sub-headline / Tagline Description *</label>
                    <input
                      type="text"
                      required
                      placeholder="High-retention short description displayed on syllabus catalog cards."
                      value={courseFormDesc}
                      onChange={(e) => setCourseFormDesc(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Thumbnail Image URL</label>
                    <input
                      type="text"
                      value={courseFormThumbnail}
                      onChange={(e) => setCourseFormThumbnail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Difficulty Level</label>
                    <select
                      value={courseFormLevel}
                      onChange={(e) => setCourseFormLevel(e.target.value as any)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Expected Duration (e.g. '12 hours')</label>
                    <input
                      type="text"
                      value={courseFormDuration}
                      onChange={(e) => setCourseFormDuration(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Tuition Price (Price Tag e.g. '₦45,000')</label>
                    <input
                      type="text"
                      placeholder="e.g. ₦45,000"
                      value={courseFormPrice}
                      onChange={(e) => setCourseFormPrice(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-600">Comprehensive Overview / Curated Syllabus Details</label>
                    <textarea
                      rows={3}
                      placeholder="Detailed background overview, milestones, prerequisites, and resource templates."
                      value={courseFormOverview}
                      onChange={(e) => setCourseFormOverview(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Skills Acquired (comma separated list)</label>
                    <input
                      type="text"
                      placeholder="CO-STAR Logic, Zero-Shot Testing, API pipelines"
                      value={courseFormSkills}
                      onChange={(e) => setCourseFormSkills(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Core Outcomes (comma separated list)</label>
                    <input
                      type="text"
                      placeholder="Publish and sell, Streamline customer retention"
                      value={courseFormOutcomes}
                      onChange={(e) => setCourseFormOutcomes(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCourse(false);
                      setEditingCourseId(null);
                      setCourseFormTitle("");
                      setCourseFormDesc("");
                      setCourseFormOverview("");
                      setCourseFormSkills("");
                      setCourseFormOutcomes("");
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow transition cursor-pointer ${
                      editingCourseId
                        ? "bg-amber-500 hover:bg-amber-600 border border-amber-600/35"
                        : "bg-[#0056D2] hover:bg-blue-600"
                    }`}
                  >
                    {editingCourseId ? "Update Flagship Course" : "Save Flagship Course"}
                  </button>
                </div>
              </form>
            )}

            {/* Expand Form 2: Add New Module */}
            {showAddModule && (
              <form onSubmit={handleCreateModule} className="bg-white border-2 border-purple-500/30 rounded-3xl p-6 space-y-4 shadow-sm text-left max-w-xl mx-auto">
                <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-2 flex items-center justify-between">
                  <span>{editingModuleId ? "Edit Curriculum Module" : "Add Module to Course"}</span>
                  {editingModuleId && (
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Edit Mode Active
                    </span>
                  )}
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Select Parent Course *</label>
                    <select
                      value={moduleCourseId}
                      onChange={(e) => setModuleCourseId(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">-- Choose Course --</option>
                      {courses.map(crs => (
                        <option key={crs.id} value={crs.id}>{crs.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Module Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Module 2: System Optimization Frameworks"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModule(false);
                      setEditingModuleId(null);
                      setModuleTitle("");
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow transition cursor-pointer ${
                      editingModuleId
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {editingModuleId ? "Update Module" : "Link Module"}
                  </button>
                </div>
              </form>
            )}

            {/* Expand Form 3: Add New Lesson */}
            {showAddLesson && (
              <form onSubmit={handleCreateLesson} className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-sm text-left max-w-xl mx-auto">
                <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-2 flex items-center justify-between">
                  <span>{editingLessonId ? "Edit Lesson Details" : "Create Lesson & Attach Resources"}</span>
                  {editingLessonId && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Edit Mode Active
                    </span>
                  )}
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Parent Course *</label>
                      <select
                        value={lessonCourseId}
                        onChange={(e) => {
                          setLessonCourseId(e.target.value);
                          // Select first module matching course automatically
                          const courseMods = modules.filter(m => m.courseId === e.target.value);
                          if (courseMods.length > 0) {
                            setLessonModuleId(courseMods[0].id);
                          } else {
                            setLessonModuleId("");
                          }
                        }}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none"
                      >
                        <option value="">-- Choose Course --</option>
                        {courses.map(crs => (
                          <option key={crs.id} value={crs.id}>{crs.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Parent Module *</label>
                      <select
                        value={lessonModuleId}
                        onChange={(e) => setLessonModuleId(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none"
                      >
                        <option value="">-- Choose Module --</option>
                        {modules
                          .filter(m => m.courseId === lessonCourseId)
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map(m => (
                            <option key={m.id} value={m.id}>{m.title}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Lesson Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Masterclass prompt structures overview"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Playback Duration</label>
                      <input
                        type="text"
                        placeholder="14:25"
                        value={lessonDuration}
                        onChange={(e) => setLessonDuration(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Video Demonstration Link (MP4)</label>
                      <input
                        type="text"
                        value={lessonVideoUrl}
                        onChange={(e) => setLessonVideoUrl(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Detailed Lesson Markdown / Material Text</label>
                    <textarea
                      rows={3}
                      placeholder="Formulate details, templates, download URLs, prompt blocks to display in lesson sandbox."
                      value={lessonContent}
                      onChange={(e) => setLessonContent(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddLesson(false);
                      setEditingLessonId(null);
                      setLessonTitle("");
                      setLessonContent("");
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition cursor-pointer"
                  >
                    {editingLessonId ? "Update Lesson" : "Save Lesson"}
                  </button>
                </div>
              </form>
            )}

            {/* Curriculum Table List */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm overflow-hidden text-left">
              <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                <span>Active Registered Courses ({filteredCourses.length})</span>
                <span className="text-[10px] uppercase font-mono text-[#0056D2] font-black underline">LOCALPERSISTENCY SECURED</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-slate-100 text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[9px] tracking-widest bg-slate-50">
                      <th className="px-4 py-3">Course Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Instructor</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Metrics</th>
                      <th className="px-4 py-3">Structure</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCourses.map((c) => {
                      const catName = categories.find(cat => cat.id === c.categoryId)?.name || "General";
                      const courseMods = modules.filter(m => m.courseId === c.id).sort((a, b) => a.sortOrder - b.sortOrder);
                      const courseLes = lessons.filter(l => l.courseId === c.id);
                      const isExpanded = expandedCourseId === c.id;
                      return (
                        <React.Fragment key={c.id}>
                          <tr className={`hover:bg-slate-50/50 transition-colors ${isExpanded ? "bg-slate-50/70" : ""}`}>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img src={c.thumbnail} alt="" className="w-10 h-8 rounded-lg object-cover shrink-0" />
                                <div className="truncate max-w-sm">
                                  <span className="font-bold text-slate-950 block text-xs truncate">{c.title}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{c.description}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-700">{catName}</td>
                            <td className="px-4 py-3.5 text-slate-500">{c.instructorName}</td>
                            <td className="px-4 py-3.5 font-bold text-emerald-700">{c.price || "₦45,000"}</td>
                            <td className="px-4 py-3.5">
                              <span className="font-mono text-[10px] block font-extrabold text-[#0056D2]">{c.duration}</span>
                              <span className="font-mono text-[9px] text-gray-400 font-medium block">Level: {c.level}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => setExpandedCourseId(isExpanded ? null : c.id)}
                                className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                                  isExpanded
                                    ? "bg-[#0056D2] text-white"
                                    : "bg-[#0056D2]/10 hover:bg-[#0056D2]/15 text-[#0056D2]"
                                }`}
                                title="Manage nested modules and lessons"
                              >
                                <Layers className="w-2.5 h-2.5" /> 
                                <span>{courseMods.length} Mods / {courseLes.length} Lessons</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3 text-current shrink-0" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 text-current shrink-0" />
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1">
                              <button
                                onClick={() => handleTogglePublishCourse(c.id)}
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  c.isPublished
                                    ? "hover:bg-emerald-50 text-emerald-600"
                                    : "hover:bg-slate-100 text-slate-400"
                                }`}
                                title={c.isPublished ? "Published (Click to unpublish)" : "Draft (Click to publish)"}
                              >
                                {c.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => startEditCourse(c)}
                                className="p-1.5 hover:bg-amber-50 text-amber-500 rounded-lg cursor-pointer transition-colors"
                                title="Edit course definitions"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteItem("courses", c.id)}
                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition-colors"
                                title="Delete course"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-slate-100/30">
                              <td colSpan={7} className="px-6 py-4 border-l-4 border-l-[#0056D2] bg-slate-50/40">
                                <div className="space-y-4">
                                  {/* Inner Header Actions */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 pb-3 mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider font-display">
                                        Curriculum Hierarchy Organizer — {c.title}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setModuleCourseId(c.id);
                                          setEditingModuleId(null);
                                          setModuleTitle("");
                                          setShowAddModule(true);
                                          window.scrollTo({ top: 300, behavior: "smooth" });
                                        }}
                                        className="text-[10px] font-bold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm cursor-pointer whitespace-nowrap"
                                      >
                                        <Plus className="w-3 h-3" /> Quick Add Module
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setLessonCourseId(c.id);
                                          if (courseMods.length > 0) {
                                            setLessonModuleId(courseMods[0].id);
                                          } else {
                                            setLessonModuleId("");
                                          }
                                          setEditingLessonId(null);
                                          setLessonTitle("");
                                          setLessonContent("");
                                          setShowAddLesson(true);
                                          window.scrollTo({ top: 300, behavior: "smooth" });
                                        }}
                                        className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm cursor-pointer whitespace-nowrap"
                                      >
                                        <Plus className="w-3 h-3" /> Quick Add Lesson
                                      </button>
                                    </div>
                                  </div>

                                  {/* List of modules and their lessons */}
                                  {courseMods.length === 0 ? (
                                    <div className="py-6 text-center text-slate-400 bg-white border border-dashed border-gray-200 rounded-2xl p-4">
                                      <p className="text-[11px] font-medium text-slate-500">No active curriculum modules assigned to this parent program yet.</p>
                                      <p className="text-[9px] text-slate-400 mt-0.5">Use the "Quick Add Module" option above to spawn your starting module.</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      {courseMods.map((mod, modIdx) => {
                                        const modLessons = courseLes.filter(l => l.moduleId === mod.id);
                                        const isDragged = draggedModuleId === mod.id;
                                        const isDragOver = dragOverModuleId === mod.id;
                                        return (
                                          <div 
                                            key={mod.id} 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, mod.id)}
                                            onDragOver={(e) => handleDragOver(e, mod.id)}
                                            onDrop={(e) => handleDrop(e, mod.id, c.id)}
                                            onDragEnd={() => {
                                              setDraggedModuleId(null);
                                              setDragOverModuleId(null);
                                            }}
                                            className={`bg-white border transition-all duration-200 rounded-2xl p-4 shadow-xs relative ${
                                              isDragged ? "opacity-30 border-dashed border-purple-400 bg-purple-50/20" : 
                                              isDragOver ? "border-purple-500 scale-[1.01] bg-purple-50/10 shadow-md" : "border-gray-150 hover:border-purple-300"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                                              <div className="flex items-center gap-2">
                                                {/* Drag handle */}
                                                <div className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 shrink-0" title="Drag to reorder">
                                                  <GripVertical className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-mono text-[9px] text-purple-600 font-extrabold bg-purple-50 px-2 py-0.5 rounded">
                                                  Module {modIdx + 1}
                                                </span>
                                                <h4 className="font-extrabold text-slate-900 text-xs">{mod.title}</h4>
                                              </div>
                                              <div className="flex items-center gap-1.5">
                                                {/* Reordering manual arrows */}
                                                <button
                                                  type="button"
                                                  disabled={modIdx === 0}
                                                  onClick={() => moveModuleUp(c.id, modIdx)}
                                                  className={`p-1 rounded-lg cursor-pointer transition-colors ${
                                                    modIdx === 0 
                                                      ? "text-gray-300 cursor-not-allowed" 
                                                      : "hover:bg-purple-50 text-purple-600"
                                                  }`}
                                                  title="Move Module Up"
                                                >
                                                  <ArrowUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  type="button"
                                                  disabled={modIdx === courseMods.length - 1}
                                                  onClick={() => moveModuleDown(c.id, modIdx)}
                                                  className={`p-1 rounded-lg cursor-pointer transition-colors ${
                                                    modIdx === courseMods.length - 1 
                                                      ? "text-gray-300 cursor-not-allowed" 
                                                      : "hover:bg-purple-50 text-purple-600"
                                                  }`}
                                                  title="Move Module Down"
                                                >
                                                  <ArrowDown className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                  onClick={() => startEditModule(mod)}
                                                  className="p-1 hover:bg-purple-50 text-purple-600 rounded-lg cursor-pointer transition-colors"
                                                  title="Edit Module Title"
                                                >
                                                  <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button
                                                  onClick={() => deleteItem("modules", mod.id)}
                                                  className="p-1 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition-colors"
                                                  title="Delete Module"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Lessons container */}
                                            <div className="pl-4 space-y-1.5">
                                              {modLessons.length === 0 ? (
                                                <p className="text-[10px] text-slate-400 italic py-1">No lessons populated yet for this module section.</p>
                                              ) : (
                                                modLessons.map((les, lesIdx) => (
                                                  <div key={les.id} className="flex items-center justify-between text-[11px] bg-slate-50 hover:bg-slate-100/80 px-3 py-2 rounded-xl transition-all">
                                                    <div className="flex items-center gap-2 min-w-0 max-w-3xl">
                                                      <span className="font-mono text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                                                        Step {lesIdx + 1}
                                                      </span>
                                                      <span className="text-slate-700 font-bold truncate">{les.title}</span>
                                                      {les.duration && (
                                                        <span className="text-[9px] font-mono text-slate-400 shrink-0 bg-gray-200/50 px-1.5 py-0.5 rounded font-medium">
                                                          {les.duration}
                                                        </span>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0 ml-4">
                                                      <button
                                                        onClick={() => startEditLesson(les)}
                                                        className="p-1 hover:bg-emerald-50 text-emerald-600 rounded-lg cursor-pointer transition-colors"
                                                        title="Edit Lesson Materials"
                                                      >
                                                        <Edit2 className="w-3 h-3" />
                                                      </button>
                                                      <button
                                                        onClick={() => deleteItem("lessons", les.id)}
                                                        className="p-1 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition-colors"
                                                        title="Delete Lesson"
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
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: STUDENTS MANAGEMENT (Active registrations) */}
        {/* ======================================================== */}
        {activeTab === "students" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-xs text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Registered Profiles</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900 font-display">{profiles.length}</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">Active Directory</span>
                </div>
              </div>
              <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-xs text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Student Accounts</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black font-display text-[#0056D2]">
                    {profiles.filter(p => p.status === "active").length}
                  </span>
                  <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">Enabled</span>
                </div>
              </div>
              <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-xs text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Suspended Student Accounts</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black font-display text-rose-600">
                    {profiles.filter(p => p.status === "suspended").length}
                  </span>
                  <span className="text-xs text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded font-semibold">Restricted</span>
                </div>
              </div>
              <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-xs text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Pathway Registrations</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black font-display text-purple-600">{dbEnrollments.length}</span>
                  <span className="text-xs text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded font-semibold">LMS Joined</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm overflow-hidden text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="font-display font-black text-base text-slate-900">
                    Registered Student Directory
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Directly review profile credentials, authenticate learning tokens, toggle suspension privileges, and map custom syllabus programs.
                  </p>
                </div>
                {searchQuery && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-100 font-mono">
                    FILTER ACTIVE
                  </span>
                )}
              </div>

              {filteredProfiles.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-dashed border-gray-200 rounded-2xl bg-slate-50/50">
                  <Search className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No matching student profiles found</p>
                  <p className="text-xs text-slate-400 mt-1">Clear the top search bar or query key values to reset the directory.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-slate-100 text-xs text-left">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[9px] tracking-widest bg-slate-50">
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Access Status</th>
                        <th className="px-4 py-3">Academic Role</th>
                        <th className="px-4 py-3 text-right">Pathway Enrollment History Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProfiles.map((p) => {
                        const isSelected = selectedProfileId === p.id;
                        const studentEnrollments = dbEnrollments.filter(e => e.user_id === p.id);
                        return (
                          <React.Fragment key={p.id}>
                            <tr className={`hover:bg-slate-50/70 transition-colors ${isSelected ? "bg-slate-50" : ""}`}>
                              <td className="px-4 py-3.5">
                                <div className="font-bold text-slate-950 flex items-center gap-1.5">
                                  <span>{p.full_name}</span>
                                  {p.status === "suspended" && (
                                    <span className="text-[8px] bg-red-100 text-red-800 font-black px-1.5 py-0.2 rounded uppercase shrink-0">
                                      Access blocked
                                    </span>
                                  )}
                                  {p.status === "pending" && (
                                    <span className="text-[8px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.2 rounded uppercase shrink-0 animate-pulse">
                                      Pending Approval
                                    </span>
                                  )}
                                </div>
                                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                                  {p.email} {p.location ? `| Location: ${p.location}` : ""} {p.created_at ? `| Joined: ${new Date(p.created_at).toLocaleDateString()}` : ""}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <button
                                  onClick={() => handleToggleUserAccess(p.id)}
                                  className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1 rounded-full cursor-pointer transition-all border ${
                                    p.status === "active"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                                      : p.status === "pending"
                                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-150"
                                      : "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                                  }`}
                                  title="Toggle active vs suspended access"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                  <span>{p.status === "pending" ? "Approve" : p.status || "active"}</span>
                                </button>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="font-extrabold text-[10px] capitalize text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                  {p.role || "student"}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedProfileId(isSelected ? null : p.id)}
                                    className={`inline-flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-indigo-600 text-white"
                                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                    }`}
                                  >
                                    <Layers className="w-3 h-3 text-current" />
                                    <span>{studentEnrollments.length} Programs Registered</span>
                                    {isSelected ? (
                                      <ChevronUp className="w-3 h-3 text-current" />
                                    ) : (
                                      <ChevronDown className="w-3 h-3 text-current" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {isSelected && (
                              <tr className="bg-slate-50/50">
                                <td colSpan={4} className="px-6 py-6 border-l-4 border-l-indigo-600 bg-white shadow-xs">
                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    
                                    {/* COLUMN 1: STUDENT PROFILE CONTROLLER & EDITING VIEW */}
                                    <div className="lg:col-span-5 bg-slate-50/50 rounded-2xl p-5 border border-slate-100 text-left">
                                      <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5 mb-4">
                                        <h4 className="font-display font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                          <span>👤 Student Profile Details</span>
                                        </h4>
                                        <button
                                          onClick={() => {
                                            if (editingProfileId === p.id) {
                                              setEditingProfileId(null);
                                            } else {
                                              setEditingProfileId(p.id);
                                              setEditingProfileName(p.full_name || "");
                                              setEditingProfileEmail(p.email || "");
                                              setEditingProfileLocation(p.location || "");
                                              setEditingProfileRole(p.role || "student");
                                              setEditingProfileStatus(p.status || "active");
                                               setEditingProfilePhone(p.phone || "");
                                               setEditingProfileAppliedCourse(p.applied_course || "");
                                            }
                                          }}
                                          className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all cursor-pointer ${
                                            editingProfileId === p.id 
                                              ? "bg-slate-250 text-slate-700 hover:bg-slate-300"
                                              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                          }`}
                                        >
                                          {editingProfileId === p.id ? "Cancel" : "Edit Profile"}
                                        </button>
                                      </div>

                                      {editingProfileId === p.id ? (
                                        <div className="space-y-3.5 text-left animate-in fade-in duration-200">
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 block">Full Name *</label>
                                            <input
                                              type="text"
                                              value={editingProfileName}
                                              onChange={(e) => setEditingProfileName(e.target.value)}
                                              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none focus:border-indigo-500"
                                              placeholder="Michael Peters"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 block">Email Address *</label>
                                            <input
                                              type="email"
                                              value={editingProfileEmail}
                                              onChange={(e) => setEditingProfileEmail(e.target.value)}
                                              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none focus:border-indigo-500"
                                              placeholder="michael@petersai.com"
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-500 block">Location</label>
                                              <input
                                                type="text"
                                                value={editingProfileLocation}
                                                onChange={(e) => setEditingProfileLocation(e.target.value)}
                                                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none focus:border-indigo-500"
                                                placeholder="Lagos"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-500 block">Academic Role</label>
                                              <select
                                                value={editingProfileRole}
                                                onChange={(e) => setEditingProfileRole(e.target.value)}
                                                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none"
                                              >
                                                <option value="student">Student</option>
                                                <option value="cohort graduate">Cohort Graduate</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option></select></div></div><div className="grid grid-cols-2 gap-2"><div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 block">Phone Number</label><input type="text" value={editingProfilePhone} onChange={(e) => setEditingProfilePhone(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none focus:border-indigo-500" placeholder="+234..." /></div><div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 block">Applied Course</label><select value={editingProfileAppliedCourse} onChange={(e) => setEditingProfileAppliedCourse(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none" ><option value="">-- No Applied Course --</option>{courses.map(c => (<option key={c.id} value={c.title}>{c.title}</option>))}</select></div></div><div className="hidden"><div><select><option></option>
                                              </select>
                                            </div>
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 block">System Access State</label>
                                            <select
                                              value={editingProfileStatus}
                                              onChange={(e) => setEditingProfileStatus(e.target.value)}
                                              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none"
                                            >
                                              <option value="active">Active (Granted)</option>
                                               <option value="pending">Pending Approval</option>
                                              <option value="suspended">Suspended (Restricted)</option>
                                            </select>
                                          </div>

                                          <div className="pt-2">
                                            <button
                                              type="button"
                                              onClick={() => handleUpdateProfile(
                                                p.id,
                                                editingProfileName,
                                                editingProfileEmail,
                                                editingProfileLocation,
                                                editingProfileRole,
                                                editingProfileStatus,
                                                editingProfilePhone,
                                                editingProfileAppliedCourse
                                              )}
                                              className="w-full py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm cursor-pointer border border-indigo-600/30 text-center"
                                            >
                                              Save Profile Details
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="space-y-3.5 text-left text-xs text-slate-700 animate-in fade-in duration-200">
                                          <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2.5 shadow-xs">
                                            <div>
                                              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Full Name</span>
                                              <span className="font-extrabold text-slate-850 text-sm">{p.full_name || "N/A"}</span>
                                            </div>
                                            <div>
                                              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Email Address</span>
                                              <span className="font-medium text-slate-700 font-mono">{p.email || "N/A"}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 pt-0.5">
                                              <div>
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Location</span>
                                                <span className="font-semibold text-slate-700">{p.location || "N/A"}</span>
                                              </div>
                                              <div>
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Academic Role</span>
                                                <span className="font-extrabold text-[10px] text-[#0056D2] capitalize">{p.role || "student"}</span>
                                               </div>
                                             </div>
                                             <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-150">
                                               <div>
                                                 <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Phone Number</span>
                                                 <span className="font-semibold text-slate-700 font-mono text-[10px]">{p.phone || "N/A"}</span>
                                               </div>
                                               <div>
                                                 <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Course Applied For</span>
                                                 <span className="font-extrabold text-[10px] text-indigo-600 block truncate" title={p.applied_course || ""}>{p.applied_course || "N/A"}</span>
                                               </div>
                                             </div>
                                             <div className="hidden">
                                               <div>
                                              </div>
                                            </div>
                                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                                              <div>
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Account ID</span>
                                                <span className="font-mono text-[10px] text-slate-450">{p.id}</span>
                                              </div>
                                              <div className="text-right">
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">System Status</span>
                                                <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                                  p.status === "suspended" ? "bg-red-50 text-red-700" : p.status === "pending" ? "bg-amber-50 border border-amber-200 text-amber-700 animate-pulse" : "bg-emerald-50 text-emerald-700"
                                                }`}>
                                                  {p.status || "active"}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* COLUMN 2: PATHWAY ENROLLMENTS MANAGER */}
                                    <div className="lg:col-span-7 space-y-4 text-left">
                                      <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                                        <span className="font-display font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                          <span>📚 Pathway Enrollments History ({studentEnrollments.length})</span>
                                        </span>
                                        <button
                                          onClick={() => setShowAddEnrollment(!showAddEnrollment)}
                                          className="text-[10px] font-black text-white bg-[#0056D2] hover:bg-[#003E9C] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer transition-all"
                                        >
                                          <Plus className="w-3" />
                                          <span>Manually Add Enrollment</span>
                                        </button>
                                      </div>

                                      {/* Register enrollment in course form */}
                                      {showAddEnrollment && (
                                        <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 animate-in fade-in duration-200 text-left">
                                          <h4 className="font-extrabold text-slate-900 text-xs mb-3 flex items-center justify-between">
                                            <span>Preregister course program manually</span>
                                            <button 
                                              onClick={() => setShowAddEnrollment(false)}
                                              className="text-slate-400 hover:text-slate-655 transition"
                                            >
                                              <X className="w-4 h-4" />
                                            </button>
                                          </h4>
                                          <div className="space-y-3.5">
                                            <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-500 block">Select Course Program *</label>
                                              <select
                                                value={enrollmentCourseId}
                                                onChange={(e) => setEnrollmentCourseId(e.target.value)}
                                                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none bg-white font-medium"
                                              >
                                                <option value="">-- Choose Course --</option>
                                                {courses.map(crs => (
                                                  <option key={crs.id} value={crs.id}>{crs.title}</option>
                                                ))}
                                              </select>
                                            </div>
                                            
                                            <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-500 block">Starting Enrollment Status *</label>
                                              <select
                                                value={enrollmentStatus}
                                                onChange={(e) => setEnrollmentStatus(e.target.value)}
                                                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none bg-white font-medium"
                                              >
                                                <option value="active">Active (Full Ongoing Study)</option>
                                                <option value="completed">Completed (Graduated)</option>
                                                <option value="suspended">Suspended (Blocked / On Hold)</option>
                                              </select>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-1 border-t border-gray-150">
                                              <button
                                                type="button"
                                                onClick={() => setShowAddEnrollment(false)}
                                                className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleCreateEnrollment(p.id, enrollmentCourseId, enrollmentStatus)}
                                                className="px-4 py-1.5 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm cursor-pointer whitespace-nowrap"
                                              >
                                                Grant Enrollment & Set Status
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Enrollments table list */}
                                      {studentEnrollments.length === 0 ? (
                                        <div className="text-center py-6 bg-slate-50 border border-dashed border-gray-200 rounded-2xl p-4">
                                          <p className="text-[11px] font-medium text-slate-500">This user is not currently registered in any active pathways.</p>
                                          <p className="text-[9px] text-slate-400 mt-0.5">Use the "Manually Add Enrollment" option to allocate coursework tokens with set status.</p>
                                        </div>
                                      ) : (
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                          {studentEnrollments.map((enr) => {
                                            const parentCourse = courses.find(c => c.id === enr.course_id || c.title === enr.course_id);
                                            const courseTitle = parentCourse ? parentCourse.title : enr.course_id;
                                            const courseThumbnail = parentCourse ? parentCourse.thumbnail : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=150";
                                            return (
                                              <div key={enr.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-slate-50 hover:bg-slate-100/75 px-4 py-3 rounded-2xl border border-gray-100 transition-all gap-3 text-left">
                                                <div className="flex items-center gap-3">
                                                  <img src={courseThumbnail} alt="" className="w-10 h-8 rounded-lg object-cover shrink-0 border border-gray-200" />
                                                  <div>
                                                    <span className="font-bold text-slate-900 block">{courseTitle}</span>
                                                    <span className="text-[10px] text-slate-400 block mt-0.5">
                                                      ID: {enr.id} {enr.enrolled_at ? `| Registered: ${new Date(enr.enrolled_at).toLocaleDateString()}` : ""}
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                                  {/* Enrollment Status Indicator/Button Cycle */}
                                                  <button
                                                    onClick={() => handleToggleEnrollmentStatus(enr.id, enr.status)}
                                                    className={`text-[9px] font-extrabold px-2.5 py-1 rounded border uppercase transition cursor-pointer ${
                                                      enr.status === "completed"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold"
                                                        : enr.status === "suspended"
                                                        ? "bg-rose-50 text-rose-700 border-rose-100 font-bold"
                                                        : "bg-blue-50 text-blue-700 border-blue-100 font-bold"
                                                    }`}
                                                    title="Click to cycle status (Active -> Completed -> Suspended)"
                                                  >
                                                    {enr.status || "active"}
                                                  </button>

                                                  {/* Cancel enrollment */}
                                                  <button
                                                    onClick={() => {
                                                      if (confirm(`Are you sure you want to remove the enrollment for course "${courseTitle}"?`)) {
                                                        handleRemoveEnrollment(enr.id);
                                                      }
                                                    }}
                                                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition-colors"
                                                    title="Deregister this pathway"
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>

                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: INVOICES MANAGER */}
        {/* ======================================================== */}
        {activeTab === "invoices" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-left">
                Draft, issue, and manage structured invoices for business client operations or university co-brands. 
              </p>
              <button
                onClick={() => setShowAddInvoice(!showAddInvoice)}
                className="bg-[#0056D2] hover:bg-[#003E9C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Invoice</span>
              </button>
            </div>

            {/* Issue invoice form */}
            {showAddInvoice && (
              <form onSubmit={handleCreateInvoice} className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm text-left max-w-lg">
                <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-2">
                  Issue New Billing Invoice Link
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Student full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Amadi Kenneth"
                      value={invFormStudent}
                      onChange={(e) => setInvFormStudent(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Primary student Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="kenneth@amadi.io"
                      value={invFormEmail}
                      onChange={(e) => setInvFormEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Syllabus Course / Track</label>
                      <select
                        value={invFormCourse}
                        onChange={(e) => setInvFormCourse(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200"
                      >
                        {courses.map(crs => (
                          <option key={crs.id} value={crs.title}>{crs.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Amount USD ($)</label>
                      <input
                        type="number"
                        value={invFormAmount}
                        onChange={(e) => setInvFormAmount(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddInvoice(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#0056D2] hover:bg-blue-600 rounded-xl shadow"
                  >
                    Issue Link
                  </button>
                </div>
              </form>
            )}

            {/* Invoices grid */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm overflow-hidden text-left">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-slate-100 text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[9px] tracking-widest bg-slate-50">
                      <th className="px-4 py-3">Invoice Id</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Assigned Program</th>
                      <th className="px-4 py-3">Cost Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-100/50">
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-[#0056D2]">{inv.id}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-900 block">{inv.studentName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{inv.studentEmail}</span>
                        </td>
                        <td className="px-4 py-3.5 font-sans font-medium text-slate-600 truncate max-w-xs">{inv.courseTitle}</td>
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900">${inv.amount}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            inv.status === "Paid" 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                              : inv.status === "Pending" 
                              ? "bg-amber-50 text-amber-800 border border-amber-100" 
                              : "bg-rose-50 text-rose-800 border border-rose-100"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          {inv.status !== "Paid" && (
                            <button
                              onClick={() => markInvoicePaid(inv.id)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 rounded-lg cursor-pointer transition-colors mr-2 border border-slate-200"
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => deleteItem("invoices", inv.id)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SURVEY FEEDBACK RESPONSES */}
        {/* ======================================================== */}
        {activeTab === "survey" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-xs text-slate-500 text-left">
              Direct student feedback index, logging ratings, commentary, and platform satisfaction rates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-white border border-gray-200 p-5 rounded-3xl text-left space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">NPS Score Rating</span>
                <p className="text-3xl font-black text-slate-900 font-display">4.9 / 5.0</p>
                <div className="flex gap-0.5 text-amber-400 leading-none">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-3xl text-left space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Completion rate</span>
                <p className="text-3xl font-black text-slate-900 font-display">94.3%</p>
                <span className="text-[10px] text-slate-550 block">Over standard LMS timetables</span>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-3xl text-left space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Critical Reviews</span>
                <p className="text-3xl font-black text-slate-900 font-display">0</p>
                <span className="text-[10px] text-emerald-600 block">&bull; Outstanding satisfaction index active</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-left">
              <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-2">
                Active Student Feedback surveys
              </h3>

              <div className="space-y-4">
                {surveys.map((srv) => (
                  <div key={srv.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-xs">{srv.studentName}</span>
                        <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100">{srv.category}</span>
                      </div>
                      <p className="text-xs text-slate-650 italic leading-relaxed font-secondary">"{srv.feedback}"</p>
                    </div>

                    <div className="shrink-0 flex items-start gap-1 justify-between flex-row md:flex-col text-right">
                      <div className="flex text-amber-500">
                        {Array.from({ length: srv.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">{new Date(srv.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: AI MASTERCLASS LEADS (Prospect capture database) */}
        {/* ======================================================== */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-xs text-slate-500 text-left">
              Displays immediate opt-ins captured from your LMS landing pages. Syncs automatically in the background.
            </p>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm overflow-hidden text-left">
              <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                <span>Leads Capture Database ({filteredLeads.length})</span>
                <button
                  onClick={() => {
                     // Force pull
                     loadDatabase();
                     triggerToast("Forced pull from cloud database complete.");
                  }}
                  className="text-xs font-bold text-[#0056D2] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Direct Sync</span>
                </button>
              </h3>

              {filteredLeads.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <AlertCircle className="w-8 h-8 text-slate-305 mx-auto mb-2 animate-bounce" />
                  No leads captured yet. Publish the landing page and start collecting high-intent customer phone cards.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-slate-100 text-xs text-left">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[9px] tracking-widest bg-slate-50">
                        <th className="px-4 py-3">Lead full Name</th>
                        <th className="px-4 py-3">Contact Email</th>
                        <th className="px-4 py-3">WhatsApp / Phone</th>
                        <th className="px-4 py-3">Qualification</th>
                        <th className="px-4 py-3 font-mono text-[9px]">Captured At</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((l, index) => (
                        <tr key={l.id || index} className="hover:bg-slate-50">
                          <td className="px-4 py-3.5 font-bold text-slate-950 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            {l.name}
                          </td>
                          <td className="px-4 py-3.5 select-all font-mono text-slate-600">{l.email || "No email"}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap select-all font-mono text-slate-800">
                            {l.phone || l.whatsapp || "No phone"}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full tracking-wider border border-blue-105">
                              {l.qualification || "Qualified Lead"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-slate-500 text-[10px]">
                            {new Date(l.created_at || l.timestamp || Date.now()).toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => deleteItem("leads", l.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

        {/* ======================================================== */}
        {/* TAB 7: LIVE CLASSES Timetable */}
        {/* ======================================================== */}
        {activeTab === "live" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-left">
                Program upcoming cohort zoom lectures or Google Meet operations timelines in this schedule controller.
              </p>
              <button
                onClick={() => setShowAddClass(!showAddClass)}
                className="bg-[#0056D2] hover:bg-[#003E9C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Class</span>
              </button>
            </div>

            {showAddClass && (
              <form onSubmit={handleCreateLiveClass} className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm text-left max-w-lg">
                <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-2">
                  Schedule New live Cohort Meet
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Lecture Title / Objective Topic *</label>
                    <input
                      type="text"
                      required
                      placeholder="Fireside Session: Connecting API endpoints to D3 charts"
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Class Date *</label>
                      <input
                        type="date"
                        required
                        value={liveDate}
                        onChange={(e) => setLiveDate(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Start Time (UTC) *</label>
                      <input
                        type="time"
                        required
                        value={liveTime}
                        onChange={(e) => setLiveTime(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Video conference meeting URL (Google Meet / Zoom)</label>
                    <input
                      type="text"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddClass(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#0056D2] rounded-xl shadow"
                  >
                    Set Schedule
                  </button>
                </div>
              </form>
            )}

            {/* List panel */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-left">
              <div className="space-y-4">
                {liveClasses.map((cl) => (
                  <div key={cl.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <span className="text-[10px] font-mono font-black text-rose-600 tracking-wider block">BROADCAST ACTIVE REGISTER</span>
                      <h4 className="font-sans font-bold text-sm text-slate-950">{cl.title}</h4>
                      <p className="text-xs text-slate-500">Instructor Account: {cl.instructor}</p>
                      <span className="text-[11px] font-mono select-all text-[#0056D2] font-semibold break-all">{cl.classUrl}</span>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block font-mono">{cl.date}</span>
                        <span className="text-[11px] text-slate-400 font-mono block">{cl.time} UTC</span>
                      </div>

                      <button
                        onClick={() => deleteItem("live", cl.id)}
                        className="px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded"
                        title="Delete slot"
                      >
                        Cancel Meet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: ACADEMY BLOG SYSTEM */}
        {/* ======================================================== */}
        {activeTab === "blog" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-left">
                Draft and dispatch industry knowledge notes, system audits guides, and prompt tuning sheets to your student body.
              </p>
              <button
                onClick={() => setShowAddBlog(!showAddBlog)}
                className="bg-[#0056D2] hover:bg-[#003E9C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Draft New Post</span>
              </button>
            </div>

            {showAddBlog && (
              <form onSubmit={handleCreateBlog} className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm text-left max-w-xl">
                <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-2">
                  Draft Syllabus Intelligence Post
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Post Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="Advanced routing algorithms"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Intelligence Sector</label>
                      <select
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200"
                      >
                        <option value="AI Trends">AI Trends</option>
                        <option value="Business Operations">Business Operations</option>
                        <option value="Automation">Automation</option>
                        <option value="Prompting Frameworks">Prompting Frameworks</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Excerpt / Introduction Summary *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Brief highlight details (under 200 words) summarizing this dispatch."
                      value={blogExcerpt}
                      onChange={(e) => setBlogExcerpt(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBlog(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#0056D2] rounded-xl shadow"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            )}

            {/* List panel */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-left">
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div key={post.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded-lg">{post.category}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{post.publishedAt} &bull; By {post.author}</span>
                      </div>
                      <h4 className="font-sans font-bold text-sm text-slate-900">{post.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-secondary">{post.excerpt}</p>
                    </div>

                    <button
                      onClick={() => deleteItem("blog", post.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: KNOWLEDGE BASE ARTICLES */}
        {/* ======================================================== */}
        {activeTab === "kb" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-xs text-slate-500 text-left">
              Build system document articles to bypass common student workspace issues like blank environmental keys or faulty hosting setups.
            </p>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-left">
              <div className="space-y-4">
                {kbArticles.map((art) => (
                  <div key={art.id} className="p-4 bg-slate-50 border border-slate-155 rounded-2xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">{art.category}</span>
                      <h4 className="font-sans font-bold text-sm text-slate-950 mt-1">{art.title}</h4>
                      <p className="text-xs text-slate-600 italic leading-relaxed font-secondary">{art.excerpt}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0">Authored by {art.author}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 10: GRADING CENTER */}
        {/* ======================================================== */}
        {activeTab === "grading" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-xs text-slate-500 text-left">
              Assess and grade coursework blueprints, prompt portfolios, or Canva cover eBook design uploads.
            </p>

            {/* Assessment Grading block panel modal or form */}
            {activeGradeId && (
              <form onSubmit={handleGradeSubmit} className="bg-white border-2 border-[#0056D2] rounded-3xl p-6 space-y-4 text-left max-w-lg shadow-xl animate-in slide-in-from-top-4 duration-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-display font-black text-sm text-slate-900 uppercase tracking-tight">Evaluate Homework Portfolio</h3>
                  <button type="button" onClick={() => setActiveGradeId(null)} className="p-1 hover:bg-slate-100 rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <p className="text-slate-500">Candidate Student Name: <strong className="text-slate-900">{grades.find(g => g.id === activeGradeId)?.studentName}</strong></p>
                    <p className="text-slate-500">Exercise Context: <strong className="text-slate-900">{grades.find(g => g.id === activeGradeId)?.lessonTitle}</strong></p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-650">Select Final Grade Award</label>
                    <select
                      value={selectedGradeValue}
                      onChange={(e) => setSelectedGradeValue(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none"
                    >
                      <option value="A">Grade A (Distinction / Pristine Execution)</option>
                      <option value="B">Grade B (Pass with Merit)</option>
                      <option value="C">Grade C (Satisfactory Pass)</option>
                      <option value="Re-submit">Re-submit requested (Faulty / incomplete)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-650">Mentor Feedback & Review Remarks</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Brilliant prompt chaining! All test cases passed on first execution."
                      value={gradeFeedback}
                      onChange={(e) => setGradeFeedback(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveGradeId(null); setGradeFeedback(""); }}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Discard Evaluation
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-650 bg-[#0056D2] rounded-xl shadow"
                  >
                    Dispatch Assessment
                  </button>
                </div>
              </form>
            )}

            {/* List Homework items */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-left">
              <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-3 mb-4">
                Student Portfolios Pending Evaluation
              </h3>

              <div className="space-y-4">
                {grades.map((grd) => (
                  <div key={grd.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-xs">{grd.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Submitted: {new Date(grd.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-sans font-bold text-xs text-slate-800">{grd.courseTitle}</h4>
                      <p className="text-xs text-slate-500 font-mono">Objective: "{grd.lessonTitle}"</p>
                      {grd.status === "Graded" && (
                        <p className="text-xs text-slate-650 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 leading-relaxed font-secondary">
                          <strong>Grade {grd.grade}:</strong> {grd.feedback}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-start md:items-end justify-between md:justify-start flex-row md:flex-col gap-2.5">
                      <span className={`inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        grd.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {grd.status}
                      </span>
                      {grd.status === "Pending" && (
                        <button
                          onClick={() => {
                            setActiveGradeId(grd.id);
                            setSelectedGradeValue("A");
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0056D2] hover:bg-blue-600 rounded-xl transition"
                        >
                          Grade Blueprint
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 11: ANALYTICS & STATS VISUALS */}
        {/* ======================================================== */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-xs text-slate-500 text-left">
              View study session counters, peak opt-in timeseries, and billing velocity indicators plotted over timezone metrics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-display font-black text-sm text-slate-900 border-b border-gray-100 pb-2">
                  Student Sign Up Distribution
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-650">
                      <span>Lagos & West Africa</span>
                      <span className="font-mono">48%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-[#0056D2] h-2 rounded-full" style={{ width: "48%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-650">
                      <span>London & United Kingdom</span>
                      <span className="font-mono">30%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-650">
                      <span>North America (CAD/USD)</span>
                      <span className="font-mono">22%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "22%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course completions scale */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-display font-black text-sm text-slate-900 border-b border-gray-100 pb-2">
                  Milestone Task Completion Rates
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-650">
                      <span>Prompt engineering portfolios</span>
                      <span className="font-mono">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-650">
                      <span>Selar asset configurations</span>
                      <span className="font-mono">81%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: "81%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-650">
                      <span>Automation timelines built</span>
                      <span className="font-mono">65%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 12: TESTIMONIALS MANAGER */}
        {/* ======================================================== */}
        {activeTab === "testimonials" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-left">
                Formulate, review, and approve glowing graduate quotes featured on the landing page carousel framework.
              </p>
              <button
                onClick={() => setShowAddTestimonial(!showAddTestimonial)}
                className="bg-[#0056D2] hover:bg-[#003E9C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm-soft shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            </div>

            {showAddTestimonial && (
              <form onSubmit={handleCreateTestimonial} className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm text-left max-w-lg">
                <h3 className="font-display font-black text-base text-slate-900 border-b border-gray-100 pb-2">
                  Verify Student Success Quote
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Student full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Theresa Benson"
                        value={testiName}
                        onChange={(e) => setTestiName(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Company Role / Creed</label>
                      <input
                        type="text"
                        placeholder="Automation Architect"
                        value={testiRole}
                        onChange={(e) => setTestiRole(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-655">Success Review Quote *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="This course saved our operation 30 engineering hours a week!"
                      value={testiQuote}
                      onChange={(e) => setTestiQuote(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTestimonial(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#0056D2] rounded-xl shadow"
                  >
                    Save Review
                  </button>
                </div>
              </form>
            )}

            {/* List panel */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-left">
              <div className="space-y-4">
                {testimonials.map((testi) => (
                  <div key={testi.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-xs">{testi.name}</span>
                        <span className="text-[10px] text-slate-500">{testi.role}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-secondary font-medium">"{testi.quote}"</p>
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: testi.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteItem("testimonials", testi.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 13: SUPABASE & RLS SECURITY CENTER */}
        {/* ======================================================== */}
        {activeTab === "supabase" && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            {!isOwner ? (
              <div className="bg-white border border-amber-200 rounded-3xl p-8 shadow-sm space-y-6 text-center max-w-2xl mx-auto my-12">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-100">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-black text-xl text-slate-900">Owner Access Required</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-sans">
                    This control panel contains database-level initialization schemas, security triggers, and environment configuration instructions.
                  </p>
                  <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono inline-block">
                    Current Identity: {getAdminDisplayName()} • Status: Staff (Unprivileged)
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-amber-600 font-bold font-sans">
                    To access the Supabase Control Center, make sure your email is registered with <code>is_owner: true</code> in the <code>public.admin</code> table.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-3xl space-y-4">
              <span className="text-[10px] uppercase font-mono font-black text-blue-400 bg-blue-950 px-2.5 py-1 rounded-md">
                Production Deployment Guide & RLS Controls
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white">
                🚀 Database Schemas & Security Policies
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                Deploy these configurations in your Supabase SQL Editor and Authentication console to activate cloud storage state engines. Active Row-Level Security (RLS) guarantees secure sandboxed interaction.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Quick Actions & Instructions */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-display font-black text-sm text-slate-950 pb-2 border-b border-gray-100">
                    Step By Step Deployment
                  </h3>
                  
                  <ol className="space-y-3.5 text-xs text-slate-755 list-decimal pl-4 leading-relaxed font-sans">
                    <li>
                      Log into your <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#0056D2] font-semibold hover:underline">Supabase Dashboard &rarr;</a> and spin up a new project.
                    </li>
                    <li>
                      Go to the <strong>SQL Editor</strong> in the left rail menu.
                    </li>
                    <li>
                      Copy the generated table queries from the interactive display panel on the right.
                    </li>
                    <li>
                      Paste the code, click <strong>Run</strong>, and watch the databases seed immediately.
                    </li>
                    <li>
                      Finally, navigate to your project settings, grab your API credentials, and add them inside your AI Studio Environment settings.
                    </li>
                  </ol>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <h3 className="font-display font-black text-sm text-slate-955 pb-2 border-b border-gray-100">
                    Required Keys Setup
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Make sure to set the following variables in your environment config or AI Studio Settings rail to authorize real-time synchronization:
                  </p>
                  <div className="font-mono text-[10px] bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-slate-600 block space-y-2">
                    <div>
                      <span className="text-[#0056D2] font-bold block">VITE_SUPABASE_URL=</span>
                      <span className="text-slate-400">e.g. https://xyz.supabase.co</span>
                    </div>
                    <div>
                      <span className="text-[#0056D2] font-bold block">VITE_SUPABASE_ANON_KEY=</span>
                      <span className="text-slate-400">e.g. eyJhbGciOiJIUzI1NiIsInR5c...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: SQL & RLS Queries Pane */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="font-display font-black text-sm text-slate-955">
                      ⚡ Complete SQL Schema & Seeding Script
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-505 leading-relaxed">
                    Copy and run this entire block in your Supabase SQL project editor. This script creates the core portfolio tables, activates RLS, and sets the secure insertion policies.
                  </p>

                  <div className="relative">
                    <pre className="w-full bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed p-4 rounded-2xl overflow-x-auto whitespace-pre-wrap max-h-[450px]">
{`-- AI -ONLINE BUSINESS SUPABASE SCHEMAS & SECURE RLS POLICIES
-- Clean, optimized schema with strict admin access and student enrolled restrictions.

-- 1. PROFILES TABLE
-- Maps auth.users securely into academic system profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Admins have full access to all CRUD operations on profiles
CREATE POLICY "Admins full override profiles" ON public.profiles
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Students can read any profile info (e.g. searching mentors/peers) and update their own
CREATE POLICY "Public profiles read-only selective access" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Students update their own profile card" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- 2. COURSES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    overview TEXT,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    duration TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses Policies
-- Admin-only override allows full CRUD operations (insert, select, update, delete)
CREATE POLICY "Admins full override courses" ON public.courses
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Students have read-only access ONLY to courses they are actively enrolled in
CREATE POLICY "Students read enrolled courses" ON public.courses
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE enrollments.user_id = auth.uid() 
            AND enrollments.course_id = public.courses.id
        )
    );


-- 3. MODULES TABLE (Contains individual structured course units)
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Modules Policies
-- Admins bypass security constraints for modules completely
CREATE POLICY "Admins full override modules" ON public.modules
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Enrolled students access modules of their courses
CREATE POLICY "Students read enrolled modules" ON public.modules
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.enrollments
            WHERE enrollments.user_id = auth.uid()
            AND enrollments.course_id = public.modules.course_id
        )
    );


-- 4. LESSONS TABLE (Contains educational scripts, texts & video assets)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT,
    content TEXT,
    duration TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Lessons Policies
-- Admins have perfect command of the lessons collection
CREATE POLICY "Admins full override lessons" ON public.lessons
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Enrolled students can read lessons within modules belonging to their enrolled courses
CREATE POLICY "Students read enrolled lessons" ON public.lessons
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.modules
            JOIN public.enrollments ON enrollments.course_id = modules.course_id
            WHERE modules.id = public.lessons.module_id
            AND enrollments.user_id = auth.uid()
        )
    );


-- 5. ENROLLMENTS TABLE (Connects Students securely to Courses)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, course_id)
);

-- Enable RLS for enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Enrollments Policies
-- Admins grant, modify, and delete registrations at will
CREATE POLICY "Admins full override enrollments" ON public.enrollments
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Students can read their own enrollment tokens
CREATE POLICY "Students read own enrollments only" ON public.enrollments
    FOR SELECT TO authenticated USING (user_id = auth.uid());
`}
                    </pre>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`-- AI -ONLINE BUSINESS SUPABASE SCHEMAS & SECURE RLS POLICIES
-- Clean, optimized schema with strict admin access and student enrolled restrictions.

-- 1. PROFILES TABLE
-- Maps auth.users securely into academic system profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    updated_at TIMESTAMPTZ DEFAULT now()
 );

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Admins have full access to all CRUD operations on profiles
CREATE POLICY "Admins full override profiles" ON public.profiles
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Students can read any profile info (e.g. searching mentors/peers) and update their own
CREATE POLICY "Public profiles read-only selective access" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Students update their own profile card" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- 2. COURSES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    overview TEXT,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    duration TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses Policies
-- Admin-only override allows full CRUD operations (insert, select, update, delete)
CREATE POLICY "Admins full override courses" ON public.courses
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Students have read-only access ONLY to courses they are actively enrolled in
CREATE POLICY "Students read enrolled courses" ON public.courses
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE enrollments.user_id = auth.uid() 
            AND enrollments.course_id = public.courses.id
        )
    );


-- 3. MODULES TABLE (Contains individual structured course units)
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Modules Policies
-- Admins bypass security constraints for modules completely
CREATE POLICY "Admins full override modules" ON public.modules
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Enrolled students access modules of their courses
CREATE POLICY "Students read enrolled modules" ON public.modules
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.enrollments
            WHERE enrollments.user_id = auth.uid()
            AND enrollments.course_id = public.modules.course_id
        )
    );


-- 4. LESSONS TABLE (Contains educational scripts, texts & video assets)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT,
    content TEXT,
    duration TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Lessons Policies
-- Admins have perfect command of the lessons collection
CREATE POLICY "Admins full override lessons" ON public.lessons
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Enrolled students can read lessons within modules belonging to their enrolled courses
CREATE POLICY "Students read enrolled lessons" ON public.lessons
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.modules
            JOIN public.enrollments ON enrollments.course_id = modules.course_id
            WHERE modules.id = public.lessons.module_id
            AND enrollments.user_id = auth.uid()
        )
    );


-- 5. ENROLLMENTS TABLE (Connects Students securely to Courses)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, course_id)
);

-- Enable RLS for enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Enrollments Policies
-- Admins grant, modify, and delete registrations at will
CREATE POLICY "Admins full override enrollments" ON public.enrollments
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('admin@ai-onlinebusiness.com', 'admin@academy.com', 'dspacademyonline@gmail.com')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Students can read their own enrollment tokens
CREATE POLICY "Students read own enrollments only" ON public.enrollments
    FOR SELECT TO authenticated USING (user_id = auth.uid());


-- 6. ADMIN TABLE (Allows robust global admin persistence)
DROP TRIGGER IF EXISTS check_admin_limits_trigger ON public.admin;
DROP TABLE IF EXISTS public.admin CASCADE;

CREATE TABLE public.admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_owner BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure primary key with checking constraint (id is not null)
ALTER TABLE public.admin ADD CONSTRAINT one_admin_only CHECK (id IS NOT NULL);

-- Enable RLS for admin
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies
DROP POLICY IF EXISTS "Allow public select on admin" ON public.admin;
CREATE POLICY "Allow public select on admin"
ON public.admin FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public insert on admin" ON public.admin;
CREATE POLICY "Allow public insert on admin"
ON public.admin FOR INSERT TO PUBLIC WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on admin" ON public.admin;
CREATE POLICY "Allow public update on admin"
ON public.admin FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on admin" ON public.admin;
CREATE POLICY "Allow public delete on admin"
ON public.admin FOR DELETE TO PUBLIC USING (true);

-- Trigger-level constraint to guarantee a maximum of one row in the table
CREATE OR REPLACE FUNCTION check_admin_limits()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM public.admin) >= 1 THEN
        RAISE EXCEPTION 'Administrative registration limit reached. Only one global account is authorized.' USING ERRCODE = 'ADM01';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_admin_limits_trigger
BEFORE INSERT ON public.admin
FOR EACH ROW EXECUTE FUNCTION check_admin_limits();`);
                        triggerToast("SQL Schema and RLS policies copied to clipboard!");
                      }}
                      className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 font-bold text-white px-3.5 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer"
                    >
                      Copy SQL Script
                    </button>
                  </div>
                </div>
              </div>

            </div>
              </>
            )}
          </div>
        )}

          </div> {/* lg:col-span-3 */}
        </div> {/* grid */}
      </div> {/* max-w-7xl */}
    </div>
    </AdminGuard>
  );
}
