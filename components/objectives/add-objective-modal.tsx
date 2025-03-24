"use client"

import { useState } from "react"
import { useObjectives, type Metric } from "@/contexts/objectives-context"
import { useChat } from "@/contexts/chat-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, XIcon } from "lucide-react"
import { defineObjective } from "@/services/api"
import { useApiMode } from "@/contexts/api-mode-context"

interface AddObjectiveModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddObjectiveModal({ isOpen, onClose }: AddObjectiveModalProps) {
  const { addObjective } = useObjectives()
  const { addMessage } = useChat()
  const { isLive } = useApiMode()
  const [description, setDescription] = useState("")
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [newMetricName, setNewMetricName] = useState("")
  const [newMetricValue, setNewMetricValue] = useState("")
  const [newMetricUnit, setNewMetricUnit] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMetric = () => {
    if (newMetricName && newMetricValue) {
      setMetrics([
        ...metrics,
        {
          name: newMetricName,
          value: newMetricValue,
          unit: newMetricUnit || undefined,
        },
      ])
      setNewMetricName("")
      setNewMetricValue("")
      setNewMetricUnit("")
    }
  }

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!description) return

    setIsLoading(true)

    try {
      // Convert metrics to object format for API
      const metricsObject = metrics.reduce(
        (acc, metric) => {
          acc[metric.name] = {
            value: metric.value,
            unit: metric.unit,
          }
          return acc
        },
        {} as Record<string, any>,
      )

      // Call API to refine objective
      const response = await defineObjective(
        {
          objective: description,
          metrics: metricsObject,
        },
        isLive,
      )

      // Add the refined objective
      addObjective({
        description: response.refinedObjective,
        metrics: Object.entries(response.refinedMetrics).map(([name, details]) => ({
          name,
          value: (details as any).value,
          unit: (details as any).unit,
        })),
      })

      // Add messages to chat for context
      addMessage("user", `I want to set a new objective: ${description}`)
      addMessage(
        "assistant",
        `I've refined your objective to: "${response.refinedObjective}". I've added this to your objectives list.`,
      )

      onClose()
    } catch (error) {
      console.error("Error defining objective:", error)

      // Fallback to client-side only if API fails
      addObjective({
        description,
        metrics,
      })

      addMessage("user", `I want to set a new objective: ${description}`)
      addMessage("assistant", `I've added your objective: "${description}" to your objectives list.`)

      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setDescription("")
    setMetrics([])
    setNewMetricName("")
    setNewMetricValue("")
    setNewMetricUnit("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Health Objective</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="description">Objective Description</Label>
            <Textarea
              id="description"
              placeholder="E.g., Lose 10 lbs in 3 months, Manage blood sugar levels, Avoid gluten..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Metrics (Optional)</Label>
            {metrics.length > 0 && (
              <div className="space-y-2 mb-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <span className="font-medium">{metric.name}:</span>{" "}
                      <span>
                        {metric.value} {metric.unit || ""}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMetric(index)}
                      className="h-6 w-6 text-gray-500"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <Input
                  placeholder="Name (e.g., Weight)"
                  value={newMetricName}
                  onChange={(e) => setNewMetricName(e.target.value)}
                />
              </div>
              <div className="col-span-4">
                <Input
                  placeholder="Value (e.g., 180)"
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input placeholder="Unit" value={newMetricUnit} onChange={(e) => setNewMetricUnit(e.target.value)} />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddMetric}
                  disabled={!newMetricName || !newMetricValue}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!description || isLoading}>
              {isLoading ? "Adding..." : "Add Objective"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

