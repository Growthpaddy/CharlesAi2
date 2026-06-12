/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Menu, X, ArrowRight, Zap, ChevronDown, 
  Cpu, Layers, MessageSquare, Video, Terminal, Bot, 
  Send, Briefcase, Award, GraduationCap, Users, Calendar, 
  BookOpen, Compass, Shield, UserCheck, HelpCircle, FileText
} from "lucide-react";
import { useNavigation, ViewType } from "../context/NavigationContext";

export interface ProgramItem {
  name: string;
  desc: string;
  courses: number;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  const { navigateTo } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const idToView: Record<string, ViewType> = {
      "featured-programs": "programs",
      "learning-paths": "paths",
      "testimonials": "success",
      "faqs": "resources",
      "instructors": "about",
      "pricing": "pricing"
    };

    const targetView = idToView[id];
    if (targetView) {
      navigateTo(targetView);
    } else {
      navigateTo("home");
    }
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const programs: ProgramItem[] = [
    { name: "AI Fundamentals", desc: "Core neural logic & LLM mechanics.", courses: 3, icon: Sparkles },
    { name: "AI Business Automation", desc: "Streamline workflows & save resources.", courses: 5, icon: Layers },
    { name: "Prompt Engineering", desc: "Rigorous system prompting structures.", courses: 4, icon: Cpu },
    { name: "AI for Marketing", desc: "Deploy semantic generation.", courses: 3, icon: Send },
    { name: "AI Content Creation", desc: "Orchestrate high-fidelity media.", courses: 4, icon: Video },
    { name: "AI Coding", desc: "Build applications with Copilot.", courses: 4, icon: Terminal },
    { name: "AI Agents", desc: "Construct multi-agent teams.", courses: 3, icon: Bot },
    { name: "AI Automation", desc: "Zero-code background routines.", courses: 5, icon: Zap },
    { name: "AI Leadership", desc: "Direct digital change policies.", courses: 3, icon: Briefcase }
  ];

  const learningLinks = [
    { name: "Learning Paths", desc: "Tailored skill-level pathways.", icon: Compass },
    { name: "Certifications", desc: "Recognized professional credentials.", icon: Award },
    { name: "Mentorship", desc: "Active guidance from AI architects.", icon: UserCheck },
    { name: "Workshops", desc: "Direct sandbox-building exercises.", icon: Cpu },
    { name: "Community", desc: "Share workflows and find partners.", icon: Users }
  ];

  const successLinks = [
    { name: "Student Stories", desc: "Read verified graduate outcomes.", icon: GraduationCap },
    { name: "Business Case Studies", desc: "Corporate pipeline transformations.", icon: Briefcase },
    { name: "Testimonials", desc: "Hear from founders and professionals.", icon: MessageSquare },
    { name: "Outcomes", desc: "Key enrollment growth analysis.", icon: Zap }
  ];

  const resourceLinks = [
    { name: "Blog", desc: "Deep dives on model iterations.", icon: FileText },
    { name: "Events", desc: "Register for live code sessions.", icon: Calendar },
    { name: "Free Courses", desc: "Bootstrapping starter toolkits.", icon: Compass },
    { name: "Tools", desc: "Tested custom GPT prompt cards.", icon: Zap },
    { name: "Guides", desc: "Step-by-step pipeline builders.", icon: HelpCircle }
  ];

  const aboutLinks = [
    { name: "About Us", desc: "Our history and vision.", icon: Shield },
    { name: "Instructors", desc: "Meet our technical architects.", icon: Users },
    { name: "Mission", desc: "Frictionless global AI accessibility.", icon: Compass },
    { name: "Contact", desc: "Get targeted support answers.", icon: MessageSquare }
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200/80 bg-white/95 shadow-xs backdrop-blur-md py-1.5"
          : "border-b border-transparent bg-white py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group z-50"
            onClick={() => { navigateTo("home"); setMobileMenuOpen(false); setActiveDropdown(null); }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#08142B] flex items-center justify-center text-white relative overflow-hidden transition-transform group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#08142B] to-[#2D7FF9] opacity-80" />
              <Sparkles className="w-5 h-5 relative z-10 text-[#FCF50F]" />
            </div>
            <div>
              <span className="font-display font-medium text-lg tracking-tight text-[#08142B] flex items-center gap-1">
                AI<span>Academy</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-[#2D7FF9] uppercase font-semibold">
                PREMIUM INSTITUTE
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* PROGRAMS dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("programs")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${activeDropdown === "programs" ? "text-[#2D7FF9] bg-[#2D7FF9]/5" : "text-[#08142B]/85 hover:text-[#08142B]"}`}>
                <span>Programs</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${activeDropdown === "programs" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "programs" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-[40%] mt-2 w-[720px] bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 grid grid-cols-3 gap-4"
                  >
                    <div className="col-span-3 pb-3 border-b border-gray-50 flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-gray-400 tracking-wider uppercase">FEATURED CURRICULUMS</span>
                      <span className="text-xs font-semibold text-[#2D7FF9] flex items-center gap-1 cursor-pointer" onClick={() => scrollToSection("featured-programs")}>
                        View All Programs <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    {programs.map((prog, idx) => {
                      const Icon = prog.icon;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => scrollToSection("featured-programs")}
                          className="p-3 rounded-xl hover:bg-[#2D7FF9]/5 border border-transparent hover:border-[#2D7FF9]/15 transition-all cursor-pointer group/item"
                        >
                          <div className="flex items-center gap-2.5 mb-1 text-[#08142B] group-hover/item:text-[#2D7FF9]">
                            <div className="p-1.5 rounded-lg bg-gray-50 text-gray-500 group-hover/item:bg-[#2D7FF9]/10 group-hover/item:text-[#2D7FF9] transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[13px] font-bold tracking-tight">{prog.name}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-1 mb-1.5">{prog.desc}</p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 font-semibold">
                            <span>{prog.courses} Courses</span>
                            <span className="text-[#2D7FF9] opacity-0 group-hover/item:opacity-100 transition-opacity">Learn</span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* LEARNING PATHS dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("paths")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${activeDropdown === "paths" ? "text-[#2D7FF9] bg-[#2D7FF9]/5" : "text-[#08142B]/85 hover:text-[#08142B]"}`}>
                <span>Learning Paths</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${activeDropdown === "paths" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "paths" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl border border-gray-100 shadow-2xl p-5 space-y-3"
                  >
                    {learningLinks.map((link, idx) => {
                      const Icon = link.icon;
                      return (
                        <div 
                          key={idx}
                          onClick={() => scrollToSection("learning-paths")}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group/link"
                        >
                          <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover/link:bg-[#2D7FF9]/10 group-hover/link:text-[#2D7FF9] transition-colors mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[13px] font-bold text-[#08142B] group-hover/link:text-[#2D7FF9] transition-colors">{link.name}</span>
                            <p className="text-[11px] text-gray-500 max-w-[220px]">{link.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SUCCESS STORIES dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("success")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${activeDropdown === "success" ? "text-[#2D7FF9] bg-[#2D7FF9]/5" : "text-[#08142B]/85 hover:text-[#08142B]"}`}>
                <span>Success Stories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${activeDropdown === "success" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl border border-gray-100 shadow-2xl p-5 space-y-3"
                  >
                    {successLinks.map((link, idx) => {
                      const Icon = link.icon;
                      return (
                        <div 
                          key={idx}
                          onClick={() => scrollToSection("testimonials")}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group/link"
                        >
                          <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover/link:bg-[#2D7FF9]/10 group-hover/link:text-[#2D7FF9] transition-colors mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[13px] font-bold text-[#08142B] group-hover/link:text-[#2D7FF9] transition-colors">{link.name}</span>
                            <p className="text-[11px] text-gray-500 max-w-[220px]">{link.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RESOURCES dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${activeDropdown === "resources" ? "text-[#2D7FF9] bg-[#2D7FF9]/5" : "text-[#08142B]/85 hover:text-[#08142B]"}`}>
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${activeDropdown === "resources" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl border border-gray-100 shadow-2xl p-5 space-y-3"
                  >
                    {resourceLinks.map((link, idx) => {
                      const Icon = link.icon;
                      return (
                        <div 
                          key={idx}
                          onClick={() => scrollToSection("faqs")}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group/link"
                        >
                          <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover/link:bg-[#2D7FF9]/10 group-hover/link:text-[#2D7FF9] transition-colors mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[13px] font-bold text-[#08142B] group-hover/link:text-[#2D7FF9] transition-colors">{link.name}</span>
                            <p className="text-[11px] text-gray-500 max-w-[220px]">{link.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ABOUT dropdown with CTA */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("about")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${activeDropdown === "about" ? "text-[#2D7FF9] bg-[#2D7FF9]/5" : "text-[#08142B]/85 hover:text-[#08142B]"}`}>
                <span>About</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${activeDropdown === "about" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "about" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-[440px] bg-white rounded-2xl border border-gray-100 shadow-2xl p-5 grid grid-cols-2 gap-4"
                  >
                    <div className="col-span-2 pb-2 border-b border-gray-50">
                      <span className="text-[10px] font-bold font-mono text-gray-400 tracking-wider">AI RESEARCH EDUCATION</span>
                    </div>
                    <div className="space-y-2.5">
                      {aboutLinks.map((link, idx) => {
                        const Icon = link.icon;
                        return (
                          <div 
                            key={idx}
                            onClick={() => scrollToSection("instructors")}
                            className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group/link"
                          >
                            <div className="p-1 px-1.5 rounded bg-gray-50 text-gray-500 group-hover/link:bg-[#2D7FF9]/10 group-hover/link:text-[#2D7FF9] mt-0.5">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#08142B] group-hover/link:text-[#2D7FF9]">{link.name}</span>
                              <p className="text-[10px] text-gray-400 font-medium leading-tight max-w-[140px] line-clamp-2">{link.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Integrated custom CTA inside About menu as specified */}
                    <div className="bg-[#08142B] rounded-xl p-4 text-white flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1 bg-[#2D7FF9]/25 text-blue-200 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wide mb-1.5">
                          <Zap className="w-3 h-3 text-[#FCF50F]" />
                          <span>MEMBER EXCLUSIVE</span>
                        </div>
                        <h4 className="text-xs font-bold font-display leading-tight mb-2">Build bespoke integrations in our exclusive lab.</h4>
                      </div>
                      <button 
                        onClick={() => scrollToSection("pricing")}
                        className="w-full py-1.5 bg-[#2D7FF9] hover:bg-[#2D7FF9]/90 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all mt-auto"
                      >
                        <span>Apply Lab</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Side Buttons - Primary & Secondary */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-semibold text-[#08142B] hover:text-[#2D7FF9] px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
            >
              Book a Demo
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="bg-[#2D7FF9] hover:bg-[#2D7FF9]/95 text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 px-5 py-2.5 rounded-xl font-bold text-sm tracking-tight transition-all flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="lg:hidden flex items-center z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#08142B] hover:text-[#2D7FF9] transition-colors focus:outline-none min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Swipe-out / Slide-in Drawer Panels */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#08142B] lg:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[340px] bg-white z-50 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between lg:hidden"
            >
              <div className="space-y-6 pt-16">
                <div className="border-b border-gray-150 pb-3">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 uppercase">ACADEMY NAVIGATION</span>
                </div>

                <div className="space-y-1.5">
                  {/* Category 1: Programs (Slide trigger) */}
                  <div>
                    <button 
                      onClick={() => setMobileSubMenu(mobileSubMenu === "programs" ? null : "programs")}
                      className="w-full flex items-center justify-between py-3 text-base font-bold text-[#08142B] border-b border-gray-50 min-h-[48px]"
                    >
                      <span>Programs</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSubMenu === "programs" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
                    </button>
                    
                    {mobileSubMenu === "programs" && (
                      <div className="pl-3 py-2 space-y-2.5 bg-gray-50/50 rounded-xl mt-1.5 animate-in fade-in duration-200">
                        {programs.map((p, i) => (
                          <div 
                            key={i} 
                            onClick={() => scrollToSection("featured-programs")}
                            className="py-1.5 text-sm text-[#08142B]/85 hover:text-[#2D7FF9] cursor-pointer font-medium flex items-center gap-2 min-h-[48px]"
                          >
                            <Sparkles className="w-4 h-4 text-[#2D7FF9] shrink-0" />
                            <span>{p.name} <span className="text-[10px] text-gray-400">({p.courses} courses)</span></span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category 2: Learning Paths */}
                  <div>
                    <button 
                      onClick={() => setMobileSubMenu(mobileSubMenu === "paths" ? null : "paths")}
                      className="w-full flex items-center justify-between py-3 text-base font-bold text-[#08142B] border-b border-gray-50 min-h-[48px]"
                    >
                      <span>Learning Paths</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSubMenu === "paths" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
                    </button>
                    
                    {mobileSubMenu === "paths" && (
                      <div className="pl-3 py-2 space-y-2 bg-gray-50/50 rounded-xl mt-1.5">
                        {learningLinks.map((p, i) => (
                          <div 
                            key={i} 
                            onClick={() => scrollToSection("learning-paths")}
                            className="py-2 text-sm text-[#08142B]/85 hover:text-[#2D7FF9] cursor-pointer font-medium min-h-[48px] flex items-center"
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category 3: Success Stories */}
                  <div>
                    <button 
                      onClick={() => setMobileSubMenu(mobileSubMenu === "success" ? null : "success")}
                      className="w-full flex items-center justify-between py-3 text-base font-bold text-[#08142B] border-b border-gray-50 min-h-[48px]"
                    >
                      <span>Success Stories</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSubMenu === "success" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
                    </button>
                    
                    {mobileSubMenu === "success" && (
                      <div className="pl-3 py-2 space-y-2 bg-gray-50/50 rounded-xl mt-1.5">
                        {successLinks.map((p, i) => (
                          <div 
                            key={i} 
                            onClick={() => scrollToSection("testimonials")}
                            className="py-2 text-sm text-[#08142B]/85 hover:text-[#2D7FF9] cursor-pointer font-medium min-h-[48px] flex items-center"
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category 4: Resources */}
                  <div>
                    <button 
                      onClick={() => setMobileSubMenu(mobileSubMenu === "resources" ? null : "resources")}
                      className="w-full flex items-center justify-between py-3 text-base font-bold text-[#08142B] border-b border-gray-50 min-h-[48px]"
                    >
                      <span>Resources</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSubMenu === "resources" ? "rotate-180 text-[#2D7FF9]" : "text-gray-400"}`} />
                    </button>
                    
                    {mobileSubMenu === "resources" && (
                      <div className="pl-3 py-2 space-y-2 bg-gray-50/50 rounded-xl mt-1.5">
                        {resourceLinks.map((p, i) => (
                          <div 
                            key={i} 
                            onClick={() => scrollToSection("faqs")}
                            className="py-2 text-sm text-[#08142B]/85 hover:text-[#2D7FF9] cursor-pointer font-medium min-h-[48px] flex items-center"
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom CTA Group in Mobile view */}
              <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="w-full py-3.5 text-center text-sm font-bold text-[#08142B] bg-gray-50 border border-gray-150 rounded-xl min-h-[48px]"
                >
                  Book a Demo
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="w-full py-3.5 bg-[#2D7FF9] text-white text-center text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 min-h-[48px] shadow-lg shadow-blue-500/10"
                >
                  <Zap className="w-4 h-4 text-[#FCF50F]" />
                  <span>Start Learning</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
