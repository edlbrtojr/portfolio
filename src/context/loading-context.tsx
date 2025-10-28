"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LiquidLoading } from "@/components/liquid-loading";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingStateRef = useRef(true);
  const isMountedRef = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  // Always update the ref to match the state for consistent access
  useEffect(() => {
    loadingStateRef.current = isLoading;
  }, [isLoading]);

  // Debounced loading state changes to prevent flickering
  const startLoading = () => {
    // Prevent changes if not mounted yet
    if (!isMountedRef.current) return;

    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    // Only update if needed
    if (!loadingStateRef.current) {
      setIsLoading(true);
    }
  };
  
  const stopLoading = () => {
    // Prevent changes if not mounted yet
    if (!isMountedRef.current) return;

    // Don't set loading to false immediately, add a small delay
    // to prevent flickering when navigating between pages quickly
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      // Only update if needed
      if (loadingStateRef.current) {
        setIsLoading(false);
      }
      loadingTimeoutRef.current = null;
    }, 100);
  };

  // Set mounted flag
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);

  // Handle initial page load - only once
  useEffect(() => {
    // Skip if we've already handled the initial load
    if (!initialLoad) return;
    
    const handleInitialLoad = () => {
      if (document.readyState === "complete") {
        stopLoading();
        // Mark initial load as complete after a delay to ensure smooth transition
        setTimeout(() => setInitialLoad(false), 800);
      } else {
        const onLoad = () => {
          stopLoading();
          // Mark initial load as complete after a delay
          setTimeout(() => setInitialLoad(false), 800);
        };
        
        window.addEventListener("load", onLoad, { once: true });
        return () => window.removeEventListener("load", onLoad);
      }
    };

    // Wait for a short delay to ensure DOM is ready
    const timer = setTimeout(handleInitialLoad, 200);
    
    return () => clearTimeout(timer);
  }, [initialLoad]);

  // Handle page transitions after initial load
  useEffect(() => {
    // Skip for initial page load since it's handled separately
    if (initialLoad) return;

    // Start loading when pathname or searchParams change
    startLoading();
    
    // Add a minimum delay for loading state to ensure animation is visible
    const timer = setTimeout(() => {
      stopLoading();
    }, 600);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParamsString, initialLoad]); // Use string version of searchParams for stability

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {/* Only render the loading component when needed */}
      <LiquidLoading isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
} 