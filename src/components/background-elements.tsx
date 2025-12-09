"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Animated blob component
function AuroraBlob({
  className,
  color,
  delay = 0,
  duration = 20,
}: {
  className?: string;
  color: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ background: color }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.4, 0.6, 0.4],
        scale: [1, 1.1, 1],
        x: [0, 30, -20, 0],
        y: [0, -20, 30, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Floating orb with gradient
function FloatingOrb({
  className,
  size = 200,
  colors,
  delay = 0,
}: {
  className?: string;
  size?: number;
  colors: [string, string];
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.2, duration: 1 }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${colors[0]}, ${colors[1]}, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.1, 0.95, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 25 + delay * 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}

// Mesh gradient line
function MeshLine({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent ${className}`}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 0.5, scaleX: 1 }}
      transition={{ delay: delay * 0.3, duration: 1.5, ease: "easeOut" }}
    />
  );
}

// Particle component
function Particle({
  x,
  y,
  delay,
}: {
  x: number;
  y: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-white/30"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        y: [0, -30],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

export function BackgroundElements() {
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; delay: number }>
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Main aurora background */}
      <div className="aurora-background">
        {/* Mesh grid overlay */}
        <div className="aurora-mesh" />
      </div>

      {/* Animated elements layer */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        {/* Large aurora blobs */}
        <AuroraBlob
          className="w-[600px] h-[600px] -top-[10%] -left-[10%]"
          color="radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)"
          duration={25}
        />
        <AuroraBlob
          className="w-[500px] h-[500px] top-[20%] -right-[5%]"
          color="radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)"
          delay={2}
          duration={30}
        />
        <AuroraBlob
          className="w-[450px] h-[450px] -bottom-[10%] left-[20%]"
          color="radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%)"
          delay={4}
          duration={28}
        />
        <AuroraBlob
          className="w-[350px] h-[350px] top-[50%] left-[40%]"
          color="radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)"
          delay={6}
          duration={22}
        />

        {/* Floating orbs */}
        <FloatingOrb
          className="top-[10%] right-[20%]"
          size={150}
          colors={["rgba(139, 92, 246, 0.4)", "rgba(139, 92, 246, 0.1)"]}
          delay={0}
        />
        <FloatingOrb
          className="bottom-[20%] left-[10%]"
          size={120}
          colors={["rgba(34, 211, 238, 0.35)", "rgba(34, 211, 238, 0.1)"]}
          delay={1}
        />
        <FloatingOrb
          className="top-[40%] left-[5%]"
          size={100}
          colors={["rgba(236, 72, 153, 0.3)", "rgba(236, 72, 153, 0.1)"]}
          delay={2}
        />
        <FloatingOrb
          className="bottom-[30%] right-[15%]"
          size={80}
          colors={["rgba(167, 139, 250, 0.35)", "rgba(167, 139, 250, 0.1)"]}
          delay={3}
        />
        <FloatingOrb
          className="top-[60%] right-[30%]"
          size={60}
          colors={["rgba(251, 191, 36, 0.25)", "rgba(251, 191, 36, 0.05)"]}
          delay={4}
        />

        {/* Decorative mesh lines */}
        <MeshLine className="top-[25%] left-0 right-0" delay={0} />
        <MeshLine className="top-[50%] left-0 right-0" delay={1} />
        <MeshLine className="top-[75%] left-0 right-0" delay={2} />

        {/* Floating particles */}
        {particles.map((particle, index) => (
          <Particle
            key={index}
            x={particle.x}
            y={particle.y}
            delay={particle.delay}
          />
        ))}

        {/* Morphing blob accent */}
        <motion.div
          className="absolute top-[15%] right-[10%] w-32 h-32 opacity-20"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(34, 211, 238, 0.5))",
          }}
          animate={{
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 60% 70% 40% / 50% 60% 30% 60%",
              "50% 60% 30% 60% / 30% 60% 70% 40%",
              "60% 40% 30% 70% / 60% 30% 70% 40%",
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary morphing blob */}
        <motion.div
          className="absolute bottom-[20%] left-[15%] w-24 h-24 opacity-15"
          style={{
            background:
              "linear-gradient(135deg, rgba(236, 72, 153, 0.5), rgba(167, 139, 250, 0.5))",
          }}
          animate={{
            borderRadius: [
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "70% 30% 50% 50% / 30% 30% 70% 70%",
              "50% 60% 30% 60% / 50% 40% 70% 50%",
              "40% 60% 70% 30% / 40% 50% 60% 50%",
            ],
            rotate: [360, 180, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Gradient spotlight effect */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.2, 0.35, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--background) / 0.8), transparent)",
          }}
        />
      </div>
    </>
  );
}
