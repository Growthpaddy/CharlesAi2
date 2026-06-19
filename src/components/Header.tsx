/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Menu, X, ArrowRight, Zap, ChevronDown, ChevronRight, Search,
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
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const [megaActiveTab, setMegaActiveTab] = useState<"catalogue" | "timelines" | "resources">("catalogue");
  const [activeTopTab, setActiveTopTab] = useState<"individuals" | "businesses" | "universities" | "governments">("individuals");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const { navigateTo, setLoginOpen, currentView, isLoginOpen } = useNavigation();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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
      "pricing": "landing"
    };

    const targetView = idToView[id];
    if (targetView) {
      navigateTo(targetView);
    } else {
      navigateTo("home");
    }
    setMobileMenuOpen(false);
    setActiveDropdown(false);
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
    { name: "Learning Paths", desc: "Tailored skill-level pathways.", icon: Compass, view: "paths" as ViewType },
    { name: "Certifications", desc: "Recognized professional credentials.", icon: Award, view: "paths" as ViewType },
    { name: "Mentorship", desc: "Active guidance from AI architects.", icon: UserCheck, view: "about" as ViewType },
    { name: "Workshops", desc: "Direct sandbox-building exercises.", icon: Cpu, view: "success" as ViewType },
    { name: "Community Forum", desc: "Share workflows and find partners.", icon: Users, view: "resources" as ViewType }
  ];

  const resourceLinks = [
    { name: "AI Blog", desc: "Deep dives on model iterations.", icon: FileText, view: "resources" as ViewType },
    { name: "Code Events", desc: "Register for live building sessions.", icon: Calendar, view: "resources" as ViewType },
    { name: "Free Tutorials", desc: "Bootstrapping starter toolkits.", icon: Compass, view: "resources" as ViewType },
    { name: "Prompt Tools", desc: "Tested custom GPT prompt cards.", icon: Zap, view: "success" as ViewType },
    { name: "Deployment Guides", desc: "Step-by-step pipeline builders.", icon: HelpCircle, view: "resources" as ViewType }
  ];

  // Dynamic searchable courses index matching user query
  const searchableCourses = [
    { name: "AI Fundamentals Certificate", desc: "Neural logic, model alignment & LLMs", view: "programs" as ViewType, anchor: "featured-programs" },
    { name: "AI Business Automation Suite", desc: "Zapier, Make.com, & custom API routines", view: "programs" as ViewType, anchor: "featured-programs" },
    { name: "Prompt Engineering Specialist", desc: "System tags, chain of thought, & grounding", view: "programs" as ViewType, anchor: "featured-programs" },
    { name: "AI Coding & App Design", desc: "Co-pilot tools, custom code assistants", view: "programs" as ViewType, anchor: "featured-programs" },
    { name: "Autonomous AI Agents Developer", desc: "Multi-agent frameworks & swarm paradigms", view: "programs" as ViewType, anchor: "featured-programs" },
    { name: "Digital Marketing AI workflows", desc: "Vector indexing, automated copy", view: "programs" as ViewType, anchor: "featured-programs" },
    { name: "Custom Curriculum Timelines", desc: "Syllabi structured by weeks", view: "paths" as ViewType, anchor: "learning-paths" },
    { name: "Professional Accreditation", desc: "Verifiable student credentials", view: "paths" as ViewType, anchor: "learning-paths" },
    { name: "Interactive Sandbox Terminal", desc: "Live simulated lab environments", view: "success" as ViewType, anchor: "testimonials" },
    { name: "Weekly Mentoring Programs", desc: "Admissions and active reviews", view: "about" as ViewType, anchor: "instructors" },
    { name: "Cohort Pricing & Rates", desc: "Compare individual, team, or university cost plans", view: "pricing" as ViewType, anchor: "pricing" }
  ];

  const filteredResults = searchableCourses.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchResultClick = (item: typeof searchableCourses[0]) => {
    setSearchQuery("");
    setShowSearchResults(false);
    navigateTo(item.view);
    
    // Smooth scroll down to corresponding section if applicable
    if (item.anchor) {
      setTimeout(() => {
        const el = document.getElementById(item.anchor);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      // Execute the nearest match
      if (filteredResults.length > 0) {
        handleSearchResultClick(filteredResults[0]);
      } else {
        navigateTo("programs");
        setSearchQuery("");
        setShowSearchResults(false);
      }
    }
  };

  const topTabs = [
    { id: "individuals", label: "For Individuals" },
    { id: "businesses", label: "For Businesses" },
    { id: "universities", label: "For Universities" },
    { id: "governments", label: "For Governments" }
  ] as const;

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300"
    >
      {/* 1. COURSERA-STYLE TOP DARK STRIP */}
      <AnimatePresence initial={false}>
        {!isScrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "36px", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1C1D1F] text-slate-350 text-[10px] sm:text-[11px] font-sans font-semibold tracking-wide border-b border-[#2D2F33] relative z-50 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
              
              {/* Left Tabs with active rectangular bottom accent */}
              <div className="flex gap-3 sm:gap-6 h-full overflow-x-auto scrollbar-none items-center">
                {topTabs.map((tab) => {
                  const isActive = activeTopTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTopTab(tab.id)}
                      className={`px-1 relative h-full flex items-center transition-all cursor-pointer whitespace-nowrap text-[10px] sm:text-xs font-sans ${
                        isActive ? "text-white font-black" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="topTabIndicator"
                          className="absolute bottom-0 inset-x-0 h-[4px] bg-white rounded-t-sm"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Contextual Badge */}
              <div className="hidden lg:block text-slate-400 text-[10px] font-mono uppercase tracking-wider">
                {activeTopTab === "individuals" && "🎓 MASTER HIGH-FIDELITY AI API COHORTS"}
                {activeTopTab === "businesses" && "💼 ENTERPRISE WORKFLOW & PIPELINE AUDITING"}
                {activeTopTab === "universities" && "🏛️ CO-BRANDED INTERACTIVE LAB ENVIRONMENTS"}
                {activeTopTab === "governments" && "🛡️ SOVEREIGN DIGITAL SKILLS TRAINING PATHWAYS"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHROME WHITE HEADER BAR */}
      <div 
        className={`bg-white border-b border-gray-200 transition-all duration-300 w-full relative z-40 ${
          isScrolled 
            ? "py-2 shadow-sm" 
            : "py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* LEFT CONTAINER: Logo & Explore Dropdown & Degrees link */}
            <div className="flex items-center gap-2 sm:gap-5">
              
              {/* Coursera-style typography logo */}
              <div
                className="flex items-center gap-2 cursor-pointer group shrink-0"
                onClick={() => { navigateTo("home"); setMobileMenuOpen(false); }}
                id="header-logo-container"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0056D2] flex items-center justify-center text-white relative overflow-hidden transition-all shadow-sm group-hover:scale-105">
                  <Sparkles className="w-4.5 h-4.5 text-amber-300 relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-black text-base sm:text-xl tracking-tight text-[#0056D2] leading-none">
                    ai<span className="text-[#0B1B3D] font-normal leading-none font-medium ml-0.5">institute</span>
                  </span>
                  <span className="text-[6.5px] sm:text-[7px] font-mono tracking-[0.15em] text-gray-400 uppercase font-semibold leading-none mt-1">
                    mastery portal
                  </span>
                </div>
              </div>

              {/* EXPLORE BLUE MEGACP DROP DOWN BUTTON (Coursera signature feel) */}
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setActiveDropdown(!activeDropdown)}
                  className={`bg-[#0056D2] hover:bg-[#003E9C] text-white py-2 px-4 rounded-md font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer min-h-[40px]`}
                  id="explore-dropdown-trigger"
                >
                  <span>Explore</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* ADVANCED SIDE-TAB MEGAMENU DROPDOWN (Matches Coursera layout) */}
                <AnimatePresence>
                  {activeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-3.5 w-[610px] bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden grid grid-cols-12 text-left"
                    >
                      {/* Left: Domain Category Sidebar (Coursera style) */}
                      <div className="col-span-4 bg-gray-50/90 border-r border-gray-150 p-4 space-y-1.5">
                        <span className="block text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase pb-2.5">
                          Syllabus Sectors
                        </span>
                        
                        <button
                          onMouseEnter={() => setMegaActiveTab("catalogue")}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs font-bold font-sans transition-all cursor-pointer ${
                            megaActiveTab === "catalogue" 
                              ? "bg-white text-[#0056D2] shadow-sm border border-gray-200/50" 
                              : "text-slate-700 hover:bg-gray-100 hover:text-slate-900"
                          }`}
                        >
                          <span>Course Catalogue</span>
                          <ChevronRight className={`w-3 h-3 ${megaActiveTab === "catalogue" ? "text-[#0056D2]" : "text-gray-400"}`} />
                        </button>

                        <button
                          onMouseEnter={() => setMegaActiveTab("timelines")}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs font-bold font-sans transition-all cursor-pointer ${
                            megaActiveTab === "timelines" 
                              ? "bg-white text-[#0056D2] shadow-sm border border-gray-200/50" 
                              : "text-slate-700 hover:bg-gray-100 hover:text-slate-900"
                          }`}
                        >
                          <span>Learning Pathways</span>
                          <ChevronRight className={`w-3 h-3 ${megaActiveTab === "timelines" ? "text-[#0056D2]" : "text-gray-400"}`} />
                        </button>

                        <button
                          onMouseEnter={() => setMegaActiveTab("resources")}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs font-bold font-sans transition-all cursor-pointer ${
                            megaActiveTab === "resources" 
                              ? "bg-white text-[#0056D2] shadow-sm border border-gray-200/50" 
                              : "text-slate-700 hover:bg-gray-100 hover:text-slate-900"
                          }`}
                        >
                          <span>Community & Support</span>
                          <ChevronRight className={`w-3 h-3 ${megaActiveTab === "resources" ? "text-[#0056D2]" : "text-gray-400"}`} />
                        </button>

                        <div className="pt-6 border-t border-gray-200 mt-4 text-[10px] font-mono text-slate-400 font-medium">
                          SANDBOX_RESOURCES_ACTV
                        </div>
                      </div>

                      {/* Right: Category specific list */}
                      <div className="col-span-8 p-5 bg-white space-y-4">
                        
                        {megaActiveTab === "catalogue" && (
                          <div className="space-y-3.5">
                            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Mastery Programs</span>
                              <span 
                                onClick={() => scrollToSection("featured-programs")}
                                className="text-[10px] font-sans font-bold text-[#0056D2] hover:underline cursor-pointer"
                              >
                                View Catalogue &rarr;
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {programs.slice(0, 6).map((prog, idx) => {
                                const Icon = prog.icon;
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => scrollToSection("featured-programs")}
                                    className="p-2.5 rounded-lg border border-gray-100 hover:border-[#0056D2]/30 hover:bg-blue-50/30 transition-all cursor-pointer text-left group/megacard"
                                  >
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <Icon className="w-3.5 h-3.5 text-[#0056D2] shrink-0" />
                                      <span className="text-[11px] font-bold text-[#0B1B3D] group-hover/megacard:text-[#0056D2] transition-colors truncate">{prog.name}</span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-secondary line-clamp-1">{prog.desc}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {megaActiveTab === "timelines" && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Accreditations & Certificates</span>
                              <span 
                                onClick={() => scrollToSection("learning-paths")}
                                className="text-[10px] font-sans font-bold text-[#0056D2] hover:underline cursor-pointer"
                              >
                                View Timelines &rarr;
                              </span>
                            </div>
                            <div className="space-y-2.5">
                              {learningLinks.slice(0, 3).map((link, idx) => {
                                const Icon = link.icon;
                                return (
                                  <div 
                                    key={idx}
                                    onClick={() => { navigateTo(link.view); setActiveDropdown(false); }}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-gray-150 transition-all cursor-pointer text-left group/pathcard"
                                  >
                                    <div className="p-1.5 rounded bg-gray-50 text-gray-500 group-hover/pathcard:bg-blue-50 group-hover/pathcard:text-[#0056D2] transition-colors mt-0.5">
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-[11px] font-sans font-bold text-slate-800 group-hover/pathcard:text-[#0056D2] transition-colors block">{link.name}</span>
                                      <p className="text-[9.5px] text-gray-400 font-secondary line-clamp-1 mt-0.5">{link.desc}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {megaActiveTab === "resources" && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Ecosystem Utilities</span>
                              <span 
                                onClick={() => scrollToSection("faqs")}
                                className="text-[10px] font-sans font-bold text-[#0056D2] hover:underline cursor-pointer"
                              >
                                Support Center &rarr;
                              </span>
                            </div>
                            <div className="space-y-2.5">
                              {resourceLinks.slice(0, 3).map((link, idx) => {
                                const Icon = link.icon;
                                return (
                                  <div 
                                    key={idx}
                                    onClick={() => { navigateTo(link.view); setActiveDropdown(false); }}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-gray-150 transition-all cursor-pointer text-left group/pathcard"
                                  >
                                    <div className="p-1.5 rounded bg-gray-50 text-gray-500 group-hover/pathcard:bg-blue-50 group-hover/pathcard:text-[#0056D2] transition-colors mt-0.5">
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-[11px] font-sans font-bold text-slate-800 group-hover/pathcard:text-[#0056D2] transition-colors block">{link.name}</span>
                                      <p className="text-[9.5px] text-gray-400 font-secondary line-clamp-1 mt-0.5">{link.desc}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Dropdown Action Promo */}
                        <div className="bg-[#030914] rounded-lg p-3.5 text-white flex items-center justify-between text-xs mt-2 border border-white/[0.03]">
                          <div className="text-left space-y-0.5">
                            <p className="font-semibold text-[10px] text-amber-400 uppercase tracking-widest flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> Member Privilege
                            </p>
                            <p className="text-[11px] text-slate-350 font-secondary">Enroll and unlock Sandra Cole's prompt framework templates.</p>
                          </div>
                          <button
                            onClick={() => scrollToSection("pricing")}
                            className="bg-[#0056D2] hover:bg-[#003E9C] text-white py-1.5 px-3 rounded text-[10px] font-bold font-sans tracking-wide uppercase transition-all"
                          >
                            Explore Rates
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PREMIUM OFFICIAL PAGES DIRECT LINKS */}
              <button
                onClick={() => navigateTo("paths")}
                className="hidden lg:block text-xs font-sans font-bold text-[#0B1B3D] hover:text-[#0056D2] tracking-wide transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-4"
              >
                Syllabus
              </button>
              <button
                onClick={() => navigateTo("services")}
                className="hidden lg:block text-xs font-sans font-bold text-[#0B1B3D] hover:text-[#0056D2] tracking-wide transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-4"
              >
                Our Services
              </button>
              <button
                onClick={() => navigateTo("contact")}
                className="hidden lg:block text-xs font-sans font-bold text-[#0B1B3D] hover:text-[#0056D2] tracking-wide transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-4"
              >
                Contact Desk
              </button>
              {/* Navigation links hidden or restricted to auth-flows */}
            </div>

            {/* CENTER CONTAINER: PERFECTLY ROUNDED DEEP SEARCH BAR WITH SELECTIVE REALTIME FILTER */}
            <div className="hidden md:block flex-1 max-w-[420px] mx-4 lg:mx-8 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    placeholder="What do you want to learn?"
                    className="w-full bg-white text-xs text-slate-800 placeholder-slate-400 pl-4 pr-12 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] shadow-xs tracking-wide transition-all min-h-[40px]"
                    id="coursera-search-input"
                  />
                  
                  {/* Signature Coursera Circular Blue Search Icon Button */}
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 w-7.5 h-7.5 bg-[#0056D2] hover:bg-[#003E9C] text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs border-none"
                    aria-label="Submit Search"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Search Suggestions dropdown */}
              <AnimatePresence>
                {showSearchResults && searchQuery.trim() !== "" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-[310px] overflow-y-auto text-left z-50"
                  >
                    {filteredResults.length > 0 ? (
                      <div className="py-2.5 divide-y divide-gray-100">
                        {filteredResults.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSearchResultClick(item)}
                            className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors cursor-pointer border-none"
                          >
                            <div className="w-7 h-7 bg-blue-50 text-[#0056D2] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <GraduationCap className="w-4 h-4 text-[#0056D2]" />
                            </div>
                            <div className="truncate">
                              <p className="text-[11.5px] font-sans font-bold text-[#0B1B3D] truncate">{item.name}</p>
                              <p className="text-[9.5px] text-gray-400 font-secondary truncate mt-0.5">{item.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 px-4 text-center">
                        <span className="block text-xs font-semibold text-slate-400 tracking-wide">No syllabus matches found for "{searchQuery}"</span>
                        <p className="text-[10px] text-gray-400 mt-1">Try searching: Prompt, Automation, Certificate, or Agents</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT CONTAINER: LOG IN & ACTIONS + MOBILE OPTIMIZED TRIGGERS */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Minimalist Log In Link Button or Live Admin indicate */}
              {localStorage.getItem("is_admin_authenticated") === "true" ? (
                <button
                  onClick={() => navigateTo("admin")}
                  className="flex items-center gap-2 bg-[#08142B] hover:bg-slate-900 text-white border border-amber-400/80 py-1.5 px-3 rounded-full shadow-md transition-all cursor-pointer select-none group"
                  title="Signed in as Master Admin. Click to view Admin Dashboard."
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-[#08142B] flex items-center justify-center font-bold text-[10px] font-mono shadow-inner group-hover:scale-110 transition-transform">
                      AD
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#08142B] animate-pulse" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-[1.1] pr-1 text-left">
                    <span className="text-[10px] font-semibold text-slate-300">Welcome Back</span>
                    <span className="text-[9px] font-mono font-bold tracking-tight text-amber-400 uppercase">Admin Console</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="block text-xs font-sans font-bold text-[#0056D2] hover:text-[#003E9C] hover:bg-blue-50/50 py-2.5 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider"
                >
                  Log In
                </button>
              )}

              {/* Mobile Selective Search Toggle Button */}
              <button
                onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
                className="md:hidden p-1.5 text-slate-700 hover:text-[#0056D2] transition-colors focus:outline-none min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                aria-label="Toggle Mobile Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Hamburger Toggle Buttons (Mobile) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-700 border border-gray-200 rounded-lg hover:text-[#0056D2] transition-colors focus:outline-none min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4.5 h-4.5 animate-in spin-in-90 duration-200" /> : <Menu className="w-4.5 h-4.5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Dynamic Mobile Search Strip Expand below main logo header bar */}
        <AnimatePresence>
          {mobileSearchVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-slate-50 border-t border-gray-200 px-4 py-3 relative z-30 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="w-full bg-white text-xs text-slate-800 focus:outline-none pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:border-[#0056D2] shadow-xs tracking-wide"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 w-8 h-8 bg-[#0056D2] text-white rounded-full flex items-center justify-center cursor-pointer"
                  aria-label="Mobile Search Submit"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {searchQuery.trim() !== "" && filteredResults.length > 0 && (
                <div className="bg-white border rounded-lg shadow-lg mt-2 py-1 max-h-[180px] overflow-y-auto divide-y divide-gray-100">
                  {filteredResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSearchResultClick(item);
                        setMobileSearchVisible(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left"
                    >
                      <GraduationCap className="w-4 h-4 text-[#0056D2] shrink-0" />
                      <div className="truncate">
                        <p className="text-[11px] font-sans font-bold text-[#0B1B3D] truncate">{item.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 3. MOBILE SIDE DRAWER MENU PANEL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop cover layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#08142B] md:hidden z-20"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Swipe side menu container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[340px] bg-white z-30 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between md:hidden"
            >
              <div className="space-y-6 pt-18">
                
                {/* Mobile Header indicator */}
                <div className="border-b border-gray-150 pb-3 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                    Mastery navigation
                  </span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Submenu Item blocks */}
                <div className="space-y-4">
                  
                  {/* Category 1: Programs List */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold font-mono text-gray-400 tracking-wider uppercase block">
                      Course Programs
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {programs.slice(0, 5).map((p, i) => (
                        <button
                          key={i}
                          onClick={() => scrollToSection("featured-programs")}
                          className="w-full text-left py-2 px-3 hover:bg-slate-50 text-xs font-semibold text-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#0056D2]" />
                          <span>{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: Paths */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold font-mono text-gray-400 tracking-wider uppercase block">
                      Skill Pathways
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {learningLinks.map((l, i) => (
                        <button
                          key={i}
                          onClick={() => { navigateTo(l.view); setMobileMenuOpen(false); }}
                          className="w-full text-left py-2 px-3 hover:bg-slate-50 text-xs font-semibold text-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Compass className="w-3.5 h-3.5 text-purple-500" />
                          <span>{l.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom CTA Group in Mobile Sidebar */}
              <div className="pt-6 border-t border-gray-150 flex flex-col gap-2.5">
                <button
                  onClick={() => { navigateTo("services"); setMobileMenuOpen(false); }}
                  className="w-full py-3 text-center text-xs font-sans font-bold text-[#0B1B3D] border border-gray-200 hover:bg-slate-50 rounded-xl min-h-[44px] uppercase tracking-wider"
                >
                  Our Services
                </button>
                <button
                  onClick={() => { navigateTo("contact"); setMobileMenuOpen(false); }}
                  className="w-full py-3 text-center text-xs font-sans font-bold text-[#0B1B3D] border border-gray-200 hover:bg-slate-50 rounded-xl min-h-[44px] uppercase tracking-wider"
                >
                  Contact Desk
                </button>
                {/* Restrict administrative consoles from public drawer links */}
                {localStorage.getItem("is_admin_authenticated") === "true" ? (
                  <button
                    onClick={() => { navigateTo("admin"); setMobileMenuOpen(false); }}
                    className="w-full py-3 text-center text-xs font-sans font-bold text-amber-700 bg-amber-50 hover:bg-amber-150 border border-amber-200 rounded-xl min-h-[44px] uppercase tracking-wider mt-2.5 font-mono"
                  >
                    🛡️ Open Admin Console
                  </button>
                ) : (
                  <button
                    onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
                    className="w-full py-3 text-center text-xs font-sans font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl min-h-[44px] uppercase tracking-wider mt-2.5"
                  >
                    Log In Account
                  </button>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
