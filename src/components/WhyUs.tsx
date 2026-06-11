/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cpu, DollarSign, Award, CheckCircle, Smartphone, Globe, Sparkles } from "lucide-react";

export default function WhyUs() {
  const brandLogos = [
    { name: "Digital Startups", type: "Tech Group" },
    { name: "Growth Agencies", type: "Consulting" },
    { name: "eCommerce Brands", type: "Retail Partners" },
    { name: "Modern Freelancers", type: "Network" },
    { name: "Global Consultants", type: "Enterprise" }
  ];

  const highlights = [
    {
      title: "Learn Practical AI",
      badge: "Real-World Integration",
      description: "Skip theoretical fluff. Study hard, functional automation code, complex prompt sheets, and API routing schemas that actual modern organizations pay thousands to configure.",
      icon: Cpu,
      gradient: "from-blue-500/10 to-[#2D7FF9]/20",
      accent: "text-[#2D7FF9]",
      extraElement: (
        <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100 font-mono text-[10px] text-gray-500 space-y-1">
          <p className="text-blue-600">// Initiate automated AI workflow</p>
          <p><span className="text-gray-900">const</span> agent = <span className="text-gray-900">new</span> CustomAgent(context);</p>
          <p>await agent.query(LLM_MODELS.SONNET_35);</p>
          <p className="text-[#12B76A]">console.log(\"✔ Task resolved autonomously\");</p>
        </div>
      )
    },
    {
      title: "Build Income Streams",
      badge: "Monetize AI Skills",
      description: "Establish dedicated modern consultancies, design customized digital automation assets, or command premium hourly rates. We show you exactly how to package your competence.",
      icon: DollarSign,
      gradient: "from-yellow-400/10 to-[#FCF50F]/20",
      accent: "text-amber-500",
      extraElement: (
        <div className="mt-6 grid grid-cols-2 gap-2 text-left">
          <div className="p-3 rounded-lg bg-white border border-gray-100">
            <p className="text-[9px] text-gray-400 uppercase">Consulting Fee</p>
            <p className="text-base font-bold text-[#101828] font-display">$5,000<span className="text-xs font-normal text-gray-500">/mo</span></p>
          </div>
          <div className="p-3 rounded-lg bg-white border border-gray-100">
            <p className="text-[9px] text-gray-400 uppercase">Automation Rev</p>
            <p className="text-base font-bold text-[#101828] font-display">$8,450<span className="text-xs font-normal text-gray-500">/mo</span></p>
          </div>
        </div>
      )
    },
    {
      title: "Stay Ahead of the Future",
      badge: "Future-Proof Your Career",
      description: "AI is not replacing workers—workers who utilize AI are replacing those who do not. Safeguard your role and stay ahead of the technical talent wave by months.",
      icon: Award,
      gradient: "from-emerald-500/10 to-[#12B76A]/20",
      accent: "text-[#12B76A]",
      extraElement: (
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle className="w-4 h-4 text-[#12B76A] shrink-0" />
            <span>Master 30+ Leading Business AI Tools</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle className="w-4 h-4 text-[#12B76A] shrink-0" />
            <span>Graduate with Verified Accreditation</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 bg-[#FAFBFC] border-t border-gray-100 relative">
      {/* Curved background line decorations */}
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
        <svg className="absolute w-full h-full text-gray-200" fill="none" viewBox="0 0 1440 800">
          <path d="M-100,200 C300,400 700,100 1100,500 C1300,700 1500,200 1600,300" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION 2: Trusted By */}
        <div className="text-center space-y-6 pb-20">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-450 font-semibold">
            Trusted by Professionals Building the Future With AI
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-20 pt-4">
            {brandLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors duration-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span className="font-display font-medium text-sm md:text-base tracking-tight uppercase">
                  {logo.name}
                </span>
                <span className="text-[10px] font-mono text-gray-300 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                  {logo.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Why AIOnlineBusiness */}
        <div className="pt-8 space-y-16">
          <div className="text-left md:text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-[#011673]/5 text-[#011673] px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#2D7FF9]" />
              <span>THE ACADEMY DIFFERENCE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
              Why Ambitious Leaders Choose AIOnlineBusiness
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              We design our curricula for rapid, immediate action. No high-level abstractions—just functional formulas, setup processes, and growth modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {highlights.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white border border-gray-200 hover:border-gray-350 rounded-3xl p-6 transition-all duration-300 hover:shadow-premium-xl flex flex-col justify-between overflow-hidden text-left"
                >
                  {/* Subtle hover background highlight */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10 space-y-5">
                    {/* Icon wrapper */}
                    <div className={`w-12 h-12 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center ${card.accent}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <span className="inline-block text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                        {card.badge}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[#101828]">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-normal">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Render simulated dashboard element for absolute authenticity */}
                  <div className="relative z-10">
                    {card.extraElement}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
