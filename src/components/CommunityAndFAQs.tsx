/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ChevronDown, Send, Users, ShieldAlert, Check, HelpCircle, 
  ArrowRight, Zap, Sparkles, Sliders, Calendar, HelpCircle as HelpIcon,
  Twitter, Linkedin, Github, MessageSquare
} from "lucide-react";
import { useNavigation, ViewType } from "../context/NavigationContext";

export default function CommunityAndFAQs() {
  const { navigateTo } = useNavigation();
  const [expandedFaq, setExpandedFaq] = useState<string | null>("faq-1");
  const [activeChannel, setActiveChannel] = useState("#automation-challenges");
  
  const communityChannels = [
    { title: "#automation-challenges", desc: "API configurations and code blueprints" },
    { title: "#general-strategy", desc: "Cohort strategy audits & growth plans" },
    { title: "#freelance-gigs", desc: "Premium contract scouting boards" },
    { title: "#live-reviews", desc: "Weekly live video screenshare times" }
  ];

  const onlineUsers = [
    { name: "Aisha Peterson", role: "Auditor", status: "online" },
    { name: "Marcus Adebayo", role: "Expert", status: "online" },
    { name: "Tariq Jackson", role: "Founder", status: "online" },
    { name: "Nia Mitchell", role: "Designer", status: "online" }
  ];

  const channelMessages: Record<string, Array<{ user: string; role: string; avatar: string; text: string }>> = {
    "#automation-challenges": [
      {
        user: "Tariq Jackson",
        role: "Founder",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Just linked Apollo scraping loops with ChatGPT Actions. Generated 14 high-quality leads in 30 minutes!"
      },
      {
        user: "Nia Mitchell",
        role: "Designer",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Pushed my Runway Gen-3 text-to-video workflow instructions to the workspace resources drive. Check it out!"
      },
      {
        user: "Marcus Adebayo",
        role: "Expert",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Grabs Module 5 Lesson 4 custom Webhook retries for JSON exceptions in Make.com loops. It works instantly."
      }
    ],
    "#general-strategy": [
      {
        user: "Aisha Peterson",
        role: "Auditor",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Audited an eCom store. Dr. Cole's frameworks exposed 15 hours lost weekly in support manual mail. Pitching today!"
      }
    ],
    "#freelance-gigs": [
      {
        user: "Marcus Adebayo",
        role: "Expert",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Looking for an automation partner to install custom WhatsApp response agents. Paying $3,200 project fee."
      }
    ],
    "#live-reviews": [
      {
        user: "Dr. Sandra Cole",
        role: "Instructor",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100",
        text: "Excited for today's system screenshare audit. Bring your active Make loops on Wednesday, 4PM UTC."
      }
    ]
  };

  const faqItems = [
    {
      id: "faq-1",
      question: "Do I need previous coding or technical experience to start?",
      answer: "No coding experience is required. We teach visual workflows, copy-paste templates, and easy playground interfaces from scratch."
    },
    {
      id: "faq-2",
      question: "Are API keys and recurring cost expenses included?",
      answer: "All tools we teach have free tiers, and we show you how to optimize API budgets to keep costs minimal."
    },
    {
      id: "faq-3",
      question: "How long do I keep access to these materials?",
      answer: "Yes, you receive permanent unrestricted lifetime access to all core modules, templates, live webinars, and future upgrades."
    },
    {
      id: "faq-4",
      question: "Can I apply these frameworks outside of the US/EU?",
      answer: "Yes. Our frameworks focus on cloud-hosted global systems, localized Stripe payments, and international digital consultancy packages."
    },
    {
      id: "faq-5",
      question: "What is the community setup, and are there actual live events?",
      answer: "Very active. We host live weekly workshops, team collaborations, and dedicated client scouting boards on Slack."
    }
  ];

  const scrollToSection = (id: string) => {
    const idToView: Record<string, ViewType> = {
      "featured-programs": "programs",
      "learning-paths": "paths",
      "testimonials": "success",
      "why-us": "about",
      "faqs": "resources",
      "pricing": "pricing"
    };

    const targetView = idToView[id];
    if (targetView) {
      navigateTo(targetView);
    } else {
      navigateTo("home");
    }
  };

  return (
    <div className="bg-[#FAFBFC]">
      
      {/* SECTION 10: THRIVING COMMUNITY PREVIEW (Discord/Slack Theme simulator) */}
      <section id="community" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/10 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>THRIVING GLOBAL COHORT</span>
            </div>
            {/* Heading limit: max 10 words */}
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
              Never Study Solo. Meet Your Digital AI Cohort.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Sidebar Channel Selector */}
            <div className="lg:col-span-4 bg-[#FAFBFC] border border-gray-150 rounded-2xl p-4 text-left flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase block">
                  CHANNELS FORUMS
                </span>
                <div className="space-y-2">
                  {communityChannels.map((channel, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveChannel(channel.title)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                        activeChannel === channel.title
                          ? "bg-white border-[#2D7FF9] shadow-sm text-[#2D7FF9]"
                          : "bg-transparent hover:bg-white border-transparent text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-400">#</span>
                        <div className="text-left leading-none">
                          <p className="text-xs font-bold">{channel.title.replace("#", "")}</p>
                          <p className="text-[9px] text-gray-400 font-normal mt-0.5 max-w-[180px] truncate">{channel.desc}</p>
                        </div>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly event schedule card */}
              <div className="bg-[#08142B] text-white p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#FCF50F] font-bold">
                  <Calendar className="w-4 h-4" />
                  <span>UPCOMING EVENT</span>
                </div>
                <div>
                  <p className="text-xs font-semibold">Live Audit Office Hours</p>
                  <p className="text-[10px] text-zinc-400">Wednesday, 4:00 PM UTC • Dr. Cole</p>
                </div>
                <button 
                  onClick={() => scrollToSection("pricing")}
                  className="w-full bg-[#2D7FF9] hover:bg-white text-white hover:text-[#08142B] py-2 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer min-h-[36px]"
                >
                  RSVP Inside Cohort
                </button>
              </div>
            </div>

            {/* Chat Simulator Canvas */}
            <div className="lg:col-span-8 bg-[#08142B] text-slate-100 rounded-2xl border border-white/5 shadow-xl overflow-hidden flex flex-col justify-between min-h-[420px] text-left">
              
              {/* Header */}
              <div className="bg-[#0a1834] px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#FCF50F] text-lg">#</span>
                  <span className="text-xs font-mono font-bold tracking-tight uppercase text-zinc-200">
                    {activeChannel.replace("#", "")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md text-[10px] text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>94 Alumni Active</span>
                </div>
              </div>

              {/* Conversation list */}
              <div className="flex-1 p-5 space-y-5 overflow-y-auto max-h-[290px]">
                {channelMessages[activeChannel]?.map((msg, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <img 
                      src={msg.avatar} 
                      alt={msg.user}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-white leading-none">{msg.user}</span>
                        <span className="text-[8px] font-mono font-bold uppercase bg-white/5 text-zinc-400 px-1 rounded">{msg.role}</span>
                      </div>
                      {/* Short snappy messages */}
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulated send input */}
              <div className="p-4 bg-[#0a1834] border-t border-white/5 flex gap-2">
                <input 
                  type="text" 
                  disabled
                  placeholder={`Send prompt to ${activeChannel}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 pointer-events-none"
                />
                <button 
                  disabled 
                  className="p-2 py-2 bg-blue-600/35 text-white rounded-lg opacity-40 shrink-0 cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 11: FAQ Accordions */}
      <section id="faqs" className="py-20 bg-[#FAFBFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-4 mb-16">
            <div className="inline-[#2D7FF9] inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 bg-gradient-to-r rounded-full text-xs font-semibold font-mono tracking-wider">
              <HelpIcon className="w-3.5 h-3.5" />
              <span>COMMONLY ENCOUNTERED INQUIRIES</span>
            </div>
            {/* Heading limit: max 10 words */}
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
              Frequently Asked Questions and Integration Policies
            </h2>
          </div>

          {/* Clean accordions: questions only initially */}
          <div className="space-y-4">
            {faqItems.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="bg-white border border-gray-150 rounded-xl overflow-hidden transition-all text-left"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left select-none cursor-pointer focus:outline-none focus:ring-0 min-h-[48px]"
                  >
                    <span className="font-display font-bold text-sm sm:text-base text-[#08142B]">
                      {faq.question}
                    </span>
                    <div className="p-1.5 rounded bg-gray-50 shrink-0">
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50/80">
                      {/* answer limit under 20 words */}
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 12: FINAL PRESTIGE URGENCY CTA */}
      <section id="cta" className="py-20 bg-[#08142B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2D7FF9]/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-white/[0.02] border border-white/5 p-8 md:p-14 rounded-3xl text-center space-y-6 relative">
            <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[#2D7FF9] to-transparent" />
            
            <div className="inline-flex items-center gap-1.5 bg-[#FCF50F] text-zinc-950 px-4 py-1 rounded-full text-[10px] font-mono tracking-widest font-black animate-pulse uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ONLY 14 COHORT PLOTS REMAINING FOR THE SESSION</span>
            </div>

            {/* Heading limit: max 10 words */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Secure Your Premium AI Education Blueprint?
            </h2>

            {/* Supporting label strictly < 20 words */}
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Accelerate your operations, unlock lifetime updates, and master real-world AI pipelines starting today.
            </p>

            {/* Triple checklists to improve conversion trust */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 text-[11px] text-gray-300 pt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>30-Day Tuition Warranty</span>
              </div>
              <div className="hidden sm:block text-white/10">|</div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Instant Blueprints Handout</span>
              </div>
              <div className="hidden sm:block text-white/10">|</div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Verified Resume Credential</span>
              </div>
            </div>

            {/* CTAs touch targets >= 48px */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3.5 max-w-sm mx-auto pt-4">
              <button 
                onClick={() => scrollToSection("pricing")}
                className="bg-[#FCF50F] hover:bg-white text-zinc-950 hover:text-[#08142B] font-bold text-xs px-6 py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[48px]"
              >
                <Zap className="w-4 h-4 text-emerald-800" />
                <span>Enroll Today</span>
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/20 font-bold text-xs px-6 py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center min-h-[48px]"
              >
                <span>Book Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
