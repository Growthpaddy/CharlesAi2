/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { pricingPlans, bonuses } from "../data";
import { Check, X, FileCode, FolderSync, Presentation, Video, Sparkles, HelpCircle, ArrowRight, ShieldAlert, Award } from "lucide-react";

const bonusIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileCode,
  FolderSync,
  Presentation,
  Video
};

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const calcPrice = (name: string, basePrice: string) => {
    const numeric = parseInt(basePrice.replace("$", ""));
    if (billingCycle === "annually" && name !== "Partner Summit") {
      // 20% discount
      return `$${Math.round(numeric * 0.8)}`;
    }
    return basePrice;
  };

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#FAFBFC] relative border-b border-gray-100">
      
      {/* Decorative gradient overlay backgrounds */}
      <div className="absolute top-[10%] right-[-100px] w-[450px] h-[450px] rounded-full bg-[#2D7FF9]/4 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-150px] w-[500px] h-[500px] rounded-full bg-[#FCF50F]/4 blur-[120px] pointer-events-none" />

      {/* SECTION 11: Pricing Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#011673]/5 text-[#011673] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2D7FF9]" />
            <span>EXPERT INVESTMENTS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#101828]">
            Invest in Your High-Value AI Competence
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Choose a plan tailored to your speed, automation requirements, or bespoke 1-on-1 development consultation needs.
          </p>

          {/* Billing Cycle Toggle bar */}
          <div className="inline-flex bg-gray-100 p-1 rounded-2xl items-center relative z-10 border border-gray-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#011673] text-white shadow"
                  : "text-gray-550 hover:text-gray-900"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 focus:outline-none ${
                billingCycle === "annually"
                  ? "bg-[#011673] text-white shadow"
                  : "text-gray-550 hover:text-gray-900"
              }`}
            >
              <span>Annually billing</span>
              <span className="bg-[#FCF50F] text-gray-900 px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold uppercase animate-pulse">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-16 items-start">
          {pricingPlans.map((plan, index) => {
            return (
              <div
                key={index}
                className={`group bg-white border rounded-3xl p-6 md:p-8 transition-all duration-300 relative flex flex-col justify-between text-left ${
                  plan.popular
                    ? "border-[#2D7FF9] ring-1 ring-[#2D7FF9]/40 shadow-premium-xl -translate-y-2 lg:-translate-y-4"
                    : "border-gray-250/80 shadow-sm hover:shadow-premium hover:-translate-y-1"
                }`}
              >
                {/* Popular highlight pill */}
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2D7FF9] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono shadow-sm flex items-center gap-1 select-none">
                    <Sparkles className="w-3.5 h-3.5 text-[#FCF50F] fill-current" />
                    MOST POPULAR SOLUTION
                  </span>
                )}

                <div className="space-y-6">
                  {/* Category, Price, and Tagline */}
                  <div className="space-y-2">
                    <p className="text-xs font-mono font-bold tracking-widest text-[#2D7FF9] uppercase">
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-1 pt-1 font-display">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#101828]">
                        {calcPrice(plan.name, plan.price)}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">
                        {plan.name === "Partner Summit" ? "" : billingCycle === "annually" ? "/mo (billed annually)" : plan.period}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal pt-2">
                      {plan.tagline}
                    </p>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Included Features */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                      WHAT IS INCLUDED IN THIS PLAN:
                    </h4>
                    <ul className="space-y-3 font-sans">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-3 items-start text-xs text-gray-600">
                          <Check className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5" />
                          <span className="font-semibold text-gray-700">{feature}</span>
                        </li>
                      ))}
                      
                      {/* Enforce excluded features for visual hierarchy mapping */}
                      {plan.excludedFeatures && plan.excludedFeatures.map((exFeature, idx) => (
                        <li key={idx} className="flex gap-3 items-start text-xs text-gray-400 opacity-60">
                          <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span className="line-through">{exFeature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card footer dynamic CTA button */}
                <div className="pt-8">
                  <button
                    onClick={() => alert(`Enrolling program initiated! This triggers checkout for ${plan.name} on standard payment flows.`)}
                    className={`w-full py-4 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 font-display ${
                      plan.popular
                        ? "bg-[#011673] hover:bg-[#2D7FF9] text-white shadow-premium-xl glow-btn"
                        : "bg-gray-50 hover:bg-gray-150 text-[#101828] border border-gray-150"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[9px] text-gray-450 mt-2 font-mono uppercase tracking-wider">
                    Instant Secure Checkout • Cancel plans anytime
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 12: High-Value Bonuses (Large stacked cards displaying $4,400+ valuation metrics) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
        <div className="space-y-12">
          {/* Section titles */}
          <div className="text-left md:text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-[#12B76A]/10 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-[#12B76A]" />
              <span>OVER $4,480 PREMIUM VALUE INCORPORATED</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
              Unlocking Cohort Growth Bonuses
            </h2>
            <p className="text-base text-gray-500 leading-relaxed font-normal">
              Students unlocking the flagship training receive complimentary access to our highly guarded business assets, slides, calendars, and live reviews.
            </p>
          </div>

          {/* Grid Layout of Bonuses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {bonuses.map((bonus) => {
              const BonusIcon = bonusIconMap[bonus.icon] || FileCode;
              return (
                <div
                  key={bonus.id}
                  className="bg-white border border-gray-200 hover:border-gray-355 rounded-3xl p-6 transition-all duration-300 hover:shadow-premium flex flex-col justify-between text-left group"
                >
                  <div className="space-y-4">
                    {/* Badge & Value */}
                    <div className="flex justify-between items-center">
                      <span className="bg-[#2D7FF9]/10 text-[#011673] text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-lg uppercase">
                        {bonus.badge}
                      </span>
                      <span className="text-[10px] font-mono font-extrabold text-amber-600">
                        {bonus.value}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#2D7FF9] group-hover:bg-[#011673] group-hover:text-white transition-colors duration-300">
                        <BonusIcon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-base text-[#101828]">
                        {bonus.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        {bonus.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-semibold font-mono">
                    <span>STATUS: ALLOCATED</span>
                    <span className="text-[#12B76A]">FREE</span>
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
