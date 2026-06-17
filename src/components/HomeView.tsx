/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, ArrowRight, ShieldCheck, Star, Users, BookOpen, Clock, 
  ChevronRight, Compass, Cpu, Zap, Award, Mail, Phone, MapPin, CheckCircle2,
  Tv, DollarSign, BarChart3, TrendingUp, HelpCircle, Layers, Group, Building, MessageSquare
} from "lucide-react";
import { useNavigation, courseIdToSlugMap } from "../context/NavigationContext";
import { masterCourses, masterModules } from "../lib/db";
import { testimonials } from "../data";

// Beautiful custom icons for student benefits
const benefitIcons = [
  Zap,          // Learn Practical AI Skills
  Cpu,          // Build AI Applications
  Layers,       // Create Digital Products
  Sparkles,     // Automate Businesses
  Tv,           // Grow YouTube Channels
  DollarSign,   // Acquire High-Paying Clients
  TrendingUp,   // Build Online Businesses
  Award         // Learn From Real Projects
];

export default function HomeView() {
  const { navigateTo, navigateToCourse } = useNavigation();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Filter 6 featured courses initially out of 12
  const featuredCourses6 = masterCourses.slice(0, 6);

  const priceMap: Record<string, string> = {
    "course-1": "₦15,000",
    "course-2": "Free",
    "course-3": "Free",
    "course-4": "Free",
    "course-5": "Free",
    "course-6": "Free",
  };

  const levelColorMap = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Intermediate: "bg-blue-50 text-[#0056D2] border-blue-100",
    Advanced: "bg-rose-50 text-rose-700 border-rose-100"
  };

  // Student Benefits array
  const benefitsList = [
    { title: "Prompt Engineering", desc: "Command top models flawlessly. Master variables, system inputs, & custom instructions." },
    { title: "Deploy AI Assistants", desc: "Build & launch functional chatbots, agents, & scraping workflows without code." },
    { title: "Sell Digital Products", desc: "Self-publisher blueprints. Write, format, & list high-margin assets on Selar & Selar KDP." },
    { title: "Automate Campaigns", desc: "Create self-running scraping pipelines, custom lead capture nodes, & 24/7 webhooks." }
  ];

  return (
    <div className="bg-[#FAFCFF] min-h-screen relative overflow-hidden font-sans antialiased text-[#0B132B]">
      
      {/* SECTION 1 — HERO SECTION */}
      <section id="hero-premium" className="relative pt-32 pb-20 sm:pb-28 lg:pt-36 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100">
        
        {/* Modern decorative nodes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0056d202_1px,transparent_1px),linear-gradient(to_bottom,#0056d203_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Copy */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#0056D2] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FLAGSHIP ACADEMY</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-6xl text-[#0B132B] tracking-tighter leading-[0.95] max-w-3xl">
                Master AI. <br />
                Build Digital Wealth.
              </h1>

              <div className="space-y-4">
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                  Enroll in our single, highly optimized curriculum. Master 12 real-world AI learning modules alongside 3,500+ professionals.
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#0056D2] font-extrabold">
                  <span>✓ One-Time Enrollment</span>
                  <span className="text-slate-300">•</span>
                  <span>✓ Complete 12 Modules</span>
                  <span className="text-slate-300">•</span>
                  <span>✓ Direct Cohort Labs</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => navigateTo("landing")}
                  className="group px-8 py-4 bg-[#0056D2] hover:bg-[#0047b3] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <span>Enroll in Course</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button
                  onClick={() => {
                    const el = document.getElementById("featured-academy-courses");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <span>Explore Modules</span>
                </button>
              </div>

              {/* Secure Trust Badges */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-md text-slate-400 font-bold text-[10px] sm:text-[11px] tracking-wider uppercase">
                <div className="flex items-center gap-1.5 justify-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Practical</span>
                </div>
                <div className="flex items-center gap-1.5 justify-start">
                  <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-1.5 justify-start">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>4.9 Star Rating</span>
                </div>
              </div>
            </div>

            {/* Right Column Visual Dashboard mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 text-left overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#0056D2]/20 blur-2xl rounded-full" />
                
                {/* Simulated AI LMS Interface mock */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-slate-500 ml-2">Console Live: OK</span>
                  </div>
                  <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider">
                    Agent Online
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Mock dashboard element 1 */}
                  <div className="bg-slate-805/50 border border-slate-800 rounded-2xl p-4 space-y-2.5 bg-slate-950/40">
                    <div className="flex justify-between text-xs text-slate-300 font-bold">
                      <span>Course 1: Prompt Builder</span>
                      <span className="text-[#0056D2]">85% Done</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#0056D2] h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  {/* Mock dashboard element 2 */}
                  <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Lead Scraper Inbound
                      </span>
                      <span className="text-slate-550 font-mono text-[10px]">Active</span>
                    </div>
                    
                    <div className="space-y-1.5 font-mono text-[10px] text-emerald-400">
                      <p>&gt; sys_audit_google_maps: crawling Lekki...</p>
                      <p>&gt; found: 24 active high-value company profiles</p>
                      <p>&gt; dispatching: custom AI prompt templates...</p>
                    </div>
                  </div>

                  {/* Stat badge */}
                  <div className="grid grid-cols-2 gap-3 text-white">
                    <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 text-center">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">MONTHLY EARNINGS</p>
                      <p className="text-lg font-bold text-emerald-400 mt-1">₦420,000</p>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 text-center">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">TOTAL STUDENTS</p>
                      <p className="text-lg font-bold text-white mt-1">3,500+</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — TRUST SECTION */}
      <section id="trust-metrics" className="py-12 bg-[#0B132B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left flex items-start gap-4 hover:border-blue-500/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black leading-none">3,500+</p>
                <p className="text-[11px] text-slate-350 mt-1.5 font-bold uppercase tracking-wider">Students Trained</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left flex items-start gap-4 hover:border-blue-500/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black leading-none">12</p>
                <p className="text-[11px] text-slate-350 mt-1.5 font-bold uppercase tracking-wider">Core Modules</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left flex items-start gap-4 hover:border-blue-500/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black leading-none">100%</p>
                <p className="text-[11px] text-slate-350 mt-1.5 font-bold uppercase tracking-wider">Practical Learning</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left flex items-start gap-4 hover:border-blue-500/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black leading-none">Enterprise</p>
                <p className="text-[11px] text-slate-350 mt-1.5 font-bold uppercase tracking-wider">Programs Active</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 — ABOUT US */}
      <section id="about-us-premium" className="py-24 bg-white relative overflow-hidden text-left border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            
            <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Our Founding Manifesto
            </span>
            
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-[#0B132B]">
              Why Learn With AI Online Business?
            </h2>

            <p className="text-[#0B132B] text-sm leading-relaxed font-semibold">
              AI Online Business is a leading AI training academy dedicated to equipping individuals and organizations with practical, in-demand AI skills.
            </p>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We have trained over 3,550 students and delivered specialized in-person and digital training programs to churches, businesses, schools, and organizations across Nigeria.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3 text-xs leading-relaxed text-slate-650">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B132B]">Applied Syllabi</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">No long history lessons. We write prompts and configuration sequences directly.</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed text-slate-650">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B132B]">Nigeria Context</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Learn using payment providers like Selar and marketing methods that actually work here.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 — PROGRAM MODULES */}
      <section id="featured-academy-courses" className="py-24 bg-gradient-to-b from-[#FAFCFF] to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-100 text-left">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>12 Core Learning Modules</span>
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-[#0B132B]">
                Program Modules Catalog
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Our curriculum is built meticulously to cover high-value AI executions across 12 hyper-refined focus domains. <strong className="text-slate-900 font-extrabold">You do not purchase these separately</strong> — a single enrollment grants full lifelong access to every module listed below.
              </p>
            </div>
            
            <button
              onClick={() => navigateTo("programs")}
              className="px-6 py-3 bg-[#0B132B] hover:bg-[#15234A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer self-start md:self-end min-h-[44px] flex items-center gap-1 shadow-sm"
            >
              <span>Browse All 12 Modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12 text-left">
            {featuredCourses6.map((course) => {
              // Dynamically resolve module count from masterModules database
              const moduleCount = masterModules.filter(m => m.courseId === course.id).length || 4;

              return (
                <div
                  key={course.id}
                  onClick={() => navigateToCourse(course.id)}
                  className="group bg-white border border-slate-150 hover:border-blue-400/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between cursor-pointer shadow-xs"
                >
                  {/* Aspect Cover Image */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-slate-50 border-b border-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Level badges on top-left */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="bg-[#0B132B] text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-0.5 rounded shadow">
                        {course.categoryId === "cat-1" ? "ENGINEERING" : "AI PRACTICAL"}
                      </span>
                      <span className={`text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded border shadow ${levelColorMap[course.level as keyof typeof levelColorMap]}`}>
                        {course.level}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-white/95 px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-1 font-mono text-[10px] font-black text-[#0B132B]">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-550" />
                      <span>{course.rating || "4.9"}</span>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                          {course.duration}
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[9px] font-mono font-black tracking-wider">
                          INCLUDED IN FULL COURSE
                        </span>
                      </div>

                      <h3 className="font-display font-black text-base text-[#0B132B] tracking-tight group-hover:text-[#0056D2] transition-colors leading-tight">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Specifications */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold font-sans">
                      <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded text-[10px]">
                        {moduleCount} Detailed Lessons
                      </span>
                      <span className="text-[#0056D2] flex items-center gap-1 font-black shrink-0 text-[11px] group-hover:underline">
                        <span>View Module Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Catalog Redirect CTA at bottom of courses section */}
          <div className="pt-16 flex flex-col items-center gap-3">
            <button
              onClick={() => navigateTo("programs")}
              className="group px-8 py-4 bg-[#0B132B] hover:bg-[#15234A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer max-w-sm"
            >
              <span>Explore All 12 Learning Modules</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Prompting • Digital Products • Content • App Building • automation • ghostwriting
            </span>
          </div>

        </div>
      </section>

      {/* SECTION 5 — OUR SERVICES */}
      <section id="our-academy-services" className="py-24 bg-[#0B132B] text-white relative">
        <div className="absolute inset-0 bg-[#0056D2]/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-300 px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-widest border border-blue-500/20">
              EXPLORE ADMISSIONS
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Academy Specialization Programs
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Choose the learning structure that matches your career acceleration path: from self-paced cohorts to direct one-on-one professional mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* Service 1: One-on-One Coaching */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 relative overflow-hidden group hover:border-[#0056D2]/40 transition-all shadow-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0056D2]/10 blur-xl rounded-full" />
              <div className="space-y-5">
                <span className="inline-block bg-[#0056D2]/20 text-[#2D7FF9] border border-blue-500/30 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase">
                  RECOMMENDED PREMIUM
                </span>
                
                <div>
                  <h3 className="font-display font-black text-xl text-white">One-on-One Coaching</h3>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-2xl sm:text-3xl font-display font-black text-[#2D7FF9]">₦400,000</span>
                    <span className="text-xs text-slate-400">/ 6 Weeks Program</span>
                  </div>
                </div>

                <p className="text-xs text-slate-405 leading-relaxed font-semibold">
                  Work directly with certified advisors in Lagos to audit your business processes, script custom scrapers, and deploy active marketing modules.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Weekly Personal Audits & Sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Personalized Custom Roadmap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Capstone Project Graduation Badge</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigateTo("contact")}
                className="w-full bg-[#0056D2] hover:bg-[#0047b3] text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px]"
              >
                Enroll in Coaching
              </button>
            </div>

            {/* Service 2: Group Training */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 group hover:border-[#0056D2]/30 transition-all shadow-md">
              <div className="space-y-5">
                <span className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase">
                  Group Mastermind
                </span>

                <div>
                  <h3 className="font-display font-black text-xl text-white">Group Training</h3>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-xl font-bold text-slate-200">1 Month Intensive</span>
                  </div>
                </div>

                <p className="text-xs text-slate-405 leading-relaxed font-semibold">
                  Train with highly motivated peers, complete assignments weekly, and graduate with formal verification badges recognized nationwide.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Structured Group Coaching Sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Practical Lab Assignments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Community Discussion Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigateTo("landing")}
                className="w-full bg-slate-800 hover:bg-slate-750 text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px]"
              >
                Join Cohort
              </button>
            </div>

            {/* Service 3: Corporate Training */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 group hover:border-[#0056D2]/30 transition-all shadow-md">
              <div className="space-y-5">
                <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase">
                  Enterprise Vetted
                </span>

                <div>
                  <h3 className="font-display font-black text-xl text-white">Corporate Training</h3>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-xl font-bold text-slate-202">Custom Program</span>
                  </div>
                </div>

                <p className="text-xs text-slate-405 leading-relaxed font-semibold">
                  Accelerate operational velocity inside your company, church, or organization with custom-curated on-site workshops and practical labs.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Churches & Communities Special Offers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Custom Tailored Implementation Audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Team Certification Worksheets Included</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigateTo("contact")}
                className="w-full bg-slate-800 hover:bg-slate-750 text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px]"
              >
                Inquire Workshops
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5 — WHAT YOU WILL ACHIEVE */}
      <section id="student-benefits" className="py-24 bg-white text-left border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-blue-100/50">
              OUTCOMES
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#0B132B] tracking-tight leading-none">
              What You Will Achieve
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Learn practical, end-to-end modular frameworks designed for direct application:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitsList.map((benefit, index) => {
              const Icon = benefitIcons[index] || Zap;
              return (
                <div key={index} className="bg-slate-50 border border-slate-150 rounded-2xl p-6 hover:bg-white hover:border-blue-500/20 hover:shadow-lg transition-all text-left space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-[#0B132B]">{benefit.title}</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-2 font-medium">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 7 — TESTIMONIALS */}
      <section id="student-testimonials" className="py-24 bg-slate-50/50 text-left border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-800 px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-widest border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> ALUMNI MILESTONES
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B132B]">
              What Our Graduates Say
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
              Browse successful practical results compiled by graduates deploying AI frameworks across commerce and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={t.id} className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex gap-1">
                     {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-none">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">{t.role}</p>
                    <p className="text-[9px] text-[#0056D2] font-mono mt-0.5">{t.growthMetric}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 7 — FINAL ENROLLMENT CTA */}
      <section id="homepage-cta-premium" className="py-24 bg-[#0B132B] text-white relative text-center">
        <div className="absolute inset-0 bg-[#0056D2]/15 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black tracking-widest uppercase bg-[#0056D2]/20 text-blue-300 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" /> INSTANT LIFETIME ACCESS
          </span>
          
          <h2 className="font-sans text-3xl sm:text-5xl font-black leading-none tracking-tighter">
            Build Your Digital Business today.
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Gain immediate access to all 12 premium modules, frameworks, live labs, and direct messaging channels.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              onClick={() => navigateTo("landing")}
              className="px-8 py-3.5 bg-[#0056D2] hover:bg-[#0047b3] text-white font-bold rounded-xl transition-all text-xs cursor-pointer min-h-[48px]"
            >
              Enroll in Course
            </button>
            <button 
              onClick={() => navigateTo("programs")}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 font-bold rounded-xl transition-all text-xs cursor-pointer min-h-[48px]"
            >
              Explore Modules
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
