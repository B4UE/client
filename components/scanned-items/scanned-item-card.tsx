"use client"

import { useState } from "react"
import { type ScannedItem, useScannedItems } from "../../contexts/scanned-items-context"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { TrashIcon, CheckIcon, XIcon, InfoIcon } from "lucide-react"
import { formatDate } from "../../lib/utils"
import { motion } from "framer-motion"

interface ScannedItemCardProps {
  item: ScannedItem
}

export default function ScannedItemCard({ item }: ScannedItemCardProps) {
  const { deleteScannedItem } = useScannedItems()
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      layout
    >
      <Card
        className="overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="relative aspect-square">
          {item.imageUrl ? (
            <div className="relative w-full h-full">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.name || "Scanned food item"}
                className="w-full h-full object-cover"
              />
              <motion.div
                className={`absolute inset-0 ${item.outcome === "good" ? "bg-green-500" : "bg-red-500"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.2 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <motion.div
            className={`absolute top-2 right-2 rounded-full p-1 ${
              item.outcome === "good" ? "bg-green-500" : "bg-red-500"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.1 }}
          >
            {item.outcome === "good" ? (
              <CheckIcon className="h-4 w-4 text-white" />
            ) : (
              <XIcon className="h-4 w-4 text-white" />
            )}
          </motion.div>
        </div>
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-sm truncate">{item.name || "Food Item"}</h3>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDetails(!showDetails)
                }}
                className="h-6 w-6 -mr-1 -mt-1"
              >
                <InfoIcon className="h-3 w-3" />
                <span className="sr-only">Details</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteScannedItem(item.id)
                }}
                className="h-6 w-6 -mr-1 -mt-1"
              >
                <TrashIcon className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">{formatDate(item.timestamp)}</p>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: showDetails ? "auto" : 0,
              opacity: showDetails ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-xs mt-2">{item.reason}</p>
          </motion.div>
          {!showDetails && <p className="text-xs line-clamp-1">{item.reason}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}

