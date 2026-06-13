/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";

export type ViewType = "home" | "programs" | "paths" | "success" | "resources" | "about" | "pricing";

interface NavigationContextType {
  currentView: ViewType;
  navigateTo: (view: ViewType) => void;
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [isLoginOpen, setLoginOpen] = useState(false);

  // Handle browser back/forward buttons using hash router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as ViewType;
      const validViews: ViewType[] = ["home", "programs", "paths", "success", "resources", "about", "pricing"];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger on mount
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    window.location.hash = view === "home" ? "" : view;
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <NavigationContext.Provider value={{ currentView, navigateTo, isLoginOpen, setLoginOpen }}>
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
