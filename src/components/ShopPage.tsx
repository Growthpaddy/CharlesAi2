/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, Clock, User, ArrowRight, Image } from "lucide-react";
import { supabase } from "../lib/supabase";

interface CourseCardData {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  price_naira: number;
  cover_url: string;
  duration_text: string;
}

export default function ShopPage({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStorefrontCourses() {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("id, title, description, instructor_name, price_naira, cover_url, duration_text")
          .order("title");
        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error("Error loading shop catalog:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStorefrontCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-2.5 w-2.5 bg-slate-900 rounded-full"></div>
          <div className="h-2.5 w-2.5 bg-slate-900 rounded-full"></div>
          <div className="h-2.5 w-2.5 bg-slate-900 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Public Catalog</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Elevate Your Business Engine</h1>
          <p className="text-xs text-slate-500">Premium structured digital courses curated by industry practitioners.</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl max-w-sm mx-auto">
            <BookOpen className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">Catalog is Currently Empty</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Check back shortly for our initial course releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id}
                onClick={() => onNavigate("course-detail", { courseId: course.id })}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-slate-100 relative border-b border-slate-100 overflow-hidden">
                    {course.cover_url ? (
                      <img src={course.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1.5">
                        <Image className="w-5 h-5 stroke-1" />
                        <span className="text-[10px] tracking-wide">Preview Unavailable</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900/90 text-white font-black text-xs rounded-xl shadow-sm">
                      ₦{Number(course.price_naira).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration_text || "Self-Paced"}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight line-clamp-1 group-hover:text-slate-700 transition-colors">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-50 mt-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded flex items-center justify-center uppercase">{course.instructor_name?.charAt(0) || "U"}</div>
                    <span className="text-[11px] font-semibold text-slate-700">{course.instructor_name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}