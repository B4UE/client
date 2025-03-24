"use client"

import { useState } from "react"
import { type Objective, useObjectives } from "@/contexts/objectives-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, EditIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import EditObjectiveModal from "./edit-objective-modal"

interface ObjectiveCardProps {
  objective: Objective
}

export default function ObjectiveCard({ objective }: ObjectiveCardProps) {
  const { deleteObjective } = useObjectives()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base font-medium">{objective.description}</CardTitle>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(true)} className="h-8 w-8">
                <EditIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteObjective(objective.id)}
                className="h-8 w-8 text-destructive"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500">Created on {formatDate(objective.createdAt)}</p>
        </CardHeader>
        <CardContent>
          {objective.metrics.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Metrics:</h4>
              <ul className="text-sm space-y-1">
                {objective.metrics.map((metric, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-600">{metric.name}:</span>
                    <span className="font-medium">
                      {metric.value} {metric.unit || ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <EditObjectiveModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} objective={objective} />
    </>
  )
}

