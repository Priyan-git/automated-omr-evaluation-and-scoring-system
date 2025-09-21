"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, FileCheck, Loader2, Camera, CameraOff } from "lucide-react"
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
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      setStream(mediaStream)
      setIsCameraOpen(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }, [stream])

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      async (blob) => {
        if (blob) {
          setIsUploading(true)
          await new Promise((resolve) => setTimeout(resolve, 800))

          const file = new File([blob], `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.jpg`, {
            type: "image/jpeg",
          })

          onFileChange(file)
          setIsUploading(false)
          stopCamera()
        }
      },
      "image/jpeg",
      0.9,
    )
  }, [onFileChange, title, stopCamera])

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
        ) : isCameraOpen ? (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={capturePhoto}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs"
              >
                {isUploading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Camera className="w-3 h-3 mr-1" />}
                {isUploading ? "Processing..." : "Capture"}
              </Button>
              <Button onClick={stopCamera} variant="outline" className="px-4 py-2 text-xs bg-transparent">
                <CameraOff className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
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
                <div className="flex gap-1.5 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "bg-transparent h-6 text-xs px-2 transition-all",
                      isDragging && "bg-blue-400/20 border-blue-400",
                    )}
                  >
                    <Upload className="w-2.5 h-2.5 mr-1" />
                    {isDragging ? "Drop" : "Choose"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      startCamera()
                    }}
                    className="bg-transparent h-6 text-xs px-2 transition-all hover:bg-blue-400/20 hover:border-blue-400"
                  >
                    <Camera className="w-2.5 h-2.5 mr-1" />
                    Camera
                  </Button>
                </div>
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
