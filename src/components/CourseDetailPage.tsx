/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ChevronLeft, GraduationCap, Video, Layers, Users, Clock, ShoppingCart, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface CompleteCourseMap {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  instructor_bio: string;
  price_naira: number;
  cover_url: string;
  video_url: string;
  duration_text: string;
}

export default function CourseDetailPage({ courseId, onNavigate }: { courseId: string; onNavigate: (page: string, params?: any) => void }) {
  const [course, setCourse] = useState<CompleteCourseMap | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    
    async function loadWholeCurriculumMap() {
      try {
        const { data: cData } = await supabase.from("courses").select("*").eq("id", courseId).single();
        setCourse(cData);

        const { data: mData } = await supabase.from("modules").select("*").eq("course_id", courseId).order("order_index");
        setModules(mData || []);

        const { data: lData } = await supabase.from("lessons").select("*").order("order_index");
        setLessons(lData || []);
      } catch (err) {
        console.error("Error constructing dynamic matrix:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWholeCurriculumMap();
  }, [courseId]);

  if (isLoading) return <div className="min-h-screen bg-slate-50" />;
  if (!course) return <div className="p-8 text-center text-xs font-bold text-slate-500">Course Matrix Allocation Fault.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <div className="max-w-5xl mx-auto py-10 px-6 space-y-8">
        
        <button 
          onClick={() => onNavigate("shop")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Course details and curriculum layout */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="inline-block text-[9px] font-bold tracking-widest text-slate-400 bg-slate-50 border px-2.5 py-0.5 rounded uppercase">{course.duration_text || "Self-Paced Track"}</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">{course.title}</h1>
              <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>
            </div>

            {/* Structured Curriculum Map */}
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Course Blueprint Structure
              </h2>
              
              {modules.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-white border border-slate-200 rounded-2xl p-6">No study modules populated yet.</p>
              ) : (
                modules.map((mod) => (
                  <div key={mod.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded flex items-center justify-center">{mod.order_index}</span>
                      {mod.title}
                    </h3>
                    
                    <div className="pl-7 space-y-2.5 border-l border-slate-100">
                      {lessons.filter(l => l.module_id === mod.id).length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">No modules lectures available under this section.</p>
                      ) : (
                        lessons.filter(l => l.module_id === mod.id).map((les) => (
                          <div key={les.id} className="flex items-start justify-between text-[11px] bg-slate-50/50 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-colors">
                            <div className="space-y-0.5 max-w-md">
                              <p className="font-bold text-slate-800 flex items-center gap-1.5"><Video className="w-3 h-3 text-slate-400" /> {les.title}</p>
                              <p className="text-slate-400 leading-normal text-[10px]">{les.description}</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border flex-shrink-0">{les.duration_minutes}m</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Instructor Details Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Lead Instructor Profile</h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white font-black rounded-xl flex items-center justify-center uppercase shadow-sm">{course.instructor_name?.charAt(0) || "T"}</div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{course.instructor_name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{course.instructor_bio || "No profile narrative currently added for this master tutor."}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Conversion / Action Panel */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md sticky top-6 space-y-5">
              <div className="rounded-2xl overflow-hidden bg-slate-50 border aspect-video relative flex items-center justify-center text-slate-400">
                {course.cover_url ? (
                  <img src={course.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <GraduationCap className="w-6 h-6 stroke-1" />
                    <span className="text-[10px]">Course Asset Cover</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Course Investment</span>
                <div className="text-2xl font-black text-slate-900 tracking-tight">₦{Number(course.price_naira).toLocaleString()}</div>
              </div>

              <button
                onClick={() => onNavigate("checkout", { courseId: course.id })}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Enroll Into Course Now
              </button>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> High-definition video streams</div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Full verification access</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}