/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";

export type ViewType = "home" | "programs" | "paths" | "success" | "resources" | "about" | "pricing" | "services" | "contact" | "dashboard" | "course_details" | "landing" | "thankyou";

// Bidirectional mappings for SEO/LMS standard course routing
export const slugToCourseIdMap: Record<string, string> = {
  "ai-prompt-engineering": "course-1",
  "ai-digital-products": "course-2",
  "ai-content-creation": "course-3",
  "app-creation-with-ai": "course-4",
  "ai-automation": "course-5",
  "faceless-youtube": "course-6",
  "client-acquisition": "course-7",
  "ai-affiliate-marketing": "course-8",
  "advertising": "course-9",
  "ai-business-operations": "course-10",
  "social-media": "course-11",
  "ai-ghostwriting": "course-12"
};

export const courseIdToSlugMap: Record<string, string> = {
  "course-1": "ai-prompt-engineering",
  "course-2": "ai-digital-products",
  "course-3": "ai-content-creation",
  "course-4": "app-creation-with-ai",
  "course-5": "ai-automation",
  "course-6": "faceless-youtube",
  "course-7": "client-acquisition",
  "course-8": "ai-affiliate-marketing",
  "course-9": "advertising",
  "course-10": "ai-business-operations",
  "course-11": "social-media",
  "course-12": "ai-ghostwriting"
};

interface NavigationContextType {
  currentView: ViewType;
  navigateTo: (view: ViewType) => void;
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  navigateToCourse: (courseId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // Handle browser back/forward buttons using hash router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      
      if (hash.startsWith("courses/")) {
        const slug = hash.replace("courses/", "");
        const matchedCourseId = slugToCourseIdMap[slug];
        if (matchedCourseId) {
          setCurrentView("programs");
          setActiveCourseId(matchedCourseId);
          return;
        }
      }

      const validViews: ViewType[] = ["home", "programs", "paths", "success", "resources", "about", "pricing", "services", "contact", "dashboard", "landing", "thankyou"];
      if (validViews.includes(hash as ViewType)) {
        setCurrentView(hash as ViewType);
        setActiveCourseId(null);
      } else {
        setCurrentView("home");
        setActiveCourseId(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger on mount
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    setActiveCourseId(null);
    window.location.hash = view === "home" ? "" : view;
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToCourse = (courseId: string) => {
    const slug = courseIdToSlugMap[courseId] || courseId;
    setCurrentView("programs");
    setActiveCourseId(courseId);
    window.location.hash = `courses/${slug}`;
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <NavigationContext.Provider value={{ 
      currentView, 
      navigateTo, 
      isLoginOpen, 
      setLoginOpen, 
      activeCourseId, 
      setActiveCourseId,
      navigateToCourse 
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
