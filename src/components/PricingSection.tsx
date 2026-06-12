/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Check, X, FileCode, FolderSync, Presentation, Video, Sparkles, ArrowRight, Award, ShieldCheck, Zap } from "lucide-react";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Starter Bundle",
      price: billingCycle === "annually" ? "$39" : "$49",
      period: "/month",
      tagline: "Equip yourself with practical AI prompt models and core productivity patterns.",
      features: [
        "Access to 4 Core Paths",
        "50+ Detailed video chapters",
        "Standard Prompt databases",
        "Private Slack support forum"
      ],
      excluded: [
        "Advanced automation blueprints",
        "Bespoke 1-on-1 weekly consultations"
      ],
      cta: "Begin Starter Path",
      popular: false
    },
    {
      name: "Professional Plan",
      price: billingCycle === "annually" ? "$79" : "$99",
      period: "/month",
      tagline: "Our flagship training system to construct high-performance AI automations and client models.",
      features: [
        "Access to ALL 10 Paths",
        "Weekly live coaching sessions",
        "1,500+ Production prompt sheets",
        "Premium Make & Zapier templates",
        "AI Agency client slide pitches"
      ],
      excluded: [],
      cta: "Unlock Flagship Plan",
      popular: true
    },
    {
      name: "Partner Summit",
      price: "$299",
      period: "/one-time",
      tagline: "The absolute premium experience with direct 1-to-1 operational blueprint design & audits.",
      features: [
        "Everything in Flagship Plan",
        "Dedicated 1-on-1 blueprint review",
        "Direct Slack link with architects",
        "Custom code-generation support"
      ],
      excluded: [],
      cta: "Apply For Summit",
      popular: false
    }
  ];

  const bonuses = [
    {
      title: "Master AI Prompt Library",
      desc: "1,500+ ultra-specific, production-tested prompt sheets covering business strategy.",
      value: "$497 VALUE",
      icon: FileCode
    },
    {
      title: "Automation Blueprints",
      desc: "Exportable Make.com templates. Launch multi-step workflows in precisely three clicks.",
      value: "$997 VALUE",
      icon: FolderSync
    },
    {
      title: "AI Agency Pitch Decks",
      desc: "Identical contract layouts and strategic sales pitch slides we use.",
      value: "$595 VALUE",
      icon: Presentation
    },
    {
      title: "Weekly Office Hours",
      desc: "Review active pipelines live on video with Dr. Sandra Cole.",
      value: "$2,400 VALUE",
      icon: Video
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center space-y-6">
          <div className="inline-[#2D7FF9] inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPERT ACADEMIC INVESTMENT</span>
          </div>
          {/* Headings < 10 words */}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#08142B]">
            Invest in Your High-Value Practical AI Competence
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Choose a path tailored to your speed, automation pipelines, and direct advisor consultation objectives.
          </p>

          {/* Billing Cycle Switch */}
          <div className="inline-flex bg-gray-50 p-1 rounded-xl items-center border border-gray-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none min-h-[36px] ${
                billingCycle === "monthly"
                  ? "bg-[#08142B] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none min-h-[36px] flex items-center gap-1.5 ${
                billingCycle === "annually"
                  ? "bg-[#08142B] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>Annually</span>
              <span className="bg-[#FCF50F] text-[#08142B] px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-16 items-stretch">
          {plans.map((pl, idx) => (
            <div
              key={idx}
              className={`group bg-white border rounded-2xl p-6 sm:p-8 transition-all duration-300 relative flex flex-col justify-between text-left ${
                pl.popular
                  ? "border-[#2D7FF9] ring-1 ring-[#2D7FF9]/45 shadow-premium lg:-translate-y-2"
                  : "border-gray-150 shadow-sm"
              }`}
            >
              {pl.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2D7FF9] text-white px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shadow">
                  ★ RECOMMENDED COHORT CHOICE
                </span>
              )}

              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-[#2D7FF9] uppercase">
                    {pl.name}
                  </h3>
                  <div className="flex items-baseline gap-1 pt-1 font-display">
                    <span className="text-4xl font-extrabold text-[#08142B]">{pl.price}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {pl.name === "Partner Summit" ? "" : billingCycle === "annually" ? "/mo (billed annually)" : pl.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-2">
                    {pl.tagline}
                  </p>
                </div>

                <hr className="border-gray-50" />

                {/* Features list */}
                <div className="space-y-3.5">
                  <h4 className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                    INCLUSIONS & BLUEPRINTS:
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {pl.features.map((fe, i) => (
                      <li key={i} className="flex gap-2 items-start text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-semibold">{fe}</span>
                      </li>
                    ))}
                    {pl.excluded.map((ex, i) => (
                      <li key={i} className="flex gap-2 items-start text-slate-350 opacity-60">
                        <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span className="line-through">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setSuccessPlan(pl.name)}
                  className={`w-full py-3 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 min-h-[48px] ${
                    pl.popular
                      ? "bg-[#2D7FF9] hover:bg-[#08142B] text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-[#08142B] border border-gray-150"
                  }`}
                >
                  <span>{pl.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* High-Value Bonuses List */}
        <div className="pt-24">
          <div className="text-left md:text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>OVER $4,400 WORTH OF COHORT ASSETS INCLUDED</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#08142B]">
              Receive Instant Access to These Elite Bonuses
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bonuses.map((bn, idx) => {
              const Icon = bn.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-150 rounded-2xl p-5 hover:border-gray-350 transition-all text-left flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-gray-400">
                      <span>LIFETIME SYSTEM</span>
                      <span className="text-amber-600">{bn.value}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#2D7FF9]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-sm text-[#08142B]">{bn.title}</h3>
                      <p className="text-xs text-slate-500 leading-normal">{bn.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Inline Integration Success Checkout Dialog Overlay */}
      {successPlan && (
        <div className="fixed inset-0 bg-[#08142B]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-xl text-[#08142B]">Initiating Security Checkout</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Connecting with secure Stripe client server portals. Your session for the elite <strong className="text-gray-900">{successPlan}</strong> is verified.
              </p>
            </div>

            <div className="flex justify-center items-center gap-1.5 py-1 text-[11px] font-mono text-zinc-400 bg-gray-50 rounded-lg max-w-xs mx-auto">
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span>100% SECURE SSL CHECKSUMS ACTIVE</span>
            </div>

            <button 
              onClick={() => setSuccessPlan(null)}
              className="w-full bg-[#08142B] hover:bg-[#2D7FF9] text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px]"
            >
              Proceed to Stripe Sandbox
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
