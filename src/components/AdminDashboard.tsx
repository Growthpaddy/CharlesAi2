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
  ArrowUp, ArrowDown, GripVertical, Link as LinkIcon
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

  // Multi-Factor Authentication States
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
        console.error("Error setting central admin auth context:", contextErr);
      }

      setIsAdminAuth(true);
      setIsOwner(true);
      setOwnerExists(true);
      setAdminExists(true);
      setActiveTab("