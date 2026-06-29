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

export default function AdminDashboard() {
  const { logoutAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Diagnostic and initialization states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{connected: boolean; message: string} | null>(null);
  const [diagnosticsLog, setDiagnosticsLog] = useState<string[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    async function checkSystem() {
      try {
        const res = await testConnection();
        setDbStatus(res);
      } catch (err: any) {
        setDbStatus({ connected: false, message: err.message || "Failed connection check" });
      }
    }
    checkSystem();
  }, []);

  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnosticsLog(["Initializing backend diagnostics...", `Timestamp: ${new Date().toISOString()}`]);
    try {
      const logs = await runSupabaseDiagnostics();
      setDiagnosticsLog(prev => [...prev, ...logs, "System diagnostics check complete."]);
    } catch (err: any) {
      setDiagnosticsLog(prev => [...prev, `Error during diagnostics: ${err.message}`]);
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

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

  return (
    <AdminGuard>
      {/* Complete Black-out Canvas Background */}
      <div className="min-h-screen bg-black text-zinc-100 font-sans flex relative overflow-hidden">
        
        {/* Toast Notification Banner (Pure Black minimalist variant) */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-zinc-900 text-white font-medium px-4 py-3 rounded-xl shadow-2xl border border-zinc-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span className="text-xs tracking-wide">{toastMessage}</span>
          </div>
        )}

        {/* Sidebar Menu Navigation System (Jet Black) */}
        <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-black border-r border-zinc-900 transition-all duration-300 flex flex-col justify-between z-20`}>
          <div>
            {/* Logo/Header Section */}
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              {sidebarOpen ? (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-white" />
                  <span className="font-bold text-sm tracking-widest text-white">LMS ADMIN</span>
                </div>
              ) : (
                <GraduationCap className="w-5 h-5 text-white mx-auto" />
              )}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 hover:text-white"
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? "bg-zinc-900 text-white border border-zinc-800 font-semibold" 
                        : "text-zinc-500 hover:bg-zinc-950 hover:text-zinc-300"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Admin Meta / Logout Section */}
          <div className="p-4 border-t border-zinc-900">
            <button 
              onClick={() => logoutAdmin()}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-500 hover:bg-zinc-950 hover:text-zinc-300 transition-colors"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>Exit Dashboard</span>}
            </button>
          </div>
        </aside>

        {/* Main Application Window Canvas */}
        <main className="flex-1 overflow-y-auto min-h-screen bg-black flex flex-col">
          
          {/* Workspace Header Panel */}
          <header className="h-20 border-b border-zinc-900 bg-black/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-base font-bold tracking-tight capitalize text-white">{activeTab.replace("_", " ")}</h1>
              <p className="text-[11px] text-zinc-500 mt-0.5">Control panel and core backend relational matrix engine components.</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* System Connection Health Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-900 text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                <span className={`w-1.5 h-1.5 rounded-full ${dbStatus?.connected ? "bg-white animate-pulse" : "bg-zinc-700"}`} />
                {dbStatus?.connected ? "Matrix Active" : "Offline"}
              </div>
            </div>
          </header>

          {/* Active Tab Workspace Container */}
          <div className="p-8 max-w-7xl w-full mx-auto flex-1">
            
            {/* TAB: DASHBOARD / OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                
                {/* Zeroed-out Performance Matrices */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-black border border-zinc-900 p-5 rounded-2xl relative">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Total Paid Revenue</p>
                    <h3 className="text-xl font-bold mt-2 text-white">$0</h3>
                    <div className="text-[10px] text-zinc-600 mt-3">Awaiting system activation...</div>
                  </div>

                  <div className="bg-black border border-zinc-900 p-5 rounded-2xl relative">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Cohort Active Students</p>
                    <h3 className="text-xl font-bold mt-2 text-white">0</h3>
                    <div className="text-[10px] text-zinc-600 mt-3">No active enrollments recorded.</div>
                  </div>

                  <div className="bg-black border border-zinc-900 p-5 rounded-2xl relative">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Invoices Sent</p>
                    <h3 className="text-xl font-bold mt-2 text-white">0</h3>
                    <div className="text-[10px] text-zinc-600 mt-3">Billing pipeline uninitialized.</div>
                  </div>

                  <div className="bg-black border border-zinc-900 p-5 rounded-2xl relative">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Sales Inquiries (Leads)</p>
                    <h3 className="text-xl font-bold mt-2 text-white">0</h3>
                    <div className="text-[10px] text-zinc-600 mt-3">Inbound capture streams ready.</div>
                  </div>
                </div>

                {/* Database Matrix Console Section */}
                <div className="bg-black border border-zinc-900 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-900 gap-4">
                    <div>
                      <h2 className="text-sm font-bold tracking-tight text-white">System Calibration Logging Engine</h2>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Test state validation engine logs and core relational mapping pipelines.</p>
                    </div>
                    <button
                      onClick={handleRunDiagnostics}
                      disabled={isRunningDiagnostics}
                      className="px-3 py-1.5 bg-black border border-zinc-800 hover:bg-zinc-900 disabled:opacity-50 font-medium rounded-lg text-xs flex items-center gap-2 text-zinc-300 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRunningDiagnostics ? "animate-spin" : ""}`} />
                      {isRunningDiagnostics ? "Running Matrix Check..." : "Execute Infrastructure Test"}
                    </button>
                  </div>
                  
                  <div className="mt-4 bg-black rounded-xl border border-zinc-900 p-4 font-mono text-[11px] text-zinc-400 h-40 overflow-y-auto space-y-1">
                    {diagnosticsLog.length === 0 ? (
                      <p className="text-zinc-600 italic">Console idle. Awaiting configuration run parameters to populate initialization logs...</p>
                    ) : (
                      diagnosticsLog.map((log, i) => (
                        <div key={i} className="leading-relaxed border-l border-zinc-800 pl-2">{log}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GOOGLE AI STUDIO ENGINE CONFIGURATION (GAS) */}
            {activeTab === "gas_config" && (
              <div className="bg-black border border-zinc-900 rounded-2xl p-6 max-w-2xl space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-white">GAS Pipeline Orchestration Framework</h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Control orchestration parameters, prompt profiles, and autonomous generation logic blocks.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">Target Engine Model ID</label>
                    <select className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-zinc-700 text-zinc-300">
                      <option value="gemini-1.5-pro">gemini-1.5-pro (Dynamic Inference)</option>
                      <option value="gemini-1.5-flash">gemini-1.5-flash (High-Throughput)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">Global System Instruction Framework</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-black border border-zinc-900 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-zinc-700 text-zinc-400 leading-relaxed"
                      defaultValue="System-attached orchestration agent logic template. Running operational infrastructure interfaces..."
                    />
                  </div>
                  <button 
                    onClick={() => triggerToast("System Instruction matrix re-mapped.")}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 font-semibold text-xs text-white rounded-xl transition-all cursor-pointer"
                  >
                    Commit Model Rules
                  </button>
                </div>
              </div>
            )}

            {/* FALLBACK MANAGEMENT VIEWS */}
            {["courses", "modules", "lessons", "students", "sales", "quizzes", "database"].includes(activeTab) && (
              <div className="bg-black border border-zinc-900 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-1">{activeTab.replace("_", " ")} Framework Canvas</h3>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Active connection pipeline established. Management controls will initialize once active database workflows are introduced.
                </p>
              </div>
            )}

          </div>
        </main>
      </div>
    </AdminGuard>
  );
}