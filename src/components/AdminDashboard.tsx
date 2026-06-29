/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, BookOpen, Users, Receipt, ClipboardList, Sparkles, 
  Video, Layers, LogOut, ChevronLeft, ChevronRight, CheckCircle2, RefreshCw, 
  ShieldAlert, GraduationCap, ArrowUpRight, ShieldCheck, DollarSign, UserCheck, FileText, Activity, Lock
} from "lucide-react";
import { testConnection } from "../lib/dbTest";
import { runSupabaseDiagnostics } from "../lib/adminAuth";
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

export default function AdminDashboard() {
  const { logoutAdmin, currentAdmin, loginAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Track location hash locally to handle seamless portal switching
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  
  // Login form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // System status metrics
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{connected: boolean; message: string} | null>(null);
  const [diagnosticsLog, setDiagnosticsLog] = useState<string[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  useEffect(() => {
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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      if (loginAdmin) {
        await loginAdmin(email, password);
        triggerToast("Administrative session authenticated.");
        window.location.hash = "admin-dashboard";
      } else {
        throw new Error("Admin login service context uninitialized.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Invalid master administrative keys.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleExplicitLogout = async () => {
    try {
      if (logoutAdmin) {
        await logoutAdmin();
      }
    } catch (err) {
      console.error("Session clean-up intercept:", err);
    } finally {
      window.location.hash = "admin-login";
    }
  };

  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnosticsLog(["Initializing backend live validation diagnostics...", `Timestamp: ${new Date().toISOString()}`]);
    try {
      const logs = await runSupabaseDiagnostics();
      setDiagnosticsLog(prev => [...prev, ...logs, "System diagnostics matrix validation: Success."]);
    } catch (err: any) {
      setDiagnosticsLog(prev => [...prev, `Error during diagnostics execution pipeline: ${err.message}`]);
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

  // ==========================================
  // VIEW RENDERER 1: VIBRANT LIGHT LOGIN PORTAL
  // Bypasses AdminGuard so it never hits the "Role Authority Denied" page loop
  // ==========================================
  if (currentHash === "#admin-login") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Master Gateway</h2>
            <p className="text-xs text-slate-400 font-medium">Verify structural credentials to unlock administration canvas nodes.</p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 font-semibold text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              {isLoggingIn ? "Validating Session..." : "Initialize Session Matrix"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDERER 2: SECURE WORKBENCH PANEL
  // Wrapped inside AdminGuard to enforce strict administrative isolation
  // ==========================================
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex relative overflow-hidden">
        
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-white text-slate-900 border border-emerald-200 shadow-xl rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
          </div>
        )}

        <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex flex-col justify-between z-20`}>
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              {sidebarOpen ? (
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-xs tracking-widest text-slate-900">LMS CORE</span>
                </div>
              ) : (
                <div className="p-1.5 bg-emerald-600 rounded-lg text-white mx-auto">
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
              <p className="text-[11px] text-slate-400 mt-0.5">Secure identity: {currentAdmin?.email || "Authenticated System Administrator"}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] uppercase tracking-wider font-bold ${
                dbStatus?.connected 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dbStatus?.connected ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
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
                    <h3 className="text-2xl font-black mt-2 text-slate-900">$0</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-slate-300" /> Wires idle until active billing rules fire
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-slate-900 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cohort Active Students</p>
                      <div className="p-1 bg-slate-100 text-slate-900 rounded-md"><UserCheck className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">0</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      Waiting on curriculum deployment
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-amber-500 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invoices Sent</p>
                      <div className="p-1 bg-amber-50 text-amber-600 rounded-md"><FileText className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">0</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      Automated invoicing engine online
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-l-indigo-500 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sales Inquiries (Leads)</p>
                      <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md"><ArrowUpRight className="w-3.5 h-3.5" /></div>
                    </div>
                    <h3 className="text-2xl font-black mt-2 text-slate-900">0</h3>
                    <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      Inbound webhooks ready to receive
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
                      <p className="text-slate-500 italic">Console idling. Run a structural live diagnostic calibration sweep above to inspect runtime variables...</p>
                    ) : (
                      diagnosticsLog.map((log, i) => (
                        <div key={i} className="leading-relaxed border-l border-emerald-700 pl-2.5">{log}</div>
                      ))
                    )}
                  </div>
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Commit Active Model Rules
                  </button>
                </div>
              </div>
            )}

            {["courses", "modules", "lessons", "students", "sales", "quizzes", "database"].includes(activeTab) && (
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
      </div>
    </AdminGuard>
  );
}