/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sparkles, Menu, X, ArrowRight, Zap } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 80;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-pink py-3 bg-white/80"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 rounded-xl bg-[#011673] flex items-center justify-center text-white relative overflow-hidden transition-transform group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#011673] to-[#2D7FF9] opacity-80" />
              <Sparkles className="w-5 h-5 relative z-10 text-[#FCF50F]" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-[#101828]">
                AIOnline
                <span className="text-[#2D7FF9]">Business</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-gray-500 uppercase">
                Premium Academy
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("why-us")}
              className="text-sm font-medium text-[#101828]/80 hover:text-[#011673] transition-colors cursor-pointer"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection("learning-paths")}
              className="text-sm font-medium text-[#101828]/80 hover:text-[#011673] transition-colors cursor-pointer"
            >
              Paths
            </button>
            <button
              onClick={() => scrollToSection("featured-programs")}
              className="text-sm font-medium text-[#101828]/80 hover:text-[#011673] transition-colors cursor-pointer"
            >
              Programs
            </button>
            <button
              onClick={() => scrollToSection("curriculum")}
              className="text-sm font-medium text-[#101828]/80 hover:text-[#011673] transition-colors cursor-pointer"
            >
              Syllabus
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium text-[#101828]/80 hover:text-[#011673] transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* CTA Group */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium text-[#101828]/80 hover:text-[#011673] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="glow-btn bg-[#011673] hover:bg-[#2D7FF9] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#101828] hover:text-[#011673] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="px-4 py-6 space-y-4">
            <button
              onClick={() => scrollToSection("why-us")}
              className="block w-full text-left py-2 font-medium text-[#101828]/90 text-base"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection("learning-paths")}
              className="block w-full text-left py-2 font-medium text-[#101828]/90 text-base"
            >
              Paths & Categories
            </button>
            <button
              onClick={() => scrollToSection("featured-programs")}
              className="block w-full text-left py-2 font-medium text-[#101828]/90 text-base"
            >
              Featured Programs
            </button>
            <button
              onClick={() => scrollToSection("curriculum")}
              className="block w-full text-left py-2 font-medium text-[#101828]/90 text-base"
            >
              Curriculum Map
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left py-2 font-medium text-[#101828]/90 text-base"
            >
              Pricing Plans
            </button>
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("pricing")}
                className="w-full text-center py-2.5 text-sm font-medium text-[#101828] bg-gray-50 rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="w-full text-center bg-[#011673] text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#FCF50F]" />
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
