"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

interface ResultAnimationProps {
  result: "good" | "bad"
  onComplete?: () => void
}

export default function ResultAnimation({ result, onComplete }: ResultAnimationProps) {
  // Add a state to track if animation has been shown
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Only run the effect if animation hasn't been shown yet
    if (hasShown) return

    // Mark animation as shown
    setHasShown(true)

    // Add vibration effect to the entire window for bad results
    if (result === "bad" && typeof window !== "undefined") {
      // Add a class to the body for the vibration effect
      document.body.classList.add("vibrate")

      // Remove the class after the animation completes
      setTimeout(() => {
        document.body.classList.remove("vibrate")
      }, 1000)
    }

    // Set timeout for animation completion
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 2000)

    return () => {
      clearTimeout(timer)
      // Ensure vibration class is removed on cleanup
      if (typeof window !== "undefined") {
        document.body.classList.remove("vibrate")
      }
    }
  }, [result, onComplete, hasShown])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        animate={{
          backgroundColor: result === "good" ? "rgba(0, 200, 0, 0.2)" : "rgba(255, 0, 0, 0.4)",
        }}
        exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center h-full w-full">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            {result === "good" ? (
              <motion.div
                initial={{ scale: 0.5, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2,
                }}
                className="bg-green-100 rounded-full p-8"
              >
                <CheckCircle size={80} className="text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.5, rotate: 45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2,
                }}
                className="bg-red-100 rounded-full p-8"
              >
                <XCircle size={80} className="text-red-500" />
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

