/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { faqs } from "../data";
import { ChevronDown, MessageSquare, Sparkles, Send, Users, ShieldAlert, Check, HelpCircle, ArrowRight, Zap, Play } from "lucide-react";

export default function CommunityAndFAQs() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>("faq-1");
  const [activeChannel, setActiveChannel] = useState("#automation-challenges");
  
  const communityChannels = [
    { title: "#general-strategy", desc: "Cohort strategy audits" },
    { title: "#automation-challenges", desc: "API configurations and code grids" },
    { title: "#freelance-gigs", desc: "Contract scouting & partner match-making" },
    { title: "#live-reviews", desc: "Direct weekly system screen-shares" }
  ];

  const channelMessages: Record<string, Array<{ user: string; role: string; avatar: string; text: string }>> = {
    "#automation-challenges": [
      {
        user: "Tariq Jackson",
        role: "Agency Founder",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Just completed deploying our automated CRM scraper. Linked Apollo scraping loops to custom Claude workflows. We generated 14 warm client leads inside 40 minutes for under $2 in API costs!"
      },
      {
        user: "Nia Mitchell",
        role: "Creative Architect",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Incredible news Tariq! I just uploaded my CapCut automatic transcription template to the resources workspace. Let me know if you need help syncing voice synthesis scripts."
      },
      {
        user: "Marcus Adebayo",
        role: "Automation Specialist",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Excellent work Nia and Tariq. If anyone is running into JSON parsing exceptions in Make.com trigger points, grab Module 5, Lesson 4's custom error-handler schema. It resolves typical webhook retries."
      }
    ],
    "#general-strategy": [
      {
        user: "Aisha Peterson",
        role: "Freelance Designer",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Currently auditing a mid-market e-commerce site for a prospective client. Dr. Cole's AI Discovery Framework showed they are losing ~18 hours per week purely on support emails. Pricing audit pitch deck is ready!"
      }
    ],
    "#freelance-gigs": [
      {
        user: "Kofi Mensah",
        role: "Sales Operations Lead",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Need a partner to build a lightweight Bubble dashboard overlay to query a custom medical vector database. Paying $3,500 contract retainer. Feel free to DM me!"
      }
    ],
    "#live-reviews": [
      {
        user: "Dr. Sandra Cole",
        role: "Lead Instructor",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Wonderful live audits today, crew. I have recorded the screenshare and uploaded the custom chatbot structure we debugged. See you in Office Hours next Wednesday!"
      }
    ]
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#FAFBFC]">
      
      {/* SECTION 10: Thriving Workspace Community Preview */}
      <section id="community" className="py-20 md:py-28 bg-[#FAFBFC] border-b border-gray-150 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Context Details */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/15 text-[#011673] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#2D7FF9]" />
                <span>THRIVING DIGITAL COLLAB</span>
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
                Never Learn Alone. Meet Your Tech Cohort.
              </h2>
              <p className="text-base text-gray-500 leading-relaxed font-normal">
                Join our private, premium collaborative workspace. Share prompt configurations, find technical agency co-partners, scout premium contracts, and troubleshoot code in real time with over 12,000 alumni.
              </p>
              
              {/* Channel Selector Sidebar (Inside simulated app list) */}
              <div className="space-y-2.5">
                {communityChannels.map((channel, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveChannel(channel.title)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      activeChannel === channel.title
                        ? "bg-white border-[#2D7FF9] shadow-md text-[#2D7FF9]"
                        : "bg-white/40 hover:bg-white border-transparent text-gray-750"
                    }`}
                  >
                    <div className="flex gap-2.5 items-center">
                      <span className="font-mono text-base font-bold text-gray-400">#</span>
                      <div className="text-left">
                        <p className="text-xs font-bold font-mono tracking-tight text-gray-805">
                          {channel.title.replace("#", "")}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                          {channel.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-bold uppercase">Active</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Simulated Workspace Chat Panel with real black creators */}
            <div className="lg:col-span-span lg:col-span-7 bg-[#0A0F1E] text-white border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl relative">
              
              {/* Chat Panel Header styling */}
              <div className="bg-[#0D1326] px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-display font-bold text-xs tracking-wide uppercase font-mono text-gray-350">
                    {activeChannel}
                  </span>
                </div>
                <div className="bg-white/5 px-2.5 py-1 rounded-lg text-[9.5px] font-mono text-gray-400">
                  <span>94 alumni active online</span>
                </div>
              </div>

              {/* Message Lists container */}
              <div className="p-5 space-y-5 h-[340px] overflow-y-auto bg-[#0A0F1E]/95">
                {(channelMessages[activeChannel] || []).map((msg, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start text-left">
                    <img
                      src={msg.avatar}
                      alt={msg.user}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-xs text-white tracking-wide">
                          {msg.user}
                        </span>
                        <span className="text-[8.5px] font-mono uppercase bg-white/5 px-1.5 py-0.5 rounded text-gray-400">
                          {msg.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-350 leading-relaxed text-gray-300 font-normal">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input row */}
              <div className="p-4 bg-[#0D1326] border-t border-white/[0.08] flex gap-2">
                <input
                  type="text"
                  placeholder={`Send a prompt code to ${activeChannel}...`}
                  disabled
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-300 placeholder:text-gray-500"
                />
                <button
                  disabled
                  className="p-2.5 bg-[#2D7FF9]/40 text-white rounded-xl cursor-not-allowed opacity-50 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 13: FAQ Accordion */}
      <section id="faqs" className="py-20 md:py-28 bg-[#FAFBFC] border-b border-gray-150">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>FREQUENT QUESTIONS ANSWERED</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
              Your Path to Mastery: Clarified
            </h2>
            <p className="text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
              Review answers regarding credentials, cost efficiency, study guidelines, and career outcomes.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200/80 rounded-2xl hover:border-gray-300 transition-all overflow-hidden text-left"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-0 select-none cursor-pointer"
                  >
                    <span className="font-display font-bold text-sm sm:text-base text-[#101828]">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-xl border border-gray-50 bg-gray-50 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-4.5 h-4.5 text-gray-500" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-50 font-normal">
                      {faq.answer}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 14: Final Conversion (Prestige Urgency CTA) */}
      <section id="cta" className="py-20 md:py-28 bg-[#0A0F1E] text-white overflow-hidden relative">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#2D7FF9]/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full bg-[#FCF50F]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="bg-white/[0.02] border border-white/[0.08] p-8 md:p-14 rounded-3xl md:rounded-[40px] text-center space-y-8 relative">
            {/* Top glowing bar */}
            <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[#2D7FF9] to-transparent" />

            <div className="max-w-2xl mx-auto space-y-4">
              {/* Slots countdown urgency indicator */}
              <div className="inline-flex items-center gap-2 bg-[#FCF50F] text-gray-950 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase font-mono tracking-widest animate-pulse mx-auto">
                <ShieldAlert className="w-4 /h-4" />
                <span>ONLY 14 COHORT SLOTS REMAINING FOR THE SESSION</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Ready to Systematize and Automate Your Business?
              </h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-normal">
                Unlock lifetime access today. Join Dr. Sandra Cole and an ambitious global network of creators building automated AI enterprises.
              </p>
            </div>

            {/* Quick trust metrics checklist */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 text-xs font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#12B76A]" />
                <span>30-Day Money Back Warranty</span>
              </div>
              <div className="hidden sm:block text-white/20">|</div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#12B76A]" />
                <span>Instant templates & prompt libraries allocation</span>
              </div>
              <div className="hidden sm:block text-white/20">|</div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#12B76A]" />
                <span>Verified resume credentials on graduation</span>
              </div>
            </div>

            {/* Final interactive Form CTA inputs */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-md mx-auto pt-4">
              <button
                onClick={() => scrollToSection("pricing")}
                className="px-8 py-4 bg-[#FCF50F] hover:bg-white text-gray-950 hover:text-[#011673] font-bold text-sm sm:text-base rounded-2xl shadow-premium-xl duration-300 flex items-center justify-center gap-2.5 shrink-0 grow cursor-pointer font-display select-none"
              >
                <Zap className="w-4.5 h-4.5 text-[#011673] fill-current" />
                <span>Get Started Now</span>
                <ArrowRight className="w-4.5 h-4.5 text-[#011673]" />
              </button>
            </div>

            <p className="text-[10.5px] text-gray-500 font-mono">
              Have questions prior to booking? Contact Admissions: <span className="text-gray-300 hover:underline cursor-pointer">admissions@aionlinebusiness.com</span>
            </p>

          </div>

        </div>
      </section>

      {/* FOOTER: Premium, corporate execution */}
      <footer className="bg-[#070A14] text-gray-400 py-16 border-t border-white/[0.04] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/[0.04]">
            
            {/* Branding Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <div className="w-8 h-8 rounded-lg bg-[#2D7FF9] flex items-center justify-center text-white font-bold relative overflow-hidden">
                  <Sparkles className="w-4.5 h-4.5 text-[#FCF50F]" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight text-white">
                  AIOnline<span className="text-[#2D7FF9]">Business</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-normal max-w-sm">
                AIOnlineBusiness is the premier academic institute on applied AI methodologies for founders, creators, freelancers, and ambitious workspace leaders.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-mono text-[9.5px] uppercase text-white font-bold tracking-widest">Programs</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><button onClick={() => scrollToSection("featured-programs")} className="hover:text-white transition-colors cursor-pointer">AI Business Mastery</button></li>
                <li><button onClick={() => scrollToSection("featured-programs")} className="hover:text-white transition-colors cursor-pointer">ChatGPT & Prompts</button></li>
                <li><button onClick={() => scrollToSection("featured-programs")} className="hover:text-white transition-colors cursor-pointer">AI Content Creator</button></li>
                <li><button onClick={() => scrollToSection("featured-programs")} className="hover:text-white transition-colors cursor-pointer">No-Code Developers</button></li>
              </ul>
            </div>

            {/* Tech Column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-mono text-[9.5px] uppercase text-white font-bold tracking-widest">Platform</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><button onClick={() => scrollToSection("why-us")} className="hover:text-white transition-colors cursor-pointer">Why Us</button></li>
                <li><button onClick={() => scrollToSection("learning-paths")} className="hover:text-white transition-colors cursor-pointer">Learning Paths</button></li>
                <li><button onClick={() => scrollToSection("curriculum")} className="hover:text-white transition-colors cursor-pointer font-sans">Full Curriculum</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-white transition-colors cursor-pointer">Pricing Tiers</button></li>
              </ul>
            </div>

            {/* Security Compliance Column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-mono text-[9.5px] uppercase text-white font-bold tracking-widest">Inquiries</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><span className="text-gray-500">Corporate:</span> <a href="mailto:info@aionlinebusiness.com" className="hover:text-white">info@aionlinebusiness.com</a></li>
                <li><span className="text-gray-500">Sponsorship:</span> <a href="mailto:partners@aionlinebusiness.com" className="hover:text-white">partners@aionlinebusiness.com</a></li>
              </ul>
            </div>

          </div>

          {/* Copyrights compliance */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10.5px] text-gray-500 font-mono uppercase tracking-wider">
            <span>© {new Date().getFullYear()} AIOnlineBusiness. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer hover:underline">Privacy Terms</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer hover:underline">Admissions Rules</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer hover:underline">Compliance Audits</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
