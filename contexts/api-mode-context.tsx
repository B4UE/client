"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ApiMode = "mock" | "live"

interface ApiModeContextType {
  apiMode: ApiMode
  setApiMode: (mode: ApiMode) => void
  isLive: boolean
  toggleApiMode: () => void
}

const ApiModeContext = createContext<ApiModeContextType | undefined>(undefined)

export function ApiModeProvider({ children }: { children: ReactNode }) {
  const [apiMode, setApiMode] = useState<ApiMode>("mock")

  // Load API mode from localStorage on component mount
  useEffect(() => {
    const storedMode = localStorage.getItem("apiMode")
    if (storedMode === "live" || storedMode === "mock") {
      setApiMode(storedMode)
    }
  }, [])

  // Save API mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("apiMode", apiMode)
  }, [apiMode])

  const isLive = apiMode === "live"

  const toggleApiMode = () => {
    setApiMode((prev) => (prev === "mock" ? "live" : "mock"))
  }

  return (
    <ApiModeContext.Provider value={{ apiMode, setApiMode, isLive, toggleApiMode }}>{children}</ApiModeContext.Provider>
  )
}

export function useApiMode() {
  const context = useContext(ApiModeContext)
  if (context === undefined) {
    throw new Error("useApiMode must be used within an ApiModeProvider")
  }
  return context
}

