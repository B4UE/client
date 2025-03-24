"use client"

import { useState, useEffect } from "react"
import { type Objective, type Metric, useObjectives } from "@/contexts/objectives-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, XIcon } from "lucide-react"

interface EditObjectiveModalProps {
  isOpen: boolean
  onClose: () => void
  objective: Objective
}

export default function EditObjectiveModal({ isOpen, onClose, objective }: EditObjectiveModalProps) {
  const { updateObjective } = useObjectives()
  const [description, setDescription] = useState(objective.description)
  const [metrics, setMetrics] = useState<Metric[]>(objective.metrics)
  const [newMetricName, setNewMetricName] = useState("")
  const [newMetricValue, setNewMetricValue] = useState("")
  const [newMetricUnit, setNewMetricUnit] = useState("")

  useEffect(() => {
    if (isOpen) {
      setDescription(objective.description)
      setMetrics(objective.metrics)
    }
  }, [isOpen, objective])

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

  const handleSubmit = () => {
    if (!description) return

    updateObjective(objective.id, {
      description,
      metrics,
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Health Objective</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="description">Objective Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Metrics</Label>
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
            <Button onClick={handleSubmit} disabled={!description}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

