/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, Users, Mail, Phone, MapPin, Send, 
  Sparkles, Award, ArrowRight, CheckCircle, Clock, Calendar
} from "lucide-react";
import { instructorInfo } from "../data";

export default function AboutPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    org: "",
    role: "Founder / Business Owner",
    budget: "$1k - $5k / mo",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="bg-[#FAFBFC] min-h-screen pt-24 pb-16">
      
      {/* Editorial Corporate Header */}
      <section className="relative py-20 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[#2D7FF9]/5 blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>AI ACADEMY FOUNDATION</span>
          </div>
          {/* Heading under 10 words */}
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#08142B] leading-tight">
            Accelerating Human Capacity Through Applied AI
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We bridge the gap between heavy academic machine learning and actionable commercial automations. Founded by technical system architects, we provide the ultimate workspace sandbox to prototype, deploy, and scale intelligent business routines.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Editorial Bio / Team section */}
        <div className="lg:col-span-7 space-y-12">
          
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase block">
              OUR MISSION & VALUES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#08142B] tracking-tight">
              A Commitment to High-Fidelity Practical Competence
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We reject high-level tech-buzzwords and low-value generic content. Our training frameworks and code catalogs are continually audited and tested to run seamlessly on standard production platforms. Every course line, automation workflow, and system blueprint serves exactly one goal: giving our members elite practical autonomy.
            </p>
          </div>

          <hr className="border-gray-150" />

          {/* Instructor Bio Profile */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <img 
                src={instructorInfo.avatar} 
                alt={instructorInfo.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-200 shadow-sm"
              />
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold tracking-widest text-[#2D7FF9] uppercase">
                  FOUNDING DIRECTOR && INSTRUCTOR
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#08142B]">
                  {instructorInfo.name}
                </h3>
                <p className="text-xs text-gray-400 font-semibold uppercase">{instructorInfo.role}</p>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {instructorInfo.badges.slice(0, 3).map((bd, idx) => (
                    <span key={idx} className="bg-gray-100 text-[#08142B] text-[9px] font-bold px-2 py-0.5 rounded-md font-mono">
                      {bd}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {instructorInfo.bio}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
              {instructorInfo.stats.map((st, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-lg font-bold text-[#08142B] font-display">{st.value}</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase leading-none">{st.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-4">
              <h4 className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                ACADEMIC EXPERT ACHIEVEMENTS:
              </h4>
              <ul className="space-y-1.5 text-xs">
                {instructorInfo.achievements.map((ac, i) => (
                  <li key={i} className="flex gap-2 items-start text-slate-600">
                    <Award className="w-4 h-4 text-[#2D7FF9] shrink-0 mt-0.5" />
                    <span>{ac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Side: Consultation scheduler booking system / Contact card */}
        <div className="lg:col-span-5 bg-white border border-gray-150 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 text-left relative">
          
          <div className="space-y-2">
            <span className="text-[10.5px] font-mono font-bold text-emerald-600 tracking-wider bg-emerald-50 px-2 py-0.5 rounded uppercase inline-block">
              LAB BOOKING ACTIVE
            </span>
            <h3 className="font-display font-extrabold text-xl text-[#08142B]">
              Book AI Systems Review
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Facing operational scaling hurdles? Pitch your active workflows, spreadsheets, or client pipeline blueprints directly to Dr. Cole.
            </p>
          </div>

          <hr className="border-gray-50" />

          {submitted ? (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#08142B]">Systems Audit Requested!</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Thank you, <strong className="text-gray-900">{formState.name}</strong>. Your organization <strong className="text-gray-900">({formState.org || "Independent"})</strong> has been added to our executive priority queue. Dr. Cole's team will contact you at <span className="text-blue-600 font-semibold">{formState.email}</span> within 24 hours.
                </p>
              </div>

              <div className="bg-white border border-emerald-100 rounded-lg p-3 text-left space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase font-mono font-bold text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PRE-APPOINTMENT TICKET DETAILS</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>Goal Scope:</strong> {formState.role}</p>
                  <p><strong>Target Budget:</strong> {formState.budget}</p>
                  {formState.message && (
                    <p className="line-clamp-2 text-[11px] text-gray-400 italic">"{formState.message}"</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="w-full bg-[#08142B] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs transition-all cursor-pointer min-h-[40px]"
              >
                Book Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Name */}
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-700 block">YOUR FULL NAME *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sandra Peterson"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-[#FAFBFC] border border-gray-200 hover:border-gray-300 focus:border-[#2D7FF9] rounded-xl px-4 py-3 text-gray-800 transition-all outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-700 block">WORK EMAIL ADDRESS *</label>
                <input 
                  type="email" 
                  required
                  placeholder="sandra@yourcompany.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-[#FAFBFC] border border-gray-200 hover:border-gray-300 focus:border-[#2D7FF9] rounded-xl px-4 py-3 text-gray-800 transition-all outline-none"
                />
              </div>

              {/* Company */}
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-700 block">ORGANIZATION NAME</label>
                <input 
                  type="text" 
                  placeholder="your company, LLC"
                  value={formState.org}
                  onChange={(e) => setFormState({ ...formState, org: e.target.value })}
                  className="w-full bg-[#FAFBFC] border border-gray-200 hover:border-gray-300 focus:border-[#2D7FF9] rounded-xl px-4 py-3 text-gray-800 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Role dropdown */}
                <div className="space-y-1.5 text-left">
                  <label className="font-bold text-gray-500 block uppercase text-[10px]">CURRENT ROLE</label>
                  <select
                    value={formState.role}
                    onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                    className="w-full bg-[#FAFBFC] border border-gray-250 rounded-xl px-2 py-2 text-gray-700 font-semibold"
                  >
                    <option>Founder / Business Owner</option>
                    <option>Operations Manager</option>
                    <option>AI Engineer Developer</option>
                    <option>Freelancer Consultant</option>
                  </select>
                </div>

                {/* Budget selection dropdown */}
                <div className="space-y-1.5 text-left">
                  <label className="font-bold text-gray-500 block uppercase text-[10px]">MONTHLY BUDG</label>
                  <select
                    value={formState.budget}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    className="w-full bg-[#FAFBFC] border border-gray-250 rounded-xl px-2 py-2 text-gray-700 font-semibold"
                  >
                    <option>$1k - $5k / mo</option>
                    <option>$5k - $15k / mo</option>
                    <option>$15k+ / mo</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-700 block text-[10px]">DESCRIBE YOUR BIGGEST BOTTLENECK</label>
                <textarea 
                  rows={3}
                  placeholder="Tell us about the active Make.com workflows, API integrations or tasks you need to automate."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-[#FAFBFC] border border-gray-200 hover:border-gray-300 focus:border-[#2D7FF9] rounded-xl px-4 py-3 text-gray-800 transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#08142B] hover:bg-[#2D7FF9] text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[48px]"
              >
                <span>{isSubmitting ? "Requesting Ticket..." : "Schedule Systems Audit"}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

            </form>
          )}

          {/* Quick trust notes */}
          <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Strict NDA Data Protocols Protected</span>
          </div>

        </div>

      </div>

    </div>
  );
}
