"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { ImageIcon, UploadIcon } from "lucide-react"
import { motion } from "framer-motion"

interface ImageUploaderProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (base64Image: string) => void
}

export default function ImageUploader({ isOpen, onClose, onUpload }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    if (!previewUrl) return

    setIsLoading(true)
    // Small delay to show loading state
    setTimeout(() => {
      onUpload(previewUrl)
      setIsLoading(false)
      setPreviewUrl(null)
    }, 500)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const resetState = () => {
    setPreviewUrl(null)
    setIsDragging(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetState()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Food Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {!previewUrl ? (
            <motion.div
              className={`border-2 border-dashed ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"} rounded-lg p-12 text-center cursor-pointer transition-colors`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              whileHover={{ scale: 1.01 }}
              animate={{ borderColor: isDragging ? "var(--primary)" : "var(--border)" }}
            >
              <ImageIcon className={`h-12 w-12 mx-auto ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              <p className={`mt-2 text-sm ${isDragging ? "text-primary" : "text-muted-foreground"}`}>
                {isDragging ? "Drop your image here" : "Drag and drop an image here, or click to select a file"}
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </motion.div>
          ) : (
            <div className="space-y-4">
              <motion.div
                className="relative aspect-video rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img src={previewUrl || "/placeholder.svg"} alt="Food preview" className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={resetState}>
                  Change Image
                </Button>
                <Button onClick={handleUpload} disabled={isLoading}>
                  {isLoading ? "Analyzing..." : "Analyze Food"}
                  {!isLoading && <UploadIcon className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

