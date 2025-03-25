"use client"

import { useState } from "react"
import { useObjectives } from "@/contexts/objectives-context"

export default function ObjectivesList() {
  const { objectives, deleteObjective } = useObjectives()
  const [objectiveToDelete, setObjectiveToDelete] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setObjectiveToDelete(id)
  }

  const confirmDelete = () => {
    if (objectiveToDelete) {
      deleteObjective(objectiveToDelete)
      setObjectiveToDelete(null)
    }
  }

  const cancelDelete = () => {
    setObjectiveToDelete(null)
  }

  // Don't render anything if there are no objectives
  if (objectives.length === 0) {
    return null
  }

  // This component is now hidden as we're showing the pills in the header
  return null
}

