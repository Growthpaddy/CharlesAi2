/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ArrowRight, Compass, Cpu, GraduationCap, 
  Sparkles, TrendingUp, Users, Zap, Terminal 
} from "lucide-react";
import Header from "./components/Header";
import AdminDashboard from "./components/AdminDashboard";
import Hero from "./components/Hero";
import WhyUs from "./components/WhyUs";
import Curriculum from "./components/Curriculum";
import FeaturedPrograms from "./components/FeaturedPrograms";
import SuccessSection from "./components/SuccessSection";
import Testimonials from "./components/Testimonials";
import PricingSection from "./components/PricingSection";
import CommunityAndFAQs from "./components/CommunityAndFAQs";
import AboutPage from "./components/AboutPage";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import HomePaths from "./components/HomePaths";
import HomeHowItWorks from "./components/HomeHowItWorks";
import HomeExperience from "./components/HomeExperience";
import HomeResults from "./components/HomeResults";
import HomeCurriculum from "./components/HomeCurriculum";
import HomeFAQ from "./components/HomeFAQ";
import HomeInstructor from "./components/HomeInstructor";
import HomeCTA from "./components/HomeCTA";
import ScrollReveal from "./components/ScrollReveal";
import AITechStack from "./components/AITechStack";
import FloatingParticlesWrapper from "./components/FloatingParticlesWrapper";
import LoginPortalModal from "./components/LoginPortalModal";
import ServicesPage from "./components/ServicesPage";
import ContactPage from "./components/ContactPage";
import StudentDashboard from "./components/StudentDashboard";
import LeadLandingPage from "./components/LeadLandingPage";
import ThankYouPage from "./components/ThankYouPage";
import CheckoutPage from "./components/CheckoutPage";
import { NavigationProvider, useNavigation, ViewType } from "./context/NavigationContext";
import { initDB } from "./lib/db";

export default function App() {
  React.useEffect(() => {
    initDB();
  }, []);

  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

function AppContent() {
  const { currentView, navigateTo } = useNavigation();

  // Helper to change page instantly
  const handlePageChange = (view: ViewType) => {
    navigateTo(view);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#FAFBFC] text-[#0B1B3D] font-sans antialiased relative selection:bg-[#0056D2]/25 selection:text-[#0B1B3D] flex flex-col justify-between">
      {/* Sticky top-level Glass navigation */}
      {currentView !== "admin" && <Header />}

      {/* Main visual layouts stack dynamically routed */}
      <main className="flex-grow">
        {currentView === "home" && (
          <div className="relative animate-in fade-in duration-350">
            <HomeView />
          </div>
        )}

        {currentView === "old_home_deprecated" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* 1. Brand Intro Hero Banner & Workspace mockup */}
            <Hero />

            {/* 2. Top-level Corporate credentials and grayscales brand logo wave */}
            <WhyUs />

            {/* 3. NEW SaaS Dynamic Pathway Grid: Beautiful scannable dashboard routes */}
            <section className="py-20 bg-white border-y border-gray-150 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#2D7FF9]/2 blur-[100px] pointer-events-none" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
                
                <div className="max-w-2xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LAUNCH YOUR CAREER PORTAL</span>
                  </div>
                  {/* Under 10 words heading constraint */}
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
                    Select Your Applied AI Career Pathway
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Skip long generic lectures. Explore specialized modules and real sandboxes tailored specifically to your active business goals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  {/* Pathway 1: Programs */}
                  <div 
                    onClick={() => handlePageChange("programs")}
                    className="group bg-[#FAFBFC] hover:bg-white border border-gray-150 hover:border-[#2D7FF9]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-56 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="p-3 w-12 h-12 rounded-xl bg-blue-50 text-[#2D7FF9] group-hover:bg-[#2D7FF9] group-hover:text-white transition-colors flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-[#08142B] group-hover:text-[#2D7FF9] transition-colors flex items-center gap-1.5">
                          Programs Catalogue <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">
                          Explore 9 specialized courses with targeted curriculums, level filters, and production models.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold">
                      9 ACADEMY PROGRAMS &rarr;
                    </span>
                  </div>

                  {/* Pathway 2: Learning Paths */}
                  <div 
                    onClick={() => handlePageChange("paths")}
                    className="group bg-[#FAFBFC] hover:bg-white border border-gray-150 hover:border-[#2D7FF9]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-56 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="p-3 w-12 h-12 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors flex items-center justify-center">
                        <Compass className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-[#08142B] group-hover:text-[#2D7FF9] transition-colors flex items-center gap-1.5">
                          Syllabus timelines <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">
                          Succeed step-by-step with direct lesson plans, week-by-week benchmarks, and tool roadmaps.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold">
                      10 TIMELINE SYLLABUSES &rarr;
                    </span>
                  </div>

                  {/* Pathway 3: Success Stories */}
                  <div 
                    onClick={() => handlePageChange("success")}
                    className="group bg-[#FAFBFC] hover:bg-white border border-gray-150 hover:border-[#2D7FF9]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-56 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="p-3 w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
                        <Terminal className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-[#08142B] group-hover:text-[#2D7FF9] transition-colors flex items-center gap-1.5">
                          Interactive Sandbox Lab <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">
                          Interact with our dynamic mock Python execution and API client terminals to see student code.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold">
                      SANDBOX & METRICS &rarr;
                    </span>
                  </div>

                  {/* Pathway 4: Resources */}
                  <div 
                    onClick={() => handlePageChange("resources")}
                    className="group bg-[#FAFBFC] hover:bg-white border border-gray-150 hover:border-[#2D7FF9]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-56 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="p-3 w-12 h-12 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-[#08142B] group-hover:text-[#2D7FF9] transition-colors flex items-center gap-1.5">
                          Cohort Discord Preview <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">
                          Simulate active code blueprints inside Discord streams and access FAQs instantly.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold">
                      Blueprints && FAQs &rarr;
                    </span>
                  </div>

                  {/* Pathway 5: About Cole */}
                  <div 
                    onClick={() => handlePageChange("about")}
                    className="group bg-[#FAFBFC] hover:bg-white border border-gray-150 hover:border-[#2D7FF9]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-56 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="p-3 w-12 h-12 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors flex items-center justify-center">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-[#08142B] group-hover:text-[#2D7FF9] transition-colors flex items-center gap-1.5">
                          Systems Audits <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">
                          Review AWS credentials and query a target system audit request from our founding directory.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold">
                      STAFF & SCHEDULER &rarr;
                    </span>
                  </div>

                  {/* Pathway 6: Pricing */}
                  <div 
                    onClick={() => handlePageChange("pricing")}
                    className="group bg-gradient-to-br from-[#08142B] to-[#122A54] hover:to-[#17356B] border border-transparent rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-56 relative overflow-hidden text-white"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FCF50F]/10 blur-xl rounded-full" />
                    <div className="space-y-4">
                      <div className="p-3 w-12 h-12 rounded-xl bg-yellow-400 text-zinc-950 transition-colors flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-white group-hover:text-[#FCF50F] transition-colors flex items-center gap-1.5">
                          Enrollment & Pricing <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-[#FCF50F]" />
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed mt-1">
                          Pick monthly or annual cohort rates with immediate access to private prompt toolkits.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-[#FCF50F] font-bold">
                      COHORT RATES AVAILABLE &rarr;
                    </span>
                  </div>
                </div>

              </div>
            </section>

            {/* 4. Carousel of Verified Graduate Success Outcomes & Student Reviews */}
            <Testimonials />

            {/* Combined dynamic bottom banner section for home conversion */}
            <section className="py-20 bg-gradient-to-br from-[#030914] to-[#0A162B] text-white overflow-hidden relative text-center">
              <div className="absolute inset-0 bg-[#0056D2]/15 blur-[120px] pointer-events-none" />
              <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-[#0056D2]/20 text-blue-300 px-3.5 py-1.5 rounded-full border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Applied Competence Priority
                </span>
                {/* Under 10 words heading limit */}
                <h3 className="font-sans text-3xl sm:text-4xl font-extrabold leading-tight">
                  Stop Buzzword Chasing. Start Engineering Automations.
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                  Join certified alumni running high-fidelity workflows. Unlock live mentorship sessions, proprietary prompt libraries, and complete custom sandbox sandboxed builders.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => handlePageChange("pricing")}
                    className="bg-[#0056D2] hover:bg-[#003E9C] text-white font-bold px-8 py-3.5 rounded-xl transition-all text-xs cursor-pointer min-h-[48px]"
                  >
                    View Pricing Options
                  </button>
                  <button 
                    onClick={() => handlePageChange("about")}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold px-8 py-3.5 rounded-xl transition-all text-xs cursor-pointer min-h-[48px]"
                  >
                    Free Consulting Audit
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === "programs" && (
          <div className="pt-28 sm:pt-32 pb-16 animate-in fade-in duration-300">
            <FeaturedPrograms />
          </div>
        )}

        {currentView === "paths" && (
          <div className="pt-28 sm:pt-32 pb-16 animate-in fade-in duration-300">
            <Curriculum />
          </div>
        )}

        {currentView === "success" && (
          <div className="pt-28 sm:pt-32 pb-16 space-y-16 animate-in fade-in duration-300">
            <SuccessSection />
            <ScrollReveal>
              <HomeResults />
            </ScrollReveal>
            <ScrollReveal>
              <Testimonials />
            </ScrollReveal>
          </div>
        )}

        {currentView === "resources" && (
          <div className="pt-28 sm:pt-32 pb-16 animate-in fade-in duration-300">
            <CommunityAndFAQs />
          </div>
        )}

        {currentView === "about" && (
          <div className="pt-8 animate-in fade-in duration-300">
            <AboutPage />
          </div>
        )}

        {currentView === "pricing" && (
          <div className="pt-28 sm:pt-32 pb-16 animate-in fade-in duration-300">
            <PricingSection />
          </div>
        )}

        {currentView === "services" && (
          <div className="pt-28 sm:pt-32 pb-16 animate-in fade-in duration-300">
            <ServicesPage />
          </div>
        )}

        {currentView === "contact" && (
          <div className="pt-28 sm:pt-32 pb-16 animate-in fade-in duration-300">
            <ContactPage />
          </div>
        )}

        {currentView === "dashboard" && (
          <div className="animate-in fade-in duration-300">
            <StudentDashboard />
          </div>
        )}

        {currentView === "landing" && (
          <div className="animate-in fade-in duration-350">
            <LeadLandingPage />
          </div>
        )}

        {currentView === "thankyou" && (
          <div className="animate-in fade-in duration-350">
            <ThankYouPage />
          </div>
        )}

        {currentView === "checkout" && (
          <div className="animate-in fade-in duration-350">
            <CheckoutPage />
          </div>
        )}

        {currentView === "admin" && (
          <div className="animate-in fade-in duration-300">
            <AdminDashboard />
          </div>
        )}
      </main>

      {/* Global persistent premium Footer at the very bottom */}
      {currentView !== "admin" && <Footer />}
      
      {/* Interactive Secure Student Gate Overlay */}
      <LoginPortalModal />
    </div>
  );
}
