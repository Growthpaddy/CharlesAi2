/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Zap, Users, Cpu, Award } from "lucide-react";

export default function WhyUs() {
  const brandLogos = [
    { name: "Apex Leaders", type: "Tech" },
    { name: "Growth Labs", type: "Ventures" },
    { name: "Zuri Commerce", type: "eCom" },
    { name: "Nexus Devs", type: "Automations" }
  ];

  const features = [
    {
      title: "Learn Faster",
      desc: "Master real-world pipelines in hours with tested, copy-paste templates.",
      icon: Zap,
      badge: "10X EFFICIENCY",
      color: "text-[#2D7FF9] bg-[#2D7FF9]/10"
    },
    {
      title: "Industry Mentors",
      desc: "Study 1-on-1 with elite tech advisors and certified workflow automation experts.",
      icon: Users,
      badge: "EXECUTIVE GUILDS",
      color: "text-[#FCF50F] bg-[#08142B] border border-white/10"
    },
    {
      title: "Hands-on Projects",
      desc: "Engineer enterprise agents, webhook pipelines, and production code in dedicated sandboxes.",
      icon: Cpu,
      badge: "LIVE PRACTICE",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Recognized Certificates",
      desc: "Gain fully accredited micro-credentials verified on LinkedIn and leading corporate rosters.",
      icon: Award,
      badge: "SECURE CREDENTIAL",
      color: "text-purple-600 bg-purple-50"
    }
  ];

  return (
    <section id="why-us" className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trusted By Row */}
        <div className="text-center space-y-4 pb-12">
          <p className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-400">
            OUR ALUMNI DEPLOY AI AT WORLD-CLASS CORPORATIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14 pt-2">
            {brandLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="font-display font-bold text-xs sm:text-sm tracking-tight uppercase">
                  {logo.name}
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1 rounded">
                  {logo.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-150/90 rounded-2xl p-6 hover:border-gray-300 hover:shadow-premium transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${item.color}`}>
                    <Icon className="w-6 h-6 shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider uppercase block">
                      {item.badge}
                    </span>
                    <h3 className="font-display font-medium text-lg text-[#08142B]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-[240px]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
