/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Sparkles, Calendar, BadgePercent, Target, Users, Landmark, 
  ArrowRight, CheckCircle2, ShieldCheck, Mail, Phone 
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigation } from "../context/NavigationContext";

export default function ServicesPage() {
  const { navigateTo, setLoginOpen } = useNavigation();

  const services = [
    {
      id: "srv-1",
      title: "One-on-One Coaching",
      price: "₦400,000",
      duration: "6 Weeks",
      tagline: "Ultra-personalized 1-on-1 mentorship directly aligned with your business or career.",
      icon: Target,
      popular: true,
      accentColor: "border-[#2D7FF9] ring-2 ring-[#2D7FF9]/20 shadow-premium",
      features: [
        "Weekly Live Video Consultations",
        "Personalized Custom Learning Path",
        "Direct Mentor Slack & WhatsApp Thread Support",
        "Practical Line-by-Line Assignment Audits",
        "Complete Portfolio Capstone Project",
        "Lifetime Private Alumni Hub Access"
      ]
    },
    {
      id: "srv-2",
      title: "Group Training",
      price: "",
      duration: "1 Month",
      tagline: "Highly intensive peer mastermind groups working on rapid real-world products launch.",
      icon: Users,
      popular: false,
      accentColor: "border-gray-150 shadow-sm",
      features: [
        "Intensive Mastermind Lectures",
        "Group Peer Coaching Circles",
        "Practical Shared Weekly Projects",
        "Community Discord Master Channels Access",
        "Direct Feedback on Submission Windows",
        "Verified Academy Graduation Certificate"
      ]
    },
    {
      id: "srv-3",
      title: "Corporate & Institutional Training",
      price: "",
      duration: "Flexible Schedule",
      tagline: "Bespoke AI training programs delivered directly to churches, companies, businesses, schools and organizations across Nigeria.",
      icon: Landmark,
      popular: false,
      accentColor: "border-gray-150 shadow-sm",
      features: [
        "Customized Operational Modules",
        "Physical (In-Person Lagos/Abuja) or Virtual interactive workshops",
        "Team Practical Labs & Real Sandbox setups",
        "Direct Implementation & Deployment Onboarding support",
        "Continuous Performance Auditing Resources"
      ]
    }
  ];

  return (
    <section id="services-page" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-[#2D7FF9] items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>ACADEMY SOLUTIONS & SERVICES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-[#08142B] tracking-tight">
            Our Official AI Training & Coaching Programs
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Delivering practical, high-value AI capability training designed to help individuals and professional teams build profitable online businesses.
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
          {services.map((srv) => (
            <motion.div
              key={srv.id}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className={`bg-white border rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between text-left transition-all ${srv.accentColor}`}
            >
              {srv.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2D7FF9] text-white px-4 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow border border-blue-400">
                  ★ MOST POPULAR COHORT TRACK
                </span>
              )}

              <div className="space-y-6">
                {/* Visual Icon Header */}
                <div className="flex justify-between items-start">
                  <div className={`p-4 rounded-2xl ${srv.popular ? "bg-blue-50 text-[#2D7FF9]" : "bg-gray-50 text-gray-550"}`}>
                    <srv.icon className="w-7 h-7" />
                  </div>
                  {srv.price ? (
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block tracking-wider">Tuition Fee</span>
                      <span className="text-2xl font-black font-display text-[#08142B]">{srv.price}</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block tracking-wider">Tuition Pricing</span>
                      <span className="text-xs font-extrabold text-[#2D7FF9] block mt-1 bg-blue-50/50 px-2 py-0.5 rounded-md">Price on Request</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-extrabold text-xl text-[#08142B]">{srv.title}</h3>
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">{srv.duration}</span>
                  </div>
                  <p className="text-xs text-slate-550 leading-relaxed leading-normal">{srv.tagline}</p>
                </div>

                <hr className="border-gray-150/60" />

                {/* Features Checklist */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] font-mono font-extrabold text-gray-400 tracking-wider uppercase">Included Modules & Assets:</h4>
                  <ul className="space-y-2.5">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-semibold">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-8">
                <button
                  onClick={() => {
                    if (srv.id === "srv-1") {
                      navigateTo("checkout");
                    } else {
                      navigateTo("contact");
                    }
                  }}
                  className={`w-full py-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 group min-h-[48px] ${
                    srv.popular
                      ? "bg-[#2D7FF9] hover:bg-[#003E9C] text-white shadow-premium"
                      : "bg-gray-50 hover:bg-gray-100 text-[#08142B] border border-gray-200"
                  }`}
                >
                  <span>
                    {srv.id === "srv-1" 
                      ? "Enroll & Proceed to Checkout" 
                      : srv.id === "srv-2" 
                        ? "Contact to Register Group" 
                        : "Inquire For Organization"}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Corporate Trust Banner */}
        <div className="bg-[#08142B] rounded-3xl p-8 sm:p-12 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8 text-left max-w-5xl mx-auto shadow-xl">
          <div className="absolute inset-0 bg-[#2D7FF9]/10 blur-xl pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest uppercase bg-[#2D7FF9]/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Institutional Provider
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-black tracking-tight leading-none leading-tight">
              We deliver elite tailored AI programs to faith assemblies, schools, & companies in Nigeria.
            </h3>
            <p className="text-slate-350 text-xs leading-relaxed leading-normal">
              Empower your team, church members, or school staff with hands-on, high-consequence AI digital products creation, prompt engineering, and operational automation pipelines today.
            </p>
          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigateTo("contact")}
              className="bg-white hover:bg-gray-50 text-[#08142B] font-extrabold px-6 py-3.5 rounded-xl transition-all text-xs cursor-pointer min-h-[44px]"
            >
              Book Consultation Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
