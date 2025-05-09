"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type ShapeProps = {
  className?: string;
  delay?: number;
  duration?: number;
};

// Helper function to generate random blob paths
const generateBlobPath = () => {
  // Create a path for a random blob shape
  const numPoints = 6;
  const angleStep = (2 * Math.PI) / numPoints;
  const radius = 50;
  const variability = 25;

  let path = "M";

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;
    const randomRadius = radius + (Math.random() - 0.5) * 2 * variability;
    const x = Math.cos(angle) * randomRadius;
    const y = Math.sin(angle) * randomRadius;

    if (i === 0) {
      path += `${x},${y}`;
    } else {
      const cp1x = Math.cos(angle - angleStep / 3) * randomRadius * 1.2;
      const cp1y = Math.sin(angle - angleStep / 3) * randomRadius * 1.2;
      const cp2x = Math.cos(angle - angleStep / 6) * randomRadius * 1.1;
      const cp2y = Math.sin(angle - angleStep / 6) * randomRadius * 1.1;
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
    }
  }

  path += "Z";
  return path;
};

// Gradient SVG Blob
export function Blob({
  className = "",
  delay = 0,
  duration = 10,
  color1 = "rgba(147, 197, 253, 0.5)",
  color2 = "rgba(196, 181, 253, 0.5)",
}: ShapeProps & { color1?: string; color2?: string }) {
  // Use a stable ID system
  const [id, setId] = useState("");
  const [paths, setPaths] = useState<string[]>([]);
  const [randomPath, setRandomPath] = useState("");

  // Generate stable ID on client side only
  useEffect(() => {
    // Create a deterministic ID based on props for stability
    const stableId = `blob-${color1.replace(
      /[^a-z0-9]/gi,
      ""
    )}-${color2.replace(/[^a-z0-9]/gi, "")}-${duration}`;
    setId(stableId);

    // Generate random blob paths
    const newPaths = Array.from({ length: 8 }).map(() => generateBlobPath());
    setPaths(newPaths);
    setRandomPath(newPaths[0]);
  }, [color1, color2, duration]);

  return (
    <motion.div
      className={`w-full h-full blob-3d ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
    >
      <svg
        viewBox="-100 -100 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {id && (
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1}>
                <animate
                  attributeName="stop-color"
                  values={`${color1};${color2};${color1}`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor={color2}>
                <animate
                  attributeName="stop-color"
                  values={`${color2};${color1};${color2}`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <filter id={`blur-${id}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            <filter id={`shadow-${id}`}>
              <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="5"
                floodColor="rgba(0,0,0,0.3)"
              />
            </filter>
          </defs>
        )}

        {id && randomPath && (
          <motion.path
            d={randomPath}
            fill={`url(#${id})`}
            filter={`url(#shadow-${id})`}
            animate={{
              d: paths.map((p) => p),
              rotateZ: [0, 10, -10, 0],
              scale: [1, 1.05, 0.95, 1],
              filter: ["blur(0px)", "blur(0.5px)", "blur(0px)"],
            }}
            transition={{
              d: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * (Math.random() * 0.5 + 0.75),
                ease: "easeInOut",
                delay,
              },
              rotateZ: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.6,
                ease: "easeInOut",
                delay: delay + 1,
              },
              scale: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.4,
                ease: "easeInOut",
                delay,
              },
              filter: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.3,
                ease: "easeInOut",
                delay: delay + 0.2,
              },
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}

// 3D Gradient Circle - updated to match the reference image
export function Circle({
  className = "",
  delay = 0,
  duration = 10,
  color1 = "rgba(56, 189, 248, 0.4)",
  color2 = "rgba(129, 140, 248, 0.4)",
}: ShapeProps & { color1?: string; color2?: string }) {
  // Use useId instead of random ID generation to prevent hydration mismatches
  const [id, setId] = useState("");

  // Generate a stable ID on client side only
  useEffect(() => {
    // Create a deterministic ID based on props for stability
    const stableId = `circle-${color1.replace(
      /[^a-z0-9]/gi,
      ""
    )}-${color2.replace(/[^a-z0-9]/gi, "")}-${duration}`;
    setId(stableId);
  }, [color1, color2, duration]);

  return (
    <motion.div
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {id && (
            <radialGradient id={id} cx="50%" cy="50%" r="70%" fx="25%" fy="25%">
              <stop offset="0%" stopColor={color1}>
                <animate
                  attributeName="stop-color"
                  values={`${color1};${color2};${color1}`}
                  dur={`${duration * 1.5}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor={color2}>
                <animate
                  attributeName="stop-color"
                  values={`${color2};${color1};${color2}`}
                  dur={`${duration * 1.5}s`}
                  repeatCount="indefinite"
                />
              </stop>
            </radialGradient>
          )}
        </defs>

        {id && (
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill={`url(#${id})`}
            animate={{
              r: [90, 88, 92, 90],
              opacity: [0.85, 0.95, 0.8, 0.85],
            }}
            transition={{
              r: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.3,
                ease: "easeInOut",
                delay,
              },
              opacity: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.5,
                ease: "easeInOut",
                delay: delay + 0.3,
              },
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}

// 3D Gradient Square
export function Square({
  className = "",
  delay = 0,
  duration = 15,
  color1 = "rgba(244, 114, 182, 0.4)",
  color2 = "rgba(168, 85, 247, 0.4)",
}: ShapeProps & { color1?: string; color2?: string }) {
  // Use a stable ID system
  const [id, setId] = useState("");

  // Generate stable ID on client side only
  useEffect(() => {
    // Create a deterministic ID based on props for stability
    const stableId = `square-${color1.replace(
      /[^a-z0-9]/gi,
      ""
    )}-${color2.replace(/[^a-z0-9]/gi, "")}-${duration}`;
    setId(stableId);
  }, [color1, color2, duration]);

  return (
    <motion.div
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      style={{
        filter: "drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.15))",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {id && (
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1}>
                <animate
                  attributeName="stop-color"
                  values={`${color1};${color2};${color1}`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor={color2}>
                <animate
                  attributeName="stop-color"
                  values={`${color2};${color1};${color2}`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
        )}

        {id && (
          <motion.rect
            x="15"
            y="15"
            width="70"
            height="70"
            rx="10"
            ry="10"
            fill={`url(#${id})`}
            animate={{
              rotateZ: [0, 10, -10, 0],
              width: [70, 72, 68, 70],
              height: [70, 68, 72, 70],
              rx: [10, 15, 5, 10],
              ry: [10, 5, 15, 10],
            }}
            transition={{
              rotateZ: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.8,
                ease: "easeInOut",
                delay,
              },
              width: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.5,
                ease: "easeInOut",
                delay: delay + 0.3,
              },
              height: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.6,
                ease: "easeInOut",
                delay: delay + 0.6,
              },
              rx: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.7,
                ease: "easeInOut",
                delay: delay + 0.9,
              },
              ry: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.7,
                ease: "easeInOut",
                delay: delay + 1.2,
              },
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}

// 3D Gradient Triangle
export function Triangle({
  className = "",
  delay = 0,
  duration = 15,
  color1 = "rgba(250, 204, 21, 0.4)",
  color2 = "rgba(234, 88, 12, 0.4)",
}: ShapeProps & { color1?: string; color2?: string }) {
  const [id] = useState(`triangle-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <motion.div
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      style={{
        filter: "drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.15))",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1}>
              <animate
                attributeName="stop-color"
                values={`${color1};${color2};${color1}`}
                dur={`${duration}s`}
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor={color2}>
              <animate
                attributeName="stop-color"
                values={`${color2};${color1};${color2}`}
                dur={`${duration}s`}
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        <motion.polygon
          points="50,15 85,85 15,85"
          fill={`url(#${id})`}
          animate={{
            points: [
              "50,15 85,85 15,85",
              "45,20 80,80 20,80",
              "55,10 90,90 10,90",
              "50,15 85,85 15,85",
            ],
            rotateZ: [0, 5, -5, 0],
          }}
          transition={{
            points: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: duration * 0.6,
              ease: "easeInOut",
              delay,
            },
            rotateZ: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: duration * 0.7,
              ease: "easeInOut",
              delay: delay + 0.5,
            },
          }}
        />
      </svg>
    </motion.div>
  );
}

// 3D Gradient Donut
export function Donut({
  className = "",
  delay = 0,
  duration = 10,
  color1 = "rgba(6, 182, 212, 0.4)",
  color2 = "rgba(52, 211, 153, 0.4)",
}: ShapeProps & { color1?: string; color2?: string }) {
  // Use a stable ID system
  const [id, setId] = useState("");

  // Generate stable ID on client side only
  useEffect(() => {
    // Create a deterministic ID based on props for stability
    const stableId = `donut-${color1.replace(
      /[^a-z0-9]/gi,
      ""
    )}-${color2.replace(/[^a-z0-9]/gi, "")}-${duration}`;
    setId(stableId);
  }, [color1, color2, duration]);

  return (
    <motion.div
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      style={{
        filter: "drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.15))",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {id && (
          <defs>
            <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="70%" fy="30%">
              <stop offset="0%" stopColor={color1}>
                <animate
                  attributeName="stop-color"
                  values={`${color1};${color2};${color1}`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor={color2}>
                <animate
                  attributeName="stop-color"
                  values={`${color2};${color1};${color2}`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="offset"
                  values="100%;80%;100%"
                  dur={`${duration * 0.8}s`}
                  repeatCount="indefinite"
                />
              </stop>
            </radialGradient>
          </defs>
        )}

        {id && (
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth="15"
            animate={{
              r: [45, 40, 48, 45],
              strokeWidth: [15, 17, 13, 15],
              rotateZ: [0, 20, -20, 0],
            }}
            transition={{
              r: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.7,
                ease: "easeInOut",
                delay,
              },
              strokeWidth: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.5,
                ease: "easeInOut",
                delay: delay + 0.3,
              },
              rotateZ: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.9,
                ease: "easeInOut",
                delay: delay + 0.6,
              },
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}

// 3D Gradient Star
export function Star({
  className = "",
  delay = 0,
  duration = 15,
  points = 5,
  color1 = "rgba(232, 121, 249, 0.4)",
  color2 = "rgba(99, 102, 241, 0.4)",
}: ShapeProps & { points?: number; color1?: string; color2?: string }) {
  // Use a stable ID system
  const [id, setId] = useState("");
  const [starPoints, setStarPoints] = useState("");

  // Generate stable ID and star points on client side only
  useEffect(() => {
    // Create a deterministic ID based on props for stability
    const stableId = `star-${color1.replace(
      /[^a-z0-9]/gi,
      ""
    )}-${color2.replace(/[^a-z0-9]/gi, "")}-${points}-${duration}`;
    setId(stableId);

    // Generate star points
    const center = 50;
    const outerRadius = 40;
    const innerRadius = outerRadius / 2;
    const angle = Math.PI / points;

    let pointsStr = "";
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = center + radius * Math.cos(i * angle);
      const y = center + radius * Math.sin(i * angle);
      pointsStr += `${x},${y} `;
    }

    setStarPoints(pointsStr.trim());
  }, [color1, color2, points, duration]);

  return (
    <motion.div
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      style={{
        filter: "drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.15))",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {id && (
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1}>
                <animate
                  attributeName="stop-color"
                  values={`${color1};${color2};${color1}`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor={color2}>
                <animate
                  attributeName="stop-color"
                  values={`${color2};${color1};${color2}`}
                  dur={`${duration}s`}
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
        )}

        {id && starPoints && (
          <motion.polygon
            points={starPoints}
            fill={`url(#${id})`}
            animate={{
              scale: [1, 1.05, 0.95, 1],
              rotateZ: [0, 15, -15, 0],
            }}
            transition={{
              scale: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.6,
                ease: "easeInOut",
                delay,
              },
              rotateZ: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: duration * 0.8,
                ease: "easeInOut",
                delay: delay + 0.5,
              },
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}
