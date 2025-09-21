"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Upload, FileText, BarChart3, Grid3X3, CheckCircle, Clock, Zap, TrendingUp } from "lucide-react"
import { FileUploadArea } from "./file-upload-area"
import { SummaryTab } from "./summary-tab"
import { AnswersDataGrid } from "./answers-data-grid"
import { cn } from "@/lib/utils"

export function ExamDashboard() {
  const [activeTab, setActiveTab] = useState("summary")
  const [omrFile, setOmrFile] = useState<File | null>(null)
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (omrFile && answerKeyFile && !isProcessing) {
      setIsProcessing(true)
      setTimeout(() => setIsProcessing(false), 2000)
    }
  }, [omrFile, answerKeyFile])

  const hasFiles = !!(omrFile && answerKeyFile)
  const processingProgress = isProcessing ? "Processing files..." : hasFiles ? "Ready" : "Waiting for files"

  return (
    <div className={cn("min-h-screen bg-background", mounted && "animate-fade-in")}>
      <div className="flex">
        <div className="w-64 bg-sidebar border-r border-sidebar-border relative">
          <div className="absolute inset-0 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 pointer-events-none" />

          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-6 animate-slide-up">
              <div className="w-6 h-6 bg-sidebar-accent rounded-md flex items-center justify-center hover-lift">
                <BarChart3 className="w-3 h-3 text-sidebar-accent-foreground" />
              </div>
              <h1 className="text-lg font-medium text-sidebar-foreground">Exam Results</h1>
              <div
                className={cn(
                  "ml-auto w-2 h-2 rounded-full transition-colors",
                  hasFiles ? "bg-green-400 animate-pulse-subtle" : "bg-yellow-400",
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <h2 className="text-xs font-medium text-sidebar-foreground/80 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Upload className="w-3 h-3" />
                  Files
                  {isProcessing && <Zap className="w-3 h-3 animate-pulse text-yellow-400" />}
                </h2>
                <div className="space-y-3">
                  <FileUploadArea
                    title="OMR Sheet"
                    description="Scanned answer sheet"
                    icon={<FileText className="w-4 h-4" />}
                    file={omrFile}
                    onFileChange={setOmrFile}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <FileUploadArea
                    title="Answer Key"
                    description="Correct answers"
                    icon={<CheckCircle className="w-4 h-4" />}
                    file={answerKeyFile}
                    onFileChange={setAnswerKeyFile}
                    accept=".pdf,.csv,.txt"
                  />
                </div>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-xs font-medium text-sidebar-foreground/80 mb-3 uppercase tracking-wide">
                  Navigation
                </h2>
                <nav className="space-y-1">
                  <Button
                    variant={activeTab === "summary" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 sidebar-item",
                      activeTab === "summary" && "active",
                    )}
                    onClick={() => setActiveTab("summary")}
                  >
                    <BarChart3 className="w-3 h-3 mr-2" />
                    Summary
                    {hasFiles && <TrendingUp className="w-3 h-3 ml-auto text-green-400" />}
                  </Button>
                  <Button
                    variant={activeTab === "answers" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 sidebar-item",
                      activeTab === "answers" && "active",
                    )}
                    onClick={() => setActiveTab("answers")}
                  >
                    <Grid3X3 className="w-3 h-3 mr-2" />
                    Answers
                    {hasFiles && <div className="w-2 h-2 bg-blue-400 rounded-full ml-auto animate-pulse-subtle" />}
                  </Button>
                </nav>
              </div>

              <div className="pt-3 border-t border-sidebar-border animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    {omrFile ? (
                      <CheckCircle className="w-3 h-3 text-green-400 animate-scale-in" />
                    ) : (
                      <Clock className="w-3 h-3 text-sidebar-foreground/50" />
                    )}
                    <span className="text-sidebar-foreground/80">OMR: {omrFile ? "Ready" : "Pending"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {answerKeyFile ? (
                      <CheckCircle className="w-3 h-3 text-green-400 animate-scale-in" />
                    ) : (
                      <Clock className="w-3 h-3 text-sidebar-foreground/50" />
                    )}
                    <span className="text-sidebar-foreground/80">Key: {answerKeyFile ? "Ready" : "Pending"}</span>
                  </div>

                  <div className="pt-2 border-t border-sidebar-border/50">
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          isProcessing ? "bg-yellow-400 animate-pulse" : hasFiles ? "bg-green-400" : "bg-gray-400",
                        )}
                      />
                      <span className="text-sidebar-foreground/70">{processingProgress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h1 className="text-2xl font-semibold text-foreground mb-1 text-balance">Exam Results Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Review and analyze exam performance with advanced insights
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 animate-fade-in">
              <TabsList className="grid w-full grid-cols-2 max-w-sm h-9 glass-effect">
                <TabsTrigger value="summary" className="flex items-center gap-1.5 text-xs transition-all">
                  <BarChart3 className="w-3 h-3" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="answers" className="flex items-center gap-1.5 text-xs transition-all">
                  <Grid3X3 className="w-3 h-3" />
                  Answers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 animate-slide-up">
                <SummaryTab hasFiles={hasFiles} isProcessing={isProcessing} />
              </TabsContent>

              <TabsContent value="answers" className="space-y-4 animate-slide-up">
                <AnswersDataGrid hasFiles={hasFiles} isProcessing={isProcessing} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
