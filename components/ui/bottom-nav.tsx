"use client"

import { motion } from "framer-motion"
import { HomeIcon, HistoryIcon, SunIcon, MoonIcon } from "lucide-react"
import { useTheme } from "next-themes"
import Logo from "./logo"

interface BottomNavProps {
  activeTab: "home" | "history"
  onTabChange: (tab: "home" | "history") => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="bg-background border-t border-border z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Logo size={32} className="mr-2" />
          <motion.div
            className="text-primary font-bold text-sm"
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
          </motion.div>
        </div>

        <div className="flex-1 flex justify-center items-center space-x-12">
          <button
            onClick={() => onTabChange("home")}
            className={`flex flex-col items-center p-2 rounded-md transition-colors ${
              activeTab === "home" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
            {activeTab === "home" && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute bottom-0 h-1 w-12 bg-primary rounded-t-md"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => onTabChange("history")}
            className={`flex flex-col items-center p-2 rounded-md transition-colors ${
              activeTab === "history" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <HistoryIcon className="h-6 w-6" />
            <span className="text-xs mt-1">History</span>
            {activeTab === "history" && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute bottom-0 h-1 w-12 bg-primary rounded-t-md"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-secondary"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

