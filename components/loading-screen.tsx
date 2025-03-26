"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "./ui/logo"

// Food emojis for the shower effect
const foodEmojis = [
  "🍎",
  "🍐",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍈",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🥑",
  "🥦",
  "🥬",
  "🥒",
  "🌶️",
  "🫑",
  "🌽",
  "🥕",
  "🧅",
  "🧄",
  "🥔",
  "🍠",
  "🥐",
  "🥯",
  "🍞",
  "🥖",
  "🥨",
  "🧀",
  "🥚",
  "🍳",
  "🧈",
  "🥞",
  "🧇",
  "🥓",
  "🍔",
  "🍟",
  "🍕",
  "🌭",
  "🥪",
  "🌮",
  "🌯",
  "🥙",
  "🧆",
  "🥘",
  "🍲",
  "🥣",
  "🥗",
  "🍿",
  "🧈",
  "🧂",
  "🥫",
  "🍱",
  "🍘",
  "🍙",
  "🍚",
  "🍛",
  "🍜",
  "🍝",
  "🍠",
  "🍢",
  "🍣",
  "🍤",
  "🍥",
  "🥮",
  "🍡",
  "🥟",
  "🥠",
  "🥡",
  "🦪",
  "🍦",
  "🍧",
  "🍨",
  "🍩",
  "🍪",
  "🎂",
  "🍰",
  "🧁",
  "🥧",
  "🍫",
  "🍬",
  "🍭",
  "🍮",
  "🍯",
  "🍼",
  "🥛",
  "☕",
  "🍵",
  "🍶",
  "🍾",
  "🍷",
  "🍸",
  "🍹",
  "🍺",
  "🍻",
  "🥂",
  "🥃",
  "🥤",
  "🧋",
  "🧃",
  "🧉",
  "🧊",
]

interface FallingEmojiProps {
  emoji: string
  delay: number
  duration: number
  x: string
}

const FallingEmoji = ({ emoji, delay, duration, x }: FallingEmojiProps) => {
  return (
    <motion.div
      className="absolute text-2xl sm:text-3xl md:text-4xl pointer-events-none"
      initial={{ y: -20, x, opacity: 0, rotate: 0 }}
      animate={{
        y: ["0vh", "100vh"],
        opacity: [0, 1, 1, 0],
        rotate: Math.random() > 0.5 ? [0, 360] : [0, -360],
      }}
      transition={{
        delay,
        duration,
        ease: "easeIn",
        times: [0, 0.1, 0.9, 1],
      }}
    >
      {emoji}
    </motion.div>
  )
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [showContent, setShowContent] = useState(false)
  const [emojis, setEmojis] = useState<
    Array<{ id: number; emoji: string; delay: number; duration: number; x: number }>
  >([])

  useEffect(() => {
    // Generate random emojis for the shower effect
    const newEmojis = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
      delay: Math.random() * 1, // Random delay between 0-1 seconds (faster start)
      duration: 1 + Math.random() * 1.5, // Random duration between 1-2.5 seconds (faster fall)
      x: Math.random() * 100, // Random horizontal position (0-100%)
    }))

    setEmojis(newEmojis)

    // Show content after a delay
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 1500) // Show content faster

    // Complete loading after animation
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3500) // Complete faster

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Emoji shower */}
        <div className="absolute inset-0 overflow-hidden">
          {emojis.map(({ id, emoji, delay, duration, x }) => (
            <FallingEmoji key={id} emoji={emoji} delay={delay} duration={duration} x={`${x}vw`} />
          ))}
        </div>

        {/* App logo and name */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: showContent ? 1 : 0.8, opacity: showContent ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.8 }}
        >
          <Logo size={80} className="mb-4" />
          <motion.h1
            className="text-4xl font-bold text-primary"
            animate={{
              textShadow: [
                "0 0 4px rgba(255, 105, 180, 0.7)",
                "0 0 8px rgba(255, 105, 180, 0.9)",
                "0 0 4px rgba(255, 105, 180, 0.7)",
              ],
            }}
            transition={{
              duration: 2, // Exactly 2 seconds for the full cycle
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            B4Ueat
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-2 text-center max-w-xs px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
            transition={{ delay: 1.2 }}
          >
            Make better food choices with your personal health assistant
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

