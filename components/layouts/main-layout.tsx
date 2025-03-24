"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import BottomNav from "../ui/bottom-nav"
import { AnimatePresence, motion } from "framer-motion"

interface MainLayoutProps {
  children: ReactNode
  historyTab: ReactNode
}

export default function MainLayout({ children, historyTab }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<"home" | "history">("home")

  return (
    <div className="h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <main className="flex-1 flex flex-col z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              {historyTab}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

