"use client"

import { useState } from "react"
import { useScannedItems } from "../../contexts/scanned-items-context"
import { Button } from "../ui/button"
import { TrashIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import ScannedItemCard from "./scanned-item-card"
import { motion, AnimatePresence } from "framer-motion"

interface ScannedItemsHistoryProps {
  showHeader?: boolean
}

export default function ScannedItemsHistory({ showHeader = true }: ScannedItemsHistoryProps) {
  const { scannedItems, clearScannedItems } = useScannedItems()
  const [isExpanded, setIsExpanded] = useState(true)

  if (scannedItems.length === 0) {
    return (
      <div className="text-center p-8 bg-background border border-border rounded-lg">
        <p className="text-muted-foreground">No scanned food items yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Use the camera icon in the chat to scan food items.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-card rounded-lg border border-border"
    >
      {showHeader && (
        <div
          className="flex justify-between items-center p-4 border-b border-border cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Scanned Food History</h2>
            <motion.span
              key={scannedItems.length}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-2 text-sm text-muted-foreground"
            >
              ({scannedItems.length} items)
            </motion.span>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                clearScannedItems()
              }}
              className="mr-2"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Clear All
            </Button>
            <Button variant="ghost" size="icon">
              {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {(isExpanded || !showHeader) && (
          <motion.div
            initial={showHeader ? { height: 0, opacity: 0 } : undefined}
            animate={showHeader ? { height: "auto", opacity: 1 } : undefined}
            exit={showHeader ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {scannedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <ScannedItemCard item={item} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

