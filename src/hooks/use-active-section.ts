"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sections: string[], offset = 100) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Remove the # from the id if present
            const sectionId = entry.target.id.replace("#", "");
            setActiveSection(sectionId);
          }
        });
      },
      {
        rootMargin: `-${offset}px 0px -${offset}px 0px`,
        threshold: 0.1,
      }
    );

    // Observe all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      // Cleanup
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sections, offset]);

  return activeSection;
}
