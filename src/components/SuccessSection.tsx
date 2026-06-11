/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { successMetrics, instructorInfo } from "../data";
import { Award, Briefcase, Star, Sparkles, BookOpen, Clock, Heart, Users, CheckCircle, Shield } from "lucide-react";

export default function SuccessSection() {
  return (
    <div className="bg-[#0A0F1E] text-white">
      
      {/* SECTION 6: Success Outcomes (Massive Dark Premium Grid) */}
      <section id="outcomes" className="py-20 md:py-28 relative overflow-hidden">
        {/* Abstract vector glow effects */}
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#2D7FF9]/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full bg-[#FCF50F]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 bg-[#2D7FF9]/15 text-[#2D7FF9] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FCF50F]" />
              <span>ALUMNI BUSINESS OUTCOMES</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Quantifiable Growth engineered by our Alumni
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Our training revolves entirely around business systems. No abstract academic theorizing—just predictable, metrics-driven outcomes.
            </p>
          </div>

          {/* Grid Layout containing 6 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successMetrics.map((techStat, index) => {
              return (
                <div
                  key={index}
                  className="bg-white/[0.03] border border-white/[0.07] hover:border-[#2D7FF9]/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-premium-xl text-left hover:-translate-y-1 relative group"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#2D7FF9]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#FCF50F] tracking-tight">
                    {techStat.value}
                  </p>
                  <div className="mt-4 space-y-1.5">
                    <h3 className="font-bold text-sm sm:text-base text-white font-display">
                      {techStat.label}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-normal">
                      {techStat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 9: Meet Your Instructor (Editorial layout in Dark Mode for absolute prestige) */}
      <section id="instructor" className="py-20 md:py-28 bg-[#0D1326] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hand: High fidelity Portrait block featuring authentic African-American Female Executive */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Decorative radial frames */}
              <div className="absolute inset-0 bg-[#2D7FF9]/15 rounded-3xl blur-[30px] -z-10" />
              
              <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl p-2.5 bg-white/[0.02]">
                <img
                  src={instructorInfo.avatar}
                  alt={instructorInfo.name}
                  className="w-full max-w-[360px] h-[400px] object-cover rounded-2xl border border-white/[0.08]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float Badge */}
                <div className="absolute bottom-6 left-6 right-6 dark-glass border border-white/10 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FCF50F] flex items-center justify-center text-gray-900 font-bold shrink-0 text-xs">
                    ★
                  </div>
                  <div className="text-left font-serif">
                    <p className="text-[10px] font-mono uppercase text-[#FCF50F] tracking-widest font-semibold">Chief Mentor</p>
                    <p className="text-xs font-semibold text-white">Full Cohort Endorsement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hand: Bio Content with Credibility Grids */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1 text-[#FCF50F] text-xs font-mono tracking-wider uppercase">
                  <Award className="w-4 h-4" />
                  <span>World-Class Academic Leadership</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Meet Your Lead Architect
                </h2>
                <p className="text-lg font-semibold text-[#2D7FF9] font-display">
                  {instructorInfo.name} — {instructorInfo.role}
                </p>
                <p className="text-gray-305 text-sm sm:text-base text-gray-400 leading-relaxed font-normal">
                  {instructorInfo.bio}
                </p>
              </div>

              {/* Badges Stack */}
              <div className="flex flex-wrap gap-2">
                {instructorInfo.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-medium text-gray-300 flex items-center gap-1.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* Achievements checklists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {instructorInfo.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-300">
                    <CheckCircle className="w-4.5 h-4.5 text-[#FCF50F] shrink-0 mt-0.5" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>

              {/* Numeric micro-statistics grids */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08]">
                {instructorInfo.stats.map((statItem, idx) => (
                  <div key={idx} className="text-left font-sans">
                    <p className="text-2xl font-bold text-white font-display">
                      {statItem.value}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-mono tracking-wider mt-1">
                      {statItem.label}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
