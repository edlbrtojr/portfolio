"use client";

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeachingBubbleProps {
  children: React.ReactNode;
  content: string;
  storageKey: string;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
}

export function TeachingBubble({
  children,
  content,
  storageKey,
  side = "right",
  delay = 1000,
}: TeachingBubbleProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenTip = localStorage.getItem(storageKey);
      if (!hasSeenTip) {
        setShow(true);
        localStorage.setItem(storageKey, "true");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [storageKey, delay]);

  if (!show) return <>{children}</>;

  return (
    <TooltipProvider>
      <Tooltip open={show} onOpenChange={setShow}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          className="bg-blue-500/90 text-white border-none px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
