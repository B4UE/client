"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface Metric {
  name: string
  value: string | number
  unit?: string
}

export interface Objective {
  id: string
  description: string
  metrics: Metric[]
  createdAt: string
}

interface ObjectivesContextType {
  objectives: Objective[]
  addObjective: (objective: Omit<Objective, "id" | "createdAt">) => void
  updateObjective: (id: string, objective: Partial<Objective>) => void
  deleteObjective: (id: string) => void
}

const ObjectivesContext = createContext<ObjectivesContextType | undefined>(undefined)

export function ObjectivesProvider({ children }: { children: ReactNode }) {
  const [objectives, setObjectives] = useState<Objective[]>([])

  useEffect(() => {
    // Load objectives from localStorage on component mount
    const storedObjectives = localStorage.getItem("objectives")
    if (storedObjectives) {
      setObjectives(JSON.parse(storedObjectives))
    }
  }, [])

  useEffect(() => {
    // Save objectives to localStorage whenever they change
    localStorage.setItem("objectives", JSON.stringify(objectives))
  }, [objectives])

  const addObjective = (objective: Omit<Objective, "id" | "createdAt">) => {
    const newObjective: Objective = {
      ...objective,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setObjectives((prev) => [...prev, newObjective])
  }

  const updateObjective = (id: string, objective: Partial<Objective>) => {
    setObjectives((prev) => prev.map((obj) => (obj.id === id ? { ...obj, ...objective } : obj)))
  }

  const deleteObjective = (id: string) => {
    setObjectives((prev) => prev.filter((obj) => obj.id !== id))
  }

  return (
    <ObjectivesContext.Provider value={{ objectives, addObjective, updateObjective, deleteObjective }}>
      {children}
    </ObjectivesContext.Provider>
  )
}

export function useObjectives() {
  const context = useContext(ObjectivesContext)
  if (context === undefined) {
    throw new Error("useObjectives must be used within an ObjectivesProvider")
  }
  return context
}

