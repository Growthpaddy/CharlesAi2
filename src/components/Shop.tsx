/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Clock, ArrowRight, Search, Sparkles, 
  Filter, AlertCircle, Award, Star, RefreshCw, Layers 
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useNavigation } from "../context/NavigationContext";

interface CourseRecord {
  id: string;
  title: string;
  tagline: string;
  overview: string;
  description?: string;
  instructor_name: string;
  instructor_bio?: string;
  price_naira: number;
  cover_url?: string;
  thumbnail_url?: string;
  duration_text?: string;
  duration?: string;
  difficulty?: string;
}

interface ShopProps {
  onNavigate?: (page: string, params?: any) => void;
}

export default function Shop({ onNavigate }: ShopProps) {
  const { navigateTo, setActiveCourseId } = useNavigation();
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"title" | "price-asc" | "price-desc">("title");

  const fetchStorefrontCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error: sbError } = await supabase
          .from("courses")
          .select("*")
          .order("title");

        if (sbError) throw sbError;
        setCourses(data || []);
      } else {
        // Local state fallback or seed courses
        const localData = localStorage.getItem("courses");
        if (localData) {
          const parsed = JSON.parse(localData);
          const mapped = parsed.map((c: any) => ({
            id: c.id,
            title: c.title || "",
            tagline: c.description || "",
            overview: c.overview || c.description || "",
            instructor_name: c.instructorName || "Academy Expert",
            price_naira: typeof c.price === "number" ? c.price : parseInt(String(c.price).replace(/[^0-9]/g, "")) || 45000,
            thumbnail_url: c.thumbnail || c.thumbnail_url || "",
            cover_url: c.thumbnail || c.thumbnail_url || "",
            duration_text: c.duration || "Self-Paced Track",
            difficulty: c.level || "Beginner"
          }));
          setCourses(mapped);
        } else {
          // Default fallbacks if nothing is in local storage
          setCourses([]);
        }
      }
    } catch (err: any) {
      console.error("Error fetching courses from catalog store:", err);
      setError(err.message || "Could not retrieve courses from repository.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorefrontCourses();
  }, []);

  const handleViewDetails = (courseId: string) => {
    if (onNavigate) {
      onNavigate("course_details", { courseId });
    } else {
      setActiveCourseId(courseId);
      navigateTo("course_details");
    }
  };

  // Helper to safely format Nigerian Naira pricing
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filtering & Sorting Process
  const filteredCourses = courses
    .filter((course) => {
      const matchSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.tagline || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.overview || "").toLowerCase().includes(searchTerm.toLowerCase());

      const courseDiff = (course.difficulty || "Beginner").toLowerCase();
      const matchDifficulty = selectedDifficulty === "all" || courseDiff === selectedDifficulty.toLowerCase();

      return matchSearch && matchDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price_naira - b.price_naira;
      }
      if (sortBy === "price-desc") {
        return b.price_naira - a.price_naira;
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      {/* Visual Header Grid & Elegant Top Info */}
      <div className="bg-gradient-to-b from-white to-[#F8FAFC] border-b border-slate-200/60 pt-32 pb-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0056D2] border border-blue-100/80 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COURSES CATALOG</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Master the AI Landscape
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-medium leading-relaxed">
              Explore professional certified cohorts led by applied experts. Unlock automated pipelines, robust prompt workflows, and elite digital strategies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Verified Curriculums</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>₦Naira Local Pricing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Catalog Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        
        {/* Dynamic Interactive Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4 shadow-xs">
          {/* Live Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search available cohorts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Difficulty Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Level
            </span>
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedDifficulty.toLowerCase() === level.toLowerCase()
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Sorter Selector */}
          <div className="md:ml-auto w-full md:w-auto flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all w-full md:w-auto cursor-pointer"
            >
              <option value="title">Course Title (A-Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dynamic Store View Content Layout */}
        {isLoading ? (
          /* High-Fidelity Skeleton Loaders */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs p-4 flex flex-col justify-between space-y-4 animate-pulse">
                <div className="space-y-3">
                  <div className="aspect-video bg-slate-100 rounded-xl w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-100 rounded w-4/5"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-100 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error Alert Fallback */
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">Operational Failure</h3>
              <p className="text-xs text-rose-600 font-medium leading-relaxed">{error}</p>
            </div>
            <button
              onClick={fetchStorefrontCourses}
              className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reconnect Database
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          /* Empty Catalog Layout */
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 uppercase">No Cohorts Match Search</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Adjust your filter matrix or enter different keywords to locate curriculum modules.
              </p>
            </div>
            <button
              onClick={() => { setSearchTerm(""); setSelectedDifficulty("all"); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border text-slate-700 text-xs font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* POLISHED RESPONSIVE PRODUCTS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const imageSrc = course.thumbnail_url || course.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=450";
              const difficultyVal = course.difficulty || "Beginner";
              const difficultyBadgeClass = 
                difficultyVal.toLowerCase() === "advanced" 
                  ? "bg-rose-50 text-rose-700 border-rose-100" 
                  : difficultyVal.toLowerCase() === "intermediate"
                    ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100";

              return (
                <div 
                  key={course.id}
                  onClick={() => handleViewDetails(course.id)}
                  id={`course-card-${course.id}`}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="p-4 space-y-4 text-left">
                    {/* Aspect Ratio Video Thumbnail */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                      <img 
                        src={imageSrc} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-500" 
                      />
                      {/* Live Indicator overlay badges */}
                      <span className={`absolute top-2.5 left-2.5 text-[8px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded border shadow-xs ${difficultyBadgeClass}`}>
                        {difficultyVal}
                      </span>
                    </div>

                    {/* Typography block */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{course.duration_text || course.duration || "Self-Paced Track"}</span>
                      </div>
                      
                      <h3 className="font-sans font-black text-sm text-[#0B1B3D] leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      
                      {course.tagline && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide line-clamp-1">
                          {course.tagline}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                        {course.overview || course.description || "Learn from Nigerian and global operational frameworks."}
                      </p>
                    </div>
                  </div>

                  {/* Footing pricing & Navigation Action Panel */}
                  <div className="p-4 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Fee Investment</span>
                        <span className="text-sm font-black text-slate-900 leading-none">
                          {formatNaira(course.price_naira)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(course.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-xs group-hover:bg-blue-600"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
