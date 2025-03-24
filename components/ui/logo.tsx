"use client"

import { motion } from "framer-motion"
import { CheckIcon } from "lucide-react"

interface LogoProps {
  size?: number
  className?: string
  showGlow?: boolean
}

export default function Logo({ size = 24, className = "", showGlow = false }: LogoProps) {
  return (
    <motion.div
      className={`rounded-full bg-primary flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={
        showGlow
          ? {
              boxShadow: [
                "0 0 4px rgba(255, 105, 180, 0.7)",
                "0 0 8px rgba(255, 105, 180, 0.9)",
                "0 0 4px rgba(255, 105, 180, 0.7)",
              ],
            }
          : {}
      }
      transition={
        showGlow
          ? {
              duration: 2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }
          : {}
      }
    >
      <CheckIcon className="text-white" style={{ width: size * 0.6, height: size * 0.6 }} />
    </motion.div>
  )
}

