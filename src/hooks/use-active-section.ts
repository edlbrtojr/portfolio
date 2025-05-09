"use client";

import { useEffect, useState, useRef } from "react";

// Define a type for the section visibility tracking
interface VisibleSection {
  id: string;
  area: number;
}

export function useActiveSection(sections: string[], offset = 100) {
  const [activeSection, setActiveSection] = useState<string | null>(
    sections[0] || null
  );
  // Use a ref to track the last set section to prevent flickering
  const lastActiveSection = useRef<string | null>(sections[0] || null);
  // Debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced setter to prevent rapid changes
  const setActiveSectionWithDebounce = (sectionId: string | null) => {
    // Clear any existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only update if it's different from the last active section
    if (sectionId !== lastActiveSection.current) {
      // Set a small delay to prevent flickering during scroll
      debounceTimer.current = setTimeout(() => {
        lastActiveSection.current = sectionId;
        setActiveSection(sectionId);
      }, 100); // Small debounce delay
    }
  };

  useEffect(() => {
    // Function to check which section is currently in view
    const checkActiveSection = () => {
      // Find all section elements
      const sectionElements = sections
        .map((section) => document.getElementById(section))
        .filter((element) => element !== null) as HTMLElement[];

      if (sectionElements.length === 0) return;

      // Check if we're at the top of the page
      if (window.scrollY < 100 && sections.includes("hero")) {
        setActiveSectionWithDebounce("hero");
        return;
      }

      // Calculate which section has the most visibility in the viewport
      let maxVisibleArea = 0;
      let maxVisibleSectionId: string | null = null;
      const viewportHeight = window.innerHeight;

      sectionElements.forEach((element) => {
        const rect = element.getBoundingClientRect();

        // Calculate how much of the section is visible in the viewport
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibleArea = visibleHeight * rect.width;

        // If this section is more visible than any previous one
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          maxVisibleSectionId = element.id;
        }
      });

      // If we found a section with the most visibility
      if (maxVisibleSectionId) {
        setActiveSectionWithDebounce(maxVisibleSectionId);
      }
    };

    // Check initially
    checkActiveSection();

    // Use throttled scroll event for performance
    let isScrolling = false;
    const handleScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          checkActiveSection();
          isScrolling = false;
        });
        isScrolling = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkActiveSection, { passive: true });

    return () => {
      // Cleanup
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkActiveSection);
    };
  }, [sections, offset]);

  return activeSection;
}
