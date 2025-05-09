"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlitchTextProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function GlitchText({ children, className = "", delay = 0 }: GlitchTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative text-glitch ${className}`}
      data-text={typeof children === "string" ? children : ""}
    >
      {children}
    </motion.div>
  )
}
