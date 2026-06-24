import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Save, RefreshCw, Check, AlertCircle, Shield } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface StudentProfileSettingsProps {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  onUpdateSuccess: (newName: string, newEmail: string, newPhone: string) => void;
  isAdminPreview?: boolean;
}

export function StudentProfileSettings({
  studentId,
  studentName,
  studentEmail,
  studentPhone,
  onUpdateSuccess,
  isAdminPreview = false,
}: StudentProfileSettingsProps) {
  const [name, setName] = useState(studentName);
  const [email, setEmail] = useState(studentEmail);
  const [phone, setPhone] = useState(studentPhone);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Keep fields synchronized if props change (e.g. from a background sync)
  useEffect(() => {
    setName(studentName);
    setEmail(studentEmail);
    setPhone(studentPhone);
  }, [studentName, studentEmail, studentPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Full Name cannot be empty.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isAdminPreview) {
        // In Admin preview / Sandbox, we only update local state and storage
        const localProfilesStr = localStorage.getItem("admin_profiles");
        if (localProfilesStr) {
          const profiles = JSON.parse(localProfilesStr);
          const updated = profiles.map((p: any) => {
            if (p.id === studentId || p.email.toLowerCase() === studentEmail.toLowerCase()) {
              return {
                ...p,
                full_name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim()
              };
            }
            return p;
          });
          localStorage.setItem("admin_profiles", JSON.stringify(updated));
        }

        // Save active session locally
        localStorage.setItem("student_logged_in_name", name.trim());
        localStorage.setItem("student_logged_in_email", email.trim().toLowerCase());
        localStorage.setItem("student_logged_in_phone", phone.trim());

        setTimeout(() => {
          onUpdateSuccess(name.trim(), email.trim().toLowerCase(), phone.trim());
          setSuccessMessage("Profile updated successfully (Sandbox Mode)!");
          setIsSubmitting(false);
        }, 800);
        return;
      }

      // 1. Update remote database (Supabase)
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim()
          })
          .eq("id", studentId);

        if (error) {
          throw new Error(error.message || "Failed to update Supabase profile.");
        }
      }

      // 2. Sync to local Fallback Database in localStorage
      const localProfilesStr = localStorage.getItem("admin_profiles");
      if (localProfilesStr) {
        const profiles = JSON.parse(localProfilesStr);
        const updated = profiles.map((p: any) => {
          if (p.id === studentId) {
            return {
              ...p,
              full_name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim()
            };
          }
          return p;
        });
        localStorage.setItem("admin_profiles", JSON.stringify(updated));
      }

      // 3. Update local session storage
      localStorage.setItem("student_logged_in_name", name.trim());
      localStorage.setItem("student_logged_in_email", email.trim().toLowerCase());
      localStorage.setItem("student_logged_in_phone", phone.trim());

      // 4. Update parent component's states
      onUpdateSuccess(name.trim(), email.trim().toLowerCase(), phone.trim());
      setSuccessMessage("Your profile setting credentials have been synced and updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setErrorMessage(err.message || "An error occurred while updating your profile settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm text-left"
    >
      {/* Settings Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0B1B3D] to-[#122A5E] text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#2D7FF9]/15 blur-2xl pointer-events-none rounded-full" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-mono uppercase tracking-widest font-black text-[#2D7FF9]">
            <Shield className="w-3 h-3 text-[#2D7FF9]" /> Account Protection
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight">
            Profile Settings
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Manage your personal profile details. All edits are verified and synced with secure servers.
          </p>
        </div>
      </div>

      {/* Settings Form Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
            <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Success!</p>
              <p className="font-normal text-emerald-700 mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">Error Updating</p>
              <p className="font-normal text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student ID info badge */}
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
            <span className="font-mono text-slate-400 font-bold uppercase tracking-wider text-[9.5px]">Your Student ID</span>
            <span className="font-mono font-black text-slate-700 bg-slate-200/60 px-2.5 py-0.5 rounded-full">{studentId}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">
              Full Name (Used for your course certification)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sandra Cole"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#2D7FF9] focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">
              Email Address (Login Username)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sandra@academy.com"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#2D7FF9] focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-normal leading-normal mt-1 pl-1">
              Note: Changing your email will update your login credentials. Use the new email to log in next time.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 801 234 5678"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#2D7FF9] focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
