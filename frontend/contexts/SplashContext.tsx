'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SplashContextType {
  showSplash: boolean;
  setSplashShown: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function SplashProvider({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('bizzcrm-splash-shown');
    if (splashShown) {
      setShowSplash(false);
      setHasShownSplash(true);
    }
  }, []);

  const setSplashShown = () => {
    setShowSplash(false);
    setHasShownSplash(true);
    // Mark splash as shown for this session
    sessionStorage.setItem('bizzcrm-splash-shown', 'true');
  };

  return (
    <SplashContext.Provider value={{ showSplash: showSplash && !hasShownSplash, setSplashShown }}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
}