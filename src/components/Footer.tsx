/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Apple, Play } from "lucide-react";
import { useNavigation, ViewType } from "../context/NavigationContext";

export default function Footer() {
  const { navigateTo } = useNavigation();

  // Helper to change page instantly and scroll up
  const handleNav = (view: ViewType) => {
    navigateTo(view);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const columnsRow1 = [
    {
      title: "Skills",
      items: [
        { label: "Accounting", view: "paths" as ViewType },
        { label: "Artificial Intelligence (AI)", view: "paths" as ViewType },
        { label: "Cybersecurity", view: "paths" as ViewType },
        { label: "Data Analytics", view: "paths" as ViewType },
        { label: "Digital Marketing", view: "paths" as ViewType },
        { label: "Human Resources (HR)", view: "paths" as ViewType },
        { label: "Microsoft Excel", view: "paths" as ViewType },
        { label: "Project Management", view: "paths" as ViewType },
        { label: "Python", view: "paths" as ViewType },
        { label: "SQL", view: "paths" as ViewType }
      ]
    },
    {
      title: "Professional Certificates",
      items: [
        { label: "Google AI Certificate", view: "programs" as ViewType },
        { label: "Google Cybersecurity Certificate", view: "programs" as ViewType },
        { label: "Google Data Analytics Certificate", view: "programs" as ViewType },
        { label: "Google IT Support Certificate", view: "programs" as ViewType },
        { label: "Google Project Management Certificate", view: "programs" as ViewType },
        { label: "Google UX Design Certificate", view: "programs" as ViewType },
        { label: "IBM AI Engineering Certificate", view: "programs" as ViewType },
        { label: "IBM AI Product Manager Certificate", view: "programs" as ViewType },
        { label: "IBM Data Science Certificate", view: "programs" as ViewType },
        { label: "Intuit Academy Bookkeeping Certificate", view: "programs" as ViewType }
      ]
    },
    {
      title: "Courses & Specializations",
      items: [
        { label: "AI Essentials Specialization", view: "programs" as ViewType },
        { label: "AI For Business Specialization", view: "programs" as ViewType },
        { label: "AI For Everyone Course", view: "programs" as ViewType },
        { label: "AI in Healthcare Specialization", view: "programs" as ViewType },
        { label: "Deep Learning Specialization", view: "programs" as ViewType },
        { label: "Excel Skills for Business Specialization", view: "programs" as ViewType },
        { label: "Financial Markets Course", view: "programs" as ViewType },
        { label: "Machine Learning Specialization", view: "programs" as ViewType },
        { label: "Prompt Engineering for ChatGPT Course", view: "programs" as ViewType },
        { label: "Python for Everybody Specialization", view: "programs" as ViewType }
      ]
    },
    {
      title: "Career Resources",
      items: [
        { label: "Career Aptitude Test", view: "success" as ViewType },
        { label: "CAPM Certification Requirements", view: "success" as ViewType },
        { label: "CompTIA A+ Certification Requirements", view: "success" as ViewType },
        { label: "CompTIA Security+ Certification Requirements", view: "success" as ViewType },
        { label: "Essential IT Certifications", view: "success" as ViewType },
        { label: "High-Income Skills to Learn", view: "success" as ViewType },
        { label: "How to Learn Artificial Intelligence", view: "success" as ViewType },
        { label: "PMP Certification Requirements", view: "success" as ViewType },
        { label: "Popular Cybersecurity Certifications", view: "success" as ViewType },
        { label: "Share your Coursera learning story", view: "resources" as ViewType }
      ]
    }
  ];

  const columnsRow2 = [
    {
      title: "aiinstitute",
      items: [
        { label: "About", view: "about" as ViewType },
        { label: "What We Offer", view: "programs" as ViewType },
        { label: "Leadership", view: "about" as ViewType },
        { label: "Careers", view: "about" as ViewType },
        { label: "Catalog", view: "programs" as ViewType }
      ]
    },
    {
      title: "Community",
      items: [
        { label: "Learners", view: "resources" as ViewType },
        { label: "Partners", view: "about" as ViewType },
        { label: "Beta Testers", view: "resources" as ViewType },
        { label: "Blog", view: "resources" as ViewType },
        { label: "The Coursera Podcast", view: "resources" as ViewType }
      ]
    },
    {
      title: "More",
      items: [
        { label: "Press", view: "resources" as ViewType },
        { label: "Investors", view: "about" as ViewType },
        { label: "Terms", view: "about" as ViewType },
        { label: "Privacy", view: "about" as ViewType },
        { label: "Help", view: "resources" as ViewType }
      ]
    }
  ];

  return (
    <footer id="global-footer" className="bg-[#F5F7FA] border-t border-gray-200/80 pt-16 pb-12 text-slate-800 relative z-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: 4 COLUMN MASSIVE SKILLS & CREDENTIALS INDEX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 pb-12 border-b border-gray-250">
          {columnsRow1.map((col, idx) => (
            <div key={idx} className="space-y-4 text-left">
              <h4 className="font-sans font-bold text-sm sm:text-base text-[#0B1B3D] tracking-tight">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-[11.5px] sm:text-xs text-gray-500 font-medium">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleNav(item.view)}
                      className="hover:text-[#0056D2] hover:underline transition-colors text-left font-sans cursor-pointer focus:outline-none"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ROW 2: OTHER LINKS AND APP DOWNLOAD BADGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 pt-12 pb-10 border-b border-gray-250">
          {columnsRow2.map((col, idx) => (
            <div key={idx} className="lg:col-span-3 text-left space-y-4">
              <h4 className="font-sans font-bold text-sm sm:text-base text-[#0B1B3D] tracking-tight">
                {col.title === "aiinstitute" ? (
                  <span className="font-black text-sm tracking-tight text-[#0056D2]">
                    ai<span className="text-[#0B1B3D] font-normal leading-none font-medium ml-0.5">institute</span>
                  </span>
                ) : (
                  col.title
                )}
              </h4>
              <ul className="space-y-2 text-[11.5px] sm:text-xs text-gray-500 font-medium">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleNav(item.view)}
                      className="hover:text-[#0056D2] hover:underline transition-colors text-left font-sans cursor-pointer focus:outline-none"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* APP STORE DOWNLOAD BADGES COLUMN (Matches screenshot) */}
          <div className="lg:col-span-3 text-left space-y-4 flex flex-col justify-start">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-400">
              Mobile Learning
            </h4>
            
            <div className="space-y-3 max-w-[170px]">
              {/* App Store Badge */}
              <a 
                href="#appstore" 
                onClick={(e) => { e.preventDefault(); alert("App Store download requested. Interactive ios App synchronizing..."); }}
                className="flex items-center gap-2 bg-[#000000] text-white p-2 sm:p-2.5 rounded-lg border border-white/10 hover:bg-[#1a1a1a] transition-all"
              >
                <Apple className="w-6 h-6 shrink-0 fill-white text-white" />
                <div className="text-left font-sans">
                  <p className="text-[7.5px] uppercase tracking-wider leading-none font-bold text-gray-300">Download on the</p>
                  <p className="text-xs font-black tracking-tight leading-tight mt-0.5">App Store</p>
                </div>
              </a>

              {/* Google Play Badge */}
              <a 
                href="#playstore" 
                onClick={(e) => { e.preventDefault(); alert("Google Play download requested. Direct Android sandbox APK compiling..."); }}
                className="flex items-center gap-2 bg-[#000000] text-white p-2 sm:p-2.5 rounded-lg border border-white/10 hover:bg-[#1a1a1a] transition-all"
              >
                <Play className="w-6 h-6 shrink-0 fill-white text-[#fff] relative left-0.5" />
                <div className="text-left font-sans">
                  <p className="text-[7.5px] uppercase tracking-wider leading-none font-bold text-gray-300">GET IT ON</p>
                  <p className="text-xs font-black tracking-tight leading-tight mt-0.5">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA BAR WITH PARTNER ACCREDITATIONS & LEGAL */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-gray-400 font-medium font-sans">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} aiinstitute Learning Hub.</span>
            <span>•</span>
            <span>Sponsored by direct academic advisors.</span>
            <span>•</span>
            <button onClick={() => handleNav("about")} className="hover:text-[#0056D2] hover:underline cursor-pointer focus:outline-none">Terms</button>
            <span>•</span>
            <button onClick={() => handleNav("about")} className="hover:text-[#0056D2] hover:underline cursor-pointer focus:outline-none">Privacy</button>
            <span>•</span>
            <button onClick={() => handleNav("resources")} className="hover:text-[#0056D2] hover:underline cursor-pointer focus:outline-none">Help Portal</button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gray-200 border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 font-bold" title="Institutional Trust Badge">
              ✓
            </div>
            <span className="text-[10px] text-gray-400 font-sans tracking-wide uppercase font-bold">Verified Learning System</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
