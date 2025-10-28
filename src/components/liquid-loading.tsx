"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

interface LiquidLoadingProps {
  isLoading: boolean;
}

export function LiquidLoading({ isLoading }: LiquidLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showCheck, setShowCheck] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [revealStage, setRevealStage] = useState<'none' | 'prepare' | 'reveal' | 'complete'>('none');
  const isInitialMount = useRef(true);
  const animationRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const maskId = useRef(`mask-${Math.random().toString(36).substring(2, 10)}`);
  
  // Generate particles once and memoize them
  const particles = useRef<Array<{x: number, y: number, size: number, angle: number, speed: number, opacity: number, delay: number}>>(
    Array.from({ length: 12 }, (_, i) => ({
      x: 0,
      y: 0,
      size: Math.random() * 6 + 2,
      angle: (Math.PI * 2 * i) / 12,
      speed: Math.random() * 15 + 10,
      opacity: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 0.2,
    }))
  ).current;
  
  // Cleanup function to cancel any ongoing animations
  const cleanup = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Handle loading state changes with proper cleanup
  useEffect(() => {
    // On initial mount, just wait for isLoading to change
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    cleanup();
    
    if (!isLoading) {
      // When loading completes, animate to 100%
      const smoothComplete = (timestamp: number) => {
        // Store progress in ref to avoid closure issues
        progressRef.current = Math.min(progressRef.current + 2, 100);
        setProgress(progressRef.current);
        
        if (progressRef.current < 100) {
          animationRef.current = requestAnimationFrame(smoothComplete);
        } else {
          // Show check mark and particles
          setShowCheck(true);
          setTimeout(() => {
            setShowParticles(true);
          }, 100);
          
          // Prepare for reveal animation after a delay
          setTimeout(() => {
            setRevealStage('prepare');
            // Give time for the prepare stage to set up
            setTimeout(() => {
              setRevealStage('reveal');
              // Switch to complete state after animation time
              setTimeout(() => {
                setRevealStage('complete');
                // Only hide the loading component after animation completes
                setTimeout(() => {
                  setVisible(false);
                  setRevealStage('none');
                }, 400);
              }, 1800);
            }, 100);
          }, 1000);
        }
      };
      
      animationRef.current = requestAnimationFrame(smoothComplete);
    } else {
      // Reset states for new loading sequence
      setVisible(true);
      setShowCheck(false);
      setShowParticles(false);
      setRevealStage('none');
      progressRef.current = 0;
      setProgress(0);
      
      // Start progress animation
      let startTime = performance.now();
      const animateProgress = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        
        // Smoother, more subtle progression with eased curve
        const newProgress = Math.min(
          elapsed < 300 ? 20 + (elapsed / 300) * 10 :
          elapsed < 1000 ? 30 + (elapsed - 300) / 35 :
          70 + Math.pow((elapsed - 1000) / 1000, 0.8) * 28, 
          98
        );
        
        progressRef.current = newProgress;
        setProgress(Math.floor(newProgress));
        
        if (isLoading && newProgress < 98) {
          animationRef.current = requestAnimationFrame(animateProgress);
        }
      };
      
      animationRef.current = requestAnimationFrame(animateProgress);
    }
    
    return cleanup;
  }, [isLoading]);
  
  // Ensure cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  // Calculate circle properties
  const size = 80;
  const strokeWidth = 3;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence mode="wait">
        {visible && (revealStage !== 'reveal' && revealStage !== 'complete') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-lg"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {/* Circle loader with check mark */}
            <div className="relative w-20 h-20">
              {/* Circular progress */}
              <svg 
                className="w-full h-full transform -rotate-90" 
                viewBox={`0 0 ${size} ${size}`}
              >
                {/* Background circle */}
                <circle 
                  cx={size/2} 
                  cy={size/2} 
                  r={radius} 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.1)" 
                  strokeWidth={strokeWidth} 
                />
                
                {/* Progress circle */}
                <motion.circle 
                  cx={size/2} 
                  cy={size/2} 
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - dash}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ 
                    strokeDashoffset: circumference - dash,
                    opacity: showCheck ? 0 : 1
                  }}
                  transition={{ 
                    strokeDashoffset: { 
                      duration: 0.1, 
                      ease: "linear" 
                    },
                    opacity: { 
                      duration: 0.3 
                    }
                  }}
                />
              </svg>
              
              {/* Checkmark that appears when complete */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={showCheck ? { 
                    scale: revealStage === 'prepare' ? 1.2 : 1, 
                    opacity: 1 
                  } : { 
                    scale: 0, 
                    opacity: 0 
                  }}
                  transition={
                    revealStage === 'prepare'
                      ? { scale: { duration: 0.3, ease: "easeOut" }, opacity: { duration: 0.2 } }
                      : { type: "spring", stiffness: 300, damping: 20 }
                  }
                >
                  <motion.path 
                    d="M5 13L9 17L19 7" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={showCheck ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.2,
                      ease: "easeOut" 
                    }}
                  />
                </motion.svg>
              </div>
              
              {/* Particles */}
              {showParticles && particles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white"
                  initial={{ 
                    x: 0, 
                    y: 0,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    x: Math.cos(particle.angle) * particle.speed,
                    y: Math.sin(particle.angle) * particle.speed,
                    opacity: [0, particle.opacity, 0],
                    scale: particle.size / 2
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: particle.delay,
                    ease: "easeOut" 
                  }}
                  style={{ 
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full screen mask with growing checkmark */}
      {(revealStage === 'reveal' || revealStage === 'complete') && (
        <div 
          className="fixed inset-0 z-[9998] pointer-events-none"
          style={{
            perspective: '1000px',
            perspectiveOrigin: 'center',
          }}
        >
          {/* Overlay with mask */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              background: 'rgba(255, 255, 255, 0.08)',
              opacity: revealStage === 'complete' ? 0 : 1,
              transition: 'opacity 0.4s ease-out',
            }}
          >
            <svg 
              className="absolute inset-0 w-full h-full" 
              style={{
                width: '100vw', 
                height: '100vh',
                mixBlendMode: 'normal',
              }}
            >
              <defs>
                <mask id={maskId.current}>
                  <rect width="100%" height="100%" fill="black" />
                  
                  {/* Dynamically growing checkmark */}
                  <motion.path
                    d="M 50,50 L 60,65 L 80,35"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ 
                      pathLength: 1,
                      scale: 0.5,
                    }}
                    animate={{ 
                      scale: [0.5, 40],
                      pathLength: [1, 1],
                    }}
                    style={{
                      transformOrigin: 'center center',
                      transformBox: 'fill-box',
                      vectorEffect: 'non-scaling-stroke',
                    }}
                    transition={{
                      scale: {
                        duration: 1.8,
                        ease: [0.19, 1, 0.22, 1],
                      },
                    }}
                  />
                </mask>
              </defs>
              
              {/* Inverted mask to reveal content */}
              <rect
                width="100%"
                height="100%"
                fill="rgba(255, 255, 255, 0.1)"
                style={{
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
                mask={`url(#${maskId.current})`}
              />
            </svg>
          </div>
          
          {/* 3D perspective effect - subtle parallax */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            animate={{ 
              translateZ: revealStage === 'reveal' ? ['-10px', '50px'] : '0px',
              scale: revealStage === 'reveal' ? [0.98, 1.01] : 1,
              opacity: revealStage === 'complete' ? 0 : [0.15, 0]
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut",
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
            }}
          />
        </div>
      )}

      {/* Background blur for depth (separate from the mask) */}
      <AnimatePresence>
        {(revealStage === 'reveal' || revealStage === 'complete') && (
          <motion.div 
            className="fixed inset-0 z-[9997] pointer-events-none"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              background: 'rgba(255, 255, 255, 0.03)'
            }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: revealStage === 'complete' ? 0 : 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </>
  );
} 