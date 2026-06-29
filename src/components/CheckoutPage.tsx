/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Lock, CreditCard, Landmark, CheckCircle, ShieldCheck, UserPlus, FileText, ChevronLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function CheckoutPage({ courseId, onNavigate }: { courseId: string; onNavigate: (page: string, params?: any) => void }) {
  const [course, setCourse] = useState<any>(null);
  const [isStudentRegistered, setIsStudentRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Accurate payload schema fields as represented inside your database structure
  const [studentForm, setStudentForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    status: "Active",
    metadata: { generated_via: "public_checkout_pipeline" }
  });

  useEffect(() => {
    async function getCheckoutTarget() {
      setIsLoading(true);
      setError(null);
      try {
        let targetId = courseId;
        
        // Fallback: If no courseId is provided, fetch the first available course
        if (!targetId) {
          const { data: allCourses, error: listErr } = await supabase
            .from("courses")
            .select("id")
            .limit(1);
          
          if (listErr) throw listErr;
          
          if (allCourses && allCourses.length > 0) {
            targetId = allCourses[0].id;
          }
        }

        if (!targetId) {
          throw new Error("No active academic course tracks could be found in the database.");
        }

        const { data, error: fetchErr } = await supabase
          .from("courses")
          .select("id, title, tagline, overview, instructor_name, instructor_bio, price_naira, thumbnail_url, duration_text, difficulty")
          .eq("id", targetId)
          .single();

        if (fetchErr) throw fetchErr;
        if (!data) throw new Error("The requested course track detail could not be resolved.");

        setCourse(data);
      } catch (err: any) {
        console.error("Checkout course loader error:", err);
        setError(err.message || "Failed to initialize active checkout invoice.");
      } finally {
        setIsLoading(false);
      }
    }
    getCheckoutTarget();
  }, [courseId]);

  const handleStudentRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setIsSubmitting(true);
    try {
      // Direct integration transaction mapping down to table matrix rows
      const { error } = await supabase.from("students").insert([
        {
          full_name: studentForm.full_name,
          email: studentForm.email.trim().toLowerCase(),
          phone: studentForm.phone,
          status: studentForm.status,
          enrolled_courses: [course.id],
          metadata: studentForm.metadata
        }
      ]);

      if (error) throw error;
      
      setIsStudentRegistered(true);
      alert("Student account verified! You can now select your preferred gateway below.");
    } catch (err: any) {
      alert(`Registration node tracking block: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-24 px-6 pt-28">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#0056D2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Assembling Secure Invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-24 px-6 pt-28">
        <div className="max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
            <Lock className="w-5 h-5 stroke-2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Checkout Target Blocked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {error || "We could not resolve any academic course target for the checkout pipeline."}
            </p>
          </div>
          <button 
            onClick={() => onNavigate("programs")}
            className="w-full py-3 bg-[#0056D2] hover:bg-[#003E9C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            Explore Course Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800 py-12 px-6 pt-28">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <button 
          onClick={() => onNavigate("course_details", { courseId: course.id })}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0056D2] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Cancel Order
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Account Creation Block */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className={`p-1.5 rounded-lg text-white ${isStudentRegistered ? "bg-emerald-600" : "bg-slate-900"}`}>
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Step 1: Student Ledger Verification</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Initialize your profile database keys to host course credentials.</p>
                </div>
              </div>

              {isStudentRegistered ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl space-y-1 text-xs">
                  <p className="font-extrabold flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> Ledger Account Set Up Successfully</p>
                  <p className="text-[11px] text-emerald-600/90">Your profile tracking reference has been mapped. Payment selections are unlocked.</p>
                </div>
              ) : (
                <form onSubmit={handleStudentRegistrationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Student Full Name</label>
                    <input type="text" required value={studentForm.full_name} onChange={e => setStudentForm({...studentForm, full_name: e.target.value})} placeholder="Firstname Lastname" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-slate-400" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Active Communication Email Address</label>
                    <input type="email" required value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} placeholder="name@domain.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-slate-400" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">WhatsApp / Phone Link Number</label>
                    <input type="tel" required value={studentForm.phone} onChange={e => setStudentForm({...studentForm, phone: e.target.value})} placeholder="+234..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-slate-400" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? "Syncing Account Node..." : "Validate Profile Credentials"}
                  </button>
                </form>
              )}
            </div>

            {/* Payment gateways selection logic mapping block */}
            <div className={`bg-white border rounded-3xl p-6 transition-all space-y-4 ${isStudentRegistered ? "border-slate-200 opacity-100" : "border-slate-200/50 opacity-40 select-none pointer-events-none"}`}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Step 2: Payment Dispatch System</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select settlement pipeline below to finish content onboarding.</p>
                </div>
              </div>

              {!isStudentRegistered && (
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Finish student profile creation to unlock payment options.</span>
                </div>
              )}

              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={!isStudentRegistered}
                  onClick={() => setSelectedMethod("paystack")}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedMethod === "paystack" ? "border-slate-900 bg-slate-50/50" : "border-slate-200 hover:bg-slate-50/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Pay Online via Paystack Gateway</p>
                      <p className="text-[10px] text-slate-400">Cards, USSD, Bank Apps instance validation.</p>
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedMethod === "paystack" ? "border-slate-900 bg-slate-900" : "border-slate-300"}`}>
                    {selectedMethod === "paystack" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!isStudentRegistered}
                  onClick={() => setSelectedMethod("transfer")}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedMethod === "transfer" ? "border-slate-900 bg-slate-50/50" : "border-slate-200 hover:bg-slate-50/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Landmark className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Direct Manual Bank Wire Transfer</p>
                      <p className="text-[10px] text-slate-400">Upload transaction payment slips manually.</p>
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedMethod === "transfer" ? "border-slate-900 bg-slate-900" : "border-slate-300"}`}>
                    {selectedMethod === "transfer" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              </div>

              {selectedMethod && (
                <button
                  onClick={() => alert(`Redirecting checkout parameters down to ${selectedMethod} instance...`)}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Complete Order Settlement
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Order Ledger Details Summary Card */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Order Invoice</h4>
            
            <div className="pb-3 border-b border-slate-100">
              <h5 className="text-xs font-black text-slate-900 line-clamp-2 uppercase">{course.title}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Tutor: {course.instructor_name}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-medium text-slate-500"><span>Subtotal</span><span>₦{Number(course.price_naira).toLocaleString()}</span></div>
              <div className="flex justify-between font-medium text-slate-500"><span>Processing Fees</span><span>₦0.00</span></div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-slate-900"><span>Grand Total NGN</span><span>₦{Number(course.price_naira).toLocaleString()}</span></div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 font-medium flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Encrypted SSL payment pipeline wrapper active.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}