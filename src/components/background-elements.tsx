"use client";

import { Circle, Blob } from "@/components/shapes";

export function BackgroundElements() {
  return (
    <div className="relative">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-indigo-100 via-purple-200 to-blue-100 dark:from-indigo-950 dark:via-purple-900 dark:to-blue-950"></div>

      {/* Glass Morphism Card-like Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Large colored blobs */}
        <Circle
          className="absolute -top-[10%] -left-[5%] w-[35vw] h-[35vw]"
          color1="rgba(139, 92, 246, 0.5)"
          color2="rgba(168, 85, 247, 0.3)"
          duration={30}
        />

        <Circle
          className="absolute -bottom-[20%] -right-[10%] w-[45vw] h-[45vw]"
          color1="rgba(236, 72, 153, 0.3)"
          color2="rgba(244, 114, 182, 0.2)"
          duration={35}
        />

        <Circle
          className="absolute top-[5%] right-[10%] w-[25vw] h-[25vw]"
          color1="rgba(99, 102, 241, 0.4)"
          color2="rgba(79, 70, 229, 0.2)"
          duration={25}
        />

        <Circle
          className="absolute bottom-[10%] left-[15%] w-[20vw] h-[20vw]"
          color1="rgba(245, 158, 11, 0.3)"
          color2="rgba(249, 115, 22, 0.2)"
          duration={28}
        />

        {/* Small accent circles */}
        <Circle
          className="absolute top-[30%] right-[35%] w-[8vw] h-[8vw]"
          color1="rgba(16, 185, 129, 0.4)"
          color2="rgba(5, 150, 105, 0.2)"
          duration={20}
        />

        <Circle
          className="absolute top-[15%] left-[30%] w-[5vw] h-[5vw]"
          color1="rgba(239, 68, 68, 0.3)"
          color2="rgba(220, 38, 38, 0.2)"
          duration={18}
        />

        <Circle
          className="absolute bottom-[25%] right-[25%] w-[4vw] h-[4vw]"
          color1="rgba(59, 130, 246, 0.4)"
          color2="rgba(37, 99, 235, 0.2)"
          duration={15}
        />
      </div>
    </div>
  );
}
