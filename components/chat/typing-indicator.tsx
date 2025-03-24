"use client"

import { motion } from "framer-motion"

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted text-foreground rounded-lg px-4 py-2 max-w-[85%]">
        <div className="flex space-x-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  )
}

