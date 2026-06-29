/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";

export type ViewType = "home" | "programs" | "paths" | "success" | "resources" | "about" | "pricing" | "services" | "contact" | "dashboard" | "course_details" | "landing" | "thankyou" | "checkout" | "admin";

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
  const [activeCourseId, setActiveCourseId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("activeCourseId");
      if (stored) return stored;
    } catch {}
    return null;
  });

  const handleSetActiveCourseId = (id: string | null) => {
    setActiveCourseId(id);
    try {
      if (id) {
        localStorage.setItem("activeCourseId", id);
      } else {
        localStorage.removeItem("activeCourseId");
      }
    } catch {}
  };

  // Handle browser back/forward buttons using hash router
  useEffect(() => {
    const handleHashChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash.replace("#", "");
      
      // Support clean pathname direct entry for requested admin endpoints
      const checkPath = pathname.toLowerCase();
      if (
        checkPath === "/admin-dashboard" || 
        checkPath === "/admin-login" || 
        checkPath === "/addmin-login" ||
        checkPath.startsWith("/admin-dashboard") ||
        checkPath.startsWith("/admin-login") ||
        checkPath.startsWith("/addmin-login")
      ) {
        setCurrentView("admin");
        handleSetActiveCourseId(null);
        return;
      }

      if (hash.startsWith("courses/")) {
        const slug = hash.replace("courses/", "");
        const matchedCourseId = slugToCourseIdMap[slug];
        if (matchedCourseId) {
          setCurrentView("course_details");
          handleSetActiveCourseId(matchedCourseId);
          return;
        }
      }

      const validViews: ViewType[] = ["home", "programs", "paths", "success", "resources", "about", "pricing", "services", "contact", "dashboard", "landing", "thankyou", "checkout", "admin"];
      const checkHash = hash.toLowerCase();
      if (
        checkHash === "admin-dashboard" || 
        checkHash === "admin-login" || 
        checkHash === "addmin-login" || 
        checkHash === "admin"
      ) {
        setCurrentView("admin");
        handleSetActiveCourseId(null);
      } else if (hash === "course_details") {
        setCurrentView("course_details");
      } else if (validViews.includes(hash as ViewType)) {
        setCurrentView(hash as ViewType);
        if (hash !== "checkout") {
          handleSetActiveCourseId(null);
        }
      } else {
        setCurrentView("home");
        handleSetActiveCourseId(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Listen for history popstate events too to react on pathname changes
    window.addEventListener("popstate", handleHashChange);
    // Trigger on mount
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    if (view !== "course_details" && view !== "checkout") {
      handleSetActiveCourseId(null);
    }
    if (view === "admin") {
      window.history.pushState({}, "", "/admin-dashboard");
    } else {
      if (window.location.pathname === "/admin-dashboard") {
        window.history.pushState({}, "", "/" + (view === "home" ? "" : `#${view}`));
      } else {
        window.location.hash = view === "home" ? "" : view;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToCourse = (courseId: string) => {
    const slug = courseIdToSlugMap[courseId] || courseId;
    setCurrentView("course_details");
    handleSetActiveCourseId(courseId);
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
      setActiveCourseId: handleSetActiveCourseId,
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
