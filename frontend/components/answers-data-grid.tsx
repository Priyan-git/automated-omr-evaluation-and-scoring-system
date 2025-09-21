"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, XCircle, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnswersDataGridProps {
  hasFiles: boolean
  isProcessing : boolean
}

// Mock data for demonstration
const mockAnswers = Array.from({ length: 50 }, (_, i) => ({
  questionNumber: i + 1,
  studentAnswer: ["A", "B", "C", "D", ""][Math.floor(Math.random() * 5)],
  correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
  isCorrect: Math.random() > 0.2,
  points: Math.random() > 0.2 ? 2 : 0,
  maxPoints: 2,
  topic: ["Algebra", "Geometry", "Calculus", "Statistics"][Math.floor(Math.random() * 4)],
}))

export function AnswersDataGrid({ hasFiles }: AnswersDataGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [editingAnswer, setEditingAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState(mockAnswers)

  if (!hasFiles) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Upload Required Files</h3>
          <p className="text-muted-foreground">Please upload both OMR sheet and answer key to view detailed answers</p>
        </div>
      </div>
    )
  }

  const filteredAnswers = answers.filter((answer) => {
    const matchesSearch =
      answer.questionNumber.toString().includes(searchTerm) ||
      answer.topic.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "correct" && answer.isCorrect) ||
      (filterStatus === "incorrect" && !answer.isCorrect) ||
      (filterStatus === "unanswered" && !answer.studentAnswer)

    return matchesSearch && matchesFilter
  })

  const updateStudentAnswer = (questionNumber: number, newAnswer: string) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionNumber === questionNumber
          ? {
              ...answer,
              studentAnswer: newAnswer === "none" ? "" : newAnswer, // Handle 'none' value properly
              isCorrect: newAnswer !== "none" && newAnswer === answer.correctAnswer,
              points: newAnswer !== "none" && newAnswer === answer.correctAnswer ? answer.maxPoints : 0,
            }
          : answer,
      ),
    )
    setEditingAnswer(null)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Review</CardTitle>
          <CardDescription>Review and edit individual question responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by question number or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Answers</SelectItem>
                  <SelectItem value="correct">Correct</SelectItem>
                  <SelectItem value="incorrect">Incorrect</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Question</th>
                  <th className="text-left p-4 font-medium">Student Answer</th>
                  <th className="text-left p-4 font-medium">Correct Answer</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Points</th>
                  <th className="text-left p-4 font-medium">Topic</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnswers.map((answer) => (
                  <tr key={answer.questionNumber} className="border-b hover:bg-muted/25">
                    <td className="p-4">
                      <div className="font-medium">Q{answer.questionNumber}</div>
                    </td>
                    <td className="p-4">
                      {editingAnswer === answer.questionNumber ? (
                        <Select
                          value={answer.studentAnswer || "none"} // Use 'none' instead of empty string
                          onValueChange={(value) => updateStudentAnswer(answer.questionNumber, value)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                            <SelectItem value="none">None</SelectItem> {/* Changed from empty string to 'none' */}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAnswer(answer.questionNumber)}
                          className="h-8 px-2"
                        >
                          <Badge variant={answer.studentAnswer ? "secondary" : "outline"} className="cursor-pointer">
                            {answer.studentAnswer || "None"}
                          </Badge>
                        </Button>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant="default">{answer.correctAnswer}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {answer.studentAnswer === "" ? (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        ) : answer.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            answer.studentAnswer === ""
                              ? "text-yellow-600"
                              : answer.isCorrect
                                ? "text-green-600"
                                : "text-red-600",
                          )}
                        >
                          {answer.studentAnswer === "" ? "Unanswered" : answer.isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">
                        {answer.points}/{answer.maxPoints}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{answer.topic}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAnswers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No answers match your current filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{answers.filter((a) => a.isCorrect).length}</div>
            <p className="text-sm text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {answers.filter((a) => !a.isCorrect && a.studentAnswer).length}
            </div>
            <p className="text-sm text-muted-foreground">Incorrect</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{answers.filter((a) => !a.studentAnswer).length}</div>
            <p className="text-sm text-muted-foreground">Unanswered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {answers.reduce((sum, a) => sum + a.points, 0)}/{answers.reduce((sum, a) => sum + a.maxPoints, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
