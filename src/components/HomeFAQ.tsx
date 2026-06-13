import React, { useState } from "react";
import { Plus, Minus, MessageCircle, Calendar } from "lucide-react";

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What technical background do I need to attend?",
      a: "None whatsoever. We construct learning from the ground up—starting with clear non-technical webhooks, building up to visual flows, and eventually showing you how to orchestrate background bots without writing complex software manually.",
    },
    {
      q: "Will I receive lifetime access to course content?",
      a: "Yes. Every student receives permanent lifetime access to the custom LMS dashboard, video archives, private cohort forums, and most importantly, free continuous updates to our code prompt libraries as models evolve.",
    },
    {
      q: "Are the academy certificates fully verifiable?",
      a: "Yes. Every graduate is issued an accredited certificate containing a unique verifiable database signature. Employers and clients can verify your specific portfolio and completion tier directly on our secure ledger pages.",
    },
    {
      q: "Is there a money-back guarantee?",
      a: "Absolutely. We provide a 14-day zero-risk money-back guarantee. If you are not satisfied with the sandbox pipelines or our community within the first two weeks, simply drop us an email and we will refund 100% of your ticket.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50/50 border-b border-gray-150">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056D2] px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider border border-blue-100">
            ❔ GENERAL SUPPORT
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#0B1B3D]">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Everything you need to know about the onboarding process, project sandbox, and payment policies.
          </p>
        </div>

        {/* Expandable FAQ grid */}
        <div className="space-y-4 text-left">
          {faqs.map((f, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-150 hover:border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs"
              >
                <div
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="p-6 flex justify-between items-center cursor-pointer select-none"
                >
                  <h3 className="font-sans font-bold text-sm sm:text-base text-[#0B1B3D] pr-4">
                    {f.q}
                  </h3>
                  <div className="shrink-0 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-[#0056D2]">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-500 leading-relaxed font-medium animate-in duration-200 fade-in border-t border-gray-100">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Advisor Contact Section */}
        <div className="mt-16 bg-white border border-gray-150 rounded-2xl p-8 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-lg text-[#0B1B3D]">
              Still have questions?
            </h3>
            <p className="text-xs text-gray-450 font-semibold">
              Talk to an expert admissions advisor via continuous live call or instant WhatsApp chat to assist you further.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-none">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-[#0056D2] hover:bg-[#003E9C] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule a Call</span>
            </a>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-[#08142B] border border-gray-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
