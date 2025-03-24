"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface ScannedItem {
  id: string
  name?: string
  imageUrl?: string
  outcome: "good" | "bad"
  reason: string
  timestamp: string
}

interface ScannedItemsContextType {
  scannedItems: ScannedItem[]
  addScannedItem: (item: Omit<ScannedItem, "id" | "timestamp">) => void
  deleteScannedItem: (id: string) => void
  clearScannedItems: () => void
}

const ScannedItemsContext = createContext<ScannedItemsContextType | undefined>(undefined)

export function ScannedItemsProvider({ children }: { children: ReactNode }) {
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])

  useEffect(() => {
    // Load scanned items from localStorage on component mount
    const storedItems = localStorage.getItem("scannedItems")
    if (storedItems) {
      setScannedItems(JSON.parse(storedItems))
    }
  }, [])

  useEffect(() => {
    // Save scanned items to localStorage whenever they change
    localStorage.setItem("scannedItems", JSON.stringify(scannedItems))
  }, [scannedItems])

  const addScannedItem = (item: Omit<ScannedItem, "id" | "timestamp">) => {
    const newItem: ScannedItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }
    setScannedItems((prev) => [newItem, ...prev])
  }

  const deleteScannedItem = (id: string) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearScannedItems = () => {
    setScannedItems([])
  }

  return (
    <ScannedItemsContext.Provider value={{ scannedItems, addScannedItem, deleteScannedItem, clearScannedItems }}>
      {children}
    </ScannedItemsContext.Provider>
  )
}

export function useScannedItems() {
  const context = useContext(ScannedItemsContext)
  if (context === undefined) {
    throw new Error("useScannedItems must be used within a ScannedItemsProvider")
  }
  return context
}

