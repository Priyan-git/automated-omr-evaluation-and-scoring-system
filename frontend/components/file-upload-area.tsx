"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, FileCheck, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadAreaProps {
  title: string
  description: string
  icon: React.ReactNode
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
  className?: string
}

export function FileUploadArea({
  title,
  description,
  icon,
  file,
  onFileChange,
  accept = "*",
  className,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        setIsUploading(true)
        await new Promise((resolve) => setTimeout(resolve, 800))
        onFileChange(droppedFile)
        setIsUploading(false)
      }
    },
    [onFileChange],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        setIsUploading(true)
        await new Promise((resolve) => setTimeout(resolve, 800))
        onFileChange(selectedFile)
        setIsUploading(false)
      }
    },
    [onFileChange],
  )

  const removeFile = useCallback(() => {
    onFileChange(null)
  }, [onFileChange])

  return (
    <Card className={cn("bg-sidebar-accent border-sidebar-border hover-lift", className)}>
      <CardContent className="p-3">
        {file ? (
          <div className="flex items-center justify-between animate-scale-in">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-xs font-medium text-sidebar-accent-foreground">{file.name}</p>
                <p className="text-xs text-sidebar-foreground/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-sidebar-accent-foreground hover:bg-sidebar-border h-6 w-6 p-0 hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "border border-dashed border-sidebar-border rounded-md p-3 text-center cursor-pointer transition-all duration-200",
              isDragging && "border-blue-400 bg-blue-400/10 scale-105",
              !isDragging && "hover:border-sidebar-foreground/30 hover:bg-sidebar-accent/50",
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && document.getElementById(`file-input-${title}`)?.click()}
          >
            <div className="flex flex-col items-center gap-1.5">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : (
                <div className={cn("transition-transform", isDragging && "scale-110")}>{icon}</div>
              )}
              <div>
                <p className="text-xs font-medium text-sidebar-accent-foreground">
                  {isUploading ? "Uploading..." : title}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {isUploading ? "Please wait" : isDragging ? "Drop file here" : description}
                </p>
              </div>
              {!isUploading && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "mt-1 bg-transparent h-6 text-xs px-2 transition-all",
                    isDragging && "bg-blue-400/20 border-blue-400",
                  )}
                >
                  <Upload className="w-2.5 h-2.5 mr-1" />
                  {isDragging ? "Drop" : "Choose"}
                </Button>
              )}
            </div>
            <input
              id={`file-input-${title}`}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
